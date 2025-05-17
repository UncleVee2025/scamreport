import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full py-4 px-6 border-t bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
      <div className="container mx-auto flex flex-col items-center justify-center text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Proudly powered by{" "}
          <Link
            href="https://www.popya.org"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            Popya Assistance Foundation
          </Link>
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          © {new Date().getFullYear()} ScamReport Namibia. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
