const $=id=>document.getElementById(id);
const KEY="yksAkademi_v1";
const todayKey=()=>new Date().toISOString().slice(0,10);
let data=JSON.parse(localStorage.getItem(KEY)||"{}");
data.name=data.name||"";data.tasks=data.tasks||{};data.exams=data.exams||[];
function save(){localStorage.setItem(KEY,JSON.stringify(data));render()}
const defaultTasks=[
 ["TYT","Türkçe paragraf – 30 soru"],["TYT","Temel matematik – 25 soru"],["TYT","Fen veya sosyal tekrar"],["AYT","Alan dersi konu çalışması"],["Tekrar","Yanlış defterini gözden geçir"]
];
function tasksForToday(){if(!data.tasks[todayKey()])data.tasks[todayKey()]=defaultTasks.map((x,i)=>({id:i,tag:x[0],name:x[1],done:false}));return data.tasks[todayKey()]}
function renderTasks(){let ts=tasksForToday();$("tasks").innerHTML=ts.map(t=>`<div class="task ${t.done?'done':''}"><input type="checkbox" data-id="${t.id}" ${t.done?'checked':''}><label>${esc(t.name)}<small> · ${esc(t.tag)}</small></label></div>`).join("");$("taskCount").textContent=ts.filter(t=>t.done).length+"/"+ts.length;let p=ts.length?Math.round(ts.filter(t=>t.done).length/ts.length*100):0;$("percent").textContent=p+"%";$("ring").style.background=`conic-gradient(var(--mint) ${p*3.6}deg,#345b60 0deg)`;$("tasks").querySelectorAll("input").forEach(el=>el.addEventListener("change",()=>{ts.find(t=>t.id==el.dataset.id).done=el.checked;save()}))}
function renderPlan(){let days=["Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi","Pazar"];let focus=["TYT Türkçe + Matematik","TYT Fen + Sosyal","AYT Matematik","AYT Alan dersi","TYT genel tekrar","Deneme + analiz","Dinlenme / hafif tekrar"];$("weekPlan").innerHTML=days.map((d,i)=>`<div class="week-row"><div><b>${d}</b><small>${focus[i]}</small></div><input type="checkbox" ${i===6?'disabled':''} aria-label="${d} tamamlandı"></div>`).join("")}
function renderExams(){$("examCount").textContent=data.exams.length;$("examTotal").textContent=data.exams.length+" kayıt";$("examList").innerHTML=data.exams.length?data.exams.slice().reverse().map(e=>`<div class="exam-item"><strong>${esc(e.type)} · ${e.total.toFixed(2)} net</strong><small> — ${esc(e.date)}</small><p>Türkçe ${e.t} · Matematik ${e.m} · Sosyal ${e.s} · Fen ${e.f}</p>${e.reason?`<p><b>Gelişim notu:</b> ${esc(e.reason)}</p>`:""}</div>`).join(""):'<p class="empty">Henüz deneme eklemedin.</p>'}
function render(){renderTasks();renderPlan();renderExams();$("helloName").textContent=(data.name||"ÖĞRENCİ").toLocaleUpperCase("tr-TR");$("avatar").textContent=(data.name||"Y").charAt(0).toLocaleUpperCase("tr-TR")}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".tab,.view").forEach(x=>x.classList.remove("active"));b.classList.add("active");$(b.dataset.tab).classList.add("active")}));
$("today").textContent=new Intl.DateTimeFormat("tr-TR",{day:"numeric",month:"short"}).format(new Date());
$("addTask").onclick=()=>{let name=prompt("Yeni görevini yaz:");if(name&&name.trim()){let ts=tasksForToday();ts.push({id:Date.now(),tag:"Ek görev",name:name.trim(),done:false});save()}};
$("saveExam").onclick=()=>{let n=id=>Number($(id).value)||0;let e={type:$("examType").value,date:$("examDate").value||todayKey(),t:n("turkce"),m:n("mat"),s:n("sosyal"),f:n("fen"),reason:$("reason").value.trim()};e.total=e.t+e.m+e.s+e.f;data.exams.push(e);["turkce","mat","sosyal","fen","reason"].forEach(id=>$(id).value="");save()};
$("examDate").value=todayKey();
let duration=90*60,remaining=duration,interval=null,running=false;
function showClock(){let m=Math.floor(remaining/60),s=remaining%60;$("clock").textContent=String(m).padStart(2,"0")+":"+String(s).padStart(2,"0")}
function stopTimer(){if(interval)clearInterval(interval);interval=null;running=false;$("timerStart").textContent="Başlat"}
$("timerStart").onclick=()=>{if(running){stopTimer();return}running=true;$("timerStart").textContent="Duraklat";interval=setInterval(()=>{remaining--;showClock();if(remaining<=0){stopTimer();$("timerCaption").textContent="Süre tamamlandı. Harika iş çıkardın!";if("vibrate" in navigator)navigator.vibrate([200,100,200])}},1000)};
$("timerReset").onclick=()=>{stopTimer();remaining=duration;showClock();$("timerCaption").textContent="Dikkatini tek bir hedefe ver."};
document.querySelectorAll("[data-min]").forEach(b=>b.onclick=()=>{stopTimer();duration=Number(b.dataset.min)*60;remaining=duration;showClock();document.querySelectorAll("[data-min]").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");$("timerMode").textContent=duration===5400?"ODAK ZAMANI":"MOLA ZAMANI";$("timerCaption").textContent=duration===5400?"Dikkatini tek bir hedefe ver.":"Biraz dinlen, sonra devam et."});
if(!data.name){$("nameDialog").showModal()}
$("saveName").onclick=()=>{let v=$("nameInput").value.trim();if(v){data.name=v;localStorage.setItem(KEY,JSON.stringify(data))}};
render();showClock();