import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { tps, blockTime } = await request.json();

    // Prepare the AI prompt
    const prompt = `
      Based on the following blockchain data:
      - Transactions Per Second (TPS): ${tps}
      - Block Time: ${blockTime.toFixed(2)}

      Generate insights in bullet points. Highlight trends, predictions, and potential network issues.
    `;

    const openaiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a blockchain analyst." },
            { role: "user", content: prompt },
          ],
          max_tokens: 150,
          temperature: 0.7,
        }),
      }
    );

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API Error: ${await openaiResponse.text()}`);
    }

    const { choices } = await openaiResponse.json();
    const insights = choices[0]?.message.content
      .trim()
      .split("\n")
      .filter((line: string) => line.trim().length > 0);

    return NextResponse.json({ insights });
  } catch (error) {
    console.error("AI Insights API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 }
    );
  }
}
