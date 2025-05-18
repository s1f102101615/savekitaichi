"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Session } from "@/types/session"
import { PencilIcon, TrashIcon, FileTextIcon } from "lucide-react"
import { updateSession, deleteSession } from "@/services/api"
import type { Employee, Machine } from "@/services/api"

interface SessionsTableProps {
  sessions: Session[]
  employees: Employee[]
  machines: Machine[]
  updateSession: (session: Session) => void
  deleteSession: (id: string) => void
}

export default function SessionsTable({
  sessions,
  employees,
  machines,
  updateSession: updateSessionState,
  deleteSession: deleteSessionState,
}: SessionsTableProps) {
  const [editingSession, setEditingSession] = useState<Session | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false)
  const [viewingNotes, setViewingNotes] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const handleEdit = (session: Session) => {
    setEditingSession({ ...session })
    setIsDialogOpen(true)
  }

  const handleViewNotes = (notes: string) => {
    setViewingNotes(notes)
    setIsNotesDialogOpen(true)
  }

  const handleUpdate = async () => {
    if (editingSession) {
      setIsLoading(true)

      try {
        // 選択された従業員と機種の名前を取得
        const selectedEmployee = employees.find((emp) => emp.id === editingSession.player_id)
        const selectedMachine = machines.find((m) => m.id === editingSession.machine_id)

        if (!selectedEmployee || !selectedMachine) {
          throw new Error("従業員または機種が選択されていません")
        }

        // APIを呼び出してセッションを更新
        await updateSession(editingSession.id, {
          date: editingSession.date,
          player_id: editingSession.player_id,
          machine_id: editingSession.machine_id,
          starting_count: editingSession.startingCount,
          investment: editingSession.investment,
          ending_count: editingSession.endingCount,
          payout: editingSession.payout,
          notes: editingSession.notes,
        })

        // UIの状態を更新
        const updatedSession = {
          ...editingSession,
          player: selectedEmployee.name,
          machine: selectedMachine.name,
        }

        updateSessionState(updatedSession)
        setIsDialogOpen(false)
        setEditingSession(null)
      } catch (error) {
        console.error("セッションの更新に失敗しました:", error)
        alert("セッションの更新に失敗しました")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("このセッションを削除してもよろしいですか？")) {
      setIsLoading(true)

      try {
        // APIを呼び出してセッションを削除
        await deleteSession(id)

        // UIの状態を更新
        deleteSessionState(id)
      } catch (error) {
        console.error("セッションの削除に失敗しました:", error)
        alert("セッションの削除に失敗しました")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`
  }

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>セッション編集</DialogTitle>
          </DialogHeader>
          {editingSession && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-player">従業員名</Label>
                  <Select
                    value={editingSession.player_id}
                    onValueChange={(value) => setEditingSession({ ...editingSession, player_id: value })}
                  >
                    <SelectTrigger id="edit-player">
                      <SelectValue placeholder="従業員を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-machine">機種名</Label>
                  <Select
                    value={editingSession.machine_id}
                    onValueChange={(value) => setEditingSession({ ...editingSession, machine_id: value })}
                  >
                    <SelectTrigger id="edit-machine">
                      <SelectValue placeholder="機種を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {machines.map((machine) => (
                        <SelectItem key={machine.id} value={machine.id}>
                          {machine.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-startingCount">打ち初めゲーム数</Label>
                  <Input
                    id="edit-startingCount"
                    type="number"
                    value={editingSession.startingCount}
                    onChange={(e) =>
                      setEditingSession({
                        ...editingSession,
                        startingCount: Number.parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-investment">投資金額 (円)</Label>
                  <Input
                    id="edit-investment"
                    type="number"
                    value={editingSession.investment}
                    onChange={(e) =>
                      setEditingSession({
                        ...editingSession,
                        investment: Number.parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-endingCount">終了ゲーム数</Label>
                  <Input
                    id="edit-endingCount"
                    type="number"
                    value={editingSession.endingCount}
                    onChange={(e) =>
                      setEditingSession({
                        ...editingSession,
                        endingCount: Number.parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-payout">回収金額 (円)</Label>
                  <Input
                    id="edit-payout"
                    type="number"
                    value={editingSession.payout}
                    onChange={(e) =>
                      setEditingSession({
                        ...editingSession,
                        payout: Number.parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-notes">補足</Label>
                <Textarea
                  id="edit-notes"
                  value={editingSession.notes}
                  onChange={(e) => setEditingSession({ ...editingSession, notes: e.target.value })}
                  placeholder="メモや補足情報を入力してください"
                  rows={3}
                />
              </div>

              <Button onClick={handleUpdate} className="w-full" disabled={isLoading}>
                {isLoading ? "更新中..." : "更新する"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isNotesDialogOpen} onOpenChange={setIsNotesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>補足情報</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {viewingNotes ? (
              <p className="whitespace-pre-wrap">{viewingNotes}</p>
            ) : (
              <p className="text-muted-foreground">補足情報はありません</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>日時</TableHead>
              <TableHead>従業員</TableHead>
              <TableHead>機種</TableHead>
              <TableHead>開始G数</TableHead>
              <TableHead>投資額</TableHead>
              <TableHead>終了G数</TableHead>
              <TableHead>回収額</TableHead>
              <TableHead>収支</TableHead>
              <TableHead>補足</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center">
                  データがありません
                </TableCell>
              </TableRow>
            ) : (
              sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>{formatDate(session.date)}</TableCell>
                  <TableCell>{session.player}</TableCell>
                  <TableCell>{session.machine}</TableCell>
                  <TableCell>{session.startingCount}</TableCell>
                  <TableCell>{session.investment.toLocaleString()}円</TableCell>
                  <TableCell>{session.endingCount}</TableCell>
                  <TableCell>{session.payout.toLocaleString()}円</TableCell>
                  <TableCell
                    className={
                      session.payout - session.investment > 0
                        ? "text-green-600 font-bold"
                        : session.payout - session.investment < 0
                          ? "text-red-600 font-bold"
                          : ""
                    }
                  >
                    {(session.payout - session.investment).toLocaleString()}円
                  </TableCell>
                  <TableCell>
                    {session.notes ? (
                      <Button variant="ghost" size="icon" onClick={() => handleViewNotes(session.notes)}>
                        <FileTextIcon className="h-4 w-4" />
                      </Button>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleEdit(session)} disabled={isLoading}>
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(session.id)}
                        disabled={isLoading}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
