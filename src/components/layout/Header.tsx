
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2" onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
          <img src="/lovable-uploads/a868b9c0-a265-4983-86f4-3c67b7127c4a.png" alt="DigiClaim Logo" className="h-8" />
          <h1 className="text-xl font-semibold text-slate-800">Figure Management System</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
