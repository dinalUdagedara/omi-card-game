import StartGamePoolPrivateNew from "@/components-multiplayer/start-game-pool/start-game-pool-private";

export default function Page({ params }: { params: { roomID: string } }) {
  return (
    <div className="flex items-center min-h-screen">
      <StartGamePoolPrivateNew roomId={params.roomID} />
    </div>
  );
}
