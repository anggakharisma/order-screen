import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
type ToastProps = {
  children: React.ReactNode,
  isVisible: boolean,
  okFunction: () => void,
  cancelFunction: () => void
}

const Prompt = ({ children, isVisible, okFunction, cancelFunction }: ToastProps) => {
  return (
    <div className={`${isVisible ? "block" : "hidden"} z-50 border-gray-100 border-[1px] block rounded-lg bg-white fixed top-1/4 left-[40%] -translate-x-1/2 py-4 px-8`}>
      {children}
      <div className="flex justify-center gap-8 mt-2">
        <button onClick={okFunction} className="group bg-white border-green-500 border-solid border-2 p-4 text-green-500 justify-center align-middle items-center gap-2 rounded-lg py-1 flex font-bold hover:bg-green-500 hover:text-white transition-all">Yes <CheckIcon className='transition-all text-green-500 group-hover:text-white' width={18} /></button>
        <button onClick={cancelFunction} className="group bg-white border-red-500 border-solid border-2 p-6 justify-center align-middle items-center gap-2 rounded-lg py-1 flex text-red-500 hover:bg-red-500 hover:text-white">No <XMarkIcon className='transition-all text-red-500 group-hover:text-white' width={18} /></button>
      </div>
    </div>
  )
}


export default Prompt;
