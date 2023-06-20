import Logo from './components/logo'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Spice Republic',
  description: 'Spice Republic',
}

const bodyClass = inter.className + " dark:bg-black bg-white text-white dark:text-white min-h-screen"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={bodyClass}>
        <div className="flex relative">
          <div className="flex px-20 w-4/5 justify-between items-center align-middle">
            <Logo />
            <div className="relative flex justify-center align-middle items-center">
              <p className="mr-4">ID</p>
              <div>
                <div className="w-6 h-3 rounded-t-full bg-red-600">
                </div>
                <div className="w-6 h-3 rounded-b-full bg-white">
                </div>
              </div>
            </div>
          </div>

          <div id="order" className="bg-white w-[20vw] h-full fixed right-0 bottom-0 p-6 overflow-y-scroll py-56">
            <p className="text-black font-semibold mb-6">Your order</p>
          </div>
        </div>
        {children}
      </body>
    </html>
  )
}
