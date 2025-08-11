import { Bot, Mail, Github, ExternalLink, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  const quickLinks = [
    { name: "Inicio", href: "#home" },
    { name: "Asistente", href: "#chat" },
    { name: "Módulos", href: "#modules" },
    { name: "¿Que es?", href: "#tests" },
  ];

  const resources = [
    { name: "Guía de Usuario", href: "#" },
    { name: "Preguntas Frecuentes", href: "#" },
    { name: "Términos de Uso", href: "#" },
    { name: "Política de Privacidad", href: "#" },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-gradient-to-tr from-gray-900 via-black to-gray-950 text-white pt-16 pb-10 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-tr from-emerald-500 to-green-400 rounded-xl shadow-md">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">EngliBot A2</h3>
                <p className="text-xs text-white/70">Tu asistente de inglés</p>
              </div>
            </div>
            <p className="text-sm text-white/70 mb-6 leading-relaxed">
              La forma más inteligente y divertida de aprender inglés básico.
              Tecnología de IA al servicio de tu educación.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="bg-white/10 hover:bg-white/20 text-white">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="bg-white/10 hover:bg-white/20 text-white">
                <Mail className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="bg-white/10 hover:bg-white/20 text-white">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Navegación */}
          <div>
            <h4 className="font-semibold text-white mb-4">Navegación</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-sm text-white/70 hover:text-emerald-400 transition"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h4 className="font-semibold text-white mb-4">Recursos</h4>
            <ul className="space-y-2">
              {resources.map((resource, index) => (
                <li key={index}>
                  <a
                    href={resource.href}
                    className="text-sm text-white/70 hover:text-emerald-400 transition"
                  >
                    {resource.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Info Académica */}
          <div>
            <h4 className="font-semibold text-white mb-4">Proyecto Universitario</h4>
            <div className="space-y-4 text-sm text-white/70">
              <div>
                <p className="font-medium text-white">Universidad Estatal del Sur de Manabí</p>
                <p>Facultad de Ingeniería</p>
                <p>Carrera de Tecnologías de la Información</p>
              </div>
              <div>
                <p className="font-medium text-white">Contacto Académico</p>
                <p>mendoza-javier4418@unesum.edu.ec</p>
                <p>miranda-roberth0691@unesum.edu.ec</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm text-white/60 gap-4">
          <p>© 2025 EngliBot A2. Todos los derechos reservados.</p>
          <div className="flex items-center gap-1">
            <span>Hecho con</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>para la educación</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
