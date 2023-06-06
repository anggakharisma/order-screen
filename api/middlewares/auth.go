package middlewares

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
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
