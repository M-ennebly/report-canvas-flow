
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LinkedReportSelectorProps {
  linkedReportId: string | undefined;
  onLinkedReportChange: (reportId: string) => void;
}

const LinkedReportSelector: React.FC<LinkedReportSelectorProps> = ({
  linkedReportId,
  onLinkedReportChange
}) => {
  // For demo purposes only
  const availableReports = [
    { id: "report1", name: "Q1 2024 Market Analysis" },
    { id: "report2", name: "Product Strategy 2024" },
    { id: "report3", name: "Client Onboarding Review" },
  ];

  return (
    <div>
      <Select
        value={linkedReportId || "none"}
        onValueChange={onLinkedReportChange}
      >
        <SelectTrigger className="border-slate-200 focus:ring-blue-500">
          <SelectValue placeholder="Select a report" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          {availableReports.map((report) => (
            <SelectItem key={report.id} value={report.id}>
              {report.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-slate-500 mt-2">
        Connect this project to an existing report for easier reference.
      </p>
    </div>
  );
};

export default LinkedReportSelector;
