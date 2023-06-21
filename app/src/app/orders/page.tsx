"use client";
import { Food } from "@/type";
import FoodCard from "../components/FoodCard";
import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";

export default function Orders() {
  const { isLoading, error, data } = useQuery(["foods"], () => fetch(`${process.env.NEXT_PUBLIC_API_URL}/foods/`).then(res => res.json()));



  return (
    <div className="w-4/5 flex px-20 mb-24">
      <div className="self-start">
        <h1 className="text-3xl font-bold">Halo, Selamat Pagi</h1>
        <h3>Order disini</h3>
        {error && <h1>Something wrong</h1>}
        {
          !isLoading ?
            <div className="grid grid-cols-3 mt-8 gap-12">
              {
                data?.data.map((food: Food) => <FoodCard food={food} key={food.ID}></FoodCard>)
              }
            </div>
            : <h1>Loading...</h1>
        }
      </div>
    </div >
  )
}
