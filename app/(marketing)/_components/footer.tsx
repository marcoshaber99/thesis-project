import Image from "next/image";
import Link from "next/link";

interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  return (
    <footer className={`py-12 mt-12  ${className}`}>
      <div className="container mx-auto px-4 flex flex-col items-center justify-between">
        <nav className="flex flex-wrap justify-center space-x-6 lg:space-x-10">
          <Link
            className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
            href="/docs/getting-started"
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
