import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode><App /></React.StrictMode>
);

function makeButton(label:string,primary=false){
  const b=document.createElement("button");
  b.type="button";
  b.textContent=label;
  b.style.cssText=primary
    ?"padding:11px 16px;border:0;border-radius:4px;background:#d94b35;color:white;font-weight:700;cursor:pointer"
    :"padding:11px 16px;border:1px solid #d8cfc5;border-radius:4px;background:white;color:#342d28;font-weight:600;cursor:pointer";
  return b;
}

function addSceneProductionControls(){
  document.querySelectorAll<HTMLElement>(".scene-card").forEach((card)=>{
    if(card.querySelector(".scene-production-controls")) return;
    const promptSection=card.querySelector<HTMLElement>(".prompt-section");
    if(!promptSection) return;

    const wrap=document.createElement("div");
    wrap.className="scene-production-controls";
    wrap.style.cssText="border-top:1px solid #e8e0d7;margin-top:18px;padding-top:16px;display:flex;flex-direction:column;gap:12px";

    const note=document.createElement("div");
    note.textContent="✓ 확정된 기획안의 인물·공간·대사 연속성을 현재 Scene에 적용합니다.";
    note.style.cssText="font-size:13px;color:#8a6f5a";

    const actions=document.createElement("div");
    actions.style.cssText="display:flex;gap:8px;flex-wrap:wrap";

    const imageBtn=makeButton("▣ 이미지 프롬프트 복사");
    imageBtn.onclick=async()=>{
      const videoPrompt=card.querySelector<HTMLElement>(".prompt")?.innerText || promptSection.querySelector("textarea")?.value || "";
      const imagePrompt=videoPrompt
        .replace(/video clip/gi,"cinematic still image")
        .replace(/Korean dialogue exactly:[\s\S]*?Maintain the same character/i,"Maintain the same character");
      await navigator.clipboard.writeText(imagePrompt);
      alert("이미지 프롬프트를 복사했습니다.");
    };

    const vidsBtn=makeButton("▣ Vids용 복사");
    vidsBtn.onclick=async()=>{
      const videoPrompt=card.querySelector<HTMLElement>(".prompt")?.innerText || promptSection.querySelector("textarea")?.value || "";
      await navigator.clipboard.writeText(videoPrompt);
      alert("Vids용 프롬프트를 복사했습니다.");
    };

    const openBtn=makeButton("↗ GOOGLE VIDS 열기",true);
    openBtn.onclick=()=>window.open("https://vids.google.com/","_blank","noopener,noreferrer");

    actions.append(imageBtn,vidsBtn,openBtn);
    wrap.append(note,actions);
    promptSection.insertAdjacentElement("afterend",wrap);
  });
}

function getInfoValue(label:string){
  const cards=[...document.querySelectorAll<HTMLElement>(".info-card")];
  const target=cards.find(card=>card.querySelector(".card-label b")?.textContent?.trim()===label);
  return target?.querySelector<HTMLElement>("p")?.innerText.trim() || target?.querySelector<HTMLTextAreaElement>("textarea")?.value.trim() || "";
}

function buildDreaminaPrompt(){
  const sceneCards=[...document.querySelectorAll<HTMLElement>(".scene-card")];
  if(!sceneCards.length) return "";

  const protagonist=getInfoValue("프로젝트 제목") ? getInfoValue("전체 스토리") : "";
  const story=getInfoValue("전체 스토리");
  const message=getInfoValue("핵심 메시지");
  const sceneLength=30/sceneCards.length;

  const beats=sceneCards.map((card,i)=>{
    const title=card.querySelector<HTMLElement>("h4")?.innerText.trim() || `Scene ${i+1}`;
    const fields=[...card.querySelectorAll<HTMLElement>(".scene-field")];
    const read=(label:string)=>{
      const f=fields.find(x=>x.querySelector("b")?.textContent?.trim()===label);
      return f?.querySelector<HTMLElement>("p")?.innerText.trim().replace(/^“|”$/g,"") || f?.querySelector<HTMLTextAreaElement>("textarea")?.value.trim() || "";
    };
    const start=Math.round(i*sceneLength*10)/10;
    const end=Math.round((i+1)*sceneLength*10)/10;
    return `${start}-${end}s | ${title}\nVisual: ${read("장면 설명")}\nAction: ${read("주요 행동")}\nMood: ${read("감정 / 분위기")}\nDialogue: ${read("대사 또는 내레이션") || "No dialogue; use natural ambient sound."}`;
  }).join("\n\n");

  const firstPrompt=sceneCards[0]?.querySelector<HTMLElement>(".prompt")?.innerText || "";
  const bibleMatch=firstPrompt.match(/STORY BIBLE:\s*([\s\S]*?)\s*Protagonist\(s\):/i);
  const continuity=bibleMatch?.[1]?.trim() || "Keep exactly the same protagonist faces, age, hairstyle, wardrobe, shoes, bags, accessories and recurring props throughout all scenes. Never change costume or replace the protagonists. Preserve chronological time and location continuity.";

  return `Create ONE continuous 30-second cinematic video. Do not generate separate disconnected clips.\n\nOverall story: ${story || protagonist}\nCore message: ${message}\n\nCONTINUITY LOCK: ${continuity}\nThe first scene establishes the character appearance, wardrobe, props and location. Treat these as immutable references for the entire 30 seconds. Every next beat must begin from the exact physical, emotional and spatial state where the previous beat ended. No wardrobe changes, face changes, hairstyle changes, new replacement characters, unexplained prop changes or location resets.\n\n30-SECOND TIMELINE:\n${beats}\n\nUse smooth cinematic transitions so the sequence feels like one uninterrupted story. Keep Korean dialogue natural and only where listed. Preserve realistic Korean environments, consistent lighting progression and spatial direction. No captions, titles, logos or watermarks.`;
}

function addDreaminaProductionSection(){
  const plan=document.querySelector<HTMLElement>(".plan-doc");
  const sceneList=plan?.querySelector<HTMLElement>(".scene-list");
  if(!plan || !sceneList || plan.querySelector(".dreamina-production")) return;

  const section=document.createElement("section");
  section.className="dreamina-production";
  section.style.cssText="margin-top:34px;padding-top:28px;border-top:2px solid #2f2925";

  const heading=document.createElement("h3");
  heading.className="number-title";
  heading.innerHTML="<span>04</span> DREAMINA 30초 전체 제작";

  const box=document.createElement("div");
  box.style.cssText="border:1px solid #e3d9cf;border-radius:8px;padding:20px;background:#fffaf5;display:flex;flex-direction:column;gap:14px";

  const title=document.createElement("strong");
  title.textContent="Scene별 기획을 하나의 연속된 30초 영상 프롬프트로 통합합니다.";

  const note=document.createElement("div");
  note.textContent="✓ 전체 스토리 + 고정 인물·의상·소품 + Scene 순서 + 대사를 한 번에 적용합니다.";
  note.style.cssText="font-size:13px;color:#8a6f5a";

  const actions=document.createElement("div");
  actions.style.cssText="display:flex;gap:8px;flex-wrap:wrap";

  const copyBtn=makeButton("▣ Dreamina 30초 전체 프롬프트 복사");
  copyBtn.onclick=async()=>{
    const prompt=buildDreaminaPrompt();
    if(!prompt){alert("먼저 Scene 기획을 생성해주세요.");return;}
    await navigator.clipboard.writeText(prompt);
    alert("Dreamina 30초 전체 프롬프트를 복사했습니다.");
  };

  const openBtn=makeButton("↗ DREAMINA 열기",true);
  openBtn.onclick=()=>window.open("https://dreamina.capcut.com/","_blank","noopener,noreferrer");

  actions.append(copyBtn,openBtn);
  box.append(title,note,actions);
  section.append(heading,box);
  sceneList.insertAdjacentElement("afterend",section);
}

function refreshProductionControls(){
  addSceneProductionControls();
  addDreaminaProductionSection();
}

const sceneObserver=new MutationObserver(()=>refreshProductionControls());
sceneObserver.observe(document.body,{childList:true,subtree:true});
refreshProductionControls();
