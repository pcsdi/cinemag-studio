import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode><App /></React.StrictMode>
);

const URLS = {
  chatgpt: "https://chatgpt.com/",
  gemini: "https://gemini.google.com/app?hl=ko",
  flow: "https://labs.google/fx/ko/tools/flow",
};

function button(label:string, primary=false){
  const b=document.createElement("button");
  b.type="button";
  b.textContent=label;
  b.style.cssText=primary
    ? "padding:10px 14px;border:0;border-radius:8px;background:#304674;color:#fff;font-weight:800;cursor:pointer"
    : "padding:10px 14px;border:1px solid #ccd4e2;border-radius:8px;background:#fff;color:#304674;font-weight:700;cursor:pointer";
  return b;
}

function ensureGateLogo(){
  const logo=document.querySelector<HTMLImageElement>(".gate-logo img");
  if(!logo) return;
  logo.src="/personal-management.png";
  logo.alt="퍼스널매니지먼트";
  logo.style.cssText="display:block;width:100%;height:auto;object-fit:contain";
}

function addMainHeaderLogo(){
  const brand=document.querySelector<HTMLElement>(".appbar .brand");
  if(!brand || brand.querySelector(".main-brand-logo")) return;
  const title=brand.querySelector<HTMLElement>(".brand-title");
  const sub=brand.querySelector<HTMLElement>(".brand-sub");
  const textWrap=document.createElement("div");
  textWrap.className="main-brand-text";
  if(title) textWrap.appendChild(title);
  if(sub) textWrap.appendChild(sub);
  const logo=document.createElement("img");
  logo.className="main-brand-logo";
  logo.src="/personal-management.png";
  logo.alt="퍼스널매니지먼트";
  logo.style.cssText="height:42px;width:auto;max-width:190px;object-fit:contain;display:block;flex:0 0 auto";
  brand.style.display="flex";
  brand.style.alignItems="center";
  brand.style.gap="12px";
  brand.prepend(textWrap);
  brand.prepend(logo);
}

function currentVideoPrompt(card:HTMLElement){
  const promptSection=card.querySelector<HTMLElement>(".prompt-section");
  return card.querySelector<HTMLElement>(".prompt")?.innerText.trim()
    || promptSection?.querySelector<HTMLTextAreaElement>("textarea")?.value.trim()
    || "";
}

function imagePromptFrom(videoPrompt:string){
  let p=videoPrompt.trim();
  if(!p) return "";
  p=p
    .replace(/Create Scene\s*\d*\s*of one continuous cinematic[^.]*\./gi,"Create ONE photorealistic cinematic still image.")
    .replace(/Create ONE continuous[^.]*video\./gi,"Create ONE photorealistic cinematic still image.")
    .replace(/Animate this image[^.]*\./gi,"")
    .replace(/VIDEO PROMPT:?/gi,"")
    .replace(/CAMERA MOVEMENT:[\s\S]*?(?=\n[A-Z][A-Z ]+:|$)/gi,"")
    .replace(/DURATION:[\s\S]*?(?=\n[A-Z][A-Z ]+:|$)/gi,"")
    .trim();
  return `Create ONE photorealistic cinematic still image.\n\n${p}\n\nSTILL IMAGE RULES: Freeze one decisive, physically plausible instant. Keep the same protagonist face, age, hairstyle, body type, clothing, shoes, accessories, props and environment established by the story. No motion instructions, no scene transitions, no subtitles, no titles, no logos, no watermarks, no split panels.`;
}

async function copyText(text:string,label:string){
  if(!text){alert("복사할 프롬프트가 없습니다.");return;}
  try{
    await navigator.clipboard.writeText(text);
    alert(`${label}을 복사했습니다.`);
  }catch{
    const ta=document.createElement("textarea");
    ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand("copy");ta.remove();
    alert(`${label}을 복사했습니다.`);
  }
}

function promptPanel(title:string, guide:string, initial:string, tools:{label:string,url:string,primary?:boolean}[]){
  const panel=document.createElement("div");
  panel.style.cssText="border:1px solid #dbe1eb;border-radius:12px;background:#f9fbff;padding:16px;display:grid;gap:12px";

  const top=document.createElement("div");
  top.style.cssText="display:flex;align-items:flex-start;justify-content:space-between;gap:12px";
  const heading=document.createElement("div");
  heading.innerHTML=`<strong style=\"display:block;color:#304674;font-size:14px\">${title}</strong><span style=\"display:block;margin-top:4px;color:#6b7280;font-size:12px;line-height:1.5\">${guide}</span>`;
  const edit=button("수정");
  top.append(heading,edit);

  const textarea=document.createElement("textarea");
  textarea.value=initial;
  textarea.readOnly=true;
  textarea.rows=8;
  textarea.style.cssText="width:100%;resize:vertical;border:1px solid #d7dee9;border-radius:8px;background:#fff;padding:12px;line-height:1.6;font-size:12px;color:#374151;outline:none";

  edit.onclick=()=>{
    textarea.readOnly=!textarea.readOnly;
    if(!textarea.readOnly){
      edit.textContent="수정 완료";
      textarea.focus();
      textarea.style.borderColor="#506A9C";
      textarea.style.background="#fff";
    }else{
      edit.textContent="수정";
      textarea.style.borderColor="#d7dee9";
      alert("수정 내용을 현재 화면에 반영했습니다. 저장되지는 않습니다.");
    }
  };

  const actions=document.createElement("div");
  actions.style.cssText="display:flex;gap:8px;flex-wrap:wrap";
  const copy=button("프롬프트 복사",true);
  copy.onclick=()=>copyText(textarea.value, title);
  actions.appendChild(copy);
  tools.forEach(t=>{
    const b=button(t.label,!!t.primary);
    b.onclick=()=>window.open(t.url,"_blank","noopener,noreferrer");
    actions.appendChild(b);
  });
  panel.append(top,textarea,actions);
  return panel;
}

function addBeginnerControls(){
  document.querySelectorAll<HTMLElement>(".scene-card").forEach((card,index)=>{
    if(card.querySelector(".beginner-production-controls")) return;
    const promptSection=card.querySelector<HTMLElement>(".prompt-section");
    if(!promptSection) return;

    const original=currentVideoPrompt(card);
    const wrap=document.createElement("section");
    wrap.className="beginner-production-controls";
    wrap.style.cssText="border-top:2px solid #304674;margin-top:20px;padding-top:18px;display:grid;gap:14px";

    const now=document.createElement("div");
    now.style.cssText="background:#eef3fb;border-radius:10px;padding:12px 14px;color:#304674;font-size:13px;line-height:1.6";
    now.innerHTML=`<strong>SCENE ${String(index+1).padStart(2,"0")} · 지금 할 일</strong><br>① 이미지 프롬프트를 확인·수정하고 복사 → Gemini 또는 ChatGPT에서 이미지 생성<br>② 완성 이미지를 준비한 뒤 영상 프롬프트를 확인·수정하고 복사 → Google Flow에서 영상 생성`;

    const imagePanel=promptPanel(
      "IMAGE PROMPT",
      "한 장의 기준 이미지를 만드는 프롬프트입니다. 움직임보다 인물·공간·구도·분위기를 확인하세요.",
      imagePromptFrom(original),
      [
        {label:"Gemini에서 만들기 ↗",url:URLS.gemini},
        {label:"ChatGPT에서 만들기 ↗",url:URLS.chatgpt},
      ]
    );

    const videoPanel=promptPanel(
      "VIDEO PROMPT",
      "만든 이미지를 영상으로 움직이기 위한 프롬프트입니다. 행동·카메라·장면 연속성을 확인하세요.",
      original,
      [
        {label:"Google Flow에서 만들기 ↗",url:URLS.flow},
      ]
    );

    const tip=document.createElement("div");
    tip.style.cssText="font-size:11px;color:#6b7280;line-height:1.6";
    tip.textContent="※ 수정 내용과 사용자 작업물은 서버에 저장하지 않습니다. 도구 버튼은 새 탭에서 열립니다.";

    wrap.append(now,imagePanel,videoPanel,tip);
    promptSection.insertAdjacentElement("afterend",wrap);
  });
}

function refresh(){
  ensureGateLogo();
  addMainHeaderLogo();
  addBeginnerControls();
}

const observer=new MutationObserver(()=>refresh());
observer.observe(document.body,{childList:true,subtree:true});
refresh();
