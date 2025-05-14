
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import HeroSection from "@/components/landing/HeroSection";

const LandingPage = () => {
  const navigate = useNavigate();
  
  const navigateToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      <Header />
      <HeroSection onGetStartedClick={navigateToDashboard} />
    </div>
  );
};

export default LandingPage;
