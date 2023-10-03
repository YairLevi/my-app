package main

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type User struct {
	ID   uint
	Name string
}

func main() {
	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	cl, _ := db.DB()
	defer cl.Close()

	// Migrate the schema
	db.AutoMigrate(&User{})

	// Create
	db.Create(&User{Name: "John"})

	// Read
	var user User
	db.First(&user, 1)                  // find user with id 1
	db.First(&user, "name = ?", "John") // find user with name John

	// Update - update user's name to Jane
	db.Model(&user).Update("Name", "Jane")

	// Delete - delete user
	db.Delete(&user, 1)
}
