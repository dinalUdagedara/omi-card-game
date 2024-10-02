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

    // Check if the player is already in the room
    const existingPlayer = await ctx.db
      .query("players")
      .filter((q) => q.eq(q.field("userName"), args.userName))
      .first();

    if (existingPlayer) {
      // Player already exists, return their ID or a message
      // Update the room's players array by adding the new player's ID
      await ctx.db.patch(room._id, {
        players: [...room.players, existingPlayer._id],
      });
      await ctx.db.patch(room._id, {
        playerUserNames: [...room.playerUserNames, args.userName],
      });

      return existingPlayer._id; // or return a message indicating the player is already in the room
    } else {
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
    }
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

// Query to get the room creator's ID by room name
export const getRoomCreator = query({
  args: {
    roomName: v.string(),
  },
  handler: async (ctx, args) => {
    const roomInfo = await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("roomName"), args.roomName))
      .first();

    // Check if the room exists
    if (!roomInfo) {
      throw new Error("Room not found");
    }

    // Return the creator's userName
    return roomInfo.creator;
  },
});

// Query to get the player's ID by username
export const getPlayerIdByUserName = query({
  args: {
    userName: v.string(),
  },
  handler: async (ctx, args) => {
    const playerInfo = await ctx.db
      .query("players")
      .filter((q) => q.eq(q.field("userName"), args.userName))
      .first();

    // Check if the player exists
    if (!playerInfo) {
      throw new Error("Player not found");
    }

    // Return the player's ID
    return playerInfo._id; // Assuming _id is the field for the player's ID
  },
});

export const getAllPlayersIDInTheRoom = query({
  args: {
    roomName: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("roomName"), args.roomName))
      .first();
    // Check if the player exists
    if (!room) {
      throw new Error("room not found");
    }
    return room?.players;
  },
});
