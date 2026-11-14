import { Play, Pause, RotateCcw, FastForward } from "lucide-react";
import { useStore } from "../state/store";
import type { Scenario } from "../types";
export default function Simulation() {
  const { mission, scenario, run, tick, reset } = useStore();
  return (
    <section className="panel simulation">
      <div>
        <div className="eyebrow">
          MISSION SIMULATOR <span className="tag">DEMO</span>
        </div>
        <p>A safe space to explore your signals.</p>
      </div>
      <div className="scenario-buttons">
        {(["NORMAL", "FATIGUE", "HIGH STRESS", "RECOVERY"] as Scenario[]).map(
          (s) => (
            <button
              key={s}
              aria-pressed={mission.scenario === s}
              onClick={() => scenario(s)}
            >
              {s}
            </button>
          ),
        )}
      </div>
      <div className="sim-controls">
        <button
          className="button primary"
          onClick={() => run(!mission.running)}
        >
          {mission.running ? <Pause size={14} /> : <Play size={14} />}{" "}
          {mission.running
            ? "PAUSE"
            : mission.hour
              ? "RESUME"
              : "START MISSION SIMULATION"}
        </button>
        <button
          className="icon-button"
          title="Reset simulation"
          aria-label="Reset simulation"
          onClick={reset}
        >
          <RotateCcw size={16} />
        </button>
        <button className="button outline" onClick={() => tick(24)}>
          <FastForward size={14} /> ADVANCE MISSION DAY
        </button>
      </div>
      <small>
        Virtual time: 1 hour / 2 seconds · sleep updates once per mission day
      </small>
    </section>
  );
}
