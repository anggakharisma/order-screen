package controllers

import (
	"log"
	"net/http"
	"strconv"

	"github.com/anggakharisma/spice-republic/api/db"
	"github.com/anggakharisma/spice-republic/api/models"
	"github.com/anggakharisma/spice-republic/api/requests"
	"github.com/gin-gonic/gin"
)

type UpdateOrderInput struct {
	Name        string `json:"name"`
	OrderType   uint   `json:"order_type"`
	OrderStatus uint   `json:"order_status"`
}

func FindOrders(c *gin.Context) {
	var orders []models.Order
	err := db.DB.Model(&models.Order{}).
		Preload("OrderItems").
		Preload("OrderItems.Food").
		Preload("OrderItems.OrderItemExtras").
		Find(&orders).Error
	if err != nil {
		log.Println("Something went wrong")
	}
	c.JSON(http.StatusOK, gin.H{"data": orders})
}

func FindOrder(c *gin.Context) {
	var order models.Order

	if err := db.DB.Where("id = ? ", c.Param("id")).
		Preload("OrderItems").
		Preload("OrderItems.Food").
		Preload("OrderItems.Food.Extras").
		Preload("OrderItems.OrderItemExtras").
		Preload("OrderItems.OrderItemExtras.Extra").
		First(&order); err.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Can't found that order"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": order})
}

func FindOrderItems(c *gin.Context) {
	var order models.Order

	if err := db.DB.Preload("OrderItems.Food").Preload("OrderItems.OrderItemExtras.Extra").Where("id = ? ", c.Param("id")).First(&order); err.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Can't found that order"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": order})
}

func CreateOrder(c *gin.Context) {
	var orderRequest requests.OrderRequest

	if err := c.BindJSON(&orderRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	orderItems := requests.ConvertOrderItemRequest(orderRequest)
	order := models.Order{Name: orderRequest.Name, OrderType: 0, OrderStatus: 0, OrderItems: orderItems}
	db.DB.Create(&order)

	c.JSON(http.StatusOK, gin.H{"data": "order " + strconv.Itoa(int(order.ID)) + " created"})
}

func UpdateOrder(c *gin.Context) {
	var order models.Order

	if err := db.DB.Where("id = ?", c.Param("id")).First(&order).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	var UpdateOrderInput UpdateOrderInput
	if err := c.ShouldBindJSON(&UpdateOrderInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db.DB.Model(&order).Updates(UpdateOrderInput)
	c.JSON(http.StatusOK, gin.H{"data": order})
}
