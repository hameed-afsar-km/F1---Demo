import type { Metadata } from "next";
import "./globals.css";
import { CursorProvider } from "@/context/CursorContext";
import CanvasCursor from "@/components/CanvasCursor";
import MainCursor from "@/components/MainCursor";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://ferrari-f1.vercel.app"),
  title: "Scuderia Ferrari HP — Formula 1",
  description: "The official cinematic experience for Scuderia Ferrari HP. Discover the SF-25, our drivers, and the engineering that defines victory.",
  keywords: ["Ferrari", "F1", "Formula 1", "Scuderia Ferrari", "SF-25", "Racing"],
  openGraph: {
    title: "Scuderia Ferrari HP — Formula 1",
    description: "The cinematic Ferrari F1 experience.",
    images: ["/F1.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Bebas+Neue&family=Rajdhani:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Script 
          type="module" 
          src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js" 
          strategy="lazyOnload"
        />
        <CursorProvider>

          <MainCursor />
          <CanvasCursor />
          {children}
        </CursorProvider>
      </body>
    </html>
  );
}
