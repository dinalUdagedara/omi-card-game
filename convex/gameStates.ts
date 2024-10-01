import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createGameState = mutation({
  args: {
    roomName: v.string(), // Room name to find the corresponding room ID
    players: v.array(v.id("players")),
    playerTurn: v.id("players"),
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

    console.log("exisitngGameState", existingGameState);

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
      playersDecks: { team1: [], team2: [] },
      playersCards: [],
      teamPoints: { team1: 0, team2: 0 },
      playerTurn: args.playerTurn,
      roundWinner: null,
      winner: null,
      currentRound: 1,
      trump: null,
      trumpSetter: null,
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
      return null
    }

    // Return the creator's ID
    return creator._id;
  },
});
