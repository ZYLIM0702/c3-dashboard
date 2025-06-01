import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "C3 Dashboard",
  description: "Command & Control Center Dashboard"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <meta property="og:image" content="/logo-white.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="C3 Dashboard" />
        <meta property="og:description" content="Command & Control Center Dashboard" />
        {/* Google Maps API with visualization library for heatmaps */}
        <script
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDW0w95X7Pjbv715Stxz_Jvul4x4AxEilU&libraries=places,visualization&loading=async"
          defer
        />
        {/* MarkerClusterer for Google Maps */}
        <script src="https://unpkg.com/@googlemaps/markerclusterer/dist/index.min.js" defer />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
