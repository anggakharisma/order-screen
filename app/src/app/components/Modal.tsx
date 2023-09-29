import { ReactNode, forwardRef } from "react";

const Modal = forwardRef<HTMLInputElement, { children: ReactNode }>((props: { children: ReactNode }, ref) => {
  const { children } = props;

  return (
    <div className="dark:bg-black bg-white fixed top-0 left-0 bottom-0 right-0 flex justify-center items-center align-middle bg-black z-50 bg-opacity-60">
      <div ref={ref} className="bg-white p-4 mx-24">
        {children}
      </div>
    </div>
  )
});

export default Modal;
// export default function Modal(props: { children: React.ReactNode, closeModal?: () => void }): ReactNode {
//   const { children } = props;

//   return (
//     <div className="fixed top-0 left-0 bottom-0 right-0 flex justify-center items-center align-middle bg-black z-50 bg-opacity-60">
//       <div className="bg-white p-4 mx-24">
//         {children}
//       </div>
//     </div>
//   )
// }
