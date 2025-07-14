import { Bot, Mail, Github, ExternalLink, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  const quickLinks = [
    { name: "Inicio", href: "#home" },
    { name: "Asistente", href: "#chat" },
    { name: "Módulos", href: "#modules" },
    { name: "Evaluaciones", href: "#tests" },
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
    <footer className="bg-card border-t">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">EngliBot A1</h3>
                <p className="text-xs text-muted-foreground">Tu asistente de inglés</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              La forma más inteligente y divertida de aprender inglés básico. 
              Tecnología de IA al servicio de tu educación.
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Mail className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Navegación</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Recursos</h4>
            <ul className="space-y-2">
              {resources.map((resource, index) => (
                <li key={index}>
                  <a
                    href={resource.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {resource.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* University Info */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Proyecto Universitario</h4>
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Universidad Ejemplo</p>
                <p>Facultad de Ingeniería</p>
                <p>Carrera de Sistemas</p>
              </div>
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Contacto Académico</p>
                <p>profesor@universidad.edu</p>
                <p>estudiante@universidad.edu</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2024 EngliBot A1. Todos los derechos reservados.
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Hecho con</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>para la educación</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};