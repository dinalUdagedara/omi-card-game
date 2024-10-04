import Header from "@/components/header";
export default function MultiplayerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* <Header /> */}
      {children}
    </section>
  );
}
