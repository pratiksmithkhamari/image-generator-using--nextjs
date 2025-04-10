"use client";

import { motion } from "framer-motion";
import { Sparkles, Camera, Palette, Share2 } from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "AI-Powered Photography",
    description:
      "Transform your ideas into stunning visuals using cutting-edge AI technology.",
  },
  {
    icon: Palette,
    title: "Creative Freedom",
    description:
      "Unleash your creativity with our advanced image generation and editing tools.",
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description:
      "Share your creations with the world through our seamless sharing platform.",
  },
];

const team = [
  {
    name: "John Doe",
    role: "Founder & CEO",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Jane Smith",
    role: "Lead Developer",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Mike Johnson",
    role: "Design Director",
    image:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900/20 via-pink-900/20 to-blue-900/20 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-6">
            About Photogenic
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            We're revolutionizing the way people create and share visual content
            through the power of artificial intelligence.
          </p>
        </motion.div>

        {/* Features Section */}
        <div className="py-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Our Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="glass p-6 rounded-xl hover:scale-105 transition-transform duration-300"
              >
                <feature.icon className="w-12 h-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="py-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="glass p-6 rounded-xl text-center hover:scale-105 transition-transform duration-300"
              >
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse-slow" />
                  <img
                    src={member.image}
                    alt={member.name}
                    className="relative w-full h-full rounded-full object-cover border-4 border-white/10"
                  />
                </div>
                <h3 className="text-xl font-semibold text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-white/70">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="glass p-8 rounded-xl my-16 text-center"
        >
          <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-white/80 max-w-3xl mx-auto">
            To empower everyone to create beautiful, meaningful visual content
            that tells their unique story, making the world more colorful and
            connected through the power of AI-driven creativity.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
