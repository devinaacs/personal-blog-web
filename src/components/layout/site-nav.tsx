import Link from "next/link";

import { NavItem } from "@/types/nav";

export function SiteNav({ items }: { items: NavItem[] }) {
  return (
    <nav className="flex divide-x divide-line font-mono text-xs uppercase">
      {items.map((item) => (
        <Link
          className="px-4 py-2 text-ink transition-colors duration-150 hover:bg-ink hover:text-paper"
          href={item.href}
          key={item.href}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
