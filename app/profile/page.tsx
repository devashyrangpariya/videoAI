"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast";
import {
  User,
  Settings,
  LogOut,
  Camera,
  Mail,
  Calendar,
  Shield,
  Film,
  Clock,
  Edit,
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      toast.error("Please sign in to view your profile");
      router.push("/login");
    }

    if (session?.user?.name) {
      setDisplayName(session.user.name);
    }
  }, [status, router, session]);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut({ redirect: false });
      toast.success("Signed out successfully");
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!displayName.trim()) {
      toast.error("Display name cannot be empty");
      return;
    }

    setLoading(true);
    try {
      // Update session with new display name
      await update({
        ...session,
        user: {
          ...session?.user,
          name: displayName,
        },
      });

      // If there's a profile image, upload it (implementation depends on your upload service)
      if (profileImage) {
        // This is a placeholder - implement your actual image upload logic
        toast.success("Profile image updated");
      }

      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        My Profile
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Profile Card */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 flex justify-center">
              <div className="relative">
                <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700">
                  {session?.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-purple-100 dark:bg-purple-900/30">
                      <User className="h-16 w-16 text-purple-600 dark:text-purple-400" />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <div className="absolute bottom-0 right-0">
                    <div className="bg-purple-600 rounded-full p-2 cursor-pointer shadow-lg">
                      <Camera className="h-5 w-5 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6">
              <div className="text-center mb-6">
                {isEditing ? (
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="text-xl font-bold text-center w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:outline-none px-2 py-1 text-gray-900 dark:text-white"
                  />
                ) : (
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {session?.user?.name || "User"}
                  </h2>
                )}
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  {session?.user?.email}
                </p>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                {isEditing ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleUpdateProfile}
                      disabled={loading}
                      className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setDisplayName(session?.user?.name || "");
                      }}
                      className="py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center justify-center py-2 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md transition-colors"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </button>
                    <button
                      onClick={handleSignOut}
                      disabled={loading}
                      className="flex items-center justify-center py-2 px-4 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {loading ? "Signing out..." : "Sign Out"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Details & Activity */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
              <User className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
              Account Information
            </h3>

            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Email
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    {session?.user?.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Member Since
                  </p>
                  <p className="text-gray-900 dark:text-white">January 2023</p>
                </div>
              </div>

              <div className="flex items-start">
                <Shield className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Account Type
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    {session?.user?.name === "admin"
                      ? "Administrator"
                      : "Standard User"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
              <Film className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
              Recent Activity
            </h3>

            <div className="space-y-4">
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Your Videos
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">
                    Manage your uploaded videos or upload new content.
                  </p>
                  <Link
                    href="/video"
                    className="inline-flex items-center mt-2 text-sm text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    View Your Videos
                    <svg
                      className="ml-1 w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </Link>
                </div>
              </div>

              <div className="flex items-start">
                <Settings className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Account Settings
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">
                    Update your account preferences and settings.
                  </p>
                  <button
                    className="inline-flex items-center mt-2 text-sm text-purple-600 dark:text-purple-400 hover:underline"
                    onClick={() =>
                      toast.success("Settings functionality coming soon!")
                    }
                  >
                    Manage Settings
                    <svg
                      className="ml-1 w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
