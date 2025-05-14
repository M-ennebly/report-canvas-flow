
import KpiCard from "./KpiCard";

const KpiSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <KpiCard
        title="Total Projects Created"
        value="24"
        subtitle="Across all clients"
      />
      <KpiCard
        title="Reports Generated"
        value="16"
        subtitle="Ready for submission"
      />
      <KpiCard
        title="Projects In Progress"
        value="6"
        subtitle="Not yet finalized"
      />
      <KpiCard
        title="Average Time to Complete"
        value="3.2 days"
        subtitle="Based on last 10 projects"
      />
    </div>
  );
};

export default KpiSection;
