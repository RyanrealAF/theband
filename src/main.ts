import "./style.css";
import {SyntheticStemAnalyzer} from "./analysis/StemAnalyzer";
import {renderScene} from "./scene";
import type {BandState,MusicalEvent} from "./types";
const app=document.querySelector<HTMLDivElement>("#app")!;const canvas=document.createElement("canvas");canvas.width=540;canvas.height=960;app.appendChild(canvas);const ctx=canvas.getContext("2d")!;const analyzer=new SyntheticStemAnalyzer();let start=performance.now();
function frame(now:number){const time=(now-start)/1000,f=analyzer.analyze(time),event:MusicalEvent={...f,kind:f.onset>.5?"hit":"sustain",intensity:Math.min(1,f.level+f.onset*.7)},state:BandState={time,master:f.level,cameraKick:f.onset*(f.stem==="drums"?1:.25),groundPulse:f.stem==="bass"?f.level:0,events:[event]};ctx.save();const k=state.cameraKick*3;ctx.translate((Math.random()-.5)*k,(Math.random()-.5)*k);renderScene(ctx,state);ctx.restore();requestAnimationFrame(frame);}requestAnimationFrame(frame);
