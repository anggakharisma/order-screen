package main

import (
	"io"
	"os"

	"github.com/anggakharisma/spice-republic/api/controllers"
	"github.com/anggakharisma/spice-republic/api/db"
	"github.com/anggakharisma/spice-republic/api/middlewares"
	"github.com/gin-gonic/gin"
)

func init() {
  os.Setenv("API_TOKEN",
  "v.UGXrV='!xIBDK=)K^bN0mE_fb9_Jy5W3u3WJZ199A+<+pAx}!]%b2B?y5{3{h")
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
	v1 := r.Group("/v1/")

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

	r.Run("0.0.0.0:8080")
}
