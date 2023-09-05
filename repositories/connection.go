package repositories

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"log"
	"time"
)

type Model struct {
	ID        uint           `json:"id" gorm:"primarykey"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `json:"deletedAt" gorm:"index"`
}

func InitializeSqlite(dst string) *gorm.DB {
	db, err := gorm.Open(sqlite.Open(dst), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database")
	}
	return db
}
