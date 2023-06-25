import { Food } from "@/type"
import FoodCard from "../FoodCard"

type FoodsProps = {
	isLoading: any,
	data: Food[],
	addOrderItem: (food: Food) => void
}
export default function Foods({ isLoading, data, addOrderItem }: FoodsProps) {
	return (
		!isLoading ?
			<div className="grid grid-cols-3 gap-12 mt-8">
				{
					data.map((food: Food) => <FoodCard addOrderItem={addOrderItem} food={food} key={food.ID}></FoodCard>)
				}
			</div>
			: <h1>Loading...</h1>
	)
}
