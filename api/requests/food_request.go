package requests

import (
	"mime/multipart"
)

type FoodRequest struct {
	Name  string               `form:"name" binding:"required"`
	Price int                  `form:"price" binding:"required"`
	Image multipart.FileHeader `form:"image" binding:"required"`
}

type UpdateFoodInput struct {
	Name  string `json:"name"`
	Price int    `json:"price"`
}
