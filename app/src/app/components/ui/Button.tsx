import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import clsx from 'clsx'

interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  variant?: 'primary' | 'danger'
}

export default function Button(props: ButtonProps) {
  return <button {...props} className={clsx(
    'text-white font-bold px-4 py-2 rounded-lg',
    {
      'dark:bg-red-600': props.variant === 'primary',
      'bg-black': !props.variant
    },
  )}>{props.children}</button>
}
