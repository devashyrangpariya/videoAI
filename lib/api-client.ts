/**
 * API Client
 * 
 * Provides a typed client for making API requests to the application's backend.
 * Handles common request patterns and error handling.
 */

import { IVideo } from "@/models/Video";

/**
 * Type for video form data when creating or updating videos
 */
export type VideoFormData = Omit<IVideo, "_id">;

/**
 * Options for fetch requests
 */
type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
};

/**
 * API Client class for making requests to the application's API
 */
class ApiClient {
  /**
   * Make a fetch request to the API
   * 
   * @param endpoint - API endpoint path (without /api prefix)
   * @param options - Fetch options
   * @returns Promise resolving to the response data
   */
  private async fetch<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    const response = await fetch(`/api${endpoint}`, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  /**
   * Get all videos
   * 
   * @returns Promise resolving to the videos data
   */
  async getVideos() {
    return this.fetch("/videos");
  }

  /**
   * Create a new video
   * 
   * @param videoData - Video data to create
   * @returns Promise resolving to the created video
   */
  async createVideo(videoData: VideoFormData) {
    return this.fetch("/videos", {
      method: "POST",
      body: videoData,
    });
  }
}

// Export a singleton instance of the API client
export const apiClient = new ApiClient();
