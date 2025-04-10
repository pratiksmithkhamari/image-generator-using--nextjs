"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BiLoaderCircle } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Sparkles,
  Wand2,
  Image as ImageIcon,
  Download,
} from "lucide-react";
import StoryGenerator from "@/components/StoryGenerator";

const formSchema = z.object({
  prompt: z
    .string()
    .min(10, "Prompt must be at least 10 characters")
    .max(500, "Prompt must be less than 500 characters"),
});

type FormData = z.infer<typeof formSchema>;

export default function CreatePage() {
  const { data: session, status } = useSession();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUsedPrompt, setLastUsedPrompt] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  if (status === "unauthenticated") {
    redirect("/");
  }

  const promptValue = watch("prompt") || "";

  const onSubmit = async (data: FormData) => {
    try {
      setIsGenerating(true);
      setError(null);
      setGeneratedImage(null);
      setLastUsedPrompt(data.prompt);

      const response = await fetch("/api/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: data.prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const result = await response.json();
      setGeneratedImage(result.url);
      reset();
    } catch (error) {
      setError("Failed to generate image. Please try again.");
      console.error("Error generating image:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `photogenic-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Create Your{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Masterpiece
            </span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Transform your imagination into stunning visuals using our advanced
            AI image generation technology.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-6 rounded-xl"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-white/70 mb-2">Your Prompt</label>
                <div className="relative">
                  <textarea
                    {...register("prompt")}
                    placeholder="Describe the image you want to create..."
                    className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent resize-none"
                  />
                  <div className="absolute bottom-3 right-3 text-white/30 text-sm">
                    {errors.prompt ? (
                      <span className="text-red-400">
                        {errors.prompt.message}
                      </span>
                    ) : (
                      `${promptValue.length}/500`
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <BiLoaderCircle className="animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-2" />
                    Generate Image
                  </>
                )}
              </button>
            </form>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400"
              >
                {error}
              </motion.div>
            )}
          </motion.div>

          {/* Preview Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-6 rounded-xl"
          >
            <div className="aspect-square relative rounded-lg overflow-hidden bg-white/5">
              <AnimatePresence>
                {generatedImage ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full h-full"
                  >
                    <img
                      src={generatedImage}
                      alt="Generated image"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <button
                          onClick={handleDownload}
                          className="w-full flex items-center justify-center px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300"
                        >
                          <Download className="w-5 h-5 mr-2" />
                          Download Image
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full text-white/30"
                  >
                    <ImageIcon className="w-12 h-12 mb-4" />
                    <p>Your generated image will appear here</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 glass p-6 rounded-xl"
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
            Tips for Better Results
          </h2>
          <ul className="space-y-3 text-white/70">
            <li>• Be specific about the style, colors, and mood you want</li>
            <li>
              • Include details about lighting, composition, and perspective
            </li>
            <li>
              • Mention any specific artists or art styles you want to reference
            </li>
            <li>• Use descriptive adjectives to enhance the visual quality</li>
            <li>• Keep your prompt clear and concise for best results</li>
          </ul>
        </motion.div>

        {/* Story Generator Section - Only show when image is generated */}
        {generatedImage && (
          <StoryGenerator prompt={lastUsedPrompt} imageUrl={generatedImage} />
        )}
      </div>
    </div>
  );
}
