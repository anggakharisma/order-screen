package models

import "gorm.io/gorm"

type OrderItem struct {
	gorm.Model
	OrderID         uint             `json:"order_id"`
	Amount          uint             `json:"food_amount"`
	FoodId          uint             `json:"food_id"`
	Food            Food             `json:"food"`
	OrderItemExtras []OrderItemExtra `json:"order_item_extras"`
}
