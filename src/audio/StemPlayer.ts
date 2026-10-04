import type {StemName} from "../types";
import {StemBus} from "../analysis/StemBus";

export interface LoadedStem {name:StemName;buffer:AudioBuffer;}

export class StemPlayer{
  private readonly context:AudioContext;
  private readonly stems=new Map<StemName,LoadedStem>();
  private readonly bus:StemBus;
  private startedAt=0;
  private sources:AudioBufferSourceNode[]=[];

  constructor(context=new AudioContext()){
    this.context=context;
    this.bus=new StemBus(context);
  }

  async load(name:StemName,file:File){
    const buffer=await this.context.decodeAudioData(await file.arrayBuffer());
    this.stems.set(name,{name,buffer});
  }

  loadedNames():StemName[]{return [...this.stems.keys()];}

  async play(){
    await this.context.resume();
    this.stop();
    this.startedAt=this.context.currentTime;
    for(const {name,buffer} of this.stems.values()){
      const source=this.context.createBufferSource();
      source.buffer=buffer;
      this.bus.attach(name,source);
      source.connect(this.context.destination);
      source.start(this.startedAt);
      this.sources.push(source);
    }
  }

  stop(){
    for(const source of this.sources){
      try{source.stop();}catch{}
      source.disconnect();
    }
    this.sources=[];
  }

  get time(){return Math.max(0,this.context.currentTime-this.startedAt);}
  get audioContext(){return this.context;}
  readFrames(){
    return this.bus.readAll(this.time);
  }
}