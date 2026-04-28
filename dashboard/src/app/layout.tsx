import Shell from "@/components/organisms/Shell";
import { Outfit } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const outfit = Outfit({ subsets: ['latin'] })

export const metadata = {
  title: "Autobar Dashboard",
  description: "Dashboard is a tool used for managing and controlling all things Autobar.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
