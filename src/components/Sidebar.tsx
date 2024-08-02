'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from "next-auth/react";

import { SUPERVISOR_USER_TYPE_CODE, SITE_COORDINATOR_USER_TYPE_CODE, SITE_ADMIN_TYPE_CODE } from '@/utils/fhir-utils';

interface Route {
  label: string;
  path?: string;
  permissions?: string[];
  userTypes?: string[];
  subRoutes?: Route[];
}

const ROUTES: Route[] = [
  {
    label: 'User Management',
    subRoutes: [
      { label: 'Users', path: '/admin/users', permissions: ['VIEW_KEYCLOAK_USERS', 'FHIR_ALL_READ'] },
      { label: 'User groups', path: '/admin/user-groups', permissions: ['VIEW_KEYCLOAK_USERS', 'FHIR_ALL_READ'] },
      // { label: 'User roles', path: '/admin/user-roles', permissions: ['EDIT_KEYCLOAK_USERS', 'FHIR_ALL_WRITE'] }
    ],
    userTypes: [SITE_COORDINATOR_USER_TYPE_CODE]
  },
  {
    label: 'Reports & Summary',
    subRoutes: [
      { label: 'Reports', path: '/admin/reports', permissions: ['VIEW_KEYCLOAK_USERS', 'FHIR_ALL_READ'] },
    ],
    userTypes: [SITE_COORDINATOR_USER_TYPE_CODE, SUPERVISOR_USER_TYPE_CODE, SITE_ADMIN_TYPE_CODE]
  }
]

const Sidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav className="flex w-[256px] min-h-[calc(100vh-65px)] bg-gray-0 flex-col gap-3 px-5 py-3 text-base font-normal text-gray-900 border-r border-gray-100">
      {ROUTES
        .filter(r => session?.userType && r.userTypes?.includes(session.userType))
        .map((route, i) => {
          return <div className="relative block w-full" key={i}>
            <div className={"flex items-center w-full px-2"}>
              <p className="block mr-auto text-sm text-gray-600 font-normal leading-relaxed">
                {route.label}
              </p>
            </div>
            {route.subRoutes?.length && <div className="overflow-hidden">
              <nav className="flex w-full flex-col">
                {route.subRoutes.filter(sr => sr?.permissions && sr?.permissions.some(permission => session?.permissions?.includes(permission))).map((subRoute: Route) => {
                  const activeClass = pathname.startsWith(subRoute?.path ?? '')
                    ? 'bg-primary-10'
                    : '';
                  return <Link href={subRoute?.path ?? ''} key={subRoute.label}>
                    <p
                      className={"flex items-center w-full px-2 py-1 text-start text-base font-normal text-gray-900 hover:bg-primary-10 focus:bg-primary-10 focus:text-gray-50 " + activeClass}>
                      {subRoute.label}
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
