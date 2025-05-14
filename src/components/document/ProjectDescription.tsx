
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

interface ProjectDescriptionProps {
  initialDescription: string;
  onDescriptionChange: (description: string) => void;
}

const ProjectDescription: React.FC<ProjectDescriptionProps> = ({
  initialDescription,
  onDescriptionChange
}) => {
  const [description, setDescription] = useState(initialDescription || "");

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    onDescriptionChange(e.target.value);
  };

  return (
    <div>
      <Textarea
        value={description}
        onChange={handleDescriptionChange}
        placeholder="Describe your project here..."
        className="resize-none h-32 border-slate-200 focus-visible:ring-blue-500"
      />
      <p className="text-xs text-slate-500 mt-2">
        This description will be used in the report overview section.
      </p>
    </div>
  );
};

export default ProjectDescription;
