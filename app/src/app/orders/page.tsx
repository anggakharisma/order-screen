import { Food } from "@/type"
import FoodCard from "../components/FoodCard";
import { Suspense } from "react";

export default async function Orders() {
  const foods: Food[] = await getFoods();

  return (
    <div className="w-4/5 flex px-20 mb-24">
      <div className=" elf-start">
        <h1 className="text-3xl font-bold">Hello good morning,</h1>
        <h3>Take yosur order here</h3>
        <Suspense fallback={<h1>Loading</h1>}>
          <div className="grid grid-cols-3 mt-8 gap-12">
            {
              foods.map(food => <FoodCard food={food} key={food.ID}></FoodCard>)
            }
          </div>
        </Suspense>
      </div>
    </div >
  )
}

async function getFoods() {
  const res = await fetch(`http://localhost:3232/v1/foods`);
  const data = await res.json();
  return data.data
}

