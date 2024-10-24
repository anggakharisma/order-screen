"use client"
import { Order } from "@/type";
import { useQuery } from "@tanstack/react-query"
import { headers } from "next/dist/client/components/headers"

export default function Kitchen() {
  const { data, status, isLoading, error, isError } = useQuery<{ data: Order[] }>({
    queryKey: ['order-list'],
    refetchInterval: 5000,
    queryFn: async () => {
      const orderReq = await fetch(`${process.env.NEXT_PUBLIC_API_URL}v1/orders/`, {
        headers: new Headers({
          'Accept': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_API_TOKEN
        })
      });
      if (!orderReq.ok) {
        throw new Error(JSON.stringify(await orderReq.json()))
      }

      return await orderReq.json()
    }
  })

  console.log(data)

  return (
    <div className="w-4/5 px-20 mb-24">
      {
        status === "success" &&
        <div>
          {
            data.data.map(item => {
              return (
                <div key={item.ID}>
                  <h1>{item.name}</h1>
                  <h1>{item.order_status}</h1>
                  <h1>{item.CreatedAt}</h1>
                  <h1>{item.UpdatedAt}</h1>
                  <pre>
                    <code className="language-javascript">
                      <p>{JSON.stringify(item.order_items)}</p>
                    </code>
                  </pre>
                </div>
              )
            })
          }

        </div>
      }
      <h1>Kitchen</h1>
    </div>
  )

}
