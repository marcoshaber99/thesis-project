import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    userId: v.string(),
    isArchived: v.boolean(),
    parentDocument: v.optional(v.id("documents")),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.boolean(),
    organizationId: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_user_parent", ["userId", "parentDocument"])
    .index("by_organization", ["organizationId"])
    .index("by_organization_parent", ["organizationId", "parentDocument"]),

  userSubscription: defineTable({
    userId: v.string(),
    stripeCustomerId: v.string(),
    stripeSubscriptionId: v.string(),
    stripePriceId: v.string(),
    stripeCurrentPeriodEnd: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_subscription", ["stripeSubscriptionId"]),
});
