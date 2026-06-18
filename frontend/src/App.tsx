import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LogOut } from "lucide-react";

import { AuthProvider, useAuth } from "@/lib/auth";
import { LoginScreen } from "@/components/LoginScreen";
import { Button } from "@/components/ui/button";

import Index from "@/routes/index";
import TactosIndex from "@/routes/tactos.index";
import TactosNuevo from "@/routes/tactos.nuevo";
import ParicionesNuevo from "@/routes/pariciones.nuevo";
import ParicionesEstimadas from "@/routes/pariciones-estimadas";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AuthGate />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function AuthGate() {
  const { user, logout } = useAuth();
  if (!user) return <LoginScreen />;
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="flex h-14 items-center gap-3 border-b border-accent/20 bg-primary px-5 text-primary-foreground shadow-sm">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-accent text-sm font-bold text-accent-foreground">
            R
          </div>
          <span className="text-sm font-semibold tracking-wide">RodeoApp</span>
        </Link>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs opacity-90">
            Sesión: <span className="font-medium">{user}</span>
          </span>
          <Button variant="secondary" size="sm" onClick={logout}>
            <LogOut className="mr-1.5 h-3.5 w-3.5" />
            Salir
          </Button>
        </div>
      </header>
      <main className="flex-1 p-6 sm:p-8">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tactos" element={<TactosIndex />} />
          <Route path="/tactos/nuevo" element={<TactosNuevo />} />
          <Route path="/pariciones/nuevo" element={<ParicionesNuevo />} />
          <Route path="/pariciones-estimadas" element={<ParicionesEstimadas />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
