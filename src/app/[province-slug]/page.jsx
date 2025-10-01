import Navbar from "@/components/Navbar/Navbar";
import ProvinceDetail from "@/components/page/province/ProvinceDetail";
import { fetchProvinceBySlug } from "@/utils/ServerProvince";
import { notFound } from "next/navigation";
import React from "react";

const Page = async (context) => {
  const params = await context.params;
  const provinceSlug = params["province-slug"];

  const provinceData = await fetchProvinceBySlug(provinceSlug, {
    include: ["funfacts"],
  });
  if (!provinceData) {
    return notFound();
  }

  return (
    <>
      <Navbar />
      <ProvinceDetail provinceData={provinceData} />
    </>
  );
};

export default Page;
