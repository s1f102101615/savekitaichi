"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SessionForm from "@/components/session-form"
import SessionsTable from "@/components/sessions-table"
import StatsOverview from "@/components/stats-overview"
import PlayerStats from "@/components/player-stats"
import MachineStats from "@/components/machine-stats"
import DailyProfitChart from "@/components/daily-profit-chart"
import type { Session } from "@/types/session"
import { fetchSessions, fetchEmployees, fetchMachines } from "@/services/api"
import type { Employee, Machine } from "@/services/api"

export default function Home() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [machines, setMachines] = useState<Machine[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)

        // APIからデータを取得
        const [sessionsData, employeesData, machinesData] = await Promise.all([
          fetchSessions(),
          fetchEmployees(),
          fetchMachines(),
        ])

        // セッションデータを変換
        const formattedSessions: Session[] = sessionsData.map((session) => {
          const employee = employeesData.find((e) => e.id === session.player_id) || { id: "", name: "不明" }
          const machine = machinesData.find((m) => m.id === session.machine_id) || { id: "", name: "不明" }

          return {
            id: session.id || "",
            date: session.date,
            player: employee.name,
            player_id: session.player_id,
            machine: machine.name,
            machine_id: session.machine_id,
            startingCount: session.starting_count,
            investment: session.investment,
            endingCount: session.ending_count,
            payout: session.payout,
            notes: session.notes,
          }
        })

        setSessions(formattedSessions)
        setEmployees(employeesData)
        setMachines(machinesData)
      } catch (error) {
        console.error("データの読み込みに失敗しました:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const addSession = (session: Session) => {
    setSessions([...sessions, session])
  }

  const updateSession = (updatedSession: Session) => {
    const newSessions = sessions.map((session) => (session.id === updatedSession.id ? updatedSession : session))
    setSessions(newSessions)
  }

  const deleteSession = (id: string) => {
    const newSessions = sessions.filter((session) => session.id !== id)
    setSessions(newSessions)
  }

  return (
    <main className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">パチンコ・スロット収支管理</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-[200px]">
          <p>データを読み込み中...</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>総収支</CardTitle>
                <CardDescription>全体の収支状況</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {sessions
                    .reduce((total, session) => total + (session.payout - session.investment), 0)
                    .toLocaleString()}
                  円
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>総投資額</CardTitle>
                <CardDescription>全体の投資金額</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {sessions.reduce((total, session) => total + session.investment, 0).toLocaleString()}円
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>総回収額</CardTitle>
                <CardDescription>全体の回収金額</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {sessions.reduce((total, session) => total + session.payout, 0).toLocaleString()}円
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 mb-6">
            <SessionForm addSession={addSession} />
          </div>

          <div className="grid gap-6 mb-6">
            <DailyProfitChart />
          </div>

          <Tabs defaultValue="all" className="mb-6">
            <TabsList>
              <TabsTrigger value="all">全セッション</TabsTrigger>
              <TabsTrigger value="overview">統計概要</TabsTrigger>
              <TabsTrigger value="players">従業員別</TabsTrigger>
              <TabsTrigger value="machines">機種別</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <SessionsTable
                sessions={sessions}
                employees={employees}
                machines={machines}
                updateSession={updateSession}
                deleteSession={deleteSession}
              />
            </TabsContent>

            <TabsContent value="overview">
              <StatsOverview sessions={sessions} />
            </TabsContent>

            <TabsContent value="players">
              <PlayerStats sessions={sessions} />
            </TabsContent>

            <TabsContent value="machines">
              <MachineStats sessions={sessions} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </main>
  )
}
