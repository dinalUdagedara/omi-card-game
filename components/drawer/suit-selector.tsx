import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Suit, suits, suitsWithLogos } from "@/utils/practise/types";
import { useStore } from "@/store/state";
import { useState } from "react";
import Image from "next/image";

export function SuitSelector() {
  const [selectedSuit, setSelectedSuit] = useState<Suit | null>(null);
  const setTrumpSuit = useStore((state) => state.setTrumpSuit);
  function handleSuitSelected(suit: Suit) {
    setSelectedSuit(suit);
    setTrumpSuit(suit);
  }
  return (
    <Carousel className="w-full">
      <CarouselContent className="-ml-1">
        {suitsWithLogos.map((suit, index) => (
          <div 
          key={index} 
          className="flex justify-center w-full">
            <CarouselItem
              key={index}
              className="pl-1 basis-24 md:basis-1/2 lg:basis-32"
            >
              <div className="p-1">
                <Card className="hover:scale-110 bg-slate-300 rounded-3xl">
                  <CardContent
                    className={` ${
                      selectedSuit === suit.suit ? "bg-slate-400" : ""
                    } flex aspect-square items-center justify-center p-6 rounded-lg`}
                  >
                    <button
                      className="h-full w-full justify-center items-center"
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
            </CarouselItem>
          </div>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
