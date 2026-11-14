import React from "react";
import { Github, Globe, ExternalLink } from "lucide-react";

export function ShowcaseNavbar() {
  return (
    <header className="showcase-navbar">
      <div className="brand-wrapper">
        <a href="#hero" className="brand-logo" style={{ textDecoration: "none" }}>
          <span className="brand-dot" />
          <span>ASTRA</span>
        </a>
        <span className="badge-nasa">NASA SPACE APPS 2026</span>
      </div>

      <nav className="nav-links">
        <a href="#hero">OVERVIEW</a>
        <a href="#earth">3D EARTH</a>
        <a href="#architecture">ARCHITECTURE</a>
        <a href="#features">FEATURES</a>
        <a href="#benefits">BENEFITS</a>
        <a href="#science">SCIENCE</a>
      </nav>

      <a
        href="https://github.com/Ashish-004-mar/astra-astronaut-health-monitor"
        target="_blank"
        rel="noopener noreferrer"
        className="nav-cta-btn"
      >
        <Github size={14} />
        <span>GITHUB REPO</span>
      </a>
    </header>
  );
}

export function ShowcaseFooter() {
  return (
    <footer className="showcase-footer">
      <div className="footer-brand">ASTRA — Astronaut Health Monitor</div>
      <div className="footer-meta">
        NASA Space Apps Challenge 2026 Project // Open-Source Bioastronautics Platform
      </div>

      <div className="footer-links">
        <a href="https://github.com/Ashish-004-mar/astra-astronaut-health-monitor" target="_blank" rel="noopener noreferrer">
          GitHub Repository
        </a>
        <a href="#hero">Hero Video</a>
        <a href="#earth">3D Earth Canvas</a>
        <a href="#architecture">5-Layer Architecture</a>
        <a href="#features">Operational Features</a>
      </div>

      <p className="footer-copy">
        Created by Ashish-004-mar for the NASA Space Apps Challenge 2026. Built with React 19, TypeScript, Three.js & WebGL.
      </p>
    </footer>
  );
}
