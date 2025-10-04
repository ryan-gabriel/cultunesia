import { NextResponse } from 'next/server';

// Ambil kunci API Groq dari variabel lingkungan server
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

if (!GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY tidak ditemukan di environment variables");
}

export async function POST(request) {
  try {
    // 1. Ambil data pesan dari request client
    const { messages } = await request.json();

    // 2. Lakukan panggilan ke Groq API dari sisi server
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        // Kunci API aman karena hanya digunakan di sini (sisi server)
        Authorization: `Bearer ${GROQ_API_KEY}`, 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: messages, // Meneruskan riwayat pesan
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    const data = await response.json();

    // 3. Tangani error dari Groq
    if (!response.ok) {
        // Melemparkan respons error yang sesuai ke client
        return new NextResponse(JSON.stringify(data), {
            status: response.status,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // 4. Kirim respons Bot kembali ke client
    return NextResponse.json(data);

  } catch (error) {
    console.error("Kesalahan di API Route /api/chat:", error);
    return NextResponse.json(
      { error: "Gagal memproses permintaan chat.", details: error.message },
      { status: 500 }
    );
  }
}