"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Github,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const navigation = {
  solutions: [
    { name: "Browse Videos", href: "/video" },
    { name: "Upload Video", href: "/video/upload" },
    { name: "Video Analytics", href: "#" },
    { name: "AI Features", href: "#" },
  ],
  support: [
    { name: "Help Center", href: "#" },
    { name: "Contact Us", href: "#" },
    { name: "FAQ", href: "#" },
    { name: "API Documentation", href: "#" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Press", href: "#" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "#" },
    { name: "GDPR", href: "#" },
  ],
  social: [
    { name: "Facebook", href: "#", icon: Facebook },
    { name: "Twitter", href: "#", icon: Twitter },
    { name: "Instagram", href: "#", icon: Instagram },
    { name: "YouTube", href: "#", icon: Youtube },
    { name: "GitHub", href: "#", icon: Github },
  ],
};

export default function Footer() {
  const pathname = usePathname();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                VideoAI
              </span>
            </Link>
            <p className="mt-4 text-base text-gray-600 dark:text-gray-400 max-w-sm">
              Share and discover amazing videos with our AI-powered platform.
              Upload, analyze, and reach your audience effortlessly.
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-400">
                  123 Video Street, Digital City
                </span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-400">
                  +1 (555) 123-4567
                </span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-400">
                  contact@videoai.example
                </span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">
              Solutions
            </h3>
            <ul className="mt-4 space-y-3">
              {navigation.solutions.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`text-base ${
                      pathname === item.href
                        ? "text-purple-600 dark:text-purple-400"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">
              Support
            </h3>
            <ul className="mt-4 space-y-3">
              {navigation.support.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`text-base ${
                      pathname === item.href
                        ? "text-purple-600 dark:text-purple-400"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">
              Legal
            </h3>
            <ul className="mt-4 space-y-3">
              {navigation.legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`text-base ${
                      pathname === item.href
                        ? "text-purple-600 dark:text-purple-400"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social and Newsletter */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-6 md:mb-0">
              {navigation.social.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </Link>
              ))}
            </div>
            <div className="flex items-center">
              <form className="flex flex-col sm:flex-row sm:gap-2">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="py-2 px-4 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-2 sm:mt-0 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-base text-gray-500 dark:text-gray-400">
            &copy; {year} VideoAI. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            {navigation.company.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
