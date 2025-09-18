"use client";

import React, { useState, useEffect } from "react";
import { fetchProvinceBySlug } from "@/utils/province";

export default function ProvinceForm({ slug, onSuccess }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [population, setPopulation] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null); // ✨ preview image
  const [loading, setLoading] = useState(false);
  const [loadingProvince, setLoadingProvince] = useState(false);
  const [error, setError] = useState("");

  // Ambil data province kalau update
  useEffect(() => {
    if (!slug) return;

    const loadProvince = async () => {
      setLoadingProvince(true);
      try {
        const province = await fetchProvinceBySlug(slug);
        setName(province.name || "");
        setDescription(province.description || "");
        setPopulation(province.population || "");
        setPreview(province.image_url || null); // ✨ set preview dari URL
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoadingProvince(false);
      }
    };

    loadProvince();
  }, [slug]);

  // Update preview saat pilih file baru
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Nama wajib diisi");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      if (description) formData.append("description", description);
      if (population) formData.append("population", population);
      if (image) formData.append("image", image);

      const url = slug ? `/api/provinces/${slug}` : "/api/provinces";
      const method = slug ? "PUT" : "POST";

      const res = await fetch(url, { method, body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Terjadi kesalahan");

      if (onSuccess) onSuccess(data);

      if (!slug) {
        setName("");
        setDescription("");
        setPopulation("");
        setImage(null);
        setPreview(null);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (slug && loadingProvince) {
    return <p className="text-gray-500">Memuat data province...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      {error && <p className="text-red-500">{error}</p>}

      <div>
        <label className="block font-medium mb-1">Nama *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Population</label>
        <input
          type="number"
          value={population}
          onChange={(e) => setPopulation(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Image (optional)</label>
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mb-2 w-32 h-32 object-cover rounded border"
          />
        )}
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Menyimpan..." : slug ? "Update Province" : "Tambah Province"}
      </button>
    </form>
  );
}
