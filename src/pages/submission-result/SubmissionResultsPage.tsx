"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, Check, X } from "lucide-react"
import type { TestSubmissionDetails } from "@/api/types"
import { useNavigate, useParams } from "react-router-dom"
import { useToast } from "@/hooks/useToast"
import { useApi } from "@/hooks/useApi"
import { getSubmissioDetails } from "@/api/submissionApi"

export default function SubmissionResultsPage() {
  const params = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const submissionId = params.submissionId as string

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  const { exec: fetchDetails, data: submission, loading } = useApi(getSubmissioDetails)

  useEffect(() => {
    fetchDetails(submissionId)
  }, [submissionId])

  if (loading) {
    return (
      <div className="container py-10 max-w-2xl flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading submission details...</p>
      </div>
    )
  }

  if (!submission || submission.selected_answers.length === 0) {
    return (
      <div className="container py-10 max-w-2xl">
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <p className="text-muted-foreground">No submission data found.</p>
      </div>
    )
  }

  const answers = submission.selected_answers
  const current = answers[currentQuestionIndex]

  const selectedAnswerTitle = current.answer?.title ?? current.answer_title
  const correctAnswerTitle = current.question?.answers?.find(a => a.is_correct)?.title ?? current.correct_answer_title
  const isCorrect = current.is_correct

  return (
    <div className="p-4 md:p-10 container py-10 mx-auto max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <h1 className="text-3xl font-bold tracking-tight">{submission.testName}</h1>

        <div className="flex items-center gap-4 mt-4">
          <div className="text-lg font-semibold">
            Score:{" "}
            <span className="text-primary">
              {submission.correct_count}/{submission.total_count}
            </span>
          </div>
          <div className="text-lg font-semibold">
            Accuracy:{" "}
            <span className="text-primary">
              {Math.round((submission.correct_count / submission.total_count) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Question Display */}
      <Card className="p-6 mb-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              Question {currentQuestionIndex + 1}/{answers.length}
            </h2>

            <div
              className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${
                isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {isCorrect ? (
                <>
                  <Check className="h-4 w-4" />
                  Correct
                </>
              ) : (
                <>
                  <X className="h-4 w-4" />
                  Incorrect
                </>
              )}
            </div>
          </div>

          <p className="text-lg font-medium">
            {current.question?.title ?? current.question_title}
          </p>
        </div>

        {/* Answers */}
        <div className="space-y-3">
          {(current.question?.answers ?? [{ title: selectedAnswerTitle }, { title: correctAnswerTitle }]).map(
            (ans, idx) => {
              const isSelected = ans.title === selectedAnswerTitle
              const isCorrectAns = ans.title === correctAnswerTitle

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    isCorrectAns
                      ? "border-green-500 bg-green-50"
                      : isSelected && !isCorrect
                      ? "border-red-500 bg-red-50"
                      : "border-border"
                  }`}
                >
                  <p className="font-medium">{ans.title}</p>

                  {isCorrectAns && <p className="text-xs text-green-700 mt-1">✓ Correct answer</p>}
                  {isSelected && !isCorrect && <p className="text-xs text-red-700 mt-1">✗ Your answer</p>}
                  {isSelected && isCorrect && (
                    <p className="text-xs text-green-700 mt-1">✓ Your answer (Correct)</p>
                  )}
                </div>
              )
            }
          )}
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>

        <div className="text-sm text-muted-foreground">
          Question {currentQuestionIndex + 1} of {answers.length}
        </div>

        <Button
          variant="outline"
          onClick={() =>
            setCurrentQuestionIndex(prev => Math.min(answers.length - 1, prev + 1))
          }
          disabled={currentQuestionIndex === answers.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
