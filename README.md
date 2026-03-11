# Zen-Citizen MCP Server

An advanced MCP (Model Context Protocol) server built with [mcp-use](https://mcp-use.com) that integrates YouTube and Twitter/X APIs to search for videos, comments, and tweets while displaying results in interactive widgets.

## Features

### 🎯 Core Capabilities

- **YouTube Search** - Search for videos related to any query
- **YouTube Comments** - Fetch and display top comments from videos
- **Twitter Search** - Search recent tweets about any topic
- **Author Information** - Display channel and profile information
- **Combined Search** - Search both platforms simultaneously
- **Interactive UI** - List-based widget with tabbed views
- **Dark Mode Support** - Theme-aware styling

### 🔧 Tools Available

| Tool | Description | Requires |
|------|-------------|----------|
| `search-youtube` | Search YouTube videos + get comments | `YOUTUBE_API_KEY` |
| `search-twitter` | Search recent tweets | `TWITTER_BEARER_TOKEN` |
| `search-all` | Combined search (YouTube + Twitter) | Both keys |
| `search-tools` | Original fruit search (demo) | None |
| `get-fruit-details` | Get fruit info (demo) | None |

## Installation & Setup

### 1. Clone or Download the Project

```bash
cd Zen-Citizen
npm install
```

### 2. Get API Credentials

#### YouTube API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable **YouTube Data API v3**
4. Go to **APIs & Services > Credentials**
5. Create an **API Key** (Application type: Desktop app)
6. Copy the API key

#### Twitter/X API
1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create an app or use existing
3. Go to **Keys and tokens**
4. Copy the **Bearer Token**

### 3. Configure Environment Variables

Create a `.env` file (or copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
YOUTUBE_API_KEY=your_api_key_here
TWITTER_BEARER_TOKEN=your_bearer_token_here
MCP_URL=http://localhost:3000
```

## Running the Server

### Development

```bash
npm run dev
```

The server starts at `http://localhost:3000`  
Inspector available at `http://localhost:3000/inspector`

### Production Build

```bash
npm run build
npm run start
```

### Deploy to Manufact Cloud

```bash
npm run deploy
```

## Usage Examples

### In ChatGPT / Claude

**Search YouTube:**
```
Search for "machine learning tutorials" on YouTube
```

**Search Twitter:**
```
Find recent tweets about AI and machine learning
```

**Combined Search:**
```
Search for "React 19 features" on both YouTube and Twitter
```

## Project Structure

```
├── index.ts                          # Main server & tool definitions
├── api.ts                            # YouTube & Twitter API handlers
├── package.json                      # Dependencies
├── resources/
│   ├── product-search-result/        # Fruit search widget (demo)
│   └── api-results/
│       ├── widget.tsx                # Results display widget
│       ├── types.ts                  # TypeScript types
│       └── styles.css                # Styling
├── public/                           # Static assets
└── .env.example                      # Environment template
```

## API Response Structure

### YouTube Results
```typescript
{
  videos: [
    {
      id: string,
      title: string,
      description: string,
      thumbnail: string,
      channelTitle: string,
      viewCount: string,
      publishedAt: string,
      url: string
    }
  ],
  comments: [
    {
      id: string,
      authorDisplayName: string,
      textDisplay: string,
      likeCount: number,
      publishedAt: string,
      authorProfileImageUrl: string
    }
  ],
  query: string
}
```

### Twitter Results
```typescript
{
  tweets: [
    {
      id: string,
      text: string,
      author: string,
      authorHandle: string,
      authorAvatarUrl: string,
      createdAt: string,
      likeCount: number,
      retweetCount: number,
      url: string
    }
  ],
  query: string,
  count: number
}
```

## Widget Features

The **api-results** widget provides:

- 📺 **Tab Navigation** - Switch between YouTube, Twitter, and All results
- 🎬 **Video Cards** - Thumbnails, titles, channels, view counts
- 💬 **Comments Display** - Top comments with likes and dates
- 🐦 **Tweet Cards** - Full tweets with likes and retweets
- 👤 **Author Info** - Profile pictures and handles
- 🔗 **Direct Links** - Click to open content on platforms
- 🌓 **Dark Mode** - Theme awareness

## Troubleshooting

### "YOUTUBE_API_KEY environment variable not set"
- Ensure you've created `.env` file with your YouTube API key
- Restart the dev server after adding environment variables

### "TWITTER_BEARER_TOKEN environment variable not set"
- Ensure you've created `.env` file with your Twitter Bearer Token
- Verify token has read permissions for tweets

### "YouTube search failed: 403"
- Your API key quota might be exceeded
- Check quota in [Google Cloud Console](https://console.cloud.google.com/)
- YouTube API has daily quota limits (by default: 10,000 units/day)

### "Twitter search failed: 401"
- Bearer Token might be invalid or expired
- Regenerate the token from Twitter Developer Portal

## Rate Limits

- **YouTube API**: 10,000 units per day (default quota)
- **Twitter API**: Check your [API plan limits](https://developer.twitter.com/en/docs/projects/overview)

## Next Steps

- ✅ Add more advanced search filters
- ✅ Cache results to reduce API calls
- ✅ Add user preferences & favorites
- ✅ Implement pagination
- ✅ Add sentiment analysis for tweets

## Learn More

- [mcp-use Documentation](https://mcp-use.com/docs/typescript/getting-started/quickstart)
- [YouTube API Reference](https://developers.google.com/youtube/v3)
- [Twitter API v2 Reference](https://developer.twitter.com/en/docs/twitter-api)

## Deploy on Manufact Cloud

```bash
npm run deploy
```

---

