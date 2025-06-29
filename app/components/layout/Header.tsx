/**
 * Header Component
 *
 * Main navigation header for the application with responsive design.
 * Includes theme toggle, user authentication state, and navigation links.
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ThemeToggle } from "@/app/components/common/ThemeToggle";
import { Github, LogIn } from "lucide-react";

export default function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Navigation links
  const navigation = [
    { name: "Home", href: "/" },
    { name: "Videos", href: "/video" },
  ];

  if (!mounted) {
    // Return a placeholder with the same structure to avoid layout shift
    return (
      <header className="bg-white shadow">
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          aria-label="Top"
        >
          <div className="w-full py-6 flex items-center justify-between border-b border-gray-200 lg:border-none">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-purple-600">
                VideoAI
              </span>
              <div className="hidden ml-10 space-x-8 lg:block">
                {navigation.map((link) => (
                  <span
                    key={link.name}
                    className="text-base font-medium text-gray-500"
                  >
                    {link.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="ml-10 space-x-4">
              {/* Placeholder for authentication buttons */}
              <div className="inline-block w-24 h-10"></div>
            </div>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header className="bg-white dark:bg-gray-900 shadow z-10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="w-full py-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 lg:border-none">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold text-purple-600 dark:text-purple-400"
            >
              VideoAI
            </Link>
            <div className="hidden ml-10 space-x-8 lg:block">
              {navigation.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-base font-medium ${
                    pathname === link.href
                      ? "text-purple-600 dark:text-purple-400"
                      : "text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="ml-10 space-x-4 flex items-center">
            <ThemeToggle />

            {status === "loading" ? (
              <div className="animate-pulse w-24 h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ) : session ? (
              <Menu as="div" className="relative inline-block text-left z-20">
                <div>
                  <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                    {session.user?.name || session.user?.email}
                    <svg
                      className="w-5 h-5 ml-2 -mr-1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/profile"
                            className={`${
                              active ? "bg-gray-100 dark:bg-gray-700" : ""
                            } block px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                          >
                            Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className={`${
                              active ? "bg-gray-100 dark:bg-gray-700" : ""
                            } block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                          >
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="py-4 flex flex-wrap justify-center space-x-6 lg:hidden">
          {navigation.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-base font-medium ${
                pathname === link.href
                  ? "text-purple-600 dark:text-purple-400"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
