import { X, ExternalLink, BookOpen, ShieldCheck, Award } from "lucide-react";

interface NasaReferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NasaReferencesModal({ isOpen, onClose }: NasaReferencesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="mindspace-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="ref-title">
      <div className="mindspace-modal-card references-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-tag">RESEARCH FOUNDATION</span>
            <h2 id="ref-title">NASA Scientific References & Design Provenance</h2>
            <p className="modal-sub">
              Human Research Program (HRP) evidence base for astronaut behavioral health.
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close references dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className="references-modal-content">
          <div className="scientific-disclaimer-card">
            <ShieldCheck size={20} className="accent-cyan" />
            <div>
              <strong>Scientific Provenance & Non-Endorsement Notice:</strong>
              <p>
                ASTRA MindSpace features are informed by published NASA research and bioastronautics literature. This software is an independent engineering project developed for the NASA Space Apps Challenge and is not an officially sponsored NASA flight software product.
              </p>
            </div>
          </div>

          <div className="references-list">
            {/* Reference 1 */}
            <div className="reference-item">
              <div className="ref-top">
                <span className="ref-badge">NASA HRP RISK 1</span>
                <a
                  href="https://www.nasa.gov/reference/risk-of-behavioral-changes-and-psychiatric-disorders/"
                  target="_blank"
                  rel="noreferrer"
                  className="ref-link"
                >
                  Official NASA Reference <ExternalLink size={12} />
                </a>
              </div>
              <h3>Risk of Adverse Cognitive or Behavioral Conditions and Psychiatric Disorders</h3>
              <p>
                <strong>Scientific Context:</strong> Spaceflight factors—including microgravity, elevated CO₂, cosmic radiation, sleep loss, and intense operational workload—can influence mood, cognitive performance, and autonomic regulation.
              </p>
              <p>
                <strong>MindSpace Integration:</strong> Voluntary daily check-in, transparent non-clinical self-reflection, private local journaling, and direct pathways to certified flight medicine support.
              </p>
            </div>

            {/* Reference 2 */}
            <div className="reference-item">
              <div className="ref-top">
                <span className="ref-badge">NASA HRP RISK 2</span>
                <a
                  href="https://www.nasa.gov/reference/risk-of-inadequate-teamwork/"
                  target="_blank"
                  rel="noreferrer"
                  className="ref-link"
                >
                  Official NASA Reference <ExternalLink size={12} />
                </a>
              </div>
              <h3>Risk of Inadequate Teamwork and Interpersonal Conflict</h3>
              <p>
                <strong>Scientific Context:</strong> High-stakes confined isolation can amplify minor interpersonal frictions. Inadequate communication, role ambiguity, and misaligned expectations directly impact mission success.
              </p>
              <p>
                <strong>MindSpace Integration:</strong> Crew Harmony module with interactive communication practice, 4-step mission debrief protocol, and non-accusatory conflict resolution guides.
              </p>
            </div>

            {/* Reference 3 */}
            <div className="reference-item">
              <div className="ref-top">
                <span className="ref-badge">NASA HRP RISK 3</span>
                <a
                  href="https://www.nasa.gov/hrp/risks/"
                  target="_blank"
                  rel="noreferrer"
                  className="ref-link"
                >
                  Official NASA Reference <ExternalLink size={12} />
                </a>
              </div>
              <h3>Risk of Performance Decrements and Behavioral Health Degradation Due to Sleep Loss and Circadian Disruption</h3>
              <p>
                <strong>Scientific Context:</strong> 16 sunrises and sunsets per 24 hours on orbit disrupt natural melatonin production and slow-wave sleep. Chronic sleep debt impairs working memory and reaction time.
              </p>
              <p>
                <strong>MindSpace Integration:</strong> Sleep quality self-reporting, shift-break relaxation routines, monotonic reaction-time practice, and focus timers.
              </p>
            </div>

            {/* Reference 4 */}
            <div className="reference-item">
              <div className="ref-top">
                <span className="ref-badge">NASA HAZARDS</span>
                <a
                  href="https://www.nasa.gov/hrp/hazards/"
                  target="_blank"
                  rel="noreferrer"
                  className="ref-link"
                >
                  Official NASA Reference <ExternalLink size={12} />
                </a>
              </div>
              <h3>NASA Five Hazards of Human Spaceflight</h3>
              <p>
                <strong>Scientific Context:</strong> Space Radiation, Isolation and Confinement, Distance from Earth, Altered Gravity Fields, and Hostile/Closed Environments.
              </p>
              <p>
                <strong>MindSpace Integration:</strong> Focuses specifically on mitigating the psychological and cognitive demands of Isolation, Confinement, and Closed Habitat Living.
              </p>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="button primary" onClick={onClose}>
            Close References
          </button>
        </div>
      </div>
    </div>
  );
}
