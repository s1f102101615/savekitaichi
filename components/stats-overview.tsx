"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Session } from "@/types/session"

interface StatsOverviewProps {
  sessions: Session[]
}

export default function StatsOverview({ sessions }: StatsOverviewProps) {
  // 総セッション数
  const totalSessions = sessions.length

  // 勝率計算
  const winningSessions = sessions.filter((session) => session.payout - session.investment > 0).length
  const winRate = totalSessions > 0 ? (winningSessions / totalSessions) * 100 : 0

  // 平均投資額
  const avgInvestment =
    totalSessions > 0 ? sessions.reduce((total, session) => total + session.investment, 0) / totalSessions : 0

  // 平均回収額
  const avgPayout =
    totalSessions > 0 ? sessions.reduce((total, session) => total + session.payout, 0) / totalSessions : 0

  // 最高収支
  const highestProfit =
    sessions.length > 0 ? Math.max(...sessions.map((session) => session.payout - session.investment)) : 0

  // 最低収支
  const lowestProfit =
    sessions.length > 0 ? Math.min(...sessions.map((session) => session.payout - session.investment)) : 0

  // 月別収支
  const monthlyStats = sessions.reduce((acc: Record<string, number>, session) => {
    const date = new Date(session.date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

    if (!acc[monthKey]) {
      acc[monthKey] = 0
    }

    acc[monthKey] += session.payout - session.investment
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>総セッション数</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalSessions}回</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>勝率</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{winRate.toFixed(1)}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>平均投資額</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{Math.round(avgInvestment).toLocaleString()}円</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>平均回収額</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{Math.round(avgPayout).toLocaleString()}円</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>最高収支</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{highestProfit.toLocaleString()}円</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>最低収支</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{lowestProfit.toLocaleString()}円</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>月別収支</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(monthlyStats).length === 0 ? (
            <p>データがありません</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(monthlyStats)
                .sort((a, b) => b[0].localeCompare(a[0]))
                .map(([month, profit]) => {
                  const [year, monthNum] = month.split("-")
                  return (
                    <div key={month} className="flex justify-between items-center border-b pb-2">
                      <span>
                        {year}年{Number.parseInt(monthNum)}月
                      </span>
                      <span
                        className={profit > 0 ? "text-green-600 font-bold" : profit < 0 ? "text-red-600 font-bold" : ""}
                      >
                        {profit.toLocaleString()}円
                      </span>
                    </div>
                  )
                })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
