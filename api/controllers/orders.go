package controllers

import (
	"net/http"
	"strconv"

	"github.com/anggakharisma/spice-republic/api/db"
	"github.com/anggakharisma/spice-republic/api/models"
	"github.com/gin-gonic/gin"
)

type OrderRequest struct {
	Name       string             `json:"name" binding:"required"`
	OrderItems []OrderItemRequest `json:"order_items" binding:"required,dive"`
}

type OrderItemExtrasRequest struct {
	Amount  uint `json:"amount" binding:"required"`
	ExtraId uint `json:"extra_id" binding:"required"`
}

type OrderItemRequest struct {
	FoodId          uint                     `json:"food_id" binding:"required"`
	Amount          uint                     `json:"amount" binding:"required"`
	OrderItemExtras []OrderItemExtrasRequest `json:"order_item_extras"`
}

type UpdateOrderInput struct {
	Name        string `json:"name"`
	OrderType   uint   `json:"order_type"`
	OrderStatus uint   `json:"order_status"`
}

func convertOrderItemRequest(orderRequest *OrderRequest) []models.OrderItem {
	var orderItems []models.OrderItem
	for _, orderItemReq := range orderRequest.OrderItems {
		var orderItemExtras []models.OrderItemExtra

		for _, orderItemExtraReq := range orderItemReq.OrderItemExtras {
			orderItemExtras = append(orderItemExtras, models.OrderItemExtra{
				Amount:  orderItemExtraReq.Amount,
				ExtraId: orderItemExtraReq.ExtraId,
			})
		}

		orderItems = append(orderItems, models.OrderItem{
			Amount:          orderItemReq.Amount,
			FoodId:          orderItemReq.FoodId,
			OrderItemExtras: orderItemExtras,
		})
	}

	return orderItems
}

func FindOrders(c *gin.Context) {
	var orders []models.Order
	db.DB.Find(&orders)
	c.JSON(http.StatusOK, gin.H{"data": orders})
}

func FindOrder(c *gin.Context) {
	var order models.Order

	if err := db.DB.Where("id = ? ", c.Param("id")).First(&order); err.Error != nil {
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
	var orderRequest OrderRequest

	if err := c.BindJSON(&orderRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	orderItems := convertOrderItemRequest(&orderRequest)
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
