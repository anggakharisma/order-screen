import Image from "next/image";

export default function FoodCard() {
  return (
    <div className="flex h-4/6 flex-col">
      <div className="rounded-full max-h-64">
        <Image
          src="/images/food01.jpg"
          alt="desc"
          width="0"
          height="120"
          sizes="100vw"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <div className="text-[#141414] bottom-10 bg-[#F7F7F7] -mt-6 z-40 rounded-full w-4/6 px-6 py-2 border-solid border-black border-[1px]">
        <h1 className="text-xs">$ 19</h1>
        <h3 className="text-xs font-bold">Rendang Burger</h3>
      </div>
    </div>
  )
}
