import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Query to get room data by room name
export const getRoomData = query({
  args: {
    roomName: v.string(),
  },
  handler: async (ctx, args) => {
    const roomInfo = await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("roomName"), args.roomName))
      .first();
    return roomInfo;
  },
});

// Create a new room with the given data
export const createRoom = mutation({
  args: {
    userName: v.string(),
    isRoomPrivate: v.boolean(),
    roomName: v.string(),
  },
  handler: async (ctx, args) => {
    const roomID = await ctx.db.insert("rooms", {
      roomName: args.roomName,
      isRoomPrivate: args.isRoomPrivate,
      creator: args.userName,
      players: [],
      playerUserNames: [],
      status: "waiting",
    });
    return roomID;
  },
});

// Joining an existing room
export const joinRoom = mutation({
  args: {
    roomName: v.string(),
    userName: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("roomName"), args.roomName))
      .first();

    if (!room) throw new Error("Room not found");

    const playerID = await ctx.db.insert("players", {
      userName: args.userName,
      roomId: room._id, // Reference the room by ID
      isCreator: false,
    });

    // Update the room's players array by adding the new player's ID
    await ctx.db.patch(room._id, { players: [...room.players, playerID] });
    await ctx.db.patch(room._id, {
      playerUserNames: [...room.playerUserNames, args.userName],
    });

    return playerID;
  },
});

// Adding a player to the players table
export const addPlayer = mutation({
  args: {
    userName: v.string(),
    roomId: v.id("rooms"), // Referencing the room by ID
    isCreator: v.boolean(),
  },
  handler: async (ctx, args) => {
    const playerID = await ctx.db.insert("players", {
      userName: args.userName,
      roomId: args.roomId,
      isCreator: args.isCreator,
    });
    return playerID;
  },
});
