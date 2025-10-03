import React from "react";
import provinceData from "@/data/provinces.json";
import ProvincesList from "@/components/page/province/ProvinceList";
import Navbar from "@/components/Navbar/Navbar";
const page = () => {
  return (
    <>
      <Navbar />
      <ProvincesList provinceData={provinceData} />
    </>
  );
};

export default page;
