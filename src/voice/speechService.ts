// Local Speech Recognition & Synthesis Service (Offline-Ready)
export interface SpeechRecognitionResult {
  text: string;
  isFinal: boolean;
}

// Browser API declarations
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionEventInit extends Event {
  results: SpeechRecognitionResultList;
  resultIndex?: number;
}

type SpeechRecognitionInstance = EventTarget & {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: ((e: Event) => void) | null;
  onresult: ((e: SpeechRecognitionEventInit) => void) | null;
  onerror: ((e: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((e: Event) => void) | null;
};

interface SpeechRecognitionStatic {
  new (): SpeechRecognitionInstance;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionStatic;
    webkitSpeechRecognition?: SpeechRecognitionStatic;
  }
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === "undefined") return false;
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export interface SpeechSessionOptions {
  onInterim: (text: string) => void;
  onFinal: (text: string) => void;
  onError: (error: string) => void;
  onListeningChange: (listening: boolean, status: string) => void;
  silenceTimeoutMs?: number; // silence threshold after user spoke (default 2200ms)
  maxDurationMs?: number; // maximum listening duration (default 15000ms)
}

export interface SpeechSession {
  stop: () => void;
  abort: () => void;
}

/**
 * Starts a resilient, continuous speech recognition session.
 * Does not abruptly close on brief pauses or 'no-speech' events.
 * Stays open until the user finishes talking, clicks stop, or 15 seconds elapse.
 * Includes proactive microphone permission acquisition and resilient single-phrase retry fallback.
 */
export function startSpeechSession(
  lang: "en" | "hi",
  options: SpeechSessionOptions,
): SpeechSession | null {
  if (!isSpeechRecognitionSupported()) {
    options.onError(
      lang === "hi"
        ? "इस ब्राउज़र में स्पीच रिकग्निशन समर्थित नहीं है। कृपया अपना प्रश्न नीचे टाइप करें।"
        : "Speech recognition is not supported in this browser. Please type your query in the box.",
    );
    return null;
  }

  const SpeechRecClass = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecClass) return null;

  let isExplicitlyEnded = false;
  let accumulatedFinal = "";
  let currentInterim = "";
  let silenceTimer: ReturnType<typeof setTimeout> | null = null;
  let maxDurationTimer: ReturnType<typeof setTimeout> | null = null;
  let recognizer: SpeechRecognitionInstance | null = null;
  let retried = false;

  const silenceTimeoutMs = options.silenceTimeoutMs ?? 2200;
  const maxDurationMs = options.maxDurationMs ?? 15000;

  function clearTimers() {
    if (silenceTimer) {
      clearTimeout(silenceTimer);
      silenceTimer = null;
    }
    if (maxDurationTimer) {
      clearTimeout(maxDurationTimer);
      maxDurationTimer = null;
    }
  }

  function finalize() {
    if (isExplicitlyEnded) return;
    isExplicitlyEnded = true;
    clearTimers();

    try {
      recognizer?.stop();
    } catch {
      // ignore
    }

    options.onListeningChange(false, "Finished listening");
    const resultText = (accumulatedFinal + " " + currentInterim).trim();
    if (resultText) {
      options.onFinal(resultText);
    }
  }

  // Pre-acquire microphone permission so Chrome doesn't emit false network error
  async function checkPermissionAndInit() {
    if (typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
      } catch (err) {
        if (err instanceof DOMException && err.name === "NotAllowedError") {
          isExplicitlyEnded = true;
          clearTimers();
          options.onListeningChange(false, "Microphone access blocked");
          options.onError(
            lang === "hi"
              ? "माइक्रोफ़ोन अनुमति अस्वीकृत हो गई। कृपया ब्राउज़र एड्रेस बार में माइक्रोफ़ोन की अनुमति दें।"
              : "Microphone permission was denied. Please allow microphone access in your browser address bar.",
          );
          return;
        }
      }
    }
    if (!isExplicitlyEnded) {
      initRecognizer(true);
    }
  }

  function initRecognizer(continuousMode = true) {
    if (isExplicitlyEnded) return;

    try {
      const ActiveSpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!ActiveSpeechRec) return;
      recognizer = new ActiveSpeechRec();
      recognizer.continuous = continuousMode;
      recognizer.interimResults = true;
      recognizer.lang = lang === "hi" ? "hi-IN" : "en-US";

      recognizer.onstart = () => {
        if (!isExplicitlyEnded) {
          options.onListeningChange(
            true,
            lang === "hi"
              ? "माइक्रोफ़ोन सक्रिय है... बोलिए"
              : "Microphone active... Speak your question now",
          );
        }
      };

      recognizer.onresult = (event: SpeechRecognitionEventInit) => {
        if (isExplicitlyEnded) return;

        let interim = "";
        for (let i = event.resultIndex || 0; i < event.results.length; ++i) {
          const item = event.results[i];
          const transcript = item[0].transcript;
          if (item.isFinal) {
            accumulatedFinal = (accumulatedFinal + " " + transcript).trim();
          } else {
            interim += transcript;
          }
        }
        currentInterim = interim;
        const totalSpoken = (accumulatedFinal + " " + currentInterim).trim();

        if (totalSpoken) {
          options.onInterim(totalSpoken);

          // User spoke something; start/reset silence timer
          if (silenceTimer) clearTimeout(silenceTimer);
          silenceTimer = setTimeout(() => {
            finalize();
          }, silenceTimeoutMs);
        }
      };

      recognizer.onerror = (event: SpeechRecognitionErrorEvent) => {
        // 'no-speech' is a standard timeout Chrome emits when the user is silent.
        // DO NOT ABORT on no-speech! Keep session open so user has time to talk.
        if (event.error === "no-speech") {
          return;
        }

        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          isExplicitlyEnded = true;
          clearTimers();
          options.onListeningChange(false, "Microphone access blocked");
          options.onError(
            lang === "hi"
              ? "माइक्रोफ़ोन अनुमति अस्वीकृत हो गई। कृपया ब्राउज़र एड्रेस बार में माइक्रोफ़ोन की अनुमति दें।"
              : "Microphone permission was denied. Please allow microphone access in your browser address bar.",
          );
          return;
        }

        if (event.error === "network") {
          // If first attempt was continuous and failed with network, retry in single-phrase mode
          if (!retried) {
            retried = true;
            console.warn("Speech recognition network error. Attempting resilient single-phrase retry...");
            try {
              recognizer?.abort();
            } catch {
              // ignore
            }
            setTimeout(() => {
              if (!isExplicitlyEnded) {
                initRecognizer(false);
              }
            }, 250);
            return;
          }

          // If retry also failed, Chrome speech cloud service is offline or blocked
          isExplicitlyEnded = true;
          clearTimers();
          options.onListeningChange(false, "Speech service unavailable");
          options.onError(
            lang === "hi"
              ? "ब्राउज़र स्पीच सेवा अनुपलब्ध है (Google Cloud स्पीच सर्वर ऑफ़लाइन या अवरुद्ध है)। आप नीचे सीधे टाइप कर सकते हैं या किसी विषय पर क्लिक करें — ASTRA बोलकर उत्तर देगा।"
              : "Browser speech service is unavailable (Google Cloud speech service is offline or unreachable). Please type your query below or click any topic — ASTRA will still speak the response.",
          );
          return;
        }

        console.warn("Speech recognition notice:", event.error);
      };

      recognizer.onend = () => {
        // If the user hasn't stopped and we haven't timed out, restart cleanly!
        if (!isExplicitlyEnded) {
          try {
            recognizer?.start();
          } catch {
            finalize();
          }
        }
      };

      recognizer.start();
    } catch (err) {
      options.onError(
        err instanceof Error ? err.message : "Could not initialize microphone",
      );
      isExplicitlyEnded = true;
      clearTimers();
      options.onListeningChange(false, "Initialization failed");
    }
  }

  // Launch recognition with proactive mic check
  checkPermissionAndInit();

  // Maximum listening duration safety timer (15 seconds)
  maxDurationTimer = setTimeout(() => {
    finalize();
  }, maxDurationMs);

  return {
    stop: () => {
      finalize();
    },
    abort: () => {
      isExplicitlyEnded = true;
      clearTimers();
      try {
        recognizer?.abort();
      } catch {
        // ignore
      }
      options.onListeningChange(false, "Cancelled");
    },
  };
}

// Backwards-compatible wrapper
export function createSpeechRecognizer(
  lang: "en" | "hi",
  onResult: (result: SpeechRecognitionResult) => void,
  onEnd: () => void,
  onError: (error: string) => void,
): { start: () => void; stop: () => void; abort: () => void } | null {
  let session: SpeechSession | null = null;
  return {
    start: () => {
      session = startSpeechSession(lang, {
        onInterim: (text) => onResult({ text, isFinal: false }),
        onFinal: (text) => {
          onResult({ text, isFinal: true });
          onEnd();
        },
        onError,
        onListeningChange: (listening) => {
          if (!listening) onEnd();
        },
      });
    },
    stop: () => {
      session?.stop();
    },
    abort: () => {
      session?.abort();
    },
  };
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

let cachedVoices: SpeechSynthesisVoice[] = [];

function getVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return [];
  if (cachedVoices.length === 0) {
    cachedVoices = window.speechSynthesis.getVoices();
  }
  return cachedVoices;
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

export function speakText(
  text: string,
  lang: "en" | "hi",
  rate = 1.0,
  onStart?: () => void,
  onEnd?: () => void,
): void {
  if (!isSpeechSynthesisSupported()) {
    onEnd?.();
    return;
  }

  window.speechSynthesis.cancel();

  // Strip markdown formatting, symbols or extra punctuation for smooth reading
  const clean = text
    .replace(/[#*_`~[\]()]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!clean) {
    onEnd?.();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.rate = Math.max(0.7, Math.min(1.4, rate));
  utterance.pitch = 1.0;
  utterance.lang = lang === "hi" ? "hi-IN" : "en-US";

  const voices = getVoices();
  if (lang === "hi") {
    const hiVoice = voices.find(
      (v) => v.lang.startsWith("hi") || v.name.toLowerCase().includes("hindi"),
    );
    if (hiVoice) utterance.voice = hiVoice;
  } else {
    const enVoice =
      voices.find(
        (v) =>
          (v.lang.startsWith("en-US") || v.lang.startsWith("en-GB")) &&
          !v.name.includes("Google"),
      ) || voices.find((v) => v.lang.startsWith("en"));
    if (enVoice) utterance.voice = enVoice;
  }

  utterance.onstart = () => onStart?.();
  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
}
