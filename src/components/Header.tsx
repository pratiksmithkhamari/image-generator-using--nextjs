"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Camera, Info, Menu, X, User } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/", icon: Sparkles },
    { name: "Create", href: "/create", icon: Camera },
    { name: "About", href: "/about", icon: Info },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-900/80 via-pink-900/80 to-blue-900/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Photogenic
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/profile"
                  className="hidden md:inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/20"
                >
                  <User className="w-5 h-5 mr-2" />
                  Porfile
                </Link>
                <button
                  onClick={() => signOut()}
                  className="hidden md:inline-flex items-center px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="hidden md:inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/20"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-gradient-to-b from-purple-900/95 via-pink-900/95 to-blue-900/95 backdrop-blur-md border-b border-white/10"
          >
            <div className="px-4 py-3 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              {session ? (
                <>
                  <Link
                    href="/create"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-3 py-2 text-white bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-lg hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 transition-all duration-300"
                  >
                    <Camera className="w-5 h-5" />
                    <span>Create Image</span>
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-white bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300"
                  >
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/signin"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-2 text-white bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-lg hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 transition-all duration-300"
                >
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
