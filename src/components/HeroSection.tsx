import { MessageCircle, Play, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import heroImage from "@/assets/hero-english-learning.jpg";

export const HeroSection = () => {
  const scrollToChat = () => {
    const chatElement = document.getElementById("chat");
    if (chatElement) {
      chatElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-hero/90"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          {/* Main heading */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
              ¡Aprende Inglés A1!
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-4 animate-fade-in">
              Con tu asistente virtual personalizado
            </p>
            <p className="text-lg text-white/80 max-w-2xl mx-auto animate-fade-in">
              Aprende inglés básico de forma fácil, interactiva y divertida. Tu IA personal te guiará paso a paso.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in">
            <Button 
              variant="hero" 
              size="lg"
              onClick={scrollToChat}
              className="group"
            >
              <MessageCircle className="mr-2 h-5 w-5 group-hover:animate-bounce" />
              ¡Comenzar Ahora!
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <Play className="mr-2 h-5 w-5" />
              Ver Demo
            </Button>
          </div>

          {/* Feature cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-fade-in">
            <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Star className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Personalizado</h3>
              <p className="text-white/80">IA que se adapta a tu ritmo de aprendizaje</p>
            </Card>

            <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4 mx-auto">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Interactivo</h3>
              <p className="text-white/80">Conversa en tiempo real con tu asistente</p>
            </Card>

            <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <div className="w-12 h-12 bg-learning-beginner rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Play className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Progresivo</h3>
              <p className="text-white/80">Desde cero hasta nivel A1 completo</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};