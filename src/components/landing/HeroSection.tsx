
import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onGetStartedClick: () => void;
}

const HeroSection = ({ onGetStartedClick }: HeroSectionProps) => {
  return (
    <section className="relative bg-gradient-to-r from-slate-800 to-slate-900 py-16 text-white overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="inline-block bg-gradient-to-r from-kanban-design to-kanban-analyse bg-clip-text text-transparent text-lg font-medium mb-2 rounded-full">
              Streamline Your Consulting Workflow
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Intelligent Figure Management for Consultants
            </h1>
            <p className="text-lg text-slate-300 max-w-lg">
              Transform how you organize and utilize figures from documents with our intuitive kanban workflow system. Save time, increase productivity, and deliver exceptional reports.
            </p>
            <div>
              <Button className="bg-kanban-analyse hover:bg-kanban-analyse/90 text-white" size="lg" onClick={onGetStartedClick}>
                Get Started
                <MoveRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="hidden md:block relative">
            <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-2xl relative bg-white/10 backdrop-blur-sm border border-white/10 p-4">
              <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-kanban-design via-kanban-analyse to-kanban-dev"></div>
              <div className="absolute top-4 left-4 right-4 h-8 bg-slate-700/50 rounded flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-kanban-design"></div>
                <div className="w-3 h-3 rounded-full bg-kanban-analyse"></div>
                <div className="w-3 h-3 rounded-full bg-kanban-dev"></div>
                <div className="text-sm text-white/70">Figure Management Dashboard</div>
              </div>
              <div className="absolute top-16 inset-x-4 bottom-4 grid grid-cols-3 gap-4 opacity-70">
                <div className="bg-slate-800/50 rounded-md p-3">
                  <div className="h-4 w-3/4 bg-white/20 rounded mb-3"></div>
                  <div className="h-20 bg-kanban-design/30 rounded mb-2"></div>
                  <div className="h-20 bg-kanban-design/20 rounded"></div>
                </div>
                <div className="bg-slate-800/50 rounded-md p-3">
                  <div className="h-4 w-3/4 bg-white/20 rounded mb-3"></div>
                  <div className="h-20 bg-kanban-analyse/30 rounded mb-2"></div>
                  <div className="h-20 bg-kanban-analyse/20 rounded"></div>
                </div>
                <div className="bg-slate-800/50 rounded-md p-3">
                  <div className="h-4 w-3/4 bg-white/20 rounded mb-3"></div>
                  <div className="h-20 bg-kanban-dev/30 rounded mb-2"></div>
                  <div className="h-20 bg-kanban-dev/20 rounded"></div>
                </div>
              </div>
            </div>
            <div className="absolute -top-8 -right-8 w-40 h-40 bg-kanban-design/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-kanban-analyse/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-slate-50 to-transparent"></div>
    </section>
  );
};

export default HeroSection;
