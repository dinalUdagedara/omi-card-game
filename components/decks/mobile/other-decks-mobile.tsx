import * as React from "react";
import { Card } from "@/utils/types";
import OtherCardComponent from "../../cards/other-card";
import { motion } from "framer-motion";
import OtherCardComponentMobile from "@/components/cards/other-card-mobile";

interface UserDeckProps {
  userHand: Card[];
}

export function OtherDecksMobile({ userHand }: UserDeckProps) {
  return (
    <div className="h-full lg:w-full max-w-20 md:max-w-40 lg:max-w-full flex justify-center items-center  p-2 rounded-lg ">
      <div className="relative flex justify-center items-center">
        {userHand.map((card, index) => (
          <div
            key={index}
            className={`relative transform transition-transform duration-200  hover:shadow-lg `}
            style={{
              marginLeft: index === 0 ? "0" : "-2rem",
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: -200 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <div className="">
                <OtherCardComponentMobile />
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
