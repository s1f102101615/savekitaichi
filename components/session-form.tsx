"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Session } from "@/types/session"
import { fetchEmployees, fetchMachines, createSession } from "@/services/api"
import type { Employee, Machine, SessionData } from "@/services/api"

interface SessionFormProps {
  addSession: (session: Session) => void
}

export default function SessionForm({ addSession }: SessionFormProps) {
  const [playerId, setPlayerId] = useState("")
  const [machineId, setMachineId] = useState("")
  const [startingCount, setStartingCount] = useState("")
  const [investment, setInvestment] = useState("")
  const [endingCount, setEndingCount] = useState("")
  const [payout, setPayout] = useState("")
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const [employees, setEmployees] = useState<Employee[]>([])
  const [machines, setMachines] = useState<Machine[]>([])

  useEffect(() => {
    // 従業員と機種のデータを取得
    const loadData = async () => {
      try {
        const [employeesData, machinesData] = await Promise.all([fetchEmployees(), fetchMachines()])

        setEmployees(employeesData)
        setMachines(machinesData)
      } catch (error) {
        console.error("データの読み込みに失敗しました:", error)
      }
    }

    loadData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 選択された従業員と機種の名前を取得
      const selectedEmployee = employees.find((emp) => emp.id === playerId)
      const selectedMachine = machines.find((m) => m.id === machineId)

      if (!selectedEmployee || !selectedMachine) {
        throw new Error("従業員または機種が選択されていません")
      }

      const sessionData: SessionData = {
        date: new Date().toISOString(),
        player_id: playerId,
        machine_id: machineId,
        starting_count: Number.parseInt(startingCount) || 0,
        investment: Number.parseInt(investment) || 0,
        ending_count: Number.parseInt(endingCount) || 0,
        payout: Number.parseInt(payout) || 0,
        notes: notes,
      }

      // APIを呼び出してセッションを作成
      const createdSession = await createSession(sessionData)

      // UIに表示するためのセッションオブジェクトを作成
      const newSession: Session = {
        id: createdSession.id || Date.now().toString(),
        date: createdSession.date,
        player: selectedEmployee.name,
        player_id: playerId,
        machine: selectedMachine.name,
        machine_id: machineId,
        startingCount: Number.parseInt(startingCount) || 0,
        investment: Number.parseInt(investment) || 0,
        endingCount: Number.parseInt(endingCount) || 0,
        payout: Number.parseInt(payout) || 0,
        notes: notes,
      }

      addSession(newSession)

      // フォームをリセット
      setPlayerId("")
      setMachineId("")
      setStartingCount("")
      setInvestment("")
      setEndingCount("")
      setPayout("")
      setNotes("")
    } catch (error) {
      console.error("セッションの登録に失敗しました:", error)
      alert("セッションの登録に失敗しました")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>新規セッション登録</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="player">従業員名</Label>
              <Select value={playerId} onValueChange={setPlayerId} required>
                <SelectTrigger id="player">
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
              <Label htmlFor="machine">機種名</Label>
              <Select value={machineId} onValueChange={setMachineId} required>
                <SelectTrigger id="machine">
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
              <Label htmlFor="startingCount">打ち初めゲーム数</Label>
              <Input
                id="startingCount"
                type="number"
                value={startingCount}
                onChange={(e) => setStartingCount(e.target.value)}
                placeholder="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="investment">投資金額 (円)</Label>
              <Input
                id="investment"
                type="number"
                value={investment}
                onChange={(e) => setInvestment(e.target.value)}
                placeholder="10000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endingCount">終了ゲーム数</Label>
              <Input
                id="endingCount"
                type="number"
                value={endingCount}
                onChange={(e) => setEndingCount(e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payout">回収金額 (円)</Label>
              <Input
                id="payout"
                type="number"
                value={payout}
                onChange={(e) => setPayout(e.target.value)}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">補足</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="メモや補足情報を入力してください"
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "登録中..." : "登録する"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
