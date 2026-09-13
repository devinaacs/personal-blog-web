import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full grow flex-col text-ink">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
