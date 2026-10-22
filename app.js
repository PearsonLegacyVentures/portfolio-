"use strict";
const DATA_URL="./data/entries.json";
const SOURCE="https://raw.githubusercontent.com/PearsonLegacyVentures/club1600.org/main/assets/";
const FORM="https://github.com/PearsonLegacyVentures/portfolio-/issues/new?template=portfolio-entry.yml";
const MEDIA_FORM="https://github.com/PearsonLegacyVentures/portfolio-/issues/new?template=portfolio-media.yml";
const YEAR_MONTHS=[["2026-07","JUL","2026"],["2026-08","AUG","2026"],["2026-09","SEP","2026"],["2026-10","OCT","2026"],["2026-11","NOV","2026"],["2026-12","DEC","2026"],["2027-01","JAN","2027"],["2027-02","FEB","2027"],["2027-03","MAR","2027"],["2027-04","APR","2027"],["2027-05","MAY","2027"],["2027-06","JUN","2027"]];
const CHAPTERS=["2026-installation","2026-operations-and-reception","2026-dya-youth-leadership","2026-neil-percentie-jamboree","2026-new-member-orientation","2026-in-club-leadership-tour","2026-lab-photo-journal","2026-1600-degreez","2026-opm-meeting-logistics","2026-member-fellowship"];
const BUILDS=["2026-club1600-site","2026-membership-roll-deck","2026-saa-expense-tracking","2026-meeting-attire-standard","2026-d47-conference-trip","2026-saa-initiatives-roadmap"];
const STATUS={completed:"Completed",active:"In progress",planning:"In planning"};
const $=(id)=>document.getElementById(id);
const esc=(v)=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const safe=(v)=>{try{const u=new URL(String(v));return ["https:","http:"].includes(u.protocol)?u.href:"";}catch{return "";}};
const formatMonth=(m)=>{const a=YEAR_MONTHS.find(x=>x[0]===m);return a?`${a[1]} ${a[2]}`:"DATE TO CONFIRM";};
const friendlyDate=(e)=>e.dateLabel||(e.date?new Date(e.date+"T12:00:00Z").toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric",timeZone:"UTC"}):"Date to confirm");
const getMonth=(e)=>e.month||(e.date?e.date.slice(0,7):"undated");
const photo=(e)=>Array.isArray(e.images)?e.images.map(safe).find(Boolean)||"": "";
const photos=(e)=>Array.isArray(e.images)?e.images.map(safe).filter(Boolean):[];
const imageCaption=(e,src)=>e.imageCaptions?.[String(src).split("/").pop()]||"";
const videoLinks=(e)=>(e.videos||[]).map(v=>typeof v==="string"?{url:v,label:"Watch video"}:v).filter(v=>safe(v.url));
const normalize=(e)=>({...e,images:e.images||[],videos:e.videos||[],highlights:e.highlights||[],metrics:e.metrics||[],links:e.links||[],beforeAfter:e.beforeAfter||{}});
let entries=[], selectedMonth="2026-10";
const find=(id)=>entries.find(x=>x.id===id);
function bg(e,label="PHOTO ARCHIVE TO BE ADDED"){const src=photo(e);return src?`<img src="${esc(src)}" alt="${esc(e.title||label)}" loading="lazy">`:`<div class="placeholder-graphic" aria-hidden="true"><span>${esc((e.placeholderWord||"1600"))}</span></div>`;}
function statusBadge(e){return `<span class="status-pill ${esc(e.status)}">${esc(STATUS[e.status]||e.status||"Update pending")}</span>`;}
function renderChapters(){
  $("chapter-grid").innerHTML=CHAPTERS.map((id,n)=>{
    const e=find(id);if(!e)return "";
    return `<button type="button" class="chapter" data-entry="${esc(e.id)}" aria-label="View chapter: ${esc(e.title)}">
    ${bg(e)}<div class="chapter-shade"></div><span class="chapter-number">${String(n+1).padStart(2,"0")} / ${String(CHAPTERS.length).padStart(2,"0")}</span>
    <span class="chapter-label">${esc(e.chapterLabel||e.category)} · ${esc(friendlyDate(e))}</span>
    <h3>${esc(e.title)}</h3><p>${esc(e.summary)}</p>
    <span class="chapter-pill">${photos(e).length?`${photos(e).length} ${photos(e).length===1?"PHOTO":"PHOTOS"}`:"PHOTOS TO ADD"} ${videoLinks(e).length?"· VIDEO":""} ↗</span></button>`;
  }).join("");
}
function renderMonthRail(){
  $("month-rail").innerHTML=YEAR_MONTHS.map(([key,name,year])=>{
    const count=entries.filter(e=>getMonth(e)===key).length;
    return `<button type="button" class="month-btn ${selectedMonth===key?"selected":""}" data-month="${key}" aria-pressed="${selectedMonth===key}"><small>${name}</small><strong>${year.slice(-2)}</strong><em>${count?count+" "+(count===1?"ENTRY":"ENTRIES"):"OPEN"}</em></button>`;
  }).join("");
}
function monthPanel(e){return `<button type="button" class="month-story" data-entry="${esc(e.id)}"><small>${esc(e.chapterLabel||e.category)} · ${esc(friendlyDate(e))}</small><strong>${esc(e.title)}</strong><span>${esc(e.summary.slice(0,135))}${e.summary.length>135?"…":""}</span></button>`;}
function renderMonth(){
  renderMonthRail();
  const month=selectedMonth, m=YEAR_MONTHS.find(x=>x[0]===month);
  const set=entries.filter(e=>getMonth(e)===month).sort((a,b)=>(a.date||"").localeCompare(b.date||""));
  const title=m?`${m[1]}UST`.replace(/^([A-Z]+)UST$/,(whole)=>m[1]==="AUG"?"AUGUST":m[1]):"";
  const full=m?new Date(month+"-01T12:00:00Z").toLocaleDateString("en-US",{month:"long",year:"numeric",timeZone:"UTC"}):"Still to be dated";
  $("month-detail").innerHTML=`<div class="month-details-heading"><h3>${esc(full.toUpperCase())}</h3><p>${set.length?set.length+" documented "+(set.length===1?"story":"stories"):"Room for the next chapter"}</p></div>
    ${set.length?`<div class="month-story-list">${set.map(monthPanel).join("")}</div>`:`<div class="month-empty"><div><b>${month==="undated"?"THE STORIES ARE READY.":"THE MONTH IS READY."}</b>${month==="undated"?"Add an accurate date when you have it.":"Nothing recorded yet — future initiatives and galleries will appear here."}<br><a href="${FORM}" target="_blank" rel="noopener noreferrer">ADD A STORY ↗</a></div></div>`}`;
}
function renderRoom(){
  const e=find("2026-operations-and-reception");
  if(!e)return;
  const imgs=photos(e);
  const main=$("room-main");
  if(imgs[0])main.querySelector("img").src=imgs[0];
  const side=$("room").querySelector(".room-photo-secondary img");
  if(imgs[1])side.src=imgs[1];
}
function renderComparison(){
 const e=find("2026-opm-meeting-logistics");if(!e)return;
 const before=safe(e.beforeAfter?.before),after=safe(e.beforeAfter?.after);
 function side(which,url){return `<div class="compare-panel">${url?`<img src="${esc(url)}" alt="${which==="BEFORE"?"Room before preparation":"Room set for the meeting"}">`:`<div class="empty-photo"><div><b>+</b><br>ADD ${which} PHOTO<br><small>Actual room image goes here</small></div></div>`}<span class="compare-caption">${which}</span></div>`;}
 $("comparison-slot").innerHTML=`<div class="compare-frame"><div class="compare-heading"><strong>${esc(e.title)}</strong><span>${before&&after?"TWO VIEWS OF ONE ROOM":"BEFORE + AFTER PHOTO SLOTS READY"}</span></div><div class="compare-images">${side("BEFORE",before)}${side("AFTER",after)}</div><div class="compare-foot"><span>Office of the Prime Minister · Club 1600 meeting setup</span><button type="button" data-entry="${esc(e.id)}">OPEN THE FULL STORY ↗</button></div></div>`;
}
function renderLabs(){
 const seedMonths=YEAR_MONTHS.slice(0,4);
 const labMonths=new Set(entries.filter(x=>x.collection==="Labs").map(getMonth));
 const months=YEAR_MONTHS.filter(([key])=>key<="2026-10"||labMonths.has(key));
 $("lab-grid").innerHTML=months.map(([key,abbrev,year])=>{
   const labs=entries.filter(e=>e.collection==="Labs"&&getMonth(e)===key);
   const cover=labs.find(e=>photo(e));
   return `<button type="button" class="lab-card ${cover?"has-photo":""}" ${labs.length?`data-entry="${esc(labs[0].id)}"`:`data-new-lab="${key}"`}>
     ${cover?`<img src="${esc(photo(cover))}" alt="${esc(cover.title)}">`:`<div class="lab-image"><b>+</b>PHOTO COLLECTION</div>`}
     <div class="lab-info"><small>${esc(formatMonth(key))} / THE LAB</small><strong>${labs.length?esc(labs[0].title):"THIS MONTH'S LAB"}</strong><p>${labs.length?esc(labs[0].summary):"Space for photos, a session recap and standout moments."}</p></div></button>`;
 }).join("");
}
function renderBuilds(){
 $("build-grid").innerHTML=BUILDS.map(id=>{
  const e=find(id);if(!e)return "";
  const hasMedia=photos(e).length>0;
  return `<button type="button" class="build-card" data-entry="${esc(e.id)}"><small>${esc(friendlyDate(e))} · ${esc(e.category)}</small><h3>${esc(e.title)}</h3><p>${esc(e.summary)}</p><span>${hasMedia?"VIEW WORK + MEDIA":"OPEN BUILD LOG"} ↗</span></button>`;
 }).join("");
}
function filteredEntries(){
 const search=$("search").value.trim().toLowerCase(),status=$("status").value;
 return entries.filter(e=>(status==="all"||e.status===status)&&(!search||[e.title,e.category,e.summary,e.impact,e.role,e.collection||"",...e.highlights].join(" ").toLowerCase().includes(search))).sort((a,b)=>(b.date||"").localeCompare(a.date||"")||a.title.localeCompare(b.title));
}
function renderArchive(){
 const shown=filteredEntries();
 $("archive-count").textContent=`${shown.length} ${shown.length===1?"ENTRY":"ENTRIES"} · ${entries.length} IN THE RECORD`;
 $("empty-state").hidden=shown.length>0;
 $("archive-grid").innerHTML=shown.map(e=>{
   const img=photo(e);
   return `<button type="button" class="archive-card" data-entry="${esc(e.id)}"><div class="archive-visual ${e.category==="Member Fellowship"?"maroon":""}">${img?`<img src="${esc(img)}" alt="${esc(e.title)}" loading="lazy">`:""}<strong>${esc((e.cardHeadline||e.title).slice(0,65))}</strong></div>
   <div class="archive-content"><small>${esc(friendlyDate(e))} · ${esc(e.category)}</small><h3>${esc(e.title)}</h3><p>${esc(e.summary)}</p><div class="archive-status">${statusBadge(e)}<span>VIEW STORY ↗</span></div></div></button>`;
 }).join("");
}
function mediaElement(obj){
 const u=safe(obj.url);if(!u)return "";
 const label=esc(obj.label||"Event video");
 if(/\.(mp4|webm|ogg)(?:[?#]|$)/i.test(u)||u.includes("/mp4"))
   return `<div><video src="${esc(u)}" controls playsinline preload="metadata"></video><p>${label}</p></div>`;
 const parsed=new URL(u);
 let embed="";
 if(parsed.hostname==="youtu.be"||parsed.hostname.endsWith(".youtube.com")){const id=parsed.hostname==="youtu.be"?parsed.pathname.slice(1):parsed.searchParams.get("v");if(id&&/^[A-Za-z0-9_-]{11}$/.test(id))embed="https://www.youtube-nocookie.com/embed/"+id;}
 if(embed)return `<div><iframe src="${esc(embed)}" loading="lazy" title="${label}" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><p>${label}</p></div>`;
 return `<p><a href="${esc(u)}" target="_blank" rel="noopener noreferrer">WATCH: ${label} ↗</a></p>`;
}
function openEntry(id){
 const e=find(id);if(!e)return;
 const main=photo(e),imgs=photos(e),videos=videoLinks(e);
 const metrics=e.metrics.length?`<div class="dialog-metrics">${e.metrics.map(x=>`<div><b>${esc(x.value)}</b><span>${esc(x.label)}</span></div>`).join("")}</div>`:"";
 const high=e.highlights.length?`<h3>What was done</h3><ul>${e.highlights.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`:"";
 const gallery=imgs.length?`<h3>Photo record ${imgs.length===1?"":"("+imgs.length+")"}</h3><div class="dialog-photos">${imgs.map((src,i)=>`<figure><a href="${esc(src)}" target="_blank" rel="noopener noreferrer" aria-label="Open full-size photo ${i+1}"><img src="${esc(src)}" alt="${esc(imageCaption(e,src)||e.title+" photo "+(i+1))}" loading="lazy"></a><figcaption>${esc(imageCaption(e,src)||"IMAGE "+String(i+1).padStart(2,"0"))} · OPEN FULL SIZE ↗</figcaption></figure>`).join("")}</div>`:`<h3>Photo record</h3><p>Photo gallery awaiting original images. Add them through the entry form when ready.</p>`;
 const clips=videos.length?`<h3>Videos</h3><div class="dialog-videos">${videos.map(mediaElement).join("")}</div>`:"";
 const bef=safe(e.beforeAfter?.before),aft=safe(e.beforeAfter?.after);
 const compare=(bef||aft||e.type==="transformation")?`<h3>Before &amp; after</h3><div class="compare-images">${["Before","After"].map((label,i)=>`<div class="compare-panel">${[bef,aft][i]?`<img src="${esc([bef,aft][i])}" alt="${label}: ${esc(e.title)}">`:`<div class="empty-photo"><div>+<br>${label.toUpperCase()} IMAGE TO ADD</div></div>`}<span class="compare-caption">${label.toUpperCase()}</span></div>`).join("")}</div>`:"";
 const links=e.links.filter(x=>safe(x.url));
 const linksHTML=links.length?`<h3>Related links &amp; deliverables</h3><div class="dialog-link-grid">${links.map(x=>`<a href="${esc(safe(x.url))}" target="_blank" rel="noopener noreferrer">${esc(x.label||"View resource")} ↗</a>`).join("")}</div>`:"";
 $("dialog-body").innerHTML=`<div class="dialog-hero">${main?`<img src="${esc(main)}" alt="${esc(e.title)}">`:"THE RECORD."}</div><article class="dialog-story"><span class="dialog-tag">${esc(friendlyDate(e))} · ${esc(e.collection||e.category)} · ${esc(e.role||"Recorded")}</span><h2 id="dialog-title">${esc(e.title)}</h2><p class="summary">${esc(e.summary)}</p>${metrics}${high}<h3>Contribution &amp; outcome</h3><div class="dialog-impact">${esc(e.impact||"More details to add.")}</div>${compare}${gallery}${clips}${linksHTML}${e.credit?`<p class="dialog-credit">Recognition: ${esc(e.credit)}</p>`:""}<p><a class="dialog-edit" href="${MEDIA_FORM}" target="_blank" rel="noopener noreferrer">ADD PHOTOS &amp; VIDEOS ↗</a></p><p style="color:#6e7c84;font-size:12px">Entry ID to update: <code>${esc(e.id)}</code></p></article>`;
 $("entry-dialog").showModal();
}
function setup(){
 document.addEventListener("click",ev=>{
   const month=ev.target.closest("[data-month]");
   if(month){selectedMonth=month.dataset.month;renderMonth();if(month.closest(".roadmap-note"))$("month-detail").scrollIntoView({behavior:"smooth",block:"center"});return;}
   const story=ev.target.closest("[data-entry]");if(story){openEntry(story.dataset.entry);return;}
   const lab=ev.target.closest("[data-new-lab]");if(lab){window.open(FORM,"_blank","noopener");return;}
 });
 $("dialog-close").addEventListener("click",()=>$("entry-dialog").close());
 $("entry-dialog").addEventListener("click",ev=>{if(ev.target===$("entry-dialog"))$("entry-dialog").close();});
 $("search").addEventListener("input",renderArchive);
 $("status").addEventListener("change",renderArchive);
 $("clear-filters").addEventListener("click",()=>{$("search").value="";$("status").value="all";renderArchive();});
 $("print-page").addEventListener("click",()=>{window.location.href="./report.html";});
}
async function init(){
 setup();
 try{
   const response=await fetch(DATA_URL,{cache:"no-store"});if(!response.ok)throw Error("Unable to fetch entries");
   const payload=await response.json();if(!Array.isArray(payload))throw Error("Invalid entry format");
   entries=payload.filter(e=>e&&e.id&&e.title).map(normalize);
   renderChapters();renderMonth();renderRoom();renderComparison();renderLabs();renderBuilds();renderArchive();
 }catch(err){
   console.error(err);
   $("chapter-grid").innerHTML='<div class="empty-state">The entries could not be loaded. Check data/entries.json and reload.</div>';
   $("archive-count").textContent="Archive unavailable";
 }
}
init();
