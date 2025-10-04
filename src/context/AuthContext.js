// src/context/AuthContext.js
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null); // simpan profile user
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 🔑 Fungsi untuk mengambil dan mengatur profile
  const fetchProfile = useCallback(async (user) => {
    if (!user) {
      setProfile(null);
      return;
    }

    const { data: profileData, error } = await supabase
      .from("profiles")
      .select("full_name, avatar_url, username, role")
      .eq("id", user.id)
      .single();

    if (!error) {
      setProfile(profileData);
    } else {
      console.error("Error fetching profile:", error);
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    async function loadUserAndSession() {
      // 1. Coba memuat sesi dari cookies (Ini akan memuat sesi 30 hari jika cookie ada)
      const {
        data: { session: initialSession },
      } = await supabase.auth.getSession();
      setSession(initialSession);

      if (initialSession?.user) {
        // Sesi ditemukan, ambil profile
        await fetchProfile(initialSession.user);
      } else {
        // Jika tidak ada sesi yang dimuat, hapus flag rememberMe di localStorage
        // Ini penting jika cookie 30 hari sudah kadaluarsa (atau tidak ada)
        localStorage.removeItem("rememberMe");
      }

      setLoading(false);
    }

    loadUserAndSession();

    // 2. Subscribe ke perubahan auth
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);

        // Pada event LOGOUT, bersihkan state dan localStorage flag
        if (event === "SIGNED_OUT" || event === "USER_DELETED") {
          setProfile(null);
          localStorage.removeItem("rememberMe"); // 🔑 Pastikan flag dihapus saat logout
          setLoading(false);
          return;
        }

        // Pada event SIGNED_IN atau TOKEN_REFRESHED
        if (session?.user) {
          await fetchProfile(session.user);
        } else {
          setProfile(null);
        }

        setLoading(false);
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [fetchProfile]); // `router` tidak diperlukan di dependency array karena tidak digunakan di dalam callback

  return (
    <AuthContext.Provider value={{ session, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
