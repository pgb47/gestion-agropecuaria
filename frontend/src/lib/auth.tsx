import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type AuthCtx = {
  user: string | null;
  login: (u: string, p: string) => boolean;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

const USER = "admin";
const PASS = "rodeo2026";

// Module-level store so the session survives any remount of the provider
// (e.g. during route transitions / SSR hydration). It only resets on full
// page reload, exactly as requested.
let currentUser: string | null = null;
const listeners = new Set<(u: string | null) => void>();
function setCurrentUser(u: string | null) {
  currentUser = u;
  listeners.forEach((l) => l(u));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(currentUser);

  useEffect(() => {
    const l = (u: string | null) => setUser(u);
    listeners.add(l);
    setUser(currentUser);
    return () => {
      listeners.delete(l);
    };
  }, []);

  function login(u: string, p: string) {
    if (u === USER && p === PASS) {
      setCurrentUser(u);
      return true;
    }
    return false;
  }
  function logout() {
    setCurrentUser(null);
  }
  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}
