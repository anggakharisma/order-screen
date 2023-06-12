import Logo from './components/logo'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Spice Republic',
  description: 'Spice Republic',
}

const bodyClass = inter.className + " dark:bg-gray-900 bg-white text-white dark:text-white"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={bodyClass}>
        <div className="flex">
          <div className="flex px-20 w-4/5 justify-between self-start items-center align-middle">
            <Logo />
            <p className="text-xl">O ID</p>
          </div>

          <div className="bg-white w-56 h-screen absolute right-0 top-0 p-6 overflow-y-scroll overflow-x-hidden">
            <div>
              <p className="text-black">Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam, maxime. Amet aliquam sit maxime ipsam adipisci saepe quaerat quis ab necessitatibus itaque! Perspiciatis necessitatibus suscipit eos quas maiores. Provident, nesciunt.</p>
            </div>
          </div>
        </div>
        {children}
      </body>
    </html>
  )
}
