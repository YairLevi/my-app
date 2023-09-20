package repositories

import (
	"fmt"
	"gorm.io/gorm"
	"log"
	"time"
)

type MonthEvent struct {
	Model
	Title string    `json:"title"`
	Date  time.Time `json:"date"`
}

type MonthEventRepository struct {
	db *gorm.DB
}

func NewMonthCalendar(db *gorm.DB) *MonthEventRepository {
	err := db.AutoMigrate(&MonthEvent{})
	if err != nil {
		log.Println("Failed to migrate struct MonthEvent")
		log.Fatal(err.Error())
	}
	return &MonthEventRepository{db}
}

func (c *MonthEventRepository) Create(event *MonthEvent) *MonthEvent {
	result := c.db.Create(event)
	if result.Error != nil {
		log.Println("Failed to create event", event)
		log.Println(result.Error)
		return nil
	}
	log.Println("Created", event)
	return event
}

func (c *MonthEventRepository) Read() []*MonthEvent {
	var monthEvents []*MonthEvent
	result := c.db.Find(&monthEvents)
	if result.Error != nil {
		log.Println("Failed to read events")
		log.Println(result.Error)
	}
	fmt.Println(monthEvents)
	return monthEvents
}

func (c *MonthEventRepository) Update(event *MonthEvent) *MonthEvent {
	result := c.db.Save(event)
	if result.Error != nil {
		log.Println("Failed to update event", event)
		log.Println(result.Error)
	}
	return event
}

func (c *MonthEventRepository) Delete(event *MonthEvent) {
	result := c.db.Delete(event)
	if result.Error != nil {
		log.Println("Failed to delete event", event)
		log.Println(result.Error)
	}
}
