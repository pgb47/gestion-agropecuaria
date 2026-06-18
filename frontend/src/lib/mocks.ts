// Mock responses for use while API_BASE points to PENDING_N8N_HOST.

export function mockPostTacto(body: any) {
  if (!body?.caravana || !body?.fecha_tacto || !body?.resultado) {
    return {
      status: 400,
      json: { ok: false, error: { code: "VALIDATION_ERROR", message: "Campos inválidos" } },
    };
  }
  if (String(body.caravana).toUpperCase().startsWith("X")) {
    return {
      status: 404,
      json: { ok: false, error: { code: "CARAVANA_NOT_FOUND", message: "No existe" } },
    };
  }
  const positivo = body.resultado === "positivo";
  let fecha_probable_parto: string | null = null;
  if (positivo && body.dias_gestacion_estimados) {
    const d = new Date(body.fecha_tacto);
    d.setDate(d.getDate() + (283 - Number(body.dias_gestacion_estimados)));
    fecha_probable_parto = d.toISOString().slice(0, 10);
  }
  return {
    status: 201,
    json: {
      ok: true,
      data: {
        id_tacto: "t_" + Math.floor(Math.random() * 900000 + 100000),
        caravana: body.caravana,
        fecha_tacto: body.fecha_tacto,
        resultado: body.resultado,
        dias_gestacion_estimados: positivo ? body.dias_gestacion_estimados : null,
        fecha_probable_parto,
        observaciones: body.observaciones || "",
        creado_en: new Date().toISOString(),
      },
      message: "Tacto registrado. Reporte enviado por correo.",
    },
  };
}

export function mockPostParicion(body: any) {
  if (!body?.caravana || !body?.fecha_paricion || !body?.sexo_cria || !body?.peso_nacer) {
    return {
      status: 400,
      json: { ok: false, error: { code: "VALIDATION_ERROR", message: "Campos inválidos" } },
    };
  }
  if (String(body.caravana).toUpperCase().startsWith("X")) {
    return {
      status: 404,
      json: { ok: false, error: { code: "CARAVANA_NOT_FOUND", message: "No existe" } },
    };
  }
  if (String(body.caravana).toUpperCase().startsWith("Z")) {
    return {
      status: 409,
      json: { ok: false, error: { code: "TACTO_POSITIVO_REQUERIDO", message: "Sin tacto positivo previo" } },
    };
  }
  return {
    status: 201,
    json: {
      ok: true,
      data: {
        id_paricion: "p_" + Math.floor(Math.random() * 900000 + 100000),
        caravana: body.caravana,
        fecha_paricion: body.fecha_paricion,
        sexo_cria: body.sexo_cria,
        peso_nacer: body.peso_nacer,
        caravana_cria: body.caravana_cria || null,
        observaciones: body.observaciones || "",
        creado_en: new Date().toISOString(),
      },
      message: "Parición registrada. Reporte enviado por correo.",
    },
  };
}

const tactosBase = [
  {
    id_tacto: "t_000123",
    caravana: "A-1024",
    fecha_tacto: "2026-06-09",
    resultado: "positivo",
    dias_gestacion_estimados: 60,
    fecha_probable_parto: "2027-01-18",
    observaciones: "Ecografía, feto único",
    creado_en: "2026-06-09T14:32:00Z",
  },
  {
    id_tacto: "t_000124",
    caravana: "B-0312",
    fecha_tacto: "2026-06-08",
    resultado: "negativo",
    dias_gestacion_estimados: null,
    fecha_probable_parto: null,
    observaciones: "",
    creado_en: "2026-06-08T10:00:00Z",
  },
  {
    id_tacto: "t_000125",
    caravana: "C-0088",
    fecha_tacto: "2026-05-20",
    resultado: "positivo",
    dias_gestacion_estimados: 90,
    fecha_probable_parto: "2026-12-28",
    observaciones: "Buen estado general",
    creado_en: "2026-05-20T09:00:00Z",
  },
];

export function mockGetTactos(params: URLSearchParams) {
  let data = [...tactosBase];
  const car = params.get("caravana");
  const res = params.get("resultado");
  const desde = params.get("desde");
  const hasta = params.get("hasta");
  if (car) data = data.filter((t) => t.caravana.toLowerCase().includes(car.toLowerCase()));
  if (res) data = data.filter((t) => t.resultado === res);
  if (desde) data = data.filter((t) => t.fecha_tacto >= desde);
  if (hasta) data = data.filter((t) => t.fecha_tacto <= hasta);
  return { status: 200, json: { ok: true, data, count: data.length } };
}

export function mockGetParicionesEstimadas(params: URLSearchParams) {
  const desde = params.get("desde");
  const hasta = params.get("hasta");
  const today = new Date();
  const base = [
    { caravana: "A-1024", fecha_tacto: "2026-06-09", dias_gestacion_estimados: 60, fecha_probable_parto: "2027-01-18" },
    { caravana: "C-0088", fecha_tacto: "2026-05-20", dias_gestacion_estimados: 90, fecha_probable_parto: "2026-12-28" },
    { caravana: "D-0451", fecha_tacto: "2026-06-01", dias_gestacion_estimados: 200, fecha_probable_parto: addDaysISO(today, 8) },
    { caravana: "E-0777", fecha_tacto: "2026-06-02", dias_gestacion_estimados: 180, fecha_probable_parto: addDaysISO(today, 20) },
    { caravana: "F-0902", fecha_tacto: "2026-06-03", dias_gestacion_estimados: 120, fecha_probable_parto: addDaysISO(today, 60) },
  ];
  let data = base
    .map((r) => ({ ...r, dias_restantes: daysBetween(today, new Date(r.fecha_probable_parto)) }))
    .filter((r) => (!desde || r.fecha_probable_parto >= desde) && (!hasta || r.fecha_probable_parto <= hasta));
  return { status: 200, json: { ok: true, data, count: data.length } };
}

function addDaysISO(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x.toISOString().slice(0, 10);
}
function daysBetween(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}
