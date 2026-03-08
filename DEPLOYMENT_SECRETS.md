# Deployment Environment Variables

For the deployed MCP server to work properly, the following environment variables must be configured on the mcp-use deployment platform:

## Required Variables

### 1. YouTube API Key
```
YOUTUBE_API_KEY=YOUR_YOUTUBE_API_KEY
```
- Get from: https://console.cloud.google.com/
- Required for: `search-youtube` and `search-all` tools

### 2. Twitter/X Bearer Token
```
TWITTER_BEARER_TOKEN=YOUR_TWITTER_BEARER_TOKEN
```
- Get from: https://developer.twitter.com/en/portal/dashboard
- Required for: `search-twitter` and `search-all` tools

### 3. MCP URL (Optional, but recommended for consistency)
```
MCP_URL=https://70qwsysdwu49.deploy.mcp-use.com
```
- Defaults to the deployment domain if not set

## How to Set Environment Variables

1. Go to your deployment dashboard on mcp-use
2. Navigate to Deployment Settings / Secrets / Environment Variables
3. Add each variable with its corresponding value
4. Redeploy the application for changes to take effect

## Troubleshooting

If the deployment is timing out:
1. Verify all environment variables are set
2. Check MCP_URL is correctly configured (https, not http)
3. Ensure API keys are valid and have the right permissions
4. Check deployment logs for specific errors

## Local Development

For local development, create a `.env` file in the project root:

```bash
YOUTUBE_API_KEY=your_key_here
TWITTER_BEARER_TOKEN=your_token_here
MCP_URL=http://localhost:3000
```

Then run: `npm run dev`
