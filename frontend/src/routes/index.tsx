import { Link } from "react-router-dom";
import { useEffect } from "react";
import { ClipboardCheck, Baby, Search, CalendarClock } from "lucide-react";

export default function Index() {
  useEffect(() => { document.title = "RodeoApp — Inicio"; }, []);
  return <IndexBody />;
}

const cards = [
  { title: "Registrar Tacto", url: "/tactos/nuevo", icon: ClipboardCheck, desc: "Cargar un nuevo tacto rectal." },
  { title: "Registrar Parición", url: "/pariciones/nuevo", icon: Baby, desc: "Cargar parto y datos de la cría." },
  { title: "Consultar Tactos", url: "/tactos", icon: Search, desc: "Buscar tactos por caravana o fecha." },
  { title: "Próximas Pariciones", url: "/pariciones-estimadas", icon: CalendarClock, desc: "Ver vacas próximas a parir." },
];

function IndexBody() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Panel de operaciones</h1>
        <p className="mt-2 text-sm text-foreground/70">Seleccioná una sección para comenzar.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {cards.map((c) => (
          <Link key={c.url} to={c.url} className="dash-card group block p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-md">
                <c.icon className="h-7 w-7" />
              </div>
              <div className="min-w-0">
                <div className="text-lg font-semibold">{c.title}</div>
                <div className="mt-1 text-sm text-white/85">{c.desc}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
