"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ResourceTable } from "./ResourceTable";
import { ResourceFormDialog } from "./forms/provinces/ResourceFormDialog";
import { useState } from "react";

const resources = [
  "ethnic_groups",
  "foods",
  "funfacts",
  "languages",
  "tourism",
  "traditional_clothing",
];

export const ResourceTabs = ({ slug }) => {
  const [refreshKey, setRefreshKey] = useState(0); // untuk reload tabel setelah tambah/edit

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <Tabs defaultValue="ethnic_groups" className="space-y-6">
      <TabsList>
        {resources.map((res) => (
          <TabsTrigger key={res} value={res}>
            {res.replace("_", " ")}
          </TabsTrigger>
        ))}
      </TabsList>

      {resources.map((res) => (
        <TabsContent key={res} value={res} className="space-y-4">
          {/* Tombol tambah */}
          <ResourceFormDialog
            slug={slug}
            resource={res}
            triggerText={`Tambah ${res.replace("_", " ")}`}
            onSuccess={handleSuccess}
          />

          {/* Tabel resource */}
          <ResourceTable
            key={`${res}-${refreshKey}`} // reload tabel saat refreshKey berubah
            slug={slug}
            resource={res}
            onEdit={handleSuccess} // opsional, bisa panggil modal edit
            onDelete={handleSuccess} // reload tabel setelah delete
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};
