"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, Send, GripVertical, Award, Target } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function QuizDetail({ data, submitUrl, isDaily = false }) {
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dropZones, setDropZones] = useState({});
  const containerRef = useRef(null);
  const [userId, setUserId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // State untuk loading submit

  const questions = data?.questions || [];

  useEffect(() => {
    const initialDropZones = {};
    questions.forEach((q) => {
      if (q.type === "matching") {
        q.matching_pairs.forEach((pair) => {
          initialDropZones[`${q.question_id}-${pair.pair_id}`] = null;
        });
      }
    });
    setDropZones(initialDropZones);

    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUserId(data.user.id);
    };
    fetchUser();
  }, [questions]);

  const handleAnswer = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleDragStart = (e, rightText, questionId) => {
    if (feedback) return;
    setDraggedItem({ rightText, questionId });
    e.dataTransfer.setData("text/plain", rightText);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, pairId, questionId) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.questionId !== questionId || feedback)
      return;

    const dropKey = `${questionId}-${pairId}`;
    const draggedText = draggedItem.rightText;

    // Hapus item dari zona drop lain jika sudah ada
    const newDropZones = { ...dropZones };
    Object.keys(newDropZones).forEach((key) => {
      if (newDropZones[key] === draggedText) {
        newDropZones[key] = null;
      }
    });

    // Drop item ke zona baru
    newDropZones[dropKey] = draggedText;
    setDropZones(newDropZones);

    // Update state jawaban
    const newAnswers = { ...answers };
    newAnswers[dropKey] = draggedText;
    setAnswers(newAnswers);

    setDraggedItem(null);
  };

  const handleRemoveFromDropZone = (pairId, questionId) => {
    if (feedback) return;

    const dropKey = `${questionId}-${pairId}`;
    const newDropZones = { ...dropZones };
    newDropZones[dropKey] = null;
    setDropZones(newDropZones);

    const newAnswers = { ...answers };
    delete newAnswers[dropKey];
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return; // Mencegah double submit
    setIsSubmitting(true);

    // Transformasi jawaban untuk API
    const submission = questions.map((q) => {
      if (q.type === "matching") {
        const matchingAnswers = q.matching_pairs.map((pair) => ({
          pair_id: pair.pair_id,
          selected: answers[`${q.question_id}-${pair.pair_id}`] || null,
        }));
        return {
          question_id: q.question_id,
          type: q.type,
          answer: matchingAnswers,
        };
      }
      return {
        question_id: q.question_id,
        type: q.type,
        answer: answers[q.question_id] || null,
      };
    });

    try {
      const bodyPayload = {
        quiz_id: data.quiz.quiz_id,
        answers: submission,
        ...(isDaily && userId ? { user_id: userId } : {}), // Hanya sertakan userId jika daily quiz
      };

      const res = await fetch(submitUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });

      if (!res.ok) throw new Error("Failed to submit quiz");

      const result = await res.json();
      setFeedback(result);
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      alert("Error submitting quiz");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isRightTextUsed = (rightText, questionId) => {
    return Object.keys(dropZones).some(
      (key) => key.startsWith(`${questionId}-`) && dropZones[key] === rightText
    );
  };

  const getPercentage = () => {
    if (!feedback) return 0;
    return Math.round((feedback.earnedPoints / feedback.totalPoints) * 100);
  };

  const getGradeMessage = () => {
    const percentage = getPercentage();
    if (percentage >= 90)
      return {
        text: "Excellent! 🏆",
        color: "text-green-600 dark:text-green-400",
      };
    if (percentage >= 80)
      return {
        text: "Great Job! 🎉",
        color: "text-blue-600 dark:text-blue-400",
      };
    if (percentage >= 70)
      return {
        text: "Good Work! 👍",
        color: "text-yellow-600 dark:text-yellow-400",
      };
    if (percentage >= 60)
      return {
        text: "Keep Practicing! 🧠",
        color: "text-orange-600 dark:text-orange-400",
      };
    return {
      text: "Need More Practice 📚",
      color: "text-red-600 dark:text-red-400",
    };
  };

  const isSubmitDisabled = () => {
    if (feedback || isSubmitting) return true;

    const totalRequiredAnswers = questions.length;
    let answeredCount = 0;

    questions.forEach((q) => {
      if (q.type === "matching") {
        const matchingAnsweredCount = Object.keys(dropZones).filter(
          (key) =>
            key.startsWith(`${q.question_id}-`) && dropZones[key] !== null
        ).length;
        if (matchingAnsweredCount === q.matching_pairs.length) {
          answeredCount++;
        }
      } else if (answers[q.question_id]) {
        answeredCount++;
      }
    });

    return answeredCount < totalRequiredAnswers;
  };

  // ==========================================================
  // MODIFIKASI: FUNGSI UNTUK MENENTUKAN STATUS KEBENARAN PERTANYAAN MATCHING
  // ==========================================================
  const getMatchingQuestionStatus = (q, qFeedback) => {
    if (!qFeedback || q.type !== "matching" || !qFeedback.pairs) {
      // Hanya berlaku untuk matching dengan feedback
      return { isCorrect: qFeedback?.isCorrect ?? false, scoreDisplay: null };
    }

    // Cek apakah SEMUA pasangan benar (skor harus sama dengan total poin)
    const allCorrect = qFeedback.score === q.points;

    // Tentukan tampilan skor: Jika semua benar 1/1, jika ada yang salah 0/1
    const finalScore = allCorrect ? q.points : 0;

    return {
      isCorrect: allCorrect,
      scoreDisplay: `${finalScore}/${q.points}`,
    };
  };
  // ==========================================================

  return (
    <div
      ref={containerRef}
      className="space-y-6 max-h-[80vh] overflow-y-auto p-4 sm:p-6 md:max-w-full mx-auto"
      style={{ pointerEvents: "auto" }}
    >
      {/* Quiz Header (unchanged) */}
      {data?.quiz && (
        <div className="bg-gradient-to-r from-primary-gold/10 via-primary-gold/5 to-transparent dark:from-primary-gold/20 dark:via-primary-gold/10 dark:to-transparent p-6 rounded-xl border border-primary-gold/30 dark:border-primary-gold/40">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary-gold/20 dark:bg-primary-gold/30 rounded-lg">
              <Target className="w-6 h-6 text-primary-gold dark:text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {data.quiz.title}
            </h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 ml-14">
            {questions.length} question{questions.length !== 1 ? "s" : ""} •
            Total points: {questions.reduce((sum, q) => sum + q.points, 0)}
          </p>
        </div>
      )}

      {/* Score Card (updated to fixed points format) */}
      {feedback && (
        <Card className="border-2 border-primary-gold/50 bg-gradient-to-br from-primary-gold/10 via-transparent to-primary-gold/5 dark:from-primary-gold/20 dark:via-transparent dark:to-primary-gold/10 shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-gold/30 to-primary-gold/10 dark:from-primary-gold/40 dark:to-primary-gold/20 mb-2 shadow-md">
                <Award className="w-10 h-10 text-primary-gold dark:text-yellow-400" />
              </div>

              <div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  Quiz Completed!
                </h3>
                <p
                  className={`text-xl font-semibold ${getGradeMessage().color}`}
                >
                  {getGradeMessage().text}
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 py-4">
                <div className="text-center">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold text-primary-gold dark:text-yellow-400">
                      {Number(feedback.earnedPoints).toFixed(
                        feedback.totalPoints % 1 === 0 ? 0 : 2
                      )}
                    </span>
                    <span className="text-2xl text-gray-400 dark:text-gray-500">
                      /
                    </span>
                    <span className="text-3xl font-semibold text-gray-600 dark:text-gray-300">
                      {feedback.totalPoints}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    points earned
                  </p>
                </div>
              </div>

              <div className="max-w-xs mx-auto">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-gold to-yellow-500 dark:from-primary-gold dark:to-yellow-400 transition-all duration-1000 ease-out"
                    style={{ width: `${getPercentage()}%` }}
                  />
                </div>
                <p className="text-lg font-bold text-gray-700 dark:text-gray-300 mt-2">
                  {getPercentage()}% Correct
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Questions */}
      {questions.map((q, idx) => {
        const qFeedback = feedback?.results.find(
          (r) => r.question_id === q.question_id
        );

        let questionStatus = {
          isCorrect: qFeedback?.isCorrect ?? false,
          scoreDisplay:
            qFeedback?.score !== undefined
              ? `${Number(qFeedback.score).toFixed(2)}/${q.points}`
              : null,
        };

        // Override status for Matching questions
        if (q.type === "matching") {
          questionStatus = getMatchingQuestionStatus(q, qFeedback);
        }

        const isQuestionCorrect = questionStatus.isCorrect;
        const displayScore = questionStatus.scoreDisplay;

        return (
          <Card
            key={q.question_id}
            className="w-full shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800/50 dark:border-gray-700"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="text-lg text-gray-900 dark:text-gray-100 flex items-start gap-3">
                  <span className="inline-flex items-center justify-center min-w-[28px] h-7 rounded-full bg-primary-gold/20 dark:bg-primary-gold/30 text-primary-gold dark:text-yellow-400 text-sm font-bold flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span className="flex-1">{q.text}</span>
                </CardTitle>
                {feedback && qFeedback && (
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium flex-shrink-0 ${
                      isQuestionCorrect
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-700"
                        : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-700"
                    }`}
                  >
                    {isQuestionCorrect ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Correct</span>
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4" />
                        <span>Incorrect</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 ml-10 mt-1">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {q.points} {q.points === 1 ? "point" : "points"}
                </span>
                {feedback && qFeedback && displayScore && (
                  <span className="text-xs font-bold text-primary-gold dark:text-yellow-400">
                    • Earned: {displayScore}
                  </span>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Multiple Choice (unchanged) */}
              {q.type === "multiple_choice" && (
                <div className="flex flex-col space-y-2">
                  {q.options.map((opt) => {
                    const isUserAnswer =
                      answers[q.question_id] === opt.option_id;
                    const isCorrectAnswer =
                      feedback && qFeedback?.correctAnswer === opt.option_id;
                    const isCorrect =
                      feedback && qFeedback?.isCorrect && isUserAnswer;
                    const isWrong =
                      feedback && !qFeedback?.isCorrect && isUserAnswer;

                    return (
                      <Button
                        key={opt.option_id}
                        className={`relative z-10 justify-start text-left h-auto py-3 px-4 transition-all ${
                          !feedback && isUserAnswer
                            ? "bg-primary-gold hover:brightness-100 dark:hover:brightness-90 brightness-110 dark:brightness-100 hover:bg-primary-gold border-2 border-primary-gold shadow-md"
                            : isCorrect
                            ? "bg-green-100 dark:bg-green-900/30 border-2 border-green-500 dark:border-green-600 text-green-900 dark:text-green-100 hover:bg-green-100 dark:hover:bg-green-900/30 shadow-sm"
                            : isWrong
                            ? "bg-red-100 dark:bg-red-900/30 border-2 border-red-500 dark:border-red-600 text-red-900 dark:text-red-100 hover:bg-red-100 dark:hover:bg-red-900/30 shadow-sm"
                            : isCorrectAnswer
                            ? "bg-green-50 dark:bg-green-900/20 border-2 border-green-400 dark:border-green-700 text-green-800 dark:text-green-200 shadow-sm"
                            : "dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-700"
                        }`}
                        variant={
                          isUserAnswer && !feedback ? "default" : "outline"
                        }
                        onClick={() =>
                          handleAnswer(q.question_id, opt.option_id)
                        }
                        disabled={!!feedback}
                      >
                        <div className="flex items-center justify-between w-full gap-3">
                          <span className="flex-1">{opt.text}</span>
                          {feedback && (
                            <>
                              {isCorrect && (
                                <div className="flex items-center gap-1 bg-green-500/20 dark:bg-green-500/30 px-2 py-1 rounded-md">
                                  <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                                  <span className="text-xs font-medium text-green-700 dark:text-green-300">
                                    Your answer
                                  </span>
                                </div>
                              )}
                              {isWrong && (
                                <div className="flex items-center gap-1 bg-red-500/20 dark:bg-red-500/30 px-2 py-1 rounded-md">
                                  <X className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                                  <span className="text-xs font-medium text-red-700 dark:text-red-300">
                                    Your answer
                                  </span>
                                </div>
                              )}
                              {isCorrectAnswer && !isUserAnswer && (
                                <div className="flex items-center gap-1 bg-green-500/20 dark:bg-green-500/30 px-2 py-1 rounded-md">
                                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                                  <span className="text-xs font-medium text-green-700 dark:text-green-300">
                                    Correct answer
                                  </span>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </Button>
                    );
                  })}
                </div>
              )}

              {/* Short Answer (unchanged) */}
              {q.type === "short_answer" && (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={answers[q.question_id] || ""}
                    onChange={(e) =>
                      handleAnswer(q.question_id, e.target.value)
                    }
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold/50 dark:bg-gray-800 dark:text-gray-100 transition-all ${
                      feedback
                        ? qFeedback?.isCorrect
                          ? "border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-100"
                          : "border-red-500 dark:border-red-600 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100"
                        : "border-gray-300 dark:border-gray-600 hover:border-primary-gold/50 dark:hover:border-primary-gold/50"
                    }`}
                    placeholder="Type your answer..."
                    disabled={!!feedback}
                  />
                  {feedback && qFeedback && (
                    <div
                      className={`flex items-start gap-3 p-4 rounded-lg border ${
                        qFeedback.isCorrect
                          ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                          : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                      }`}
                    >
                      <div
                        className={`p-1 rounded-full flex-shrink-0 ${
                          qFeedback.isCorrect
                            ? "bg-green-100 dark:bg-green-800"
                            : "bg-red-100 dark:bg-red-800"
                        }`}
                      >
                        {qFeedback.isCorrect ? (
                          <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <X className="w-5 h-5 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        {!qFeedback.isCorrect && (
                          <>
                            <div className="space-y-1">
                              <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                                Your answer:
                              </p>
                              <p className="text-sm text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 px-3 py-2 rounded border border-red-200 dark:border-red-800">
                                {qFeedback.userAnswer}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                                Correct answer
                                {Array.isArray(qFeedback.correctAnswer) &&
                                qFeedback.correctAnswer.length > 1
                                  ? "s"
                                  : ""}
                                :
                              </p>
                              <p className="text-sm text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 px-3 py-2 rounded border border-green-200 dark:border-green-800">
                                {Array.isArray(qFeedback.correctAnswer)
                                  ? qFeedback.correctAnswer.join(", ")
                                  : qFeedback.correctAnswer}
                              </p>
                            </div>
                          </>
                        )}
                        {qFeedback.isCorrect && (
                          <p className="text-sm text-green-800 dark:text-green-300 font-semibold">
                            Perfect! Your answer is correct.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Matching (partial score kept in detail, but main status is all-or-nothing) */}
              {q.type === "matching" && (
                <div className="space-y-4">
                  <div className="mb-4">
                    <h4 className="font-semibold mb-3 text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wide flex items-center gap-2">
                      <GripVertical className="w-4 h-4" />
                      Available Options
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {q.matching_pairs.map((pair) => {
                        const isUsed = isRightTextUsed(
                          pair.right_text,
                          q.question_id
                        );
                        return (
                          <div
                            key={`right-${pair.pair_id}`}
                            draggable={!feedback && !isUsed}
                            onDragStart={(e) =>
                              handleDragStart(e, pair.right_text, q.question_id)
                            }
                            onDragEnd={() => setDraggedItem(null)}
                            className={`px-4 py-2.5 rounded-lg border-2 flex items-center gap-2 transition-all font-medium ${
                              isUsed
                                ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50 border-gray-300 dark:border-gray-600"
                                : feedback
                                ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed border-gray-300 dark:border-gray-600"
                                : "border-primary-gold bg-primary-gold/20 dark:bg-primary-gold/10 hover:bg-primary-gold/30 dark:hover:bg-primary-gold/20 text-gray-800 dark:text-gray-100 cursor-move shadow-sm hover:shadow-md"
                            }`}
                          >
                            {!feedback && !isUsed && (
                              <GripVertical className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            )}
                            <span className="select-none">
                              {pair.right_text}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wide">
                      Match Items
                    </h4>
                    {q.matching_pairs.map((pair) => {
                      const pairFeedback = qFeedback?.pairs?.find(
                        (p) => p.pair_id === pair.pair_id
                      );
                      const dropKey = `${q.question_id}-${pair.pair_id}`;
                      const droppedItem = dropZones[dropKey];
                      const isCorrectPair = feedback && pairFeedback?.isCorrect;
                      const isWrongPair =
                        feedback && pairFeedback && !pairFeedback.isCorrect;

                      return (
                        <div
                          key={pair.pair_id}
                          className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center"
                        >
                          <div className="font-semibold min-w-[140px] px-4 py-2.5 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-lg text-gray-800 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-600 shadow-sm">
                            {pair.left_text}
                          </div>

                          <div
                            onDragOver={handleDragOver}
                            onDrop={(e) =>
                              handleDrop(e, pair.pair_id, q.question_id)
                            }
                            className={`flex-1 min-h-[48px] border-2 rounded-lg p-3 flex items-center justify-between transition-all ${
                              isCorrectPair
                                ? "border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-900/20 shadow-sm"
                                : isWrongPair
                                ? "border-red-500 dark:border-red-600 bg-red-50 dark:bg-red-900/20 shadow-sm"
                                : draggedItem &&
                                  draggedItem.questionId === q.question_id
                                ? "border-primary-gold bg-primary-gold/10 dark:bg-primary-gold/20 border-dashed"
                                : droppedItem
                                ? "border-primary-gold/50 dark:border-primary-gold/40 bg-primary-gold/5 dark:bg-primary-gold/10"
                                : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 border-dashed"
                            }`}
                          >
                            {droppedItem ? (
                              <div className="flex items-center justify-between w-full gap-3">
                                <span className="text-gray-800 dark:text-gray-100 font-medium flex-1">
                                  {droppedItem}
                                </span>
                                <div className="flex items-center gap-2">
                                  {feedback && pairFeedback && (
                                    <div
                                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${
                                        pairFeedback.isCorrect
                                          ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-700"
                                          : "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-700"
                                      }`}
                                    >
                                      {pairFeedback.isCorrect ? (
                                        <>
                                          <Check className="h-3.5 w-3.5" />
                                          <span>Correct</span>
                                        </>
                                      ) : (
                                        <>
                                          <X className="h-3.5 w-3.5" />
                                          <span>Wrong</span>
                                        </>
                                      )}
                                    </div>
                                  )}
                                  {!feedback && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleRemoveFromDropZone(
                                          pair.pair_id,
                                          q.question_id
                                        )
                                      }
                                      className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md"
                                    >
                                      <X className="h-4 w-4 text-red-500 dark:text-red-400" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400 dark:text-gray-500 italic text-sm">
                                Drop answer here
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Matching Feedback Detail (Score detail kept) */}
                  {feedback && qFeedback && qFeedback.pairs && (
                    <div
                      className={`mt-4 p-4 rounded-lg border-2 ${
                        questionStatus.isCorrect
                          ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700"
                          : qFeedback.score > 0
                          ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700"
                          : "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700"
                      }`}
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-dashed dark:border-gray-700">
                        <p
                          className={`text-sm font-semibold ${
                            questionStatus.isCorrect
                              ? "text-green-800 dark:text-green-300"
                              : "text-red-800 dark:text-red-300"
                          }`}
                        >
                          Matching Pair Status (All or Nothing)
                        </p>
                        <span
                          className={`text-lg font-bold ${
                            questionStatus.isCorrect
                              ? "text-green-700 dark:text-green-400"
                              : "text-red-700 dark:text-red-400"
                          }`}
                        >
                          {questionStatus.isCorrect
                            ? "FULL SCORE"
                            : "ZERO SCORE"}
                        </span>
                      </div>
                      <ul className="space-y-2 pt-2">
                        {q.matching_pairs.map((pair) => {
                          const pairDetail = qFeedback.pairs.find(
                            (p) => p.pair_id === pair.pair_id
                          );
                          const isCorrect = pairDetail?.isCorrect;

                          return (
                            <li
                              key={pair.pair_id}
                              className="flex items-start gap-2 text-sm"
                            >
                              <span
                                className={`flex-shrink-0 mt-1 ${
                                  isCorrect
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-red-600 dark:text-red-400"
                                }`}
                              >
                                {isCorrect ? (
                                  <Check className="w-4 h-4" />
                                ) : (
                                  <X className="w-4 h-4" />
                                )}
                              </span>
                              <div className="flex-1">
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                  {pair.left_text}:
                                </span>
                                <span
                                  className={`ml-1 ${
                                    isCorrect
                                      ? "text-green-700 dark:text-green-300"
                                      : "text-red-700 dark:text-red-300"
                                  }`}
                                >
                                  {pairDetail?.userSelected || "No Answer"}
                                </span>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {/* Submit Button (unchanged) */}
      {!feedback && (
        <div className="sticky bottom-0 left-0 right-0 p-4 border-t bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800/80 shadow-2xl">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitDisabled()}
            className="w-full text-lg h-12 flex items-center gap-2 bg-primary-gold hover:bg-primary-gold/90 dark:bg-yellow-600 dark:hover:bg-yellow-500 transition-all shadow-lg hover:shadow-xl"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Quiz
              </>
            )}
          </Button>
          {isSubmitDisabled() && !isSubmitting && (
            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
              Please answer all questions before submitting.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
