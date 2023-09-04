package requests

import "github.com/anggakharisma/spice-republic/api/models"

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

func ConvertOrderItemRequest(orderRequest OrderRequest) []models.OrderItem {
	var orderItems []models.OrderItem
	for _, orderItemReq := range orderRequest.OrderItems {
		var orderItemExtras []models.OrderItemExtra

		for _, orderItemExtraReq := range orderItemReq.OrderItemExtras {
			orderItemExtras = append(orderItemExtras, models.OrderItemExtra{
				Amount:  orderItemExtraReq.Amount,
				ExtraId: orderItemExtraReq.ExtraId,
			})
		}

		orderItems = append(orderItems, models.OrderItem{
			Amount:          orderItemReq.Amount,
			FoodId:          orderItemReq.FoodId,
			OrderItemExtras: orderItemExtras,
		})
	}

	return orderItems
}
