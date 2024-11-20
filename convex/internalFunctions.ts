import { internal } from "./_generated/api";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { v } from "convex/values";

//Fetch Room ID by RoomName
export const returnRoom = internalQuery({
  args: {
    roomName: v.string(),
  },
  handler: async (ctx, args) => {
    // Fetch the room by roomName
    const room = await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("roomName"), args.roomName))
      .first();

    if (!room) {
      return null;
    }
    return room;
  },
});

//Fetch GameState by Room ID
export const returnGameState = internalMutation({
  args: {
    roomID: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    // Fetch the gameState for the room
    const gameState = await ctx.db
      .query("gameStates")
      .filter((q) => q.eq(q.field("roomId"), args.roomID))
      .first();

    if (!gameState) {
      return null;
    }
    return gameState;
  },
});

export const returnGameStateByRoomName = internalQuery({
  args: {
    roomName: v.string(),
  },
  handler: async (ctx, args) => {
    // Fetch the room by roomName
    const room = await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("roomName"), args.roomName))
      .first();

    if (!room) {
      return null;
    }

    // Fetch the gameState for the room
    const gameState = await ctx.db
      .query("gameStates")
      .filter((q) => q.eq(q.field("roomId"), room._id))
      .first();

    if (!gameState) {
      return null;
    }

    return gameState;
  },
});

//fetch a card from a given user
export const returnCard = internalMutation({
  args: {
    userId: v.id("players"),
    gameStateId: v.id("gameStates"),
  },
  handler: async (ctx, args) => {
    // Fetch the room by roomName
    const gameState = await ctx.db
      .query("gameStates")
      .filter((q) => q.eq(q.field("_id"), args.gameStateId))
      .first();

    if (!gameState) {
      return null;
    }

    // Get the player's deck from the gameState
    const playerDeck = gameState.playersDecks.find(
      (deck) => deck.playerId === args.userId
    )?.deck;

    if (!playerDeck || playerDeck.length === 0) {
      return null;
    }

    let selectedCard;
    // Check if there is a turnSuit
    if (gameState.turnSuit) {
      // Try to find a card with the same suit as the turnSuit
      const cardsWithSameSuit = playerDeck.filter(
        (card) => card.suit === gameState.turnSuit
      );

      // If there are cards with the same suit, select one randomly
      if (cardsWithSameSuit.length > 0) {
        selectedCard =
          cardsWithSameSuit[
            Math.floor(Math.random() * cardsWithSameSuit.length)
          ];
      } else {
        // If no cards match the turnSuit, select a random card from the deck
        selectedCard =
          playerDeck[Math.floor(Math.random() * playerDeck.length)];
      }
    } else {
      // If no turnSuit, select a random card from the deck
      selectedCard = playerDeck[Math.floor(Math.random() * playerDeck.length)];
    }

    //update the player's status to playing
    await ctx.db.patch(args.userId, {
      status: "playing",
    });

    return selectedCard;
  },
});

//Check Offline Users
export const checkOfflinePlayers = internalMutation({
  args: {
    roomName: v.string(),
  },
  handler: async (ctx, args) => {
    const currentTime = Date.now();
    const offlineThreshold = 10000; // 10 seconds timeout
    // Fetch the room by roomName
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

export const getPlayerInfo = internalMutation({
  args: {
    userName: v.string(),
  },
  handler: async (ctx, args) => {
    const player = await ctx.db
      .query("players")
      .filter((q) => q.eq(q.field("userName"), args.userName))
      .first();

    if (!player) {
      return null;
    }
    return player;
  },
});

export const isRoomCreatorOffline = query({
  args: {
    roomName: v.string(),
  },
  handler: async (ctx, args) => {
    const gameState = await ctx.runQuery(
      internal.internalFunctions.returnGameStateByRoomName,
      {
        roomName: args.roomName,
      }
    );
    const room = await ctx.runQuery(internal.internalFunctions.returnRoom, {
      roomName: args.roomName,
    });
    if (!gameState || !room) {
      console.log("No GameState / Room Found");
      return null;
    }

    const offlinePlayers = gameState?.players.filter((player) => {
      return player.status === "offline";
    });

    if (!offlinePlayers) {
      console.log("No Offline Players", offlinePlayers);
      return null;
    }

    const creator = room.creator;

    const creatorInfo = await ctx.db
      .query("players")
      .filter((q) => q.eq(q.field("userName"), creator))
      .first();
    // Check if the creator is in the list of offline players
    const isCreatorOffline = offlinePlayers.some((player) => {
      return player.playerId === creatorInfo?._id;
    });
    if (isCreatorOffline === true) {
      return true;
    } else {
      return false;
    }
  },
});

export const updateGameStateAfterRoundBot = internalMutation({
  args: {
    roomName: v.string(),
    playersDecks: v.array(
      v.object({
        playerId: v.id("players"),
        deck: v.array(v.object({ suit: v.string(), value: v.string() })),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Fetch room data using the room name
    const roomInfo = await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("roomName"), args.roomName))
      .first();

    // Check if the room exists
    if (!roomInfo) {
      return null;
    }

    // Check if a game state exists for the room
    const gameState = await ctx.db
      .query("gameStates")
      .filter((q) => q.eq(q.field("roomId"), roomInfo._id))
      .first();

    if (gameState) {
      // Increment currentRound by one
      const nextRound = gameState.currentRound + 1;

      // Get the list of players
      const players = gameState.players;
      const currentPlayerID = gameState.playerTurn;
      if (currentPlayerID) {
        // Find the index of the current playerTurn
        // const currentPlayerIndex = players.indexOf(currentPlayerID);
        const currentPlayerIndex = players.findIndex(
          (p) => p.playerId === currentPlayerID
        );

        // Calculate the next player's index
        const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
        const nextTrumpSetter = players[nextPlayerIndex];

        // Update the game state with the new round and other data
        await ctx.db.patch(gameState._id, {
          currentRound: nextRound,
          trumpSetter: nextTrumpSetter.playerId, // Rotate trump setter as well
          trump: null,
          playersDecks: args.playersDecks,
          points: [], // Reset points for the new round
        });

        return gameState._id; // Return the updated game state ID
      }
    }
  },
});

export const updateTrumpSuitBot = internalMutation({
  args: {
    userID: v.id("players"),
    roomID: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    const gameState = await ctx.db
      .query("gameStates")
      .filter((q) => q.eq(q.field("roomId"), args.roomID))
      .first();

    if (!gameState) {
      return null;
    }
    const trumpSuit = "hearts";

    await ctx.db.patch(gameState._id, {
      trump: trumpSuit,
    });

    // Update the trumpSetter
    await ctx.db.patch(gameState._id, {
      trumpSetter: args.userID,
    });

    // Update the player turn in the gameState
    await ctx.db.patch(gameState._id, {
      playerTurn: args.userID,
    });
  },
});
