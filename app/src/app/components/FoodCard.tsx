import { Food } from "@/type";
import Image from "next/image";

type FoodCardProps = {
  food: Food;
  addOrderItem: (food: Food) => void
}


export default function FoodCard({ food, addOrderItem }: FoodCardProps) {
  return (
    <div className="flex h-4/6 flex-col" onClick={() => addOrderItem(food)}>
      <div className="rounded-full max-h-64 hover:scale-110 transition-all hover:cursor-pointer">
        <Image
          src={`http://localhost:3232/${food.image}` || `/images/food01.jpg`}
          alt="desc"
          width="0"
          height="120"
          sizes="100vw"
          className="w-full h-full object-cover rounded-md hover:rounded-2xl transition-all"
        />
      </div>
      <div className="text-black bottom-10 bg-white -mt-6 z-40 rounded-full w-4/6 px-6 py-2 border-solid border-black border-[1px]">
        <h1 className="text-xs">$ {food.price}</h1>
        <h3 className="text-xs font-bold">{food.name}</h3>
      </div>
    </div>
  )
}
