import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

type Gender = "male" | "female" | "other";
type SurveyFields =
  | "attractiveness"
  | "perspicuity"
  | "efficiency"
  | "dependability"
  | "stimulation"
  | "novelty";
type SurveyResult = {
  _id: string;
  _creationTime: number;
  userId: string;
  attractiveness: string;
  perspicuity: string;
  efficiency: string;
  dependability: string;
  stimulation: string;
  novelty: string;
  feedback: string;
  age: string;
  gender: Gender;
  createdAt: number;
};

export const submitSurvey = mutation({
  args: {
    userId: v.string(),
    attractiveness: v.string(),
    perspicuity: v.string(),
    efficiency: v.string(),
    dependability: v.string(),
    stimulation: v.string(),
    novelty: v.string(),
    feedback: v.string(),
    age: v.string(),
    gender: v.union(v.literal("male"), v.literal("female"), v.literal("other")),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("surveys", {
      ...args,
      createdAt: Date.now(),
    });
    return { status: "success" };
  },
});

export const getResults = query(async (ctx) => {
  const results = (await ctx.db.query("surveys").collect()) as SurveyResult[];

  const satisfactionFields: SurveyFields[] = [
    "attractiveness",
    "perspicuity",
    "efficiency",
    "dependability",
    "stimulation",
    "novelty",
  ];

  const satisfaction: Record<SurveyFields, number[]> =
    satisfactionFields.reduce((acc, field) => {
      acc[field] = [0, 0, 0, 0, 0, 0, 0];
      return acc;
    }, {} as Record<SurveyFields, number[]>);

  const age = [0, 0, 0, 0, 0];
  const gender: Record<Gender, number> = { male: 0, female: 0, other: 0 };

  results.forEach((result) => {
    satisfactionFields.forEach((field) => {
      satisfaction[field][parseInt(result[field], 10) - 1]++;
    });

    const ageIndex = ["18-24", "25-29", "30-39", "40-49", "50+"].indexOf(
      result.age
    );
    if (ageIndex !== -1) {
      age[ageIndex]++;
    }
    gender[result.gender]++;
  });

  const feedback = results.map((result) => result.feedback).filter((f) => f);

  return { satisfaction, age, gender, feedback, results };
});
