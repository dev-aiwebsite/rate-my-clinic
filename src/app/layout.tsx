import { PrimeReactProvider } from 'primereact/api';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

import { Poppins } from 'next/font/google';

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

export default function RootLayout({children,pageProps}: Readonly<{children: React.ReactNode;}>) {
  return (
    <PrimeReactProvider>
    <html lang="en">
      <body className={`${poppins.className}`}>
        {children}
        </body>
    </html>
    </PrimeReactProvider>
  );
}




// export default function MyApp({ Component, pageProps }) {
//     return (
//         <PrimeReactProvider>
//             <Component {...pageProps} />
//         </PrimeReactProvider>
//     );
// }