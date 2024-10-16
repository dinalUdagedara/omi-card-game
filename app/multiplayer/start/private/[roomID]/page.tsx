import StartGamePoolPrivateNew from "@/components-multiplayer/start-game-pool/start-game-pool-private";

export default function Page({ params }: { params: { roomID: string } }) {
  return (
    <div>
      <StartGamePoolPrivateNew roomId={params.roomID} />
    </div>
  );
}
