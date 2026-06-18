import { useEffect, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";
import { StatusAlert } from "@/components/StatusAlert";
import { getTactos } from "@/lib/api";

export default function ConsultarTactos() {
  useEffect(() => { document.title = "Consultar Tactos — RodeoApp"; }, []);
  return <ConsultarTactosBody />;
}

type Tacto = {
  id_tacto: string;
  caravana: string;
  fecha_tacto: string;
  resultado: "positivo" | "negativo";
  dias_gestacion_estimados: number | null;
  fecha_probable_parto: string | null;
  observaciones: string;
};

function ConsultarTactosBody() {
  const [filters, setFilters] = useState({ caravana: "", resultado: "todos", desde: "", hasta: "" });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Tacto[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [empty, setEmpty] = useState(false);

  async function buscar() {
    setLoading(true); setError(null); setEmpty(false);
    const params: Record<string, string> = {};
    if (filters.caravana) params.caravana = filters.caravana.trim();
    if (filters.resultado && filters.resultado !== "todos") params.resultado = filters.resultado;
    if (filters.desde) params.desde = filters.desde;
    if (filters.hasta) params.hasta = filters.hasta;
    try {
      const { status, json } = await getTactos(params);
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

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Consultar Tactos" subtitle="Filtrar y revisar tactos registrados." />

      <div className="surface-card p-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-1.5">
            <Label htmlFor="f-car">Caravana</Label>
            <Input id="f-car" value={filters.caravana} onChange={(e) => setFilters((f) => ({ ...f, caravana: e.target.value }))} placeholder="Ej: A-1024" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="f-res">Resultado</Label>
            <Select value={filters.resultado} onValueChange={(v) => setFilters((f) => ({ ...f, resultado: v }))}>
              <SelectTrigger id="f-res"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="positivo">Positivo</SelectItem>
                <SelectItem value="negativo">Negativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="f-d">Desde</Label>
            <Input id="f-d" type="date" value={filters.desde} onChange={(e) => setFilters((f) => ({ ...f, desde: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="f-h">Hasta</Label>
            <Input id="f-h" type="date" value={filters.hasta} onChange={(e) => setFilters((f) => ({ ...f, hasta: e.target.value }))} />
          </div>
          <div className="flex items-end">
            <Button onClick={buscar} disabled={loading} className="w-full">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              Buscar
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {error && <StatusAlert variant="error">{error}</StatusAlert>}

        {loading && (
          <div className="flex items-center gap-2 rounded-md border border-border bg-card p-6 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Buscando...
          </div>
        )}

        {!loading && empty && (
          <div className="rounded-md border border-border bg-card p-6 text-center text-sm text-muted-foreground">
            No se encontraron tactos con esos filtros.
          </div>
        )}

        {!loading && data && data.length > 0 && (
          <div className="surface-card overflow-x-auto">
            <table className="table-striped w-full text-sm">
              <thead className="bg-primary/10 text-left text-xs uppercase tracking-wide text-primary">

                <tr>
                  <th className="px-3 py-2">ID Tacto</th>
                  <th className="px-3 py-2">Caravana</th>
                  <th className="px-3 py-2">Fecha</th>
                  <th className="px-3 py-2">Resultado</th>
                  <th className="px-3 py-2">Días gest.</th>
                  <th className="px-3 py-2">Fecha prob. parto</th>
                  <th className="px-3 py-2">Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {data.map((t) => (
                  <tr key={t.id_tacto} className="border-t border-border/60">
                    <td className="px-3 py-2 font-mono text-xs">{t.id_tacto}</td>
                    <td className="px-3 py-2 font-medium">{t.caravana}</td>
                    <td className="px-3 py-2">{t.fecha_tacto}</td>
                    <td className="px-3 py-2">
                      {t.resultado === "positivo" ? (
                        <Badge className="bg-[#4A5E1A] text-white hover:bg-[#4A5E1A]">Positivo</Badge>
                      ) : (
                        <Badge className="bg-[#9BA8A3] text-white hover:bg-[#9BA8A3]">Negativo</Badge>
                      )}
                    </td>
                    <td className="px-3 py-2">{t.dias_gestacion_estimados ?? "—"}</td>
                    <td className="px-3 py-2">{t.resultado === "positivo" ? t.fecha_probable_parto ?? "—" : "—"}</td>
                    <td className="px-3 py-2 text-muted-foreground">{t.observaciones || "—"}</td>
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
