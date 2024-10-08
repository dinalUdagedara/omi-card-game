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
    }
  },
});

export const removeTrumpSuit = mutation({
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
      await ctx.db.patch(id, {
        trump: null,
      });
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
          teamInfo: {
            teamNum: 1,
            index: existingPlayerIndex === -1 ? 0 : updatedPlayersCards.length, // Example indexing logic
          },
        });
      }

      // Update the turnSuit if it's the first card played in the round
      if (!gameState.turnSuit) {
        await ctx.db.patch(id, {
          turnSuit: args.card.suit,
        });
      }

      // Find the player's deck and remove the selected card
      const updatedPlayersDecks = gameState.playersDecks.map((deck) => {
        if (deck.playerId === args.userId) {
          return {
            ...deck,
            deck: deck.deck.filter(
              (c) => c.suit !== args.card.suit || c.value !== args.card.value
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

export const noOfPlayingCards = query({
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

      // get the number of cards in the playersCards (playing cards)
      const noOfPlayingCards = gameState.playersCards.length;

      // Return the turnPlayerId
      return noOfPlayingCards;
    }
  },
});

export const updateTrumpSetter = mutation({
  args: {
    roomName: v.string(),
    userID: v.id("players"),
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
      .filter((q) => q.eq(q.field("roomId"), room._id))
      .first();

    if (!gameState) {
      throw new Error("gameState not found");
    }

    // Update the trumpSetter
    await ctx.db.patch(gameState._id, {
      trumpSetter: args.userID,
    });
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

export const getPlayersDecks = query({
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
      const playersDecks = gameState.playersDecks;

      if (!playersDecks) {
        throw new Error("No cards in Play");
      }

      // Return the cards on play
      return playersDecks;
    }
  },
});

export const getTurnSuit = query({
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

      // Find the turn suit for the current turn
      const turnSuit = gameState.turnSuit;

      if (!turnSuit) {
        return null;
      }

      // Return the cards on play
      return turnSuit;
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

export const resetStates = mutation({
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

      // Clear  turnSuit by setting it to an empty array
      await ctx.db.patch(id, {
        turnSuit: null,
      });
    }
  },
});

export const updatePlayerPoints = mutation({
  args: {
    roomName: v.string(),
    userId: v.id("players"),
    points: v.number(), // This is the value to add or subtract (2, 1, -1, -2)
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
      // Update the players' points in the gameState
      const updatedPlayerPoints = gameState.points || [];
      const existingPlayerIndex = updatedPlayerPoints.findIndex(
        (pc) => pc.playerId === args.userId
      );

      if (existingPlayerIndex !== -1) {
        // If the player already exists, add or subtract the points
        updatedPlayerPoints[existingPlayerIndex].points += args.points;
      } else {
        // If the player doesn't exist, add a new entry with the passed points
        updatedPlayerPoints.push({
          playerId: args.userId,
          points: args.points, // This will start with the value passed (2, 1, -1, -2)
        });
      }

      // Update the players' points in the database
      await ctx.db.patch(id, {
        points: updatedPlayerPoints,
      });
    }
  },
});

export const incrementPlayerPoints = mutation({
  args: {
    roomName: v.string(),
    userId: v.id("players"),
  },

  handler: async (ctx, args) => {
    const incrementValue = 1;

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
      // Update the players' points in the gameState
      const updatedPlayerPoints = gameState.points || [];
      const existingPlayerIndex = updatedPlayerPoints.findIndex(
        (pc) => pc.playerId === args.userId
      );

      if (existingPlayerIndex !== -1) {
        // Increment the player's points if they exist
        updatedPlayerPoints[existingPlayerIndex].points += incrementValue;
      } else {
        // Add a new entry for the player if they don't exist, with the increment value
        updatedPlayerPoints.push({
          playerId: args.userId,
          points: incrementValue, // Initialize with the increment value
        });
      }

      // Update the players' points in the database
      await ctx.db.patch(id, {
        points: updatedPlayerPoints,
      });
    }
  },
});

export const getPlayersPoints = query({
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

      // Find the points
      const playersPoints = gameState.points;

      if (!playersPoints) {
        throw new Error("No cards in Play");
      }

      // Return points
      return playersPoints;
    }
  },
});

export const getTrumpSetter = query({
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

      // Find the trump setter
      const trumpSetter = gameState.trumpSetter;

      if (!trumpSetter) {
        throw new Error("No cards in Play");
      }

      // Return points
      return trumpSetter;
    }
  },
});

export const decrementPenaltyCards = mutation({
  args: {
    roomName: v.string(),
    userID: v.id("players"),
    decrementvalue: v.number(),
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
      // Update the penalty cards in the gameState
      const updatedPenaltyCards = gameState.penaltyCards || [];
      const existingPlayerIndex = updatedPenaltyCards.findIndex(
        (pc) => pc.playerId === args.userID
      );

      if (existingPlayerIndex !== -1) {
        // Increment the player's points if they exist
        updatedPenaltyCards[existingPlayerIndex].penaltyCards -=
          args.decrementvalue;
      } else {
        // Add a new entry for the player if they don't exist, with the decrement value
        updatedPenaltyCards.push({
          playerId: args.userID,
          penaltyCards: args.decrementvalue, // Initialize with the decrement value
        });
      }

      // Update the players' points in the database
      await ctx.db.patch(id, {
        penaltyCards: updatedPenaltyCards,
      });
      return ctx.db.get(id);
    }
  },
});

export const incrementPenaltyCards = mutation({
  args: {
    roomName: v.string(),
    userID: v.id("players"),
    incrementValue: v.number(),
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
      // Update the penalty cards in the gameState
      const updatedPenaltyCards = gameState.penaltyCards || [];
      const existingPlayerIndex = updatedPenaltyCards.findIndex(
        (pc) => pc.playerId === args.userID
      );

      if (existingPlayerIndex !== -1) {
        // Increment the player's points if they exist
        updatedPenaltyCards[existingPlayerIndex].penaltyCards +=
          args.incrementValue;
      } else {
        // Add a new entry for the player if they don't exist, with the decrement value
        updatedPenaltyCards.push({
          playerId: args.userID,
          penaltyCards: args.incrementValue, // Initialize with the increment value
        });
      }

      // Update the penalty cards in the database
      await ctx.db.patch(id, {
        penaltyCards: updatedPenaltyCards,
      });
      return ctx.db.get(id);
    }
  },
});

export const getPenaltyCards = query({
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

      // Find the penaltyCards
      const penaltyCards = gameState.penaltyCards;

      if (!penaltyCards) {
        return null;
      }

      // Return penaltyCards
      return penaltyCards;
    }
  },
});

export const updateTurnWinner = mutation({
  args: {
    roomName: v.string(),
    userId: v.id("players"),
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
        winner: args.userId,
      });
    }
  },
});

export const updatePlayerTurn = mutation({
  args: {
    roomName: v.string(),
    userId: v.id("players"),
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

    if (gameState.winner) {
      // Update the player turn in the gameState
      await ctx.db.patch(gameState._id, {
        playerTurn: gameState.winner,
      });
    }
  },
});

export const getTurnWinner = query({
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
      const winnerPlayerID = gameState.winner;

      // Return the turnPlayerId
      return winnerPlayerID;
    }
  },
});
