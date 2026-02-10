import { useState, useRef, useEffect, useCallback } from "react";

const T = {
  ink: "#1a1a2e", inkLight: "#4a4a68", inkMuted: "#8888a0",
  surface: "#fafaf8", surfaceWarm: "#f5f3ef", surfaceCard: "#ffffff",
  border: "#e8e6e1", borderFocus: "#6366f1",
  primary: "#4f46e5", primaryHover: "#4338ca", primaryLight: "#eef2ff", primaryMuted: "#c7d2fe",
  accent: "#0891b2", accentLight: "#ecfeff",
  success: "#059669", successLight: "#ecfdf5",
  warning: "#d97706", warningLight: "#fffbeb",
  error: "#dc2626",
  fontDisplay: "'Instrument Serif', Georgia, serif",
  fontBody: "'DM Sans', -apple-system, sans-serif",
};

const SIMULATED_INTERVIEWS = [
  { id:1, participant:{name:"Sarah K.",role:"Product Designer",tenure:"8 months"}, duration:"7 min",
    messages:[
      {role:"ai",text:"Tell me about your first experience with the product. What were you trying to accomplish?"},
      {role:"user",text:"I was trying to set up a design system dashboard for my team. We'd just migrated from Figma and I needed to get everyone on the same page."},
      {role:"ai",text:"What did you expect that setup process to look like before you started?"},
      {role:"user",text:"Honestly, I expected templates. Like, show me a starting point and let me customize it. Instead I got a completely blank canvas with a toolbar I didn't recognize."},
      {role:"ai",text:"When you saw that blank canvas, what did you try first?"},
      {role:"user",text:"I clicked around the toolbar for a while, then tried right-clicking to see if there was a context menu. Eventually I just googled 'how to create dashboard' with the product name."},
      {role:"ai",text:"That's helpful \u2014 so you turned to external resources. What did you find, and did it help?"},
      {role:"user",text:"I found a YouTube tutorial from like 2 years ago. It was outdated \u2014 half the UI had changed. I ended up piecing things together from 3 different tutorials and a forum post."},
      {role:"ai",text:"Walk me through a specific moment where you felt most frustrated during this process."},
      {role:"user",text:"When I finally built something and tried to share it with my team, I couldn't figure out permissions. I spent 20 minutes looking for a share button that turned out to be buried in a settings menu three levels deep."},
      {role:"ai",text:"If you could change one thing about the getting-started experience, what would it be?"},
      {role:"user",text:"Give me a guided setup wizard. Ask me what I'm trying to do, show me relevant templates, and walk me through the first 5 minutes. After that I can explore on my own."},
    ],
    summary:"Experienced designer who expected templates and guided onboarding. Hit major friction with blank canvas, outdated help resources, and buried sharing functionality. Wants a goal-oriented setup wizard.",
  },
  { id:2, participant:{name:"Marcus T.",role:"Engineering Manager",tenure:"2 weeks"}, duration:"6 min",
    messages:[
      {role:"ai",text:"Tell me about your first experience with the product. What were you trying to accomplish?"},
      {role:"user",text:"My VP asked me to evaluate it as a replacement for our current project management setup. So I was trying to recreate one of our existing sprints."},
      {role:"ai",text:"How did you approach recreating that sprint? Where did you start?"},
      {role:"user",text:"I tried to import our data from Jira but the import tool kept failing silently. No error messages, just... nothing happened."},
      {role:"ai",text:"That silent failure sounds frustrating. How did you try to troubleshoot it?"},
      {role:"user",text:"I checked the docs but they just said 'click import and select your file.' I eventually found a community post saying CSV imports only work under 500 rows, but we had 2000+."},
      {role:"ai",text:"After the import issues, were you able to evaluate the core workflow?"},
      {role:"user",text:"Sort of. The sprint board itself was actually really good once I had data in it. But I couldn't figure out how to set up custom fields for our severity ratings, which is a dealbreaker."},
      {role:"ai",text:"Describe what a successful first week with the product would have looked like for you."},
      {role:"user",text:"Import works on day 1. Custom fields are obvious. By end of week I have one real sprint running with my team and can show my VP a comparison."},
    ],
    summary:"Engineering manager evaluating for team adoption. Critical blockers: silent import failures, undocumented size limitations, hidden custom field configuration. Core product is strong but setup friction threatens adoption.",
  },
  { id:3, participant:{name:"Priya M.",role:"Junior Developer",tenure:"1 month"}, duration:"8 min",
    messages:[
      {role:"ai",text:"Tell me about your first experience with the product. What were you trying to accomplish?"},
      {role:"user",text:"I joined my team and they were already using it, so I just needed to get up to speed and start picking up tasks."},
      {role:"ai",text:"What was that experience like \u2014 landing in an existing project for the first time?"},
      {role:"user",text:"Overwhelming honestly. There were so many panels and views and I had no idea what I was looking at."},
      {role:"ai",text:"How did you figure out what to do? Did you ask for help or try to learn on your own?"},
      {role:"user",text:"I didn't want to seem dumb on my first week so I tried to figure it out myself. I found a 'Getting Started' guide but it was about creating a NEW project, not joining an existing one. Totally useless for me."},
      {role:"ai",text:"That's a really important distinction. What would have helped you in that moment?"},
      {role:"user",text:"Something like 'You've been added to Project X. Here's what your team is working on. Here's your task list.' Like a contextual onboarding based on MY situation."},
      {role:"ai",text:"Once you got oriented, was there anything about the day-to-day experience that tripped you up?"},
      {role:"user",text:"Notifications were a disaster. I was getting pinged about everything. It took me two weeks to find notification settings and by then I'd already started ignoring all notifications."},
      {role:"ai",text:"If you could change one thing about the getting-started experience, what would it be?"},
      {role:"user",text:"Recognize that I'm joining an existing team and give me a different onboarding than someone starting from scratch."},
    ],
    summary:"Junior developer joining existing team. Onboarding assumes project creators, not joiners. Getting Started guide irrelevant to their situation. Notification overload led to learned helplessness. Wants role-aware, contextual onboarding.",
  },
  { id:4, participant:{name:"Rachel D.",role:"Product Manager",tenure:"3 months"}, duration:"6 min",
    messages:[
      {role:"ai",text:"Tell me about your first experience with the product. What were you trying to accomplish?"},
      {role:"user",text:"I was setting up our product roadmap. I'd been promised this amazing timeline view during the sales demo and was excited to try it."},
      {role:"ai",text:"How did the reality compare to what you saw in the demo?"},
      {role:"user",text:"Night and day. The demo had this beautiful, populated roadmap. When I opened it, I had to build everything from scratch and the timeline view requires a specific project type that I didn't select."},
      {role:"ai",text:"What happened when you realized you'd selected the wrong project type?"},
      {role:"user",text:"I tried to change it but you can't change project types after creation. I had to delete everything and start over. That was probably the moment I almost churned."},
      {role:"ai",text:"Describe what a successful first week would have looked like for you."},
      {role:"user",text:"Show me what each project type enables BEFORE I choose. Better yet, let me change it later. And pre-populate with sample data."},
    ],
    summary:"PM experienced severe expectation mismatch between sales demo and actual product. Irreversible project type selection led to forced restart. Wants transparent implications and ability to change configurations post-creation.",
  },
  { id:5, participant:{name:"James L.",role:"Freelance Consultant",tenure:"Trial user"}, duration:"5 min",
    messages:[
      {role:"ai",text:"Tell me about your first experience with the product. What were you trying to accomplish?"},
      {role:"user",text:"I manage projects for multiple clients and wanted to see if this could replace my current tool. I need separate workspaces for each client."},
      {role:"ai",text:"Were you able to set up that multi-client structure?"},
      {role:"user",text:"I couldn't tell if I should use 'workspaces' or 'projects' or 'teams' for client separation. The terminology was confusing."},
      {role:"ai",text:"How did you try to resolve that confusion?"},
      {role:"user",text:"I created one of each and tried to figure out differences by experimenting. Turns out workspaces are what I need but they're a paid feature on trial."},
      {role:"ai",text:"If you could change one thing about the getting-started experience, what would it be?"},
      {role:"user",text:"Clear glossary of terms. And show paid features greyed out with a label so I know what I'm evaluating. I almost gave up before realizing the product could do what I need."},
    ],
    summary:"Freelancer confused by overlapping terminology. Trial hides paid features rather than showcasing them, leading to premature negative evaluation. Wants clear terminology and transparent feature tiers.",
  },
];

const GENERATED_REPORT = {
  goal:"Understand why new users abandon the onboarding flow in the first week and identify the key friction points that prevent them from reaching their first successful project.",
  participantCount:5, avgDuration:"6.4 min",
  executive_summary:"New users face a consistent pattern of expectation mismatch and contextual blindness during onboarding. The product assumes all users are starting from scratch with a blank slate, when in reality users arrive with diverse contexts (joining teams, evaluating for purchase, migrating from competitors) that demand fundamentally different onboarding paths. The three most critical friction points are: (1) lack of guided setup for first-time use, (2) irreversible or hidden configuration decisions made before users understand their implications, and (3) help resources that don't match the user's actual situation.",
  findings:[
    { researchQuestion:"What expectations do new users bring to the product, and where does the experience fail to meet them?",
      answer:"Users universally expect a guided, goal-oriented start \u2014 templates, wizards, or sample data that shows them what's possible. Instead, they encounter blank canvases and abstract choices. The gap between sales/marketing promises and actual onboarding reality is especially damaging for evaluators.",
      themes:[
        {theme:"Expected templates or guided setup",count:4,total:5,quotes:["\"I expected templates. Show me a starting point and let me customize it.\"","\"Give me a guided setup wizard. Ask me what I'm trying to do.\""]},
        {theme:"Sales demo vs. reality mismatch",count:2,total:5,quotes:["\"Night and day. The demo had this beautiful, populated roadmap.\"","\"I almost gave up before realizing the product could actually do what I need.\""]},
      ]},
    { researchQuestion:"At what specific moments do users feel confused, frustrated, or lost during onboarding?",
      answer:"Frustration peaks at three moments: initial blank canvas (no guidance), failed attempts to complete core tasks (silent errors, hidden features), and configuration mistakes that can't be undone. Silent failures are particularly damaging.",
      themes:[
        {theme:"Silent failures with no error messaging",count:2,total:5,quotes:["\"The import tool kept failing silently. No error messages, just... nothing happened.\"","\"You can't change project types after creation. I had to delete everything.\""]},
        {theme:"Buried or hidden functionality",count:3,total:5,quotes:["\"A share button buried in a settings menu three levels deep.\"","\"It took me two weeks to find notification settings.\"","\"Workspaces are what I need but they're a paid feature on trial.\""]},
      ]},
    { researchQuestion:"What would 'success' in the first week look like from the user's perspective?",
      answer:"Users define first-week success as completing their primary goal with minimal friction: a working dashboard, a running sprint, or a populated roadmap they can show to stakeholders.",
      themes:[
        {theme:"Reaching first deliverable within days",count:4,total:5,quotes:["\"By end of week I have one real sprint running with my team.\"","\"I just needed to get up to speed and start picking up tasks.\""]},
        {theme:"Ability to demonstrate value to others",count:3,total:5,quotes:["\"Can show my VP a comparison.\"","\"I tried to share it with my team and couldn't figure out permissions.\""]},
      ]},
    { researchQuestion:"What external resources do users seek out, and what does that reveal about gaps in our onboarding?",
      answer:"Users turn to Google, YouTube, and community forums when in-app help fails them. The existing help content is outdated and only covers the 'new project creator' path.",
      themes:[
        {theme:"Help content assumes project creators only",count:2,total:5,quotes:["\"The Getting Started guide was about creating a NEW project, not joining an existing one.\"","\"I found a YouTube tutorial from 2 years ago. It was outdated.\""]},
        {theme:"Confusing terminology in docs",count:2,total:5,quotes:["\"The docs used 'workspaces,' 'projects,' and 'teams' interchangeably.\"","\"I couldn't tell which one I should use for client separation.\""]},
      ]},
  ],
  unexpected:[
    "Role-aware onboarding emerged as a strong need: team joiners, evaluators, and creators have fundamentally different first experiences, but the product treats them identically.",
    "Notification overload was cited as a secondary churn risk \u2014 users who survive initial setup may still disengage due to notification fatigue.",
    "Trial users who encounter paywalled features without clear labeling may form premature negative impressions of product capability.",
  ],
  furtherResearch:[
    "Quantify the drop-off rate at each identified friction point using analytics.",
    "Test whether a goal-oriented setup wizard measurably improves first-week retention.",
    "Investigate whether role-based onboarding paths (creator, joiner, evaluator) would be feasible to implement.",
  ],
};


const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300..700;1,9..40,300..700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: ${T.fontBody}; color: ${T.ink}; background: ${T.surface}; -webkit-font-smoothing: antialiased; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes dotBounce { 0%,80%,100% { transform:translateY(0); } 40% { transform:translateY(-4px); } }
  .fade-up { animation: fadeUp 0.4s ease-out forwards; }
  .fade-in { animation: fadeIn 0.3s ease-out forwards; }
  input:focus, textarea:focus { outline:none; border-color:${T.borderFocus} !important; box-shadow:0 0 0 3px ${T.primaryLight} !important; }
  textarea { resize: vertical; }
  .typing-dot { width:6px; height:6px; border-radius:50%; background:${T.inkMuted}; display:inline-block; margin:0 2px; }
  .typing-dot:nth-child(1) { animation: dotBounce 1s infinite 0s; }
  .typing-dot:nth-child(2) { animation: dotBounce 1s infinite 0.15s; }
  .typing-dot:nth-child(3) { animation: dotBounce 1s infinite 0.3s; }
  .chat-input { width:100%; min-height:44px; max-height:140px; padding:12px 16px; border:1px solid ${T.border}; border-radius:22px; font-size:14px; font-family:${T.fontBody}; color:${T.ink}; background:${T.surface}; resize:none; overflow-y:auto; line-height:1.5; transition: border-color 0.15s, box-shadow 0.15s; }
  .chat-input:focus { outline:none; border-color:${T.borderFocus} !important; box-shadow:0 0 0 3px ${T.primaryLight} !important; }
  .collapsed-tier { padding:12px 16px; border-radius:10px; border:1px solid ${T.border}; background:${T.surfaceWarm}; cursor:pointer; transition:all 0.15s; }
  .collapsed-tier:hover { border-color: ${T.primaryMuted}; }
`;

// Shared components
const Nav = ({screen,setScreen,studyName}) => (
  <nav style={{background:T.surfaceCard,borderBottom:`1px solid ${T.border}`,padding:"0 32px",height:56,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
    <div style={{display:"flex",alignItems:"center",gap:24}}>
      <span style={{fontFamily:T.fontDisplay,fontSize:22,color:T.primary,fontStyle:"italic",cursor:"pointer"}} onClick={()=>setScreen("dashboard")}>InsightFlow</span>
      {studyName && <span style={{color:T.inkMuted,fontSize:14}}>/ {studyName}</span>}
    </div>
    {screen!=="dashboard" && screen!=="interview" && (
      <div style={{display:"flex",gap:4}}>
        {["setup","preview","monitor","report"].map(s=>(
          <button key={s} onClick={()=>setScreen(s)} style={{padding:"6px 14px",borderRadius:6,border:"none",background:screen===s?T.primaryLight:"transparent",color:screen===s?T.primary:T.inkLight,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:T.fontBody}}>{s.charAt(0).toUpperCase()+s.slice(1)}</button>
        ))}
      </div>
    )}
  </nav>
);

const Btn = ({children,variant="primary",size="md",onClick,disabled,style:xs}) => {
  const base = {fontFamily:T.fontBody,fontWeight:500,borderRadius:8,cursor:disabled?"not-allowed":"pointer",transition:"all 0.15s",border:"none",display:"inline-flex",alignItems:"center",gap:8,opacity:disabled?0.5:1};
  const sz = {sm:{padding:"6px 12px",fontSize:13},md:{padding:"10px 20px",fontSize:14},lg:{padding:"12px 24px",fontSize:15}};
  const vr = {primary:{background:T.primary,color:"#fff"},secondary:{background:T.surfaceWarm,color:T.ink,border:`1px solid ${T.border}`},ghost:{background:"transparent",color:T.primary}};
  return <button onClick={onClick} disabled={disabled} style={{...base,...sz[size],...vr[variant],...xs}}>{children}</button>;
};

const Card = ({children,style:xs,animate}) => (
  <div className={animate?"fade-up":""} style={{background:T.surfaceCard,border:`1px solid ${T.border}`,borderRadius:12,padding:24,...xs}}>{children}</div>
);

const SLabel = ({children}) => (<div style={{fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em",color:T.inkMuted,marginBottom:8}}>{children}</div>);

const TArea = ({value,onChange,placeholder,rows=3}) => (
  <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{width:"100%",padding:"12px 14px",border:`1px solid ${T.border}`,borderRadius:8,fontSize:14,fontFamily:T.fontBody,color:T.ink,lineHeight:1.6,background:T.surfaceCard,transition:"border-color 0.15s, box-shadow 0.15s"}} />
);

const Badge = ({children,color=T.primary,bg=T.primaryLight}) => (
  <span style={{display:"inline-flex",alignItems:"center",padding:"3px 10px",borderRadius:100,fontSize:12,fontWeight:500,color,background:bg}}>{children}</span>
);

const PBar = ({value,max}) => (
  <div style={{height:4,background:T.border,borderRadius:2,overflow:"hidden"}}>
    <div style={{height:"100%",width:`${(value/max)*100}%`,background:T.primary,borderRadius:2,transition:"width 0.5s ease"}} />
  </div>
);

// ============================================================
// DASHBOARD
// ============================================================
const DashboardScreen = ({setScreen,loadStudy}) => (
  <div style={{maxWidth:800,margin:"0 auto",padding:"48px 24px"}}>
    <div className="fade-up" style={{marginBottom:40}}>
      <h1 style={{fontFamily:T.fontDisplay,fontSize:36,fontWeight:400,marginBottom:8}}>Your Studies</h1>
      <p style={{color:T.inkLight,fontSize:15}}>Create and manage AI-moderated research interviews.</p>
    </div>
    <div className="fade-up" style={{animationDelay:"0.1s",marginBottom:24}}>
      <Btn size="lg" onClick={()=>{loadStudy();setScreen("setup");}}>+ New Study</Btn>
    </div>
    <div className="fade-up" style={{animationDelay:"0.2s"}}>
      <Card animate>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <SLabel>Completed Study</SLabel>
            <h3 style={{fontSize:18,fontWeight:600,marginBottom:6}}>Onboarding Friction Analysis</h3>
            <p style={{color:T.inkLight,fontSize:14,marginBottom:12}}>Understand why new users abandon the onboarding flow in the first week.</p>
            <div style={{display:"flex",gap:12}}><Badge color={T.success} bg={T.successLight}>✓ Complete</Badge><Badge>5 interviews</Badge><Badge>Avg 6.4 min</Badge></div>
          </div>
          <Btn variant="secondary" size="sm" onClick={(e)=>{e.stopPropagation();loadStudy();setScreen("report");}}>View Report →</Btn>
        </div>
      </Card>
    </div>
  </div>
);

// ============================================================
// SETUP - All 3 tiers visible, active one expanded
// ============================================================
const SetupScreen = ({study,setStudy,setScreen}) => {
  const [active,setActive] = useState(0);
  const upd = (f,v) => setStudy(s=>({...s,[f]:v}));
  const updI = (f,i,v) => setStudy(s=>{const l=[...s[f]];l[i]=v;return{...s,[f]:l};});
  const addI = (f) => setStudy(s=>({...s,[f]:[...s[f],""]}));
  const rmI = (f,i) => setStudy(s=>({...s,[f]:s[f].filter((_,j)=>j!==i)}));

  const canProceed = study.goal.length>10 && study.researchQuestions.filter(q=>q.length>5).length>=2 && study.questionFramework.filter(q=>q.length>5).length>=3;

  const CollapsedTier = ({num,title,content,isList}) => (
    <div className="collapsed-tier" onClick={()=>setActive(num-1)}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:content?6:0}}>
        <span style={{fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em",color:T.inkMuted}}>Tier {num} — {title}</span>
        <span style={{fontSize:12,color:T.primary,fontWeight:500}}>Edit ↗</span>
      </div>
      {!isList && content && <p style={{fontSize:13,color:T.inkLight,lineHeight:1.5,margin:0}}>{content.length>120?content.slice(0,120)+"…":content}</p>}
      {isList && content && content.filter(q=>q.length>5).length>0 && (
        <div style={{marginTop:2}}>
          {content.filter(q=>q.length>5).map((q,i)=>(
            <div key={i} style={{fontSize:12,color:T.inkLight,lineHeight:1.5,padding:"2px 0",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
              <span style={{color:T.inkMuted,marginRight:6}}>{num===2?`${i+1}.`:`Q${i+1}`}</span>{q}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const ListEditor = ({items,field,placeholders,badge,badgeColor,badgeBg,max}) => (
    <div>
      {items.map((q,i)=>(
        <div key={i} style={{display:"flex",gap:8,marginBottom:10,alignItems:"flex-start"}}>
          <span style={{minWidth:28,height:28,borderRadius:14,background:q?badgeBg:T.surfaceWarm,color:q?badgeColor:T.inkMuted,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600,marginTop:8}}>{badge(i)}</span>
          <TArea value={q} onChange={v=>updI(field,i,v)} placeholder={placeholders[i]||"Add another..."} rows={2} />
          {items.length>1 && <button onClick={()=>rmI(field,i)} style={{background:"none",border:"none",color:T.inkMuted,cursor:"pointer",fontSize:18,padding:"8px 4px",marginTop:4}}>×</button>}
        </div>
      ))}
      {items.length<max && <Btn variant="ghost" size="sm" onClick={()=>addI(field)}>+ Add question</Btn>}
    </div>
  );

  return (
    <div style={{maxWidth:720,margin:"0 auto",padding:"40px 24px"}}>
      <div className="fade-up" style={{marginBottom:28}}>
        <h1 style={{fontFamily:T.fontDisplay,fontSize:32,fontWeight:400,marginBottom:6}}>Study Setup</h1>
        <p style={{color:T.inkLight,fontSize:14}}>Define your research framework. Each tier informs the next — and guides the AI interviewer.</p>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {/* Tier 1 */}
        {active===0 ? (
          <Card animate>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
              <div>
                <div style={{fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em",color:T.primary,marginBottom:4}}>Tier 1 — Research Goal</div>
                <p style={{color:T.inkLight,fontSize:13}}>The overarching purpose of your study.</p>
              </div>
              <Badge>Active</Badge>
            </div>
            <p style={{color:T.inkMuted,fontSize:13,fontStyle:"italic",marginBottom:12}}>Complete this sentence: After this study, I want to understand...</p>
            <TArea value={study.goal} onChange={v=>upd("goal",v)} placeholder="...why new users abandon the onboarding flow in the first week and identify the key friction points." rows={3} />
            <div style={{marginTop:10,padding:"10px 14px",background:T.surfaceWarm,borderRadius:8,fontSize:12,color:T.inkLight,lineHeight:1.5}}>
              💡 A strong goal is specific enough to guide analysis but broad enough for unexpected discoveries.
            </div>
          </Card>
        ) : <CollapsedTier num={1} title="Research Goal" content={study.goal} />}

        {/* Tier 2 */}
        {active===1 ? (
          <Card animate>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
              <div>
                <div style={{fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em",color:T.primary,marginBottom:4}}>Tier 2 — Research Questions</div>
                <p style={{color:T.inkLight,fontSize:13}}>Specific questions that, if answered, will fulfill the research goal.</p>
              </div>
              <Badge>Active</Badge>
            </div>
            <ListEditor items={study.researchQuestions} field="researchQuestions" max={6}
              placeholders={["What expectations do new users bring, and where does the experience fail?","At what specific moments do users feel confused or frustrated?","What would 'success' in the first week look like?","What external resources do users seek out?"]}
              badge={i=>i+1} badgeColor={T.primary} badgeBg={T.primaryLight} />
          </Card>
        ) : <CollapsedTier num={2} title="Research Questions" content={study.researchQuestions} isList />}

        {/* Tier 3 */}
        {active===2 ? (
          <Card animate>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
              <div>
                <div style={{fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em",color:T.primary,marginBottom:4}}>Tier 3 — Question Framework</div>
                <p style={{color:T.inkLight,fontSize:13}}>The starter questions participants will see. Write in a conversational, open-ended tone.</p>
              </div>
              <Badge>Active</Badge>
            </div>
            <ListEditor items={study.questionFramework} field="questionFramework" max={8}
              placeholders={["Tell me about your first experience with the product. What were you trying to accomplish?","Walk me through a moment where you felt stuck or unsure what to do next.","How did you try to figure things out when you got stuck?","Describe what a successful first week would have looked like for you.","If you could change one thing about the getting-started experience, what would it be?"]}
              badge={i=>`Q${i+1}`} badgeColor={T.accent} badgeBg={T.accentLight} />
          </Card>
        ) : <CollapsedTier num={3} title="Question Framework" content={study.questionFramework} isList />}
      </div>

      <div style={{display:"flex",justifyContent:"space-between",marginTop:24}}>
        <Btn variant="secondary" onClick={()=>active>0?setActive(active-1):setScreen("dashboard")}>← {active>0?"Previous Tier":"Dashboard"}</Btn>
        {active<2 ? <Btn onClick={()=>setActive(active+1)}>Next Tier →</Btn> : <Btn onClick={()=>setScreen("preview")} disabled={!canProceed}>Preview Interview →</Btn>}
      </div>
    </div>
  );
};

// ============================================================
// INTERVIEW - auto-focus, multi-line input, more follow-ups
// ============================================================
const InterviewScreen = ({study,setScreen,isPreview=true}) => {
  const [messages,setMessages] = useState([]);
  const [input,setInput] = useState("");
  const [isTyping,setIsTyping] = useState(false);
  const [qIdx,setQIdx] = useState(0);
  const [isComplete,setIsComplete] = useState(false);
  const [fuCount,setFuCount] = useState(0);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const questions = study.questionFramework.filter(q=>q.length>5);
  const total = questions.length;

  useEffect(()=>{chatEndRef.current?.scrollIntoView({behavior:"smooth"});},[messages,isTyping]);

  // FIX #2: Auto-focus after every AI message
  useEffect(()=>{
    if(!isTyping && !isComplete && messages.length>0) {
      setTimeout(()=>inputRef.current?.focus(),150);
    }
  },[isTyping,isComplete,messages.length]);

  // Auto-grow textarea
  useEffect(()=>{
    if(inputRef.current){
      inputRef.current.style.height="44px";
      inputRef.current.style.height=Math.min(inputRef.current.scrollHeight,140)+"px";
    }
  },[input]);

  // Start interview
  useEffect(()=>{
    const t=setTimeout(()=>{
      setMessages([{role:"ai",text:"Thanks for participating! I'll be asking you a few questions about your experience. This should take about 5\u201310 minutes. Just respond naturally \u2014 there are no right or wrong answers."}]);
      setTimeout(()=>{setMessages(p=>[...p,{role:"ai",text:questions[0]}]);},1200);
    },600);
    return()=>clearTimeout(t);
  },[]);

  const send = useCallback(async()=>{
    if(!input.trim()||isTyping) return;
    const userMsg=input.trim();
    setInput("");
    setMessages(p=>[...p,{role:"user",text:userMsg}]);
    setIsTyping(true);

    try {
      const hist=[...messages,{role:"user",text:userMsg}]
        .filter(m=>!m.text.startsWith("Thanks for participating"))
        .map(m=>({role:m.role==="ai"?"assistant":"user",content:m.text}));

      const cur=qIdx;
      const remaining=total-cur-1;
      const words=userMsg.split(/\s+/).length;
      
      // FIX #3: More follow-ups - up to 3, biased toward probing
      const maxFU=3;
      const thorough=words>=40;
      const shouldMove = fuCount>=maxFU || (thorough && fuCount>=2) || (fuCount>=2 && words>=25 && Math.random()>0.6);

      let moveInstr;
      if(shouldMove && remaining>0){
        moveInstr=`You've explored this question enough. Briefly acknowledge, then TRANSITION to: "${questions[cur+1]}"`;
      } else if(shouldMove && remaining===0){
        moveInstr=`Final question done. Briefly acknowledge, then thank them warmly and close. Say something like "Thank you so much for sharing \u2014 this is really valuable."`;
      } else {
        moveInstr=`Ask ONE specific follow-up. Their response has something worth exploring deeper. Look for:
- Emotional signals ("frustrated", "confusing", "loved") \u2192 ask what caused that feeling
- Vague statements \u2192 ask for a concrete example or specific moment
- Consequences mentioned \u2192 ask about the impact or what happened next
- Workarounds described \u2192 ask why they chose that approach
- Important claims without context \u2192 ask what led to that or why it mattered
Be genuinely curious. Dig into the MOST interesting or revealing part of what they said.`;
      }

      const sys=`You are an expert AI research interviewer. Warm, curious, skilled at drawing out rich stories.

RESEARCH GOAL: ${study.goal}

RESEARCH QUESTIONS:
${study.researchQuestions.filter(q=>q.length>5).map((q,i)=>`${i+1}. ${q}`).join("\n")}

QUESTION FRAMEWORK:
${questions.map((q,i)=>`Q${i+1}: ${q}`).join("\n")}

STATE: On Q${cur+1}/${total}. Follow-ups so far: ${fuCount}/${maxFU}. Remaining questions: ${remaining}.

TASK: ${moveInstr}

RULES:
- 1-2 sentences max. Be concise.
- Sound like a thoughtful human, not a chatbot.
- Never ask leading questions or suggest answers.
- No bullet points, numbered lists, or formal language.
- Briefly acknowledge what they said before your follow-up (don't parrot it back).`;

      const resp = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:sys,messages:hist}),
      });
      const data=await resp.json();
      const aiText=data.content?.map(c=>c.text||"").join("")||"Thank you for sharing that.";

      setIsTyping(false);
      setMessages(p=>[...p,{role:"ai",text:aiText}]);

      if(shouldMove){
        if(remaining===0) setIsComplete(true);
        else {setQIdx(p=>p+1);setFuCount(0);}
      } else setFuCount(p=>p+1);
    } catch(err){
      setIsTyping(false);
      const fb=fuCount<2
        ?"That's really interesting \u2014 can you tell me more about what specifically led to that?"
        :qIdx<total-1?`Thank you for sharing that. ${questions[qIdx+1]}`
        :"Thank you so much for sharing your experience \u2014 this has been really valuable.";
      setMessages(p=>[...p,{role:"ai",text:fb}]);
      if(fuCount>=2){
        if(qIdx>=total-1) setIsComplete(true);
        else {setQIdx(p=>p+1);setFuCount(0);}
      } else setFuCount(p=>p+1);
    }
  },[input,isTyping,messages,qIdx,fuCount,study,questions,total]);

  const onKey = e => { if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();} };

  return (
    <div style={{maxWidth:600,margin:"0 auto",height:"calc(100vh - 56px)",display:"flex",flexDirection:"column"}}>
      <div style={{padding:"16px 24px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>{isPreview && <Badge color={T.warning} bg={T.warningLight}>Preview Mode</Badge>}</div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:12,color:T.inkMuted}}>Question {Math.min(qIdx+1,total)} of {total}</span>
          <div style={{width:80}}><PBar value={qIdx+(fuCount>0?0.5:0)} max={total} /></div>
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"24px 24px 8px"}}>
        {messages.map((msg,i)=>(
          <div key={i} className="fade-up" style={{display:"flex",justifyContent:msg.role==="user"?"flex-end":"flex-start",marginBottom:16}}>
            <div style={{maxWidth:"80%",padding:"12px 16px",borderRadius:msg.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",background:msg.role==="user"?T.primary:T.surfaceWarm,color:msg.role==="user"?"#fff":T.ink,fontSize:14,lineHeight:1.6,whiteSpace:"pre-wrap"}}>{msg.text}</div>
          </div>
        ))}
        {isTyping && <div style={{display:"flex",marginBottom:16}}><div style={{padding:"14px 20px",borderRadius:"16px 16px 16px 4px",background:T.surfaceWarm}}><span className="typing-dot"/><span className="typing-dot"/><span className="typing-dot"/></div></div>}
        <div ref={chatEndRef}/>
      </div>

      {isComplete ? (
        <div className="fade-up" style={{padding:24,borderTop:`1px solid ${T.border}`,textAlign:"center"}}>
          <div style={{fontSize:24,marginBottom:8}}>✓</div>
          <p style={{fontSize:15,fontWeight:500,marginBottom:4}}>Interview Complete</p>
          <p style={{fontSize:13,color:T.inkMuted,marginBottom:16}}>{isPreview?"This is how participants will experience the interview.":"Thank you for participating!"}</p>
          {isPreview && <div style={{display:"flex",gap:8,justifyContent:"center"}}><Btn variant="secondary" onClick={()=>setScreen("setup")}>← Edit Setup</Btn><Btn onClick={()=>setScreen("monitor")}>View Monitor →</Btn></div>}
        </div>
      ) : (
        <div style={{padding:"16px 24px",borderTop:`1px solid ${T.border}`,background:T.surfaceCard}}>
          <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
            <textarea ref={inputRef} className="chat-input" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={onKey} placeholder="Type your response... (Enter to send, Shift+Enter for new line)" disabled={isTyping} rows={1} />
            <button onClick={send} disabled={!input.trim()||isTyping} style={{width:44,height:44,borderRadius:22,flexShrink:0,background:input.trim()&&!isTyping?T.primary:T.border,color:"#fff",border:"none",cursor:input.trim()&&!isTyping?"pointer":"default",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",transition:"background 0.15s"}}>↑</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// MONITOR
// ============================================================
const MonitorScreen = ({setScreen}) => {
  const [expId,setExpId] = useState(null);
  return (
    <div style={{maxWidth:800,margin:"0 auto",padding:"40px 24px"}}>
      <div className="fade-up" style={{marginBottom:32}}>
        <h1 style={{fontFamily:T.fontDisplay,fontSize:32,fontWeight:400,marginBottom:6}}>Study Monitor</h1>
        <p style={{color:T.inkLight,fontSize:14}}>Track interview progress and review individual sessions.</p>
      </div>
      <div className="fade-up" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:32,animationDelay:"0.1s"}}>
        {[{l:"Completed",v:"5",s:"of 5 target"},{l:"Avg Duration",v:"6.4m",s:"target: 5-10m"},{l:"Completion Rate",v:"100%",s:"0 abandoned"},{l:"Status",v:"Done",s:"ready for report"}].map((st,i)=>(
          <Card key={i}><div style={{fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em",color:T.inkMuted,marginBottom:6}}>{st.l}</div><div style={{fontSize:24,fontWeight:600,color:T.ink,marginBottom:2}}>{st.v}</div><div style={{fontSize:12,color:T.inkMuted}}>{st.s}</div></Card>
        ))}
      </div>
      <div className="fade-up" style={{animationDelay:"0.2s"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <h2 style={{fontSize:18,fontWeight:600}}>Interviews</h2>
          <Btn onClick={()=>setScreen("report")}>View Report →</Btn>
        </div>
        {SIMULATED_INTERVIEWS.map(iv=>(
          <Card key={iv.id} style={{marginBottom:8,cursor:"pointer"}}>
            <div onClick={()=>setExpId(expId===iv.id?null:iv.id)}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:36,height:36,borderRadius:18,background:T.primaryLight,color:T.primary,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:600}}>{iv.participant.name.charAt(0)}</div>
                  <div><div style={{fontSize:14,fontWeight:500}}>{iv.participant.name}</div><div style={{fontSize:12,color:T.inkMuted}}>{iv.participant.role} · {iv.participant.tenure}</div></div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <Badge color={T.success} bg={T.successLight}>✓ Complete</Badge>
                  <span style={{fontSize:12,color:T.inkMuted}}>{iv.duration}</span>
                  <span style={{color:T.inkMuted,fontSize:16,transform:expId===iv.id?"rotate(180deg)":"rotate(0)",transition:"transform 0.2s",display:"inline-block"}}>▾</span>
                </div>
              </div>
            </div>
            {expId===iv.id && (
              <div className="fade-in" style={{marginTop:16,paddingTop:16,borderTop:`1px solid ${T.border}`}}>
                <div style={{padding:"12px 16px",background:T.surfaceWarm,borderRadius:8,fontSize:13,color:T.inkLight,lineHeight:1.6,marginBottom:16}}>
                  <strong style={{color:T.ink}}>AI Summary:</strong> {iv.summary}
                </div>
                <div style={{maxHeight:300,overflowY:"auto"}}>
                  {iv.messages.map((msg,j)=>(
                    <div key={j} style={{display:"flex",gap:8,marginBottom:12,paddingLeft:msg.role==="user"?24:0}}>
                      <div style={{fontSize:10,fontWeight:600,textTransform:"uppercase",color:msg.role==="ai"?T.accent:T.inkMuted,minWidth:20,paddingTop:2}}>{msg.role==="ai"?"AI":"P"}</div>
                      <div style={{fontSize:13,lineHeight:1.6,color:T.inkLight}}>{msg.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// REPORT
// ============================================================
const ReportScreen = () => {
  const r = GENERATED_REPORT;
  return (
    <div style={{maxWidth:760,margin:"0 auto",padding:"40px 24px 80px"}}>
      <div className="fade-up" style={{marginBottom:40}}>
        <SLabel>Research Report</SLabel>
        <h1 style={{fontFamily:T.fontDisplay,fontSize:34,fontWeight:400,marginBottom:8,lineHeight:1.2}}>Onboarding Friction Analysis</h1>
        <div style={{display:"flex",gap:16,flexWrap:"wrap"}}><Badge>{r.participantCount} participants</Badge><Badge>Avg {r.avgDuration} per interview</Badge><Badge color={T.success} bg={T.successLight}>AI-synthesized</Badge></div>
      </div>

      <div className="fade-up" style={{animationDelay:"0.1s",marginBottom:32}}>
        <Card style={{borderLeft:`3px solid ${T.primary}`}}>
          <SLabel>Research Goal</SLabel>
          <p style={{fontSize:15,lineHeight:1.6,color:T.inkLight,fontStyle:"italic"}}>{r.goal}</p>
        </Card>
      </div>

      <div className="fade-up" style={{animationDelay:"0.15s",marginBottom:40}}>
        <h2 style={{fontFamily:T.fontDisplay,fontSize:24,fontWeight:400,marginBottom:12}}>Executive Summary</h2>
        <p style={{fontSize:15,lineHeight:1.7,color:T.inkLight}}>{r.executive_summary}</p>
      </div>

      <div className="fade-up" style={{animationDelay:"0.2s",marginBottom:40}}>
        <h2 style={{fontFamily:T.fontDisplay,fontSize:24,fontWeight:400,marginBottom:20}}>Findings by Research Question</h2>
        {r.findings.map((f,i)=>(
          <Card key={i} style={{marginBottom:16}} animate>
            <div style={{fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em",color:T.primary,marginBottom:8}}>Research Question {i+1}</div>
            <h3 style={{fontSize:15,fontWeight:500,marginBottom:12,lineHeight:1.4}}>{f.researchQuestion}</h3>
            <p style={{fontSize:14,lineHeight:1.7,color:T.inkLight,marginBottom:16,paddingBottom:16,borderBottom:`1px solid ${T.border}`}}>{f.answer}</p>
            {f.themes.map((th,j)=>(
              <div key={j} style={{marginBottom:j<f.themes.length-1?16:0}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <span style={{fontSize:14,fontWeight:500}}>{th.theme}</span>
                  <Badge>{th.count} of {th.total} participants</Badge>
                </div>
                <div style={{width:`${(th.count/th.total)*100}%`,minWidth:40,height:3,background:T.primaryMuted,borderRadius:2,marginBottom:8}} />
                {th.quotes.map((q,k)=>(
                  <div key={k} style={{padding:"8px 12px",background:T.surfaceWarm,borderRadius:6,borderLeft:`2px solid ${T.primaryMuted}`,fontSize:13,lineHeight:1.5,color:T.inkLight,fontStyle:"italic",marginBottom:6}}>{q}</div>
                ))}
              </div>
            ))}
          </Card>
        ))}
      </div>

      <div className="fade-up" style={{marginBottom:40}}>
        <h2 style={{fontFamily:T.fontDisplay,fontSize:24,fontWeight:400,marginBottom:12}}>Unexpected Insights</h2>
        <Card style={{borderLeft:`3px solid ${T.warning}`}}>
          {r.unexpected.map((ins,i)=>(
            <div key={i} style={{padding:"10px 0",borderBottom:i<r.unexpected.length-1?`1px solid ${T.border}`:"none",fontSize:14,lineHeight:1.6,color:T.inkLight,display:"flex",gap:10}}>
              <span style={{color:T.warning,fontWeight:600,flexShrink:0}}>→</span>{ins}
            </div>
          ))}
        </Card>
      </div>

      <div className="fade-up" style={{marginBottom:40}}>
        <h2 style={{fontFamily:T.fontDisplay,fontSize:24,fontWeight:400,marginBottom:12}}>Areas for Further Research</h2>
        <Card>
          {r.furtherResearch.map((item,i)=>(
            <div key={i} style={{padding:"10px 0",borderBottom:i<r.furtherResearch.length-1?`1px solid ${T.border}`:"none",fontSize:14,lineHeight:1.6,color:T.inkLight,display:"flex",gap:10}}>
              <span style={{color:T.primary,fontWeight:600,flexShrink:0}}>{i+1}.</span>{item}
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [screen,setScreen] = useState("dashboard");
  const [study,setStudy] = useState({name:"Onboarding Friction Analysis",goal:"",researchQuestions:["","","",""],questionFramework:["","","","",""]});

  const loadStudy = () => setStudy({
    name:"Onboarding Friction Analysis",
    goal:"Understand why new users abandon the onboarding flow in the first week and identify the key friction points that prevent them from reaching their first successful project.",
    researchQuestions:["What expectations do new users bring to the product, and where does the experience fail to meet them?","At what specific moments do users feel confused, frustrated, or lost during onboarding?","What would 'success' in the first week look like from the user's perspective?","What external resources (if any) do users seek out, and what does that reveal about gaps in our onboarding?"],
    questionFramework:["Tell me about your first experience with the product. What were you trying to accomplish?","Walk me through a moment where you felt stuck or unsure what to do next.","How did you try to figure things out when you got stuck?","Describe what a successful first week with the product would have looked like for you.","If you could change one thing about the getting-started experience, what would it be?"],
  });

  return (
    <div style={{minHeight:"100vh",background:T.surface}}>
      <style>{styles}</style>
      <Nav screen={screen} setScreen={setScreen} studyName={screen!=="dashboard"?study.name:null} />
      {screen==="dashboard" && <DashboardScreen setScreen={setScreen} loadStudy={loadStudy} />}
      {screen==="setup" && <SetupScreen study={study} setStudy={setStudy} setScreen={setScreen} />}
      {screen==="preview" && <InterviewScreen study={study} setScreen={setScreen} isPreview />}
      {screen==="monitor" && <MonitorScreen setScreen={setScreen} />}
      {screen==="report" && <ReportScreen />}
    </div>
  );
}
