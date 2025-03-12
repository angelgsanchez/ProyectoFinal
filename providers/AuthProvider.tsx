// app/providers/AuthProvider.tsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { Session } from "@supabase/supabase-js";
import { router } from "expo-router";
import { supabase } from "@/lib/supabaseClient";

type AuthData = {
  loading: boolean;
  session: Session | null;
};

const AuthContext = createContext<AuthData>({
  loading: true,
  session: null,
});

interface Props {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: Props) {
  const [loading, setLoading] = useState<boolean>(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    async function fetchSession() {
      // Obtiene la sesión actual
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error al obtener la sesión:", error.message);
      }
      if (data.session) {
        setSession(data.session);
      } else {
        // Redirige a /signin si no hay sesión
        router.replace("/signin" as never);
      }
      setLoading(false);
    }

    fetchSession();

    // Escucha cambios en el estado de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_, session) => {
      setSession(session);
      setLoading(false);
      if (session) {
        router.replace("/" as never);
      } else {
        router.replace("/signin" as never);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ loading, session }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
