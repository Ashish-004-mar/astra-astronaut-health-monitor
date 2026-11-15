import React, { useRef, useState, useEffect } from "react";
import { Volume2, VolumeX, Play, Pause, Compass, Github, ShieldAlert, Rocket } from "lucide-react";

interface Props {
  onExploreClick: () => void;
}

export default function HeroVideoSection({ onExploreClick }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setVideoLoaded(true);
        })
        .catch(() => {
          // Autoplay was blocked
          setIsPlaying(false);
        });
    }
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play();
      setIsPlaying(true);
    }
  };

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isMuted) {
      video.muted = false;
      setIsMuted(false);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  };

  return (
    <section className="hero-video-section" id="hero">
      {/* Background Video */}
      <video
        ref={videoRef}
        className="hero-video-bg"
        src="./media/astra-intro.mp4"
        loop
        playsInline
        muted
        poster="./readme-assets/hero-video-thumb.jpg"
        onLoadedData={() => setVideoLoaded(true)}
      />

      {/* Atmospheric Overlays */}
      <div className="hero-overlay-dark" />
      <div className="hero-scanline-grid" />

      {/* Hero Content Overlay */}
      <div className="hero-content">
        <div className="hero-pretitle">
          <span className="brand-dot" />
          <span>NASA SPACE APPS CHALLENGE 2026 // BIOASTRONAUTICS</span>
        </div>

        <h1 className="hero-title">ASTRA</h1>
        <h2 className="hero-subtitle">ASTRONAUT HEALTH MONITOR</h2>

        <p className="hero-tagline">"Beyond Earth. Beyond Limits."</p>
        <p className="hero-description">
          Exploring the future of autonomous astronaut health awareness, physiological digital twins, 
          and closed-loop life support readiness for deep space exploration.
        </p>

        <div className="hero-actions">
          <a
            href="https://astra-health-monitor.embarko.app"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Rocket size={18} />
            <span>LAUNCH LIVE APP (EMBARKO)</span>
          </a>

          <button className="btn-secondary" onClick={onExploreClick}>
            <Compass size={18} />
            <span>EXPLORE 3D SHOWCASE</span>
          </button>

          <a
            href="https://github.com/Ashish-004-mar/astra-astronaut-health-monitor"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            <Github size={18} />
            <span>VIEW GITHUB SOURCE</span>
          </a>
        </div>
      </div>

      {/* Video Control Dock */}
      <div className="video-control-dock">
        <button
          className="video-ctrl-btn"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          <span>{isPlaying ? "PAUSE" : "PLAY"}</span>
        </button>

        <button
          className="video-ctrl-btn"
          onClick={toggleSound}
          aria-label={isMuted ? "Unmute sound" : "Mute sound"}
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          <span>{isMuted ? "MUTED" : "SOUND ON"}</span>
        </button>

        <div className="video-badge">
          <span>CINEMATIC PROLOGUE // 1080P</span>
        </div>
      </div>
    </section>
  );
}
