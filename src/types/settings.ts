export type SiteSettings = {
  id: string;
  siteName: string;
  tagline: string;
  establishedYear: number;
  bio: string[];
  currentlyUsing: string[];
  otherInterests: string[];
  email: string;
  github: string | null;
  threads: string | null;
  linkedin: string | null;
  footerBlurb: string;
  updatedAt: string;
};
