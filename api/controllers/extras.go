package controllers

import (
	"net/http"
	"strconv"

	"github.com/anggakharisma/spice-republic/api/db"
	"github.com/anggakharisma/spice-republic/api/models"
	"github.com/gin-gonic/gin"
)

type ExtraRequest struct {
	Name             string `json:"name" binding:"required"`
	MeasuremntTypeID uint   `json:"measurement_type_id" binding:"required"`
}

type UpdateExtraInput struct {
	Name string `json:"name" binding:"required"`
}

func FindExtras(c *gin.Context) {
	var extras []models.Extra
	db.DB.Find(&extras)

	c.JSON(http.StatusOK, gin.H{"data": extras})
}

func FindExtra(c *gin.Context) {
	var extra models.Extra

	if err := db.DB.Where("id = ?", c.Param("id")).First(&extra); err.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": extra})
}

func CreateExtra(c *gin.Context) {
	var extraRequest ExtraRequest

	if err := c.BindJSON(&extraRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	extra := models.Extra{Name: extraRequest.Name, MeasurementTypeId: extraRequest.MeasuremntTypeID}
	db.DB.Create(&extra)
	c.JSON(http.StatusOK, gin.H{"data": "extra " + strconv.Itoa(int(extra.ID)) + " created"})
}

func UpdateExtra(c *gin.Context) {
	var extra models.Extra
	if err := db.DB.Where("id = ?", c.Param("id")).First(&extra).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var updateExtraInput UpdateExtraInput
	if err := c.ShouldBindJSON(&updateExtraInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db.DB.Model(&extra).Updates(updateExtraInput)
	c.JSON(http.StatusOK, gin.H{"data": "data updated"})
}

func DeleteExtra(c *gin.Context) {
	var extra models.Extra
	if err := db.DB.Where("id = ?", c.Param("id")).First(&extra).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Record not found!"})
		return
	}

	db.DB.Delete(&extra)

	c.JSON(http.StatusOK, gin.H{"data": true})
}
