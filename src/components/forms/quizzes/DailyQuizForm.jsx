"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Trash2 } from "lucide-react";

// Helper function to convert a File or Blob to PNG
const convertImageToPng = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(
              new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".png", {
                type: "image/png",
              })
            );
          } else {
            reject(new Error("Failed to convert image to PNG."));
          }
        }, "image/png");
      };
      img.onerror = (error) => reject(error);
      img.src = event.target.result;
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

// Daily Quiz Form Component
const DailyQuizForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    scheduled_date: "",
    questions: [
      {
        type: "multiple_choice",
        text: "",
        image_file: null, // Change to store the file object
        image_preview_url: null, // New state for image preview
        points: 1,
        options: [
          { text: "", is_correct: false },
          { text: "", is_correct: false },
        ],
        matching_pairs: [{ left_text: "", right_text: "" }],
        answer_keys: [""],
      },
    ],
  });

  const questionTypes = [
    { value: "multiple_choice", label: "Multiple Choice" },
    { value: "short_answer", label: "Short Answer" },
    { value: "matching", label: "Matching Pairs" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuestionChange = (questionIndex, field, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      [field]: value,
    };
    setFormData((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const handleQuestionTypeChange = (questionIndex, newType) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      type: newType,
      options:
        newType === "multiple_choice"
          ? [
              { text: "", is_correct: false },
              { text: "", is_correct: false },
            ]
          : [],
      matching_pairs:
        newType === "matching" ? [{ left_text: "", right_text: "" }] : [],
      answer_keys: newType === "short_answer" ? [""] : [],
    };
    setFormData((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const handleImageUpload = useCallback(
    async (e, questionIndex) => {
      const file = e.target.files[0];
      if (file) {
        try {
          const pngFile = await convertImageToPng(file);
          const previewUrl = URL.createObjectURL(pngFile);

          const updatedQuestions = [...formData.questions];
          updatedQuestions[questionIndex] = {
            ...updatedQuestions[questionIndex],
            image_file: pngFile, // Store the converted PNG file
            image_preview_url: previewUrl, // Store the preview URL
          };
          setFormData((prev) => ({ ...prev, questions: updatedQuestions }));
        } catch (error) {
          console.error("Image conversion failed:", error);
        }
      }
    },
    [formData.questions]
  );

  const handleOptionChange = (questionIndex, optionIndex, field, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options[optionIndex][field] = value;
    setFormData((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const handleMatchingPairChange = (questionIndex, pairIndex, field, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].matching_pairs[pairIndex][field] = value;
    setFormData((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const handleAnswerKeyChange = (questionIndex, keyIndex, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].answer_keys[keyIndex] = value;
    setFormData((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options.push({
      text: "",
      is_correct: false,
    });
    setFormData((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    setFormData((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const addMatchingPair = (questionIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].matching_pairs.push({
      left_text: "",
      right_text: "",
    });
    setFormData((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const removeMatchingPair = (questionIndex, pairIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].matching_pairs.splice(pairIndex, 1);
    setFormData((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const addAnswerKey = (questionIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].answer_keys.push("");
    setFormData((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const removeAnswerKey = (questionIndex, keyIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].answer_keys.splice(keyIndex, 1);
    setFormData((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          type: "multiple_choice",
          text: "",
          image_file: null,
          image_preview_url: null,
          points: 1,
          options: [
            { text: "", is_correct: false },
            { text: "", is_correct: false },
          ],
          matching_pairs: [{ left_text: "", right_text: "" }],
          answer_keys: [""],
        },
      ],
    }));
  };

  const removeQuestion = (questionIndex) => {
    const updatedQuestions = formData.questions.filter(
      (_, index) => index !== questionIndex
    );
    setFormData((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData object
    const finalFormData = new FormData();
    finalFormData.append("title", formData.title);
    finalFormData.append("scheduled_date", formData.scheduled_date);

    // Append questions data to FormData
    formData.questions.forEach((question, index) => {
      finalFormData.append(`questions[${index}][type]`, question.type);
      finalFormData.append(`questions[${index}][text]`, question.text);
      finalFormData.append(`questions[${index}][points]`, question.points);

      if (question.image_file) {
        finalFormData.append(`questions[${index}][image]`, question.image_file);
      }

      if (question.type === "multiple_choice") {
        finalFormData.append(
          `questions[${index}][options]`,
          JSON.stringify(question.options)
        );
      } else if (question.type === "matching") {
        finalFormData.append(
          `questions[${index}][matching_pairs]`,
          JSON.stringify(question.matching_pairs)
        );
      } else if (question.type === "short_answer") {
        finalFormData.append(
          `questions[${index}][answer_keys]`,
          JSON.stringify(question.answer_keys)
        );
      }
    });

    try {
      const response = await fetch("/api/admin/quizzes", {
        method: "POST",
        body: finalFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      const result = await response.json();
      console.log("Quiz created successfully:", result);
      // Handle success, e.g., show a success message or redirect the user
    } catch (error) {
      console.error("Failed to create quiz:", error.message);
      // Handle error, e.g., show an error message to the user
    }
  };

  const renderQuestionFields = (question, questionIndex) => {
    switch (question.type) {
      case "multiple_choice":
        return (
          <div className="space-y-3">
            <Label className="block text-sm font-medium text-gray-700">
              Options
            </Label>
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center space-x-2">
                <Input
                  type="text"
                  value={option.text}
                  onChange={(e) =>
                    handleOptionChange(
                      questionIndex,
                      optionIndex,
                      "text",
                      e.target.value
                    )
                  }
                  placeholder={`Option ${optionIndex + 1}`}
                />
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`mc-correct-${questionIndex}-${optionIndex}`}
                    checked={option.is_correct}
                    onCheckedChange={(checked) =>
                      handleOptionChange(
                        questionIndex,
                        optionIndex,
                        "is_correct",
                        checked
                      )
                    }
                  />
                  <Label
                    htmlFor={`mc-correct-${questionIndex}-${optionIndex}`}
                    className="text-sm"
                  >
                    Correct
                  </Label>
                </div>
                {question.options.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOption(questionIndex, optionIndex)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addOption(questionIndex)}
              className="mt-2"
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Add Option
            </Button>
          </div>
        );

      case "short_answer":
        return (
          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Answer Keys
            </Label>
            {question.answer_keys.map((key, keyIndex) => (
              <div key={keyIndex} className="flex items-center space-x-2 mb-2">
                <Input
                  type="text"
                  value={key}
                  onChange={(e) =>
                    handleAnswerKeyChange(
                      questionIndex,
                      keyIndex,
                      e.target.value
                    )
                  }
                  placeholder={`Answer ${keyIndex + 1}`}
                />
                {question.answer_keys.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAnswerKey(questionIndex, keyIndex)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addAnswerKey(questionIndex)}
              className="mt-2"
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Add Answer Key
            </Button>
          </div>
        );

      case "matching":
        return (
          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Matching Pairs
            </Label>
            {question.matching_pairs.map((pair, pairIndex) => (
              <div key={pairIndex} className="flex items-center space-x-2 mb-2">
                <Input
                  type="text"
                  value={pair.left_text}
                  onChange={(e) =>
                    handleMatchingPairChange(
                      questionIndex,
                      pairIndex,
                      "left_text",
                      e.target.value
                    )
                  }
                  placeholder="Left side"
                />
                <span className="text-gray-500">↔</span>
                <Input
                  type="text"
                  value={pair.right_text}
                  onChange={(e) =>
                    handleMatchingPairChange(
                      questionIndex,
                      pairIndex,
                      "right_text",
                      e.target.value
                    )
                  }
                  placeholder="Right side"
                />
                {question.matching_pairs.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMatchingPair(questionIndex, pairIndex)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addMatchingPair(questionIndex)}
              className="mt-2"
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Add Matching Pair
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Create Daily Quiz
          </CardTitle>
          <CardDescription>
            Fill out the form to create a new daily quiz.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Quiz Title</Label>
                <Input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter quiz title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="scheduled_date">Scheduled Date</Label>
                <Input
                  id="scheduled_date"
                  type="date"
                  value={formData.scheduled_date}
                  onChange={(e) =>
                    handleInputChange("scheduled_date", e.target.value)
                  }
                  required
                />
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Questions</h3>
              <Button type="button" onClick={addQuestion} variant="outline">
                <PlusCircle className="h-4 w-4 mr-2" /> Add Question
              </Button>
            </div>

            {formData.questions.map((question, questionIndex) => (
              <Card key={questionIndex} className="p-4 relative">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-semibold text-gray-900">
                    Question {questionIndex + 1}
                  </h4>
                  {formData.questions.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeQuestion(questionIndex)}
                      className="absolute top-2 right-2"
                    >
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor={`q-type-${questionIndex}`}>
                      Question Type
                    </Label>
                    <Select
                      value={question.type}
                      onValueChange={(value) =>
                        handleQuestionTypeChange(questionIndex, value)
                      }
                    >
                      <SelectTrigger id={`q-type-${questionIndex}`}>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                      <SelectContent>
                        {questionTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor={`q-points-${questionIndex}`}>Points</Label>
                    <Input
                      id={`q-points-${questionIndex}`}
                      type="number"
                      value={question.points}
                      onChange={(e) =>
                        handleQuestionChange(
                          questionIndex,
                          "points",
                          parseInt(e.target.value) || 1
                        )
                      }
                      min="1"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <Label htmlFor={`q-text-${questionIndex}`}>
                    Question Text
                  </Label>
                  <Textarea
                    id={`q-text-${questionIndex}`}
                    value={question.text}
                    onChange={(e) =>
                      handleQuestionChange(
                        questionIndex,
                        "text",
                        e.target.value
                      )
                    }
                    placeholder="Enter your question"
                    required
                  />
                </div>

                {question.type === "multiple_choice" && (
                  <div className="mb-4">
                    <Label htmlFor={`image-upload-${questionIndex}`}>
                      Image Upload (Optional)
                    </Label>
                    <Input
                      id={`image-upload-${questionIndex}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, questionIndex)}
                    />
                    {question.image_preview_url && (
                      <div className="mt-4 border p-2 rounded-lg">
                        <h5 className="text-sm font-medium mb-2">
                          Image Preview:
                        </h5>
                        <img
                          src={question.image_preview_url}
                          alt="Question preview"
                          className="max-h-64 w-auto rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                )}

                {renderQuestionFields(question, questionIndex)}
              </Card>
            ))}

            <Button type="submit" className="w-full">
              Create Daily Quiz
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyQuizForm;
