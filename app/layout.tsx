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
      if (stored === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
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
      <body suppressHydrationWarning className="min-h-screen bg-[#f5f5f7] dark:bg-[#121214] text-[#1d1d1f] dark:text-[#f5f5f7] flex flex-col antialiased selection:bg-[#0071e3] selection:text-white font-sans">
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
