"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  FileText,
  Upload,
  X,
  Loader2,
  Save,
  Edit3,
  Plus,
  FileImage,
  AlertCircle,
  AlignLeft,
} from "lucide-react";
import { fetchBlogBySlug } from "@/utils/blogs";

// Dynamically import the TinyMCE Editor with SSR disabled
const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  {
    ssr: false,
    loading: () => (
      <div
        // Dark mode added: border-gray-300 -> dark:border-gray-700, bg-gray-50 -> dark:bg-gray-900
        className="border border-gray-300 dark:border-gray-700 rounded-xl h-[350px] flex items-center justify-center bg-gray-50 dark:bg-gray-900"
      >
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-gold mx-auto mb-2" />
          {/* text-gray-600 -> dark:text-gray-400 */}
          <p className="text-gray-600 dark:text-gray-400">Loading editor...</p>
        </div>
      </div>
    ),
  }
);

// Helper function to convert image to PNG (TIDAK BERUBAH)
const convertToPNG = (file) => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

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

export default function BlogForm({ slug, onSuccess }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingBlog, setLoadingBlog] = useState(false);
  const [convertingImage, setConvertingImage] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isClient, setIsClient] = useState(false);

  const isEditMode = Boolean(slug);

  // Ensure we're on the client side before rendering the editor
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch blog data for update
  useEffect(() => {
    if (!slug) return;

    const loadBlog = async () => {
      setLoadingBlog(true);
      setError("");
      try {
        const blog = await fetchBlogBySlug(slug);
        setTitle(blog.title || "");
        setDescription(blog.description || "");
        setContent(blog.content || "");
        setPreview(blog.thumbnail_url || null);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load blog data");
      } finally {
        setLoadingBlog(false);
      }
    };

    loadBlog();
  }, [slug]);

  const handleThumbnailUpload = async (file) => {
    try {
      setConvertingImage(true);
      const pngFile = await convertToPNG(file);
      setThumbnail(pngFile);
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

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleThumbnailUpload(file);
    } else {
      setThumbnail(null);
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
      handleThumbnailUpload(e.dataTransfer.files[0]);
    }
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setPreview(null);
  };

  const validateForm = () => {
    const errors = {};

    if (!title.trim()) {
      errors.title = "Blog title is required";
    }

    if (!content.trim()) {
      errors.content = "Blog content is required";
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
      formData.append("title", title.trim());
      if (description.trim()) formData.append("description", description.trim());
      formData.append("content", content.trim());
      if (thumbnail) formData.append("thumbnail", thumbnail);

      const url = slug ? `/api/blogs/${slug}` : "/api/blogs";
      const method = slug ? "PUT" : "POST";

      // Add slug for update requests
      if (slug) formData.append("slug", slug);

      const res = await fetch(url, { method, body: formData });
      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || "An error occurred while saving");

      if (onSuccess) onSuccess(data);

      // Reset form if creating new blog
      if (!slug) {
        setTitle("");
        setDescription("");
        setContent("");
        setThumbnail(null);
        setPreview(null);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save blog");
    } finally {
      setLoading(false);
    }
  };

  if (slug && loadingBlog) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-gold mx-auto mb-4" />
          {/* text-gray-600 -> dark:text-gray-400 */}
          <p className="text-gray-600 dark:text-gray-400">Loading blog data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header (Gradient and White Text are fine, no dark mode needed here) */}
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
              {isEditMode ? "Edit Blog" : "Add New Blog"}
            </h1>
            <p className="text-white/90 mt-1">
              {isEditMode
                ? "Update blog information"
                : "Create a new blog entry"}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        // Dark mode added: bg-white -> dark:bg-gray-800
        className="bg-white dark:bg-gray-800 p-8 rounded-b-2xl shadow-lg space-y-8"
      >
        {/* Global Error */}
        {error && (
          // Dark mode classes added: bg-red-50 -> dark:bg-red-950, border-red-200 -> dark:border-red-800, text-red-800 -> dark:text-red-300, text-red-600 -> dark:text-red-400
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-red-800 dark:text-red-300">
                Error
              </h4>
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Blog Title */}
        <div className="space-y-2">
          <label
            // Dark mode added: text-gray-700 -> dark:text-gray-300
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            <FileText className="w-4 h-4 text-primary-gold" />
            Blog Title
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            // Dark mode classes added: dark:bg-gray-900, dark:border-gray-700, dark:text-gray-100, hover:dark:border-gray-600
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-gold focus:border-primary-gold transition-all duration-200 dark:bg-gray-900 dark:text-gray-100 ${
              fieldErrors.title
                ? "border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-950"
                : "border-gray-300 hover:border-gray-400 dark:border-gray-700 hover:dark:border-gray-600"
            }`}
            placeholder="Enter blog title"
            required
          />
          {fieldErrors.title && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {fieldErrors.title}
            </p>
          )}
        </div>

        {/* Blog Description */}
        <div className="space-y-2">
          <label
            // Dark mode added: text-gray-700 -> dark:text-gray-300
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            <AlignLeft className="w-4 h-4 text-primary-gold" />
            Blog Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            // Dark mode classes added: dark:bg-gray-900, dark:border-gray-700, dark:text-gray-100, hover:dark:border-gray-600
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-primary-gold focus:border-primary-gold hover:border-gray-400 hover:dark:border-gray-600 transition-all duration-200 resize-vertical"
            placeholder="Enter a brief description of your blog..."
          />
        </div>

        {/* Blog Content */}
        <div className="space-y-2">
          <label
            // Dark mode added: text-gray-700 -> dark:text-gray-300
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            Blog Content
            <span className="text-red-500">*</span>
          </label>

          {/* TinyMCE Editor Container */}
          <div
            className={`border rounded-xl overflow-hidden ${
              fieldErrors.content
                ? "border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-950"
                : "border-gray-300 dark:border-gray-700"
            }`}
          >
            {isClient ? (
              <Editor
                apiKey="t6uqhm6nrpzbgdcfu2k7j70z43fssve9u0g312x71st0e2f7"
                value={content}
                init={{
                  height: 350,
                  menubar: false,
                  // Terapkan skin dan content_css untuk mode gelap
                  skin: window.matchMedia("(prefers-color-scheme: dark)")
                    .matches
                    ? "oxide-dark"
                    : "oxide",
                  content_css: window.matchMedia("(prefers-color-scheme: dark)")
                    .matches
                    ? "dark"
                    : "default",
                  plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "help",
                    "wordcount",
                  ],
                  toolbar: [
                    "undo redo | blocks | bold italic underline strikethrough",
                    "alignleft aligncenter alignright alignjustify",
                    "bullist numlist outdent indent | removeformat",
                    "link image media table | charmap | code preview fullscreen help",
                  ].join(" | "),
                  // Sesuaikan content_style jika menggunakan light skin di dark mode
                  content_style: `
                    body { 
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                      font-size: 14px;
                      line-height: 1.6;
                      color: ${
                        window.matchMedia("(prefers-color-scheme: dark)")
                          .matches
                          ? "#d1d5db"
                          : "#374151"
                      }; /* Sesuaikan warna teks konten */
                      margin: 1rem;
                    }
                  `,
                  branding: false,
                }}
                onEditorChange={(newContent) => setContent(newContent)}
              />
            ) : (
              <div
                // Class untuk fallback loading editor
                className="border border-gray-300 dark:border-gray-700 rounded-xl h-[350px] flex items-center justify-center bg-gray-50 dark:bg-gray-900"
              >
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary-gold mx-auto mb-2" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Loading editor...
                  </p>
                </div>
              </div>
            )}
          </div>

          {fieldErrors.content && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {fieldErrors.content}
            </p>
          )}
        </div>

        {/* Thumbnail Upload */}
        <div className="space-y-3">
          <label
            // Dark mode added: text-gray-700 -> dark:text-gray-300, text-gray-500 -> dark:text-gray-400
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            Blog Thumbnail
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
              (automatically converted to PNG)
            </span>
          </label>

          {/* Thumbnail Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${
              dragActive
                ? "border-primary-gold bg-yellow-50 dark:bg-yellow-950"
                : preview
                ? "border-green-400 bg-green-50 dark:border-green-700 dark:bg-green-950"
                : "border-gray-300 hover:border-gray-400 bg-gray-50 dark:border-gray-700 hover:dark:border-gray-600 dark:bg-gray-900"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {convertingImage ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="w-10 h-10 animate-spin text-primary-gold mb-3" />
                {/* text-gray-700 -> dark:text-gray-300, text-gray-500 -> dark:text-gray-400 */}
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  Converting to PNG...
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Please wait a moment
                </p>
              </div>
            ) : preview ? (
              <div className="relative">
                <div className="flex justify-center">
                  <img
                    src={preview}
                    alt="Blog thumbnail preview"
                    className="max-w-full max-h-80 object-contain rounded-lg shadow-lg"
                  />
                </div>
                <button
                  type="button"
                  onClick={removeThumbnail}
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
                {/* text-gray-700 -> dark:text-gray-300, text-gray-500 -> dark:text-gray-400, text-gray-400 -> dark:text-gray-500 */}
                <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Drop your thumbnail here
                </p>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  or click to browse files
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
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
              onChange={handleThumbnailChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div
          // Dark mode added: border-gray-200 -> dark:border-gray-700
          className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700"
        >
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
                {isEditMode ? "Update Blog" : "Add Blog"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}