package middlewares

import (
	"log"
	"net/http"
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
		uToken := c.GetHeader("x-api-key")
		if len(uToken) == 0 || uToken != requiredToken {
			c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
			c.AbortWithStatus(401)
		}
		c.Next()
	}
}
