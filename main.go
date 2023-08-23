package main

import (
	"context"
	"embed"
	"fmt"
	"github.com/google/go-github/v39/github"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"os"
	"os/exec"
	"strconv"
	"strings"
)

//go:embed all:frontend/dist
var assets embed.FS

const (
	Owner       = "YairLevi"
	UpdaterRepo = "my-app"
	AppVersion  = "v0.0.4"
)

func isNewer(current, latest string) bool {
	// Remove the "v" prefix and split the version strings
	currentParts := strings.Split(strings.TrimPrefix(current, "v"), ".")
	latestParts := strings.Split(strings.TrimPrefix(latest, "v"), ".")

	// Convert version parts to integers
	currentInts := make([]int, len(currentParts))
	latestInts := make([]int, len(latestParts))

	for i := 0; i < len(currentParts); i++ {
		currentInts[i], _ = strconv.Atoi(currentParts[i])
		latestInts[i], _ = strconv.Atoi(latestParts[i])
	}

	// Compare version parts
	for i := 0; i < len(currentInts); i++ {
		if latestInts[i] > currentInts[i] {
			return true // Latest version is newer
		}
	}

	return false // Versions are identical
}

func IsThereUpdate() bool {
	client := github.NewClient(nil)
	ctx := context.Background()

	release, _, err := client.Repositories.GetLatestRelease(ctx, Owner, UpdaterRepo)
	if err != nil {
		fmt.Println("Error getting repository:", fmt.Sprint(Owner, "/", UpdaterRepo))
		return false
	}
	latestVersion := *release.TagName
	currentVersion := AppVersion

	return isNewer(currentVersion, latestVersion)
}

func RunUpdater(pid int) {
	str := "update.exe " + strconv.Itoa(pid)
	fmt.Println("running command:", str)
	cmd := exec.Command("./update.exe", strconv.Itoa(pid))
	err := cmd.Start()
	if err != nil {
		fmt.Println("Error starting update.exe")
		fmt.Println(err.Error())
	}
}

func main() {
	isUpdate := IsThereUpdate()

	if isUpdate {
		fmt.Println("Update available. Running updater")
		pid := os.Getpid()
		RunUpdater(pid)
		os.Exit(0)
	}

	fmt.Println("Latest version here:", AppVersion)

	// Create an instance of the app structure
	app := NewApp()

	// Create services
	var calendar CalendarService = NewCalendar()
	var monthCalendar MonthCalendarService = NewMonthCalendar()
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
			monthCalendar.Close()
			return false
		},
		Bind: []interface{}{
			app,
			calendar,
			monthCalendar,
			notes,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
