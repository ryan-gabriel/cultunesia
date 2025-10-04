import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseServer";
import { v4 as uuidv4 } from "uuid";

function shuffleArray(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

/**
 * Fungsi utilitas yang TIDAK digunakan untuk matching.
 * Ditinggalkan di sini karena ada di prompt sebelumnya, namun tidak diperlukan
 * untuk solusi final ini.
 */
function shuffleMatchingPairs(pairs) {
  const leftTexts = pairs.map((pair) => ({
    pair_id: pair.pair_id,
    left_text: pair.left_text,
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

export async function POST(request) {
  try {
    const supabase = createServerClient();
    const formData = await request.formData();

    const title = formData.get("title");
    const category = formData.get("category") || "daily";
    const province_slug = formData.get("province_slug") || null;
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
        { quiz_id: uuidv4(), title, category, province_slug, scheduled_date },
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

      if (q.type === "short_answer" && Array.isArray(q.answer_keys)) {
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

export async function GET(req) {
  const supabase = createServerClient();

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "daily";
  const provinceSlug = searchParams.get("province_slug");
  const todayParam = searchParams.get("today");
  const userId = searchParams.get("user_id");

  let query = supabase.from("quizzes").select("*");

  // filter by type
  if (type === "province") {
    if (!provinceSlug) {
      return NextResponse.json(
        { error: "province_slug wajib diisi jika type=province" },
        { status: 400 }
      );
    }
    query = query.eq("category", "province").eq("province_slug", provinceSlug);
  } else {
    query = query.eq("category", "daily");
  }

  // filter by today if requested
  if (todayParam === "true") {
    const today = new Date().toISOString().split("T")[0];
    query = query.eq("scheduled_date", today);
  }

  const { data: quizzes, error } = await query;

  if (error) {
    return NextResponse.json(
      { error: "Gagal mengambil daftar quiz", details: error.message },
      { status: 500 }
    );
  }

  if (!quizzes || quizzes.length === 0) {
    return NextResponse.json({
      message: "Tidak ada quiz yang tersedia",
      quizzes: [],
    });
  }

  // =================================================================
  // LOGIKA RIWAYAT (ALREADY_COMPLETED: TRUE) - KUNCI JAWABAN HARUS BENAR
  // =================================================================
  if (userId && todayParam === "true") {
    const quizIds = quizzes.map((quiz) => quiz.quiz_id);

    const { data: attempts, error: attemptError } = await supabase
      .from("user_quiz_attempts")
      .select("attempt_id, quiz_id, finished_at, score")
      .eq("user_id", userId)
      .in("quiz_id", quizIds)
      .not("finished_at", "is", null);

    if (attemptError) {
      return NextResponse.json(
        { error: "Gagal mengecek riwayat quiz", details: attemptError.message },
        { status: 500 }
      );
    }

    if (attempts && attempts.length > 0) {
      const completedQuiz = attempts[0];
      const quizDetail = quizzes.find(
        (q) => q.quiz_id === completedQuiz.quiz_id
      );
      const attemptId = completedQuiz.attempt_id;

      try {
        const { data: userAnswers, error: answerError } = await supabase
          .from("user_answers")
          .select(
            "question_id, selected_option_id, typed_text, matched_pairs, is_correct"
          )
          .eq("attempt_id", attemptId);

        if (answerError) throw answerError;

        const userAnswersMap = new Map(
          userAnswers.map((ua) => [ua.question_id, ua])
        );

        const { data: qs, error: questionsError } = await supabase
          .from("questions")
          .select("question_id, type, text, points, image_url")
          .eq("quiz_id", quizDetail.quiz_id);

        if (questionsError) throw questionsError;

        const multipleChoiceIds = qs
          .filter((q) => q.type === "multiple_choice")
          .map((q) => q.question_id);
        const matchingIds = qs
          .filter((q) => q.type === "matching")
          .map((q) => q.question_id);
        const shortAnswerIds = qs
          .filter((q) => q.type === "short_answer")
          .map((q) => q.question_id);

        const [optionsRes, pairsRes, answerKeysRes] = await Promise.all([
          supabase
            .from("options")
            .select("option_id, question_id, text, is_correct")
            .in("question_id", multipleChoiceIds),
          supabase
            .from("matching_pairs")
            .select("pair_id, question_id, left_text, right_text")
            .in("question_id", matchingIds),
          supabase
            .from("answer_keys")
            .select("question_id, correct_text")
            .in("question_id", shortAnswerIds),
        ]);

        if (optionsRes.error) throw optionsRes.error;
        if (pairsRes.error) throw pairsRes.error;
        if (answerKeysRes.error) throw answerKeysRes.error;

        const options = optionsRes.data || [];
        const matchingPairs = pairsRes.data || [];
        const answerKeys = answerKeysRes.data || [];

        const questions = qs.map((q) => {
          const userAnswer = userAnswersMap.get(q.question_id);
          let questionData = { ...q, user_answer: userAnswer };

          if (q.type === "multiple_choice") {
            const opts = options.filter((o) => o.question_id === q.question_id);
            questionData.options = opts;
          } else if (q.type === "matching") {
            const pairs = matchingPairs.filter(
              (p) => p.question_id === q.question_id
            );
            // PASANGAN BENAR DIKIRIM UNTUK REVIEW
            questionData.matching_pairs = pairs;
          } else if (q.type === "short_answer") {
            const keys = answerKeys
              .filter((key) => key.question_id === q.question_id)
              .map((key) => key.correct_text);
            questionData.correct_answer =
              keys.length > 1 ? keys : keys[0] || null;
          }

          return questionData;
        });

        return NextResponse.json({
          message: "Anda sudah mengerjakan quiz hari ini",
          already_completed: true,
          quiz_title: quizDetail?.title,
          score: completedQuiz.score,
          completed_at: completedQuiz.finished_at,
          questions,
        });
      } catch (err) {
        console.error("Error fetching quiz history details:", err);
        return NextResponse.json(
          {
            message:
              "Anda sudah mengerjakan quiz hari ini (Gagal memuat detail riwayat)",
            already_completed: true,
            quiz_title: quizDetail?.title,
            score: completedQuiz.score,
            completed_at: completedQuiz.finished_at,
            error: "Gagal mengambil riwayat quiz",
            details: err.message,
          },
          { status: 200 }
        );
      }
    }
  }

  // =================================================================
  // LOGIKA QUIZ BARU (MODE AKTIF: MATCHING DIACAK TOTAL)
  // =================================================================
  if (todayParam === "true" && quizzes.length > 0) {
    const quiz = quizzes[0];

    try {
      const { data: qs, error: questionsError } = await supabase
        .from("questions")
        .select("question_id, type, text, points, image_url")
        .eq("quiz_id", quiz.quiz_id);

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

      // 1. Ambil semua teks kanan (right_text) dan acak urutannya.
      const allRightTexts = shuffleArray(
        matchingPairs.map((p) => p.right_text)
      );

      // 2. Acak urutan pasangan di sebelah kiri (left_text)
      const shuffledLeftPairs = shuffleArray(
        matchingPairs.map((p) => ({
          pair_id: p.pair_id,
          question_id: p.question_id,
          left_text: p.left_text,
        }))
      );

      const questions = qs.map((q) => {
        if (q.type === "multiple_choice") {
          const opts = options.filter((o) => o.question_id === q.question_id);
          return { ...q, options: shuffleArray(opts) };
        }
        if (q.type === "matching") {
          const pairsForQuestion = shuffledLeftPairs.filter(
            (p) => p.question_id === q.question_id
          );

          // Mengganti right_text dengan nilai yang diacak.
          // Karena semua left_text dan right_text diacak dan dipasangkan 1-ke-1,
          // hasil yang dikirim ke front-end sekarang adalah pasangan yang acak dan tidak benar.
          const mismatchedPairs = pairsForQuestion.map((leftItem, index) => ({
            ...leftItem,
            // Ambil right_text dari array yang sudah diacak total
            right_text: allRightTexts[index % allRightTexts.length],
          }));

          return {
            ...q,
            // PASANGAN KIRI DAN KANAN DI SINI AKAN SALING ACAK DAN TIDAK BERPASANGAN BENAR
            matching_pairs: mismatchedPairs,

            // Tambahkan juga array right_text asli yang diacak
            // agar front-end yang sudah di-custom bisa menggunakannya
            shuffled_options: allRightTexts.map((text, index) => ({
              // Tidak perlu pair_id yang sesuai di sini, hanya teks
              right_text: text,
              // Cukup tambahkan pair_id fiktif untuk key jika perlu
              pair_id: `shuffled-${index}`,
            })),
          };
        }
        return q;
      });

      return NextResponse.json({
        quiz: {
          quiz_id: quiz.quiz_id,
          title: quiz.title,
        },
        questions: questions,
      });
    } catch (err) {
      console.error("Error fetching quiz details:", err);
      return NextResponse.json(
        { error: "Gagal mengambil detail quiz", details: err.message },
        { status: 500 }
      );
    }
  }

  // Untuk request selain today's quiz, return simple list
  return NextResponse.json({ quizzes });
}

// Contoh penggunaan:
// GET /api/quizzes?type=daily&today=true&user_id=123
// Response jika sudah pernah:
// {
//   "message": "Anda sudah mengerjakan quiz hari ini",
//   "already_completed": true,
//   "quiz_title": "Quiz Harian 28 September",
//   "score": 85,
//   "completed_at": "2025-09-28T10:30:00"
// }

// Response jika belum pernah:
// {
//   "quiz": {
//     "quiz_id": "40d466a7-1862-41e6-a1cf-5f659425cab0",
//     "title": "Quiz Harian 28 September",
//     "category": "daily",
//     "scheduled_date": "2025-09-28"
//   },
//   "questions": [
//     {
//       "question_id": "0b673d0c-783d-46b8-aa53-9a203f4cdffd",
//       "type": "multiple_choice",
//       "text": "Which of these is traditional clothing in Japan?",
//       "points": 1,
//       "image_url": null,
//       "options": [
//         { "option_id": "opt1", "text": "Kimono" },
//         { "option_id": "opt2", "text": "Sari" }
//       ]
//     }
//   ]
// }
