#!/usr/bin/env node

/**
 * API Test Script
 * Tests YouTube and Twitter APIs with India-specific queries
 */

import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

console.log("🧪 Testing APIs...\n");

// Test YouTube API
async function testYouTubeAPI() {
  console.log("📺 Testing YouTube API...");
  
  if (!YOUTUBE_API_KEY) {
    console.error("❌ YOUTUBE_API_KEY not set");
    return false;
  }

  try {
    const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        q: "how to get marks card if lost India",
        key: YOUTUBE_API_KEY,
        part: "snippet",
        type: "video",
        maxResults: 3,
        regionCode: "IN",
        relevanceLanguage: "en",
      },
      timeout: 10000,
    });

    if (response.data.items && response.data.items.length > 0) {
      console.log("✅ YouTube API Working!");
      console.log(`   Found ${response.data.items.length} videos\n`);
      
      response.data.items.forEach((item, i) => {
        console.log(`   ${i + 1}. ${item.snippet.title.substring(0, 60)}...`);
        console.log(`      Channel: ${item.snippet.channelTitle}\n`);
      });
      
      return true;
    } else {
      console.error("❌ YouTube API returned no results");
      return false;
    }
  } catch (error) {
    console.error("❌ YouTube API Error:", error instanceof Error ? error.message : String(error));
    return false;
  }
}

// Test Twitter API
async function testTwitterAPI() {
  console.log("\n🐦 Testing Twitter API...");
  
  if (!TWITTER_BEARER_TOKEN) {
    console.error("❌ TWITTER_BEARER_TOKEN not set");
    return false;
  }

  try {
    const query = "(marks card lost India OR Indian) lang:en";
    
    const response = await axios.get("https://api.twitter.com/2/tweets/search/recent", {
      headers: {
        Authorization: `Bearer ${TWITTER_BEARER_TOKEN}`,
      },
      params: {
        query: query,
        "tweet.fields": "public_metrics,created_at",
        max_results: 3,
      },
      timeout: 10000,
    });

    if (response.data.data && response.data.data.length > 0) {
      console.log("✅ Twitter API Working!");
      console.log(`   Found ${response.data.data.length} tweets\n`);
      
      response.data.data.forEach((tweet, i) => {
        console.log(`   ${i + 1}. ${tweet.text.substring(0, 80)}...`);
        console.log(`      Likes: ${tweet.public_metrics?.like_count || 0}\n`);
      });
      
      return true;
    } else {
      console.error("❌ Twitter API returned no results (might be normal - try different query)");
      return true; // Don't fail, API itself is working
    }
  } catch (error) {
    const axiosError = error as any;
    if (axiosError.response?.status === 429) {
      console.warn("⚠️  Twitter API Rate Limited - API is working but being throttled");
      return true;
    }
    console.error("❌ Twitter API Error:", error instanceof Error ? error.message : String(error));
    return false;
  }
}

// Run tests
async function runTests() {
  const youtubeWorking = await testYouTubeAPI();
  const twitterWorking = await testTwitterAPI();

  console.log("\n" + "=".repeat(50));
  console.log("📊 Test Summary:");
  console.log(`   YouTube API: ${youtubeWorking ? "✅ Working" : "❌ Failed"}`);
  console.log(`   Twitter API: ${twitterWorking ? "✅ Working" : "❌ Failed"}`);
  console.log("=".repeat(50) + "\n");

  if (youtubeWorking && twitterWorking) {
    console.log("🎉 All APIs are working correctly!\n");
    process.exit(0);
  } else {
    console.log("⚠️  Some APIs are not working. Check your credentials.\n");
    process.exit(1);
  }
}

runTests();
