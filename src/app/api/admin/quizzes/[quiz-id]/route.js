// File: src/app/api/admin/quizzes/[quiz-id]/route.js

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  const quizId = params['quiz-id']

  // Buat koneksi Supabase di server menggunakan service_role key
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY, // Gunakan service role key di sini
    { auth: { persistSession: false } }
  )

  const { data: quiz, error } = await supabase
    .from('quizzes')
    .select('title')
    .eq('quiz_id', quizId)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  return NextResponse.json({ quiz })
}