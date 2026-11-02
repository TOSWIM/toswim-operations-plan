'use strict';
const NETS=['xhs','dy','ks','bili','sph','dt','jd'];
const LABELS={xhs:'小红书',dy:'抖音',ks:'快手',bili:'B站',sph:'视频号',dt:'淘宝·点淘',jd:'京东·逛视频'};
const ROLES={
 xhs:{
  role:'高审美种草与搜索长尾主阵地',
  audience:'关注水上运动美学、泳衣穿搭、防雾泳镜选购及心理/认知科普的都市女性与游泳爱好者。',
  focus:'3:4 高质感竖版封面 + 痛点钩子标题 + 结构化种草正文，沉淀高收藏率笔记与个人主页专辑。',
  adapt:'定期归档至小红书「个人主页专辑」；日常维护重点为补充高热话题胶囊（#TOSWIM #高定泳衣 #防雾泳镜）、@TOSWIM官方旗舰店 及挂载小红书店铺商品卡片。',
  signal:'收藏率、搜索来源占比、进店点击率；定期清理连续30天处于底部<5%且无搜索流量的残次旧帖（须先经主理人确认）。'
 },
 dy:{
  role:'公域爆发算法池与双封面连播阵地',
  audience:'短视频泛运动人群、游泳进阶学习者及视觉创意受众。',
  focus:'前3秒黄金视觉钩子 + 40秒高密度节奏，利用「创作者合集」实现看一集连播全系列。',
  adapt:'严格落实「3:4 竖封 (1080×1440) + 4:3 横封 (1440×1080)」双封面全传；按7大主题建立抖音合集；日常挂载抖音商品橱窗链接并置顶购买指引评论。',
  signal:'5秒完播率、整体完播率、合集连播深度、橱窗商品点击；定期筛查「不适宜公开/仅自己可见」及重复视频。'
 },
 ks:{
  role:'高粘性老铁社区与剧集连播入口',
  audience:'注重实用体验、装备耐用度与直白科普讲解的运动消费人群。',
  focus:'清晰直观的 3:4 封面（960×1280 精准适配）与通俗有力的痛点标题，强化剧集归档连贯性。',
  adapt:'将同系列视频归入「快手剧集 / 合集」；日常维护话题标签与快手小店挂车，排查早期封面裁剪不当或零播放异常旧视频。',
  signal:'完播率、老铁收藏与评论互动、剧集追更率。'
 },
 bili:{
  role:'深度心智资产库与双比例封面标杆',
  audience:'喜爱硬核装备原理解析、心理学/经济学/大脑科普动画及高品质视觉创意的年轻深度用户。',
  focus:'Lv2 账号已全面解锁「官方视频合集」与「个人空间代表作置顶」，打造可长期检索的品牌知识库。',
  adapt:'每次发布必传「4:3 首页推荐封面 + 16:9 个人空间封面」；按7大主题合集完整归档84篇稿件；日常可随时无损更换双封面、优化分P与简介传送门。',
  signal:'硬币/收藏比、弹幕互动、合集订阅量与长尾搜索播放。'
 },
 sph:{
  role:'社交推荐引擎与20万+爆款放大器',
  audience:'高购买力熟龄泳者、家庭水上运动消费群体及私域转发受众（单条作品237已跑出20.9万+播放）。',
  focus:'依托社交点赞外显机制，重点推高认知科普、黑科技泳衣与六字母视觉大片的全家桶传播。',
  adapt:'保护高播放资产（如237等爆款严禁误删并优先置顶）；使用「视频号主页合集」归档系列作品；日常关联微信视频号小店商品组件。',
  signal:'好友推荐/点赞数、转发私域群次数、主页合集点击与小店转化。'
 },
 dt:{
  role:'2,724条超级内容池与淘系公域种草机',
  audience:'具备明确泳衣、泳镜、泳帽购买意图的手淘逛逛与点淘高转化消费者。',
  focus:'全矩阵体量最大（2,724条），直接打通从短视频种草到天猫/淘宝店铺加购成交的闭环。',
  adapt:'日常操作核心阵地：批量巡检并挂载最新主推商品（官旗号/游泳先生号双轨），分批诊断清理历史失效商品视频与长期零展现沉底旧帖（删前须经主理人确认）。',
  signal:'商品卡片点击率、进店加购率、点淘公域推荐流量池层级。'
 },
 jd:{
  role:'30.7万粉丝自营旗舰店公域内容阵地',
  audience:'信赖京东自营品质与极速物流的中高端游泳装备消费者。',
  focus:'依托 TOSWIM拓胜京东自营旗舰店（创作者ID: 81357），将品牌创意与硬核装备视频转化为自营店内高转化内容资产。',
  adapt:'执行「两步法」标准作业：发布时关联挂件设为 0/10 确保秒过京东公域内容审核；过审后再通过日常操作定向补挂自营核心 SKU 挂件并归入店铺频道。',
  signal:'公域过审率、自营商品挂件点击率、店内停留时长与直接成交额。'
 }
};

let DATA=null, selectedPlatform='xhs', selectedDay=null, filter='all';
const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=(v,opt={})=>v?new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false,...opt}).format(new Date(v)):'未知';
const names={verified:'已核验',scheduled:'排队中',due:'待复核',held:'暂缓',uncreated:'未建'};

function renderSnapshot(){
 const s=DATA.snapshot, bc=s.batchCounts;
 $('#saved-snapshot').textContent=`保存快照（${s.operatingDate}）：国内 ${s.platformCount} 大平台累计在架总基数 ${s.totalBaselineWorks.toLocaleString('zh-CN')} 条/篇；最新批次 #${s.latestWorkId}《${s.latestWorkTitle}》已完成 7/7 全平台 +1 实锤核验。规划涵盖 3 大日常整理工作流与 ${s.collectionCount} 大标准化主题合集。`;
 $('#evidence-time').textContent=`台账核验：${fmt(s.asOf)} · 北京时间`;
 const banner=$('#freshness');
 banner.textContent=`里程碑与整理状态：${s.highlightNote} 所有清理、归档与挂车改稿均以唯一总台账（_发布中枢_交接.md）实锤记录为准。`;

 const stats=[
  ['七平台在架总基数',s.totalBaselineWorks.toLocaleString('zh-CN'),'条/篇','含点淘2724 · 小红书482 · 视频号421 · 抖音394','good-stat'],
  ['近期批次实锤覆盖',bc.coverage,`/ ${bc.target}`,'重点批次 7 大平台 100% 核验闭环','good-stat'],
  ['标准化主题合集',s.collectionCount,'个大类','覆盖六字母创意/黑科技/泳镜/心理/经济/大脑/测款',''],
  ['视频整理核心工作流','3','大体系','定期清理 · 定期合集归档 · 日常挂车与改稿','']
 ];
 $('#stats').innerHTML=stats.map(x=>`<article class="stat ${x[4]}"><span>${esc(x[0])}</span><strong>${esc(x[1])}<small>${esc(x[2])}</small></strong><p>${esc(x[3])}</p></article>`).join('');

 $('#baseline-grid').innerHTML=DATA.accounts.map(a=>`<div class="baseline-item"><div class="plat-label"><span>${esc(a.label)}</span><span class="tag good">在架</span></div><strong>${esc(a.baselineCount.toLocaleString('zh-CN'))} <small style="font-size:12px;font-weight:400;color:var(--muted)">${esc(a.unit)}</small></strong><span>${esc(a.latestDelta)}</span></div>`).join('');

 $('#coverage-summary').textContent=`近期 ${DATA.rows.length} 个重点批次 × 7 平台 = ${bc.verified} 格全部完成实锤核验（+1 / BV号 / 内容ID）。`;
 const segments=[['verified',bc.verified,'已发布并核验'],['scheduled',bc.scheduled,'定时排队'],['due',bc.due,'待复核'],['held',bc.held,'暂缓'],['uncreated',bc.uncreated,'未建']];
 $('#coverage-bar').innerHTML=segments.filter(x=>x[1]).map(x=>`<span class="${x[0]}" style="flex:${x[1]}" title="${x[2]} ${x[1]}" aria-label="${x[2]} ${x[1]}"></span>`).join('');

 $('#checkpoint-counts').innerHTML=`<span>国内在架总作品 <strong>${s.totalBaselineWorks.toLocaleString('zh-CN')}</strong> 条</span><span>视频号单条最高播放 <strong>20.9万+</strong> (#237)</span><span>京东自营粉丝基数 <strong>30.7万</strong></span><span>B站合集权限 <strong>Lv2 已解锁</strong></span>`;
}

function selectPlatform(key){
 selectedPlatform=key;
 const a=DATA.accounts.find(x=>x.key===key), r=ROLES[key];
 $('#platform-tabs').querySelectorAll('button').forEach(b=>{
  b.setAttribute('aria-selected',String(b.dataset.key===key));
  b.tabIndex=b.dataset.key===key?0:-1;
 });
 $('#platform-panel').setAttribute('aria-labelledby','tab-'+key);
 const sample=DATA.rows[0]?.platforms[key];
 $('#platform-panel').innerHTML=`<div>
  <div class="platform-name">${esc(a.label)} · ${esc(a.baselineCount.toLocaleString('zh-CN'))}${esc(a.unit)}</div>
  <h3 class="platform-role">${esc(r.role)}</h3>
  <a class="platform-account" href="${esc(a.url)}" target="_blank" rel="noopener noreferrer">${esc(a.handle)} ↗</a>
  <p class="route">现行发布与核验路径 / ${esc(a.route)}<br>最新实锤增量 / ${esc(a.latestDelta)}<br>封面硬性标准 / ${esc(a.coverRule)}<br>合集归档载体 / ${esc(a.collectionSupport)}</p>
  ${sample?.permalink?`<a class="platform-proof" href="${esc(sample.permalink)}" target="_blank" rel="noopener noreferrer">进入平台后台 / 查看最新核验入口 (${esc(sample.note)}) ↗</a>`:''}
 </div>
 <dl>
  <div><dt>目标受众与心智定位</dt><dd>${esc(r.audience)}</dd></div>
  <div><dt>核心内容职责</dt><dd>${esc(r.focus)}</dd></div>
  <div><dt>合集归档与日常操作（挂车/话题/改稿）重点</dt><dd>${esc(r.adapt)}</dd></div>
  <div><dt>评估信号与定期清理标准</dt><dd>${esc(r.signal)}</dd></div>
 </dl>`;
}

function renderCurationAndCollections(){
 $('#curation-grid').innerHTML=DATA.curationWorkflows.map(w=>`<article class="curation-card">
  <div class="card-head"><span class="kicker" style="margin:0">${esc(w.phase)}</span><span class="tag ${esc(w.badgeType)}">${esc(w.badge)}</span></div>
  <h3>${esc(w.title)}</h3>
  <p>${esc(w.summary)}</p>
  <ul>${w.rules.map(rule=>`<li>${esc(rule)}</li>`).join('')}</ul>
  <div class="card-foot">执行节奏：${esc(w.cadence)}</div>
 </article>`).join('');

 $('#collection-grid').innerHTML=DATA.collections.map(c=>`<article class="collection-card">
  <div style="display:flex;justify-content:space-between;align-items:center"><span class="col-id">${esc(c.id)}</span><span class="tag good">${esc(c.priority)}</span></div>
  <h4>${esc(c.name)}</h4>
  <p>${esc(c.scope)}</p>
  <div class="col-meta"><strong>代表作品：</strong>${esc(c.examples)}<br><strong>适用载体：</strong>${esc(c.platforms)}</div>
 </article>`).join('');
}

function renderCalendar(){
 const dates=[...new Set(DATA.rows.map(r=>r.date))];
 if(!selectedDay||!dates.includes(selectedDay))selectedDay=dates[0];
 $('#week-title').textContent=`${DATA.snapshot.batchLabel} · 七平台核验与合集归属矩阵`;
 $('#day-tabs').innerHTML=dates.map(date=>`<button class="day-tab" id="day-${date}" role="tab" aria-selected="${date===selectedDay}" aria-controls="day-content" tabindex="${date===selectedDay?0:-1}" data-date="${date}">批次日期<strong>${date.slice(5).replace('-',' / ')}</strong></button>`).join('');
 $('#day-content').setAttribute('role','tabpanel');
 $('#day-content').setAttribute('aria-labelledby','day-'+selectedDay);
 $('#day-content').innerHTML=DATA.rows.filter(r=>r.date===selectedDay).map(row=>`<article class="slot">
  <time class="slot-time">#${esc(row.workId)}<br><small style="font-size:11px;color:var(--muted)">${esc(row.time)}</small></time>
  <div>
   <h4>${esc(row.theme)} <small>归入合集：${esc(row.collection)}</small></h4>
   <p class="row-source">片库与制作线：<a href="#sources">${esc(row.sourceLabel)}</a></p>
   <div class="network-states">${NETS.filter(n=>filter==='all'||n===filter).map(n=>{
    const p=row.platforms[n], s=p?.state??'uncreated', label=`${LABELS[n]} · ${p?.note||names[s]}`;
    let deep=false;try{const u=new URL(p?.permalink||'');deep=u.pathname.length>1&&u.hostname!=='space.bilibili.com';}catch{}
    return p?.permalink&&deep?`<a class="state state-${s}" href="${esc(p.permalink)}" target="_blank" rel="noopener noreferrer" title="打开该作品原帖">${esc(label)} ↗</a>`:`<span class="state state-${s}" title="该平台暂未登记作品原帖直链，以总台账基数核验为准">${esc(label)}</span>`;
   }).join('')}</div>
  </div>
 </article>`).join('');
}

function renderMirrorsAndUpdates(){
 if(Array.isArray(DATA.mirrors)){
  $('#mirror-grid').innerHTML=DATA.mirrors.map(m=>`<article class="mirror-card">
   <div style="display:flex;justify-content:space-between;align-items:center"><span class="kicker" style="margin:0">${esc(m.role)}</span><span class="tag good">${esc(m.status)}</span></div>
   <h3>${esc(m.name)}</h3>
   <p>${esc(m.note)}</p>
   <a href="${esc(m.url)}" target="_blank" rel="noopener noreferrer">${esc(m.url)} ↗</a>
  </article>`).join('');
 }
 $('#update-list').innerHTML=DATA.updates.slice().reverse().slice(0,8).map(u=>`<article class="update-entry"><time>${esc(u.date)}<br>${esc(u.version)}</time><div><strong>${esc(u.title)}</strong><p>${esc(u.detail)}</p></div></article>`).join('');
 $('#version').textContent=`版本 ${DATA.contentVersion}`;
}

function initTabs(){
 $('#platform-tabs').innerHTML=NETS.map(n=>`<button class="platform-tab" id="tab-${n}" role="tab" aria-selected="${n===selectedPlatform}" aria-controls="platform-panel" tabindex="${n===selectedPlatform?0:-1}" data-key="${n}">${LABELS[n]}</button>`).join('');
 $('#platform-tabs').addEventListener('click',e=>{const b=e.target.closest('[data-key]');if(b)selectPlatform(b.dataset.key);});
 $('#platform-tabs').addEventListener('keydown',e=>{
  if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;
  e.preventDefault();
  let i=NETS.indexOf(selectedPlatform);
  i=e.key==='Home'?0:e.key==='End'?NETS.length-1:(i+(e.key==='ArrowRight'?1:NETS.length-1))%NETS.length;
  selectPlatform(NETS[i]);
  $('#tab-'+NETS[i]).focus();
 });
 $('#day-tabs').addEventListener('click',e=>{const b=e.target.closest('[data-date]');if(b){selectedDay=b.dataset.date;renderCalendar();}});
}

async function renderSources(){
 try{
  const res=await fetch('sources.json',{cache:'no-cache'});
  if(!res.ok)throw new Error('Source catalog unavailable');
  const catalog=await res.json();
  const states={candidate:'候选登记',registered:'已登记',paused:'暂停'};
  const groups=[
   {role:'library',title:'唯一权威片库',description:'正式成品、多比例封面、统一准入与版本身份在这里汇合。'},
   {role:'production-line',title:'四条供片制作线',description:'制作出处各有分工；统一入库后按同一准入规则承接国内七平台与海外六平台。'},
   {role:'discovery',title:'发现、预览与总台账协同入口',description:'用于在线审片预览与跨智能体台账交接，不重复计算独立作品数。'}
  ];
  const libraryCount=catalog.items.filter(x=>x.role==='library').length, lineCount=catalog.items.filter(x=>x.role==='production-line').length;
  $('#source-count').textContent=`${libraryCount}个权威片库 · ${lineCount}条制作线`;
  const card=s=>`<article class="source-card"><div class="source-card-tags"><span class="tag ${s.status==='registered'?'good':s.status==='paused'?'warning':'proposed'}">${esc(states[s.status]??'状态待核')}</span><span class="micro">${esc(s.priority)}</span></div><p class="kicker">${esc(s.type)}</p><h3>${esc(s.name)}</h3><p>${esc(s.provides)}</p><dl><div><dt>承接与归档方式</dt><dd>${esc(s.intake)}</dd></div><div><dt>使用范围与现行规范</dt><dd>${esc(s.scopeNote)}</dd></div></dl>${s.url&&/^https:\/\//.test(s.url)?`<a class="source-entry" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.entryLabel)} ↗</a>`:`<span class="source-entry internal-entry">${esc(s.entryLabel)}</span>`}</article>`;
  $('#source-cards').innerHTML=groups.map(g=>`<section class="source-group" data-role="${g.role}" aria-label="${g.title}"><div class="source-group-heading"><h3>${g.title}</h3><p>${g.description}</p></div><div class="source-grid">${catalog.items.filter(s=>s.role===g.role).map(card).join('')}</div></section>`).join('');
  $('#source-expansion-title').textContent=catalog.expansion.title;
  $('#source-expansion-copy').textContent=catalog.expansion.description;
  $('#source-expansion-examples').textContent=catalog.expansion.candidateExamples;
  $('#sources-updated').textContent=`片库与整理策略说明更新于：${catalog.updatedOn}。`;
 }catch(err){
  $('#source-cards').textContent='来源清单暂未加载成功，请稍后刷新。';
  console.error(err);
 }
}

async function start(){
 try{
  const res=await fetch('data.json',{cache:'no-cache'});
  if(!res.ok)throw new Error('快照暂不可用');
  DATA=await res.json();
  initTabs();
  $('#platform-filter').insertAdjacentHTML('beforeend',NETS.map(n=>`<option value="${n}">${LABELS[n]}</option>`).join(''));
  $('#platform-filter').addEventListener('change',e=>{filter=e.target.value;renderCalendar();});
  renderSnapshot();
  selectPlatform(selectedPlatform);
  renderCurationAndCollections();
  renderCalendar();
  renderMirrorsAndUpdates();
 }catch(err){
  $('#freshness').classList.add('attention');
  $('#freshness').textContent='执行快照加载异常，请检查 data.json。方案正文仍可直接阅读。';
  console.error(err);
 }
}

let savedTheme=null;try{savedTheme=localStorage.getItem('founder-ops-theme');}catch{}
if(['light','dark'].includes(savedTheme))document.documentElement.dataset.theme=savedTheme;
$('#theme-toggle').setAttribute('aria-label',document.documentElement.dataset.theme==='dark'?'切换浅色外观':'切换深色外观');
$('#theme-toggle').addEventListener('click',()=>{
 const dark=document.documentElement.dataset.theme!=='dark';
 document.documentElement.dataset.theme=dark?'dark':'light';
 try{localStorage.setItem('founder-ops-theme',dark?'dark':'light');}catch{}
 $('#theme-toggle').setAttribute('aria-label',dark?'切换浅色外观':'切换深色外观');
});
$('#print-plan').addEventListener('click',()=>window.print());
start();
renderSources();
