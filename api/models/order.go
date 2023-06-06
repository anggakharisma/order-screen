package models

import "gorm.io/gorm"

type Order struct {
	gorm.Model
	Name        string      `json:"name"`
	OrderType   uint        `json:"order_type"`
	OrderStatus uint        `json:"order_status"`
	OrderItems  []OrderItem `json:"order_items"`
}
