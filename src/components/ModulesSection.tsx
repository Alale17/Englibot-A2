import React, { useMemo, useState } from "react";
import { BookOpen, Headphones, Mic, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";

// -----------------------------
// Tipos
// -----------------------------
export type QuizOption = string;
export type Question = {
  id: string;
  prompt: string;
  options: QuizOption[]; // índice de opción correcta en "answer"
  answer: number;
  explanation?: string;
};

// -----------------------------
// Banco de preguntas por módulo (10 c/u)
// Nota: puedes reemplazar las preguntas por las tuyas.
// -----------------------------
const questionsByModule: Record<number, Question[]> = {
  // 1) Vocabulario Básico
  1: [
    {
      id: "v1",
      prompt: "¿Cómo se dice 'gato' en inglés?",
      options: ["dog", "cat", "cow", "rat"],
      answer: 1,
      explanation: "'Cat' significa 'gato'.",
    },
    {
      id: "v2",
      prompt: "Selecciona el color 'rojo':",
      options: ["green", "blue", "red", "pink"],
      answer: 2,
    },
    {
      id: "v3",
      prompt: "¿Qué palabra significa 'familia'?",
      options: ["family", "friend", "people", "parents"],
      answer: 0,
    },
    {
      id: "v4",
      prompt: "Elige el número 'siete':",
      options: ["six", "seven", "nine", "eleven"],
      answer: 1,
    },
    {
      id: "v5",
      prompt: "¿Cuál es el plural de 'child'?",
      options: ["childs", "childes", "children", "childrens"],
      answer: 2,
    },
    {
      id: "v6",
      prompt: "¿Qué significa 'morning'?",
      options: ["tarde", "mañana (temprano)", "noche", "mediodía"],
      answer: 1,
    },
    {
      id: "v7",
      prompt: "Selecciona la palabra relacionada con comida:",
      options: ["apple", "table", "window", "street"],
      answer: 0,
    },
    {
      id: "v8",
      prompt: "¿Cómo se dice 'gracias' en inglés?",
      options: ["please", "sorry", "thanks", "hello"],
      answer: 2,
    },
    {
      id: "v9",
      prompt: "Selecciona la profesión:",
      options: ["teacher", "school", "classroom", "student"],
      answer: 0,
    },
    {
      id: "v10",
      prompt: "¿Cuál es un medio de transporte?",
      options: ["car", "book", "bread", "tree"],
      answer: 0,
    },
  ],

  // 2) Gramática Fundamental
  2: [
    {
      id: "g1",
      prompt: "Elige la opción correcta: 'I ___ a student.'",
      options: ["am", "is", "are", "be"],
      answer: 0,
    },
    {
      id: "g2",
      prompt: "Presente simple: 'She ___ coffee every day.'",
      options: ["drink", "drinks", "drank", "is drinking"],
      answer: 1,
    },
    {
      id: "g3",
      prompt: "Artículo correcto: '___ apple'",
      options: ["a", "an", "the", "–"],
      answer: 1,
    },
    {
      id: "g4",
      prompt: "Pronombre: '___ are my friends.'",
      options: ["He", "She", "They", "It"],
      answer: 2,
    },
    { id: "g5", prompt: "Negación en present simple: 'I ___ like tea.'", options: ["don't", "doesn't", "not", "am not"], answer: 0 },
    { id: "g6", prompt: "Verbo to be (tercera persona): 'He ___ tall.'", options: ["am", "is", "are", "be"], answer: 1 },
    { id: "g7", prompt: "Plural correcto: 'one box, two ___'", options: ["boxs", "boxes", "boxies", "box"], answer: 1 },
    { id: "g8", prompt: "Orden básico: 'She / a book / reads'", options: ["Reads she a book", "She reads a book", "She a book reads", "A book she reads"], answer: 1 },
    { id: "g9", prompt: "Pregunta: '___ you like music?'", options: ["Do", "Does", "Are", "Is"], answer: 0 },
    { id: "g10", prompt: "Preposición: 'on Monday' significa…", options: ["en", "a las", "el/los (día)", "desde"], answer: 2 },
  ],

  // 3) Comprensión Auditiva (en esta demo, preguntas de comprensión general)
  3: [
    { id: "l1", prompt: "¿Qué palabra corresponde a una instrucción?", options: ["turn left", "green", "cat", "happy"], answer: 0 },
    { id: "l2", prompt: "En un diálogo: 'How are you? – I'm ___'", options: ["blue", "fine", "cat", "Monday"], answer: 1 },
    { id: "l3", prompt: "Identifica el lugar: 'platform' se usa en…", options: ["restaurante", "aeropuerto", "estación de tren", "escuela"], answer: 2 },
    { id: "l4", prompt: "'Can you repeat, please?' significa…", options: ["¿Puedes ir?", "¿Puedes repetir?", "¿Puedes leer?", "¿Puedes ayudar?"], answer: 1 },
    { id: "l5", prompt: "Palabra que escucharías en una receta:", options: ["boil", "drive", "swim", "paint"], answer: 0 },
    { id: "l6", prompt: "'Next to' significa…", options: ["debajo de", "al lado de", "encima de", "dentro de"], answer: 1 },
    { id: "l7", prompt: "Respuesta común a 'Thank you'", options: ["See you", "You're welcome", "Sorry", "Goodbye"], answer: 1 },
    { id: "l8", prompt: "¿Qué palabra suele indicar tiempo futuro?", options: ["will", "did", "has", "was"], answer: 0 },
    { id: "l9", prompt: "'Slow down' significa…", options: ["acelera", "frena", "sigue", "regresa"], answer: 1 },
    { id: "l10", prompt: "¿Cuál no es un saludo?", options: ["Hi", "Hello", "Goodbye", "Hey"], answer: 2 },
  ],

  // 4) Pronunciación (teórica en formato test)
  4: [
    { id: "p1", prompt: "El sonido de 'th' en 'think' es…", options: ["/s/", "/t/", "/θ/", "/f/"], answer: 2 },
    { id: "p2", prompt: "¿Cuál tiene vocal corta?", options: ["ship", "sheep", "food", "pool"], answer: 0 },
    { id: "p3", prompt: "El acento en 'present' (sustantivo) cae en…", options: ["pre-", "-sent", "ambas", "ninguna"], answer: 0 },
    { id: "p4", prompt: "¿Cuál rima con 'cat'?", options: ["cut", "cart", "hat", "cot"], answer: 2 },
    { id: "p5", prompt: "Sonido final sonoro:", options: ["dogs", "cats", "books", "cups"], answer: 0 },
    { id: "p6", prompt: "'Word stress' se refiere a…",
      options: ["intonación de la frase", "sílabas acentuadas en palabras", "pausas", "velocidad"],
      answer: 1 },
    { id: "p7", prompt: "¿Cuál tiene sonido /ɪ/?", options: ["beat", "bit", "beet", "bee"], answer: 1 },
    { id: "p8", prompt: "En inglés americano, 'r' se pronuncia…",
      options: ["solo al inicio", "rótica en casi todas las posiciones", "solo entre vocales", "nunca"],
      answer: 1 },
    { id: "p9", prompt: "¿Cuál es un par mínimo?", options: ["pin–pen", "good–well", "cat–dog", "big–large"], answer: 0 },
    { id: "p10", prompt: "Símbolo fonético de la vocal en 'cup'",
      options: ["/æ/", "/ʌ/", "/ɑː/", "/e/"],
      answer: 1 },
  ],
};

// -----------------------------
// Componente reutilizable del Quiz (panel único)
// -----------------------------
function QuizPanel({
  open,
  onOpenChange,
  moduleId,
  moduleTitle,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  moduleId: number | null;
  moduleTitle?: string;
}) {
  const questions = useMemo(() => (moduleId ? questionsByModule[moduleId] ?? [] : []), [moduleId]);

  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [submitted, setSubmitted] = useState(false);

  const total = questions.length;
  const answeredCount = useMemo(
    () => Object.values(answers).filter((v) => v !== null && v !== undefined).length,
    [answers]
  );

  const score = useMemo(() => {
    if (!submitted) return 0;
    return questions.reduce((acc, q) => (answers[q.id] === q.answer ? acc + 1 : acc), 0);
  }, [submitted, answers, questions]);

  const levelLabel = useMemo(() => {
    const pct = total ? (score / total) * 100 : 0;
    if (pct >= 85) return "Avanzado";
    if (pct >= 60) return "Intermedio";
    return "Inicial";
  }, [score, total]);

  const resetState = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const handleClose = (o: boolean) => {
    if (!o) {
      resetState();
    }
    onOpenChange(o);
  };

  const onSelect = (qid: string, idx: number) => {
    setAnswers((prev) => ({ ...prev, [qid]: idx }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const progressPct = total ? Math.round((answeredCount / total) * 100) : 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl w-full">
        <DialogHeader>
          <DialogTitle>{moduleTitle ? `Quiz: ${moduleTitle}` : "Quiz"}</DialogTitle>
          <DialogDescription>
            Responde las {total} preguntas. Solo verás un panel para cualquier módulo
            seleccionado.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span>
                Progreso: {answeredCount}/{total}
              </span>
              <span className="font-medium">{progressPct}%</span>
            </div>
            <Progress value={progressPct} className="h-2" />
          </div>

          <div className="space-y-6 max-h-[55vh] overflow-y-auto pr-1">
            {questions.map((q, i) => (
              <div key={q.id} className="p-4 rounded-xl border bg-card">
                <div className="mb-3 font-medium">
                  {i + 1}. {q.prompt}
                </div>
                <RadioGroup
                  value={answers[q.id]?.toString() ?? ""}
                  onValueChange={(val) => onSelect(q.id, parseInt(val))}
                >
                  {q.options.map((opt, idx) => {
                    const chosen = answers[q.id] === idx;
                    const isCorrect = submitted && idx === q.answer;
                    const isWrong = submitted && chosen && idx !== q.answer;
                    return (
                      <div key={idx} className={`flex items-center gap-2 p-2 rounded-lg ${isCorrect ? "bg-green-50 dark:bg-green-900/20" : isWrong ? "bg-red-50 dark:bg-red-900/20" : ""}`}>
                        <RadioGroupItem id={`${q.id}-${idx}`} value={idx.toString()} />
                        <Label htmlFor={`${q.id}-${idx}`} className="cursor-pointer">
                          {opt}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
                {submitted && q.explanation && (
                  <p className="text-xs text-muted-foreground mt-2">{q.explanation}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between">
          {!submitted ? (
            <Button onClick={handleSubmit} disabled={answeredCount < total} className="w-full sm:w-auto">
              Enviar respuestas
            </Button>
          ) : (
            <div className="w-full flex flex-col gap-2">
              <div className="text-center sm:text-left">
                <p className="text-lg font-semibold">
                  Puntuación: {score}/{total} · Nivel estimado: {levelLabel}
                </p>
                <p className="text-sm text-muted-foreground">
                  Puedes cerrar el panel para intentar otro módulo.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={resetState} className="flex-1">
                  Reiniciar
                </Button>
                <Button onClick={() => handleClose(false)} className="flex-1">
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// -----------------------------
// Sección de módulos con botón para abrir el panel único
// -----------------------------
export const ModulesSection: React.FC = () => {
  const modules = [
    {
      id: 1,
      title: "Vocabulario Básico",
      description: "Aprende palabras esenciales del día a día con imágenes y ejemplos",
      icon: BookOpen,
      progress: 75,
      lessons: 12,
      completed: 9,
      color: "bg-learning-beginner",
      topics: ["Saludos", "Familia", "Colores", "Números"],
    },
    {
      id: 2,
      title: "Gramática Fundamental",
      description: "Estructuras básicas del inglés explicadas de forma simple",
      icon: CheckCircle,
      progress: 50,
      lessons: 10,
      completed: 5,
      color: "bg-learning-intermediate",
      topics: ["Verb to be", "Present Simple", "Articles", "Pronouns"],
    },
    {
      id: 3,
      title: "Comprensión Auditiva",
      description: "Ejercicios de escucha con audios cortos y fáciles",
      icon: Headphones,
      progress: 30,
      lessons: 8,
      completed: 2,
      color: "bg-learning-advanced",
      topics: ["Diálogos simples", "Instrucciones", "Conversaciones", "Audio stories"],
    },
    {
      id: 4,
      title: "Pronunciación",
      description: "Practica la pronunciación correcta de sonidos básicos",
      icon: Mic,
      progress: 10,
      lessons: 6,
      completed: 1,
      color: "bg-accent",
      topics: ["Alphabet", "Basic sounds", "Word stress", "Simple phrases"],
    },
  ];

  // Estado para mostrar un único panel (Dialog) sin importar qué módulo dispare el quiz
  const [activeModuleId, setActiveModuleId] = useState<number | null>(null);

  const openQuiz = (id: number) => setActiveModuleId(id);
  const closeQuiz = () => setActiveModuleId(null);

  const activeTitle = useMemo(() => modules.find((m) => m.id === activeModuleId)?.title, [activeModuleId]);

  return (
    <section id="modules" className="pb-20 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Módulos de Aprendizaje</h2>
          <p className="text-xl text-muted-foreground">Aprende paso a paso con contenido estructurado y progresivo</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {modules.map((module, index) => (
            <Card
              key={module.id}
              className="p-6 hover:shadow-glow transition-all duration-300 animate-fade-in group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Encabezado del módulo */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${module.color} text-white`}>
                    <module.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{module.title}</h3>
                  </div>
                </div>
              </div>

              {/* Barra de progreso */}
              <div className="mb-4">
                <div className="w-full bg-muted rounded-full h-2">
                  <div className={`h-2 rounded-full ${module.color} transition-all duration-500`} style={{ width: `${module.progress}%` }} />
                </div>
              </div>

              {/* Descripción */}
              <p className="text-muted-foreground mb-4">{module.description}</p>

              {/* Temas */}
              <div className="mb-6">
                <p className="text-sm font-medium text-foreground mb-2">Temas incluidos:</p>
                <div className="flex flex-wrap gap-2">
                  {module.topics.map((topic, topicIndex) => (
                    <Badge key={topicIndex} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* CTA del quiz */}
              <div className="flex items-center gap-3">
                <Button onClick={() => openQuiz(module.id)} className="flex-1">
                  Tomar quiz de {module.title}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Call to Action global */}
        <div className="text-center mt-12">
          <Card className="p-8 bg-gradient-primary text-primary-foreground">
            <h3 className="text-2xl font-bold mb-2">¿Listo para comenzar tu aventura?</h3>
            <p className="mb-6 opacity-90">Empieza con cualquier módulo y avanza a tu propio ritmo</p>
            <Button variant="secondary" size="lg" className="animate-bounce-gentle">
              <BookOpen className="mr-2 h-5 w-5" />
              Explorar Todos los Módulos
            </Button>
          </Card>
        </div>
      </div>

      {/* Panel ÚNICO de Quiz (Dialog) */}
      <QuizPanel
        open={activeModuleId !== null}
        onOpenChange={(o) => (o ? null : closeQuiz())}
        moduleId={activeModuleId}
        moduleTitle={activeTitle}
      />
    </section>
  );
};
