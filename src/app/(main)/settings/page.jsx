"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { Upload } from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [profile, setProfile] = useState({
    email: "",
    username: "",
    full_name: "",
    avatar_url: "",
  });
  const [preview, setPreview] = useState("");
  const [email, setEmail] = useState("");
  const [avatarFile, setAvatarFile] = useState(null); // 🔹 simpan file untuk FormData
  const [isDragging, setIsDragging] = useState(false);

  // Fetch profile dan simpan token
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          toast.error("User tidak login");
          setLoading(false);
          return;
        }

        setAccessToken(session.access_token);
        setEmail(session.user.email);

        const res = await fetch("/api/profile", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        const result = await res.json();

        if (res.ok) {
          setProfile(result.profile);
          setPreview(result.profile?.avatar_url ?? "");
        } else {
          toast.error(result.error || "Gagal mengambil profile");
        }
      } catch (err) {
        toast.error("Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Process image file
  const processImageFile = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }

    // Simpan file asli untuk dikirim ke backend
    setAvatarFile(file);

    // Buat preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle file input change
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Submit update dengan FormData
  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }
    setSaving(true);

    try {
      if (!accessToken) {
        toast.error("Token tidak ditemukan, silakan login ulang");
        setSaving(false);
        return;
      }

      // 🔹 Buat FormData
      const formData = new FormData();
      formData.append("username", profile.username || "");
      formData.append("full_name", profile.full_name || "");

      // 🔹 Tambahkan file avatar jika ada
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // ❌ JANGAN set Content-Type, biar browser yang set otomatis dengan boundary
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Profile berhasil diperbarui");
        setAvatarFile(null); // Reset file setelah berhasil
      } else {
        toast.error(data.error || "Gagal memperbarui profile");
      }
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex justify-center p-6">
        <Card className="w-full max-w-xl">
          <CardHeader>
            <h2 className="text-xl font-semibold">Account Settings</h2>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Avatar with Drag & Drop */}
            <div className="flex flex-col items-center space-y-2">
              <div
                className={`relative group ${
                  isDragging ? "ring-4 ring-blue-400" : ""
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <Avatar className="w-24 h-24 cursor-pointer">
                  <AvatarImage src={preview} alt="Profile avatar" />
                  <AvatarFallback>
                    {profile.username?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* Overlay on hover */}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload className="w-8 h-8 text-white" />
                </div>
              </div>

              <div className="text-center">
                <Label
                  htmlFor="avatar"
                  className="cursor-pointer text-sm text-blue-600 underline hover:text-blue-800"
                >
                  Click to upload or drag and drop
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>

              <Input
                id="avatar"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                disabled={saving}
              />
            </div>

            {/* Email */}
            <div>
              <Label>Email</Label>
              <Input type="email" value={email ?? ""} disabled />
            </div>

            {/* Username */}
            <div>
              <Label>Username</Label>
              <Input
                type="text"
                value={profile.username ?? ""}
                onChange={(e) =>
                  setProfile({ ...profile, username: e.target.value })
                }
                disabled={saving}
              />
            </div>

            {/* Full Name */}
            <div>
              <Label>Full Name</Label>
              <Input
                type="text"
                value={profile.full_name ?? ""}
                onChange={(e) =>
                  setProfile({ ...profile, full_name: e.target.value })
                }
                disabled={saving}
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button onClick={handleSubmit} disabled={saving} className="w-full">
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Page;
