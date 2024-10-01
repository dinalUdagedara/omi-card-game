import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  players: defineTable({
    isCreator: v.boolean(),
    roomId: v.id("rooms"),
    userName: v.string(),
  }),
  rooms: defineTable({
    creator: v.string(),
    isRoomPrivate: v.boolean(),
    players: v.array(v.id("players")),
    playerUserNames: v.array(v.string()),
    roomName: v.string(),
    status: v.string(),
  }),
});
