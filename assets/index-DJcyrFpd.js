(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`https://docs.google.com/spreadsheets/d/1Hv_suFrUYa5ZInJrYbOLkGCYwJv4A7w_YAyysgMZlAk/export?format=csv&gid=535447968`,t=`dashboard`,n=`05/2026`,r=`all`,i={},a={},o={},s={},c=[],l={},u=``,d=`monthly`,f=`q1`,p=null,m=`salary`,h=234e4,g=2026,_=null,v=new Set,y={},b={},x=155e5,S=62e5;try{i=JSON.parse(localStorage.getItem(`hospital_salary_data`))||{},a=JSON.parse(localStorage.getItem(`hospital_overtime_data`))||{},o=JSON.parse(localStorage.getItem(`hospital_bonus_data`))||{},s=JSON.parse(localStorage.getItem(`hospital_nq20_data`))||{},c=JSON.parse(localStorage.getItem(`hospital_salary_headers`))||[],l=JSON.parse(localStorage.getItem(`hospital_dependent_overrides`))||{},b=JSON.parse(localStorage.getItem(`hospital_budget_promotion_data`))||{};let e=!1;[a,o,s].forEach(t=>{Object.values(t).forEach(t=>{Array.isArray(t)&&t.forEach(t=>{t&&t.name&&/\([^)]+\)$/.test(t.name.trim())&&(t.name=t.name.replace(/\s*\([^)]+\)\s*$/,``),e=!0)})})}),e&&(localStorage.setItem(`hospital_overtime_data`,JSON.stringify(a)),localStorage.setItem(`hospital_bonus_data`,JSON.stringify(o)),localStorage.setItem(`hospital_nq20_data`,JSON.stringify(s)))}catch{i={},a={},o={},s={},c=[],l={},b={}}function C(){localStorage.setItem(`hospital_salary_data`,JSON.stringify(i)),localStorage.setItem(`hospital_overtime_data`,JSON.stringify(a)),localStorage.setItem(`hospital_bonus_data`,JSON.stringify(o)),localStorage.setItem(`hospital_nq20_data`,JSON.stringify(s)),localStorage.setItem(`hospital_salary_headers`,JSON.stringify(c)),localStorage.setItem(`hospital_dependent_overrides`,JSON.stringify(l)),localStorage.setItem(`hospital_budget_promotion_data`,JSON.stringify(b))}window.deleteNQ20Month=function(){let e=document.getElementById(`nq20-month-selector`)||document.getElementById(`month-selector`);e&&(n=e.value),confirm(`Xóa dữ liệu đãi ngộ NQ20 tháng `+n+`?`)&&(s[n]=[],C(),$())},window.deleteBonusMonth=function(){let e=document.getElementById(`bn-month-selector`)||document.getElementById(`month-selector`);e&&(n=e.value),console.log(`Attempting to delete Bonus for:`,n),confirm(`Xóa dữ liệu khen thưởng tháng `+n+`?`)&&(delete o[n],C(),$(),console.log(`Bonus deleted successfully`))},window.deleteOTMonth=function(){let e=document.getElementById(`ot-month-selector`)||document.getElementById(`month-selector`);e&&(n=e.value),confirm(`Xóa dữ liệu ngoài giờ tháng `+n+`?`)&&(delete a[n],C(),$())},window.deleteMonth=function(){let e=document.getElementById(`month-selector`);if(e&&(n=e.value),confirm(`Bạn có chắc chắn muốn xóa dữ liệu lương tháng `+n+`?`)){delete i[n];let e=D(Object.keys(i));n=e.length?e[0]:`05/2026`,C(),$()}};var w=e=>{if(!e||!e.name)return!1;let t=String(e.name).trim();return t.length>3&&isNaN(t)&&/[a-zA-ZÀ-ỹ]/.test(t)&&!t.startsWith(`Tổng`)};function T(e){if(typeof e==`number`)return e;if(!e)return 0;let t=e.toString().trim(),n=/^-/.test(t)?-1:1,r=t.replace(/[^\d]/g,``);return n*(parseInt(r)||0)}function E(e){if(typeof e==`number`)return e;if(!e)return 0;let t=e.toString().trim().replace(`,`,`.`);return parseFloat(t)||0}function D(e){return e.sort((e,t)=>{let[n=0,r=0]=String(e).split(`/`).map(Number),[i=0,a=0]=String(t).split(`/`).map(Number);return a*12+i-(r*12+n)})}function O(e,t=``){try{if(!e)return``;let n=e.trim(),r=n.match(/\/d\/(.*?)(\/|$)/);if(!r)return n;let i=`https://docs.google.com/spreadsheets/d/${r[1]}/export?format=csv`;if(t)i+=`&gid=${t}`;else{let e=n.match(/gid=([\d]+)/);e&&(i+=`&gid=${e[1]}`)}return i}catch{return e}}function k(e){return(e||0).toLocaleString(`vi-VN`)}function A(e){let t=Papa.parse(e,{skipEmptyLines:!0}).data,n=t.findIndex(e=>e.some(e=>e&&(e.toString().trim()===`TT`||e.toString().trim()===`STT`)));n===-1&&(n=6),c=t[n]?t[n].map(e=>e.toString().trim()):[];let r=[];for(let e=n+1;e<t.length;e++){let n=t[e];if(n.some(e=>e&&(e.toString().toLowerCase().includes(`tổng cộng`)||e.toString().toLowerCase()===`cộng`)))break;let i=String(n[1]||``).trim();if(!w({name:i}))continue;let a={base:n[4],area:n[5],vkhung:n[6],position:n[7],responsibility:n[8],incentive:n[9],toxic:n[10],party:n[11]},o=[T(n[13]),T(n[14]),T(n[15]),T(n[16]),T(n[17]),T(n[18]),T(n[19]),T(n[20]),T(n[21]),T(n[22]),T(n[23]),T(n[24]),T(n[25]),T(n[26]),T(n[27]),T(n[28]),T(n[29]),T(n[30]),T(n[31])];r.push({id:String(n[0]||``).trim(),name:i,department:String(n[2]||``).trim(),position:String(n[3]||``).trim(),coefficients:a,rawAmounts:o,numDependents:T(n[27])||0,total:o[8]||0,net:o[18]||0})}return r}function j(e){let t=Papa.parse(e,{skipEmptyLines:!0}).data;if(t.length<2)return[];let n=t.findIndex(e=>e.some(e=>e&&e.toString().toLowerCase().includes(`họ và tên`)));n===-1&&(n=0);let r=Array(t[n].length).fill(``);for(let e=0;e<=n;e++)t[e].forEach((e,t)=>{e&&(r[t]+=` `+e.toString().toLowerCase())});let i=r.findIndex(e=>e.includes(`họ và tên`)),a=r.findIndex(e=>e.includes(`tiền thưởng`)||e.includes(`tổng số`)||e.includes(`thực lĩnh`));a===-1&&(a=8),i===-1&&(i=1);let o=r.findIndex(e=>e.includes(`khoa`)||e.includes(`phòng`)||e.includes(`đơn vị`)),s=r.findIndex(e=>e.includes(`nội dung`)||e.includes(`ghi chú`)),c=[];for(let e=n+1;e<t.length;e++){let n=t[e];if(n.some(e=>e&&(e.toString().toLowerCase().includes(`tổng cộng`)||e.toString().toLowerCase()===`cộng`)))break;let r=n[i]?.toString().trim();!r||r===``||/^[IVXLCDM]+\./.test(r)||r.split(` `).length<2&&isNaN(r)===!1||(r=r.replace(/\s*\([^)]+\)\s*$/,``),c.push({name:r,dept:o===-1?``:n[o]?.toString().trim(),amount:T(n[a]),content:s===-1?`Thưởng NĐ73`:n[s]?.toString().trim()}))}return c}async function M(){if(i[n]&&i[n].length>0){$();return}$();try{let t=A(await(await fetch(`https://corsproxy.io/?${encodeURIComponent(O(e))}`)).text());t.length&&(i[n]=t,C())}catch(e){console.error(e)}finally{$()}}var N=()=>`
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
      <li class="nav-item ${t===`nq20`?`active`:``}" data-tab="nq20"><i data-lucide="award"></i><span>Chế độ NQ20</span></li>
      <li class="nav-item ${t===`pit`?`active`:``}" data-tab="pit"><i data-lucide="calculator"></i><span>Thuế TNCN</span></li>
      <li class="nav-item ${t===`budget`?`active`:``}" data-tab="budget"><i data-lucide="trending-up"></i><span>Dự toán N+1</span></li>
    </ul>
    <div class="sidebar-footer">
      <button id="theme-toggle" class="icon-btn" title="Đổi màu nền"><i data-lucide="moon"></i></button>
      <button onclick="window.emergencyReset()" class="icon-btn" title="Khôi phục hệ thống" style="color:#ef4444;"><i data-lucide="refresh-cw"></i></button>
    </div>
  </aside>`;function P(e,t){let n={};return t.forEach(t=>{e[t]&&e[t].forEach(e=>{let t=e.name||e[1];if(t&&(n[t]||(n[t]={...e,months_count:0},Object.keys(n[t]).forEach(e=>{typeof n[t][e]==`number`&&(n[t][e]=0)}),Array.isArray(e.rawAmounts)&&(n[t].rawAmounts=Array(e.rawAmounts.length).fill(0))),n[t].months_count+=e.months===void 0?1:e.months,Object.keys(e).forEach(r=>{typeof e[r]==`number`&&(n[t][r]=(n[t][r]||0)+e[r])}),Array.isArray(e.rawAmounts))){let r=n[t].rawAmounts||[];e.rawAmounts.forEach((e,t)=>{r[t]=(r[t]||0)+(e||0)}),n[t].rawAmounts=r}})}),Object.values(n).sort((e,t)=>(e.id||0)-(t.id||0))}function F(e,t=`2026`){if(e===`all`)return Array.from({length:12},(e,n)=>`${(n+1).toString().padStart(2,`0`)}/${t}`);if(e===`all_years`){let e=[];for(let t=2020;t<=2030;t++)for(let n=1;n<=12;n++)e.push(`${n.toString().padStart(2,`0`)}/${t}`);return e}if(e.startsWith(`y`)){let t=e.substring(1);return Array.from({length:12},(e,n)=>`${(n+1).toString().padStart(2,`0`)}/${t}`)}if(e.startsWith(`q`)){let n=parseInt(e[1]);return[`${(n*3-2).toString().padStart(2,`0`)}/${t}`,`${(n*3-1).toString().padStart(2,`0`)}/${t}`,`${(n*3).toString().padStart(2,`0`)}/${t}`]}return[]}var I=e=>`
  <header class="top-bar">
    <h1 style="font-size:1.5rem;font-weight:700;">${e}</h1>
    <div class="search-bar"><i data-lucide="search" size="18"></i><input type="text" id="search-input" placeholder="Tìm kiếm..."></div>
  </header>`,L=()=>{let e=[],t=``;if(d===`monthly`){let r=(i[n]||[]).filter(w);e=u?r.filter(e=>e.name.toLowerCase().includes(u.toLowerCase())||e.department.toLowerCase().includes(u.toLowerCase())):r,t=`Bảng lương `+n}else{let n=F(f);e=P(i,n),t=`Tổng hợp Lương `+(f===`all`?`Cả năm`:`Quý `+f[1])}let r=D(Object.keys(i));return`
  <div class="fade-in">
    ${I(t)}
    <div class="card">
      <div style="display:flex;justify-content:space-between;margin-bottom:1.5rem;gap:1rem;flex-wrap:wrap;">
        <div style="display:flex;gap:1rem;align-items:center;">
          <div class="segmented-control">
            <button class="control-btn ${d===`monthly`?`active`:``}" onclick="window.setViewMode('monthly')">Theo tháng</button>
            <button class="control-btn ${d===`summary`?`active`:``}" onclick="window.setViewMode('summary')">Tổng hợp</button>
          </div>
          ${d===`monthly`?`
            <select class="select-input" id="month-selector">${r.length?r.map(e=>`<option value="${e}" ${n===e?`selected`:``}>${e}</option>`).join(``):`<option>${n}</option>`}</select>
            <button class="btn btn-secondary" id="delete-salary-btn" style="color:#ef4444;font-size:0.85rem;">🗑️ Xóa</button>
          `:`
            <select class="select-input" id="summary-period-selector">
              <option value="all" ${f===`all`?`selected`:``}>Cả năm 2026</option>
              <option value="q1" ${f===`q1`?`selected`:``}>Quý I</option>
              <option value="q2" ${f===`q2`?`selected`:``}>Quý II</option>
              <option value="q3" ${f===`q3`?`selected`:``}>Quý III</option>
              <option value="q4" ${f===`q4`?`selected`:``}>Quý IV</option>
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
              ${d===`summary`?`<th>Số tháng</th>`:``}
              <th>Chức vụ</th><th>HSL</th><th>KV</th><th>VK</th><th>CV</th><th>TN</th><th>ƯĐ</th><th>ĐH</th><th>CU</th>
              ${[`Lương chính`,`PC vượt khung`,`PC Khu vực`,`PC Chức vụ`,`PC Trách nhiệm`,`PC ưu đãi ngành`,`PC Độc hại`,`PC cấp ủy`,`Tổng cộng lương`,`Khấu trừ 10,5% BH`,`KT 10,5% BH CV`,`KT 10,5% BH VK`,`Trừ ốm LC`,`Trừ ốm VK`,`Trừ ốm CV`,`Trừ ốm TN`,`Trừ ốm ƯĐ`,`Trừ ốm ĐH`,`Tổng lĩnh`].map((e,t)=>`<th class="${t===8?`highlight-total`:t===18?`highlight-col`:``}">${e}</th>`).join(``)}
            </tr>
          </thead>
          <tbody>
            ${e.map(e=>`<tr>
              <td class="sticky-col col-tt">${e.id||``}</td><td class="sticky-col col-name" style="font-weight:600;">${e.name}</td><td class="sticky-col col-dept">${e.department||e.dept||``}</td>
              ${d===`summary`?`<td style="text-align:center;">${e.months_count}</td>`:``}
              <td>${e.position||``}</td>
              <td class="text-center">${e.coefficients?.base||``}</td><td class="text-center">${e.coefficients?.area||``}</td><td class="text-center">${e.coefficients?.vkhung||``}</td><td class="text-center">${e.coefficients?.position||``}</td><td class="text-center">${e.coefficients?.responsibility||``}</td><td class="text-center">${e.coefficients?.incentive||``}</td><td class="text-center">${e.coefficients?.toxic||``}</td><td class="text-center">${e.coefficients?.party||``}</td>
              ${(e.rawAmounts||Array(19).fill(0)).map((e,t)=>`<td class="${t===8?`highlight-total`:t===18?`highlight-col`:``}">${k(e)}</td>`).join(``)}
            </tr>`).join(``)}
          </tbody>
        </table>
      </div>
    </div>
  </div>`};function R(e){let t={};return[...new Set([...Object.keys(i),...Object.keys(a),...Object.keys(o)])].forEach(n=>{let r=parseInt(n.split(`/`)[0]);if(isNaN(r)||e!==`all`&&e!==(r<=3?`1`:r<=6?`2`:r<=9?`3`:`4`))return;let s={},c=e=>{if(e&&e.name&&w(e)){let t=e.name.replace(/\s+/g,` `).trim();s[t]||(s[t]={name:t,dept:e.department||e.dept||``})}};(i[n]||[]).forEach(c),(a[n]||[]).forEach(c),(o[n]||[]).forEach(c),Object.values(s).forEach(e=>{let r=e.name;t[r]||(t[r]={name:r,dept:e.dept,monthsInPeriod:0,rawAmounts:Array(19).fill(0),otAmount:0,bonusAmount:0,numDependents:l[r]===void 0?0:l[r],id:0}),t[r].monthsInPeriod+=1;let s=e=>(e||``).replace(/\s+/g,` `).trim().toLowerCase(),c=s(r),u=(i[n]||[]).find(e=>s(e.name)===c);u&&u.rawAmounts&&(u.id&&(t[r].id=parseInt(u.id)||t[r].id),u.rawAmounts.forEach((e,n)=>t[r].rawAmounts[n]=(t[r].rawAmounts[n]||0)+(e||0)),l[r]===void 0&&u.numDependents&&(t[r].numDependents=Math.max(t[r].numDependents,u.numDependents)));let d=(a[n]||[]).find(e=>s(e.name)===c);t[r].otAmount+=d?d.amount:0;let f=(o[n]||[]).find(e=>s(e.name)===c);t[r].bonusAmount+=f?f.amount:0})}),Object.values(t).map(e=>{let t=e.rawAmounts[8]+e.otAmount+e.bonusAmount,n=e.monthsInPeriod*x,r=e.monthsInPeriod*(e.numDependents*S),i=(e.rawAmounts[9]||0)+(e.rawAmounts[10]||0)+(e.rawAmounts[11]||0),a=t-i-n-r;return{...e,months:e.monthsInPeriod,gross_taxable:t,gt_bt:n,gt_npt:r,taxable:a,insurance:i}}).sort((e,t)=>(e.id||999999)-(t.id||999999))}var z=()=>{let e=[`Lương chính`,`PC vượt khung`,`PC Khu vực`,`PC Chức vụ`,`PC Trách nhiệm`,`PC ưu đãi ngành`,`PC Độc hại`,`PC cấp ủy`,`Tổng cộng lương`,`Khấu trừ 10,5% BH`,`KT 10,5% BH CV`,`KT 10,5% BH VK`,`Trừ ốm LC`,`Trừ ốm VK`,`Trừ ốm CV`,`Trừ ốm TN`,`Trừ ốm ƯĐ`,`Trừ ốm ĐH`,`Tổng lĩnh`],t=R(r),n=u?t.filter(e=>e.name.toLowerCase().includes(u.toLowerCase())):t;return`
  <div class="fade-in">
    ${I(`Thuế TNCN - Tổng hợp số liệu `+(r===`all`?`Cả năm`:`Quý ${r}`))}
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
            ${n.map((e,t)=>`<tr>
              <td class="sticky-col col-tt">${t+1}</td>
              <td class="sticky-col col-name" style="font-weight:600;">${e.name}</td>
              <td class="sticky-col col-dept">${e.dept}</td>
              ${e.rawAmounts.map((e,t)=>`<td class="${t===8?`highlight-total`:t===18?`highlight-col`:``}">${k(e)}</td>`).join(``)}
              <td style="background:rgba(14, 165, 233, 0.05);">${k(e.otAmount)}</td>
              <td style="background:rgba(14, 165, 233, 0.05);">${k(e.bonusAmount)}</td>
              <td class="highlight-col" style="font-weight:700;color:var(--primary);">${k(e.taxable>0?e.taxable:0)}</td>
              <td><input type="number" class="select-input npt-input" data-name="${e.name}" value="${e.numDependents}" style="width:50px;text-align:center;padding:2px;"></td>
            </tr>`).join(``)}
          </tbody>
        </table>
      </div>
    </div>
  </div>`},B=()=>{let e=[],t=``;if(d===`monthly`){let r=o[n]||[];e=u?r.filter(e=>e.name.toLowerCase().includes(u.toLowerCase())):r,t=`Danh sách Khen thưởng ${n}`}else{let n=F(f),r=P(o,n);e=u?r.filter(e=>e.name.toLowerCase().includes(u.toLowerCase())):r,t=`Tổng hợp Khen thưởng `+(f===`all`?`Cả năm`:`Quý `+f[1])}let r=D(Object.keys(o));return`
  <div class="fade-in">
    ${I(t)}
    <div class="card">
      <div style="display:flex;justify-content:space-between;margin-bottom:1.5rem;gap:1rem;flex-wrap:wrap;">
        <div style="display:flex;gap:1rem;align-items:center;">
          <div class="segmented-control">
            <button class="control-btn ${d===`monthly`?`active`:``}" onclick="window.setViewMode('monthly')">Theo tháng</button>
            <button class="control-btn ${d===`summary`?`active`:``}" onclick="window.setViewMode('summary')">Tổng hợp</button>
          </div>
          ${d===`monthly`?`
            <select class="select-input" id="bn-month-selector">${r.length?r.map(e=>`<option value="${e}" ${n===e?`selected`:``}>${e}</option>`).join(``):`<option>${n}</option>`}</select>
            <button class="btn btn-secondary" onclick="window.copyBonusFromPrevious()" style="font-size:0.85rem;">Sao chép tháng trước</button>
            <button class="btn btn-secondary" id="delete-bonus-btn" style="color:#ef4444;font-size:0.85rem;">🗑️ Xóa</button>
          `:`
            <select class="select-input" id="bn-period-selector">
              <option value="all" ${f===`all`?`selected`:``}>Cả năm 2026</option>
              <option value="q1" ${f===`q1`?`selected`:``}>Quý I</option>
              <option value="q2" ${f===`q2`?`selected`:``}>Quý II</option>
              <option value="q3" ${f===`q3`?`selected`:``}>Quý III</option>
              <option value="q4" ${f===`q4`?`selected`:``}>Quý IV</option>
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
            ${e.length>0?e.map((e,t)=>`<tr><td>${t+1}</td><td>${e.name}</td><td>${e.dept||``}</td><td>${e.content||``}</td><td class="highlight-total">${k(e.amount)}</td></tr>`).join(``):`<tr><td colspan="5" style="text-align:center;padding:3rem;color:var(--text-muted);">Chưa có dữ liệu khen thưởng tháng ${n}.<br><br><button class="btn btn-primary" onclick="document.getElementById('import-bonus-btn').click()">Import ngay</button></td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  </div>`},V=()=>{let e=[],t=``;if(d===`monthly`){let r=a[n]||[];e=u?r.filter(e=>e.name.toLowerCase().includes(u.toLowerCase())):r,t=`Trực & Ngoài giờ ${n}`}else{let n=F(f),r=P(a,n);e=u?r.filter(e=>e.name.toLowerCase().includes(u.toLowerCase())):r,t=`Tổng hợp Ngoài giờ `+(f===`all`?`Cả năm`:`Quý `+f[1])}let r=D(Object.keys(a));return`
  <div class="fade-in">
    ${I(t)}
    <div class="card">
      <div style="display:flex;justify-content:space-between;margin-bottom:1.5rem;gap:1rem;flex-wrap:wrap;">
        <div style="display:flex;gap:1rem;align-items:center;">
          <div class="segmented-control">
            <button class="control-btn ${d===`monthly`?`active`:``}" onclick="window.setViewMode('monthly')">Theo tháng</button>
            <button class="control-btn ${d===`summary`?`active`:``}" onclick="window.setViewMode('summary')">Tổng hợp</button>
          </div>
          ${d===`monthly`?`
            <select class="select-input" id="ot-month-selector">${r.length?r.map(e=>`<option value="${e}" ${n===e?`selected`:``}>${e}</option>`).join(``):`<option>${n}</option>`}</select>
            <button class="btn btn-secondary" id="delete-ot-btn" style="color:#ef4444;font-size:0.85rem;">🗑️ Xóa</button>
          `:`<select class="select-input" id="ot-period-selector"><option value="all" ${f===`all`?`selected`:``}>Cả năm</option><option value="q1" ${f===`q1`?`selected`:``}>Quý I</option><option value="q2" ${f===`q2`?`selected`:``}>Quý II</option><option value="q3" ${f===`q3`?`selected`:``}>Quý III</option><option value="q4" ${f===`q4`?`selected`:``}>Quý IV</option></select>`}
        </div>
        <div style="display:flex;gap:0.5rem;align-items:center;">
          <button class="btn btn-secondary" onclick="window.showReportPreview('overtime')" title="Xem trước & Xuất báo cáo"><i data-lucide="printer" size="16"></i> Xem trước & Xuất</button>
          <button class="btn btn-primary" id="import-ot-btn">Import Ngoài giờ</button>
        </div>
      </div>
      <div class="table-container" style="max-height:650px;">
        <table class="salary-detail-table">
          <thead><tr><th>STT</th><th>Họ tên</th><th>Tổng lĩnh</th></tr></thead>
          <tbody>
            ${e.length>0?e.map((e,t)=>`<tr><td>${t+1}</td><td>${e.name}</td><td>${k(e.amount)}</td></tr>`).join(``)+`<tr class="total-row"><td colspan="2" style="text-align:center;font-weight:bold;text-transform:uppercase;">Tổng cộng</td><td style="font-weight:bold;color:var(--primary);">${k(e.reduce((e,t)=>e+(t.amount||0),0))}</td></tr>`:`<tr><td colspan="3" style="text-align:center;padding:3rem;color:var(--text-muted);">Chưa có dữ liệu ngoài giờ.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  </div>`},H=()=>{let e=[],t=``;if(d===`monthly`){let r=s[n]||[];e=u?r.filter(e=>e.name.toLowerCase().includes(u.toLowerCase())):r,t=`Danh sách Đãi ngộ NQ20 ${n}`}else{let n=F(f),r=P(s,n);e=u?r.filter(e=>e.name.toLowerCase().includes(u.toLowerCase())):r;let i=`Quý `+f[1];f===`all`?i=`Cả năm`:f.startsWith(`y`)?i=`Năm `+f.substring(1):f===`all_years`&&(i=`Tất cả các năm`),t=`Tổng hợp Đãi ngộ NQ20 `+i}let r=D([...new Set([...Object.keys(i),...Object.keys(s)])]);return`
  <div class="fade-in">
    ${I(t)}
    <div class="card">
      <div style="display:flex;justify-content:space-between;margin-bottom:1.5rem;gap:1rem;flex-wrap:wrap;">
        <div style="display:flex;gap:1rem;align-items:center;">
          <div class="segmented-control">
            <button class="control-btn ${d===`monthly`?`active`:``}" onclick="window.setViewMode('monthly')">Theo tháng</button>
            <button class="control-btn ${d===`summary`?`active`:``}" onclick="window.setViewMode('summary')">Tổng hợp</button>
          </div>
          ${d===`monthly`?`
            <select class="select-input" id="nq20-month-selector">${r.length?r.map(e=>`<option value="${e}" ${n===e?`selected`:``}>${e}</option>`).join(``):`<option>${n}</option>`}</select>
            <button class="btn btn-secondary" onclick="window.initializeNQ20FromSalary()" style="font-size:0.85rem;" title="Lọc toàn bộ Bác sĩ từ bảng lương tháng hiện tại">Khởi tạo từ Bảng lương</button>
            <button class="btn btn-secondary" onclick="window.copyNQ20FromPrevious()" style="font-size:0.85rem;">Sao chép tháng trước</button>
            <button class="btn btn-secondary" id="delete-nq20-btn" style="color:#ef4444;font-size:0.85rem;">🗑️ Xóa</button>
          `:`
            <select class="select-input" id="nq20-period-selector">
              <option value="all_years" ${f===`all_years`?`selected`:``}>Tất cả các năm</option>
              <option value="y2026" ${f===`y2026`?`selected`:``}>Năm 2026</option>
              <option value="y2025" ${f===`y2025`?`selected`:``}>Năm 2025</option>
              <option value="y2024" ${f===`y2024`?`selected`:``}>Năm 2024</option>
              <option value="y2023" ${f===`y2023`?`selected`:``}>Năm 2023</option>
              <option value="all" ${f===`all`?`selected`:``}>Cả năm hiện tại</option>
              <option value="q1" ${f===`q1`?`selected`:``}>Quý I</option>
              <option value="q2" ${f===`q2`?`selected`:``}>Quý II</option>
              <option value="q3" ${f===`q3`?`selected`:``}>Quý III</option>
              <option value="q4" ${f===`q4`?`selected`:``}>Quý IV</option>
            </select>
          `}
        </div>
        <div style="display:flex;gap:0.5rem;align-items:center;">
          <button class="btn btn-secondary" onclick="window.showReportPreview('nq20')" title="Xem trước & Xuất báo cáo"><i data-lucide="printer" size="16"></i> Xem trước & Xuất</button>
          
          <button class="btn btn-primary" id="import-nq20-btn">Import NQ20</button>
        </div>
      </div>
      <div class="table-container" style="max-height:650px;">
        <table class="salary-detail-table">
          <thead>
            <tr>
              <th>TT</th>
              <th>Họ và tên</th>
              ${d===`monthly`?`
                <th>Đối tượng</th>
                <th>Đơn vị công tác</th>
                <th>Định mức</th>
                <th>Số tháng hưởng</th>
                <th>Thành tiền</th>
                <th>Ghi chú</th>
              `:`
                <th>Đơn vị công tác</th>
                <th>Số tháng hưởng NQ20</th>
                <th>Tổng số tiền đãi ngộ</th>
              `}
            </tr>
          </thead>
          <tbody>
            ${e.length>0?e.map((e,t)=>{if(d===`monthly`){let n=e.limit||e.amount,r=[2e6,15e5,12e5,1e6].includes(n);!r&&!e.categoryKey||e.categoryKey;let i=e.limit===void 0?r?n:e.amount:e.limit,a=e.months===void 0?1:e.months;return`
                    <tr>
                      <td>${t+1}</td>
                      <td style="font-weight:600;">${e.name}</td>
                      <td>
                        ${e.category||(e.categoryKey===`TS_CKII`?`Tiến sĩ / Bác sĩ CKII (2,0M)`:e.categoryKey===`THS_CKI_BSNT`?`Thạc sĩ / BSCKI / BS Nội trú (1,5M)`:e.categoryKey===`BS_TYT_DBKK`?`Bác sĩ TYT xã ĐBKK (1,2M)`:e.categoryKey===`BS_TYT`?`Bác sĩ Trạm y tế / PKĐKKV (1,0M)`:`Khác`)}
                      </td>
                      <td>${e.dept||``}</td>
                      <td style="text-align:right;">${k(i)}</td>
                      <td style="text-align:center;">${a}</td>
                      <td class="highlight-total" style="text-align:right; font-weight:700;">
                        ${k(e.amount)}
                      </td>
                      <td>${e.notes||e.content||``}</td>
                    </tr>`}else{let n=e.months_count>=59;return`
                    <tr style="${n?`color: #ef4444; background: #fee2e2;`:``}" title="${n?`Đã hưởng từ 59 tháng trở lên`:``}">
                      <td>${t+1}</td>
                      <td style="font-weight:600;">${e.name}</td>
                      <td>${e.dept||``}</td>
                      <td style="text-align:center; font-weight: ${n?`700`:`normal`};">${e.months_count}</td>
                      <td class="highlight-total" style="${n?`color: #ef4444;`:``}">${k(e.amount)}</td>
                    </tr>`}}).join(``):`<tr><td colspan="${d===`monthly`?8:6}" style="text-align:center;padding:3rem;color:var(--text-muted);">Chưa có dữ liệu đãi ngộ NQ20 tháng ${n}.<br><br><div style="display:flex;gap:0.5rem;justify-content:center;"><button class="btn btn-primary" onclick="window.initializeNQ20FromSalary()">Khởi tạo từ Bảng lương</button><button class="btn btn-secondary" onclick="document.getElementById('import-nq20-btn').click()">Import ngay</button></div></td></tr>`}
          </tbody>
          ${e.length>0?`
          <tfoot>
            <tr style="font-weight:700; background:var(--card-bg); border-top:2px solid var(--accent);">
              <td colspan="${d===`monthly`?4:3}" style="text-align:left; padding-left:10px;">Tổng cộng: ${e.length} Bác sỹ</td>
              ${d===`monthly`?`
                <td></td>
                <td></td>
                <td style="text-align:right; font-weight:700; color:var(--primary);">${k(e.reduce((e,t)=>e+(t.amount||0),0))}</td>
                <td></td>
                <td></td>
              `:`
                <td style="text-align:center;">${e.reduce((e,t)=>e+(t.months_count||0),0)}</td>
                <td style="text-align:right; font-weight:700; color:var(--primary);">${k(e.reduce((e,t)=>e+(t.amount||0),0))}</td>
              `}
            </tr>
          </tfoot>
          `:``}
        </table>
      </div>
    </div>
  </div>`};function U(e){let t=Papa.parse(e,{skipEmptyLines:!0}).data;if(t.length<2)return[];let n=t.findIndex(e=>e.some(e=>e&&(e.toString().toLowerCase().includes(`họ và tên`)||e.toString().toLowerCase().includes(`họ tên`)||e.toString().toLowerCase()===`họ tên`)));n===-1&&(n=0);let r=Array(t[n].length).fill(``);for(let e=0;e<=n;e++)t[e].forEach((e,t)=>{e&&(r[t]+=` `+e.toString().toLowerCase())});let i=r.findIndex(e=>e.includes(`họ và tên`)||e.includes(`họ tên`)),a=r.findIndex(e=>e.includes(`thực lĩnh`)||e.includes(`tổng số`)||e.includes(`số tiền`)||e.includes(`thành tiền`));a===-1&&(a=10),i===-1&&(i=1);let o=[];for(let e=n+1;e<t.length;e++){let n=t[e];if(n.some(e=>e&&(e.toString().toLowerCase().includes(`tổng cộng`)||e.toString().toLowerCase()===`cộng`||e.toString().toLowerCase().includes(`tổng số tiền`))))break;let r=n[i]?.toString().trim();if(!r||r===``||/^[IVXLCDM]+\./.test(r)||n[0]&&/^[IVXLCDM]+$/.test(n[0].toString().trim())||r.split(` `).length<2&&isNaN(r)===!1||r.toLowerCase().includes(`tổng số`)||r.toLowerCase().includes(`tài khoản`))continue;r=r.replace(/\s*\([^)]+\)\s*$/,``);let s=T(n[a])||T(n[10])||T(n[20]);o.push({name:r,amount:s})}return o}function W(e){let t=Papa.parse(e,{skipEmptyLines:!0}).data;if(t.length<2)return[];let n=t.findIndex(e=>e.some(e=>e&&(e.toString().toLowerCase().includes(`họ và tên`)||e.toString().toLowerCase().includes(`họ tên`)||e.toString().toLowerCase()===`họ tên`)));n===-1&&(n=0);let r=Array(t[n].length).fill(``);t[n].forEach((e,t)=>{e&&(r[t]=e.toString().toLowerCase().trim())});let i=r.findIndex(e=>e.includes(`họ tên`)||e.includes(`họ và tên`)||e.includes(`tên nhân viên`)||e.includes(`người hưởng`));i===-1&&(i=1);let a=r.findIndex(e=>e.includes(`số tiền`)||e.includes(`tiền hỗ trợ`)||e.includes(`tiền đãi ngộ`)||e.includes(`tiền`)||e.includes(`đãi ngộ`)||e.includes(`tổng số`)||e.includes(`thực lĩnh`)||e.includes(`hỗ trợ`)||e.includes(`mức hỗ trợ`)||e.includes(`thành tiền`));a===-1&&(a=6);let o=r.findIndex(e=>e.includes(`khoa`)||e.includes(`phòng`)||e.includes(`đơn vị`)||e.includes(`bộ phận`)||e.includes(`nơi làm việc`)),s=r.findIndex(e=>e.includes(`đối tượng`)||e.includes(`phân loại`)||e.includes(`trình độ`)||e.includes(`nghị quyết`)||e.includes(`chức danh`)||e.includes(`loại hỗ trợ`)),c=r.findIndex(e=>e.includes(`định mức`)),l=r.findIndex(e=>e.includes(`số tháng`)||e.includes(`thời gian`)),u=r.findIndex(e=>e.includes(`ghi chú`)||e.includes(`nội dung`)||e.includes(`chi tiết`)),d=[];for(let e=n+1;e<t.length;e++){let n=t[e];if(n.some(e=>e&&(e.toString().toLowerCase().includes(`tổng cộng`)||e.toString().toLowerCase()===`cộng`)))break;let r=n[i]?.toString().trim();if(!r||r===``||/^[IVXLCDM]+\./.test(r)||r.split(` `).length<2&&isNaN(r)===!1)continue;r=r.replace(/\s*\([^)]+\)\s*$/,``);let f=a===-1?0:T(n[a]),p=l===-1?1:T(n[l]),m=c===-1?p?f/p:f:T(n[c]),h=s===-1?``:n[s]?.toString().trim(),g=o===-1?``:n[o]?.toString().trim(),_=u===-1?``:n[u]?.toString().trim(),v=`CUSTOM`;if(h){let e=h.toLowerCase();f===2e6||e.includes(`ckii`)||e.includes(`ck ii`)||e.includes(`tiến sĩ`)||e.includes(`ts`)?v=`TS_CKII`:f===15e5||e.includes(`cki`)||e.includes(`ck i`)||e.includes(`thạc sĩ`)||e.includes(`ths`)||e.includes(`nội trú`)||e.includes(`bsnt`)?v=`THS_CKI_BSNT`:f===12e5||e.includes(`đbkk`)||e.includes(`đặc biệt khó khăn`)?v=`BS_TYT_DBKK`:(f===1e6||e.includes(`tyt`)||e.includes(`trạm y tế`)||e.includes(`phòng khám`))&&(v=`BS_TYT`)}else f===2e6?v=`TS_CKII`:f===15e5?v=`THS_CKI_BSNT`:f===12e5?v=`BS_TYT_DBKK`:f===1e6&&(v=`BS_TYT`);d.push({name:r,dept:g,category:h||(v===`CUSTOM`?`Tùy chỉnh`:`Đãi ngộ NQ20`),categoryKey:v,amount:f,limit:m,months:p||1,content:_,notes:_})}return d}var G=()=>{let e=(i[n]||[]).filter(w),t=a[n]||[],r=o[n]||[],c=s[n]||[],l=e.reduce((e,t)=>e+t.total,0),u=t.reduce((e,t)=>e+(t.amount||0),0),d=r.reduce((e,t)=>e+(t.amount||0),0),f=c.reduce((e,t)=>e+(t.amount||0),0),p=l+u+d+f;return`
  <div class="fade-in">
    ${I(`Tổng quan `+n)}
    <div class="stats-grid">
      <div class="card stat-card"><span class="stat-label">Tổng quỹ lương thực nhận</span><span class="stat-value">${k(p)}</span></div>
      <div class="card stat-card"><span class="stat-label">Tổng Trực & Ngoài giờ</span><span class="stat-value">${k(u)}</span></div>
      <div class="card stat-card"><span class="stat-label">Tổng Khen thưởng</span><span class="stat-value">${k(d)}</span></div>
      <div class="card stat-card"><span class="stat-label">Tổng Đãi ngộ NQ20</span><span class="stat-value">${k(f)}</span></div>
    </div>
  </div>`},K=()=>{let e=_||n,t=(i[e]||[]).filter(w),r={base:0,cv:0,kv:0,vk:0,tn:0,dh:0,ud56:0,sumPc:0,bhxh:0,bhyt:0,bhtn:0,kpcd:0,sumIns:0,totalCoef:0,thanhTien:0,chiThuong:0,tongCong:0},a=t.map((e,t)=>{let n=E(e.coefficients?.base),i=E(e.coefficients?.position),a=E(e.coefficients?.area),o=E(e.coefficients?.vkhung),s=E(e.coefficients?.responsibility),c=E(e.coefficients?.toxic),l=E(e.coefficients?.incentive),u=(n+i+o)*l,d=i+a+o+s+c+u+0+0+0,f=n+i+o,p=f*.175,m=f*.03,g=f*.01,_=f*.02,y=p+m+g+_,b=n+d+y,x=Math.round(b*h),S=Math.round(n*h*.1),C=x+S;r.base+=n,r.cv+=i,r.kv+=a,r.vk+=o,r.tn+=s,r.dh+=c,r.ud56+=u,r.sumPc+=d,r.bhxh+=p,r.bhyt+=m,r.bhtn+=g,r.kpcd+=_,r.sumIns+=y,r.totalCoef+=b,r.thanhTien+=x,r.chiThuong+=S,r.tongCong+=C;let w=v.has(e.name);return`<tr>
      <td class="sticky-col col-tt">${t+1}</td>
      <td class="sticky-col col-name" style="font-weight:600;">${e.name}</td>
      <td class="sticky-col col-dept">${e.department||``}</td>
      <td class="text-center"><input type="checkbox" onchange="window.toggleBudgetContract('${e.name}')" ${w?`checked`:``}></td>
      <td class="text-center">${n.toFixed(2).replace(`.`,`,`)}</td>
      <td class="text-center">${i?i.toFixed(2).replace(`.`,`,`):``}</td><td class="text-center">${a?a.toFixed(2).replace(`.`,`,`):``}</td><td class="text-center">${o?o.toFixed(2).replace(`.`,`,`):``}</td>
      <td class="text-center">${s?s.toFixed(2).replace(`.`,`,`):``}</td><td class="text-center">${c?c.toFixed(2).replace(`.`,`,`):``}</td><td class="text-center">${u?u.toFixed(2).replace(`.`,`,`):``}</td>
      <td class="text-center"></td><td class="text-center"></td><td class="text-center"></td>
      <td class="text-center" style="font-weight:600;background:#f8fafc;">${d?d.toFixed(2).replace(`.`,`,`):``}</td>
      <td class="text-center">${p.toFixed(3).replace(`.`,`,`)}</td><td class="text-center">${m.toFixed(3).replace(`.`,`,`)}</td><td class="text-center">${g.toFixed(3).replace(`.`,`,`)}</td><td class="text-center">${_.toFixed(3).replace(`.`,`,`)}</td>
      <td class="text-center" style="font-weight:600;color:var(--danger);">${y.toFixed(3).replace(`.`,`,`)}</td>
      <td class="text-center" style="font-weight:600;color:var(--primary);">${b.toFixed(3).replace(`.`,`,`)}</td>
      <td class="highlight-total">${k(x)}</td>
      <td style="background:rgba(234, 179, 8, 0.05); text-align:right;">${k(S)}</td>
      <td class="highlight-col">${k(C)}</td>
    </tr>`}).join(``);return`
    <div style="margin-bottom:1rem; display:flex; justify-content:space-between; align-items:center;">
      <div style="display:flex; align-items:center; gap:0.5rem;">
        <label style="font-weight:600;">Lấy dữ liệu từ:</label>
        <select class="select-input" onchange="window.setBudgetBaseMonth(this.value)">${D(Object.keys(i)).map(t=>`<option value="${t}" ${t===e?`selected`:``}>Tháng ${t}</option>`).join(``)}</select>
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
            <td class="highlight-total">${k(r.thanhTien)}</td><td style="text-align:right;">${k(r.chiThuong)}</td><td class="highlight-col">${k(r.tongCong)}</td>
          </tr>
        </tfoot>`:``}
      </table>
    </div>
  `},q=()=>{let e=_||n,t=(i[e]||[]).filter(w),r=0,a=0,o=0,s=0,c=0,l=0,u=0,d=0,f=t.length,p=0,m=0;t.forEach(e=>{v.has(e.name)?p++:m++;let t=E(e.coefficients?.base),n=E(e.coefficients?.position),i=E(e.coefficients?.area),f=E(e.coefficients?.vkhung),h=E(e.coefficients?.responsibility),g=E(e.coefficients?.toxic),_=E(e.coefficients?.incentive),y=(t+n+f)*_,b=(t+n+f)*.235;r+=t,a+=n,o+=i,s+=f,c+=h,l+=g,u+=y,d+=b});let h=a+o+s+c+l+u,g=r+h+d;return`
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
              <td><input type="number" class="select-input" style="width:80px;text-align:center;padding:4px;" placeholder="---" onchange="window.updateBudgetInput('giuong_benh', this.value)" value="${y.giuong_benh||``}"></td>
              <td><input type="number" class="select-input" style="width:80px;text-align:center;padding:4px;" placeholder="---" onchange="window.updateBudgetInput('bien_che_giao', this.value)" value="${y.bien_che_giao||``}"></td>
              <td style="font-weight:700;">${f}</td>
              <td style="color:var(--danger); font-weight:600;">${p}</td>
              <td style="color:var(--primary); font-weight:600;">${m}</td>
              <td style="font-weight:700;color:var(--primary);">${g.toFixed(3).replace(`.`,`,`)}</td>
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
  `},J=()=>{let e=(i[_||n]||[]).filter(w),t=0,r=0,a=0,o=0,s=0,c=e.length,l=0,u=0;e.forEach(e=>{v.has(e.name)?l++:u++;let n=E(e.coefficients?.base),i=E(e.coefficients?.position),c=E(e.coefficients?.area),d=E(e.coefficients?.vkhung),f=(n+i+d)*.235;t+=n,r+=i,a+=c,o+=d,s+=f});let d=0,f=0;e.forEach(e=>{let t=E(e.coefficients?.base),n=E(e.coefficients?.position),r=E(e.coefficients?.vkhung),i=E(e.coefficients?.incentive),a=(t+n+r)*i,o=n+E(e.coefficients?.area)+r+E(e.coefficients?.responsibility)+E(e.coefficients?.toxic)+a,s=(t+n+r)*.235;d+=Math.round((t+o+s)*h*12),f+=Math.round(t*h*.1*12)});let p=e=>y[e]||``,m=(e,t,n,r=!1,i=null)=>{if(r)return`<tr style="background:rgba(14, 165, 233, 0.1); font-weight:700;">
        <td style="text-align:center;">${e}</td><td>${t}</td>
        <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
      </tr>`;let a=e=>`<input type="${e===`ghi_chu`?`text`:`number`}" class="select-input" style="width:100%;text-align:${e===`ghi_chu`?`left`:`right`};border:none;border-radius:0;background:transparent;padding:4px;" placeholder="---" onchange="window.updateBudgetInput('${n}_${e}', this.value)" value="${p(`${n}_${e}`)}">`,o=i===null?`<td style="padding:0;">${a(`denghi`)}</td>`:`<td style="text-align:right;font-weight:600;color:var(--primary);vertical-align:middle;padding:4px;">${k(i)}</td>`;return`<tr>
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
            ${m(`I`,`Thu ngân sách`,`thu_ns`,!0)}
            ${m(`1`,`Tổng thu`,`tong_thu`)}
            ${m(`-`,`Thu phí, lệ phí`,`thu_phi`)}
            ${m(`-`,`Thu viện phí trực tiếp`,`thu_vp`)}
            ${m(`-`,`Thu KCB bảo hiểm y tế`,`thu_bhyt`)}
            ${m(`-`,`Thu dịch vụ`,`thu_dv`)}
            ${m(`-`,`Thu khác`,`thu_khac`)}
            
            ${m(`2`,`Chi từ nguồn thu sự nghiệp`,`chi_ns`,!0)}
            ${m(``,`Trong đó`,`trong_do`)}
            ${m(`-`,`Nộp ngân sách nhà nước`,`nop_nsnn`)}
            ${m(`-`,`Lương, phụ cấp và các khoản đóng góp theo lương`,`luong_pc`,!1,d)}
            ${m(`-`,`Hợp đồng theo NĐ111`,`hd_111`)}
            ${m(`-`,`Hợp đồng chuyên môn theo NĐ111`,`hd_cm_111`)}
            ${m(`-`,`Chi phí trực tiếp (chi tiết theo nội dung)`,`chi_truc_tiep`)}
            ${m(`+`,`Phụ cấp trực`,`pc_truc`)}
            ${m(`+`,`TT tiền thủ thuật - phẫu thuật`,`tt_pttt`)}
            ${m(`+`,`Tiền ăn`,`tien_an`)}
            ${m(`+`,`Thanh toán tiền điện`,`tien_dien`)}
            ${m(`+`,`Thanh toán tiền nước`,`tien_nuoc`)}
            ${m(`+`,`Thanh toán tiền nhiên liệu`,`tien_nhien_lieu`)}
            ${m(`+`,`Văn phòng phẩm`,`vpp`)}
            ${m(`+`,`Công cụ, dụng cụ VP`,`cc_dc_vp`)}
            ${m(`+`,`Vật tư VPP khác`,`vpp_khac`)}
            ${m(`+`,`Chi thuê mướng khác (Vệ sinh công nghiệp)`,`thue_muong`)}
            ${m(`+`,`Sửa chữa ô tô`,`sc_oto`)}
            ${m(`+`,`Sửa chữa trang TBKT chuyên dụng`,`sc_tbkt`)}
            
            ${m(`II`,`Chi ngân sách Nhà nước`,`chi_nsnn`,!0)}
            ${m(`A`,`Chỉ tiêu`,`chi_tieu`,!0)}
            ${m(`1`,`Tổng biên chế / Hợp đồng (người)`,`tong_bc`,!1,c)}
            ${m(`2`,`Hệ số bình quân`,`hs_bq`,!1,c?((t+r+a+o+s)/c).toFixed(2).replace(`.`,`,`):0)}
            
            ${m(`B`,`Kinh phí`,`kinh_phi`,!0)}
            ${m(`1`,`Kinh phí nhiệm vụ thường xuyên`,`kp_tx`)}
            ${m(`-`,`Tiền lương (Biên chế + HĐ) x 12 tháng`,`tien_luong_tx`,!1,d)}
            ${m(`-`,`KP chi thưởng NĐ73 (10%)`,`tien_thuong_tx`,!1,f)}
            ${m(`-`,`KP chi hoạt động thường xuyên`,`kp_hd_tx`)}
            
            ${m(`2`,`Các nhiệm vụ chi ngoài định mức`,`kp_ngoai_dm`)}
            ${m(`-`,`Thuê phần mềm (EHIS, Bệnh án ĐT)`,`thue_pm`)}
            ${m(`-`,`Bảo hiểm cháy nổ / PCCC`,`bh_pccc`)}
            ${m(`-`,`Thuê vệ sinh công nghiệp / Xử lý rác`,`ve_sinh`)}
            ${m(`-`,`Sửa chữa / Mua sắm máy móc thiết bị`,`mua_sam`)}
          </tbody>
        </table>
      </div>
    </div>
  `},Y=[{name:`Y sỹ hạng IV`,code:`V.08.03.07`},{name:`Điều dưỡng hạng IV`,code:`V.08.05.13`},{name:`Dược sỹ hạng IV`,code:`V.08.08.23`},{name:`Bác sỹ hạng III`,code:`V.08.01.03`},{name:`Bác sỹ Y học dự phòng hạng III`,code:`V.08.02.05`},{name:`Bác sỹ Y học dự phòng hạng II`,code:`V.08.02.04`},{name:`Hộ sinh hạng IV`,code:`V.08.06.16`},{name:`Kỹ thuật Y hạng III`,code:`V.08.07.18`},{name:`Kỹ thuật y hạng IV`,code:`V.08.07.19`},{name:`Điều dưỡng hạng III`,code:`V.08.05.12`},{name:`Dược sĩ hạng III`,code:`V.08.08.22`},{name:`Y tế công cộng hạng III`,code:`V.08.04.10`},{name:`Dân số viên hạng IV`,code:`V.08.10.29`},{name:`Kế toán viên`,code:`V.06.031`},{name:`Nhân viên kỹ thuật`,code:`01.007`},{name:`Tuyên truyền viên chính`,code:`17.177`},{name:`Hộ lý`,code:`16.130`},{name:`Nhân viên phục vụ`,code:`1.009`}],X=[`Nâng lương thường xuyên`,`Nâng lương trước thời hạn`,`Bổ nhiệm chức danh nghề nghiệp`,`Chuyển chức danh nghề nghiệp`,`Thâm niên vượt khung`],Z=()=>{let e=(i[_||n]||[]).filter(w);b[g]||(b[g]={});let t=b[g],r=(e,n,r=``,i=`text`)=>{let a=t[e]?.[n]||``;return n===`job_title`?`<select class="select-input" style="width:100%; min-width:180px; font-size:0.8rem; border:none; background:transparent;" onchange="window.updateBudgetPromotion('${e}', 'job_title', this.value)">
        <option value="">-- Chọn --</option>
        ${Y.map(e=>`<option value="${e.name}" ${a===e.name?`selected`:``}>${e.name}</option>`).join(``)}
      </select>`:n===`promotion_type`?`<select class="select-input" style="width:100%; min-width:120px; font-size:0.8rem; border:none; background:transparent;" onchange="window.updateBudgetPromotion('${e}', 'promotion_type', this.value)">
        <option value="">-- Chọn --</option>
        ${X.map(e=>`<option value="${e}" ${a===e?`selected`:``}>${e}</option>`).join(``)}
      </select>`:`<input type="${i}" class="select-input" style="width:100%; font-size:0.8rem; border:none; background:transparent; text-align:${i===`number`?`center`:`left`};" placeholder="${r}" value="${a}" onchange="window.updateBudgetPromotion('${e}', '${n}', this.value)">`},a=e=>e?e.toFixed(3).replace(`.`,`,`):``,o={lc_tt:0,vk_tt:0,ud56_tt:0,tong_cong:0,khau_tru:0,thuc_linh:0},s=e.map((e,n)=>{let i=t[e.name]||{},s=i.hh_he_so===void 0?e.coefficients?.base||0:i.hh_he_so,c=i.hh_vk===void 0?0:i.hh_vk;i.hh_vk===void 0&&e.coefficients?.vkhung&&(c=e.coefficients.vkhung/(e.coefficients.base||1)*100);let l=i.nb_he_so||0,u=i.nb_vk||0,d=i.so_thang||0,f=i.ud56_pct===void 0?e.coefficients?.incentive?e.coefficients.incentive*100:0:i.ud56_pct;i.ud76_pct,i.th70_pct;let p=Math.max(0,l-s),m=Math.max(0,l*u/100-s*c/100),g=p*d,_=Math.round(g*h),v=m*d,y=Math.round(v*h),b=(g+v)*f/100,x=Math.round(b*h),S=_+y+x,C=Math.round((_+y)*.105),w=S-C;return o.lc_tt+=_,o.vk_tt+=y,o.ud56_tt+=x,o.tong_cong+=S,o.khau_tru+=C,o.thuc_linh+=w,`<tr>
      <td class="sticky-col" style="text-align:center; left:0; width:40px; background:var(--card-bg); z-index:20;">${n+1}</td>
      <td class="sticky-col" style="padding:0; left:40px; width:150px; background:var(--card-bg); z-index:20; border-right:1px solid var(--border-color);">${r(e.name,`promotion_type`)}</td>
      <td class="sticky-col" style="font-weight:600; left:190px; width:160px; background:var(--card-bg); z-index:20;">${e.name}</td>
      <td class="sticky-col" style="padding:0; left:350px; width:180px; background:var(--card-bg); z-index:20; border-right:2px solid var(--border-color);">${r(e.name,`job_title`)}</td>
      
      <td style="text-align:center; font-weight:bold; color:var(--primary);">${i.job_code||``}</td>
      <td style="padding:0;">${r(e.name,`hh_bac`)}</td>
      <td style="padding:0;"><input type="number" class="select-input" style="width:100%; border:none; background:transparent; text-align:center;" value="${s}" onchange="window.updateBudgetPromotion('${e.name}', 'hh_he_so', parseFloat(this.value)||0)"></td>
      <td style="padding:0;"><input type="number" class="select-input" style="width:100%; border:none; background:transparent; text-align:center;" value="${c}" onchange="window.updateBudgetPromotion('${e.name}', 'hh_vk', parseFloat(this.value)||0)"></td>
      
      <td style="padding:0;">${r(e.name,`nb_bac`)}</td>
      <td style="padding:0;">${r(e.name,`nb_date`)}</td>
      <td style="padding:0;"><input type="number" class="select-input" style="width:100%; border:none; background:transparent; text-align:center; color:var(--primary); font-weight:bold;" value="${l}" onchange="window.updateBudgetPromotion('${e.name}', 'nb_he_so', parseFloat(this.value)||0)"></td>
      <td style="padding:0;"><input type="number" class="select-input" style="width:100%; border:none; background:transparent; text-align:center;" value="${u}" onchange="window.updateBudgetPromotion('${e.name}', 'nb_vk', parseFloat(this.value)||0)"></td>
      
      <td style="text-align:center; font-weight:600; background:#f8fafc;">${a(p)}</td>
      <td style="text-align:center; font-weight:600; background:#f8fafc;">${a(m)}</td>
      
      <td style="padding:0;"><input type="number" class="select-input" style="width:100%; border:none; background:#eff6ff; text-align:center; font-weight:bold; color:var(--primary);" value="${d}" onchange="window.updateBudgetPromotion('${e.name}', 'so_thang', parseFloat(this.value)||0)"></td>
      
      <td style="text-align:center;">${a(g)}</td>
      <td style="text-align:right;">${k(_)}</td>
      
      <td style="text-align:center;">${a(v)}</td>
      <td style="text-align:right;">${k(y)}</td>
      
      <td style="padding:0; text-align:center;">
        <input type="number" class="select-input" style="width:40px; border:none; background:transparent; text-align:center; padding:0;" value="${f}" onchange="window.updateBudgetPromotion('${e.name}', 'ud56_pct', parseFloat(this.value)||0)">%<br>
        <span style="font-size:0.75rem; color:var(--text-muted);">${a(b)}</span>
      </td>
      <td style="text-align:right;">${k(x)}</td>
      
      <td class="highlight-total" style="text-align:right;">${k(S)}</td>
      <td style="text-align:right; color:var(--danger); font-weight:600;">${k(C)}</td>
      <td class="highlight-total" style="text-align:right; color:var(--primary);">${k(w)}</td>
      <td style="padding:0;">${r(e.name,`note`)}</td>
    </tr>`}).join(``);return`
    <div style="padding: 1rem 0;">
      <h3 style="text-align:center; font-weight:700;">BẢNG THANH TOÁN TRUY LĨNH NÂNG LƯƠNG NĂM ${g}</h3>
      <div style="text-align:right; margin-bottom: 0.5rem;"><button class="btn btn-secondary" onclick="window.exportPromotionToExcel()"><i data-lucide="download" size="16"></i> Xuất Excel</button></div>
      <div class="table-container" style="overflow-x:auto; max-height:650px;">
        <table class="salary-detail-table" style="min-width: 2500px; font-size: 0.8rem; border-collapse: separate; border-spacing: 0;">
          <thead style="position: sticky; top: 0; z-index: 30;">
            <tr>
              <th rowspan="2" class="sticky-col" style="width:40px; text-align:center; left:0; z-index:40;">TT</th>
              <th rowspan="2" class="sticky-col" style="width:150px; text-align:center; left:40px; z-index:40; border-right:1px solid #cbd5e1;">Nâng lương</th>
              <th rowspan="2" class="sticky-col" style="width:160px; left:190px; z-index:40;">Họ và tên</th>
              <th rowspan="2" class="sticky-col" style="width:180px; text-align:center; left:350px; z-index:40; border-right:2px solid #cbd5e1;">Chức danh nghề nghiệp</th>
              <th rowspan="2" style="width:100px; text-align:center;">Mã ngạch</th>
              <th colspan="3" style="text-align:center;">Hệ số mức lương hiện hưởng</th>
              <th colspan="4" style="text-align:center;">Kết quả nâng bậc</th>
              <th colspan="2" style="text-align:center; background:#f8fafc;">Chênh lệch</th>
              <th rowspan="2" style="width:70px; text-align:center; background:#eff6ff;">Số tháng</th>
              <th colspan="2" style="text-align:center;">Lương chính</th>
              <th colspan="2" style="text-align:center;">PC vượt khung</th>
              <th colspan="2" style="text-align:center;">PC ưu đãi (NĐ56)</th>
              <th rowspan="2" style="width:100px; text-align:center;">Tổng cộng</th>
              <th rowspan="2" style="width:100px; text-align:center;">10,5% phải nộp</th>
              <th rowspan="2" style="width:100px; text-align:center;">Thực lĩnh</th>
              <th rowspan="2" style="width:150px; text-align:center;">Ghi chú</th>
            </tr>
            <tr>
              <th style="width:50px; text-align:center;">Bậc</th>
              <th style="width:60px; text-align:center;">Hệ số</th>
              <th style="width:60px; text-align:center;">VK (%)</th>
              <th style="width:50px; text-align:center;">Bậc</th>
              <th style="width:90px; text-align:center;">N.T.N.Đ.H</th>
              <th style="width:60px; text-align:center;">Hệ số</th>
              <th style="width:60px; text-align:center;">TNVK (%)</th>
              <th style="width:60px; text-align:center; background:#f8fafc;">Hệ số</th>
              <th style="width:60px; text-align:center; background:#f8fafc;">TNVK</th>
              <th style="width:60px; text-align:center;">Hệ số</th>
              <th style="width:90px; text-align:center;">Thành tiền</th>
              <th style="width:60px; text-align:center;">Hệ số</th>
              <th style="width:90px; text-align:center;">Thành tiền</th>
              <th style="width:60px; text-align:center;">Hệ số</th>
              <th style="width:90px; text-align:center;">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            ${e.length?s:`<tr><td colspan="24" style="text-align:center; padding: 2rem;">Chưa có dữ liệu. Hãy import Bảng lương chính trước.</td></tr>`}
          </tbody>
          ${e.length?`
          <tfoot>
            <tr style="font-weight:700; background:var(--card-bg); border-top:2px solid var(--accent);">
              <td colspan="16" class="sticky-col" style="text-align:right; padding-right:10px; left:0; z-index:20; background:var(--card-bg);">TỔNG CỘNG TRUY LĨNH:</td>
              <td style="text-align:right; color:var(--primary);">${k(o.lc_tt)}</td>
              <td></td>
              <td style="text-align:right; color:var(--primary);">${k(o.vk_tt)}</td>
              <td></td>
              <td style="text-align:right; color:var(--primary);">${k(o.ud56_tt)}</td>
              <td style="text-align:right; color:var(--primary);">${k(o.tong_cong)}</td>
              <td style="text-align:right; color:var(--danger);">${k(o.khau_tru)}</td>
              <td style="text-align:right; color:var(--primary);">${k(o.thuc_linh)}</td>
              <td></td>
            </tr>
          </tfoot>
          `:``}
        </table>
      </div>
    </div>
  `},Q=()=>{let e=`
    <div class="segmented-control" style="margin-bottom: 0;">
      <button class="control-btn ${m===`salary`?`active`:``}" onclick="window.setBudgetTab('salary')">Bảng lương dự toán</button>
      <button class="control-btn ${m===`coefficients`?`active`:``}" onclick="window.setBudgetTab('coefficients')">Tổng hợp hệ số</button>
      <button class="control-btn ${m===`promotion`?`active`:``}" onclick="window.setBudgetTab('promotion')">Nâng lương</button>
      <button class="control-btn ${m===`template`?`active`:``}" onclick="window.setBudgetTab('template')">Biểu thuyết minh</button>
    </div>
  `,t=``;return m===`salary`?t=K():m===`coefficients`?t=q():m===`promotion`?t=Z():m===`template`&&(t=J()),`
  <div class="fade-in">
    ${I(`Dự toán năm `+g)}
    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
        ${e}
        <div style="display:flex; gap:1rem; align-items:center;">
          <label style="font-size:0.85rem;font-weight:600;">Lương cơ sở:</label>
          <input type="number" id="budget-base-salary" value="${h}" class="select-input" style="width:120px;" onchange="window.updateBudgetBaseSalary(event)">
        </div>
      </div>
      ${t}
    </div>
  </div>`};function ee(){let e=!1;Object.keys(i).forEach(t=>{if(!s[t]&&i[t]&&i[t].length>0){let n=i[t].filter(w).filter(e=>{let t=(e.position||``).toLowerCase(),n=(e.department||e.dept||``).toLowerCase();return t.includes(`bác sĩ`)||t.includes(`bác sỹ`)||t.includes(`bs`)||n.includes(`khám bệnh`)||n.includes(`lâm sàng`)||t.includes(`đông y`)||t.includes(`chuyên khoa`)}),r=[];n.forEach(e=>{let t=`CUSTOM`,n=0,i=(e.position||``).toLowerCase();i.includes(`ckii`)||i.includes(`ck ii`)||i.includes(`tiến sĩ`)||i.includes(`ts`)?(t=`TS_CKII`,n=2e6):i.includes(`cki`)||i.includes(`ck i`)||i.includes(`thạc sĩ`)||i.includes(`ths`)||i.includes(`nội trú`)||i.includes(`bsnt`)?(t=`THS_CKI_BSNT`,n=15e5):(e.department||e.dept||``).toLowerCase().includes(`trạm y tế`)||(e.department||e.dept||``).toLowerCase().includes(`tyt`)?(t=`BS_TYT`,n=1e6):(t=`THS_CKI_BSNT`,n=15e5),r.push({name:e.name,dept:e.department||e.dept||``,categoryKey:t,category:t===`TS_CKII`?`Tiến sĩ / Bác sĩ CKII`:t===`THS_CKI_BSNT`?`Thạc sĩ / BSCKI / BS Nội trú`:t===`BS_TYT_DBKK`?`Bác sĩ TYT xã ĐBKK`:`Bác sĩ TYT`,limit:n,months:1,amount:n,content:``,notes:``})}),s[t]=r,e=!0}}),e&&C()}var $=()=>{let c=document.getElementById(`app`);if(c)try{ee();let d=``;switch(t){case`salary`:d=L();break;case`pit`:d=z();break;case`overtime`:d=V();break;case`bonus`:d=B();break;case`nq20`:d=H();break;case`budget`:d=Q();break;default:d=G()}c.innerHTML=`${N()}<main class="main-content">${d}</main>
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
      </div>`,lucide.createIcons(),document.querySelectorAll(`.nav-item[data-tab]`).forEach(e=>e.onclick=()=>{t=e.dataset.tab,$()});let p=document.getElementById(`search-input`);p&&(p.value=u,p.oninput=e=>{u=e.target.value,$()});let m=document.getElementById(`month-selector`)||document.getElementById(`ot-month-selector`)||document.getElementById(`bn-month-selector`)||document.getElementById(`nq20-month-selector`);m&&(m.onchange=e=>{n=e.target.value,$()});let h=document.getElementById(`pit-quarter-selector`);h&&(h.onchange=e=>{r=e.target.value,$()}),document.querySelectorAll(`.npt-input`).forEach(e=>{e.onchange=e=>{let t=e.target.dataset.name,n=parseInt(e.target.value)||0;l[t]=n,C(),$()}});let g=document.getElementById(`import-btn`),_=document.getElementById(`import-modal`),v=document.getElementById(`close-modal`),y=document.getElementById(`confirm-import`);v&&(v.onclick=()=>_.style.display=`none`),y&&(y.onclick=async()=>{let e=document.getElementById(`import-month-name`).value.trim(),t=document.getElementById(`import-url`).value.trim(),r=document.getElementById(`import-gid`).value.trim(),c=y.getAttribute(`data-type`)||`salary`;if(!e||!t)return alert(`Thiếu thông tin`);y.textContent=`Đang xử lý...`,y.disabled=!0;try{let l=O(t,r),u=await(await fetch(`https://corsproxy.io/?${encodeURIComponent(l)}`)).text();if(c===`salary`){let t=A(u);if(!t.length)throw Error(`Dữ liệu không hợp lệ`);i[e]=t}else if(c===`bonus`){let t=j(u);if(!t.length)throw Error(`Dữ liệu không hợp lệ`);o[e]=t}else if(c===`nq20`){let n=W(u);if(!n.length)throw Error(`Dữ liệu không hợp lệ`);s[e]=n,localStorage.setItem(`last_nq20_url`,t),localStorage.setItem(`last_nq20_gid`,r)}else{let t=U(u);if(!t.length)throw Error(`Dữ liệu không hợp lệ`);a[e]=t}n=e,C(),_.style.display=`none`,$()}catch(e){alert(`Lỗi: `+e.message)}finally{y.textContent=`Bắt đầu Import`,y.disabled=!1}});let b=document.getElementById(`import-ot-btn`),x=document.getElementById(`import-bonus-btn`),S=document.getElementById(`import-nq20-btn`);b&&(b.onclick=()=>{document.getElementById(`import-title`).textContent=`Import Ngoài giờ`,document.getElementById(`import-url`).value=`https://docs.google.com/spreadsheets/d/1d4VhrIM_lk8BeODjG2_PCAK85NXOVI6aLQO1XlUjyiU/edit`,document.getElementById(`import-gid`).value=`2041249704`,y.setAttribute(`data-type`,`overtime`),_.style.display=`flex`}),g&&(g.onclick=()=>{document.getElementById(`import-title`).textContent=`Import Lương`,document.getElementById(`import-url`).value=localStorage.getItem(`last_salary_url`)||e,document.getElementById(`import-gid`).value=localStorage.getItem(`last_salary_gid`)||``,y.setAttribute(`data-type`,`salary`),_.style.display=`flex`}),x&&(x.onclick=()=>{document.getElementById(`import-title`).textContent=`Import Khen thưởng`,document.getElementById(`import-url`).value=localStorage.getItem(`last_bonus_url`)||`https://docs.google.com/spreadsheets/d/1Imhhn8uEhS2_Wn_3TbQlohsrEUUai_EK6JVJfNUDboQ/edit`,document.getElementById(`import-gid`).value=localStorage.getItem(`last_bonus_gid`)||`1464193880`,y.setAttribute(`data-type`,`bonus`),_.style.display=`flex`}),S&&(S.onclick=()=>{document.getElementById(`import-title`).textContent=`Import NQ20`,document.getElementById(`import-url`).value=localStorage.getItem(`last_nq20_url`)||`https://docs.google.com/spreadsheets/d/1Imhhn8uEhS2_Wn_3TbQlohsrEUUai_EK6JVJfNUDboQ/edit`,document.getElementById(`import-gid`).value=localStorage.getItem(`last_nq20_gid`)||``,y.setAttribute(`data-type`,`nq20`),_.style.display=`flex`});let w=document.getElementById(`summary-period-selector`),T=document.getElementById(`ot-period-selector`),E=document.getElementById(`bn-period-selector`),D=document.getElementById(`nq20-period-selector`);w&&(w.onchange=e=>{f=e.target.value,r=e.target.value.replace(`q`,``),$()}),T&&(T.onchange=e=>{f=e.target.value,r=e.target.value.replace(`q`,``),$()}),E&&(E.onchange=e=>{f=e.target.value,r=e.target.value.replace(`q`,``),$()}),D&&(D.onchange=e=>{f=e.target.value,r=e.target.value.replace(`q`,``),$()});let k=document.getElementById(`close-preview`);k&&(k.onclick=()=>document.getElementById(`preview-modal`).style.display=`none`);let M=document.getElementById(`theme-toggle`);M&&(M.onclick=()=>{document.body.setAttribute(`data-theme`,document.body.getAttribute(`data-theme`)===`dark`?`light`:`dark`)}),c.onclick=e=>{let t=e.target.closest(`button`);!t||!t.id||(t.id===`delete-bonus-btn`?(e.preventDefault(),window.deleteBonusMonth()):t.id===`delete-ot-btn`?(e.preventDefault(),window.deleteOTMonth()):t.id===`delete-salary-btn`?(e.preventDefault(),window.deleteMonth()):t.id===`delete-nq20-btn`&&(e.preventDefault(),window.deleteNQ20Month()))}}catch(e){c.innerHTML=`<div style="padding:3rem;text-align:center;"><h2>Sự cố hiển thị</h2><button class="btn btn-primary" onclick="window.emergencyReset()">Khôi phục hệ thống</button><pre style="text-align:left;margin-top:2rem;">${e.stack}</pre></div>`}};window.setViewMode=e=>{d=e,$()},window.initializeNQ20FromSalary=function(){let e=(i[n]||[]).filter(w);if(!e.length)return alert(`Không tìm thấy dữ liệu bảng lương tháng `+n+` để khởi tạo!`);if(confirm(`Khởi tạo danh sách NQ20 bằng cách lọc các Bác sĩ từ bảng lương tháng `+n+`?`)){let t=e.filter(e=>{let t=(e.position||``).toLowerCase(),n=(e.department||e.dept||``).toLowerCase();return t.includes(`bác sĩ`)||t.includes(`bác sỹ`)||t.includes(`bs`)||n.includes(`khám bệnh`)||n.includes(`lâm sàng`)||t.includes(`đông y`)||t.includes(`chuyên khoa`)}),r=[...s[n]||[]];t.forEach(e=>{if(!r.some(t=>t.name===e.name)){let t=`CUSTOM`,n=0,i=e.position.toLowerCase();i.includes(`ckii`)||i.includes(`ck ii`)||i.includes(`tiến sĩ`)||i.includes(`ts`)?(t=`TS_CKII`,n=2e6):i.includes(`cki`)||i.includes(`ck i`)||i.includes(`thạc sĩ`)||i.includes(`ths`)||i.includes(`nội trú`)||i.includes(`bsnt`)?(t=`THS_CKI_BSNT`,n=15e5):e.department.toLowerCase().includes(`trạm y tế`)||e.department.toLowerCase().includes(`tyt`)?(t=`BS_TYT`,n=1e6):(t=`THS_CKI_BSNT`,n=15e5),r.push({name:e.name,dept:e.department||``,categoryKey:t,category:t===`TS_CKII`?`Tiến sĩ / Bác sĩ CKII`:t===`THS_CKI_BSNT`?`Thạc sĩ / BSCKI / BS Nội trú`:t===`BS_TYT_DBKK`?`Bác sĩ TYT xã ĐBKK`:`Bác sĩ TYT`,limit:n,months:1,amount:n,content:``,notes:``})}}),r.length===0&&confirm(`Không tự động nhận diện được bác sĩ nào qua chức vụ. Thêm tất cả nhân viên để tự phân loại?`)&&e.forEach(e=>{r.push({name:e.name,dept:e.department||``,categoryKey:`CUSTOM`,category:`Tùy chỉnh`,limit:0,months:1,amount:0,content:``,notes:``})}),s[n]=r,C(),$()}},window.copyNQ20FromPrevious=function(){let e=D(Object.keys(s)).find(e=>e!==n);if(!e)return alert(`Không tìm thấy dữ liệu NQ20 tháng trước!`);confirm(`Sao chép danh sách đãi ngộ NQ20 từ tháng ${e} sang tháng ${n}?`)&&(s[n]=JSON.parse(JSON.stringify(s[e])),C(),$(),alert(`Sao chép thành công!`))},window.addNewNQ20Doctor=function(){let e=prompt(`Nhập họ và tên bác sĩ:`);if(!e||e.trim()===``)return;let t=prompt(`Nhập khoa/phòng/bộ phận:`),r=s[n]||[];if(r.some(t=>t.name.toLowerCase()===e.trim().toLowerCase()))return alert(`Bác sĩ này đã có trong danh sách!`);r.push({name:e.trim(),dept:(t||``).trim(),categoryKey:`THS_CKI_BSNT`,category:`Thạc sĩ / BSCKI / BS Nội trú`,limit:15e5,months:1,amount:15e5,content:``,notes:``}),s[n]=r,C(),$()},window.removeNQ20Employee=function(e){if(confirm(`Xóa bác sĩ ${e} khỏi danh sách NQ20 tháng ${n}?`)){let t=s[n]||[];s[n]=t.filter(t=>t.name!==e),C(),$()}},window.updateNQ20Dept=function(e,t){let r=(s[n]||[]).find(t=>t.name===e);r&&(r.dept=t,C())},window.updateNQ20Category=function(e,t){let r=(s[n]||[]).find(t=>t.name===e);r&&(r.categoryKey=t,t===`TS_CKII`?r.limit=2e6:t===`THS_CKI_BSNT`?r.limit=15e5:t===`BS_TYT_DBKK`?r.limit=12e5:t===`BS_TYT`&&(r.limit=1e6),r.amount=Math.round((r.limit||0)*(r.months||1)),C(),$())},window.updateNQ20Limit=function(e,t){let r=(s[n]||[]).find(t=>t.name===e);r&&(r.limit=T(t),r.amount=Math.round((r.limit||0)*(r.months||1)),C(),$())},window.updateNQ20Months=function(e,t){let r=(s[n]||[]).find(t=>t.name===e);if(r){let e=String(t).replace(`,`,`.`);r.months=parseFloat(e)||0,r.amount=Math.round((r.limit||0)*r.months),C(),$()}},window.updateNQ20Notes=function(e,t){let r=(s[n]||[]).find(t=>t.name===e);r&&(r.content=t,r.notes=t,C())},window.updateNQ20Amount=function(e,t){let r=(s[n]||[]).find(t=>t.name===e);r&&(r.amount=T(t),C(),$())},window.setBudgetTab=e=>{m=e,$()},window.updateBudgetBaseSalary=e=>{h=parseInt(e.target.value)||234e4,$()},window.setBudgetBaseMonth=e=>{_=e,$()},window.toggleBudgetContract=e=>{v.has(e)?v.delete(e):v.add(e),$()},window.updateBudgetInput=(e,t)=>{e.includes(`ghi_chu`)||e.includes(`text`)?y[e]=t:y[e]=parseFloat(t)||0},window.updateBudgetPromotion=(e,t,n)=>{if(b[g]||(b[g]={}),b[g][e]||(b[g][e]={}),b[g][e][t]=n,t===`job_title`){let t=Y.find(e=>e.name===n);b[g][e].job_code=t?t.code:``}C(),$()},window.exportPromotionToExcel=function(){alert(`Tính năng xuất Excel cho bảng Nâng lương đang được phát triển.`)},window.exportBudgetToExcel=function(e){if(e===`salary`){let e=document.querySelector(`.salary-detail-table`);if(!e)return alert(`Không tìm thấy bảng!`);let t=XLSX.utils.book_new(),n=XLSX.utils.table_to_sheet(e,{raw:!0}),r=XLSX.utils.decode_range(n[`!ref`]);for(let e=r.s.r;e<=r.e.r;++e)for(let t=r.s.c;t<=r.e.c;++t){let r={c:t,r:e},i=n[XLSX.utils.encode_cell(r)];i&&t===3&&e>1&&(i.v=v.has(n[XLSX.utils.encode_cell({c:1,r:e})]?.v)?`x`:``)}XLSX.utils.book_append_sheet(t,n,`DuToan_BangLuong`),XLSX.writeFile(t,`Bang_Luong_Du_Toan_${g}.xlsx`)}},window.exportSalaryToExcel=function(){try{let e=(i[n]||[]).filter(w);if(!e.length)return alert(`Không có dữ liệu để xuất!`);let t=[`Lương chính`,`PC vượt khung`,`PC Khu vực`,`PC Chức vụ`,`PC Trách nhiệm`,`PC ưu đãi ngành`,`PC Độc hại`,`PC cấp ủy`,`Tổng cộng lương`,`Khấu trừ 10,5% BH`,`KT 10,5% BH CV`,`KT 10,5% BH VK`,`Trừ ốm LC`,`Trừ ốm VK`,`Trừ ốm CV`,`Trừ ốm TN`,`Trừ ốm ƯĐ`,`Trừ ốm ĐH`,`Tổng lĩnh`],r=e.map(e=>{let n={TT:e.id,"Họ tên":e.name,"Khoa/Phòng":e.department,"Chức vụ":e.position,HSL:e.coefficients?.base,KV:e.coefficients?.area,VK:e.coefficients?.vkhung,CV:e.coefficients?.position,TN:e.coefficients?.responsibility,ƯĐ:e.coefficients?.incentive,ĐH:e.coefficients?.toxic,CU:e.coefficients?.party};return t.forEach((t,r)=>{n[t]=(e.rawAmounts||[])[r]||0}),n}),a=XLSX.utils.json_to_sheet(r),o=XLSX.utils.book_new();XLSX.utils.book_append_sheet(o,a,`Bang Luong`),XLSX.writeFile(o,`Bang_Luong_${n.replace(`/`,`-`)}.xlsx`)}catch(e){console.error(`Excel Export Error:`,e),alert(`Lỗi khi xuất Excel: `+e.message)}},window.exportSalaryToPDF=function(){try{let e=document.querySelector(`.salary-detail-table`);if(!e)return alert(`Không tìm thấy bảng dữ liệu!`);let t=document.createElement(`div`);t.style.padding=`20px`,t.style.background=`#fff`,t.innerHTML=`
      <div style="text-align:center;margin-bottom:20px;font-family:Arial,sans-serif;">
        <h2 style="margin:0;color:#1e40af;text-transform:uppercase;font-size:18px;">BỆNH VIỆN ĐA KHOA HUYỆN THAN UYÊN</h2>
        <h3 style="margin:5px 0;font-size:16px;">BẢNG LƯƠNG CHI TIẾT THÁNG ${n}</h3>
        <hr style="border:1px solid #eee;margin:15px 0;">
      </div>
    `;let r=e.cloneNode(!0);r.style.width=`100%`,r.style.fontSize=`10px`,t.appendChild(r);let i={margin:[10,5,10,5],filename:`Bang_Luong_${n.replace(`/`,`-`)}.pdf`,image:{type:`jpeg`,quality:.98},html2canvas:{scale:2,useCORS:!0,letterRendering:!0},jsPDF:{unit:`mm`,format:`a4`,orientation:`landscape`}};html2pdf().set(i).from(t).save()}catch(e){alert(`Lỗi khi xuất PDF: `+e.message)}},window.exportBonusToExcel=function(){try{let e=d===`summary`,t=e?F(f):[n],r={};t.forEach(e=>{(o[e]||[]).forEach(e=>{r[e.name]||(r[e.name]={...e,amount:0,count:0}),r[e.name].amount+=e.amount||0,r[e.name].count++})});let i=Object.values(r).map((e,t)=>({STT:t+1,"Họ tên":e.name,"Khoa/Phòng":e.dept,"Nội dung":e.content||`Thưởng NĐ73`,"Số tiền":e.amount}));if(!i.length)return alert(`Không có dữ liệu!`);let a=XLSX.utils.json_to_sheet(i),s=XLSX.utils.book_new();XLSX.utils.book_append_sheet(s,a,`Khen Thuong`),XLSX.writeFile(s,`Khen_Thuong_${e?f:n.replace(`/`,`-`)}.xlsx`)}catch(e){alert(`Lỗi: `+e.message)}},window.exportNQ20ToExcel=function(){try{if(d!==`summary`){let e=(s[n]||[]).map((e,t)=>{let n=e.limit||e.amount,r=e.limit===void 0?n:e.limit,i=e.months===void 0?1:e.months;return{TT:t+1,"Họ và tên":e.name,"Đối tượng":e.category||e.categoryKey||`Đãi ngộ NQ20`,"Đơn vị công tác":e.dept||``,"Định mức":r,"Số tháng hưởng":i,"Thành tiền":e.amount,"Ghi chú":e.notes||e.content||``}});if(!e.length)return alert(`Không có dữ liệu!`);let t=XLSX.utils.json_to_sheet(e),r=XLSX.utils.book_new();XLSX.utils.book_append_sheet(r,t,`NQ20_Thang`),XLSX.writeFile(r,`Dai_Ngo_NQ20_${n.replace(`/`,`-`)}.xlsx`)}else{let e=F(f),t={};e.forEach(e=>{(s[e]||[]).forEach(e=>{t[e.name]||(t[e.name]={...e,amount:0,months_count:0}),t[e.name].amount+=e.amount||0,t[e.name].months_count+=e.months===void 0?1:e.months})});let n=Object.values(t).map((e,t)=>({TT:t+1,"Họ và tên":e.name,"Đối tượng":e.category||e.categoryKey||`Đãi ngộ NQ20`,"Đơn vị công tác":e.dept||``,"Số tháng hưởng":e.months_count,"Tổng cộng":e.amount,"Ghi chú":e.notes||e.content||``}));if(!n.length)return alert(`Không có dữ liệu!`);let r=XLSX.utils.json_to_sheet(n),i=XLSX.utils.book_new();XLSX.utils.book_append_sheet(i,r,`NQ20_TongHop`),XLSX.writeFile(i,`Dai_Ngo_NQ20_TongHop_${f}.xlsx`)}}catch(e){alert(`Lỗi: `+e.message)}},window.exportPITToExcel=function(){try{let e=r===`all`?`Cả năm`:`Quý ${r}`,t=[`Lương chính`,`PC vượt khung`,`PC Khu vực`,`PC Chức vụ`,`PC Trách nhiệm`,`PC ưu đãi ngành`,`PC Độc hại`,`PC cấp ủy`,`Tổng cộng lương`,`Khấu trừ 10,5% BH`,`KT 10,5% BH CV`,`KT 10,5% BH VK`,`Trừ ốm LC`,`Trừ ốm VK`,`Trừ ốm CV`,`Trừ ốm TN`,`Trừ ốm ƯĐ`,`Trừ ốm ĐH`,`Tổng lĩnh`],n=R(r).map(e=>{let n={"Họ và tên":e.name,"Khoa/Phòng":e.dept,"Số tháng":e.months};return t.forEach((t,r)=>n[t]=e.rawAmounts[r]),n[`Ngoài giờ`]=e.otAmount,n[`Khen thưởng`]=e.bonusAmount,n[`THU NHẬP TÍNH THUẾ`]=e.taxable>0?e.taxable:0,n});if(!n.length)return alert(`Không có dữ liệu!`);let i=XLSX.utils.json_to_sheet(n),a=XLSX.utils.book_new();XLSX.utils.book_append_sheet(a,i,`Thue TNCN`),XLSX.writeFile(a,`Thue_TNCN_${e.replace(` `,`_`)}.xlsx`)}catch(e){alert(`Lỗi: `+e.message)}},window.exportPITToPDF=function(){let e=document.querySelector(`.salary-detail-table`);if(!e)return;let t=r===`all`?`CẢ NĂM`:`QUÝ ${r}`,n=document.createElement(`div`);n.style.padding=`20px`,n.style.background=`#fff`,n.innerHTML=`
    <div style="text-align:center;margin-bottom:20px;font-family:Arial,sans-serif;">
      <h2 style="margin:0;color:#1e40af;text-transform:uppercase;font-size:18px;">BỆNH VIỆN ĐA KHOA HUYỆN THAN UYÊN</h2>
      <h3 style="margin:5px 0;font-size:16px;">BẢNG KÊ THU NHẬP TÍNH THUẾ TNCN - ${t}</h3>
      <hr style="border:1px solid #eee;margin:15px 0;">
    </div>
  `;let i=e.cloneNode(!0);i.style.width=`100%`,i.style.fontSize=`10px`,n.appendChild(i);let a={margin:[10,5,10,5],filename:`Thue_TNCN_${t.replace(` `,`_`)}.pdf`,image:{type:`jpeg`,quality:.98},html2canvas:{scale:2,useCORS:!0,letterRendering:!0},jsPDF:{unit:`mm`,format:`a4`,orientation:`landscape`}};html2pdf().set(a).from(n).save()},window.showReportPreview=function(e){let t=document.getElementById(`preview-modal`),c=document.getElementById(`preview-container`);if(!t||!c)return;let l=``,u=``,m=``,h=new Date,g=`Than Uyên, ngày ${h.getDate()} tháng ${h.getMonth()+1} năm ${h.getFullYear()}`;if(e===`salary`){let e=d===`summary`,t=e?f===`all`?`CẢ NĂM 2026`:`QUÝ ${f[1]}/2026`:`THÁNG ${n}`;l=`BẢNG ${e?`TỔNG HỢP`:`THANH TOÁN`} LƯƠNG NHÂN VIÊN`,u=t;let r=e?P(i,F(f)):(i[n]||[]).filter(w);m=`
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
            ${(t.rawAmounts||[]).map(e=>`<td>${k(e)}</td>`).join(``)}
          </tr>`).join(``)}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="${e?4:3}">TỔNG CỘNG</td>
            ${Array(19).fill(0).map((e,t)=>`<td>${k(r.reduce((e,n)=>e+(n.rawAmounts?.[t]||0),0))}</td>`).join(``)}
          </tr>
        </tfoot>
      </table>
    `}else if(e===`bonus`){let e=d===`summary`,t=e?f===`all`?`CẢ NĂM 2026`:`QUÝ ${f[1]}/2026`:`THÁNG ${n}`;l=`BẢNG TỔNG HỢP TIỀN KHEN THƯỞNG`,u=t;let r=e?F(f):[n],i={};r.forEach(e=>{(o[e]||[]).forEach(e=>{i[e.name]||(i[e.name]={...e,amount:0,months_count:0}),i[e.name].amount+=e.amount||0,i[e.name].months_count++})});let a=Object.values(i);m=`
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
            <td style="font-weight:700;">${k(t.amount)}</td>
          </tr>`).join(``)}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="${e?5:4}">TỔNG CỘNG</td>
            <td style="font-weight:700;">${k(a.reduce((e,t)=>e+(t.amount||0),0))}</td>
          </tr>
        </tfoot>
      </table>
    `}else if(e===`overtime`){let e=d===`summary`,t=e?f===`all`?`CẢ NĂM 2026`:`QUÝ ${f[1]}/2026`:`THÁNG ${n}`;l=`BẢNG TỔNG HỢP THANH TOÁN TIỀN TRỰC & NGOÀI GIỜ`,u=t;let r=e?F(f):[n],i={};r.forEach(e=>{(a[e]||[]).forEach(e=>{i[e.name]||(i[e.name]={...e,amount:0,m150:0,m200:0,m300:0,months_count:0}),i[e.name].amount+=e.amount||0,i[e.name].m150+=(e.m150d||0)+(e.m150n||0),i[e.name].m200+=(e.m200d||0)+(e.m200n||0),i[e.name].m300+=(e.m300d||0)+(e.m300n||0),i[e.name].months_count++})});let o=Object.values(i);m=`
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
            <td>${k(t.salary)}</td><td>${k(t.hourly)}</td>
            <td>${k(t.m150)}</td><td>${k(t.m200)}</td><td>${k(t.m300)}</td>
            <td style="font-weight:700;">${k(t.amount)}</td>
          </tr>`).join(``)}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="${e?5:4}">TỔNG CỘNG</td>
            <td>${k(o.reduce((e,t)=>e+(t.m150||0),0))}</td>
            <td>${k(o.reduce((e,t)=>e+(t.m200||0),0))}</td>
            <td>${k(o.reduce((e,t)=>e+(t.m300||0),0))}</td>
            <td style="font-weight:700;">${k(o.reduce((e,t)=>e+(t.amount||0),0))}</td>
          </tr>
        </tfoot>
      </table>
    `}else if(e===`nq20`){let e=d===`summary`,t=e?f===`all`?`CẢ NĂM 2026`:`QUÝ ${f[1]}/2026`:`THÁNG ${n}`;l=`BẢNG TỔNG HỢP CHI TRẢ ĐÃI NGỘ NQ20`,u=t;let r=``,i=``,a=``;if(e){let e=F(f),t={};e.forEach(e=>{(s[e]||[]).forEach(e=>{t[e.name]||(t[e.name]={...e,amount:0,months_count:0}),t[e.name].amount+=e.amount||0,t[e.name].months_count+=e.months===void 0?1:e.months})});let n=Object.values(t);r=`<tr><th>TT</th><th>Họ và tên</th><th>Đối tượng</th><th>Đơn vị công tác</th><th>Số tháng hưởng</th><th>Tổng tiền hỗ trợ</th><th>Ghi chú</th></tr>`,i=n.map((e,t)=>`<tr>
        <td>${t+1}</td>
        <td>${e.name}</td>
        <td>${e.category||e.categoryKey||`Đãi ngộ NQ20`}</td>
        <td>${e.dept||``}</td>
        <td style="text-align:center;">${e.months_count}</td>
        <td style="font-weight:700;">${k(e.amount)}</td>
        <td>${e.notes||e.content||``}</td>
      </tr>`).join(``),a=`<tr>
        <td colspan="4">TỔNG CỘNG: ${n.length} Bác sỹ</td>
        <td style="text-align:center;">${n.reduce((e,t)=>e+(t.months_count||0),0)}</td>
        <td style="font-weight:700;">${k(n.reduce((e,t)=>e+(t.amount||0),0))}</td>
        <td></td>
      </tr>`}else{let e=s[n]||[];r=`<tr><th>TT</th><th>Họ và tên</th><th>Đối tượng</th><th>Đơn vị công tác</th><th>Định mức</th><th>Số tháng</th><th>Thành tiền</th><th>Ghi chú</th></tr>`,i=e.map((e,t)=>{let n=e.limit||e.amount,r=e.limit===void 0?n:e.limit,i=e.months===void 0?1:e.months;return`<tr>
          <td>${t+1}</td>
          <td>${e.name}</td>
          <td>${e.category||e.categoryKey||`Đãi ngộ NQ20`}</td>
          <td>${e.dept||``}</td>
          <td>${k(r)}</td>
          <td>${i}</td>
          <td style="font-weight:700;">${k(e.amount)}</td>
          <td>${e.notes||e.content||``}</td>
        </tr>`}).join(``),a=`<tr>
        <td colspan="4">TỔNG CỘNG: ${e.length} Bác sỹ</td>
        <td></td>
        <td></td>
        <td style="font-weight:700;">${k(e.reduce((e,t)=>e+(t.amount||0),0))}</td>
        <td></td>
      </tr>`}m=`
      <table class="report-table">
        <thead>
          ${r}
        </thead>
        <tbody>
          ${i}
        </tbody>
        <tfoot>
          ${a}
        </tfoot>
      </table>
    `}else if(e===`pit`){let e=r===`all`?`CẢ NĂM 2026`:`QUÝ ${r}/2026`;l=`BẢNG KÊ THU NHẬP TÍNH THUẾ THU NHẬP CÁ NHÂN`,u=e;let t=[`Lương chính`,`PC vượt khung`,`PC Khu vực`,`PC Chức vụ`,`PC Trách nhiệm`,`PC ưu đãi ngành`,`PC Độc hại`,`PC cấp ủy`,`Tổng lương`,`BH 10.5%`,`BH CV`,`BH VK`,`Trừ ốm LC`,`Trừ ốm VK`,`Trừ ốm CV`,`Trừ ốm TN`,`Trừ ốm ƯĐ`,`Trừ ốm ĐH`,`Thực lĩnh`],n=R(r);m=`
      <table class="report-table">
        <thead>
          <tr>
            <th>Họ và tên</th><th>Bộ phận</th>
            ${t.slice(0,9).map(e=>`<th>${e}</th>`).join(``)}
            <th>Ngoài giờ</th>
            <th>Thưởng</th>
            <th>Thu nhập tính thuế</th>
          </tr>
        </thead>
        <tbody>
          ${n.map(e=>`<tr>
              <td>${e.name}</td><td>${e.dept}</td>
              ${e.rawAmounts.slice(0,9).map(e=>`<td>${k(e)}</td>`).join(``)}
              <td>${k(e.otAmount)}</td>
              <td>${k(e.bonusAmount)}</td>
              <td>${k(e.taxable>0?e.taxable:0)}</td>
            </tr>`).join(``)}
        </tbody>
      </table>
    `}c.innerHTML=`
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
      <h3 style="margin:0.5rem 0; font-size:1.1rem;">${u}</h3>
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
  `,p={type:e,title:l,subTitle:u},t.style.display=`flex`,lucide.createIcons()},window.doExport=function(e){if(!p)return;let{type:t,title:n,subTitle:r}=p,i=`${n}_${r}`.replace(/[\s/]+/g,`_`);if(e===`pdf`){let e=document.getElementById(`preview-container`),t={margin:[10,5,10,5],filename:`${i}.pdf`,image:{type:`jpeg`,quality:.98},html2canvas:{scale:2,useCORS:!0},jsPDF:{unit:`mm`,format:`a4`,orientation:`landscape`}};html2pdf().set(t).from(e).save()}else{let e=document.querySelector(`.report-table`);if(!e)return;let t=XLSX.utils.table_to_book(e,{sheet:`Bao Cao`});XLSX.writeFile(t,`${i}.xlsx`)}},window.copyBonusFromPrevious=function(){let e=D(Object.keys(o)).find(e=>e!==n);if(!e)return alert(`Không tìm thấy dữ liệu tháng trước!`);confirm(`Bạn có muốn sao chép danh sách khen thưởng từ tháng ${e} sang tháng ${n}?`)&&(o[n]=JSON.parse(JSON.stringify(o[e])),C(),$(),alert(`Đã sao chép thành công!`))},M(),$();