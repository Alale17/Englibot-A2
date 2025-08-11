import { Bot, Brain, Users, Zap, Shield, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const AboutSection = () => {
  const features = [
    {
      icon: Brain,
      title: "Inteligencia Artificial Avanzada",
      description: "Nuestro asistente utiliza IA de última generación para adaptar el aprendizaje a tu ritmo y estilo personal."
    },
    {
      icon: Users,
      title: "Aprendizaje Personalizado",
      description: "Cada sesión se adapta a tus fortalezas y áreas de mejora, creando una experiencia única para ti."
    },
    {
      icon: Zap,
      title: "Resultados Rápidos",
      description: "Metodología probada que te ayuda a alcanzar el nivel A2 de inglés de manera eficiente y efectiva."
    },
    {
      icon: Shield,
      title: "Seguro y Privado",
      description: "Tus datos están protegidos. El aprendizaje es completamente privado y personalizado."
    },
    {
      icon: Globe,
      title: "Disponible 24/7",
      description: "Aprende cuando quieras, donde quieras. Tu asistente virtual está siempre disponible."
    },
    {
      icon: Bot,
      title: "Interacción Natural",
      description: "Conversa de forma natural con el asistente, como si fuera un tutor humano real."
    }
  ];

  const benefits = [
    "Aprende a tu propio ritmo sin presiones",
    "Recibe retroalimentación instantánea",
    "Acceso a contenido multimedia interactivo",
    "Progreso medible y logros gamificados",
    "Práctica de conversación sin vergüenza",
    "Fundamentos sólidos para continuar avanzando"
  ];

  return (
    <section id="about" className="pt-0 pb-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            ¿Qué es EngliBot A2?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Tu asistente virtual de inglés diseñado específicamente para llevarte desde cero hasta el nivel A2 
            del Marco Común Europeo de Referencia para las Lenguas.
          </p>
        </div>

        {/* Main Description */}
        <Card className="p-8 mb-12 bg-gradient-primary text-primary-foreground">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Propósito del Proyecto</h3>
              <p className="text-lg opacity-90 mb-6">
                EngliBot A2 es una herramienta educativa innovadora que combina inteligencia artificial 
                con metodologías pedagógicas comprobadas para hacer que aprender inglés sea accesible, 
                divertido y efectivo para principiantes absolutos.
              </p>
              <div className="space-y-2 text-sm">
                <p>✨ Creado para estudiantes hispanohablantes</p>
                <p>🎯 Enfocado en fundamentos sólidos del idioma</p>
                <p>🚀 Tecnología de vanguardia al servicio de la educación</p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center animate-bounce-gentle">
                <Bot className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
        </Card>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-card transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Beneficios para el Estudiante
            </h3>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                  <div className="w-6 h-6 bg-learning-complete rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <p className="text-muted-foreground">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          <Card className="p-8 bg-gradient-success text-secondary-foreground">
            <h3 className="text-xl font-bold mb-4 text-white">¿Por qué Nivel A2?</h3>
            <div className="space-y-4 text-white/90">
              <p className="text-sm">
                El nivel A2 es el segundo escalón del aprendizaje de idiomas. Al completarlo, serás capaz de:
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Entender y usar expresiones cotidianas básicas</li>
                <li>• Presentarte y presentar a otros</li>
                <li>• Hacer preguntas simples sobre temas familiares</li>
                <li>• Interactuar de manera básica con hablantes nativos</li>
              </ul>
              <div className="mt-6 pt-4 border-t border-white/20">
                <p className="text-xs opacity-80">
                  Certificado por el Marco Común Europeo de Referencia (MCER)
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};