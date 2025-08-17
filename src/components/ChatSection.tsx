import { useEffect, useRef, useState } from "react";
import {
  Send,
  Bot,
  User,
  BookOpen,
  Volume2,
  MessageSquare,
  HelpCircle,
  Mic,
  Square,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";

type Sender = "user" | "bot" | "coach";

interface Message {
  id: string;
  content?: string;
  sender: Sender;
  timestamp: Date;
  audioUrl?: string;
  audioSeconds?: number;
}

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;
const MODEL = import.meta.env.VITE_GEMINI_MODEL || "gemini-1.5-pro";

const uuid = () =>
  (typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

// 🔹 Limpia Markdown para que el TTS no lea los símbolos
const cleanForTTS = (s: string) => {
  return (
    s
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/__(.*?)__/g, "$1")
      .replace(/_(.*?)_/g, "$1")
      .replace(/```[\s\S]*?```/g, "")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/^\s{0,3}#{1,6}\s+/gm, "")
      .replace(/^\s*[-*+]\s+/gm, "")
      .replace(/^\s*\d+\.\s+/gm, "")
      .replace(/[*#_>]+/g, "")
      .replace(/\s{2,}/g, " ")
      .trim()
  );
};

export const ChatSection = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your friendly A2 English tutor. Ask me anything — we can practice vocabulary, grammar, or conversation. 😊",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recSeconds, setRecSeconds] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<BlobPart[]>([]);
  const recTimerRef = useRef<number | null>(null);
  const chatBoxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const quickSuggestions = [
    { icon: BookOpen, text: "Practicar vocabulario", action: "vocabulary" },
    { icon: MessageSquare, text: "Revisar gramática", action: "grammar" },
    { icon: Volume2, text: "Practicar pronunciación", action: "pronunciation" },
    { icon: HelpCircle, text: "Hacer una pregunta", action: "question" },
  ];

  const speak = (text: string, lang: "en-US" | "es-ES") => {
    const synth = window.speechSynthesis;
    const pickVoice = () => {
      const voices = synth.getVoices();
      const preferredEn = [
        "Microsoft Aria Online (Natural) - English (United States)",
        "Google US English",
        "Microsoft Zira",
        "Microsoft Emma",
      ];
      const preferredEs = [
        "Microsoft Dalia Online (Natural) - Spanish (Spain)",
        "Google español",
        "Microsoft Helena",
        "Microsoft Laura",
      ];
      const prefs = lang === "en-US" ? preferredEn : preferredEs;
      const voice =
        voices.find((v) => prefs.includes(v.name)) ||
        voices.find((v) => v.lang === lang) ||
        voices[0];
      const u = new SpeechSynthesisUtterance(text);
      u.voice = voice || null;
      u.lang = lang;
      u.rate = lang === "en-US" ? 0.98 : 1.0;
      u.pitch = 1.05;
      synth.speak(u);
    };
    if (synth.getVoices().length === 0) {
      const handler = () => {
        pickVoice();
        synth.removeEventListener("voiceschanged", handler);
      };
      synth.addEventListener("voiceschanged", handler);
    } else {
      pickVoice();
    }
  };
  const generateBotResponse = async (userMessage: string): Promise<string> => {
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({
        model: MODEL, // <- usa el modelo de .env (pro/flash)
        generationConfig: {
          temperature: 0.8,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 220,
          frequencyPenalty: 0.7,
          presencePenalty: 0.2,
        },
      });
      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [
              {
                text: [
                  "You are a patient English tutor for A2 learners.",
                  "Respond STEP-BY-STEP",
                  "Keep it short: 2–4 lines max. Use simple English.", 
                  "Bold key words using **...** (Markdown).",
                  "If learner writes in Spanish, answer in simple English.",
                  "Be flexible with the conversation",
                ].join("\n"),
              },
            ],
          },
        ],
      });
      const result = await chat.sendMessage(userMessage);
      const response = await result.response;
      return response.text().trim();
    } catch {
      return "Sorry—there was an issue. Could you try again?";
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    const userMsg: Message = {
      id: uuid(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    const botReply = await generateBotResponse(userMsg.content);
    const botMsg: Message = {
      id: uuid(),
      content: botReply,
      sender: "bot",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botMsg]);
    // 🔹 Ahora habla sin símbolos de Markdown
    speak(cleanForTTS(botReply), "en-US");
  };

  const handleQuickSuggestion = (action: string) => {
    const suggestions: Record<string, string> = {
      vocabulary: "Let's practice A2 vocabulary about daily routines.",
      grammar: "Give me an explanation about how to use the verb to be.",
      pronunciation: "I want to practice pronunciation, give me a sentence to practice.",
      question: "Tell me simple questions in general",
    };
    setInputMessage(suggestions[action] ?? "");
  };

  type RecognitionResultEvent = Event & {
    results: { [i: number]: { [j: number]: { transcript: string } } };
  };
  type RecognitionErrorEvent = Event & { error: string };

  type CustomSpeechRecognition = {
    lang: string;
    interimResults: boolean;
    maxAlternatives: number;
    onresult: ((event: RecognitionResultEvent) => void) | null;
    onerror: ((event: RecognitionErrorEvent) => void) | null;
    start: () => void;
    stop: () => void;
  };

  type CustomWindow = typeof window & {
    SpeechRecognition: { new (): CustomSpeechRecognition };
    webkitSpeechRecognition: { new (): CustomSpeechRecognition };
  };

  const calculateScore = (expected: string, spoken: string): number => {
    const ew = expected.toLowerCase().split(/\s+/);
    const sw = spoken.toLowerCase().split(/\s+/);
    let match = 0;
    for (let i = 0; i < Math.min(ew.length, sw.length); i++) {
      if (ew[i] === sw[i]) match++;
    }
    return Math.round((match / Math.max(1, sw.length)) * 100);
  };

  const getGeminiFeedback = async (
    expected: string,
    spoken: string,
    score: number
  ): Promise<string> => {
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({
        model: MODEL, // <- usa el mismo modelo configurado
        generationConfig: { temperature: 0.6, maxOutputTokens: 160 },
      });
      const prompt = `
            Eres profesor de pronunciación. Evalúa SOLO lo pronunciado. Premite al usuario que repita si lo hace mal. Sé flexible: si hay similitud, no pongas 0, pon el puntaje que se merece recuerda que es del 0 al 100. 
            Esperado: "${expected}"
            Pronunciado: "${spoken}"
            Puntaje sugerido (0-100): ${score}
            Entrega en español, máximo 1 líneas, con "Puntaje:" al final.`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch {
      return "❌ Error al generar la retroalimentación.";
    }
  };

  const handlePronunciationEvaluation = () => {
    const lastBot =
      [...messages].reverse().find((m) => m.sender === "bot")?.content ??
      "How are you today?";
    const customWindow = window as CustomWindow;
    const recognition = new (
      customWindow.SpeechRecognition || customWindow.webkitSpeechRecognition
    )();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = async (e) => {
      const spoken = (e as RecognitionResultEvent).results[0][0].transcript;
      const score = calculateScore(lastBot, spoken);
      const feedback = await getGeminiFeedback(lastBot, spoken, score);
      const coachMsg: Message = {
        id: uuid(),
        content: feedback,
        sender: "coach",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, coachMsg]);
      // 🔹 Ahora habla sin símbolos de Markdown
      speak(cleanForTTS(feedback), "es-ES");
    };

    recognition.onerror = (e) => {
      const err = (e as RecognitionErrorEvent).error;
      const errorMessage: Message = {
        id: uuid(),
        content: "❌ Error al reconocer el audio: " + err,
        sender: "coach",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    };

    const startMediaRecorder = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      recordedChunksRef.current = [];
      mr.ondataavailable = (evt) => {
        if (evt.data && evt.data.size > 0) recordedChunksRef.current.push(evt.data);
      };
      mr.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        const secs = await getAudioDurationSeconds(url);
        const audioMsg: Message = {
          id: uuid(),
          sender: "user",
          timestamp: new Date(),
          audioUrl: url,
          audioSeconds: Math.round(secs),
        };
        setMessages((prev) => [...prev, audioMsg]);
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start();
      setRecSeconds(0);
      recTimerRef.current = window.setInterval(() => setRecSeconds((s) => s + 1), 1000);
      setIsRecording(true);
      recognition.start();
    };

    const stopAll = () => {
      recognition.stop();
      mediaRecorderRef.current?.stop();
      if (recTimerRef.current) {
        clearInterval(recTimerRef.current);
        recTimerRef.current = null;
      }
      setIsRecording(false);
    };

    if (!isRecording) {
      startMediaRecorder().catch(() => setIsRecording(false));
    } else {
      stopAll();
    }
  };

  const getAudioDurationSeconds = (objectUrl: string) =>
    new Promise<number>((resolve) => {
      const a = new Audio(objectUrl);
      a.addEventListener("loadedmetadata", () =>
        resolve(isFinite(a.duration) ? a.duration : 0)
      );
    });

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
          <div
            ref={chatBoxRef}
            className="h-96 overflow-y-auto mb-6 space-y-4 border rounded-lg p-4 bg-muted/30 scroll-smooth"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.sender === "user" ? "justify-end" : "justify-start"
                } animate-in fade-in-0`}
              >
                <div
                  className={`flex items-start gap-2 max-w-xs lg:max-w-md ${
                    m.sender === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`p-2 rounded-full ${
                      m.sender === "user"
                        ? "bg-primary"
                        : m.sender === "bot"
                        ? "bg-secondary"
                        : "bg-amber-200"
                    }`}
                  >
                    {m.sender === "user" ? (
                      <User className="h-4 w-4 text-white" />
                    ) : m.sender === "bot" ? (
                      <Bot className="h-4 w-4 text-white" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={`p-3 rounded-lg ${
                      m.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border"
                    } w-fit`}
                  >
                    {m.content && (
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => (
                            <p className="text-sm whitespace-pre-wrap">
                              {children}
                            </p>
                          ),
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    )}
                    {m.audioUrl && (
                      <div className="flex flex-col gap-1">
                        <audio
                          src={m.audioUrl}
                          controls
                          preload="metadata"
                          className="w-56"
                        />
                        <span className="text-xs text-muted-foreground">
                          {m.audioSeconds ?? 0}s
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-3">
              Sugerencias rápidas:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {quickSuggestions.map((s, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickSuggestion(s.action)}
                  className="h-auto p-3 text-xs hover:bg-primary/10"
                >
                  <s.icon className="h-4 w-4 mb-1" />
                  <span className="block">{s.text}</span>
                </Button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 items-center">
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
            <Button
              onClick={handlePronunciationEvaluation}
              variant={isRecording ? "destructive" : "secondary"}
              className={`relative px-3 ${isRecording ? "animate-pulse" : ""}`}
              title={
                isRecording ? "Detener" : "Grabar / Evaluar pronunciación"
              }
            >
              <span
                className={`absolute inset-0 rounded-md ring-2 ring-offset-2 pointer-events-none ${
                  isRecording ? "ring-red-400/60" : "ring-transparent"
                }`}
              />
              {isRecording ? (
                <Square className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
              {isRecording && (
                <span className="ml-2 text-xs tabular-nums">
                  {recSeconds}s
                </span>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};
