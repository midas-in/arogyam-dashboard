'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const ROUTES = [
  {
    label: 'User Management',
    subRoutes: [
      { label: 'Users', path: '/users' },
      { label: 'User groups', path: '/user-groups' },
      { label: 'User roles', path: '/user-roles' }
    ],
  },
  { label: 'Tasks', path: '/tasks' }
]
const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [openUserManagement, setOpenUserManagement] = useState<{ [key: number]: boolean }>({ 0: true });


  const onRouteClick = (index: number) => {
    if (ROUTES[index].subRoutes?.length) {
      setOpenUserManagement(prev => ({ ...prev, [index]: !prev[index] }))
    }
    else {
      router.push(ROUTES[index].path as string);
    }
  }

  return (
    <div
      className="relative flex w-full max-w-[20rem] flex-col bg-black bg-clip-border p-4 text-gray-300">
      <div className="p-4 mb-2">
        <Link href={'/'}>
          <h5 className="text-xl font-medium text-app_primary">Aarogya aarohan</h5>
        </Link>
      </div>
      <nav className="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-gray-300">
        {ROUTES.map((route, i) => {
          const activeClass = !route.subRoutes?.length && pathname == route.path
            ? 'bg-app_primary text-white'
            : '';
          return <div className="relative block w-full" key={i}>
            <div role="button"
              className={"flex items-center w-full p-0 leading-tight transition-all rounded-lg outline-none text-start text-gray-300 hover:bg-gray-500 hover:bg-opacity-80  focus:bg-gray-50 focus:bg-opacity-80 focus:text-gray-50 " + activeClass}>
              <button type="button"
                onClick={() => onRouteClick(i)}
                className="flex items-center justify-between w-full p-3 font-sans text-xl antialiased font-semibold leading-snug text-left transition-colors border-b-0 select-none border-b-gray-100 ">
                <p className="block mr-auto font-sans text-base antialiased font-normal leading-relaxed">
                  {route.label}
                </p>
                {route.subRoutes?.length && <span className="ml-4">
                  {openUserManagement[i]
                    ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5"
                      stroke="currentColor" aria-hidden="true" className="w-4 h-4 mx-auto transition-transform rotate-180">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"></path>
                    </svg>
                    : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5"
                      stroke="currentColor" aria-hidden="true" className="w-4 h-4 mx-auto transition-transform">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"></path>
                    </svg>}
                </span>}
              </button>
            </div>
            {openUserManagement[i] && route.subRoutes?.length && <div className="overflow-hidden">
              <div className="block w-full py-1 font-sans text-sm antialiased font-light leading-normal text-gray-300">
                <nav className="flex min-w-[240px] flex-col gap-1 p-0 font-sans text-base font-normal text-gray-300">
                  {route.subRoutes.map(subRoute => {
                    const activeClass = pathname.startsWith(subRoute.path)
                      ? 'bg-app_primary text-white'
                      : '';
                    return <Link href={subRoute.path} key={subRoute.label}>
                      <div role="button"
                        className={"flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-gray-500 hover:bg-opacity-80  focus:bg-gray-50 focus:bg-opacity-80 focus:text-gray-50 " + activeClass}>
                        <div className="grid mr-4 place-items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3"
                            stroke="currentColor" aria-hidden="true" className="w-5 h-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"></path>
                          </svg>
                        </div>
                        {subRoute.label}
                      </div>
                    </Link>
                  })}
                </nav>
              </div>
            </div>}
          </div>
        })}

      </nav>
    </div>
  );
};

export { Sidebar };
