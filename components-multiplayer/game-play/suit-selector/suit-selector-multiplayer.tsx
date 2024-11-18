import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  isValidSuit,
  Suit,
  suits,
  suitsWithLogos,
} from "@/utils/practise/types";
import { useStore } from "@/store/state";
import { useEffect, useState } from "react";
import Image from "next/image";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  useHoverSound,
  useClickSound,
  useCardSelectSound,
  useSuitSelectSound,
} from "@/utils/play-sounds";

interface SuitSelectorProps {
  roomName: string;
  userID: Id<"players">;
}

export function SuitSelectorMobileMultiplayer({
  roomName,
  userID,
}: SuitSelectorProps) {
  const [selectedSuit, setSelectedSuit] = useState<Suit | null>(null);
  const setTrumpSuit = useStore((state) => state.setTrumpSuit);
  const updateTrump = useMutation(api.gameLogic.updateTrumpSuit);
  const updateTrumpSetter = useMutation(api.gameLogic.updateTrumpSetter);
  const replacePlayerTurn = useMutation(api.gameLogic.replacePlayerTurn);
  const muted = useStore((state) => state.muted);
  const { playSuitSelected } = useSuitSelectSound();

  // Automatically close dialog after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSuitSelected(suitsWithLogos[0].suit);
    }, 10000);

    return () => clearTimeout(timer); // Clear the timer when component unmounts
  }, []);

  function handleSuitSelected(suit: Suit) {
    console.log("Suit selcted");
    playSuitSelected(muted);
    setSelectedSuit(suit);
    setTrumpSuit(suit);
    const trumpSuit = suit;
    if (trumpSuit) {
      updateTrump({
        roomName,
        trumpSuit,
      });

      updateTrumpSetter({
        roomName,
        userID,
      });

      replacePlayerTurn({
        roomName: roomName,
        userId: userID,
      });
    }
  }
  return (
    <Carousel className="w-full max-w-sm">
      <CarouselContent className="-ml-1">
        {suitsWithLogos.map((suit, index) => (
          <div key={index}>
            <CarouselItem
              key={index}
              className="w-full pl-1 basis-20 md:basis-1/2 lg:basis-1/3"
            >
              <div className="p-1">
                <Card className="hover:scale-110 bg-slate-200 rounded-2xl">
                  <CardContent
                    className={` ${
                      selectedSuit === suit.suit
                        ? "bg-slate-400 rounded-3xl"
                        : ""
                    } flex aspect-square items-center justify-center p-6 rounded-lg`}
                  >
                    <button
                      className="h-full w-full justify-center items-center "
                      onClick={() => {
                        handleSuitSelected(suit.suit);
                      }}
                    >
                      {/* <span className="text-2xl font-semibold">{suit.suit}</span> */}
                      <span className="flex justify-center items-center rounded-3xl">
                        <Image
                          src={suit.logoUrl}
                          alt="Suit Image"
                          height={60}
                          width={60}
                          className="rounded-full"
                        />
                      </span>
                    </button>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>{" "}
          </div>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
