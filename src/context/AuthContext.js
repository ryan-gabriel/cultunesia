// src/context/AuthContext.js
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null); // simpan profile user
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);

      if (data.session?.user) {
        // ambil data profile user
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("full_name, image_url") // ambil field yang perlu
          .eq("id", data.session.user.id)
          .single();

        if (!error) {
          setProfile(profileData);
        }
      }

      setLoading(false);
    }

    loadUser();

    // Subscribe ke perubahan auth
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);

        if (session?.user) {
          const { data: profileData, error } = await supabase
            .from("profiles")
            .select("full_name, avatar_url, username")
            .eq("id", session.user.id)
            .single();

          if (!error) setProfile(profileData);
        } else {
          setProfile(null);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [router]);

  return (
    <AuthContext.Provider value={{ session, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
