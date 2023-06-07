package models

import "gorm.io/gorm"

type OrderItemExtra struct {
	gorm.Model
	Amount      uint `json:"extra_amount"`
	OrderItemId uint
}
