import type {StemName,StemFrame} from "../types";
import {extractFeatures,type AudioFeatures} from "./FeatureExtractor";

export class StemBus{
  private readonly nodes=new Map<StemName,AnalyserNode>();
  private readonly previous=new Map<StemName,number>();

  constructor(private readonly context:AudioContext){}

  attach(name:StemName,source:AudioNode){
    const analyser=this.context.createAnalyser();
    analyser.fftSize=2048;
    analyser.smoothingTimeConstant=.35;
    source.connect(analyser);
    this.nodes.set(name,analyser);
  }

  read(name:StemName):AudioFeatures{
    const analyser=this.nodes.get(name);
    if(!analyser)return {level:0,low:0,mid:0,high:0,onset:0,pitchHz:null};
    const features=extractFeatures(analyser,this.previous.get(name)??0);
    this.previous.set(name,features.level);
    return features;
  }

  readAll(time:number):StemFrame[]{
    const names:StemName[]=["piano","guitar","drums","bass"];
    return names.map(stem=>({...this.read(stem),stem,time}));
  }
}