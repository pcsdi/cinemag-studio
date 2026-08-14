import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode><App /></React.StrictMode>
);

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

    const makeButton=(label:string,primary=false)=>{
      const b=document.createElement("button");
      b.type="button";
      b.textContent=label;
      b.style.cssText=primary
        ?"padding:11px 16px;border:0;border-radius:4px;background:#d94b35;color:white;font-weight:700;cursor:pointer"
        :"padding:11px 16px;border:1px solid #d8cfc5;border-radius:4px;background:white;color:#342d28;font-weight:600;cursor:pointer";
      return b;
    };

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

const sceneObserver=new MutationObserver(()=>addSceneProductionControls());
sceneObserver.observe(document.body,{childList:true,subtree:true});
addSceneProductionControls();
