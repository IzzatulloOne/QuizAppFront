"use client"

import type React from "react"

import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState, useEffect } from "react"

interface Answer {
  id?: string
  title: string | number
  is_correct: boolean
}

interface Question {
  id: string
  title: string
  answers: Answer[]
}

interface QuestionEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  question: Question | null
  onSave: (question: Question) => void
  isSaving: boolean
}

export function QuestionEditDialog({ open, onOpenChange, question, onSave, isSaving }: QuestionEditDialogProps) {
  const [formData, setFormData] = useState<Question>({
    id: "",
    title: "",
    answers: [],
  })

  useEffect(() => {
    if (question) {
      setFormData({
        ...question,
        answers: question.answers.map((ans, idx) => ({
          ...ans,
          id: ans.id || `temp-${idx}`,
        })),
      })
    } else {
      setFormData({
        id: "",
        title: "",
        answers: [],
      })
    }
  }, [question, open])

  const handleTitleChange = (value: string) => {
    setFormData({ ...formData, title: value })
  }

  const handleAnswerChange = (id: string | undefined, text: string) => {
    setFormData({
      ...formData,
      answers: formData.answers.map((ans) => (ans.id === id ? { ...ans, title: text } : ans)),
    })
  }

  const handleCorrectAnswerChange = (id: string | undefined) => {
    setFormData({
      ...formData,
      answers: formData.answers.map((ans) => ({
        ...ans,
        is_correct: ans.id === id,
      })),
    })
  }

  const handleAddAnswer = () => {
    const newId = `temp-${Date.now()}`
    setFormData({
      ...formData,
      answers: [
        ...formData.answers,
        {
          id: newId,
          title: "",
          is_correct: false,
        },
      ],
    })
  }

  const handleRemoveAnswer = (id: string | undefined) => {
    const remaining = formData.answers.filter((ans) => ans.id !== id)
    setFormData({
      ...formData,
      answers: remaining,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      alert("Question title is required")
      return
    }

    if (formData.answers.length < 2) {
      alert("At least 2 answers are required")
      return
    }

    if (!formData.answers.some((ans) => ans.is_correct)) {
      alert("Select a correct answer")
      return
    }

    onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
        <DialogTitle>{question ? "Edit Question" : "New Question"}</DialogTitle>
        <DialogDescription>
            {question
            ? "Update the question text and its answer options."
            : "Enter the question text and add answer options."}
        </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question Title */}
          <div className="space-y-2">
            <Label htmlFor="question-title" className="font-medium">
              Question
            </Label>
            <Input
              id="question-title"
              placeholder="Enter your question"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              disabled={isSaving}
            />
          </div>

          {/* Answer Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="font-medium">Answer Options</Label>
              <span className="text-xs text-muted-foreground">Select the correct answer</span>
            </div>

            <RadioGroup value={formData.answers.find((ans) => ans.is_correct)?.id || ""} disabled={isSaving}>
              <div className="space-y-3">
                {formData.answers.map((answer, idx) => (
                  <div
                    key={answer.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-input hover:bg-accent/50 transition-colors"
                  >
                    {/* Radio Button */}
                    <RadioGroupItem
                      value={answer.id || ""}
                      id={`answer-${answer.id}`}
                      disabled={isSaving}
                      onClick={() => handleCorrectAnswerChange(answer.id)}
                    />

                    {/* Answer Input */}
                    <Input
                      id={`answer-${answer.id}`}
                      placeholder={`Option ${idx + 1}`}
                      value={answer.title}
                      onChange={(e) => handleAnswerChange(answer.id, e.target.value)}
                      disabled={isSaving}
                      className="flex-1 border-0 bg-transparent focus-visible:ring-0 p-0 h-auto"
                    />

                    {/* Remove Answer Button */}
                    {formData.answers.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveAnswer(answer.id)}
                        disabled={isSaving}
                        title="Remove option"
                        className="shrink-0"
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </RadioGroup>

            {/* Add Answer Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddAnswer}
              disabled={isSaving}
              className="w-full bg-transparent"
            >
              <Plus className="mr-2 h-3 w-3" />
              Add Option
            </Button>
          </div>

          {/* Footer */}
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
