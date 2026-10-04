import type { StemFrame, StemName } from "../types";
export interface AnalyzerSource { analyze(time:number): StemFrame; }
export class SyntheticStemAnalyzer implements AnalyzerSource {
  analyze(time:number): StemFrame {
    const stems: StemName[]=["piano","guitar","drums","bass"];
    const index=Math.floor(time*2.1)%stems.length, stem=stems[index];
    const phase=time*(1.7+index*0.43), level=0.22+0.28*((Math.sin(phase)+1)/2), onset=Math.max(0,Math.sin(time*(5.5+index))**8);
    return {stem,level,onset,low:stem==="bass"?level:level*.25,mid:stem==="guitar"||stem==="piano"?level:level*.4,high:stem==="drums"?level:level*.2,pitchHz:stem==="bass"?55:stem==="piano"?220:null,time};
  }
}
