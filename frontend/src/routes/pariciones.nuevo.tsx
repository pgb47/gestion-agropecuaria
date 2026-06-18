import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/PageHeader";
import { StatusAlert } from "@/components/StatusAlert";
import { postParicion } from "@/lib/api";

export default function NuevoParicionPage() {
  useEffect(() => { document.title = "Registrar Parición — RodeoApp"; }, []);
  return <NuevaParicion />;
}

type Alert = { variant: "success" | "error" | "warning"; msg: React.ReactNode } | null;

const EMPTY = {
  caravana: "",
  fecha_paricion: "",
  sexo_cria: "",
  peso_nacer: "",
  caravana_cria: "",
  observaciones: "",
};

const CARAVANA_REGEX = /^[A-Z]-\d{3,4}$/;

function NuevaParicion() {
  const [form, setForm] = useState({ ...EMPTY });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<Alert>(null);
  const [caravanaError, setCaravanaError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAlert(null);

    const peso = Number(form.peso_nacer);
    if (!form.caravana || !form.fecha_paricion || !form.sexo_cria || !peso || peso < 15 || peso > 60) {
      setAlert({ variant: "error", msg: "Hay campos incompletos o con valores inválidos." });
      return;
    }
    if (!CARAVANA_REGEX.test(form.caravana.trim())) {
      setCaravanaError("Formato de caravana inválido. Debe ser una letra, un guión y 3 o 4 números. Ejemplo: A-1001");
      return;
    }
    setCaravanaError(null);

    const body: any = {
      caravana: form.caravana.trim(),
      fecha_paricion: form.fecha_paricion,
      sexo_cria: form.sexo_cria,
      peso_nacer: peso,
      caravana_cria: form.caravana_cria || undefined,
      observaciones: form.observaciones || undefined,
    };

    setLoading(true);
    try {
      const { status, json } = await postParicion(body);
      const backendMsg = json?.error?.message;
      if (status === 201) {
        setAlert({ variant: "success", msg: json?.message || "Parición registrada." });
        setForm({ ...EMPTY });
        setCaravanaError(null);
      } else if (status === 404 && json?.error?.code === "CARAVANA_NOT_FOUND") {
        setAlert({ variant: "error", msg: backendMsg || "La caravana ingresada no existe en el rodeo. Verificá el número e intentá de nuevo." });
      } else if (status === 409 && json?.error?.code === "TACTO_POSITIVO_REQUERIDO") {
        setAlert({ variant: "warning", msg: backendMsg || "Esta vaca no tiene un tacto positivo previo registrado. No se puede registrar la parición." });
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
        title="Registrar Parición"
        subtitle="Cargar parto y datos de la cría."
        onBack={() => { setForm({ ...EMPTY }); setAlert(null); setCaravanaError(null); }}
        backLabel="Volver / Limpiar"
      />
      <form onSubmit={onSubmit} className="surface-card space-y-5 p-6">

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="caravana">Caravana de la madre<span className="req"> *</span></Label>
            <Input id="caravana" value={form.caravana} onChange={(e) => { setCaravanaError(null); update("caravana", e.target.value.toUpperCase()); }} required />
            {caravanaError && <p className="text-sm text-destructive">{caravanaError}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="fecha">Fecha de la parición<span className="req"> *</span></Label>
            <Input id="fecha" type="date" value={form.fecha_paricion} onChange={(e) => update("fecha_paricion", e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sexo">Sexo de la cría<span className="req"> *</span></Label>
            <Select value={form.sexo_cria} onValueChange={(v) => update("sexo_cria", v)}>
              <SelectTrigger id="sexo"><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Macho</SelectItem>
                <SelectItem value="H">Hembra</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="peso">Peso al nacer (kg)<span className="req"> *</span></Label>
            <Input id="peso" type="number" min={15} max={60} step="0.1" value={form.peso_nacer}
              onChange={(e) => update("peso_nacer", e.target.value)} required />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="cria">Caravana de la cría</Label>
            <Input id="cria" value={form.caravana_cria} onChange={(e) => update("caravana_cria", e.target.value)} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="obs">Observaciones</Label>
          <Textarea id="obs" rows={3} value={form.observaciones} onChange={(e) => update("observaciones", e.target.value)} />
        </div>

        {alert && <StatusAlert variant={alert.variant}>{alert.msg}</StatusAlert>}

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Registrar parición
          </Button>
        </div>
      </form>
    </div>
  );
}
