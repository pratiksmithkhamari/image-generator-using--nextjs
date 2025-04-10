import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with your API key
const apiKey = process.env.GEMINI_API_KEY || "";
console.log("API Key available:", !!apiKey); // Log whether the key is available, not the actual key
const genAI = new GoogleGenerativeAI(apiKey);

// Fallback function in case Gemini API fails
function generateFallbackStory(prompt: string): string {
  const storyStarters = [
    "In a world where dreams come alive,",
    "Beyond the horizon of imagination,",
    "Deep within the realms of wonder,",
    "Once upon a digital canvas,",
    "In the tapestry of creation,",
  ];

  const midSections = [
    "a vision emerged that captured the essence of",
    "colors danced and shapes converged to reveal",
    "light and shadow played together to craft",
    "the boundaries between reality and fantasy blurred into",
    "elements of wonder combined to manifest",
  ];

  const endings = [
    "a story waiting to be told.",
    "a moment frozen in infinite possibility.",
    "a glimpse into another world.",
    "a memory not yet experienced.",
    "a dream made visible.",
  ];

  // Use parts of the prompt to personalize the story
  const cleanPrompt = prompt.replace(
    /style of|in the style of|like a|looking like/gi,
    ""
  );
  const promptWords = cleanPrompt.split(" ").filter((word) => word.length > 3);
  const selectedWords =
    promptWords.length > 2
      ? [
          promptWords[Math.floor(Math.random() * promptWords.length)],
          promptWords[Math.floor(Math.random() * promptWords.length)],
        ]
      : promptWords;

  const randomStart =
    storyStarters[Math.floor(Math.random() * storyStarters.length)];
  const randomMid = midSections[Math.floor(Math.random() * midSections.length)];
  const randomEnd = endings[Math.floor(Math.random() * endings.length)];

  // Create a 3-paragraph story
  const paragraph1 = `${randomStart} ${randomMid} ${selectedWords.join(
    " and "
  )}. ${randomEnd}`;

  const paragraph2 = `The image reveals ${
    prompt.toLowerCase().includes("vibrant") ? "vibrant" : "subtle"
  } details that tell of ${
    prompt.toLowerCase().includes("adventure")
      ? "an epic adventure"
      : prompt.toLowerCase().includes("nature")
      ? "nature's beauty"
      : prompt.toLowerCase().includes("city")
      ? "urban wonders"
      : "a fascinating narrative"
  }. Each element carefully placed, each color deliberately chosen.`;

  const paragraph3 = `What stories do you see in this creation? Perhaps you glimpse ${
    prompt.toLowerCase().includes("dream")
      ? "a dream not yet dreamt"
      : prompt.toLowerCase().includes("fantasy")
      ? "a fantasy realm waiting to be explored"
      : prompt.toLowerCase().includes("future")
      ? "a future full of possibility"
      : "memories waiting to be made"
  }. This image isn't just a picture—it's a doorway to endless stories.`;

  return `${paragraph1}\n\n${paragraph2}\n\n${paragraph3}`;
}

export async function POST(request: NextRequest) {
  console.log("Story API route called");

  try {
    // Add CORS headers
    const origin = request.headers.get("origin") || "";
    const headers = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    // Handle preflight requests
    if (request.method === "OPTIONS") {
      return new NextResponse(null, { status: 204, headers });
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "You are Unauthorized" },
        { status: 401, headers }
      );
    }

    const {
      prompt: originalPrompt,
      imageUrl,
      tone = "magical",
    } = await request.json();

    // Use a default prompt if the original is empty
    const prompt =
      originalPrompt && originalPrompt.trim()
        ? originalPrompt
        : "An AI-generated image with elements that are open to interpretation";

    if (!imageUrl) {
      return NextResponse.json(
        { error: "ImageUrl is required" },
        { status: 400, headers }
      );
    }

    // Now add another debug log
    console.log("Request body received:", {
      originalPrompt,
      prompt: prompt, // This might be the default prompt if original was empty
      imageUrl,
      tone,
    });

    try {
      // For debugging, let's first try to use the fallback function
      // until we confirm the API issue is fixed
      let story = "";

      try {
        // Get the generative model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Special handling for empty API key
        if (!apiKey) {
          console.error("No Gemini API key provided");
          throw new Error(
            "Gemini API key is missing. Please add a valid API key to your .env.local file."
          );
        }

        // Create tone-specific guidance for the AI
        let toneGuidance = "";

        switch (tone) {
          case "adventurous":
            toneGuidance =
              "The story should have an adventurous tone with elements of exploration, discovery, and excitement.";
            break;
          case "magical":
            toneGuidance =
              "The story should have a magical tone with elements of wonder, enchantment, and the supernatural.";
            break;
          case "dramatic":
            toneGuidance =
              "The story should have a dramatic tone with emotional depth, tension, and meaningful character moments.";
            break;
          case "mysterious":
            toneGuidance =
              "The story should have a mysterious tone with elements of intrigue, unanswered questions, and subtle hints.";
            break;
          case "romantic":
            toneGuidance =
              "The story should have a romantic tone with elements of connection, emotion, and beauty.";
            break;
          default:
            toneGuidance =
              "The story should be evocative and imaginative, with rich details and an engaging narrative.";
        }

        // Simplify the prompt to avoid any potential issues
        const storyPrompt = `Write a short story based on this image: "${prompt}". Make it ${tone}.`;

        console.log("Calling Gemini API with prompt:", storyPrompt);

        // Generate content
        const result = await model.generateContent(storyPrompt);
        const response = await result.response;
        story = response.text();
        console.log("Gemini API response:", story);

        if (!story || story.trim() === "") {
          throw new Error("Empty response from Gemini API");
        }
      } catch (apiError) {
        console.error("Gemini API error:", apiError);

        // Check if we're seeing an API key error
        if (apiError instanceof Error && apiError.message.includes("API key")) {
          throw apiError; // Let this error propagate up
        }

        // Fall back to the template-based story generator otherwise
        story = generateFallbackStory(prompt);
      }

      return NextResponse.json({ story }, { headers });
    } catch (error) {
      console.error("Error generating story:", error);
      // If all else fails, return a simple fallback story
      const fallbackStory = generateFallbackStory(prompt);
      return NextResponse.json({ story: fallbackStory }, { headers });
    }
  } catch (error) {
    console.error("Server error:", error);
    const origin = request.headers.get("origin") || "";
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  }
}

// Also add an OPTIONS handler for CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") || "";

  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
