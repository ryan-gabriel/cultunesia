"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

const NoUserLogin = () => {
  return (
    <div className="w-full flex items-center justify-center min-h-[60vh] px-4">
      <Card className="w-full max-w-md text-center shadow-md border border-border">
        <CardContent className="flex flex-col items-center space-y-4 py-10">
          {/* Icon */}
          <div className="p-4 rounded-full bg-primary-gold/10">
            <Lock className="w-10 h-10 text-[color:var(--color-primary-gold)]" />
          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold text-foreground">
            Anda harus login terlebih dahulu
          </h2>

          {/* Subtitle */}
          <p className="text-sm text-muted-foreground">
            Untuk mengakses quiz, silakan masuk ke akun Anda.
          </p>

          {/* Button */}
          <Link href="/login" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-[color:var(--color-primary-gold)] text-white hover:opacity-90 transition">
              Login
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoUserLogin;
