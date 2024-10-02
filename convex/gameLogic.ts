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
      console.log(await ctx.db.get(id));
    }
  },
});
