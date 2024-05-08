import { v } from "convex/values";
import { internalMutation, internalQuery, query } from "./_generated/server";

export const getByUserId = internalQuery({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userSubscription")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();
  },
});

export const getIsSubscribed = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const userSubscription = await ctx.db
      .query("userSubscription")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();

    const periodEnd = userSubscription?.stripeCurrentPeriodEnd;
    const isSubscribed = periodEnd && periodEnd > Date.now();

    return isSubscribed;
  },
});

export const create = internalMutation({
  args: {
    userId: v.string(),
    stripePriceId: v.string(),
    stripeCustomerId: v.string(),
    stripeSubscriptionId: v.string(),
    stripeCurrentPeriodEnd: v.number(),
  },
  handler: async (
    ctx,
    {
      userId,
      stripePriceId,
      stripeCustomerId,
      stripeSubscriptionId,
      stripeCurrentPeriodEnd,
    }
  ) => {
    return await ctx.db.insert("userSubscription", {
      userId,
      stripePriceId,
      stripeCustomerId,
      stripeSubscriptionId,
      stripeCurrentPeriodEnd,
    });
  },
});

export const update = internalMutation({
  args: {
    stripeSubscriptionId: v.string(),
    stripeCurrentPeriodEnd: v.number(),
  },
  handler: async (ctx, { stripeSubscriptionId, stripeCurrentPeriodEnd }) => {
    try {
      const existingSubscription = await ctx.db
        .query("userSubscription")
        .withIndex("by_subscription", (q) =>
          q.eq("stripeSubscriptionId", stripeSubscriptionId)
        )
        .unique();

      if (!existingSubscription) {
        throw new Error("Subscription not found");
      }

      await ctx.db.patch(existingSubscription._id, {
        stripeCurrentPeriodEnd,
      });

      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false };
    }
  },
});
