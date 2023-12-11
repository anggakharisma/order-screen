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

func CORS() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func main() {
	if os.Getenv("MODE") != "production" {
		err := godotenv.Load()
		if err != nil {
			log.Fatal("Error loading .env file")
		}
	}
	r := gin.Default()
	r.Use(CORS())
	r.RedirectTrailingSlash = false
	r.RedirectFixedPath = true

	r.Static("/images", "./images")
	r.GET("/health", controllers.HealthCheck)

	v1 := r.Group("/v1/", middlewares.TokenAuthMiddleware())

	foodsRoute := v1.Group("/foods", middlewares.TokenAuthMiddleware())
	{
		foodsRoute.GET("/", controllers.FindFoods)
		foodsRoute.GET("/:id", controllers.FindFood)

		foodsRoute.POST("/", controllers.CreateFood)
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
