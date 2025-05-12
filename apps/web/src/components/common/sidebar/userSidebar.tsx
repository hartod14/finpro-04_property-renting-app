'use client';

import Image from 'next/image';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaShoppingBag, FaUser, FaLock, FaSignOutAlt } from 'react-icons/fa';

export default function UserSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [screenSize, setScreenSize] = useState('desktop');

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width >= 768) {
        setScreenSize('desktop');
      } else if (width >= 480) {
        setScreenSize('tablet');
      } else {
        setScreenSize('mobile');
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleLogout = () => {
    // Handle logout
    signOut();
  };

  const menuItems = [
    { href: '/user/booking', icon: <FaShoppingBag />, label: 'My Booking' },
    { href: '/user/account', icon: <FaUser />, label: 'Account' },
    { href: '/user/password', icon: <FaLock />, label: 'Password' },
    // You can add more menu items here in the future
  ];

  return (
    <>
      {/* Mobile Menu Bar */}
      <div
        className={screenSize !== 'desktop' ? 'block w-full mb-4' : 'hidden'}
      >
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex w-full">
            {menuItems.slice(0, 3).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-1 flex-col items-center justify-center py-3 ${
                  pathname === item.href
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span
                  className={
                    screenSize === 'mobile' ? 'text-lg mb-1' : 'text-base mb-1'
                  }
                >
                  {item.icon}
                </span>
                <span
                  className={`text-sm ${screenSize === 'mobile' ? 'text-xs' : ''}`}
                >
                  {screenSize === 'mobile' && item.label.length > 8
                    ? item.label.split(' ')[0]
                    : item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className={screenSize === 'desktop' ? 'block' : 'hidden'}>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
                <Image
                  src={session?.user?.profile_picture || '/default_avatar.jpg'}
                  alt="Profile"
                  width={64}
                  height={64}
                  className="object-cover w-12 h-12"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/default_avatar.jpg';
                  }}
                />
              </div>
              <div>
                <h2 className="font-semibold text-black">
                  {session?.user?.name}
                </h2>
                <p className="text-gray-500 text-sm">{session?.user?.email}</p>
              </div>
            </div>
            <hr className="h-[1px] bg-gray-200 my-3" />
          </div>
          <nav>
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-3 rounded hover:bg-primary hover:text-white ${
                      pathname === item.href
                        ? 'bg-primary text-white'
                        : 'text-gray-700'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full p-3 text-red-500 rounded hover:bg-red-50"
                >
                  <FaSignOutAlt className="mr-3" />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
