package repositories

//func migrateMonthEvent(db *gorm.DB) {
//	// Perform custom migration logic here
//	var events []MonthEvent
//	db.Find(&events)
//
//	for _, event := range events {
//		// Assuming you want to set both StartDate and EndDate to the value of the Date column
//		db.Model(&event).UpdateColumns(MonthEvent{StartDate: event.Date, EndDate: event.Date})
//	}
//
//	// Optionally, you might want to remove the original Date column if you don't need it anymore
//	// db.Migrator().DropColumn(&MonthEvent{}, "Date")
//}
//func migrateMonthEvents(db *gorm.DB) {
//	var events []MonthEvent
//	db.Find(&events)
//
//	for _, event := range events {
//		// Assuming you want to set both StartDate and EndDate to the value of the Date column
//		db.Model(&event).UpdateColumns(MonthEvent{StartDate: event, EndDate: event.Date})
//	}
//}
