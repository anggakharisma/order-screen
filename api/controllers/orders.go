package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"spice-republic.com/api/db"
	"spice-republic.com/api/models"
)

type OrderRequest struct {
	Name       string             `json:"name" binding:"required"`
	OrderItems []OrderItemRequest `json:"order_items" binding:"required,dive"`
}

type OrderItemExtrasRequest struct {
	Amount uint `json:"amount" binding:"required"`
}

type OrderItemRequest struct {
	FoodId          uint                     `json:"food_id" binding:"required"`
	Amount          uint                     `json:"amount" binding:"required"`
	OrderItemExtras []OrderItemExtrasRequest `json:"order_item_extras"`
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
	var orderRequest OrderRequest

	if err := c.BindJSON(&orderRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var orderItems []models.OrderItem

	for _, orderItemReq := range orderRequest.OrderItems {
		var orderItemExtras []models.OrderItemExtra

		if len(orderItemReq.OrderItemExtras) > 0 {
			for _, orderItemExtraReq := range orderItemReq.OrderItemExtras {
				orderItemExtras = append(orderItemExtras, models.OrderItemExtra{
					Amount: orderItemExtraReq.Amount,
				})
			}
		}
		orderItems = append(orderItems, models.OrderItem{
			Amount:          orderItemReq.Amount,
			FoodId:          orderItemReq.FoodId,
			OrderItemExtras: orderItemExtras,
		})
	}

	order := models.Order{Name: orderRequest.Name, OrderType: 0, OrderStatus: 0, OrderItems: orderItems}
	db.DB.Create(&order)

	c.JSON(http.StatusOK, gin.H{"data": "order " + strconv.Itoa(int(order.ID)) + " created"})
}

func UpdateOrder(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"data": "all orders"})
}

func DeleteOrder(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"data": "all orders"})
}
