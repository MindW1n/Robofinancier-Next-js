import './globals.css'
import { Inter } from 'next/font/google'
import { getRandomBackground } from '@/utils/randomBackground/randomBackground'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {

    title: 'RoboFinancier',
    description: 'The app for managing your finances!',
}

export default async function RootLayout({ children }) {
    return (

        <html lang="en">
            <body className={ inter.className + " bg-cover" } style={{ backgroundImage: `url('/backgrounds/${ await getRandomBackground() }')` }}>
            <Providers>
                { children }
            </Providers>
            </body>
        </html>
    )
}
