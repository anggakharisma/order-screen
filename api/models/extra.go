package models

import "gorm.io/gorm"

type Extra struct {
	gorm.Model
	Name              string `json:"name"`
	MeasurementType   MeasurementType
	MeasurementTypeId uint    `json:"measurement_type_id"`
	Food              []*Food `gorm:"many2many:food_extra"`
}
