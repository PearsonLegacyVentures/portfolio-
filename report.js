"use strict";
const months=[["2026-07","July 2026"],["2026-08","August 2026"],["2026-09","September 2026"],["2026-10","October 2026"],["2026-11","November 2026"],["2026-12","December 2026"],["2027-01","January 2027"],["2027-02","February 2027"],["2027-03","March 2027"],["2027-04","April 2027"],["2027-05","May 2027"],["2027-06","June 2027"],["undated","Dates to confirm"]];
const esc=(v)=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const safe=(s)=>{try{const u=new URL(s);return ["http:","https:"].includes(u.protocol)?u.href:""}catch{return ""}};
const month=(e)=>e.month||(e.date?e.date.slice(0,7):"undated");
function photoBlocks(e){
 const photos=(e.images||[]).map(safe).filter(Boolean);
 const before=safe(e.beforeAfter?.before||""),after=safe(e.beforeAfter?.after||"");
 const all=before||after?[...new Set([...photos,before,after].filter(Boolean))]:photos;
 return all.length?`<div class="report-gallery">${all.map((s,i)=>`<figure><img src="${esc(s)}" alt="${esc(e.title)} · image ${i+1}"><figcaption>${esc(i===all.indexOf(before)&&before?"BEFORE":i===all.indexOf(after)&&after?"AFTER":"PHOTO "+(i+1))}</figcaption></figure>`).join("")}</div>`:"";
}
function entryHTML(e){
 const status={completed:"Completed",active:"In motion",planning:"Planned / pending"}[e.status]||e.status;
 const metrics=(e.metrics||[]).length?`<div class="report-metrics">${e.metrics.map(m=>`<div><strong>${esc(m.value)}</strong><span>${esc(m.label)}</span></div>`).join("")}</div>`:"";
 const highlights=(e.highlights||[]).length?`<ul>${e.highlights.map(h=>`<li>${esc(h)}</li>`).join("")}</ul>`:"";
 const urls=[...(e.videos||[]).map(x=>typeof x==="string"?{url:x,label:"Video"}:x),...(e.links||[])].filter(x=>safe(x.url));
 const links=urls.length?`<div class="report-links">${urls.map(x=>`<div>${esc(x.label||"Resource")}: ${esc(safe(x.url))}</div>`).join("")}</div>`:"";
 return `<article class="report-entry"><div class="report-entry-header"><div class="entry-meta">${esc(e.dateLabel||e.date||"DATE TO CONFIRM")} · ${esc(e.category)} · ${esc(e.role||"Documented")}</div><span class="entry-status">${esc(status)}</span></div><h3>${esc(e.title)}</h3><p>${esc(e.summary)}</p>${metrics}${highlights}<div class="report-notes"><p>${esc(e.impact||"Outcomes awaiting confirmation.")}</p></div>${photoBlocks(e)}${links}${e.credit?`<p class="report-credit">With appreciation to: ${esc(e.credit)}</p>`:""}</article>`;
}
async function init(){
 document.getElementById("report-print").addEventListener("click",()=>window.print());
 try{
 const response=await fetch("./data/entries.json",{cache:"no-store"});if(!response.ok)throw Error("File unavailable");
 const all=await response.json();
 const done=all.filter(e=>e.status==="completed").length,withPhotos=all.filter(e=>Array.isArray(e.images)&&e.images.length).length;
 document.getElementById("report-totals").innerHTML=`<div><strong>${all.length}</strong><span>Recorded activities</span></div><div><strong>${done}</strong><span>Marked completed</span></div><div><strong>${withPhotos}</strong><span>Chapters with media</span></div>`;
 document.getElementById("report-content").innerHTML=months.map(([key,title])=>{
 const group=all.filter(e=>month(e)===key).sort((a,b)=>(a.date||"").localeCompare(b.date||""));
 if(!group.length)return "";
 return `<section class="report-month"><div class="report-month-header"><small>THE YEAR IN MOTION / ${esc(key.toUpperCase())}</small><h2>${esc(title)}</h2><p>${group.length} ${group.length===1?"recorded chapter":"recorded chapters"}</p></div>${group.map(entryHTML).join("")}</section>`;
 }).join("");
 }catch(err){document.getElementById("report-content").innerHTML='<p class="loading">Unable to load the portfolio. Reload the report from a deployed website or local web server.</p>';}
}
init();