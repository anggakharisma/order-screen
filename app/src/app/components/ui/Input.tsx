import { DetailedHTMLProps } from "react";

interface ButtonProps extends DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  variant?: 'primary' | 'danger'
}

export default function Input(props: ButtonProps) {
  return (
    <input required className="focus:outline-none focus:border-blue-500 focus:shadow-none focus:ring-0 w-full border-gray-400 border-[1px] bg-white dark:text-black mt-2 rounded-lg" {...props} />
  )
}
