'use strict';
const EVENTS=[
 {title:'你的第一束花，到了。',text:'花已经放进花瓶。先建立养护习惯，再开始你的保鲜小实验。',weather:'☀ 温和的一天',heat:0,dirt:0},
 {title:'午后的窗边，有点热。',text:'阳光照进房间，花瓶周围升温了。今天试试把环境也考虑进去。',weather:'☀ 高温挑战',heat:8,dirt:0},
 {title:'瓶里的水，开始浑浊。',text:'漂亮的花也需要干净的水。只关心花瓣，可能会忽略瓶里的变化。',weather:'◌ 水质挑战',heat:0,dirt:6},
 {title:'实验室来了一张新卡片。',text:'点开“实验依据”，看看文献与团队数据有什么不同。你可以调整研究态度，这不影响分数。',weather:'✧ 研究日',heat:0,dirt:0},
 {title:'又是一个闷热的下午。',text:'离挑战结束还有几天。提前安排养护，给这束花多一点余地。',weather:'☀ 高温挑战',heat:8,dirt:0},
 {title:'周末到了，别忘了换水。',text:'最后几天也不能松懈。把基础养护坚持下去，看看会有什么不同。',weather:'◌ 水质挑战',heat:0,dirt:6},
 {title:'今天，把花送给重要的人。',text:'最后一次养护！希望送出这束花时，它依然保持着好状态。',weather:'♡ 交花日',heat:0,dirt:0}
];
const ACTIONS=[
{id:'water',icon:'💧',name:'换一瓶清水',desc:'关注水质与吸水',lesson:'你关注了基础养护。模拟分数不代表真实延长天数。'},
{id:'cool',icon:'🌤',name:'移到阴凉处',desc:'关注环境温度',lesson:'你把环境纳入了养护决定。'},
{id:'observe',icon:'🔎',name:'观察并记录',desc:'保留变化 · 不直接恢复鲜活度',lesson:'观察不直接恢复状态，但能帮助发现问题。'},
{id:'consult',icon:'📖',name:'查阅实验依据',desc:'了解证据 · 不直接恢复鲜活度',lesson:'查证有助于判断，但不会直接改变花的状态。'}];
const DECISIONS={consider:'愿意进一步了解',wait:'需要更多证据',decline:'暂不考虑'};
let decision=null;
let state;const $=id=>document.getElementById(id);const clamp=x=>Math.max(0,Math.min(100,x));
function reset(){state={day:0,fresh:100,baseline:100,selected:[],history:[],done:false};$('result').close();$('feedback').textContent='目标：第 7 天结束时，鲜活度达到 60 分。';render();}
function select(id){if(state.done||!ACTIONS.some(a=>a.id===id))return false;const at=state.selected.indexOf(id);if(at>=0)state.selected.splice(at,1);else if(state.selected.length<2)state.selected.push(id);else{$('selection-help').textContent='今天只能选两项。先点一下已选卡片，就可以更换。';return false;}render();return true;}
function advance(){if(state.done||state.selected.length!==2)return false;const e=EVENTS[state.day],has=id=>state.selected.includes(id);let loss=12+e.heat+e.dirt;if(has('water'))loss-=6+e.dirt;if(has('cool'))loss-=2+e.heat;loss=Math.max(1,loss);state.fresh=clamp(state.fresh-loss);state.baseline=clamp(state.baseline-(12+e.heat+e.dirt));state.history.push({day:state.day+1,actions:[...state.selected],fresh:state.fresh});const lesson=has('consult')?ACTIONS[3].lesson:has('observe')?ACTIONS[2].lesson:has('water')?ACTIONS[0].lesson:ACTIONS[1].lesson;$('feedback').textContent=`第 ${state.day+1} 天记录：鲜活度 −${loss}。${lesson}`;state.day++;state.selected=[];state.done=state.day===7;render();if(state.done)showResult();return true;}
function render(){const e=EVENTS[Math.min(state.day,6)];$('day').textContent=state.done?'7 天挑战完成':`第 ${state.day+1} / 7 天`;$('weather').textContent=e.weather;$('event-label').textContent=`今日来信 · ${String(Math.min(state.day+1,7)).padStart(2,'0')}`;$('event-title').textContent=e.title;$('event-description').textContent=e.text;$('fresh-value').textContent=`${state.fresh} / 100`;$('fresh-bar').value=state.fresh;$('baseline-value').textContent=state.baseline;$('baseline-bar').value=state.baseline;$('selection-count').textContent=`已选 ${state.selected.length} / 2`;$('selection-help').textContent=state.done?'本局已结束，可以重新开始，探索另一种选择。':'点选两张卡片，再结束今天。';$('flower-status').textContent=state.fresh>=80?'盛放 · 元气满满':state.fresh>=60?'舒展 · 依然动人':state.fresh>=35?'疲惫 · 需要关心':'低垂 · 花期渐远';$('flower-message').textContent=state.fresh>=60?'小小的照顾，我都有收到': '下次，也记得关心环境和水质';$('flower').style.filter=`saturate(${0.25+state.fresh/100*.75}) brightness(${.8+state.fresh/500})`;$('flower').style.transform=`rotate(${(100-state.fresh)*.025}deg)`;$('days').innerHTML=Array.from({length:7},(_,i)=>`<span class="day-dot ${i<state.day?'done':i===state.day?'active':''}">${i<state.day?'✓':i+1}</span>`).join('');$('actions').innerHTML=ACTIONS.map(a=>`<button class="action ${a.id} ${state.selected.includes(a.id)?'selected':''}" data-action="${a.id}" aria-pressed="${state.selected.includes(a.id)}" ${state.done?'disabled':''}><span class="action-icon" aria-hidden="true">${a.icon}</span><span><strong>${a.name}</strong><small>${a.desc}</small></span></button>`).join('');$('next').disabled=state.done||state.selected.length!==2;$('next').textContent=state.done?'挑战已完成':state.day===6?'完成最后一天，查看花期报告 →':'照顾好了，进入下一天 →';}
function showResult(){
$('result-title').textContent=state.fresh>=60?'花束挑战完成，聊聊你的选择。':'花期报告到了，下次可以换个策略。';
$('result-description').textContent='分数描述的是本局虚构养护结果，不评价你对新技术的态度。';
$('final-score').textContent=state.fresh;$('final-diff').textContent=state.history.length;
const water=state.history.filter(h=>h.actions.includes('water')).length;
const cool=state.history.filter(h=>h.actions.includes('cool')).length;
$('result-lesson').textContent=`你选择了 ${water} 次换水、${cool} 次调整环境。研究方案尚缺团队实测证据，不能从本局得出其效果。`;
$('decision-summary').textContent=decision?`你的研究态度：${DECISIONS[decision]}。这项选择没有标准答案。你希望看到什么证据，或改变哪些条件？`:'你还没有选择研究态度。可以继续保留判断，也可以告诉团队你需要什么。';
$('result').showModal();}
$('actions').addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(b){const id=b.dataset.action;select(id);if(id==='consult'&&state.selected.includes(id))$('evidence').showModal();document.querySelector(`[data-action="${id}"]`).focus();}});$('next').addEventListener('click',advance);$('restart').addEventListener('click',reset);$('play-again').addEventListener('click',reset);$('review').addEventListener('click',()=>$('result').close());$('learn').addEventListener('click',()=>$('info').showModal());document.querySelector('.close').addEventListener('click',()=>$('info').close());reset();
if(document.modelContext?.registerTool){try{Promise.resolve(document.modelContext.registerTool({name:'read_flower_game',description:'Read the current flower-care game state without changing it.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>JSON.parse(JSON.stringify(state))})).catch(()=>{});}catch{}}

function openPanel(id){if($('result').open)$('result').close();$(id).showModal();}
document.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>openPanel(b.dataset.open)));
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>$(b.dataset.close).close()));
$('result-feedback').addEventListener('click',()=>openPanel('participate'));
$('decisions').addEventListener('click',e=>{const b=e.target.closest('[data-decision]');if(!b)return;decision=b.dataset.decision;document.querySelectorAll('[data-decision]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.decision===decision)));$('decision-note').textContent=`已记录本页选择：${DECISIONS[decision]}。不会影响鲜活度，也不会自动发送。`;});
$('feedback-form').addEventListener('submit',e=>{e.preventDefault();const data=new FormData(e.target);if(!data.get('consent')){$('export-status').textContent='请先确认自愿导出，或者关闭窗口继续游戏。';return;}
const report={version:'2.0',kind:'voluntary-local-feedback',notice:'教学模拟；研究态度不参与计分；不是疗效或购买行为数据',role:data.get('role'),evidenceNeeded:data.get('need'),confusion:data.get('confusion'),suggestion:data.get('suggestion'),researchDecision:decision?DECISIONS[decision]:null,completed:state.done,daysPlayed:state.day,gameHistory:state.history};
const blob=new Blob([JSON.stringify(report,null,2)],{type:'application/json;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='花期守护者-我的反馈.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('export-status').textContent='已请求浏览器下载。文件只保存到你的设备，未提交给团队；你可以自行分享或删除。';});
