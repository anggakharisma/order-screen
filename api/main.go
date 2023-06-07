package main

import (
	"io"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/anggakharisma/spice-republic/api/controllers"
	"github.com/anggakharisma/spice-republic/api/db"
	"github.com/anggakharisma/spice-republic/api/middlewares"
)

func init() {
	os.Setenv("API_TOKEN", "v.UGXrV='!xIBDK=)K^bN0mE_fb9_Jy5W3u3WJZ199A+<+pAx}!]%b2B?y5{3{h")
	db.ConnectDatabase() // Initialize Database
}

func main() {
	// Logging to a file.
	f, _ := os.Create("gin.log")
	gin.DefaultWriter = io.MultiWriter(f)
	r := gin.Default()
	r.Use(gin.Logger())
  r.Use(gin.Recovery())

	r.GET("/health", controllers.HealthCheck)

	foodsRoute := r.Group("/foods", middlewares.TokenAuthMiddleware())
	{
		foodsRoute.GET("/", controllers.FindFoods)
		foodsRoute.GET("/:id", controllers.FindFood)

		foodsRoute.POST("/", controllers.CreateFood)
		foodsRoute.PATCH("/:id", controllers.UpdateFood)

	}

	ordersRoute := r.Group("/orders")
	{
		ordersRoute.GET("/", controllers.FindOrders)
		ordersRoute.GET("/:id", controllers.FindOrder)
		ordersRoute.GET("/:id/items", controllers.FindOrderItems)

		ordersRoute.POST("/", controllers.CreateOrder)
	}


	r.Run("0.0.0.0:8080")
}
