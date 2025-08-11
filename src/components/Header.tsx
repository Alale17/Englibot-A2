import { Bot, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { id: "home", label: "Inicio" },
  { id: "chat", label: "Asistente" },
  { id: "modules", label: "Módulos" },
  { id: "tests", label: "¿Que es?" },

];

export const Header = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-black/70 backdrop-blur-md border-b border-white/10 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo e Identidad */}
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl shadow-md bg-gradient-to-tr from-emerald-500 to-green-400">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">EngliBot A2</h1>
              <p className="text-xs text-white/70">Tu asistente de inglés</p>
            </div>
          </div>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => scrollToSection(item.id)}
                className="text-white hover:bg-emerald-600/20 hover:text-emerald-300 transition-all"
              >
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Menú Móvil */}
          <Button variant="ghost" size="icon" className="md:hidden text-white">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
