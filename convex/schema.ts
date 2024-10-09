import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  players: defineTable({
    isCreator: v.boolean(),
    roomId: v.id("rooms"),
    userName: v.string(),
    status:v.string(),
  }),
  rooms: defineTable({
    creator: v.string(),
    isRoomPrivate: v.boolean(),
    players: v.array(v.id("players")),
    playerUserNames: v.array(v.string()),
    roomName: v.string(),
    status: v.string(),
  }),
  gameStates: defineTable({
    roomId: v.id("rooms"), // Reference to the room
    players: v.array(
      // v.id("players")
      v.object({
        playerId: v.id("players"), // Reference to the player
        teamNumber: v.number(),
      })
    ),
    penaltyCards: v.array(
      v.object({
        teamNo: v.number(), // Reference to the player
        penaltyCards: v.number(),
      })
    ),
    playersDecks: v.array(
      v.object({
        playerId: v.id("players"), // Reference to the player
        deck: v.array(v.object({ suit: v.string(), value: v.string() })), // Deck of cards
      })
    ),
    playersCards: v.array(
      v.object({
        playerId: v.id("players"), // Reference to the player
        teamInfo: v.object({
          teamNum: v.number(),
          index: v.number(),
        }),
        card: v.object({
          suit: v.string(),
          value: v.string(),
        }),
      })
    ),
    teamPoints: v.object({
      team1: v.number(),
      team2: v.number(),
    }),
    playerTurn: v.union(v.id("players"), v.null()),
    points: v.array(
      v.object({
        playerId: v.id("players"), // Reference to the player
        points: v.number(),
      })
    ),
    roundWinner: v.optional(v.union(v.id("players"), v.null())),
    winner: v.optional(v.union(v.id("players"), v.null())),
    currentRound: v.number(),
    trump: v.optional(v.union(v.string(), v.null())),
    trumpSetter: v.union(v.id("players"), v.null()),
    turnSuit: v.optional(v.union(v.string(), v.null())),
  }),
});
