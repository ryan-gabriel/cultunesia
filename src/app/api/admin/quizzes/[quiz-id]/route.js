// File: src/app/api/admin/quizzes/[quiz-id]/route.js

import { createServerClient } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

// simple shuffle function
function shuffleArray(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export async function GET(request, context) {
  const params = await context.params; // ✅ await first
  const quizId = params["quiz-id"];
  if (!quizId) {
    return NextResponse.json({ error: "Quiz ID wajib ada" }, { status: 400 });
  }

  const supabase = createServerClient();

  try {
    // 1️⃣ Fetch quiz
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

    // 2️⃣ Check if client wants questions
    const url = new URL(request.url);
    const includeQuestions =
      url.searchParams.get("include_questions") === "true";

    let questions = [];
    if (includeQuestions) {
      // Fetch all questions
      const { data: qs, error: questionsError } = await supabase
        .from("questions")
        .select("question_id, type, text, points, image_url")
        .eq("quiz_id", quizId);

      if (questionsError) throw questionsError;

      const questionIds = qs.map((q) => q.question_id);

      // Separate question IDs by type
      const multipleChoiceIds = qs
        .filter((q) => q.type === "multiple_choice")
        .map((q) => q.question_id);
      const matchingIds = qs
        .filter((q) => q.type === "matching")
        .map((q) => q.question_id);

      // Fetch options and matching pairs
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

      // 3️⃣ Attach nested data & shuffle
      questions = qs.map((q) => {
        if (q.type === "multiple_choice") {
          const opts = options.filter((o) => o.question_id === q.question_id);
          return { ...q, options: shuffleArray(opts) };
        }
        if (q.type === "matching") {
          const pairs = matchingPairs.filter(
            (p) => p.question_id === q.question_id
          );
          return { ...q, matching_pairs: shuffleArray(pairs) };
        }
        // short_answer -> no answers sent
        return q;
      });
    }

    return NextResponse.json({
      quiz,
      ...(includeQuestions ? { questions } : {}),
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
