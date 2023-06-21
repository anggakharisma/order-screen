interface Food {
  ID: number
  name: string
  price: number
  image: string
}

export interface OrderItem {
  ID: number
  amount: number
  food_id: number
  order_item_extras?: OrderItemExtras[]
}

export interface OrderItemExtras {
  ID: number
  amount: number
  extra_id: number
  order_item_id: number
}

export interface Order {
  ID: number
  name: string
  order_type: number
  order_status: number
  order_items: OrderItem[]
}

export interface NewOrderItem {
  hash: string;
  amount: number;
  food: Food;
}
