
(function(){
"use strict";
/* ================= helpers ================= */
const $=(s,e=document)=>e.querySelector(s), $$=(s,e=document)=>[...e.querySelectorAll(s)];
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const r2=n=>Math.round((+n||0)*100)/100;
const money=n=>"₹"+(+n||0).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2});
const money0=n=>"₹"+Math.round(+n||0).toLocaleString("en-IN");
const qf=n=>(+n||0).toLocaleString("en-IN",{maximumFractionDigits:3});
const todayISO=()=>{const d=new Date();d.setMinutes(d.getMinutes()-d.getTimezoneOffset());return d.toISOString().slice(0,10)};
const addDays=(iso,n)=>{const d=new Date(iso+"T00:00:00");d.setDate(d.getDate()+(+n||0));d.setMinutes(d.getMinutes()-d.getTimezoneOffset());return d.toISOString().slice(0,10)};
const daysBetween=(a,b)=>Math.round((new Date(b+"T00:00:00")-new Date(a+"T00:00:00"))/864e5);
const fdate=iso=>iso?new Date(iso+"T00:00:00").toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):"";
const uid=p=>p+"-"+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const clone=o=>JSON.parse(JSON.stringify(o||{}));
const fy=iso=>{const d=new Date(iso+"T00:00:00");const y=d.getMonth()>=3?d.getFullYear():d.getFullYear()-1;return `${String(y).slice(2)}-${String(y+1).slice(2)}`};
const STATES=["Andaman and Nicobar Islands","Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chandigarh","Chhattisgarh","Dadra and Nagar Haveli and Daman and Diu","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jammu and Kashmir","Jharkhand","Karnataka","Kerala","Ladakh","Lakshadweep","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Puducherry","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Outside India"];
const GST_RATES=[0,5,12,18,28];
const UNITS=["pcs","box","case","kg","g","L","ml","tin","jar","bottle","pack"];
const CATS=["Date spreads","Makhana","Makhana chips","Oils & dressings","Spreads & dips","Snacks","Packaging material","Other"];
function words(n){n=Math.round(+n||0);if(n===0)return "Zero";const a=["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"],b=["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  const two=x=>x<20?a[x]:b[Math.floor(x/10)]+(x%10?" "+a[x%10]:""),three=x=>(x>=100?a[Math.floor(x/100)]+" Hundred"+(x%100?" ":""):"")+(x%100?two(x%100):"");
  let s="";const cr=Math.floor(n/1e7);n%=1e7;const lk=Math.floor(n/1e5);n%=1e5;const th=Math.floor(n/1e3);n%=1e3;
  if(cr)s+=(cr>99?words(cr):two(cr))+" Crore ";if(lk)s+=two(lk)+" Lakh ";if(th)s+=two(th)+" Thousand ";if(n)s+=three(n);return s.trim()}
const ICON={plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',dl:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg>',print:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M6 9V3h12v6M6 18H4v-7h16v7h-2M8 14h8v7H8z"/></svg>'};
let toastT;function toast(m,bad){const t=$("#toast");t.textContent=m;t.className="toast on"+(bad?" bad":"");clearTimeout(tt0);tt0=setTimeout(()=>t.className="toast",2800)}let tt0;

/* ================= data store (shared database, with local fallback) ================= */
const COLS=["items","customers","vendors","sales","bills","adjustments"];
const DB={items:{},customers:{},vendors:{},sales:{},bills:{},adjustments:{},settings:{}};
let mode="init",dbh=null,loaded=0;const NEED=COLS.length+1;
const LKEY="aivar-ops-v1";
function setSync(cls,txt){const s=$("#sync");s.className="sync "+cls;s.lastElementChild.textContent=txt}
function persistLocal(){try{localStorage.setItem(LKEY,JSON.stringify(DB))}catch(e){toast("Couldn't save in this browser: storage is full or blocked.",true)}}
function startLocal(){mode="local";try{const raw=localStorage.getItem(LKEY);if(raw)Object.assign(DB,JSON.parse(raw))}catch(e){}setSync("local","Saved in this browser only");loaded=NEED;scheduleRender()}
async function boot(){
  if(!(window.claude&&claude.use)){startLocal();return}
  try{dbh=await claude.use("db")}catch(e){dbh=null}
  if(!dbh){startLocal();return}
  mode="cloud";setSync("","Syncing…");
  const t=setTimeout(()=>{if(loaded<NEED)setSync("off","Can't reach the database yet")},10000);
  const seen=new Set();const mark=k=>{if(!seen.has(k)){seen.add(k);loaded++}if(loaded>=NEED){clearTimeout(t);setSync("","Shared with your team, live")}};
  const fail=e=>{setSync("off",e&&e.code==="permission_denied"?"No access: ask the owner for edit access":"Database error: "+(e&&e.code||"unknown"));if(loaded<NEED){loaded=NEED;scheduleRender()}};
  COLS.forEach(c=>dbh.collection(c).onSnapshot(s=>{const o={};s.docs.forEach(d=>o[d.id]=d.data());DB[c]=o;if(!s.metadata.fromCache)mark(c);else if(Object.keys(o).length)mark(c);scheduleRender()},fail));
  dbh.doc("config/settings").onSnapshot(s=>{DB.settings=s.exists?s.data():{};mark("settings");scheduleRender()},fail);
}
async function put(col,id,obj){
  const o={...clone(obj),id,updatedAt:new Date().toISOString()};
  DB[col]={...DB[col],[id]:o};scheduleRender();
  if(mode==="cloud"){try{await dbh.doc(`${col}/${id}`).set(o)}catch(e){toast(e&&e.code==="quota_exceeded"?"Database is full. Delete old records to add more.":"Couldn't save: "+(e&&e.code||"error"),true);throw e}}
  else persistLocal();
  return o;
}
async function remove(col,id){const n={...DB[col]};delete n[id];DB[col]=n;scheduleRender();if(mode==="cloud"){try{await dbh.doc(`${col}/${id}`).delete()}catch(e){toast("Couldn't delete: "+(e&&e.code||"error"),true)}}else persistLocal()}
async function putSettings(s){DB.settings=clone(s);scheduleRender();if(mode==="cloud"){try{await dbh.doc("config/settings").set(DB.settings)}catch(e){toast("Couldn't save settings",true)}}else persistLocal()}
const list=c=>Object.values(DB[c]||{});
const S=()=>({company:"AIVAR",gstin:"",state:"",address:"",phone:"",email:"",salesPrefix:"AIV",billPrefix:"BILL",terms:15,bank:"",...DB.settings});

/* ================= domain logic ================= */
const SALE_STOCK=["Issued","Partially paid","Paid"];
const BILL_STOCK=["Received","Approved","Partially paid","Paid"];
function calc(doc,partyState){
  const intra=!!(S().state&&partyState&&S().state===partyState);
  let taxable=0,tax=0;const lines=(doc.lines||[]).map(l=>{const q=+l.qty||0,rt=+l.rate||0,d=+l.disc||0;const tv=r2(q*rt*(1-d/100));const tx=r2(tv*(+l.gst||0)/100);taxable+=tv;tax+=tx;return {...l,taxable:tv,tax:tx,total:r2(tv+tx)}});
  taxable=r2(taxable);tax=r2(tax);const raw=r2(taxable+tax),grand=Math.round(raw);
  const paid=r2((doc.payments||[]).reduce((s,p)=>s+(+p.amount||0),0));
  return {lines,taxable,tax,cgst:intra?r2(tax/2):0,sgst:intra?r2(tax/2):0,igst:intra?0:tax,intra,roundOff:r2(grand-raw),grand,paid,balance:r2(grand-paid)};
}
function stockRows(){
  // key = itemId|batch -> {itemId,batch,mfg,exp,qty,inQty,inVal}
  const m={};const k=(i,b)=>i+"|"+(b||"NO-BATCH");
  const row=(i,b,extra)=>{const key=k(i,b);if(!m[key])m[key]={itemId:i,batch:b||"NO-BATCH",mfg:"",exp:"",qty:0,inQty:0,inVal:0};if(extra){if(extra.mfg&&!m[key].mfg)m[key].mfg=extra.mfg;if(extra.exp&&!m[key].exp)m[key].exp=extra.exp}return m[key]};
  list("bills").filter(b=>BILL_STOCK.includes(b.status)).forEach(b=>(b.lines||[]).forEach(l=>{if(!l.itemId)return;const q=+(l.recvQty??l.qty)||0;const r=row(l.itemId,l.batch,l);r.qty+=q;r.inQty+=q;r.inVal+=q*(+l.rate||0)}));
  list("adjustments").forEach(a=>{const q=+a.qty||0;const r=row(a.itemId,a.batch,a);r.qty+=q;if(q>0&&a.cost){r.inQty+=q;r.inVal+=q*(+a.cost||0)}});
  list("sales").filter(s=>SALE_STOCK.includes(s.status)).forEach(s=>(s.alloc||[]).forEach(a=>{row(a.itemId,a.batch).qty-=+a.qty||0}));
  Object.values(m).forEach(r=>r.qty=r2(r.qty));
  return Object.values(m);
}
function itemStats(){
  const st={};list("items").forEach(i=>st[i.id]={onHand:0,inQty:0,inVal:0,batches:[]});
  stockRows().forEach(r=>{const s=st[r.itemId];if(!s)return;s.onHand+=r.qty;s.inQty+=r.inQty;s.inVal+=r.inVal;s.batches.push(r)});
  Object.entries(st).forEach(([id,s])=>{s.onHand=r2(s.onHand);const it=DB.items[id];s.avgCost=s.inQty?s.inVal/s.inQty:(+it.cost||0);s.value=r2(Math.max(0,s.onHand)*s.avgCost)});
  return st;
}
function fefo(itemId,qty,asOf,excludeSaleId){
  // available batches for an item, excluding expired, oldest expiry first
  const rows=stockRows().filter(r=>r.itemId===itemId&&r.qty>0&&(!r.exp||r.exp>=asOf)).sort((a,b)=>(a.exp||"9999").localeCompare(b.exp||"9999"));
  const out=[];let need=qty;for(const r of rows){if(need<=0)break;const take=Math.min(r.qty,need);out.push({itemId,batch:r.batch,exp:r.exp,qty:r2(take)});need=r2(need-take)}
  return {alloc:out,short:Math.max(0,r2(need)),available:r2(rows.reduce((s,r)=>s+r.qty,0))};
}
function saleStatus(s){if(s.status==="Draft"||s.status==="Cancelled"||s.status==="Paid")return s.status;if(s.due&&s.due<todayISO())return "Overdue";return s.status}
function billStatus(b){if(["Draft","Cancelled","Paid"].includes(b.status))return b.status;if(b.due&&b.due<todayISO())return "Overdue";return b.status}
const CHIP={Draft:"",Issued:"info","Partially paid":"warn",Paid:"ok",Overdue:"bad",Cancelled:"",Received:"info",Approved:"info"};
const chip=s=>`<span class="chip ${CHIP[s]||""}">${esc(s)}</span>`;
function nextNo(col,prefix,date){const f=fy(date);const re=new RegExp("^"+prefix.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"/"+f+"/(\\d+)$");let mx=0;list(col).forEach(d=>{const m=(d.no||"").match(re);if(m)mx=Math.max(mx,+m[1])});return `${prefix}/${f}/${String(mx+1).padStart(4,"0")}`}

/* ================= rendering ================= */
let route=(location.hash||"#dashboard").slice(1)||"dashboard";const ROUTES=["dashboard","items","batches","adjustments","sales","customers","bills","vendors","reports","setup"];
if(!ROUTES.includes(route))route="dashboard";
const UI={salesTab:"All",billTab:"All",batchTab:"All",q:""};
let rq=false;function scheduleRender(){if(rq)return;rq=true;requestAnimationFrame(()=>{rq=false;render()})}
addEventListener("hashchange",()=>{const r=location.hash.slice(1);route=ROUTES.includes(r)?r:"dashboard";$("#side").classList.remove("on");$("#mainScroll").scrollTop=0;render()});
$("#q").addEventListener("input",e=>{UI.q=e.target.value.trim().toLowerCase();render()});
const match=(...f)=>!UI.q||f.join(" ").toLowerCase().includes(UI.q);
function render(){
  $$(".side a[data-r]").forEach(a=>a.setAttribute("aria-current",a.dataset.r===route?"page":"false"));
  if(loaded<NEED){$("#page").innerHTML='<div class="loading">Loading your data…</div>';return}
  const st=itemStats();
  const low=list("items").filter(i=>i.active!==false&&+i.reorder>0&&st[i.id]&&st[i.id].onHand<=+i.reorder).length;
  $("#c-items").textContent=low||"";$("#c-items").title=low?low+" at or below reorder level":"";
  const exp30=stockRows().filter(r=>r.qty>0&&r.exp&&daysBetween(todayISO(),r.exp)<=30).length;$("#c-batches").textContent=exp30||"";$("#c-batches").title=exp30?exp30+" batches expiring within 30 days":"";
  const od=list("sales").filter(s=>saleStatus(s)==="Overdue").length;$("#c-sales").textContent=od||"";$("#c-sales").title=od?od+" overdue":"";
  const ob=list("bills").filter(b=>billStatus(b)==="Overdue").length;$("#c-bills").textContent=ob||"";$("#c-bills").title=ob?ob+" overdue":"";
  const v=VIEWS[route]||VIEWS.dashboard;$("#page").innerHTML=v(st);bindPage();
}
function setupNote(){return !S().state?`<div class="alertbar">⚠ Set your company's state in <a href="#setup">Company setup</a> so GST is split correctly into CGST + SGST or IGST.</div>`:""}
function emptyState(t,d,btn){return `<div class="empty"><b>${t}</b>${d}${btn||""}</div>`}

const VIEWS={
dashboard(st){
  const t=todayISO(),month=t.slice(0,7);
  const val=Object.values(st).reduce((s,x)=>s+x.value,0);
  const lowItems=list("items").filter(i=>i.active!==false&&+i.reorder>0&&st[i.id]&&st[i.id].onHand<=+i.reorder);
  const rows=stockRows().filter(r=>r.qty>0&&r.exp);const expSoon=rows.filter(r=>daysBetween(t,r.exp)<=30).sort((a,b)=>a.exp.localeCompare(b.exp));
  const sales=list("sales").filter(s=>s.status!=="Draft"&&s.status!=="Cancelled");
  const recv=sales.reduce((s,x)=>s+calc(x,custState(x)).balance,0),overdue=sales.filter(s=>saleStatus(s)==="Overdue");
  const bills=list("bills").filter(b=>!["Draft","Cancelled"].includes(b.status));
  const pay=bills.reduce((s,x)=>s+calc(x,vendState(x)).balance,0);
  const mSales=sales.filter(s=>(s.date||"").startsWith(month)).reduce((s,x)=>s+calc(x,custState(x)).grand,0);
  const months=[];for(let i=5;i>=0;i--){const d=new Date();d.setDate(1);d.setMonth(d.getMonth()-i);months.push(d.toISOString().slice(0,7))}
  const ms=months.map(m=>({m,s:sales.filter(x=>(x.date||"").startsWith(m)).reduce((a,x)=>a+calc(x,custState(x)).taxable,0),p:bills.filter(x=>(x.date||"").startsWith(m)).reduce((a,x)=>a+calc(x,vendState(x)).taxable,0)}));
  const mx=Math.max(1,...ms.map(x=>Math.max(x.s,x.p)));
  const dueBills=bills.filter(b=>b.status!=="Paid"&&b.due).sort((a,b)=>a.due.localeCompare(b.due)).slice(0,6);
  const empty=!list("items").length;
  return `${setupNote()}<div class="ph"><div><h1>Good ${new Date().getHours()<12?"morning":new Date().getHours()<17?"afternoon":"evening"}</h1><p>${fdate(t)}. Here's where stock, sales and payables stand.</p></div></div>
  ${empty?`<div class="card"><div class="empty"><b>Start by adding your items</b>Add products and packaging materials, then record vendor invoices to bring stock in. Or load demo data to explore.<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap"><button class="btn primary" data-act="newItem">${ICON.plus}Add an item</button><button class="btn" data-act="demo">Load demo data</button></div></div></div>`:""}
  <div class="kpis" style="${empty?"margin-top:16px":""}">
    <button class="kpi" data-go="items"><small>Stock value</small><b>${money0(val)}</b><span>At average cost</span></button>
    <button class="kpi ${lowItems.length?"warn":""}" data-go="items"><small>Items at or below reorder</small><b>${lowItems.length}</b><span>Reorder soon</span></button>
    <button class="kpi ${expSoon.length?"alert":""}" data-go="batches"><small>Batches expiring in 30 days</small><b>${expSoon.length}</b><span>Including expired</span></button>
    <button class="kpi" data-go="sales"><small>Sales this month</small><b>${money0(mSales)}</b><span>Incl. GST</span></button>
    <button class="kpi ${overdue.length?"alert":""}" data-go="sales"><small>Receivables</small><b>${money0(recv)}</b><span>${overdue.length} overdue</span></button>
    <button class="kpi" data-go="bills"><small>Payables</small><b>${money0(pay)}</b><span>${bills.filter(b=>billStatus(b)==="Overdue").length} overdue</span></button>
  </div>
  <div class="grid2">
    <div class="card"><header><h2>Sales vs purchases</h2><div class="legend"><span><i style="background:var(--canopy)"></i>Sales</span><span><i style="background:var(--shoot)"></i>Purchases</span></div></header><div class="body"><div class="bars">${ms.map(x=>`<div class="col" title="${x.m}: sales ${money0(x.s)}, purchases ${money0(x.p)}"><div class="pair"><div class="b s" style="height:${(x.s/mx*100).toFixed(1)}%"></div><div class="b p" style="height:${(x.p/mx*100).toFixed(1)}%"></div></div><small>${new Date(x.m+"-01T00:00:00").toLocaleDateString("en-IN",{month:"short"})}</small></div>`).join("")}</div><p class="small muted" style="margin:8px 0 0">Taxable value, last 6 months</p></div></div>
    <div class="card"><header><h2>Expiring soon</h2><a class="btn sm ghost" href="#batches">View all</a></header>${expSoon.length?`<ul class="mini-list">${expSoon.slice(0,6).map(r=>{const d=daysBetween(t,r.exp);return `<li data-item="${r.itemId}"><span><b>${esc(DB.items[r.itemId]?.name||"Item")}</b><br><span class="small muted">Batch ${esc(r.batch)}, ${qf(r.qty)} ${esc(DB.items[r.itemId]?.unit||"")}</span></span><span class="chip ${d<0?"bad":"warn"}">${d<0?"Expired":d+" days"}</span></li>`}).join("")}</ul>`:emptyState("Nothing expiring in 30 days","")}</div>
    <div class="card"><header><h2>Reorder list</h2><a class="btn sm ghost" href="#items">Items</a></header>${lowItems.length?`<ul class="mini-list">${lowItems.slice(0,6).map(i=>`<li data-item="${i.id}"><span><b>${esc(i.name)}</b><br><span class="small muted">${esc(i.sku)}</span></span><span class="num"><b>${qf(st[i.id].onHand)}</b> <span class="muted small">/ ${qf(i.reorder)} ${esc(i.unit)}</span></span></li>`).join("")}</ul>`:emptyState("All items above reorder level","")}</div>
    <div class="card"><header><h2>Vendor payments due</h2><a class="btn sm ghost" href="#bills">Vendor invoices</a></header>${dueBills.length?`<ul class="mini-list">${dueBills.map(b=>`<li data-bill="${b.id}"><span><b>${esc(DB.vendors[b.vendorId]?.name||"Vendor")}</b><br><span class="small muted">${esc(b.vendorNo||b.no)}, due ${fdate(b.due)}</span></span><span class="num">${money(calc(b,vendState(b)).balance)}<br>${chip(billStatus(b))}</span></li>`).join("")}</ul>`:emptyState("No vendor payments due","")}</div>
  </div>`;
},
items(st){
  const rows=list("items").filter(i=>match(i.name,i.sku,i.category,i.hsn)).sort((a,b)=>a.name.localeCompare(b.name));
  return `<div class="ph"><div><h1>Items</h1><p>Products and packaging materials, with live stock from vendor invoices, sales and adjustments.</p></div><div style="display:flex;gap:8px"><button class="btn" data-act="exportStock">${ICON.dl}Export</button><button class="btn primary" data-act="newItem">${ICON.plus}New item</button></div></div>
  <div class="card">${rows.length?`<div class="tbl-wrap"><table><thead><tr><th>Item</th><th>Category</th><th>HSN</th><th class="n">GST</th><th class="n">On hand</th><th class="n">Reorder at</th><th class="n">Avg cost</th><th class="n">Stock value</th><th>Status</th></tr></thead><tbody>${rows.map(i=>{const s=st[i.id]||{onHand:0,avgCost:0,value:0};const status=i.active===false?["Inactive",""]:s.onHand<=0?["Out of stock","bad"]:(+i.reorder>0&&s.onHand<=+i.reorder)?["Reorder","warn"]:["In stock","ok"];return `<tr class="click" data-item="${i.id}"><td><b>${esc(i.name)}</b><br><span class="small muted">${esc(i.sku)}${i.pack?", "+esc(i.pack):""}</span></td><td>${esc(i.category||"")}</td><td>${esc(i.hsn||"")}</td><td class="n">${+i.gst||0}%</td><td class="n"><b>${qf(s.onHand)}</b> ${esc(i.unit)}</td><td class="n">${i.reorder?qf(i.reorder):"–"}</td><td class="n">${money(s.avgCost)}</td><td class="n">${money(s.value)}</td><td><span class="chip ${status[1]}">${status[0]}</span></td></tr>`}).join("")}</tbody></table></div>`:emptyState(UI.q?"No items match your search":"No items yet",UI.q?"":"Add your first product or packaging material.",UI.q?"":`<br><button class="btn primary" data-act="newItem">${ICON.plus}New item</button>`)}</div>`;
},
batches(){
  const t=todayISO();let rows=stockRows().filter(r=>r.qty!==0&&DB.items[r.itemId]&&match(DB.items[r.itemId].name,r.batch,DB.items[r.itemId].sku));
  const tag=r=>!r.exp?"No expiry":daysBetween(t,r.exp)<0?"Expired":daysBetween(t,r.exp)<=30?"Expiring":"Good";
  const counts={All:rows.length,Expired:0,Expiring:0,Good:0,"No expiry":0};rows.forEach(r=>counts[tag(r)]++);
  if(UI.batchTab!=="All")rows=rows.filter(r=>tag(r)===UI.batchTab);
  rows.sort((a,b)=>(a.exp||"9999").localeCompare(b.exp||"9999"));
  return `<div class="ph"><div><h1>Stock and batches</h1><p>Every batch on hand, oldest expiry first. Sales invoices pick stock first-expiry-first-out and skip expired batches.</p></div></div>
  <div class="tabs" data-tabs="batchTab">${Object.entries(counts).map(([k,c])=>`<button aria-pressed="${UI.batchTab===k}" data-tab="${k}">${k}<span class="c">${c}</span></button>`).join("")}</div>
  <div class="card">${rows.length?`<div class="tbl-wrap"><table><thead><tr><th>Item</th><th>Batch</th><th>Mfg date</th><th>Expiry</th><th class="n">Qty on hand</th><th class="n">Value</th><th>Status</th><th></th></tr></thead><tbody>${rows.map(r=>{const it=DB.items[r.itemId];const tg=tag(r);const d=r.exp?daysBetween(t,r.exp):null;const cost=r.inQty?r.inVal/r.inQty:(+it.cost||0);return `<tr><td><b>${esc(it.name)}</b><br><span class="small muted">${esc(it.sku)}</span></td><td>${esc(r.batch)}</td><td>${fdate(r.mfg)}</td><td>${fdate(r.exp)}${d!==null?`<br><span class="small muted">${d<0?Math.abs(d)+" days ago":"in "+d+" days"}</span>`:""}</td><td class="n"><b>${qf(r.qty)}</b> ${esc(it.unit)}</td><td class="n">${money(Math.max(0,r.qty)*cost)}</td><td><span class="chip ${tg==="Expired"?"bad":tg==="Expiring"?"warn":tg==="Good"?"ok":""}">${tg}</span></td><td>${r.qty>0&&tg==="Expired"?`<button class="btn sm danger" data-writeoff="${esc(r.itemId+"|"+r.batch)}">Write off</button>`:""}</td></tr>`}).join("")}</tbody></table></div>`:emptyState("No batches here","Stock appears when a vendor invoice is marked received, or when you add opening stock.")}</div>`;
},
adjustments(){
  const rows=list("adjustments").filter(a=>match(DB.items[a.itemId]?.name,a.reason,a.batch,a.note)).sort((a,b)=>(b.date||"").localeCompare(a.date||"")||(b.updatedAt||"").localeCompare(a.updatedAt||""));
  return `<div class="ph"><div><h1>Stock adjustments</h1><p>Opening stock, damage, expiry write-offs, samples and count corrections.</p></div><button class="btn primary" data-act="newAdj">${ICON.plus}New adjustment</button></div>
  <div class="card">${rows.length?`<div class="tbl-wrap"><table><thead><tr><th>Date</th><th>Item</th><th>Batch</th><th>Reason</th><th class="n">Qty</th><th>Note</th><th></th></tr></thead><tbody>${rows.map(a=>`<tr><td>${fdate(a.date)}</td><td><b>${esc(DB.items[a.itemId]?.name||"Deleted item")}</b></td><td>${esc(a.batch||"")}</td><td>${esc(a.reason)}</td><td class="n" style="color:${a.qty<0?"var(--bad)":"var(--ok)"}"><b>${a.qty>0?"+":""}${qf(a.qty)}</b> ${esc(DB.items[a.itemId]?.unit||"")}</td><td class="small">${esc(a.note||"")}</td><td><button class="btn sm ghost danger" data-deladj="${a.id}">Delete</button></td></tr>`).join("")}</tbody></table></div>`:emptyState("No adjustments yet","Use an opening-stock adjustment to load stock you already hold.",`<br><button class="btn primary" data-act="newAdj">${ICON.plus}New adjustment</button>`)}</div>`;
},
sales(){
  let rows=list("sales").filter(s=>match(s.no,DB.customers[s.customerId]?.name,s.status));
  const tabs=["All","Draft","Issued","Partially paid","Overdue","Paid","Cancelled"];const cnt=k=>k==="All"?rows.length:rows.filter(s=>saleStatus(s)===k).length;
  if(UI.salesTab!=="All")rows=rows.filter(s=>saleStatus(s)===UI.salesTab);
  rows.sort((a,b)=>(b.date||"").localeCompare(a.date||"")||(b.no||"").localeCompare(a.no||""));
  const tot=rows.filter(s=>s.status!=="Cancelled"&&s.status!=="Draft").reduce((a,s)=>{const c=calc(s,custState(s));a.g+=c.grand;a.b+=c.balance;return a},{g:0,b:0});
  return `${setupNote()}<div class="ph"><div><h1>Sales invoices</h1><p>Draft, issue (stock goes out first-expiry-first), collect payment.</p></div><div style="display:flex;gap:8px"><button class="btn" data-act="exportSales">${ICON.dl}Sales register</button><button class="btn primary" data-act="newSale">${ICON.plus}New sales invoice</button></div></div>
  <div class="tabs" data-tabs="salesTab">${tabs.map(k=>`<button aria-pressed="${UI.salesTab===k}" data-tab="${k}">${k}<span class="c">${cnt(k)}</span></button>`).join("")}</div>
  <div class="card">${rows.length?`<div class="tbl-wrap"><table><thead><tr><th>Invoice</th><th>Date</th><th>Customer</th><th>Due</th><th class="n">Amount</th><th class="n">Balance</th><th>Status</th></tr></thead><tbody>${rows.map(s=>{const c=calc(s,custState(s));return `<tr class="click" data-sale="${s.id}"><td><b>${esc(s.no||"Draft")}</b></td><td>${fdate(s.date)}</td><td>${esc(DB.customers[s.customerId]?.name||"–")}</td><td>${fdate(s.due)}</td><td class="n">${money(c.grand)}</td><td class="n">${s.status==="Draft"||s.status==="Cancelled"?"–":money(c.balance)}</td><td>${chip(saleStatus(s))}</td></tr>`}).join("")}</tbody><tfoot><tr><td colspan="4" class="muted small">${rows.length} invoice(s), excluding drafts and cancelled in totals</td><td class="n"><b>${money(tot.g)}</b></td><td class="n"><b>${money(tot.b)}</b></td><td></td></tr></tfoot></table></div>`:emptyState("No sales invoices here","Create an invoice, issue it to move stock out and collect payment.",`<br><button class="btn primary" data-act="newSale">${ICON.plus}New sales invoice</button>`)}</div>`;
},
customers(){
  const rows=list("customers").filter(c=>match(c.name,c.gstin,c.city,c.state,c.phone)).sort((a,b)=>a.name.localeCompare(b.name));
  return `<div class="ph"><div><h1>Customers</h1><p>Retailers, distributors, institutions and corporate buyers.</p></div><button class="btn primary" data-act="newCustomer">${ICON.plus}New customer</button></div>
  <div class="card">${rows.length?`<div class="tbl-wrap"><table><thead><tr><th>Customer</th><th>GSTIN</th><th>State</th><th>Contact</th><th class="n">Terms</th><th class="n">Outstanding</th></tr></thead><tbody>${rows.map(c=>{const out=list("sales").filter(s=>s.customerId===c.id&&!["Draft","Cancelled"].includes(s.status)).reduce((a,s)=>a+calc(s,c.state).balance,0);return `<tr class="click" data-customer="${c.id}"><td><b>${esc(c.name)}</b><br><span class="small muted">${esc(c.type||"")}</span></td><td>${esc(c.gstin||"Unregistered")}</td><td>${esc(c.state||"")}</td><td class="small">${esc(c.phone||"")}<br>${esc(c.email||"")}</td><td class="n">${+c.terms||0} days</td><td class="n">${money(out)}</td></tr>`}).join("")}</tbody></table></div>`:emptyState("No customers yet","",`<br><button class="btn primary" data-act="newCustomer">${ICON.plus}New customer</button>`)}</div>`;
},
bills(){
  let rows=list("bills").filter(b=>match(b.no,b.vendorNo,DB.vendors[b.vendorId]?.name,b.status));
  const tabs=["All","Draft","Received","Approved","Partially paid","Overdue","Paid","Cancelled"];const cnt=k=>k==="All"?rows.length:rows.filter(b=>billStatus(b)===k).length;
  if(UI.billTab!=="All")rows=rows.filter(b=>billStatus(b)===UI.billTab);
  rows.sort((a,b)=>(b.date||"").localeCompare(a.date||"")||(b.no||"").localeCompare(a.no||""));
  return `<div class="ph"><div><h1>Vendor invoices</h1><p>Record the bill, receive goods into stock with batch and expiry, approve, then pay.</p></div><div style="display:flex;gap:8px"><button class="btn" data-act="exportBills">${ICON.dl}Purchase register</button><button class="btn primary" data-act="newBill">${ICON.plus}New vendor invoice</button></div></div>
  <div class="tabs" data-tabs="billTab">${tabs.map(k=>`<button aria-pressed="${UI.billTab===k}" data-tab="${k}">${k}<span class="c">${cnt(k)}</span></button>`).join("")}</div>
  <div class="card">${rows.length?`<div class="tbl-wrap"><table><thead><tr><th>Our ref</th><th>Vendor invoice no.</th><th>Vendor</th><th>Bill date</th><th>Due</th><th class="n">Amount</th><th class="n">Balance</th><th>Status</th></tr></thead><tbody>${rows.map(b=>{const c=calc(b,vendState(b));return `<tr class="click" data-bill="${b.id}"><td><b>${esc(b.no||"Draft")}</b></td><td>${esc(b.vendorNo||"")}</td><td>${esc(DB.vendors[b.vendorId]?.name||"–")}</td><td>${fdate(b.date)}</td><td>${fdate(b.due)}</td><td class="n">${money(c.grand)}</td><td class="n">${b.status==="Draft"||b.status==="Cancelled"?"–":money(c.balance)}</td><td>${chip(billStatus(b))}</td></tr>`}).join("")}</tbody></table></div>`:emptyState("No vendor invoices here","Record a vendor's bill, then mark goods received to add stock.",`<br><button class="btn primary" data-act="newBill">${ICON.plus}New vendor invoice</button>`)}</div>`;
},
vendors(){
  const rows=list("vendors").filter(v=>match(v.name,v.gstin,v.category,v.phone)).sort((a,b)=>a.name.localeCompare(b.name));
  return `<div class="ph"><div><h1>Vendors</h1><p>Suppliers of ingredients, finished goods, oil and packaging.</p></div><button class="btn primary" data-act="newVendor">${ICON.plus}New vendor</button></div>
  <div class="card">${rows.length?`<div class="tbl-wrap"><table><thead><tr><th>Vendor</th><th>GSTIN</th><th>State</th><th>Contact</th><th class="n">Terms</th><th class="n">Payable</th></tr></thead><tbody>${rows.map(v=>{const out=list("bills").filter(b=>b.vendorId===v.id&&!["Draft","Cancelled"].includes(b.status)).reduce((a,b)=>a+calc(b,v.state).balance,0);return `<tr class="click" data-vendor="${v.id}"><td><b>${esc(v.name)}</b><br><span class="small muted">${esc(v.category||"")}</span></td><td>${esc(v.gstin||"Unregistered")}</td><td>${esc(v.state||"")}</td><td class="small">${esc(v.phone||"")}<br>${esc(v.email||"")}</td><td class="n">${+v.terms||0} days</td><td class="n">${money(out)}</td></tr>`}).join("")}</tbody></table></div>`:emptyState("No vendors yet","",`<br><button class="btn primary" data-act="newVendor">${ICON.plus}New vendor</button>`)}</div>`;
},
reports(st){
  const t=todayISO();const sales=list("sales").filter(s=>SALE_STOCK.includes(s.status));
  const age=(arr,stateFn,dueKey)=>{const b={"Not due":0,"1–30":0,"31–60":0,"61–90":0,"90+":0};arr.forEach(d=>{const bal=calc(d,stateFn(d)).balance;if(bal<=0)return;const late=d.due?daysBetween(d.due,t):0;b[late<=0?"Not due":late<=30?"1–30":late<=60?"31–60":late<=90?"61–90":"90+"]+=bal});return b};
  const ar=age(sales,custState),ap=age(list("bills").filter(b=>["Received","Approved","Partially paid"].includes(b.status)),vendState);
  const gst=(arr,fn)=>arr.reduce((a,d)=>{const c=calc(d,fn(d));a.t+=c.taxable;a.c+=c.cgst;a.s+=c.sgst;a.i+=c.igst;return a},{t:0,c:0,s:0,i:0});
  const month=t.slice(0,7);const og=gst(sales.filter(s=>(s.date||"").startsWith(month)),custState),ig=gst(list("bills").filter(b=>BILL_STOCK.includes(b.status)&&(b.date||"").startsWith(month)),vendState);
  const agTbl=(b)=>`<table><thead><tr>${Object.keys(b).map(k=>`<th class="n">${k}</th>`).join("")}</tr></thead><tbody><tr>${Object.values(b).map(v=>`<td class="n">${money(v)}</td>`).join("")}</tr></tbody></table>`;
  return `<div class="ph"><div><h1>Reports</h1><p>Ageing, GST summary and registers. Share totals with your accountant for filing.</p></div></div>
  <div class="grid2">
   <div class="card"><header><h2>Receivables ageing</h2><span class="small muted">Days past due</span></header><div class="tbl-wrap">${agTbl(ar)}</div></div>
   <div class="card"><header><h2>Payables ageing</h2><span class="small muted">Days past due</span></header><div class="tbl-wrap">${agTbl(ap)}</div></div>
   <div class="card"><header><h2>GST this month</h2><span class="small muted">${new Date().toLocaleDateString("en-IN",{month:"long",year:"numeric"})}</span></header><div class="tbl-wrap"><table><thead><tr><th></th><th class="n">Taxable</th><th class="n">CGST</th><th class="n">SGST</th><th class="n">IGST</th></tr></thead><tbody><tr><td><b>Output (sales)</b></td><td class="n">${money(og.t)}</td><td class="n">${money(og.c)}</td><td class="n">${money(og.s)}</td><td class="n">${money(og.i)}</td></tr><tr><td><b>Input (vendor invoices)</b></td><td class="n">${money(ig.t)}</td><td class="n">${money(ig.c)}</td><td class="n">${money(ig.s)}</td><td class="n">${money(ig.i)}</td></tr></tbody></table></div><div class="body small muted">An indicative summary from invoices in this tool. Your accountant should confirm before filing returns.</div></div>
   <div class="card"><header><h2>Exports</h2></header><div class="body" style="display:flex;flex-wrap:wrap;gap:8px"><button class="btn" data-act="exportSales">${ICON.dl}Sales register</button><button class="btn" data-act="exportBills">${ICON.dl}Purchase register</button><button class="btn" data-act="exportStock">${ICON.dl}Stock summary</button><button class="btn" data-act="exportBatches">${ICON.dl}Batch and expiry report</button><button class="btn" data-act="exportJSON">${ICON.dl}Full backup</button></div></div>
  </div>`;
},
setup(){
  const s=S();
  return `<div class="ph"><div><h1>Company setup</h1><p>These details print on your sales invoices and decide how GST is split.</p></div></div>
  <div class="card"><div class="body"><form class="form" id="setupForm">
   ${fld("company","Company name",s.company,"text",true)}${fld("gstin","GSTIN",s.gstin,"text",false,"15 characters")}
   <div class="f"><label for="f-state">State (place of business)</label><select id="f-state" name="state"><option value="">Select state</option>${STATES.filter(x=>x!=="Outside India").map(x=>`<option ${x===s.state?"selected":""}>${x}</option>`).join("")}</select><div class="hint">Same state as the customer: CGST + SGST. Different state: IGST.</div></div>
   ${fld("phone","Phone",s.phone)}${fld("email","Email",s.email,"email")}
   ${fld("address","Address",s.address,"text",false,"",true)}
   ${fld("salesPrefix","Sales invoice prefix",s.salesPrefix,"text",true,"Numbers look like "+esc(s.salesPrefix||"AIV")+"/"+fy(todayISO())+"/0001")}
   ${fld("billPrefix","Vendor invoice reference prefix",s.billPrefix,"text",true)}
   ${fld("terms","Default customer payment terms (days)",s.terms,"number")}
   ${fld("bank","Bank details for invoices",s.bank,"text",false,"Shown on invoices. Leave blank to hide.",true)}
   <div class="full" style="display:flex;gap:8px"><button class="btn primary" type="submit">Save setup</button></div>
  </form></div></div>
  <div class="card" style="margin-top:16px"><header><h2>Data</h2><span class="small muted">${mode==="cloud"?"Shared database: everyone with edit access sees the same data":"Saved in this browser only"}</span></header><div class="body" style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" data-act="demo">Load demo data</button><button class="btn" data-act="removeDemo">Remove demo data</button><button class="btn" data-act="exportJSON">${ICON.dl}Download full backup</button><button class="btn danger" data-act="wipe">Delete all data</button></div></div>`;
}
};
function fld(name,label,val,type="text",req=false,hint="",full=false){return `<div class="f ${full?"full":""}"><label for="f-${name}">${label}${req?"":" <span class='muted'>(optional)</span>"}</label><input id="f-${name}" name="${name}" type="${type}" value="${esc(val??"")}" ${req?"required":""} ${type==="number"?'step="any"':""}>${hint?`<div class="hint">${hint}</div>`:""}<div class="emsg">Required</div></div>`}
const custState=s=>DB.customers[s.customerId]?.state||"";
const vendState=b=>DB.vendors[b.vendorId]?.state||"";

function bindPage(){
  const p=$("#page");
  $$("[data-go]",p).forEach(b=>b.onclick=()=>location.hash="#"+b.dataset.go);
  $$("[data-item]",p).forEach(r=>r.onclick=()=>openItem(r.dataset.item));
  $$("[data-sale]",p).forEach(r=>r.onclick=()=>openSale(r.dataset.sale));
  $$("[data-bill]",p).forEach(r=>r.onclick=()=>openBill(r.dataset.bill));
  $$("[data-customer]",p).forEach(r=>r.onclick=()=>openParty("customers",r.dataset.customer));
  $$("[data-vendor]",p).forEach(r=>r.onclick=()=>openParty("vendors",r.dataset.vendor));
  $$("[data-tabs]",p).forEach(g=>g.onclick=e=>{const b=e.target.closest("[data-tab]");if(b){UI[g.dataset.tabs]=b.dataset.tab;render()}});
  $$("[data-act]",p).forEach(b=>b.onclick=()=>ACT[b.dataset.act]());
  $$("[data-deladj]",p).forEach(b=>b.onclick=()=>confirmDlg("Delete adjustment?","Stock will be recalculated without it.","Delete",()=>remove("adjustments",b.dataset.deladj)));
  $$("[data-writeoff]",p).forEach(b=>b.onclick=()=>{const [itemId,batch]=b.dataset.writeoff.split("|");const r=stockRows().find(x=>x.itemId===itemId&&x.batch===batch);openAdj({itemId,batch,qty:-r.qty,reason:"Expiry write-off"})});
  const sf=$("#setupForm");if(sf)sf.onsubmit=async e=>{e.preventDefault();const fd=Object.fromEntries(new FormData(sf));if(!fd.company||!fd.salesPrefix||!fd.billPrefix){toast("Fill in the required fields",true);return}if(fd.gstin&&!/^[0-9A-Z]{15}$/i.test(fd.gstin)){toast("GSTIN should be 15 letters and numbers",true);return}fd.terms=+fd.terms||0;fd.gstin=(fd.gstin||"").toUpperCase();await putSettings({...S(),...fd});toast("Setup saved")};
}

/* ================= overlays ================= */
const drawer=$("#drawer"),scrim=$("#scrim");let onClose=null,lastFocus=null;
function openDrawer(title,body,foot,{wide=false,headActs=""}={}){lastFocus=document.activeElement;$("#dTitle").textContent=title;$("#dBody").innerHTML=body;$("#dFoot").innerHTML=foot||"";$("#dHeadActs").innerHTML=headActs;drawer.classList.toggle("wide",wide);drawer.classList.add("on");scrim.classList.add("on");$("#dBody").scrollTop=0;setTimeout(()=>{const f=$("#dBody input,#dBody select");(f||$("#dClose")).focus()},60)}
function closeDrawer(){drawer.classList.remove("on");scrim.classList.remove("on");onClose&&onClose();onClose=null;lastFocus&&lastFocus.focus&&lastFocus.focus()}
$("#dClose").onclick=closeDrawer;scrim.onclick=()=>{closeDrawer();$("#side").classList.remove("on")};
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&drawer.classList.contains("on")&&!$("#dlg").open)closeDrawer()});
function dlg(title,body,buttons){const d=$("#dlg");$("#dlgTitle").textContent=title;$("#dlgBody").innerHTML=body;$("#dlgFoot").innerHTML="";buttons.forEach(b=>{const el=document.createElement("button");el.className="btn "+(b.cls||"");el.textContent=b.t;el.onclick=async()=>{if(b.fn){const r=await b.fn();if(r===false)return}d.close()};$("#dlgFoot").appendChild(el)});d.showModal()}
function confirmDlg(t,body,ok,fn,cls="danger"){dlg(t,`<p style="margin:0">${body}</p>`,[{t:"Cancel"},{t:ok,cls:"primary "+cls,fn}])}

/* ================= items ================= */
function itemForm(i){return `<form class="form" id="itemForm">
  ${fld("name","Item name",i.name,"text",true,"",true)}${fld("sku","SKU / code",i.sku,"text",true)}
  <div class="f"><label for="f-category">Category</label><select id="f-category" name="category">${CATS.map(c=>`<option ${c===i.category?"selected":""}>${c}</option>`).join("")}</select></div>
  <div class="f"><label for="f-unit">Stock unit</label><select id="f-unit" name="unit">${UNITS.map(u=>`<option ${u===(i.unit||"pcs")?"selected":""}>${u}</option>`).join("")}</select></div>
  ${fld("pack","Pack size",i.pack,"text",false,"e.g. 1 L bottle, 70 g pack")}
  ${fld("hsn","HSN code",i.hsn,"text",false)}
  <div class="f"><label for="f-gst">GST rate</label><select id="f-gst" name="gst">${GST_RATES.map(r=>`<option value="${r}" ${+r===+(i.gst??5)?"selected":""}>${r}%</option>`).join("")}</select><div class="hint">Confirm the rate for each HSN with your accountant.</div></div>
  ${fld("price","Default selling price (₹, before GST)",i.price,"number")}
  ${fld("cost","Standard cost (₹)",i.cost,"number",false,"Used until vendor invoices give an average cost")}
  ${fld("reorder","Reorder level",i.reorder,"number",false,"Alert when stock falls to this")}
  ${fld("shelf","Shelf life (days)",i.shelf,"number",false,"Suggests expiry when receiving")}
  <label class="full" style="display:flex;gap:8px;align-items:center"><input type="checkbox" name="active" ${i.active!==false?"checked":""}> Active (available on new invoices)</label>
</form>`}
function newItem(pre){const i={id:"",gst:5,unit:"pcs",category:CATS[0],...pre};openDrawer(i.id?"Edit item":"New item",itemForm(i),`<button class="btn" id="cancelIt">Cancel</button><button class="btn primary" id="saveIt">Save item</button>`);
  $("#cancelIt").onclick=closeDrawer;$("#saveIt").onclick=async()=>{const f=$("#itemForm");const fd=Object.fromEntries(new FormData(f));let bad=false;["name","sku"].forEach(k=>{const w=$("#f-"+k).closest(".f");const e=!fd[k].trim();w.classList.toggle("err",e);if(e)bad=true});
    const dup=list("items").find(x=>x.sku.toLowerCase()===fd.sku.trim().toLowerCase()&&x.id!==i.id);if(dup){$("#f-sku").closest(".f").classList.add("err");$("#f-sku").closest(".f").querySelector(".emsg").textContent="SKU already used by "+dup.name;bad=true}
    if(bad)return;const id=i.id||uid("it");await put("items",id,{...i,...fd,name:fd.name.trim(),sku:fd.sku.trim(),gst:+fd.gst,price:+fd.price||0,cost:+fd.cost||0,reorder:+fd.reorder||0,shelf:+fd.shelf||0,active:!!fd.active,createdAt:i.createdAt||new Date().toISOString()});closeDrawer();toast("Item saved")}}
function openItem(id){const i=DB.items[id];if(!i)return;const st=itemStats()[id];const t=todayISO();
  const moves=[];list("bills").filter(b=>BILL_STOCK.includes(b.status)).forEach(b=>(b.lines||[]).filter(l=>l.itemId===id).forEach(l=>moves.push({d:b.recvDate||b.date,t:"Received",ref:b.no,q:+(l.recvQty??l.qty),batch:l.batch})));
  list("sales").filter(s=>SALE_STOCK.includes(s.status)).forEach(s=>(s.alloc||[]).filter(a=>a.itemId===id).forEach(a=>moves.push({d:s.date,t:"Sold",ref:s.no,q:-a.qty,batch:a.batch})));
  list("adjustments").filter(a=>a.itemId===id).forEach(a=>moves.push({d:a.date,t:a.reason,ref:"Adjustment",q:+a.qty,batch:a.batch}));
  moves.sort((a,b)=>(b.d||"").localeCompare(a.d||""));
  const batches=st.batches.filter(b=>b.qty!==0).sort((a,b)=>(a.exp||"9999").localeCompare(b.exp||"9999"));
  openDrawer(i.name,`<div class="meta"><div><small>SKU</small><b>${esc(i.sku)}</b></div><div><small>On hand</small><b>${qf(st.onHand)} ${esc(i.unit)}</b></div><div><small>Average cost</small><b>${money(st.avgCost)}</b></div><div><small>Stock value</small><b>${money(st.value)}</b></div><div><small>Selling price</small><b>${money(i.price)}</b></div><div><small>GST / HSN</small><b>${+i.gst}% ${i.hsn?"/ "+esc(i.hsn):""}</b></div></div>
   <h3 style="margin:6px 0 8px">Batches</h3><div class="card">${batches.length?`<table><thead><tr><th>Batch</th><th>Expiry</th><th class="n">Qty</th></tr></thead><tbody>${batches.map(b=>{const d=b.exp?daysBetween(t,b.exp):null;return `<tr><td>${esc(b.batch)}</td><td>${fdate(b.exp)} ${d!==null&&d<=30?`<span class="chip ${d<0?"bad":"warn"}">${d<0?"Expired":d+" days"}</span>`:""}</td><td class="n">${qf(b.qty)}</td></tr>`}).join("")}</tbody></table>`:emptyState("No stock","")}</div>
   <h3 style="margin:18px 0 8px">Movements</h3><div class="card">${moves.length?`<table><thead><tr><th>Date</th><th>Type</th><th>Reference</th><th>Batch</th><th class="n">Qty</th></tr></thead><tbody>${moves.slice(0,60).map(m=>`<tr><td>${fdate(m.d)}</td><td>${esc(m.t)}</td><td>${esc(m.ref||"")}</td><td>${esc(m.batch||"")}</td><td class="n" style="color:${m.q<0?"var(--bad)":"var(--ok)"}">${m.q>0?"+":""}${qf(m.q)}</td></tr>`).join("")}</tbody></table>`:emptyState("No movements yet","")}</div>`,
   `<button class="btn danger" id="delIt">Delete</button><button class="btn" id="adjIt">Adjust stock</button><button class="btn primary" id="editIt">Edit item</button>`);
  $("#editIt").onclick=()=>newItem(clone(i));$("#adjIt").onclick=()=>openAdj({itemId:id});
  $("#delIt").onclick=()=>{const used=list("sales").some(s=>(s.lines||[]).some(l=>l.itemId===id))||list("bills").some(b=>(b.lines||[]).some(l=>l.itemId===id))||list("adjustments").some(a=>a.itemId===id);
    if(used){dlg("Item is in use","<p style='margin:0'>This item appears on invoices or adjustments, so it can't be deleted. Mark it inactive instead to hide it from new invoices.</p>",[{t:"Close"},{t:"Mark inactive",cls:"primary",fn:async()=>{await put("items",id,{...clone(i),active:false});closeDrawer();toast("Item marked inactive")}}]);return}
    confirmDlg("Delete item?",`${esc(i.name)} will be removed.`,"Delete",async()=>{await remove("items",id);closeDrawer();toast("Item deleted")})};
}

/* ================= adjustments ================= */
function openAdj(pre={}){
  const items=list("items").sort((a,b)=>a.name.localeCompare(b.name));
  if(!items.length){toast("Add an item first",true);return}
  const a={date:todayISO(),reason:"Opening stock",qty:"",...pre};
  const reasons=["Opening stock","Count correction","Damaged","Expiry write-off","Sample / marketing","Internal use","Returned by customer"];
  openDrawer("Stock adjustment",`<form class="form" id="adjForm">
   <div class="f full"><label for="a-item">Item</label><select id="a-item" name="itemId">${items.map(i=>`<option value="${i.id}" ${i.id===a.itemId?"selected":""}>${esc(i.name)} (${esc(i.sku)})</option>`).join("")}</select></div>
   <div class="f"><label for="a-reason">Reason</label><select id="a-reason" name="reason">${reasons.map(r=>`<option ${r===a.reason?"selected":""}>${r}</option>`).join("")}</select></div>
   <div class="f"><label for="a-date">Date</label><input id="a-date" name="date" type="date" value="${a.date}"></div>
   <div class="f"><label for="a-batch">Batch</label><input id="a-batch" name="batch" list="a-batches" value="${esc(a.batch||"")}" placeholder="Existing or new batch"><datalist id="a-batches"></datalist><div class="hint" id="a-bhint"></div></div>
   <div class="f"><label for="a-qty">Quantity change</label><input id="a-qty" name="qty" type="number" step="any" value="${a.qty}"><div class="hint">Positive adds stock, negative removes it.</div><div class="emsg">Enter a non-zero quantity</div></div>
   <div class="f"><label for="a-mfg">Mfg date (new batches)</label><input id="a-mfg" name="mfg" type="date"></div>
   <div class="f"><label for="a-exp">Expiry date (new batches)</label><input id="a-exp" name="exp" type="date"></div>
   <div class="f"><label for="a-cost">Unit cost (₹, for added stock)</label><input id="a-cost" name="cost" type="number" step="any"></div>
   <div class="f full"><label for="a-note">Note</label><input id="a-note" name="note"></div>
  </form>`,`<button class="btn" id="cAdj">Cancel</button><button class="btn primary" id="sAdj">Save adjustment</button>`);
  const sync=()=>{const id=$("#a-item").value;const rows=stockRows().filter(r=>r.itemId===id);$("#a-batches").innerHTML=rows.map(r=>`<option value="${esc(r.batch)}">${qf(r.qty)} on hand${r.exp?", exp "+fdate(r.exp):""}</option>`).join("");const b=rows.find(r=>r.batch===$("#a-batch").value);$("#a-bhint").textContent=b?`${qf(b.qty)} on hand in this batch`:$("#a-batch").value?"New batch":"";if(!$("#a-cost").value){const it=DB.items[id];$("#a-cost").placeholder=it&&it.cost?String(it.cost):""}};
  $("#a-item").onchange=sync;$("#a-batch").oninput=sync;sync();
  $("#a-mfg").onchange=()=>{const it=DB.items[$("#a-item").value];if(it&&it.shelf&&!$("#a-exp").value&&$("#a-mfg").value)$("#a-exp").value=addDays($("#a-mfg").value,it.shelf)};
  $("#cAdj").onclick=closeDrawer;
  $("#sAdj").onclick=async()=>{const fd=Object.fromEntries(new FormData($("#adjForm")));const q=+fd.qty;if(!q){$("#a-qty").closest(".f").classList.add("err");return}
    const batch=(fd.batch||"").trim()||"NO-BATCH";const cur=stockRows().find(r=>r.itemId===fd.itemId&&r.batch===batch);
    if(q<0&&(!cur||cur.qty+q<0)){toast(`Only ${qf(cur?cur.qty:0)} in batch ${batch}. Can't remove more than is on hand.`,true);return}
    const it=DB.items[fd.itemId];await put("adjustments",uid("adj"),{itemId:fd.itemId,reason:fd.reason,date:fd.date||todayISO(),batch,qty:q,mfg:fd.mfg||"",exp:fd.exp||"",cost:q>0?(+fd.cost||+it.cost||0):0,note:fd.note||""});closeDrawer();toast("Adjustment saved")};
}

/* ================= parties ================= */
function openParty(col,id){const isC=col==="customers";const p=id?clone(DB[col][id]):{terms:isC?S().terms:30,state:""};
  const types=isC?["Retailer","Distributor","Restaurant / caterer","Corporate","Education","Government","Export buyer","Household","Other"]:["Finished goods","Raw material","Oil","Packaging","Logistics","Services","Other"];
  openDrawer(id?(p.name||"Edit"):(isC?"New customer":"New vendor"),`<form class="form" id="partyForm">
   ${fld("name",isC?"Customer name":"Vendor name",p.name,"text",true,"",true)}
   <div class="f"><label for="f-type">${isC?"Customer type":"Category"}</label><select id="f-type" name="${isC?"type":"category"}">${types.map(t=>`<option ${t===(isC?p.type:p.category)?"selected":""}>${t}</option>`).join("")}</select></div>
   ${fld("gstin","GSTIN",p.gstin,"text",false,"Leave blank if unregistered")}
   <div class="f"><label for="f-pstate">State</label><select id="f-pstate" name="state" required><option value="">Select state</option>${STATES.map(x=>`<option ${x===p.state?"selected":""}>${x}</option>`).join("")}</select><div class="emsg">Required for GST</div></div>
   ${fld("city","City",p.city)}
   ${fld("address","Address",p.address,"text",false,"",true)}
   ${fld("contact","Contact person",p.contact)}${fld("phone","Phone",p.phone,"tel")}${fld("email","Email",p.email,"email")}
   ${fld("terms","Payment terms (days)",p.terms,"number")}
  </form>`,`${id?'<button class="btn danger" id="delP">Delete</button>':""}<button class="btn" id="cP">Cancel</button><button class="btn primary" id="sP">Save</button>`);
  $("#cP").onclick=()=>{const f=pendingParty;pendingParty=null;closeDrawer();if(f)f(null)};
  $("#sP").onclick=async()=>{const fd=Object.fromEntries(new FormData($("#partyForm")));let bad=false;if(!fd.name.trim()){$("#f-name").closest(".f").classList.add("err");bad=true}if(!fd.state){$("#f-pstate").closest(".f").classList.add("err");bad=true}
    if(fd.gstin&&!/^[0-9A-Z]{15}$/i.test(fd.gstin.trim())){toast("GSTIN should be 15 letters and numbers",true);bad=true}if(bad)return;
    const nid=id||uid(isC?"cu":"ve");await put(col,nid,{...p,...fd,name:fd.name.trim(),gstin:(fd.gstin||"").trim().toUpperCase(),terms:+fd.terms||0});closeDrawer();toast(isC?"Customer saved":"Vendor saved");if(pendingParty){const f=pendingParty;pendingParty=null;f(nid)}};
  if(id)$("#delP").onclick=()=>{const used=list(isC?"sales":"bills").some(d=>d[isC?"customerId":"vendorId"]===id);if(used){toast("Has invoices, so it can't be deleted",true);return}confirmDlg("Delete?",esc(p.name)+" will be removed.","Delete",async()=>{await remove(col,id);closeDrawer()})};
}
let pendingParty=null;

/* ================= document editor (sales + vendor invoices) ================= */
function lineRow(kind,l,ix,editable,asOf){
  const items=list("items").filter(i=>i.active!==false||i.id===l.itemId).sort((a,b)=>a.name.localeCompare(b.name));
  const it=DB.items[l.itemId];
  let avail="";
  if(kind==="sale"&&it&&editable){const f=fefo(l.itemId,+l.qty||0,asOf);avail=`<div class="avail ${f.short>0?"":"muted"}" style="${f.short>0?"color:var(--bad)":""}">${f.short>0?"Only "+qf(f.available)+" available":qf(f.available)+" "+esc(it.unit)+" available"}</div>`}
  if(!editable){const c=l;return `<tr><td><b>${esc(it?.name||l.name||"")}</b><br><span class="small muted">${esc(it?.sku||"")}${it?.hsn?", HSN "+esc(it.hsn):""}${kind==="bill"&&l.batch?", batch "+esc(l.batch):""}${kind==="bill"&&l.exp?", exp "+fdate(l.exp):""}</span></td><td class="n">${qf(l.qty)}${kind==="bill"&&l.recvQty!=null&&+l.recvQty!==+l.qty?`<br><span class="small" style="color:var(--warn)">received ${qf(l.recvQty)}</span>`:""}</td><td class="n">${money(l.rate)}</td>${kind==="sale"?`<td class="n">${+l.disc||0}%</td>`:""}<td class="n">${+l.gst}%</td><td class="n">${money(c.taxable)}</td><td class="n">${money(c.total)}</td></tr>`}
  return `<tr data-ix="${ix}"><td style="min-width:200px"><select data-k="itemId" aria-label="Item"><option value="">Select item</option>${items.map(i=>`<option value="${i.id}" ${i.id===l.itemId?"selected":""}>${esc(i.name)}${i.pack?" – "+esc(i.pack):""}</option>`).join("")}</select>${avail}</td>
   <td class="n" style="width:90px"><input data-k="qty" type="number" step="any" min="0" value="${l.qty??""}" aria-label="Quantity"></td>
   <td class="n" style="width:110px"><input data-k="rate" type="number" step="any" min="0" value="${l.rate??""}" aria-label="Rate"></td>
   ${kind==="sale"?`<td class="n" style="width:70px"><input data-k="disc" type="number" step="any" min="0" max="100" value="${l.disc??0}" aria-label="Discount %"></td>`:""}
   <td style="width:84px"><select data-k="gst" aria-label="GST rate">${GST_RATES.map(r=>`<option value="${r}" ${+r===+(l.gst??0)?"selected":""}>${r}%</option>`).join("")}</select></td>
   ${kind==="bill"?`<td style="width:110px"><input data-k="batch" value="${esc(l.batch||"")}" placeholder="Batch" aria-label="Batch"></td><td style="width:140px"><input data-k="mfg" type="date" value="${l.mfg||""}" aria-label="Mfg date"></td><td style="width:140px"><input data-k="exp" type="date" value="${l.exp||""}" aria-label="Expiry date"></td>`:""}
   <td class="n line-total" style="width:120px">${money(l.total||0)}</td><td style="width:36px"><button type="button" class="del" data-del="${ix}" aria-label="Remove line">×</button></td></tr>`;
}
function docEditor(kind,d){
  const isS=kind==="sale",col=isS?"sales":"bills",parties=list(isS?"customers":"vendors").sort((a,b)=>a.name.localeCompare(b.name));
  const pKey=isS?"customerId":"vendorId";
  const state=()=>DB[isS?"customers":"vendors"][d[pKey]]?.state||"";
  if(!d.lines||!d.lines.length)d.lines=[{qty:1,disc:0,gst:5}];
  const head=`<div class="doc-head">
    <div class="f" style="grid-column:span 2"><label for="d-party">${isS?"Customer":"Vendor"}</label><div style="display:flex;gap:6px"><select id="d-party"><option value="">Select ${isS?"customer":"vendor"}</option>${parties.map(p=>`<option value="${p.id}" ${p.id===d[pKey]?"selected":""}>${esc(p.name)}${p.city?", "+esc(p.city):""}</option>`).join("")}</select><button class="btn" type="button" id="d-newparty" title="Add new">${ICON.plus}</button></div><div class="emsg">Choose a ${isS?"customer":"vendor"}</div></div>
    ${isS?"":`<div class="f"><label for="d-vno">Vendor's invoice no.</label><input id="d-vno" value="${esc(d.vendorNo||"")}"><div class="emsg">Required</div></div>`}
    <div class="f"><label for="d-date">${isS?"Invoice date":"Bill date"}</label><input id="d-date" type="date" value="${d.date}"></div>
    <div class="f"><label for="d-due">Due date</label><input id="d-due" type="date" value="${d.due||""}"></div>
    ${isS?`<div class="f"><label for="d-po">Customer PO / reference</label><input id="d-po" value="${esc(d.po||"")}"></div>`:""}
    <div class="f" style="grid-column:span ${isS?1:2}"><label>Place of supply</label><div id="d-pos" style="padding:.5em 0;font-weight:600"></div></div>
  </div>`;
  const cols=isS?`<th>Item</th><th class="n">Qty</th><th class="n">Rate ₹</th><th class="n">Disc %</th><th>GST</th><th class="n">Total</th><th></th>`:`<th>Item</th><th class="n">Qty</th><th class="n">Rate ₹</th><th>GST</th><th>Batch</th><th>Mfg</th><th>Expiry</th><th class="n">Total</th><th></th>`;
  const body=`${isS?setupNote():""}${head}<div class="card"><div class="tbl-wrap"><table class="lines"><thead><tr>${cols}</tr></thead><tbody id="d-lines"></tbody></table></div><div style="padding:10px"><button class="btn sm" type="button" id="d-add">${ICON.plus}Add line</button></div></div>
  <div class="totals"><div class="f"><label for="d-notes">Notes ${isS?"(printed on invoice)":""}</label><textarea id="d-notes" rows="4">${esc(d.notes||"")}</textarea>${isS?"":`<div class="hint" id="d-dupe"></div>`}</div><div class="tot" id="d-tot"></div></div>`;
  openDrawer(d.id?(isS?"Edit draft invoice":"Edit draft vendor invoice"):(isS?"New sales invoice":"New vendor invoice"),body,
    `<button class="btn" id="d-cancel">Cancel</button><button class="btn" id="d-save">Save draft</button><button class="btn primary" id="d-final">${isS?"Issue invoice":"Save and receive goods"}</button>`,{wide:true});
  const tb=$("#d-lines");
  const read=()=>{d[pKey]=$("#d-party").value;d.date=$("#d-date").value||todayISO();d.due=$("#d-due").value;d.notes=$("#d-notes").value;if(isS)d.po=$("#d-po").value;else d.vendorNo=$("#d-vno").value.trim()};
  const paint=()=>{const c=calc(d,state());tb.innerHTML=c.lines.map((l,ix)=>lineRow(kind,l,ix,true,d.date)).join("");
    const st=state();$("#d-pos").innerHTML=st?`${esc(st)} <span class="chip ${c.intra?"ok":"info"}">${c.intra?"CGST + SGST":"IGST"}</span>`:'<span class="muted">Choose a party</span>';
    $("#d-tot").innerHTML=`<div><span>Taxable value</span><span>${money(c.taxable)}</span></div>${c.intra?`<div><span>CGST</span><span>${money(c.cgst)}</span></div><div><span>SGST</span><span>${money(c.sgst)}</span></div>`:`<div><span>IGST</span><span>${money(c.igst)}</span></div>`}<div><span>Round off</span><span>${money(c.roundOff)}</span></div><div class="g"><span>Total</span><span>${money(c.grand)}</span></div><div class="words">Rupees ${words(c.grand)} only</div>`;
    if(!isS){const dup=d.vendorNo&&list("bills").find(b=>b.id!==d.id&&b.vendorId===d.vendorId&&(b.vendorNo||"").toLowerCase()===d.vendorNo.toLowerCase()&&b.status!=="Cancelled");$("#d-dupe").innerHTML=dup?`<span style="color:var(--bad);font-weight:700">Possible duplicate: ${esc(dup.no)} has the same vendor invoice number.</span>`:""}};
  const recalc=()=>{const c=calc(d,state());$$("tr[data-ix]",tb).forEach(tr=>{const l=c.lines[+tr.dataset.ix];tr.querySelector(".line-total").textContent=money(l.total);if(isS){const it=DB.items[l.itemId];const av=tr.querySelector(".avail");if(av&&it){const f=fefo(l.itemId,+l.qty||0,d.date);av.textContent=f.short>0?"Only "+qf(f.available)+" available":qf(f.available)+" "+it.unit+" available";av.style.color=f.short>0?"var(--bad)":"";av.className="avail"+(f.short>0?"":" muted")}}});
    $("#d-tot").innerHTML="";paintTot()};
  const paintTot=()=>{const c=calc(d,state());$("#d-tot").innerHTML=`<div><span>Taxable value</span><span>${money(c.taxable)}</span></div>${c.intra?`<div><span>CGST</span><span>${money(c.cgst)}</span></div><div><span>SGST</span><span>${money(c.sgst)}</span></div>`:`<div><span>IGST</span><span>${money(c.igst)}</span></div>`}<div><span>Round off</span><span>${money(c.roundOff)}</span></div><div class="g"><span>Total</span><span>${money(c.grand)}</span></div><div class="words">Rupees ${words(c.grand)} only</div>`};
  tb.addEventListener("input",e=>{const tr=e.target.closest("tr[data-ix]");if(!tr)return;const k=e.target.dataset.k,l=d.lines[+tr.dataset.ix];if(!k||k==="itemId")return;l[k]=e.target.type==="number"?e.target.value:e.target.value;if(k==="gst")l.gst=+e.target.value;recalc()});
  tb.addEventListener("change",e=>{const tr=e.target.closest("tr[data-ix]");if(!tr)return;const k=e.target.dataset.k,l=d.lines[+tr.dataset.ix];
    if(k==="itemId"){const it=DB.items[e.target.value];l.itemId=e.target.value;if(it){l.gst=+it.gst||0;l.rate=isS?(+it.price||""):(+it.cost||"");l.name=it.name;if(!isS&&it.shelf&&l.mfg&&!l.exp)l.exp=addDays(l.mfg,it.shelf)}paint()}
    if(k==="mfg"){l.mfg=e.target.value;const it=DB.items[l.itemId];if(it&&it.shelf&&!l.exp){l.exp=addDays(l.mfg,it.shelf);paint()}}
    if(k==="exp")l.exp=e.target.value;if(k==="gst"){l.gst=+e.target.value;recalc()}});
  tb.addEventListener("click",e=>{const b=e.target.closest("[data-del]");if(!b)return;d.lines.splice(+b.dataset.del,1);if(!d.lines.length)d.lines.push({qty:1,disc:0,gst:5});paint()});
  $("#d-add").onclick=()=>{d.lines.push({qty:1,disc:0,gst:5});paint();const sels=$$("select[data-k=itemId]",tb);sels[sels.length-1].focus()};
  $("#d-party").onchange=()=>{read();const p=DB[isS?"customers":"vendors"][d[pKey]];if(p&&p.terms!=null&&!d.dueTouched)$("#d-due").value=addDays(d.date,+p.terms||0),d.due=$("#d-due").value;paint()};
  $("#d-date").onchange=()=>{const old=d.date;read();const p=DB[isS?"customers":"vendors"][d[pKey]];if(!d.dueTouched){$("#d-due").value=addDays(d.date,p?+p.terms||0:S().terms);d.due=$("#d-due").value}paint()};
  $("#d-due").onchange=()=>{d.dueTouched=true;read()};
  if(!isS)$("#d-vno").oninput=()=>{read();paint()};
  $("#d-newparty").onclick=()=>{read();const snap=clone(d);pendingParty=nid=>{if(nid)snap[pKey]=nid;setTimeout(()=>docEditor(kind,snap),50)};openParty(isS?"customers":"vendors",null)};
  $("#d-cancel").onclick=closeDrawer;
  const validate=(final)=>{read();let ok=true;const pf=$("#d-party").closest(".f");pf.classList.toggle("err",!d[pKey]);if(!d[pKey])ok=false;
    if(!isS){const vf=$("#d-vno").closest(".f");vf.classList.toggle("err",final&&!d.vendorNo);if(final&&!d.vendorNo)ok=false}
    d.lines=d.lines.filter(l=>l.itemId||+l.qty||+l.rate);if(!d.lines.length){d.lines=[{qty:1,disc:0,gst:5}];paint();toast("Add at least one item",true);return false}
    if(final){for(const l of d.lines){if(!l.itemId||!(+l.qty>0)||!(+l.rate>=0)||l.rate===""){toast("Each line needs an item, a quantity above zero and a rate",true);return false}if(!isS&&!(l.batch||"").trim()&&DB.items[l.itemId]?.category!=="Packaging material"){toast(`Add a batch number for ${DB.items[l.itemId].name}`,true);return false}}}
    if(!ok)toast(isS?"Choose a customer":"Choose a vendor and enter their invoice number",true);return ok};
  $("#d-save").onclick=async()=>{if(!validate(false))return;const id=d.id||uid(isS?"si":"vb");await put(col,id,{...d,status:"Draft",createdAt:d.createdAt||new Date().toISOString()});closeDrawer();toast("Draft saved");isS?openSale(id):openBill(id)};
  $("#d-final").onclick=async()=>{if(!validate(true))return;const id=d.id||uid(isS?"si":"vb");if(isS){await put(col,id,{...d,status:"Draft",createdAt:d.createdAt||new Date().toISOString()});issueSale(id)}else{await put(col,id,{...d,status:"Draft",createdAt:d.createdAt||new Date().toISOString()});closeDrawer();receiveBill(id)}};
  paint();
}

/* ================= sales workflow ================= */
function newSale(){if(!list("items").length){toast("Add items before creating an invoice",true);location.hash="#items";return}docEditor("sale",{date:todayISO(),due:addDays(todayISO(),S().terms),lines:[]})}
function issueSale(id){
  const s=clone(DB.sales[id]);if(!S().state){toast("Set your company state in Company setup first",true);return}
  // allocate stock FEFO per line, considering earlier lines in this same invoice
  const alloc=[];const used={};const shortages=[];
  const rows=stockRows();
  for(const l of s.lines){const it=DB.items[l.itemId];let need=+l.qty;const bat=rows.filter(r=>r.itemId===l.itemId&&r.qty>0&&(!r.exp||r.exp>=s.date)).sort((a,b)=>(a.exp||"9999").localeCompare(b.exp||"9999"));
    for(const r of bat){const k=r.itemId+"|"+r.batch;const free=r2(r.qty-(used[k]||0));if(free<=0||need<=0)continue;const take=Math.min(free,need);alloc.push({itemId:l.itemId,batch:r.batch,exp:r.exp,qty:r2(take)});used[k]=r2((used[k]||0)+take);need=r2(need-take)}
    if(need>0)shortages.push(`${it.name}: short by ${qf(need)} ${it.unit}`)}
  if(shortages.length){dlg("Not enough stock",`<p style="margin-top:0">This invoice can't be issued because some items don't have enough unexpired stock:</p><ul>${shortages.map(x=>`<li>${esc(x)}</li>`).join("")}</ul><p class="small muted">Receive a vendor invoice or adjust stock, then issue again. The invoice is saved as a draft.</p>`,[{t:"Close",cls:"primary",fn:()=>{closeDrawer();openSale(id)}}]);return}
  const c=calc(s,custState(s));const no=nextNo("sales",S().salesPrefix||"AIV",s.date);
  confirmDlg(`Issue ${no}?`,`Total ${money(c.grand)} to ${esc(DB.customers[s.customerId].name)}. Stock will be deducted first-expiry-first from ${alloc.length} batch line(s). Issued invoices can't be edited, only cancelled.`,"Issue invoice",async()=>{
    await put("sales",id,{...s,no,status:"Issued",alloc,issuedAt:new Date().toISOString(),totalSnapshot:c.grand});closeDrawer();toast(`${no} issued`);openSale(id)},"");
}
function payDlg(col,id){const d=DB[col][id];const c=calc(d,col==="sales"?custState(d):vendState(d));
  dlg(col==="sales"?"Record payment received":"Record payment made",`<form class="form" id="payForm" style="grid-template-columns:1fr 1fr">
    <div class="f"><label for="p-amt">Amount ₹</label><input id="p-amt" type="number" step="any" value="${c.balance}"></div><div class="f"><label for="p-date">Date</label><input id="p-date" type="date" value="${todayISO()}"></div>
    <div class="f"><label for="p-mode">Mode</label><select id="p-mode">${["Bank transfer (NEFT/RTGS/IMPS)","UPI","Cheque","Cash","Card","Adjustment / credit note"].map(m=>`<option>${m}</option>`).join("")}</select></div><div class="f"><label for="p-ref">Reference / UTR</label><input id="p-ref"></div>
    <p class="full small muted" style="margin:0">Balance due ${money(c.balance)}</p></form>`,
    [{t:"Cancel"},{t:"Save payment",cls:"primary",fn:async()=>{const amt=r2($("#p-amt").value);if(!(amt>0)){toast("Enter an amount above zero",true);return false}if(amt>c.balance+0.001){toast(`That's more than the balance of ${money(c.balance)}`,true);return false}
      const n=clone(d);n.payments=[...(n.payments||[]),{id:uid("pay"),amount:amt,date:$("#p-date").value||todayISO(),mode:$("#p-mode").value,ref:$("#p-ref").value}];const bal=r2(c.balance-amt);n.status=bal<=0?"Paid":"Partially paid";await put(col,id,n);toast(bal<=0?"Fully paid":"Payment recorded");col==="sales"?openSale(id):openBill(id)}}]);}
function openSale(id){const s=DB.sales[id];if(!s)return;const cu=DB.customers[s.customerId]||{};const c=calc(s,cu.state);const st=saleStatus(s);
  if(s.status==="Draft"){
    openDrawer(`Draft invoice`,`${steps(["Draft","Issued","Paid"],0)}<div class="meta"><div><small>Customer</small><b>${esc(cu.name||"–")}</b></div><div><small>Date</small><b>${fdate(s.date)}</b></div><div><small>Total</small><b>${money(c.grand)}</b></div></div>${linesTable("sale",c)}`,
      `<button class="btn danger" id="sDel">Delete draft</button><button class="btn" id="sEdit">Edit</button><button class="btn primary" id="sIssue">Issue invoice</button>`,{wide:true});
    $("#sDel").onclick=()=>confirmDlg("Delete draft?","This draft will be removed.","Delete",async()=>{await remove("sales",id);closeDrawer()});
    $("#sEdit").onclick=()=>docEditor("sale",clone(s));$("#sIssue").onclick=()=>issueSale(id);return}
  const idx=s.status==="Cancelled"?-1:s.status==="Paid"?2:1;
  openDrawer(s.no,`${s.status==="Cancelled"?`<div class="alertbar" style="background:var(--bad-bg);color:var(--bad)">Cancelled on ${fdate((s.cancelledAt||"").slice(0,10))}: ${esc(s.cancelReason||"")}. Stock from this invoice is back in inventory.</div>`:steps(["Draft","Issued","Paid"],idx)}
   <div class="meta"><div><small>Status</small>${chip(st)}</div><div><small>Total</small><b>${money(c.grand)}</b></div><div><small>Received</small><b>${money(c.paid)}</b></div><div><small>Balance</small><b>${money(c.balance)}</b></div><div><small>Due</small><b>${fdate(s.due)}</b></div></div>
   ${invoiceHTML(s)}
   ${(s.payments||[]).length?`<h3 style="margin:18px 0 6px">Payments</h3><div class="pay-list">${s.payments.map(p=>`<div><span>${fdate(p.date)}, ${esc(p.mode)}${p.ref?", "+esc(p.ref):""}</span><b class="num">${money(p.amount)}</b></div>`).join("")}</div>`:""}
   ${(s.alloc||[]).length?`<h3 style="margin:18px 0 6px">Stock issued (first expiry first out)</h3><div class="pay-list">${s.alloc.map(a=>`<div><span>${esc(DB.items[a.itemId]?.name||"")}, batch ${esc(a.batch)}${a.exp?", exp "+fdate(a.exp):""}</span><b class="num">${qf(a.qty)}</b></div>`).join("")}</div>`:""}`,
   `${s.status!=="Cancelled"&&!(s.payments||[]).length?'<button class="btn danger" id="sCancel">Cancel invoice</button>':""}<button class="btn" id="sDup">Duplicate</button><button class="btn" id="sDl">${ICON.dl}Download</button><button class="btn" id="sPrint">${ICON.print}Print</button>${["Issued","Partially paid"].includes(s.status)?'<button class="btn primary" id="sPay">Record payment</button>':""}`,{wide:true});
  $("#sDup").onclick=()=>{const n=clone(s);delete n.id;delete n.no;delete n.alloc;delete n.payments;delete n.issuedAt;delete n.cancelledAt;delete n.cancelReason;n.status="Draft";n.date=todayISO();n.due=addDays(n.date,cu.terms??S().terms);docEditor("sale",n)};
  $("#sPrint").onclick=()=>printDoc(invoiceHTML(s));$("#sDl").onclick=()=>downloadDoc(s);
  if($("#sPay"))$("#sPay").onclick=()=>payDlg("sales",id);
  if($("#sCancel"))$("#sCancel").onclick=()=>dlg(`Cancel ${s.no}?`,`<div class="f"><label for="cr">Reason</label><input id="cr" placeholder="e.g. Order cancelled by customer"></div><p class="small muted">Stock returns to inventory. The invoice number stays used and is marked cancelled.</p>`,[{t:"Keep invoice"},{t:"Cancel invoice",cls:"primary danger",fn:async()=>{const r=$("#cr").value.trim();if(!r){toast("Enter a reason",true);return false}await put("sales",id,{...clone(s),status:"Cancelled",cancelReason:r,cancelledAt:new Date().toISOString()});toast("Invoice cancelled");openSale(id)}}]);
}
function steps(arr,now){return `<ol class="steps">${arr.map((x,i)=>`<li class="${i<now?"done":i===now?"now":""}"><i>${i<now?"✓":i+1}</i>${x}</li>`).join("")}</ol>`}
function linesTable(kind,c){return `<div class="card"><div class="tbl-wrap"><table><thead><tr><th>Item</th><th class="n">Qty</th><th class="n">Rate</th>${kind==="sale"?'<th class="n">Disc</th>':""}<th class="n">GST</th><th class="n">Taxable</th><th class="n">Total</th></tr></thead><tbody>${c.lines.map((l,i)=>lineRow(kind,l,i,false)).join("")}</tbody></table></div></div>`}
function invoiceHTML(s){const S0=S(),cu=DB.customers[s.customerId]||{},c=calc(s,cu.state);
  return `<div class="inv-print"><div class="inv-top"><div><img src="/assets/aivar/aivar-ops-002.png" alt="${esc(S0.company)}"><div style="margin-top:8px;font-size:12px;line-height:1.5"><b>${esc(S0.company)}</b><br>${esc(S0.address)}<br>${S0.gstin?"GSTIN: "+esc(S0.gstin)+"<br>":""}${esc(S0.state)}${S0.phone?"<br>"+esc(S0.phone):""}${S0.email?" | "+esc(S0.email):""}</div></div>
  <div style="text-align:right"><h1>${s.status==="Cancelled"?"CANCELLED ":""}Tax Invoice</h1><div style="margin-top:6px;line-height:1.7">Invoice no. <b>${esc(s.no||"Draft")}</b><br>Date: ${fdate(s.date)}<br>Due: ${fdate(s.due)}${s.po?"<br>PO: "+esc(s.po):""}</div></div></div>
  <div class="inv-parties"><div><small style="color:#666">Bill to</small><br><b>${esc(cu.name)}</b><br>${esc([cu.address,cu.city].filter(Boolean).join(", "))}<br>${cu.gstin?"GSTIN: "+esc(cu.gstin):"Unregistered"}</div><div><small style="color:#666">Place of supply</small><br><b>${esc(cu.state||"")}</b><br>${c.intra?"Intra-state: CGST + SGST":"Inter-state: IGST"}</div></div>
  <table><thead><tr><th>#</th><th>Item</th><th>HSN</th><th style="text-align:right">Qty</th><th style="text-align:right">Rate</th><th style="text-align:right">Disc</th><th style="text-align:right">Taxable</th><th style="text-align:right">GST</th><th style="text-align:right">Amount</th></tr></thead><tbody>${c.lines.map((l,i)=>{const it=DB.items[l.itemId]||{};return `<tr><td>${i+1}</td><td>${esc(it.name||l.name||"")}${it.pack?"<br><small>"+esc(it.pack)+"</small>":""}</td><td>${esc(it.hsn||"")}</td><td style="text-align:right">${qf(l.qty)} ${esc(it.unit||"")}</td><td style="text-align:right">${money(l.rate)}</td><td style="text-align:right">${+l.disc||0}%</td><td style="text-align:right">${money(l.taxable)}</td><td style="text-align:right">${+l.gst}%</td><td style="text-align:right">${money(l.total)}</td></tr>`}).join("")}</tbody></table>
  <div style="display:flex;justify-content:space-between;gap:20px;margin-top:14px"><div style="font-size:12px;max-width:55%"><b>Amount in words:</b> Rupees ${words(c.grand)} only${s.notes?`<br><br><b>Notes:</b> ${esc(s.notes)}`:""}${S0.bank?`<br><br><b>Bank details:</b> ${esc(S0.bank)}`:""}</div>
  <table style="width:280px"><tbody><tr><td>Taxable value</td><td style="text-align:right">${money(c.taxable)}</td></tr>${c.intra?`<tr><td>CGST</td><td style="text-align:right">${money(c.cgst)}</td></tr><tr><td>SGST</td><td style="text-align:right">${money(c.sgst)}</td></tr>`:`<tr><td>IGST</td><td style="text-align:right">${money(c.igst)}</td></tr>`}<tr><td>Round off</td><td style="text-align:right">${money(c.roundOff)}</td></tr><tr><td><b>Total</b></td><td style="text-align:right"><b>${money(c.grand)}</b></td></tr></tbody></table></div>
  <p style="margin-top:28px;font-size:11px;color:#666;text-align:right">For ${esc(S0.company)}<br><br><br>Authorised signatory</p></div>`}
function printDoc(html){$("#printArea").innerHTML=html;try{window.print()}catch(e){toast("Printing isn't available here. Use Download instead.",true)}}

/* ================= vendor invoice workflow ================= */
function newBill(){if(!list("items").length){toast("Add items before recording a vendor invoice",true);location.hash="#items";return}docEditor("bill",{date:todayISO(),due:addDays(todayISO(),30),lines:[]})}
function receiveBill(id){const b=clone(DB.bills[id]);
  dlg("Goods receipt",`<p style="margin-top:0">Check what arrived against ${esc(b.vendorNo||"the vendor invoice")}. Received quantities go into stock with their batch and expiry.</p>
   <div class="f" style="margin-bottom:10px"><label for="r-date">Received on</label><input id="r-date" type="date" value="${todayISO()}"></div>
   <table class="lines"><thead><tr><th>Item</th><th class="n">Billed</th><th class="n">Received</th></tr></thead><tbody>${b.lines.map((l,i)=>`<tr><td>${esc(DB.items[l.itemId]?.name||"")}<br><span class="small muted">${esc(l.batch||"")}${l.exp?", exp "+fdate(l.exp):""}</span></td><td class="n">${qf(l.qty)}</td><td class="n" style="width:100px"><input type="number" step="any" min="0" data-rq="${i}" value="${l.qty}" aria-label="Received quantity"></td></tr>`).join("")}</tbody></table>`,
   [{t:"Later",fn:()=>openBill(id)},{t:"Confirm receipt",cls:"primary",fn:async()=>{let diff=false;$$("[data-rq]").forEach(inp=>{const l=b.lines[+inp.dataset.rq];l.recvQty=Math.max(0,+inp.value||0);if(l.recvQty!==+l.qty)diff=true});
     b.no=b.no||nextNo("bills",S().billPrefix||"BILL",b.date);b.status="Received";b.recvDate=$("#r-date").value||todayISO();b.mismatch=diff;await put("bills",id,b);toast(diff?"Received with differences: check before approving":"Goods received into stock");openBill(id)}}]);
}
function openBill(id){const b=DB.bills[id];if(!b)return;const v=DB.vendors[b.vendorId]||{};const c=calc(b,v.state);const st=billStatus(b);
  const order=["Draft","Received","Approved","Paid"];const idx=b.status==="Cancelled"?-1:b.status==="Partially paid"?3:order.indexOf(b.status);
  const actions=[];
  if(b.status==="Draft")actions.push('<button class="btn danger" id="bDel">Delete draft</button><button class="btn" id="bEdit">Edit</button><button class="btn primary" id="bRecv">Receive goods</button>');
  if(b.status==="Received")actions.push('<button class="btn danger" id="bCancel">Cancel</button><button class="btn primary" id="bApprove">Approve for payment</button>');
  if(["Approved","Partially paid"].includes(b.status))actions.push('<button class="btn primary" id="bPay">Record payment</button>');
  openDrawer(b.no||"Draft vendor invoice",`${b.status==="Cancelled"?`<div class="alertbar" style="background:var(--bad-bg);color:var(--bad)">Cancelled: ${esc(b.cancelReason||"")}. Its stock has been removed.</div>`:steps(["Draft","Goods received","Approved","Paid"],idx)}
   ${b.mismatch&&b.status==="Received"?`<div class="alertbar">⚠ Received quantities differ from the vendor invoice. Raise a debit note or get a revised invoice before approving payment.</div>`:""}
   <div class="meta"><div><small>Vendor</small><b>${esc(v.name||"–")}</b></div><div><small>Vendor invoice no.</small><b>${esc(b.vendorNo||"–")}</b></div><div><small>Bill date</small><b>${fdate(b.date)}</b></div><div><small>Status</small>${chip(st)}</div><div><small>Total</small><b>${money(c.grand)}</b></div><div><small>Paid</small><b>${money(c.paid)}</b></div><div><small>Balance</small><b>${money(c.balance)}</b></div><div><small>Due</small><b>${fdate(b.due)}</b></div>${b.recvDate?`<div><small>Received on</small><b>${fdate(b.recvDate)}</b></div>`:""}${b.approvedAt?`<div><small>Approved on</small><b>${fdate(b.approvedAt.slice(0,10))}</b></div>`:""}</div>
   ${linesTable("bill",c)}
   <div class="totals"><div class="small muted">${esc(b.notes||"")}</div><div class="tot"><div><span>Taxable value</span><span>${money(c.taxable)}</span></div>${c.intra?`<div><span>CGST (input)</span><span>${money(c.cgst)}</span></div><div><span>SGST (input)</span><span>${money(c.sgst)}</span></div>`:`<div><span>IGST (input)</span><span>${money(c.igst)}</span></div>`}<div><span>Round off</span><span>${money(c.roundOff)}</span></div><div class="g"><span>Total</span><span>${money(c.grand)}</span></div></div></div>
   ${(b.payments||[]).length?`<h3 style="margin:18px 0 6px">Payments</h3><div class="pay-list">${b.payments.map(p=>`<div><span>${fdate(p.date)}, ${esc(p.mode)}${p.ref?", "+esc(p.ref):""}</span><b class="num">${money(p.amount)}</b></div>`).join("")}</div>`:""}`,
   actions.join(""),{wide:true});
  if($("#bDel"))$("#bDel").onclick=()=>confirmDlg("Delete draft?","This draft will be removed.","Delete",async()=>{await remove("bills",id);closeDrawer()});
  if($("#bEdit"))$("#bEdit").onclick=()=>docEditor("bill",clone(b));
  if($("#bRecv"))$("#bRecv").onclick=()=>{const c2=clone(b);if(!c2.vendorNo||c2.lines.some(l=>!l.itemId||!(+l.qty>0))){toast("Complete the vendor invoice number and lines first",true);docEditor("bill",c2);return}receiveBill(id)};
  if($("#bApprove"))$("#bApprove").onclick=()=>confirmDlg("Approve for payment?",`${money(c.grand)} to ${esc(v.name)}, due ${fdate(b.due)}.`,"Approve",async()=>{await put("bills",id,{...clone(b),status:"Approved",approvedAt:new Date().toISOString()});toast("Approved for payment");openBill(id)},"");
  if($("#bPay"))$("#bPay").onclick=()=>payDlg("bills",id);
  if($("#bCancel"))$("#bCancel").onclick=()=>{
    // can't cancel if its stock has already been sold
    const rows=stockRows();const problem=b.lines.find(l=>{const r=rows.find(x=>x.itemId===l.itemId&&x.batch===(l.batch||"NO-BATCH"));return !r||r.qty<(+(l.recvQty??l.qty)||0)});
    if(problem){toast(`Can't cancel: some of ${DB.items[problem.itemId]?.name} from this receipt is already sold or adjusted.`,true);return}
    dlg("Cancel vendor invoice?",`<div class="f"><label for="cr2">Reason</label><input id="cr2" placeholder="e.g. Goods returned to vendor"></div>`,[{t:"Keep"},{t:"Cancel invoice",cls:"primary danger",fn:async()=>{const r=$("#cr2").value.trim();if(!r){toast("Enter a reason",true);return false}await put("bills",id,{...clone(b),status:"Cancelled",cancelReason:r});toast("Vendor invoice cancelled");openBill(id)}}])};
}

/* ================= exports ================= */
let dlh=null;
async function save(filename,data){if(!dlh&&window.claude&&claude.use){try{dlh=await claude.use("downloads")}catch(e){}}
  if(!dlh){toast("Downloads aren't available in this view",true);return}
  try{await dlh.save({filename,data})}catch(e){if(e&&e.code!=="declined")toast("Couldn't save the file: "+(e.code||"error"),true)}}
const csv=rows=>rows.map(r=>r.map(v=>{v=String(v??"");return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v}).join(",")).join("\n");
function downloadDoc(s){const html=`<!doctype html><html><head><meta charset="utf-8"><title>${esc(s.no)}</title><style>body{font-family:Arial,sans-serif;margin:24px;color:#111}table{width:100%;border-collapse:collapse;font-size:12px}th,td{border-bottom:1px solid #ddd;padding:6px;text-align:left}th{background:#F2F6EE}.inv-top{display:flex;justify-content:space-between}.inv-top img{height:34px}.inv-parties{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:16px 0}.inv-parties div{background:#F7F9F5;padding:10px;border-radius:8px}h1{color:#0B4D1B;margin:0}</style></head><body>${invoiceHTML(s)}<script>window.print&&setTimeout(()=>window.print(),400)<\/script></body></html>`;save(`${s.no.replace(/\//g,"-")}.html`,html)}
const ACT={
  newItem:()=>newItem(),newAdj:()=>openAdj(),newSale,newBill,newCustomer:()=>openParty("customers"),newVendor:()=>openParty("vendors"),
  exportSales(){const r=[["Invoice no","Date","Customer","GSTIN","State","Taxable","CGST","SGST","IGST","Round off","Total","Paid","Balance","Status"]];list("sales").filter(s=>s.status!=="Draft").sort((a,b)=>(a.date||"").localeCompare(b.date||"")).forEach(s=>{const cu=DB.customers[s.customerId]||{};const c=calc(s,cu.state);r.push([s.no,s.date,cu.name,cu.gstin,cu.state,c.taxable,c.cgst,c.sgst,c.igst,c.roundOff,c.grand,c.paid,c.balance,saleStatus(s)])});save(`sales-register-${todayISO()}.csv`,csv(r))},
  exportBills(){const r=[["Our ref","Vendor invoice no","Bill date","Vendor","GSTIN","State","Taxable","CGST","SGST","IGST","Total","Paid","Balance","Status"]];list("bills").filter(b=>b.status!=="Draft").sort((a,b)=>(a.date||"").localeCompare(b.date||"")).forEach(b=>{const v=DB.vendors[b.vendorId]||{};const c=calc(b,v.state);r.push([b.no,b.vendorNo,b.date,v.name,v.gstin,v.state,c.taxable,c.cgst,c.sgst,c.igst,c.grand,c.paid,c.balance,billStatus(b)])});save(`purchase-register-${todayISO()}.csv`,csv(r))},
  exportStock(){const st=itemStats();const r=[["SKU","Item","Category","Unit","HSN","GST %","On hand","Reorder level","Avg cost","Stock value"]];list("items").forEach(i=>{const s=st[i.id];r.push([i.sku,i.name,i.category,i.unit,i.hsn,i.gst,s.onHand,i.reorder,r2(s.avgCost),s.value])});save(`stock-summary-${todayISO()}.csv`,csv(r))},
  exportBatches(){const r=[["SKU","Item","Batch","Mfg date","Expiry","Days to expiry","Qty"]];stockRows().filter(x=>x.qty!==0).forEach(x=>{const i=DB.items[x.itemId]||{};r.push([i.sku,i.name,x.batch,x.mfg,x.exp,x.exp?daysBetween(todayISO(),x.exp):"",x.qty])});save(`batch-expiry-${todayISO()}.csv`,csv(r))},
  exportJSON(){save(`aivar-operations-backup-${todayISO()}.json`,JSON.stringify(DB,null,2))},
  wipe(){confirmDlg("Delete all data?","Every item, invoice, customer, vendor and adjustment will be permanently deleted for everyone. Download a backup first if you might need it.","Delete everything",async()=>{for(const c of COLS)for(const id of Object.keys(DB[c]))await remove(c,id);toast("All data deleted")})},
  removeDemo(){const isDemo=s=>/DEMO/.test(s||"");const dc=new Set(list("customers").filter(c=>isDemo(c.name)).map(c=>c.id)),dv=new Set(list("vendors").filter(v=>isDemo(v.name)).map(v=>v.id)),di=new Set(list("items").filter(i=>isDemo(i.sku)).map(i=>i.id));
    const realUse=list("sales").some(s=>!dc.has(s.customerId)&&(s.lines||[]).some(l=>di.has(l.itemId)))||list("bills").some(b=>!dv.has(b.vendorId)&&(b.lines||[]).some(l=>di.has(l.itemId)));
    if(realUse){toast("Some of your own invoices use demo items, so demo data can't be removed automatically.",true);return}
    confirmDlg("Remove demo data?","All records marked DEMO will be deleted.","Remove",async()=>{for(const s of list("sales").filter(s=>dc.has(s.customerId)))await remove("sales",s.id);for(const b of list("bills").filter(b=>dv.has(b.vendorId)))await remove("bills",b.id);for(const a of list("adjustments").filter(a=>di.has(a.itemId)))await remove("adjustments",a.id);for(const id of di)await remove("items",id);for(const id of dc)await remove("customers",id);for(const id of dv)await remove("vendors",id);toast("Demo data removed")})},
  demo(){if(list("items").length||list("sales").length||list("bills").length){confirmDlg("Add demo data?","Demo records will be added next to your existing data. They are marked DEMO so you can delete them later.","Add demo data",loadDemo,"");return}loadDemo()}
};
$("#newSale").onclick=newSale;$("#newBill").onclick=newBill;
$("#menuBtn").onclick=()=>{$("#side").classList.add("on");scrim.classList.add("on")};
$("#themeBtn").onclick=()=>{const dark=document.documentElement.dataset.theme?document.documentElement.dataset.theme==="dark":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.dataset.theme=dark?"light":"dark";try{localStorage.setItem("aivar-ops-theme",document.documentElement.dataset.theme)}catch(e){}};
try{const th=localStorage.getItem("aivar-ops-theme");if(th)document.documentElement.dataset.theme=th}catch(e){}

/* ================= demo data (clearly marked) ================= */
async function loadDemo(){
  const t=todayISO();
  const it=[["DEMO-DG-200","DateGo date spread, Classic","Date spreads","jar","200 g jar","2007",5,180,110,40,270],["DEMO-DG-400","DateGo date spread, Cocoa","Date spreads","jar","400 g jar","2007",5,320,200,30,270],["DEMO-MK-70","Roasted makhana, Peri peri","Makhana","pack","70 g pack","2008",5,110,62,60,180],["DEMO-MC-60","Makhana chips, Masala","Makhana chips","pack","60 g pack","2106",12,75,40,80,150],["DEMO-PO-1L","Refined palm oil","Oils & dressings","bottle","1 L bottle","1511",5,140,118,50,270],["DEMO-PO-15","Refined palm oil","Oils & dressings","tin","15 kg tin","1511",5,1950,1720,10,365],["DEMO-PK-PCH","Stand-up pouch 250 g","Packaging material","pcs","Printed pouch","3923",18,0,4,2000,0]];
  const ids={};for(const r of it){const id=uid("it");ids[r[0]]=id;await put("items",id,{sku:r[0],name:r[1]+" (DEMO)",category:r[2],unit:r[3],pack:r[4],hsn:r[5],gst:r[6],price:r[7],cost:r[8],reorder:r[9],shelf:r[10],active:true})}
  const cu1=uid("cu"),cu2=uid("cu"),ve1=uid("ve"),ve2=uid("ve");const home=S().state||"Telangana";const other=home==="Karnataka"?"Maharashtra":"Karnataka";
  await put("customers",cu1,{name:"DEMO Green Basket Retail",type:"Retailer",state:home,city:"Demo city",terms:15,phone:"",email:""});
  await put("customers",cu2,{name:"DEMO Campus Canteen Services",type:"Education",state:other,city:"Demo city",terms:30});
  await put("vendors",ve1,{name:"DEMO Foods Co-packer",category:"Finished goods",state:home,city:"Demo city",terms:30});
  await put("vendors",ve2,{name:"DEMO Edible Oils Supplier",category:"Oil",state:other,city:"Demo city",terms:21});
  const d=n=>addDays(t,n);
  const b1=uid("vb");await put("bills",b1,{vendorId:ve1,vendorNo:"DEMO-INV-1101",no:`${S().billPrefix||"BILL"}/${fy(d(-40))}/0001`,date:d(-40),due:d(-10),recvDate:d(-39),status:"Paid",approvedAt:new Date().toISOString(),lines:[{itemId:ids["DEMO-DG-200"],qty:200,recvQty:200,rate:110,gst:5,batch:"DG2401",mfg:d(-45),exp:d(225)},{itemId:ids["DEMO-MK-70"],qty:300,recvQty:300,rate:62,gst:5,batch:"MK2402",mfg:d(-50),exp:d(20)},{itemId:ids["DEMO-MC-60"],qty:300,recvQty:300,rate:40,gst:12,batch:"MC2401",mfg:d(-60),exp:d(-3)}],payments:[{id:uid("pay"),amount:Math.round(200*110*1.05+300*62*1.05+300*40*1.12),date:d(-12),mode:"Bank transfer (NEFT/RTGS/IMPS)",ref:"DEMO-UTR"}]});
  const b2=uid("vb");await put("bills",b2,{vendorId:ve2,vendorNo:"DEMO-OIL-77",no:`${S().billPrefix||"BILL"}/${fy(d(-8))}/0002`,date:d(-8),due:d(13),recvDate:d(-7),status:"Approved",approvedAt:new Date().toISOString(),lines:[{itemId:ids["DEMO-PO-1L"],qty:240,recvQty:240,rate:118,gst:5,batch:"PO1L-11",mfg:d(-15),exp:d(250)},{itemId:ids["DEMO-PO-15"],qty:20,recvQty:20,rate:1720,gst:5,batch:"PO15-07",mfg:d(-20),exp:d(345)}]});
  const b3=uid("vb");await put("bills",b3,{vendorId:ve1,vendorNo:"DEMO-INV-1188",date:d(-1),due:d(29),status:"Draft",lines:[{itemId:ids["DEMO-DG-400"],qty:120,rate:200,gst:5,batch:"DG2405",mfg:d(-3),exp:d(267)}]});
  await put("adjustments",uid("adj"),{itemId:ids["DEMO-PK-PCH"],reason:"Opening stock",date:d(-30),batch:"NO-BATCH",qty:1500,cost:4,note:"DEMO opening balance"});
  const s1=uid("si");await put("sales",s1,{customerId:cu1,no:`${S().salesPrefix||"AIV"}/${fy(d(-20))}/0001`,date:d(-20),due:d(-5),status:"Partially paid",lines:[{itemId:ids["DEMO-DG-200"],qty:60,rate:180,disc:5,gst:5},{itemId:ids["DEMO-MK-70"],qty:120,rate:110,disc:0,gst:5}],alloc:[{itemId:ids["DEMO-DG-200"],batch:"DG2401",exp:d(225),qty:60},{itemId:ids["DEMO-MK-70"],batch:"MK2402",exp:d(20),qty:120}],payments:[{id:uid("pay"),amount:10000,date:d(-6),mode:"UPI",ref:"DEMO"}]});
  const s2=uid("si");await put("sales",s2,{customerId:cu2,no:`${S().salesPrefix||"AIV"}/${fy(d(-3))}/0002`,date:d(-3),due:d(27),status:"Issued",lines:[{itemId:ids["DEMO-PO-15"],qty:6,rate:1950,disc:0,gst:5},{itemId:ids["DEMO-PO-1L"],qty:48,rate:140,disc:2,gst:5}],alloc:[{itemId:ids["DEMO-PO-15"],batch:"PO15-07",exp:d(345),qty:6},{itemId:ids["DEMO-PO-1L"],batch:"PO1L-11",exp:d(250),qty:48}]});
  toast("Demo data loaded. Records are marked DEMO.");if(!S().state)toast("Demo loaded. Set your company state in Company setup.");
}

boot();render();
})();
