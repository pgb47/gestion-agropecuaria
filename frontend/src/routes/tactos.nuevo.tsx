import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/PageHeader";
import { StatusAlert } from "@/components/StatusAlert";
import { postTacto } from "@/lib/api";

export default function NuevoTactoPage() {
  useEffect(() => { document.title = "Registrar Tacto — RodeoApp"; }, []);
  return <NuevoTacto />;
}

type Alert = { variant: "success" | "error" | "warning"; msg: React.ReactNode } | null;

const EMPTY = {
  caravana: "",
  fecha_tacto: "",
  resultado: "",
  dias_gestacion_estimados: "",
  observaciones: "",
};

const CARAVANA_REGEX = /^[A-Z]-\d{3,4}$/;

function NuevoTacto() {
  const [form, setForm] = useState({ ...EMPTY });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<Alert>(null);
  const [caravanaError, setCaravanaError] = useState<string | null>(null);

  const positivo = form.resultado === "positivo";

  function update<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAlert(null);

    if (!form.caravana || !form.fecha_tacto || !form.resultado) {
      setAlert({ variant: "error", msg: "Hay campos incompletos o con valores inválidos." });
      return;
    }
    if (!CARAVANA_REGEX.test(form.caravana.trim())) {
      setCaravanaError("Formato de caravana inválido. Debe ser una letra, un guión y 3 o 4 números. Ejemplo: A-1001");
      return;
    }
    setCaravanaError(null);
    if (positivo) {
      const n = Number(form.dias_gestacion_estimados);
      if (!n || n < 30 || n > 283) {
        setAlert({ variant: "error", msg: "Hay campos incompletos o con valores inválidos." });
        return;
      }
    }

    const body: any = {
      caravana: form.caravana.trim(),
      fecha_tacto: form.fecha_tacto,
      resultado: form.resultado,
      observaciones: form.observaciones || undefined,
    };
    if (positivo) body.dias_gestacion_estimados = Number(form.dias_gestacion_estimados);

    setLoading(true);
    try {
      const { status, json } = await postTacto(body);
      const backendMsg = json?.error?.message;
      if (status === 201) {
        const fpp = json?.data?.fecha_probable_parto;
        setAlert({
          variant: "success",
          msg: (
            <div>
              {json?.message || "Tacto registrado."}
              {positivo && fpp ? (
                <div className="mt-1 text-xs">Fecha probable de parto: <strong>{fpp}</strong></div>
              ) : null}
            </div>
          ),
        });
        setForm({ ...EMPTY });
        setCaravanaError(null);
      } else if (status === 404 && json?.error?.code === "CARAVANA_NOT_FOUND") {
        setAlert({ variant: "error", msg: backendMsg || "La caravana ingresada no existe en el rodeo. Verificá el número e intentá de nuevo." });
      } else if (status === 400) {
        setAlert({ variant: "error", msg: backendMsg || "Hay campos incompletos o con valores inválidos." });
      } else {
        setAlert({ variant: "error", msg: backendMsg || "Ocurrió un error al conectar con el servidor." });
      }
    } catch {
      setAlert({ variant: "error", msg: "Error de conexión con el servidor. Contactá al equipo de backend." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Registrar Tacto"
        subtitle="Cargar un nuevo tacto rectal."
        onBack={() => { setForm({ ...EMPTY }); setAlert(null); setCaravanaError(null); }}
        backLabel="Volver / Limpiar"
      />
      <form onSubmit={onSubmit} className="surface-card space-y-5 p-6">

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="caravana">Caravana<span className="req"> *</span></Label>
            <Input id="caravana" value={form.caravana} onChange={(e) => { setCaravanaError(null); update("caravana", e.target.value.toUpperCase()); }} placeholder="A-1024" required />
            {caravanaError && <p className="text-sm text-destructive">{caravanaError}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="fecha_tacto">Fecha del tacto<span className="req"> *</span></Label>
            <Input id="fecha_tacto" type="date" value={form.fecha_tacto} onChange={(e) => update("fecha_tacto", e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="resultado">Resultado<span className="req"> *</span></Label>
            <Select value={form.resultado} onValueChange={(v) => update("resultado", v)}>
              <SelectTrigger id="resultado"><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="positivo">Positivo</SelectItem>
                <SelectItem value="negativo">Negativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {positivo && (
            <div className="space-y-1.5">
              <Label htmlFor="dias">Días de gestación estimados<span className="req"> *</span></Label>
              <Input id="dias" type="number" min={30} max={283} value={form.dias_gestacion_estimados}
                onChange={(e) => update("dias_gestacion_estimados", e.target.value)} required />
            </div>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="obs">Observaciones</Label>
          <Textarea id="obs" rows={3} value={form.observaciones} onChange={(e) => update("observaciones", e.target.value)} />
        </div>

        {alert && <StatusAlert variant={alert.variant}>{alert.msg}</StatusAlert>}

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Registrar tacto
          </Button>
        </div>
      </form>
    </div>
  );
}
