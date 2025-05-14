
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Workspace from "@/pages/Workspace";
import ReportPage from "@/pages/ReportPage";
import Dashboard from "@/pages/Dashboard";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/workspace/:uploadType" element={<Workspace />} />
        <Route path="/workspace/:uploadType/:labelId" element={<Workspace />} />
        <Route path="/report/:projectId" element={<ReportPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
