
import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
  isOpen: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Processing your documents...", 
  isOpen 
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-slate-800 mb-2">Please wait</h3>
        <p className="text-slate-600">{message}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
