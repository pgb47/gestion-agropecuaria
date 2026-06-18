import { useState } from "react";
import { Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusAlert } from "@/components/StatusAlert";
import { useAuth } from "@/lib/auth";

export function LoginScreen() {
  const { login } = useAuth();
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(false);
    setLoading(true);
    const ok = login(u.trim(), p);
    if (!ok) {
      setErr(true);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-2xl font-bold text-primary-foreground shadow-md">
            R
          </div>
          <h1 className="text-2xl font-semibold text-foreground">RodeoApp</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gestión reproductiva</p>
        </div>
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-lg"
        >
          <div className="space-y-1.5">
            <Label htmlFor="user">Usuario</Label>
            <Input id="user" autoFocus value={u} onChange={(e) => setU(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pass">Contraseña</Label>
            <Input
              id="pass"
              type="password"
              value={p}
              onChange={(e) => setP(e.target.value)}
              required
            />
          </div>
          {err && <StatusAlert variant="error">Usuario o contraseña incorrectos</StatusAlert>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogIn className="mr-2 h-4 w-4" />
            )}
            Ingresar
          </Button>
        </form>
      </div>
    </div>
  );
}
