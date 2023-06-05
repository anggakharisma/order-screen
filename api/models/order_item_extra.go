package models

import "gorm.io/gorm"

type OrderItemExtra struct {
	gorm.Model
	ID          uint `json:"id" gorm:"primary_key"`
	Amount      uint `json:"extra_amount"`
	OrderItemId uint
}
