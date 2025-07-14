import { Bot, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { id: "home", label: "Inicio" },
  { id: "chat", label: "Asistente" },
  { id: "modules", label: "Módulos" },
  { id: "tests", label: "Evaluaciones" },
  { id: "progress", label: "Progreso" },
  { id: "about", label: "Información" },
];

export const Header = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 w-full bg-card/95 backdrop-blur-sm border-b shadow-card z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-primary rounded-lg shadow-glow">
              <Bot className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">EngliBot A1</h1>
              <p className="text-xs text-muted-foreground">Tu asistente de inglés</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => scrollToSection(item.id)}
                className="hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};