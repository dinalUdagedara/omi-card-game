import Header from "@/components/header";
import background from "@/public/assets/images/backgrounds/game-room-background.png";
import Image from "next/image";
export default function MultiplayerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* <Header /> */}
      {/* <div className="absolute inset-0 p-20">
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
      </div> */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent/60 to-transparent/50 opacity-100" />
      {children}
    </section>
  );
}
