import { BookOpen, Volume2, Headphones, Mic, CheckCircle, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const ModulesSection = () => {
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

  return (
    <section id="modules" className="py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Módulos de Aprendizaje
          </h2>
          <p className="text-xl text-muted-foreground">
            Aprende paso a paso con contenido estructurado y progresivo
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {modules.map((module, index) => (
            <Card key={module.id} className="p-6 hover:shadow-glow transition-all duration-300 animate-fade-in group" style={{ animationDelay: `${index * 100}ms` }}>
              {/* Module Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${module.color} text-white`}>
                    <module.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{module.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {module.completed}/{module.lessons} lecciones completadas
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-learning-complete/10 text-learning-complete border-learning-complete/30">
                  {module.progress}%
                </Badge>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${module.color} transition-all duration-500`}
                    style={{ width: `${module.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground mb-4">{module.description}</p>

              {/* Topics */}
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

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button className="flex-1 group-hover:scale-105 transition-transform">
                  <Play className="mr-2 h-4 w-4" />
                  {module.progress > 0 ? "Continuar" : "Comenzar"}
                </Button>
                <Button variant="outline" size="icon">
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
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
    </section>
  );
};