import { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Send,
  Sparkles,
  ShieldCheck,
  Languages,
  RotateCcw,
  Check,
} from "lucide-react";
import {
  knowledgeBase,
  categoryLabels,
  getEntriesByCategory,
} from "./knowledgeBase";
import { matchQuery } from "./intentMatcher";
import { getDynamicContext } from "./dynamicContext";
import {
  startSpeechSession,
  isSpeechRecognitionSupported,
  speakText,
  stopSpeaking,
  type SpeechSession,
} from "./speechService";
import type { VoiceCategory, VoiceMessage, KnowledgeEntry } from "./types";

export default function AstraVoicePanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [listeningStatus, setListeningStatus] = useState("");
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<VoiceCategory | "all">("all");
  const [activeSpeechRate] = useState(1.0);
  const [messages, setMessages] = useState<VoiceMessage[]>([
    {
      id: "welcome",
      sender: "astra",
      text:
        lang === "hi"
          ? "नमस्ते! मैं ASTRA वॉइस हूँ—आपका मिशन स्वास्थ्य साथी। आप मुझसे अपने वाइटल्स (Heart Rate, SpO2, Sleep), बेसलाइन, या अंतरिक्ष स्वास्थ्य के बारे में पूछ सकते हैं।"
          : "Greetings! I am ASTRA Voice—your mission health companion. Ask me about your real-time vitals, sleep deficit, personal baseline, space physiology, or mission simulations.",
      lang: "en",
      timestamp: "00:00",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionRef = useRef<SpeechSession | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Clean up on unmount or drawer close
  useEffect(() => {
    return () => {
      stopSpeaking();
      sessionRef.current?.abort();
    };
  }, []);

  // Handle incoming query
  const handleQuery = (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed) return;

    stopSpeaking();
    setIsSpeaking(false);
    sessionRef.current?.abort();
    setIsListening(false);

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    // Add user message
    const userMsg: VoiceMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: trimmed,
      lang,
      timestamp: timeStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");

    // Run offline intent matcher
    const match = matchQuery(
      trimmed,
      selectedCategory === "all" ? undefined : selectedCategory,
    );
    const dynamicCtx = getDynamicContext();

    let responseText = "";
    let isDynamic = false;
    let matchedEntry: KnowledgeEntry | null = null;

    if (match.entry) {
      matchedEntry = match.entry;
      isDynamic = !!match.entry.isDynamic;
      if (lang === "hi") {
        responseText =
          typeof match.entry.answerHi === "function"
            ? match.entry.answerHi(dynamicCtx)
            : match.entry.answerHi;
      } else {
        responseText =
          typeof match.entry.answerEn === "function"
            ? match.entry.answerEn(dynamicCtx)
            : match.entry.answerEn;
      }
    } else {
      // Fallback
      if (lang === "hi") {
        responseText =
          "मुझे इस विशिष्ट प्रश्न का उत्तर अपने 160 ऑफलाइन विषयों में नहीं मिला। आप नीचे दिए गए सुझाई गई श्रेणियों में से प्रश्न चुन सकते हैं या अपनी भाषा बदल सकते हैं।";
      } else {
        responseText =
          "I could not match your exact phrase within the 160 offline mission topics. Please select one of the suggested inquiries below or refine your query.";
      }
    }

    const astraMsg: VoiceMessage = {
      id: `a-${Date.now()}`,
      sender: "astra",
      text: responseText,
      lang,
      timestamp: timeStr,
      category: matchedEntry?.category,
      intent: matchedEntry?.intent,
      isDynamic,
    };

    setMessages((prev) => [...prev, astraMsg]);

    // Speak response
    speakText(
      responseText,
      lang,
      activeSpeechRate,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
    );
  };

  // Toggle voice recognition
  const toggleListening = () => {
    if (isListening) {
      // User clicked mic while listening: stop session and submit whatever text was collected
      sessionRef.current?.stop();
      setIsListening(false);
      return;
    }

    stopSpeaking();
    setIsSpeaking(false);
    setVoiceNotice(null);

    if (!isSpeechRecognitionSupported()) {
      setVoiceNotice(
        lang === "hi"
          ? "इस ब्राउज़र में स्पीच रिकग्निशन उपलब्ध नहीं है। कृपया नीचे सीधे टाइप करें।"
          : "Speech recognition is not natively supported in this browser. Please type your query in the box.",
      );
      return;
    }

    const session = startSpeechSession(lang, {
      onInterim: (text) => {
        setInputText(text);
      },
      onFinal: (text) => {
        setIsListening(false);
        if (text.trim()) {
          handleQuery(text);
        }
      },
      onError: (err) => {
        setVoiceNotice(err);
        setIsListening(false);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 150);
      },
      onListeningChange: (listening, status) => {
        setIsListening(listening);
        setListeningStatus(status);
      },
      silenceTimeoutMs: 2200,
      maxDurationMs: 15000,
    });

    sessionRef.current = session;
  };

  // Filter suggested questions
  const suggestedList: KnowledgeEntry[] =
    selectedCategory === "all"
      ? knowledgeBase.slice(0, 8)
      : getEntriesByCategory(selectedCategory).slice(0, 8);

  return (
    <>
      {/* Floating Action Trigger Button */}
      <button
        className={`astra-voice-fab ${isListening ? "listening" : ""} ${isSpeaking ? "speaking" : ""}`}
        onClick={() => {
          setIsOpen((prev) => !prev);
          if (isOpen) {
            stopSpeaking();
            setIsSpeaking(false);
            sessionRef.current?.abort();
            setIsListening(false);
          }
        }}
        aria-label="Toggle ASTRA Voice Assistant"
        title="ASTRA Voice Assistant (Offline Ready)"
      >
        <div className="fab-glow-ring" />
        {isListening ? (
          <Mic className="fab-icon active-mic" size={24} />
        ) : isSpeaking ? (
          <Volume2 className="fab-icon active-speaker" size={24} />
        ) : (
          <Mic className="fab-icon" size={24} />
        )}
        <span className="fab-badge">OFFLINE</span>
      </button>

      {/* Voice Assistant Slide-Over Drawer */}
      {isOpen && (
        <aside className="astra-voice-drawer" role="dialog" aria-label="ASTRA Voice Assistant">
          {/* Header */}
          <div className="voice-header">
            <div className="voice-title-group">
              <div className="voice-title-row">
                <Sparkles size={16} className="voice-sparkle" />
                <h3>ASTRA VOICE</h3>
                <span className="voice-offline-tag">
                  <ShieldCheck size={11} /> 160 Q&A OFFLINE
                </span>
              </div>
              <p className="voice-subtitle">Your mission health companion.</p>
            </div>
            <div className="voice-header-actions">
              <button
                className="voice-lang-btn"
                onClick={() => {
                  const nextLang = lang === "en" ? "hi" : "en";
                  setLang(nextLang);
                  stopSpeaking();
                  setIsSpeaking(false);
                  sessionRef.current?.abort();
                  setIsListening(false);
                }}
                title="Switch Language (English / हिन्दी)"
              >
                <Languages size={13} />
                <span>{lang === "en" ? "EN" : "हिन्दी"}</span>
              </button>
              <button
                className="voice-close-btn"
                onClick={() => {
                  setIsOpen(false);
                  stopSpeaking();
                  setIsSpeaking(false);
                  sessionRef.current?.abort();
                  setIsListening(false);
                }}
                aria-label="Close Voice Assistant"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Sound Visualizer & Waveform Bar */}
          <div
            className={`voice-visualizer ${isListening ? "active-listen" : ""} ${isSpeaking ? "active-speak" : ""}`}
            onClick={!isListening && !isSpeaking ? toggleListening : undefined}
            style={{ cursor: !isListening && !isSpeaking ? "pointer" : "default" }}
            title={!isListening && !isSpeaking ? (lang === "hi" ? "बोलने के लिए क्लिक करें" : "Click to speak") : undefined}
          >
            <div className="wave-bars">
              {Array.from({ length: 24 }).map((_, i) => (
                <span
                  key={i}
                  className="wave-bar"
                  style={{
                    animationDelay: `${(i % 6) * 0.1}s`,
                    height: isListening || isSpeaking ? `${25 + ((i * 8) % 65)}%` : "18%",
                  }}
                />
              ))}
            </div>
            <div className="visualizer-status">
              <span className="status-text-truncate">
                {isListening
                  ? inputText
                    ? `🎙️ ${inputText}`
                    : listeningStatus || (lang === "hi" ? "सुन रहा हूँ... बोलिए (15s)" : "Listening... Speak now (15s)")
                  : isSpeaking
                    ? lang === "hi" ? "बोल रहा हूँ..." : "SPEAKING TELEMETRY..."
                    : lang === "hi" ? "माइक दबाकर बोलें या यहाँ क्लिक करें" : "READY · TAP TO SPEAK OR USE MIC"}
              </span>

              {isListening && (
                <div className="visualizer-actions-row">
                  <button
                    type="button"
                    className="mini-stop-btn action-done"
                    onClick={(e) => {
                      e.stopPropagation();
                      sessionRef.current?.stop();
                    }}
                    title="Send now"
                  >
                    <Check size={11} /> {lang === "hi" ? "भेजें" : "Send"}
                  </button>
                  <button
                    type="button"
                    className="mini-stop-btn action-cancel"
                    onClick={(e) => {
                      e.stopPropagation();
                      sessionRef.current?.abort();
                      setIsListening(false);
                      setInputText("");
                    }}
                    title="Cancel"
                  >
                    <X size={11} />
                  </button>
                </div>
              )}

              {isSpeaking && (
                <button
                  type="button"
                  className="mini-stop-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    stopSpeaking();
                    setIsSpeaking(false);
                  }}
                  title="Stop speaking"
                >
                  <VolumeX size={12} /> Mute
                </button>
              )}
            </div>
          </div>

          {/* Optional Voice Notice / Error Banner */}
          {voiceNotice && (
            <div className="voice-notice-banner">
              <div className="notice-inner">
                <span className="notice-text">{voiceNotice}</span>
                <button
                  type="button"
                  className="notice-retry-btn"
                  onClick={() => {
                    setVoiceNotice(null);
                    toggleListening();
                  }}
                  title="Retry Voice Recognition"
                >
                  <RotateCcw size={11} /> {lang === "hi" ? "दोबारा माइक आज़माएं" : "Retry Mic"}
                </button>
              </div>
              <button
                type="button"
                className="notice-dismiss-btn"
                onClick={() => setVoiceNotice(null)}
                aria-label="Dismiss notice"
              >
                <X size={13} />
              </button>
            </div>
          )}

          {/* Category Chips Bar */}
          <div className="voice-category-scroll">
            <button
              className={`cat-chip ${selectedCategory === "all" ? "active" : ""}`}
              onClick={() => setSelectedCategory("all")}
            >
              All (160)
            </button>
            {(Object.keys(categoryLabels) as VoiceCategory[]).map((cat) => (
              <button
                key={cat}
                className={`cat-chip ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {lang === "hi" ? categoryLabels[cat].hi : categoryLabels[cat].en} ({categoryLabels[cat].count})
              </button>
            ))}
          </div>

          {/* Suggested Quick Questions */}
          <div className="suggested-questions-row">
            <span className="suggested-label">{lang === "hi" ? "सुझाए गए:" : "Suggested:"}</span>
            <div className="suggested-scroll">
              {suggestedList.map((entry) => (
                <button
                  key={entry.id}
                  className="suggested-btn"
                  onClick={() => handleQuery(lang === "hi" ? entry.questionHi : entry.questionEn)}
                >
                  {lang === "hi" ? entry.questionHi : entry.questionEn}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="voice-messages-area">
            {messages.map((m) => (
              <div key={m.id} className={`voice-bubble ${m.sender}`}>
                <div className="bubble-meta">
                  <span className="bubble-sender">{m.sender === "astra" ? "ASTRA VOICE" : "ASTRONAUT"}</span>
                  <span className="bubble-time">{m.timestamp}</span>
                  {m.isDynamic && <span className="dynamic-badge">LIVE TELEMETRY</span>}
                </div>
                <p className="bubble-text">{m.text}</p>
                {m.sender === "astra" && (
                  <div className="bubble-actions">
                    <button
                      className="replay-speech-btn"
                      onClick={() => {
                        stopSpeaking();
                        speakText(
                          m.text,
                          lang,
                          activeSpeechRate,
                          () => setIsSpeaking(true),
                          () => setIsSpeaking(false),
                        );
                      }}
                      title="Replay Audio"
                    >
                      <RotateCcw size={12} /> {lang === "hi" ? "दोबारा सुनें" : "Replay"}
                    </button>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Query Input Bar */}
          <form
            className="voice-input-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleQuery(inputText);
            }}
          >
            <button
              type="button"
              className={`mic-input-btn ${isListening ? "listening" : ""}`}
              onClick={toggleListening}
              title={
                isListening
                  ? lang === "hi" ? "रोकें और भेजें" : "Stop and send"
                  : lang === "hi" ? "माइक चालू करें" : "Start speaking"
              }
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isListening
                  ? lang === "hi"
                    ? "बोलिए... आपकी आवाज़ सुनी जा रही है..."
                    : "Listening to your voice... Speak now..."
                  : lang === "hi"
                    ? "स्वास्थ्य प्रश्न पूछें (उदा. Mera heart rate kya hai?)"
                    : "Ask ASTRA (e.g. What is my heart rate?)..."
              }
              className={`voice-text-input ${isListening ? "input-listening-glow" : ""}`}
            />
            <button
              type="submit"
              className="send-query-btn"
              disabled={!inputText.trim()}
              title="Submit Query"
            >
              <Send size={16} />
            </button>
          </form>
        </aside>
      )}
    </>
  );
}
