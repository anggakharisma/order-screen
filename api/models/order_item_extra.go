package models

import (
	"gorm.io/gorm"
)

type OrderItemExtra struct {
	gorm.Model
	Amount      uint `json:"extra_amount"`
	ExtraId     uint `json:"extra_id"`
	OrderItemId uint
	Extra       Extra
}
