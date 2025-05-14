
import { BarChart, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart className="h-7 w-7 text-kanban-analyse" />
          <h1 className="text-xl font-semibold text-slate-800">Figure Management System</h1>
        </div>
        <Button variant="ghost" className="text-slate-600 hover:text-slate-900" onClick={() => navigate("/workspace/bulk")}>
          Dashboard
          <MoveRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
