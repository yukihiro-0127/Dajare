import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PunCraft",
  description: "Context-aware puns for work and play"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header>
          <div className="nav">
            <Link href="/">
              <strong>PunCraft</strong>
            </Link>
            <nav className="nav-links">
              <Link href="/">Generate</Link>
              <Link href="/library">My Library</Link>
              <Link href="/community">Community</Link>
              <Link href="/settings">Settings</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
