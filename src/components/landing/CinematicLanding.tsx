import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Play,
  Pause,
  AudioLines,
  Volume2,
  BookOpen,
  Github,
  ExternalLink,
} from "lucide-react";
import { introConfig } from "./introConfig";
import { introAudioService } from "../../services/introAudioService";
import "../../styles/intro.css";

export type IntroState =
  | "INITIAL_LOADING"
  | "DOORS_CLOSED"
  | "DOORS_OPENING"
  | "VIDEO_REVEALED"
  | "WELCOME_VISIBLE"
  | "ENTERING_MISSION"
  | "DASHBOARD_OPEN";
type Props = {
  onEnter: () => void;
  reducedMotion: boolean;
  onExploreNasaSources?: () => void;
};

export default function CinematicLanding({
  onEnter,
  reducedMotion,
  onExploreNasaSources,
}: Props) {
  const [stage, setStage] = useState<IntroState>("INITIAL_LOADING");
  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [playing, setPlaying] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const committed = useRef(false);
  const entering = useRef(false);
  const alive = useRef(true);
  const callback = useRef(onEnter);
  callback.current = onEnter;

  useEffect(() => {
    alive.current = true;
    const media = video.current;
    if (media) {
      media.muted = true;
      media.defaultMuted = true;
      media.playsInline = true;
      if (!reducedMotion) {
        void playVideo();
      }
    }
    const deadline = window.setTimeout(
      () => setReady(true),
      introConfig.loadingTimeout,
    );
    return () => {
      alive.current = false;
      clearTimeout(deadline);
      media?.pause();
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) {
      video.current?.pause();
      setPlaying(false);
    }
  }, [reducedMotion]);

  useEffect(() => {
    // When landing page opens, queue or play the greeting in compliance with browser autoplay policy
    introAudioService.playGreeting();

    // Unlocks Web Audio API cleanly on user's very first click/tap/keypress
    const handleFirstGesture = () => {
      introAudioService.markUserInteracted();
    };
    window.addEventListener("pointerdown", handleFirstGesture, { once: true, passive: true });
    window.addEventListener("keydown", handleFirstGesture, { once: true });
    window.addEventListener("click", handleFirstGesture, { once: true });

    return () => {
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
      window.removeEventListener("click", handleFirstGesture);
    };
  }, []);

  useEffect(() => {
    if (stage === "WELCOME_VISIBLE") {
      introAudioService.playGreeting();
    }
  }, [stage]);

  // Each state owns its timer. Unmount, skip and state changes cancel pending work.
  useEffect(() => {
    let delay: number | undefined;
    let next: IntroState | undefined;
    if (stage === "INITIAL_LOADING") {
      delay = 0;
      next = "DOORS_CLOSED";
    }
    if (stage === "DOORS_CLOSED" && ready) {
      delay = reducedMotion ? 0 : introConfig.seamDuration;
      next = "DOORS_OPENING";
    }
    if (stage === "DOORS_OPENING") {
      delay = reducedMotion ? 0 : introConfig.doorDuration;
      next = "VIDEO_REVEALED";
    }
    if (stage === "VIDEO_REVEALED") {
      delay = reducedMotion ? 0 : 100;
      next = "WELCOME_VISIBLE";
    }
    if (stage === "ENTERING_MISSION") {
      delay = reducedMotion ? 0 : introConfig.enterDuration;
      next = "DASHBOARD_OPEN";
    }
    if (stage === "DASHBOARD_OPEN" && !committed.current) {
      committed.current = true;
      video.current?.pause();
      callback.current();
    }
    if (next !== undefined) {
      const nextStage = next;
      const timer = window.setTimeout(() => setStage(nextStage), delay);
      return () => clearTimeout(timer);
    }
  }, [stage, ready, reducedMotion]);

  async function playVideo() {
    if (!video.current) return;
    try {
      video.current.muted = true;
      video.current.defaultMuted = true;
      video.current.playsInline = true;
      await video.current.play();
      if (alive.current) {
        setBlocked(false);
        setPlaying(true);
        setLoaded(true);
        setReady(true);
      }
    } catch {
      if (alive.current) {
        setBlocked(true);
        setReady(true);
      }
    }
  }
  function enter() {
    introAudioService.markUserInteracted();
    introAudioService.playGreeting(true);
    if (entering.current || stage !== "WELCOME_VISIBLE") return;
    entering.current = true;
    setStage("ENTERING_MISSION");
  }
  function skip() {
    introAudioService.markUserInteracted();
    introAudioService.playGreeting(true);
    if (committed.current) return;
    entering.current = true;
    setStage("DASHBOARD_OPEN");
  }
  const doorsOpen = !["INITIAL_LOADING", "DOORS_CLOSED"].includes(stage);
  const welcome = stage === "WELCOME_VISIBLE";
  const transitioning =
    stage === "ENTERING_MISSION" || stage === "DASHBOARD_OPEN";
  const ease = [0.76, 0, 0.24, 1] as const;

  return (
    <main
      className={`astra-intro ${reducedMotion ? "intro-reduced" : ""}`}
      data-intro-state={stage}
      aria-label="Welcome to ASTRA"
    >
      <motion.div
        className="intro-world"
        initial={false}
        animate={{ scale: transitioning && !reducedMotion ? 1.055 : 1 }}
        transition={{ duration: 0.8, ease }}
      >
        <div className="intro-fallback" aria-hidden="true">
          <div className="intro-planet" />
          <div className="intro-orbit" />
        </div>
        <video
          ref={video}
          className={`intro-video ${loaded && !failed ? "is-loaded" : ""}`}
          src={introConfig.videoSrc}
          poster={introConfig.posterSrc}
          autoPlay={!reducedMotion}
          muted
          loop
          playsInline
          preload="auto"
          controls={false}
          disablePictureInPicture
          aria-hidden="true"
          tabIndex={-1}
          onLoadedMetadata={() => {
            setLoaded(true);
            setReady(true);
            if (!reducedMotion) void playVideo();
          }}
          onCanPlay={() => {
            setLoaded(true);
            setReady(true);
            if (!reducedMotion) void playVideo();
          }}
          onLoadedData={() => {
            setLoaded(true);
            setReady(true);
            if (!reducedMotion) void playVideo();
          }}
          onPlaying={() => {
            setPlaying(true);
            setBlocked(false);
            setReady(true);
          }}
          onPause={() => setPlaying(false)}
          onError={() => {
            setFailed(true);
            setReady(true);
            setPlaying(false);
          }}
        />
        <div className="intro-shade" aria-hidden="true" />
      </motion.div>

      <div className="intro-topline">
        <span className="intro-wordmark">
          <span aria-hidden="true">✳</span> ASTRA{" "}
          <span className="intro-wordmark-rule" />
        </span>
        <div className="intro-top-actions">
          <a
            href="https://github.com/Ashish-004-mar/astra-astronaut-health-monitor"
            target="_blank"
            rel="noopener noreferrer"
            className="intro-top-github-btn"
            title="Open official ASTRA repository on GitHub"
          >
            <Github size={13} />
            <span>GITHUB REPO</span>
            <ExternalLink size={11} />
          </a>
          <button className="intro-skip" onClick={skip}>
            SKIP INTRO <ArrowRight size={13} />
          </button>
        </div>
      </div>

      <motion.div
        className="intro-welcome"
        initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
        animate={{
          opacity: welcome ? 1 : 0,
          y: welcome || reducedMotion ? 0 : 12,
        }}
        transition={{ duration: reducedMotion ? 0 : 0.45 }}
        aria-hidden={!welcome}
      >
        <div className="intro-kicker">
          <span /> HUMAN HEALTH. BEYOND EARTH.
        </div>
        <h1>ASTRA</h1>
        <p className="intro-subtitle">ASTRONAUT HEALTH MONITOR</p>
        <p className="intro-tagline">Know your health. Stay mission-ready.</p>
        {introConfig.showAdditionalText && (
          <p className="intro-additional">{introConfig.additionalText}</p>
        )}
      </motion.div>

      <motion.div
        className="intro-entry"
        initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
        animate={{
          opacity: welcome ? 1 : 0,
          y: welcome || reducedMotion ? 0 : 10,
        }}
        transition={{ duration: reducedMotion ? 0 : 0.3 }}
      >
        <button
          className="intro-arrow"
          aria-label="Enter mission"
          disabled={!welcome}
          onClick={enter}
        >
          <ArrowRight size={27} strokeWidth={1.3} />
        </button>
        <span className="intro-entry-label">ENTER MISSION</span>

        <button
          type="button"
          className="intro-nasa-sources-btn"
          disabled={!welcome}
          onClick={() => {
            if (onExploreNasaSources) {
              onExploreNasaSources();
            } else {
              window.location.hash = "#/nasa-sources";
            }
          }}
          title="Examine official NASA research, space biology, and public data APIs used in ASTRA"
        >
          <div className="btn-title-row">
            <BookOpen size={13} className="nasa-icon" />
            <span>NASA DATA &amp; RESEARCH USED</span>
          </div>
          <span className="btn-microtext">
            Official References • Public APIs • Integrated Evidence
          </span>
        </button>

        <motion.a
          href="https://github.com/Ashish-004-mar/astra-astronaut-health-monitor"
          target="_blank"
          rel="noopener noreferrer"
          className="intro-github-btn"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: welcome ? [0.8, 1.06, 1] : 0.8,
            opacity: welcome ? 1 : 0,
          }}
          transition={{
            duration: 0.45,
            ease: "easeOut",
            delay: 0.1,
          }}
          title="Open official ASTRA GitHub Repository — Source Code &amp; NASA Space Apps Project"
        >
          <div className="btn-title-row">
            <Github size={14} className="github-icon" />
            <span>GITHUB REPOSITORY</span>
            <ExternalLink size={12} className="github-ext-icon" />
          </div>
          <span className="btn-microtext">
            Public Source Code • Space Apps Challenge • Direct Access
          </span>
        </motion.a>
      </motion.div>

      <div className="intro-bottomline">
        <span>
          MISSION CONTROL <span className="intro-separator">/</span> 01
        </span>
        <span className="intro-media-controls">
          {failed ? (
            <span role="status">VIDEO UNAVAILABLE · ORBITAL BACKGROUND</span>
          ) : (
            <button
              onClick={() =>
                playing ? video.current?.pause() : void playVideo()
              }
              aria-label={
                playing ? "Pause background video" : "Play background video"
              }
            >
              {playing ? <Pause size={12} /> : <Play size={12} />}{" "}
              {blocked
                ? "PLAY BACKGROUND VIDEO"
                : playing
                  ? "PAUSE VIDEO"
                  : "PLAY VIDEO"}
            </button>
          )}
          <button
            type="button"
            className="intro-silent intro-audio-btn"
            onClick={() => introAudioService.playGreeting(true)}
            title="Play ASTRA voice introduction"
          >
            <Volume2 size={12} /> ASTRA VOICE ONLINE
          </button>
        </span>
      </div>

      <div className="intro-doors" aria-hidden="true">
        {(["left", "right"] as const).map((side) => (
          <motion.div
            key={side}
            className={`intro-door intro-door-${side}`}
            initial={false}
            animate={{
              x: doorsOpen ? (side === "left" ? "-101%" : "101%") : "0%",
            }}
            transition={{
              duration: reducedMotion ? 0 : introConfig.doorDuration / 1000,
              ease,
            }}
          >
            <div className="door-inset" />
            <div className="door-glass" />
            <div className="door-groove groove-top" />
            <div className="door-groove groove-bottom" />
            <span className="door-code">
              {side === "left" ? "ASTRA / CREW ACCESS" : "PRESSURIZED / 01"}
            </span>
            <div className="door-handle">
              <i />
              <i />
              <i />
            </div>
            <div className={`door-seam ${ready ? "energized" : ""}`} />
            <span className="door-label">
              {side === "left" ? "MISSION" : "READY"}
            </span>
          </motion.div>
        ))}
      </div>
      <motion.div
        className="intro-light-sweep"
        aria-hidden="true"
        initial={false}
        animate={{
          x: transitioning ? "160%" : "-160%",
          opacity: transitioning && !reducedMotion ? 0.65 : 0,
        }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      />
      <motion.div
        className="intro-blackout"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: transitioning ? 1 : 0 }}
        transition={{
          duration: reducedMotion ? 0 : 0.4,
          delay: reducedMotion ? 0 : 0.4,
        }}
      />
      <span className="intro-sr" role="status" aria-live="polite">
        {transitioning
          ? "Entering mission control."
          : welcome
            ? "Welcome to ASTRA. Enter mission when ready."
            : ""}
      </span>
    </main>
  );
}
