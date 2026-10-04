import type {StemName} from "../types";

export interface StemInput { name:StemName; file:File; buffer:AudioBuffer; }

export async function decodeStem(context:AudioContext,name:StemName,file:File):Promise<StemInput>{
  const buffer=await context.decodeAudioData(await file.arrayBuffer());
  return {name,file,buffer};
}
