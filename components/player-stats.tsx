"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Session } from "@/types/session"

interface PlayerStatsProps {
  sessions: Session[]
}

export default function PlayerStats({ sessions }: PlayerStatsProps) {
  // 従業員ごとの統計を計算
  const playerStats = sessions.reduce(
    (
      acc: Record<
        string,
        {
          sessions: number
          totalInvestment: number
          totalPayout: number
          profit: number
          winCount: number
        }
      >,
      session,
    ) => {
      const { player, investment, payout } = session

      if (!acc[player]) {
        acc[player] = {
          sessions: 0,
          totalInvestment: 0,
          totalPayout: 0,
          profit: 0,
          winCount: 0,
        }
      }

      acc[player].sessions += 1
      acc[player].totalInvestment += investment
      acc[player].totalPayout += payout
      acc[player].profit += payout - investment

      if (payout - investment > 0) {
        acc[player].winCount += 1
      }

      return acc
    },
    {},
  )

  return (
    <div className="space-y-6">
      {Object.keys(playerStats).length === 0 ? (
        <Card>
          <CardContent className="py-4">
            <p className="text-center">データがありません</p>
          </CardContent>
        </Card>
      ) : (
        Object.entries(playerStats).map(([player, stats]) => (
          <Card key={player}>
            <CardHeader>
              <CardTitle>{player}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">総セッション数</p>
                  <p className="text-xl font-bold">{stats.sessions}回</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">勝率</p>
                  <p className="text-xl font-bold">
                    {stats.sessions > 0 ? ((stats.winCount / stats.sessions) * 100).toFixed(1) : 0}%
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">総投資額</p>
                  <p className="text-xl font-bold">{stats.totalInvestment.toLocaleString()}円</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">総回収額</p>
                  <p className="text-xl font-bold">{stats.totalPayout.toLocaleString()}円</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">総収支</p>
                  <p
                    className={`text-xl font-bold ${
                      stats.profit > 0 ? "text-green-600" : stats.profit < 0 ? "text-red-600" : ""
                    }`}
                  >
                    {stats.profit.toLocaleString()}円
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">平均投資額/回</p>
                  <p className="text-xl font-bold">
                    {stats.sessions > 0 ? Math.round(stats.totalInvestment / stats.sessions).toLocaleString() : 0}円
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">平均回収額/回</p>
                  <p className="text-xl font-bold">
                    {stats.sessions > 0 ? Math.round(stats.totalPayout / stats.sessions).toLocaleString() : 0}円
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">平均収支/回</p>
                  <p
                    className={`text-xl font-bold ${
                      stats.profit / stats.sessions > 0
                        ? "text-green-600"
                        : stats.profit / stats.sessions < 0
                          ? "text-red-600"
                          : ""
                    }`}
                  >
                    {stats.sessions > 0 ? Math.round(stats.profit / stats.sessions).toLocaleString() : 0}円
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
