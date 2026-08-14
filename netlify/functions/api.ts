import { getStore } from "@netlify/blobs";
import { createHmac, timingSafeEqual } from "node:crypto";

type Settings={entryCode:string;accessStartsOn?:string;accessEndsOn?:string};
const json=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}});
const secret=()=>process.env.JWT_SECRET||"";
const sign=(value:string)=>`${value}.${createHmac("sha256",secret()).update(value).digest("hex")}`;
const valid=(token:string)=>{if(!secret())return false;const i=token.lastIndexOf(".");if(i<1)return false;const v=token.slice(0,i),sig=token.slice(i+1),expected=createHmac("sha256",secret()).update(v).digest("hex");try{return timingSafeEqual(Buffer.from(sig),Buffer.from(expected))}catch{return false}};
const bearer=(req:Request)=>(req.headers.get("authorization")||"").replace(/^Bearer\s+/i,"");
async function body(req:Request){try{return await req.json()}catch{return {}}}
async function settings():Promise<Settings>{const store=getStore("cinemag-settings");const saved=await store.get("access",{type:"json"}) as Settings|null;return saved||{entryCode:process.env.CINEMAG_DEFAULT_ENTRY_CODE||"0810",accessStartsOn:"",accessEndsOn:""}}
function stateOf(s:Settings){const today=new Date().toISOString().slice(0,10);if(s.accessStartsOn&&today<s.accessStartsOn)return {state:"not_started",message:`사용 시작일은 ${s.accessStartsOn}입니다.`};if(s.accessEndsOn&&today>s.accessEndsOn)return {state:"expired",message:`사용기간이 ${s.accessEndsOn}에 종료되었습니다.`};return {state:"open",message:"관리자에게 발급받은 유효한 4자리 입장번호를 입력하세요."}}

export default async (req:Request)=>{
 const url=new URL(req.url);const parts=url.pathname.split("/").filter(Boolean);const path=parts[parts.length-1]||"";
 try{
  if(path==="status"&&req.method==="GET"){const s=await settings();return json(stateOf(s));}
  if(path==="verify"&&req.method==="POST"){const input=await body(req) as any;const s=await settings();const st=stateOf(s);if(st.state!=="open")return json({error:st.message},403);if(!/^\d{4}$/.test(input.code||"")||input.code!==s.entryCode)return json({error:"입장번호가 올바르지 않습니다."},401);return json({ok:true});}
  if(path==="login"&&req.method==="POST"){const input=await body(req) as any;const id=process.env.CINEMAG_ADMIN_ID;const pw=process.env.CINEMAG_ADMIN_PASSWORD;if(!id||!pw||!secret())return json({error:"Netlify 환경변수(CINEMAG_ADMIN_ID, CINEMAG_ADMIN_PASSWORD, JWT_SECRET)를 먼저 설정해주세요."},503);if(input.id!==id||input.password!==pw)return json({error:"관리자 ID 또는 비밀번호가 올바르지 않습니다."},401);return json({token:sign(`admin:${Date.now()}`)});}
  if(path==="settings"&&req.method==="GET"){if(!valid(bearer(req)))return json({error:"관리자 로그인이 필요합니다."},401);return json(await settings());}
  if(path==="settings"&&req.method==="POST"){if(!valid(bearer(req)))return json({error:"관리자 로그인이 필요합니다."},401);const input=await body(req) as any;if(!/^\d{4}$/.test(input.entryCode||""))return json({error:"입장번호는 숫자 4자리로 저장해주세요."},400);if(input.accessStartsOn&&input.accessEndsOn&&input.accessStartsOn>input.accessEndsOn)return json({error:"종료일은 시작일보다 빠를 수 없습니다."},400);const next:Settings={entryCode:input.entryCode,accessStartsOn:input.accessStartsOn||"",accessEndsOn:input.accessEndsOn||""};const store=getStore("cinemag-settings");await store.setJSON("access",next);return json(next);}
  return json({error:"API 경로를 찾을 수 없습니다."},404);
 }catch(error){console.error(error);return json({error:"서버 처리 중 오류가 발생했습니다."},500)}
};
