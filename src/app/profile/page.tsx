"use client";
import React, { useEffect, useState } from "react";
import { Post } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { BiLoaderCircle } from "react-icons/bi";
import { X } from "lucide-react";

interface FullscreenImageProps {
  post: Post;
  onClose: () => void;
}
const handleDownload = async (imageUrl: string) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "downloaded-image.jpg"; // Set the downloaded file name
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading image:", error);
  }
};
const FullscreenImage: React.FC<FullscreenImageProps> = ({ post, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.9 }}
      className="relative max-w-[90vw] max-h-[90vh]"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/*  button to download the image */}
      <button
        onClick={() => handleDownload(post.url)}
        className="absolute bottom-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v12m0 0l-4-4m4 4l4-4m-6 10h8"
          />
        </svg>
      </button>
      <Image
        src={post.url}
        alt={post.prompt}
        className="w-auto h-auto max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
        width={1920}
        height={1080}
        onClick={(e) => e.stopPropagation()}
      />
    </motion.div>
  </motion.div>
);

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/image");
      const data = await response.json();
      console.log("Fetched Data:", data);

      // Ensure posts is always an array
      if (Array.isArray(data)) {
        setPosts(data);
      } else {
        setPosts([]); // Set to empty array if data is not an array
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]); // Ensure posts is always an array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <main className="pt-20 min-h-screen w-full relative z-0">
      <AnimatePresence>
        {selectedPost && (
          <FullscreenImage
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
          />
        )}
      </AnimatePresence>

      {loading ? (
        <div className="w-full h-[calc(100vh-5rem)] flex items-center justify-center">
          <BiLoaderCircle className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {posts?.map((post, index) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="relative aspect-square group overflow-hidden rounded-lg cursor-pointer"
              key={post.id}
              onClick={() => setSelectedPost(post)}
            >
              <Image
                src={post.url}
                alt={post.prompt}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity p-4">
                <p className="text-white text-sm">{post.prompt}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
}
