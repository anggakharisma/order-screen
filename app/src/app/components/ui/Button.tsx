import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
}

export default function Button(props: ButtonProps) {
  return <button {...props} className="bg-black text-white px-2">{props.children}</button>
}

export function OkButton(props: ButtonProps) {
  return <button {...props} className="bg-black text-white px-2">{props.children}</button>
}

export function CancelButton(props: ButtonProps) {
  return <button {...props} className="bg-black text-white px-2">{props.children}</button>
}
