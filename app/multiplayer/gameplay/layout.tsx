import Header from "@/components/header";
import background from "@/public/assets/images/backgrounds/game-room-background.png"
import Image from "next/image";
export default function MultiplayerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* <Header /> */}
      <div className="absolute inset-0 p-20">
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
      </div>
      {children}
    </section>
  );
}
