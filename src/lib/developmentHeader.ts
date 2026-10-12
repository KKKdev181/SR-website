import {useEffect,useState} from "react";
import {readContentSection,writeContent,watchContent} from "./sharedContent";
export const headerKeys=["portal","guide","finder","jira","approvals","admin","support"] as const;
export type HeaderKey=typeof headerKeys[number];
export type HeaderSettings=Record<HeaderKey,{en:string;ar:string;visible:boolean}>;
export const headerDefaults:HeaderSettings={
 portal:{en:"Requests Portal",ar:"بوابة الطلبات",visible:true},
 guide:{en:"New Product/Project Guide",ar:"دليل المنتج / المشروع الجديد",visible:true},
 finder:{en:"Request Finder",ar:"موجّه الطلبات",visible:true},
 jira:{en:"My Jira Requests",ar:"طلباتي في Jira",visible:true},
 approvals:{en:"My Pending Approvals",ar:"موافقاتي المعلقة",visible:true},
 admin:{en:"Admin",ar:"الإدارة",visible:true},
 support:{en:"Contact Support",ar:"الدعم",visible:true}
};
export function readHeaderSettings():HeaderSettings{
 const parsed=readContentSection<Partial<HeaderSettings>>("header");
 return Object.fromEntries(headerKeys.map(key=>{
 const item=parsed?.[key];
 return [key,{en:typeof item?.en==="string"&&item.en.trim()?item.en:headerDefaults[key].en,
  ar:typeof item?.ar==="string"&&item.ar.trim()?item.ar:headerDefaults[key].ar,
  visible:typeof item?.visible==="boolean"?item.visible:true}];
 })) as HeaderSettings;
}
export async function saveHeaderSettings(value:HeaderSettings){await writeContent("header",value);}
export async function resetHeaderSettings(){await writeContent("header",structuredClone(headerDefaults));}
export function useHeaderSettings(){
 const [value,setValue]=useState(readHeaderSettings);
 useEffect(()=>watchContent(()=>setValue(readHeaderSettings())),[]);
 return value;
}
