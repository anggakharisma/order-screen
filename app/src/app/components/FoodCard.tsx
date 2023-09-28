import { idrCurrency } from "@/config/currency";
import { Food } from "@/type";
import Image from "next/image";

type FoodCardProps = {
  food: Food;
  setCurrent: (food: Food) => void
}

export default function FoodCard({ food, setCurrent }: FoodCardProps) {

  return (
    <div className="food-card flex min-w-full max-h-40 h-full flex-col" onClick={() => setCurrent(food)}>
      <div className="rounded-full max-h-64 hover:scale-110 transition-all ease-linear hover:cursor-pointer">
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}${food.image}` || `/images/food01.jpg`}
          alt={food.name + " Image"}
          width="0"
          height="0"
          sizes="100vw"
          className="w-44 min-w-full h-40 max-h-40 object-cover rounded-md hover:rounded-2xl transition-all"
        />
      </div>
      <div className="text-black bg-white -mt-8 z-10 rounded-full w-11/12 px-6 py-2">
        <h1 className="text-xs">{idrCurrency.format(food.price).replace(/(\.|,)00$/g, '')}</h1>
        <h3 className="text-sm track-wider font-bold">{food.name}</h3>
      </div>
    </div>
  )
}
