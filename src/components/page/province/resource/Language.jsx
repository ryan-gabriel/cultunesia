// contoh data
// {
//   "languages": [
//     {
//       "id": 1,
//       "name": "asasd",
//       "description": "<p>aswdaf</p>",
//       "created_at": "2025-09-28T09:45:45.298996",
//       "province_slug": "jawa-barat"
//     }
//   ]
// }

"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Language = ({ data }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(data.languages[0] || null);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-amber-200/50 dark:border-gray-700/50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Local Language Heritage
            </h1>
            <span className="text-sm text-amber-600 dark:text-amber-500 font-medium hidden sm:inline">
              {data.languages.length} Languages
            </span>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <Accordion
              type="single"
              collapsible
              defaultValue="languages" // <- default terbuka
              className="sticky top-24"
            >
              <AccordionItem value="languages">
                <AccordionTrigger className="text-lg font-semibold">
                  Browse Languages
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto mt-2">
                    {data.languages.map((lang) => (
                      <Button
                        key={lang.id}
                        variant={selectedLanguage?.id === lang.id ? "default" : "outline"}
                        onClick={() => setSelectedLanguage(lang)}
                        className={`w-full text-left justify-start h-fit rounded-xl transition-all duration-300 ${
                          selectedLanguage?.id === lang.id
                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md"
                            : ""
                        }`}
                      >
                        <div className="flex flex-col">
                          <p className="font-medium truncate">{lang.name}</p>
                          <p className="text-xs truncate text-gray-500 dark:text-gray-300">
                            {lang.province_slug
                              .replace(/-/g, " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </p>
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
            {selectedLanguage ? (
              <Card className="overflow-hidden shadow-xl">
                <CardContent>
                  <h2 className="text-3xl font-bold mb-4">{selectedLanguage.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {new Date(selectedLanguage.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <div
                    className="prose prose-lg dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: selectedLanguage.description }}
                  />
                </CardContent>
              </Card>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-16 text-center border border-amber-100 dark:border-gray-700">
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  No languages to display yet
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default Language;
