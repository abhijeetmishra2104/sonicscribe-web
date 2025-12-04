'use client';

import { useEffect, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AudioLines, Menu } from 'lucide-react';

import * as Avatar from '@radix-ui/react-avatar';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import GetStartedButton  from '@/components/ui/get-started-button';

export function TopBar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const navItems = [
    { name: 'Features', href: '#features' },
    { name: 'About', href: '#about' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Contact', href: '#contact' },
  ];

  const [showGetStartedButton, setShowGetStartedButton] = useState(true);
  useEffect( () => {
    if(window.location.pathname === '/upload') {
      setShowGetStartedButton(false);
    } else {
      setShowGetStartedButton(true);
    }
  })

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <AudioLines className="h-8 w-8 text-[#64ffda]" />
              <div className="absolute inset-0 h-8 w-8 bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 blur-sm" />
            </div>
            <span className="text-xl font-bold text-[#64ffda]"><Link href={"/"}>SonicScribe AI</Link></span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {showGetStartedButton && navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-white transition-colors duration-200 relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          {/* Desktop Buttons (Sign In / Avatar) */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <Avatar.Root className="w-10 h-10 rounded-full bg-[#40A2D8] text-[#F0EDCF] font-extrabold text-2xl cursor-pointer flex items-center justify-center">
                    <Avatar.Fallback className="text-balck font-medium">
                      {(session.user?.name || 'U')[0].toUpperCase()}
                    </Avatar.Fallback>
                  </Avatar.Root>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content className="bg-[#FDFFE2] font-extrabold text-black rounded shadow p-2 mt-2">
                  <DropdownMenu.Item
                    onClick={() => signOut()}
                    className="cursor-pointer hover:bg-[#83B4FF] px-2 py-1"
                  >
                    Log Out
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            ) : ""}
            {showGetStartedButton && (
              <Link href="/upload">
              <GetStartedButton/>
            </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-black/95 border-gray-800">
              <div className="flex flex-col space-y-6 mt-8">
                {/* Mobile Logo */}
                <div className="flex items-center space-x-2 pb-6 border-b border-gray-800">
                  <div className="relative">
                    <AudioLines className="h-6 w-6 text-blue-400" />
                    <div className="absolute inset-0 h-6 w-6 bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 blur-sm" />
                  </div>
                  <span className="text-lg font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 bg-clip-text text-transparent">
                    SonicScribe AI
                  </span>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex flex-col space-y-4">
                  {navItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </a>
                  ))}
                </nav>

                {/* Mobile CTA */}
                <div className="flex flex-col space-y-3 pt-6 border-t border-gray-800">
                  {session ? (
                    <Button
                      variant="ghost"
                      className="text-gray-300 hover:text-white hover:bg-gray-800/50 justify-start"
                      onClick={() => {
                        setIsOpen(false);
                        signOut();
                      }}
                    >
                      Log Out
                    </Button>
                  ) : ""}
                  <Link href="/upload">
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Subtle gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
    </header>
  );
}
