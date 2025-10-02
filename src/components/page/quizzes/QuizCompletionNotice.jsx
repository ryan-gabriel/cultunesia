import React, { useState } from "react";
import {
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Clock,
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
    return date.toLocaleDateString("en-US", {
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

// Component for rendering Multiple Choice question review
const MultipleChoiceReview = ({ question, options, user_answer }) => {
  const selectedOptionId = user_answer?.selected_option_id;

  return (
    <div className="space-y-2">
      {options.map((option) => {
        const isSelected = option.option_id === selectedOptionId;
        const isCorrect = option.is_correct;

        let bgColor = "";
        let textColor = "text-gray-800 dark:text-gray-200";
        let Icon = null;

        if (isSelected && isCorrect) {
          bgColor = "bg-green-100 dark:bg-green-900/50 border-green-500";
          Icon = CheckCircle;
        } else if (isSelected && !isCorrect) {
          bgColor = "bg-red-100 dark:bg-red-900/50 border-red-500";
          Icon = XCircle;
        } else if (isCorrect) {
          bgColor = "bg-green-50 dark:bg-green-900/20 border-green-500";
          Icon = CheckCircle;
          textColor = "text-green-800 dark:text-green-200";
        } else {
          bgColor =
            "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600";
        }

        return (
          <div
            key={option.option_id}
            className={`flex items-center p-3 rounded-lg border shadow-sm transition-colors ${bgColor}`}
          >
            <div className={`mr-3 ${Icon ? "w-5 h-5" : "w-5 h-5 invisible"}`}>
              {Icon && (
                <Icon
                  className={isCorrect ? "text-green-500" : "text-red-500"}
                />
              )}
            </div>
            <span className={`text-sm md:text-base flex-1 ${textColor}`}>
              {option.text}
            </span>
          </div>
        );
      })}
      {user_answer && !user_answer.is_correct && (
        <p className="text-red-600 dark:text-red-400 text-sm mt-2">
          Jawaban Anda salah. Jawaban yang benar ditandai hijau.
        </p>
      )}
      {user_answer && user_answer.is_correct && (
        <p className="text-green-600 dark:text-green-400 text-sm mt-2">
          Jawaban Anda benar.
        </p>
      )}
    </div>
  );
};

// Component for rendering Matching question review (simplified for single-file structure)
const MatchingReview = ({ question, matching_pairs, user_answer }) => {
  const userMatches = user_answer?.matched_pairs || {};

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
        Pasangan Jawaban:
      </p>
      <div className="grid grid-cols-2 gap-4">
        {matching_pairs.map((pair) => {
          const isCorrect = pair.is_correct;
          let bgColor = isCorrect
            ? "bg-green-100 dark:bg-green-900/50"
            : "bg-red-100 dark:bg-red-900/50";

          return (
            <div
              key={pair.pair_id}
              className={`p-3 rounded-lg flex flex-col space-y-1 ${bgColor}`}
            >
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {pair.left_text}
              </div>
              <div className="text-xs text-gray-700 dark:text-gray-300">
                Match: {pair.right_text}
              </div>
              <div
                className={`text-xs font-bold ${
                  isCorrect
                    ? "text-green-700 dark:text-green-300"
                    : "text-red-700 dark:text-red-300"
                }`}
              >
                {isCorrect ? "Correct Pair" : "Incorrect Pair"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Component for rendering Short Answer question review
const ShortAnswerReview = ({ question, user_answer }) => {
  const isCorrect = user_answer?.is_correct;
  const typedText = user_answer?.typed_text || "Tidak dijawab";

  let statusClass = isCorrect
    ? "bg-green-100 dark:bg-green-900/50 border-green-500"
    : "bg-red-100 dark:bg-red-900/50 border-red-500";
  let statusText = isCorrect
    ? "Jawaban Anda Benar!"
    : "Jawaban Anda Salah/Perlu Review";

  return (
    <div className={`p-4 rounded-lg border-2 ${statusClass} space-y-2`}>
      <p className="font-semibold text-gray-700 dark:text-gray-300">
        Jawaban Anda:
      </p>
      <p className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
        {typedText}
      </p>
      <p
        className={`font-bold ${
          isCorrect
            ? "text-green-700 dark:text-green-300"
            : "text-red-700 dark:text-red-300"
        }`}
      >
        Status: {statusText}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400 italic">
        (Untuk Short Answer, kebenaran jawaban mungkin perlu diverifikasi manual
        jika tidak ada kunci jawaban eksplisit di database.)
      </p>
    </div>
  );
};

// Main Component
const QuizCompletionNotice = ({ data }) => {
  const [showReview, setShowReview] = useState(false);

  // Fallback check, although 'already_completed' should ensure this structure
  if (!data.already_completed) {
    return (
      <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900 dark:border-red-700 dark:text-red-300">
        <p>
          You already finish today quiz (but quiz details are missing or
          incomplete).
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
          Quiz Selesai!
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {data.message}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {/* Score Display - Uses 'gld' concept */}
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
            {quiz_title || "Quiz Harian"}
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
          // Simulating requested class usage with tailwind equivalent accent
          style={{ "--color-primary-gld": "amber" }}
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
                    className={`p-4 sm:p-6 rounded-xl shadow-md transition-colors ${statusClass}`}
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