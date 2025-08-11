import { useState } from "react";
import {
  Send,
  Bot,
  User,
  BookOpen,
  Volume2,
  MessageSquare,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export const ChatSection = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "¡Hola! Soy tu asistente virtual para aprender inglés A2. ¿En qué te puedo ayudar hoy? Puedes preguntarme sobre vocabulario, gramática, o simplemente practicar conversación. 😊",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const quickSuggestions = [
    { icon: BookOpen, text: "Practicar vocabulario", action: "vocabulary" },
    { icon: MessageSquare, text: "Revisar gramática", action: "grammar" },
    { icon: Volume2, text: "Practicar pronunciación", action: "pronunciation" },
    { icon: HelpCircle, text: "Hacer una pregunta", action: "question" },
  ];

  const speak = (text: string, lang: string = "en-US") => {
    const synth = window.speechSynthesis;
    const speakNow = () => {
      const voices = synth.getVoices();
      const preferredVoices = voices.filter(v =>
        v.name.includes("Microsoft Emma") ||
        v.name.includes("Google US English") ||
        v.name.includes("Microsoft Zira") ||
        v.name.toLowerCase().includes("female")
      );
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = preferredVoices[0] || voices.find(v => v.lang === lang) || null;
      utterance.lang = lang;
      utterance.rate = 0.95;
      utterance.pitch = 1.1;
      synth.speak(utterance);
    };
    if (synth.getVoices().length === 0) {
      synth.addEventListener("voiceschanged", speakNow);
    } else {
      speakNow();
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");
    const botReply = await generateBotResponse(inputMessage);
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: botReply,
      sender: "bot",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botMessage]);
    speak(botReply);
  };

  const handleQuickSuggestion = (action: string) => {
    const suggestions = {
      vocabulary: "Quiero practicar vocabulario básico",
      grammar: "Ayúdame con gramática básica",
      pronunciation: "Quiero practicar pronunciación",
      question: "Tengo una pregunta sobre inglés",
    };
    setInputMessage(suggestions[action as keyof typeof suggestions] || "");
  };

  const generateBotResponse = async (userMessage: string): Promise<string> => {
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: "Actúa como un tutor de inglés nivel A2 amigable y las respuestas tienen que ser más cortas, Las respuestas solo en inglés" }],
          },
        ],
      });
      const result = await chat.sendMessage(userMessage);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error("❌ Error con Gemini:", error);
      return "Lo siento, hubo un error al responder. Por favor, intenta de nuevo.";
    }
  };

  type RecognitionResultEvent = Event & {
    results: {
      [index: number]: {
        [index: number]: {
          transcript: string;
        };
      };
    };
  };

  type RecognitionErrorEvent = Event & {
    error: string;
  };

  type CustomSpeechRecognition = {
    lang: string;
    interimResults: boolean;
    maxAlternatives: number;
    onresult: ((event: RecognitionResultEvent) => void) | null;
    onerror: ((event: RecognitionErrorEvent) => void) | null;
    start: () => void;
  };

  type CustomWindow = typeof window & {
    SpeechRecognition: { new (): CustomSpeechRecognition };
    webkitSpeechRecognition: { new (): CustomSpeechRecognition };
  };

  const handlePronunciationEvaluation = () => {
    const lastBotMessage = messages.slice().reverse().find((m) => m.sender === "bot")?.content;
    const expectedText = lastBotMessage || "How are you today?";

    const customWindow = window as CustomWindow;
    const recognition = new (
      customWindow.SpeechRecognition || customWindow.webkitSpeechRecognition
    )();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = async (event) => {
      const spokenText = event.results[0][0].transcript;
      const score = calculateScore(expectedText, spokenText);
      const feedback = await getGeminiFeedback(expectedText, spokenText, score);

      const feedbackMessage: Message = {
        id: Date.now().toString(),
        content: feedback,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, feedbackMessage]);
    };

    recognition.onerror = (event) => {
      if (event.error === "aborted") {
        console.warn("Reconocimiento abortado. Reintentando...");
        recognition.start();
      } else {
        const errorMessage: Message = {
          id: Date.now().toString(),
          content: "❌ Error al reconocer el audio: " + event.error,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    };

    recognition.start();
  };

  const calculateScore = (expected: string, spoken: string): number => {
    const expectedWords = expected.toLowerCase().split(" ");
    const spokenWords = spoken.toLowerCase().split(" ");
    const matched = expectedWords.filter((word, i) => word === spokenWords[i]);
    return Math.round((matched.length / expectedWords.length) * 100);
  };

  const getGeminiFeedback = async (expected: string, spoken: string, score: number): Promise<string> => {
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `
Eres un profesor de inglés especializado en pronunciación. Evalúa la pronunciación de lo que el estudiante **sí dijo**, sin penalizar por partes omitidas del texto original.

Palabra o frase esperada: "${expected}"
Palabra o frase pronunciada: "${spoken}"

1. Compara solo las palabras pronunciadas (no castigues por lo que no se dijo).
2. Evalúa si las palabras dichas suenan correctamente en inglés.
3. Da una retroalimentación breve en español (máx. 2 líneas).
4. Asigna una puntuación del 0 al 100 basada en la pronunciación de lo pronunciado, no en lo faltante.


Solo devuelve texto en español. Sé amable y directo. No incluyas sugerencias adicionales como "usa YouTube".
`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error("Error con Gemini:", error);
      return "❌ Error al generar el feedback con IA.";
    }
  };

  return (
    <section id="chat" className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Chat con tu Asistente Virtual
          </h2>
          <p className="text-xl text-muted-foreground">
            Conversa en tiempo real y recibe ayuda personalizada
          </p>
        </div>

        <Card className="p-6 shadow-card">
          <div className="h-96 overflow-y-auto mb-6 space-y-4 border rounded-lg p-4 bg-muted/30">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                <div
                  className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                >
                  <div
                    className={`p-2 rounded-full ${message.sender === "user" ? "bg-primary" : "bg-secondary"}`}
                  >
                    {message.sender === "user" ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div
                    className={`p-3 rounded-lg ${message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-card border"}`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-3">Sugerencias rápidas:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {quickSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickSuggestion(suggestion.action)}
                  className="h-auto p-3 text-xs hover:bg-primary/10"
                >
                  <suggestion.icon className="h-4 w-4 mb-1" />
                  <span className="block">{suggestion.text}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Escribe tu mensaje aquí..."
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} className="px-4">
              <Send className="h-4 w-4" />
            </Button>
            <Button onClick={handlePronunciationEvaluation} variant="secondary" className="px-3">
              🎙️
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};
