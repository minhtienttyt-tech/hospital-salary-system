(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`https://docs.google.com/spreadsheets/d/1Hv_suFrUYa5ZInJrYbOLkGCYwJv4A7w_YAyysgMZlAk/export?format=csv&gid=535447968`,t=`dashboard`,n=`05/2026`,r=`all`,i={},a={},o={},s=[],c={},l=``,u=`monthly`,d=`q1`,f=null,p=`salary`,m=234e4,h=2026,g=null,_=new Set,v={},y=155e5,b=62e5;try{i=JSON.parse(localStorage.getItem(`hospital_salary_data`))||{},a=JSON.parse(localStorage.getItem(`hospital_overtime_data`))||{},o=JSON.parse(localStorage.getItem(`hospital_bonus_data`))||{},s=JSON.parse(localStorage.getItem(`hospital_salary_headers`))||[],c=JSON.parse(localStorage.getItem(`hospital_dependent_overrides`))||{}}catch{i={},a={},o={},s=[],c={}}function x(){localStorage.setItem(`hospital_salary_data`,JSON.stringify(i)),localStorage.setItem(`hospital_overtime_data`,JSON.stringify(a)),localStorage.setItem(`hospital_bonus_data`,JSON.stringify(o)),localStorage.setItem(`hospital_salary_headers`,JSON.stringify(s)),localStorage.setItem(`hospital_dependent_overrides`,JSON.stringify(c))}window.deleteBonusMonth=function(){let e=document.getElementById(`bn-month-selector`)||document.getElementById(`month-selector`);e&&(n=e.value),console.log(`Attempting to delete Bonus for:`,n),confirm(`Xóa dữ liệu khen thưởng tháng `+n+`?`)&&(delete o[n],x(),G(),console.log(`Bonus deleted successfully`))},window.deleteOTMonth=function(){let e=document.getElementById(`ot-month-selector`)||document.getElementById(`month-selector`);e&&(n=e.value),confirm(`Xóa dữ liệu ngoài giờ tháng `+n+`?`)&&(delete a[n],x(),G())},window.deleteMonth=function(){let e=document.getElementById(`month-selector`);if(e&&(n=e.value),confirm(`Bạn có chắc chắn muốn xóa dữ liệu lương tháng `+n+`?`)){delete i[n];let e=T(Object.keys(i));n=e.length?e[0]:`05/2026`,x(),G()}};var S=e=>{if(!e||!e.name)return!1;let t=String(e.name).trim();return t.length>3&&isNaN(t)&&/[a-zA-ZÀ-ỹ]/.test(t)&&!t.startsWith(`Tổng`)};function C(e){if(typeof e==`number`)return e;if(!e)return 0;let t=e.toString().trim(),n=/^-/.test(t)?-1:1,r=t.replace(/[^\d]/g,``);return n*(parseInt(r)||0)}function w(e){if(typeof e==`number`)return e;if(!e)return 0;let t=e.toString().trim().replace(`,`,`.`);return parseFloat(t)||0}function T(e){return e.sort((e,t)=>{let[n=0,r=0]=String(e).split(`/`).map(Number),[i=0,a=0]=String(t).split(`/`).map(Number);return a*12+i-(r*12+n)})}function E(e,t=``){try{if(!e)return``;let n=e.trim(),r=n.match(/\/d\/(.*?)(\/|$)/);if(!r)return n;let i=`https://docs.google.com/spreadsheets/d/${r[1]}/export?format=csv`;if(t)i+=`&gid=${t}`;else{let e=n.match(/gid=([\d]+)/);e&&(i+=`&gid=${e[1]}`)}return i}catch{return e}}function D(e){return(e||0).toLocaleString(`vi-VN`)}function O(e){let t=Papa.parse(e,{skipEmptyLines:!0}).data,n=t.findIndex(e=>e.some(e=>e&&(e.toString().trim()===`TT`||e.toString().trim()===`STT`)));n===-1&&(n=6),s=t[n]?t[n].map(e=>e.toString().trim()):[];let r=[];for(let e=n+1;e<t.length;e++){let n=t[e],i=String(n[1]||``).trim();if(!S({name:i}))continue;let a={base:n[4],area:n[5],vkhung:n[6],position:n[7],responsibility:n[8],incentive:n[9],toxic:n[10],party:n[11]},o=[C(n[13]),C(n[14]),C(n[15]),C(n[16]),C(n[17]),C(n[18]),C(n[19]),C(n[20]),C(n[21]),C(n[22]),C(n[23]),C(n[24]),C(n[25]),C(n[26]),C(n[27]),C(n[28]),C(n[29]),C(n[30]),C(n[31])];r.push({id:String(n[0]||``).trim(),name:i,department:String(n[2]||``).trim(),position:String(n[3]||``).trim(),coefficients:a,rawAmounts:o,numDependents:C(n[27])||0,total:o[8]||0,net:o[18]||0})}return r}function k(e){let t=Papa.parse(e,{skipEmptyLines:!0}).data;if(t.length<2)return[];let n=t.findIndex(e=>e.some(e=>e&&e.toString().toLowerCase().includes(`họ và tên`)));n===-1&&(n=0);let r=Array(t[n].length).fill(``);for(let e=0;e<=n;e++)t[e].forEach((e,t)=>{e&&(r[t]+=` `+e.toString().toLowerCase())});let i=r.findIndex(e=>e.includes(`họ và tên`)),a=r.findIndex(e=>e.includes(`tiền thưởng`)||e.includes(`tổng số`)||e.includes(`thực lĩnh`));a===-1&&(a=8),i===-1&&(i=1);let o=r.findIndex(e=>e.includes(`khoa`)||e.includes(`phòng`)||e.includes(`đơn vị`)),s=r.findIndex(e=>e.includes(`nội dung`)||e.includes(`ghi chú`)),c=[];for(let e=n+1;e<t.length;e++){let n=t[e],r=n[i]?.toString().trim();!r||r===``||r.toLowerCase().includes(`tổng cộng`)||/^[IVXLCDM]+\./.test(r)||r.split(` `).length<2&&isNaN(r)===!1||c.push({name:r,dept:o===-1?``:n[o]?.toString().trim(),amount:C(n[a]),content:s===-1?`Thưởng NĐ73`:n[s]?.toString().trim()})}return c}async function A(){if(i[n]&&i[n].length>0){G();return}G();try{let t=O(await(await fetch(`https://corsproxy.io/?${encodeURIComponent(E(e))}`)).text());t.length&&(i[n]=t,x())}catch(e){console.error(e)}finally{G()}}var j=()=>`
  <aside class="sidebar">
    <div class="logo-container">
      <div class="logo-circle" style="background-image: url('https://lookaside.fbsbx.com/lookaside/crawler/media/?media_id=100064536828566');"></div>
      <div><span class="logo-text">BVĐK<br><small>Than Uyên</small></span></div>
    </div>
    
    <div class="user-profile-card">
      <div class="profile-avatar">
        <i data-lucide="user" color="white" size="24"></i>
      </div>
      <div class="profile-info">
        <h4 class="profile-name">Phạm Minh Tiến</h4>
        <span class="profile-role">Phòng KH-TC-ĐD</span>
        <span class="profile-hospital">Bệnh viện đa khoa Than Uyên</span>
        <div class="profile-contact">
          <i data-lucide="phone" size="14"></i>
          <span>0975 198 657</span>
        </div>
      </div>
    </div>

    <ul class="nav-menu">
      <li class="nav-item ${t===`dashboard`?`active`:``}" data-tab="dashboard"><i data-lucide="layout-dashboard"></i><span>Tổng quan</span></li>
      <li class="nav-item ${t===`salary`?`active`:``}" data-tab="salary"><i data-lucide="banknote"></i><span>Bảng lương</span></li>
      <li class="nav-item ${t===`overtime`?`active`:``}" data-tab="overtime"><i data-lucide="clock"></i><span>Trực & Ngoài giờ</span></li>
      <li class="nav-item ${t===`bonus`?`active`:``}" data-tab="bonus"><i data-lucide="gift"></i><span>Khen thưởng</span></li>
      <li class="nav-item ${t===`pit`?`active`:``}" data-tab="pit"><i data-lucide="calculator"></i><span>Thuế TNCN</span></li>
      <li class="nav-item ${t===`budget`?`active`:``}" data-tab="budget"><i data-lucide="trending-up"></i><span>Dự toán N+1</span></li>
    </ul>
    <div class="sidebar-footer">
      <button id="theme-toggle" class="icon-btn" title="Đổi màu nền"><i data-lucide="moon"></i></button>
      <button onclick="window.emergencyReset()" class="icon-btn" title="Khôi phục hệ thống" style="color:#ef4444;"><i data-lucide="refresh-cw"></i></button>
    </div>
  </aside>`;function M(e,t){let n={};return t.forEach(t=>{e[t]&&e[t].forEach(e=>{let t=e.name||e[1];if(t&&(n[t]||(n[t]={...e,months_count:0},Object.keys(n[t]).forEach(e=>{typeof n[t][e]==`number`&&(n[t][e]=0)}),Array.isArray(e.rawAmounts)&&(n[t].rawAmounts=Array(e.rawAmounts.length).fill(0))),n[t].months_count++,Object.keys(e).forEach(r=>{typeof e[r]==`number`&&(n[t][r]=(n[t][r]||0)+e[r])}),Array.isArray(e.rawAmounts))){let r=n[t].rawAmounts||[];e.rawAmounts.forEach((e,t)=>{r[t]=(r[t]||0)+(e||0)}),n[t].rawAmounts=r}})}),Object.values(n).sort((e,t)=>(e.id||0)-(t.id||0))}function N(e,t=`2026`){if(e===`all`)return Array.from({length:12},(e,n)=>`${(n+1).toString().padStart(2,`0`)}/${t}`);if(e.startsWith(`q`)){let n=parseInt(e[1]);return[`${(n*3-2).toString().padStart(2,`0`)}/${t}`,`${(n*3-1).toString().padStart(2,`0`)}/${t}`,`${(n*3).toString().padStart(2,`0`)}/${t}`]}return[]}var P=e=>`
  <header class="top-bar">
    <h1 style="font-size:1.5rem;font-weight:700;">${e}</h1>
    <div class="search-bar"><i data-lucide="search" size="18"></i><input type="text" id="search-input" placeholder="Tìm kiếm..."></div>
  </header>`,F=()=>{let e=[],t=``;if(u===`monthly`){let r=(i[n]||[]).filter(S);e=l?r.filter(e=>e.name.toLowerCase().includes(l.toLowerCase())||e.department.toLowerCase().includes(l.toLowerCase())):r,t=`Bảng lương `+n}else{let n=N(d);e=M(i,n),t=`Tổng hợp Lương `+(d===`all`?`Cả năm`:`Quý `+d[1])}let r=T(Object.keys(i));return`
  <div class="fade-in">
    ${P(t)}
    <div class="card">
      <div style="display:flex;justify-content:space-between;margin-bottom:1.5rem;gap:1rem;flex-wrap:wrap;">
        <div style="display:flex;gap:1rem;align-items:center;">
          <div class="segmented-control">
            <button class="control-btn ${u===`monthly`?`active`:``}" onclick="window.setViewMode('monthly')">Theo tháng</button>
            <button class="control-btn ${u===`summary`?`active`:``}" onclick="window.setViewMode('summary')">Tổng hợp</button>
          </div>
          ${u===`monthly`?`
            <select class="select-input" id="month-selector">${r.length?r.map(e=>`<option value="${e}" ${n===e?`selected`:``}>${e}</option>`).join(``):`<option>${n}</option>`}</select>
            <button class="btn btn-secondary" id="delete-salary-btn" style="color:#ef4444;font-size:0.85rem;">🗑️ Xóa</button>
          `:`
            <select class="select-input" id="summary-period-selector">
              <option value="all" ${d===`all`?`selected`:``}>Cả năm 2026</option>
              <option value="q1" ${d===`q1`?`selected`:``}>Quý I</option>
              <option value="q2" ${d===`q2`?`selected`:``}>Quý II</option>
              <option value="q3" ${d===`q3`?`selected`:``}>Quý III</option>
              <option value="q4" ${d===`q4`?`selected`:``}>Quý IV</option>
            </select>
          `}
        </div>
        <div style="display:flex;gap:0.5rem;align-items:center;">
          <button class="btn btn-secondary" onclick="window.showReportPreview('salary')" title="Xem trước & Xuất báo cáo"><i data-lucide="printer" size="16"></i> Xem trước & Xuất</button>
          <button class="btn btn-primary" id="import-btn">Import Tháng mới</button>
        </div>
      </div>
      <div class="table-container" style="max-height:650px;">
        <table class="salary-detail-table">
          <thead>
            <tr>
              <th class="sticky-col col-tt">TT</th><th class="sticky-col col-name">Họ tên</th><th class="sticky-col col-dept">Khoa/Phòng</th>
              ${u===`summary`?`<th>Số tháng</th>`:``}
              <th>Chức vụ</th><th>HSL</th><th>KV</th><th>VK</th><th>CV</th><th>TN</th><th>ƯĐ</th><th>ĐH</th><th>CU</th>
              ${[`Lương chính`,`PC vượt khung`,`PC Khu vực`,`PC Chức vụ`,`PC Trách nhiệm`,`PC ưu đãi ngành`,`PC Độc hại`,`PC cấp ủy`,`Tổng cộng lương`,`Khấu trừ 10,5% BH`,`KT 10,5% BH CV`,`KT 10,5% BH VK`,`Trừ ốm LC`,`Trừ ốm VK`,`Trừ ốm CV`,`Trừ ốm TN`,`Trừ ốm ƯĐ`,`Trừ ốm ĐH`,`Tổng lĩnh`].map((e,t)=>`<th class="${t===8?`highlight-total`:t===18?`highlight-col`:``}">${e}</th>`).join(``)}
            </tr>
          </thead>
          <tbody>
            ${e.map(e=>`<tr>
              <td class="sticky-col col-tt">${e.id||``}</td><td class="sticky-col col-name" style="font-weight:600;">${e.name}</td><td class="sticky-col col-dept">${e.department||e.dept||``}</td>
              ${u===`summary`?`<td style="text-align:center;">${e.months_count}</td>`:``}
              <td>${e.position||``}</td>
              <td class="text-center">${e.coefficients?.base||``}</td><td class="text-center">${e.coefficients?.area||``}</td><td class="text-center">${e.coefficients?.vkhung||``}</td><td class="text-center">${e.coefficients?.position||``}</td><td class="text-center">${e.coefficients?.responsibility||``}</td><td class="text-center">${e.coefficients?.incentive||``}</td><td class="text-center">${e.coefficients?.toxic||``}</td><td class="text-center">${e.coefficients?.party||``}</td>
              ${(e.rawAmounts||Array(19).fill(0)).map((e,t)=>`<td class="${t===8?`highlight-total`:t===18?`highlight-col`:``}">${D(e)}</td>`).join(``)}
            </tr>`).join(``)}
          </tbody>
        </table>
      </div>
    </div>
  </div>`},I=()=>{let e=[`Lương chính`,`PC vượt khung`,`PC Khu vực`,`PC Chức vụ`,`PC Trách nhiệm`,`PC ưu đãi ngành`,`PC Độc hại`,`PC cấp ủy`,`Tổng cộng lương`,`Khấu trừ 10,5% BH`,`KT 10,5% BH CV`,`KT 10,5% BH VK`,`Trừ ốm LC`,`Trừ ốm VK`,`Trừ ốm CV`,`Trừ ốm TN`,`Trừ ốm ƯĐ`,`Trừ ốm ĐH`,`Tổng lĩnh`],t={};Object.entries(i).forEach(([e,n])=>{if(!Array.isArray(n))return;let i=parseInt(e.split(`/`)[0]);r!==`all`&&r!==(i<=3?`1`:i<=6?`2`:i<=9?`3`:`4`)||n.filter(S).forEach(n=>{t[n.name]||(t[n.name]={name:n.name,dept:n.department,monthsInPeriod:0,rawAmounts:Array(19).fill(0),otAmount:0,bonusAmount:0,numDependents:c[n.name]===void 0?n.numDependents||0:c[n.name]}),t[n.name].monthsInPeriod+=1,n.rawAmounts&&n.rawAmounts.forEach((e,r)=>t[n.name].rawAmounts[r]=(t[n.name].rawAmounts[r]||0)+(e||0));let r=(a[e]||[]).find(e=>e.name===n.name);t[n.name].otAmount+=r?r.amount:0;let i=(o[e]||[]).find(e=>e.name===n.name);t[n.name].bonusAmount+=i?i.amount:0})});let n=Object.values(t).map(e=>{let t=e.rawAmounts[8]+e.otAmount+e.bonusAmount,n=e.monthsInPeriod*y,r=e.monthsInPeriod*(e.numDependents*b),i=(e.rawAmounts[9]||0)+(e.rawAmounts[10]||0)+(e.rawAmounts[11]||0),a=t-i-n-r;return{...e,gross_taxable:t,gt_bt:n,gt_npt:r,taxable:a,insurance:i}}).sort((e,t)=>t.taxable-e.taxable),s=l?n.filter(e=>e.name.toLowerCase().includes(l.toLowerCase())):n;return`
  <div class="fade-in">
    ${P(`Thuế TNCN - Tổng hợp số liệu `+(r===`all`?`Cả năm`:`Quý ${r}`))}
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;gap:1rem;flex-wrap:wrap;">
        <div style="display:flex;align-items:center;gap:1rem;">
          <select class="select-input" id="pit-quarter-selector" style="min-width:150px;">
            <option value="all" ${r===`all`?`selected`:``}>Cả năm</option>
            <option value="1" ${r===`1`?`selected`:``}>Quý I</option>
            <option value="2" ${r===`2`?`selected`:``}>Quý II</option>
            <option value="3" ${r===`3`?`selected`:``}>Quý III</option>
            <option value="4" ${r===`4`?`selected`:``}>Quý IV</option>
          </select>
        </div>
        <button class="btn btn-secondary" onclick="window.showReportPreview('pit')"><i data-lucide="printer" size="16"></i> Xem trước & Xuất</button>
      </div>
      <div class="table-container" style="max-height:700px;">
        <table class="salary-detail-table" style="font-size:0.82rem;">
          <thead>
            <tr>
              <th class="sticky-col col-tt">TT</th><th class="sticky-col col-name">Họ và tên</th><th class="sticky-col col-dept">Khoa/Phòng</th>
              ${e.map((e,t)=>`<th class="${t===8?`highlight-total`:t===18?`highlight-col`:``}">${e}</th>`).join(``)}
              <th style="background:rgba(14, 165, 233, 0.1);">Ngoài giờ</th>
              <th style="background:rgba(14, 165, 233, 0.1);">Thưởng</th>
              <th class="highlight-col">TN TÍNH THUẾ</th>
              <th>Số NPT</th>
            </tr>
          </thead>
          <tbody>
            ${s.map((e,t)=>`<tr>
              <td class="sticky-col col-tt">${t+1}</td>
              <td class="sticky-col col-name" style="font-weight:600;">${e.name}</td>
              <td class="sticky-col col-dept">${e.dept}</td>
              ${e.rawAmounts.map((e,t)=>`<td class="${t===8?`highlight-total`:t===18?`highlight-col`:``}">${D(e)}</td>`).join(``)}
              <td style="background:rgba(14, 165, 233, 0.05);">${D(e.otAmount)}</td>
              <td style="background:rgba(14, 165, 233, 0.05);">${D(e.bonusAmount)}</td>
              <td class="highlight-col" style="font-weight:700;color:var(--primary);">${D(e.taxable>0?e.taxable:0)}</td>
              <td><input type="number" class="select-input npt-input" data-name="${e.name}" value="${e.numDependents}" style="width:50px;text-align:center;padding:2px;"></td>
            </tr>`).join(``)}
          </tbody>
        </table>
      </div>
    </div>
  </div>`},L=()=>{let e=[],t=``;if(u===`monthly`){let r=o[n]||[];e=l?r.filter(e=>e.name.toLowerCase().includes(l.toLowerCase())):r,t=`Danh sách Khen thưởng ${n}`}else{let n=N(d),r=M(o,n);e=l?r.filter(e=>e.name.toLowerCase().includes(l.toLowerCase())):r,t=`Tổng hợp Khen thưởng `+(d===`all`?`Cả năm`:`Quý `+d[1])}let r=T(Object.keys(o));return`
  <div class="fade-in">
    ${P(t)}
    <div class="card">
      <div style="display:flex;justify-content:space-between;margin-bottom:1.5rem;gap:1rem;flex-wrap:wrap;">
        <div style="display:flex;gap:1rem;align-items:center;">
          <div class="segmented-control">
            <button class="control-btn ${u===`monthly`?`active`:``}" onclick="window.setViewMode('monthly')">Theo tháng</button>
            <button class="control-btn ${u===`summary`?`active`:``}" onclick="window.setViewMode('summary')">Tổng hợp</button>
          </div>
          ${u===`monthly`?`
            <select class="select-input" id="bn-month-selector">${r.length?r.map(e=>`<option value="${e}" ${n===e?`selected`:``}>${e}</option>`).join(``):`<option>${n}</option>`}</select>
            <button class="btn btn-secondary" onclick="window.copyBonusFromPrevious()" style="font-size:0.85rem;">Sao chép tháng trước</button>
            <button class="btn btn-secondary" id="delete-bonus-btn" style="color:#ef4444;font-size:0.85rem;">🗑️ Xóa</button>
          `:`
            <select class="select-input" id="bn-period-selector">
              <option value="all" ${d===`all`?`selected`:``}>Cả năm 2026</option>
              <option value="q1" ${d===`q1`?`selected`:``}>Quý I</option>
              <option value="q2" ${d===`q2`?`selected`:``}>Quý II</option>
              <option value="q3" ${d===`q3`?`selected`:``}>Quý III</option>
              <option value="q4" ${d===`q4`?`selected`:``}>Quý IV</option>
            </select>
          `}
        </div>
        <div style="display:flex;gap:0.5rem;align-items:center;">
          <button class="btn btn-secondary" onclick="window.showReportPreview('bonus')" title="Xem trước & Xuất báo cáo"><i data-lucide="printer" size="16"></i> Xem trước & Xuất</button>
          <button class="btn btn-primary" id="import-bonus-btn">Import Khen thưởng</button>
        </div>
      </div>
      <div class="table-container">
        <table class="salary-detail-table">
          <thead>
            <tr><th>STT</th><th>Họ tên</th><th>Khoa/Phòng</th><th>Nội dung</th><th>Số tiền</th></tr>
          </thead>
          <tbody>
            ${e.length>0?e.map((e,t)=>`<tr><td>${t+1}</td><td>${e.name}</td><td>${e.dept||``}</td><td>${e.content||``}</td><td class="highlight-total">${D(e.amount)}</td></tr>`).join(``):`<tr><td colspan="5" style="text-align:center;padding:3rem;color:var(--text-muted);">Chưa có dữ liệu khen thưởng tháng ${n}.<br><br><button class="btn btn-primary" onclick="document.getElementById('import-bonus-btn').click()">Import ngay</button></td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  </div>`},R=()=>{let e=[],t=``;if(u===`monthly`){let r=a[n]||[];e=l?r.filter(e=>e.name.toLowerCase().includes(l.toLowerCase())):r,t=`Trực & Ngoài giờ ${n}`}else{let n=N(d),r=M(a,n);e=l?r.filter(e=>e.name.toLowerCase().includes(l.toLowerCase())):r,t=`Tổng hợp Ngoài giờ `+(d===`all`?`Cả năm`:`Quý `+d[1])}let r=T(Object.keys(a));return`
  <div class="fade-in">
    ${P(t)}
    <div class="card">
      <div style="display:flex;justify-content:space-between;margin-bottom:1.5rem;gap:1rem;flex-wrap:wrap;">
        <div style="display:flex;gap:1rem;align-items:center;">
          <div class="segmented-control">
            <button class="control-btn ${u===`monthly`?`active`:``}" onclick="window.setViewMode('monthly')">Theo tháng</button>
            <button class="control-btn ${u===`summary`?`active`:``}" onclick="window.setViewMode('summary')">Tổng hợp</button>
          </div>
          ${u===`monthly`?`
            <select class="select-input" id="ot-month-selector">${r.length?r.map(e=>`<option value="${e}" ${n===e?`selected`:``}>${e}</option>`).join(``):`<option>${n}</option>`}</select>
            <button class="btn btn-secondary" id="delete-ot-btn" style="color:#ef4444;font-size:0.85rem;">🗑️ Xóa</button>
          `:`<select class="select-input" id="ot-period-selector"><option value="all" ${d===`all`?`selected`:``}>Cả năm</option><option value="q1" ${d===`q1`?`selected`:``}>Quý I</option><option value="q2" ${d===`q2`?`selected`:``}>Quý II</option><option value="q3" ${d===`q3`?`selected`:``}>Quý III</option><option value="q4" ${d===`q4`?`selected`:``}>Quý IV</option></select>`}
        </div>
        <div style="display:flex;gap:0.5rem;align-items:center;">
          <button class="btn btn-secondary" onclick="window.showReportPreview('overtime')" title="Xem trước & Xuất báo cáo"><i data-lucide="printer" size="16"></i> Xem trước & Xuất</button>
          <button class="btn btn-primary" id="import-ot-btn">Import Ngoài giờ</button>
        </div>
      </div>
      <div class="table-container" style="max-height:650px;">
        <table class="salary-detail-table">
          <thead><tr><th>STT</th><th>Họ tên</th><th>Tổng lĩnh</th></tr></thead>
          <tbody>${e.map((e,t)=>`<tr><td>${t+1}</td><td>${e.name}</td><td>${D(e.amount)}</td></tr>`).join(``)}</tbody>
        </table>
      </div>
    </div>
  </div>`};function z(e){let t=Papa.parse(e,{skipEmptyLines:!0}).data,n=[];for(let e=1;e<t.length;e++){let r=t[e];r[1]&&n.push({name:r[1].trim(),amount:C(r[10]||r[20])})}return n}var B=()=>{let e=(i[n]||[]).filter(S),t=a[n]||[],r=o[n]||[],s=e.reduce((e,t)=>e+t.total,0),c=t.reduce((e,t)=>e+(t.amount||0),0),l=r.reduce((e,t)=>e+(t.amount||0),0),u=s+c+l;return`
  <div class="fade-in">
    ${P(`Tổng quan `+n)}
    <div class="stats-grid">
      <div class="card stat-card"><span class="stat-label">Tổng quỹ lương</span><span class="stat-value">${D(u)}</span></div>
      <div class="card stat-card"><span class="stat-label">Tổng Trực & Ngoài giờ</span><span class="stat-value">${D(c)}</span></div>
      <div class="card stat-card"><span class="stat-label">Tổng Khen thưởng</span><span class="stat-value">${D(l)}</span></div>
    </div>
  </div>`},V=()=>{let e=g||n,t=(i[e]||[]).filter(S),r={base:0,cv:0,kv:0,vk:0,tn:0,dh:0,ud56:0,sumPc:0,bhxh:0,bhyt:0,bhtn:0,kpcd:0,sumIns:0,totalCoef:0,thanhTien:0,chiThuong:0,tongCong:0},a=t.map((e,t)=>{let n=w(e.coefficients?.base),i=w(e.coefficients?.position),a=w(e.coefficients?.area),o=w(e.coefficients?.vkhung),s=w(e.coefficients?.responsibility),c=w(e.coefficients?.toxic),l=w(e.coefficients?.incentive),u=(n+i+o)*l,d=i+a+o+s+c+u+0+0+0,f=n+i+o,p=f*.175,h=f*.03,g=f*.01,v=f*.02,y=p+h+g+v,b=n+d+y,x=Math.round(b*m),S=Math.round(n*m*.1),C=x+S;r.base+=n,r.cv+=i,r.kv+=a,r.vk+=o,r.tn+=s,r.dh+=c,r.ud56+=u,r.sumPc+=d,r.bhxh+=p,r.bhyt+=h,r.bhtn+=g,r.kpcd+=v,r.sumIns+=y,r.totalCoef+=b,r.thanhTien+=x,r.chiThuong+=S,r.tongCong+=C;let T=_.has(e.name);return`<tr>
      <td class="sticky-col col-tt">${t+1}</td>
      <td class="sticky-col col-name" style="font-weight:600;">${e.name}</td>
      <td class="sticky-col col-dept">${e.department||``}</td>
      <td class="text-center"><input type="checkbox" onchange="window.toggleBudgetContract('${e.name}')" ${T?`checked`:``}></td>
      <td class="text-center">${n.toFixed(2).replace(`.`,`,`)}</td>
      <td class="text-center">${i?i.toFixed(2).replace(`.`,`,`):``}</td><td class="text-center">${a?a.toFixed(2).replace(`.`,`,`):``}</td><td class="text-center">${o?o.toFixed(2).replace(`.`,`,`):``}</td>
      <td class="text-center">${s?s.toFixed(2).replace(`.`,`,`):``}</td><td class="text-center">${c?c.toFixed(2).replace(`.`,`,`):``}</td><td class="text-center">${u?u.toFixed(2).replace(`.`,`,`):``}</td>
      <td class="text-center"></td><td class="text-center"></td><td class="text-center"></td>
      <td class="text-center" style="font-weight:600;background:#f8fafc;">${d?d.toFixed(2).replace(`.`,`,`):``}</td>
      <td class="text-center">${p.toFixed(3).replace(`.`,`,`)}</td><td class="text-center">${h.toFixed(3).replace(`.`,`,`)}</td><td class="text-center">${g.toFixed(3).replace(`.`,`,`)}</td><td class="text-center">${v.toFixed(3).replace(`.`,`,`)}</td>
      <td class="text-center" style="font-weight:600;color:var(--danger);">${y.toFixed(3).replace(`.`,`,`)}</td>
      <td class="text-center" style="font-weight:600;color:var(--primary);">${b.toFixed(3).replace(`.`,`,`)}</td>
      <td class="highlight-total">${D(x)}</td>
      <td style="background:rgba(234, 179, 8, 0.05); text-align:right;">${D(S)}</td>
      <td class="highlight-col">${D(C)}</td>
    </tr>`}).join(``);return`
    <div style="margin-bottom:1rem; display:flex; justify-content:space-between; align-items:center;">
      <div style="display:flex; align-items:center; gap:0.5rem;">
        <label style="font-weight:600;">Lấy dữ liệu từ:</label>
        <select class="select-input" onchange="window.setBudgetBaseMonth(this.value)">${T(Object.keys(i)).map(t=>`<option value="${t}" ${t===e?`selected`:``}>Tháng ${t}</option>`).join(``)}</select>
      </div>
      <button class="btn btn-secondary" onclick="window.exportBudgetToExcel('salary')"><i data-lucide="file-spreadsheet" size="16"></i> Xuất Excel</button>
    </div>
    <div class="table-container" style="max-height:600px; overflow-x:auto;">
      <table class="salary-detail-table" style="min-width: 1800px; font-size:0.8rem;">
        <thead>
          <tr>
            <th rowspan="2" class="sticky-col col-tt">STT</th>
            <th rowspan="2" class="sticky-col col-name">Họ và tên</th>
            <th rowspan="2" class="sticky-col col-dept">Bộ phận</th>
            <th rowspan="2">HĐ NĐ111</th>
            <th rowspan="2">Hệ số lương ngạch bậc</th>
            <th colspan="9" style="text-align:center; background:rgba(14, 165, 233, 0.1);">Các khoản phụ cấp</th>
            <th rowspan="2">Tổng hệ số các khoản phụ cấp</th>
            <th colspan="4" style="text-align:center; background:rgba(239, 68, 68, 0.1);">Các khoản đóng góp</th>
            <th rowspan="2">Tổng các khoản đóng góp</th>
            <th rowspan="2">Cộng hệ số</th>
            <th rowspan="2" class="highlight-total">Thành tiền</th>
            <th rowspan="2" style="background:rgba(234, 179, 8, 0.1);">10% chi thưởng</th>
            <th rowspan="2" class="highlight-col">Tổng cộng</th>
          </tr>
          <tr>
            <th>Chức vụ</th><th>Khu vực</th><th>Vượt khung</th><th>Trách nhiệm</th><th>Độc hại</th><th>Ưu đãi (NĐ56)</th><th>Ưu đãi 70%</th><th>Thu hút</th><th>Lưu động</th>
            <th>BHXH 17.5%</th><th>BHYT 3%</th><th>BHTN 1%</th><th>KPCĐ 2%</th>
          </tr>
        </thead>
        <tbody>${t.length?a:`<tr><td colspan="24" style="text-align:center;padding:2rem;">Không có dữ liệu.</td></tr>`}</tbody>
        ${t.length?`<tfoot>
          <tr style="font-weight:700;background:var(--card-bg);border-top:2px solid var(--accent);">
            <td colspan="4" class="sticky-col" style="text-align:center;">Tổng cộng</td>
            <td class="text-center">${r.base.toFixed(2).replace(`.`,`,`)}</td>
            <td class="text-center">${r.cv.toFixed(2).replace(`.`,`,`)}</td><td class="text-center">${r.kv.toFixed(2).replace(`.`,`,`)}</td><td class="text-center">${r.vk.toFixed(2).replace(`.`,`,`)}</td>
            <td class="text-center">${r.tn.toFixed(2).replace(`.`,`,`)}</td><td class="text-center">${r.dh.toFixed(2).replace(`.`,`,`)}</td><td class="text-center">${r.ud56.toFixed(2).replace(`.`,`,`)}</td>
            <td></td><td></td><td></td>
            <td class="text-center">${r.sumPc.toFixed(2).replace(`.`,`,`)}</td>
            <td class="text-center">${r.bhxh.toFixed(2).replace(`.`,`,`)}</td><td class="text-center">${r.bhyt.toFixed(2).replace(`.`,`,`)}</td><td class="text-center">${r.bhtn.toFixed(2).replace(`.`,`,`)}</td><td class="text-center">${r.kpcd.toFixed(2).replace(`.`,`,`)}</td>
            <td class="text-center">${r.sumIns.toFixed(2).replace(`.`,`,`)}</td><td class="text-center">${r.totalCoef.toFixed(2).replace(`.`,`,`)}</td>
            <td class="highlight-total">${D(r.thanhTien)}</td><td style="text-align:right;">${D(r.chiThuong)}</td><td class="highlight-col">${D(r.tongCong)}</td>
          </tr>
        </tfoot>`:``}
      </table>
    </div>
  `},H=()=>{let e=g||n,t=(i[e]||[]).filter(S),r=0,a=0,o=0,s=0,c=0,l=0,u=0,d=0,f=t.length,p=0,m=0;t.forEach(e=>{_.has(e.name)?p++:m++;let t=w(e.coefficients?.base),n=w(e.coefficients?.position),i=w(e.coefficients?.area),f=w(e.coefficients?.vkhung),h=w(e.coefficients?.responsibility),g=w(e.coefficients?.toxic),v=w(e.coefficients?.incentive),y=(t+n+f)*v,b=(t+n+f)*.235;r+=t,a+=n,o+=i,s+=f,c+=h,l+=g,u+=y,d+=b});let h=a+o+s+c+l+u,y=r+h+d;return`
    <div style="padding: 1rem 0;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
        <h3 style="color:var(--primary); margin:0;">Tổng hợp hệ số theo bảng lương đến tháng ${e}</h3>
        <button class="btn btn-secondary" onclick="window.print()"><i data-lucide="printer" size="16"></i> In Biểu</button>
      </div>
      <div class="table-container" style="overflow-x:auto;">
        <table class="salary-detail-table" style="min-width: 1400px; font-size:0.85rem; text-align:center;">
          <thead>
            <tr>
              <th rowspan="3" style="width:50px;">STT</th>
              <th rowspan="3" style="width:250px;">Nội dung</th>
              <th rowspan="3">Giường bệnh</th>
              <th rowspan="3">Biên chế giao</th>
              <th colspan="3" style="background:rgba(14, 165, 233, 0.1);">Tổng số đối tượng có mặt</th>
              <th colspan="9" style="background:rgba(239, 68, 68, 0.1);">Tổng hệ số và các khoản đóng góp</th>
            </tr>
            <tr>
              <th rowspan="2">Tổng số</th>
              <th colspan="2">Trong đó</th>
              <th rowspan="2">Tổng các H/s</th>
              <th rowspan="2">HS Lương chính</th>
              <th colspan="6">Tổng phụ cấp</th>
              <th rowspan="2">Các khoản đóng góp</th>
            </tr>
            <tr>
              <th>NĐ 111</th><th>Biên chế</th>
              <th>Chức vụ</th><th>KV</th><th>V.khung</th><th>ƯĐ NĐ56</th><th>TN</th><th>Độc hại</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td style="text-align:left;font-weight:600;">Trung tâm Y tế Than Uyên</td>
              <td><input type="number" class="select-input" style="width:80px;text-align:center;padding:4px;" placeholder="---" onchange="window.updateBudgetInput('giuong_benh', this.value)" value="${v.giuong_benh||``}"></td>
              <td><input type="number" class="select-input" style="width:80px;text-align:center;padding:4px;" placeholder="---" onchange="window.updateBudgetInput('bien_che_giao', this.value)" value="${v.bien_che_giao||``}"></td>
              <td style="font-weight:700;">${f}</td>
              <td style="color:var(--danger); font-weight:600;">${p}</td>
              <td style="color:var(--primary); font-weight:600;">${m}</td>
              <td style="font-weight:700;color:var(--primary);">${y.toFixed(3).replace(`.`,`,`)}</td>
              <td>${r.toFixed(2).replace(`.`,`,`)}</td>
              <td>${a.toFixed(2).replace(`.`,`,`)}</td>
              <td>${o.toFixed(2).replace(`.`,`,`)}</td>
              <td>${s.toFixed(2).replace(`.`,`,`)}</td>
              <td>${u.toFixed(2).replace(`.`,`,`)}</td>
              <td>${c.toFixed(2).replace(`.`,`,`)}</td>
              <td>${l.toFixed(2).replace(`.`,`,`)}</td>
              <td>${d.toFixed(3).replace(`.`,`,`)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `},U=()=>{let e=(i[g||n]||[]).filter(S),t=0,r=0,a=0,o=0,s=0,c=e.length,l=0,u=0;e.forEach(e=>{_.has(e.name)?l++:u++;let n=w(e.coefficients?.base),i=w(e.coefficients?.position),c=w(e.coefficients?.area),d=w(e.coefficients?.vkhung),f=(n+i+d)*.235;t+=n,r+=i,a+=c,o+=d,s+=f});let d=0,f=0;e.forEach(e=>{let t=w(e.coefficients?.base),n=w(e.coefficients?.position),r=w(e.coefficients?.vkhung),i=w(e.coefficients?.incentive),a=(t+n+r)*i,o=n+w(e.coefficients?.area)+r+w(e.coefficients?.responsibility)+w(e.coefficients?.toxic)+a,s=(t+n+r)*.235;d+=Math.round((t+o+s)*m*12),f+=Math.round(t*m*.1*12)});let p=e=>v[e]||``,h=(e,t,n,r=!1,i=null)=>{if(r)return`<tr style="background:rgba(14, 165, 233, 0.1); font-weight:700;">
        <td style="text-align:center;">${e}</td><td>${t}</td>
        <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
      </tr>`;let a=e=>`<input type="${e===`ghi_chu`?`text`:`number`}" class="select-input" style="width:100%;text-align:${e===`ghi_chu`?`left`:`right`};border:none;border-radius:0;background:transparent;padding:4px;" placeholder="---" onchange="window.updateBudgetInput('${n}_${e}', this.value)" value="${p(`${n}_${e}`)}">`,o=i===null?`<td style="padding:0;">${a(`denghi`)}</td>`:`<td style="text-align:right;font-weight:600;color:var(--primary);vertical-align:middle;padding:4px;">${D(i)}</td>`;return`<tr>
      <td style="text-align:center;font-weight:600;">${e}</td>
      <td style="${e?`font-weight:600;`:``} ${e===`+`||e===`-`?`padding-left:1.5rem;`:``}">${t}</td>
      <td style="padding:0;">${a(`giao`)}</td>
      <td style="padding:0;">${a(`th_6t`)}</td>
      <td style="padding:0;">${a(`uoc`)}</td>
      ${o}
      <td style="padding:0;">${a(`thamdinh`)}</td>
      <td style="padding:0;">${a(`chenhlech`)}</td>
      <td style="padding:0;">${a(`ghi_chu`)}</td>
    </tr>`};return`
    <div style="padding: 1rem 0;">
      <div style="display:flex; justify-content:space-between; margin-bottom:1rem; align-items:center;">
        <div>
          <h2 style="margin:0; text-align:center; font-weight:700;">ĐÁNH GIÁ TÌNH HÌNH THỰC HIỆN NĂM 2025 VÀ DỰ TOÁN 2026</h2>
          <h4 style="margin:0.5rem 0 0 0; text-align:center; font-weight:600;">Đơn vị: Trung tâm Y tế Than Uyên</h4>
        </div>
        <button class="btn btn-secondary" onclick="window.print()"><i data-lucide="printer" size="16"></i> In Biểu</button>
      </div>
      <div style="text-align:right; font-style:italic; font-weight:600; margin-bottom:0.5rem;">ĐVT: VNĐ (Hoặc Triệu đồng tùy nhập)</div>
      <div class="table-container" style="overflow-x:auto;">
        <table class="salary-detail-table" style="font-size:0.8rem; min-width: 1400px; border-collapse: collapse;">
          <thead>
            <tr>
              <th rowspan="2" style="width:40px;text-align:center;">STT</th>
              <th rowspan="2" style="width:300px;text-align:center;">Nội dung</th>
              <th colspan="3" style="text-align:center;">Thực hiện năm 2025</th>
              <th colspan="3" style="text-align:center;">Dự toán năm 2026</th>
              <th rowspan="2" style="width:150px;text-align:center;">Ghi chú: (ghi rõ các vb làm căn cứ pháp lý xd)</th>
            </tr>
            <tr>
              <th style="width:100px;text-align:center;">Số giao</th>
              <th style="width:100px;text-align:center;">Số thực hiện 6 tháng</th>
              <th style="width:100px;text-align:center;">Ước thực hiện năm 2025</th>
              <th style="width:100px;text-align:center;">Số đơn vị đề nghị</th>
              <th style="width:100px;text-align:center;">Số chuyên môn thẩm định</th>
              <th style="width:100px;text-align:center;">Chênh lệch</th>
            </tr>
          </thead>
          <tbody>
            ${h(`I`,`Thu ngân sách`,`thu_ns`,!0)}
            ${h(`1`,`Tổng thu`,`tong_thu`)}
            ${h(`-`,`Thu phí, lệ phí`,`thu_phi`)}
            ${h(`-`,`Thu viện phí trực tiếp`,`thu_vp`)}
            ${h(`-`,`Thu KCB bảo hiểm y tế`,`thu_bhyt`)}
            ${h(`-`,`Thu dịch vụ`,`thu_dv`)}
            ${h(`-`,`Thu khác`,`thu_khac`)}
            
            ${h(`2`,`Chi từ nguồn thu sự nghiệp`,`chi_ns`,!0)}
            ${h(``,`Trong đó`,`trong_do`)}
            ${h(`-`,`Nộp ngân sách nhà nước`,`nop_nsnn`)}
            ${h(`-`,`Lương, phụ cấp và các khoản đóng góp theo lương`,`luong_pc`,!1,d)}
            ${h(`-`,`Hợp đồng theo NĐ111`,`hd_111`)}
            ${h(`-`,`Hợp đồng chuyên môn theo NĐ111`,`hd_cm_111`)}
            ${h(`-`,`Chi phí trực tiếp (chi tiết theo nội dung)`,`chi_truc_tiep`)}
            ${h(`+`,`Phụ cấp trực`,`pc_truc`)}
            ${h(`+`,`TT tiền thủ thuật - phẫu thuật`,`tt_pttt`)}
            ${h(`+`,`Tiền ăn`,`tien_an`)}
            ${h(`+`,`Thanh toán tiền điện`,`tien_dien`)}
            ${h(`+`,`Thanh toán tiền nước`,`tien_nuoc`)}
            ${h(`+`,`Thanh toán tiền nhiên liệu`,`tien_nhien_lieu`)}
            ${h(`+`,`Văn phòng phẩm`,`vpp`)}
            ${h(`+`,`Công cụ, dụng cụ VP`,`cc_dc_vp`)}
            ${h(`+`,`Vật tư VPP khác`,`vpp_khac`)}
            ${h(`+`,`Chi thuê mướng khác (Vệ sinh công nghiệp)`,`thue_muong`)}
            ${h(`+`,`Sửa chữa ô tô`,`sc_oto`)}
            ${h(`+`,`Sửa chữa trang TBKT chuyên dụng`,`sc_tbkt`)}
            
            ${h(`II`,`Chi ngân sách Nhà nước`,`chi_nsnn`,!0)}
            ${h(`A`,`Chỉ tiêu`,`chi_tieu`,!0)}
            ${h(`1`,`Tổng biên chế / Hợp đồng (người)`,`tong_bc`,!1,c)}
            ${h(`2`,`Hệ số bình quân`,`hs_bq`,!1,c?((t+r+a+o+s)/c).toFixed(2).replace(`.`,`,`):0)}
            
            ${h(`B`,`Kinh phí`,`kinh_phi`,!0)}
            ${h(`1`,`Kinh phí nhiệm vụ thường xuyên`,`kp_tx`)}
            ${h(`-`,`Tiền lương (Biên chế + HĐ) x 12 tháng`,`tien_luong_tx`,!1,d)}
            ${h(`-`,`KP chi thưởng NĐ73 (10%)`,`tien_thuong_tx`,!1,f)}
            ${h(`-`,`KP chi hoạt động thường xuyên`,`kp_hd_tx`)}
            
            ${h(`2`,`Các nhiệm vụ chi ngoài định mức`,`kp_ngoai_dm`)}
            ${h(`-`,`Thuê phần mềm (EHIS, Bệnh án ĐT)`,`thue_pm`)}
            ${h(`-`,`Bảo hiểm cháy nổ / PCCC`,`bh_pccc`)}
            ${h(`-`,`Thuê vệ sinh công nghiệp / Xử lý rác`,`ve_sinh`)}
            ${h(`-`,`Sửa chữa / Mua sắm máy móc thiết bị`,`mua_sam`)}
          </tbody>
        </table>
      </div>
    </div>
  `},W=()=>{let e=`
    <div class="segmented-control" style="margin-bottom: 0;">
      <button class="control-btn ${p===`salary`?`active`:``}" onclick="window.setBudgetTab('salary')">Bảng lương dự toán</button>
      <button class="control-btn ${p===`coefficients`?`active`:``}" onclick="window.setBudgetTab('coefficients')">Tổng hợp hệ số</button>
      <button class="control-btn ${p===`template`?`active`:``}" onclick="window.setBudgetTab('template')">Mẫu xây dựng dự toán</button>
    </div>
  `,t=``;return p===`salary`?t=V():p===`coefficients`?t=H():p===`template`&&(t=U()),`
  <div class="fade-in">
    ${P(`Dự toán năm `+h)}
    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
        ${e}
        <div style="display:flex; gap:1rem; align-items:center;">
          <label style="font-size:0.85rem;font-weight:600;">Lương cơ sở:</label>
          <input type="number" id="budget-base-salary" value="${m}" class="select-input" style="width:120px;" onchange="window.updateBudgetBaseSalary(event)">
        </div>
      </div>
      ${t}
    </div>
  </div>`},G=()=>{let s=document.getElementById(`app`);if(s)try{let u=``;switch(t){case`salary`:u=F();break;case`pit`:u=I();break;case`overtime`:u=R();break;case`bonus`:u=L();break;case`budget`:u=W();break;default:u=B()}s.innerHTML=`${j()}<main class="main-content">${u}</main>
      <div id="import-modal" class="modal-overlay" style="display:none;">
        <div class="card modal-content" style="max-width:500px;">
          <h2 id="import-title">Import dữ liệu</h2>
          <div style="margin: 1rem 0;"><label>Tên tháng (MM/YYYY):</label><input type="text" id="import-month-name" class="select-input" style="width:100%;" value="${n}"></div>
          <div style="margin-bottom: 1rem;"><label>Link Google Sheets:</label><input type="text" id="import-url" class="select-input" style="width:100%;"></div>
          <div style="margin-bottom: 1.5rem;"><label>ID của Sheet (GID):</label><input type="text" id="import-gid" class="select-input" style="width:100%;"></div>
          <div style="display:flex;gap:1rem;justify-content:flex-end;"><button class="btn btn-secondary" id="close-modal">Hủy</button><button class="btn btn-primary" id="confirm-import">Bắt đầu Import</button></div>
        </div>
      </div>
      <div id="preview-modal" class="modal-overlay" style="display:none;">
        <div class="card modal-content" style="max-width:1100px; width:95%;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;border-bottom:1px solid var(--card-border);padding-bottom:1rem;">
            <h2 style="margin:0;">Xem trước báo cáo</h2>
            <div style="display:flex;gap:0.5rem;">
              <button class="btn btn-secondary" onclick="window.doExport('pdf')"><i data-lucide="file-text"></i> Xuất PDF</button>
              <button class="btn btn-secondary" onclick="window.doExport('excel')"><i data-lucide="table"></i> Xuất Excel</button>
              <button class="btn btn-primary" id="close-preview"><i data-lucide="x"></i> Đóng</button>
            </div>
          </div>
          <div id="preview-container" class="preview-scroll-area"></div>
        </div>
      </div>`,lucide.createIcons(),document.querySelectorAll(`.nav-item[data-tab]`).forEach(e=>e.onclick=()=>{t=e.dataset.tab,G()});let f=document.getElementById(`search-input`);f&&(f.value=l,f.oninput=e=>{l=e.target.value,G()});let p=document.getElementById(`month-selector`)||document.getElementById(`ot-month-selector`)||document.getElementById(`bn-month-selector`);p&&(p.onchange=e=>{n=e.target.value,G()});let m=document.getElementById(`pit-quarter-selector`);m&&(m.onchange=e=>{r=e.target.value,G()}),document.querySelectorAll(`.npt-input`).forEach(e=>{e.onchange=e=>{let t=e.target.dataset.name,n=parseInt(e.target.value)||0;c[t]=n,x(),G()}});let h=document.getElementById(`import-btn`),g=document.getElementById(`import-modal`),_=document.getElementById(`close-modal`),v=document.getElementById(`confirm-import`);_&&(_.onclick=()=>g.style.display=`none`),v&&(v.onclick=async()=>{let e=document.getElementById(`import-month-name`).value.trim(),t=document.getElementById(`import-url`).value.trim(),r=document.getElementById(`import-gid`).value.trim(),s=v.getAttribute(`data-type`)||`salary`;if(!e||!t)return alert(`Thiếu thông tin`);v.textContent=`Đang xử lý...`,v.disabled=!0;try{let c=E(t,r),l=await(await fetch(`https://corsproxy.io/?${encodeURIComponent(c)}`)).text();if(s===`salary`){let t=O(l);if(!t.length)throw Error(`Dữ liệu không hợp lệ`);i[e]=t}else if(s===`bonus`){let t=k(l);if(!t.length)throw Error(`Dữ liệu không hợp lệ`);o[e]=t}else{let t=z(l);if(!t.length)throw Error(`Dữ liệu không hợp lệ`);a[e]=t}n=e,x(),g.style.display=`none`,G()}catch(e){alert(`Lỗi: `+e.message)}finally{v.textContent=`Bắt đầu Import`,v.disabled=!1}});let y=document.getElementById(`import-ot-btn`),b=document.getElementById(`import-bonus-btn`);y&&(y.onclick=()=>{document.getElementById(`import-title`).textContent=`Import Ngoài giờ`,document.getElementById(`import-url`).value=`https://docs.google.com/spreadsheets/d/1d4VhrIM_lk8BeODjG2_PCAK85NXOVI6aLQO1XlUjyiU/edit`,document.getElementById(`import-gid`).value=`2041249704`,v.setAttribute(`data-type`,`overtime`),g.style.display=`flex`}),h&&(h.onclick=()=>{document.getElementById(`import-title`).textContent=`Import Lương`,document.getElementById(`import-url`).value=localStorage.getItem(`last_salary_url`)||e,document.getElementById(`import-gid`).value=localStorage.getItem(`last_salary_gid`)||``,v.setAttribute(`data-type`,`salary`),g.style.display=`flex`}),b&&(b.onclick=()=>{document.getElementById(`import-title`).textContent=`Import Khen thưởng`,document.getElementById(`import-url`).value=localStorage.getItem(`last_bonus_url`)||`https://docs.google.com/spreadsheets/d/1Imhhn8uEhS2_Wn_3TbQlohsrEUUai_EK6JVJfNUDboQ/edit`,document.getElementById(`import-gid`).value=localStorage.getItem(`last_bonus_gid`)||`1464193880`,v.setAttribute(`data-type`,`bonus`),g.style.display=`flex`});let S=document.getElementById(`summary-period-selector`),C=document.getElementById(`ot-period-selector`),w=document.getElementById(`bn-period-selector`);S&&(S.onchange=e=>{d=e.target.value,r=e.target.value.replace(`q`,``),G()}),C&&(C.onchange=e=>{d=e.target.value,r=e.target.value.replace(`q`,``),G()}),w&&(w.onchange=e=>{d=e.target.value,r=e.target.value.replace(`q`,``),G()});let T=document.getElementById(`close-preview`);T&&(T.onclick=()=>document.getElementById(`preview-modal`).style.display=`none`);let D=document.getElementById(`theme-toggle`);D&&(D.onclick=()=>{document.body.setAttribute(`data-theme`,document.body.getAttribute(`data-theme`)===`dark`?`light`:`dark`)}),s.onclick=e=>{let t=e.target.closest(`button`);!t||!t.id||(t.id===`delete-bonus-btn`?(e.preventDefault(),window.deleteBonusMonth()):t.id===`delete-ot-btn`?(e.preventDefault(),window.deleteOTMonth()):t.id===`delete-salary-btn`&&(e.preventDefault(),window.deleteMonth()))}}catch(e){s.innerHTML=`<div style="padding:3rem;text-align:center;"><h2>Sự cố hiển thị</h2><button class="btn btn-primary" onclick="window.emergencyReset()">Khôi phục hệ thống</button><pre style="text-align:left;margin-top:2rem;">${e.stack}</pre></div>`}};window.setViewMode=e=>{u=e,G()},window.setBudgetTab=e=>{p=e,G()},window.updateBudgetBaseSalary=e=>{m=parseInt(e.target.value)||234e4,G()},window.setBudgetBaseMonth=e=>{g=e,G()},window.toggleBudgetContract=e=>{_.has(e)?_.delete(e):_.add(e),G()},window.updateBudgetInput=(e,t)=>{e.includes(`ghi_chu`)||e.includes(`text`)?v[e]=t:v[e]=parseFloat(t)||0},window.exportBudgetToExcel=function(e){if(e===`salary`){let e=document.querySelector(`.salary-detail-table`);if(!e)return alert(`Không tìm thấy bảng!`);let t=XLSX.utils.book_new(),n=XLSX.utils.table_to_sheet(e,{raw:!0}),r=XLSX.utils.decode_range(n[`!ref`]);for(let e=r.s.r;e<=r.e.r;++e)for(let t=r.s.c;t<=r.e.c;++t){let r={c:t,r:e},i=n[XLSX.utils.encode_cell(r)];i&&t===3&&e>1&&(i.v=_.has(n[XLSX.utils.encode_cell({c:1,r:e})]?.v)?`x`:``)}XLSX.utils.book_append_sheet(t,n,`DuToan_BangLuong`),XLSX.writeFile(t,`Bang_Luong_Du_Toan_${h}.xlsx`)}},window.exportSalaryToExcel=function(){try{let e=(i[n]||[]).filter(S);if(!e.length)return alert(`Không có dữ liệu để xuất!`);let t=[`Lương chính`,`PC vượt khung`,`PC Khu vực`,`PC Chức vụ`,`PC Trách nhiệm`,`PC ưu đãi ngành`,`PC Độc hại`,`PC cấp ủy`,`Tổng cộng lương`,`Khấu trừ 10,5% BH`,`KT 10,5% BH CV`,`KT 10,5% BH VK`,`Trừ ốm LC`,`Trừ ốm VK`,`Trừ ốm CV`,`Trừ ốm TN`,`Trừ ốm ƯĐ`,`Trừ ốm ĐH`,`Tổng lĩnh`],r=e.map(e=>{let n={TT:e.id,"Họ tên":e.name,"Khoa/Phòng":e.department,"Chức vụ":e.position,HSL:e.coefficients?.base,KV:e.coefficients?.area,VK:e.coefficients?.vkhung,CV:e.coefficients?.position,TN:e.coefficients?.responsibility,ƯĐ:e.coefficients?.incentive,ĐH:e.coefficients?.toxic,CU:e.coefficients?.party};return t.forEach((t,r)=>{n[t]=(e.rawAmounts||[])[r]||0}),n}),a=XLSX.utils.json_to_sheet(r),o=XLSX.utils.book_new();XLSX.utils.book_append_sheet(o,a,`Bang Luong`),XLSX.writeFile(o,`Bang_Luong_${n.replace(`/`,`-`)}.xlsx`)}catch(e){console.error(`Excel Export Error:`,e),alert(`Lỗi khi xuất Excel: `+e.message)}},window.exportSalaryToPDF=function(){try{let e=document.querySelector(`.salary-detail-table`);if(!e)return alert(`Không tìm thấy bảng dữ liệu!`);let t=document.createElement(`div`);t.style.padding=`20px`,t.style.background=`#fff`,t.innerHTML=`
      <div style="text-align:center;margin-bottom:20px;font-family:Arial,sans-serif;">
        <h2 style="margin:0;color:#1e40af;text-transform:uppercase;font-size:18px;">BỆNH VIỆN ĐA KHOA HUYỆN THAN UYÊN</h2>
        <h3 style="margin:5px 0;font-size:16px;">BẢNG LƯƠNG CHI TIẾT THÁNG ${n}</h3>
        <hr style="border:1px solid #eee;margin:15px 0;">
      </div>
    `;let r=e.cloneNode(!0);r.style.width=`100%`,r.style.fontSize=`10px`,t.appendChild(r);let i={margin:[10,5,10,5],filename:`Bang_Luong_${n.replace(`/`,`-`)}.pdf`,image:{type:`jpeg`,quality:.98},html2canvas:{scale:2,useCORS:!0,letterRendering:!0},jsPDF:{unit:`mm`,format:`a4`,orientation:`landscape`}};html2pdf().set(i).from(t).save()}catch(e){alert(`Lỗi khi xuất PDF: `+e.message)}},window.exportBonusToExcel=function(){try{let e=u===`summary`,t=e?N(d):[n],r={};t.forEach(e=>{(o[e]||[]).forEach(e=>{r[e.name]||(r[e.name]={...e,amount:0,count:0}),r[e.name].amount+=e.amount||0,r[e.name].count++})});let i=Object.values(r).map((e,t)=>({STT:t+1,"Họ tên":e.name,"Khoa/Phòng":e.dept,"Nội dung":e.content||`Thưởng NĐ73`,"Số tiền":e.amount}));if(!i.length)return alert(`Không có dữ liệu!`);let a=XLSX.utils.json_to_sheet(i),s=XLSX.utils.book_new();XLSX.utils.book_append_sheet(s,a,`Khen Thuong`),XLSX.writeFile(s,`Khen_Thuong_${e?d:n.replace(`/`,`-`)}.xlsx`)}catch(e){alert(`Lỗi: `+e.message)}},window.exportPITToExcel=function(){try{let e=r===`all`?`Cả năm`:`Quý ${r}`,t=[`Lương chính`,`PC vượt khung`,`PC Khu vực`,`PC Chức vụ`,`PC Trách nhiệm`,`PC ưu đãi ngành`,`PC Độc hại`,`PC cấp ủy`,`Tổng cộng lương`,`Khấu trừ 10,5% BH`,`KT 10,5% BH CV`,`KT 10,5% BH VK`,`Trừ ốm LC`,`Trừ ốm VK`,`Trừ ốm CV`,`Trừ ốm TN`,`Trừ ốm ƯĐ`,`Trừ ốm ĐH`,`Tổng lĩnh`],n={};Object.entries(i).forEach(([e,t])=>{if(!Array.isArray(t))return;let i=parseInt(e.split(`/`)[0]);r!==`all`&&r!==(i<=3?`1`:i<=6?`2`:i<=9?`3`:`4`)||t.filter(S).forEach(t=>{n[t.name]||(n[t.name]={name:t.name,dept:t.department,months:0,rawAmounts:Array(19).fill(0),otAmount:0,numDependents:c[t.name]===void 0?t.numDependents||0:c[t.name]}),n[t.name].months+=1,t.rawAmounts&&t.rawAmounts.forEach((e,r)=>n[t.name].rawAmounts[r]+=e||0);let r=(a[e]||[]).find(e=>e.name===t.name);n[t.name].otAmount+=r?r.amount:0})});let o=Object.values(n).map(e=>{let n=e.rawAmounts[8]+e.otAmount,r=(e.rawAmounts[9]||0)+(e.rawAmounts[10]||0)+(e.rawAmounts[11]||0),i=e.months*y,a=e.months*(e.numDependents*b),o=n-r-i-a,s={"Họ và tên":e.name,"Khoa/Phòng":e.dept,"Số tháng":e.months};return t.forEach((t,n)=>s[t]=e.rawAmounts[n]),s[`Ngoài giờ`]=e.otAmount,s[`THU NHẬP TÍNH THUẾ`]=o>0?o:0,s});if(!o.length)return alert(`Không có dữ liệu!`);let s=XLSX.utils.json_to_sheet(o),l=XLSX.utils.book_new();XLSX.utils.book_append_sheet(l,s,`Thue TNCN`),XLSX.writeFile(l,`Thue_TNCN_${e.replace(` `,`_`)}.xlsx`)}catch(e){alert(`Lỗi: `+e.message)}},window.exportPITToPDF=function(){let e=document.querySelector(`.salary-detail-table`);if(!e)return;let t=r===`all`?`CẢ NĂM`:`QUÝ ${r}`,n=document.createElement(`div`);n.style.padding=`20px`,n.style.background=`#fff`,n.innerHTML=`
    <div style="text-align:center;margin-bottom:20px;font-family:Arial,sans-serif;">
      <h2 style="margin:0;color:#1e40af;text-transform:uppercase;font-size:18px;">BỆNH VIỆN ĐA KHOA HUYỆN THAN UYÊN</h2>
      <h3 style="margin:5px 0;font-size:16px;">BẢNG KÊ THU NHẬP TÍNH THUẾ TNCN - ${t}</h3>
      <hr style="border:1px solid #eee;margin:15px 0;">
    </div>
  `;let i=e.cloneNode(!0);i.style.width=`100%`,i.style.fontSize=`10px`,n.appendChild(i);let a={margin:[10,5,10,5],filename:`Thue_TNCN_${t.replace(` `,`_`)}.pdf`,image:{type:`jpeg`,quality:.98},html2canvas:{scale:2,useCORS:!0,letterRendering:!0},jsPDF:{unit:`mm`,format:`a4`,orientation:`landscape`}};html2pdf().set(a).from(n).save()},window.showReportPreview=function(e){let t=document.getElementById(`preview-modal`),s=document.getElementById(`preview-container`);if(!t||!s)return;let l=``,p=``,m=``,h=new Date,g=`Than Uyên, ngày ${h.getDate()} tháng ${h.getMonth()+1} năm ${h.getFullYear()}`;if(e===`salary`){let e=u===`summary`,t=e?d===`all`?`CẢ NĂM 2026`:`QUÝ ${d[1]}/2026`:`THÁNG ${n}`;l=`BẢNG ${e?`TỔNG HỢP`:`THANH TOÁN`} LƯƠNG NHÂN VIÊN`,p=t;let r=e?M(i,N(d)):(i[n]||[]).filter(S);m=`
      <table class="report-table">
        <thead>
          <tr>
            <th>TT</th><th>Họ và tên</th><th>Bộ phận</th>
            ${e?`<th>Tháng</th>`:``}
            ${[`Lương chính`,`PC vượt khung`,`PC Khu vực`,`PC Chức vụ`,`PC Trách nhiệm`,`PC ưu đãi ngành`,`PC Độc hại`,`PC cấp ủy`,`Tổng lương`,`BH 10.5%`,`BH CV`,`BH VK`,`Trừ ốm LC`,`Trừ ốm VK`,`Trừ ốm CV`,`Trừ ốm TN`,`Trừ ốm ƯĐ`,`Trừ ốm ĐH`,`Thực lĩnh`].map(e=>`<th>${e}</th>`).join(``)}
          </tr>
        </thead>
        <tbody>
          ${r.map(t=>`<tr>
            <td>${t.id||``}</td><td>${t.name}</td><td>${t.department||t.dept||``}</td>
            ${e?`<td>${t.months_count}</td>`:``}
            ${(t.rawAmounts||[]).map(e=>`<td>${D(e)}</td>`).join(``)}
          </tr>`).join(``)}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="${e?4:3}">TỔNG CỘNG</td>
            ${Array(19).fill(0).map((e,t)=>`<td>${D(r.reduce((e,n)=>e+(n.rawAmounts?.[t]||0),0))}</td>`).join(``)}
          </tr>
        </tfoot>
      </table>
    `}else if(e===`bonus`){let e=u===`summary`,t=e?d===`all`?`CẢ NĂM 2026`:`QUÝ ${d[1]}/2026`:`THÁNG ${n}`;l=`BẢNG TỔNG HỢP TIỀN KHEN THƯỞNG`,p=t;let r=e?N(d):[n],i={};r.forEach(e=>{(o[e]||[]).forEach(e=>{i[e.name]||(i[e.name]={...e,amount:0,months_count:0}),i[e.name].amount+=e.amount||0,i[e.name].months_count++})});let a=Object.values(i);m=`
      <table class="report-table">
        <thead>
          <tr>
            <th>TT</th><th>Họ và tên</th><th>Bộ phận</th>
            ${e?`<th>Số lần</th>`:``}
            <th>Nội dung</th>
            <th>Số tiền</th>
          </tr>
        </thead>
        <tbody>
          ${a.map((t,n)=>`<tr>
            <td>${n+1}</td><td>${t.name}</td><td>${t.dept||``}</td>
            ${e?`<td>${t.months_count}</td>`:``}
            <td>${t.content||`Thưởng NĐ73`}</td>
            <td style="font-weight:700;">${D(t.amount)}</td>
          </tr>`).join(``)}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="${e?5:4}">TỔNG CỘNG</td>
            <td style="font-weight:700;">${D(a.reduce((e,t)=>e+(t.amount||0),0))}</td>
          </tr>
        </tfoot>
      </table>
    `}else if(e===`overtime`){let e=u===`summary`,t=e?d===`all`?`CẢ NĂM 2026`:`QUÝ ${d[1]}/2026`:`THÁNG ${n}`;l=`BẢNG TỔNG HỢP THANH TOÁN TIỀN TRỰC & NGOÀI GIỜ`,p=t;let r=e?N(d):[n],i={};r.forEach(e=>{(a[e]||[]).forEach(e=>{i[e.name]||(i[e.name]={...e,amount:0,m150:0,m200:0,m300:0,months_count:0}),i[e.name].amount+=e.amount||0,i[e.name].m150+=(e.m150d||0)+(e.m150n||0),i[e.name].m200+=(e.m200d||0)+(e.m200n||0),i[e.name].m300+=(e.m300d||0)+(e.m300n||0),i[e.name].months_count++})});let o=Object.values(i);m=`
      <table class="report-table">
        <thead>
          <tr>
            <th>TT</th><th>Họ và tên</th><th>Bộ phận</th>
            ${e?`<th>Số tháng</th>`:``}
            <th>Lương</th><th>Tiền/Giờ</th>
            <th>150%</th><th>200%</th><th>300%</th>
            <th>Tổng lĩnh</th>
          </tr>
        </thead>
        <tbody>
          ${o.map((t,n)=>`<tr>
            <td>${n+1}</td><td>${t.name}</td><td>${t.dept||``}</td>
            ${e?`<td>${t.months_count}</td>`:``}
            <td>${D(t.salary)}</td><td>${D(t.hourly)}</td>
            <td>${D(t.m150)}</td><td>${D(t.m200)}</td><td>${D(t.m300)}</td>
            <td style="font-weight:700;">${D(t.amount)}</td>
          </tr>`).join(``)}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="${e?5:4}">TỔNG CỘNG</td>
            <td>${D(o.reduce((e,t)=>e+(t.m150||0),0))}</td>
            <td>${D(o.reduce((e,t)=>e+(t.m200||0),0))}</td>
            <td>${D(o.reduce((e,t)=>e+(t.m300||0),0))}</td>
            <td style="font-weight:700;">${D(o.reduce((e,t)=>e+(t.amount||0),0))}</td>
          </tr>
        </tfoot>
      </table>
    `}else if(e===`pit`){let e=r===`all`?`CẢ NĂM 2026`:`QUÝ ${r}/2026`;l=`BẢNG KÊ THU NHẬP TÍNH THUẾ THU NHẬP CÁ NHÂN`,p=e;let t=[`Lương chính`,`PC vượt khung`,`PC Khu vực`,`PC Chức vụ`,`PC Trách nhiệm`,`PC ưu đãi ngành`,`PC Độc hại`,`PC cấp ủy`,`Tổng lương`,`BH 10.5%`,`BH CV`,`BH VK`,`Trừ ốm LC`,`Trừ ốm VK`,`Trừ ốm CV`,`Trừ ốm TN`,`Trừ ốm ƯĐ`,`Trừ ốm ĐH`,`Thực lĩnh`],n={};Object.entries(i).forEach(([e,t])=>{let i=parseInt(e.split(`/`)[0]);r!==`all`&&r!==(i<=3?`1`:i<=6?`2`:i<=9?`3`:`4`)||t.filter(S).forEach(t=>{n[t.name]||(n[t.name]={name:t.name,dept:t.department,months:0,rawAmounts:Array(19).fill(0),otAmount:0}),n[t.name].months++,t.rawAmounts&&t.rawAmounts.forEach((e,r)=>n[t.name].rawAmounts[r]+=e||0);let r=(a[e]||[]).find(e=>e.name===t.name);n[t.name].otAmount+=r?r.amount:0})});let o=Object.values(n);m=`
      <table class="report-table">
        <thead>
          <tr>
            <th>Họ và tên</th><th>Bộ phận</th>
            ${t.slice(0,9).map(e=>`<th>${e}</th>`).join(``)}
            <th>Ngoài giờ</th>
            <th>Thu nhập tính thuế</th>
          </tr>
        </thead>
        <tbody>
          ${o.map(e=>{let t=e.rawAmounts[8]+e.otAmount,n=(e.rawAmounts[9]||0)+(e.rawAmounts[10]||0)+(e.rawAmounts[11]||0),r=c[e.name]||0,i=t-n-e.months*(y+r*b);return`<tr>
              <td>${e.name}</td><td>${e.dept}</td>
              ${e.rawAmounts.slice(0,9).map(e=>`<td>${D(e)}</td>`).join(``)}
              <td>${D(e.otAmount)}</td>
              <td>${D(i>0?i:0)}</td>
            </tr>`}).join(``)}
        </tbody>
      </table>
    `}s.innerHTML=`
    <div style="display:flex; justify-content:space-between; margin-bottom:1.5rem; font-size:0.85rem;">
      <div style="text-align:center;">
        <p>BỆNH VIỆN ĐA KHOA</p>
        <p>THAN UYÊN</p>
        <p>-------</p>
      </div>
      <div style="text-align:center;">
        <p>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
        <p>Độc lập - Tự do - Hạnh phúc</p>
        <p>---------------</p>
      </div>
    </div>
    <div style="text-align:center; margin-bottom:2rem;">
      <h2 style="margin:0; font-size:1.4rem;">${l}</h2>
      <h3 style="margin:0.5rem 0; font-size:1.1rem;">${p}</h3>
    </div>
    <div style="overflow-x:auto;">
      ${m}
    </div>
    <div style="margin-top:3rem; display:grid; grid-template-columns: 1fr 1fr 1fr; text-align:center; font-size:0.9rem;">
      <div>
        <p style="font-weight:700;">NGƯỜI LẬP BIỂU</p>
        <p style="margin-top:4rem;">(Ký, ghi rõ họ tên)</p>
      </div>
      <div>
        <p style="font-weight:700;">KẾ TOÁN TRƯỞNG</p>
        <p style="margin-top:4rem;">(Ký, ghi rõ họ tên)</p>
      </div>
      <div>
        <p style="font-style:italic;">${g}</p>
        <p style="font-weight:700;">GIÁM ĐỐC</p>
        <p style="margin-top:4rem;">(Ký tên, đóng dấu)</p>
      </div>
    </div>
  `,f={type:e,title:l,subTitle:p},t.style.display=`flex`,lucide.createIcons()},window.doExport=function(e){if(!f)return;let{type:t,title:n,subTitle:r}=f,i=`${n}_${r}`.replace(/[\s/]+/g,`_`);if(e===`pdf`){let e=document.getElementById(`preview-container`),t={margin:[10,5,10,5],filename:`${i}.pdf`,image:{type:`jpeg`,quality:.98},html2canvas:{scale:2,useCORS:!0},jsPDF:{unit:`mm`,format:`a4`,orientation:`landscape`}};html2pdf().set(t).from(e).save()}else{let e=document.querySelector(`.report-table`);if(!e)return;let t=XLSX.utils.table_to_book(e,{sheet:`Bao Cao`});XLSX.writeFile(t,`${i}.xlsx`)}},window.copyBonusFromPrevious=function(){let e=T(Object.keys(o)).find(e=>e!==n);if(!e)return alert(`Không tìm thấy dữ liệu tháng trước!`);confirm(`Bạn có muốn sao chép danh sách khen thưởng từ tháng ${e} sang tháng ${n}?`)&&(o[n]=JSON.parse(JSON.stringify(o[e])),x(),G(),alert(`Đã sao chép thành công!`))},A(),G();