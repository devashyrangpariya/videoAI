"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import VideoUploadForm from "@/app/components/video/VideoUploadForm";

export default function UploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      toast.error("Please log in to upload videos");
      router.push("/login");
    }
  }, [status, router]);

  const handleUploadComplete = () => {
    // Redirect to the video list page
    router.push("/video");
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Upload a New Video
      </h1>
      {session?.user?.id && (
        <VideoUploadForm
          onUploadComplete={handleUploadComplete}
          userId={session.user.id}
        />
      )}
    </div>
  );
}
