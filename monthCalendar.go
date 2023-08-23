package main

import (
	"context"
	"database/sql"
	"fmt"
	_ "modernc.org/sqlite"
	"time"
)

type MonthEvent struct {
	ID    int64     `json:"id"`
	Title string    `json:"title"`
	Date  time.Time `json:"date"`
}

type MonthCalendar struct {
	ctx context.Context
	db  *sql.DB
}

type MonthCalendarService interface {
	Create(event *MonthEvent) *MonthEvent
	Read() []MonthEvent
	Update(eventId int, fields map[string]interface{})
	Delete(id int)
	Close()
}

func NewMonthCalendar() *MonthCalendar {
	db, err := sql.Open("sqlite", "./database.db")
	printErr(err)

	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS monthEvents (
		    id INTEGER PRIMARY KEY AUTOINCREMENT,
		    title TEXT,
		    date DATETIME
	)`)
	if err != nil {
		fmt.Println("Cant create table.")
	}
	fmt.Println()
	printErr(err)

	return &MonthCalendar{
		db: db,
	}
}

func (c *MonthCalendar) Create(event *MonthEvent) *MonthEvent {
	fmt.Println("Created ", event)
	insertQuery := "INSERT INTO monthEvents (title, date) VALUES (?, ?)"
	res, err := c.db.Exec(
		insertQuery,
		event.Title,
		event.Date,
	)
	printErr(err)

	id, err := res.LastInsertId()
	printErr(err)

	event.ID = id
	return event
}

func (c *MonthCalendar) Read() []MonthEvent {
	rows, err := c.db.Query(`SELECT * FROM monthEvents`)
	printErr(err)

	var events []MonthEvent
	for rows.Next() {
		var event MonthEvent
		err = rows.Scan(
			&event.ID,
			&event.Title,
			&event.Date,
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

func (c *MonthCalendar) Update(eventId int, fields map[string]interface{}) {
	updateSql := "UPDATE monthEvents SET "
	args := make([]interface{}, 0)

	for key, value := range fields {
		if key == "id" {
			continue
		}
		updateSql += fmt.Sprintf("%s=?, ", key)
		args = append(args, value)
	}

	updateSql = updateSql[:len(updateSql)-2]
	updateSql += " WHERE id = ?;"
	args = append(args, eventId)

	_, err := c.db.Exec(updateSql, args...)
	printErr(err)
}

func (c *MonthCalendar) Delete(eventId int) {
	_, err := c.db.Exec(`DELETE FROM monthEvents WHERE id = ?`, eventId)
	if err == nil {
		fmt.Println("Deleted successfully.")
	}
	printErr(err)
}

func (c *MonthCalendar) Close() {
	c.db.Close()
}
