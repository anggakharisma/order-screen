import { Food } from "@/type"
import FoodCard from "../FoodCard"
import { Fade } from "react-awesome-reveal";

type FoodsProps = {
	isLoading: boolean,
	data: Food[],
	setCurrent: (food: Food) => void
}
export default function Foods({ isLoading, data, setCurrent }: FoodsProps) {
	return (
		!isLoading ?
			<div className="w-full grid grid-cols-5 gap-y-4 gap-12 mt-8">
				<Fade cascade delay={2} damping={0.15}>
					{
						data.map((food: Food) => <FoodCard setCurrent={setCurrent} food={food} key={food.ID}></FoodCard>)
					}
				</Fade>
			</div>
			: <h1>Loading...</h1>
	)
}
