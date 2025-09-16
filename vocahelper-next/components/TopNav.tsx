"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * TopNav renders the main application navigation with accessible links.
 * - Highlights the current route using aria-current.
 * - Collapses gracefully on mobile.
 */
export function TopNav() {
  const pathname = usePathname();
  const items = [
    { href: "/", label: "Home" },
    { href: "/diagnostic", label: "Diagnostic" },
    { href: "/genres", label: "Genres" },
    { href: "/sentence-gym", label: "Sentence Gym" },
    { href: "/practice", label: "Practice" },
    { href: "/feedback", label: "Feedback" },
    { href: "/parent", label: "Parent" },
  ];

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav className="container mx-auto max-w-6xl px-4 py-3 flex items-center gap-4" aria-label="Primary">
        <Link href="/" className="font-extrabold text-lg text-slate-900 focus-ring" aria-label="VocaHelper home">
          VocaHelper
        </Link>
        <ul className="ml-auto flex flex-wrap gap-2">
          {items.map((item) => {
            const isCurrent = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isCurrent ? "page" : undefined}
                  className={
                    "px-3 py-2 rounded-md text-sm focus-ring " +
                    (isCurrent
                      ? "bg-brand text-white"
                      : "text-slate-700 hover:bg-slate-100")
                  }
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}

