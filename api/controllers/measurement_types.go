package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"spice-republic.com/api/db"
	"spice-republic.com/api/models"
)

type MeasurementTypeRequest struct {
	gorm.Model
	Name string `json:"name"`
}

func FindMeasurementType(c *gin.Context) {
	var measurementType models.MeasurementType
	if err := db.DB.Where("id = ?", c.Param("id")).First(&measurementType); err.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": measurementType})
}

func CreateMeasurmentType(c *gin.Context) {
	var measurementTypeRequest MeasurementTypeRequest

	if err := c.BindJSON(&measurementTypeRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

  measurementType := models.MeasurementType{
    Name: measurementTypeRequest.Name,
  }
  db.DB.Create(&measurementType)

  c.JSON(http.StatusCreated, gin.H{"data": measurementType})
}
