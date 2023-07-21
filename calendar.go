package main

import (
	"context"
	"database/sql"
	"fmt"
	_ "modernc.org/sqlite"
	"time"
)

type Event struct {
	ID        int64     `json:"id"`
	Title     string    `json:"title"`
	StartDate time.Time `json:"startDate"`
	EndDate   time.Time `json:"endDate"`
}

type Calendar struct {
	ctx context.Context
	db  *sql.DB
}

type CalendarService interface {
	Create(event *Event) *Event
	Read() []Event
	Update(eventId int, fields map[string]interface{})
	Delete(id int)
	Close()
}

func NewCalendar() *Calendar {
	db, err := sql.Open("sqlite", "./database.db")
	printErr(err)

	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS events (
		    id INTEGER PRIMARY KEY AUTOINCREMENT,
		    title TEXT,
		    startDate DATETIME,
		    endDate DATETIME
	)`)
	printErr(err)

	return &Calendar{
		db: db,
	}
}

func (c *Calendar) Create(event *Event) *Event {
	fmt.Println("Created ", event)
	insertQuery := "INSERT INTO events (title, startDate, endDate) VALUES (?, ?, ?)"
	res, err := c.db.Exec(
		insertQuery,
		event.Title,
		event.StartDate,
		event.EndDate,
	)
	printErr(err)

	id, err := res.LastInsertId()
	printErr(err)

	event.ID = id
	return event
}

func (c *Calendar) Read() []Event {
	rows, err := c.db.Query(`SELECT * FROM events`)
	printErr(err)

	var events []Event
	for rows.Next() {
		var event Event
		err = rows.Scan(
			&event.ID,
			&event.Title,
			&event.StartDate,
			&event.EndDate,
		)
		printErr(err)

		// Wails need to fix this, sent issue. Time is saved using a different Timezone.
		// Need to change before returning to the client.

		//event.StartDate = event.StartDate.In(time.Now().Location())
		//event.EndDate = event.EndDate.In(time.Now().Location())

		events = append(events, event)
	}
	for i, event := range events {
		fmt.Println(i, ": ", event)
	}
	return events
}

func (c *Calendar) Update(eventId int, fields map[string]interface{}) {
	updateSql := "UPDATE events SET "
	args := make([]interface{}, 0)

	for key, value := range fields {
		updateSql += fmt.Sprintf("%s=?, ", key)
		args = append(args, value)
	}

	updateSql = updateSql[:len(updateSql)-2]
	updateSql += " WHERE id = ?;"
	args = append(args, eventId)

	_, err := c.db.Exec(updateSql, args...)
	printErr(err)
}

func (c *Calendar) Delete(eventId int) {
	_, err := c.db.Exec(`DELETE FROM events WHERE id = ?`, eventId)
	if err == nil {
		fmt.Println("Deleted successfully.")
	}
	printErr(err)
}

func (c *Calendar) Close() {
	c.db.Close()
}
