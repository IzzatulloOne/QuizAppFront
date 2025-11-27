import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

interface Option {
  id: string
  text: string
  isCorrect: boolean
}

interface Question {
  id: string
  text: string
  options: Option[]
  correctOptionId: string
}

interface QuestionFormProps {
  question: Question
  index: number
  onUpdate: (question: Question) => void
  onRemove: () => void
  disabled?: boolean
  canRemove?: boolean
  error?: {
    question?: string
    options?: string
  }
}

export function QuestionForm({
  question,
  index,
  onUpdate,
  onRemove,
  disabled = false,
  canRemove = true,
  error,
}: QuestionFormProps) {

  const update = (patch: Partial<Question>) =>
    onUpdate({ ...question, ...patch })

  const updateOptions = (
    options: Option[],
    correctId = question.correctOptionId
  ) => {
    // Cleanup: ensure correct answer remains valid
    const corrected =
      options.some((o) => o.id === correctId) ? correctId : options[0]?.id || ""

    update({
      options: options.map((o) => ({
        ...o,
        isCorrect: o.id === corrected
      })),
      correctOptionId: corrected,
    })
  }

  const setCorrect = (id: string) => {
    updateOptions(question.options, id)
  }

  const updateText = (text: string) => update({ text })

  const updateOption = (id: string, text: string) => {
    updateOptions(
      question.options.map((opt) =>
        opt.id === id ? { ...opt, text } : opt
      )
    )
  }

  const addOption = () => {
    const newId = `${question.id}-opt${Date.now()}`
    updateOptions([
      ...question.options,
      { id: newId, text: "", isCorrect: false }
    ])
  }

  const removeOption = (id: string) => {
    const remaining = question.options.filter((o) => o.id !== id)
    updateOptions(remaining)
  }

  return (
    <Card className="p-6 shadow-sm border rounded-xl transition hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold tracking-tight">
          Question {index}
        </h3>

        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemove}
            disabled={disabled}
            className="text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Question Input */}
      <div className="space-y-2 mb-6">
        <Label htmlFor={`question-${question.id}`} className="font-medium">
          Question Text
        </Label>
        <Input
          id={`question-${question.id}`}
          placeholder="Enter your question"
          value={question.text}
          onChange={(e) => updateText(e.target.value)}
          disabled={disabled}
          className={cn("transition", error?.question && "border-destructive")}
        />
        {error?.question && (
          <p className="text-xs text-destructive">{error.question}</p>
        )}
      </div>

      {/* Options */}
      <Label className="font-medium">Answer Options</Label>
      <span className="text-xs text-muted-foreground mb-2 block">
        Choose the correct option
      </span>

      <RadioGroup value={question.correctOptionId} disabled={disabled}>
        <div className="space-y-3">
          {question.options.map((opt, i) => (
            <div
              key={opt.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                "border-input hover:bg-accent/40",
                opt.isCorrect && "border-primary"
              )}
            >
              <RadioGroupItem
                value={opt.id}
                onClick={() => setCorrect(opt.id)}
              />

              <Input
                placeholder={`Option ${i + 1}`}
                value={opt.text}
                onChange={(e) => updateOption(opt.id, e.target.value)}
                disabled={disabled}
                className={cn(
                  "flex-1 border-0 bg-transparent p-0 focus-visible:ring-0",
                  error?.options && "border-destructive"
                )}
              />

              {question.options.length > 2 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeOption(opt.id)}
                  disabled={disabled}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </RadioGroup>
      {error?.options && (
        <p className="text-xs text-destructive mt-1">{error.options}</p>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addOption}
        disabled={disabled}
        className="w-full mt-4"
      >
        <Plus className="mr-2 h-3 w-3" />
        Add Option
      </Button>
    </Card>
  )
}
