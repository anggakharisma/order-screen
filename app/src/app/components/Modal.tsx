
export default function Modal(props: { children: React.ReactNode, }) {
  const { children } = props;

  return (
    <div className="fixed top-0 left-0 bottom-0 right-0 flex justify-center items-center align-middle bg-black z-50 bg-opacity-60">
      <div className="bg-white p-4">
        <p className="text-black">{children}</p>
      </div>
    </div>
  )
}
