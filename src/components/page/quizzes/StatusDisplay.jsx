import React from 'react';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Komponen untuk menampilkan status Loading atau Error.
 * Mendukung mode gelap dan responsif.
 * @param {string} type - 'loading' atau 'error'.
 * @param {string} message - Pesan yang ditampilkan (hanya untuk error).
 */
const StatusDisplay = ({ type, message }) => {
  const isError = type === 'error';

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-sm text-center p-8 rounded-xl shadow-2xl transition-colors
                    bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">

        {isError ? (
          // --- Error State ---
          <div className="space-y-4">
            <AlertTriangle className="w-12 h-12 mx-auto text-red-500 dark:text-red-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Terjadi Kesalahan
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-mono p-3 bg-gray-100 dark:bg-gray-700 rounded-lg whitespace-pre-wrap break-words">
              {message || "Gagal memuat data. Silakan coba muat ulang halaman."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition duration-150"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Muat Ulang Halaman
            </button>
          </div>
        ) : (
          // --- Loading State ---
          <div className="space-y-4">
            <Loader2 className="w-12 h-12 mx-auto text-amber-500 dark:text-amber-400 animate-spin" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Memuat Quiz Harian
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Menyiapkan pertanyaan dan data pengguna...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusDisplay;
