package main

import (
	"context"
	"os"
)

const (
	NOTES_DIR = "/.wailsnotes"
)

func panicIf(err error) {
	if err != nil {
		panic(err.Error())
	}
}

type NoteManager struct {
	ctx      context.Context
	notesDir string
}

func NewNoteManager() *NoteManager {
	userDir, err := os.UserHomeDir()
	if err != nil {
		panic(err.Error())
	}

	return &NoteManager{
		notesDir: userDir + NOTES_DIR,
	}
}

func (nm *NoteManager) CreateNotesFolder() {
	err := os.Mkdir(nm.notesDir, 0666)
	panicIf(err)
}
