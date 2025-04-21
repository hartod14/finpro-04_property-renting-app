'use client';

import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import DefaultImage from '@/../public/default_avatar.jpg';
import Image from 'next/image';
import { FaLock, FaSignOutAlt, FaUser } from 'react-icons/fa';
type Props = {
  children: React.ReactNode;
};

export default function TenantSidebar({ children }: Props) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Tenant Panel');
  const { data: session } = useSession();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const menus = [
    // { href: '/user/booking', icon: <FaShoppingBag />, label: 'My Booking' },
    { href: '/tenant/account', icon: <FaUser />, label: 'Account' },
    { href: '/tenant/password', icon: <FaLock />, label: 'Password' },
    // You can add more menu items here in the future
  ];

  useEffect(() => {
    const currentMenu = menus.find((menu) => menu.href == pathname);

    if (currentMenu) {
      setActiveMenu(currentMenu.label);
    }
  }, [pathname]);

  return (
    <div>
      <div>
        {/* Sidebar */}
        <div
          className={`fixed pt-24 md:pt-10 top-0 left-0 h-screen bg-gray-800 text-white w-64 p-5 transition-transform transform overflow-y-auto ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 md:w-64`}
        >
          <Image
            src={'/logo_white.png'}
            width={360}
            height={120}
            alt=""
            className="mx-auto w-[160px] mb-8"
          />
          <nav>
            <ul>
              <li className="text-sm">
                <Link
                  href={'/'}
                  className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded mb-3"
                >
                  <svg
                    className="w-6 h-6 text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 12h14M5 12l4-4m-4 4 4 4"
                    />
                  </svg>
                  <span className="text-lg">Homepage</span>
                </Link>
              </li>
            </ul>
            <ul>
              {menus.map((menu) => (
                <li key={menu.href} className="cursor-pointer mb-2 text-sm">
                  <Link
                    href={menu.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded ${
                      activeMenu == menu.label
                        ? 'bg-gray-700'
                        : 'hover:bg-gray-700'
                    }`}
                  >
                    <span className="mr-1">{menu.icon}</span>
                    <span className="">{menu.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={'/'}
              onClick={() => signOut()}
              className="flex items-center gap-2 text-red-500 p-2 rounded my-3 text-sm"
            >
              <FaSignOutAlt />
              <p>Keluar</p>
            </Link>
          </nav>
        </div>

        {/* Topbar */}
        <div
          className={`flex flex-col flex-1 min-h-screen transition-all overflow-auto ${isOpen ? 'ml-64' : 'ml-0 md:ml-64'}`}
        >
          <div
            className="z-30 fixed md:left-64 top-0 left-0 flex items-center justify-between bg-gray-900 text-white p-4"
            style={{ width: '-webkit-fill-available' }}
          >
            <button
              className="md:hidden p-2 rounded bg-gray-700"
              onClick={() => setIsOpen(!isOpen)}
            >
              ☰
            </button>
            <h1 className="text-xl font-bold">{activeMenu}</h1>

            {/* Profile Button */}
            <div className="relative">
              <div
                className="cursor-pointer flex items-center p-2 gap-2 bg-gray-800 rounded"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <p>{session?.user.name || 'User'}</p>
                <Image
                  width={48}
                  height={48}
                  src={session?.user.profile_picture || DefaultImage}
                  className="w-8 h-8 rounded-full"
                  alt=""
                />
              </div>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-900 shadow-lg rounded-lg overflow-hidden">
                  <div className="p-4 flex items-center">
                    <Image
                      width={48}
                      height={48}
                      src={session?.user.profile_picture || DefaultImage}
                      alt=""
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="ml-3">
                      <p className="font-semibold">
                        {session?.user?.name || 'User'}
                      </p>
                    </div>
                  </div>
                  <div className="border-t">
                    <Link
                      href={'/'}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                      onClick={() => signOut()}
                    >
                      Sign Out
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Page Content */}
          <div className="px-8 pt-28 ">{children}</div>
        </div>
      </div>
    </div>
  );
}
