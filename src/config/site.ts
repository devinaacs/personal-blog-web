import { env } from "@/lib/env";
import type { NavItem } from "@/types/nav";

export const siteConfig = {
  name: "dev",
  tagline: "developer / writer / overthinker",
  description:
    "Thoughts, code, and everything in between — a personal journal about software, writing, and the occasional 2am realization.",
  url: env.NEXT_PUBLIC_APP_URL,
  ogImage: "/og",
  author: "Dev",
  mainNav: [
    { title: "posts", href: "/#posts" },
    { title: "about", href: "/#about" },
  ] satisfies NavItem[],
  links: {
    email: "hello@mail.dev",
    github: "https://github.com/username",
    twitter: "https://twitter.com/username",
  },
};
