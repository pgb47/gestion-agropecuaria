import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function PageHeader({
  title,
  subtitle,
  backTo = "/",
  backLabel = "Volver al inicio",
}: {
  title: string;
  subtitle?: string;
  backTo?: string;
  onBack?: () => void;
  backLabel?: string;
}) {
  return (
    <div className="mb-6">
      <div className="mb-4">
        <Link
          to={backTo}
          className="inline-flex items-center gap-1.5 rounded-md border border-accent/30 bg-card px-3 py-1.5 text-sm font-medium text-accent shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>
      </div>
      <div className="border-b-2 border-accent/30 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
        {subtitle ? <p className="mt-1.5 text-sm text-foreground/70">{subtitle}</p> : null}
      </div>
    </div>
  );
}
