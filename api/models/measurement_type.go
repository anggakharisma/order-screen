package models

import "gorm.io/gorm"

type MeasurementType struct {
	gorm.Model
	Name string `json:"name"`
}
