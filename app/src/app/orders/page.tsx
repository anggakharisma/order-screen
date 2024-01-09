"use client";
import { usdCurrency } from "@/config/currency";
import { ChangeQuantity, Food, OrderItemRequest, OrderRequest, UserOrderItem } from "@/type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createHash } from "crypto";
import { useEffect, useRef, useState } from "react";
import { useOnClickOutside } from 'usehooks-ts';
import Modal from "../components/Modal";
import Foods from "../components/Orders/Foods";
import UserOrder from "../components/Orders/UserOrder";
import Toast from "../components/Toast";

function Orders() {
    const getFoods = async () => {
        try {
            const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}v1/foods/`).then(res => res.json());
            return data;
        } catch (e) {
            console.log(e);
        }
    }
    const { isLoading, data } = useQuery<{ data: Food[] }>(["foods"], getFoods);
    const [newOrderItems, setNewOrderItems] = useState<UserOrderItem[]>(JSON.parse(window.localStorage.getItem("newOrderItems") || "[]"));
    const [customerName, setCustomerName] = useState<string>("");
    const [showPrompt, setShowPrompt] = useState(false);
    const [currentFood, setCurrentFood] = useState<Food>();
    const [totalOrder, setTotalOrder] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const modalRef = useRef() as React.MutableRefObject<HTMLInputElement>;

    useOnClickOutside(modalRef, () => setIsModalOpen(false));

    useEffect(() => {
        let currentTotal = 0;
        newOrderItems.map(item => {
            currentTotal += item.amount * item.food.price;
        });
        setTotalOrder(currentTotal);

        window.localStorage.setItem("newOrderItems", JSON.stringify(newOrderItems));
    }, [newOrderItems, modalRef]);

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

    const removeOrder = (hash: string) => {
        setNewOrderItems(newOrderItems.filter(item => item.hash != hash));
    }

    const orderMutation = useMutation({
        mutationFn: async () => {
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

            return fetch(`${process.env.NEXT_PUBLIC_API_URL}v1/orders/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(orders)
            }).then(response => response.json())
        }
    });

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
        <div className="w-4/5 px-20 mb-24">
            <Modal showModal={isModalOpen} ref={modalRef}>
                <h1 className="text-xl text-black font-bold">Confirm your order</h1>
                <p className="dark:text-black">List all orders</p>
                {
                    newOrderItems.map(item => {
                        return <p className="dark:text-black" key={item.hash}>{item.food.name}</p>
                    })
                }
            </Modal>

            <Toast
                isVisible={showPrompt}
                okFunction={() => {
                    addOrderItem(currentFood!);
                    setShowPrompt(false);
                }}
                cancelFunction={() => setShowPrompt(false)}>
                <h2 className="text-xl mb-4 tracking-tighter text-black text-center">Add this item?</h2>
            </Toast>
            <div className="w-full">
                <h1 className="text-3xl font-bold">Hello, Good {currentHoursGreeting()}</h1>
                <h3>Order Here</h3>
                {
                    isLoading ? <h3>Loading</h3> :
                        <Foods
                            data={data!.data}
                            setCurrent={(food) => {
                                if (showPrompt) return;
                                setShowPrompt(true);
                                setCurrentFood(food);
                            }}
                            isLoading={isLoading} />
                }
            </div>
            <div className="bg-white w-64 h-full fixed right-0 bottom-0 p-6 overflow-y-scroll py-12">
                <UserOrder removeOrder={removeOrder} changeQuantity={changeQuantity} newOrderItems={newOrderItems} />
                <button onClick={() => { setIsModalOpen(true) }} className="bg-red-500 px-4 py-2 rounded-full fixed bottom-4 right-16 text-white text-center text-md">Total: {usdCurrency.format(totalOrder)}</button>
            </div>
            <div className="flex justify-around w-full bg-red-900">
                <div>
                </div>
                <div>
                </div>
            </div>
        </div>
    )
}

export default Orders;
