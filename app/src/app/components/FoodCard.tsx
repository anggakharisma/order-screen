import { Food } from "@/type";
import Image from "next/image";

type FoodCardProps = {
  food: Food;
  addOrderItem: (food: Food) => void
}

export default function FoodCard({ food, addOrderItem }: FoodCardProps) {
  return (
    <div className="food-card flex min-w-full max-h-40 h-4/6 flex-col" onClick={() => addOrderItem(food)}>
      <div className="rounded-full max-h-64 hover:scale-110 transition-all ease-linear hover:cursor-pointer">
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}${food.image}` || `/images/food01.jpg`}
          alt={"Food name: " + addOrderItem.name}
          width="0"
          placeholder="empty"
          height="0"
          sizes="100vw"
          className="w-full min-w-full h-40 max-h-40 object-cover rounded-md hover:rounded-2xl transition-all"
        />
      </div>
      <div className="text-black bottom-10 bg-white -mt-6 z-40 rounded-full w-5/6 px-6 py-2">
        <h1 className="text-sm">$ {food.price}</h1>
        <h3 className="text-sm track-wider font-medium">{food.name}</h3>
      </div>
    </div>
  )
}
