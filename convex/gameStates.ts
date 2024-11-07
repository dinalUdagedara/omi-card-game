import { mutation, MutationCtx, query } from "./_generated/server";
import { v } from "convex/values";

export const createGameState = mutation({
  args: {
    roomName: v.string(),
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
    console.log("Creating state");
    // Fetch room data using the room name
    const roomInfo = await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("roomName"), args.roomName))
      .first();

    // Check if the room exists
    if (!roomInfo) {
      return null;
    }

    // Check if a game state already exists for the room
    const existingGameState = await ctx.db
      .query("gameStates")
      .filter((q) => q.eq(q.field("roomId"), roomInfo._id))
      .first();

    // If a game state already exists
    if (existingGameState) {
      console.log("Existing game state found");
      console.log("gamestate.status", existingGameState.status);
      return null;
    }

    // Assign players to teams
    const playersWithTeams = args.players.map((playerId, index) => ({
      playerId,
      teamNumber: index % 2 === 0 ? 1 : 2, // Team 1 for indices 0 and 2, Team 2 for 1 and 3
    }));

    // Initialize penalty cards for each team with default value
    const penaltyCards = [
      { teamNo: 1, penaltyCards: 10 }, // Team 1
      { teamNo: 2, penaltyCards: 10 }, // Team 2
    ];

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
      violationOccured: [],
      status: "started",
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
      return null;
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
        return null;
      }

      // Find the player's card set from playersCards
      const playerCardSet = gameState.playersDecks.find(
        (deck) => deck.playerId === args.playerId
      );

      // Check if the player has a card set
      if (!playerCardSet) {
        return null;
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
      return null;
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

export const updateViolationOccured = mutation({
  args: {
    roomName: v.string(),
    userName: v.string(),
    teamNumber: v.number(),
    violation: v.string(),
  },

  handler: async (ctx, args) => {
    const room = await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("roomName"), args.roomName))
      .first();

    if (!room) {
      return null;
    }

    const gameState = await ctx.db
      .query("gameStates")
      .filter((q) => q.eq(q.field("roomId"), room?._id))
      .first();

    if (!gameState) {
      return null;
    }

    const newViolation = {
      userName: args.userName,
      teamNumber: args.teamNumber,
      violation: args.violation,
    };

    // Append the new violation to the existing violations array
    const updatedViolations = [...gameState.violationOccured, newViolation];

    const id = gameState?._id;
    if (id) {
      await ctx.db.patch(id, {
        violationOccured: updatedViolations,
      });
    }
  },
});

export const resetViolations = mutation({
  args: {
    roomName: v.string(),
  },

  handler: async (ctx, args) => {
    const room = await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("roomName"), args.roomName))
      .first();

    if (!room) {
      return null;
    }

    const gameState = await ctx.db
      .query("gameStates")
      .filter((q) => q.eq(q.field("roomId"), room?._id))
      .first();

    if (!gameState) {
      return null;
    }

    const id = gameState?._id;
    if (id) {
      await ctx.db.patch(id, {
        violationOccured: [],
      });
    }
  },
});

export const getViolations = query({
  args: {
    teamNumber: v.number(),
    roomName: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("roomName"), args.roomName))
      .first();

    if (!room) {
      return null;
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
        return null;
      }

      // Find the violation from violations
      const violationInfo = gameState.violationOccured.filter(
        (violation) => violation.teamNumber === args.teamNumber
      );

      // Check if the team has any violations
      if (!violationInfo) {
        return null;
      }

      // Return the violation
      return violationInfo;
    }
  },
});

export const updateGameStateStatus = mutation({
  args: {
    userid: v.id("players"),
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

    const roomID = room?._id;

    if (roomID) {
      // Fetch game states where the roomId equals the given roomID and status is not "game-over"
      const gameState = await ctx.db
        .query("gameStates")
        .filter(
          (q) =>
            q.eq(q.field("roomId"), roomID) &&
            q.neq(q.field("status"), "game-over")
        )
        .first();

      if (!gameState) {
        return null;
      }

      if (gameState) {
        await ctx.db.patch(gameState._id, {
          status: "game-over",
        });
      }

      console.log(gameState);
    }
  },
});

export const isGameOver = query({
  args: {
    userid: v.union(v.id("players"), v.null()),
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

    const roomID = room?._id;

    if (roomID) {
      // Fetch game states where the roomId equals the given roomID and status is not "game-over"
      const gameState = await ctx.db
        .query("gameStates")
        .filter((q) => q.eq(q.field("roomId"), roomID))
        .first();

      if (!gameState) {
        return null;
      }

      if (gameState.status === "game-over") {
        return true;
      } else {
        return false;
      }
    }
  },
});

export const removeUserFromGameState = mutation({
  args: {
    userid: v.id("players"),
    roomName: v.string(),
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

    // Fetch the game state associated with the room
    const gameState = await ctx.db
      .query("gameStates")
      .filter((q) => q.eq(q.field("roomId"), roomInfo._id))
      .first();

    // Check if a game state exists for the room
    if (!gameState) {
      return null;
    }

    // Find the player in the game state and remove them
    const updatedPlayers = gameState.players.filter(
      (player) => player.playerId !== args.userid
    );

    // If no players remain, delete the game state
    if (updatedPlayers.length === 0) {
      await ctx.db.delete(gameState._id);
      if (roomInfo._id) {
        // Update the rooms's status in the players table to "waiting"
        await ctx.db.patch(roomInfo._id, {
          status: "waiting",
        });
      }
      return { message: "Game state deleted because no players are left." };
    }

    // Update the game state with the new players array
    await ctx.db.patch(gameState._id, {
      players: updatedPlayers,
    });

    // Update the player's status to "waiting" in the players table
    await ctx.db.patch(args.userid, {
      status: "waiting",
    });

    return {
      message: "User removed from game state and status updated to 'waiting'.",
      updatedPlayers,
    };
  },
});

export const removeUserFromGameStateAndRoom = mutation({
  args: {
    userid: v.id("players"),
    roomName: v.string(),
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

    const roomId = roomInfo._id;

    // Fetch the game state associated with the room
    const gameState = await ctx.db
      .query("gameStates")
      .filter((q) => q.eq(q.field("roomId"), roomId))
      .first();

    // Check if the game state exists
    if (gameState) {
      // Remove the player from the game state players list
      const updatedGameStatePlayers = gameState.players.filter(
        (player) => player.playerId !== args.userid
      );

      // If no players are left in the game state, delete it
      if (updatedGameStatePlayers.length === 0) {
        await ctx.db.delete(gameState._id);

        if (roomInfo._id) {
          // Update the rooms's status in the players table to "waiting"
          await ctx.db.patch(roomInfo._id, {
            status: "waiting",
          });
        }
      } else {
        // Update the game state if players remain
        await ctx.db.patch(gameState._id, {
          players: updatedGameStatePlayers,
        });
      }
    }

    // Remove the player from the room's players list
    const updatedRoomPlayers = roomInfo.players.filter(
      (playerId) => playerId !== args.userid
    );

    const updatedPlayerUserNames = roomInfo.playerUserNames.filter(
      (userName, index) => roomInfo.players[index] !== args.userid
    );

    // If no players are left in the room, delete the room
    if (updatedRoomPlayers.length === 0) {
      await ctx.db.delete(roomInfo._id);
    } else {
      // Update the room with the new list of players and usernames
      await ctx.db.patch(roomInfo._id, {
        players: updatedRoomPlayers,
        playerUserNames: updatedPlayerUserNames,
      });
    }

    // Update the player's status in the players table to "waiting"
    await ctx.db.patch(args.userid, {
      status: "waiting",
    });

    return {
      message:
        "User removed from both game state and room. Player status updated to 'waiting'.",
    };
  },
});
