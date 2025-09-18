"use client"

import { useAuth } from "@/context/AuthContext";
import React from "react";

const page = () => {
  const { session, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!session) return null; // sudah otomatis redirect

  return <div>dashboard</div>;
};

export default page;
