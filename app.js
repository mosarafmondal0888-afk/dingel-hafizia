/* =========================================================
   DINGEL HAFIZIA MADRASA — PROFESSIONAL MANAGEMENT SYSTEM
   app.js
========================================================= */

const firebaseConfig={
  apiKey:"AIzaSyCmoFXa6eYEi-SV_Otk9c-l4TlHWXzMFQU",
  authDomain:"dingel-hafizia-manager.firebaseapp.com",
  projectId:"dingel-hafizia-manager",
  storageBucket:"dingel-hafizia-manager.firebasestorage.app",
  messagingSenderId:"1019481403108",
  appId:"1:1019481403108:web:06b44cac27a54a557d86f1",
  measurementId:"G-FPETR4EDYP"
};

if(typeof firebase==="undefined"){
  alert("Firebase library load হয়নি। Internet connection পরীক্ষা করুন।");
}else{
  if(!firebase.apps.length) firebase.initializeApp(firebaseConfig);
}
const db=firebase.firestore();

const MADRASA_PASSWORD="123";
let students=[];
let collections=[];
let currentStudentPage=1;
const STUDENTS_PER_PAGE=15;

const MONTHS=["জানুয়ারি","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"];

function $(id){return document.getElementById(id)}
function setText(id,v){if($(id)) $(id).innerText=v}
function value(id){return $(id)?$(id).value.trim():""}
function setValue(id,v){if($(id)) $(id).value=v??""}
function bn(n){const m={"0":"০","1":"১","2":"২","3":"৩","4":"৪","5":"৫","6":"৬","7":"৭","8":"৮","9":"৯"};return String(n??"").replace(/[0-9]/g,x=>m[x])}
function money(n){return new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(Number(n)||0)}
function esc(v){return String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}
function monthNow(){return MONTHS[new Date().getMonth()]}
function isoToday(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
function typeOf(s){const t=String(s||"").toLowerCase();if(t.includes("orphan")||t.includes("atim")||t.includes("এতিম"))return"Orphan";if(t.includes("poor")||t.includes("n rsd")||t.includes("দরিদ্র")||t.includes("গরিব"))return"Poor";return"General"}

function toast(msg,error=false){
  const t=$("toast"),m=$("toastMessage"),i=$("toastIcon");
  if(!t||!m){alert(msg);return}
  m.innerText=msg;
  i.className=error?"fa-solid fa-circle-exclamation":"fa-solid fa-circle-check";
  i.style.color=error?"#fb7185":"#34d399";
  t.classList.add("show");clearTimeout(window.toastTimer);
  window.toastTimer=setTimeout(()=>t.classList.remove("show"),3000);
}
function loading(show,text="ডাটা লোড হচ্ছে..."){
  $("loadingScreen")?.classList.toggle("hidden",!show);
  if($("loadingText"))$("loadingText").innerText=text;
}

function handleLogin(e){
  e?.preventDefault();
  if(value("passwordInput")===MADRASA_PASSWORD){
    localStorage.setItem("dingelLoggedIn","true");
    $("loginScreen")?.classList.add("hidden");
    $("dashboardScreen")?.classList.remove("hidden");
    setValue("passwordInput","");
    $("errorMessage")?.style.setProperty("display","none");
    loadApplicationData();
  }else{
    $("errorMessage")?.style.setProperty("display","block");
    setValue("passwordInput","");
    $("passwordInput")?.focus();
  }
}
function togglePassword(){
  const i=$("passwordInput"),ic=$("passwordIcon");if(!i)return;
  i.type=i.type==="password"?"text":"password";
  if(ic)ic.className=i.type==="password"?"fa-solid fa-eye":"fa-solid fa-eye-slash";
}
function handleLogout(){localStorage.removeItem("dingelLoggedIn");$("dashboardScreen")?.classList.add("hidden");$("loginScreen")?.classList.remove("hidden")}
function openSidebar(){$("sidebar")?.classList.add("open")}
function closeSidebar(){$("sidebar")?.classList.remove("open")}
function showSection(id){
  document.querySelectorAll(".content-section").forEach(x=>x.classList.add("hidden"));
  $(id)?.classList.remove("hidden");
  document.querySelectorAll(".menu-item").forEach(x=>x.classList.toggle("active",x.dataset.section===id));
  const titles={dashboardSection:["ড্যাশবোর্ড","মাদ্রাসার সামগ্রিক হিসাব ও তথ্য"],studentsSection:["ছাত্র তালিকা","সকল ছাত্রের তথ্য ও ব্যবস্থাপনা"],collectionSection:["ফি আদায়","সকল ফি জমার রেকর্ড"],reportsSection:["রিপোর্ট","মাদ্রাসার আর্থিক ও ছাত্র সংক্রান্ত রিপোর্ট"]};
  if(titles[id]){setText("pageTitle",titles[id][0]);setText("pageSubtitle",titles[id][1])}
  closeSidebar();
}

async function loadApplicationData(){
  loading(true);
  try{await Promise.all([fetchStudents(),fetchCollections()]);renderAll()}
  catch(e){console.error(e);toast("Firebase ডাটা লোড করতে সমস্যা হয়েছে। Firestore Rules ও Internet পরীক্ষা করুন।",true)}
  finally{loading(false)}
}

async function fetchStudents(){
  const snap=await db.collection("students").get();
  if(!snap.empty){
    students=snap.docs.map(d=>({id:d.id,...d.data()}));
  }else{
    try{
      const r=await fetch("students.json");
      if(r.ok){
        const data=await r.json();
        students=data.map(s=>{
          const mv=String(s.monthly||"").trim().toUpperCase();
          return{id:"std_"+s.roll,roll:s.roll,name:s.name||"",class:String(s.class||"").toUpperCase(),guardian:s.father||"N/A",phone:s.number||"N/A",address:s.address||"",type:mv==="ATIM"?"Orphan":mv==="N RSD"?"Poor":"General",monthly:["ATIM","N RSD",""].includes(mv)?0:Number(mv)||0}
        })
      }else students=[]
    }catch{students=[]}
  }
  students.sort((a,b)=>String(a.roll||"").localeCompare(String(b.roll||""),undefined,{numeric:true}))
}
async function fetchCollections(){
  const snap=await db.collection("collections").get();
  collections=snap.docs.map(d=>({id:d.id,...d.data()}));
  collections.sort((a,b)=>new Date(b.date||0)-new Date(a.date||0))
}
function renderAll(){renderStudents();renderCollections();renderRecent();updateDashboard();updateReports()}
function updateDashboard(){
  const total=collections.reduce((s,x)=>s+Number(x.amount||0),0);
  const monthly=collections.filter(x=>x.month===monthNow()).reduce((s,x)=>s+Number(x.amount||0),0);
  const free=students.filter(s=>["Orphan","Poor"].includes(typeOf(s.type))).length;
  setText("totalStudents",bn(students.length));setText("totalCollection",money(total));setText("monthlyCollection",money(monthly));setText("freeStudents",bn(free));setText("collectionPageTotal",money(total));setText("totalReceipts",bn(collections.length))
}

function openStudentModal(id=null){
  const modal=$("studentModal");if(!modal)return;
  $("addStudentForm")?.reset();setValue("editingStudentId","");
  if(id){
    const s=students.find(x=>x.id===id);if(!s)return;
    setText("studentModalTitle","ছাত্রের তথ্য এডিট");
    setValue("editingStudentId",s.id);setValue("studentName",s.name);setValue("studentRoll",s.roll);setValue("studentClass",s.class);setValue("guardianName",s.guardian);setValue("guardianPhone",s.phone==="N/A"?"":s.phone);setValue("studentType",typeOf(s.type));setValue("studentMonthly",s.monthly||"")
  }else setText("studentModalTitle","নতুন ছাত্র ভর্তি");
  modal.classList.remove("hidden")
}
function closeStudentModal(){$("studentModal")?.classList.add("hidden")}
function openCollectionModal(){
  const m=$("collectionModal");if(!m)return;
  setValue("collectionDate",isoToday());setValue("collectionMonth",monthNow());setValue("collectionAmount","");
  const s=$("collectionStudent");s.innerHTML='<option value="">ছাত্র নির্বাচন করুন</option>'+students.map(x=>`<option value="${esc(x.id)}">${esc(x.roll)} — ${esc(x.name)}</option>`).join("");
  m.classList.remove("hidden")
}
function closeCollectionModal(){$("collectionModal")?.classList.add("hidden")}

async function saveStudent(e){
  e?.preventDefault();
  const name=value("studentName"),roll=value("studentRoll"),cls=value("studentClass"),guardian=value("guardianName"),phone=value("guardianPhone"),type=typeOf(value("studentType")),monthly=Number(value("studentMonthly"))||0,edit=value("editingStudentId");
  if(!name||!roll||!cls){toast("নাম, রোল ও শ্রেণী অবশ্যই দিতে হবে।",true);return}
  if(phone&&!/^[6-9]\d{9}$/.test(phone)){toast("সঠিক ১০ সংখ্যার ভারতীয় মোবাইল নম্বর দিন।",true);return}
  if(students.some(s=>String(s.roll)===String(roll)&&s.id!==edit)){toast("এই রোল নম্বরের ছাত্র ইতিমধ্যে আছে।",true);return}
  const data={name,roll,class:cls,guardian:guardian||"N/A",phone:phone||"N/A",type,monthly:["Orphan","Poor"].includes(type)?0:monthly,updatedAt:firebase.firestore.FieldValue.serverTimestamp()};
  try{
    loading(true,edit?"ছাত্রের তথ্য আপডেট হচ্ছে...":"নতুন ছাত্র সেভ হচ্ছে...");
    if(edit){await db.collection("students").doc(edit).update(data);const i=students.findIndex(s=>s.id===edit);if(i>=0)students[i]={...students[i],...data};toast("ছাত্রের তথ্য আপডেট হয়েছে।")}
    else{data.createdAt=firebase.firestore.FieldValue.serverTimestamp();const ref=await db.collection("students").add(data);students.push({id:ref.id,...data});toast("নতুন ছাত্র যোগ হয়েছে।")}
    closeStudentModal();renderAll()
  }catch(e){console.error(e);toast("ছাত্র সেভ করতে সমস্যা হয়েছে।",true)}finally{loading(false)}
}
async function deleteStudent(id){
  const s=students.find(x=>x.id===id);if(!s)return;
  if(!confirm(`"${s.name}"-কে মুছে ফেলবেন?\nএই কাজটি ফেরত আনা যাবে না।`))return;
  try{loading(true,"ছাত্র মুছে ফেলা হচ্ছে...");await db.collection("students").doc(id).delete();students=students.filter(x=>x.id!==id);renderAll();toast("ছাত্র মুছে ফেলা হয়েছে।")}catch(e){console.error(e);toast("ছাত্র মুছতে সমস্যা হয়েছে।",true)}finally{loading(false)}
}

function renderStudents(){
  const body=$("studentsTableBody");if(!body)return;
  const q=value("studentSearch").toLowerCase();
  const list=students.filter(s=>!q||[s.name,s.roll,s.class,s.guardian,s.phone].join(" ").toLowerCase().includes(q));
  const pages=Math.max(1,Math.ceil(list.length/STUDENTS_PER_PAGE));currentStudentPage=Math.min(currentStudentPage,pages);
  const start=(currentStudentPage-1)*STUDENTS_PER_PAGE,items=list.slice(start,start+STUDENTS_PER_PAGE);
  body.innerHTML=items.length?items.map((s,i)=>{const t=typeOf(s.type),label=t==="Orphan"?"এতিম":t==="Poor"?"দরিদ্র":"সাধারণ";return`<tr><td>${bn(start+i+1)}</td><td>${esc(s.roll)}</td><td><strong>${esc(s.name)}</strong></td><td>${esc(s.class)}</td><td>${esc(s.guardian)}</td><td>${esc(s.phone)}</td><td>${label}</td><td>${["Orphan","Poor"].includes(t)?"ফ্রি":money(s.monthly)}</td><td><button class="btn-action" onclick="openStudentModal('${esc(s.id)}')"><i class="fa-solid fa-pen"></i></button><button class="btn-action delete" onclick="deleteStudent('${esc(s.id)}')"><i class="fa-solid fa-trash"></i></button></td></tr>`}).join(""):`<tr><td colspan="9" style="text-align:center;padding:30px">কোনো ছাত্র পাওয়া যায়নি।</td></tr>`;
  setText("studentPageInfo",list.length?`${bn(currentStudentPage)} / ${bn(pages)}`:"০");
  $("studentPrev").disabled=currentStudentPage<=1;$("studentNext").disabled=currentStudentPage>=pages
}
function searchStudents(){currentStudentPage=1;renderStudents()}
function previousStudentPage(){if(currentStudentPage>1){currentStudentPage--;renderStudents()}}
function nextStudentPage(){const q=value("studentSearch").toLowerCase();const n=students.filter(s=>!q||[s.name,s.roll,s.class,s.guardian,s.phone].join(" ").toLowerCase().includes(q)).length;const p=Math.max(1,Math.ceil(n/STUDENTS_PER_PAGE));if(currentStudentPage<p){currentStudentPage++;renderStudents()}}

async function saveCollection(e){
  e?.preventDefault();
  const student=students.find(s=>s.id===value("collectionStudent")),amount=Number(value("collectionAmount"))||0,month=value("collectionMonth")||monthNow(),date=value("collectionDate")||isoToday(),note=value("collectionNote");
  if(!student){toast("ছাত্র নির্বাচন করুন।",true);return}
  if(amount<=0){toast("ফি-এর পরিমাণ দিন।",true);return}
  if(["Orphan","Poor"].includes(typeOf(student.type))){toast("এই ছাত্রের ফি ফ্রি।",true);return}
  try{
    loading(true,"ফি জমার রেকর্ড সেভ হচ্ছে...");
    const receipt=await nextReceipt();
    const data={receiptNo:receipt,studentId:student.id,studentName:student.name,roll:student.roll,class:student.class,amount,month,date,note,createdAt:firebase.firestore.FieldValue.serverTimestamp()};
    const ref=await db.collection("collections").add(data);collections.unshift({id:ref.id,...data});closeCollectionModal();renderAll();toast(`ফি জমা হয়েছে। রসিদ নং ${receipt}`);setTimeout(()=>printReceipt(receipt),500)
  }catch(e){console.error(e);toast("ফি সেভ করতে সমস্যা হয়েছে।",true)}finally{loading(false)}
}
async function nextReceipt(){
  let max=0;collections.forEach(x=>{const m=String(x.receiptNo||"").match(/(\d+)$/);if(m)max=Math.max(max,Number(m[1]))});
  return `DHM-${new Date().getFullYear()}-${String(max+1).padStart(4,"0")}`
}
async function deleteCollection(id){
  const c=collections.find(x=>x.id===id);if(!c)return;
  if(!confirm(`রসিদ ${c.receiptNo||""} মুছে ফেলবেন?`))return;
  try{loading(true,"রেকর্ড মুছে ফেলা হচ্ছে...");await db.collection("collections").doc(id).delete();collections=collections.filter(x=>x.id!==id);renderAll();toast("ফি রেকর্ড মুছে ফেলা হয়েছে।")}catch(e){console.error(e);toast("রেকর্ড মুছতে সমস্যা হয়েছে।",true)}finally{loading(false)}
}
function renderCollections(){
  const body=$("collectionsTableBody");if(!body)return;
  const q=value("collectionSearch").toLowerCase();
  const list=collections.filter(x=>!q||[x.receiptNo,x.studentName,x.roll,x.class,x.month,x.amount].join(" ").toLowerCase().includes(q));
  body.innerHTML=list.length?list.map((x,i)=>`<tr><td>${bn(i+1)}</td><td>${esc(x.receiptNo||"-")}</td><td>${esc(x.studentName||"-")}</td><td>${esc(x.roll||"-")}</td><td>${esc(x.class||"-")}</td><td>${esc(x.month||"-")}</td><td><strong>${money(x.amount)}</strong></td><td>${esc(x.date||"-")}</td><td><button class="btn-action" onclick="printReceipt('${esc(x.receiptNo||x.id)}')"><i class="fa-solid fa-print"></i></button><button class="btn-action delete" onclick="deleteCollection('${esc(x.id)}')"><i class="fa-solid fa-trash"></i></button></td></tr>`).join(""):`<tr><td colspan="9" style="text-align:center;padding:30px">কোনো ফি রেকর্ড পাওয়া যায়নি।</td></tr>`
}
function searchCollections(){renderCollections()}
function renderRecent(){
  const body=$("recentCollectionsBody");if(!body)return;
  body.innerHTML=collections.slice(0,5).length?collections.slice(0,5).map(x=>`<tr><td>${esc(x.receiptNo||"-")}</td><td>${esc(x.studentName||"-")}</td><td>${esc(x.month||"-")}</td><td><strong>${money(x.amount)}</strong></td><td>${esc(x.date||"-")}</td></tr>`).join(""):`<tr><td colspan="5" style="text-align:center;padding:25px">এখনো কোনো ফি জমা হয়নি।</td></tr>`
}

function updateReports(){
  const general=students.filter(s=>typeOf(s.type)==="General").length,orphan=students.filter(s=>typeOf(s.type)==="Orphan").length,poor=students.filter(s=>typeOf(s.type)==="Poor").length,total=collections.reduce((a,x)=>a+Number(x.amount||0),0),monthly=collections.filter(x=>x.month===monthNow()).reduce((a,x)=>a+Number(x.amount||0),0);
  setText("reportTotalStudents",bn(students.length));setText("reportGeneralStudents",bn(general));setText("reportOrphanStudents",bn(orphan));setText("reportPoorStudents",bn(poor));setText("reportTotalCollection",money(total));setText("reportMonthlyCollection",money(monthly));
  $("monthlyReportBody").innerHTML=MONTHS.map(m=>`<tr><td>${m}</td><td>${money(collections.filter(x=>x.month===m).reduce((a,x)=>a+Number(x.amount||0),0))}</td></tr>`).join("")
}

function printReceipt(receipt){
  const c=collections.find(x=>String(x.receiptNo)===String(receipt)||String(x.id)===String(receipt));if(!c){toast("রসিদ পাওয়া যায়নি।",true);return}
  const s=students.find(x=>x.id===c.studentId),w=window.open("","_blank","width=720,height=820");if(!w){toast("Print window খুলতে browser permission দিন।",true);return}
  w.document.write(`<!doctype html><html lang="bn"><head><meta charset="utf-8"><title>${esc(c.receiptNo)}</title><style>body{font-family:Arial,sans-serif;padding:30px}.receipt{max-width:650px;margin:auto;border:1px solid #ddd;padding:30px}.head{text-align:center;border-bottom:2px solid #111;padding-bottom:15px}.grid{display:grid;grid-template-columns:1fr 1fr}.item{padding:11px;border-bottom:1px solid #ddd}.amount{text-align:center;border:2px solid #111;padding:18px;margin-top:20px;font-size:23px;font-weight:bold}.sign{display:flex;justify-content:space-between;margin-top:60px}@media print{body{padding:0}.receipt{border:0}}</style></head><body><div class="receipt"><div class="head"><h1>ডিঙ্গেল হাফিজিয়া মাদ্রাসা</h1><p>ফি জমার রসিদ</p></div><div class="grid"><div class="item"><b>রসিদ:</b> ${esc(c.receiptNo)}</div><div class="item"><b>তারিখ:</b> ${esc(c.date)}</div><div class="item"><b>ছাত্র:</b> ${esc(c.studentName)}</div><div class="item"><b>রোল:</b> ${esc(c.roll)}</div><div class="item"><b>শ্রেণী:</b> ${esc(c.class)}</div><div class="item"><b>অভিভাবক:</b> ${esc(s?.guardian||"-")}</div><div class="item"><b>মাস:</b> ${esc(c.month)}</div><div class="item"><b>নোট:</b> ${esc(c.note||"-")}</div></div><div class="amount">জমার পরিমাণ: ${money(c.amount)}</div><div class="sign"><span>অভিভাবকের স্বাক্ষর</span><span>মাদ্রাসা কর্তৃপক্ষ</span></div></div><script>window.onload=()=>window.print()<\/script></body></html>`);w.document.close()
}

function downloadCSV(rows,name){
  const csv="\uFEFF"+rows.map(r=>r.map(v=>`"${String(v??"").replace(/"/g,'""')}"`).join(",")).join("\n"),a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));a.download=name;document.body.appendChild(a);a.click();a.remove()
}
function exportStudentsCSV(){if(!students.length){toast("Export করার মতো ছাত্র নেই।",true);return}downloadCSV([["Roll","Name","Class","Guardian","Phone","Type","Monthly Fee"],...students.map(s=>[s.roll,s.name,s.class,s.guardian,s.phone,typeOf(s.type),s.monthly])],"dingel-hafizia-students.csv")}
function exportCollectionsCSV(){if(!collections.length){toast("Export করার মতো রেকর্ড নেই।",true);return}downloadCSV([["Receipt","Student","Roll","Class","Month","Amount","Date"],...collections.map(c=>[c.receiptNo,c.studentName,c.roll,c.class,c.month,c.amount,c.date])],"dingel-hafizia-fees.csv")}

document.addEventListener("DOMContentLoaded",()=>{
  setText("todayText",new Date().toLocaleDateString("bn-IN",{day:"numeric",month:"long",year:"numeric"}));
  $("loginForm")?.addEventListener("submit",handleLogin);
  $("addStudentForm")?.addEventListener("submit",saveStudent);
  $("collectionForm")?.addEventListener("submit",saveCollection);
  $("studentSearch")?.addEventListener("input",searchStudents);
  $("collectionSearch")?.addEventListener("input",searchCollections);
  $("collectionStudent")?.addEventListener("change",()=>{
    const s=students.find(x=>x.id===value("collectionStudent"));if(s&&!["Orphan","Poor"].includes(typeOf(s.type)))setValue("collectionAmount",s.monthly||"")
  });
  setValue("collectionDate",isoToday());
  $("collectionMonth").innerHTML=MONTHS.map(m=>`<option value="${m}">${m}</option>`).join("");
  setValue("collectionMonth",monthNow());
  if(localStorage.getItem("dingelLoggedIn")==="true"){$("loginScreen")?.classList.add("hidden");$("dashboardScreen")?.classList.remove("hidden");loadApplicationData()}
});
