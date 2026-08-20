(() => {
"use strict";

const TEMPLATES = {
  blank:{name:"Blank App",desc:"Clean HTML, CSS and JavaScript files.",icon:"{ }",files:{
    "index.html":`<!doctype html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>My Mini App</title><link rel="stylesheet" href="style.css"></head>
<body><main class="app"><h1>Hello, Mini App</h1><p>Edit the files and press Run.</p><button id="hello">Try it</button></main><script src="script.js"><\/script></body>
</html>`,
    "style.css":`*{box-sizing:border-box}body{margin:0;font-family:system-ui;background:#f4f6fb;color:#18202a}.app{max-width:600px;margin:12vh auto;padding:32px;text-align:center;background:white;border:1px solid #dde3ec;border-radius:16px;box-shadow:0 12px 40px #17203314}button{padding:10px 16px;border:0;border-radius:8px;background:#3157d5;color:white;cursor:pointer}`,
    "script.js":`document.querySelector("#hello").addEventListener("click",()=>alert("It works!"));`
  }},
  calculator:{name:"Calculator",desc:"A working four-function calculator.",icon:"01",files:{
    "index.html":`<!doctype html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Calculator</title><link rel="stylesheet" href="style.css"></head><body><main class="calc"><div id="display">0</div><div class="keys">${["C","⌫","÷","×","7","8","9","−","4","5","6","+","1","2","3","=","0","."].map(k=>`<button data-key="${k}">${k}</button>`).join("")}</div></main><script src="script.js"><\/script></body></html>`,
    "style.css":`*{box-sizing:border-box}body{margin:0;background:#111827;font-family:system-ui;display:grid;place-items:center;min-height:100vh}.calc{width:min(360px,92vw);padding:18px;background:#1f2937;border-radius:18px}.calc #display{height:80px;background:#0b1220;color:#fff;border-radius:12px;margin-bottom:12px;padding:20px;text-align:right;font:34px monospace;overflow:hidden}.keys{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.keys button{height:58px;border:0;border-radius:10px;background:#374151;color:#fff;font-size:18px}.keys button:last-of-type{grid-column:span 2;background:#3157d5}`,
    "script.js":`let value="",stored=null,op=null;const d=document.querySelector("#display");function render(){d.textContent=value||"0"}function calc(a,b,o){a=Number(a);b=Number(b);return o==="+"?a+b:o==="−"?a-b:o==="×"?a*b:o==="÷"?(b? a/b:"Error"):b}document.querySelector(".keys").onclick=e=>{const k=e.target.dataset.key;if(!k)return;if(/[0-9.]/.test(k)){value=value==="Error"?"":value+k;render();return}if(k==="C"){value="";stored=null;op=null;render();return}if(k==="⌫"){value=value.slice(0,-1);render();return}if(k==="="&&op){value=String(calc(stored,value,op));stored=null;op=null;render();return}if(["+","−","×","÷"].includes(k)){if(value){stored=value;value="";}op=k;render()}};`
  }},
  todo:{name:"To-Do App",desc:"Add, complete and delete tasks with local storage.",icon:"02",files:{
    "index.html":`<!doctype html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Todo</title><link rel="stylesheet" href="style.css"></head><body><main class="todo"><h1>Tasks</h1><form id="form"><input id="input" placeholder="What needs doing?" required><button>Add</button></form><ul id="list"></ul></main><script src="script.js"><\/script></body></html>`,
    "style.css":`*{box-sizing:border-box}body{margin:0;background:#f4f5f7;font-family:system-ui;color:#18202a}.todo{max-width:620px;margin:8vh auto;padding:28px;background:white;border:1px solid #ddd;border-radius:14px}.todo h1{margin-top:0}.todo form{display:flex;gap:8px}.todo input{flex:1;padding:11px;border:1px solid #ccd2dc;border-radius:8px}.todo button{border:0;background:#3157d5;color:#fff;border-radius:8px;padding:10px 15px}.todo ul{list-style:none;padding:0}.todo li{display:flex;gap:10px;align-items:center;border-bottom:1px solid #eee;padding:12px 0}.todo li.done span{text-decoration:line-through;color:#999}.todo li button{margin-left:auto;background:#eee;color:#333}`,
    "script.js":`const key="mini-studio-todos";let todos=JSON.parse(localStorage.getItem(key)||"[]");const list=document.querySelector("#list"),form=document.querySelector("#form"),input=document.querySelector("#input");function save(){localStorage.setItem(key,JSON.stringify(todos))}function render(){list.innerHTML="";todos.forEach((t,i)=>{const li=document.createElement("li");li.className=t.done?"done":"";li.innerHTML='<input type="checkbox" '+(t.done?"checked":"")+'><span></span><button>Delete</button>';li.querySelector("span").textContent=t.text;li.querySelector("input").onchange=()=>{t.done=!t.done;save();render()};li.querySelector("button").onclick=()=>{todos.splice(i,1);save();render()};list.append(li)})}form.onsubmit=e=>{e.preventDefault();todos.push({text:input.value.trim(),done:false});input.value="";save();render()};render();`
  }},
  notes:{name:"Notes",desc:"Write and delete browser-saved notes.",icon:"03",files:{
    "index.html":`<!doctype html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Notes</title><link rel="stylesheet" href="style.css"></head><body><main class="notes"><h1>Notes</h1><textarea id="note" placeholder="Write a note..."></textarea><div><button id="save">Save note</button><button id="clear">Clear</button></div><ul id="saved"></ul></main><script src="script.js"><\/script></body></html>`,
    "style.css":`*{box-sizing:border-box}body{margin:0;background:#fffaf0;font-family:system-ui;color:#332d24}.notes{max-width:700px;margin:7vh auto;padding:28px}.notes textarea{width:100%;height:190px;padding:15px;border:1px solid #ded5c5;border-radius:10px;resize:vertical}.notes button{margin:10px 8px 10px 0;padding:9px 14px;border:0;border-radius:8px;background:#8b5e34;color:white}.notes li{background:#fff;border:1px solid #e6dece;border-radius:9px;padding:12px;margin:8px 0;white-space:pre-wrap}`,
    "script.js":`const notesKey="mini-studio-notes";let notes=JSON.parse(localStorage.getItem(notesKey)||"[]");const note=document.querySelector("#note"),saved=document.querySelector("#saved");function render(){saved.innerHTML="";notes.forEach((n,i)=>{const li=document.createElement("li");li.textContent=n;li.title="Click to delete";li.onclick=()=>{notes.splice(i,1);localStorage.setItem(notesKey,JSON.stringify(notes));render()};saved.append(li)})}document.querySelector("#save").onclick=()=>{if(note.value.trim()){notes.unshift(note.value.trim());note.value="";localStorage.setItem(notesKey,JSON.stringify(notes));render()}};document.querySelector("#clear").onclick=()=>note.value="";render();`
  }},
  landing:{name:"Landing Page",desc:"Clean responsive starter landing page.",icon:"04",files:{
    "index.html":`<!doctype html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Product</title><link rel="stylesheet" href="style.css"></head><body><header><strong>North</strong><a href="#features">Features</a></header><main><section class="hero"><span>NEW PRODUCT</span><h1>Simple software for focused teams.</h1><p>A responsive landing page you can edit and ship.</p><a class="cta" href="#features">See features</a></section><section id="features" class="features"><article><b>Fast</b><p>Loads quickly and stays focused.</p></article><article><b>Clear</b><p>Simple interfaces people understand.</p></article><article><b>Useful</b><p>Designed around real tasks.</p></article></section></main></body></html>`,
    "style.css":`*{box-sizing:border-box}body{margin:0;font-family:system-ui;color:#17202a}header{height:64px;border-bottom:1px solid #e5e7eb;display:flex;align-items:center;justify-content:space-between;padding:0 7vw}header a{color:#667085}.hero{max-width:850px;margin:12vh auto;padding:0 24px}.hero span{color:#3157d5;font-size:12px;font-weight:700;letter-spacing:.08em}.hero h1{font-size:clamp(42px,7vw,76px);line-height:1;letter-spacing:-.05em;margin:16px 0}.hero p{font-size:18px;color:#667085;max-width:580px}.cta{display:inline-block;background:#3157d5;color:#fff;text-decoration:none;padding:11px 16px;border-radius:8px;margin-top:12px}.features{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;max-width:900px;margin:0 auto;padding:40px 24px}.features article{border:1px solid #e5e7eb;padding:22px;border-radius:12px}.features p{color:#667085}@media(max-width:650px){.features{grid-template-columns:1fr}}`
  }},
  weather:{name:"Weather UI",desc:"A UI template with no fake weather data.",icon:"05",files:{
    "index.html":`<!doctype html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Weather UI</title><link rel="stylesheet" href="style.css"></head><body><main class="weather"><p class="label">WEATHER UI</p><h1>Check a location</h1><p class="muted">This is a front-end template. Connect your own weather API if you want live data.</p><div class="search"><input placeholder="City or postcode"><button>Search</button></div><section><strong>No live data</strong><span>Connect an API to show weather here.</span></section></main></body></html>`,
    "style.css":`*{box-sizing:border-box}body{margin:0;background:#edf4ff;font-family:system-ui;color:#16233a}.weather{max-width:650px;margin:10vh auto;padding:35px}.label{font-size:11px;color:#3157d5;font-weight:700;letter-spacing:.08em}.weather h1{font-size:46px;margin:10px 0}.muted{color:#68758a}.search{display:flex;gap:8px;margin:25px 0}.search input{flex:1;padding:12px;border:1px solid #cbd5e1;border-radius:9px}.search button{border:0;background:#3157d5;color:white;border-radius:9px;padding:0 18px}.weather section{background:white;border:1px solid #d8e0eb;border-radius:13px;padding:22px;display:flex;flex-direction:column;gap:5px}.weather section span{color:#68758a;font-size:13px}`
  }},
  counter:{name:"Counter",desc:"A tiny interactive counter.",icon:"06",files:{
    "index.html":`<!doctype html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Counter</title><link rel="stylesheet" href="style.css"></head><body><main><p>COUNT</p><div id="count">0</div><button id="minus">−</button><button id="plus">+</button></main><script src="script.js"><\/script></body></html>`,
    "style.css":`body{margin:0;min-height:100vh;display:grid;place-items:center;background:#111827;color:#fff;font-family:system-ui}main{text-align:center}main p{font-size:11px;letter-spacing:.12em;color:#94a3b8}#count{font-size:90px;font-weight:700;margin:10px 0 25px}button{width:58px;height:45px;border:0;border-radius:9px;margin:4px;background:#3157d5;color:#fff;font-size:24px}`,
    "script.js":`let n=0;const c=document.querySelector("#count");const render=()=>c.textContent=n;document.querySelector("#minus").onclick=()=>{n--;render()};document.querySelector("#plus").onclick=()=>{n++;render()};`
  }},
  quiz:{name:"Quiz",desc:"A functional three-question quiz.",icon:"07",files:{
    "index.html":`<!doctype html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Quiz</title><link rel="stylesheet" href="style.css"></head><body><main><div id="quiz"></div><button id="next">Next</button><p id="score"></p></main><script src="script.js"><\/script></body></html>`,
    "style.css":`body{margin:0;background:#f5f7fb;font-family:system-ui;color:#18202a}.quiz,main{max-width:650px;margin:10vh auto;padding:25px;background:#fff;border:1px solid #ddd;border-radius:14px}#quiz button{display:block;width:100%;text-align:left;margin:8px 0;padding:11px;border:1px solid #d6dbe4;background:#fff;border-radius:8px}#next{margin-top:15px;padding:10px 16px;border:0;border-radius:8px;background:#3157d5;color:#fff}`,
    "script.js":`const qs=[["Which language styles a page?",["HTML","CSS","SQL"],1],["Which runs behavior?",["JavaScript","CSS","SVG"],0],["What does DOM mean?",["Document Object Model","Data Output Mode","Digital Object Map"],0]];let i=0,score=0;const q=document.querySelector("#quiz"),s=document.querySelector("#score");function render(){const [text,answers]=qs[i];q.innerHTML="<h2>"+text+"</h2>";answers.forEach((a,n)=>{const b=document.createElement("button");b.textContent=a;b.onclick=()=>{if(n===qs[i][2])score++;document.querySelectorAll("#quiz button").forEach(x=>x.disabled=true);s.textContent="Score: "+score+"/"+(i+1)};q.append(b)});s.textContent="Question "+(i+1)+" of "+qs.length}document.querySelector("#next").onclick=()=>{if(i<qs.length-1){i++;render()}else{s.textContent="Finished — "+score+"/"+qs.length;document.querySelector("#next").disabled=true}};render();`
  }}
};

const STORAGE="mini-app-studio-project-v3";
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
let project=loadProject()||cloneTemplate("blank");
let activeFile=Object.keys(project.files)[0]||"index.html";
let lastSaved=JSON.stringify(project);
let previewTimer=null;

function cloneTemplate(id){const t=TEMPLATES[id]||TEMPLATES.blank;return {name:t.name,files:Object.fromEntries(Object.entries(t.files).map(([k,v])=>[k,v]))};}
function loadProject(){try{return JSON.parse(localStorage.getItem(STORAGE)||"null")}catch{return null}}
function saveProject(show=true){localStorage.setItem(STORAGE,JSON.stringify(project));lastSaved=JSON.stringify(project);setSaveState(true);if(show)toast("Saved");}
function setSaveState(saved){$("#saveState").textContent=saved?"Saved":"Unsaved changes";$("#saveState").classList.toggle("unsaved",!saved)}
function markDirty(){setSaveState(false);clearTimeout(previewTimer);previewTimer=setTimeout(saveProject,false)}
function toast(msg){const t=document.createElement("div");t.className="toast";t.textContent=msg;$("#toastStack").append(t);setTimeout(()=>t.remove(),2200)}
function openStudio(templateId){if(templateId){project=cloneTemplate(templateId);activeFile=Object.keys(project.files)[0];lastSaved=JSON.stringify(project);saveProject(false)}renderProject();$("#studio").classList.add("open");$("#studio").setAttribute("aria-hidden","false");runPreview()}
function closeStudio(){saveProject(false);$("#studio").classList.remove("open");$("#studio").setAttribute("aria-hidden","true")}
$$("[data-create]").forEach(b=>b.addEventListener("click",()=>openTemplateModal()));
$("#closeStudio").onclick=closeStudio;

function openTemplateModal(){$("#templateModal").hidden=false;renderTemplateCards($("#modalTemplateGrid"))}
function closeTemplateModal(){$("#templateModal").hidden=true}
$$("[data-close-modal]").forEach(b=>b.onclick=closeTemplateModal);

function renderTemplateCards(container){container.innerHTML=Object.entries(TEMPLATES).map(([id,t])=>`<article class="template-card"><div class="template-icon">${t.icon}</div><h3>${escapeHtml(t.name)}</h3><p>${escapeHtml(t.desc)}</p><button data-template="${id}">Use template →</button></article>`).join("");container.querySelectorAll("[data-template]").forEach(b=>b.onclick=()=>{closeTemplateModal();openStudio(b.dataset.template)})}
renderTemplateCards($("#templateGrid"));

function renderProject(){$("#projectName").textContent=project.name||"Untitled App";renderFiles();$("#activeFile").textContent=activeFile;$("#codeEditor").value=project.files[activeFile]??"";updateLines();updateLanguage();setSaveState(JSON.stringify(project)===lastSaved)}
function renderFiles(){$("#fileList").innerHTML=Object.keys(project.files).map(f=>`<div class="file-item ${f===activeFile?"active":""}" data-file="${escapeAttr(f)}"><span>${fileIcon(f)}</span>${escapeHtml(f)}</div>`).join("");$$(".file-item").forEach(el=>el.onclick=()=>switchFile(el.dataset.file))}
function switchFile(name){if(!(name in project.files))return;project.files[activeFile]=$("#codeEditor").value;activeFile=name;renderProject()}
function fileIcon(f){return f.endsWith(".html")?"◇":f.endsWith(".css")?"#":f.endsWith(".js")?"JS":"•"}
function updateLines(){const n=$("#codeEditor").value.split("\n").length;$("#lineNumbers").textContent=Array.from({length:n},(_,i)=>i+1).join("\n")}
function updateLanguage(){$("#languageLabel").textContent=activeFile.endsWith(".html")?"HTML":activeFile.endsWith(".css")?"CSS":activeFile.endsWith(".js")?"JavaScript":"Text"}
$("#codeEditor").addEventListener("input",()=>{project.files[activeFile]=$("#codeEditor").value;updateLines();markDirty()});
$("#codeEditor").addEventListener("scroll",()=>{$("#lineNumbers").scrollTop=$("#codeEditor").scrollTop});
$("#codeEditor").addEventListener("keydown",e=>{
  const mod=e.ctrlKey||e.metaKey;
  if(mod&&e.key.toLowerCase()==="s"){e.preventDefault();project.files[activeFile]=e.target.value;saveProject()}
  if(mod&&e.key==="Enter"){e.preventDefault();runPreview()}
  if(e.key==="Tab"){e.preventDefault();const a=e.target.selectionStart,b=e.target.selectionEnd;e.target.setRangeText("  ",a,b,"end");project.files[activeFile]=e.target.value;updateLines();markDirty()}
});

function buildDocument(){
  let html=project.files["index.html"]||"<!doctype html><html><body></body></html>";
  const css=project.files["style.css"]||"";
  const js=project.files["script.js"]||"";
  if(!/<head[\s>]/i.test(html))html=`<!doctype html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>${html}</body></html>`;
  if(css && !/style\.css/i.test(html) && !/<style[\s>]/i.test(html))html=html.replace(/<\/head>/i,`<style>${css.replace(/<\/style/gi,"<\\/style")}</style></head>`);
  if(js && !/script\.js/i.test(html) && !/<script[\s>]/i.test(html))html=html.replace(/<\/body>/i,`<script>${js.replace(/<\/script/gi,"<\\/script")}</script></body>`);
  return html;
}
function runPreview(){
  project.files[activeFile]=$("#codeEditor").value;
  const frame=$("#previewFrame");
  $("#previewStatus").textContent="Running…";clearConsole();
  const bridge=`<script>
  window.addEventListener("error",e=>parent.postMessage({type:"studio-error",message:e.message,line:e.lineno||""},"*"));
  window.addEventListener("unhandledrejection",e=>parent.postMessage({type:"studio-error",message:String(e.reason)},"*"));
  const oldLog=console.log;console.log=(...a)=>{parent.postMessage({type:"studio-log",message:a.map(x=>typeof x==="object"?JSON.stringify(x):String(x)).join(" ")},"*");oldLog(...a)};
  </script>`;
  let doc=buildDocument();
  doc=doc.replace(/<head([^>]*)>/i,`<head$1>${bridge}`);
  frame.srcdoc=doc;
  frame.onload=()=>{$("#previewStatus").textContent="Live"};
}
$("#runBtn").onclick=runPreview;$("#refreshPreview").onclick=runPreview;
window.addEventListener("message",e=>{if(e.source!==$("#previewFrame").contentWindow)return;if(e.data.type==="studio-error")consoleLine("Error: "+e.data.message,"error");if(e.data.type==="studio-log")consoleLine(e.data.message,"log")});
function consoleLine(msg,type="log"){const el=document.createElement("div");el.className="console-line "+type;el.textContent=msg;$("#consoleOutput").append(el)}
function clearConsole(){$("#consoleOutput").innerHTML='<span class="muted">Preview console is ready.</span>'}
$("#clearConsole").onclick=clearConsole;

$$(".device").forEach(b=>b.onclick=()=>{$$(".device").forEach(x=>x.classList.remove("active"));b.classList.add("active");$("#deviceFrame").className="device-frame "+b.dataset.device});
$$("[data-mobile-tab]").forEach(b=>b.onclick=()=>{$$("[data-mobile-tab]").forEach(x=>x.classList.remove("active"));b.classList.add("active");$("#studio").querySelector(".studio-main").classList.toggle("show-preview",b.dataset.mobileTab==="preview")});

$("#copyBtn").onclick=async()=>{try{await navigator.clipboard.writeText($("#codeEditor").value);toast("Copied!")}catch{toast("Clipboard is unavailable")}};
$("#searchBtn").onclick=()=>{$("#searchBar").hidden=!$("#searchBar").hidden;if(!$("#searchBar").hidden)$("#searchInput").focus()};
$("#closeSearch").onclick=()=>$("#searchBar").hidden=true;
$("#searchInput").addEventListener("input",e=>{const q=e.target.value;if(!q){$("#searchCount").textContent="";return}const re=new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"gi");$("#searchCount").textContent=((project.files[activeFile].match(re)||[]).length)+" matches"});

$("#saveBtn").onclick=()=>{project.files[activeFile]=$("#codeEditor").value;saveProject()};
$("#newFileBtn").onclick=()=>openFileModal("New file","Create");
$("#renameFileBtn").onclick=()=>openFileModal("Rename file","Rename",activeFile);
$("#deleteFileBtn").onclick=()=>{if(Object.keys(project.files).length<=1){toast("Keep at least one file");return}if(confirm(`Delete ${activeFile}?`)){delete project.files[activeFile];activeFile=Object.keys(project.files)[0];renderProject();markDirty();toast("File deleted")}};
function openFileModal(title,action,current=""){ $("#fileModalTitle").textContent=title;$("#confirmFileBtn").textContent=action;$("#fileNameInput").value=current;$("#fileModal").hidden=false;$("#fileNameInput").focus();$("#confirmFileBtn").dataset.action=action}
function closeFileModal(){$("#fileModal").hidden=true}
$$("[data-close-file-modal]").forEach(b=>b.onclick=closeFileModal);
$("#confirmFileBtn").onclick=()=>{const name=$("#fileNameInput").value.trim();const action=$("#confirmFileBtn").dataset.action;if(!/^[\w .-]+\.(html|css|js)$/i.test(name)){toast("Use an .html, .css or .js filename");return}if(action==="Create"){if(project.files[name]){toast("File already exists");return}project.files[name]="";activeFile=name}else{if(name!==activeFile&&project.files[name]){toast("File already exists");return}const content=project.files[activeFile];delete project.files[activeFile];project.files[name]=content;activeFile=name}closeFileModal();renderProject();markDirty()};

$("#downloadBtn").onclick=async()=>{
  project.files[activeFile]=$("#codeEditor").value;saveProject(false);
  if(typeof JSZip==="undefined"){toast("ZIP library unavailable");return}
  const zip=new JSZip();Object.entries(project.files).forEach(([name,content])=>zip.file(name,content));
  const blob=await zip.generateAsync({type:"blob"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=(project.name||"my-app").toLowerCase().replace(/[^a-z0-9]+/g,"-")+".zip";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);toast("ZIP downloaded");
};
$("#importBtn").onclick=()=>$("#importInput").click();
$("#importInput").onchange=async e=>{const file=e.target.files[0];if(!file)return;if(typeof JSZip==="undefined"){toast("ZIP library unavailable");return}try{const zip=await JSZip.loadAsync(file);const files={};for(const name of Object.keys(zip.files)){if(zip.files[name].dir)continue;if(/\.(html?|css|js)$/i.test(name)){files[name.split("/").pop()]=await zip.files[name].async("string")}}if(!Object.keys(files).length)throw new Error("No HTML/CSS/JS files found");project={name:file.name.replace(/\.zip$/i,""),files};activeFile=Object.keys(files).find(x=>x.toLowerCase()==="index.html")||Object.keys(files)[0];lastSaved=JSON.stringify(project);saveProject(false);renderProject();runPreview();toast("Project imported")}catch(err){toast("Could not import that ZIP")}e.target.value=""};

$("#themeToggle").onclick=()=>{document.body.classList.toggle("dark");localStorage.setItem("mini-studio-theme",document.body.classList.contains("dark")?"dark":"light");$("#themeToggle").textContent=document.body.classList.contains("dark")?"☀":"☾"};
if(localStorage.getItem("mini-studio-theme")==="dark"){document.body.classList.add("dark");$("#themeToggle").textContent="☀"}
$("#menuBtn").onclick=()=>{const nav=$(".nav-links");nav.style.display=nav.style.display==="flex"?"":"flex";nav.style.position="absolute";nav.style.top="68px";nav.style.left="0";nav.style.right="0";nav.style.padding="14px 20px";nav.style.background="var(--bg)";nav.style.borderBottom="1px solid var(--line)"};
window.addEventListener("beforeunload",()=>{project.files[activeFile]=$("#codeEditor").value;saveProject(false)});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(!$("#templateModal").hidden)closeTemplateModal();else if(!$("#fileModal").hidden)closeFileModal();else if($("#studio").classList.contains("open"))closeStudio()}});
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function escapeAttr(s){return escapeHtml(s)}
renderProject();
})();