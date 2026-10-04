import type {StemName} from "../types";import {extractFeatures,type AudioFeatures} from "./FeatureExtractor";
export class StemBus{private readonly nodes=new Map<StemName,AnalyserNode>();private readonly previous=new Map<StemName,number>();constructor(private readonly context:AudioContext){}
attach(name:StemName,source:AudioNode){const analyser=this.context.createAnalyser();analyser.fftSize=2048;source.connect(analyser);this.nodes.set(name,analyser);}
read(name:StemName):AudioFeatures{const analyser=this.nodes.get(name);if(!analyser)return {level:0,low:0,mid:0,high:0,onset:0};const features=extractFeatures(analyser,this.previous.get(name)??0);this.previous.set(name,features.level);return features;}}
