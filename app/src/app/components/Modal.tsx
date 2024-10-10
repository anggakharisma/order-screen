import { ReactNode, forwardRef } from "react";

type ModalProps = {
	children: ReactNode;
	showModal: boolean;
	closeModal: () => void;
}
/* eslint-disable react/display-name */
const Modal = forwardRef<HTMLInputElement, ModalProps>(({ children, showModal, closeModal }: ModalProps, ref) => {
	return showModal && <div className="dark:bg-black dark:bg-opacity-80 fixed top-0 left-0 bottom-0 right-0 flex justify-center items-center align-middle bg-black z-50">
		<div ref={ref} className="bg-white w-full lg:w-1/2 px-10 py-8 mx-24 rounded-md relative">
			{children}
			<p onClick={closeModal} className="text-2xl hover:cursor-pointer hover:scale-150 transition-transform absolute top-2 right-4 text-black">x</p>
		</div>
	</div>
});

export default Modal;
