"use client";

import Navbar from "@/components/Navbar/Navbar";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // Tidak terpakai, bisa dihapus
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Send, Loader2, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";

// --- Konstanta dan Tipe Data ---

// HAPUS konstanta API KEY dan API URL yang sensitif
const LOCAL_CHAT_ENDPOINT = "/api/chatbot"; // Ganti dengan endpoint API Route lokal Anda
const MODEL_NAME = "llama-3.1-8b-instant"; // Model ini tidak lagi dibutuhkan di client, tapi dipertahankan untuk referensi

/**
 * @typedef {Object} Message
 * @property {'system' | 'user' | 'assistant'} role
 * @property {string} content
 */

/**
 * Pesan awal, termasuk batasan SYSTEM untuk Bot Cultunesia.
 * @type {Message[]}
 */
const INITIAL_MESSAGES = [
  {
    role: "system",
    content: `Anda adalah "Bot Cultunesia", sebuah bot edukasi yang dikhususkan untuk menjawab pertanyaan seputar kekayaan budaya Indonesia. 
     Tugas Anda adalah:
     1. Jawab SEMUA pertanyaan pengguna hanya mengenai topik Budaya Indonesia, seperti: nama provinsi, suku, makanan tradisional, bahasa daerah, tempat wisata budaya, tarian, dan baju tradisional Indonesia.
     2. Jika pertanyaan TIDAK berhubungan dengan budaya Indonesia, balas dengan sopan bahwa topik tersebut di luar lingkup pengetahuan Anda.
     3. JANGAN PERNAH menyebut diri Anda sebagai Groq, bot AI generik, atau model bahasa. Perkenalkan diri Anda sebagai "Bot Cultunesia" jika ditanya siapa Anda.
     4. Jawab dengan antusias, informatif, dan dalam Bahasa Indonesia yang formal namun mudah dipahami.
     Model yang Anda gunakan adalah llama-3.1-8b-instant.`,
  },
  {
    role: "assistant",
    content:
      "👋 Halo! Saya **Bot Cultunesia**. Senang bertemu dengan Anda! Tanyakan apa saja seputar budaya Indonesia 🌸",
  },
];

// --- Komponen Pembantu: Tampilan Pesan ---

/**
 * Komponen untuk menampilkan satu pesan dalam chat dengan desain modern.
 */

const ChatMessage = ({ message }) => {
  // Hanya menampilkan pesan role 'user' dan 'assistant'
  if (message.role === 'system') return null; 

  const isUser = message.role === "user";

  // Penyesuaian rounded corner agar lebih modern
  const messageClasses = isUser
    ? "bg-primary-gold text-white shadow-xl rounded-2xl rounded-tr-sm" // Rounded tr-sm agar lebih terlihat "ujung runcing" di dekat avatar
    : "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-lg border border-gray-100 dark:border-gray-600 rounded-2xl rounded-tl-sm"; // Rounded tl-sm

  const alignmentClasses = isUser ? "justify-end" : "justify-start";

  const avatar = isUser ? (
    <Avatar className="w-8 h-8 flex-shrink-0">
      <AvatarFallback className="bg-gray-200 border dark:bg-gray-600 text-primary-gold">
        <User className="w-4 h-4" />
      </AvatarFallback>
    </Avatar>
  ) : (
    <div className="w-8 h-8 flex justify-center items-center flex-shrink-0 rounded-full overflow-hidden bg-white dark:bg-gray-700 border">
      {/* Pastikan Logo Short.svg ada di folder public */}
      <Image
        src="/Logo Short.svg" 
        alt="Cultunesia Logo"
        width={20}
        height={20}
        className="object-contain"
      />
    </div>
  );

  return (
    <div
      className={`flex items-start gap-3 ${alignmentClasses} animate-in fade-in slide-in-from-bottom-1 duration-300 mx-4`} // Menambahkan mx-4 untuk padding samping
    >
      {!isUser && avatar}
      <div
        className={`px-4 py-3 text-sm max-w-[75%] transition-all ${messageClasses}`}
      >
        <p
          className={`font-bold text-xs mb-1 ${
            isUser ? "text-white/90" : "text-primary-gold"
          }`}
        >
          {isUser ? "Anda" : "Cultunesia"}
        </p>
        <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed"> {/* Penyesuaian text size di dalam prose */}
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
      {isUser && avatar}
    </div>
  );
};

// --- Komponen Utama: GroqChatbot ---

const GroqChatbot = () => {
  /** @type {[Message[], React.Dispatch<React.SetStateAction<Message[]>>]} */
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Perubahan: Menggunakan div sebagai ref untuk ScrollArea
  const chatAreaRef = useRef(null); 

  // Auto-scroll ke bawah saat pesan bertambah
  useEffect(() => {
    if (chatAreaRef.current) {
      setTimeout(() => {
        // Menggunakan properti scrollHeight dan scrollTop dari elemen div
        chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
      }, 100);
    }
  }, [messages]);

  /**
   * Mengirim pesan ke API Route lokal /api/chat
   */
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input.trim() };
    // Filter out system message to ensure only visible messages update the UI immediately
    const messagesToShow = messages.filter(msg => msg.role !== 'system');
    const newMessages = [...messages, userMessage];

    setMessages(newMessages); // Set state with all messages (including system)
    setInput("");
    setLoading(true);

    // Ambil semua pesan (termasuk SYSTEM) untuk dikirim sebagai riwayat
    const messagesForAPI = newMessages.map(({ role, content }) => ({
      role,
      content,
    }));

    try {
      // Panggil endpoint API Route lokal
      const response = await fetch(LOCAL_CHAT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // TIDAK ADA header 'Authorization' di sisi client!
        },
        body: JSON.stringify({
          // Kirim array messages sesuai format request API Route
          messages: messagesForAPI,
          // Tidak perlu mengirim model, temperature, max_tokens jika sudah di-hardcode di API Route
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Tangani error dari API Route/Groq
        const apiError =
          data.error?.message || `Gagal API: Status ${response.status}.`;

        console.error("Groq/Proxy API Error:", apiError);
        toast.error("Kesalahan Chatbot", {
          description: `Gagal mengirim pesan. ${apiError.substring(0, 100)}...`,
          duration: 5000,
        });

        // Pastikan kita menambahkannya ke state messages
        setMessages((prevMessages) => {
           // Temukan index pesan user yang baru saja dikirim
           const userMsgIndex = prevMessages.findIndex(m => m.content === userMessage.content && m.role === 'user');
           
           // Jika ditemukan, pastikan error message ditambahkan setelahnya
           if (userMsgIndex !== -1) {
              return [
                ...prevMessages,
                {
                  role: "assistant",
                  content: `[Gagal] Kesalahan dari server proxy. ${apiError.substring(0, 100)}... Cek konsol browser untuk detail error.`,
                },
              ];
           } else {
             // Fallback jika pesan user tidak ditemukan (meski seharusnya tidak terjadi)
             return [
               ...prevMessages,
               { role: "user", content: userMessage.content },
               {
                  role: "assistant",
                  content: `[Gagal] Kesalahan dari server proxy. ${apiError.substring(0, 100)}... Cek konsol browser untuk detail error.`,
               },
             ];
           }
        });
        return;
      }

      // Format response sama seperti Groq, data.choices[0].message
      const botResponse = data.choices[0].message;
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    } catch (error) {
      console.error("Gagal koneksi Server/API Route:", error);

      toast.error("Kesalahan Jaringan", {
        description: "Gagal terhubung ke server. Cek koneksi internet Anda.",
        duration: 5000,
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: "[Gagal] Terjadi masalah koneksi. Cek konsol dan coba lagi.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      {/* Kontainer Utama: Menggunakan h-screen/min-h-[90vh] untuk memastikan tinggi penuh */}
      <div className="flex w-full min-h-screen bg-white dark:bg-gray-950 justify-center items-start p-4 sm:p-6 transition-colors duration-500 -mb-20">
        {/* Chat Card: Menggunakan tinggi yang responsif */}
        <div className="w-full max-w-3xl h-full min-h-[90vh] sm:min-h-[85vh] lg:h-[85vh] flex flex-col shadow-2xl rounded-3xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 transition-shadow duration-500">
          
          {/* Header */}
          <div className="border-b border-gray-100 dark:border-gray-800 p-4 sm:p-6 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <Bot className="w-6 h-6 text-primary-gold animate-bounce-slow" />
              <h1 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50">
                Cultunesia Bot{" "}
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 hidden sm:inline"> 
                  {/* Menyembunyikan di layar sangat kecil */}
                  | Budaya Indonesia
                </span>
              </h1>
            </div>
            {loading && (
              <div className="flex items-center text-sm text-primary-gold/80">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengetik...
              </div>
            )}
          </div>

          {/* Area Chat Utama: Flex Grow untuk mengisi sisa ruang */}
          <div className="flex flex-col flex-grow min-h-0">
            {/* ScrollArea: flex-grow dan min-h-0 sangat penting di sini */}
            <ScrollArea
              ref={chatAreaRef}
              className="flex-grow min-h-0 p-0 bg-gray-50 dark:bg-gray-800 transition-colors duration-300"
            >
              <div className="space-y-4 py-4"> {/* Menambahkan padding vertikal di dalam scrollarea */}
                {messages.map(
                  (msg, index) =>
                    msg.role !== "system" && (
                      <ChatMessage key={index} message={msg} />
                    )
                )}
              </div>
            </ScrollArea>

            {/* Input dan Tombol Kirim */}
            <div className="p-4 sm:p-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-b-3xl">
              <div className="flex items-center gap-3">
                <Input
                  type="text"
                  placeholder="Tanyakan tentang suku, tarian, makanan tradisional Indonesia..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  disabled={loading}
                  className="flex-grow p-3 text-base dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-gold focus:border-primary-gold transition-shadow duration-200 rounded-xl"
                />
                <Button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="w-12 h-12 rounded-xl bg-primary-gold text-white hover:bg-yellow-700 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5 -rotate-45" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GroqChatbot;