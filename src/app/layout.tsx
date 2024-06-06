import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Dropdown } from 'antd';

import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route';
import { Providers } from "./Providers";
import SessionGuard from '@/components/SessionGuard'
import { Sidebar } from '@/components/Sidebar';
import { SUPERVISOR } from '@/utils/fhir-utils';
import Logout from '@/components/Logout';

import "./globals.css";


export const metadata: Metadata = {
  title: "Aarogyam dashboard",
  description: "Aarogyam dashboard",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <Providers>
          <SessionGuard>
            <div className="flex flex-1">
              {session?.userType === SUPERVISOR && <Sidebar />}
              <div className="flex-1">
                <header className="bg-white border-b border-gray-100">
                  <nav className="mx-auto flex items-center justify-between p-6 md:px-[60px] py-4" aria-label="Global">
                    <div className="flex lg:flex-1">
                      <Link href={'/'}>
                        {session?.userType !== SUPERVISOR && <div className="flex lg:flex-1">
                          <Image
                            height={32}
                            width={32}
                            className={`h-[32px] w-[32px] object-cover`}
                            src={'/images/logo.svg'}
                            alt={"Logo"}
                          />
                          <span className="text-2xl font-medium text-app_primary ml-6">Aarogya Aarohan</span>
                        </div>}
                      </Link>
                    </div>
                    <div className="flex flex-1 justify-end">
                      {session &&
                        <Dropdown menu={{
                          items: [
                            {
                              key: '1',
                              label: (
                                <Logout />
                              ),
                            },
                          ]
                        }} placement="bottomRight" arrow>
                          {
                            session?.user?.image
                              ? <Image
                                height={32}
                                width={32}
                                className={`bg-gray-100 h-[32px] w-[32px] rounded-full object-cover`}
                                src={session.user.image ?? ''}
                                alt={"Profile"}
                              />
                              : <div className="bg-gray-100 h-[32px] w-[32px] rounded-full object-cover text-center p-1 cursor-pointer" >
                                {session.user?.name?.charAt(0)}
                              </div>
                          }
                        </Dropdown>}
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
