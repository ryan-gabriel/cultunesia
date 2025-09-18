'use client'

import { columns } from "@/components/dataTable/provinces/columns";
import { DataTable } from "@/components/dataTable/provinces/data-table";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { fetchProvinces } from "@/utils/province";
import { Plus } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

const Page = () => {
  const { session, loading } = useAuth();
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const fetched = useRef(false);

  useEffect(() => {
    if (!session || fetched.current) return;

    const loadData = async () => {
      setLoadingData(true);
      try {
        const provinceData = await fetchProvinces();
        setData(provinceData); // DataTable biasanya array
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
    fetched.current = true;
  }, [session]);

  // 🔹 Fungsi handle delete
  const handleDelete = async (province) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus ${province.name}?`)) return;

    try {
      const res = await fetch(`/api/provinces/${province.slug}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Gagal menghapus provinsi");

      alert("Provinsi berhasil dihapus");

      // update state data supaya DataTable otomatis refresh
      setData((prev) => prev.filter((p) => p.slug !== province.slug));
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  if (loading || loadingData) return <p>Loading...</p>;
  if (!session) return null;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="w-full">
      <div className="w-full text-end my-4 px-4">
        <Link href={"/dashboard/provinces/create"}>
          <Button className={"cursor-pointer"}>
            Create New Province <Plus />
          </Button>
        </Link>
      </div>

      {/* 🔹 Pass handleDelete ke DataTable */}
      <DataTable columns={columns} data={data} onDelete={handleDelete} />
    </div>
  );
};

export default Page;
