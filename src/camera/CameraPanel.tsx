import { useEffect, useRef, useState } from "react";
import { Camera, ScanFace, ScanLine, ShieldCheck } from "lucide-react";
import type {
  FaceLandmarker,
  PoseLandmarker,
  NormalizedLandmark,
} from "@mediapipe/tasks-vision";
import { drawLandmarks, smooth } from "./LandmarkOverlay";
export default function CameraPanel() {
  const video = useRef<HTMLVideoElement>(null),
    canvas = useRef<HTMLCanvasElement>(null),
    stream = useRef<MediaStream | null>(null),
    models = useRef<{ face: FaceLandmarker; pose: PoseLandmarker } | null>(
      null,
    ),
    timer = useRef(0),
    generation = useRef(0),
    active = useRef(false);
  const [enabled, setEnabled] = useState(false),
    [tracking, setTracking] = useState(false),
    [loading, setLoading] = useState(false),
    [error, setError] = useState(""),
    [face, setFace] = useState(false),
    [pose, setPose] = useState(false);
  const clear = () => {
    const c = canvas.current;
    c?.getContext("2d")?.clearRect(0, 0, c.width, c.height);
    setFace(false);
    setPose(false);
  };
  function pause() {
    active.current = false;
    window.clearTimeout(timer.current);
    setTracking(false);
    clear();
  }
  function stop() {
    generation.current++;
    active.current = false;
    window.clearTimeout(timer.current);
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
    models.current?.face.close();
    models.current?.pose.close();
    models.current = null;
    if (video.current) video.current.srcObject = null;
    setEnabled(false);
    setTracking(false);
    setLoading(false);
    clear();
  }
  useEffect(
    () => () => {
      generation.current++;
      active.current = false;
      clearTimeout(timer.current);
      stream.current?.getTracks().forEach((t) => t.stop());
      models.current?.face.close();
      models.current?.pose.close();
    },
    [],
  );
  async function enable() {
    setError("");
    const token = ++generation.current;
    setLoading(true);
    try {
      if (!navigator.mediaDevices?.getUserMedia)
        throw new Error(
          "Camera requires a supported browser on HTTPS or localhost.",
        );
      const s = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
        audio: false,
      });
      if (token !== generation.current) {
        s.getTracks().forEach((t) => t.stop());
        return;
      }
      stream.current = s;
      if (video.current) {
        video.current.srcObject = s;
        await video.current.play();
      }
      setEnabled(true);
    } catch (e) {
      if (token === generation.current) {
        stream.current?.getTracks().forEach((t) => t.stop());
        stream.current = null;
        setError(
          e instanceof DOMException && e.name === "NotAllowedError"
            ? "Camera permission was denied. Allow access in your browser and try again."
            : e instanceof Error
              ? e.message
              : "Camera unavailable.",
        );
      }
    } finally {
      if (token === generation.current) setLoading(false);
    }
  }
  async function start() {
    setError("");
    setLoading(true);
    const token = generation.current;
    let partial: FaceLandmarker | null = null;
    try {
      const { FilesetResolver, FaceLandmarker, PoseLandmarker } =
        await import("@mediapipe/tasks-vision");
      if (!models.current) {
        const files = await FilesetResolver.forVisionTasks("/wasm");
        partial = await FaceLandmarker.createFromOptions(files, {
          baseOptions: {
            modelAssetPath: "/models/face_landmarker.task",
            delegate: "CPU",
          },
          runningMode: "VIDEO",
          numFaces: 1,
        });
        const p = await PoseLandmarker.createFromOptions(files, {
          baseOptions: {
            modelAssetPath: "/models/pose_landmarker_lite.task",
            delegate: "CPU",
          },
          runningMode: "VIDEO",
          numPoses: 1,
        });
        if (token !== generation.current) {
          partial.close();
          p.close();
          return;
        }
        models.current = { face: partial, pose: p };
        partial = null;
      }
      if (token !== generation.current) return;
      active.current = true;
      setTracking(true);
      let last = -1,
        faceStart = 0,
        poseStart = 0;
      let previousFace: NormalizedLandmark[] = [],
        previousPose: NormalizedLandmark[] = [];
      const loop = () => {
        if (!active.current || token !== generation.current) return;
        const v = video.current,
          c = canvas.current,
          m = models.current;
        if (v && c && m && v.readyState >= 2 && v.currentTime !== last) {
          last = v.currentTime;
          try {
            const now = performance.now(),
              f = m.face.detectForVideo(v, now).faceLandmarks[0] ?? [],
              p = m.pose.detectForVideo(v, now).landmarks[0] ?? [];
            c.width = v.videoWidth;
            c.height = v.videoHeight;
            const ctx = c.getContext("2d")!;
            setFace(f.length > 0);
            setPose(p.some((x) => (x.visibility ?? 0) > 0.6));
            if (f.length) {
              faceStart ||= now;
              previousFace = smooth(f, previousFace);
              drawLandmarks(
                ctx,
                previousFace,
                FaceLandmarker.FACE_LANDMARKS_TESSELATION,
                Math.min(1, (now - faceStart) / 650),
              );
            } else {
              faceStart = 0;
              previousFace = [];
            }
            if (p.length) {
              poseStart ||= now;
              previousPose = smooth(p, previousPose);
              drawLandmarks(
                ctx,
                previousPose,
                PoseLandmarker.POSE_CONNECTIONS,
                Math.min(1, (now - poseStart) / 800),
                true,
              );
            } else {
              poseStart = 0;
              previousPose = [];
            }
          } catch (e) {
            pause();
            setError(
              "Tracking stopped. Try restarting tracking or your camera.",
            );
            return;
          }
        }
        timer.current = window.setTimeout(loop, 100);
      };
      loop();
    } catch (e) {
      partial?.close();
      if (token === generation.current)
        setError(
          "Tracking models could not load. Check local model assets and try again.",
        );
    } finally {
      if (token === generation.current) setLoading(false);
    }
  }
  return (
    <section className="panel camera-panel">
      <div className="panel-heading">
        <span>
          <Camera size={15} /> CAMERA TRACKING
        </span>
        <i className={enabled ? "dot" : "dot muted"} />
      </div>
      <div className="camera-feed">
        <video ref={video} muted playsInline aria-label="Local camera feed" />
        <canvas ref={canvas} aria-hidden="true" />
        {!enabled && (
          <div className="camera-empty">
            <ScanFace size={36} strokeWidth={1} />
            <strong>Your space. Your privacy.</strong>
            <span>Camera is off by default</span>
          </div>
        )}
        <span className="feed-label">
          {tracking
            ? "LOCAL TRACKING"
            : enabled
              ? "CAMERA READY"
              : "CAMERA OFF"}
        </span>
        <div className="feed-corner" />
      </div>
      <div className="detection-labels">
        <span>
          <ScanFace size={14} />
          {face ? "FACE DETECTED" : "NO FACE DETECTED"}
        </span>
        <span>
          <ScanLine size={14} />
          {pose ? "BODY DETECTED" : "NO BODY DETECTED"}
        </span>
      </div>
      <div className="camera-controls">
        {!enabled ? (
          <button
            className="button outline"
            disabled={loading}
            onClick={enable}
          >
            {loading ? "ENABLING…" : "ENABLE CAMERA"}
          </button>
        ) : (
          <>
            <button
              className="button outline"
              disabled={loading}
              onClick={tracking ? pause : start}
            >
              {loading
                ? "LOADING MODELS…"
                : tracking
                  ? "PAUSE TRACKING"
                  : "START TRACKING"}
            </button>
            <button className="text-button" onClick={stop}>
              STOP CAMERA
            </button>
          </>
        )}
      </div>
      {loading && !enabled && (
        <button className="text-button" onClick={stop}>
          CANCEL CAMERA REQUEST
        </button>
      )}
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      <p className="privacy">
        <ShieldCheck size={13} />
        Camera processing happens on your device. Video is not uploaded or
        recorded.
      </p>
    </section>
  );
}
