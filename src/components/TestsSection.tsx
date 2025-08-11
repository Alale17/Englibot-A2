import { Brain, CheckCircle, Clock, Trophy, Star, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const TestsSection = () => {
  const tests = [
    {
      /* id: 1,
      title: "Quiz de Vocabulario Básico",
      description: "Evalúa tu conocimiento de palabras esenciales",
      questions: 15,
      timeLimit: "10 min",
      difficulty: "Principiante",
      lastScore: 85,
      completed: true,
      icon: Brain, */
    },
    {
     /*  id: 2,
      title: "Gramática: Presente Simple",
      description: "Pon a prueba tu comprensión del presente simple",
      questions: 12,
      timeLimit: "8 min",
      difficulty: "Principiante",
      lastScore: 72,
      completed: true,
      icon: CheckCircle, */
    },
    {
     /*  id: 3,
      title: "Comprensión Auditiva A2",
      description: "Escucha y responde preguntas sobre diálogos simples",
      questions: 10,
      timeLimit: "15 min",
      difficulty: "Intermedio",
      lastScore: null,
      completed: false,
      icon: Clock, */
    },
    {
     /*  id: 4,
      title: "Examen Integral A2",
      description: "Evaluación completa de todos los módulos",
      questions: 25,
      timeLimit: "20 min",
      difficulty: "Intermedio",
      lastScore: null,
      completed: false,
      icon: Trophy, */
    },
  ];

  const achievements = [
    /* { title: "Primera Evaluación", description: "Completa tu primer quiz", earned: true },
    { title: "Puntuación Perfecta", description: "Obtén 100% en cualquier quiz", earned: false },
    { title: "Estudiante Constante", description: "Completa 5 evaluaciones", earned: false },
    { title: "Maestro A2", description: "Completa el examen integral", earned: false }, */
  ];

  /* const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Principiante": return "bg-learning-beginner";
      case "Intermedio": return "bg-learning-intermediate";
      case "Avanzado": return "bg-learning-advanced";
      default: return "bg-muted";
    }
  }; */

  /* const getScoreColor = (score: number) => {
    if (score >= 80) return "text-learning-complete";
    if (score >= 60) return "text-learning-intermediate";
    return "text-destructive";
  };
 */
  return (
    <section id="tests" className="py-20 bg-background">
      {/* <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Evaluaciones y Pruebas
          </h2>
          <p className="text-xl text-muted-foreground">
            Pon a prueba tus conocimientos y recibe retroalimentación personalizada
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            {tests.map((test, index) => (
              <Card key={test.id} className="p-6 hover:shadow-card transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`p-3 rounded-lg ${getDifficultyColor(test.difficulty)} text-white`}>
                      <test.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{test.title}</h3>
                        {test.completed && (
                          <Badge className="bg-learning-complete text-white">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completado
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-3">{test.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{test.questions} preguntas</span>
                        <span>•</span>
                        <span>{test.timeLimit}</span>
                        <span>•</span>
                        <Badge variant="outline" className={getDifficultyColor(test.difficulty) + " text-white border-0"}>
                          {test.difficulty}
                        </Badge>
                      </div>

                      {test.lastScore && (
                        <div className="mt-3">
                          <span className="text-sm text-muted-foreground">Última puntuación: </span>
                          <span className={`font-semibold ${getScoreColor(test.lastScore)}`}>
                            {test.lastScore}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Button size="sm" className="min-w-[100px]">
                      <Play className="h-4 w-4 mr-2" />
                      {test.completed ? "Repetir" : "Comenzar"}
                    </Button>
                    {test.completed && (
                      <Button variant="outline" size="sm">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Revisar
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-accent" />
                Logros
              </h3>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${achievement.earned ? 'bg-learning-complete/10 border-learning-complete/30' : 'bg-muted/50 border-muted'}`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <Star className={`h-4 w-4 ${achievement.earned ? 'text-learning-complete' : 'text-muted-foreground'}`} />
                      <h4 className={`font-medium text-sm ${achievement.earned ? 'text-learning-complete' : 'text-muted-foreground'}`}>
                        {achievement.title}
                      </h4>
                    </div>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-gradient-motivation text-accent-foreground">
              <h3 className="text-lg font-semibold mb-2">¡Sigue practicando!</h3>
              <p className="text-sm opacity-90 mb-4">
                Completa más evaluaciones para desbloquear nuevos logros y mejorar tu nivel de inglés.
              </p>
              <Button variant="secondary" size="sm" className="w-full">
                Ver Estadísticas Completas
              </Button>
            </Card>
          </div>
        </div>
      </div> */}
    </section>
  );
};