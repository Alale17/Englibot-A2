import { Star, Quote, MessageSquare, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export const TestimonialsSection = () => {
  const [feedback, setFeedback] = useState({ name: "", email: "", message: "" });

  const testimonials = [
    {
      name: "Oriana Delgado",
      role: "Estudiante Universitaria",
      avatar: "MG",
      rating: 5,
      comment: "EngliBot me ayudó a superar mi miedo de hablar inglés. El asistente virtual es muy paciente y las lecciones están muy bien estructuradas. ¡En solo 3 meses pasé de cero a nivel A2!",
      course: "Vocabulario y Gramática"
    },
    {
      name: "Danilo Miranda",
      role: "Estudiante Universitario",
      avatar: "CR",
      rating: 5,
      comment: "Como desarrollador, aprecio mucho la tecnología detrás de esta aplicación. La IA realmente se adapta a mi ritmo de aprendizaje y me mantiene motivado con el sistema de logros.",
      course: "Comprensión Auditiva"
    },
    {
      name: "Amadaney Liu",
      role: "Estudiante Universitaria",
      avatar: "AL",
      rating: 4,
      comment: "Perfecto para estudiar en mis ratos libreS. El asistente virtual está disponible 24/7, lo cual es ideal para mi horario irregular.",
      course: "Módulo Completo A2"
    },
    {
      name: "Ivan Hernandez",
      role: "Estudiante Universitario",
      avatar: "RS",
      rating: 5,
      comment: "Me encanta que sea interactiva y me motiva a seguir estudiando. Mis padres están muy contentos con mi progreso en inglés.",
      course: "Pronunciación y Vocabulario"
    }
  ];

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the feedback to a server
    console.log("Feedback submitted:", feedback);
    setFeedback({ name: "", email: "", message: "" });
    // Show success message
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Lo que Dicen Nuestros Estudiantes
          </h2>
          <p className="text-xl text-muted-foreground">
            Testimonios reales de personas que han transformado su inglés con EngliBot A2
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 hover:shadow-card transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              {/* Header */}
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                  {testimonial.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{testimonial.name}</h3>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < testimonial.rating ? 'text-accent fill-current' : 'text-muted'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Quote */}
              <div className="relative">
                <Quote className="h-8 w-8 text-muted absolute -top-2 -left-2 opacity-20" />
                <p className="text-muted-foreground italic pl-6 mb-4">
                  "{testimonial.comment}"
                </p>
              </div>

              {/* Course Info */}
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Curso completado:</p>
                <p className="text-sm font-medium text-foreground">{testimonial.course}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* 
        <Card className="p-8 mb-16 bg-gradient-success text-white text-center">
          <h3 className="text-2xl font-bold mb-6">Resultados que Hablan por Sí Solos</h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-sm opacity-90">Estudiantes Activos</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">95%</div>
              <div className="text-sm opacity-90">Tasa de Satisfacción</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">3.2</div>
              <div className="text-sm opacity-90">Meses Promedio A2</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-sm opacity-90">Soporte IA</div>
            </div>
          </div>
        </Card> */}

        {/* Feedback Form */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-4">
              ¿Ya Probaste EngliBot?
            </h3>
            <p className="text-muted-foreground mb-6">
              Nos encantaría conocer tu experiencia. Tus comentarios nos ayudan a mejorar 
              continuamente y crear una mejor experiencia de aprendizaje para todos.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Tu opinión es valiosa para nosotros
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Star className="h-5 w-5 text-accent" />
                <span className="text-sm text-muted-foreground">
                  Ayudas a otros estudiantes a decidirse
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Send className="h-5 w-5 text-secondary" />
                <span className="text-sm text-muted-foreground">
                  Responderemos a tus sugerencias
                </span>
              </div>
            </div>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Comparte tu Experiencia
            </h3>
            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Nombre</label>
                  <Input
                    value={feedback.name}
                    onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
                    placeholder="Tu nombre"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <Input
                    type="email"
                    value={feedback.email}
                    onChange={(e) => setFeedback({ ...feedback, email: e.target.value })}
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground">Tu experiencia</label>
                <Textarea
                  value={feedback.message}
                  onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
                  placeholder="Cuéntanos qué te parece EngliBot A2..."
                  rows={4}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Enviar Testimonio
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};