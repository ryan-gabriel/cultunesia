"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ResourceFormDialog } from "./forms/provinces/ResourceFormDialog";
import { DeleteResourceDialog } from "./forms/provinces/DeleteResourceDialog";

// =================== Mapping Columns per Resource ===================
const resourceColumns = {
  ethnic_groups: ["name", "description", "image_url"],
  foods: ["name", "description", "image_url"],
  funfacts: ["fact"],
  languages: ["name", "description"],
  tourism: [
    "name",
    "description",
    "image_url",
    "latitude",
    "longitude",
    "maps_url",
    "street_view_url",
    "panorama_id",
  ],
  traditional_clothing: ["name", "description", "image_url"],
};

// =================== Fields yang harus ditampilkan sebagai image ===================
const imageFields = ["image_url"];

// =================== Helper untuk truncate text ===================
const truncateText = (text, maxLength = 80) => {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

// =================== ResourceTable Component ===================
export const ResourceTable = ({ slug, resource }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const columns = resourceColumns[resource] || [];

  // =================== Fetch Data ===================
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/provinces/${slug}/${resource}`);
      if (!res.ok) throw new Error(`Gagal memuat ${resource}`);
      const json = await res.json();
      setData(json[resource] || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [slug, resource]);

  // =================== Handle success ===================
  const handleSuccess = () => {
    loadData(); // refresh table setelah add/edit
  };

  if (loading) return <p className="text-gray-500">Memuat {resource}...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!data.length)
    return <p className="text-gray-400">Belum ada {resource}</p>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col}>{col.replace("_", " ")}</TableHead>
          ))}
          <TableHead>Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            {columns.map((col) => (
              <TableCell key={col}>
                {imageFields.includes(col) && item[col] ? (
                  <img
                    src={item[col]}
                    alt={item.name || "image"}
                    className="h-16 w-16 object-cover rounded-md"
                  />
                ) : (
                  truncateText(item[col], 80) // <-- batasi panjang text
                )}
              </TableCell>
            ))}
            <TableCell className="space-x-2">
              <ResourceFormDialog
                slug={slug}
                item={item}
                resource={resource}
                triggerText={`Edit`}
                onSuccess={handleSuccess}
              />
              <DeleteResourceDialog
                slug={slug}
                resource={resource}
                itemId={item.id}
                itemName={item.name || resource}
                onSuccess={handleSuccess}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
