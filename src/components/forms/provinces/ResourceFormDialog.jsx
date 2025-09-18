"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

// Mapping fields per resource
const resourceFields = {
  ethnic_groups: ["name", "description", "image_url"],
  foods: ["name", "description", "image_url"],
  funfacts: ["fact"],
  languages: ["name", "description"],
  tourism: [
    "name",
    "description",
    "image_url",
    "latitude",
    "longitude",
    "maps_url",
    "street_view_url",
    "panorama_id",
  ],
  traditional_clothing: ["name", "description", "image_url"],
};

export const ResourceFormDialog = ({ slug, resource, triggerText, item, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);

  const fields = resourceFields[resource] || [];

  useEffect(() => {
    if (item) {
      setFormData(item); // isi form jika edit
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image_url" && files && files[0]) {
      setImageFile(files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      const form = new FormData();

      // tambahkan semua field selain image
      Object.keys(formData).forEach((key) => {
        if (key !== "image_url") form.append(key, formData[key] || "");
      });

      // tambahkan file jika ada
      if (imageFile) {
        form.append("image", imageFile);
      }

      if (item) {
        form.append("id", item.id);
      }

      const method = item ? "PUT" : "POST";

      const res = await fetch(`/api/provinces/${slug}/${resource}`, {
        method,
        body: form,
      });
      
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal menyimpan data");

      setOpen(false);
      setFormData({});
      setImageFile(null);
      if (onSuccess) onSuccess(json[resource]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          {triggerText || (item ? "Edit" : `Tambah ${resource.replace("_", " ")}`)}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {item ? "Edit" : "Tambah"} {resource.replace("_", " ")}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {fields.map((field) => {
            if (field === "image_url") {
              return (
                <div key={field}>
                  <label className="block mb-1">{field.replace("_", " ")}</label>
                  <input type="file" name="image_url" onChange={handleChange} />
                </div>
              );
            }
            return (
              <Input
                key={field}
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                placeholder={field.replace("_", " ")}
              />
            );
          })}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>{item ? "Update" : "Tambah"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
