import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

export interface BodyPartItem {
  id: "cranial" | "chest" | "leftArm" | "rightArm" | "legs";
  label: string;
  shortLabel: string;
  detected: boolean;
  confidence: number;
  anchor?: { x: number; y: number };
}

export interface DetectionAnalysis {
  parts: BodyPartItem[];
  detectedNames: string[];
  primaryRegion: string;
  summaryText: string;
  postureQuality: string;
  jointAngles: {
    leftElbow?: number;
    rightElbow?: number;
    shoulderTilt?: number;
  };
}

export const INITIAL_ANALYSIS: DetectionAnalysis = {
  parts: [
    { id: "cranial", label: "HEAD / CRANIAL", shortLabel: "HEAD", detected: false, confidence: 0 },
    { id: "chest", label: "CHEST / TORSO", shortLabel: "CHEST", detected: false, confidence: 0 },
    { id: "leftArm", label: "LEFT ARM", shortLabel: "L-ARM", detected: false, confidence: 0 },
    { id: "rightArm", label: "RIGHT ARM", shortLabel: "R-ARM", detected: false, confidence: 0 },
    { id: "legs", label: "LEGS / LOWER BODY", shortLabel: "LEGS", detected: false, confidence: 0 },
  ],
  detectedNames: [],
  primaryRegion: "AWAITING TELEMETRY",
  summaryText: "No landmarks detected",
  postureQuality: "STANDBY",
  jointAngles: {},
};

export function smooth(
  points: NormalizedLandmark[],
  previous: NormalizedLandmark[],
) {
  return points.map((p, i) => ({
    ...p,
    x: previous[i] ? previous[i].x * 0.35 + p.x * 0.65 : p.x,
    y: previous[i] ? previous[i].y * 0.35 + p.y * 0.65 : p.y,
  }));
}

export function analyzeBodyParts(
  posePoints: NormalizedLandmark[],
  facePoints: NormalizedLandmark[],
): DetectionAnalysis {
  const isVis = (p?: NormalizedLandmark, minVis = 0.45) =>
    Boolean(p && (p.visibility === undefined || p.visibility > minVis));

  // Head / Cranial: MediaPipe Pose 0..10 or Face landmarks
  const hasFace = facePoints.length > 0;
  const nose = posePoints[0];
  const leftEye = posePoints[2];
  const rightEye = posePoints[5];
  const headDetected =
    hasFace || isVis(nose) || (isVis(leftEye) && isVis(rightEye));

  let headAnchor = { x: 0.5, y: 0.2 };
  if (isVis(nose)) {
    headAnchor = { x: nose.x, y: nose.y };
  } else if (hasFace && facePoints[1]) {
    headAnchor = { x: facePoints[1].x, y: facePoints[1].y };
  }

  // Chest / Torso: Shoulders 11, 12, Hips 23, 24
  const lShoulder = posePoints[11];
  const rShoulder = posePoints[12];
  const lHip = posePoints[23];
  const rHip = posePoints[24];

  const chestDetected =
    Boolean(lShoulder && rShoulder && (isVis(lShoulder) || isVis(rShoulder))) ||
    Boolean(isVis(lShoulder) && isVis(lHip)) ||
    Boolean(isVis(rShoulder) && isVis(rHip));

  let chestAnchor = { x: 0.5, y: 0.45 };
  if (lShoulder && rShoulder) {
    chestAnchor = {
      x: (lShoulder.x + rShoulder.x) / 2,
      y: (lShoulder.y + rShoulder.y) / 2 + 0.04,
    };
  }

  // Left Arm: 11 (shoulder), 13 (elbow), 15 (wrist)
  const lElbow = posePoints[13];
  const lWrist = posePoints[15];
  const leftArmDetected = Boolean(
    isVis(lShoulder) && (isVis(lElbow) || isVis(lWrist)),
  );
  const leftArmAnchor = lWrist && isVis(lWrist) ? lWrist : (lElbow ?? lShoulder);

  // Right Arm: 12 (shoulder), 14 (elbow), 16 (wrist)
  const rElbow = posePoints[14];
  const rWrist = posePoints[16];
  const rightArmDetected = Boolean(
    isVis(rShoulder) && (isVis(rElbow) || isVis(rWrist)),
  );
  const rightArmAnchor = rWrist && isVis(rWrist) ? rWrist : (rElbow ?? rShoulder);

  // Legs: Hips 23, 24, Knees 25, 26, Ankles 27, 28
  const lKnee = posePoints[25];
  const rKnee = posePoints[26];
  const lAnkle = posePoints[27];
  const rAnkle = posePoints[28];
  const legsDetected = Boolean(
    isVis(lKnee) ||
      isVis(rKnee) ||
      isVis(lAnkle) ||
      isVis(rAnkle) ||
      (isVis(lHip) && isVis(rHip) && isVis(lKnee)),
  );
  const legsAnchor = lKnee ?? rKnee ?? lHip ?? { x: 0.5, y: 0.8 };

  // Calculate Joint Angles
  const jointAngles: DetectionAnalysis["jointAngles"] = {};

  if (lShoulder && lElbow && lWrist && isVis(lShoulder) && isVis(lElbow) && isVis(lWrist)) {
    jointAngles.leftElbow = Math.round(calculateAngle(lShoulder, lElbow, lWrist));
  }
  if (rShoulder && rElbow && rWrist && isVis(rShoulder) && isVis(rElbow) && isVis(rWrist)) {
    jointAngles.rightElbow = Math.round(calculateAngle(rShoulder, rElbow, rWrist));
  }
  if (lShoulder && rShoulder && isVis(lShoulder) && isVis(rShoulder)) {
    const dy = rShoulder.y - lShoulder.y;
    const dx = rShoulder.x - lShoulder.x;
    jointAngles.shoulderTilt = Math.round(Math.abs(Math.atan2(dy, dx) * (180 / Math.PI)));
  }

  // Posture quality
  let postureQuality = "NOMINAL";
  if (jointAngles.shoulderTilt !== undefined) {
    if (jointAngles.shoulderTilt <= 4) {
      postureQuality = "ALIGNED (OPTIMAL)";
    } else if (jointAngles.shoulderTilt <= 10) {
      postureQuality = "SLIGHT LATERAL TILT";
    } else {
      postureQuality = "ASYMMETRIC POSTURE";
    }
  }

  const parts: BodyPartItem[] = [
    {
      id: "cranial",
      label: "HEAD / CRANIAL",
      shortLabel: "HEAD",
      detected: headDetected,
      confidence: hasFace ? 0.98 : headDetected ? 0.88 : 0,
      anchor: headAnchor,
    },
    {
      id: "chest",
      label: "CHEST / TORSO",
      shortLabel: "CHEST",
      detected: chestDetected,
      confidence: chestDetected ? 0.92 : 0,
      anchor: chestAnchor,
    },
    {
      id: "leftArm",
      label: "LEFT ARM",
      shortLabel: "L-ARM",
      detected: leftArmDetected,
      confidence: leftArmDetected ? 0.89 : 0,
      anchor: leftArmAnchor ? { x: leftArmAnchor.x, y: leftArmAnchor.y } : undefined,
    },
    {
      id: "rightArm",
      label: "RIGHT ARM",
      shortLabel: "R-ARM",
      detected: rightArmDetected,
      confidence: rightArmDetected ? 0.89 : 0,
      anchor: rightArmAnchor ? { x: rightArmAnchor.x, y: rightArmAnchor.y } : undefined,
    },
    {
      id: "legs",
      label: "LEGS / LOWER BODY",
      shortLabel: "LEGS",
      detected: legsDetected,
      confidence: legsDetected ? 0.84 : 0,
      anchor: legsAnchor ? { x: legsAnchor.x, y: legsAnchor.y } : undefined,
    },
  ];

  const detectedNames = parts.filter((p) => p.detected).map((p) => p.label);

  let primaryRegion = "SEARCHING SUBJECT";
  let summaryText = "Awaiting body detection";

  if (headDetected && chestDetected && (leftArmDetected || rightArmDetected) && legsDetected) {
    primaryRegion = "FULL SKELETAL RECONSTRUCTION";
    summaryText = "Full Body In Frame";
  } else if (headDetected && chestDetected && (leftArmDetected || rightArmDetected)) {
    primaryRegion = "UPPER TORSO & BI-ARM KINEMATICS";
    summaryText = "Head, Chest & Arms Active";
  } else if (headDetected && chestDetected) {
    primaryRegion = "CRANIAL & TORSO CORE";
    summaryText = "Head & Chest In View";
  } else if (headDetected) {
    primaryRegion = "CRANIAL / FACIAL TARGET";
    summaryText = "Face & Head Tracked";
  } else if (chestDetected) {
    primaryRegion = "TORSO BIOMETRICS";
    summaryText = "Torso Landmarks In Frame";
  } else if (leftArmDetected || rightArmDetected) {
    primaryRegion = "LIMB MOVEMENT";
    summaryText = "Arm Movements Tracked";
  }

  return {
    parts,
    detectedNames,
    primaryRegion,
    summaryText,
    postureQuality,
    jointAngles,
  };
}

function calculateAngle(
  a: NormalizedLandmark,
  b: NormalizedLandmark,
  c: NormalizedLandmark,
): number {
  const baX = a.x - b.x;
  const baY = a.y - b.y;
  const bcX = c.x - b.x;
  const bcY = c.y - b.y;

  const dot = baX * bcX + baY * bcY;
  const magBA = Math.sqrt(baX * baX + baY * baY);
  const magBC = Math.sqrt(bcX * bcX + bcY * bcY);
  if (magBA * magBC === 0) return 0;
  const cos = Math.min(1, Math.max(-1, dot / (magBA * magBC)));
  return (Math.acos(cos) * 180) / Math.PI;
}

export function drawLandmarks(
  ctx: CanvasRenderingContext2D,
  points: NormalizedLandmark[],
  connections: { start: number; end: number }[],
  reveal: number,
  pose = false,
  analysis?: DetectionAnalysis,
) {
  if (!ctx || !points || points.length === 0) return;
  const w = ctx.canvas?.width || 640;
  const h = ctx.canvas?.height || 480;
  const now = performance.now();

  const valid = (p: NormalizedLandmark | undefined) =>
    Boolean(p && (!pose || (p.visibility ?? 1) > 0.45));

  if (!pose) {
    // Face tesselation
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 0.7;
    ctx.globalAlpha = 0.35;
    ctx.shadowBlur = 0;

    const limit = Math.floor(connections.length * reveal);
    for (let i = 0; i < limit; i++) {
      const { start, end } = connections[i];
      const a = points[start];
      const b = points[end];
      if (a && b) {
        ctx.beginPath();
        ctx.moveTo(a.x * w, a.y * h);
        ctx.lineTo(b.x * w, b.y * h);
        ctx.stroke();
      }
    }

    // Outer face highlight
    ctx.globalAlpha = 0.65;
    ctx.fillStyle = "#67e8f9";
    for (let i = 0; i < points.length; i += 8) {
      const p = points[i];
      if (p) {
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, 1.1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    return;
  }

  // POSE LANDMARKS: Multi-color glowing interactive cyber skeleton!
  const connectionSlice = connections.slice(
    0,
    Math.floor(connections.length * reveal),
  );

  connectionSlice.forEach(({ start, end }) => {
    const a = points[start];
    const b = points[end];
    if (valid(a) && valid(b)) {
      const color = getConnectionColor(start, end);
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.4;
      ctx.lineCap = "round";
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.globalAlpha = 0.9;

      ctx.beginPath();
      ctx.moveTo(a.x * w, a.y * h);
      ctx.lineTo(b.x * w, b.y * h);
      ctx.stroke();

      // Thin bright core inside line
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 0.8;
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.moveTo(a.x * w, a.y * h);
      ctx.lineTo(b.x * w, b.y * h);
      ctx.stroke();

      ctx.restore();
    }
  });

  // Spine centerline visualization between shoulder midpoint and hip midpoint
  const lShoulder = points[11];
  const rShoulder = points[12];
  const lHip = points[23];
  const rHip = points[24];
  if (valid(lShoulder) && valid(rShoulder) && valid(lHip) && valid(rHip)) {
    const topX = ((lShoulder.x + rShoulder.x) / 2) * w;
    const topY = ((lShoulder.y + rShoulder.y) / 2) * h;
    const botX = ((lHip.x + rHip.x) / 2) * w;
    const botY = ((lHip.y + rHip.y) / 2) * h;

    ctx.save();
    ctx.strokeStyle = "#00f0ff";
    if (ctx.setLineDash) ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.8;
    ctx.shadowColor = "#00f0ff";
    ctx.shadowBlur = 6;
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.moveTo(topX, topY);
    ctx.lineTo(botX, botY);
    ctx.stroke();
    ctx.restore();
  }

  // Draw Joints & Pulsing Nodes
  const keyJoints = new Set([0, 11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28]);
  points.forEach((p, idx) => {
    if (!valid(p)) return;
    const color = getJointColor(idx);
    const px = p.x * w;
    const py = p.y * h;

    ctx.save();
    if (keyJoints.has(idx)) {
      // Pulsing radar ring on key articulation joints
      const pulse = 4 + Math.sin(now / 200 + idx) * 1.8;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.arc(px, py, pulse, 0, Math.PI * 2);
      ctx.stroke();

      // Bright solid core node
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();

      // White center point
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(px, py, 1.4, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Minor joint (fingers, toes)
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.75;
      ctx.beginPath();
      ctx.arc(px, py, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  });

  // Floating HUD Target Labels with detected body part names!
  if (analysis && analysis.parts) {
    analysis.parts.forEach((part) => {
      if (part.detected && part.anchor) {
        const color = getPartColor(part.id);
        drawHUDLabel(ctx, `[ ${part.shortLabel} ]`, part.anchor.x, part.anchor.y, w, h, color);
      }
    });
  }

  ctx.globalAlpha = 1;
}

function getConnectionColor(start: number, end: number): string {
  // Cranial / Head
  if (start <= 10 && end <= 10) return "#38bdf8";
  // Torso / Core (Shoulders & Hips)
  if (
    (start === 11 && end === 12) ||
    (start === 11 && end === 23) ||
    (start === 12 && end === 24) ||
    (start === 23 && end === 24)
  ) {
    return "#00f0ff";
  }
  // Left Arm
  if ([11, 13, 15, 17, 19, 21].includes(start) && [11, 13, 15, 17, 19, 21].includes(end)) {
    return "#34d399";
  }
  // Right Arm
  if ([12, 14, 16, 18, 20, 22].includes(start) && [12, 14, 16, 18, 20, 22].includes(end)) {
    return "#10b981";
  }
  // Left Leg
  if ([23, 25, 27, 29, 31].includes(start) && [23, 25, 27, 29, 31].includes(end)) {
    return "#818cf8";
  }
  // Right Leg
  if ([24, 26, 28, 30, 32].includes(start) && [24, 26, 28, 30, 32].includes(end)) {
    return "#a78bfa";
  }
  return "#72f5d6";
}

function getJointColor(idx: number): string {
  if (idx <= 10) return "#38bdf8"; // Head
  if (idx === 11 || idx === 12 || idx === 23 || idx === 24) return "#00f0ff"; // Torso
  if ([13, 15, 17, 19, 21].includes(idx)) return "#34d399"; // Left Arm
  if ([14, 16, 18, 20, 22].includes(idx)) return "#10b981"; // Right Arm
  if ([25, 27, 29, 31].includes(idx)) return "#818cf8"; // Left Leg
  if ([26, 28, 30, 32].includes(idx)) return "#a78bfa"; // Right Leg
  return "#72f5d6";
}

function getPartColor(id: BodyPartItem["id"]): string {
  switch (id) {
    case "cranial":
      return "#38bdf8";
    case "chest":
      return "#00f0ff";
    case "leftArm":
      return "#34d399";
    case "rightArm":
      return "#10b981";
    case "legs":
      return "#818cf8";
  }
}

function drawHUDLabel(
  ctx: CanvasRenderingContext2D,
  label: string,
  nx: number,
  ny: number,
  w: number,
  h: number,
  color: string,
) {
  if (!ctx || !ctx.fillText) return;
  const px = nx * w;
  const py = ny * h;

  ctx.save();
  // Un-flip horizontally so text reads left-to-right properly on a CSS scaleX(-1) element
  ctx.scale(-1, 1);
  const tx = -px;
  const ty = py;

  ctx.font = "bold 9px 'Space Grotesk', system-ui, sans-serif";
  const metrics = ctx.measureText ? ctx.measureText(label) : { width: 45 };
  const textWidth = metrics.width || 45;
  const padX = 6;
  const boxW = textWidth + padX * 2;
  const boxH = 16;
  const boxX = tx - boxW / 2;
  const boxY = ty - boxH - 8;

  // Background box
  ctx.fillStyle = "rgba(7, 15, 22, 0.88)";
  ctx.fillRect(boxX, boxY, boxW, boxH);

  // Border & Glow
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.strokeRect(boxX, boxY, boxW, boxH);

  // Text label
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, tx, boxY + boxH / 2);

  // Anchor stem
  ctx.beginPath();
  ctx.moveTo(tx, boxY + boxH);
  ctx.lineTo(tx, ty);
  ctx.stroke();

  ctx.restore();
}
