package models

import "gorm.io/gorm"

type MeasurementType struct {
	gorm.Model
	ID   uint   `json:"id" gorm:"primary_key"`
	Name string `json:"name"`
}
