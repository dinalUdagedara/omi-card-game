import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createGameState = mutation({
  args: {
    roomName: v.string(), // Room name to find the corresponding room ID
    players: v.array(v.id("players")),
    playerTurn: v.id("players"),
    playersDecks: v.array(
      v.object({
        playerId: v.id("players"), // Each player's ID
        deck: v.array(v.object({ suit: v.string(), value: v.string() })), // Each player's deck of cards
      })
    ),
    trumpSetter: v.id("players"),
  },
  handler: async (ctx, args) => {
    // Fetch room data using the room name
    const roomInfo = await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("roomName"), args.roomName))
      .first();

    // Check if the room exists
    if (!roomInfo) {
      throw new Error("Room not found");
    }

    // Check if a game state already exists for the room
    const existingGameState = await ctx.db
      .query("gameStates")
      .filter((q) => q.eq(q.field("roomId"), roomInfo._id))
      .first();

    // If a game state already exists, return an error or the existing game state ID
    if (existingGameState) {
      return {
        error: "Game state already exists for this room",
        gameStateID: existingGameState._id,
      };
    }

    const gameStateID = await ctx.db.insert("gameStates", {
      roomId: roomInfo._id, // Use the room ID fetched from the query
      players: args.players,
      penaltyCards: { team1: 10, team2: 10 },
      playersDecks: args.playersDecks,
      playersCards: [],
      teamPoints: { team1: 0, team2: 0 },
      playerTurn: args.playerTurn,
      roundWinner: null,
      winner: null,
      currentRound: 1,
      trump: null,
      trumpSetter: args.trumpSetter,
      turnSuit: null,
    });

    return gameStateID;
  },
});

// Query to get the player's ID by username
export const getIdByUserName = query({
  args: {
    userName: v.string(),
  },
  handler: async (ctx, args) => {
    const creator = await ctx.db
      .query("players")
      .filter((q) => q.eq(q.field("userName"), args.userName))
      .first();

    // Check if the player exists
    if (!creator) {
      return null;
    }

    // Return the creator's ID
    return creator._id;
  },
});

export const getMyCardSet = query({
  args: {
    playerId: v.id("players"),
    roomName: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("Running in server", args.roomName);
    const room = await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("roomName"), args.roomName))
      .first();

    if (!room) {
      throw new Error("Room not found");
    }

    console.log("Room Found", room);
    const roomID = room?._id;

    console.log("Room ID : ", roomID);
    if (roomID) {
      // Fetch  game states where the roomID equals
      const gameState = await ctx.db
        .query("gameStates")
        .filter((q) => q.eq(q.field("roomId"), roomID))
        .first();

      // Check if a game state exists for the player
      if (!gameState) {
        throw new Error("Game state not found for the player");
      }

      console.log("GameState Found ", gameState);

      console.log("playerID", args.playerId);

      // Find the player's card set from playersCards
      const playerCardSet = gameState.playersDecks.find(
        (deck) => deck.playerId === args.playerId
      );

      // Check if the player has a card set
      if (!playerCardSet) {
        throw new Error("Player's card set not found");
      }

      // Return the player's card set (cards)
      return playerCardSet.deck;
    }
  },
});
