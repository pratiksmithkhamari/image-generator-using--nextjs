"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SignIn() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-gradient-to-b from-purple-900/40 via-pink-900/40 to-blue-900/40 backdrop-blur-lg rounded-2xl border border-white/10 shadow-xl">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold text-white">
            Sign in to Photogenic
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Generate and share amazing images with AI
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/20"
          >
            Sign in with Google
          </button>
        </div>
      </div>
      <Link
        href="/"
        className="mt-8 flex items-center text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to home
      </Link>
    </div>
  );
}
