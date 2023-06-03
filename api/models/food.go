package models

type Food struct {
	ID    uint   `json:"id" gorm:"primary_key"`
	Name  string `json:"name"`
	Image string `json:"string"`
	Price int    `json:"price"`
}
