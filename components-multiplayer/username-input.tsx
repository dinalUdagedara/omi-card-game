"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MultiplayerStateStore } from "@/store/multiplayer-state";
import { useState } from "react";
const UserNameInput = () => {
  const [username, setUsername] = useState<string | null>(null);
  const setUserName = MultiplayerStateStore((state) => state.setUsername);

  function handleSelectUserName() {
    if (username) {
      setUserName(username);
      localStorage.setItem("userName", username);
    }
  }
  return (
    <div>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          type="text"
          placeholder="Enter a User Name"
        />
        <Button onClick={handleSelectUserName} type="submit">
          Enter
        </Button>
      </div>
    </div>
  );
};

export default UserNameInput;
