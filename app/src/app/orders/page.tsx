"use client";
import { Food, NewOrderItem } from "@/type";
import FoodCard from "../components/FoodCard";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { createHash } from "crypto";


export default function Orders() {
  const { isLoading, error, data } = useQuery(["foods"], () => fetch(`${process.env.NEXT_PUBLIC_API_URL}/foods/`).then(res => res.json()));
  const [newOrderItems, setNewOrderItems] = useState<NewOrderItem[]>([]);

  const addOrderItem = (food: Food) => {
    const hash = createHash("md5").update(String(food.ID) + food.name).digest("hex");

    const orderItem: NewOrderItem = {
      hash: hash,
      food: food,
      amount: 1
    }

    const foodExist = newOrderItems.some(orderItem => orderItem.hash === hash);
    if (!foodExist) {
      setNewOrderItems([...newOrderItems, orderItem]);
    } else {
      const orderItems = newOrderItems.map(orderItem => orderItem.hash === hash ? { ...orderItem, amount: orderItem.amount += 1 } : orderItem);
      setNewOrderItems(orderItems);
    }
    console.log(newOrderItems);
  }

  return (
    <div className="w-4/5 flex px-20 mb-24">
      <div className="self-start">
        <h1 className="text-3xl font-bold">Halo, Selamat Pagi</h1>
        <h3>Order disini</h3>
        {
          !isLoading ?
            <div className="grid grid-cols-3 mt-8 gap-12">
              {
                data?.data.map((food: Food) => <FoodCard addOrderItem={addOrderItem} food={food} key={food.ID}></FoodCard>)
              }
            </div>
            : <h1>Loading...</h1>
        }
      </div>
      <div id="order" className="bg-white w-[20vw] h-full fixed right-0 bottom-0 p-6 overflow-y-scroll py-56">
        <p className="text-black font-semibold mb-6">Order anda</p>
        <div>
          {
            newOrderItems.map((item, id) => <h1 key={id} className="text-black">{item.amount}</h1>)
          }
        </div>
      </div>
    </div>
  )
}
