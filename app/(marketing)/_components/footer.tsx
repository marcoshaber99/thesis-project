// app/(marketing)/_components/footer.tsx
import Link from "next/link";

interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  return (
    <footer className={`py-12 mt-12 ${className}`}>
      <div className="container mx-auto px-4 flex flex-col items-center justify-between">
        <nav className="flex flex-wrap justify-center space-x-6 lg:space-x-10">
          <Link
            className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
            href="/docs/getting-started"
          >
            Documentation
          </Link>
          <Link
            className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
            href="/survey"
          >
            Take Our Survey
          </Link>
          <Link
            className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
            href="/dashboard"
          >
            Dashboard
          </Link>
        </nav>
      </div>
    </footer>
  );
}
