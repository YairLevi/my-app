package repositories

import (
	"fmt"
	"gorm.io/gorm"
	"log"
	"time"
)

type WeekEvent struct {
	Model
	Title     string    `json:"title"`
	StartDate time.Time `json:"startDate"`
	EndDate   time.Time `json:"endDate"`
}

type WeekCalendar struct {
	db *gorm.DB
}

type WeekEventRepository interface {
	Create(event *WeekEvent) *WeekEvent
	Read() []WeekEvent
	Update(event *WeekEvent) *WeekEvent
	Delete(event *WeekEvent)
}

func NewWeekCalendar(db *gorm.DB) *WeekCalendar {
	err := db.AutoMigrate(&WeekEvent{})
	if err != nil {
		log.Println("Failed to migrate struct WeekEvent")
		log.Fatal(err.Error())
	}
	return &WeekCalendar{db}
}

func (c *WeekCalendar) Create(event *WeekEvent) *WeekEvent {
	result := c.db.Create(event)
	if result.Error != nil {
		log.Println("Failed to create event", event)
		log.Println(result.Error)
		return nil
	}
	log.Println("Created ", event)
	return event
}

func (c *WeekCalendar) Read() []WeekEvent {
	var weekEvents []WeekEvent
	result := c.db.Find(&weekEvents)
	if result.Error != nil {
		log.Println("Failed to read events")
		log.Println(result.Error)
	}
	fmt.Println(weekEvents)
	return weekEvents
}

func (c *WeekCalendar) Update(event *WeekEvent) *WeekEvent {
	result := c.db.Save(event)
	if result.Error != nil {
		log.Println("Failed to update event", event)
		log.Println(result.Error)
	}
	return event
}

func (c *WeekCalendar) Delete(event *WeekEvent) {
	result := c.db.Delete(event)
	if result.Error != nil {
		log.Println("Failed to delete event", event)
		log.Println(result.Error)
	}
}
