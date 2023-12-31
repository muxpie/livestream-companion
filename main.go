package main

import (
	"livestream-companion/management"
	"livestream-companion/routes"
	"time"
)

func main() {
	management.InitializeDatabase()
	go func() {
		for {
			management.UpdateDBEPG(true) // Pass true to check the last processed time
			time.Sleep(1 * time.Hour)    // Sleep for 1 hour before the next update
		}
	}()

	r := routes.SetupRouter()
	r.Run(":5004")
}
