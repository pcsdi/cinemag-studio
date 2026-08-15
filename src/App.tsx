import {useState,type FormEvent} from "react";

type AdminSettings={accessCode:string;instructorCode:string;startDate:string;endDate:string};
type VoiceType="대사"|"내레이션"|"없음";
type Scene={title:string;description:string;imagePrompt:string;videoPrompt:string;voiceType:VoiceType;voiceText:string;caption:string};

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

function makeVoicePlan(topic:string,count:number){
  const t=topic.replace(/\s+/g," ").trim();
  const has=(...keys:string[])=>keys.some(k=>t.includes(k));
  const fireworks=has("불꽃","불꽃놀이","불꽃축제");
  const daycare=has("어린이집","보육","교사","선생님","영아","유아");
  const career=has("진로","직업","진학","커리어");
  const startup=has("창업","사업","아이디어","고객","문제발견");

  if(fireworks){
    const beats=[
      {title:"도착",description:"해 질 무렵 대학생 친구들이 여의도 한강공원에 도착해 한강이 잘 보이는 자리를 찾는다.",voiceType:"대사" as VoiceType,voiceText:"저쪽이 잘 보이겠다. 거기로 가자.",caption:"불꽃을 기다리는 저녁"},
      {title:"기다림",description:"같은 자리에서 돗자리를 펴고 앉아 주변의 사람들과 어두워지는 하늘을 바라본다.",voiceType:"대사" as VoiceType,voiceText:"이제 곧 시작하나 봐.",caption:"조금만 더 기다리면"},
      {title:"첫 불꽃",description:"한강 위로 첫 불꽃이 터지고 친구들이 동시에 고개를 들어 밤하늘을 바라본다.",voiceType:"대사" as VoiceType,voiceText:"와, 진짜 예쁘다.",caption:"드디어 시작"},
      {title:"몰입",description:"불꽃이 연이어 터지는 동안 친구들은 휴대폰을 잠시 내리고 직접 밤하늘을 바라본다.",voiceType:"없음" as VoiceType,voiceText:"",caption:"눈으로 담는 순간"},
      {title:"피날레",description:"불꽃의 밀도와 밝기가 최고조에 이르고 한강 수면까지 환하게 빛난다.",voiceType:"대사" as VoiceType,voiceText:"이건 진짜 오래 기억나겠다.",caption:"가장 밝은 순간"},
      {title:"마무리",description:"마지막 불꽃이 사라진 뒤 친구들이 돗자리를 접고 사람들과 함께 천천히 걸어 나간다.",voiceType:"대사" as VoiceType,voiceText:"오늘 오길 잘했다.",caption:"함께라서 더 오래 남는 밤"},
    ];
    return count===3?[beats[0],beats[2],beats[5]]:beats.slice(0,count);
  }

  if(daycare){
    const beats=[
      {title:"업무가 남은 저녁",description:"아이들이 하원한 뒤 교사가 사진과 메모를 확인하며 기록 업무를 이어간다.",voiceType:"내레이션" as VoiceType,voiceText:"아이들이 돌아간 뒤에도 선생님의 기록은 끝나지 않습니다.",caption:"하원 후에도 남은 기록"},
      {title:"쌓이는 기록",description:"관찰 메모와 사진, 알림장 기록이 한꺼번에 쌓여 있는 업무 상황을 보여준다.",voiceType:"없음" as VoiceType,voiceText:"",caption:"관찰도, 기록도, 준비도"},
      {title:"AI를 활용하다",description:"교사가 짧은 음성 메모를 남기고 AI가 내용을 관찰 기록과 다음 지원 내용으로 정리한다.",voiceType:"대사" as VoiceType,voiceText:"오늘 놀이 기록을 정리해줘.",caption:"말하면 정리가 시작된다"},
      {title:"업무 흐름이 바뀌다",description:"정리된 기록을 확인한 교사가 필요한 부분만 수정하고 컴퓨터를 닫는다.",voiceType:"없음" as VoiceType,voiceText:"",caption:"반복 업무는 줄이고"},
      {title:"아이 곁으로",description:"교사가 아이 옆에 앉아 눈을 맞추며 놀이에 자연스럽게 참여한다.",voiceType:"내레이션" as VoiceType,voiceText:"줄어든 시간은 다시 아이에게 돌아갑니다.",caption:"더 중요한 곳에 쓰는 시간"},
      {title:"마무리",description:"교사와 아이들이 함께 웃는 장면으로 변화의 의미를 보여준다.",voiceType:"없음" as VoiceType,voiceText:"",caption:"AI가 돌려준 시간"},
    ];
    return count===3?[beats[0],beats[2],beats[4]]:beats.slice(0,count);
  }

  if(career){
    const beats=[
      {title:"막막한 시작",description:"학생이 관심 있는 것과 잘하는 것을 적어보지만 진로로 연결하지 못해 고민한다.",voiceType:"내레이션" as VoiceType,voiceText:"좋아하는 것은 있는데, 어떤 길로 이어질지는 아직 막막합니다.",caption:"막연한 진로 고민"},
      {title:"질문을 바꾸다",description:"학생이 자신의 관심사와 경험을 AI에 입력하며 질문을 구체화한다.",voiceType:"없음" as VoiceType,voiceText:"",caption:"나를 더 구체적으로 질문하기"},
      {title:"가능성을 찾다",description:"관련 직업과 필요한 역량을 비교하며 자신에게 맞는 후보를 추려본다.",voiceType:"대사" as VoiceType,voiceText:"이건 내가 해보고 싶다.",caption:"가능성이 보이기 시작한다"},
      {title:"직접 확인하다",description:"학생이 선택한 진로와 연결된 활동이나 프로젝트를 찾아본다.",voiceType:"없음" as VoiceType,voiceText:"",caption:"정보에서 경험으로"},
      {title:"작은 행동을 정하다",description:"오늘 바로 시작할 수 있는 작은 실천을 한 가지 정한다.",voiceType:"내레이션" as VoiceType,voiceText:"진로는 정답을 찾는 일이 아니라, 나에게 맞는 방향을 확인해가는 과정입니다.",caption:"오늘의 한 걸음"},
      {title:"마무리",description:"학생이 정리한 진로 계획을 바라보며 다음 행동을 준비한다.",voiceType:"없음" as VoiceType,voiceText:"",caption:"막연함에서 방향으로"},
    ];
    return count===3?[beats[0],beats[2],beats[4]]:beats.slice(0,count);
  }

  if(startup){
    const beats=[
      {title:"아이디어의 시작",description:"예비 창업자가 떠오른 아이디어를 적어보지만 누구의 어떤 문제인지 아직 선명하지 않다.",voiceType:"내레이션" as VoiceType,voiceText:"좋은 아이디어보다 먼저 확인해야 할 것은, 누구의 어떤 문제인지입니다.",caption:"아이디어보다 문제부터"},
      {title:"문제를 다시 보다",description:"고객 상황과 불편을 구체적인 질문으로 나누어 정리한다.",voiceType:"없음" as VoiceType,voiceText:"",caption:"고객의 상황을 구체적으로"},
      {title:"가설을 세우다",description:"AI를 활용해 고객 문제와 해결 가설을 짧고 명확하게 정리한다.",voiceType:"대사" as VoiceType,voiceText:"이 문제부터 검증해보자.",caption:"검증할 문제 하나"},
      {title:"반응을 확인하다",description:"간단한 인터뷰나 설문으로 실제 고객의 반응을 확인한다.",voiceType:"없음" as VoiceType,voiceText:"",caption:"생각이 아니라 반응으로"},
      {title:"해결안을 다듬다",description:"확인한 반응을 바탕으로 해결 방법과 핵심 가치를 다시 정리한다.",voiceType:"내레이션" as VoiceType,voiceText:"검증할수록 아이디어는 더 구체적인 해결책이 됩니다.",caption:"검증하며 선명해지는 해결책"},
      {title:"마무리",description:"한 문장으로 정리된 문제와 해결안을 화면에 두고 다음 실행을 준비한다.",voiceType:"없음" as VoiceType,voiceText:"",caption:"다음은 실행"},
    ];
    return count===3?[beats[0],beats[2],beats[4]]:beats.slice(0,count);
  }

  const generic=[
    {title:"시작",description:"주인공과 핵심 공간을 자연스럽게 보여주며 상황을 시작한다.",voiceType:"없음" as VoiceType,voiceText:"",caption:""},
    {title:"상황",description:"앞 장면에서 이어지는 행동을 통해 현재 상황을 구체적으로 보여준다.",voiceType:"없음" as VoiceType,voiceText:"",caption:""},
    {title:"핵심 장면",description:"이 영상에서 가장 중요한 행동이나 경험이 분명하게 드러난다.",voiceType:"없음" as VoiceType,voiceText:"",caption:""},
    {title:"반응",description:"주인공의 표정과 행동으로 핵심 경험에 대한 반응을 보여준다.",voiceType:"없음" as VoiceType,voiceText:"",caption:""},
    {title:"결과",description:"앞선 행동의 결과가 자연스럽게 드러난다.",voiceType:"없음" as VoiceType,voiceText:"",caption:""},
    {title:"마무리",description:"마지막 행동과 공간의 여운을 남기며 이야기를 끝낸다.",voiceType:"없음" as VoiceType,voiceText:"",caption:""},
  ];
  return count===3?[generic[0],generic[2],generic[5]]:generic.slice(0,count);
}

function makeAudioPlan(topic:string,index:number,count:number){
  const t=topic.replace(/\s+/g," ").trim();
  const has=(...keys:string[])=>keys.some(k=>t.includes(k));
  const opening=index===0, ending=index===count-1;

  if(has("불꽃","불꽃놀이","불꽃축제")) return {
    bgm: opening?"Warm youthful cinematic music with light anticipation.":ending?"Emotional cinematic music that gently resolves after the fireworks climax.":"Energetic cinematic music that gradually builds excitement toward the fireworks climax.",
    ambient: opening?"Han River breeze, distant crowd murmur, footsteps and park ambience.":ending?"Fading fireworks echoes, river ambience, footsteps and distant crowd movement.":"Crowd reactions, Han River ambience, firework launch sounds and realistic explosions synchronized with the visuals."
  };
  if(has("어린이집","보육","교사","선생님","영아","유아")) return {
    bgm: opening?"Soft reflective piano and warm ambient pads, slightly tired but gentle.":ending?"Warm hopeful acoustic and piano music with a calm emotional resolution.":"Light modern documentary music that becomes brighter as the workflow improves.",
    ambient: opening?"Quiet classroom after-hours ambience, soft keyboard clicks, paper handling and distant room tone.":ending?"Natural classroom play sounds, soft children laughter and gentle room ambience.":"Subtle classroom ambience, smartphone voice recording sound and restrained computer interface sounds."
  };
  if(has("진로","직업","진학","커리어")) return {
    bgm: opening?"Thoughtful minimal piano with a slightly uncertain mood.":ending?"Bright hopeful indie-cinematic music suggesting direction and possibility.":"Light inspiring electronic-acoustic music that gradually gains confidence.",
    ambient: opening?"Quiet school or study-room ambience, pencil writing and soft page turns.":ending?"Natural school ambience, light footsteps and subtle workspace sounds.":"Keyboard typing, notebook writing, soft classroom ambience and subtle device interaction sounds."
  };
  if(has("창업","사업","아이디어","고객","문제발견")) return {
    bgm: opening?"Clean modern minimal beat with a thoughtful, problem-solving tone.":ending?"Confident upbeat innovation music with a concise finish.":"Focused modern startup-style electronic rhythm that builds momentum without becoming aggressive.",
    ambient: opening?"Quiet workspace ambience, pen on paper, keyboard clicks and soft office room tone.":ending?"Subtle team workspace ambience, page movement and light device sounds.":"Natural meeting-room sounds, keyboard typing, note-taking and restrained notification sounds."
  };
  if(has("여행","관광","바다","산","캠핑","공원")) return {
    bgm: opening?"Bright travel acoustic music with a sense of anticipation.":ending?"Warm reflective travel music with a relaxed ending.":"Light upbeat travel music matching the pace and scenery.",
    ambient:"Use realistic location-specific nature and travel ambience such as wind, footsteps, distant voices, water, birds or traffic only when appropriate to the scene."
  };
  if(has("음식","요리","카페","맛집","베이킹")) return {
    bgm:"Light cheerful lifestyle music that matches the food and social mood.",
    ambient:"Realistic cooking, tableware, café room tone, sizzling, pouring or serving sounds only when they match the scene."
  };
  if(has("수업","교육","강의","학교","학습","학생")) return {
    bgm: opening?"Calm curious educational background music.":ending?"Warm motivating educational music with a clear finish.":"Light focused educational music that supports concentration.",
    ambient:"Natural classroom ambience, page turns, writing, keyboard sounds and quiet student reactions appropriate to the scene."
  };
  return {
    bgm:`Background music should match the subject "${t}", the current scene mood, and the story progression. Start gently, develop naturally, and resolve appropriately at the ending.`,
    ambient:`Use only realistic ambient sounds that naturally belong to the subject "${t}" and the current scene location and action. Do not add unrelated stock sound effects.`
  };
}

function makeScenes(topic:string,count:number,ratio:string,duration:string):Scene[]{
  const sec=Math.max(3,Math.round((parseInt(duration)||30)/count));
  const beats=makeVoicePlan(topic,count);
  return beats.map((beat,i)=>{
    const continuity=i===0?"This is the opening scene.":`Continue naturally from Scene ${i}. Keep the same protagonist, face, hairstyle, clothing, props, location logic and screen direction.`;
    const imagePrompt=`Create ONE photorealistic cinematic still image.\n\nSUBJECT: ${topic}\nSCENE: ${beat.title}\nVISUAL: ${beat.description}\nCONTINUITY: ${continuity}\nCHARACTER LOCK: Keep the exact same face, age, hairstyle, body type, clothing, shoes, accessories and recurring props across every scene.\nCOMPOSITION: One decisive, physically plausible instant with a clear focal point and natural depth of field.\nSTYLE: realistic cinematic lighting, natural Korean environment, coherent visual continuity.\nASPECT RATIO: ${ratio}.\nOUTPUT: One still image only. No text, captions, titles, logos, watermarks or split panels.`;
    const voiceInstruction=beat.voiceType==="없음"?"VOICE: No spoken dialogue or narration.":beat.voiceType==="대사"?`DIALOGUE: Speak this Korean line once, naturally and briefly: \"${beat.voiceText}\"`: `NARRATION: Use this Korean narration once in a calm, natural tone: \"${beat.voiceText}\"`;
    const audio=makeAudioPlan(topic,i,count);
    const videoPrompt=`Animate the approved Scene ${i+1} image into a ${sec}-second cinematic video clip.\n\nSTORY: ${topic}\nCURRENT SCENE: ${beat.title}\nACTION: ${beat.description}\nCAMERA MOVEMENT: Use one restrained cinematic camera movement only.\nENVIRONMENT MOVEMENT: Add subtle realistic environmental motion.\nCONTINUITY: ${continuity}\nCHARACTER LOCK: Do not change face, age, hairstyle, body type, clothing, shoes, accessories or props.\nBGM: ${audio.bgm}\nAMBIENT SOUND: ${audio.ambient}\n${voiceInstruction}\nAUDIO MIX: Balance BGM, ambient sound and voice according to this scene. Voice must remain clear when present, important real-world sounds should remain audible, and no audio element should overpower the scene.\nDURATION: about ${sec} seconds.\nSTYLE: realistic cinematic lighting, natural Korean environment, smooth motion.\nOUTPUT: No captions, titles, logos or watermarks.`;
    return{title:beat.title,description:beat.description,imagePrompt,videoPrompt,voiceType:beat.voiceType,voiceText:beat.voiceText,caption:beat.caption};
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
  const updateVoiceType=(i:number,voiceType:VoiceType)=>setScenes(s=>s.map((x,n)=>n===i?{...x,voiceType,voiceText:voiceType==="없음"?"":x.voiceText}:x));
  if(!entered)return <main className="gate"><div className="gate-card"><button className="gate-logo" onClick={()=>setAdminOpen(true)}><img src="/personal-management.png" alt="퍼스널매니지먼트"/></button><div className="eyebrow">CINEMAG / MEMBER ACCESS</div><h1>영상 제작 설계기</h1><p>4자리 입장코드를 입력하세요. 사용자 작업은 저장하지 않습니다.</p><form className="stack" onSubmit={enter}><input inputMode="numeric" maxLength={4} placeholder="4자리 입장코드" value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,"").slice(0,4))}/><button className="primary">시작하기</button>{msg&&<div className="error">{msg}</div>}</form></div>{adminOpen&&<Admin close={()=>setAdminOpen(false)}/>}</main>;
  return <div className="app-shell"><header className="appbar"><div className="brand"><div className="brand-title">CINEMAG</div><div className="brand-sub">NO API · NO PROJECT STORAGE</div></div><div className="header-actions"><button onClick={()=>setAdminOpen(true)}>관리자</button><button onClick={()=>setEntered(false)}>나가기</button></div></header><main className="workspace"><section className="brief sheet"><div className="section-title"><span>VIDEO BRIEF</span><h2>무엇을 만들까요?</h2></div><label className="brief-field"><span>영상 주제</span><textarea value={topic} onChange={e=>setTopic(e.target.value)} placeholder="예: 대학생들이 친구들과 여의도 불꽃놀이 축제를 즐기는 이야기"/></label><div className="settings-row"><div><b>제작 방식</b><div className="choices"><button className={`choice ${mode==="simple"?"active":""}`} onClick={()=>{setMode("simple");setDuration("20초")}}>초보자 추천 · 3 Scene</button><button className={`choice ${mode==="standard"?"active":""}`} onClick={()=>{setMode("standard");setDuration("30초")}}>일반 제작 · 6 Scene</button></div></div><div><b>영상 길이</b><div className="choices">{(mode==="simple"?["15초","20초"]:["30초","45초","60초"]).map(v=><button key={v} className={`choice ${duration===v?"active":""}`} onClick={()=>setDuration(v)}>{v}</button>)}</div></div><div><b>화면 비율</b><div className="choices">{["9:16","16:9","1:1"].map(v=><button key={v} className={`choice ${ratio===v?"active":""}`} onClick={()=>setRatio(v)}>{v}</button>)}</div></div></div><button className="generate" onClick={()=>{if(!topic.trim()){alert("영상 주제를 입력해주세요.");return}setScenes(makeScenes(topic.trim(),mode==="simple"?3:6,ratio,duration))}}>기획안 만들기 <span>→</span></button></section>{scenes.length>0&&<section className="sheet document plan-doc"><h3 className="number-title"><span>01</span> 제작 순서</h3><div className="info-card"><p><b>① 이미지 프롬프트 수정·복사 → ② Gemini 또는 ChatGPT에서 이미지 만들기 → ③ 영상 프롬프트 수정·복사 → ④ Google Flow에서 영상 만들기 → ⑤ 다음 Scene 반복</b></p></div><h3 className="number-title"><span>02</span> Scene별 제작</h3><div className="scene-list">{scenes.map((s,i)=><article className="scene-card" key={i}><div className="scene-head"><div><small>SCENE {String(i+1).padStart(2,"0")}</small><h4>{s.title}</h4></div><span className="duration">{Math.round((parseInt(duration)||30)/scenes.length)}s</span></div><div className="scene-copy"><div className="scene-field"><b>지금 할 일</b><p>먼저 이미지 프롬프트를 복사해 이미지를 만든 뒤, 그 이미지를 기준으로 영상 프롬프트를 사용하세요.</p></div><div className="scene-field"><b>장면 설명</b><textarea value={s.description} onChange={e=>updateScene(i,"description",e.target.value)}/></div><div className="scene-field"><b>음성 유형</b><div className="choices">{(["대사","내레이션","없음"] as VoiceType[]).map(v=><button type="button" key={v} className={`choice ${s.voiceType===v?"active":""}`} onClick={()=>updateVoiceType(i,v)}>{v}</button>)}</div></div>{s.voiceType!=="없음"&&<div className="scene-field"><b>{s.voiceType}</b><textarea value={s.voiceText} onChange={e=>updateScene(i,"voiceText",e.target.value)} placeholder={s.voiceType==="대사"?"이 장면에서 실제 사람이 할 법한 짧은 말을 입력하세요.":"장면을 설명하는 짧은 내레이션을 입력하세요."}/></div>}<div className="scene-field"><b>자막</b><textarea value={s.caption} onChange={e=>updateScene(i,"caption",e.target.value)}/></div></div><EditablePrompt title="IMAGE PROMPT" value={s.imagePrompt} onChange={v=>updateScene(i,"imagePrompt",v)} onCopy={()=>copy(s.imagePrompt)} tools="image"/><EditablePrompt title="VIDEO PROMPT" value={s.videoPrompt} onChange={v=>updateScene(i,"videoPrompt",v)} onCopy={()=>copy(s.videoPrompt)} tools="video"/></article>)}</div></section>}</main>{adminOpen&&<Admin close={()=>setAdminOpen(false)}/>}</div>;
}
