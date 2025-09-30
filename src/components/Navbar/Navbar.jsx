"use client";

import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import Navigation from "./Navigation";
import { ThemeProvider } from "@/context/ThemeProvider";

const Navbar = () => {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="system" storageKey="cultunesia-theme">
        <Navigation />
      </ThemeProvider>
    </AuthProvider>
  );
};

export default Navbar;
