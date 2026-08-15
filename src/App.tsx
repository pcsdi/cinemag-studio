import {useState,type FormEvent} from "react";

type AdminSettings={accessCode:string;instructorCode:string;startDate:string;endDate:string};
type VoiceType="대사"|"내레이션"|"없음";
type Beat={title:string;description:string;voiceType:VoiceType;voiceText:string;caption:string};
type Scene={title:string;description:string;imagePrompt:string;videoPrompt:string;voiceType:VoiceType;voiceText:string;caption:string;bgm:string;ambient:string};

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

function hasAny(text:string,...keys:string[]){return keys.some(k=>text.includes(k));}

function makeVoicePlan(topic:string,count:number):Beat[]{
  const t=topic.replace(/\s+/g," ").trim();

  if(hasAny(t,"불꽃","불꽃놀이","불꽃축제")){
    const beats:Beat[]=[
      {title:"도착",description:"해 질 무렵 대학생 친구들이 여의도 한강공원에 도착해 한강과 밤하늘이 잘 보이는 자리를 찾는다.",voiceType:"대사",voiceText:"저쪽이 잘 보이겠다. 거기로 가자.",caption:"불꽃을 기다리는 저녁"},
      {title:"기다림",description:"같은 자리에서 돗자리를 펴고 앉아 친구들과 이야기하며 점점 어두워지는 하늘을 바라본다.",voiceType:"대사",voiceText:"이제 곧 시작하나 봐.",caption:"조금만 더 기다리면"},
      {title:"첫 불꽃",description:"한강 위로 첫 불꽃이 터지고 대학생 친구들이 동시에 고개를 들어 밤하늘을 바라보며 환하게 웃는다.",voiceType:"대사",voiceText:"와, 진짜 예쁘다.",caption:"드디어 시작"},
      {title:"몰입",description:"불꽃이 연이어 터지는 동안 친구들은 휴대폰을 잠시 내리고 직접 밤하늘을 바라보며 순간을 즐긴다.",voiceType:"없음",voiceText:"",caption:"눈으로 담는 순간"},
      {title:"피날레",description:"화려한 불꽃이 연속으로 터지며 절정에 이르고 한강 수면과 친구들의 얼굴에 불꽃빛이 반사된다.",voiceType:"대사",voiceText:"이건 진짜 오래 기억나겠다.",caption:"가장 밝은 순간"},
      {title:"마무리",description:"마지막 불꽃이 사라진 뒤 대학생 친구들이 돗자리를 접고 불꽃축제 이야기를 나누며 함께 걸어 나간다.",voiceType:"대사",voiceText:"오늘 오길 잘했다.",caption:"함께라서 더 오래 남는 밤"},
    ];
    return count===3?[beats[0],beats[2],beats[5]]:beats.slice(0,count);
  }

  if(hasAny(t,"어린이집","보육","교사","선생님","영아","유아")){
    const beats:Beat[]=[
      {title:"업무가 남은 저녁",description:"아이들이 하원한 뒤 어린이집 교사가 사진과 메모를 확인하며 기록 업무를 이어간다.",voiceType:"내레이션",voiceText:"아이들이 돌아간 뒤에도 선생님의 기록은 끝나지 않습니다.",caption:"하원 후에도 남은 기록"},
      {title:"쌓이는 기록",description:"관찰 메모와 사진, 알림장 기록이 한꺼번에 쌓여 있는 업무 상황을 보여준다.",voiceType:"없음",voiceText:"",caption:"관찰도, 기록도, 준비도"},
      {title:"AI를 활용하다",description:"교사가 스마트폰에 짧은 음성 메모를 남기고 AI가 내용을 관찰 기록과 다음 놀이 지원으로 정리한다.",voiceType:"대사",voiceText:"오늘 놀이 기록을 정리해줘.",caption:"말하면 정리가 시작된다"},
      {title:"업무 흐름이 바뀌다",description:"정리된 기록을 확인한 교사가 필요한 부분만 수정하고 컴퓨터를 닫는다.",voiceType:"없음",voiceText:"",caption:"반복 업무는 줄이고"},
      {title:"아이 곁으로",description:"교사가 아이 옆에 앉아 눈을 맞추며 놀이에 자연스럽게 참여한다.",voiceType:"내레이션",voiceText:"줄어든 시간은 다시 아이에게 돌아갑니다.",caption:"더 중요한 곳에 쓰는 시간"},
      {title:"마무리",description:"교사와 아이들이 함께 웃으며 놀이하는 따뜻한 장면으로 변화를 보여준다.",voiceType:"없음",voiceText:"",caption:"AI가 돌려준 시간"},
    ];
    return count===3?[beats[0],beats[2],beats[4]]:beats.slice(0,count);
  }

  if(hasAny(t,"진로","직업","진학","커리어")){
    const beats:Beat[]=[
      {title:"막막한 시작",description:"학생이 관심 있는 것과 잘하는 것을 적어보지만 진로로 연결하지 못해 고민한다.",voiceType:"내레이션",voiceText:"좋아하는 것은 있는데, 어떤 길로 이어질지는 아직 막막합니다.",caption:"막연한 진로 고민"},
      {title:"질문을 바꾸다",description:"학생이 자신의 관심사와 경험을 AI에 입력하며 질문을 구체화한다.",voiceType:"없음",voiceText:"",caption:"나를 더 구체적으로 질문하기"},
      {title:"가능성을 찾다",description:"관련 직업과 필요한 역량을 비교하며 자신에게 맞는 진로 후보를 추려본다.",voiceType:"대사",voiceText:"이건 내가 해보고 싶다.",caption:"가능성이 보이기 시작한다"},
      {title:"직접 확인하다",description:"학생이 선택한 진로와 연결된 활동이나 프로젝트를 찾아본다.",voiceType:"없음",voiceText:"",caption:"정보에서 경험으로"},
      {title:"작은 행동을 정하다",description:"오늘 바로 시작할 수 있는 작은 실천을 한 가지 정한다.",voiceType:"내레이션",voiceText:"진로는 정답을 찾는 일이 아니라 나에게 맞는 방향을 확인해가는 과정입니다.",caption:"오늘의 한 걸음"},
      {title:"마무리",description:"학생이 정리한 진로 계획을 바라보며 다음 행동을 준비한다.",voiceType:"없음",voiceText:"",caption:"막연함에서 방향으로"},
    ];
    return count===3?[beats[0],beats[2],beats[4]]:beats.slice(0,count);
  }

  if(hasAny(t,"창업","사업","아이디어","고객","문제발견")){
    const beats:Beat[]=[
      {title:"아이디어의 시작",description:"예비 창업자가 아이디어를 적어보지만 누구의 어떤 문제를 해결하는지는 아직 선명하지 않다.",voiceType:"내레이션",voiceText:"좋은 아이디어보다 먼저 확인해야 할 것은 누구의 어떤 문제인지입니다.",caption:"아이디어보다 문제부터"},
      {title:"문제를 다시 보다",description:"고객의 상황과 불편을 구체적인 질문으로 나누어 정리한다.",voiceType:"없음",voiceText:"",caption:"고객의 상황을 구체적으로"},
      {title:"가설을 세우다",description:"AI를 활용해 고객 문제와 해결 가설을 짧고 명확하게 정리한다.",voiceType:"대사",voiceText:"이 문제부터 검증해보자.",caption:"검증할 문제 하나"},
      {title:"반응을 확인하다",description:"간단한 인터뷰나 설문으로 실제 고객의 반응을 확인한다.",voiceType:"없음",voiceText:"",caption:"생각이 아니라 반응으로"},
      {title:"해결안을 다듬다",description:"확인한 반응을 바탕으로 해결 방법과 핵심 가치를 다시 정리한다.",voiceType:"내레이션",voiceText:"검증할수록 아이디어는 더 구체적인 해결책이 됩니다.",caption:"검증하며 선명해지는 해결책"},
      {title:"마무리",description:"한 문장으로 정리된 문제와 해결안을 보며 다음 실행을 준비한다.",voiceType:"없음",voiceText:"",caption:"다음은 실행"},
    ];
    return count===3?[beats[0],beats[2],beats[4]]:beats.slice(0,count);
  }

  if(hasAny(t,"여행","관광","바다","산","캠핑","산책")){
    const beats:Beat[]=[
      {title:"출발",description:`${t}의 핵심 장소에 도착한 주인공이 주변 풍경을 바라보며 여행을 시작한다.`,voiceType:"없음",voiceText:"",caption:"여행의 시작"},
      {title:"발견",description:`${t}에서 가장 인상적인 풍경이나 장소를 발견하고 천천히 둘러본다.`,voiceType:"대사",voiceText:"여기 정말 좋다.",caption:"눈에 들어온 순간"},
      {title:"경험",description:`${t}의 핵심 활동을 직접 경험하며 장소의 분위기에 몰입한다.`,voiceType:"없음",voiceText:"",caption:"직접 느끼는 시간"},
      {title:"여유",description:`같은 장소에서 잠시 쉬며 주변 소리와 풍경을 충분히 느낀다.`,voiceType:"없음",voiceText:"",caption:"잠시 머무는 시간"},
      {title:"기억",description:`여행에서 가장 기억에 남는 장면을 사진이나 눈으로 담는다.`,voiceType:"내레이션",voiceText:"좋았던 순간은 오래 기억에 남습니다.",caption:"기억으로 남기기"},
      {title:"마무리",description:`주인공이 여행 장소를 천천히 떠나며 마지막 풍경을 돌아본다.`,voiceType:"없음",voiceText:"",caption:"다음 여행을 기다리며"},
    ];
    return count===3?[beats[0],beats[2],beats[5]]:beats.slice(0,count);
  }

  const generic:Beat[]=[
    {title:"시작",description:`${t}의 주인공과 핵심 공간, 현재 상황이 한눈에 이해되도록 보여준다.`,voiceType:"없음",voiceText:"",caption:""},
    {title:"상황",description:`${t}에서 실제로 일어나는 첫 행동을 보여주며 이야기의 방향을 분명하게 만든다.`,voiceType:"없음",voiceText:"",caption:""},
    {title:"핵심 장면",description:`${t}에서 가장 중요한 경험이나 행동이 구체적으로 드러나는 순간을 보여준다.`,voiceType:"없음",voiceText:"",caption:""},
    {title:"반응",description:`앞선 핵심 경험에 대한 주인공의 표정, 반응, 다음 행동을 자연스럽게 보여준다.`,voiceType:"없음",voiceText:"",caption:""},
    {title:"결과",description:`앞선 행동으로 인해 생긴 변화나 결과가 화면에서 분명하게 보이도록 한다.`,voiceType:"없음",voiceText:"",caption:""},
    {title:"마무리",description:`${t}의 결과와 분위기를 한 장면으로 정리하며 자연스러운 여운을 남긴다.`,voiceType:"없음",voiceText:"",caption:""},
  ];
  return count===3?[generic[0],generic[2],generic[5]]:generic.slice(0,count);
}

function makeAudioPlan(topic:string,index:number,count:number){
  const t=topic.replace(/\s+/g," ").trim();
  const opening=index===0,ending=index===count-1;

  if(hasAny(t,"불꽃","불꽃놀이","불꽃축제")) return {
    bgm:opening?"Warm youthful cinematic music with light anticipation and a gentle beat.":ending?"Warm emotional cinematic music that softly resolves after the fireworks.":"Energetic youthful cinematic music that gradually builds toward the fireworks climax.",
    ambient:opening?"Han River breeze, distant crowd murmur, footsteps and riverside park ambience.":ending?"Fading fireworks echoes, river ambience, footsteps and people leaving the park.":"Han River ambience, excited crowd reactions, firework launch sounds and realistic firework explosions synchronized with the visuals."
  };
  if(hasAny(t,"어린이집","보육","교사","선생님","영아","유아")) return {
    bgm:opening?"Soft reflective piano with warm ambient pads, calm and slightly tired.":ending?"Warm hopeful acoustic and piano music with a gentle resolution.":"Light modern documentary music that gradually becomes brighter as the workflow improves.",
    ambient:opening?"Quiet classroom after-hours room tone, keyboard clicks and paper handling.":ending?"Natural classroom play sounds, soft children laughter and gentle room ambience.":"Subtle classroom ambience, smartphone voice recording sound and restrained computer interface sounds."
  };
  if(hasAny(t,"진로","직업","진학","커리어")) return {
    bgm:opening?"Thoughtful minimal piano with a slightly uncertain mood.":ending?"Bright hopeful indie-cinematic music suggesting direction and possibility.":"Light inspiring electronic-acoustic music that gradually gains confidence.",
    ambient:opening?"Quiet school or study-room ambience, pencil writing and soft page turns.":ending?"Natural school ambience, light footsteps and subtle workspace sounds.":"Keyboard typing, notebook writing, soft classroom ambience and subtle device interaction sounds."
  };
  if(hasAny(t,"창업","사업","아이디어","고객","문제발견")) return {
    bgm:opening?"Clean modern minimal beat with a thoughtful problem-solving tone.":ending?"Confident upbeat innovation music with a concise finish.":"Focused modern startup-style electronic rhythm that builds momentum without becoming aggressive.",
    ambient:opening?"Quiet workspace ambience, pen on paper, keyboard taps and subtle room tone.":ending?"Workspace ambience, paper handling and a subtle chair or laptop closing sound.":"Keyboard typing, sticky-note handling, light meeting-room ambience and subtle conversation reactions."
  };
  if(hasAny(t,"여행","관광","바다","산","캠핑","산책")) return {
    bgm:opening?"Fresh acoustic travel music with light anticipation.":ending?"Warm reflective travel music that gently fades out.":"Bright cinematic travel music that supports discovery without overpowering natural ambience.",
    ambient:"Use realistic location-specific ambience such as wind, water, birds, footsteps, distant people and environmental sounds that actually belong to the current travel scene."
  };
  return {
    bgm:`Background music must match the subject "${t}", the emotion of this exact scene, and its position in the story. ${opening?"Begin gently and establish the mood.":ending?"Resolve naturally and leave an appropriate emotional aftertaste.":"Develop naturally without overpowering the scene."}`,
    ambient:`Use only realistic ambient sounds that naturally belong to the subject "${t}", the current location and the visible action. Do not use unrelated stock sound effects.`
  };
}

function makeImagePrompt(topic:string,beat:Beat,index:number,ratio:string){
  const continuity=index===0?"This is the opening still. Establish the permanent visual reference for recurring characters and environment.":`Continue visually from Scene ${index}. Preserve the same recurring characters, exact faces, hairstyle, body type, clothing, shoes, accessories, props, location logic, lighting progression and screen direction.`;
  return `Create ONE photorealistic cinematic still image.\n\nSTORY SUBJECT: ${topic}\nCURRENT SCENE: Scene ${index+1} — ${beat.title}\nSCENE CONTENT: ${beat.description}\nVISUAL PRIORITY: Show the specific people, place, objects and situation required by this scene. Do not replace them with generic stock imagery.\nCONTINUITY: ${continuity}\nCHARACTER LOCK: Keep recurring characters identical across scenes: same face, age, hairstyle, body type, clothing, shoes, accessories and recurring props.\nCOMPOSITION: Capture one decisive, physically plausible still moment that best represents this exact scene. Natural depth of field and one clear focal point.\nSTYLE: realistic cinematic lighting appropriate to the subject and location, natural Korean environment when relevant, coherent time progression.\nASPECT RATIO: ${ratio}.\nOUTPUT: One still image only. No text, captions, titles, logos, watermarks, split panels or collage.`;
}

function makeVideoPrompt(topic:string,beat:Beat,index:number,count:number,sec:number,bgm:string,ambient:string){
  const continuity=index===0?"Begin from the approved Scene 1 still image and preserve its exact visual identity.":`Begin from the approved Scene ${index+1} still image and continue naturally from Scene ${index}. Preserve the same recurring characters, location logic, wardrobe, props, eyeline and screen direction.`;
  const voice=beat.voiceType==="없음"?"VOICE: No spoken dialogue or narration in this scene.":beat.voiceType==="대사"?`VOICE — KOREAN DIALOGUE: Speak this line once, naturally, briefly and only when the visible action makes it believable: "${beat.voiceText}"`:`VOICE — KOREAN NARRATION: Use this line once in a natural tone that matches the scene: "${beat.voiceText}"`;
  const camera=index===0?"Use a gentle establishing movement such as a slow push-in or restrained lateral move.":index===count-1?"Use a restrained pull-back, hold or gentle follow movement that gives the ending room to breathe.":"Use one restrained cinematic movement that follows the current action without resetting the blocking.";
  return `Animate the APPROVED Scene ${index+1} still image into a cinematic video clip. Do NOT recreate it as a new unrelated image.\n\nSTORY SUBJECT: ${topic}\nCURRENT SCENE: Scene ${index+1} — ${beat.title}\nVISIBLE ACTION: ${beat.description}\nACTION RULE: Add only small, physically natural motion that advances this exact scene. Do not invent unrelated events, people, props or locations.\nCAMERA MOVEMENT: ${camera}\nENVIRONMENT MOVEMENT: Add only subtle realistic motion appropriate to the visible location and situation.\nCONTINUITY: ${continuity}\nCHARACTER LOCK: Do not change recurring faces, age, hairstyle, body type, clothing, shoes, accessories or props.\nBGM: ${bgm}\nAMBIENT SOUND: ${ambient}\n${voice}\nAUDIO MIX: Keep dialogue or narration clear when present. Lower BGM under voice, preserve important natural ambience, avoid clipping and keep the mix balanced and cinematic.\nDURATION: about ${sec} seconds.\nSTYLE: realistic cinematic motion, coherent lighting and time progression appropriate to the story subject.\nOUTPUT: One continuous video clip. No captions, titles, logos or watermarks.`;
}

function makeScenes(topic:string,count:number,ratio:string,duration:string):Scene[]{
  const sec=Math.max(3,Math.round((parseInt(duration)||30)/count));
  const beats=makeVoicePlan(topic,count);
  return beats.map((beat,i)=>{
    const audio=makeAudioPlan(topic,i,count);
    return {
      title:beat.title,
      description:beat.description,
      voiceType:beat.voiceType,
      voiceText:beat.voiceText,
      caption:beat.caption,
      bgm:audio.bgm,
      ambient:audio.ambient,
      imagePrompt:makeImagePrompt(topic,beat,i,ratio),
      videoPrompt:makeVideoPrompt(topic,beat,i,count,sec,audio.bgm,audio.ambient),
    };
  });
}

function ToolButton({label,url}:{label:string;url:string}){
  return <button type="button" className="copy-btn" onClick={()=>window.open(url,"_blank","noopener,noreferrer")}>{label} ↗</button>;
}

function Admin({close}:{close:()=>void}){
  const[id,setId]=useState("");
  const[password,setPassword]=useState("");
  const[settings,setSettings]=useState<AdminSettings|null>(null);
  const[msg,setMsg]=useState("");
  const login=async(e:FormEvent)=>{e.preventDefault();setMsg("");try{const d=await post("admin-settings",{id,password,action:"get"});setSettings(d.settings)}catch(e){setMsg((e as Error).message)}};
  const save=async(e:FormEvent)=>{e.preventDefault();if(!settings)return;setMsg("");try{const d=await post("admin-settings",{id,password,action:"save",settings});setSettings(d.settings);setMsg("저장했습니다.")}catch(e){setMsg((e as Error).message)}};
  return <div className="modal"><div className="modal-card"><div className="modal-head"><h3>관리자 설정</h3><button className="close" onClick={close}>×</button></div>{!settings?<form className="stack" onSubmit={login}><input placeholder="관리자 ID" value={id} onChange={e=>setId(e.target.value)}/><input type="password" placeholder="비밀번호" value={password} onChange={e=>setPassword(e.target.value)}/><button className="primary">로그인</button>{msg&&<div className="error">{msg}</div>}</form>:<form className="stack" onSubmit={save}><label>입장코드<input maxLength={4} value={settings.accessCode} onChange={e=>setSettings({...settings,accessCode:e.target.value.replace(/\D/g,"").slice(0,4)})}/></label><label>강사용 코드<input maxLength={4} value={settings.instructorCode} onChange={e=>setSettings({...settings,instructorCode:e.target.value.replace(/\D/g,"").slice(0,4)})}/></label><div className="dates"><label>사용 시작일<input type="date" value={settings.startDate} onChange={e=>setSettings({...settings,startDate:e.target.value})}/></label><label>사용 종료일<input type="date" value={settings.endDate} onChange={e=>setSettings({...settings,endDate:e.target.value})}/></label></div><button className="primary">설정 저장</button>{msg&&<div className="success">{msg}</div>}<p>사용자의 영상 주제·프롬프트·결과물은 저장하지 않습니다.</p></form>}</div></div>;
}

function EditablePrompt({title,value,onChange,onCopy,tools}:{title:string;value:string;onChange:(v:string)=>void;onCopy:()=>void;tools:"image"|"video"}){
  const[edit,setEdit]=useState(false);
  return <div className="prompt-section"><b>{title}</b>{edit?<textarea className="prompt" value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",minHeight:260}}/>:<pre className="prompt">{value}</pre>}<div className="scene-tools"><button type="button" className="copy-btn" onClick={()=>setEdit(!edit)}>{edit?"수정 완료":"수정"}</button><button type="button" className="copy-btn" onClick={onCopy}>프롬프트 복사</button>{tools==="image"?<><ToolButton label="Gemini에서 만들기" url={TOOL_URLS.gemini}/><ToolButton label="ChatGPT에서 만들기" url={TOOL_URLS.chatgpt}/></>:<ToolButton label="Google Flow에서 만들기" url={TOOL_URLS.flow}/>}</div></div>;
}

export default function App(){
  const[entered,setEntered]=useState(false);
  const[code,setCode]=useState("");
  const[msg,setMsg]=useState("");
  const[adminOpen,setAdminOpen]=useState(false);
  const[topic,setTopic]=useState("");
  const[mode,setMode]=useState<"simple"|"standard">("simple");
  const[duration,setDuration]=useState("20초");
  const[ratio,setRatio]=useState("9:16");
  const[scenes,setScenes]=useState<Scene[]>([]);

  const enter=async(e:FormEvent)=>{e.preventDefault();setMsg("");try{await post("gate",{code});setEntered(true)}catch(e){setMsg((e as Error).message)}};
  const copy=async(t:string)=>{await navigator.clipboard.writeText(t);alert("프롬프트를 복사했습니다.")};
  const updateScene=(i:number,key:keyof Scene,value:string)=>setScenes(s=>s.map((x,n)=>n===i?{...x,[key]:value}:x));
  const updateVoiceType=(i:number,voiceType:VoiceType)=>setScenes(s=>s.map((x,n)=>n===i?{...x,voiceType,voiceText:voiceType==="없음"?"":x.voiceText}:x));

  if(!entered)return <main className="gate"><div className="gate-card"><button className="gate-logo" onClick={()=>setAdminOpen(true)}><img src="/personal-management.png" alt="퍼스널매니지먼트"/></button><div className="eyebrow">CINEMAG / MEMBER ACCESS</div><h1>영상 제작 설계기</h1><p>4자리 입장코드를 입력하세요. 사용자 작업은 저장하지 않습니다.</p><form className="stack" onSubmit={enter}><input inputMode="numeric" maxLength={4} placeholder="4자리 입장코드" value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,"").slice(0,4))}/><button className="primary">시작하기</button>{msg&&<div className="error">{msg}</div>}</form></div>{adminOpen&&<Admin close={()=>setAdminOpen(false)}/>}</main>;

  return <div className="app-shell"><header className="appbar"><div className="brand"><div className="brand-title">CINEMAG</div><div className="brand-sub">NO API · NO PROJECT STORAGE</div></div><div className="header-actions"><button onClick={()=>setAdminOpen(true)}>관리자</button><button onClick={()=>setEntered(false)}>나가기</button></div></header><main className="workspace"><section className="brief sheet"><div className="section-title"><span>VIDEO BRIEF</span><h2>무엇을 만들까요?</h2></div><label className="brief-field"><span>영상 주제</span><textarea value={topic} onChange={e=>setTopic(e.target.value)} placeholder="예: 대학생들이 친구들과 여의도 불꽃놀이 축제를 즐기는 이야기"/></label><div className="settings-row"><div><b>제작 방식</b><div className="choices"><button className={`choice ${mode==="simple"?"active":""}`} onClick={()=>{setMode("simple");setDuration("20초")}}>초보자 추천 · 3 Scene</button><button className={`choice ${mode==="standard"?"active":""}`} onClick={()=>{setMode("standard");setDuration("30초")}}>일반 제작 · 6 Scene</button></div></div><div><b>영상 길이</b><div className="choices">{(mode==="simple"?["15초","20초"]:["30초","45초","60초"]).map(v=><button key={v} className={`choice ${duration===v?"active":""}`} onClick={()=>setDuration(v)}>{v}</button>)}</div></div><div><b>화면 비율</b><div className="choices">{["9:16","16:9","1:1"].map(v=><button key={v} className={`choice ${ratio===v?"active":""}`} onClick={()=>setRatio(v)}>{v}</button>)}</div></div></div><button className="generate" onClick={()=>{if(!topic.trim()){alert("영상 주제를 입력해주세요.");return}setScenes(makeScenes(topic.trim(),mode==="simple"?3:6,ratio,duration))}}>기획안 만들기 <span>→</span></button></section>{scenes.length>0&&<section className="sheet document plan-doc"><h3 className="number-title"><span>01</span> 제작 순서</h3><div className="info-card"><p><b>① 이미지 프롬프트 수정·복사 → ② Gemini 또는 ChatGPT에서 이미지 만들기 → ③ 영상 프롬프트 수정·복사 → ④ Google Flow에서 영상 만들기 → ⑤ 다음 Scene 반복</b></p></div><h3 className="number-title"><span>02</span> Scene별 제작</h3><div className="scene-list">{scenes.map((s,i)=><article className="scene-card" key={i}><div className="scene-head"><div><small>SCENE {String(i+1).padStart(2,"0")}</small><h4>{s.title}</h4></div><span className="duration">{Math.round((parseInt(duration)||30)/scenes.length)}s</span></div><div className="scene-copy"><div className="scene-field"><b>지금 할 일</b><p>먼저 이미지 프롬프트를 복사해 이미지를 만든 뒤, 그 이미지를 기준으로 영상 프롬프트를 사용하세요.</p></div><div className="scene-field"><b>장면 설명</b><textarea value={s.description} onChange={e=>updateScene(i,"description",e.target.value)}/></div><div className="scene-field"><b>음성 유형</b><div className="choices">{(["대사","내레이션","없음"] as VoiceType[]).map(v=><button type="button" key={v} className={`choice ${s.voiceType===v?"active":""}`} onClick={()=>updateVoiceType(i,v)}>{v}</button>)}</div></div>{s.voiceType!=="없음"&&<div className="scene-field"><b>{s.voiceType}</b><textarea value={s.voiceText} onChange={e=>updateScene(i,"voiceText",e.target.value)} placeholder={s.voiceType==="대사"?"이 장면에서 실제 사람이 할 법한 짧은 말을 입력하세요.":"장면을 설명하는 짧은 내레이션을 입력하세요."}/></div>}<div className="scene-field"><b>자막</b><textarea value={s.caption} onChange={e=>updateScene(i,"caption",e.target.value)}/></div><div className="scene-field"><b>BGM</b><textarea value={s.bgm} onChange={e=>updateScene(i,"bgm",e.target.value)}/></div><div className="scene-field"><b>현장음</b><textarea value={s.ambient} onChange={e=>updateScene(i,"ambient",e.target.value)}/></div></div><EditablePrompt title="IMAGE PROMPT" value={s.imagePrompt} onChange={v=>updateScene(i,"imagePrompt",v)} onCopy={()=>copy(s.imagePrompt)} tools="image"/><EditablePrompt title="VIDEO PROMPT" value={s.videoPrompt} onChange={v=>updateScene(i,"videoPrompt",v)} onCopy={()=>copy(s.videoPrompt)} tools="video"/></article>)}</div></section>}</main>{adminOpen&&<Admin close={()=>setAdminOpen(false)}/>}</div>;
}
