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
import { Editor } from "@tinymce/tinymce-react";
import { Upload, X, FileImage, Loader2 } from "lucide-react";
import PracticeQuizForm from "../quizzes/PracticeQuizForm";
import { toast } from "sonner";

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
    "maps_url",
    "street_view_url",
  ],
  traditional_clothing: ["name", "description", "image_url"],
  quizzes: ["title"],
};

// Helper function to convert image to PNG
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
            { type: "image/png" }
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

// Field label mapping
const fieldLabels = {
  name: "Name",
  description: "Description",
  image_url: "Image",
  fact: "Fun Fact",
  maps_url: "Maps URL",
  street_view_url: "Street View URL",
  panorama_id: "Panorama ID",
  title: "Title",
};

export const ResourceFormDialog = ({
  slug,
  resource,
  triggerText,
  item,
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fields = resourceFields[resource] || [];
  const resourceName = resource
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  // Check for dark mode class on the document element for TinyMCE configuration
  const isDarkMode = typeof document !== 'undefined' && document.documentElement.classList.contains("dark");

  useEffect(() => {
    if (item) {
      setFormData(item);
      if (item.image_url) {
        setImagePreview(item.image_url);
      }
    } else {
      setFormData({});
      setImagePreview(null);
      setImageFile(null);
    }
  }, [item, open]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files[0]) {
      handleImageUpload(files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (file) => {
    try {
      setLoading(true);
      const pngFile = await convertToPNG(file);
      setImageFile(pngFile);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(pngFile);
    } catch (error) {
      console.error("Error converting image:", error);
    } finally {
      setLoading(false);
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
    setImageFile(null);
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image_url: null }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const form = new FormData();

      Object.keys(formData).forEach((key) => {
        if (
          key !== "image_url" &&
          formData[key] !== null &&
          formData[key] !== undefined
        ) {
          form.append(key, formData[key] || "");
        }
      });

      if (imageFile) {
        form.append("image", imageFile);
      }

      if (item) {
        form.append("id", item.id);
      }

      const method = item ? "PUT" : "POST";

      let res;
      if (resource == "quizzes") {
        form.append("category", "province");
        form.append("province_slug", slug);
        res = await fetch(`/api/admin/quizzes/${item.quiz_id}`, {
          method,
          body: form,
        });
      } else {
        res = await fetch(`/api/provinces/${slug}/${resource}`, {
          method,
          body: form,
        });
      }

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save data");

      setOpen(false);
      setFormData({});
      setImageFile(null);
      setImagePreview(null);
      if (onSuccess) onSuccess(json[resource]);
      toast("Success!", {
        duration: 3000,
        description: `${item ? 'Updated' : 'Added'} ${resourceName} successfully.`,
      });
    } catch (err) {
      console.error(err);
      toast("Terjadi kesalahan!", {
        duration: 3000,
        description: `Failed to save ${resourceName}. Please try again.`,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderImageField = () => (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
        Image{" "}
        <span className="text-xs text-gray-500 dark:text-gray-400">
          (automatically converted to PNG)
        </span>
      </label>
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 ${
          dragActive
            ? "border-primary-gold bg-primary-gold/10"
            : imagePreview
            ? "border-primary-gold bg-primary-gold/5 dark:bg-primary-gold/10"
            : "border-gray-300 hover:border-primary-gold bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-gold"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary-gold mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Converting to PNG...
            </p>
          </div>
        ) : imagePreview ? (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full max-h-64 object-contain rounded-lg shadow-sm"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur">
              PNG Format
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="p-4 bg-primary-gold/20 rounded-full mb-4">
              <Upload className="w-8 h-8 text-primary-gold" />
            </div>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
              Drop your image here
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              or click to browse files
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Supports: JPG, JPEG, PNG, WebP (auto-converted to PNG)
            </p>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          name="image"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );

  const renderTextField = (field) => (
    <div key={field} className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
        {fieldLabels[field] ||
          field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
        {(field === "name" || field === "fact") && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Input
        name={field}
        value={formData[field] || ""}
        onChange={handleChange}
        placeholder={`Enter ${fieldLabels[field] || field.replace(/_/g, " ")}`}
        className="border-gray-300 focus:border-primary-gold focus:ring-primary-gold rounded-lg dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
        required={field === "name" || field === "fact"}
      />
    </div>
  );

  const renderDescriptionField = () => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
        Description
      </label>
      <div className="border border-gray-300 rounded-lg overflow-hidden dark:border-gray-700">
        <Editor
          apiKey="t6uqhm6nrpzbgdcfu2k7j70z43fssve9u0g312x71st0e2f7"
          value={formData.description || ""}
          init={{
            height: 350,
            menubar: false,
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
            
            // --- KONFIGURASI DARK MODE TINYMCE ---
            skin: isDarkMode ? "oxide-dark" : "oxide",
            content_css: isDarkMode ? "dark" : "default",
            
            // --- KONTEN STYLE UNTUK MEMPERBAIKI HEADING (H1, H2, dst) ---
            content_style: `
              /* Base content style for Light Mode */
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 14px;
                line-height: 1.6;
                color: #374151; /* Gray-700 */
                margin: 1rem;
              }
              h1 { font-size: 2em; font-weight: bold; margin: 0.67em 0; }
              h2 { font-size: 1.5em; font-weight: bold; margin: 0.75em 0; }
              h3 { font-size: 1.17em; font-weight: bold; margin: 0.83em 0; }
              
              /* Dark Mode content style overrides */
              ${isDarkMode ? `
                body {
                  background-color: #1f2937; /* Gray-800 */
                  color: #e5e7eb; /* Gray-200 */
                }
                .mce-content-body {
                   background-color: #1f2937 !important;
                   color: #e5e7eb !important;
                }
              ` : ''}
            `,
            branding: false,
          }}
          onEditorChange={(content) =>
            setFormData((prev) => ({ ...prev, description: content }))
          }
        />
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary-gold hover:bg-primary-gold/90 text-white font-medium px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
          {triggerText || (item ? "Edit" : `Add ${resourceName}`)}
        </Button>
      </DialogTrigger>
      {resource == "quizzes" && !item ? (
        <DialogContent
          className="sm:max-w-4xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl dark:bg-gray-800"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader className="bg-primary-gold rounded-2xl text-white p-6 -m-6 mb-6">
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <FileImage className="w-6 h-6" />
              </div>
              {item ? "Edit" : "Add New"} {resourceName}
            </DialogTitle>
          </DialogHeader>
          <div className="h-90% overflow-y-scroll">
            <PracticeQuizForm province_slug={slug} />
          </div>
        </DialogContent>
      ) : (
        <DialogContent
          className="sm:max-w-4xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl dark:bg-gray-800"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader className="bg-primary-gold rounded-2xl text-white p-6 -m-6 mb-6">
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <FileImage className="w-6 h-6" />
              </div>
              {item ? "Edit" : "Add New"} {resourceName}
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[60vh] px-1">
            <div className="space-y-6">
              {fields.map((field) => {
                if (field === "image_url") {
                  return <div key={field}>{renderImageField()}</div>;
                }
                if (field === "description") {
                  return <div key={field}>{renderDescriptionField()}</div>;
                }
                return renderTextField(field);
              })}
            </div>
          </div>
          <DialogFooter 
            className="bg-gray-50 px-6 py-4 flex gap-3 dark:bg-gray-700"
          >
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="px-6 py-2 border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-600"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                loading ||
                ((resource !== "quizzes" && resource !== "funfacts") && !formData.name?.trim()) || 
                (resource === "funfacts" && !formData.fact?.trim())
              }
              className="bg-primary-gold hover:bg-primary-gold/90 text-white px-6 py-2 font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {item ? "Updating..." : "Adding..."}
                </div>
              ) : item ? (
                "Update"
              ) : (
                "Add"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};