package repositories

import (
	"gorm.io/gorm"
	"time"
)

type Repository[T any] interface {
	Create(event *T) *T
	Read() []*T
	Update(event *T) *T
	Delete(event *T)
}

type Model struct {
	ID        uint           `json:"id" gorm:"primarykey"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `json:"deletedAt" gorm:"index"`
}
