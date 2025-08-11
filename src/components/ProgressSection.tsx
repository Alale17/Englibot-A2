import { TrendingUp, Award, Calendar, Target, BookOpen, Clock, Star, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";


export const ProgressSection = () => {
/*   const stats = [

    
    {
      label: "Días estudiando",
      value: "23",
      icon: Calendar,
      color: "bg-primary",
      change: "+5 esta semana",
    },
    {
      label: "Lecciones completadas",
      value: "47",
      icon: BookOpen,
      color: "bg-learning-complete",
      change: "+8 esta semana",
    },
    {
      label: "Tiempo total",
      value: "12h",
      icon: Clock,
      color: "bg-accent",
      change: "+3h esta semana",
    },
    {
      label: "Evaluaciones",
      value: "8",
      icon: Target,
      color: "bg-learning-intermediate",
      change: "+2 esta semana",
    },
  ];

  const weeklyProgress = [
    { day: "Lun", completed: 3, target: 4 },
    { day: "Mar", completed: 4, target: 4 },
    { day: "Mié", completed: 2, target: 4 },
    { day: "Jue", completed: 4, target: 4 },
    { day: "Vie", completed: 3, target: 4 },
    { day: "Sáb", completed: 1, target: 4 },
    { day: "Dom", completed: 0, target: 4 },
  ];

  const skillLevels = [
    { skill: "Vocabulario", level: 75, color: "bg-learning-beginner" },
    { skill: "Gramática", level: 60, color: "bg-learning-intermediate" },
    { skill: "Comprensión", level: 45, color: "bg-learning-advanced" },
    { skill: "Pronunciación", level: 30, color: "bg-accent" },
  ];

  const recentAchievements = [
    {
      title: "Vocabulario Maestro",
      description: "Aprendiste 50 palabras nuevas",
      date: "Hace 2 días",
      icon: Star,
    },
    {
      title: "Estudiante Constante",
      description: "7 días consecutivos estudiando",
      date: "Hace 1 semana",
      icon: Award,
    },
    {
      title: "Primer Quiz",
      description: "Completaste tu primera evaluación",
      date: "Hace 2 semanas",
      icon: Target,
    },
  ];

  return (
    <section id="progress" className="py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Tu Progreso de Aprendizaje
          </h2>
          <p className="text-xl text-muted-foreground">
            Revisa tus estadísticas y celebra tus logros
          </p>
        </div>

  
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 hover:shadow-card transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <TrendingUp className="h-4 w-4 text-learning-complete" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                <p className="text-xs text-learning-complete">{stat.change}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
         
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              Progreso Semanal
            </h3>
            <div className="space-y-4">
              {weeklyProgress.map((day, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-foreground w-8">{day.day}</span>
                  <div className="flex-1 flex items-center space-x-2">
                    <div className="flex-1 bg-muted rounded-full h-3 relative">
                      <div 
                        className="h-3 bg-gradient-primary rounded-full transition-all duration-500"
                        style={{ width: `${(day.completed / day.target) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-muted-foreground w-12">
                      {day.completed}/{day.target}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-learning-complete/10 rounded-lg">
              <p className="text-sm text-learning-complete font-medium">
                ¡Excelente! Has mantenido una buena rutina esta semana.
              </p>
            </div>
          </Card>

    
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              Nivel por Habilidades
            </h3>
            <div className="space-y-6">
              {skillLevels.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{skill.skill}</span>
                    <Badge variant="outline" className="bg-muted">
                      {skill.level}%
                    </Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${skill.color} transition-all duration-500`}
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">Nivel General A2</p>
              <div className="text-2xl font-bold text-primary">57%</div>
            </div>
          </Card>
        </div>

      
        <Card className="p-6 mt-8">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
            <Award className="h-5 w-5 mr-2 text-accent" />
            Logros Recientes
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {recentAchievements.map((achievement, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="p-2 bg-accent rounded-lg text-white">
                  <achievement.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground text-sm">{achievement.title}</h4>
                  <p className="text-xs text-muted-foreground mb-1">{achievement.description}</p>
                  <p className="text-xs text-muted-foreground">{achievement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
   */
};