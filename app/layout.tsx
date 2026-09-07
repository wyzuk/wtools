import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { UsageProvider } from "@/components/UsageContext";

export const metadata: Metadata = {
  title: "WTOOLS — Modern Developer Utilities",
  description:
    "Fast, focused technical utilities for network, domain, security, and developer workflows. Built by Wasee / Wyzuk.",
  icons: {
    icon: "/assets/logo.png",
    shortcut: "/assets/logo.png",
    apple: "/assets/logo.png",
  },
  authors: [
    {
      name: "Wasee / Wyzuk",
      url: "https://www.wasee.dev",
    },
  ],
};

const themeScript = `
  (function() {
    try {
      var stored = localStorage.getItem('wtools_theme');
      if (stored === 'light') {
        document.documentElement.classList.remove('dark');
      } else if (stored === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-[#f8fafc] dark:bg-black text-slate-900 dark:text-white flex flex-col antialiased selection:bg-blue-500 selection:text-white">
        <ThemeProvider>
          <UsageProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </UsageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
