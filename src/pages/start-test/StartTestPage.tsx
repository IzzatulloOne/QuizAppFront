import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/useToast"
import { useApi } from "@/hooks/useApi"
import { getMySubmissions } from "@/api/submissionApi"


export default function StartTestPage() {
  const navigate = useNavigate();

  const { toast } = useToast()
  const [testId, setTestId] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { exec: fetchSubmissions, data: submissions = [] } = useApi(getMySubmissions)

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const handleStartTest = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!testId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a test ID.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      navigate(`/start-test/${testId}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start test.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-10 container py-10 mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Hi admin</h1>
        <p className="text-muted-foreground mt-2">Enter a test ID to begin solving questions.</p>
      </div>

      {/* Start Test Form */}
      <form onSubmit={handleStartTest} className="mb-12 max-w-2xl mx-auto">
				
        <Card className="p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="testId" className="text-base font-semibold">
                Test ID
              </Label>
              <Input
                id="testId"
                placeholder="Enter test ID"
                value={testId}
                onChange={(e) => setTestId(e.target.value)}
                disabled={isLoading}
                className="h-10"
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Starting..." : "Start Test"}
            </Button>
          </div>
        </Card>
      </form>

      {submissions && (
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-6">Previous Submissions</h2>
          <div className="grid gap-4">
            {submissions.map((submission) => (
              <Card key={submission.id} className="p-4 hover:bg-accent transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base mb-1">{submission.testName}</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Submitted: {new Date(submission.created_at).toLocaleDateString()}</p>
                      <p>
                        Score: {submission.correct_count}/{submission.total_count}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/submissions/${submission.id}`)}
                    className="flex-shrink-0"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
