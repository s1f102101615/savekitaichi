// このファイルはフロントエンド開発用のモックAPIです
// 実際の開発では、Goバックエンドに置き換えてください

import { NextResponse } from "next/server"

// モックデータ
const employees = [
  { id: "1", name: "田中太郎" },
  { id: "2", name: "佐藤次郎" },
  { id: "3", name: "鈴木三郎" },
  { id: "4", name: "高橋四郎" },
  { id: "5", name: "伊藤五郎" },
]

const machines = [
  { id: "1", name: "北斗の拳" },
  { id: "2", name: "バジリスク" },
  { id: "3", name: "マイジャグラー" },
  { id: "4", name: "アイムジャグラー" },
  { id: "5", name: "ハナハナ" },
  { id: "6", name: "吉宗" },
  { id: "7", name: "モンスターハンター" },
  { id: "8", name: "ゴッドイーター" },
]

// セッションデータの初期値
let sessions = [
  {
    id: "1",
    date: "2025-05-15T10:00:00Z",
    player_id: "1",
    machine_id: "1",
    starting_count: 150,
    investment: 20000,
    ending_count: 350,
    payout: 35000,
    notes: "AT 3回、設定6の可能性あり",
  },
  {
    id: "2",
    date: "2025-05-16T09:30:00Z",
    player_id: "2",
    machine_id: "3",
    starting_count: 0,
    investment: 15000,
    ending_count: 500,
    payout: 10000,
    notes: "ボーナス1回のみ",
  },
  {
    id: "3",
    date: "2025-05-16T14:00:00Z",
    player_id: "3",
    machine_id: "5",
    starting_count: 200,
    investment: 30000,
    ending_count: 400,
    payout: 50000,
    notes: "大当たり2回",
  },
  {
    id: "4",
    date: "2025-05-17T11:00:00Z",
    player_id: "1",
    machine_id: "2",
    starting_count: 50,
    investment: 25000,
    ending_count: 300,
    payout: 20000,
    notes: "",
  },
  {
    id: "5",
    date: "2025-05-17T16:30:00Z",
    player_id: "4",
    machine_id: "4",
    starting_count: 100,
    investment: 18000,
    ending_count: 250,
    payout: 15000,
    notes: "閉店間際に打ち始め",
  },
]

// 日付ごとの収支データを生成
function generateDailyStats() {
  const dailyStats = {}
  const today = new Date()

  // 過去90日分のデータを生成
  for (let i = 0; i < 90; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const dateString = date.toISOString().split("T")[0]

    // ランダムな収支を生成 (-30000 ~ 50000)
    const profit = Math.floor(Math.random() * 80000) - 30000

    dailyStats[dateString] = profit
  }

  // セッションデータからの収支も追加
  sessions.forEach((session) => {
    const dateString = new Date(session.date).toISOString().split("T")[0]
    const profit = session.payout - session.investment

    if (dailyStats[dateString]) {
      dailyStats[dateString] += profit
    } else {
      dailyStats[dateString] = profit
    }
  })

  // 配列形式に変換
  return Object.entries(dailyStats).map(([date, profit]) => ({
    date,
    profit,
  }))
}

// 従業員一覧を取得
export async function GET(request: Request) {
  const url = new URL(request.url)
  const path = url.pathname

  // 従業員一覧
  if (path.endsWith("/employees")) {
    return NextResponse.json(employees)
  }

  // 機種一覧
  if (path.endsWith("/machines")) {
    return NextResponse.json(machines)
  }

  // セッション一覧
  if (path.endsWith("/sessions")) {
    return NextResponse.json(sessions)
  }

  // 日次収支データ
  if (path.endsWith("/stats/daily")) {
    return NextResponse.json(generateDailyStats())
  }

  return NextResponse.json({ error: "Not found" }, { status: 404 })
}

// セッションを作成
export async function POST(request: Request) {
  const url = new URL(request.url)

  if (url.pathname.endsWith("/sessions")) {
    try {
      const body = await request.json()

      // IDを生成
      const newSession = {
        id: (sessions.length + 1).toString(),
        ...body,
      }

      sessions.push(newSession)

      return NextResponse.json(newSession, { status: 201 })
    } catch (error) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }
  }

  return NextResponse.json({ error: "Not found" }, { status: 404 })
}

// セッションを更新
export async function PUT(request: Request) {
  const url = new URL(request.url)
  const pathParts = url.pathname.split("/")

  if (pathParts[pathParts.length - 2] === "sessions") {
    const id = pathParts[pathParts.length - 1]
    const sessionIndex = sessions.findIndex((s) => s.id === id)

    if (sessionIndex === -1) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    try {
      const body = await request.json()

      sessions[sessionIndex] = {
        ...sessions[sessionIndex],
        ...body,
        id, // IDは変更しない
      }

      return NextResponse.json(sessions[sessionIndex])
    } catch (error) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }
  }

  return NextResponse.json({ error: "Not found" }, { status: 404 })
}

// セッションを削除
export async function DELETE(request: Request) {
  const url = new URL(request.url)
  const pathParts = url.pathname.split("/")

  if (pathParts[pathParts.length - 2] === "sessions") {
    const id = pathParts[pathParts.length - 1]
    const sessionIndex = sessions.findIndex((s) => s.id === id)

    if (sessionIndex === -1) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    sessions = sessions.filter((s) => s.id !== id)

    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: "Not found" }, { status: 404 })
}
