import { knowledgeBase } from "./knowledgeBase";
import { nutritionHazardsKB } from "./nutritionHazardsKB";
import { mindspaceKB } from "./mindspaceKB";
import type { KnowledgeEntry, VoiceCategory } from "./types";

export interface MatchResult {
  entry: KnowledgeEntry | null;
  confidence: number;
  suggestions: KnowledgeEntry[];
  detectedLanguage: "en" | "hi";
}

const STOP_WORDS = new Set([
  // English stop words
  "a", "an", "the", "in", "on", "at", "to", "for", "of", "with", "is", "are",
  "am", "was", "were", "my", "your", "our", "me", "i", "you", "what", "how",
  "why", "when", "where", "which", "can", "does", "do", "tell", "please",
  // Hinglish / Hindi stop words (Romanized)
  "kya", "hai", "hain", "mera", "meri", "mere", "ka", "ki", "ke", "ko", "se",
  "mein", "me", "par", "kaisa", "kaisi", "kaise", "kitna", "kitni", "kitne",
  "batao", "kaho", "chahiye", "hoga", "hogi",
  // Hindi stop words (Devanagari)
  "क्या", "है", "हैं", "मेरा", "मेरी", "मेरे", "का", "की", "के", "को", "से",
  "में", "पर", "कैसा", "कैसी", "कैसे", "कितना", "कितनी", "कितने", "बताओ", "कहो",
]);

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[?.,!;:()"'`~_/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function detectDevanagari(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}

export function matchQuery(query: string, preferredCategory?: VoiceCategory): MatchResult {
  const norm = normalizeText(query);
  const isHindi = detectDevanagari(query);
  const tokens = norm.split(" ").filter((t) => t.length > 1 && !STOP_WORDS.has(t));

  const allEntries = [...mindspaceKB, ...nutritionHazardsKB, ...knowledgeBase];

  if (tokens.length === 0 && norm.length === 0) {
    return {
      entry: null,
      confidence: 0,
      suggestions: allEntries.slice(0, 3),
      detectedLanguage: isHindi ? "hi" : "en",
    };
  }

  const scores = allEntries.map((entry) => {
    let score = 0;

    const normEn = normalizeText(entry.questionEn);
    const normHi = normalizeText(entry.questionHi);
    const hinglishList = (entry.questionHinglish || []).map(normalizeText);

    // Exact or near-exact question match
    if (norm === normEn || norm === normHi) {
      score += 100;
    } else if (normEn.includes(norm) || norm.includes(normEn)) {
      score += 65;
    } else if (normHi.includes(norm) || norm.includes(normHi)) {
      score += 65;
    }

    // Hinglish variations match
    for (const h of hinglishList) {
      if (norm === h) {
        score += 90;
        break;
      } else if (norm.includes(h) || h.includes(norm)) {
        score += 55;
        break;
      }
    }

    // Keyword scoring
    for (const kw of entry.keywords) {
      const normKw = normalizeText(kw);
      if (norm === normKw) {
        score += 35;
      } else if (tokens.includes(normKw)) {
        score += 25;
      } else if (norm.includes(normKw)) {
        score += 15;
      }
    }

    // Token overlap with English question
    const enTokens = normEn.split(" ").filter((t) => !STOP_WORDS.has(t));
    for (const t of tokens) {
      if (enTokens.includes(t)) {
        score += 14;
      }
    }

    // Token overlap with Hindi question
    const hiTokens = normHi.split(" ").filter((t) => !STOP_WORDS.has(t));
    for (const t of tokens) {
      if (hiTokens.includes(t)) {
        score += 20;
      } else if (normHi.includes(t)) {
        score += 15;
      }
    }

    // Category affinity boost if specified
    if (preferredCategory && entry.category === preferredCategory) {
      score *= 1.15;
    }

    return { entry, score };
  });

  scores.sort((a, b) => b.score - a.score);

  const best = scores[0];
  const confidence = Math.min(1.0, Math.round((best.score / 60) * 100) / 100);

  // If best match has enough score
  const selectedEntry = best.score >= 18 ? best.entry : null;

  // Gather top 3 distinct suggestions
  const suggestions = scores
    .filter((s) => s.entry.id !== selectedEntry?.id)
    .slice(0, 3)
    .map((s) => s.entry);

  return {
    entry: selectedEntry,
    confidence,
    suggestions,
    detectedLanguage: isHindi ? "hi" : "en",
  };
}
