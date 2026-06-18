import { useEffect, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/PageHeader";
import { StatusAlert } from "@/components/StatusAlert";
import { getParicionesEstimadas } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function ProximasParicionesPage() {
  useEffect(() => { document.title = "Próximas Pariciones — RodeoApp"; }, []);
  return <ProximasPariciones />;
}

type Row = {
  caravana: string;
  fecha_tacto: string;
  dias_gestacion_estimados: number;
  fecha_probable_parto: string;
  dias_restantes: number;
};

function isoToday() {
  return new Date().toISOString().slice(0, 10);
}
function isoPlus(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function ProximasPariciones() {
  const [desde, setDesde] = useState(isoToday());
  const [hasta, setHasta] = useState(isoPlus(30));
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [empty, setEmpty] = useState(false);

  async function consultar() {
    setLoading(true); setError(null); setEmpty(false);
    try {
      const { status, json } = await getParicionesEstimadas({ desde, hasta });
      if (status >= 200 && status < 300) {
        setData(json.data || []);
        setEmpty((json.count ?? json.data?.length ?? 0) === 0);
      } else {
        setError("Ocurrió un error al conectar con el servidor.");
      }
    } catch {
      setError("Error de conexión con el servidor. Contactá al equipo de backend.");
    } finally {
      setLoading(false);
    }
  }

  function pillClass(d: number) {
    if (d < 10) return "bg-[#C0392B] text-white";
    if (d <= 30) return "bg-[#D4813A] text-white";
    return "bg-[#4A5E1A] text-white";
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Próximas Pariciones" subtitle="Vacas próximas a parir según rango de fechas." />

      <div className="surface-card p-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="d">Desde</Label>
            <Input id="d" type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="h">Hasta</Label>
            <Input id="h" type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
          </div>
          <div className="flex items-end">
            <Button onClick={consultar} disabled={loading} className="w-full">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              Consultar
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {error && <StatusAlert variant="error">{error}</StatusAlert>}

        {loading && (
          <div className="flex items-center gap-2 rounded-md border border-border bg-card p-6 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Consultando...
          </div>
        )}

        {!loading && empty && (
          <div className="rounded-md border border-border bg-card p-6 text-center text-sm text-muted-foreground">
            No hay pariciones estimadas en ese período.
          </div>
        )}

        {!loading && data && data.length > 0 && (
          <div className="surface-card overflow-x-auto">
            <table className="table-striped w-full text-sm">
              <thead className="bg-primary/10 text-left text-xs uppercase tracking-wide text-primary">
                <tr>
                  <th className="px-3 py-2">Caravana</th>
                  <th className="px-3 py-2">Fecha del tacto</th>
                  <th className="px-3 py-2">Días gestación</th>
                  <th className="px-3 py-2">Fecha probable parto</th>
                  <th className="px-3 py-2">Días restantes</th>
                </tr>
              </thead>
              <tbody>
                {data.map((r) => (
                  <tr key={r.caravana + r.fecha_probable_parto} className="border-t border-border/60">

                    <td className="px-3 py-2 font-medium">{r.caravana}</td>
                    <td className="px-3 py-2">{r.fecha_tacto}</td>
                    <td className="px-3 py-2">{r.dias_gestacion_estimados}</td>
                    <td className="px-3 py-2">{r.fecha_probable_parto}</td>
                    <td className="px-3 py-2">
                      <span className={cn("inline-flex min-w-10 justify-center rounded-full px-2.5 py-0.5 text-xs font-medium", pillClass(r.dias_restantes))}>
                        {r.dias_restantes} d
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
