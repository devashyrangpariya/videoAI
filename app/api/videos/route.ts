import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Video from "@/models/Video";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/videos - Get all videos with pagination
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    await connectToDB();

    console.log("Fetching videos with pagination:", { page, limit, skip });

    const videos = await Video.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    console.log(`Found ${videos.length} videos`);

    // Get user details for each video
    const videoData = await Promise.all(
      videos.map(async (video) => {
        try {
          const videoObj = video.toJSON();
          if (!videoObj.userId) {
            console.log("Video missing userId:", videoObj._id);
            return { ...videoObj, user: undefined };
          }

          const user = await User.findById(videoObj.userId).select(
            "name image"
          );
          return {
            ...videoObj,
            user: user ? { name: user.name, image: user.image } : undefined,
          };
        } catch (err) {
          console.error("Error processing video:", err);
          return video.toJSON(); // Return video without user data
        }
      })
    );

    return NextResponse.json({
      videos: videoData,
      page,
      limit,
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch videos",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST /api/videos - Create a new video
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate the request body
    const { title, description, videoUrl, thumbnailUrl, userId } = body;

    if (!title || !description || !videoUrl || !thumbnailUrl || !userId) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          required: [
            "title",
            "description",
            "videoUrl",
            "thumbnailUrl",
            "userId",
          ],
          received: {
            title: !!title,
            description: !!description,
            videoUrl: !!videoUrl,
            thumbnailUrl: !!thumbnailUrl,
            userId: !!userId,
          },
        },
        { status: 400 }
      );
    }

    // Ensure the user ID matches the session user ID or is admin
    if (userId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized: Cannot upload for another user" },
        { status: 403 }
      );
    }

    await connectToDB();

    // Create a new video
    const video = new Video({
      title,
      description,
      videoUrl,
      thumbnailUrl,
      userId,
    });

    await video.save();
    console.log("Video created successfully:", video._id);

    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    console.error("Error creating video:", error);
    return NextResponse.json(
      {
        error: "Failed to create video",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
