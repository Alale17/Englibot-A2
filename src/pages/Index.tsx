import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ChatSection } from "@/components/ChatSection";
import { ModulesSection } from "@/components/ModulesSection";
import { TestsSection } from "@/components/TestsSection";
import { ProgressSection } from "@/components/ProgressSection";
import { AboutSection } from "@/components/AboutSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ChatSection />
        <ModulesSection />
        <TestsSection />
        <ProgressSection />
        <AboutSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
