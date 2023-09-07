package repositories

import (
	"fmt"
	"gorm.io/gorm"
	"log"
	_ "modernc.org/sqlite"
	"time"
)

type MonthEvent struct {
	Model
	Title string    `json:"title"`
	Date  time.Time `json:"date"`
}

type MonthCalendar struct {
	db *gorm.DB
}

type MonthEventRepository interface {
	Create(event *MonthEvent) *MonthEvent
	Read() []MonthEvent
	Update(event *MonthEvent) *MonthEvent
	Delete(event *MonthEvent)
}

func NewMonthCalendar(db *gorm.DB) *MonthCalendar {
	err := db.AutoMigrate(&MonthEvent{})
	if err != nil {
		log.Println("Failed to migrate struct MonthEvent")
		log.Fatal(err.Error())
	}
	return &MonthCalendar{db}
}

func (c *MonthCalendar) Create(event *MonthEvent) *MonthEvent {
	result := c.db.Create(event)
	if result.Error != nil {
		log.Println("Failed to create event", event)
		log.Println(result.Error)
		return nil
	}
	log.Println("Created", event)
	return event
}

func (c *MonthCalendar) Read() []MonthEvent {
	var monthEvents []MonthEvent
	result := c.db.Find(&monthEvents)
	if result.Error != nil {
		log.Println("Failed to read events")
		log.Println(result.Error)
	}
	fmt.Println(monthEvents)
	return monthEvents
}

func (c *MonthCalendar) Update(event *MonthEvent) *MonthEvent {
	result := c.db.Save(event)
	if result.Error != nil {
		log.Println("Failed to update event", event)
		log.Println(result.Error)
	}
	return event
}

func (c *MonthCalendar) Delete(event *MonthEvent) {
	result := c.db.Delete(event)
	if result.Error != nil {
		log.Println("Failed to delete event", event)
		log.Println(result.Error)
	}
}
