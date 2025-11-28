import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "GAZE – Web Godot IDE",
  description: "Fast browser IDE for managing full Godot projects"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 text-neutral-100 min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

