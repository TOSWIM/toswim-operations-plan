'use strict';
const NETS=['x','instagram','facebook','youtube','pinterest','tiktok'];
const LABELS={x:'X',instagram:'Instagram',facebook:'Facebook',youtube:'YouTube',pinterest:'Pinterest',tiktok:'TikTok'};
const ROLES={
 x:{role:'观点与选题的试验场',audience:'海外华人为主；其中关注品牌、产品和设计判断的读者，是待检验的细分受众假设。',focus:'短观点、清晰问题、简洁的创意视频说明。以X为共同选题基准。',adapt:'开头直接提出观察或问题，保留准确限定；英文短正文与可核验视频对应。',signal:'公开帖Views、回复、转发、收藏；服务商曝光另列。'},
 instagram:{role:'可辨识的视觉名片',audience:'海外华人为主；可能对设计、泳具与水边生活感兴趣的视觉内容读者。',focus:'连贯的Reels表达、同作封面与清楚的品牌辨识。',adapt:'画面吸引注意，英文正文补足故事与事实边界；封面按实际可用入口保存核对。',signal:'视频观看、触达、收藏、分享；不把三秒观看率当完播。'},
 facebook:{role:'完整故事与讨论承接',audience:'海外华人为主；愿意阅读完整叙述、围绕品牌和生活场景交流的潜在读者。',focus:'让动画、产品或主理人观察有完整上下文。',adapt:'保留完整英文叙述与必要限定，以正常原帖页核对主页作者和视频。',signal:'视频观看、有效互动与触达；未支持的字段保留未知。'},
 youtube:{role:'逐步积累的视频资产库',audience:'海外华人为主；通过Shorts发现品牌，并愿意进一步了解作品的人。',focus:'可检索的英文标题、清楚的作品说明、连续的主题资产。',adapt:'Shorts标题与说明分别校对，原片与配乐按适用范围保留。',signal:'公开观看与服务商指标分列；engaged、APV、订阅等未见就留空。'},
 pinterest:{role:'面向发现与收藏的长尾入口',audience:'海外华人为主；寻找视觉灵感、设计参考和水边生活点子的人。',focus:'主题图板、清晰英文标题与可理解的视频Pin。',adapt:'以平台标题和描述表达主题；使用经授权的同作品封面或逐片选帧。',signal:'曝光、MRC视频观看、收藏、Pin点击及出站点击，各自保留定义。'},
 tiktok:{role:'动态创意的发现入口',audience:'海外华人为主；通过短视频节奏与鲜明创意首次认识品牌的潜在读者。',focus:'让已有创意原片在正常原生路径中稳定执行。',adapt:'使用已有授权原片、英文正文与同作封面；必要品牌和平台披露按事实处理。',signal:'Studio累计视频观看、赞和评论；不等同公开或独立观看。'}
};
let DATA=null, selectedPlatform='x', selectedDay=null, filter='all';
const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=(v,opt={})=>v?new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false,...opt}).format(new Date(v)):'未知';
const currentDate=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const stateOf=p=>!p||p.state==='uncreated'?'uncreated':p.state==='verified'?'verified':p.state==='held'?'held':p.scheduledAt&&new Date(p.scheduledAt)<=new Date()?'due':'scheduled';
const names={verified:'已验',scheduled:'未来',due:'待核',held:'暂停',uncreated:'未建'};
function derive(){
 const make=()=>({native:0,future:0,due:0,held:0,uncreated:0});const w=make(),d=make(),per=Object.fromEntries(NETS.map(n=>[n,make()]));const today=currentDate();
 for(const row of DATA.rows)for(const n of NETS){const s=stateOf(row.platforms[n]),k=s==='verified'?'native':s==='scheduled'?'future':s;w[k]++;per[n][k]++;if(row.date===today)d[k]++;}
 return {w,d,per,today,coverage:w.native+w.future+w.due,target:DATA.rows.length*6};
}
function renderSnapshot(){
 const v=derive(),s=DATA.snapshot,dayInWeek=DATA.rows.some(r=>r.date===v.today),saved=s.weekCounts,mSaved=s.metricCheckpoints;
 $('#saved-snapshot').textContent=`保存快照（${s.operatingDate}）：当日${s.day.native}条原帖已核验；${s.week} ${saved.native}已验 + ${saved.future}未来 + ${saved.due}待核 = ${saved.coverage}/${saved.target}有效覆盖。普通观察${mSaved.ordinary}、点名观察${mSaved.direct}、W42历史${mSaved.W42}个检查点。各数字保留原核验时间；运营证据与策略更新分别记录。`;
 $('#evidence-time').textContent=`证据分类：${fmt(s.asOf)} · 北京时间`;
 const banner=$('#freshness');banner.classList.toggle('attention',v.w.due>0||!dayInWeek);
 banner.textContent=!dayInWeek?'当前日期已超出此份已准备周表。请以新一轮已登记周表更新结果为准；此页保留原有证据。':v.w.due?`当前有${v.w.due}条既有预约已到点、尚待新原帖核验。到点只标“待核”，不会自动判定已发或失败。`:`当前时间下，本周保存记录中没有到点待核项。原帖结果来自最近已登记回执，未来预约仍单独展示。`;
 banner.textContent='以下仅按当前浏览器时间推算既有预约是否到点，不刷新运营证据。'+banner.textContent;
 const reviewNotes=DATA.rows.flatMap(row=>NETS.flatMap(n=>{const p=row.platforms[n];return stateOf(p)==='due'&&p.reviewStatus==='under_review_owner_only'?[`${LABELS[n]}《${row.theme}》：内容审查中／仅自己可见（${fmt(p.reviewObservedAt)}观察），尚未计为公开发布。`]:[];}));if(reviewNotes.length)banner.textContent+=' '+reviewNotes.join(' ');
 const stats=[['当前日期对应已验',dayInWeek?v.d.native:'—',dayInWeek?`/ ${DATA.rows.filter(r=>r.date===v.today).length*NETS.length}`:'',dayInWeek?`另有${v.d.future}未来 · ${v.d.due}待核`:'等待新周证据','good-stat'],['本周有效覆盖',v.coverage,`/ ${v.target}`,'已验＋到点待核＋有效未来',''],['本周原帖已核验',v.w.native,'',`${v.w.future}未来预约单列`,'good-stat'],['本周未覆盖',v.target-v.coverage,'',`${v.w.held}暂停草稿包含在缺口内`,'']];
 $('#stats').innerHTML=stats.map(x=>`<article class="stat ${x[4]}"><span>${esc(x[0])}</span><strong>${esc(x[1])}<small>${esc(x[2])}</small></strong><p>${esc(x[3])}</p></article>`).join('');
 $('#coverage-heading').textContent=`本周${v.target}次目标，按状态拆开看`;$('#coverage-target').textContent=`6平台 × ${DATA.rows.length}主题`;
 $('#coverage-summary').textContent=`${v.w.native}已验 + ${v.w.future}未来 + ${v.w.due}待核 = ${v.coverage}有效覆盖；另${v.w.held}暂停草稿、${v.w.uncreated}未落实。`;
 const segments=[['verified',v.w.native,'原帖已核验'],['scheduled',v.w.future,'未来预约'],['due',v.w.due,'到点待核'],['held',v.w.held,'暂停草稿'],['uncreated',v.w.uncreated,'未落实']];
 $('#coverage-bar').innerHTML=segments.filter(x=>x[1]).map(x=>`<span class="${x[0]}" style="flex:${x[1]}" title="${x[2]} ${x[1]}" aria-label="${x[2]} ${x[1]}"></span>`).join('');
 const h=s.historical, targets=h.scheduledTargets??[], hf=targets.filter(t=>new Date(t.scheduledAt)>new Date()).length, hd=targets.length-hf;$('#historical-summary').textContent=`有限历史：${h.satisfied}/${h.total}已满足，${targets.length?hf:h.future}既有未来，${targets.length?hd:(h.due??0)}到点待核，${h.other}其他未满足。与常规运营分账。`;
 const m=s.metricCheckpoints;$('#checkpoint-counts').innerHTML=`<span>普通E经营观察 <strong>${m.ordinary}</strong> 项</span><span>W42 YouTube检查点 <strong>${m.W42}</strong> 项</span><span>点名作品观察 <strong>${m.direct}</strong> 项</span>`;
 const next=DATA.nextWeek, nextPanel=$('#next-week');
 if(nextPanel){nextPanel.hidden=!next;if(next){$('#next-week-title').textContent=`${next.week} · 已选${next.topics}片，已预约${next.accepted}/${next.target}`;$('#next-week-body').innerHTML=`<p>已接受${next.accepted}个平台预约，另${next.unsubmitted}条仍为本地计划。${NETS.map(n=>`${LABELS[n]} ${next.perPlatform[n]}条`).join(' · ')}。预约到点后仍须逐条核验公开原帖。</p><p>实际提前量：${next.strictLeadMet}条达到168小时，${next.strictLeadShortfall}条不足168小时。首日08点组在本轮开始时已错过严格七天提前量，保留原目标时间与真实接受时间。</p><p class="micro">以下是${fmt(next.asOf)}登记的下一周准备状态；本周原帖与指标证据时间保持。国内已发依据AG及共用台账报告，不冒称CG逐帖验收。</p><div class="next-week-list">${next.rows.map(r=>`<article><time>${fmt(r.scheduledAt)}</time><div><strong>${esc(r.workId)} · ${esc(r.title)}</strong><span>${r.accepted}/6 已预约${r.accepted<6?' · 其余待提交':''}</span></div></article>`).join('')}</div>`;}}
 const named=DATA.latestNamed, namedPanel=$('#named-latest');
 if(namedPanel){namedPanel.hidden=!named;if(named){$('#named-latest-title').textContent=`点名直发 ${named.workId}《${named.title}》· ${named.links.length}/6 原帖已核验`;$('#named-latest-body').innerHTML=`<p>${esc(named.durationSeconds)}秒原片已在六平台公开，作者、完整正文和两段动态画面均已核验。此项单独计数，不抵扣本周常规目标。</p><p>${named.links.map(p=>`<a href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">${LABELS[p.platform]} ↗</a>`).join(' · ')}</p><p class="micro">本片原帖首验全部完成：${fmt(named.verifiedAt)}（北京时间）。各平台首次核验时间分别保留，站点更新不代表平台指标刷新。</p>`;}}
}
function selectPlatform(key){
 selectedPlatform=key;const a=DATA.accounts.find(x=>x.key===key),r=ROLES[key],v=derive().per[key];
 $('#platform-tabs').querySelectorAll('button').forEach(b=>{b.setAttribute('aria-selected',String(b.dataset.key===key));b.tabIndex=b.dataset.key===key?0:-1;});
 $('#platform-panel').setAttribute('aria-labelledby','tab-'+key);
 const sample=[...DATA.rows].reverse().find(row=>row.platforms[key]?.state==='verified');const url=sample?.platforms[key]?.permalink;
 $('#platform-panel').innerHTML=`<div><div class="platform-name">${LABELS[key]}</div><h3 class="platform-role">${esc(r.role)}</h3><a class="platform-account" href="${esc(a.url)}" target="_blank" rel="noopener noreferrer">${esc(a.handle)} ↗</a><p class="route">现行路径 / ${esc(a.route)}<br>本周记录 / ${v.native}已验 · ${v.future}未来 · ${v.due}待核 · ${v.held}暂停</p>${url?`<a class="platform-proof" href="${esc(url)}" target="_blank" rel="noopener noreferrer">查看最近已核验原帖 ↗</a>`:''}</div><dl><div><dt>主要受众与细分假设</dt><dd>${esc(r.audience)}</dd></div><div><dt>建议承担的内容职责</dt><dd>${esc(r.focus)}</dd></div><div><dt>平台适配重点</dt><dd>${esc(r.adapt)}</dd></div><div><dt>优先观察信号</dt><dd>${esc(r.signal)}</dd></div></dl>`;
}
function renderCalendar(){
 const dates=[...new Set(DATA.rows.map(r=>r.date))];if(!selectedDay||!dates.includes(selectedDay))selectedDay=dates.includes(currentDate())?currentDate():dates[0];
 $('#week-title').textContent=`${DATA.snapshot.week} · ${DATA.rows.length}个共同主题`;
 $('#day-tabs').innerHTML=dates.map((date,i)=>`<button class="day-tab" id="day-${date}" role="tab" aria-selected="${date===selectedDay}" aria-controls="day-content" tabindex="${date===selectedDay?0:-1}" data-date="${date}">周${['一','二','三','四','五','六','日'][i]}<strong>${date.slice(5).replace('-',' / ')}</strong></button>`).join('');
 $('#day-content').setAttribute('role','tabpanel');$('#day-content').setAttribute('aria-labelledby','day-'+selectedDay);
 $('#day-content').innerHTML=DATA.rows.filter(r=>r.date===selectedDay).map(row=>`<article class="slot"><time class="slot-time">${esc(row.time)}</time><div><h4>${esc(row.theme)}${row.workId?`<small>作品 ${esc(row.workId)}</small>`:''}</h4><p class="row-source">片库与制作线：<a href="#sources">${esc(row.sourceLabel??"来源待完善登记")}</a></p><div class="network-states">${NETS.filter(n=>filter==='all'||n===filter).map(n=>{const p=row.platforms[n],s=stateOf(p),label=`${LABELS[n]} · ${s==='due'&&p.reviewStatus==='under_review_owner_only'?'审查中':names[s]}`;return p?.state==='verified'&&p.permalink?`<a class="state state-${s}" href="${esc(p.permalink)}" target="_blank" rel="noopener noreferrer" aria-label="${label}，打开真实原帖">${label} ↗</a>`:`<span class="state state-${s}">${label}</span>`;}).join('')}</div></div></article>`).join('');
}
function initTabs(){
 $('#platform-tabs').innerHTML=NETS.map(n=>`<button class="platform-tab" id="tab-${n}" role="tab" aria-selected="${n===selectedPlatform}" aria-controls="platform-panel" tabindex="${n===selectedPlatform?0:-1}" data-key="${n}">${LABELS[n]}</button>`).join('');
 $('#platform-tabs').addEventListener('click',e=>{const b=e.target.closest('[data-key]');if(b)selectPlatform(b.dataset.key);});
 $('#platform-tabs').addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;e.preventDefault();let i=NETS.indexOf(selectedPlatform);i=e.key==='Home'?0:e.key==='End'?5:(i+(e.key==='ArrowRight'?1:5))%6;selectPlatform(NETS[i]);$('#tab-'+NETS[i]).focus();});
 $('#day-tabs').addEventListener('click',e=>{const b=e.target.closest('[data-date]');if(b){selectedDay=b.dataset.date;renderCalendar();}});
 $('#day-tabs').addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft'].includes(e.key))return;e.preventDefault();const dates=[...new Set(DATA.rows.map(r=>r.date))],i=dates.indexOf(selectedDay);selectedDay=dates[(i+(e.key==='ArrowRight'?1:dates.length-1))%dates.length];renderCalendar();$('#day-'+selectedDay).focus();});
}
function renderUpdates(){
 $('#update-list').innerHTML=DATA.updates.slice().reverse().slice(0,8).map(u=>`<article class="update-entry"><time>${esc(u.date)}<br>${esc(u.version)}</time><div><strong>${esc(u.title)}</strong><p>${esc(u.detail)}</p></div></article>`).join('');
 $('#version').textContent=`版本 ${DATA.contentVersion}`;
}
async function renderSources(){
 try{
  const res=await fetch('sources.json',{cache:'no-cache'});if(!res.ok)throw new Error('Source catalog unavailable');const catalog=await res.json();
  if(catalog.schemaVersion!=='1.0'||!Array.isArray(catalog.items))throw new Error('Source catalog format invalid');
  const states={candidate:'候选登记',registered:'已登记',paused:'暂停'};
  const groups=[{role:'library',title:'唯一权威片库',description:'正式成品、统一准入与版本身份在这里汇合。'}, {role:'production-line',title:'四条制作线',description:'制作出处各有分工；统一入库后按同一准入规则承接国内与海外。'}, {role:'discovery',title:'发现与预览入口',description:'用于寻找、预览与追溯作品；不是另一个权威片库，也不增加独立作品计数。'}];
  const libraryCount=catalog.items.filter(x=>x.role==='library').length,lineCount=catalog.items.filter(x=>x.role==='production-line').length;
  if(libraryCount!==1||catalog.items.some(x=>!groups.some(g=>g.role===x.role)))throw new Error('Source roles require review');
  $('#source-count').textContent=`${libraryCount}个权威片库 · ${lineCount}条制作线`;
  const card=s=>`<article class="source-card"><div class="source-card-tags"><span class="tag ${s.status==='registered'?'good':s.status==='paused'?'warning':'proposed'}">${esc(states[s.status]??'状态待核')}</span><span class="micro">${esc(s.priority)}</span></div><p class="kicker">${esc(s.type)}</p><h3>${esc(s.name)}</h3><p>${esc(s.provides)}</p><dl><div><dt>承接方式</dt><dd>${esc(s.intake)}</dd></div><div><dt>使用范围与当前状态</dt><dd>${esc(s.scopeNote)}</dd></div></dl>${s.url&&/^https:\/\//.test(s.url)?`<a class="source-entry" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.entryLabel)} ↗</a>`:`<span class="source-entry internal-entry">${esc(s.entryLabel)}</span>`}</article>`;
  $('#source-cards').innerHTML=groups.map(g=>`<section class="source-group" data-role="${g.role}" aria-label="${g.title}"><div class="source-group-heading"><h3>${g.title}</h3><p>${g.description}</p></div><div class="source-grid">${catalog.items.filter(s=>s.role===g.role).map(card).join('')}</div></section>`).join('');
  $('#source-expansion-title').textContent=catalog.expansion.title;$('#source-expansion-copy').textContent=catalog.expansion.description;$('#source-expansion-examples').textContent=catalog.expansion.candidateExamples;
  $('#sources-updated').textContent=`策略与来源说明更新：${catalog.updatedOn}；此日期不代表素材全库重新扫描、封面全部就绪或运营指标重新取数。`;
 }catch(err){$('#source-cards').textContent='来源清单暂未加载成功，请稍后刷新。具体作品仍以已登记的来源和授权记录为准。';console.error(err);}
}
async function start(){
 try{const res=await fetch('data.json',{cache:'no-cache'});if(!res.ok)throw new Error('快照暂不可用');DATA=await res.json();if(DATA.schemaVersion!=='1.0'||!Array.isArray(DATA.rows)||DATA.rows.length<1)throw new Error('快照格式待核对');initTabs();$('#platform-filter').insertAdjacentHTML('beforeend',NETS.map(n=>`<option value="${n}">${LABELS[n]}</option>`).join(''));$('#platform-filter').addEventListener('change',e=>{filter=e.target.value;renderCalendar();});renderSnapshot();selectPlatform(selectedPlatform);renderCalendar();renderUpdates();setInterval(()=>{renderSnapshot();selectPlatform(selectedPlatform);renderCalendar();},60000);}catch(err){$('#freshness').classList.add('attention');$('#freshness').textContent='执行快照暂未加载成功，不能据此判断已发或失败。方案正文仍可阅读，请稍后重新打开站点。';console.error(err);}
}
let savedTheme=null;try{savedTheme=localStorage.getItem('founder-ops-theme');}catch{}
if(['light','dark'].includes(savedTheme))document.documentElement.dataset.theme=savedTheme;
$('#theme-toggle').setAttribute('aria-label',document.documentElement.dataset.theme==='dark'?'切换浅色外观':'切换深色外观');
$('#theme-toggle').addEventListener('click',()=>{const dark=document.documentElement.dataset.theme!=='dark';document.documentElement.dataset.theme=dark?'dark':'light';try{localStorage.setItem('founder-ops-theme',dark?'dark':'light');}catch{}$('#theme-toggle').setAttribute('aria-label',dark?'切换浅色外观':'切换深色外观');});
$('#print-plan').addEventListener('click',()=>window.print());start();renderSources();
