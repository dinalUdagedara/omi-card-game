import * as React from "react";
import { Card } from "@/utils/types";
import OtherCardComponent from "../cards/other-card";
import { motion } from "framer-motion";

interface UserDeckProps {
  userHand: Card[];
}

export function OtherDecks({ userHand }: UserDeckProps) {
  return (
    <div className="h-full w-full flex justify-center items-center  p-4 rounded-lg ">
      <div className="relative flex justify-center items-center">
        {userHand.map((card, index) => (
          <div
            key={index}
            className={`relative transform transition-transform duration-200   hover:shadow-lg`}
            style={{
              marginLeft: index === 0 ? "0" : "-4rem",
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: -200 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <button className="">
                <OtherCardComponent />
              </button>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
