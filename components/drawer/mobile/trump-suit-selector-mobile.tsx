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
import CardComponent from "../../cards/card";
import { Card } from "@/utils/types";
import { SuitSelector } from "../suit-selector";
import { useStore } from "@/store/state";
import { motion } from "framer-motion";
import { SuitSelectorMobile } from "./suit-selector-mobile";

const exampleCards: Card[] = [
  { suit: "clubs", value: "10" },
  { suit: "diamonds", value: "K" },
  { suit: "clubs", value: "J" },
  { suit: "spades", value: "A" },
];

interface SuitDrawerProps {
  userHand: Card[];
  onClose: () => void;
}

export function SuitDrawerMobile({ userHand, onClose }: SuitDrawerProps) {
  const setTrumpSuit = useStore((state) => state.setTrumpSuit);
  const setTrumpSelected = useStore((state) => state.setTrumpSelected);
  const trumpSuit = useStore((state) => state.trumpSuit);

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
              {userHand.slice(0, 4).map((card, index) => {
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
                      <CardComponent card={card} />
                    </motion.div>
                  </div>
                );
              })}
            </div>

            <div className="">
              <SuitSelectorMobile />
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
