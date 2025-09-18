"use client";

export const columns = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    header: "Image",
    accessorKey: "image",
    cell: ({ getValue }) => {
      const url = getValue();
      return url ? (
        <img
          src={url}
          alt="province image"
          className="w-12 h-12 object-cover rounded"
        />
      ) : (
        <span>No image</span>
      );
    },
  },
  {
    header: "Population",
    accessorKey: "population",
    cell: ({ getValue }) => {
      const value = getValue();
      // format pakai Intl.NumberFormat
      return new Intl.NumberFormat("id-ID").format(value);
    },
  },
];
