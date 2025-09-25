import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseServer";
import { uploadFileToStorage } from "@/utils/supabaseStorage";

export async function GET(req, context) {
  const supabase = createServerClient();

  // Extract slug from context params
  const params = await context.params;
  const quizId = params["quiz-id"];

  if (!quizId) {
    return NextResponse.json({ error: "Quiz ID wajib ada" }, { status: 400 });
  }

  try {
    const { data: questions, error } = await supabase
      .from("questions")
      .select("*")
      .eq("quiz_id", quizId);

    if (error) {
      // Handle specific error cases
      if (error.code === "PGRST116") {
        // No rows returned (not found)
        return NextResponse.json(
          { error: "Questions tidak ditemukan" },
          { status: 404 }
        );
      }

      // Other database errors
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Gagal memuat questions" },
        { status: 500 }
      );
    }

    // Return the blog data
    return NextResponse.json({ questions });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  const supabase = createServerClient();

  try {
    const formData = await req.formData();

    const quiz_id = formData.get("quiz_id");
    const type = formData.get("type");
    const text = formData.get("text");
    const points = parseInt(formData.get("points")) || 1;
    const imageFile = formData.get("image");

    if (!quiz_id || !type || !text) {
      return NextResponse.json(
        { error: "quiz_id, type, dan text wajib diisi" },
        { status: 400 }
      );
    }

    // Upload image (opsional)
    let image_url = null;
    if (imageFile && imageFile.size > 0) {
      const path = `questions/${crypto.randomUUID()}.png`;
      image_url = await uploadFileToStorage(imageFile, path);
    }

    // Insert question
    const { data: questionData, error: questionError } = await supabase
      .from("questions")
      .insert([{ quiz_id, type, text, points, image_url }])
      .select("*")
      .single();

    if (questionError) {
      return NextResponse.json(
        { error: "Gagal menambahkan question" },
        { status: 500 }
      );
    }

    const question_id = questionData.question_id;

    // Handle type-specific fields
    if (type === "multiple_choice") {
      const options = JSON.parse(formData.get("options") || "[]"); // [{text, is_correct}]
      for (const opt of options) {
        await supabase.from("options").insert([{ question_id, ...opt }]);
      }
    } else if (type === "matching") {
      const pairs = JSON.parse(formData.get("matching_pairs") || "[]"); // [{left_text, right_text}]
      for (const p of pairs) {
        await supabase.from("matching_pairs").insert([{ question_id, ...p }]);
      }
    } else if (type === "short_answer") {
      const keys = JSON.parse(formData.get("answer_keys") || "[]");
      for (const k of keys) {
        await supabase.from("answer_keys").insert([{ question_id, ...k }]);
      }
    }

    return NextResponse.json({ question: questionData });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
