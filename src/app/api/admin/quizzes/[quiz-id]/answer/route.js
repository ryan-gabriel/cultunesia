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

    // Check if user already has a started attempt for this quiz
    let attemptId = null;
    if (user_id) {
      // First, check if there's an existing unfinished attempt
      const { data: existingAttempt, error: attemptError } = await supabase
        .from("user_quiz_attempts")
        .select("attempt_id")
        .eq("user_id", user_id)
        .eq("quiz_id", quiz_id)
        .is("finished_at", null)
        .single();

      if (attemptError && attemptError.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is okay
        throw attemptError;
      }

      attemptId = existingAttempt?.attempt_id;

      // If no existing attempt, create a new one
      if (!attemptId) {
        const { data: newAttempt, error: createError } = await supabase
          .from("user_quiz_attempts")
          .insert({
            user_id,
            quiz_id,
            started_at: new Date().toISOString(),
            score: 0
          })
          .select("attempt_id")
          .single();

        if (createError) throw createError;
        attemptId = newAttempt.attempt_id;
      }
    }

    // Fetch all questions for this quiz
    const { data: questions, error: qError } = await supabase
      .from("questions")
      .select("*")
      .eq("quiz_id", quiz_id);

    if (qError) throw qError;

    let totalPoints = 0;
    let earnedPoints = 0;

    const results = [];

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

      if (q.type === "multiple_choice") {
        // Fetch correct option
        const { data: options } = await supabase
          .from("options")
          .select("option_id, text, is_correct")
          .eq("question_id", q.question_id);

        const correctOption = options.find((o) => o.is_correct);
        correctAnswer = correctOption?.option_id || null;
        isCorrect = userAnswer.answer === correctAnswer;

        if (isCorrect) earnedPoints += q.points || 1;

        results.push({
          question_id: q.question_id,
          type: q.type,
          userAnswer: userAnswer.answer,
          correctAnswer,
          options: options.map((o) => ({
            option_id: o.option_id,
            text: o.text,
          })), // send options to frontend
          isCorrect,
        });
      }

      if (q.type === "short_answer") {
        const { data: keys } = await supabase
          .from("answer_keys")
          .select("correct_text")
          .eq("question_id", q.question_id);

        const correctTexts = keys.map((k) => k.correct_text);
        isCorrect = correctTexts.includes(userAnswer.answer?.trim());
        if (isCorrect) earnedPoints += q.points || 1;

        results.push({
          question_id: q.question_id,
          type: q.type,
          userAnswer: userAnswer.answer,
          correctAnswer: correctTexts,
          isCorrect,
        });
      }

      if (q.type === "matching") {
        const { data: pairs } = await supabase
          .from("matching_pairs")
          .select("*")
          .eq("question_id", q.question_id);

        const answerPairs = userAnswer.answer || [];

        // Check correctness per pair
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

        // Partial score: fraction of correct pairs
        const pairScore = (matchingCorrect / pairs.length) * (q.points || 1);
        earnedPoints += pairScore;

        results.push({
          question_id: q.question_id,
          type: q.type,
          pairs: pairResults,
          score: pairScore,
        });
      }
    }

    // Update user_quiz_attempts if user_id is provided
    if (user_id && attemptId) {
      const finalScore = Math.round(earnedPoints); // Round to nearest integer for storage
      
      const { error: updateError } = await supabase
        .from("user_quiz_attempts")
        .update({
          finished_at: new Date().toISOString(),
          score: finalScore
        })
        .eq("attempt_id", attemptId);

      if (updateError) {
        console.error("Error updating user attempt:", updateError);
        // Don't throw error here, still return quiz results even if attempt update fails
      }
    }

    const response = {
      totalPoints,
      earnedPoints,
      results,
    };

    // Add attempt info to response if user_id was provided
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

// Example usage:
// POST /api/submit-quiz
// Body with user tracking:
// {
//   "quiz_id": "40d466a7-1862-41e6-a1cf-5f659425cab0",
//   "user_id": "user-uuid-123",
//   "answers": [
//     {
//       "question_id": "0b673d0c-783d-46b8-aa53-9a203f4cdffd",
//       "type": "multiple_choice",
//       "answer": "opt1"
//     }
//   ]
// }

// Body without user tracking (anonymous):
// {
//   "quiz_id": "40d466a7-1862-41e6-a1cf-5f659425cab0",
//   "answers": [
//     {
//       "question_id": "0b673d0c-783d-46b8-aa53-9a203f4cdffd",
//       "type": "multiple_choice",
//       "answer": "opt1"
//     }
//   ]
// }

// Response with user tracking:
// {
//   "totalPoints": 3,
//   "earnedPoints": 2.5,
//   "attempt_id": "attempt-uuid-456",
//   "user_id": "user-uuid-123",
//   "results": [...]
// }

// Response without user tracking:
// {
//   "totalPoints": 3,
//   "earnedPoints": 2.5,
//   "results": [...]
// }