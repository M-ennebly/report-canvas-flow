
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Kanban, List, FolderTree } from "lucide-react";

interface ViewSwitcherProps {
  viewMode: "kanban" | "list" | "tree";
  onViewChange: (value: "kanban" | "list" | "tree") => void; 
}

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ viewMode, onViewChange }) => {
  return (
    <Tabs 
      value={viewMode} 
      onValueChange={(value) => onViewChange(value as "kanban" | "list" | "tree")} 
      className="mt-2 md:mt-0"
    >
      <TabsList>
        <TabsTrigger value="kanban">
          <Kanban className="h-4 w-4 mr-1" /> Kanban
        </TabsTrigger>
        <TabsTrigger value="list">
          <List className="h-4 w-4 mr-1" /> List
        </TabsTrigger>
        <TabsTrigger value="tree">
          <FolderTree className="h-4 w-4 mr-1" /> Tree
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ViewSwitcher;
