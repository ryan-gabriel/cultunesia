"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export const DeleteResourceDialog = ({
  slug,
  resource,
  itemId,
  itemName,
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!itemId) return;
    setLoading(true);
    const urlEndpoint =
      resource == "quizzes"
        ? `/api/admin/quizzes/${itemId}/`
        : `/api/provinces/${slug}/${resource}/`;
    try {
      const res = await fetch(urlEndpoint, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: itemId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal menghapus data");

      setOpen(false);
      if (onSuccess) onSuccess(); // trigger refresh table
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Manual trigger button */}
      <Button size="sm" variant="destructive" onClick={() => setOpen(true)}>
        Hapus
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
          </DialogHeader>

          <p className="my-4">
            Apakah Anda yakin ingin menghapus {itemName || resource} ini?
          </p>

          <DialogFooter className="space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
