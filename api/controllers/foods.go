package controllers

import (
	"mime/multipart"
	"net/http"
	"path/filepath"

	"github.com/anggakharisma/spice-republic/api/db"
	"github.com/anggakharisma/spice-republic/api/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type FoodRequest struct {
	Name  string               `form:"name" binding:"required"`
	Price int                  `form:"price" binding:"required"`
	Image multipart.FileHeader `form:"image" binding:"required"`
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

	if err := db.DB.Where("id = ? ", c.Param("id")).First(&food).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Record not found!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": food})
}

func CreateFood(c *gin.Context) {
	var req FoodRequest
  file, err := c.FormFile("image");
  
  if err != nil {
  }

	uploadPath := getFilePath(file.Filename)

	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	food := models.Food{Name: req.Name, Price: req.Price}
	db.DB.Create(&food)

	if err := c.SaveUploadedFile(&req.Image, uploadPath); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db.DB.Model(&food).Updates(&models.Food{Image: uploadPath})

	c.JSON(http.StatusOK, gin.H{"data": food})
}

func UpdateFood(c *gin.Context) {
	var food models.Food
	if err := db.DB.Where("id = ?", c.Param("id")).First(&food).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var updateFoodInput UpdateFoodInput
	if err := c.ShouldBindJSON(&updateFoodInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db.DB.Model(&food).Updates(updateFoodInput)

	c.JSON(http.StatusOK, gin.H{"data": food})
}

func DeleteFood(c *gin.Context) {
	var food models.Food
	if err := db.DB.Where("id = ?", c.Param("id")).First(&food).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Record not found!"})
		return
	}

	db.DB.Delete(&food)

	c.JSON(http.StatusOK, gin.H{"data": true})
}

func getFilePath(fileName string) string {
	extension := filepath.Ext(fileName)
	newFileName := uuid.New().String() + extension

	uploadPath := "images/foods/" + newFileName

	return uploadPath

}
