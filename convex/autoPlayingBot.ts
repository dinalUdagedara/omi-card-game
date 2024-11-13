import { internalMutation, mutation } from "./_generated/server";
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
