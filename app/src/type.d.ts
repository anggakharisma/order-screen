interface Food {
  ID: number;
  name: string;
  price: number;
  image: string;
}

export interface OrderItem {
  ID?: number;
  amount: number;
  food_id: number;
  food?: Food;
  order_item_extras?: OrderItemExtras[];
}

export interface MeasurementType {
  ID?: number;
  name: string;
}

export interface Extra {
  ID?: number;
  name: string;
  measurement_type_id: number;
}

export type OrderItemRequest = Omit<OrderItem, "ID">;

export interface OrderItemExtras {
  ID?: number;
  amount: number;
  extra_id: number;
  order_item_id?: number;
}

export interface Order {
  ID: number;
  name: string;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string;
  order_status: number;
  order_type: number;
  order_items: OrderItem[]
}

export interface OrderRequest extends Order {
  order_items: OrderItemRequest[]
}

export type OrderItemExtraRequest = Omit<OrderItemExtras, "ID">;

export interface UserOrderItem {
  hash: string;
  amount: number;
  food: Food;
  order_item_extras?: OrderItemExtraRequest[];
}

export type ChangeQuantity = (actionType: string, orderItem: UserOrderItem) => void;
