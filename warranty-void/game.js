/* Warranty Void: browser interface and local save. */
(function WarrantyVoidApp() {
  "use strict";
  const E=WarrantyEngine;
  const SAVE_KEY="boredom-lab-warranty-void-v1";
  const emptySlot=(mode)=>({
    index:0,round:1,completed:0,def:null,job:null,phase:"work",
    selected:null,notes:[],suspects:[],logVersion:2,last:mode==="story"?"The repair division welcomes you.":"Awaiting the next questionable work order."
  });
  const fresh=()=>({
    version:1,active:null,story:emptySlot("story"),endless:emptySlot("endless"),
    choices:{},storyDone:false,sound:false
  });
  let data=fresh();
  const esc=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const modeTitle=m=>m==="story"?"Story Mode":"Endless Mode";
  const current=()=>data.active?data[data.active]:null;
  const job=()=>current()?.def;
  const part=()=>E.DEVICES[job()?.appliance]?.parts.find(p=>p.id===current()?.selected);
  const allPartsFixed=()=>current().job.repaired.length===job().faultIds.length;
  function load() {
    try{
      const raw=JSON.parse(localStorage.getItem(SAVE_KEY)||"null");
      if(raw && raw.version===1 && raw.story && raw.endless && raw.choices && (!raw.active||["story","endless"].includes(raw.active))) {
        data=raw;
        for(const m of ["story","endless"]){
          const s=data[m];
          if(s.def && (!E.validateCase(s.def) || !s.job)) data[m]=emptySlot(m);
          if(!Array.isArray(data[m].notes))data[m].notes=[];
          if(!data[m].logVersion){data[m].notes.reverse();data[m].logVersion=2;}
          if(!Array.isArray(data[m].suspects))data[m].suspects=[];
        }
      }
    }catch(_){data=fresh();}
  }
  function persist(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(data));}catch(_){}}
  function makeJob(mode) {
    const s=data[mode];
    const def=mode==="story"?E.STORY[s.index]:E.generateEndless(s.round);
    if(!def)return;
    s.def=def;s.job=E.startJob(def);s.phase="work";s.selected=null;s.suspects=[];
    s.logVersion=2;
    s.notes=[{kind:"info",message:"Work order received. Inspect the machine, run a diagnostic, then attempt a repair."}];
    s.last=`TICKET LOADED\n${def.complaint}\nSelect a component to begin.`;
  }
  function openMode(mode) {
    if(!["story","endless"].includes(mode))return;
    data.active=mode;
    if(mode==="story" && data.storyDone) data.story.phase="ending";
    else if(!data[mode].def) makeJob(mode);
    persist();render();
  }
  function mark(s,kind,message) {
    s.notes.push({kind,message});
    s.notes=s.notes.slice(-180);
  }
  let audioContext;
  function chirp(success=true){
    if(!data.sound)return;
    try{
      const AC=window.AudioContext||window.webkitAudioContext;
      if(!AC)return;
      if(!audioContext)audioContext=new AC();
      if(audioContext.state==="suspended")audioContext.resume();
      const osc=audioContext.createOscillator(),gain=audioContext.createGain();
      osc.type="triangle";osc.frequency.value=success?660:220;
      gain.gain.setValueAtTime(.055,audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+.15);
      osc.connect(gain);gain.connect(audioContext.destination);
      osc.start();osc.stop(audioContext.currentTime+.16);
    }catch(_){}
  }
  function diagnose(tool){
    const s=current();
    if(!s||s.phase!=="work"||!s.selected)return;
    const finding=E.readPart(s.def,s.job,s.selected,tool);
    if(!finding.ok)return;
    const field=tool==="inspect"?"inspected":"probed";
    if(!s.job[field].includes(s.selected))s.job[field].push(s.selected);
    if(finding.suspicious&&!s.suspects.includes(s.selected))s.suspects.push(s.selected);
    s.last=`${tool==="inspect"?"VISUAL INSPECTION":"DIAGNOSTIC PROBE"}\n${finding.message}`;
    mark(s,finding.suspicious?"warn":"info",finding.message);
    chirp(!finding.suspicious);persist();render();
  }
  function fix(action){
    const s=current();
    if(!s||s.phase!=="work"||!s.selected)return;
    const result=E.repair(s.def,s.job,s.selected,action);
    s.job=result.state;
    s.last=`${result.result.correct?"REPAIR ACCEPTED":"REPAIR INEFFECTIVE"}\n${result.result.message}`;
    mark(s,result.result.correct?"good":"warn",s.last);
    chirp(result.result.correct);persist();render();
  }
  function runTest(){
    const s=current();
    if(!s||s.phase!=="work")return;
    const test=E.testJob(s.def,s.job);s.job=test.state;
    s.last=test.message+(test.symptoms.length?"\n• "+test.symptoms.join("\n• "):"");
    mark(s,test.passed?"good":"warn",s.last);
    if(test.passed){
      s.phase="complete";
      if(data.active==="endless")s.completed+=1;
    }
    chirp(test.passed);persist();render();
  }
  function advance(){
    if(data.active==="story"){
      const s=data.story;
      if(s.index===E.STORY.length-1){
        data.storyDone=true;s.phase="ending";
      }else{
        s.index+=1;makeJob("story");
      }
    }else if(data.active==="endless"){
      const s=data.endless;s.round+=1;makeJob("endless");
    }
    persist();render();
  }
  function resetAll(){
    if(!window.confirm("Erase both modes, story decisions, and endless progress?"))return;
    data=fresh();persist();render();
  }
  function restartStory(){
    if(!window.confirm("Restart Story Mode from the first job? Endless progress will remain."))return;
    data.story=emptySlot("story");data.storyDone=false;data.choices={};openMode("story");
  }
  function restartEndless(){
    if(!window.confirm("Reset your Endless Mode run? Story progress will remain."))return;
    data.endless=emptySlot("endless");openMode("endless");
  }
  function renderHeader(){
    document.querySelector("#nav").innerHTML=
      `<span class="pill">LOCAL SAVE</span>
       ${data.active?`<button class="btn ghost tiny" data-action="menu">← Workshop menu</button>`:""}
       <button class="btn ghost tiny" data-action="sound" aria-label="Toggle game sound">Sound ${data.sound?"on":"off"}</button>`;
  }
  function renderMenu(){
    const storyProgress=data.storyDone?"Campaign complete":`${data.story.index}/${E.STORY.length} jobs finished`;
    const endlessProgress=`${data.endless.completed} jobs repaired`;
    return `<div class="menu">
      <div class="hero">
        <span class="eyebrow">Questionable Solutions Inc. / Employee Portal</span>
        <h1>Everything is broken.<br><span>Apparently it's your job.</span></h1>
        <p>Inspect suspicious appliances. Diagnose impossible problems. Repair first, ask questions later. The workshop pays in compliments of dubious sincerity.</p>
      </div>
      <div class="modes">
        <section class="panel mode-card" data-glyph="✎">
          <span class="eyebrow">01 / Handwritten trouble</span><h2>Story Mode</h2>
          <p>Six connected jobs, familiar faces, suspicious receipts, and four possible endings. Things start with a toaster and only become less reasonable.</p>
          <footer><span class="label">${esc(storyProgress)}</span>
          <button class="btn primary" data-action="story">${data.storyDone?"View ending":data.story.def?"Continue campaign":"Start campaign"} →</button></footer>
        </section>
        <section class="panel mode-card" data-glyph="∞">
          <span class="eyebrow">02 / Unending warranty</span><h2>Endless Mode</h2>
          <p>Keep the repair shop running. Jobs combine different faults, customers and appliances. No timer, no game over, and absolutely no refunds.</p>
          <footer><span class="label">${esc(endlessProgress)}</span>
          <button class="btn warm" data-action="endless">${data.endless.def?"Continue repairs":"Open workshop"} →</button></footer>
        </section>
      </div>
      <div class="menu-foot">
        <span>Saved automatically in this browser. Neither mode requires completing the other.</span>
        <div class="btn-row">
          ${data.storyDone?'<button class="btn ghost tiny" data-action="restart-story">Replay story</button>':""}
          ${data.endless.completed?'<button class="btn ghost tiny" data-action="restart-endless">Reset endless</button>':""}
          <button class="btn ghost tiny" data-action="reset-all">Clear all saves</button>
        </div>
      </div>
    </div>`;
  }
  function renderBench(s){
    const def=s.def,device=E.DEVICES[def.appliance];
    const fixedPartIds=new Set(s.job.repaired.map(id=>E.findFault(def.appliance,id).part));
    const nodes=device.parts.map((p,i)=>{
      const status=fixedPartIds.has(p.id)?"REPAIRED":s.suspects.includes(p.id)?"ANOMALY":s.job.probed.includes(p.id)?"SCANNED":s.job.inspected.includes(p.id)?"INSPECTED":"UNTESTED";
      const state=fixedPartIds.has(p.id)?"fixed":s.suspects.includes(p.id)?"suspect":"";
      const selected=s.selected===p.id;
      return `<button class="part-node ${state} ${selected?"active":""}" style="left:${p.x}%;top:${p.y}%"
        data-action="select" data-part="${esc(p.id)}" aria-pressed="${selected}" title="${esc(p.role)}">
        <span class="node-symbol" aria-hidden="true">${String(i+1).padStart(2,"0")}</span><span class="node-name">${esc(p.name)}</span>
        <span class="node-status"><i aria-hidden="true"></i>${esc(status)}</span></button>`;
    }).join("");
    const p=part();
    const selectedStatus=p?(fixedPartIds.has(p.id)?"REPAIRED":s.suspects.includes(p.id)?"ANOMALY DETECTED":s.job.probed.includes(p.id)?"PROBED":s.job.inspected.includes(p.id)?"INSPECTED":"UNTESTED"):"AWAITING SELECTION";
    return `<section class="panel">
      <div class="panel-head"><h2 class="panel-title">Disassembly bench</h2><span class="pill">UNIT ${esc(device.model.split(" / ")[0])}</span></div>
      <div class="bench" role="group" aria-label="Clickable appliance components">
        <div class="bench-surface" aria-hidden="true"><span class="bench-ruler">01 · DISASSEMBLY ZONE</span><span class="bench-no">QSI SERVICE / ${esc(device.model)}</span></div>
        <div class="device-art" aria-hidden="true">${WarrantyBenchArt.render(def.appliance)}</div>
        ${nodes}<span class="device-serial">SERVICE PANEL / 04 NODES</span>
      </div>
      <div class="bench-bottom">
        <div><strong>${esc(device.name)}</strong><div class="muted">${esc(device.description)}</div></div>
        <span class="pill">${s.job.repaired.length}/${def.faultIds.length} repairs complete</span>
      </div>
      <div class="selection" aria-live="polite">
        <div><div class="label">Active component</div>
          <strong>${p?esc(p.name):"Nothing selected"}</strong>
          <small>${p?esc(p.role):"Choose a labelled component on the machine to begin."}</small></div>
        <div class="selected-state ${selectedStatus==="REPAIRED"?"is-fixed":selectedStatus==="ANOMALY DETECTED"?"is-suspect":""}">
          <span class="label">Condition</span><strong>${esc(selectedStatus)}</strong></div>
      </div>
    </section>`;
  }
  function renderTools(s){
    const enabled=!!s.selected&&s.phase==="work";
    return `<section class="panel tools-panel">
      <div class="panel-head"><h2 class="panel-title">Repair kit</h2><span class="label">No license required</span></div>
      <div class="panel-body tools">
        <section><div class="label">01 / Investigation</div>
          <div class="tool-grid">
            <button class="btn" data-action="inspect" ${enabled?"":"disabled"}><span>VISUAL</span>⌕ Inspect</button>
            <button class="btn" data-action="probe" ${enabled?"":"disabled"}><span>SIGNAL</span>⌁ Probe</button>
          </div>
          <div class="muted" style="font-size:12px">Inspection catches visible faults. A probe catches hidden electronic nonsense.</div>
        </section>
        <section><div class="label">02 / Intervention</div>
          <div class="tool-grid">
          ${E.REPAIRS.map((r,i)=>`<button class="btn" data-action="fix" data-fix="${r.id}" ${enabled?"":"disabled"}><span>TOOL 0${i+1}</span>${esc(r.label)}</button>`).join("")}
          </div>
        </section>
        <section><div class="label">03 / Quality control</div>
          <button class="btn wide run-test" data-action="test">▶ RUN APPLIANCE TEST</button>
          <div class="muted" style="font-size:12px">No timer. No failing the run. A wrong fix costs efficiency, but you can always repair it properly.</div>
        </section>
        <details class="manual"><summary>▤ Technician's cheat sheet</summary>
          <p class="muted" style="font-size:12px">Compare what your probe reports with the repair guide. Diagnoses are consistent across every appliance.</p>
          <table><tbody>${E.REPAIRS.map(r=>`<tr><td>${esc(r.label.toUpperCase())}</td><td>${esc(r.hint)}</td></tr>`).join("")}</tbody></table>
        </details>
      </div>
    </section>`;
  }
  function renderTerminal(s){
    const entries=(s.notes||[]).map((entry,i)=>{
      const tone=entry.kind==="good"?"log-good":entry.kind==="warn"?"log-warn":"log-info";
      const label=entry.kind==="good"?"SUCCESS":entry.kind==="warn"?"ATTENTION":"INFO";
      return '<li class="log-entry '+tone+'"><div class="log-meta"><span>'+label+'</span><span>#'+String(i+1).padStart(3,"0")+'</span></div><div class="log-message">'+esc(entry.message)+'</div></li>';
    }).join("");
    return '<aside class="panel terminal-panel" aria-label="Service terminal history">' +
      '<div class="panel-head terminal-head"><div><div class="eyebrow">LIVE SERVICE FEED</div><h2 class="panel-title">Service terminal</h2></div>' +
      '<button class="btn ghost tiny terminal-toggle" data-action="toggle-log" aria-expanded="false" aria-label="Expand service log">Expand ↗</button></div>' +
      '<div class="terminal-screen"><div class="terminal-path">QSI://REPAIR-DIAGNOSTICS <span>● LIVE</span></div>' +
      '<ol id="terminal-feed" class="terminal-feed" aria-label="Diagnostic and repair history" tabindex="0">'+entries+'</ol>' +
      '<div class="terminal-foot"><span>'+s.notes.length+' ENTRIES</span><span>SCROLL TO REVIEW ↑↓</span></div></div></aside>';
  }
  function renderOrder(s){
    const def=s.def;
    return `<div class="stack">
      <section class="panel wanted">
        <div class="panel-head"><h2 class="panel-title">Official work order</h2><span class="label">${esc(def.chapter)}</span></div>
        <div class="sticky">PAID IN EXPOSURE</div>
        <div class="panel-body">
          <div><div class="label">Customer</div><h2>${esc(def.customer)}</h2></div>
          <div><div class="label">Reported fault</div><p class="quote">“${esc(def.complaint)}”</p></div>
          <div><div class="label">Dispatch memo</div><p>${esc(def.intro)}</p></div>
          <div class="paper-footer">AUTHORIZED SERVICE REQUEST // ${esc(def.id.toUpperCase())}</div>
        </div>
      </section>
      <div class="info-box"><strong>YOUR JOB</strong>Find the faulty component, inspect or probe it, choose a repair, and run the test to verify it. Sometimes there's more than one fault.</div>
    </div>`;
  }
  function resultOverlay(s){
    const def=s.def;
    const decisions=data.active==="story"?def.decision:null;
    const neat=s.job.mistakes===0?"Clean repair. Accounting is furious.":`${s.job.mistakes} unnecessary repair${s.job.mistakes===1?"":"s"}. The invoice is becoming literary.`;
    return `<div class="result-overlay" role="dialog" aria-modal="true" aria-labelledby="job-result">
      <section class="result-card">
        <span class="eyebrow">✓ Service approved / ${esc(def.chapter)}</span>
        <h2 id="job-result">It's alive.<br>Unfortunately.</h2>
        <p>${esc(def.outro)}</p>
        <div class="statbar"><span>${s.job.tests} test${s.job.tests===1?"":"s"}</span><span>${s.job.tries} repair attempt${s.job.tries===1?"":"s"}</span><span>${esc(neat)}</span></div>
        ${decisions?`<div class="label" style="margin:22px 0 12px">Your call</div><p>${esc(decisions.prompt)}</p>
          <div class="decision-grid">${decisions.options.map(o=>`<button class="decision-option" data-action="choose" data-value="${o.id}">
            <strong>${esc(o.title)}</strong><small>${esc(o.detail)}</small></button>`).join("")}</div>`:
          `<button class="btn primary wide" data-action="next">${data.active==="story"?"Next chapter":"Next work order"} →</button>`}
        <div style="margin-top:14px"><button class="btn ghost wide" data-action="menu">Back to menu (progress saved)</button></div>
      </section>
    </div>`;
  }
  function endingOverlay(){
    const ending=E.ending(data.choices);
    return `<div class="result-overlay" role="dialog" aria-modal="true" aria-labelledby="ending-title">
      <section class="result-card">
        <div class="ending-decor" aria-hidden="true">✺</div>
        <span class="eyebrow">Story mode / complete</span>
        <h2 id="ending-title">${esc(ending.title)}</h2>
        <p>${esc(ending.text)}</p>
        <p class="muted">You've completed all six chapters. Your decisions determined this ending. Endless Mode remains open, and you can replay the story to choose another outcome.</p>
        <div class="btn-row"><button class="btn primary" data-action="menu">Back to the workshop</button>
          <button class="btn ghost" data-action="restart-story">Replay story</button></div>
      </section>
    </div>`;
  }
  function renderGame(){
    const s=current();
    if(!s.def)makeJob(data.active);
    const def=s.def;
    const progress=data.active==="story"?`CHAPTER ${s.index+1}/${E.STORY.length}`:`JOB ${s.round} · ${s.completed} FINISHED`;
    return `<div class="game-top">
      <div><div class="eyebrow">${esc(modeTitle(data.active))} / ${esc(progress)}</div>
        <h1>${esc(def.chapter)} <span class="muted">· ${esc(E.DEVICES[def.appliance].name)}</span></h1></div>
      <span class="pill">${s.phase==="work"?"BENCH OPEN":"SERVICE COMPLETE"}</span>
      </div>
      <div class="game-grid">
        <div class="order-column">${renderOrder(s)}</div>
        <div class="workstation">${renderBench(s)}${renderTools(s)}</div>
        <div class="terminal-column">${renderTerminal(s)}</div>
      </div>
      ${s.phase==="complete"?resultOverlay(s):s.phase==="ending"?endingOverlay():""}`;
  }
  function render(){
    renderHeader();
    document.querySelector("#app").innerHTML=data.active?renderGame():renderMenu();
    const feed=document.querySelector("#terminal-feed");
    if(feed)feed.scrollTop=feed.scrollHeight;
  }
  document.addEventListener("click",event=>{
    const button=event.target.closest("[data-action]");
    if(!button)return;
    const action=button.dataset.action;
    if(action==="story"||action==="endless")openMode(action);
    else if(action==="menu"){data.active=null;persist();render();}
    else if(action==="sound"){data.sound=!data.sound;persist();render();if(data.sound)chirp();}
    else if(action==="toggle-log"){
      const panel=document.querySelector(".terminal-panel");
      if(panel){const expanded=panel.classList.toggle("log-expanded");button.setAttribute("aria-expanded",String(expanded));button.textContent=expanded?"Close ×":"Expand ↗";}
    }
    else if(action==="select"){
      const s=current();
      if(s&&s.phase==="work"){s.selected=button.dataset.part;s.last=`COMPONENT SELECTED\n${part()?.name||s.selected}\nChoose a diagnostic or repair tool.`;mark(s,"info","SELECTED: "+(part()?.name||s.selected));persist();render();}
    }
    else if(action==="inspect"||action==="probe")diagnose(action);
    else if(action==="fix")fix(button.dataset.fix);
    else if(action==="test")runTest();
    else if(action==="next")advance();
    else if(action==="choose"){
      const s=current(),d=s?.def?.decision;
      if(s?.phase!=="complete"||!d||!d.options.some(o=>o.id===button.dataset.value))return;
      data.choices[d.key]=button.dataset.value;advance();
    }
    else if(action==="reset-all")resetAll();
    else if(action==="restart-story")restartStory();
    else if(action==="restart-endless")restartEndless();
  });
  load();render();
})();
