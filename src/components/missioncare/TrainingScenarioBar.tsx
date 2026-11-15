import { useState } from "react";
import {
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Info,
  AlertTriangle,
} from "lucide-react";
import {
  TRAINING_SCENARIOS,
  isTrainingDemoActive,
  setTrainingDemoActive,
  getActiveTrainingScenarioId,
  setActiveTrainingScenarioId,
  getTrainingScenarioStep,
  setTrainingScenarioStep,
  type TrainingScenarioDef,
} from "../../services/missionCareService";

interface TrainingScenarioBarProps {
  onScenarioChange?: (scenarioId: string) => void;
}

export default function TrainingScenarioBar({ onScenarioChange }: TrainingScenarioBarProps) {
  const [isActive, setIsActive] = useState(() => isTrainingDemoActive());
  const [scenarioId, setScenarioId] = useState(() => getActiveTrainingScenarioId());
  const [currentStep, setCurrentStep] = useState(() => getTrainingScenarioStep());
  const [isPaused, setIsPaused] = useState(false);

  const scenario = TRAINING_SCENARIOS.find((s) => s.id === scenarioId) || TRAINING_SCENARIOS[0];
  const stepObj = scenario.steps.find((st) => st.stepNumber === currentStep) || scenario.steps[0];
  const totalSteps = scenario.steps.length;

  const handleStart = () => {
    setIsActive(true);
    setTrainingDemoActive(true);
    setCurrentStep(1);
    setTrainingScenarioStep(1);
    setIsPaused(false);
  };

  const handleStop = () => {
    setIsActive(false);
    setTrainingDemoActive(false);
    setCurrentStep(1);
    setTrainingScenarioStep(1);
    setIsPaused(false);
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      const next = currentStep + 1;
      setCurrentStep(next);
      setTrainingScenarioStep(next);
    } else {
      handleStop();
    }
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setTrainingScenarioStep(1);
    setIsPaused(false);
  };

  const handleScenarioSelect = (id: string) => {
    setScenarioId(id);
    setActiveTrainingScenarioId(id);
    setCurrentStep(1);
    setTrainingScenarioStep(1);
    if (onScenarioChange) onScenarioChange(id);
  };

  return (
    <div className={`training-scenario-banner ${isActive ? "active" : ""}`}>
      <div className="banner-top-line">
        <div className="banner-left">
          <span className="sim-pill">
            <Sparkles size={12} /> SIMULATED TRAINING SCENARIO
          </span>
          <select
            value={scenarioId}
            onChange={(e) => handleScenarioSelect(e.target.value)}
            className="sim-scenario-select"
            disabled={isActive}
          >
            {TRAINING_SCENARIOS.map((sc) => (
              <option key={sc.id} value={sc.id}>
                {sc.title}
              </option>
            ))}
          </select>
        </div>

        <div className="banner-controls">
          {!isActive ? (
            <button
              type="button"
              className="button primary small-btn"
              onClick={handleStart}
            >
              <Play size={13} /> Start Scenario
            </button>
          ) : (
            <div className="active-sim-buttons">
              <button
                type="button"
                className="button outline small-btn"
                onClick={() => setIsPaused(!isPaused)}
              >
                {isPaused ? <Play size={13} /> : <Pause size={13} />}
                <span>{isPaused ? "Resume" : "Pause"}</span>
              </button>
              <button
                type="button"
                className="button outline small-btn"
                onClick={handleRestart}
              >
                <RotateCcw size={13} /> Restart
              </button>
              <button
                type="button"
                className="button primary small-btn"
                onClick={handleNextStep}
              >
                <span>{currentStep === totalSteps ? "Finish Simulation" : "Next Step"}</span>
                <ChevronRight size={13} />
              </button>
            </div>
          )}
        </div>
      </div>

      {isActive && (
        <div className="sim-step-drawer">
          <div className="step-progress-row">
            <span className="step-counter">
              STEP {currentStep} OF {totalSteps}: <strong>{stepObj.title}</strong>
            </span>
            <span className="patient-tag">Patient: {scenario.patientName}</span>
          </div>

          <p className="step-desc">{stepObj.description}</p>

          <div className="step-directives-row">
            <div className="expected-action-pill">
              <CheckCircle2 size={13} className="accent-mint" />
              <span>
                <strong>Required Action:</strong> {stepObj.expectedAction}
              </span>
            </div>
            <div className="hint-pill">
              <Info size={13} className="accent-cyan" />
              <span>
                <strong>Clinical Safety Hint:</strong> {stepObj.hint}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
