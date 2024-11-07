import * as React from "react";
import { ReactNode } from "react"; // Import ReactNode type

// 1. Import `NextUIProvider` component
import { NextUIProvider } from "@nextui-org/react";

interface AppProps {
  children: ReactNode; // Define props type
}

export default function NextProvider({ children }: AppProps) { // Destructure props correctly
  // 2. Wrap NextUIProvider at the root of your app
  return (
    <NextUIProvider>
      {children}
    </NextUIProvider>
  );
}
