import { X, ShieldAlert, HeartHandshake, PhoneCall, Radio, FileText, Check } from "lucide-react";

interface SupportSafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SupportSafetyModal({ isOpen, onClose }: SupportSafetyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="mindspace-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="support-title">
      <div className="mindspace-modal-card support-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-tag alert-tag">MISSION SUPPORT PATHWAYS</span>
            <h2 id="support-title">Astronaut Psychological & Medical Support</h2>
            <p className="modal-sub">
              Voluntary guidance and official mission escalation protocols.
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close support dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className="support-modal-content">
          {/* Critical Boundary Notice */}
          <div className="support-alert-box">
            <ShieldAlert size={22} className="alert-icon" />
            <div>
              <strong>NON-CLINICAL EDUCATIONAL TOOL</strong>
              <p>
                ASTRA MindSpace provides voluntary self-reflection and coping exercises. It does <strong>NOT</strong> diagnose, treat, or manage medical or psychiatric disorders. Software exercises never replace qualified clinical care or formal mission safety procedures.
              </p>
            </div>
          </div>

          {/* Structured Support Tiers */}
          <div className="support-tiers-grid">
            {/* Tier 1: In-Flight Self-Care & Habitat Tools */}
            <div className="support-tier-card">
              <div className="tier-header">
                <span className="tier-num">TIER 1</span>
                <h3>Autonomous Self-Care & Habitats</h3>
              </div>
              <p className="tier-desc">
                First-line techniques for managing daily operational stress, fatigue, and sensory confinement:
              </p>
              <ul className="tier-list">
                <li>
                  <Check size={14} className="list-check" />
                  <strong>Stress Recovery Studio:</strong> 3–5 min resonant breathing & sensory grounding.
                </li>
                <li>
                  <Check size={14} className="list-check" />
                  <strong>Circadian Lighting:</strong> Verify dynamic blue-enriched shift schedule in habitat.
                </li>
                <li>
                  <Check size={14} className="list-check" />
                  <strong>Private Journaling:</strong> Process challenges without fear of mission telemetry review.
                </li>
                <li>
                  <Check size={14} className="list-check" />
                  <strong>Rest Routine:</strong> Deconflict scheduled workout and personal hygiene windows.
                </li>
              </ul>
            </div>

            {/* Tier 2: Crew Peer Support & Communication */}
            <div className="support-tier-card">
              <div className="tier-header">
                <span className="tier-num">TIER 2</span>
                <h3>Crew Peer Support & Team Deconfliction</h3>
              </div>
              <p className="tier-desc">
                Collaborative actions within the on-orbit crew to maintain psychological safety:
              </p>
              <ul className="tier-list">
                <li>
                  <Check size={14} className="list-check" />
                  <strong>Structured Mission Debrief:</strong> Review shift bottlenecks using the 4-step framework.
                </li>
                <li>
                  <Check size={14} className="list-check" />
                  <strong>Informal Check-ins:</strong> Connect during scheduled mess and cupola windows.
                </li>
                <li>
                  <Check size={14} className="list-check" />
                  <strong>Workload Re-balancing:</strong> Discuss task division with Mission Commander.
                </li>
                <li>
                  <Check size={14} className="list-check" />
                  <strong>Quiet Hours Adherence:</strong> Respect individual crew sleep compartment sound dampening.
                </li>
              </ul>
            </div>

            {/* Tier 3: Professional Behavioral Medicine (BMed) */}
            <div className="support-tier-card highlight-tier">
              <div className="tier-header">
                <span className="tier-num">TIER 3</span>
                <h3>Authorized Mission Behavioral Medicine (BMed)</h3>
              </div>
              <p className="tier-desc">
                Direct confidential consultations with certified flight surgeons and space psychologists:
              </p>
              <ul className="tier-list">
                <li>
                  <Radio size={14} className="list-icon" />
                  <strong>Private Medical Conference (PMC):</strong> Bi-weekly confidential video/audio link with Flight Surgeon.
                </li>
                <li>
                  <Radio size={14} className="list-icon" />
                  <strong>BMed Consult on Demand:</strong> Schedule asynchronous or real-time support during TDRS comm passes.
                </li>
                <li>
                  <Radio size={14} className="list-icon" />
                  <strong>Confidentiality Protection:</strong> Personal mental health dialogues are protected under NASA Medical Privacy standards.
                </li>
              </ul>
            </div>

            {/* Tier 4: Acute Medical Escalation */}
            <div className="support-tier-card urgent-tier">
              <div className="tier-header">
                <span className="tier-num">TIER 4</span>
                <h3>Acute Safety & Emergency Protocol</h3>
              </div>
              <p className="tier-desc">
                For sudden incapacitation, acute severe distress, or mission-critical safety risks:
              </p>
              <div className="urgent-guidance">
                <strong>IMMEDIATE ACTION DIRECTIVE:</strong>
                <p>
                  Notify the Mission Commander and notify Ground Control via Space-to-Ground 1 (S/G-1) voice loop. Follow habitat Medical Emergency Checklist (MEC Volume 2).
                </p>
                <small>
                  Note: In spaceflight simulation or disconnected desktop environments, this software does NOT maintain a live connection to emergency medical dispatch.
                </small>
              </div>
            </div>
          </div>

          {/* NASA Guidance Citation */}
          <div className="support-footer-note">
            <HeartHandshake size={14} />
            <span>
              Informed by NASA Flight Medicine Standards and the Behavioral Health & Performance (BHP) Operational Roadmap.
            </span>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="button primary" onClick={onClose}>
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}
