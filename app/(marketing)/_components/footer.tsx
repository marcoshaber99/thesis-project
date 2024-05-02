import Image from "next/image";
import Link from "next/link";
import { SVGProps } from "react";

interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  return (
    <footer className={`dark:text-gray-400 py-12 md:py-16 ${className}`}>
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between">
        <div className="mb-6 md:mb-0">
          <Link className="inline-flex items-center" href="#">
            <Image
              src="/logo.svg"
              height="40"
              width="40"
              alt="Logo"
              className="dark:hidden"
            />
            <Image
              src="/logo-dark.svg"
              height="40"
              width="40"
              alt="Logo"
              className="hidden dark:block"
            />
          </Link>
        </div>
        <nav className="flex flex-wrap justify-center space-x-6 md:space-x-8 lg:space-x-10">
          <Link
            className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
            href="#"
          >
            Docs
          </Link>
          <Link
            className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
            href="#"
          >
            About
          </Link>
          <Link
            className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
            href="#"
          >
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
