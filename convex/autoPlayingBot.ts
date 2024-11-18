import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { useMutation } from "convex/react";

//Automatically playing disconncted players card
export const updatePlayingCardsBot = internalMutation({
  args: {
    roomName: v.string(),
    userId: v.id("players"),
  },
  handler: async (ctx, args) => {
    const gameState = await ctx.runMutation(
      internal.internalFunctions.returnGameStateByRoomName,
      {
        roomName: args.roomName,
      }
    );
    // console.log("gameState:", gameState);
    if (!gameState) {
      return null;
    }

    const id = gameState._id;

    //Select A Card from the User's deck and use it
    const selectedCard = await ctx.runMutation(
      internal.internalFunctions.returnCard,
      {
        gameStateId: gameState._id,
        userId: args.userId,
      }
    );

    console.log("Selected Card: ", selectedCard);

    if (selectedCard) {
      // Update the players' cards in the gameState
      const updatedPlayersCards = gameState.playersCards || [];
      const existingPlayerIndex = updatedPlayersCards.findIndex(
        (pc) => pc.playerId === args.userId
      );

      if (existingPlayerIndex !== -1) {
        // Update the player's card if it exists
        updatedPlayersCards[existingPlayerIndex].card = selectedCard;
      } else {
        // Add a new entry for the player if it doesn't exist
        updatedPlayersCards.push({
          playerId: args.userId,
          card: selectedCard,
          teamInfo: {
            teamNum: 1,
            index: existingPlayerIndex === -1 ? 0 : updatedPlayersCards.length, // Example indexing logic
          },
        });
      }

      // Update the turnSuit if it's the first card played in the round
      if (!gameState.turnSuit) {
        await ctx.db.patch(id, {
          turnSuit: selectedCard.suit,
        });
      }

      // Find the player's deck and remove the selected card
      const updatedPlayersDecks = gameState.playersDecks.map((deck) => {
        if (deck.playerId === args.userId) {
          return {
            ...deck,
            deck: deck.deck.filter(
              (c) =>
                c.suit !== selectedCard.suit || c.value !== selectedCard.value
            ),
          };
        }
        return deck;
      });

      // Update the players' decks and cards in the database
      await ctx.db.patch(id, {
        playersCards: updatedPlayersCards,
        playersDecks: updatedPlayersDecks,
      });

      // Switch the player turn to the next player
      const playerTurnIndex = gameState.players.findIndex(
        (p) => p.playerId === gameState.playerTurn
      );
      const nextPlayerIndex = (playerTurnIndex + 1) % gameState.players.length;
      const nextPlayerId = gameState.players[nextPlayerIndex];

      // Update the player turn in the gameState
      await ctx.db.patch(id, {
        playerTurn: nextPlayerId.playerId,
      });
    }
  },
});

//setting the last active time of each user
export const updatePlayersHeartBeat = mutation({
  args: {
    userID: v.id("players"),
    roomName: v.string(),
  },
  handler: async (ctx, args) => {
    const currentTime = Date.now();
    const player = await ctx.db
      .query("players")
      .filter((q) => q.eq(q.field("_id"), args.userID))
      .first();

    if (!player) {
      return null;
    }
    await ctx.db.patch(player._id, {
      lastActive: currentTime,
    });
  },
});

// Handle Disconnected Players and Rejoined Players
export const handleDisconnectedPlayers = mutation({
  args: {
    roomName: v.string(),
  },
  handler: async (ctx, args) => {
    const currentTime = Date.now();
    const offlineThreshold = 10000; //  10 seconds timeout

    // Fetch the disconnected players
    const offlinePlayers = await ctx.runMutation(
      internal.internalFunctions.checkOfflinePlayers,
      {
        roomName: args.roomName,
      }
    );

    // If there are offline players
    if (offlinePlayers && offlinePlayers.length > 0) {
      const offlinePlayerIDs = offlinePlayers.map((player) => player._id);

      // Fetch the gameState for the given room
      const gameState = await ctx.db
        .query("gameStates")
        .filter((q) => q.eq(q.field("roomId"), offlinePlayers[0].roomId))
        .first();

      if (!gameState) {
        return null;
      }

      // Update the status of the offline players in both `players` and `gameStates`
      const updatedPlayers = gameState.players.map((player) => {
        if (offlinePlayerIDs.includes(player.playerId)) {
          return {
            ...player,
            status: "offline" as "online" | "offline",
          };
        } else {
          // For rejoined players: check if they have reconnected (lastActive within threshold)
          const rejoinedPlayer = offlinePlayers.find(
            (p) =>
              p._id === player.playerId &&
              p.lastActive >= currentTime - offlineThreshold
          );
          if (rejoinedPlayer) {
            return {
              ...player,
              status: "online" as "online" | "offline",
            };
          }
        }
        return player;
      });

      // Update the gameState in the database
      await ctx.db.patch(gameState._id, {
        players: updatedPlayers,
      });

      console.log(
        "Updated players' status (online/offline) for room:",
        args.roomName
      );

      // Update the `players` table to reflect rejoined players as "online"
      for (const player of offlinePlayers) {
        if (player.lastActive >= currentTime - offlineThreshold) {
          await ctx.db.patch(player._id, { status: "online" });
        }
      }
    } else {
      const room = await ctx.runMutation(
        internal.internalFunctions.returnRoom,
        {
          roomName: args.roomName,
        }
      );

      if (!room) {
        return null;
      }

      // If no offline players, set all players in the gameState to "online"

      // Fetch the gameState for the given room
      const gameState = await ctx.db
        .query("gameStates")
        .filter((q) => q.eq(q.field("roomId"), room?._id))
        .first();

      if (!gameState) {
        console.log("Game state not found");
        return null;
      }

      // Update all players' status to "online" in the gameState
      const updatedPlayers = gameState.players.map((player) => ({
        ...player,
        status: "online" as "online" | "offline",
      }));

      // Update the gameState in the database
      await ctx.db.patch(gameState._id, {
        players: updatedPlayers,
      });

      //   console.log("All players set to 'online' for room:", args.roomName);
      console.log("No offline players detected.");
    }
  },
});

//Query for front-end to Detect Users that have been inactive for more than 15 seconds
export const offlinePlayers = query({
  args: {
    roomName: v.string(),
  },
  handler: async (ctx, args) => {
    const currentTime = Date.now();
    const offlineThreshold = 10000; //  10 seconds timeout
    const room = await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("roomName"), args.roomName))
      .first();

    if (!room) {
      return null;
    }

    const roomID = room._id;

    const offlinePlayers = await ctx.db
      .query("players")
      .filter((q) => q.eq(q.field("roomId"), roomID))
      .filter((q) =>
        q.lt(q.field("lastActive"), currentTime - offlineThreshold)
      )
      .collect();

    if (!offlinePlayers) {
      return null;
    }
    return offlinePlayers;
  },
});

//separate function to constalty check if a player is rejoined and if yes update the player status in game state
export const rejoinPlayers = mutation({
  args: {
    roomName: v.string(),
  },
  handler: async (ctx, args) => {
    const currentTime = Date.now();
    const offlineThreshold = 10000; // 10 seconds of inactivity is considered offline

    const room = await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("roomName"), args.roomName))
      .first();

    if (!room) {
      console.log("Room not found.");
      return;
    }
    const roomID = room._id;
    // Fetch the gameState for the given room
    const gameState = await ctx.db
      .query("gameStates")
      .filter((q) => q.eq(q.field("roomId"), roomID))
      .first();

    if (!gameState) {
      console.log("Game state not found.");
      return;
    }

    // Fetch all players in the room
    const players = await ctx.db
      .query("players")
      .filter((q) => q.eq(q.field("roomId"), roomID))
      .collect();

    const updatedGameStatePlayers = gameState.players.map((gameStatePlayer) => {
      const player = players.find((p) => p._id === gameStatePlayer.playerId);

      if (player) {
        // If the player has reconnected (active within the last 15 seconds)
        const isOnline = player.lastActive >= currentTime - offlineThreshold;
        const status: "online" | "offline" = isOnline ? "online" : "offline";

        // Update the player's status in the game state
        return {
          ...gameStatePlayer,
          status: status,
        };
      }

      return gameStatePlayer;
    });

    // Update the gameState with the new player statuses
    await ctx.db.patch(gameState._id, {
      players: updatedGameStatePlayers,
    });
  },
});
