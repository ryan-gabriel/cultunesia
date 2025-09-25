import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseServer";
import { uploadFileToStorage } from "@/utils/supabaseStorage";

export async function PUT(req, context) {
  const supabase = createServerClient();

  const params = context.params;
  const questionId = params["question-id"];

  if (!questionId) {
    return NextResponse.json(
      { error: "Question ID wajib ada" },
      { status: 400 }
    );
  } 

  try {
    const formData = await req.formData();
    const text = formData.get("text");
    const points = parseInt(formData.get("points")) || 1;
    const imageFile = formData.get("image"); // optional
    const typeSpecificData = {
      options: formData.get("options"),
      matching_pairs: formData.get("matching_pairs"),
      answer_keys: formData.get("answer_keys"),
    };

    // Ambil question lama dari DB untuk mengetahui type
    const { data: existingQuestion, error: fetchError } = await supabase
      .from("questions")
      .select("*")
      .eq("question_id", questionId)
      .single();

    if (fetchError || !existingQuestion) {
      return NextResponse.json(
        { error: "Question tidak ditemukan" },
        { status: 404 }
      );
    }

    const type = existingQuestion.type; // tetap, tidak bisa diubah

    // Upload image baru jika ada
    let image_url = existingQuestion.image_url;
    if (imageFile && imageFile.size > 0) {
      const path = existingQuestion.image_url
        ?.split("/storage/v1/object/public/general/")[1] // ambil path di bucket dari publicUrl
        ?.split("?")[0];

      image_url = await uploadFileToStorage(
        imageFile,
        path,
        "general",
        "replace"
      );
    }

    // Update question utama
    const { data: updatedQuestion, error: updateError } = await supabase
      .from("questions")
      .update({ text, points, image_url })
      .eq("question_id", questionId)
      .select("*")
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: "Gagal update question" },
        { status: 500 }
      );
    }

    // Update type-specific fields
    if (type === "multiple_choice" && typeSpecificData.options) {
      const options = JSON.parse(typeSpecificData.options); // [{text, is_correct}]
      await supabase.from("options").delete().eq("question_id", questionId);
      for (const opt of options) {
        await supabase
          .from("options")
          .insert([{ question_id: questionId, ...opt }]);
      }
    } else if (type === "matching" && typeSpecificData.matching_pairs) {
      const pairs = JSON.parse(typeSpecificData.matching_pairs);
      await supabase
        .from("matching_pairs")
        .delete()
        .eq("question_id", questionId);
      for (const p of pairs) {
        await supabase
          .from("matching_pairs")
          .insert([{ question_id: questionId, ...p }]);
      }
    } else if (
      (type === "short_answer") &&
      typeSpecificData.answer_keys
    ) {
      const keys = JSON.parse(typeSpecificData.answer_keys);
      await supabase.from("answer_keys").delete().eq("question_id", questionId);
      for (const k of keys) {
        await supabase
          .from("answer_keys")
          .insert([{ question_id: questionId, ...k }]);
      }
    }

    return NextResponse.json({ question: updatedQuestion });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req, context) {
  const supabase = createServerClient();

  const params = await context.params;
  const questionId = params["question-id"];

  if (!questionId) {
    return NextResponse.json(
      { error: "Question ID wajib ada" },
      { status: 400 }
    );
  }

  try {
    // Ambil question utama
    const { data: question, error: fetchError } = await supabase
      .from("questions")
      .select("*")
      .eq("question_id", questionId)
      .single();

    if (fetchError || !question) {
      return NextResponse.json(
        { error: "Question tidak ditemukan" },
        { status: 404 }
      );
    }

    const type = question.type;

    // Ambil type-specific data
    let typeSpecificData = {};
    if (type === "multiple_choice") {
      const { data: options } = await supabase
        .from("options")
        .select("*")
        .eq("question_id", questionId);
      typeSpecificData.options = options || [];
    } else if (type === "matching") {
      const { data: matching_pairs } = await supabase
        .from("matching_pairs")
        .select("*")
        .eq("question_id", questionId);
      typeSpecificData.matching_pairs = matching_pairs || [];
    } else if (type === "short_answer") {
      const { data: answer_keys } = await supabase
        .from("answer_keys")
        .select("*")
        .eq("question_id", questionId);
      typeSpecificData.answer_keys = answer_keys || [];
    }

    return NextResponse.json({
      question: {
        ...question,
        ...typeSpecificData,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}


export async function DELETE(req, context) {
  const supabase = createServerClient();

  const params = context.params;
  const questionId = params["question-id"];

  if (!questionId) {
    return NextResponse.json(
      { error: "Question ID wajib ada" },
      { status: 400 }
    );
  }

  try {
    // Ambil question untuk mengetahui type
    const { data: question, error: fetchError } = await supabase
      .from("questions")
      .select("*")
      .eq("question_id", questionId)
      .single();

    if (fetchError || !question) {
      return NextResponse.json(
        { error: "Question tidak ditemukan" },
        { status: 404 }
      );
    }

    const type = question.type;

    // Hapus type-specific data terlebih dahulu
    if (type === "multiple_choice") {
      await supabase.from("options").delete().eq("question_id", questionId);
    } else if (type === "matching") {
      await supabase.from("matching_pairs").delete().eq("question_id", questionId);
    } else if (type === "short_answer") {
      await supabase.from("answer_keys").delete().eq("question_id", questionId);
    }

    // Hapus question utama
    const { error: deleteError } = await supabase
      .from("questions")
      .delete()
      .eq("question_id", questionId);

    if (deleteError) {
      return NextResponse.json(
        { error: "Gagal menghapus question" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Question berhasil dihapus" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
