"use client";

import ProvinceForm from "@/components/forms/provinces/ProvinceForm";
import { useParams, useRouter } from "next/navigation";
import React from "react";

const page = () => {
  const params = useParams();
  const slug = params['province-slug']
  const router = useRouter();

  const handleSuccess = (data) => {
    console.log(data);
    router.replace("/dashboard/provinces");
  };

  return (
    <div>
      <ProvinceForm onSuccess={handleSuccess} slug={slug} />
    </div>
  );
};

export default page;
