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
	AppVersion          = "v0.0.3"
	DbDestinationString = "database.db"
)

func main() {
	sqliteDb := repos.InitializeSqlite(DbDestinationString)

	// Create services
	var weeklyCalendar repos.WeekEventRepository = repos.NewWeeklyCalendar(sqliteDb)
	var calendar CalendarService = NewCalendar()
	var monthCalendar MonthCalendarService = NewMonthCalendar()
	notes := NewNoteManager()

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
			calendar.Close()
			monthCalendar.Close()
			return false
		},
		Bind: []interface{}{
			app,
			weeklyCalendar,
			monthCalendar,
			notes,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
