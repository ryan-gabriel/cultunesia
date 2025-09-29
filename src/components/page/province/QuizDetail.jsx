// const exampleData = {
//   quiz: {
//     quiz_id: '40d466a7-1862-41e6-a1cf-5f659425cab0',
//     title: 'Clothing'
//   },
//   questions: [
//     {
//       question_id: '0b673d0c-783d-46b8-aa53-9a203f4cdffd',
//       type: 'multiple_choice',
//       text: 'Which of these is traditional clothing in Japan?',
//       points: 1,
//       image_url: null,
//       options: [
//         { option_id: 'opt1', text: 'Kimono' },
//         { option_id: 'opt2', text: 'Sari' },
//         { option_id: 'opt3', text: 'Hanbok' },
//         { option_id: 'opt4', text: 'Dashiki' }
//       ]
//     },
//     {
//       question_id: '0c33900c-ccb4-4e17-ac4c-13203f78b5e0',
//       type: 'short_answer',
//       text: 'Name a traditional Indonesian clothing item',
//       points: 1,
//       image_url: null
//       // no answer keys sent to frontend
//     },
//     {
//       question_id: 'b4acc9c9-ac00-440b-b997-e750395dfab2',
//       type: 'matching',
//       text: 'Match the clothing item with its country',
//       points: 1,
//       image_url: null,
//       matching_pairs: [
//         { pair_id: 'pair1', left_text: 'Kimono', right_text: 'Japan' },
//         { pair_id: 'pair2', left_text: 'Sari', right_text: 'India' },
//         { pair_id: 'pair3', left_text: 'Hanbok', right_text: 'Korea' },
//         { pair_id: 'pair4', left_text: 'Dashiki', right_text: 'Nigeria' }
//       ]
//     }
//   ]
// };

"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, Send, GripVertical } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function QuizDetail({ data, submitUrl, isDaily = false }) {
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dropZones, setDropZones] = useState({});
  const containerRef = useRef(null);
  const [userId, setUserId] = useState(null);

  const questions = data?.questions || [];

  // Initialize drop zones for matching questions
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
    if (feedback) return; // prevent dragging after submit
    setDraggedItem({ rightText, questionId });
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

    // Remove the dragged item from any existing drop zone
    const newDropZones = { ...dropZones };
    Object.keys(newDropZones).forEach((key) => {
      if (newDropZones[key] === draggedText) {
        newDropZones[key] = null;
      }
    });

    // Place the dragged item in the new drop zone
    newDropZones[dropKey] = draggedText;
    setDropZones(newDropZones);

    // Update answers state
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
        ...(isDaily ? { user_id: userId } : {}), // tambahkan user_id hanya jika isDaily
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
    }
  };

  const getMultipleChoiceClass = (qId, optId) => {
    if (!feedback) return "outline";
    const qFeedback = feedback.results.find((r) => r.question_id === qId);
    if (!qFeedback) return "outline";
    if (qFeedback.userAnswer === optId) {
      return qFeedback.isCorrect ? "default bg-green-100" : "destructive";
    }
    if (qFeedback.correctAnswer === optId) return "default bg-green-100";
    return "outline";
  };

  const getShortAnswerClass = (qId) => {
    if (!feedback) return "";
    const qFeedback = feedback.results.find((r) => r.question_id === qId);
    if (!qFeedback) return "";
    return qFeedback.isCorrect
      ? "border-green-500 bg-green-50"
      : "border-red-500 bg-red-50";
  };

  const getMatchingClass = (qId, pairId) => {
    if (!feedback) return "";
    const qFeedback = feedback.results.find((r) => r.question_id === qId);
    if (!qFeedback) return "";
    const pair = qFeedback.pairs.find((p) => p.pair_id === pairId);
    if (!pair) return "";
    return pair.isCorrect
      ? "border-green-500 bg-green-50"
      : "border-red-500 bg-red-50";
  };

  const isRightTextUsed = (rightText, questionId) => {
    return (
      Object.values(dropZones).includes(rightText) &&
      Object.keys(dropZones).some(
        (key) => key.startsWith(questionId) && dropZones[key] === rightText
      )
    );
  };

  return (
    <div
      ref={containerRef}
      className="space-y-6 max-h-[80vh] overflow-y-auto p-4 sm:p-6 md:max-w-4xl mx-auto"
      style={{ pointerEvents: "auto" }}
    >
      {feedback && (
        <div className="p-4 rounded-md bg-blue-100 text-blue-900 mb-4">
          <h3 className="font-semibold text-lg">
            Your Score: {feedback.earnedPoints} / {feedback.totalPoints}
          </h3>
        </div>
      )}

      {questions.map((q, idx) => {
        const qFeedback = feedback?.results.find(
          (r) => r.question_id === q.question_id
        );

        return (
          <Card key={q.question_id} className="w-full">
            <CardHeader>
              <CardTitle>
                {idx + 1}. {q.text}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Multiple Choice */}
              {q.type === "multiple_choice" && (
                <div className="flex flex-col space-y-2">
                  {q.options.map((opt) => (
                    <Button
                      key={opt.option_id}
                      className="relative z-10"
                      variant={
                        answers[q.question_id] === opt.option_id
                          ? "default"
                          : "outline"
                      }
                      onClick={() => handleAnswer(q.question_id, opt.option_id)}
                      disabled={!!feedback}
                    >
                      {opt.text}
                      {answers[q.question_id] === opt.option_id && (
                        <Check className="ml-2 h-4 w-4" />
                      )}
                    </Button>
                  ))}
                </div>
              )}

              {/* Short Answer */}
              {q.type === "short_answer" && (
                <input
                  type="text"
                  value={answers[q.question_id] || ""}
                  onChange={(e) => handleAnswer(q.question_id, e.target.value)}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${getShortAnswerClass(
                    q.question_id
                  )}`}
                  placeholder="Type your answer..."
                  disabled={!!feedback}
                />
              )}

              {/* Matching with Drag & Drop */}
              {q.type === "matching" && (
                <div className="space-y-4">
                  {/* Available options to drag */}
                  <div className="mb-4">
                    <h4 className="font-medium mb-2 text-gray-700">
                      Drag these options:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {q.matching_pairs.map((pair) => (
                        <div
                          key={`right-${pair.pair_id}`}
                          draggable={
                            !feedback &&
                            !isRightTextUsed(pair.right_text, q.question_id)
                          }
                          onDragStart={(e) =>
                            handleDragStart(e, pair.right_text, q.question_id)
                          }
                          className={`px-3 py-2 rounded-md border cursor-move flex items-center gap-1 transition-all ${
                            isRightTextUsed(pair.right_text, q.question_id)
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed opacity-60"
                              : feedback
                              ? "bg-gray-100 cursor-not-allowed"
                              : "bg-blue-100 border-blue-300 hover:bg-blue-200"
                          }`}
                        >
                          {!feedback &&
                            !isRightTextUsed(
                              pair.right_text,
                              q.question_id
                            ) && (
                              <GripVertical className="h-4 w-4 text-gray-400" />
                            )}
                          <span className="select-none">{pair.right_text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Drop zones */}
                  <div className="space-y-3">
                    {q.matching_pairs.map((pair) => {
                      const pairFeedback = qFeedback?.pairs.find(
                        (p) => p.pair_id === pair.pair_id
                      );
                      const dropKey = `${q.question_id}-${pair.pair_id}`;
                      const droppedItem = dropZones[dropKey];

                      return (
                        <div
                          key={pair.pair_id}
                          className="flex flex-col sm:flex-row gap-3 items-start sm:items-center"
                        >
                          <div className="font-medium w-32 text-gray-700">
                            {pair.left_text}
                          </div>

                          <div
                            onDragOver={handleDragOver}
                            onDrop={(e) =>
                              handleDrop(e, pair.pair_id, q.question_id)
                            }
                            className={`flex-1 min-h-[40px] border-2 border-dashed rounded-md p-2 flex items-center justify-between transition-all ${
                              draggedItem &&
                              draggedItem.questionId === q.question_id
                                ? "border-blue-400 bg-blue-50"
                                : "border-gray-300"
                            } ${getMatchingClass(q.question_id, pair.pair_id)}`}
                          >
                            {droppedItem ? (
                              <div className="flex items-center justify-between w-full">
                                <span className="text-gray-800 font-medium">
                                  {droppedItem}
                                </span>
                                <div className="flex items-center gap-2">
                                  {feedback && pairFeedback && (
                                    <span>
                                      {pairFeedback.isCorrect ? (
                                        <Check className="text-green-500 h-4 w-4" />
                                      ) : (
                                        <X className="text-red-500 h-4 w-4" />
                                      )}
                                    </span>
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
                                      className="h-6 w-6 p-0 hover:bg-red-100"
                                    >
                                      <X className="h-3 w-3 text-red-500" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">
                                Drop answer here
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {!feedback && (
        <div className="flex justify-end mt-4">
          <Button variant="destructive" onClick={handleSubmit}>
            Submit <Send className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

// contoh final data yang dikirm ke enpoint
// {
//   "quiz_id": "40d466a7-1862-41e6-a1cf-5f659425cab0",
//   "answers": [
//     {
//       "question_id": "0b673d0c-783d-46b8-aa53-9a203f4cdffd",
//       "type": "multiple_choice",
//       "answer": "opt1"  // selected option_id
//     },
//     {
//       "question_id": "0c33900c-ccb4-4e17-ac4c-13203f78b5e0",
//       "type": "short_answer",
//       "answer": "Batik"  // text user typed
//     },
//     {
//       "question_id": "b4acc9c9-ac00-440b-b997-e750395dfab2",
//       "type": "matching",
//       "answer": [
//         { "pair_id": "pair1", "selected": "Japan" },
//         { "pair_id": "pair2", "selected": "India" },
//         { "pair_id": "pair3", "selected": "Korea" },
//         { "pair_id": "pair4", "selected": "Nigeria" }
//       ]
//     }
//   ]
// }

// contoh data response dari endpoint setelah di kirim jawaban user
// {
//   "totalPoints": 3,
//   "earnedPoints": 2.5,
//   "results": [
//     {
//       "question_id": "0b673d0c...",
//       "type": "multiple_choice",
//       "userAnswer": "opt1",
//       "correctAnswer": "opt1",
//       "options": [{ "option_id": "opt1", "text": "Kimono" }, ...],
//       "isCorrect": true
//     },
//     {
//       "question_id": "0c33900c...",
//       "type": "short_answer",
//       "userAnswer": "Batik",
//       "correctAnswer": ["Batik", "Kain Songket"],
//       "isCorrect": true
//     },
//     {
//       "question_id": "b4acc9c9...",
//       "type": "matching",
//       "pairs": [
//         { "pair_id": "pair1", "left_text": "Kimono", "userSelected": "Japan", "correct": "Japan", "isCorrect": true },
//         ...
//       ],
//       "score": 0.5
//     }
//   ]
// }
