package models

import "gorm.io/gorm"

type Food struct {
	gorm.Model
	ID    uint     `json:"id" gorm:"primary_key"`
	Name  string   `json:"name"`
	Image string   `json:"string"`
	Price int      `json:"price"`
	Extra []*Extra `gorm:"many2many:food_extra"`
}
