import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { QuestionDisplay } from "./question-display"
import { QuestionTracker } from "./question-tracker"
import { useNavigate, useParams } from "react-router-dom"
import { useToast } from "@/hooks/useToast"
import { useApi } from "@/hooks/useApi"
import { getTestQuestions } from "@/api/questionsApi"
import { createSubmission } from "@/api/submissionApi"

interface Question {
  id: string
  title: string
  answers: Array<{
    id?: string
    title: string | number
    is_correct: boolean
  }>
}

interface Answer {
  question: string
  answer: string
}

export default function SolveTestPage() {
  const params = useParams()
  const navigate = useNavigate();
  const { toast } = useToast()
  const testId = params.testId as string

  const { exec: fetchQuestions, data: questions = [], loading: isLoading } = useApi(getTestQuestions)
  const { exec: execCreateSubmission, error: createSubmissionError } = useApi(createSubmission)

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])

  useEffect(() => {
    if (testId) {
      fetchQuestions(testId)
    }
  }, [testId, fetchQuestions])

  const currentQuestion: Question | undefined = questions ? questions[currentQuestionIndex] : undefined

  const handleSelectAnswer = (answerId: string) => {
    const existingAnswerIndex = answers.findIndex((a) => a.question === currentQuestion?.id)

    if (existingAnswerIndex >= 0) {
      const updatedAnswers = [...answers]
      updatedAnswers[existingAnswerIndex].answer = answerId
      setAnswers(updatedAnswers)
    } else {
      setAnswers([...answers, { question: currentQuestion!.id, answer: answerId }])
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleNextQuestion = () => {
    if (questions && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handleGoToQuestion = (index: number) => {
    setCurrentQuestionIndex(index)
  }

  const handleSubmitTest = async () => {
    if (questions && answers.length < questions.length) {
      toast({
        title: "Warning",
        description: "You have not answered all questions. Submit anyway?",
      })
    }
    // TODO: Call submit test API here
    await execCreateSubmission(testId, {"selected_answers": answers})
    if(createSubmissionError){
        toast({
            title: "Error",
            description: "Failed to create submission.",
            variant: "destructive",
          })
    }
    else{
        toast({
        title: "Success",
        description: "Test submitted successfully.",
        })
        navigate("/dashboard")
    }
  }

  const isAnswered = answers.some((a) => a.question === currentQuestion?.id)
  const currentAnswer = answers.find((a) => a.question === currentQuestion?.id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading test questions...</p>
        </div>
      </div>
    )
  }

  if (!currentQuestion || (questions && questions.length === 0)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center max-w-md">
          <p className="text-muted-foreground mb-4">Failed to load test questions.</p>
          <Button onClick={() => navigate("/dashboard")}>Go Back</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-10 mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Test: {testId}</h1>
          <div className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions? questions.length: 0}
          </div>
        </div>
      </div>

      {/* Question Tracker */}
      <QuestionTracker
        questions={questions || []}
        currentIndex={currentQuestionIndex}
        answeredQuestions={answers.map((a) => a.question)}
        onSelectQuestion={handleGoToQuestion}
      />

      {/* Question Display */}
      <div className="mt-8">
        <QuestionDisplay
          question={currentQuestion}
          selectedAnswerId={currentAnswer?.answer}
          onSelectAnswer={handleSelectAnswer}
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3 mt-8 pt-6 border-t">
        <Button
          variant="outline"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className="flex-1 bg-transparent"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        {questions && currentQuestionIndex === questions.length - 1 ? (
          <Button onClick={handleSubmitTest} className="flex-1">
            Submit Test
          </Button>
        ) : (
          <Button onClick={handleNextQuestion} className="flex-1">
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
