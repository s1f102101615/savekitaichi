// APIとの通信を担当するサービス

// 従業員データの型定義
export interface Employee {
  id: string
  name: string
}

// 機種データの型定義
export interface Machine {
  id: string
  name: string
}

// セッションデータの型定義（APIとの通信用）
export interface SessionData {
  id?: string
  date: string
  player_id: string
  machine_id: string
  starting_count: number
  investment: number
  ending_count: number
  payout: number
  notes: string
}

// APIのベースURL
const API_BASE_URL = "/api"

// 従業員一覧を取得
export async function fetchEmployees(): Promise<Employee[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/employees`)
    if (!response.ok) {
      throw new Error("従業員データの取得に失敗しました")
    }
    return await response.json()
  } catch (error) {
    console.error("従業員データの取得エラー:", error)
    return []
  }
}

// 機種一覧を取得
export async function fetchMachines(): Promise<Machine[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/machines`)
    if (!response.ok) {
      throw new Error("機種データの取得に失敗しました")
    }
    return await response.json()
  } catch (error) {
    console.error("機種データの取得エラー:", error)
    return []
  }
}

// セッション一覧を取得
export async function fetchSessions(): Promise<SessionData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions`)
    if (!response.ok) {
      throw new Error("セッションデータの取得に失敗しました")
    }
    return await response.json()
  } catch (error) {
    console.error("セッションデータの取得エラー:", error)
    return []
  }
}

// セッションを作成
export async function createSession(session: SessionData): Promise<SessionData> {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(session),
    })

    if (!response.ok) {
      throw new Error("セッションの作成に失敗しました")
    }

    return await response.json()
  } catch (error) {
    console.error("セッション作成エラー:", error)
    throw error
  }
}

// セッションを更新
export async function updateSession(id: string, session: SessionData): Promise<SessionData> {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(session),
    })

    if (!response.ok) {
      throw new Error("セッションの更新に失敗しました")
    }

    return await response.json()
  } catch (error) {
    console.error("セッション更新エラー:", error)
    throw error
  }
}

// セッションを削除
export async function deleteSession(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("セッションの削除に失敗しました")
    }
  } catch (error) {
    console.error("セッション削除エラー:", error)
    throw error
  }
}

// 日付ごとの収支データを取得
export async function fetchDailyStats(): Promise<{ date: string; profit: number }[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/stats/daily`)
    if (!response.ok) {
      throw new Error("日次収支データの取得に失敗しました")
    }
    return await response.json()
  } catch (error) {
    console.error("日次収支データの取得エラー:", error)
    return []
  }
}
