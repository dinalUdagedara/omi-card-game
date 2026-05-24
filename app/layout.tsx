import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Cormorant } from "next/font/google";
import { Spicy_Rice } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ConvexClientProvider } from "@/components/providers/ConvexClientProvider";
import NextProvider from "../components/providers/next-provider";
import MusicPlayer from "./multiplayer/music/background-music";
import background from "@/public/assets/images/background.png";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });
const cormorant = Cormorant({ subsets: ["latin"] });
const spicy_rice = Spicy_Rice({
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: "Omi",
    template: "%s | Omi",
  },
  description:
    "The classic Sri Lankan card game, online. Play Omi with friends in real-time multiplayer or sharpen your skills in solo practice mode.",
  keywords: ["Omi", "card game", "Sri Lanka", "multiplayer", "online card game"],
  authors: [{ name: "Dinal Udagedara" }],
  icons: {
    icon: "/assets/images/logo-icon.png",
    apple: "/assets/images/logo-icon.png",
  },
  openGraph: {
    type: "website",
    title: "Omi — Play the Classic Sri Lankan Card Game Online",
    description:
      "Challenge friends in real-time multiplayer or practice solo. Omi brings the classic Sri Lankan trick-taking card game to your browser.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Omi Card Game",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Omi — Play the Classic Sri Lankan Card Game Online",
    description:
      "Challenge friends in real-time multiplayer or practice solo. Omi brings the classic Sri Lankan trick-taking card game to your browser.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cormorant.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ConvexClientProvider>
            <NextProvider>
              <div className="absolute inset-0">
                <Image
                  alt="Mountains"
                  src={background}
                  placeholder="blur"
                  quality={100}
                  fill
                  sizes="100vw"
                  style={{
                    objectFit: "cover",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent opacity-100" />
              </div>

              <div className="z-20">
                {/* Music Player */}
                <MusicPlayer />
              </div>

              {children}
            </NextProvider>
          </ConvexClientProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
