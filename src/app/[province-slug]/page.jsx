import React from "react";

const page = ({ params }) => {
  const provinceSlug = params["province-slug"];
  return <div>{provinceSlug}</div>;
};

export default page;
