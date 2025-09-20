"use client";

export const columns = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    accessorKey: "thumbnail_url",
    header: "Thumbnail",
    cell: ({ getValue }) => {
      const url = getValue();
      return url ? (
        <img
          src={url}
          alt="blog thumbnail"
          className="w-12 h-12 object-cover rounded"
        />
      ) : (
        <span>No image</span>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ getValue }) => {
      const description = getValue();
      return description ? (
        <span>
          {description.length > 100
            ? description.substring(0, 100) + "..."
            : description}
        </span>
      ) : (
        <span>No description</span>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ getValue }) => {
      const date = getValue();
      return date ? new Date(date).toLocaleDateString("id-ID") : "-";
    },
  },
  {
    accessorKey: "updated_at",
    header: "Updated At",
    cell: ({ getValue }) => {
      const date = getValue();
      return date ? new Date(date).toLocaleDateString("id-ID") : "-";
    },
  },
];
