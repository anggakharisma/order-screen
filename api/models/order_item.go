package models

import "gorm.io/gorm"

type OrderItem struct {
	gorm.Model
	ID              uint `json:"id" gorm:"primary_key"`
	OrderId         uint `json:"order_id"`
	Amount          uint `json:"food_amount"`
	FoodId          uint `json:"food_id"`
	Food            Food
	OrderItemExtras []OrderItemExtra
}
