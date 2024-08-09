'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from "next-auth/react";
import { groupBy } from 'lodash';

import { SUPERVISOR_USER_TYPE_CODE, SITE_COORDINATOR_USER_TYPE_CODE, SITE_ADMIN_TYPE_CODE } from '@/utils/fhir-utils';

interface Route {
  group: string;
  label: string;
  path?: string;
  userTypes?: string[];
}

const ROUTES: Route[] = [
  { group: 'User Management', label: 'Users', path: '/admin/users', userTypes: [SITE_COORDINATOR_USER_TYPE_CODE] },
  { group: 'User Management', label: 'User groups', path: '/admin/user-groups', userTypes: [SITE_COORDINATOR_USER_TYPE_CODE] },
  // { group: 'User Management', label: 'User roles', path: '/admin/user-roles', userTypes: [SITE_COORDINATOR_USER_TYPE_CODE] },
  { group: 'Reports & Summary', label: 'Reports', path: '/admin/reports', userTypes: [SITE_COORDINATOR_USER_TYPE_CODE, SUPERVISOR_USER_TYPE_CODE, SITE_ADMIN_TYPE_CODE] },
  { group: 'Reports & Summary', label: 'FLW performance', path: '/admin/flw-performance', userTypes: [SITE_COORDINATOR_USER_TYPE_CODE] },
]

const Sidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  const filteredRoutes = ROUTES.filter(r => session?.userType && r.userTypes?.includes(session.userType))

  return (
    <nav className="flex w-[256px] min-h-[calc(100vh-65px)] bg-gray-0 flex-col gap-3 px-5 py-3 text-base font-normal text-gray-900 border-r border-gray-100">
      {Object.entries(groupBy(filteredRoutes, 'group'))
        .map(([group, routes], i) => {
          return <div className="relative block w-full" key={i}>
            <div className={"flex items-center w-full px-2"}>
              <p className="block mr-auto text-sm text-gray-600 font-normal leading-relaxed">
                {group}
              </p>
            </div>
            {routes?.length && <div className="overflow-hidden">
              <nav className="flex w-full flex-col">
                {routes.map((route: Route) => {
                  const activeClass = pathname.startsWith(route?.path ?? '')
                    ? 'bg-primary-10'
                    : '';
                  return <Link href={route?.path ?? ''} key={route.label}>
                    <p
                      className={"flex items-center w-full px-2 py-1 text-start text-base font-normal text-gray-900 hover:bg-primary-10 focus:bg-primary-10 focus:text-gray-50 " + activeClass}>
                      {route.label}
                    </p>
                  </Link>
                })}
              </nav>
            </div>}
          </div>
        })}
    </nav>
  );
};

export { Sidebar };
