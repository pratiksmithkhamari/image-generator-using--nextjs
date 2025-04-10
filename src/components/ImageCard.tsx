"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Download, Calendar } from "lucide-react";

interface ImageCardProps {
  id: string;
  url: string;
  prompt: string;
  createdAt: string;
}

export default function ImageCard({ url, prompt, createdAt }: ImageCardProps) {
  const handleDownload = async () => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `image-${id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group overflow-hidden rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
    >
      <div className="aspect-square relative">
        <Image
          src={url}
          alt={prompt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-white text-sm line-clamp-2 mb-2">{prompt}</p>
          <div className="flex items-center text-white/70 text-xs">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
      <button
        onClick={handleDownload}
        className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70"
      >
        <Download className="w-5 h-5" />
      </button>
    </motion.div>
  );
}
