"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ResourceTabs } from "@/components/ResourceTabs";
import DOMPurify from "isomorphic-dompurify";

// Contoh fetch function, ganti sesuai API (TIDAK BERUBAH)
async function fetchProvinceBySlug(slug) {
  const res = await fetch(`/api/provinces/${slug}`);
  if (!res.ok) throw new Error("Gagal memuat provinsi");
  return res.json();
}

const ProvincePage = () => {
  const params = useParams();
  const slug = params["province-slug"];

  const [province, setProvince] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProvince = async () => {
      setLoading(true);
      try {
        const { province } = await fetchProvinceBySlug(slug);
        setProvince(province);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProvince();
  }, [slug]);

  if (loading)
    // Dark mode added: text-gray-500 -> dark:text-gray-400
    return (
      <p className="text-center py-20 text-gray-500 dark:text-gray-400">
        Memuat data...
      </p>
    );
  if (error)
    // Error text remains red, which works fine in dark mode
    return (
      <p className="text-center py-20 text-red-500">
        {error}
      </p>
    );
  if (!province) return null;

  const resources = [
    "ethnic_groups",
    "foods",
    "funfacts",
    "languages",
    "tourism",
    "traditional_clothing",
  ];

  const raw = province?.description ?? "";
  const clean = DOMPurify.sanitize(raw);

  return (
    <>
      {/* Breadcrumb - Assuming 'components/ui/breadcrumb' handles its own dark mode */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/provinces">
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{province.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Province Info */}
        <div
          // Dark mode added: bg-white -> dark:bg-gray-800
          className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden"
        >
          {province.image_url && (
            <div className="w-full h-64 md:h-96 relative">
              <img
                src={province.image_url}
                alt={province.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-6">
            {/* Dark mode added: text-gray-900 (default) -> dark:text-gray-100 */}
            <h1 className="text-3xl font-bold mb-2 dark:text-gray-100">
              {province.name}
            </h1>
            {/* Dark mode added: text-gray-600 -> dark:text-gray-400 */}
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Populasi: {province.population.toLocaleString("id-ID")}
            </p>
            <div
              // Dark mode added: text-gray-800 -> dark:text-gray-300, prose -> dark:prose-invert (untuk menyesuaikan gaya tipografi TinyMCE)
              className="text-gray-800 dark:text-gray-300 prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: clean }}
            />
          </div>
        </div>

        {/* Tabs for resources - Assuming 'ResourceTabs' handles its own dark mode */}
        <ResourceTabs slug={slug} />
      </main>
    </>
  );
};

export default ProvincePage;