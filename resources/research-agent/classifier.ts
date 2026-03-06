import type { SentimentType, SentimentScore } from "./types";

/**
 * Sentiment Classifier for analyzing opinions and feedback
 * Uses pattern matching for efficient, offline classification
 */

interface SentimentPatterns {
  positive: string[];
  negative: string[];
  unhelpful: string[];
  spam: string[];
}

const SENTIMENT_PATTERNS: SentimentPatterns = {
  positive: [
    "works", "great", "helpful", "thank", "thanks", "solved", "fixed", "easy", "simple",
    "fantastic", "excellent", "perfect", "loved", "awesome", "best", "tried", "worked",
    "successful", "success", "amazing", "brilliant", "superb", "wonderful", "verified",
    "confirmed", "genuine", "authentic", "official", "legit", "100%", "definitely",
    "actually worked", "got it", "received", "approved", "completed", "done", "finished"
  ],
  negative: [
    "doesn't work", "not work", "failed", "scam", "fake", "wrong", "terrible", "awful",
    "waste", "useless", "misleading", "confusing", "complicated", "difficult", "bad",
    "horrible", "worst", "don't bother", "avoid", "fraud", "cheating", "error",
    "not helpful", "unhelpful", "couldn't", "can't", "doesn't", "never", "rejected",
    "denied", "refused", "problem", "issue", "glitch", "broken"
  ],
  unhelpful: [
    "idk", "not sure", "dunno", "unclear", "confusing", "vague", "incomplete",
    "missing info", "no idea", "couldn't help", "didn't help", "irrelevant",
    "off topic", "random", "nonsense", "doesn't apply", "not applicable"
  ],
  spam: [
    "click here", "subscribe now", "link in bio", "follow me", "dm me", "buy now",
    "limited time", "only today", "urgently", "hurry", "act now", "free money",
    "get rich", "work from home", "earn passive", "affiliate", "referral",
    "xxx", "bit.ly", "goo.gl", "promo code", "discount code"
  ]
};

/**
 * Classify sentiment of given text
 */
export function classifySentiment(text: string): SentimentScore {
  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);

  // Count pattern matches
  const positiveCount = countMatches(lowerText, SENTIMENT_PATTERNS.positive);
  const negativeCount = countMatches(lowerText, SENTIMENT_PATTERNS.negative);
  const unhelpfulCount = countMatches(lowerText, SENTIMENT_PATTERNS.unhelpful);
  const spamCount = countMatches(lowerText, SENTIMENT_PATTERNS.spam);

  // Determine dominant sentiment
  let sentiment: SentimentType = "neutral";
  let confidence = 50;

  const scores = {
    positive: positiveCount,
    negative: negativeCount,
    unhelpful: unhelpfulCount,
    spam: spamCount,
  };

  // Find dominant sentiment
  let maxScore = 0;
  let maxSentiment: SentimentType = "neutral";

  if (positiveCount > maxScore) {
    maxScore = positiveCount;
    maxSentiment = "positive";
  }
  if (spamCount > maxScore) {
    maxScore = spamCount;
    maxSentiment = "spam";
  }
  if (negativeCount > maxScore) {
    maxScore = negativeCount;
    maxSentiment = "negative";
  }
  if (unhelpfulCount > maxScore) {
    maxScore = unhelpfulCount;
    maxSentiment = "unhelpful";
  }

  // Spam takes priority
  if (spamCount > 0) {
    sentiment = "spam";
    confidence = Math.min(100, 70 + spamCount * 10);
  } else if (maxScore > 0) {
    sentiment = maxSentiment;
    // Confidence based on match count and text length
    confidence = Math.min(100, 60 + Math.min(40, maxScore * 15));
  }

  // Extract keywords that influenced the classification
  const keywords = extractKeywords(lowerText, SENTIMENT_PATTERNS, sentiment);

  return {
    sentiment,
    confidence,
    keywords,
  };
}

/**
 * Count pattern matches in text
 */
function countMatches(text: string, patterns: string[]): number {
  let count = 0;
  for (const pattern of patterns) {
    // Use word boundary matching
    const regex = new RegExp(`\\b${escapeRegex(pattern)}\\b`, "gi");
    const matches = text.match(regex);
    if (matches) count += matches.length;
  }
  return count;
}

/**
 * Extract keywords that influenced classification
 */
function extractKeywords(text: string, patterns: SentimentPatterns, sentiment: SentimentType): string[] {
  const patternList = patterns[sentiment === "positive" ? "positive" : sentiment === "negative" ? "negative" : sentiment === "spam" ? "spam" : "unhelpful"];
  
  const found: string[] = [];
  for (const pattern of patternList) {
    const regex = new RegExp(`\\b${escapeRegex(pattern)}\\b`, "gi");
    if (regex.test(text)) {
      found.push(pattern);
    }
  }
  return found.slice(0, 5); // Top 5 keywords
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Calculate helpfulness score based on sentiment and text quality
 */
export function calculateHelpfulnessScore(
  text: string,
  likes: number,
  sentiment: SentimentType
): number {
  let score = 50; // Base score

  // Sentiment impact
  if (sentiment === "positive" || sentiment === "helpful") score += 30;
  if (sentiment === "negative" || sentiment === "unhelpful") score -= 20;
  if (sentiment === "spam") score = 0;

  // Text length impact (longer = potentially more detailed)
  const wordCount = text.split(/\s+/).length;
  if (wordCount > 20) score += 10;
  if (wordCount < 5) score -= 5;

  // Engagement impact (normalized)
  const engagementBonus = Math.min(20, Math.floor(Math.log(likes + 1) * 2));
  score += engagementBonus;

  return Math.max(0, Math.min(100, score));
}

/**
 * Extract actionable key points from text
 */
export function extractKeyPoints(text: string): string[] {
  const lines = text.split(/[.\n!?]/);
  const keyPoints: string[] = [];

  // Look for action items and important information
  const actionKeywords = ["need", "must", "should", "visit", "contact", "call", "submit", "apply", "provide", "bring", "go to"];
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check if line contains action keywords
    if (actionKeywords.some(kw => trimmed.toLowerCase().includes(kw))) {
      if (trimmed.length > 10 && trimmed.length < 200) {
        keyPoints.push(trimmed);
      }
    }
  }

  return keyPoints.slice(0, 5);
}
