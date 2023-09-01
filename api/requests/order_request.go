package requests

type OrderRequest struct {
	Name       string             `json:"name" binding:"required"`
	OrderItems []OrderItemRequest `json:"order_items" binding:"required,dive"`
}

type OrderItemExtrasRequest struct {
	Amount  uint `json:"amount" binding:"required"`
	ExtraId uint `json:"extra_id" binding:"required"`
}

type OrderItemRequest struct {
	FoodId          uint                     `json:"food_id" binding:"required"`
	Amount          uint                     `json:"amount" binding:"required"`
	OrderItemExtras []OrderItemExtrasRequest `json:"order_item_extras"`
}
