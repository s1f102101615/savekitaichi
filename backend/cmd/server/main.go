package main

import (
	"log"

	"github.com/yourusername/pachinko-backend/config"
)

func main() {
	// 設定の読み込み
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("設定の読み込みに失敗しました: %v", err)
	}
	print(cfg)

	// // データベース接続
	// database, err := db.Connect(cfg.DatabaseURL)
	// if err != nil {
	// 	log.Fatalf("データベース接続に失敗しました: %v", err)
	// }
	// defer database.Close()

	// // ハンドラーの作成
	// employeeHandler := api.NewEmployeeHandler(database)
	// machineHandler := api.NewMachineHandler(database)
	// sessionHandler := api.NewSessionHandler(database)
	// statHandler := api.NewStatHandler(database)

	// // ルーティングの設定
	// http.HandleFunc("/api/employees", middleware.Chain(employeeHandler.HandleEmployees, middleware.Logging, middleware.CORS))
	// http.HandleFunc("/api/machines", middleware.Chain(machineHandler.HandleMachines, middleware.Logging, middleware.CORS))

	// // セッション関連のルーティング
	// http.HandleFunc("/api/sessions", middleware.Chain(func(w http.ResponseWriter, r *http.Request) {
	// 	switch r.Method {
	// 	case http.MethodGet:
	// 		sessionHandler.GetSessions(w, r)
	// 	case http.MethodPost:
	// 		sessionHandler.CreateSession(w, r)
	// 	default:
	// 		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	// 	}
	// }, middleware.Logging, middleware.CORS))

	// // セッションIDを含むルーティング
	// http.HandleFunc("/api/sessions/", middleware.Chain(func(w http.ResponseWriter, r *http.Request) {
	// 	// URLからIDを抽出
	// 	path := strings.TrimPrefix(r.URL.Path, "/api/sessions/")
	// 	if path == "" {
	// 		http.Error(w, "Invalid session ID", http.StatusBadRequest)
	// 		return
	// 	}

	// 	// IDを取得
	// 	id := strings.Split(path, "/")[0]

	// 	switch r.Method {
	// 	case http.MethodGet:
	// 		sessionHandler.GetSession(w, r, id)
	// 	case http.MethodPut:
	// 		sessionHandler.UpdateSession(w, r, id)
	// 	case http.MethodDelete:
	// 		sessionHandler.DeleteSession(w, r, id)
	// 	default:
	// 		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	// 	}
	// }, middleware.Logging, middleware.CORS))

	// // 統計情報のルーティング
	// http.HandleFunc("/api/stats/daily", middleware.Chain(statHandler.GetDailyStats, middleware.Logging, middleware.CORS))

	// // サーバーの起動
	// port := os.Getenv("PORT")
	// if port == "" {
	// 	port = "8080"
	// }

	// log.Printf("サーバーを起動しています: http://localhost:%s", port)
	// log.Fatal(http.ListenAndServe(":"+port, nil))
}
