import { env } from "@/lib/env";
import type { NavItem } from "@/types/nav";

export const siteConfig = {
  name: "devina cecilia",
  tagline: "developer / writer / overthinker",
  description:
    "Thoughts, code, and everything in between — a personal journal about software, writing, and the occasional 2am realization.",
  url: env.NEXT_PUBLIC_APP_URL,
  ogImage: "/og",
  author: "Devina Cecilia",
  mainNav: [
    { title: "posts", href: "/#posts" },
    { title: "about", href: "/#about" },
  ] satisfies NavItem[],
  links: {
    email: "hello@devinacecilia.dev",
    github: "https://github.com/devinacecilia",
    twitter: "https://twitter.com/devinacecilia",
  },
};
