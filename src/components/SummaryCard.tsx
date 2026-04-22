import { Card } from "./ui";

function formatValue(value: string | number) {
  return typeof value === "number" ? value.toFixed(1) : value;
}

export function SummaryCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
}) {
  return (
    <Card className="p-4">
      <div className="text-sm text-[var(--text-muted)]">{title}</div>

      <div className="mt-2 text-3xl font-semibold text-[var(--text-main)]">
        {formatValue(value)}
      </div>

      {subtitle ? (
        <div className="mt-2 text-sm text-[var(--text-muted)]">{subtitle}</div>
      ) : null}
    </Card>
  );
}