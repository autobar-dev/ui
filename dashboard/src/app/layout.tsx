import Shell from "@/components/organisms/Shell";
import { Outfit } from "next/font/google";
import "@mantine/core/styles.css";
import "./globals.css";
import Providers from "./providers";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";

const outfit = Outfit({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700']
})

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={outfit.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
