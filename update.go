package main

import (
	"context"
	"fmt"
	"github.com/google/go-github/v39/github"
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
	"strconv"
	"strings"
	"syscall"
	"time"
)

const (
	AppPath        = "./my-app.exe"
	UpdaterRelease = "updater-v1.0.0"
)

func DownloadUpdater() {
	client := github.NewClient(nil)
	releases, _, _ := client.Repositories.ListReleases(context.Background(), Owner, Repo, nil)
	var updaterRelease *github.RepositoryRelease
	for _, release := range releases {
		if *release.TagName == UpdaterRelease {
			updaterRelease = release
			break
		}
	}
	updaterAsset := updaterRelease.Assets[0]
	err := downloadFile(*updaterAsset.Name, *updaterAsset.BrowserDownloadURL)
	if err != nil {
		return
	}
}

func downloadFile(fileName, url string) error {
	// Create the file
	file, err := os.Create(fileName)
	if err != nil {
		return err
	}
	defer file.Close()

	// Make a GET request to the URL
	response, err := http.Get(url)
	if err != nil {
		return err
	}
	defer response.Body.Close()

	// Copy the response body to the file
	_, err = io.Copy(file, response.Body)
	if err != nil {
		return err
	}

	return nil
}

func DownloadUpdate() {
	client := github.NewClient(nil)
	ctx := context.Background()

	release, _, err := client.Repositories.GetLatestRelease(ctx, "YairLevi", "my-app")
	if err != nil {
		log.Println("Error getting release: my-app")
		return
	}
	log.Println("Latest Release:", *release.TagName)
	log.Println("Downloading...")

	for _, asset := range release.Assets {
		name := *asset.Name
		err := downloadFile(name, *asset.BrowserDownloadURL)
		if err != nil {
			log.Println("Error downloading", name)
		}
	}
}

func isProcessRunning(pid int) bool {
	// Use os.FindProcess to get a handle to the process
	process, err := os.FindProcess(pid)
	if err != nil {
		return false
	}

	// Use process.Signal(syscall.Signal(0)) to check the process state
	err = process.Signal(syscall.Signal(0))
	return err == nil
}

func WaitForProcess(pid int) {
	i := 0

	for {
		if !isProcessRunning(pid) {
			break
		}

		time.Sleep(1 * time.Second)
		i++

		if i == 5 {
			log.Println("Failed to close process")
			break
		}
	}
}

func RunApp() {
	cmd := exec.Command(AppPath)
	err := cmd.Start()
	if err != nil {
		log.Println("Error starting", AppPath)
	}
}

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

func main1() {
	file, _ := os.Create("update.log")
	defer file.Close()
	os.Stdout = file

	pid, err := strconv.Atoi(os.Args[1])
	if err != nil {
		log.Println("Error converting PID")
		os.Exit(1)
	}

	log.Println("Waiting for app to shutdown")
	WaitForProcess(pid)

	log.Println("Downloading update")
	DownloadUpdate()

	log.Println("Run app")
	RunApp()
}
