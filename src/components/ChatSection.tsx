import { useState } from "react";
import { Send, Bot, User, BookOpen, Volume2, MessageSquare, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
      content: "¡Hola! Soy tu asistente virtual para aprender inglés A1. ¿En qué te puedo ayudar hoy? Puedes preguntarme sobre vocabulario, gramática, o simplemente practicar conversación. 😊",
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

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateBotResponse(inputMessage),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
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

  const generateBotResponse = (userMessage: string): string => {
    const responses = [
      "¡Excelente! Te voy a ayudar con eso. En inglés A1, empezamos con lo básico...",
      "¡Muy buena pregunta! Para nivel A1, te recomiendo...",
      "¡Perfecto! Vamos a practicar juntos. Primero...",
      "¡Me encanta tu interés! Para comenzar con esto...",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
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
          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto mb-6 space-y-4 border rounded-lg p-4 bg-muted/30">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                  <div className={`p-2 rounded-full ${message.sender === "user" ? "bg-primary" : "bg-secondary"}`}>
                    {message.sender === "user" ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className={`p-3 rounded-lg ${message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-card border"}`}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Suggestions */}
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

          {/* Input Section */}
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Escribe tu mensaje aquí..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} className="px-6">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};