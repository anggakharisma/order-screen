package main

import (
	"log"
	"os"

	"github.com/anggakharisma/spice-republic/api/controllers"
	"github.com/anggakharisma/spice-republic/api/db"
	"github.com/anggakharisma/spice-republic/api/middlewares"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func init() {
	db.ConnectDatabase() // Initialize Database
}

func main() {
	if os.Getenv("MODE") != "production" {
		err := godotenv.Load()
		if err != nil {
			log.Fatal("Error loading .env file")
		}
	}
	r := gin.Default()
	r.Static("/images", "./images")

	r.GET("/health", controllers.HealthCheck)
	v1 := r.Group("/v1/")

	foodsRoute := v1.Group("/foods", middlewares.TokenAuthMiddleware())
	{
		foodsRoute.GET("/", controllers.FindFoods)
		foodsRoute.GET("/:id", controllers.FindFood)

		foodsRoute.POST("/", controllers.CreateFood)
		foodsRoute.POST("/:id/image", controllers.AddImage)
		foodsRoute.PATCH("/:id", controllers.UpdateFood)
		foodsRoute.DELETE("/:id", controllers.DeleteFood)

	}

	ordersRoute := v1.Group("/orders")
	{
		ordersRoute.GET("/", controllers.FindOrders)
		ordersRoute.GET("/:id", controllers.FindOrder)
		ordersRoute.GET("/:id/items", controllers.FindOrderItems)

		ordersRoute.POST("/", controllers.CreateOrder)
		ordersRoute.PATCH("/:id", controllers.UpdateOrder)
	}

	extrasRoute := v1.Group("/extras")
	{
		extrasRoute.GET("/", controllers.FindExtras)
		extrasRoute.GET("/:id", controllers.FindExtra)

		extrasRoute.POST("/", controllers.CreateExtra)
		extrasRoute.PATCH("/:id", controllers.UpdateExtra)
	}

	r.Run("0.0.0.0:8080")
}
