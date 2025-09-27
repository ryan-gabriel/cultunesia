import ProvinceDetail from "@/components/page/province/ProvinceDetail";
import { fetchProvinceBySlug } from "@/utils/ServerProvince";
import React from "react";

const Page = async ({ params }) => {
  const provinceSlug = params["province-slug"];

  const provinceData = await fetchProvinceBySlug(provinceSlug);

  return (
    <ProvinceDetail provinceData={provinceData} />
  );
};

export default Page;
