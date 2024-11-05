// app/multiplayer/layout.tsx
import Header from "@/components/mode-selectors/header";
import background from "@/public/assets/images/background.png";
import Image from "next/image";
import MusicPlayer from "./music/background-music";

export default function MultiplayerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* <Header /> */}
      <div className="absolute inset-0">
        <Image
          alt="Mountains"
          src={background}
          placeholder="blur"
          quality={100}
          fill
          style={{
            objectFit: "cover",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent opacity-60" />
      </div>

      {/* Music Player */}
      {/* <MusicPlayer /> */}
      {children}
    </section>
  );
}
