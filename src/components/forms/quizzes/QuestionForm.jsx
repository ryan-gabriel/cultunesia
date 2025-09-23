"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
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
              new File([blob], file.name.replace(/\.\w+$/, ".png"), {
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

export default function QuestionForm({ onSubmit, initialData = null, quizId }) {
  const [formData, setFormData] = useState({
    quiz_id: quizId,
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
  });

  const questionTypes = [
    { value: "multiple_choice", label: "Multiple Choice" },
    { value: "short_answer", label: "Short Answer" },
    { value: "matching", label: "Matching Pairs" },
    { value: "image_guess", label: "Image Guess" },
  ];

  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type || "",
        text: initialData.text || "",
        points: initialData.points || 1,
        image_file: null,
        image_preview_url: initialData.image_url || null,
        options:
          initialData.type === "multiple_choice"
            ? initialData.options
            : [
                { text: "", is_correct: false },
                { text: "", is_correct: false },
              ],
        matching_pairs:
          initialData.type === "matching"
            ? initialData.matching_pairs
            : [{ left_text: "", right_text: "" }],
        answer_keys:
          initialData.type === "short_answer" ||
          initialData.type === "image_guess"
            ? initialData.answer_keys.map((k) => k.correct_text)
            : [""],
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTypeChange = (newType) => {
    setFormData((prev) => ({
      ...prev,
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
      answer_keys: [""],
    }));
  };

  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const pngFile = await convertImageToPng(file);
      const previewUrl = URL.createObjectURL(pngFile);
      setFormData((prev) => ({
        ...prev,
        image_file: pngFile,
        image_preview_url: previewUrl,
      }));
    } catch (error) {
      console.error("Image conversion failed:", error);
    }
  }, []);

  const handleAddOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, { text: "", is_correct: false }],
    }));
  };

  const handleRemoveOption = (index) => {
    if (formData.options.length > 2) {
      const updatedOptions = formData.options.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, options: updatedOptions }));
    }
  };

  const handleOptionTextChange = (index, value) => {
    const updatedOptions = [...formData.options];
    updatedOptions[index].text = value;
    setFormData((prev) => ({ ...prev, options: updatedOptions }));
  };

  const handleOptionCorrectChange = (index, checked) => {
    const updatedOptions = [...formData.options];
    updatedOptions[index].is_correct = checked;
    setFormData((prev) => ({ ...prev, options: updatedOptions }));
  };

  const handleAddMatchingPair = () => {
    setFormData((prev) => ({
      ...prev,
      matching_pairs: [
        ...prev.matching_pairs,
        { left_text: "", right_text: "" },
      ],
    }));
  };

  const handleRemoveMatchingPair = (index) => {
    if (formData.matching_pairs.length > 1) {
      const updatedPairs = formData.matching_pairs.filter(
        (_, i) => i !== index
      );
      setFormData((prev) => ({ ...prev, matching_pairs: updatedPairs }));
    }
  };

  const handleMatchingPairChange = (index, field, value) => {
    const updatedPairs = [...formData.matching_pairs];
    updatedPairs[index][field] = value;
    setFormData((prev) => ({ ...prev, matching_pairs: updatedPairs }));
  };

  const handleAddAnswerKey = () => {
    setFormData((prev) => ({
      ...prev,
      answer_keys: [...prev.answer_keys, ""],
    }));
  };

  const handleRemoveAnswerKey = (index) => {
    if (formData.answer_keys.length > 1) {
      const updatedKeys = formData.answer_keys.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, answer_keys: updatedKeys }));
    }
  };

  const handleAnswerKeyChange = (index, value) => {
    const updatedKeys = [...formData.answer_keys];
    updatedKeys[index] = value;
    setFormData((prev) => ({ ...prev, answer_keys: updatedKeys }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.type || !formData.text) {
      alert("Type dan Text wajib diisi");
      return;
    }

    const multipartData = new FormData();
    multipartData.append("quiz_id", formData.quiz_id);
    multipartData.append("type", formData.type);
    multipartData.append("text", formData.text);
    multipartData.append("points", formData.points);
    if (formData.image_file) multipartData.append("image", formData.image_file);

    switch (formData.type) {
      case "multiple_choice":
        multipartData.append("options", JSON.stringify(formData.options));
        break;
      case "matching":
        multipartData.append(
          "matching_pairs",
          JSON.stringify(formData.matching_pairs)
        );
        break;
      case "short_answer":
      case "image_guess":
        multipartData.append(
          "answer_keys",
          JSON.stringify(formData.answer_keys)
        );
        break;
    }

    try {
      const response = await fetch(
        `/api/admin/quizzes/${quizId}/questions/${
          initialData && initialData.question_id
        }`,
        {
          method: initialData ? "PUT" : "POST",
          body: multipartData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      const result = await response.json();
      console.log("Question created successfully:", result);
      onSubmit?.(result); // Pass the result back to the parent component
    } catch (error) {
      console.error("Failed to create question:", error.message);
      alert("Failed to create question: " + error.message);
    }
  };

  const handleRemoveImage = () => {
    handleChange("image_file", null);
    handleChange("image_preview_url", null);
  };

  const renderQuestionSpecificFields = () => {
    switch (formData.type) {
      case "multiple_choice":
        return (
          <div className="space-y-2">
            <Label className="font-semibold">Options</Label>
            {formData.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option.text}
                  onChange={(e) =>
                    handleOptionTextChange(index, e.target.value)
                  }
                />
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`option-correct-${index}`}
                    checked={option.is_correct}
                    onCheckedChange={(checked) =>
                      handleOptionCorrectChange(index, checked)
                    }
                  />
                  <Label htmlFor={`option-correct-${index}`}>Correct</Label>
                </div>
                {formData.options.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveOption(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddOption}
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Add Option
            </Button>
          </div>
        );
      case "short_answer":
      case "image_guess":
        return (
          <div className="space-y-2">
            <Label className="font-semibold">Answer Keys</Label>
            {formData.answer_keys.map((key, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder={`Answer key ${index + 1}`}
                  value={key}
                  onChange={(e) => handleAnswerKeyChange(index, e.target.value)}
                />
                {formData.answer_keys.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveAnswerKey(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddAnswerKey}
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Add Answer Key
            </Button>
          </div>
        );
      case "matching":
        return (
          <div className="space-y-2">
            <Label className="font-semibold">Matching Pairs</Label>
            {formData.matching_pairs.map((pair, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Left side"
                  value={pair.left_text}
                  onChange={(e) =>
                    handleMatchingPairChange(index, "left_text", e.target.value)
                  }
                />
                <span>↔</span>
                <Input
                  type="text"
                  placeholder="Right side"
                  value={pair.right_text}
                  onChange={(e) =>
                    handleMatchingPairChange(
                      index,
                      "right_text",
                      e.target.value
                    )
                  }
                />
                {formData.matching_pairs.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveMatchingPair(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddMatchingPair}
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
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      {/* Type */}
      <div>
        <Label className="block mb-1 font-semibold">Type</Label>
        <Select
          value={formData.type}
          onValueChange={handleTypeChange}
          disabled={!!initialData} // disable jika initialData ada
        >
          <SelectTrigger>
            <SelectValue placeholder="Select question type" />
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

      {/* Text */}
      <div>
        <Label className="block mb-1 font-semibold">Text</Label>
        <Textarea
          placeholder="Enter question text"
          value={formData.text}
          onChange={(e) => handleChange("text", e.target.value)}
          required
        />
      </div>

      {/* Image */}
      {(formData.type === "image_guess" ||
        formData.type === "multiple_choice") && (
        <div>
          <Label className="block mb-1 font-semibold">Image (optional)</Label>
          <Input type="file" accept="image/*" onChange={handleFileChange} />
          {formData.image_preview_url && (
            <div className="mt-2">
              <img
                src={formData.image_preview_url}
                alt="Preview"
                className="h-32 w-auto object-contain rounded-md border"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemoveImage}
                className="mt-2"
              >
                Remove Image
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Points */}
      <div>
        <Label className="block mb-1 font-semibold">Points</Label>
        <Input
          type="number"
          min={1}
          value={formData.points}
          onChange={(e) => handleChange("points", parseInt(e.target.value))}
        />
      </div>

      {renderQuestionSpecificFields()}

      <Button type="submit" disabled={!quizId}>
        {initialData ? "Update Question" : "Add Question"}
      </Button>
    </form>
  );
}
