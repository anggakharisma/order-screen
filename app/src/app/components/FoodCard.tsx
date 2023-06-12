import Image from "next/image";

export default function FoodCard() {
  return (
    <div>
      <Image src="/images/logo.svg" alt="Spice Republic logo" fill={true} style={{
        objectFit: "contain"
      }} />
    </div>
  )
}
