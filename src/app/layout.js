import "./globals.css";
import Topbar from "@/components/topbar";
import Footer from "@/components/footer";
import PWASetup from "./pwa-setup";
import { Toaster } from "@/components/ui/toaster";


export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        {/* <meta name="theme-color" content="#000000" /> */}
        <link rel="apple-touch-icon" href="/android-chrome-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={` antialiased  flex flex-col h-screen`}>
        <PWASetup />
        <Topbar />
        <main className="flex-[20] flex items-center justify-center w-full">
          {children}
        <Toaster/>
        </main>
        <Footer />
      </body>
    </html>
  );
}
