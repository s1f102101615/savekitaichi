"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { fetchDailyStats } from "@/services/api"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts"

interface DailyProfit {
  date: string
  profit: number
  formattedDate: string
}

export default function DailyProfitChart() {
  const [dailyProfits, setDailyProfits] = useState<DailyProfit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [chartType, setChartType] = useState<"bar" | "line">("bar")
  const [timeRange, setTimeRange] = useState<"7days" | "30days" | "90days" | "all">("30days")

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const data = await fetchDailyStats()

        // 日付でソートし、表示用にフォーマット
        const formattedData = data
          .map((item) => {
            const date = new Date(item.date)
            return {
              ...item,
              formattedDate: `${date.getMonth() + 1}/${date.getDate()}`,
            }
          })
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        setDailyProfits(formattedData)
      } catch (error) {
        console.error("日次収支データの取得に失敗しました:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // 表示期間でデータをフィルタリング
  const getFilteredData = () => {
    if (timeRange === "all") return dailyProfits

    const now = new Date()
    let daysToSubtract = 30

    if (timeRange === "7days") daysToSubtract = 7
    else if (timeRange === "90days") daysToSubtract = 90

    const cutoffDate = new Date(now)
    cutoffDate.setDate(now.getDate() - daysToSubtract)

    return dailyProfits.filter((item) => new Date(item.date) >= cutoffDate)
  }

  const filteredData = getFilteredData()

  // 累計収支を計算
  const cumulativeData = filteredData.reduce((acc: DailyProfit[], current, index) => {
    const cumulativeProfit = index === 0 ? current.profit : acc[index - 1].profit + current.profit

    acc.push({
      ...current,
      profit: cumulativeProfit,
    })

    return acc
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>日次収支グラフ</CardTitle>
        <div className="flex space-x-4">
          <div className="space-y-1">
            <Label htmlFor="time-range">期間</Label>
            <Select
              value={timeRange}
              onValueChange={(value: "7days" | "30days" | "90days" | "all") => setTimeRange(value)}
            >
              <SelectTrigger id="time-range" className="w-[120px]">
                <SelectValue placeholder="期間" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">7日間</SelectItem>
                <SelectItem value="30days">30日間</SelectItem>
                <SelectItem value="90days">90日間</SelectItem>
                <SelectItem value="all">全期間</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="chart-type">グラフタイプ</Label>
            <Select value={chartType} onValueChange={(value: "bar" | "line") => setChartType(value)}>
              <SelectTrigger id="chart-type" className="w-[120px]">
                <SelectValue placeholder="グラフタイプ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">棒グラフ</SelectItem>
                <SelectItem value="line">折れ線グラフ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-[400px]">
            <p>データを読み込み中...</p>
          </div>
        ) : dailyProfits.length === 0 ? (
          <div className="flex justify-center items-center h-[400px]">
            <p>データがありません</p>
          </div>
        ) : (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "bar" ? (
                <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="formattedDate" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => [`${value.toLocaleString()}円`, "収支"]}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Legend />
                  <Bar dataKey="profit" name="収支" fill={(data: any) => (data.profit >= 0 ? "#10b981" : "#ef4444")} />
                </BarChart>
              ) : (
                <LineChart data={cumulativeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="formattedDate" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => [`${value.toLocaleString()}円`, "累計収支"]}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    name="累計収支"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
