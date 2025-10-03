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

// Contoh fetch function, ganti sesuai API
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
    return <p className="text-center py-20 text-gray-500">Memuat data...</p>;
  if (error) return <p className="text-center py-20 text-red-500">{error}</p>;
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
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/provinces">Dashboard</BreadcrumbLink>
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
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
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
            <h1 className="text-3xl font-bold mb-2">{province.name}</h1>
            <p className="text-gray-600 mb-4">
              Populasi: {province.population.toLocaleString("id-ID")}
            </p>
            <div
              className="text-gray-800 prose" // optional: prose utk styling typography (Tailwind Typography)
              dangerouslySetInnerHTML={{ __html: clean }}
            />
          </div>
        </div>

        {/* Tabs for resources */}
        <ResourceTabs slug={slug} />
      </main>
    </>
  );
};

export default ProvincePage;
