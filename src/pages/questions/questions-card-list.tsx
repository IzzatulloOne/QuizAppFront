"use client"

import { Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Answer {
  title: string | number
  is_correct: boolean
}

interface Question {
  id: string
  title: string
  answers: Answer[]
}

interface QuestionsCardListProps {
  questions: Question[]
  onEdit: (question: Question) => void
  onDelete: (id: string) => void
}

export function QuestionsCardList({ questions, onEdit, onDelete }: QuestionsCardListProps) {
  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <Card key={question.id} className="p-4">
          <div className="space-y-3">
            {/* Question Title */}
            <p className="font-medium text-foreground">{question.title}</p>

            {/* Answers Preview */}
            <div className="text-sm text-muted-foreground space-y-1">
              {question.answers.map((answer, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs">{answer.is_correct ? "✓" : "○"}</span>
                  <span>{answer.title}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(question)} className="flex-1">
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => onDelete(question.id)} className="flex-1">
                <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                Delete
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
