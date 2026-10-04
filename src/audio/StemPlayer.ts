import type {StemName} from "../types";
export interface LoadedStem { name: StemName; buffer: AudioBuffer; }
export class StemPlayer {
 private readonly context: AudioContext; private readonly stems=new Map<StemName,LoadedStem>(); private startedAt=0; private sources:AudioBufferSourceNode[]=[];
 constructor(context=new AudioContext()){this.context=context;}
 async load(name:StemName,file:File){const buffer=await this.context.decodeAudioData(await file.arrayBuffer());this.stems.set(name,{name,buffer});}
 async play(){await this.context.resume();this.stop();this.startedAt=this.context.currentTime;for(const {buffer} of this.stems.values()){const source=this.context.createBufferSource();source.buffer=buffer;source.connect(this.context.destination);source.start(this.startedAt);this.sources.push(source);}}
 stop(){for(const source of this.sources)source.stop();this.sources=[];} get time(){return Math.max(0,this.context.currentTime-this.startedAt);}
}
