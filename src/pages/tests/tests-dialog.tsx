"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { MyTest } from "@/api/types"

interface TestsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: MyTest | null
  onSave: (data: { nomi: string }) => Promise<void>
  isSaving?: boolean
}

export function TestsDialog({ open, onOpenChange, initialData, onSave, isSaving = false }: TestsDialogProps) {
  const [nomi, setNomi] = useState("")

  useEffect(() => {
    if (initialData) {
      setNomi(initialData.nomi)
    } else {
      setNomi("")
    }
  }, [initialData, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nomi.trim()) {
      alert("Please enter a test name")
      return
    }

    await onSave({ nomi: nomi.trim() })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Test" : "Create New Test"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Update the test information below." : "Add a new test by filling in the details below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nomi">Test Name</Label>
            <Input
              id="nomi"
              placeholder="Enter test name (e.g., Mathematics 30 questions)"
              value={nomi}
              onChange={(e) => setNomi(e.target.value)}
              disabled={isSaving}
              autoFocus
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : initialData ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
