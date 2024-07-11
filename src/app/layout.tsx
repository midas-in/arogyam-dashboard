import type { Metadata } from "next";
import type { Viewport } from 'next'
import Image from "next/image";
import Link from "next/link";
import { Dropdown } from 'antd';

import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/authOptions';
import { Providers } from "./Providers";
import SessionGuard from '@/components/SessionGuard'
import { Sidebar } from '@/components/Sidebar';
import { SUPERVISOR_USER_TYPE_CODE, SITE_COORDINATOR_USER_TYPE_CODE, SITE_ADMIN_TYPE_CODE, } from '@/utils/fhir-utils';
import Logout from '@/components/Logout';

import "./globals.css";


export const metadata: Metadata = {
  title: "Aarogyam dashboard",
  description: "Aarogyam dashboard",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <Providers session={session}>
          <SessionGuard>
            <header className="bg-white border-b border-gray-100">
              <nav className="mx-auto flex items-center justify-between p-6 md:px-9 py-4" aria-label="Global">
                <div className="flex lg:flex-1">
                  <Link href={'/'}>
                    <div className="flex lg:flex-1">
                      <Image
                        height={32}
                        width={32}
                        className={`h-[32px] w-[32px] object-cover`}
                        src={'/dashboard/images/logo.svg'}
                        alt={"Logo"}
                      />
                      <span className="text-2xl font-medium text-primary-400 ml-6">Aarogya Aarohan</span>
                    </div>
                  </Link>
                </div>
                <div className="flex flex-1 justify-end">
                  {session &&
                    <Dropdown menu={{
                      items: [
                        {
                          key: '1',
                          label: <div className="text-left py-1">
                            <p className="text-gray-600 font-base">{session.user?.email}</p>
                          </div>,
                          disabled: true,
                        },
                        {
                          type: 'divider',
                        },
                        {
                          key: '2',
                          label: (
                            <Logout />
                          ),
                        },
                      ]
                    }} placement="bottomRight" arrow >
                      {
                        session?.user?.image
                          ? <Image
                            height={32}
                            width={32}
                            className={`bg-gray-100 h-[32px] w-[32px] rounded-full object-cover`}
                            src={session.user.image ?? ''}
                            alt={"Profile"}
                          />
                          : <div className="bg-gray-100 text-gray-900 h-[32px] w-[32px] rounded-full object-cover text-center p-1 cursor-pointer" >
                            {session.user?.name?.charAt(0)}
                          </div>
                      }
                    </Dropdown>}
                </div>
              </nav>
            </header>
            {session?.userType && [SUPERVISOR_USER_TYPE_CODE, SITE_COORDINATOR_USER_TYPE_CODE, SITE_ADMIN_TYPE_CODE].includes(session.userType)
              ? <div className="flex flex-1">
                <Sidebar />
                <div className="p-5 bg-gray-25 w-full min-h-[calc(100vh-65px)] justify-center flex">
                  {children}
                </div>
              </div>
              : children}
          </SessionGuard>
        </Providers>
      </body>
    </html>
  );
}
