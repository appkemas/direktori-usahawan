'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Search, Home, Shield, Building2, HelpCircle } from 'lucide-react';
import Image from 'next/image';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navigation = [
    { name: 'Laman Utama', href: '/', icon: Home },
    { name: 'Carian Produk', href: '/search', icon: Search },
    { name: 'FAQ', href: '/faq', icon: HelpCircle },
    { name: 'Akses Admin', href: '/admin', icon: Shield },
    { name: 'Log Masuk Usahawan', href: '/entrepreneur/login', icon: Building2 },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main nav */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/kemas-logo.png"
                alt="KEMAS Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
            </Link>
            <div className="hidden md:ml-8 md:flex md:space-x-6">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-all duration-200 hover:bg-purple-50"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile menu button only */}
          <div className="flex items-center">
            <button
              onClick={toggleMenu}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/50">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-purple-600 block px-3 py-2 rounded-lg text-base font-medium flex items-center space-x-3 hover:bg-purple-50 transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
