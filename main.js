const state={data:{},page:"home"};

const fallbackData={
  churchName:"Church Hub",
  verse:"Welcome to Church Hub",
  reference:"Configure your Google Sheet to load church content.",
  announcements:[],
  events:[],
  sermons:[],
  liveUrl:"",
  contact:{}
};

document.addEventListener("DOMContentLoaded",()=>{
  document.querySelectorAll(".nav-item").forEach(btn=>{
    btn.addEventListener("click",()=>showPage(btn.dataset.page));
  });
  document.getElementById("menuBtn").addEventListener("click",toggleMenu);
  document.getElementById("overlay").addEventListener("click",toggleMenu);
  updateClock();
  setInterval(updateClock,1000);
  loadData();
  setInterval(loadData,REFRESH_MINUTES*60*1000);
});

function toggleMenu(){
  document.getElementById("sidebar").classList.toggle("open");
  document.getElementById("overlay").classList.toggle("open");
}

function updateClock(){
  const now=new Date();
  document.getElementById("time").textContent=now.toLocaleTimeString([], {hour:"numeric",minute:"2-digit",second:"2-digit"});
  document.getElementById("date").textContent=now.toLocaleDateString([], {weekday:"long",month:"long",day:"numeric",year:"numeric"});
}

async function loadData(){
  setStatus("Updating…");
  try{
    if(!GOOGLE_SHEET_API) throw new Error("No Google Sheet API configured");
    const response=await fetch(GOOGLE_SHEET_API,{cache:"no-store"});
    if(!response.ok) throw new Error("Request failed");
    state.data=normalize(await response.json());
    setStatus("Updated");
  }catch(e){
    state.data=normalize(fallbackData);
    setStatus(GOOGLE_SHEET_API ? "Using offline data" : "Add Google Sheet URL");
  }
  document.getElementById("churchName").textContent=state.data.churchName;
  render();
}

function normalize(d){
  return {
    churchName:d.churchName||"Church Hub",
    verse:d.verse||"Welcome to Church Hub",
    reference:d.reference||"",
    announcements:Array.isArray(d.announcements)?d.announcements:[],
    events:Array.isArray(d.events)?d.events:[],
    sermons:Array.isArray(d.sermons)?d.sermons:[],
    liveUrl:d.liveUrl||"",
    contact:d.contact||{}
  };
}

function showPage(page){
  state.page=page;
  document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
  render();
  if(innerWidth<=760) toggleMenu();
}

function render(){
  const d=state.data;
  const pages={
    home:renderHome,
    events:()=>renderCards("Events",d.events,"event"),
    announcements:()=>renderCards("Announcements",d.announcements,"announcement"),
    live:()=>renderLive(d.liveUrl),
    sermons:()=>renderCards("Sermons",d.sermons,"sermon"),
    contact:()=>renderContact(d.contact)
  };
  document.getElementById("content").innerHTML=pages[state.page]();
}

function renderHome(){
  return `<section class="hero">
    <h1>${esc(state.data.churchName)}</h1>
    <div class="verse">“${esc(state.data.verse)}”</div>
    <div class="reference">${esc(state.data.reference)}</div>
  </section>`;
}

function renderCards(title,items,type){
  if(!items.length) return `<h1 class="page-title">${title}</h1><div class="card"><p class="muted">Nothing has been posted yet.</p></div>`;
  return `<h1 class="page-title">${title}</h1><div class="grid">${items.map(x=>card(x,type)).join("")}</div>`;
}

function card(x,type){
  const title=x.title||x.name||"Untitled";
  const desc=x.description||x.details||"";
  const date=x.date||"";
  const link=x.url||x.link||"";
  return `<article class="card">
    <h3>${esc(title)}</h3>
    ${date?`<p class="muted">📅 ${esc(date)}</p>`:""}
    ${desc?`<p>${esc(desc)}</p>`:""}
    ${link?`<a class="btn" href="${safeUrl(link)}" target="_blank" rel="noopener">Open</a>`:""}
  </article>`;
}

function renderLive(url){
  if(!url) return `<h1 class="page-title">Watch Live</h1><div class="card"><p class="muted">No live stream is configured.</p></div>`;
  return `<h1 class="page-title">Watch Live</h1><div class="card">
    <div class="video"><iframe src="${safeUrl(url)}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>
    <a class="btn" href="${safeUrl(url)}" target="_blank" rel="noopener">Open Stream</a>
  </div>`;
}

function renderContact(c){
  return `<h1 class="page-title">Contact</h1><div class="card">
    ${c.name?`<h3>${esc(c.name)}</h3>`:""}
    ${c.address?`<p>📍 ${esc(c.address)}</p>`:""}
    ${c.phone?`<p>📞 ${esc(c.phone)}</p>`:""}
    ${c.email?`<p>✉️ ${esc(c.email)}</p>`:""}
    ${c.website?`<p><a class="btn" href="${safeUrl(c.website)}" target="_blank" rel="noopener">Website</a></p>`:""}
  </div>`;
}

function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function safeUrl(v){try{const u=new URL(v,location.href);return ["http:","https:"].includes(u.protocol)?u.href:"#"}catch{return "#"}}
function setStatus(t){document.getElementById("status").textContent=t;}
