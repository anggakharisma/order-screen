"use client";
import { usdCurrency } from "@/config/currency";
import { ChangeQuantity, Food, OrderItemRequest, OrderRequest, UserOrderItem } from "@/type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createHash } from "crypto";
import { useEffect, useRef, useState } from "react";
import { useOnClickOutside } from 'usehooks-ts';
import Modal from "@/app/components/Modal";
import Foods from "@/app/components/Orders/Foods";
import UserOrder from "@/app/components/Orders/UserOrder";
import Prompt from "@/app/components/Prompt";

function Orders() {
    const getFoods = async () => {
        try {
            const foodReq = await fetch(`${process.env.NEXT_PUBLIC_API_URL}v1/foods/`, {
                headers: new Headers({
                    'Accept': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_API_TOKEN
                })
            });
            const data = foodReq.json();
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
            {
                // order sidebar section
            }
            <Modal closeModal={() => setIsModalOpen(false)} showModal={isModalOpen} ref={modalRef}>
                <h1 className="text-3xl text-black font-bold">CONFIRM ORDER</h1>
                <p className="dark:text-black">List all orders</p>
                <div>
                    {
                        newOrderItems.map(item => {
                            return (
                                <div key={item.hash}>
                                    <p className="dark:text-black" key={item.hash}>{item.food.name} {item.amount} {item.food.price}</p>
                                </div>
                            );
                        })
                    }

                    <p className="text-black">{totalOrder}</p>
                </div>
                <form className="mt-4 flex flex-col" onClick={(e) => {
                    e.preventDefault()
                }}>
                    <div className="flex flex-col">
                        <label className="dark:text-black mr-4 font-bold">Your name</label>
                        <input required className="focus:outline-none w-full focus:border-red-400 border-gray-400 border-[1px] bg-white dark:text-black mt-2 rounded-lg" type="text" placeholder="Your name" />
                    </div>
                    <button className="dark:bg-red-600 text-white font-bold px-4 py-2 rounded-lg mt-4">Make order</button>
                </form>
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
                <button onClick={() => { setIsModalOpen(true) }} className="bg-red-600 px-4 py-2 rounded-full fixed bottom-4 right-16 text-white text-center text-md">Total: {usdCurrency.format(totalOrder)}</button>
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
