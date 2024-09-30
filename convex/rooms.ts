import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new room with the given data
export const createtodo = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("todos", {
      text: args.text,
    });
  },
});

export const getTodos = query({
  handler: async (ctx) => {
    return ctx.db.query("todos").collect();
  },
});


export const createRoom = mutation(async ({ db }, { userName, isRoomPrivate,  roomName}) => {
    console.log("Room Name:", roomName);
console.log("Is Private:", isRoomPrivate);
console.log("User Name:", userName);

  const roomId = await db.insert('rooms', {
    roomName,
    isRoomPrivate,
    creator:userName,
    players: [userName],
    status: 'waiting',
  });
  return roomId;
});
