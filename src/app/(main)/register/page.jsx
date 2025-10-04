"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  AtSign,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Upload,
  Sparkles,
  UserPlus,
  Image,
  Sun,
  Moon,
  Laptop,
  ArrowLeft,
} from "lucide-react";
import { useTheme } from "@/context/ThemeProvider";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// --- Reusable Form Components ---

const InputField = ({
  name,
  type,
  value,
  onChange,
  placeholder,
  icon: Icon,
  children,
}) => (
  <motion.div
    className="space-y-2"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <label
      htmlFor={name}
      className="block text-gray-700 dark:text-gray-300 text-sm font-semibold tracking-wide"
    >
      {name === "fullName" && "Nama Lengkap"}
      {name === "username" && "Username"}
      {name === "email" && "Alamat Email"}
      {name === "password" && "Password"}
      {name === "confirmPassword" && "Konfirmasi Password"}
    </label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon className="w-5 h-5 text-gray-400 group-focus-within:text-amber-500 transition-colors duration-300" />
      </div>
      <input
        id={name}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="w-full pl-12 pr-12 py-3.5 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-300 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800"
      />
      {children}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-yellow-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  </motion.div>
);

const SubmitButton = ({ loading }) => (
  <motion.button
    type="submit"
    disabled={loading}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-white font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 border border-amber-400/20"
  >
    {loading ? (
      <>
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
        <span>Mendaftar...</span>
      </>
    ) : (
      <>
        <UserPlus className="w-5 h-5 mr-2" />
        <span>Daftar Sekarang</span>
      </>
    )}
  </motion.button>
);

// --- Main Page Component ---

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { theme, setTheme } = useTheme();

  const router = useRouter();

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
        router.replace("/login");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/20 dark:bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-200/20 dark:bg-yellow-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-amber-100/10 to-yellow-100/10 dark:from-amber-500/5 dark:to-yellow-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        className="w-full max-w-2xl relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl p-10 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl shadow-gray-200/50 dark:shadow-black/20 relative overflow-hidden"
          whileHover={{
            boxShadow: "0 25px 50px -12px rgba(251, 191, 36, 0.15)",
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-yellow-500/5 pointer-events-none" />

          <div className="relative z-10">
            {/* Header */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex justify-between w-full">
                <Link href="/" passHref>
                  <Button
                    variant="outline"
                    className="mb-8 rounded-full border-2 border-gray-200 dark:border-gray-700 hover:border-amber-400 dark:hover:border-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-all font-semibold"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Kembali ke Beranda
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-10 h-10 rounded-xl hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-800 dark:hover:to-gray-900 transition-all duration-300 shadow-sm hover:shadow-md border border-transparent hover:border-gray-200/50 dark:hover:border-gray-700/50"
                    >
                      {theme === "light" && (
                        <Sun className="h-5 w-5 transition-all text-amber-500" />
                      )}
                      {theme === "dark" && (
                        <Moon className="h-5 w-5 transition-all text-indigo-400" />
                      )}
                      {theme === "system" && (
                        <Laptop className="h-5 w-5 transition-all text-gray-600 dark:text-gray-400" />
                      )}
                      <span className="sr-only">Toggle theme</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-44 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-gray-200/50 dark:border-gray-700/50 shadow-xl"
                  >
                    <DropdownMenuItem
                      onClick={() => setTheme("light")}
                      className="cursor-pointer hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-gray-800 dark:hover:to-gray-800"
                    >
                      <Sun className="mr-3 h-4 w-4 text-amber-500" />
                      <span className="font-medium">Light</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setTheme("dark")}
                      className="cursor-pointer hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-gray-800 dark:hover:to-gray-800"
                    >
                      <Moon className="mr-3 h-4 w-4 text-indigo-400" />
                      <span className="font-medium">Dark</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setTheme("system")}
                      className="cursor-pointer hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 dark:hover:from-gray-800 dark:hover:to-gray-800"
                    >
                      <Laptop className="mr-3 h-4 w-4 text-gray-600 dark:text-gray-400" />
                      <span className="font-medium">System</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="relative inline-block mb-4 group">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                <img
                  src="/Logo Short.svg"
                  alt="Cultunesia Logo"
                  className="w-20 h-20 mx-auto relative z-10 drop-shadow-lg"
                />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent mb-2">
                Bergabung dengan Cultunesia
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Mulai perjalanan budaya Anda bersama kami
              </p>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-red-700 dark:text-red-400 text-sm text-center font-medium">
                  {error}
                </p>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Avatar Upload */}
              <motion.div
                className="flex flex-col items-center mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full border-4 border-amber-500/20 dark:border-amber-500/30 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center group-hover:border-amber-500/40 transition-all duration-300">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 border-2 border-white dark:border-gray-900"
                  >
                    <Image className="w-4 h-4 text-white" />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  Upload foto profil (opsional)
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField
                  name="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  icon={User}
                />

                <InputField
                  name="username"
                  type="text"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="johndoe123"
                  icon={AtSign}
                />
              </div>

              <InputField
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                icon={Mail}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 karakter"
                  icon={Lock}
                >
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </motion.button>
                </InputField>

                <InputField
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Ulangi password"
                  icon={Lock}
                >
                  <motion.button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </motion.button>
                </InputField>
              </div>

              <motion.div
                className="flex items-start space-x-3 pt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <input
                  type="checkbox"
                  required
                  className="w-4 h-4 mt-1 text-amber-600 border-gray-300 dark:border-gray-600 rounded focus:ring-amber-500 focus:ring-offset-0 cursor-pointer transition-all"
                />
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  Saya menyetujui{" "}
                  <a
                    href="#"
                    className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-semibold"
                  >
                    Syarat & Ketentuan
                  </a>{" "}
                  dan{" "}
                  <a
                    href="#"
                    className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-semibold"
                  >
                    Kebijakan Privasi
                  </a>
                </label>
              </motion.div>

              <SubmitButton loading={loading} />
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 dark:bg-gray-900/80 text-gray-500 dark:text-gray-400 backdrop-blur-sm">
                  atau
                </span>
              </div>
            </div>

            {/* Login Link */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Sudah Punya Akun?{" "}
                <motion.a
                  href="/login"
                  className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-bold transition-colors inline-flex items-center gap-1 group"
                  whileHover={{ x: 2 }}
                >
                  Masuk di sini
                  <Sparkles className="w-3 h-3 group-hover:rotate-12 transition-transform" />
                </motion.a>
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.p
          className="text-center mt-6 text-xs text-gray-500 dark:text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Dengan mendaftar, Anda menyetujui{" "}
          <a
            href="#"
            className="text-amber-600 dark:text-amber-400 hover:underline"
          >
            Syarat Layanan
          </a>{" "}
          kami
        </motion.p>
      </motion.div>
    </div>
  );
}
