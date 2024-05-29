import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Providers } from "./Providers";
import SessionGuard from '@/components/SessionGuard'
import { Sidebar } from '@/components/Sidebar';

import "./globals.css";


export const metadata: Metadata = {
  title: "Readers app",
  description: "Readers app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body>
        <Providers>
          <SessionGuard>
            <div className="flex flex-1">
              {/* <Sidebar /> */}
              <div className="flex-1">
                <header className="bg-white border-b border-gray-100">
                  <nav className="mx-auto flex items-center justify-between p-6 md:px-[60px] py-4" aria-label="Global">
                    <div className="flex lg:flex-1">
                      <Link href={'/'}>
                        <div className="flex lg:flex-1">
                          <Image
                            height={32}
                            width={32}
                            className={`h-[32px] w-[32px] object-cover`}
                            src={'/images/logo.svg'}
                            alt={"Logo"}
                          />
                          <span className="text-2xl font-medium text-app_primary ml-6">Aarogya Aarohan</span>
                        </div>
                      </Link>
                    </div>
                    <div className="flex flex-1 justify-end">
                      <Image
                        height={32}
                        width={32}
                        className={`bg-gray-100 h-[32px] w-[32px] rounded-full object-cover`}
                        src={"https://tailwindui.com/img/logos/mark.svg"}
                        alt={"Profile"}
                      />
                    </div>
                  </nav>
                </header>
                {children}
              </div>
            </div>
          </SessionGuard>
        </Providers>
      </body>
    </html>
  );
}
