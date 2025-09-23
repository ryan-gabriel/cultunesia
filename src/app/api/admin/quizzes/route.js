import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseServer";
import { v4 as uuidv4 } from "uuid";

export async function POST(request) {
  try {
    const supabase = createServerClient();
    const formData = await request.formData();

    const title = formData.get("title");
    const category = formData.get("category") || "daily";
    const province_id = formData.get("province_id") || null;
    const scheduled_date = formData.get("scheduled_date") || null;

    if (!title) {
      return NextResponse.json(
        { error: "Missing required field: title" },
        { status: 400 }
      );
    }

    // Insert quiz
    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .insert([
        { quiz_id: uuidv4(), title, category, province_id, scheduled_date },
      ])
      .select()
      .single();

    if (quizError) throw quizError;

    // Parsing questions dari FormData
    const questions = [];
    for (const [key, value] of formData.entries()) {
      const match = key.match(/^questions\[(\d+)\]\[(.+)\]$/);
      if (match) {
        const index = parseInt(match[1]);
        const field = match[2];
        if (!questions[index]) questions[index] = {};
        try {
          if (["options", "matching_pairs", "answer_keys"].includes(field)) {
            questions[index][field] = JSON.parse(value);
          } else {
            questions[index][field] = value;
          }
        } catch {
          questions[index][field] = value;
        }
      }
    }

    // Insert questions + sub-data
    for (const q of questions) {
      const question_id = uuidv4();
      const { error: qError } = await supabase.from("questions").insert([
        {
          question_id,
          quiz_id: quiz.quiz_id,
          type: q.type,
          text: q.text,
          points: q.points || 1,
          image_url: q.image_url || null,
        },
      ]);
      if (qError) throw qError;

      if (q.type === "multiple_choice" && Array.isArray(q.options)) {
        const optionsData = q.options.map((opt) => ({
          option_id: uuidv4(),
          question_id,
          text: opt.text,
          is_correct: opt.is_correct || false,
        }));
        const { error: optError } = await supabase
          .from("options")
          .insert(optionsData);
        if (optError) throw optError;
      }

      if (q.type === "matching" && Array.isArray(q.matching_pairs)) {
        const pairsData = q.matching_pairs.map((pair) => ({
          pair_id: uuidv4(),
          question_id,
          left_text: pair.left_text,
          right_text: pair.right_text,
        }));
        const { error: pairError } = await supabase
          .from("matching_pairs")
          .insert(pairsData);
        if (pairError) throw pairError;
      }

      if (
        (q.type === "short_answer" || q.type === "image_guess") &&
        Array.isArray(q.answer_keys)
      ) {
        const keysData = q.answer_keys.map((ans) => ({
          key_id: uuidv4(),
          question_id,
          correct_text: ans,
        }));
        const { error: keyError } = await supabase
          .from("answer_keys")
          .insert(keysData);
        if (keyError) throw keyError;
      }
    }

    return NextResponse.json({ quiz, questions }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  const supabase = createServerClient();

  const { data: quizzes, error } = await supabase
    .from("quizzes")
    .select("*")
    .eq("category", "daily");

  if (error) {
    return NextResponse.json(
      { error: "Gagal mengambil daftar provinsi" },
      { status: 500 }
    );
  }

  return NextResponse.json({ quizzes });
}
