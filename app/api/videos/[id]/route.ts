import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Video from "@/models/Video";
import User from "@/models/User";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Fetching video with ID:", params.id);
    await connectToDB();

    const video = await Video.findById(params.id);

    if (!video) {
      console.log("Video not found:", params.id);
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Populate user data
    let userData = undefined;

    if (video.userId) {
      try {
        const user = await User.findById(video.userId).select("name image");
        if (user) {
          userData = { name: user.name, image: user.image };
        }
      } catch (userError) {
        console.error("Error fetching user data:", userError);
        // Continue without user data
      }
    }

    const videoWithUser = {
      ...video.toJSON(),
      user: userData,
    };

    console.log("Video found and returned successfully");
    return NextResponse.json(videoWithUser);
  } catch (error) {
    console.error("Error fetching video:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch video",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
