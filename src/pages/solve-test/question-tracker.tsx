import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Question {
  id: string
  title: string
  answers: Array<{
    id?: string
    title: string | number
    is_correct: boolean
  }>
}

interface QuestionTrackerProps {
  questions: Question[]
  currentIndex: number
  answeredQuestions: string[]
  onSelectQuestion: (index: number) => void
}

export function QuestionTracker({
  questions,
  currentIndex,
  answeredQuestions,
  onSelectQuestion,
}: QuestionTrackerProps) {
  return (
    <Card className="p-6">
      <p className="text-sm font-semibold text-muted-foreground mb-4">Questions</p>
      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => {
          const isAnswered = answeredQuestions.includes(question.id)
          const isCurrent = index === currentIndex

          return (
            <Button
              key={question.id}
              variant="outline"
              size="sm"
              onClick={() => onSelectQuestion(index)}
              className={cn(
                "w-10 h-10 p-0",
                isCurrent && "ring-2 ring-primary ring-offset-2",
                isAnswered && !isCurrent && "bg-green-100 border-green-300 text-green-900 hover:bg-green-100",
              )}
            >
              {index + 1}
            </Button>
          )
        })}
      </div>
    </Card>
  )
}
