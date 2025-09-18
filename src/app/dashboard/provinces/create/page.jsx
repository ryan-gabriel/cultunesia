"use client";

import ProvinceForm from "@/components/forms/provinces/ProvinceForm";
import { useRouter } from "next/navigation";
import React from "react";

const page = () => {
  const router = useRouter();

  const handleSuccess = (data) => {
    console.log(data)
    router.replace("/dashboard/provinces")
  };

  return (
    <div>
      <ProvinceForm onSuccess={handleSuccess}/>
    </div>
  );
};

export default page;
