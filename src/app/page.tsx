"use client";

import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Palette,
  Share2,
  ArrowRight,
  Zap,
  Shield,
  Users,
  Wand2,
} from "lucide-react";

const features = [
  {
    icon: Palette,
    title: "Creative Freedom",
    description:
      "Unleash your creativity with our advanced image generation and editing tools. Customize every aspect of your images.",
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description:
      "Share your creations with the world through our seamless sharing platform. Connect with other artists and creators.",
  },
];

const benefits = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Generate high-quality images in seconds using our optimized AI technology.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your creations are safe with us. We use industry-standard encryption to protect your data.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description:
      "Join a vibrant community of artists, designers, and creative minds.",
  },
];

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen">
      {/* Animated Background */}
      <div className="animated-bg" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Transform Your Ideas
              </span>
              <br />
              <span className="text-white">Into Visual Art</span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Create stunning images with the power of AI. Turn your imagination
              into reality with Photogenic.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/create"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/20"
              >
                Start Creating
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/gallery"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                View Gallery
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-purple-900/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose Photogenic?
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Experience the future of image creation with our powerful
              AI-driven platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
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
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              The Photogenic Advantage
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Discover what makes our platform unique and why creators choose
              us.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="glass p-6 rounded-xl hover:scale-105 transition-transform duration-300"
              >
                <benefit.icon className="w-12 h-12 text-pink-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-white/70">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-blue-900/10">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="glass p-8 rounded-xl"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Create Something Amazing?
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto mb-8">
              Join thousands of creators who are already using Photogenic to
              bring their ideas to life.
            </p>
            <Link
              href="/create"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/20"
            >
              Get Started Now
              <Wand2 className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-white/70">
          <p>© {new Date().getFullYear()} Photogenic. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
