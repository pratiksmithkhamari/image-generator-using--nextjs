import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        posts: true,
      },
    });

    const allPosts = await prisma.post.findMany({
      include: {
        User: true,
      },
    });

    return NextResponse.json({
      user: {
        id: user?.id,
        email: user?.email,
        postsCount: user?.posts?.length,
        posts: user?.posts,
      },
      allPosts: allPosts.map((post) => ({
        id: post.id,
        userId: post.userId,
        userEmail: post.User.email,
        prompt: post.prompt,
        url: post.url,
        createdAt: post.createdAt,
      })),
    });
  } catch (error) {
    console.error("Debug error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
