// File: src/app/api/admin/quizzes/[quiz-id]/route.js

import { createServerClient } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

function shuffleArray(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function shuffleMatchingPairs(pairs) {
  const leftTexts = pairs.map((pair) => ({
    pair_id: pair.pair_id,
    text: pair.left_text,
  }));

  const rightTexts = pairs.map((pair) => ({
    pair_id: pair.pair_id,
    right_text: pair.right_text,
  }));

  const shuffledLeft = shuffleArray(leftTexts);
  const shuffledRight = shuffleArray(rightTexts);

  return {
    left: shuffledLeft,
    right: shuffledRight,
  };
}

export async function GET(request, context) {
  const params = await context.params;
  const quizId = params["quiz-id"];
  if (!quizId) {
    return NextResponse.json({ error: "Quiz ID wajib ada" }, { status: 400 });
  }

  const supabase = createServerClient();

  try {
    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .select("quiz_id, title")
      .eq("quiz_id", quizId)
      .single();

    if (quizError) throw quizError;
    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz tidak ditemukan" },
        { status: 404 }
      );
    }

    const url = new URL(request.url);
    const includeQuestions =
      url.searchParams.get("include_questions") === "true";

    let questions = [];
    if (includeQuestions) {
      const { data: qs, error: questionsError } = await supabase
        .from("questions")
        .select("question_id, type, text, points, image_url")
        .eq("quiz_id", quizId);

      if (questionsError) throw questionsError;

      const multipleChoiceIds = qs
        .filter((q) => q.type === "multiple_choice")
        .map((q) => q.question_id);
      const matchingIds = qs
        .filter((q) => q.type === "matching")
        .map((q) => q.question_id);

      const [optionsRes, pairsRes] = await Promise.all([
        supabase
          .from("options")
          .select("option_id, question_id, text")
          .in("question_id", multipleChoiceIds),
        supabase
          .from("matching_pairs")
          .select("pair_id, question_id, left_text, right_text")
          .in("question_id", matchingIds),
      ]);

      if (optionsRes.error) throw optionsRes.error;
      if (pairsRes.error) throw pairsRes.error;

      const options = optionsRes.data || [];
      const matchingPairs = pairsRes.data || [];

      questions = qs.map((q) => {
        if (q.type === "multiple_choice") {
          const opts = options.filter((o) => o.question_id === q.question_id);
          return { ...q, options: shuffleArray(opts) };
        }
        if (q.type === "matching") {
          const pairs = matchingPairs.filter(
            (p) => p.question_id === q.question_id
          );
          
          const shuffled = shuffleMatchingPairs(pairs);

          return { 
             ...q, 
             // Array untuk zona drop (diacak urutannya)
             matching_pairs: shuffled.left.map(item => ({ 
                 pair_id: item.pair_id, 
                 left_text: item.text, 
                 // Kita harus menyediakan pair_id untuk identifikasi dropzone di front-end
                 // dan memastikan ia terkait dengan 'left_text' yang benar
                 right_text: pairs.find(p => p.pair_id === item.pair_id)?.right_text // Tambahkan right_text asli
             })), 

             // Opsi drag yang benar-benar diacak (right_text)
             shuffled_options: shuffled.right.map(item => ({ 
                 pair_id: item.pair_id, // Gunakan pair_id untuk identifikasi
                 right_text: item.right_text, // Mengambil teks yang di-drag
             })),
          };
        }
        return q;
      });
    }

    return NextResponse.json({
      quiz,
      ...(includeQuestions ? { questions: shuffleArray(questions) } : {}),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
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
    return NextResponse.json(
      { error: "Gagal menghapus quiz" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Quiz berhasil dihapus" });
}
