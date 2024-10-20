"use client";
import Modal from "@/app/components/Modal";
import Foods from "@/app/components/Orders/Foods";
import UserOrder from "@/app/components/Orders/UserOrder";
import Prompt from "@/app/components/Prompt";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import { usdCurrency } from "@/config/currency";
import { ChangeQuantity, Food, OrderItemRequest, OrderRequest, UserOrderItem } from "@/type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createHash } from "crypto";
import { useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";


type OrderModalProps = {
    newOrderItems: UserOrderItem[],
    setNewOrderItems: React.Dispatch<React.SetStateAction<UserOrderItem[]>>
    totalOrder: number,
    orderMutation: any,
    orderReady: boolean,
    setOrderReady: React.Dispatch<React.SetStateAction<boolean>>
}

const OrderModal = ({ newOrderItems, totalOrder, orderMutation, orderReady, setOrderReady, setNewOrderItems }: OrderModalProps) => {
    return (
        <>
            <h1 className="text-2xl mb-4 text-black font-bold">CONFIRM ORDER</h1>
            <div>
                <div className="mb-2 flex flex-col gap-2">
                    {
                        newOrderItems.map(item => {
                            return (
                                <div key={item.hash}>
                                    <div className="grid grid-cols-3 justify-center justify-self-center border-black border-b-[1px] pb-2">
                                        <p className="relative dark:text-black text-white w-full h-full font-medium before:w-10 before:h-10 before:bg-red-600">{item.food.name}</p>
                                        <p className="dark:text-black text-white justify-self-center">{usdCurrency.format(item.food.price)} x {item.amount}</p>
                                        <p className="dark:text-black text-white justify-self-end">{usdCurrency.format(item.food.price * item.amount)}</p>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>

                <p className="text-black text-md mt-2"><span className="font-bold">Total: </span>{usdCurrency.format(totalOrder)}</p>

            </div>
            <form className="mt-4 flex flex-col" onSubmit={(e: any) => {
                e.preventDefault()
                const formData = new FormData(e.target);
                let data: { [key: string]: string } = {}
                for (let [key, value] of formData.entries()) {
                    data[key] = `${value}`;
                    console.log(`${key}: ${value}`);
                }
                orderMutation.mutate(data)
                setNewOrderItems([])
            }}>
                <div className="flex flex-col">
                    <label className="dark:text-black mr-4 font-bold">Your name</label>
                    <Input name="customer-name" autoFocus required type="text" placeholder="Your name" />
                </div>
                <Button type="submit" variant="primary">Make order</Button>
            </form>

        </>
    )
}

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
        onSuccess: (data) => {
            setIsOrderReady(true)
            console.log(data)
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
                    "Content-Type": "application/json"
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
    const modalRef = useRef() as React.MutableRefObject<HTMLInputElement>;

    useOnClickOutside(modalRef, () => setIsModalOpen(false));

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
        <div className="w-4/5 px-20 mb-24">
            {
                // order sidebar section
            }
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
                <div className="flex flex-col fixed bottom-10">
                    <p className="text-white dark:text-black text-center text-md font-medium">Total: {usdCurrency.format(totalOrder)}</p>
                    {newOrderItems.length > 0 && <button onClick={() => {
                        setIsModalOpen(true)
                        setIsOrderReady(false)
                    }} className="text-black rounded-md dark:text-white px-4 py-2 bg-red-600 text-md">Make Order</button>}
                </div>
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
