"use strict";
const DATA_URL = "./data/entries.json";
const STATUS_LABEL = { completed:"Completed", active:"In motion", planning:"On the horizon" };
const CATEGORY_COLORS = {
  "Community Service":"graphic-maroon","Member Fellowship":"graphic-sand","Club Operations":"graphic-navy",
  "Events & Hospitality":"graphic-maroon","Brand & Digital":"graphic-navy",
  "Speaking & Training":"graphic-slate","Strategy & Planning":"graphic-sand"
};
let entries = [], currentCategory = "all";
const byId = (id) => document.getElementById(id);
const escapeHTML = (input) => String(input ?? "").replace(/[&<>"']/g,(c)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const safeUrl = (v) => { try { const u = new URL(String(v));return ["http:","https:"].includes(u.protocol)?u.href:""; }catch{return "";} };
const formatDate = (d) => {const date = new Date(d+"T12:00:00Z");return Number.isNaN(date.valueOf())?d:new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",year:"numeric",timeZone:"UTC"}).format(date);};
const quarterOf = (date) => {const m=Number((date||"").slice(5,7));return m>=7&&m<=9?"Q1":m>=10&&m<=12?"Q2":m>=1&&m<=3?"Q3":"Q4";};
const entryPhoto = (e) => Array.isArray(e.images)?e.images.map(safeUrl).find(Boolean)||"": "";
const displayed = (e) => ({...e,highlights:e.highlights||[],metrics:e.metrics||[],images:e.images||[],links:e.links||[]});
const shortTitle = (t) => (t || "").replace(/[!?]+/g,"").split(/\s+/).slice(0,3).join(" ");
function sectionBackground(e){const img=entryPhoto(e);return img? 'style="background-image:url(&quot;'+escapeHTML(img)+'&quot;)"':'';}
function cardHTML(e){
  const p=entryPhoto(e);
  const cls=p?"has-image":(CATEGORY_COLORS[e.category]||"graphic-navy");
  return `<button class="entry-card" type="button" data-entry="${escapeHTML(e.id)}" aria-label="Read more: ${escapeHTML(e.title)}">
    <div class="entry-visual ${cls}" ${p?sectionBackground(e):""}>
      ${!p?`<span class="visual-title">${escapeHTML(shortTitle(e.title))}</span><span class="visual-count">${escapeHTML(String(new Date(e.date+"T12:00:00Z").getUTCDate()).padStart(2,"0"))}</span>`:""}
    </div>
    <div class="entry-body"><div class="entry-meta"><span>${escapeHTML(e.category)}</span><span>${escapeHTML(formatDate(e.date))}</span></div>
    <h3 class="entry-title">${escapeHTML(e.title)}</h3><p class="entry-summary">${escapeHTML(e.summary)}</p>
    <div class="entry-footer"><span class="status-tag ${escapeHTML(e.status)}">${escapeHTML(STATUS_LABEL[e.status]||e.status)}</span><span class="entry-view">VIEW STORY ↗</span></div></div></button>`;
}
function featuredHTML(e){const p=entryPhoto(e);return `<button class="featured-card" type="button" data-entry="${escapeHTML(e.id)}" aria-label="Explore ${escapeHTML(e.title)}">
  <div class="featured-bg" style="background-image:${p?"url(&quot;"+escapeHTML(p)+"&quot;)":"linear-gradient(135deg,#193c62,#672a40)"}"></div>
  <div class="featured-overlay"></div><span class="feature-arrow">↗</span>
  <div class="feature-category">${escapeHTML(e.category)} · ${escapeHTML(formatDate(e.date))}</div>
  <h3>${escapeHTML(e.title)}</h3><p>${escapeHTML(e.summary)}</p></button>`;}
function renderFeatured(){
  const picked=entries.filter(e=>e.featured).slice(0,2);
  byId("featured-grid").innerHTML=picked.map(featuredHTML).join("");
}
function renderCategories(){
  const categories=["all",...new Set(entries.map(e=>e.category))];
  byId("categories").innerHTML=categories.map(c=>`<button type="button" class="chip ${c===currentCategory?"active":""}" data-category="${escapeHTML(c)}">${escapeHTML(c==="all"?"All work":c)}</button>`).join("");
}
function matchingEntries(){
  const q=byId("search").value.trim().toLowerCase();
  const quarter=byId("quarter").value;
  const status=byId("status").value;
  return entries.filter(e=>(currentCategory==="all"||e.category===currentCategory)&&(quarter==="all"||quarterOf(e.date)===quarter)&&(status==="all"||e.status===status)&&(!q||[e.title,e.category,e.summary,e.impact,e.role,...e.highlights].join(" ").toLowerCase().includes(q)));
}
function renderEntries(){
  const filtered=matchingEntries();
  byId("entry-grid").innerHTML=filtered.map(cardHTML).join("");
  byId("archive-count").textContent=`${filtered.length} ${filtered.length===1?"entry":"entries"} in view · ${entries.length} total`;
  byId("empty-state").hidden=filtered.length>0;
}
function renderTimeline(){
  const chronological=[...entries].sort((a,b)=>a.date.localeCompare(b.date)).slice(0,12);
  byId("timeline-list").innerHTML=chronological.map(e=>`<div class="timeline-item" tabindex="0" role="button" data-entry="${escapeHTML(e.id)}"><time datetime="${escapeHTML(e.date)}">${escapeHTML(formatDate(e.date).toUpperCase())} • ${quarterOf(e.date)}</time><strong>${escapeHTML(e.title)}</strong><p>${escapeHTML(e.role)} · ${escapeHTML(e.category)}</p></div>`).join("");
}
function imageHTML(img,alt){const u=safeUrl(img);return u?`<img src="${escapeHTML(u)}" alt="${escapeHTML(alt)}" loading="lazy">`:"";}
function openEntry(id){
 const e=entries.find(x=>x.id===id);if(!e)return;
 const cover=entryPhoto(e);
 const metrics=e.metrics.length?`<div class="dialog-metrics">${e.metrics.map(m=>`<div class="dialog-metric"><strong>${escapeHTML(m.value)}</strong><span>${escapeHTML(m.label)}</span></div>`).join("")}</div>`:"";
 const highlights=e.highlights.length?`<h3>Work &amp; highlights</h3><ul>${e.highlights.map(x=>`<li>${escapeHTML(x)}</li>`).join("")}</ul>`:"";
 const imgs=e.images.map(safeUrl).filter(Boolean);const gallery=imgs.length>1?`<h3>Photo record</h3><div class="dialog-gallery">${imgs.slice(1).map((u,i)=>imageHTML(u,`Photo ${i+2}: ${e.title}`)).join("")}</div>`:"";
 const links=e.links.filter(x=>safeUrl(x.url));const evidence=links.length?`<h3>Supporting material</h3><div class="dialog-links">${links.map(x=>`<a href="${escapeHTML(safeUrl(x.url))}" target="_blank" rel="noopener noreferrer">${escapeHTML(x.label||"View source")} ↗</a>`).join("")}</div>`:"";
 byId("dialog-body").innerHTML=`<div class="dialog-cover">${cover?imageHTML(cover,e.title):'<span>CLUB 1600</span>'}</div><div class="dialog-inner"><span class="status-tag ${escapeHTML(e.status)}">${escapeHTML(STATUS_LABEL[e.status])}</span><div class="dialog-details" style="margin-top:15px">${escapeHTML(formatDate(e.date))} · ${escapeHTML(e.category)} · ${escapeHTML(e.role)}</div><h2 id="dialog-title">${escapeHTML(e.title)}</h2><p class="dialog-lead">${escapeHTML(e.summary)}</p>${metrics}${highlights}<h3>Contribution &amp; outcome</h3><div class="dialog-impact">${escapeHTML(e.impact||"Outcome details to be added.")}</div>${gallery}${e.credit?`<p class="dialog-credit">Recognition: ${escapeHTML(e.credit)}</p>`:""}${evidence}</div>`;
 byId("entry-dialog").showModal();
}
function setupEvents(){
  ["search","quarter","status"].forEach(id=>byId(id).addEventListener(id==="search"?"input":"change",renderEntries));
  byId("clear-filters").addEventListener("click",()=>{byId("search").value="";byId("quarter").value="all";byId("status").value="all";currentCategory="all";renderCategories();renderEntries();});
  byId("categories").addEventListener("click",ev=>{const b=ev.target.closest("[data-category]");if(!b)return;currentCategory=b.dataset.category;renderCategories();renderEntries();});
  document.addEventListener("click",ev=>{const hit=ev.target.closest("[data-entry]");if(hit)openEntry(hit.dataset.entry);});
  document.addEventListener("keydown",ev=>{const hit=ev.target.closest?.('[role="button"][data-entry]');if(hit&&(ev.key==="Enter"||ev.key===" ")){ev.preventDefault();openEntry(hit.dataset.entry);}});
  byId("dialog-close").addEventListener("click",()=>byId("entry-dialog").close());
  byId("entry-dialog").addEventListener("click",ev=>{if(ev.target===byId("entry-dialog"))byId("entry-dialog").close();});
  byId("print-page").addEventListener("click",()=>window.print());
}
async function init(){
 setupEvents();
 try {
   const response=await fetch(DATA_URL,{cache:"no-store"});if(!response.ok)throw Error("Could not load portfolio data");
   const payload=await response.json(); if(!Array.isArray(payload))throw Error("Invalid portfolio format");
   entries=payload.filter(x=>x&&x.id&&x.date&&x.title).map(displayed).sort((a,b)=>b.date.localeCompare(a.date)||a.title.localeCompare(b.title));
   renderFeatured();renderCategories();renderEntries();renderTimeline();
 }catch(err){console.error(err);byId("entry-grid").innerHTML='<p class="load-error">The portfolio could not load its activity records. Check data/entries.json and reload.</p>';byId("archive-count").textContent="Archive unavailable";}
}
init();