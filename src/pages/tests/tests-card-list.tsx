"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2 } from "lucide-react"
import type { MyTest } from "@/api/types"

interface TestsCardListProps {
  tests: MyTest[]
  onEdit: (test: MyTest) => void
  onDelete: (id: string) => void
}

export function TestsCardList({ tests, onEdit, onDelete }: TestsCardListProps) {
  if (tests.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No tests found. Create your first test to get started.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {tests.map((test) => (
        <Card key={test.id} className="p-4">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-base">{test.nomi}</h3>
              <p className="text-sm text-muted-foreground mt-1">{new Date(test.created_at).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(test)} className="flex-1">
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => onDelete(test.id)} className="flex-1">
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
