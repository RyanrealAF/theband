import "./style.css";
import { SyntheticStemAnalyzer } from "./analysis/StemAnalyzer";
import { renderScene } from "./scene";
import type { BandState, MusicalEvent } from "./types";

const app = document.querySelector<HTMLElement>("#app");
if (!app) throw new Error("THEBAND: #app was not found");

app.innerHTML = "";

const canvas = document.createElement("canvas");
canvas.width = 540;
canvas.height = 960;
canvas.setAttribute("aria-label", "THEBAND animated scene");
app.appendChild(canvas);

const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("THEBAND: Canvas 2D is unavailable");

const analyzer = new SyntheticStemAnalyzer();
const start = performance.now();

function frame(now: number) {
  const time = (now - start) / 1000;
  const f = analyzer.analyze(time);

  const event: MusicalEvent = {
    ...f,
    kind: f.onset > 0.5 ? "hit" : "sustain",
    intensity: Math.min(1, f.level + f.onset * 0.7),
  };

  const state: BandState = {
    time,
    master: f.level,
    cameraKick: f.onset * (f.stem === "drums" ? 1 : 0.25),
    groundPulse: f.stem === "bass" ? f.level : 0,
    events: [event],
  };

  ctx.save();
  const shake = state.cameraKick * 3;
  ctx.translate(
    (Math.random() - 0.5) * shake,
    (Math.random() - 0.5) * shake,
  );
  renderScene(ctx, state);
  ctx.restore();

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
