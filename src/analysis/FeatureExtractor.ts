export interface AudioFeatures {level:number;low:number;mid:number;high:number;onset:number;pitchHz:number|null;}

function energy(values:Float32Array,start:number,end:number,minDb=-90,maxDb=-10){
  let sum=0,count=0;
  for(let i=start;i<end;i++){
    const db=Math.max(minDb,Math.min(maxDb,values[i]));
    const normalized=(db-minDb)/(maxDb-minDb);
    sum+=normalized*normalized;
    count++;
  }
  return count?Math.sqrt(sum/count):0;
}

export function extractFeatures(analyser:AnalyserNode,previousLevel=0):AudioFeatures{
  const timeData=new Float32Array(analyser.fftSize);
  analyser.getFloatTimeDomainData(timeData);
  let sum=0;
  for(const sample of timeData)sum+=sample*sample;
  const level=Math.min(1,Math.sqrt(sum/timeData.length)*3.2);

  const bins=new Float32Array(analyser.frequencyBinCount);
  analyser.getFloatFrequencyData(bins);
  const nyquist=analyser.context.sampleRate/2;
  const binHz=nyquist/bins.length;
  const range=(lo:number,hi:number)=>{
    const start=Math.max(0,Math.floor(lo/binHz));
    const end=Math.min(bins.length,Math.ceil(hi/binHz));
    return energy(bins,start,Math.max(start+1,end));
  };

  const low=range(20,180);
  const mid=range(180,2000);
  const high=range(2000,12000);
  const onset=Math.max(0,Math.min(1,(level-previousLevel)*10));

  let peak=0;
  let peakIndex=-1;
  for(let i=Math.max(1,Math.floor(40/binHz));i<Math.min(bins.length,Math.ceil(1200/binHz));i++){
    if(bins[i]>peak){peak=bins[i];peakIndex=i;}
  }
  const pitchHz=peakIndex>0?peakIndex*binHz:null;

  return {level,low,mid,high,onset,pitchHz};
}