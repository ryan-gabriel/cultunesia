// contoh data
// {
//   "foods": [
//     {
//       "id": 2,
//       "name": "asdasd",
//       "description": "<p>sdasdasd</p>",
//       "image_url": "https://rdmrruoujekrgxrejigz.supabase.co/storage/v1/object/public/general/provinces/jawa-barat-1759052268642.png",
//       "created_at": "2025-09-28T09:37:49.866714",
//       "province_slug": "jawa-barat"
//     }
//   ]
// }

"use client";

import Navbar from "@/components/Navbar/Navbar";
import React, { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Food({ data }) {
  const [selectedFood, setSelectedFood] = useState(data.foods[0] || null);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-amber-200/50 dark:border-gray-700/50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Traditional Food Heritage
            </h1>
            <span className="text-sm text-amber-600 dark:text-amber-500 font-medium hidden sm:inline">
              {data.foods.length} Dishes
            </span>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <Accordion
              type="single"
              collapsible
              defaultValue="foods"
              className="sticky top-24"
            >
              <AccordionItem value="foods">
                <AccordionTrigger className="text-lg font-semibold">
                  Browse Dishes
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto mt-2">
                    {data.foods.map((food) => (
                      <Button
                        key={food.id}
                        variant={
                          selectedFood?.id === food.id ? "default" : "outline"
                        }
                        onClick={() => setSelectedFood(food)}
                        className={`w-full text-left justify-start h-fit rounded-xl transition-all duration-300 ${
                          selectedFood?.id === food.id
                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md"
                            : ""
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden">
                            <img
                              src={food.image_url}
                              alt={food.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{food.name}</p>
                            <p className="text-xs truncate text-gray-500 dark:text-gray-300">
                              {food.province_slug
                                .replace(/-/g, " ")
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </p>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-8 xl:col-span-9">
            {selectedFood ? (
              <Card className="overflow-hidden shadow-xl">
                {/* Hero Image */}
                <div className="relative h-64 sm:h-80 lg:h-96 bg-gray-100 dark:bg-gray-700">
                  <img
                    src={selectedFood.image_url}
                    alt={selectedFood.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                      {selectedFood.name}
                    </h1>
                    <p className="text-amber-100 text-sm sm:text-base">
                      {new Date(selectedFood.created_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>

                <CardContent>
                  <div
                    className="prose prose-lg dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: selectedFood.description,
                    }}
                  />
                </CardContent>
              </Card>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-16 text-center border border-amber-100 dark:border-gray-700">
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  No traditional foods to display yet
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
