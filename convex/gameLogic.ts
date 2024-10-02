import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
export const updateTrumpSuit = mutation({
  args: {
    roomName: v.string(),
    trumpSuit: v.string(),
  },

  handler: async (ctx, args) => {
    const room = await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("roomName"), args.roomName))
      .first();

    if (!room) {
      throw new Error("Room not found");
    }

    const gameState = await ctx.db
      .query("gameStates")
      .filter((q) => q.eq(q.field("roomId"), room?._id))
      .first();

    if (!gameState) {
      throw new Error("gameState not found");
    }

    const id = gameState?._id;
    if (id) {
      await ctx.db.patch(id, {
        trump: args.trumpSuit,
      });
      console.log(await ctx.db.get(id));
    }
  },
});

export const updatePlayingCards = mutation({
  args: {
    roomName: v.string(),
    userId: v.id("players"),
    card: v.object({
      suit: v.string(),
      value: v.string(),
    }),
  },

  handler: async (ctx, args) => {
    // Fetch the room by roomName
    const room = await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("roomName"), args.roomName))
      .first();

    if (!room) {
      throw new Error("Room not found");
    }

    // Fetch the gameState for the room
    const gameState = await ctx.db
      .query("gameStates")
      .filter((q) => q.eq(q.field("roomId"), room._id))
      .first();

    if (!gameState) {
      throw new Error("GameState not found");
    }

    const id = gameState._id;

    if (id) {
      // Update the players' cards in the gameState
      const updatedPlayersCards = gameState.playersCards || [];
      const existingPlayerIndex = updatedPlayersCards.findIndex(
        (pc) => pc.playerId === args.userId
      );

      if (existingPlayerIndex !== -1) {
        // Update the player's card if it exists
        updatedPlayersCards[existingPlayerIndex].card = args.card;
      } else {
        // Add a new entry for the player if it doesn't exist
        updatedPlayersCards.push({
          playerId: args.userId,
          card: args.card,
        });
      }

      // Update the turnSuit if it's the first card played in the round
      if (!gameState.turnSuit) {
        await ctx.db.patch(id, {
          turnSuit: args.card.suit,
        });
      }

      // Update the players' cards in the database
      await ctx.db.patch(id, {
        playersCards: updatedPlayersCards,
      });

      // Switch the player turn to the next player
      const playerTurnIndex = gameState.players.findIndex(
        (p) => p === gameState.playerTurn
      );
      const nextPlayerIndex = (playerTurnIndex + 1) % gameState.players.length;
      const nextPlayerId = gameState.players[nextPlayerIndex];

      // Update the player turn in the gameState
      await ctx.db.patch(id, {
        playerTurn: nextPlayerId,
      });
    }
  },
});

//getting whose turn it is

export const getPlayerTurn = query({
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

    const roomID = room?._id;

    if (roomID) {
      // Fetch  game states where the roomID equals
      const gameState = await ctx.db
        .query("gameStates")
        .filter((q) => q.eq(q.field("roomId"), roomID))
        .first();

      // Check if a game state exists for the room
      if (!gameState) {
        throw new Error("Game state not found for the room");
      }

      // get the whose turn it is to play
      const turnPlayerId = gameState.playerTurn;

      // Return the turnPlayerId
      return turnPlayerId;
    }
  },
});

//clearing the playing cards after a turn
export const clearPlayingCards = mutation({
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

    const gameState = await ctx.db
      .query("gameStates")
      .filter((q) => q.eq(q.field("roomId"), room?._id))
      .first();

    if (!gameState) {
      throw new Error("gameState not found");
    }

    const id = gameState?._id;

    if (id) {
      // Clear all entries in playersCards by setting it to an empty array
      await ctx.db.patch(id, {
        playersCards: [],
      });

      console.log(await ctx.db.get(id));
    }
  },
});

export const getPlayingCards = query({
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

    const roomID = room?._id;

    if (roomID) {
      // Fetch  game states where the roomID equals
      const gameState = await ctx.db
        .query("gameStates")
        .filter((q) => q.eq(q.field("roomId"), roomID))
        .first();

      // Check if a game state exists for the room
      if (!gameState) {
        throw new Error("Game state not found for the room");
      }

      // Find the cards on play in the room current turn
      const cardsOnPlay = gameState.playersCards;

      if (!cardsOnPlay) {
        throw new Error("No cards in Play");
      }

      // Return the cards on play
      return cardsOnPlay;
    }
  },
});

export const getTrumpSuit = query({
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

    const roomID = room?._id;

    if (roomID) {
      // Fetch  game states where the roomID equals
      const gameState = await ctx.db
        .query("gameStates")
        .filter((q) => q.eq(q.field("roomId"), roomID))
        .first();

      // Check if a game state exists for the room
      if (!gameState) {
        throw new Error("Game state not found for the room");
      }

      // get the trump of the selected room
      const trumpSuit = gameState.trump;

      if (!trumpSuit) {
        return null;
      }

      // Return the cards on play
      return trumpSuit;
    }
  },
});
