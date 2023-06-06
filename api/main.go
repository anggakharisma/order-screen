package main

import (
	"os"

	"github.com/gin-gonic/gin"
	"spice-republic.com/api/controllers"
	"spice-republic.com/api/db"
	"spice-republic.com/api/middlewares"
)

func init() {
	os.Setenv("API_TOKEN", "test token")
	db.ConnectDatabase() // Initialize Database
}

func main() {
	r := gin.Default()
	r.Use(gin.Logger())

	r.GET("/health", controllers.HealthCheck)

	foodsRoute := r.Group("/foods", middlewares.TokenAuthMiddleware())
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
