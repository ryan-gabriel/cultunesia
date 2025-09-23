"use client";

import { columns } from "@/components/dataTable/quizzes/columns"; // ubah path columns quizzes
import { DataTable } from "@/components/dataTable/quizzes/data-table"; // path DataTable quizzes
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { fetchQuizzes } from "@/utils/quizzes";
import { Plus } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

const Page = () => {
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
        const quizzesData = await fetchQuizzes();
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
  const handleDelete = async (quiz) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus quiz "${quiz.title}"?`))
      return;

    try {
      const res = await fetch(`/api/quizzes/${quiz.quiz_id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Gagal menghapus quiz");

      alert("Quiz berhasil dihapus");

      setData((prev) => prev.filter((q) => q.quiz_id !== quiz.quiz_id));
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  if (loading || loadingData) return <p>Loading...</p>;
  if (!session) return null;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="w-full">
      <div className="w-full text-end my-4 px-4">
        <Link href={"/dashboard/quizzes/create"}>
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
