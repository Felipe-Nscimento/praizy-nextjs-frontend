type StatsCardProps = {
  title: string;
  value: string;
};

export function StatsCard({
  title,
  value,
}: StatsCardProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <h2 className="text-zinc-400 text-sm">
        {title}
      </h2>

      <p className="text-3xl font-bold mt-2">
        {value}
      </p>
    </div>
  );
}