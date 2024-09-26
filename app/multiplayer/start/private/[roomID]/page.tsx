import StartGamePoolPrivate from "@/components-multiplayer/start-game-pool/start-game-pool-private";

export default function Page({ params }: { params: { roomID: string } }) {
  return (
    <div>
      <StartGamePoolPrivate roomId={params.roomID} />
    </div>
  );
}
