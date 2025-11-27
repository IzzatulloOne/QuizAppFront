import { useState } from "react"
import { Plus, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/useToast"
import { useApi } from "@/hooks/useApi"
import { useNavigate } from "react-router-dom"
import { QuestionForm } from "./QuestionForm"
import { createTest } from "@/api/testApi"

interface Question {
  id: string
  text: string
  options: {
    id: string
    text: string
    isCorrect: boolean
  }[]
  correctOptionId: string
}

export default function CreateTestPage() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { exec: execCreateTest, loading: isSubmitting, error: createTestError } = useApi(createTest)

  const createQuestion = (id: string): Question => ({
    id,
    text: "",
    options: [
      { id: `${id}-opt1`, text: "", isCorrect: true },
      { id: `${id}-opt2`, text: "", isCorrect: false },
    ],
    correctOptionId: `${id}-opt1`,
  })

  const [testName, setTestName] = useState("")
  const [questions, setQuestions] = useState<Question[]>([
    createQuestion("1"),
  ])

  const [errors, setErrors] = useState<Record<string, any>>({})

  const addQuestion = () => {
    const id = Date.now().toString()
    setQuestions([...questions, createQuestion(id)])
  }

  const updateQuestion = (id: string, updated: Question) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? updated : q)))
  }

  const removeQuestion = (id: string) => {
    if (questions.length === 1) {
      return toast({
        title: "Error",
        description: "At least one question is required.",
        variant: "destructive",
      })
    }
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const validate = () => {
    const newErrors: any = {}

    if (!testName.trim()) newErrors.testName = "A test name is required."

    questions.forEach((q) => {
      let qErrors: any = {}

      if (!q.text.trim()) qErrors.question = "This question cannot be empty."

      const filled = q.options.filter((o) => o.text.trim())
      if (filled.length < 2)
        qErrors.options = "Provide at least 2 filled options."

      if (!q.correctOptionId)
        qErrors.options = "Select a correct answer."

      if (Object.keys(qErrors).length > 0) {
        newErrors[q.id] = qErrors
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return toast({
        title: "Validation Error",
        description: "Review highlighted fields.",
        variant: "destructive",
      })
    }

    const payload = {
      nomi: testName.trim(),
      questions: questions.map((q) => ({
        title: q.text.trim(),
        answers: q.options.map((o) => ({
          title: o.text,
          is_correct: o.isCorrect,
        })),
      })),
    }

    console.log(payload)
		await execCreateTest(payload)

		if(createTestError){
			toast({
        title: "Error",
        description: "Failed to create test.",
        variant: "destructive",
      })
		}
		else{
			toast({
				title: "Success",
				description: "Test created successfully.",
			})
			navigate("/dashboard/test")
		}
  }

  return (
    <div className="container mx-auto p-4 py-10 max-w-4xl">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => navigate("/dashboard/test")} 
        className="mb-4"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <h1 className="text-3xl font-bold mb-8">Create New Test</h1>

      <form onSubmit={handleSubmit} className="space-y-10">

        <Card className="p-6 shadow-sm">
          <Label htmlFor="testName" className="text-base font-semibold">
            Test Name
          </Label>
          <Input
            id="testName"
            placeholder="e.g., General Knowledge Exam"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            disabled={isSubmitting}
            className={errors.testName ? "border-destructive mt-2" : "mt-2"}
          />
          {errors.testName && (
            <p className="text-xs text-destructive mt-1">
              {errors.testName}
            </p>
          )}
        </Card>

        <div className="space-y-8">
          {questions.map((q, i) => (
            <QuestionForm
              key={q.id}
              question={q}
              index={i + 1}
              onUpdate={(updated) => updateQuestion(q.id, updated)}
              onRemove={() => removeQuestion(q.id)}
              disabled={isSubmitting}
              canRemove={questions.length > 1}
              error={errors[q.id]}
            />
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addQuestion}
            disabled={isSubmitting}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </div>

        <div className="flex gap-4 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/dashboard/test")}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? "Creating..." : "Create Test"}
          </Button>
        </div>
      </form>
    </div>
  )
}
