import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

const Modal = ({ children, isVisible, okFunction, cancelFunction }: { children: React.ReactNode, isVisible: boolean, okFunction: () => void, cancelFunction: () => void }) => {
  return (
    <div className={`${isVisible ? "block" : "hidden"} z-50 border-gray-100 border-[1px] block rounded-lg bg-white fixed top-1/4 left-[40%] -translate-x-1/2 py-4 px-8`}>
      {children}
      <div className="flex justify-center gap-8 mt-2">
        <button onClick={okFunction} className="bg-green-600 p-6 justify-center align-middle items-center gap-2 rounded-lg py-1 flex">Yes <CheckIcon width={18} /></button>
        <button onClick={cancelFunction} className="bg-red-600 p-6 justify-center align-middle items-center gap-2 rounded-lg py-1 flex">No <XMarkIcon width={18} /></button>
      </div>
    </div>
  )
}


export default Modal;
