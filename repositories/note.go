package repositories

import (
	"fmt"
	"gorm.io/gorm"
	"log"
)

type Note struct {
	Model
	Title   string `json:"title"`
	Content string `json:"content"`
}

type NoteRepository struct {
	db *gorm.DB
}

func NewNoteRepository(db *gorm.DB) *NoteRepository {
	err := db.AutoMigrate(&Note{})
	if err != nil {
		log.Println("Failed to migrate struct Note")
		log.Fatal(err.Error())
	}
	return &NoteRepository{db}
}

func (nm *NoteRepository) Create(note *Note) *Note {
	result := nm.db.Create(note)
	if result.Error != nil {
		log.Println("Failed to create note", note)
		log.Println(result.Error)
		return nil
	}
	log.Println("Created", note)
	return note
}

func (nm *NoteRepository) Read() []*Note {
	var notes []*Note
	result := nm.db.Find(&notes)
	if result.Error != nil {
		log.Println("Failed to read notes")
		log.Println(result.Error)
		return nil
	}
	fmt.Println(notes)
	return notes
}

func (nm *NoteRepository) Update(note *Note) *Note {
	result := nm.db.Save(note)
	if result.Error != nil {
		log.Println("Failed to update note", note)
		log.Println(result.Error)
	}
	return note
}

func (nm *NoteRepository) Delete(note *Note) {
	result := nm.db.Delete(note)
	if result.Error != nil {
		log.Println("Failed to delete note", note)
		log.Println(result.Error)
	}
}
