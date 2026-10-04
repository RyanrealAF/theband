import type {MusicalEvent,StemFrame} from "../types";

export function toMusicalEvent(frame:StemFrame):MusicalEvent|null{
  if(frame.level<0.08 && frame.onset<0.12)return null;
  const kind:MusicalEvent["kind"]=frame.onset>.5?"hit":frame.level>.35?"sustain":frame.low>frame.high?"fall":"rise";
  return {...frame,kind,intensity:Math.min(1,frame.level+frame.onset*.7)};
}
