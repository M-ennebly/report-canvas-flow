
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Document } from "@/types";

import Header from "@/components/layout/Header";
import HeroSection from "@/components/landing/HeroSection";
import EnhancedUploadSection from "@/components/upload/EnhancedUploadSection";

const LandingPage = () => {
  const navigate = useNavigate();
  
  // Separate state for bulk and label uploads
  const [bulkFiles, setBulkFiles] = useState<FileList | null>(null);
  const [bulkDocuments, setBulkDocuments] = useState<Document[]>([]);
  
  const [labelFiles, setLabelFiles] = useState<FileList | null>(null);
  const [labelDocuments, setLabelDocuments] = useState<Document[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  
  const handleBulkUpload = (files: FileList) => {
    // Convert FileList to Document[] for preview
    const newDocs: Document[] = Array.from(files).map(file => ({
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: file.name.split(".").pop() || "unknown",
      url: URL.createObjectURL(file),
      dateUploaded: new Date().toISOString(),
    }));
    
    setBulkFiles(files);
    // Append new documents to existing ones instead of replacing
    setBulkDocuments(prevDocs => [...prevDocs, ...newDocs]);
    toast.success(`${files.length} document(s) selected`);
  };

  const handleLabelUpload = (files: FileList, labelId: string) => {
    // Convert FileList to Document[] for preview
    const newDocs: Document[] = Array.from(files).map(file => ({
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: file.name.split(".").pop() || "unknown",
      url: URL.createObjectURL(file),
      dateUploaded: new Date().toISOString(),
      label: labelId, // Add the label to the document
    }));
    
    setLabelFiles(files);
    // Append new documents to existing ones instead of replacing
    setLabelDocuments(prevDocs => [...prevDocs, ...newDocs]);
    
    if (!selectedLabels.includes(labelId)) {
      setSelectedLabels([...selectedLabels, labelId]);
    }
    toast.success(`${files.length} document(s) selected for ${labelId}`);
  };

  const handleProcessFiles = (uploadType: 'bulk' | 'label') => {
    if (uploadType === 'bulk' && bulkDocuments.length === 0) {
      toast.error("Please select at least one file to upload");
      return;
    }

    if (uploadType === 'label' && labelDocuments.length === 0) {
      toast.error("Please select at least one file to upload");
      return;
    }

    if (uploadType === 'label' && selectedLabels.length === 0) {
      toast.error("Please select at least one label");
      return;
    }

    setIsLoading(true);

    // Store the appropriate documents in sessionStorage and navigate immediately
    if (uploadType === 'bulk') {
      sessionStorage.setItem('uploadedDocuments', JSON.stringify(bulkDocuments));
      navigate("/workspace/bulk");
    } else {
      sessionStorage.setItem('uploadedDocuments', JSON.stringify(labelDocuments));
      sessionStorage.setItem('selectedLabels', JSON.stringify(selectedLabels));
      navigate(`/workspace/label/${selectedLabels[0]}`);
    }
  };

  const removeBulkDocument = (docId: string) => {
    setBulkDocuments(prevDocs => prevDocs.filter(doc => doc.id !== docId));
    
    // If we've removed all documents, clear the selected files
    if (bulkDocuments.length <= 1) {
      setBulkFiles(null);
    }
  };

  const removeLabelDocument = (docId: string) => {
    setLabelDocuments(prevDocs => prevDocs.filter(doc => doc.id !== docId));
    
    // If we've removed all documents, clear the selected files
    if (labelDocuments.length <= 1) {
      setLabelFiles(null);
    }
  };

  const scrollToUpload = () => {
    const uploadSection = document.getElementById('upload');
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      <Header />
      <HeroSection onGetStartedClick={scrollToUpload} />
      <EnhancedUploadSection 
        bulkFiles={bulkFiles}
        setBulkFiles={setBulkFiles}
        bulkDocuments={bulkDocuments}
        setBulkDocuments={setBulkDocuments}
        labelFiles={labelFiles}
        setLabelFiles={setLabelFiles}
        labelDocuments={labelDocuments}
        setLabelDocuments={setLabelDocuments}
        isLoading={isLoading}
        selectedLabels={selectedLabels}
        setSelectedLabels={setSelectedLabels}
        handleBulkUpload={handleBulkUpload}
        handleLabelUpload={handleLabelUpload}
        handleProcessFiles={handleProcessFiles}
        removeBulkDocument={removeBulkDocument}
        removeLabelDocument={removeLabelDocument}
      />
    </div>
  );
};

export default LandingPage;
