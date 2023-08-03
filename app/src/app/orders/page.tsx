"use client";
import { Food, Order, OrderItemRequest, OrderRequest, UserOrderItem } from "@/type";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { createHash } from "crypto";
import Foods from "../components/Orders/Foods";
import OrderCard from "../components/OrderCard";

type FoodQuery = {
  data: Food[]
}

export default function Orders() {
  const { isLoading, error, data } = useQuery<FoodQuery>(["foods"], () => fetch(`${process.env.NEXT_PUBLIC_API_URL}v1/foods/`).then(res => res.json()));
  const [newOrderItems, setNewOrderItems] = useState<UserOrderItem[]>([]);
  const [totalOrder, setTotalOrder] = useState<number>(0);

  useEffect(() => {
    newOrderItems.map(item => {
      setTotalOrder(totalOrder + item.amount * item.food.price)
    })
  }, [newOrderItems]);

  const addOrderItem = (food: Food) => {
    const hash = createHash("md5").update(String(food.ID) + food.name).digest("hex");

    const orderItem: UserOrderItem = {
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
  }

  const createOrder = () => {
    const orderItems: OrderItemRequest[] = newOrderItems.map((newOrderItem: UserOrderItem) => {
      let orderItem: OrderItemRequest = {
        amount: newOrderItem.amount,
        food_id: newOrderItem.food.ID,
        order_item_extras: newOrderItem.order_item_extras
      }

      return orderItem;
    });

    const orders: OrderRequest = {
      name: "some input",
      order_items: orderItems,
    };

    //send to server
  };

  return (
    <div className="flex w-4/5 px-20 mb-24">
      <div className="self-start">
        <h1 className="text-3xl font-bold">Hello, Good Morning</h1>
        <h3>Order disini</h3>
        {
          isLoading && <h3>Loading</h3>
        }
        {
          data &&
          <Foods data={data.data} addOrderItem={addOrderItem} isLoading={isLoading} />
        }
      </div>
      <div id="order" className="bg-white w-[22vw] h-full fixed right-0 bottom-0 p-6 overflow-y-scroll py-12">
        <p className="mb-6 font-semibold text-black">Order anda</p>
        <div className="px-4">
          {
            newOrderItems.map((item, id) => <OrderCard key={id} orderItem={item} />)
          }
          <button onClick={createOrder} className="text-3xl text-white bg-black">Order {totalOrder}</button>
        </div>
      </div>
    </div>
  )
}
