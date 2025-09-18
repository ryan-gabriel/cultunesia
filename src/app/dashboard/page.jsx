"use client";

import { columns } from "@/components/dataTable/provinces/columns";
import { DataTable } from "@/components/dataTable/provinces/data-table";
import { useAuth } from "@/context/AuthContext";
import { fetchProvinces } from "@/utils/province";
import React, { useEffect, useState } from "react";

const Page = ({ slug }) => {
  const { session, loading } = useAuth();
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!session) return;

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
  }, [session, slug]);

  if (loading || loadingData) return <p>Loading...</p>;
  if (!session) return null;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="w-full">
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default Page;
