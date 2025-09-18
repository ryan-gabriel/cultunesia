"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: null,
  });
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, avatar: file || null });
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Password dan Confirm Password tidak sama!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("fullName", form.fullName);
    formData.append("username", form.username);
    formData.append("email", form.email);
    formData.append("password", form.password);
    if (form.avatar) formData.append("avatar", form.avatar);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error);
      } else {
        console.log("User registered:", result);
        // redirect ke dashboard atau tampilkan notifikasi sukses
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg dark:bg-gray-900">
      <h2 className="text-3xl font-bold mb-6 text-center text-primary">
        Create Account
      </h2>

      {error && (
        <p className="text-red-500 mb-4 text-center font-medium">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            placeholder="John Doe"
            value={form.fullName}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
            Username
          </label>
          <input
            type="text"
            name="username"
            placeholder="johndoe123"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="********"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="********"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
            Avatar (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-600 dark:text-gray-300 
            file:mr-3 file:py-2 file:px-4 
            file:rounded-lg file:border-0 
            file:text-sm file:font-semibold 
            file:bg-primary file:text-white 
            hover:file:bg-yellow-600"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-3 w-20 h-20 object-cover rounded-full mx-auto border"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
