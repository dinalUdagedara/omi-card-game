import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createGameState = mutation({
  args: {
    roomName: v.string(), // Room name to find the corresponding room ID
    players: v.array(v.id("players")),
    playerTurn: v.id("players"), // initially set to the creators id
    playersDecks: v.array(
      v.object({
        playerId: v.id("players"), // Each player's ID
        deck: v.array(v.object({ suit: v.string(), value: v.string() })), // Each player's deck of cards
      })
    ),
    trumpSetter: v.id("players"),
  },
  handler: async (ctx, args) => {
    console.log("Creating state");
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

    // Assign players to teams
    const playersWithTeams = args.players.map((playerId, index) => ({
      playerId,
      teamNumber: index % 2 === 0 ? 1 : 2, // Team 1 for indices 0 and 2, Team 2 for 1 and 3
    }));

    // Initialize penalty cards for each player with 10 cards
    const penaltyCards = args.players.map((playerId) => ({
      playerId,
      penaltyCards: 10, // Default initial penalty card count
    }));

    const gameStateID = await ctx.db.insert("gameStates", {
      roomId: roomInfo._id, // Use the room ID fetched from the query
      players: playersWithTeams,
      penaltyCards: penaltyCards,
      playersDecks: args.playersDecks,
      playersCards: [],
      teamPoints: { team1: 0, team2: 0 },
      playerTurn: args.playerTurn,
      roundWinner: null,
      winner: null,
      currentRound: 1,
      points: [],
      trump: null,
      trumpSetter: args.trumpSetter,
      turnSuit: null,
    });

    if (gameStateID) {
      await ctx.db.patch(roomInfo._id, {
        status: "started",
      });
    }

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
    const room = await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("roomName"), args.roomName))
      .first();

    if (!room) {
      throw new Error("Room not found");
    }

    const roomID = room?._id;

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

// Query to get the player's ID by username
export const checkRoomStatus = query({
  args: {
    roomName: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("roomName"), args.roomName))
      .first();

    if (!room) {
      throw new Error("Room not found");
    }

    return room.status;
  },
});

export const updateGameStateAfterRound = mutation({
  args: {
    roomName: v.string(), // Room name to find the corresponding room ID
    playersDecks: v.array(
      v.object({
        playerId: v.id("players"), // Each player's ID
        deck: v.array(v.object({ suit: v.string(), value: v.string() })), // Each player's deck of cards
      })
    ),
  },
  handler: async (ctx, args) => {
    console.log("Updating state", args.playersDecks);
    // Fetch room data using the room name
    const roomInfo = await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("roomName"), args.roomName))
      .first();

    // Check if the room exists
    if (!roomInfo) {
      throw new Error("Room not found");
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

        // Calculate the next player's index (wrap around if necessary)
        const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;

        // Update the playerTurn and trumpSetter to the next player
        const nextPlayerTurn = players[nextPlayerIndex];
        const nextTrumpSetter = players[nextPlayerIndex]; // Update logic as needed

        // Update the game state with the new round and other data
        await ctx.db.patch(gameState._id, {
          currentRound: nextRound,
          playerTurn: nextPlayerTurn.playerId,
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
