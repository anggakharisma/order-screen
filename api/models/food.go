package models

import "gorm.io/gorm"

type Food struct {
	gorm.Model
	Name   string   `json:"name"`
	Image  string   `json:"image"`
	Price  int      `json:"price"`
	Extras []*Extra `gorm:"many2many:food_extra;"`
}
