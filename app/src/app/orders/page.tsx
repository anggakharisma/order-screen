"use client";
import Modal from "@/app/components/Modal";
import Foods from "@/app/components/Orders/Foods";
import UserOrder from "@/app/components/Orders/UserOrder";
import Prompt from "@/app/components/Prompt";
import { usdCurrency } from "@/config/currency";
import { ChangeQuantity, Food, OrderItemRequest, OrderRequest, UserOrderItem } from "@/type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createHash } from "crypto";
import { useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import OrderModal from "../components/OrderModal";


function Orders() {
    const getFoods = async () => {
        try {
            const foodReq = await fetch(`${process.env.NEXT_PUBLIC_API_URL}v1/foods/`, {
                headers: new Headers({
                    'Accept': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_API_TOKEN
                })
            });
            if (!foodReq.ok) {
                throw new Error(JSON.stringify(await foodReq.json()))
            }

            const data = foodReq.json();
            return data;
        } catch (e: any) {
            console.log(e.message);
        }
    }

    const { isLoading, data, isError } = useQuery<{ data: Food[] }>(["foods"], getFoods);

    const orderMutation = useMutation({
        onError: (e) => {
            console.log(e)
        },
        onSuccess: () => {
            setIsOrderReady(true)
            setNewOrderItems([])
        },
        mutationFn: async (data: { [key: string]: string }) => {
            const orderItems: OrderItemRequest[] = newOrderItems.map((newOrderItem: UserOrderItem) => {
                let orderItem: OrderItemRequest = {
                    amount: newOrderItem.amount,
                    food_id: newOrderItem.food.ID,
                    order_item_extras: newOrderItem.order_item_extras || []
                }

                return orderItem;
            });

            const orders: OrderRequest = {
                name: data['customer-name'],
                order_items: orderItems,
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}v1/orders/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'x-api-key': process.env.NEXT_PUBLIC_API_TOKEN
                },
                body: JSON.stringify(orders)
            })

            if (!response.ok) {
                throw new Error(JSON.stringify(await response.json()))
            }

            return response.json()
        }
    })

    const [newOrderItems, setNewOrderItems] = useState<UserOrderItem[]>(JSON.parse(window.localStorage.getItem("newOrderItems") || "[]"));
    const [isOrderReady, setIsOrderReady] = useState(false)
    const [showPrompt, setShowPrompt] = useState(false);
    const [currentFood, setCurrentFood] = useState<Food>();
    const [totalOrder, setTotalOrder] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalMode, setModalMode] = useState<"ORDER" | "FOOD_DETAIL">("ORDER");
    const modalRef = useRef() as React.MutableRefObject<HTMLInputElement>;

    useOnClickOutside(modalRef, () => setIsModalOpen(false));

    useEffect(() => {
        setTotalOrder(newOrderItems.reduce((a, b) => a + b.food.price * b.amount, 0));

        window.localStorage.setItem("newOrderItems", JSON.stringify(newOrderItems));
    }, [newOrderItems]);

    const addOrderItem = (food: Food) => {
        const hash = createHash("md5").update(String(food.ID) + food.name).digest("hex");

        const orderItem: UserOrderItem = {
            hash: hash,
            food: food,
            amount: 1
        }

        setTotalOrder(totalOrder + food.price)

        const foodExist = newOrderItems.some(orderItem => orderItem.hash === hash);
        if (!foodExist) {
            setNewOrderItems([...newOrderItems, orderItem]);
        } else {
            const orderItems = newOrderItems.map(orderItem => orderItem.hash === hash ? { ...orderItem, amount: orderItem.amount += 1 } : orderItem);
            setNewOrderItems(orderItems);
        }
    }

    const removeOrder = (hash: string) => {
        setNewOrderItems(newOrderItems.filter(item => item.hash != hash));
    }


    const changeQuantity: ChangeQuantity = (actionType: string, orderItem: UserOrderItem) => {
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
        if (currentHours < 12) return "Morning";
        else if (currentHours < 17 && currentHours >= 12) return "Afteernoon"

        return "Afternoon";
    }

    return (
        <div className="w-4/5 px-20 mb-8">
            <Modal closeModal={() => setIsModalOpen(false)} showModal={isModalOpen} ref={modalRef}>
                {!isOrderReady ? <OrderModal setNewOrderItems={setNewOrderItems} setOrderReady={setIsOrderReady} orderReady={isOrderReady} newOrderItems={newOrderItems} orderMutation={orderMutation} totalOrder={totalOrder} /> : <p className="dark:text-black text-white">Order proccessed, dont forget take your ticket!</p>}
            </Modal>

            <Prompt
                isVisible={showPrompt}
                okFunction={() => {
                    addOrderItem(currentFood!);
                    setShowPrompt(false);
                }}
                cancelFunction={() => setShowPrompt(false)}>
                <h2 className="text-xl mb-4 tracking-tighter text-black text-center">Add this item?</h2>
            </Prompt>
            <div className="w-full">
                <h1 className="text-3xl font-bold">Hello, Good {currentHoursGreeting()}</h1>
                <h3>Order Here</h3>
                {
                    isError && <h3>There&lsquo;s a problem reaching the server, please contact employee</h3>
                }
                {
                    isLoading ? <h3>Loading</h3> :
                        <Foods
                            data={isError ? [] : data!.data}
                            setCurrent={(food) => {
                                if (showPrompt) return;
                                setShowPrompt(true);
                                setCurrentFood(food);
                            }}
                            isLoading={isLoading} />
                }
            </div>
            <div className="bg-white w-56 h-full flex justify-center align-middle fixed right-1 bottom-0 overflow-y-auto py-8 px-4">
                <UserOrder removeOrder={removeOrder} changeQuantity={changeQuantity} newOrderItems={newOrderItems} />
                <div className="flex flex-col fixed bottom-0 bg-white p-8">
                    <p className="text-white dark:text-black text-center text-md font-medium mb-2">Total: {usdCurrency.format(totalOrder)}</p>
                    {newOrderItems.length > 0 && <button onClick={() => {
                        setIsModalOpen(true)
                        setIsOrderReady(false)
                    }} className="text-black b-0 rounded-md dark:text-white px-4 py-2 bg-red-600 text-md">Make Order</button>}
                </div>
            </div>
        </div>
    )
}

export default Orders;
