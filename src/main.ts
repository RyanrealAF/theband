import "./style.css";
import {StemPlayer} from "./audio/StemPlayer";
import {SyntheticStemAnalyzer} from "./analysis/StemAnalyzer";
import {renderScene} from "./scene";
import type {BandState,MusicalEvent,StemName,StemFrame} from "./types";

document.documentElement.dataset.theband="running";

const app=document.querySelector<HTMLElement>("#app");
if(!app)throw new Error("THEBAND: #app was not found");

app.innerHTML=`
  <section class="hud">
    <div class="brand">THEBAND</div>
    <div class="status" id="status">SYNTHETIC MODE</div>
    <div class="controls">
      <label><span>PIANO</span><input data-stem="piano" type="file" accept="audio/*"></label>
      <label><span>GUITAR</span><input data-stem="guitar" type="file" accept="audio/*"></label>
      <label><span>DRUMS</span><input data-stem="drums" type="file" accept="audio/*"></label>
      <label><span>BASS</span><input data-stem="bass" type="file" accept="audio/*"></label>
    </div>
    <div class="actions"><button id="play">LOAD & PLAY</button><button id="stop">STOP</button></div>
  </section>
  <canvas width="540" height="960" aria-label="THEBAND animated scene"></canvas>
`;

const canvas=app.querySelector<HTMLCanvasElement>("canvas");
const status=app.querySelector<HTMLElement>("#status");
const play=app.querySelector<HTMLButtonElement>("#play");
const stop=app.querySelector<HTMLButtonElement>("#stop");
if(!canvas||!status||!play||!stop)throw new Error("THEBAND: UI failed");

const context=canvas.getContext("2d");
if(!context)throw new Error("THEBAND: Canvas 2D is unavailable");
const ctx:CanvasRenderingContext2D=context;

const player=new StemPlayer();
const synthetic=new SyntheticStemAnalyzer();
const loaded=new Set<StemName>();
let playing=false;

const inputs=[...app.querySelectorAll<HTMLInputElement>("input[data-stem]")];
for(const input of inputs){
  input.addEventListener("change",async()=>{
    const file=input.files?.[0];
    const name=input.dataset.stem as StemName|undefined;
    if(!file||!name)return;
    status.textContent=`DECODING ${name.toUpperCase()}...`;
    try{
      await player.load(name,file);
      loaded.add(name);
      status.textContent=`READY: ${[...loaded].map(x=>x.toUpperCase()).join(" / ")}`;
    }catch(error){
      status.textContent=`AUDIO ERROR: ${error instanceof Error?error.message:String(error)}`;
    }
  });
}

play.addEventListener("click",async()=>{
  if(!loaded.size){status.textContent="LOAD AT LEAST ONE STEM";return;}
  await player.play();
  playing=true;
  status.textContent=`LIVE AUDIO: ${[...loaded].length}/4 STEMS`;
});

stop.addEventListener("click",()=>{
  player.stop();
  playing=false;
  status.textContent=loaded.size?`READY: ${loaded.size}/4 STEMS`:"SYNTHETIC MODE";
});

function syntheticFrames(time:number):StemFrame[]{
  const f=synthetic.analyze(time);
  return [f];
}

function frame(now:number){
  const time=playing?player.time:(now-start)/1000;
  const frames=playing?player.readFrames():syntheticFrames(time);
  const events:MusicalEvent[]=frames.map(f=>({
    ...f,
    kind:f.onset>.5?"hit":f.level>0.35?"sustain":"rise",
    intensity:Math.min(1,f.level+f.onset*.7)
  }));

  const drums=events.find(e=>e.stem==="drums");
  const bass=events.find(e=>e.stem==="bass");
  const master=Math.max(0,...events.map(e=>e.level));
  const state:BandState={
    time,
    master,
    cameraKick:(drums?.onset??0),
    groundPulse:bass?.level??0,
    events
  };

  ctx.save();
  const shake=state.cameraKick*4;
  ctx.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);
  renderScene(ctx,state);
  ctx.restore();
  requestAnimationFrame(frame);
}

const start=performance.now();
requestAnimationFrame(frame);