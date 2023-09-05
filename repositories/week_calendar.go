package repositories

import (
	"fmt"
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

type WeekEvent struct {
	Model
	Title     string    `json:"title"`
	StartDate time.Time `json:"startDate"`
	EndDate   time.Time `json:"endDate"`
}

type WeeklyCalendar struct {
	db *gorm.DB
}

type WeekEventRepository interface {
	Create(event *WeekEvent) *WeekEvent
	Read() []WeekEvent
	Update(event *WeekEvent) *WeekEvent
	Delete(event *WeekEvent)
}

func NewWeeklyCalendar(db *gorm.DB) *WeeklyCalendar {
	err := db.AutoMigrate(&WeekEvent{})
	if err != nil {
		log.Println("Failed to migrate struct WeekEvent")
		log.Fatal(err.Error())
	}
	return &WeeklyCalendar{db}
}

func (c *WeeklyCalendar) Create(event *WeekEvent) *WeekEvent {
	result := c.db.Create(event)
	if result.Error != nil {
		log.Println("Failed to create event", event)
		log.Println(result.Error)
		return nil
	}
	log.Println("Created ", event)
	return event
}

func (c *WeeklyCalendar) Read() []WeekEvent {
	var weekEvents []WeekEvent
	result := c.db.Find(&weekEvents)
	if result.Error != nil {
		log.Println("Failed to read events")
		log.Println(result.Error)
	}
	fmt.Println(weekEvents)
	return weekEvents
}

func (c *WeeklyCalendar) Update(event *WeekEvent) *WeekEvent {
	result := c.db.Save(event)
	if result.Error != nil {
		log.Println("Failed to update event", event)
		log.Println(result.Error)
	}
	return event
}

func (c *WeeklyCalendar) Delete(event *WeekEvent) {
	result := c.db.Delete(event)
	if result.Error != nil {
		log.Println("Failed to delete event", event)
		log.Println(result.Error)
	}
}
