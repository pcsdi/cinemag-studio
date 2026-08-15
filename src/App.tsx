import {useState,type FormEvent} from "react";

type AdminSettings={accessCode:string;instructorCode:string;startDate:string;endDate:string};
type Scene={title:string;description:string;imagePrompt:string;videoPrompt:string;narration:string;caption:string};

const TOOL_URLS={
  chatgpt:"https://chatgpt.com/",
  gemini:"https://gemini.google.com/app?hl=ko",
  flow:"https://labs.google/fx/ko/tools/flow",
};

async function post(path:string,body:unknown){
  const r=await fetch(`/api/${path}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
  const d=await r.json().catch(()=>({}));
  if(!r.ok) throw new Error(d.message||"요청을 처리하지 못했습니다.");
  return d;
}

function makeScenes(topic:string,count:number,ratio:string,duration:string):Scene[]{
  const titles=count===3?["시작","핵심 장면","마무리"]:["시작","상황 제시","전개","핵심 경험","변화","마무리"];
  const sec=Math.max(3,Math.round((parseInt(duration)||30)/count));
  return titles.map((title,i)=>{
    const continuity=i===0?"This is the opening scene.":`Continue naturally from Scene ${i}. Keep the same protagonist, face, hairstyle, clothing, props, location logic and screen direction.`;
    const description=i===0?`${topic}의 주인공과 핵심 공간을 한눈에 보여준다.`:i===count-1?`${topic}의 결과와 여운이 남는 마지막 순간을 보여준다.`:`${topic}의 흐름이 앞 장면에서 자연스럽게 이어지는 ${title} 장면을 보여준다.`;
    const imagePrompt=`Create ONE photorealistic cinematic still image.\n\nSUBJECT: ${topic}\nSCENE: ${title}\nVISUAL: ${description}\nCONTINUITY: ${continuity}\nCHARACTER LOCK: Keep the exact same face, age, hairstyle, body type, clothing, shoes, accessories and recurring props across every scene.\nCOMPOSITION: One decisive, physically plausible instant with a clear focal point and natural depth of field.\nSTYLE: realistic cinematic lighting, natural Korean environment, coherent visual continuity.\nASPECT RATIO: ${ratio}.\nOUTPUT: One still image only. No text, captions, titles, logos, watermarks or split panels.`;
    const videoPrompt=`Animate the approved Scene ${i+1} image into a ${sec}-second cinematic video clip.\n\nSTORY: ${topic}\nCURRENT SCENE: ${title}\nACTION: Add one simple, natural action that clearly advances this scene.\nCAMERA MOVEMENT: Use one restrained cinematic camera movement only.\nENVIRONMENT MOVEMENT: Add subtle realistic environmental motion.\nCONTINUITY: ${continuity}\nCHARACTER LOCK: Do not change face, age, hairstyle, body type, clothing, shoes, accessories or props.\nDURATION: about ${sec} seconds.\nSTYLE: realistic cinematic lighting, natural Korean environment, smooth motion.\nOUTPUT: No captions, titles, logos or watermarks.`;
    return{title,description,imagePrompt,videoPrompt,narration:i===0?`${topic}의 이야기가 시작됩니다.`:i===count-1?"그리고 마지막에는 변화가 남습니다.":"이제 이야기가 다음 장면으로 이어집니다.",caption:i===0?"이야기의 시작":i===count-1?"마지막 장면":"다음 장면"};
  });
}

function ToolButton({label,url}:{label:string;url:string}){
  return <button type="button" className="copy-btn" onClick={()=>window.open(url,"_blank","noopener,noreferrer")}>{label} ↗</button>;
}

function Admin({close}:{close:()=>void}){
  const[id,setId]=useState("");const[password,setPassword]=useState("");const[settings,setSettings]=useState<AdminSettings|null>(null);const[msg,setMsg]=useState("");
  const login=async(e:FormEvent)=>{e.preventDefault();setMsg("");try{const d=await post("admin-settings",{id,password,action:"get"});setSettings(d.settings)}catch(e){setMsg((e as Error).message)}};
  const save=async(e:FormEvent)=>{e.preventDefault();if(!settings)return;setMsg("");try{const d=await post("admin-settings",{id,password,action:"save",settings});setSettings(d.settings);setMsg("저장했습니다.")}catch(e){setMsg((e as Error).message)}};
  return <div className="modal"><div className="modal-card"><div className="modal-head"><h3>관리자 설정</h3><button className="close" onClick={close}>×</button></div>{!settings?<form className="stack" onSubmit={login}><input placeholder="관리자 ID" value={id} onChange={e=>setId(e.target.value)}/><input type="password" placeholder="비밀번호" value={password} onChange={e=>setPassword(e.target.value)}/><button className="primary">로그인</button>{msg&&<div className="error">{msg}</div>}</form>:<form className="stack" onSubmit={save}><label>입장코드<input maxLength={4} value={settings.accessCode} onChange={e=>setSettings({...settings,accessCode:e.target.value.replace(/\D/g,"").slice(0,4)})}/></label><label>강사용 코드<input maxLength={4} value={settings.instructorCode} onChange={e=>setSettings({...settings,instructorCode:e.target.value.replace(/\D/g,"").slice(0,4)})}/></label><div className="dates"><label>사용 시작일<input type="date" value={settings.startDate} onChange={e=>setSettings({...settings,startDate:e.target.value})}/></label><label>사용 종료일<input type="date" value={settings.endDate} onChange={e=>setSettings({...settings,endDate:e.target.value})}/></label></div><button className="primary">설정 저장</button>{msg&&<div className="success">{msg}</div>}<p>사용자의 영상 주제·프롬프트·결과물은 저장하지 않습니다.</p></form>}</div></div>;
}

function EditablePrompt({title,value,onChange,onCopy,tools}:{title:string;value:string;onChange:(v:string)=>void;onCopy:()=>void;tools:"image"|"video"}){
  const[edit,setEdit]=useState(false);
  return <div className="prompt-section"><b>{title}</b>{edit?<textarea className="prompt" value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",minHeight:220}}/>:<pre className="prompt">{value}</pre>}<div className="scene-tools"><button type="button" className="copy-btn" onClick={()=>setEdit(!edit)}>{edit?"수정 완료":"수정"}</button><button type="button" className="copy-btn" onClick={onCopy}>프롬프트 복사</button>{tools==="image"?<><ToolButton label="Gemini에서 만들기" url={TOOL_URLS.gemini}/><ToolButton label="ChatGPT에서 만들기" url={TOOL_URLS.chatgpt}/></>:<ToolButton label="Google Flow에서 만들기" url={TOOL_URLS.flow}/>}</div></div>;
}

export default function App(){
  const[entered,setEntered]=useState(false);const[code,setCode]=useState("");const[msg,setMsg]=useState("");const[adminOpen,setAdminOpen]=useState(false);const[topic,setTopic]=useState("");const[mode,setMode]=useState<"simple"|"standard">("simple");const[duration,setDuration]=useState("20초");const[ratio,setRatio]=useState("9:16");const[scenes,setScenes]=useState<Scene[]>([]);
  const enter=async(e:FormEvent)=>{e.preventDefault();setMsg("");try{await post("gate",{code});setEntered(true)}catch(e){setMsg((e as Error).message)}};
  const copy=async(t:string)=>{await navigator.clipboard.writeText(t);alert("프롬프트를 복사했습니다.")};
  const updateScene=(i:number,key:keyof Scene,value:string)=>setScenes(s=>s.map((x,n)=>n===i?{...x,[key]:value}:x));
  if(!entered)return <main className="gate"><div className="gate-card"><button className="gate-logo" onClick={()=>setAdminOpen(true)}><img src="/personal-management.png" alt="퍼스널매니지먼트"/></button><div className="eyebrow">CINEMAG / MEMBER ACCESS</div><h1>영상 제작 설계기</h1><p>4자리 입장코드를 입력하세요. 사용자 작업은 저장하지 않습니다.</p><form className="stack" onSubmit={enter}><input inputMode="numeric" maxLength={4} placeholder="4자리 입장코드" value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,"").slice(0,4))}/><button className="primary">시작하기</button>{msg&&<div className="error">{msg}</div>}</form></div>{adminOpen&&<Admin close={()=>setAdminOpen(false)}/>}</main>;
  return <div className="app-shell"><header className="appbar"><div className="brand"><div className="brand-title">CINEMAG</div><div className="brand-sub">NO API · NO PROJECT STORAGE</div></div><div className="header-actions"><button onClick={()=>setAdminOpen(true)}>관리자</button><button onClick={()=>setEntered(false)}>나가기</button></div></header><main className="workspace"><section className="brief sheet"><div className="section-title"><span>VIDEO BRIEF</span><h2>무엇을 만들까요?</h2></div><label className="brief-field"><span>영상 주제</span><textarea value={topic} onChange={e=>setTopic(e.target.value)} placeholder="예: 어린이집 선생님이 AI를 활용해 업무시간을 줄이고 아이들과 더 오래 함께하는 이야기"/></label><div className="settings-row"><div><b>제작 방식</b><div className="choices"><button className={`choice ${mode==="simple"?"active":""}`} onClick={()=>{setMode("simple");setDuration("20초")}}>초보자 추천 · 3 Scene</button><button className={`choice ${mode==="standard"?"active":""}`} onClick={()=>{setMode("standard");setDuration("30초")}}>일반 제작 · 6 Scene</button></div></div><div><b>영상 길이</b><div className="choices">{(mode==="simple"?["15초","20초"]:["30초","45초","60초"]).map(v=><button key={v} className={`choice ${duration===v?"active":""}`} onClick={()=>setDuration(v)}>{v}</button>)}</div></div><div><b>화면 비율</b><div className="choices">{["9:16","16:9","1:1"].map(v=><button key={v} className={`choice ${ratio===v?"active":""}`} onClick={()=>setRatio(v)}>{v}</button>)}</div></div></div><button className="generate" onClick={()=>{if(!topic.trim()){alert("영상 주제를 입력해주세요.");return}setScenes(makeScenes(topic.trim(),mode==="simple"?3:6,ratio,duration))}}>기획안 만들기 <span>→</span></button></section>{scenes.length>0&&<section className="sheet document plan-doc"><h3 className="number-title"><span>01</span> 초보자 제작 순서</h3><div className="info-card"><p><b>① 이미지 프롬프트 수정·복사 → ② Gemini 또는 ChatGPT에서 이미지 만들기 → ③ 영상 프롬프트 수정·복사 → ④ Google Flow에서 영상 만들기 → ⑤ 다음 Scene 반복</b></p></div><h3 className="number-title"><span>02</span> Scene별 제작</h3><div className="scene-list">{scenes.map((s,i)=><article className="scene-card" key={i}><div className="scene-head"><div><small>SCENE {String(i+1).padStart(2,"0")}</small><h4>{s.title}</h4></div><span className="duration">{Math.round((parseInt(duration)||30)/scenes.length)}s</span></div><div className="scene-copy"><div className="scene-field"><b>지금 할 일</b><p>먼저 이미지 프롬프트를 복사해 이미지를 만든 뒤, 그 이미지를 기준으로 영상 프롬프트를 사용하세요.</p></div><div className="scene-field"><b>장면 설명</b><textarea value={s.description} onChange={e=>updateScene(i,"description",e.target.value)}/></div><div className="scene-field"><b>내레이션</b><textarea value={s.narration} onChange={e=>updateScene(i,"narration",e.target.value)}/></div><div className="scene-field"><b>자막</b><textarea value={s.caption} onChange={e=>updateScene(i,"caption",e.target.value)}/></div></div><EditablePrompt title="IMAGE PROMPT" value={s.imagePrompt} onChange={v=>updateScene(i,"imagePrompt",v)} onCopy={()=>copy(s.imagePrompt)} tools="image"/><EditablePrompt title="VIDEO PROMPT" value={s.videoPrompt} onChange={v=>updateScene(i,"videoPrompt",v)} onCopy={()=>copy(s.videoPrompt)} tools="video"/></article>)}</div></section>}</main>{adminOpen&&<Admin close={()=>setAdminOpen(false)}/>}</div>;
}
