"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Book, Copy, Sparkles, Share2, RefreshCw } from "lucide-react";

interface StoryGeneratorProps {
  prompt: string;
  imageUrl: string | null;
}

type StoryTone =
  | "adventurous"
  | "magical"
  | "dramatic"
  | "mysterious"
  | "romantic";

export default function StoryGenerator({
  prompt,
  imageUrl,
}: StoryGeneratorProps) {
  const [story, setStory] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [tone, setTone] = useState<StoryTone>("magical");

  // Log the props for debugging
  console.log("StoryGenerator loaded with props:", { prompt, imageUrl });

  const generateStory = async (selectedTone: StoryTone = tone) => {
    if (!imageUrl) return;

    try {
      setIsGenerating(true);
      setError(null);

      // Check for empty prompt early and provide a helpful message
      if (!prompt || !prompt.trim()) {
        console.error("Empty prompt detected for generating story");
        setError(
          "Cannot generate a story without an image description. The prompt used for image generation was empty."
        );
        setIsGenerating(false);
        return;
      }

      console.log("Generating story with:", {
        prompt,
        imageUrl,
        tone: selectedTone,
      });

      const response = await fetch("/api/story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          imageUrl,
          tone: selectedTone,
        }),
      });

      console.log("API response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(
          `Failed to generate story: ${response.status} ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Story data received:", data);

      if (!data.story) {
        throw new Error("No story received from API");
      }

      setStory(data.story);
    } catch (error) {
      console.error("Error generating story:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setError(`Failed to generate story: ${errorMessage}. Please try again.`);

      // Fallback to a simple message if API completely fails
      if (isGenerating) {
        setIsGenerating(false);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!story) return;

    navigator.clipboard
      .writeText(story)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy story:", err);
      });
  };

  const shareStory = async () => {
    if (!story || !imageUrl) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "A Story Created with Photogenic & Gemini AI",
          text: story,
          url: window.location.href,
        });
      } else {
        // Fallback for browsers that don't support the Web Share API
        copyToClipboard();
      }
    } catch (error) {
      console.error("Error sharing story:", error);
    }
  };

  const regenerateWithTone = (newTone: StoryTone) => {
    setTone(newTone);
    generateStory(newTone);
  };

  if (!imageUrl) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-8 glass p-6 rounded-xl"
    >
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
        <Book className="w-5 h-5 mr-2 text-purple-400" />
        Generate a Story with Gemini AI
      </h2>

      {!story ? (
        <div className="space-y-4">
          {!prompt || !prompt.trim() ? (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-400">
              <p>⚠️ No image description available.</p>
              <p className="mt-2">
                To generate a story, please provide a detailed prompt when
                creating your image.
              </p>
            </div>
          ) : (
            <>
              <p className="text-white/70">
                Let Gemini AI create a unique story inspired by your image.
                Choose a tone for your story:
              </p>

              <div className="flex flex-wrap gap-2">
                {(
                  [
                    "adventurous",
                    "magical",
                    "dramatic",
                    "mysterious",
                    "romantic",
                  ] as StoryTone[]
                ).map((storyTone) => (
                  <button
                    key={storyTone}
                    onClick={() => setTone(storyTone)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      tone === storyTone
                        ? "bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white"
                        : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                    }`}
                  >
                    {storyTone.charAt(0).toUpperCase() + storyTone.slice(1)}
                  </button>
                ))}
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  console.log("Generate button clicked");
                  generateStory();
                }}
                disabled={isGenerating || !prompt || !prompt.trim()}
                className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
              >
                {isGenerating ? (
                  <>
                    <div className="h-5 w-5 mr-2 border-t-2 border-b-2 border-white rounded-full animate-spin" />
                    Generating Story...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate {tone.charAt(0).toUpperCase() + tone.slice(1)}{" "}
                    Story
                  </>
                )}
              </button>
            </>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400"
            >
              {error}
            </motion.div>
          )}
        </div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-white/80 whitespace-pre-line relative">
              {story}

              <button
                onClick={copyToClipboard}
                className="absolute top-3 right-3 p-2 text-white/50 hover:text-white/90 transition-colors"
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4" />
                {copied && (
                  <span className="absolute -top-2 -right-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                    Copied!
                  </span>
                )}
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setStory(null)}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Different Tone
              </button>

              <button
                onClick={() => regenerateWithTone(tone)}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 transition-all duration-300 flex items-center"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Regenerate
              </button>

              <button
                onClick={shareStory}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Story
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
}
