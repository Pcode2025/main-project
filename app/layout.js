"use client"
import { Inter, Outfit, Poppins } from "next/font/google";
import "./globals.css";
import { UserCourseListContext } from "./_context/UserCourseListContext";
import { AuthProvider } from "./_context/AuthContext";
import { useState } from "react";
import { ThemeProvider } from 'next-themes'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
})

const outfit = Outfit({ subsets: ["latin"] });

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins'
})

function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {children}
    </ThemeProvider>
  )
}

export default function RootLayout({ children }) {
  const [userCourseList, setUserCourseList] = useState([]);

  return (
    <AuthProvider>
      <UserCourseListContext.Provider value={{ userCourseList, setUserCourseList }}>
        <html lang="en" suppressHydrationWarning>
          <body className={`${outfit.className} ${inter.variable} ${poppins.variable}`}>
            <Providers>
              {children}
            </Providers>
          </body>
        </html>
      </UserCourseListContext.Provider>
    </AuthProvider>
  );
}
