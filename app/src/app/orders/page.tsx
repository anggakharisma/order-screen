import FoodCard from "../components/FoodCard";

export default function Orders() {
  return (
    <div className="w-4/5 flex px-20">
      <div className=" elf-start">
        <h1 className="text-3xl font-bold">Hello good morning,</h1>
        <h3>Take your order here</h3>

        <div className="grid grid-cols-3 mt-8 gap-12">
          <FoodCard />
          <FoodCard />
          <FoodCard />

          <FoodCard />
          <FoodCard />
          <FoodCard />

          <FoodCard />
          <FoodCard />
          <FoodCard />
        </div>
      </div>
    </div>
  )
}
