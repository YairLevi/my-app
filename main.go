package main

import (
	"context"
	"embed"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	repos "my-app/repositories"
)

//go:embed all:frontend/dist
var assets embed.FS

const (
	Owner               = "YairLevi"
	Repo                = "my-app"
	AppVersion          = "v0.2.1"
	DbDestinationString = "database.db"
)

func main() {
	sqliteDb := repos.InitializeSqlite(DbDestinationString)

	// Create repositories
	var (
		weekEventRepository  repos.Repository[repos.WeekEvent]  = repos.NewWeekCalendar(sqliteDb)
		monthEventRepository repos.Repository[repos.MonthEvent] = repos.NewMonthCalendar(sqliteDb)
		noteRepository       repos.Repository[repos.Note]       = repos.NewNoteRepository(sqliteDb)
	)

	app := NewApp()
	// Create application with options
	err := wails.Run(&options.App{
		Title:     "my-app",
		Width:     1366,
		Height:    768,
		MinWidth:  800,
		MinHeight: 500,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		OnStartup: app.startup,
		OnBeforeClose: func(ctx context.Context) (prevent bool) {
			gormDb, _ := sqliteDb.DB()
			gormDb.Close()
			return false
		},
		Bind: []interface{}{
			app,
			weekEventRepository,
			monthEventRepository,
			noteRepository,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
