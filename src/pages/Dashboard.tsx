
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import KpiSection from "@/components/dashboard/KpiSection";
import ProjectList from "@/components/dashboard/ProjectList";
import NewProjectModal from "@/components/dashboard/NewProjectModal";
import Header from "@/components/layout/Header";

const Dashboard = () => {
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">DigiClaim Dashboard</h1>
            <p className="text-slate-500 mt-1">Create and manage your projects below</p>
          </div>
          <Button 
            className="mt-4 md:mt-0"
            onClick={() => setIsNewProjectModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
        
        <KpiSection />
        
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Your Projects</h2>
          <ProjectList />
        </div>
      </main>
      
      <NewProjectModal 
        isOpen={isNewProjectModalOpen}
        onOpenChange={setIsNewProjectModalOpen}
      />
    </div>
  );
};

export default Dashboard;
