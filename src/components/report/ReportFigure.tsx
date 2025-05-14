
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Figure } from "@/types";
import { Badge } from "@/components/ui/badge";

interface ReportFigureProps {
  figure: Figure;
}

const ReportFigure = ({ figure }: ReportFigureProps) => {
  return (
    <div 
      id={`figure-${figure.id}`}
      className="grid md:grid-cols-2 gap-6 pb-6 border-b last:border-0 scroll-mt-24"
    >
      <div className="aspect-ratio-wrapper shadow-sm rounded-md overflow-hidden">
        <AspectRatio ratio={16 / 9} className="bg-slate-100 border">
          <img
            src={figure.imageUrl}
            alt={figure.title}
            className="h-full w-full object-cover"
          />
        </AspectRatio>
        
        {/* Show document reference if available */}
        {figure.documentId && figure.pageNumber && (
          <div className="mt-2 text-xs text-slate-500 flex items-center">
            <span className="mr-2">From document • Page {figure.pageNumber}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{figure.title}</h3>
        <p className="text-slate-700">{figure.description}</p>
        
        {/* Add badges for additional context */}
        <div className="flex gap-2 flex-wrap">
          {figure.documentId && (
            <Badge variant="outline" className="bg-slate-100">
              Document reference
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportFigure;
