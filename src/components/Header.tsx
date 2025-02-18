"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { BiLoaderCircle } from "react-icons/bi";

export default function Header() {
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "loading") {
      setInitialLoading(false);
    }
  }, [status, session]);

  return (
    <header className="fixed top-0 left-0 right-0 h-[60px] bg-black/95 backdrop-blur-sm border-b border-white/10 px-4 flex justify-between items-center z-50 transition-all duration-300 hover:bg-black">
      <Link href="/" className="transition-transform hover:scale-105">
        <h2 className="font-bold text-xl bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Photogenic
        </h2>
      </Link>

      {initialLoading ? (
        <div className="flex items-center justify-center w-8 h-8">
          <BiLoaderCircle className="animate-spin text-white/70 w-6 h-6" />
        </div>
      ) : !session ? (
        <div className="flex items-center">
          <Button
            onClick={() => signIn("google")}
            className="bg-white text-black hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            Login with Google
          </Button>
        </div>
      ) : (
        <div className="flex gap-4 items-center">
          <Button
            onClick={() => signOut()}
            variant="destructive"
            className="transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            Logout
          </Button>
          <Link
            href="/profile"
            className="transition-transform hover:scale-110"
          >
            <Avatar className="border-2 border-white/20 hover:border-white/50 transition-all duration-300">
              <AvatarImage src={session.user?.image || ""} />
              <AvatarFallback className="bg-gray-700">
                {session.user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "U"}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      )}
    </header>
  );
}
