'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Button from '../button/button';
import Link from 'next/link';
import { FaUser } from 'react-icons/fa';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
            <Button color="white" name="Register" textColor="black"></Button>
            <Button color="white" name="Login" textColor="black"></Button>
            <Button color="white" name="For Tenant" textColor="black"></Button>
          </div>
        </div>
      )}

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-4">
        <Button
          name="For Tenant"
          color={isScrolled ? 'white' : 'transparent'}
          textColor={isScrolled ? 'black' : 'white'}
        />
        <Button
          name="Login"
          color={isScrolled ? 'white' : 'transparent'}
          textColor={isScrolled ? 'black' : 'white'}
          border={isScrolled ? 'primary' : 'white'}
          icon={<FaUser />}
          iconPosition="before"
        />
        <Button name="Register" color="primary" textColor="white" />
      </div>
    </nav>
  );
}
