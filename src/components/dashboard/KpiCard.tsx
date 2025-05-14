
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface KpiCardProps {
  title: string;
  value: string;
  subtitle: string;
  className?: string;
}

const KpiCard = ({ title, value, subtitle, className }: KpiCardProps) => {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardContent className="p-6 flex flex-col justify-between h-full">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className="mt-2">
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default KpiCard;
