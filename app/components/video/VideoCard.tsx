import Link from "next/link";
import Image from "next/image";
import { formatDistance } from "date-fns";

interface Video {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  userId: string;
  createdAt: string;
  user?: {
    name: string;
  };
}

export default function VideoCard({ video }: { video: Video }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <Link href={`/video/${video._id}`} className="block relative">
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50"></div>
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            {formatDistance(new Date(video.createdAt), new Date(), {
              addSuffix: true,
            })}
          </div>
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/video/${video._id}`} className="block">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white line-clamp-1 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            {video.title}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
          {video.description}
        </p>
        {video.user && (
          <div className="mt-3 flex items-center">
            <div className="h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs font-medium text-gray-800 dark:text-gray-200">
              {video.user.name.charAt(0)}
            </div>
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              {video.user.name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
