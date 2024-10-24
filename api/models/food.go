package models

import (
	"github.com/shopspring/decimal"
	"gorm.io/gorm"
)

type Food struct {
	gorm.Model
	Name   string          `json:"name"`
	Image  string          `json:"image"`
	Price  float64         `json:"price"`
	Stock  decimal.Decimal `gorm:"default:500" json:"stock" gorm:"type:deicmal(7, 6)"`
	Extras []*Extra        `gorm:"many2many:food_extra;" json:"extras"`
}
