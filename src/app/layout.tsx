import { PrimeReactProvider } from 'primereact/api';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";

const inter = Inter({ subsets: ["latin"] });

import { Poppins } from 'next/font/google';
import UsersContextProvider from './context/usersContext';
import { fetchData } from './lib/data';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

export const metadata: Metadata = {
  title: "Rate my clinic",
  description: "rate my clinic",
};



export default async function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  const Users = await fetchData()
const users = Users.map((user) => JSON.parse(JSON.stringify(user.toObject())));
  return (
    <PrimeReactProvider>
    <html lang="en">
      <body className={`${poppins.className}`}>
      <UsersContextProvider users={users}>{children}</UsersContextProvider>
        </body>
    </html>
    </PrimeReactProvider>
  );
}