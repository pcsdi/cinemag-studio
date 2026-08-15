import { getStore } from '@netlify/blobs';
export const DEFAULT_SETTINGS={accessCode:'0810',instructorCode:'2580',startDate:'2026-08-01',endDate:'2026-12-31'};
export function json(data,status=200){return new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}})}
export async function getSettings(){try{const store=getStore({name:'cinemag-config',consistency:'strong'});const saved=await store.get('settings',{type:'json'});return {...DEFAULT_SETTINGS,...(saved||{})}}catch(e){console.error(e);return DEFAULT_SETTINGS}}
export async function saveSettings(settings){const store=getStore({name:'cinemag-config',consistency:'strong'});await store.setJSON('settings',settings)}
export function adminValid(id,password){return id===(process.env.ADMIN_ID||'pcsdi2026')&&password===(process.env.ADMIN_PASSWORD||'123456')}
export function todayKST(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul'}).format(new Date())}
