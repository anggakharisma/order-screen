package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"spice-republic.com/api/controllers"
	"spice-republic.com/api/db"
)

func respondWithError(c *gin.Context, code int, message interface{}) {
	c.AbortWithStatusJSON(code, gin.H{"errror": message})
}

func TokenAuthMiddleware() gin.HandlerFunc {
	requiredToken := os.Getenv("API_TOKEN")

	if requiredToken == "" {
		log.Fatal("Please set API_TOKEN environment variable")
	}

	return func(c *gin.Context) {
		token := c.GetHeader("X-API-KEY")

		if token == "" {
			respondWithError(c, 401, "API token required")
			return
		}

		if token != requiredToken {
			respondWithError(c, 401, "Sus")
			return
		}

		c.Next()
	}
}

func main() {
	os.Setenv("API_TOKEN", "test token")
	db.ConnectDatabase() // Initialize Database
	r := gin.Default()

	// Health check
	r.GET("/health", controllers.HealthCheck)

	r.Group("/foods", TokenAuthMiddleware())
	{
		// foods
		r.GET("/foods", controllers.FindFoods)
		r.GET("/foods/:id", controllers.FindFood)

		r.POST("/foods", controllers.CreateFood)
		r.PATCH("/foods/:id", controllers.UpdateFood)

	}

	r.Run()
}
