"use client";

export const columns = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    header: "Scheduled Date",
    accessorKey: "scheduled_date",
    cell: ({ getValue }) => {
      const value = getValue(); // biasanya string ISO
      if (!value) return "-";
      const date = new Date(value);
      return date.toLocaleDateString("en-EN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    },
  },
];
