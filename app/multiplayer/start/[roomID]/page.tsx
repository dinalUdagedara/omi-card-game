import StartGamePool from "@/components-multiplayer/start-game-pool/start-game-pool";

export default function Page({ params }: { params: { roomID: string } }) {
  return (
    <div>
      <StartGamePool roomId={params.roomID} />
    </div>
  );
}
