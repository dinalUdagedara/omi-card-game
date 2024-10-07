import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Card } from "@/utils/types";
import { useStore } from "@/store/state";
import { motion } from "framer-motion";
import { SuitSelectorMobile } from "@/components/drawer/mobile/suit-selector-mobile";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";
import CardComponentMultiplayer from "@/components-multiplayer/cards/card-multiplayer";
import { SuitSelectorMobileMultiplayer } from "./suit-selector-mobile-multiplayer";

const exampleCards: Card[] = [
  { suit: "clubs", value: "10" },
  { suit: "diamonds", value: "K" },
  { suit: "clubs", value: "J" },
  { suit: "spades", value: "A" },
];
interface SuitDrawerProps {
  userID: Id<"players">;
  roomName: string;
  onClose: () => void;
}

export function SuitDrawerMultiplayer({
  userID,
  roomName,
  onClose,
}: SuitDrawerProps) {
  const setTrumpSuit = useStore((state) => state.setTrumpSuit);
  const setTrumpSelected = useStore((state) => state.setTrumpSelected);
  const trumpSuit = useStore((state) => state.trumpSuit);
  const [myCardDeck, setMyCardDeck] = useState<
    { suit: string; value: string }[] | null
  >(null);

  const myCardSet = useQuery(api.gameStates.getMyCardSet, {
    playerId: userID,
    roomName: roomName || "",
  });

  useEffect(() => {
    if (myCardSet) {
      setMyCardDeck(myCardSet);
    }
  }, [myCardSet]);

  console.log("myCard Set", myCardSet);

  function handleDeselectSuit() {
    setTrumpSuit(null);
  }

  return (
    <Drawer open={true} onClose={onClose}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md ">
          <DrawerHeader>
            <DrawerTitle>Select Trumps</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="relative flex items-center justify-center h-56">
              {myCardDeck?.slice(0, 4).map((card, index) => {
                const angle = (index - (exampleCards.length - 1) / 2) * 30;

                return (
                  <div
                    key={index}
                    className="absolute"
                    style={{
                      transform: `rotate(${angle}deg) translateY(-50px)`,
                      transformOrigin: "bottom center",
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -200 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: index * 0.2 }}
                    >
                      <CardComponentMultiplayer card={card} />
                    </motion.div>
                  </div>
                );
              })}
            </div>

            <div className="">
              <SuitSelectorMobileMultiplayer roomName={roomName} userID ={userID} />
            </div>
          </div>
          <DrawerFooter className="">
            <DrawerClose asChild>
              <Button
                className=" rounded-2xl"
                onClick={() => {
                  setTrumpSelected(true);
                  onClose();
                }}
                disabled={!trumpSuit}
              >
                Select
              </Button>
            </DrawerClose>
            {/* <DrawerClose asChild>
              <Button onClick={()=>{
                handleDeselectSuit
                }} variant="outline">
                Cancel
              </Button>
            </DrawerClose> */}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
