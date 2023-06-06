package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"spice-republic.com/api/db"
	"spice-republic.com/api/models"
)

type FoodRequest struct {
	Name  string `json:"name" binding:"required"`
	Price int    `json:"price" binding:"required"`
}

type UpdateFoodInput struct {
	Name  string `json:"name"`
	Price int    `json:"price"`
}

func FindFoods(c *gin.Context) {
	var foods []models.Food
	db.DB.Find(&foods)

	c.JSON(http.StatusOK, gin.H{"data": foods})
}

func FindFood(c *gin.Context) {
	var food models.Food

	if err := db.DB.Where("id = ? ", c.Param("id")).First(&food); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Record not found!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": food})
}

func CreateFood(c *gin.Context) {
	var req FoodRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "yo"})
		return
	}

	food := models.Food{Name: req.Name, Price: req.Price}
	db.DB.Create(food)

	c.JSON(http.StatusOK, gin.H{"data": food})
}

func UpdateFood(c *gin.Context) {
	var food models.Food
	if err := db.DB.Where("id = ?", c.Param("id")).First(&food).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var input UpdateFoodInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db.DB.Model(&food).Updates(input)
}

func DeleteBook(c *gin.Context) {
	var food models.Food
	if err := db.DB.Where("id = ?", c.Param("id")).First(&food).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Record not found!"})
		return
	}

	db.DB.Delete(&food)

	c.JSON(http.StatusOK, gin.H{"data": true})
}
