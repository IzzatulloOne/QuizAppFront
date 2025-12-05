import { useEffect, useState } from "react"
import { Plus, Trash2, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { MyTest } from "@/api/types"
import { TestsDialog } from "./tests-dialog"
import { TestsCardList } from "./tests-card-list"
import { useToast } from "@/hooks/useToast"
import { useMobile } from "@/hooks/useMobile"
import { useApi } from "@/hooks/useApi"
import { deleteTest, getMyTests, updateTest } from "@/api/testApi"
import { Link } from "react-router-dom"
import { ConfirmDialogWrapper } from "@/components/DeleteConfirmationDialog"

export default function MyTestPage() {
  const { exec: fetchTests, data: tests = [], loading: isLoading } = useApi(getMyTests)
  const { exec: execUpdateTest, loading: isSaving, error: updateError } = useApi(updateTest)
  const { exec: execDeleteTest, error: deleteError } = useApi(deleteTest)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTest, setEditingTest] = useState<MyTest | null>(null)
  const { toast } = useToast()
  const isMobile = useMobile()

  useEffect(() => {
    fetchTests()
  }, [])

  const handleOpenDialog = (test?: MyTest) => {
    setEditingTest(test || null)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingTest(null)
  }

  const handleSaveTest = async (testData: { nomi: string }) => {
    if (editingTest) {
        await execUpdateTest(editingTest.id, testData.nomi)
        toast({
          title: "Success",
          description: "Test updated successfully.",
        })
      }

      if(updateError){
        toast({
          title: "Error",
          description: updateError,
          variant: "destructive",
        })
      }

      await fetchTests()
      handleCloseDialog()
  }

  const handleDeleteTest = async (id: string) => {
    await execDeleteTest(id)

    if(deleteError){
      toast({
        title: "Error",
        description: "Failed to delete test.",
        variant: "destructive",
      })
    }
    else{
      await fetchTests()
      toast({
        title: "Success",
        description: "Test deleted successfully.",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading tests...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="p-4 md:p-10 mx-auto py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tests</h1>
          <p className="text-muted-foreground mt-2">Manage your tests and view test details.</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Link to="/dashboard/test-create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
             New Test
          </Link>
        </Button>
      </div>

      {/* Mobile Card List */}
      {isMobile ? (
        <TestsCardList tests={tests||[]} onEdit={handleOpenDialog} onDelete={handleDeleteTest} />
      ) : (
        /* Desktop Table */
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Savollar soni</TableHead>
                <TableHead>Submissionlar soni</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tests?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8">
                    <p className="text-muted-foreground">No tests found. Create your first test to get started.</p>
                  </TableCell>
                </TableRow>
              ) : (
                tests?.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell className="font-medium">{test.id}</TableCell>
                    <TableCell className="font-medium">{test.nomi}</TableCell>
                    <TableCell className="font-medium">{test.savollar_soni}</TableCell>
                    <TableCell className="font-medium">{test.submissionlar_soni}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(test.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(test)} title="Edit">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <ConfirmDialogWrapper
                          onConfirm={() => handleDeleteTest(test.id)}
                          title={`Delete ${test.nomi}?`}
                          description={`Are you sure you want to delete ${test.nomi}? This action cannot be undone.`}
                        >
                          <Button variant="ghost" size="icon" title="Delete">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </ConfirmDialogWrapper>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <TestsDialog
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
        initialData={editingTest}
        onSave={handleSaveTest}
        isSaving={isSaving}
      />
    </main>

  )
}
