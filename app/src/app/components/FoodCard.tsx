import { usdCurrency } from "@/config/currency";
import { Food } from "@/type";
import Image from "next/image";

type FoodCardProps = {
	food: Food;
	setCurrent: (food: Food) => void
}

export default function FoodCard({ food, setCurrent }: FoodCardProps) {

	return (
		<div className="relative food-card w-full h-80 flex min-w-full flex-col rounded-full" onClick={() => setCurrent(food)}>
			<div
				className="border-solid border-4 border-transparent transition-all ease-linear hover:cursor-pointer rounded-md opacity-1">

				<Image
					src={`${process.env.NEXT_PUBLIC_API_URL}${food.image}` || `/images/food01.jpg`}
					alt={food.name + " Image"}
					width="0"
					height="0"
					className="min-w-full w-60 xl:h-72 xl:w-56 h-60 object-cover bg-center transition-all rounded-md"
				/>
			</div>
			<div className="text-black bg-white -mt-8 z-10 rounded-full w-10/12 px-6 py-2">
				<h3 className="text-sm track-wider font-bold">{food.name}</h3>
				<h1 className="text-xs">{usdCurrency.format(food.price).replace(/(\.|,)00$/g, '')}</h1>
			</div>
		</div >
	)
}
