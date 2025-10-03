import React, { useState } from "react";
import {
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  ArrowRight,
} from "lucide-react";

/**
 * Utility function to format the completion date.
 * @param {string} isoDate - ISO 8601 date string.
 * @returns {string} Formatted date and time.
 */
const formatCompletionTime = (isoDate) => {
  if (!isoDate) return "N/A";
  try {
    const date = new Date(isoDate);
    // Menggunakan 'id-ID' untuk format Indonesia yang lebih umum
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch (e) {
    return "Invalid Date";
  }
};

// =================================================================
// 1. Multiple Choice Review (Tetap, karena strukturnya sudah benar)
// =================================================================
const MultipleChoiceReview = ({ question, options, user_answer }) => {
  const selectedOptionId = user_answer?.selected_option_id;

  return (
    <div className="space-y-2">
      {options.map((option) => {
        const isSelected = option.option_id === selectedOptionId;
        const isCorrectOption = option.is_correct;
        
        let bgColor = "";
        let textColor = "text-gray-800 dark:text-gray-200";
        let Icon = null;
        let borderClass = "border-gray-200 dark:border-gray-600";

        if (isSelected && isCorrectOption) {
          // User memilih dan benar
          bgColor = "bg-green-100 dark:bg-green-900/50";
          borderClass = "border-green-500";
          Icon = CheckCircle;
        } else if (isSelected && !isCorrectOption) {
          // User memilih dan salah
          bgColor = "bg-red-100 dark:bg-red-900/50";
          borderClass = "border-red-500";
          Icon = XCircle;
        } else if (isCorrectOption) {
          // Kunci Jawaban
          bgColor = "bg-green-50 dark:bg-green-900/20";
          borderClass = "border-green-400 dark:border-green-700";
          Icon = CheckCircle;
          textColor = "text-green-800 dark:text-green-200 font-semibold";
        } else {
          // Opsi Netral
          bgColor = "bg-gray-50 dark:bg-gray-700";
        }

        return (
          <div
            key={option.option_id}
            className={`flex items-center p-3 rounded-lg border-2 shadow-sm transition-colors ${bgColor} ${borderClass}`}
          >
            <div className={`mr-3 w-5 h-5 flex-shrink-0`}>
              {Icon && (
                <Icon
                  className={isCorrectOption ? "text-green-500" : "text-red-500"}
                />
              )}
            </div>
            <span className={`text-sm md:text-base flex-1 ${textColor}`}>
              {option.text}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// =================================================================
// 2. Matching Review (Diperbarui untuk menampilkan detail user vs correct)
// =================================================================
const MatchingReview = ({ question, matching_pairs, user_answer }) => {
  // Data user answer: { pair_id: selected_right_text, ... }
  const userMatches = user_answer?.matched_pairs || [];
  
  // Konversi array userMatches menjadi Map/Objek untuk pencarian cepat
  const userMatchMap = new Map(
    userMatches.map(p => [`${question.question_id}-${p.pair_id}`, p.selected])
  );

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
        Pasangan Kunci Jawaban:
      </p>
      {matching_pairs.map((correctPair) => {
        const dropKey = `${question.question_id}-${correctPair.pair_id}`;
        const userSelected = userMatchMap.get(dropKey);
        const isCorrect = userSelected === correctPair.right_text;

        const statusClass = isCorrect
          ? "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-800 dark:text-green-200"
          : "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-800 dark:text-red-200";
        
        const iconColor = isCorrect ? "text-green-500" : "text-red-500";

        return (
          <div
            key={correctPair.pair_id}
            className={`p-3 rounded-lg border-2 shadow-sm transition-colors ${statusClass}`}
          >
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">{correctPair.left_text}</span>
              <div className="flex items-center gap-1">
                {isCorrect ? <CheckCircle className={`w-4 h-4 ${iconColor}`} /> : <XCircle className={`w-4 h-4 ${iconColor}`} />}
                <span className={`font-bold ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {isCorrect ? "BENAR" : "SALAH"}
                </span>
              </div>
            </div>

            <div className="mt-2 text-xs grid grid-cols-2 gap-2">
                <div className="p-2 rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                    <span className="font-medium text-gray-600 dark:text-gray-400 block">Jawaban Anda:</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">{userSelected || 'Kosong'}</span>
                </div>
                <div className={`p-2 rounded border border-green-400/50 ${isCorrect ? 'bg-green-100/50 dark:bg-green-900/40' : 'bg-green-100/50 dark:bg-green-900/40'}`}>
                    <span className="font-medium text-green-700 dark:text-green-300 block">Kunci Jawaban:</span>
                    <span className="font-bold text-green-900 dark:text-green-100">{correctPair.right_text}</span>
                </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// =================================================================
// 3. Short Answer Review (Diperbarui untuk menampilkan kunci jawaban)
// =================================================================
const ShortAnswerReview = ({ question, user_answer }) => {
  const isCorrect = user_answer?.is_correct;
  const typedText = user_answer?.typed_text || "Tidak dijawab";
  // Kunci jawaban diambil dari struktur data baru (bisa string atau array)
  const correctAnswer = question.correct_answer;
  const correctText = Array.isArray(correctAnswer)
    ? correctAnswer.join(" ATAU ")
    : correctAnswer || "Kunci tidak tersedia";

  let statusClass = isCorrect
    ? "bg-green-100 dark:bg-green-900/50 border-green-500"
    : "bg-red-100 dark:bg-red-900/50 border-red-500";
  let statusText = isCorrect
    ? "Jawaban Anda Benar!"
    : "Jawaban Anda Salah/Perlu Review";
  let statusColor = isCorrect
    ? "text-green-700 dark:text-green-300"
    : "text-red-700 dark:text-red-300";

  return (
    <div className={`p-4 rounded-lg border-2 ${statusClass} space-y-3`}>
      <div className="flex items-center justify-between">
        <p className="font-bold text-lg text-gray-800 dark:text-gray-100">
            {isCorrect ? "🎉 Benar!" : "❌ Salah!"}
        </p>
        <span className={`font-bold ${statusColor}`}>{statusText}</span>
      </div>

      <div className="space-y-2">
        <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
          Jawaban Anda:
        </p>
        <p className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 whitespace-pre-wrap shadow-inner">
          {typedText}
        </p>
      </div>
      
      {!isCorrect && (
        <div className="space-y-2 pt-2 border-t border-dashed border-gray-400 dark:border-gray-600">
            <p className="font-semibold text-green-700 dark:text-green-300 text-sm">
              Kunci Jawaban yang Benar:
            </p>
            <p className="p-3 bg-green-50 dark:bg-green-900/30 rounded border border-green-300 dark:border-green-700 text-green-900 dark:text-green-100 whitespace-pre-wrap font-medium">
              {correctText}
            </p>
        </div>
      )}
    </div>
  );
};

// =================================================================
// 4. Main Component
// =================================================================
const QuizCompletionNotice = ({ data }) => {
  const [showReview, setShowReview] = useState(true); // Default show review for better UX after completion

  if (!data || !data.already_completed) {
    return (
      <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900 dark:border-red-700 dark:text-red-300 max-w-4xl mx-auto">
        <p>
          Anda sudah menyelesaikan kuis hari ini. Detail kuis tidak lengkap atau data tidak valid.
        </p>
      </div>
    );
  }

  const { quiz_title, score, completed_at, questions } = data;
  const totalPoints =
    questions?.reduce((sum, q) => sum + (q.points || 0), 0) || 1;
  const achievedScore = score || 0;

  // Calculate percentage for display
  const scorePercentage = Math.round((achievedScore / totalPoints) * 100);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
      {/* Header and Score Card */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
          Kuis Selesai! 🎉
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {data.message || "Terima kasih telah berpartisipasi dalam kuis harian."}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {/* Score Display */}
        <div className="md:col-span-1 p-6 rounded-xl shadow-lg bg-amber-500/10 border-2 border-amber-500/50 dark:bg-amber-900/30 dark:border-amber-700">
          <p className="text-sm font-medium text-amber-700 dark:text-amber-300 uppercase">
            Skor Anda
          </p>
          <p className="text-5xl font-black text-amber-600 dark:text-amber-400 mt-2">
            {scorePercentage}%
          </p>
          <p className="text-base text-gray-700 dark:text-gray-300 mt-1">
            {achievedScore} dari {totalPoints} Poin
          </p>
        </div>

        {/* Quiz Info */}
        <div className="md:col-span-2 p-6 rounded-xl shadow-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex flex-col justify-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {quiz_title || "Kuis Harian"}
          </h2>
          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
            <Clock className="w-4 h-4 mr-2" />
            Selesai pada:{" "}
            <span className="font-semibold ml-1">
              {formatCompletionTime(completed_at)}
            </span>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="mt-8 border-t pt-6 border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setShowReview(!showReview)}
          className="w-full flex justify-between items-center px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg shadow-md transition-all"
        >
          <span>{showReview ? "Sembunyikan" : "Lihat"} Review Jawaban</span>
          {showReview ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>

        {showReview && (
          <div className="mt-6 space-y-8">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white border-b pb-2">
              Detail Review
            </h3>

            {questions &&
              questions.map((q, index) => {
                const isCorrect = q.user_answer?.is_correct;
                const statusClass = isCorrect
                  ? "border-l-4 border-green-500 bg-green-50 dark:bg-gray-700/50"
                  : "border-l-4 border-red-500 bg-red-50 dark:bg-gray-700/50";

                return (
                  <div
                    key={q.question_id}
                    className={`p-4 sm:p-6 rounded-xl shadow-md transition-colors border border-gray-200 dark:border-gray-700 ${statusClass}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                        Pertanyaan {index + 1}
                        <span className="ml-3 text-sm font-medium text-amber-600 dark:text-amber-400">
                          ({q.points} Poin)
                        </span>
                      </p>
                      <div
                        className={`flex items-center text-base font-semibold ${
                          isCorrect
                            ? "text-green-600"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {isCorrect ? (
                          <>
                            <CheckCircle className="w-5 h-5 mr-1" /> Benar
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5 mr-1" /> Salah
                          </>
                        )}
                      </div>
                    </div>

                    {/* Question Text and Image */}
                    <p className="mb-4 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {q.text}
                    </p>
                    {q.image_url && (
                      <img
                        src={q.image_url}
                        alt={`Image for question ${index + 1}`}
                        className="max-w-full h-auto rounded-lg mb-4"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://placehold.co/400x200/cccccc/333333?text=Image+Unavailable";
                        }}
                      />
                    )}

                    {/* Answer Review based on type */}
                    <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                      {q.type === "multiple_choice" && (
                        <MultipleChoiceReview
                          question={q}
                          options={q.options || []}
                          user_answer={q.user_answer}
                        />
                      )}
                      {q.type === "matching" && (
                        <MatchingReview
                          question={q}
                          matching_pairs={q.matching_pairs || []}
                          user_answer={q.user_answer}
                        />
                      )}
                      {q.type === "short_answer" && (
                        <ShortAnswerReview
                          question={q}
                          user_answer={q.user_answer}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizCompletionNotice;