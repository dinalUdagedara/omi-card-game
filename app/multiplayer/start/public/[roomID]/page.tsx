import StartGamePoolPublic from "@/components-multiplayer/start-game-pool/start-game-pool-public";


export default function Page({ params }: { params: { roomID: string } }) {
  return (
    <div>
      <StartGamePoolPublic roomId={params.roomID} />
    </div>
  );
}
