"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarX } from "lucide-react";

const NoQuizToday = () => {
  return (
    <Card className="w-full max-w-md mx-auto text-center py-10 shadow-sm mt-10">
      <CardContent className="flex flex-col items-center space-y-4">
        <CalendarX className="w-12 h-12 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Tidak ada quiz hari ini</h2>
        <p className="text-sm text-muted-foreground">
          Silakan kembali besok untuk mengikuti quiz harian berikutnya.
        </p>
      </CardContent>
    </Card>
  );
};

export default NoQuizToday;
