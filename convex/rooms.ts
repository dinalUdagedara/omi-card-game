import { argv } from "process";
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

// Query to check if public rooms are empty
export const checkIfPublicRoomsEmpty = query({
  handler: async (ctx) => {
    // Fetch all public rooms (where isRoomPrivate is false)
    const publicRooms = await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("isRoomPrivate"), false))
      .collect();

    // If no public rooms exist, consider the public rooms as "empty"
    if (publicRooms.length === 0) {
      return true;
    }

    // Filter the public rooms that have no players
    const emptyPublicRooms = publicRooms.filter(
      (room) => room.players.length === 0
    );

    // Return true if all public rooms are empty, false otherwise
    return emptyPublicRooms.length === publicRooms.length;
  },
});

export const isOpponentJoined = query({
  args: {
    roomName: v.string(),
  },
  handler: async (ctx, args) => {
    const roomInfo = await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("roomName"), args.roomName))
      .first();

    if (roomInfo) return roomInfo.players.length > 1;
  },
});

export const isRoomCreator = query({
  args: {
    roomName: v.string(),
    userName: v.string(),
  },
  handler: async (ctx, args) => {
    const roomInfo = await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("roomName"), args.roomName))
      .first();

    if (roomInfo) return roomInfo.creator === args.userName;
  },
});

export const getOpponentsName = query({
  args: {
    roomName: v.string(),
    userName: v.string(),
  },
  handler: async (ctx, args) => {
    // Fetch the current user's ID
    const myUserID = await ctx.db
      .query("players")
      .filter((q) => q.eq(q.field("userName"), args.userName))
      .first();

    if (!myUserID) {
      throw new Error("User not found"); // Handle case where user is not found
    }

    // Fetch room info based on room name
    const roomInfo = await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("roomName"), args.roomName))
      .first();

    if (!roomInfo) {
      throw new Error("Room not found"); // Handle case where room is not found
    }

    // Find the opponent's ID (the only other player in the room)
    const opponentID = roomInfo.players.find(
      (player) => player !== myUserID._id // Find the player that is not the current user
    );

    if (!opponentID) {
      throw new Error("Opponent not found"); // Handle case where opponent is not found
    }

    // Fetch the opponent's name
    const opponent = await ctx.db
      .query("players")
      .filter((q) => q.eq(q.field("_id"), opponentID))
      .first();

    return opponent ? opponent.userName : null; // Return the opponent's name or null if not found
  },
});

// Query to get all public rooms with at least one player
export const getAllActivePublicRooms = query({
  handler: async (ctx) => {
    // Fetch all public rooms where `isRoomPrivate` is false and `players` array is not empty
    const activePublicRooms = await ctx.db
      .query("rooms")
      .filter((q) =>
        q.and(
          q.eq(q.field("isRoomPrivate"), false), // Public rooms
          q.eq(q.field("status"), "waiting") // Public rooms
        )
      )
      .collect();

    console.log("activePublicRooms", activePublicRooms);

    // Filter for rooms with 0 or 1 player
    const waitingJoinableRooms = activePublicRooms.filter((room) => {
      // Check the length of players; it should be 0 or 1
      const playerCount = room.players.length;
      return playerCount === 0 || playerCount === 1;
    });

    return waitingJoinableRooms;
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

// update the gamestate to joined
export const updateRoomStatustoJoined = mutation({
  args: {
    roomName: v.string(), // Referencing the room by ID
  },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("roomName"), args.roomName))
      .first();

    if (room) {
      await ctx.db.patch(room._id, {
        status: "joined",
      });
    }
  },
});

export const removeCreator = mutation({
  args: {
    roomName: v.string(), // Referencing the room by ID
  },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("roomName"), args.roomName))
      .first();
    if (room)
      // Update the trumpSetter with the other player's username
      await ctx.db.patch(room._id, {
        creator: "", // Update with username
      });
  },
});

export const updateCreator = mutation({
  args: {
    roomName: v.string(), // Referencing the room by ID
  },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("roomName"), args.roomName))
      .first();

    const currentTrumpSetter = room?.creator; // Assuming creator is the username
    const players = room?.playerUserNames; // Assuming 'players' is an array of usernames

    if (!currentTrumpSetter || !players || players.length < 2) {
      throw new Error("Insufficient data to update trump setter");
    }

    // Determine the other player
    const otherPlayer = players.find(
      (username) => username !== currentTrumpSetter
    );

    if (!otherPlayer) {
      throw new Error("Other player not found");
    }

    // Update the trumpSetter with the other player's username
    await ctx.db.patch(room._id, {
      creator: otherPlayer, // Update with username
    });
  },
});

export const isPlayersJoined = query({
  args: {
    roomName: v.string(),
  },
  handler: async (ctx, args) => {
    const roomInfo = await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("roomName"), args.roomName))
      .first();

    if (roomInfo) return roomInfo.status === "joined";
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
