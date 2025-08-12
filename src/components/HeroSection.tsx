import { MessageCircle, Play, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import heroVideo from "../assets/hero-bg.mp4";

export const HeroSection = () => {
  const scrollToChat = () => {
    const chatElement = document.getElementById("chat");
    if (chatElement) {
      chatElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 🎬 Video de fondo */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={heroVideo} type="video/mp4" />
        Tu navegador no soporta videos en background.
      </video>

      {/* Overlay para mejorar contraste */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-0" />

      {/* Contenido visible */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 text-white">
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg">
            ¡Aprende Inglés A2!
          </h1>
          <p className="text-xl md:text-2xl text-indigo-200 mb-4">
            Con tu asistente virtual personalizado
          </p>
          <p className="text-lg text-indigo-100 max-w-2xl mx-auto">
            Aprende inglés básico de forma fácil, interactiva y divertida. Tu IA personal te guiará paso a paso.
          </p>
        </div>

        {/* Botones CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
          <Button
            variant="default"
            size="lg"
            onClick={scrollToChat}
            className="group bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg"
          >
            <MessageCircle className="mr-2 h-5 w-5 group-hover:animate-pulse" />
            ¡Comenzar Ahora!
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="border border-white/30 text-white hover:bg-white/10"
          >
            <Play className="mr-2 h-5 w-5" />
            Ver Demo
          </Button>
        </div>

        {/* Tarjetas */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="p-6 bg-white/10 border border-white/20 rounded-xl text-white shadow-lg">
            <div className="w-14 h-14 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Star className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Personalizado</h3>
            <p className="text-white/80 text-center">
              IA que se adapta a tu ritmo de aprendizaje
            </p>
          </Card>

          <Card className="p-6 bg-white/10 border border-white/20 rounded-xl text-white shadow-lg">
            <div className="w-14 h-14 bg-gradient-to-tr from-blue-500 to-sky-400 rounded-full flex items-center justify-center mb-4 mx-auto">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Interactivo</h3>
            <p className="text-white/80 text-center">
              Conversa en tiempo real con tu asistente
            </p>
          </Card>

          <Card className="p-6 bg-white/10 border border-white/20 rounded-xl text-white shadow-lg">
            <div className="w-14 h-14 bg-gradient-to-tr from-emerald-500 to-lime-400 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Play className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Progresivo</h3>
            <p className="text-white/80 text-center">
              Desde cero hasta nivel A2 completo
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};