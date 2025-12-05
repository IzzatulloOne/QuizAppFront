import { useEffect, useState } from "react"
import { Edit2, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { MyTest } from "@/api/types"
import { QuestionsCardList } from "./questions-card-list"
import { QuestionEditDialog } from "./question-edit-dialog"
import { useApi } from "@/hooks/useApi"
import { getMyTests } from "@/api/testApi"
import { useToast } from "@/hooks/useToast"
import { useMobile } from "@/hooks/useMobile"
import { createQuestion, deleteQuestion, getTestQuestions, updateQuestion } from "@/api/questionsApi"
import { ConfirmDialogWrapper } from "@/components/DeleteConfirmationDialog"

interface Question {
  id: string
  title: string
  answers: Array<{
    title: string | number
    is_correct: boolean
  }>
}

export default function QuestionsPage() {
  const { exec: fetchTests, data: tests = [], loading: isLoadingTests } = useApi(getMyTests)
  const { exec: fetchQuestions, data: questions = [], loading: isLoadingQuestions } = useApi(getTestQuestions)
  const { exec: execUpdateQuestion, loading: isSaving, error: updateQuestionError } = useApi(updateQuestion)
  const { exec: execCreateQuestion, error: createQuestionError } = useApi(createQuestion)
  const { exec: execDeleteQuestion, error: deleteQuestionError } = useApi(deleteQuestion)

  const [selectedTestId, setSelectedTestId] = useState<string>("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const { toast } = useToast()
  const isMobile = useMobile()

  // Fetch tests on mount
  useEffect(() => {
    fetchTests()
  }, [fetchTests])

  // Fetch questions when test is selected
  useEffect(() => {
    if (selectedTestId) {
      fetchQuestions(selectedTestId)
    }
  }, [selectedTestId, fetchQuestions])

  const handleOpenDialog = (question?: Question) => {
    setEditingQuestion(question || null)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingQuestion(null)
  }

  const handleSaveQuestion = async (questionData: Question) => {
    if (!selectedTestId) return

    if(editingQuestion){
      await execUpdateQuestion(editingQuestion.id, questionData)
      if(updateQuestionError){
        toast({
            title: "Error",
            description: "Failed to update question.",
            variant: "destructive",
        })
      }
      else{
        toast({
            title: "Success",
            description: "Question updated successfully.",
        })

        await fetchQuestions(selectedTestId)
        handleCloseDialog()
      }
    }
    else{
        await execCreateQuestion(selectedTestId, questionData)

        if(createQuestionError){
          toast({
            title: "Error",
            description: "Failed to create question.",
            variant: "destructive",
          })
        }
        else{
            toast({
                title: "Success",
                description: "Question created successfully.",
            })
            await fetchQuestions(selectedTestId)
            handleCloseDialog()
        }
    }
  }

  const handleDeleteQuestion = async (questionId: string) => {
    await execDeleteQuestion(questionId)

      if(deleteQuestionError){
        toast({
            title: "Error",
            description: "Failed to delete question.",
            variant: "destructive",
        })
      }
      else{
        toast({
            title: "Success",
            description: "Question deleted successfully.",
        })
        if (selectedTestId) {
            await fetchQuestions(selectedTestId)
        }
      }
  }

  return (
    <div className="p-4 md:p-10 container py-10 mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Edit Questions</h1>
        <p className="text-muted-foreground mt-2">Manage questions for your tests.</p>
      </div>

      {/* Test Selector */}
      <Card className="p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex-1">
            <label htmlFor="test-select" className="block text-sm font-medium mb-2">
              Select a Test
            </label>
            <Select value={selectedTestId} onValueChange={setSelectedTestId}>
              <SelectTrigger id="test-select">
                <SelectValue placeholder="Choose a test to edit questions..." />
              </SelectTrigger>
              <SelectContent>
                {isLoadingTests ? (
                  <div className="p-2 text-sm text-muted-foreground">Loading tests...</div>
                ) : tests?.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">No tests available</div>
                ) : (
                  tests?.map((test: MyTest) => (
                    <SelectItem key={test.id} value={test.id}>
                      {test.nomi}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          {selectedTestId && (
            <Button onClick={() => handleOpenDialog()} className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              New Question
            </Button>
          )}
        </div>
      </Card>

      {/* Questions List */}
      {selectedTestId ? (
        isLoadingQuestions ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading questions...</p>
            </div>
          </div>
        ) : questions?.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No questions found for this test.</p>
          </Card>
        ) : isMobile ? (
          <QuestionsCardList questions={questions||[]} onEdit={handleOpenDialog} onDelete={handleDeleteQuestion} />
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead className="w-[120px]">Answers</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questions?.map((question: Question) => (
                  <TableRow key={question.id}>
                    <TableCell className="font-medium">
                      <span className="line-clamp-2">{question.title}</span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{question.answers.length} options</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(question)} title="Edit">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <ConfirmDialogWrapper
                            onConfirm={() => handleDeleteQuestion(question.id)}
                            title={`Delete ${question.id}?`}
                            description={`Are you sure you want to delete ${question.id}? This action cannot be undone.`}
                        >
                            <Button variant="ghost" size="icon" title="Delete">
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </ConfirmDialogWrapper>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )
      ) : (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Select a test from the dropdown above to view and edit its questions.</p>
        </Card>
      )}

      {/* Edit Question Dialog */}
      <QuestionEditDialog
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
        question={editingQuestion}
        onSave={handleSaveQuestion}
        isSaving={isSaving}
      />
    </div>
  )
}
