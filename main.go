package main

import (
	"context"
	"embed"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

const TimeZone = "Asia/Jerusalem"

func main() {
	// Create an instance of the app structure
	app := NewApp()

	// Create services
	var calendar CalendarService = NewCalendar()
	notes := NewNoteManager()

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
			return false
		},
		Bind: []interface{}{
			app,
			calendar,
			notes,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
