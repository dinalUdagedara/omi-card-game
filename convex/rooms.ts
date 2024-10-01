import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// // Create a new todo with the given data
// export const createtodo = mutation({
//   args: { text: v.string() },
//   handler: async (ctx, args) => {
//     await ctx.db.insert("todos", {
//       text: args.text,
//     });
//   },
// });

// export const getTodos = query({
//   handler: async (ctx) => {
//     return ctx.db.query("todos").collect();
//   },
// });

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
      status: "waiting",
    });
    return roomID;
  },
});

//Joining to a existing room
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
    // Add the new player to the 'players' list in the room
    const playerID = await ctx.db.insert("players", {
      userName: args.userName,
      roomName: args.roomName,
      isCreator: false,
    });

    await ctx.db.patch(room._id, { players: [...room.players, args.userName] });
  },
});

//adding a player to players table
export const addPlayer = mutation({
  args: {
    userName: v.string(),
    roomName: v.string(),
    isCreator: v.boolean(),
  },
  handler: async (ctx, args) => {
    const playerID = await ctx.db.insert("players", {
      userName: args.userName,
      roomName: args.roomName,
      isCreator: args.isCreator,
    });
    return playerID;
  },
});
