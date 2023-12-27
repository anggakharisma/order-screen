import { UserOrderItem, ChangeQuantity } from "@/type";
import OrderCard from "../OrderCard";

type UserOrderProps = {
	removeOrder: any;
	changeQuantity: ChangeQuantity;
	newOrderItems: UserOrderItem[];
}

export default function UserOrder({ removeOrder, changeQuantity, newOrderItems }: UserOrderProps) {
	return (
		<>
			<p className="mb-6 font-semibold text-black">Your Order</p>
			<div className="px-2">
				{
					newOrderItems.map((item, id) => <OrderCard removeOrder={removeOrder} changeQuantity={changeQuantity} key={id} orderItem={item} />).reverse()
				}
			</div>
		</>
	);
}
