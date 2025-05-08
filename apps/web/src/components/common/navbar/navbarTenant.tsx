'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Button from '../button/button';
import Link from 'next/link';
import { FaUser } from 'react-icons/fa';
import { signOut, useSession } from 'next-auth/react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { data: session } = useSession();
  const profileRef = useRef<HTMLDivElement>(null);

  return (
    <nav
      className={`fixed w-full px-6 md:px-16 py-4 flex items-center justify-between z-50 transition-all duration-300 
    bg-white shadow-md`}
    >
      <Link href={'/'}>
        <Image
          src='/logo_primary.png' 
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
                <Link href="/">
                  <Button color="white" name="For User" textColor="black" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/user/profile"
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
                  My Profile
                </Link>
                <Link href="/user/dashboard" className="text-black py-2">
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-black py-2 text-left"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Desktop Navigation - Not Authenticated */}
      <div className={`${session?.user?.id ? 'hidden' : ''}`}>
        <div className="hidden md:flex items-center gap-4">
          <Link href="/">
            <Button name="For User" color="white" textColor="black" />
          </Link>
          <Link href="/auth/tenant/login">
            <Button
              name="Login"
              color="white"
              textColor="black"
              border="primaryOrange"
            />
          </Link>
          <Link href="/auth/tenant/register">
            <Button name="Register" color="primaryOrange" textColor="white" />
          </Link>
        </div>
      </div>

      {/* Desktop Navigation - Authenticated User */}
      {session?.user?.id && (
        <div className="hidden md:block relative" ref={profileRef}>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <span
              className={`font-medium ${isScrolled ? 'text-primary' : 'text-black'}`}
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
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <Link
                href="/user/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                My Profile
              </Link>
              <Link
                href="/user/dashboard"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Dashboard
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
      )}
    </nav>
  );
}
