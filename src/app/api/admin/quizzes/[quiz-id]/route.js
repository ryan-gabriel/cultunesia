// File: src/app/api/admin/quizzes/[quiz-id]/route.js

import { createServerClient } from "@/lib/supabaseServer";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const quizId = params["quiz-id"];

  // Buat koneksi Supabase di server menggunakan service_role key
  const supabase = createServerClient();

  const { data: quiz, error } = await supabase
    .from("quizzes")
    .select("title")
    .eq("quiz_id", quizId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json({ quiz });
}

export async function PUT(req, context) {
  const supabase = createServerClient();

  const formData = await req.formData();

  const params = await context.params;
  const quizId = params["quiz-id"];

  if (!quizId) {
    return NextResponse.json({ error: "Quiz ID wajib ada" }, { status: 400 });
  }

  try {
    const title = formData.get("title");
    const scheduledDate = formData.get("scheduled_date");

    // object dinamis untuk update
    const updateData = { title };
    if (scheduledDate) {
      updateData.scheduled_date = scheduledDate;
    }

    const { data: updatedQuiz, error: updateError } = await supabase
      .from("quizzes")
      .update(updateData)
      .eq("quiz_id", quizId)
      .select("*")
      .single();

    if (updateError) {
      return NextResponse.json({ error: "Gagal update quiz" }, { status: 500 });
    }

    return NextResponse.json({ quizzes: updatedQuiz });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const quizId = params["quiz-id"];
  if (!quizId) {
    return NextResponse.json({ error: "Quiz ID wajib ada" }, { status: 400 });
  }

  const supabase = createServerClient();

  const { error } = await supabase
    .from("quizzes")
    .delete()
    .eq("quiz_id", quizId);

  if (error) {
    return NextResponse.json({ error: "Gagal menghapus quiz" }, { status: 500 });
  }

  return NextResponse.json({ message: "Quiz berhasil dihapus" });
}