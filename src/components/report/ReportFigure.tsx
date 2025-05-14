
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Figure } from "@/types";

interface ReportFigureProps {
  figure: Figure;
}

const ReportFigure = ({ figure }: ReportFigureProps) => {
  return (
    <div 
      id={`figure-${figure.id}`}
      className="grid md:grid-cols-2 gap-6 pb-6 border-b last:border-0 scroll-mt-24"
    >
      <div className="aspect-ratio-wrapper">
        <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-md border bg-slate-100">
          <img
            src={figure.imageUrl}
            alt={figure.title}
            className="h-full w-full object-cover"
          />
        </AspectRatio>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{figure.title}</h3>
        <p className="text-slate-700">{figure.description}</p>
      </div>
    </div>
  );
};

export default ReportFigure;
