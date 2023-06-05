package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"spice-republic.com/api/db"
	"spice-republic.com/api/models"
)

type OrderRequest struct {
	Name string `json:"name" binding:"required"`
}

func FindOrders(c *gin.Context) {
	var orders []models.Order
  db.DB.Find(&orders)
	c.JSON(http.StatusOK, gin.H{"data": orders})
}

func FindOrder(c *gin.Context) {
  var order models.Order

  if err := db.DB.Where("id = ? ", c.Param("id")).First(&order); err != nil {
    c.JSON(http.StatusBadRequest, gin.H{"error": "Cant found that order"})
    return
  }

	c.JSON(http.StatusOK, gin.H{"data": order})
}

func CreateOrder(c *gin.Context) {
  // user order 
  // deal with order item and extras
  var req OrderRequest

  if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
    return
  }
  order := models.Order{Name: req.Name}
  db.DB.Create(order)
	c.JSON(http.StatusOK, gin.H{"data": order})
}

func UpdateOrder(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"data": "all orders"})
}

func DeleteOrder(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"data": "all orders"})
}
