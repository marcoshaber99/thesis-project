import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
      stop: null,
      temperature: 0.7,
    });

    // Extract the content from the response and remove the surrounding quotation marks
    const content = response.choices[0]?.message?.content?.replace(
      /^"(.*)"$/,
      "$1"
    );

    return new Response(JSON.stringify(content), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    });
  } catch (error) {
    console.error("[AI_COMPLETION_POST]", error);
    return new Response("An error occurred during your request.", {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
