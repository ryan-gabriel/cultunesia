import { fetchProvinceResource } from "@/utils/ServerProvince";
import React from "react";
import Tourism from "@/components/page/province/resource/Tourism";
import Language from "@/components/page/province/resource/Language";
import Food from "@/components/page/province/resource/Food";
import EthnicGroup from "@/components/page/province/resource/EthnicGroup";
import TraditionalClothing from "@/components/page/province/resource/TraditionalClothing";
import { notFound } from "next/navigation";

const allowed_resource = [
  "tourism",
  "languages",
  "foods",
  "ethnic_groups",
  "traditional_clothing",
];

const Page = async (context) => {
  const params = await context.params;
  const provinceSlug = params["province-slug"];
  const resourceSlug = params["resource"];

  // ✅ Validasi resource slug
  if (!allowed_resource.includes(resourceSlug)) {
    return notFound();
  }

  try {
    // ✅ Server-side fetch (await langsung)
    const data = await fetchProvinceResource(provinceSlug, resourceSlug);

    if (!data || (Array.isArray(data) && data.length === 0)) {
      return (
        <div className="p-6 text-gray-600">
          Belum ada data <b>{resourceSlug.replace("_", " ")}</b> untuk provinsi{" "}
          <b>{provinceSlug}</b>.
        </div>
      );
    }

    return (
      <div className="p-6">
        {/* ✅ Render component sesuai resourceSlug */}
        {resourceSlug === "tourism" && <Tourism data={data} />}
        {resourceSlug === "languages" && <Language data={data} />}
        {resourceSlug === "foods" && <Food data={data} />}
        {resourceSlug === "ethnic_groups" && <EthnicGroup data={data} />}
        {resourceSlug === "traditional_clothing" && (
          <TraditionalClothing data={data} />
        )}
      </div>
    );
  } catch (error) {
    return (
      <div className="p-6 text-red-600">
        Gagal memuat resource <b>{resourceSlug}</b> untuk provinsi{" "}
        <b>{provinceSlug}</b>.
      </div>
    );
  }
};

export default Page;
