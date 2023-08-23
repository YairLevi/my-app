package main

import (
	"context"
	"fmt"
	"github.com/google/go-github/v39/github"
	"os"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

// GetVersion returns a greeting for the given name
func (a *App) GetVersion() string {
	return AppVersion
}

func (a *App) IsUpdateAvailable() bool {
	client := github.NewClient(nil)
	ctx := context.Background()

	release, _, err := client.Repositories.GetLatestRelease(ctx, Owner, Repo)
	if err != nil {
		fmt.Println("Error getting repository:", fmt.Sprint(Owner, "/", Repo))
		fmt.Println(err.Error())
		return false
	}
	latestVersion := *release.TagName
	currentVersion := AppVersion

	return isNewer(currentVersion, latestVersion)
}

func (a *App) Update() {
	DownloadUpdater()
	RunUpdater(os.Getpid())
	os.Exit(0)
}
