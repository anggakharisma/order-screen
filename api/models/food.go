package models

import "gorm.io/gorm"

type Food struct {
	gorm.Model
	Name   string   `json:"name"`
	Image  string   `json:"image"`
	Price  float64  `json:"price"`
	Stock  int      `gorm:"default:100" json:"stock"`
	Extras []*Extra `gorm:"many2many:food_extra;" json:"extras"`
}
