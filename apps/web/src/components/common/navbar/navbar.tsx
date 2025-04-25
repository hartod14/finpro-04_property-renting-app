'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Button from '../button/button';
import Link from 'next/link';
import { FaUser } from 'react-icons/fa';
import { signOut, useSession } from 'next-auth/react';

type NavbarProps = {
  forceScrolled?: boolean;
};

export default function Navbar({ forceScrolled = false }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(forceScrolled);
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { data: session } = useSession();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (forceScrolled) {
        setIsScrolled(true);
        return;
      }

      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [forceScrolled]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav
      className={`fixed w-full px-6 md:px-16 py-4 flex items-center justify-between z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <Link href={'/'}>
        <Image
          src={isScrolled ? '/logo_primary.png' : '/logo_white.png'}
          width={396}
          height={218}
          style={{ width: '100px' }}
          alt="logo"
        />
      </Link>

      {/* Hamburger Button */}
      {!isOpen && (
        <div
          className="md:hidden cursor-pointer z-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div
            className={`w-6 h-1 my-1 ${isScrolled ? 'bg-primary2' : 'bg-white'}`}
          ></div>
          <div
            className={`w-6 h-1 my-1 ${isScrolled ? 'bg-primary2' : 'bg-white'}`}
          ></div>
          <div
            className={`w-6 h-1 my-1 ${isScrolled ? 'bg-primary2' : 'bg-white'}`}
          ></div>
        </div>
      )}

      {/* Full-screen Popup Navigation */}
      {isOpen && (
        <div className="fixed inset-0 bg-white z-40 transition-all duration-300">
          <button
            className="absolute top-6 right-6 text-4xl"
            onClick={() => setIsOpen(false)}
          >
            &times;
          </button>
          <div className="text-lg flex flex-col wrap items-start ms-6 mt-20 gap-5">
            <h3 className="font-bold text-2xl ms-4 mb-3">Menus</h3>
            {!session?.user?.id ? (
              <>
                <Link href="/auth/user/register">
                  <Button color="white" name="Register" textColor="black" />
                </Link>
                <Link href="/auth/user/login">
                  <Button color="white" name="Login" textColor="black" />
                </Link>
                <Link href="/for-tenant">
                  <Button color="white" name="For Tenant" textColor="black" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/user/account"
                  className="text-black py-2 flex gap-2 items-center"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
                    <Image
                      src={
                        session.user.profile_picture || '/default_avatar.jpg'
                      }
                      alt="Profile"
                      width={40}
                      height={40}
                      className="object-cover w-full h-full "
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/default_avatar.jpg';
                      }}
                    />
                  </div>
                  My Account
                </Link>
                <Link href="/user/password" className="text-black py-2">
                  Manage Password
                </Link>
                {session?.user?.role === 'USER' && (
                  <>
                    <Link href="/user/booking" className="text-black py-2">
                      My Bookings
                    </Link>
                  </>
                )}
                <Link href="/search-property" className="text-black py-2">
                  Search Property
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-red-500 py-2 text-left"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Desktop Navigation - Authenticated User */}
      {session?.user?.id ? (
        <div className="hidden md:block relative" ref={profileRef}>
          <div className="flex items-center">
            {session?.user?.role === 'USER' && (
              <>
                <Link href="/user/booking">
                  <Button
                    name="My Bookings"
                    color={isScrolled ? 'white' : 'transparent'}
                    textColor={isScrolled ? 'black' : 'white'}
                  />
                </Link>
              </>
            )}
            <Link href="/search-property">
              <Button
                name="Search Property"
                color={isScrolled ? 'white' : 'transparent'}
                textColor={isScrolled ? 'black' : 'white'}
              />
            </Link>
            <div
              className="flex items-center gap-2 cursor-pointer ms-2"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <span
                className={`font-medium ${isScrolled ? 'text-primary' : 'text-white'}`}
              >
                Hi, {session.user.name || 'User'}
              </span>
              <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-gray-200">
                <Image
                  src={session.user.profile_picture || '/default_avatar.jpg'}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/default_avatar.jpg';
                  }}
                />
              </div>
            </div>

            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <Link
                  href="/user/account"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  My Account
                </Link>
                <Link
                  href="/user/password"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Manage Password
                </Link>
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="hidden md:flex items-center gap-4">
          <Link href="/for-tenant">
            <Button
              name="For Tenant"
              color={isScrolled ? 'white' : 'transparent'}
              textColor={isScrolled ? 'black' : 'white'}
            />
          </Link>
          <Link href="/auth/user/login">
            <Button
              name="Login"
              color={isScrolled ? 'white' : 'transparent'}
              textColor={isScrolled ? 'black' : 'white'}
              border={isScrolled ? 'primary' : 'white'}
              icon={<FaUser />}
              iconPosition="before"
            />
          </Link>
          <Link href="/auth/user/register">
            <Button name="Register" color="primary" textColor="white" />
          </Link>
        </div>
      )}
    </nav>
  );
}