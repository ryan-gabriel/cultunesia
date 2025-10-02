import { createServerClient } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const supabase = createServerClient();

    const body = await req.json();
    const { quiz_id, answers, user_id } = body;

    if (!quiz_id || !answers) {
      return NextResponse.json(
        { error: "quiz_id dan answers wajib ada" },
        { status: 400 }
      );
    }

    // --- Handle attempt ---
    let attemptId = null;
    if (user_id) {
      const { data: existingAttempt, error: attemptError } = await supabase
        .from("user_quiz_attempts")
        .select("attempt_id")
        .eq("user_id", user_id)
        .eq("quiz_id", quiz_id)
        .is("finished_at", null)
        .single();

      if (attemptError && attemptError.code !== "PGRST116") {
        throw attemptError;
      }

      attemptId = existingAttempt?.attempt_id;

      if (!attemptId) {
        const { data: newAttempt, error: createError } = await supabase
          .from("user_quiz_attempts")
          .insert({
            user_id,
            quiz_id,
            started_at: new Date().toISOString(),
            score: 0,
          })
          .select("attempt_id")
          .single();

        if (createError) throw createError;
        attemptId = newAttempt.attempt_id;
      }
    }

    // --- Ambil pertanyaan ---
    const { data: questions, error: qError } = await supabase
      .from("questions")
      .select("*")
      .eq("quiz_id", quiz_id);

    if (qError) throw qError;

    let totalPoints = 0;
    let earnedPoints = 0;

    const results = [];
    const userAnswersToInsert = []; // kumpulin semua jawaban user di sini

    for (const q of questions) {
      totalPoints += q.points || 1;
      const userAnswer = answers.find((a) => a.question_id === q.question_id);

      let correctAnswer = null;
      let isCorrect = false;

      if (!userAnswer) {
        results.push({
          question_id: q.question_id,
          type: q.type,
          userAnswer: null,
          correctAnswer: null,
          isCorrect: false,
        });
        continue;
      }

      // --- Multiple Choice ---
      if (q.type === "multiple_choice") {
        const { data: options } = await supabase
          .from("options")
          .select("option_id, text, is_correct")
          .eq("question_id", q.question_id);

        const correctOption = options.find((o) => o.is_correct);
        correctAnswer = correctOption?.option_id || null;
        isCorrect = userAnswer.answer === correctAnswer;

        if (isCorrect) earnedPoints += q.points || 1;

        if (attemptId) {
          userAnswersToInsert.push({
            attempt_id: attemptId,
            question_id: q.question_id,
            selected_option_id: userAnswer.answer,
            is_correct: isCorrect,
          });
        }

        results.push({
          question_id: q.question_id,
          type: q.type,
          userAnswer: userAnswer.answer,
          correctAnswer,
          options: options.map((o) => ({
            option_id: o.option_id,
            text: o.text,
          })),
          isCorrect,
        });
      }

      // --- Short Answer ---
      if (q.type === "short_answer") {
        const { data: keys } = await supabase
          .from("answer_keys")
          .select("correct_text")
          .eq("question_id", q.question_id);

        const correctTexts = keys.map((k) => k.correct_text);
        isCorrect = correctTexts.includes(userAnswer.answer?.trim());
        if (isCorrect) earnedPoints += q.points || 1;

        if (attemptId) {
          userAnswersToInsert.push({
            attempt_id: attemptId,
            question_id: q.question_id,
            typed_text: userAnswer.answer,
            is_correct: isCorrect,
          });
        }

        results.push({
          question_id: q.question_id,
          type: q.type,
          userAnswer: userAnswer.answer,
          correctAnswer: correctTexts,
          isCorrect,
        });
      }

      // --- Matching ---
      if (q.type === "matching") {
        const { data: pairs } = await supabase
          .from("matching_pairs")
          .select("*")
          .eq("question_id", q.question_id);

        const answerPairs = userAnswer.answer || [];
        let matchingCorrect = 0;

        const pairResults = pairs.map((p) => {
          const userPair = answerPairs.find((a) => a.pair_id === p.pair_id);
          const isPairCorrect = userPair?.selected === p.right_text;
          if (isPairCorrect) matchingCorrect++;
          return {
            pair_id: p.pair_id,
            left_text: p.left_text,
            userSelected: userPair?.selected || null,
            correct: p.right_text,
            isCorrect: isPairCorrect,
          };
        });

        const pairScore = (matchingCorrect / pairs.length) * (q.points || 1);
        earnedPoints += pairScore;

        if (attemptId) {
          userAnswersToInsert.push({
            attempt_id: attemptId,
            question_id: q.question_id,
            matched_pairs: answerPairs,
            is_correct: matchingCorrect === pairs.length,
          });
        }

        results.push({
          question_id: q.question_id,
          type: q.type,
          pairs: pairResults,
          score: pairScore,
        });
      }
    }

    // --- Insert all answers in bulk ---
    if (attemptId && userAnswersToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from("user_answers")
        .insert(userAnswersToInsert);

      if (insertError) {
        console.error("Error inserting user_answers:", insertError);
      }
    }

    // --- Update skor attempt ---
    if (user_id && attemptId) {
      const finalScore = Math.round(earnedPoints);

      const { error: updateError } = await supabase
        .from("user_quiz_attempts")
        .update({
          finished_at: new Date().toISOString(),
          score: finalScore,
        })
        .eq("attempt_id", attemptId);

      if (updateError) {
        console.error("Error updating user attempt:", updateError);
      }
    }

    const response = {
      totalPoints,
      earnedPoints,
      results,
    };

    if (user_id && attemptId) {
      response.attempt_id = attemptId;
      response.user_id = user_id;
    }

    return NextResponse.json(response);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
