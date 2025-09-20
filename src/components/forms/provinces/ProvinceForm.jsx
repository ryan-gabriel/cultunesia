"use client";

import React, { useState, useEffect } from "react";
import { fetchProvinceBySlug } from "@/utils/province";
import {
  MapPin,
  Users,
  Upload,
  X,
  Loader2,
  Save,
  Edit3,
  Plus,
  FileImage,
  AlertCircle,
} from "lucide-react";

// Helper function to convert image to PNG
const convertToPNG = (file) => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // Set canvas dimensions to match image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw image to canvas
      ctx.drawImage(img, 0, 0);

      // Convert to PNG blob
      canvas.toBlob(
        (blob) => {
          const pngFile = new File(
            [blob],
            file.name.replace(/\.[^/.]+$/, ".png"),
            {
              type: "image/png",
            }
          );
          resolve(pngFile);
        },
        "image/png",
        0.9
      );
    };

    img.src = URL.createObjectURL(file);
  });
};

export default function ProvinceForm({ slug, onSuccess }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [population, setPopulation] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingProvince, setLoadingProvince] = useState(false);
  const [convertingImage, setConvertingImage] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const isEditMode = Boolean(slug);

  // Fetch province data for update
  useEffect(() => {
    if (!slug) return;

    const loadProvince = async () => {
      setLoadingProvince(true);
      setError("");
      try {
        const province = await fetchProvinceBySlug(slug);
        setName(province.name || "");
        setDescription(province.description || "");
        setPopulation(province.population || "");
        setPreview(province.image_url || null);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load province data");
      } finally {
        setLoadingProvince(false);
      }
    };

    loadProvince();
  }, [slug]);

  const handleImageUpload = async (file) => {
    try {
      setConvertingImage(true);

      // Convert to PNG
      const pngFile = await convertToPNG(file);
      setImage(pngFile);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(pngFile);
    } catch (error) {
      console.error("Error converting image:", error);
      setError("Failed to convert image to PNG");
    } finally {
      setConvertingImage(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    } else {
      setImage(null);
      setPreview(null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  const validateForm = () => {
    const errors = {};

    if (!name.trim()) {
      errors.name = "Province name is required";
    }

    if (population && (isNaN(population) || parseInt(population) < 0)) {
      errors.population = "Population must be a valid positive number";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      if (description.trim())
      formData.append("description", description.trim());
      formData.append("population", population);
      if (image) formData.append("image", image);

      const url = slug ? `/api/provinces/${slug}` : "/api/provinces";
      const method = slug ? "PUT" : "POST";

      const res = await fetch(url, { method, body: formData });
      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || "An error occurred while saving");

      if (onSuccess) onSuccess(data);

      // Reset form if creating new province
      if (!slug) {
        setName("");
        setDescription("");
        setPopulation("");
        setImage(null);
        setPreview(null);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save province");
    } finally {
      setLoading(false);
    }
  };

  if (slug && loadingProvince) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-gold mx-auto mb-4" />
          <p className="text-gray-600">Loading province data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-gold to-yellow-500 text-white p-8 rounded-t-2xl shadow-lg">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl">
            {isEditMode ? (
              <Edit3 className="w-8 h-8" />
            ) : (
              <Plus className="w-8 h-8" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              {isEditMode ? "Edit Province" : "Add New Province"}
            </h1>
            <p className="text-white/90 mt-1">
              {isEditMode
                ? "Update province information"
                : "Create a new province entry"}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-b-2xl shadow-lg space-y-8"
      >
        {/* Global Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-red-800">Error</h4>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Province Name */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <MapPin className="w-4 h-4 text-primary-gold" />
            Province Name
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-gold focus:border-primary-gold transition-all duration-200 ${
              fieldErrors.name
                ? "border-red-300 bg-red-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            placeholder="Enter province name"
            required
          />
          {fieldErrors.name && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {fieldErrors.name}
            </p>
          )}
        </div>

        {/* Population */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Users className="w-4 h-4 text-primary-gold" />
            Population
          </label>
          <input
            type="number"
            value={population}
            onChange={(e) => setPopulation(e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-gold focus:border-primary-gold transition-all duration-200 ${
              fieldErrors.population
                ? "border-red-300 bg-red-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            placeholder="Enter population count"
            min="0"
          />
          {fieldErrors.population && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {fieldErrors.population}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-gold focus:border-primary-gold hover:border-gray-400 transition-all duration-200 resize-vertical"
            placeholder="Enter province description..."
          />
        </div>

        {/* Image Upload */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Province Image
            <span className="text-xs text-gray-500 ml-2">
              (automatically converted to PNG)
            </span>
          </label>

          {/* Image Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${
              dragActive
                ? "border-primary-gold bg-yellow-50"
                : preview
                ? "border-green-400 bg-green-50"
                : "border-gray-300 hover:border-gray-400 bg-gray-50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {convertingImage ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="w-10 h-10 animate-spin text-primary-gold mb-3" />
                <p className="text-lg font-medium text-gray-700">
                  Converting to PNG...
                </p>
                <p className="text-sm text-gray-500">Please wait a moment</p>
              </div>
            ) : preview ? (
              <div className="relative">
                <div className="flex justify-center">
                  <img
                    src={preview}
                    alt="Province preview"
                    className="max-w-full max-h-80 object-contain rounded-lg shadow-lg"
                  />
                </div>
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 left-3 bg-primary-gold text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg">
                  PNG Format
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="p-4 bg-primary-gold/10 rounded-full mb-4">
                  <Upload className="w-10 h-10 text-primary-gold" />
                </div>
                <p className="text-xl font-semibold text-gray-700 mb-2">
                  Drop your image here
                </p>
                <p className="text-gray-500 mb-4">or click to browse files</p>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <FileImage className="w-4 h-4" />
                  <span>
                    Supports: JPG, JPEG, PNG, WebP (auto-converted to PNG)
                  </span>
                </div>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading || convertingImage}
            className="bg-gradient-to-r from-primary-gold to-yellow-500 hover:from-yellow-500 hover:to-primary-gold text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isEditMode ? "Updating..." : "Adding..."}
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {isEditMode ? "Update Province" : "Add Province"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
