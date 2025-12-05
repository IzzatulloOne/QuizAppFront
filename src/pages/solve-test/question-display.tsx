import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface Question {
  id: string
  title: string
  answers: Array<{
    id?: string
    title: string | number
    is_correct: boolean
  }>
}

interface QuestionDisplayProps {
  question: Question
  selectedAnswerId?: string
  onSelectAnswer: (answerId: string) => void
}

export function QuestionDisplay({ question, selectedAnswerId, onSelectAnswer }: QuestionDisplayProps) {
  return (
    <Card className="p-8">
      {/* Question Title */}
      <h2 className="text-2xl font-semibold mb-8">{question.title}</h2>

      {/* Answer Options */}
      <RadioGroup value={selectedAnswerId || ""} onValueChange={onSelectAnswer}>
        <div className="space-y-4">
          {question.answers.map((answer, index) => {
            const answerId = answer.id || `answer-${index}`
            return (
              <div key={answerId} className="flex items-center space-x-3">
                <RadioGroupItem value={answerId} id={answerId} />
                <Label htmlFor={answerId} className="cursor-pointer flex-1 font-normal text-base">
                  {answer.title}
                </Label>
              </div>
            )
          })}
        </div>
      </RadioGroup>
    </Card>
  )
}
