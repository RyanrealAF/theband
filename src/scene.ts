import type {BandState,MusicalEvent} from "./types";
import {BassDumpster,GhostPianist,GoblinDrummer,Guitarist} from "./performers/performers";
const performers=[new GhostPianist(),new Guitarist(),new GoblinDrummer(),new BassDumpster()];
export function renderScene(ctx:CanvasRenderingContext2D,state:BandState){const w=ctx.canvas.width,h=ctx.canvas.height;ctx.fillStyle="#111";ctx.fillRect(0,0,w,h);ctx.fillStyle="#222";ctx.fillRect(0,h*.68,w,h*.32);
const keyY=h*.27;ctx.fillStyle="#181818";ctx.fillRect(0,keyY,w,h*.055);for(let i=0;i<24;i++){const x=w/24*i;ctx.fillStyle=i%3===0?"#d7d0c4":"#eee9df";ctx.fillRect(x+1,keyY+3,w/24-2,h*.045);}ctx.strokeStyle="#6f2922";ctx.lineWidth=3;ctx.strokeRect(0,keyY,w,h*.055);
for(const p of performers){const e=state.events.find((x:MusicalEvent)=>x.stem===p.stem)??null;p.update(state,e);p.render(ctx,state);}ctx.fillStyle="#b54a32";ctx.font="700 18px monospace";ctx.textAlign="center";ctx.fillText("THEBAND",w/2,h*.96);}
