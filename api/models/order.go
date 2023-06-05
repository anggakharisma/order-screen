package models

import "gorm.io/gorm"

type Order struct {
	gorm.Model
	ID          uint   `json:"id" gorm:"primary_key"`
	Name        string `json:"name"`
	OrderType   uint   `json:"order_type"`
	OrderStatus uint   `json:"order_status"`
	OrderItems  []OrderItem
}
