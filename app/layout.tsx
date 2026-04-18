import "./globals.css";
import { Navigation } from "@/components/Navigation";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-100 antialiased">
        <div className="flex flex-row pointer-events-auto">
          <Navigation />
          <main className="relative z-0 min-w-0 flex-1 pt-[60px] md:pt-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
