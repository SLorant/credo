interface Post {
  id: string;
  caption: string | null;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM" | "REELS";
  mediaUrl: string;
  thumbnailUrl: string | null;
  permalink: string;
  timestamp: string;
}

interface FeedframerResponse {
  username: string;
  posts: Post[];
  pagination: {
    nextCursor: string | null;
    hasMore: boolean;
    perPage: number;
  };
}

class FeedframerClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = "https://feedframer.com";
  }

  async getPosts(
    params: Record<string, any> = {},
  ): Promise<FeedframerResponse | null> {
    const queryParams = new URLSearchParams({
      api_key: this.apiKey,
      "page[size]": "12",
      ...params,
    });

    try {
      const response = await fetch(`${this.baseUrl}/api/v1/me?${queryParams}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }
}

export class CachedFeedframerClient extends FeedframerClient {
  private cacheDuration: number;

  constructor(apiKey: string, cacheDuration = 3600000) {
    // 1 hour default
    super(apiKey);
    this.cacheDuration = cacheDuration;
  }

  async getPosts(params = {}) {
    const cacheKey = this.getCacheKey(params);
    const cached = this.getCache(cacheKey);

    if (cached) {
      return cached;
    }

    const data = await super.getPosts(params);

    if (data) {
      this.setCache(cacheKey, data);
    }

    return data;
  }

  getCacheKey(params: any) {
    return `feedframer_${JSON.stringify(params)}`;
  }

  getCache(key: any) {
    try {
      const item = localStorage.getItem(key);

      if (!item) {
        return null;
      }

      const { data, timestamp } = JSON.parse(item);
      const age = Date.now() - timestamp;

      if (age > this.cacheDuration) {
        localStorage.removeItem(key);
        return null;
      }

      return data;
    } catch (error) {
      return null;
    }
  }

  setCache(key: any, data: any) {
    try {
      const item = {
        data,
        timestamp: Date.now(),
      };

      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error("Cache write failed:", error);
    }
  }

  clearCache() {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith("feedframer_")) {
        localStorage.removeItem(key);
      }
    });
  }
}

/* // Usage
const client = new CachedFeedframerClient("YOUR_API_KEY");
const data = await client.getPosts(); // Fetches from API
const data2 = await client.getPosts(); // Returns from cache */
