import type { Metadata } from "next";
import "./globals.css";
import { SupabaseProvider } from "../providers";
import { ThemeProvider } from "../components/theme-provider";


export const metadata: Metadata = {
  title: "Luma Now",
  description: "ADHD-friendly planning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="antialiased min-h-screen bg-background"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SupabaseProvider>
            <main className="container mx-auto px-4 py-6">
              {children}
            </main>
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
