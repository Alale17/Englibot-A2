import { useEffect, useMemo, useRef, useState } from "react";
import { Send, Bot, User, BookOpen, Volume2, MessageSquare, HelpCircle, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ========================= Tipos fuertes =========================
interface BaseMessage { id: string; timestamp: Date }

type Sender = "user" | "bot_en" | "bot_es_audio";

type Message =
  | (BaseMessage & { kind: "text"; sender: Sender; content: string })
  | (BaseMessage & { kind: "audio"; sender: Sender; audioUrl: string; transcript?: string });

// Web Speech Recognition (tipado sin `any` y sin depender de lib extra)
interface SRAlternative { transcript: string; confidence?: number }
interface SRResult { isFinal: boolean; length: number; [index: number]: SRAlternative }
interface SRResultList { length: number; [index: number]: SRResult }
interface SREvent extends Event { results: SRResultList }
interface SRErrorEvent extends Event { error: string; message?: string }
interface SRRecognition extends EventTarget {
  lang: string; interimResults: boolean; maxAlternatives: number;
  onresult: ((ev: SREvent) => void) | null;
  onerror: ((ev: SRErrorEvent) => void) | null;
  onend: ((ev: Event) => void) | null;
  start(): void; stop(): void;
}

declare global {
  interface Window {
    SpeechRecognition?: { new(): SRRecognition };
    webkitSpeechRecognition?: { new(): SRRecognition };
  }
}

const getSRConstructor = (): (new () => SRRecognition) | null => {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
};

// ========================= Utilidades TTS =========================
const pickVoice = (synth: SpeechSynthesis, prefs: string[], langFallback: string): SpeechSynthesisVoice | null => {
  const voices = synth.getVoices();
  for (const pref of prefs) {
    const v = voices.find((vv) => vv.name.includes(pref));
    if (v) return v;
  }
  const byLang = voices.find((v) => v.lang === langFallback);
  if (byLang) return byLang;
  const female = voices.find((v) => v.name.toLowerCase().includes("female"));
  return female ?? voices[0] ?? null;
};

const speak = (text: string, opts?: { lang?: string; rate?: number; pitch?: number; prefs?: string[] }) => {
  const { lang = "en-US", rate = 0.98, pitch = 1.05, prefs = [] } = opts ?? {};
  const synth = window.speechSynthesis;
  const doSpeak = () => {
    const utt = new SpeechSynthesisUtterance(text);
    utt.voice = pickVoice(synth, prefs, lang);
    utt.lang = lang; utt.rate = rate; utt.pitch = pitch;
    synth.speak(utt);
  };
  if (synth.getVoices().length === 0) {
    const handler = () => { doSpeak(); synth.removeEventListener("voiceschanged", handler); };
    synth.addEventListener("voiceschanged", handler);
  } else doSpeak();
};

// ========================= Prompts de enseñanza =========================
const EN_TUTOR_SYSTEM = `You are a friendly English tutor for an A2 learner.
- Reply ONLY in English.
- Use 3–6 short sentences. Vary phrasing; avoid repetition.
- Teach actively: examples, mini-drills, quick checks.
- Correct errors kindly and offer one alternative.
- Prefer simple vocabulary; optionally highlight key words with *asterisks*.`;

const ES_AUDIO_TUTOR_PROMPT = `Eres un tutor que RESPONDE EN ESPAÑOL por audio.
- Sé breve (2–4 frases) y claro.
- Resume lo que entendiste y da una sugerencia práctica.
- Propón una micro-tarea: repetir una frase corta en inglés.`;

// ========================= Componente =========================
export const ChatSection = () => {
  const [messages, setMessages] = useState<Message[]>([{
    id: "welcome", kind: "text", sender: "bot_en", timestamp: new Date(),
    content: "Hi! I'm your A2 English tutor. How can I help today? Vocabulary, grammar, or conversation? 😊",
  }]);
  const [inputMessage, setInputMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  // Auto-scroll
  const endRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // Gemini
  const gemini = useMemo(() => new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY), []);
  const getModel = (name: string) => gemini.getGenerativeModel({ model: name });

  const quickSuggestions = [
    { icon: BookOpen, text: "Practicar vocabulario", action: "vocabulary" },
    { icon: MessageSquare, text: "Revisar gramática", action: "grammar" },
    { icon: Volume2, text: "Practicar pronunciación", action: "pronunciation" },
    { icon: HelpCircle, text: "Hacer una pregunta", action: "question" },
  ] as const;

  const handleQuickSuggestion = (action: typeof quickSuggestions[number]["action"]) => {
    const suggestions: Record<string,string> = {
      vocabulary: "Let's practice A2 vocabulary about daily routines.",
      grammar: "Can you help me with present simple vs. present continuous?",
      pronunciation: "I want to practice pronunciation with short sentences.",
      question: "I have a question about English prepositions.",
    };
    setInputMessage(suggestions[action] ?? "");
  };

  // ===== Texto → Bot EN
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    const userMsg: Message = { id: `${Date.now()}-u`, kind: "text", sender: "user", content: inputMessage, timestamp: new Date() };
    setMessages((p) => [...p, userMsg]);
    setInputMessage("");

    const reply = await generateENBotResponse(userMsg.content);
    const botMsg: Message = { id: `${Date.now()}-ben`, kind: "text", sender: "bot_en", content: reply, timestamp: new Date() };
    setMessages((p) => [...p, botMsg]);

    speak(reply, { lang: "en-US", rate: 0.95, pitch: 1.08, prefs: ["Microsoft Emma", "Google US English", "Microsoft Zira"] });
  };

  const generateENBotResponse = async (userText: string): Promise<string> => {
    try {
      const model = getModel("gemini-1.5-flash");
      const chat = model.startChat({ history: [{ role: "user", parts: [{ text: EN_TUTOR_SYSTEM }]}] });
      const res = await chat.sendMessage(userText);
      return res.response.text().trim();
    } catch {
      return "Sorry, something went wrong. Please try again.";
    }
  };

  // ===== Audio → Bot ES por voz (y muestra el audio)
  const handleAudioButton = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (ev) => { if (ev.data && ev.data.size > 0) chunksRef.current.push(ev.data); };
      mr.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        const audioMsg: Message = { id: `${Date.now()}-ua`, kind: "audio", sender: "user", audioUrl: url, timestamp: new Date() };
        setMessages((p) => [...p, audioMsg]);

        const transcript = await transcribeWithWebSpeech();
        const replyText = await generateESAudioTutorReply(transcript ?? "(sin transcripción)");
        const botTextMsg: Message = { id: `${Date.now()}-bes`, kind: "text", sender: "bot_es_audio", content: replyText, timestamp: new Date() };
        setMessages((p) => [...p, botTextMsg]);

        speak(replyText, { lang: "es-ES", rate: 1.0, pitch: 1.0, prefs: ["Microsoft Helena", "Google español", "Microsoft Laura"] });
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setIsRecording(true);
    } catch {
      const errorMsg: Message = { id: `${Date.now()}-errmic`, kind: "text", sender: "bot_es_audio", content: "❌ No pude acceder al micrófono. Revisa permisos.", timestamp: new Date() };
      setMessages((p) => [...p, errorMsg]);
    }
  };

  // ===== Transcripción Web Speech (sin any)
  const transcribeWithWebSpeech = async (): Promise<string | undefined> => {
    const Ctor = getSRConstructor();
    if (!Ctor) return undefined;
    return new Promise<string | undefined>((resolve) => {
      let finished = false;
      try {
        const rec = new Ctor();
        rec.lang = "en-US"; rec.interimResults = false; rec.maxAlternatives = 1;
        rec.onresult = (ev: SREvent) => {
          finished = true;
          const list = ev.results;
          if (list && list.length > 0) {
            const first = list[0];
            if (first && first.length > 0) {
              resolve(first[0].transcript);
              return;
            }
          }
          resolve(undefined);
        };
        rec.onerror = () => { if (!finished) resolve(undefined); };
        rec.onend = () => { if (!finished) resolve(undefined); };
        rec.start();
        window.setTimeout(() => { try { rec.stop(); } catch { /* empty */ } }, 6000);
      } catch {
        if (!finished) resolve(undefined);
      }
    });
  };

  const generateESAudioTutorReply = async (userText: string): Promise<string> => {
    try {
      const model = getModel("gemini-1.5-flash");
      const chat = model.startChat({ history: [{ role: "user", parts: [{ text: ES_AUDIO_TUTOR_PROMPT }]}] });
      const res = await chat.sendMessage(userText);
      return res.response.text().trim();
    } catch {
      return "Hubo un problema generando la respuesta por voz.";
    }
  };

  // ========================= UI =========================
  return (
    <section id="chat" className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Chat con tu Asistente Virtual</h2>
          <p className="text-xl text-muted-foreground">Conversa en tiempo real y recibe ayuda personalizada</p>
        </div>

        <Card className="p-6 shadow-card">
          {/* Lista de mensajes */}
          <div className="h-96 overflow-y-auto mb-6 space-y-4 border rounded-lg p-4 bg-muted/30">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
                <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${m.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                  <div className={`p-2 rounded-full ${m.sender === "user" ? "bg-primary" : m.sender === "bot_en" ? "bg-secondary" : "bg-amber-500"}`} title={m.sender === "bot_en" ? "Tutor EN" : m.sender === "bot_es_audio" ? "Tutor ES (Audio)" : "Tú"}>
                    {m.sender === "user" ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-white" />}
                  </div>
                  <div className={`p-3 rounded-lg ${m.sender === "user" ? "bg-primary text-primary-foreground" : "bg-card border"}`}>
                    {m.kind === "text" && <p className="text-sm whitespace-pre-wrap">{m.content}</p>}
                    {m.kind === "audio" && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2"><Waves className="h-4 w-4" /><span className="text-xs text-muted-foreground">Audio message</span></div>
                        <audio src={m.audioUrl} controls className="w-56" />
                        {m.transcript && <p className="text-xs text-muted-foreground">Transcript: {m.transcript}</p>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Sugerencias rápidas */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-3">Sugerencias rápidas:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {quickSuggestions.map((s) => (
                <Button key={s.text} variant="outline" size="sm" onClick={() => handleQuickSuggestion(s.action)} className="h-auto p-3 text-xs hover:bg-primary/10">
                  <s.icon className="h-4 w-4 mb-1" />
                  <span className="block">{s.text}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Entrada + botones */}
          <div className="flex gap-2 items-center">
            <Input value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder="Escribe tu mensaje aquí... (responderá en INGLÉS)" onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} className="flex-1" />
            <Button onClick={handleSendMessage} className="px-4" aria-label="Enviar mensaje de texto"><Send className="h-4 w-4" /></Button>
            <Button onClick={handleAudioButton} variant={isRecording ? "default" : "secondary"} className={`px-3 relative ${isRecording ? "animate-pulse" : ""}`} aria-label={isRecording ? "Detener grabación" : "Iniciar grabación"} title="Pulsa para enviar un audio (responderé en ESPAÑOL por voz)">
              <span className="inline-flex items-center gap-2">🎙️</span>
              {isRecording && <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 animate-ping" />}
            </Button>
          </div>

          <div className="mt-3 text-[11px] text-muted-foreground">
            <p><strong>Voces:</strong> Bot EN (inglés) usa una voz inglesa; Bot ES (audio) contesta en español con una voz distinta. Tus audios se muestran en el chat.</p>
          </div>
        </Card>
      </div>
    </section>
  );
};
