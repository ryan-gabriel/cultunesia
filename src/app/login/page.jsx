"use client";

import { useState } from "react";

// --- Icon Components (Tidak ada perubahan) ---

const EmailIcon = () => (
    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
    </svg>
);

const PasswordIcon = () => (
    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

const EyeOpenIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const EyeClosedIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
    </svg>
);

// --- Reusable Form Components (Gaya Disesuaikan) ---

const InputField = ({ name, type, value, onChange, placeholder, children }) => (
  <div className="space-y-2">
    <label htmlFor={name} className="block text-gray-700 text-sm font-semibold">
      {name === "email" ? "Alamat Email" : "Password"}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {name === "email" ? <EmailIcon /> : <PasswordIcon />}
      </div>
      <input
        id={name}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
      />
      {children}
    </div>
  </div>
);

const SubmitButton = ({ loading }) => (
  <button
    type="submit"
    disabled={loading}
    className="w-full py-3 px-4 bg-yellow-600 text-white font-bold rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-200 flex items-center justify-center disabled:opacity-50"
  >
    {loading ? (
      <>
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
        <span>Memproses...</span>
      </>
    ) : (
      <span>Sign In</span>
    )}
  </button>
);

// --- Main Page Component (Gaya Disesuaikan) ---

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Logika submit tetap sama
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 shadow-md">
          <div className="text-center mb-8">
            <img src="/Logo Short.svg" alt="Cultunesia Logo" className="w-20 h-20 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Selamat Datang
            </h1>
            <p className="text-gray-600 text-sm">Masuk untuk melanjutkan ke Cultunesia</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-100 border border-red-400 rounded-lg">
              <p className="text-red-700 text-sm text-center font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
            
            <InputField
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="Masukkan password Anda"
            >
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
              </button>
            </InputField>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                />
                <span className="text-gray-700">Ingat Saya</span>
              </label>
              <a href="#" className="text-yellow-600 hover:text-yellow-700 transition-colors font-medium">
                Lupa password?
              </a>
            </div>

            <SubmitButton loading={loading} />
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-sm">
              Tidak Punya Akun?{" "}
              <a href="#" className="text-yellow-600 hover:text-yellow-700 font-semibold transition-colors">
                Daftar di sini
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}