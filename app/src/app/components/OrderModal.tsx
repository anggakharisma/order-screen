import { UserOrderItem } from "@/type"
import Input from "./ui/Input"
import Button from "./ui/Button"
import { usdCurrency } from "@/config/currency"

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
                }
                orderMutation.mutate(data)
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

export default OrderModal;

