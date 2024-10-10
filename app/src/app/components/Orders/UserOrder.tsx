import { UserOrderItem, ChangeQuantity } from "@/type";
import OrderCard from "../OrderCard";

type UserOrderProps = {
	removeOrder: any;
	changeQuantity: ChangeQuantity;
	newOrderItems: UserOrderItem[];
}

export default function UserOrder({ removeOrder, changeQuantity, newOrderItems }: UserOrderProps) {
	return (
		<div className="w-full">
			<p className="mb-2 font-medium text-center py-2 rounded-lg dark:text-black text-md text-black">YOUR ORDER</p>
			<div className="px-2">
				{
					newOrderItems.map((item, id) => <OrderCard removeOrder={removeOrder} changeQuantity={changeQuantity} key={id} orderItem={item} />).reverse()
				}
			</div>
		</div>
	);
}
