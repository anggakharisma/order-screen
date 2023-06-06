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
    log.Println("what")

		if token == "" {
			respondWithError(c, 401, "No token")
			return
		}

		if token != requiredToken {
			respondWithError(c, 401, "Sorry, can't do that")
			return
		}

		c.Next()
	}
}

func init() {
	os.Setenv("API_TOKEN", "test token")
	db.ConnectDatabase() // Initialize Database
}

func main() {
	r := gin.Default()
	r.Use(gin.Logger())

	r.GET("/health", controllers.HealthCheck)

	foodsRoute := r.Group("/foods", TokenAuthMiddleware())
	{
		foodsRoute.GET("/", controllers.FindFoods)
		foodsRoute.GET("/foods/:id", controllers.FindFood)

		foodsRoute.POST("/foods", controllers.CreateFood)
		foodsRoute.PATCH("/foods/:id", controllers.UpdateFood)

	}

	ordersRoute := r.Group("/orders")
	{
		ordersRoute.GET("/", controllers.FindOrders)
		ordersRoute.GET("/orders/:id", controllers.FindOrder)
	}

	r.Run("0.0.0.0:8080")
}
