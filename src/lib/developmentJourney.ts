import {useEffect,useState} from "react";
import {readContentSection,writeContent,watchContent} from "./sharedContent";
export type StageEdit={en:string;ar:string;description:string;descriptionAr:string};
export type ItemEdit={title?:string;titleAr?:string;instruction?:string;instructionAr?:string;jiraUrl?:string;serviceName?:string;requirementNote?:string;requirementNoteAr?:string;notes?:string[];notesAr?:string[];required?:boolean;hidden?:boolean};
export type PhaseEdit={name?:string;nameAr?:string;beforeNotes?:string[];beforeNotesAr?:string[]};
export type ActionEdit={title?:string;titleAr?:string;jiraUrl?:string;notes?:string[];notesAr?:string[];hidden?:boolean};
export type JourneyConfig={heroEn?:string;heroAr?:string;headingEn?:string;headingAr?:string;stages?:Record<string,StageEdit>;phases?:Record<string,PhaseEdit>;items?:Record<string,ItemEdit>;actions?:Record<string,ActionEdit>};
export function readJourney():JourneyConfig{
 const data=readContentSection<JourneyConfig>("journey");
 return data&&typeof data==="object"&&!Array.isArray(data)?data:{};
}
export async function saveJourney(value:JourneyConfig){await writeContent("journey",value);}
export async function resetJourney(){await writeContent("journey",{});}
export function useJourney(){
 const [value,setValue]=useState(readJourney);
 useEffect(()=>watchContent(()=>setValue(readJourney())),[]);
 return value;
}
