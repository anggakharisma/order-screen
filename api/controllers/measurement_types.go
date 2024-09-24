package controllers

import (
	"net/http"

	"github.com/anggakharisma/spice-republic/api/db"
	"github.com/anggakharisma/spice-republic/api/models"
	"github.com/gin-gonic/gin"
)

type MeasurementTypeRequest struct {
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

	c.JSON(http.StatusCreated, gin.H{"message": "Created"})
}
