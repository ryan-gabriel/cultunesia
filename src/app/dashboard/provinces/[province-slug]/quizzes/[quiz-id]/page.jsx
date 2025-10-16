"use client";

import { columns } from "@/components/dataTable/questions/columns";
import { DataTable } from "@/components/dataTable/questions/data-table";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { fetchQuestions } from "@/utils/quizzes";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const params = useParams();
  const quizId = params["quiz-id"];
  const { session, loading } = useAuth();
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const fetched = useRef(false);

  useEffect(() => {
    if (!session || fetched.current) return;

    const loadData = async () => {
      setLoadingData(true);
      try {
        const quizzesData = await fetchQuestions(quizId);
        setData(quizzesData); // array quizzes
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
    fetched.current = true;
  }, [session]);

  // 🔹 Fungsi handle delete quiz
  const handleDelete = async (question) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus question ini?`)) return;

    try {
      const res = await fetch(
        `/api/admin/quizzes/${question.quiz_id}/questions/${question.question_id}`,
        {
          method: "DELETE",
        }
      );
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Gagal menghapus quiz");

      toast("Question berhasil dihapus", {
        duration: 3000,
      });

      setData((prev) =>
        prev.filter((q) => q.question_id !== question.question_id)
      );
    } catch (err) {
      console.error(err);
      toast("Error Occured", {
        duration: 3000,
      });
    }
  };

  if (loading || loadingData) return <p>Loading...</p>;
  if (!session) return null;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="w-full">
      <div className="w-full text-end my-4 px-4">
        <Link href={`/dashboard/quizzes/${quizId}/create`}>
          <Button className={"cursor-pointer"}>
            Create New Quiz <Plus />
          </Button>
        </Link>
      </div>

      <DataTable columns={columns} data={data} onDelete={handleDelete} />
    </div>
  );
};

export default Page;
