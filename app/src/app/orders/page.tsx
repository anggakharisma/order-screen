"use client";
import { Food, OrderItemRequest, OrderRequest, UserOrderItem } from "@/type";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { createHash } from "crypto";
import Foods from "../components/Orders/Foods";
import OrderCard from "../components/OrderCard";

export default function Orders() {
  const { isLoading, error, data } = useQuery<{ data: Food[] }>(["foods"], () => fetch(`${process.env.NEXT_PUBLIC_API_URL}v1/foods/`).then(res => res.json()));
  const [newOrderItems, setNewOrderItems] = useState<UserOrderItem[]>(JSON.parse(window.localStorage.getItem("newOrderItems") || "[]"));
  const [customerName, setCustomerName] = useState<string>("");
  const [totalOrder, setTotalOrder] = useState<number>(0);

  useEffect(() => {
    let currentTotal = 0;
    newOrderItems.map(item => {
      currentTotal += item.amount * item.food.price;
    });
    setTotalOrder(currentTotal);

    window.localStorage.setItem("newOrderItems", JSON.stringify(newOrderItems));
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
        order_item_extras: newOrderItem.order_item_extras || []
      }

      return orderItem;
    });

    const orders: OrderRequest = {
      name: customerName,
      order_items: orderItems,
    };

    console.log(orders);

    // TODO: send to server
  };

  const changeQuantity = (actionType: string, orderItem: UserOrderItem) => {
    switch (actionType) {
      case "DECREASE": {
        if (orderItem.amount <= 1) {
          const orderItems = newOrderItems.filter(item => item.hash != orderItem.hash);
          setNewOrderItems(orderItems);
          return;
        }
        const orderItems = newOrderItems.map(item => item.hash === orderItem.hash ? { ...item, amount: --item.amount } : item);
        setNewOrderItems(orderItems);
        break;
      }
      case "INCREASE": {
        const orderItems = newOrderItems.map(item => item.hash === orderItem.hash ? { ...item, amount: ++item.amount } : item);
        setNewOrderItems(orderItems);
        break;
      }
    }
  }

  const currentHoursGreeting = (): string => {
    const currentHours = new Date().getHours();
    if (currentHours < 12) return "Pagi";
    else if (currentHours < 17 && currentHours >= 12) return "Siang"
    return "Malam";
  }

  return (
    <div className="flex w-4/5 px-20 mb-24">
      <div className="self-start">
        <h1 className="text-3xl font-bold">Halo, Selamat {currentHoursGreeting()}</h1>
        <h3>Order disini</h3>
        {
          isLoading ? <h3>Loading</h3> :
            <Foods data={data!.data} addOrderItem={addOrderItem} isLoading={isLoading} />
        }
      </div>
      <div id="order" className="bg-white w-[22vw] h-full fixed right-0 bottom-0 p-6 overflow-y-scroll py-12">
        <p className="mb-6 font-semibold text-black">Order anda</p>
        <div className="px-4">
          {
            newOrderItems.map((item, id) => <OrderCard changeQuantity={changeQuantity} key={id} orderItem={item} />).reverse()
          }
          <button onClick={createOrder} className="text-xl bg-red-800 text-white p-2">Total {totalOrder}</button>
        </div>
      </div>
    </div>
  )
}
