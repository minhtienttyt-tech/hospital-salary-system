(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`https://docs.google.com/spreadsheets/d/1Hv_suFrUYa5ZInJrYbOLkGCYwJv4A7w_YAyysgMZlAk/export?format=csv&gid=535447968`,t=`dashboard`,n=`05/2026`,r=`all`,i={},a={},o=[],s={},c=``,l=155e5,u=62e5;try{i=JSON.parse(localStorage.getItem(`hospital_salary_data`))||{},a=JSON.parse(localStorage.getItem(`hospital_overtime_data`))||{},o=JSON.parse(localStorage.getItem(`hospital_salary_headers`))||[],s=JSON.parse(localStorage.getItem(`hospital_dependent_overrides`))||{}}catch{i={},a={},o=[],s={}}function d(){localStorage.setItem(`hospital_salary_data`,JSON.stringify(i)),localStorage.setItem(`hospital_overtime_data`,JSON.stringify(a)),localStorage.setItem(`hospital_salary_headers`,JSON.stringify(o)),localStorage.setItem(`hospital_dependent_overrides`,JSON.stringify(s))}var f=e=>{if(!e||!e.name)return!1;let t=String(e.name).trim();return t.length>3&&isNaN(t)&&/[a-zA-ZÀ-ỹ]/.test(t)&&!t.startsWith(`Tổng`)};function p(e){if(!e)return``;let t=e.trim();if(t.includes(`/export?`))return t;if(t.includes(`docs.google.com/spreadsheets`)){let e=t.split(`/edit`)[0],n=t.match(/gid=([0-9]+)/);return`${e}/export?format=csv${n?`&gid=`+n[1]:``}`}return t}function m(e){if(e==null)return 0;let t=String(e).trim();return t===`-`||t===``||t===`0`?0:Math.round(parseFloat(t.replace(/\./g,``).replace(/,/g,``).replace(/\s/g,``).replace(/[^\d]/g,``)))||0}function h(e){return(e||0).toLocaleString(`vi-VN`)}function g(e){let t=Papa.parse(e,{skipEmptyLines:!0}).data,n=t.findIndex(e=>e.some(e=>e&&(e.toString().trim()===`TT`||e.toString().trim()===`STT`)));n===-1&&(n=6),o=t[n]?t[n].map(e=>e.toString().trim()):[];let r=[];for(let e=n+1;e<t.length;e++){let n=t[e],i=String(n[1]||``).trim();if(!f({name:i}))continue;let a={base:n[4],area:n[5],vkhung:n[6],position:n[7],responsibility:n[8],incentive:n[9],toxic:n[10],party:n[11]},o=[m(n[13]),m(n[14]),m(n[15]),m(n[16]),m(n[17]),m(n[18]),m(n[19]),m(n[20]),m(n[21]),m(n[22]),m(n[23]),m(n[24]),m(n[25]),m(n[26]),m(n[27]),m(n[28]),m(n[29]),m(n[30]),m(n[31])];r.push({id:String(n[0]||``).trim(),name:i,department:String(n[2]||``).trim(),position:String(n[3]||``).trim(),coefficients:a,rawAmounts:o,numDependents:m(n[27])||0,total:o[8]||0,net:o[18]||0})}return r}async function _(){if(i[n]&&i[n].length>0){E();return}E();try{let t=g(await(await fetch(`https://corsproxy.io/?${encodeURIComponent(p(e))}`)).text());t.length&&(i[n]=t,d())}catch(e){console.error(e)}finally{E()}}var v=()=>`
  <aside class="sidebar">
    <div class="logo-container">
      <div class="logo-circle" style="background-image: url('https://lookaside.fbsbx.com/lookaside/crawler/media/?media_id=100064536828566');"></div>
      <div><span class="logo-text">BVĐK<br><small>Than Uyên</small></span></div>
    </div>
    <ul class="nav-menu">
      <li class="nav-item ${t===`dashboard`?`active`:``}" data-tab="dashboard"><i data-lucide="layout-dashboard"></i><span>Tổng quan</span></li>
      <li class="nav-item ${t===`salary`?`active`:``}" data-tab="salary"><i data-lucide="banknote"></i><span>Bảng lương</span></li>
      <li class="nav-item ${t===`overtime`?`active`:``}" data-tab="overtime"><i data-lucide="clock"></i><span>Trực & Ngoài giờ</span></li>
      <li class="nav-item ${t===`bonus`?`active`:``}" data-tab="bonus"><i data-lucide="gift"></i><span>Khen thưởng</span></li>
      <li class="nav-item ${t===`pit`?`active`:``}" data-tab="pit"><i data-lucide="shield-check"></i><span>Thuế TNCN</span></li>
    </ul>
    <div style="margin-top:auto;"><div class="nav-item" id="theme-toggle"><i data-lucide="moon"></i><span>Chế độ tối</span></div></div>
  </aside>`,y=e=>`
  <header class="top-bar">
    <h1 style="font-size:1.5rem;font-weight:700;">${e}</h1>
    <div class="search-bar"><i data-lucide="search" size="18"></i><input type="text" id="search-input" placeholder="Tìm kiếm..."></div>
  </header>`,b=()=>{let e=(i[n]||[]).filter(f),t=c?e.filter(e=>e.name.toLowerCase().includes(c.toLowerCase())||e.department.toLowerCase().includes(c.toLowerCase())):e,r=Object.keys(i).sort((e,t)=>t.split(`/`)[0]-e.split(`/`)[0]);return`
  <div class="fade-in">
    ${y(`Bảng lương `+n)}
    <div class="card">
      <div style="display:flex;justify-content:space-between;margin-bottom:1.5rem;gap:1rem;">
        <div style="display:flex;gap:1rem;align-items:center;">
          <select class="select-input" id="month-selector">${r.length?r.map(e=>`<option value="${e}" ${n===e?`selected`:``}>${e}</option>`).join(``):`<option>${n}</option>`}</select>
          <button class="btn btn-secondary" onclick="window.deleteMonth()" style="color:#ef4444;font-size:0.85rem;">🗑️ Xóa</button>
        </div>
        <div style="display:flex;gap:0.5rem;align-items:center;">
          <button class="btn btn-secondary" onclick="window.exportSalaryToExcel()" title="Xuất Excel"><i data-lucide="file-spreadsheet" size="16"></i> Excel</button>
          <button class="btn btn-secondary" onclick="window.exportSalaryToPDF()" title="Xuất PDF"><i data-lucide="file-text" size="16"></i> PDF</button>
          <button class="btn btn-primary" id="import-btn">Import Tháng mới</button>
        </div>
      </div>
      <div class="table-container" style="max-height:650px;">
        <table class="salary-detail-table">
          <thead>
            <tr>
              <th class="sticky-col">TT</th><th class="sticky-col">Họ tên</th><th class="sticky-col">Khoa/Phòng</th>
              <th>Chức vụ</th><th>HSL</th><th>KV</th><th>VK</th><th>CV</th><th>TN</th><th>ƯĐ</th><th>ĐH</th><th>CU</th>
              ${[`Lương chính`,`PC vượt khung`,`PC Khu vực`,`PC Chức vụ`,`PC Trách nhiệm`,`PC ưu đãi ngành`,`PC Độc hại`,`PC cấp ủy`,`Tổng cộng lương`,`Khấu trừ 10,5% BH`,`KT 10,5% BH CV`,`KT 10,5% BH VK`,`Trừ ốm LC`,`Trừ ốm VK`,`Trừ ốm CV`,`Trừ ốm TN`,`Trừ ốm ƯĐ`,`Trừ ốm ĐH`,`Tổng lĩnh`].map((e,t)=>`<th class="${t===8?`highlight-total`:t===18?`highlight-col`:``}">${e}</th>`).join(``)}
            </tr>
          </thead>
          <tbody>
            ${t.map(e=>`<tr>
              <td class="sticky-col">${e.id}</td><td class="sticky-col" style="font-weight:600;">${e.name}</td><td class="sticky-col">${e.department}</td><td>${e.position}</td>
              <td class="text-center">${e.coefficients?.base||``}</td><td class="text-center">${e.coefficients?.area||``}</td><td class="text-center">${e.coefficients?.vkhung||``}</td><td class="text-center">${e.coefficients?.position||``}</td><td class="text-center">${e.coefficients?.responsibility||``}</td><td class="text-center">${e.coefficients?.incentive||``}</td><td class="text-center">${e.coefficients?.toxic||``}</td><td class="text-center">${e.coefficients?.party||``}</td>
              ${(e.rawAmounts||Array(19).fill(0)).map((e,t)=>`<td class="${t===8?`highlight-total`:t===18?`highlight-col`:``}">${h(e)}</td>`).join(``)}
            </tr>`).join(``)}
          </tbody>
          <tfoot>
            <tr style="font-weight:700;background:var(--card-bg);border-top:2px solid var(--accent);">
              <td class="sticky-col"></td><td class="sticky-col" style="color:var(--accent);">Tổng cộng (${t.length} người)</td><td class="sticky-col"></td><td></td>
              <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
              ${Array.from({length:19},(e,n)=>{let r=t.reduce((e,t)=>e+((t.rawAmounts||[])[n]||0),0);return`<td class="${n===8?`highlight-total`:n===18?`highlight-col`:``}" style="font-weight:700;">${h(r)}</td>`}).join(``)}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>`},x=()=>{let e={};Object.entries(i).forEach(([t,n])=>{if(!Array.isArray(n))return;let i=parseInt(t.split(`/`)[0]),o=i<=3?`1`:i<=6?`2`:i<=9?`3`:`4`;n.filter(f).forEach(n=>{if(e[n.name]||(e[n.name]={name:n.name,dept:n.department,monthsInPeriod:0,n:0,o:0,q_val:0,v_val:0,ae_val:0,w:0,x:0,y:0,numDependents:s[n.name]===void 0?n.numDependents||0:s[n.name]}),(r===`all`||r===o)&&(e[n.name].monthsInPeriod+=1,n.rawAmounts)){e[n.name].n+=n.rawAmounts[0],e[n.name].o+=n.rawAmounts[1],e[n.name].q_val+=n.rawAmounts[3];let r=(a[t]||[]).find(e=>e.name===n.name);e[n.name].v_val+=r?r.amount:0,e[n.name].ae_val+=0,e[n.name].w+=n.rawAmounts[9],e[n.name].x+=n.rawAmounts[10],e[n.name].y+=n.rawAmounts[11]}})});let t=Object.values(e).map(e=>{let t=e.n+e.o+e.q_val+e.v_val+e.ae_val,n=e.monthsInPeriod*l,r=e.monthsInPeriod*(e.numDependents*u),i=t-(e.w+e.x+e.y)-n-r;return{...e,gross_taxable:t,gt_bt:n,gt_npt:r,taxable:i}}).sort((e,t)=>t.taxable-e.taxable),n=c?t.filter(e=>e.name.toLowerCase().includes(c.toLowerCase())):t;return`
  <div class="fade-in">
    ${y(`Thuế TNCN - Thu nhập tính thuế `+(r===`all`?`Cả năm`:`Quý ${r}`))}
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;gap:1rem;">
        <div style="display:flex;align-items:center;gap:1rem;">
          <label style="font-weight:600;color:var(--text-muted);">Thời gian:</label>
          <select class="select-input" id="pit-quarter-selector" style="min-width:150px;">
            <option value="all" ${r===`all`?`selected`:``}>Cả năm</option>
            <option value="1" ${r===`1`?`selected`:``}>Quý I</option>
            <option value="2" ${r===`2`?`selected`:``}>Quý II</option>
            <option value="3" ${r===`3`?`selected`:``}>Quý III</option>
            <option value="4" ${r===`4`?`selected`:``}>Quý IV</option>
          </select>
          <span style="font-size:0.85rem;color:var(--text-muted);">(GT Bản thân: 15.5M/tháng, NPT: 6.2M/tháng)</span>
        </div>
        <div style="display:flex;gap:0.5rem;">
          <button class="btn btn-secondary" onclick="window.exportPITToExcel()"><i data-lucide="file-spreadsheet" size="16"></i> Excel</button>
          <button class="btn btn-secondary" onclick="window.exportPITToPDF()"><i data-lucide="file-text" size="16"></i> PDF</button>
        </div>
      </div>
      
      <div class="table-container" style="max-height:700px;">
        <table style="font-size:0.85rem;" class="salary-detail-table">
          <thead>
            <tr>
              <th class="sticky-col">Họ và tên</th><th class="sticky-col">Khoa/Phòng</th>
              <th>Lương chính (N)</th><th>PC Vượt khung (O)</th><th>PC Chức vụ (Q)</th>
              <th style="color:var(--text-muted);">Ngoài giờ</th><th style="color:var(--text-muted);">Thưởng</th>
              <th style="background:rgba(14, 165, 233, 0.1);font-weight:700;color:var(--primary);">Tổng thu nhập chịu thuế</th>
              <th>BHXH 10% (W)</th><th>BH Chức vụ (X)</th><th>BH VK (Y)</th>
              <th>GT Bản thân</th><th style="background:#fef9c3;color:#a16207;">Số NPT</th><th>GT Người phụ thuộc</th>
              <th class="highlight-col">THU NHẬP TÍNH THUẾ</th>
            </tr>
          </thead>
          <tbody>
            ${n.map(e=>`<tr>
              <td class="sticky-col" style="font-weight:600;">${e.name}</td>
              <td class="sticky-col">${e.dept}</td>
              <td>${h(e.n)}</td><td>${h(e.o)}</td><td>${h(e.q_val)}</td>
              <td style="color:var(--text-muted);opacity:0.6;">${h(e.v_val)}</td><td style="color:var(--text-muted);opacity:0.6;">${h(e.ae_val)}</td>
              <td style="font-weight:700;color:var(--primary);background:rgba(14, 165, 233, 0.05);">${h(e.gross_taxable)}</td>
              <td style="color:#ef4444;">${h(e.w)}</td><td style="color:#ef4444;">${h(e.x)}</td><td style="color:#ef4444;">${h(e.y)}</td>
              <td>${h(e.gt_bt)}</td>
              <td><input type="number" class="select-input npt-input" data-name="${e.name}" value="${e.numDependents}" style="width:60px;text-align:center;padding:2px;"></td>
              <td>${h(e.gt_npt)}</td>
              <td class="highlight-col" style="font-weight:700;color:var(--primary);">${h(e.taxable)}</td>
            </tr>`).join(``)}
          </tbody>
        </table>
      </div>
    </div>
  </div>`},S=()=>{let e=a[n]||[],t=c?e.filter(e=>e.name.toLowerCase().includes(c.toLowerCase())||e.dept.toLowerCase().includes(c.toLowerCase())):e,r=Object.keys(a).sort((e,t)=>t.split(`/`)[0]-e.split(`/`)[0]);return`
  <div class="fade-in">
    ${y(`Trực & Ngoài giờ `+n)}
    <div class="card">
      <div style="display:flex;justify-content:space-between;margin-bottom:1.5rem;gap:1rem;">
        <div style="display:flex;gap:1rem;align-items:center;">
          <select class="select-input" id="ot-month-selector">${r.length?r.map(e=>`<option value="${e}" ${n===e?`selected`:``}>${e}</option>`).join(``):`<option>${n}</option>`}</select>
          <button class="btn btn-secondary" onclick="window.deleteOTMonth()" style="color:#ef4444;font-size:0.85rem;">🗑️ Xóa</button>
        </div>
        <div style="display:flex;gap:0.5rem;align-items:center;">
          <button class="btn btn-secondary" onclick="window.exportOTToExcel()"><i data-lucide="file-spreadsheet" size="16"></i> Excel</button>
          <button class="btn btn-primary" id="import-ot-btn">Import Ngoài giờ</button>
        </div>
      </div>
      <div class="table-container" style="max-height:650px; overflow-x: auto;">
        <table class="salary-detail-table" style="min-width: 1500px;">
          <thead>
            <tr>
              <th rowspan="2" class="sticky-col">TT</th>
              <th rowspan="2" class="sticky-col">Họ tên</th>
              <th rowspan="2" class="sticky-col">Khoa/Phòng</th>
              <th rowspan="2">Lương 1 tháng</th>
              <th rowspan="2">Tiền / 1 giờ</th>
              <th colspan="4" style="text-align:center;background:rgba(14, 165, 233, 0.1);">Ngày Thường 150%</th>
              <th colspan="4" style="text-align:center;background:rgba(14, 165, 233, 0.15);">Ngày nghỉ tuần 200%</th>
              <th colspan="4" style="text-align:center;background:rgba(14, 165, 233, 0.2);">Ngày lễ - Tết 300%</th>
              <th rowspan="2" class="highlight-total">Tổng lĩnh</th>
            </tr>
            <tr>
              <th>Số giờ ngày</th><th>T.Tiền</th><th>Số giờ đêm</th><th>T.Tiền</th>
              <th>Số giờ ngày</th><th>T.Tiền</th><th>Số giờ đêm</th><th>T.Tiền</th>
              <th>Số giờ ngày</th><th>T.Tiền</th><th>Số giờ đêm</th><th>T.Tiền</th>
            </tr>
          </thead>
          <tbody>
            ${t.length?t.map(e=>`<tr>
              <td class="sticky-col">${e.id}</td>
              <td class="sticky-col" style="font-weight:600;">${e.name}</td>
              <td class="sticky-col">${e.dept}</td>
              <td>${h(e.salary)}</td>
              <td>${h(e.hourly)}</td>
              <td>${e.h150d}</td><td style="color:var(--primary);">${h(e.m150d)}</td><td>${e.h150n}</td><td style="color:var(--primary);">${h(e.m150n)}</td>
              <td>${e.h200d}</td><td style="color:var(--primary);">${h(e.m200d)}</td><td>${e.h200n}</td><td style="color:var(--primary);">${h(e.m200n)}</td>
              <td>${e.h300d}</td><td style="color:var(--primary);">${h(e.m300d)}</td><td>${e.h300n}</td><td style="color:var(--primary);">${h(e.m300n)}</td>
              <td class="highlight-total">${h(e.amount)}</td>
            </tr>`).join(``):`<tr><td colspan="17" style="text-align:center;padding:2rem;color:var(--text-muted);">Chưa có dữ liệu ngoài giờ tháng này.</td></tr>`}
          </tbody>
          <tfoot>
            <tr style="font-weight:700;background:var(--card-bg);border-top:2px solid var(--accent);">
              <td colspan="3" class="sticky-col">Tổng cộng</td>
              <td></td><td></td>
              <td></td><td>${h(t.reduce((e,t)=>e+(t.m150d||0),0))}</td><td></td><td>${h(t.reduce((e,t)=>e+(t.m150n||0),0))}</td>
              <td></td><td>${h(t.reduce((e,t)=>e+(t.m200d||0),0))}</td><td></td><td>${h(t.reduce((e,t)=>e+(t.m200n||0),0))}</td>
              <td></td><td>${h(t.reduce((e,t)=>e+(t.m300d||0),0))}</td><td></td><td>${h(t.reduce((e,t)=>e+(t.m300n||0),0))}</td>
              <td class="highlight-total">${h(t.reduce((e,t)=>e+(t.amount||0),0))}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>`},C=e=>`
  <div class="fade-in">
    ${y(e)}
    <div class="card" style="height:400px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:var(--text-muted);">
      <div style="background:rgba(14, 165, 233, 0.1);padding:2rem;border-radius:50%;margin-bottom:1.5rem;">
        <i data-lucide="construction" size="48" style="color:var(--primary);"></i>
      </div>
      <h2>Phân hệ đang được thiết kế</h2>
      <p>Sau khi hoàn thành, số liệu từ đây sẽ được tổng hợp tự động sang bảng Thuế TNCN.</p>
    </div>
  </div>`;function w(e){let t=Papa.parse(e).data,n=[];for(let e=7;e<t.length;e++){let r=t[e];if(!r[1]||r[1].includes(`Tổng cộng`)||r[1].trim()===``)continue;let i=r[1].match(/^(.*?)\s*\((.*?)\)$/),a=i?i[1].trim():r[1].trim(),o=i?i[2].trim():``;n.push({id:r[0]||e-6,name:a,dept:o,salary:m(r[5])||0,hourly:m(r[6])||0,h150d:m(r[7])||0,m150d:m(r[8])||0,h150n:m(r[9])||0,m150n:m(r[10])||0,h200d:m(r[11])||0,m200d:m(r[12])||0,h200n:m(r[13])||0,m200n:m(r[14])||0,h300d:m(r[15])||0,m300d:m(r[16])||0,h300n:m(r[17])||0,m300n:m(r[18])||0,amount:m(r[21])||0})}return n}var T=()=>{let e=(i[n]||[]).filter(f),t=e.reduce((e,t)=>e+t.total,0),r=e.reduce((e,t)=>e+t.net,0);return`<div class="fade-in">${y(`Tổng quan `+n)}<div class="stats-grid"><div class="card stat-card"><span class="stat-label">Tổng quỹ lương</span><span class="stat-value">${h(t)}</span></div><div class="card stat-card"><span class="stat-label">Tổng thực lĩnh</span><span class="stat-value">${h(r)}</span></div><div class="card stat-card"><span class="stat-label">Nhân sự</span><span class="stat-value">${e.length}</span></div></div></div>`},E=()=>{let e=document.getElementById(`app`);if(!e)return;let o=``;switch(t){case`salary`:o=b();break;case`pit`:o=x();break;case`overtime`:o=S();break;case`bonus`:o=C(`Quản lý Khen thưởng`);break;default:o=T()}e.innerHTML=`${v()}<main class="main-content">${o}</main><div id="import-modal" class="modal-overlay" style="display:none;"><div class="card modal-content" style="max-width:500px;"><h2 id="import-title">Import dữ liệu</h2><input type="text" id="import-month-name" class="select-input" style="width:100%;margin:1rem 0;" value="${n}"><input type="text" id="import-url" class="select-input" style="width:100%;margin-bottom:1.5rem;" placeholder="Link Google Sheets CSV"><div style="display:flex;gap:1rem;justify-content:flex-end;"><button class="btn btn-secondary" id="close-modal">Hủy</button><button class="btn btn-primary" id="confirm-import">Bắt đầu Import</button></div></div></div>`,lucide.createIcons(),document.querySelectorAll(`.nav-item[data-tab]`).forEach(e=>e.onclick=()=>{t=e.dataset.tab,E()});let l=document.getElementById(`search-input`);l&&(l.value=c,l.oninput=e=>{c=e.target.value,E()});let u=document.getElementById(`month-selector`);u&&(u.onchange=e=>{n=e.target.value,E()});let f=document.getElementById(`pit-quarter-selector`);f&&(f.onchange=e=>{r=e.target.value,E()}),document.querySelectorAll(`.npt-input`).forEach(e=>{e.onchange=e=>{let t=e.target.dataset.name,n=parseInt(e.target.value)||0;s[t]=n,d(),E()}});let m=document.getElementById(`import-btn`),h=document.getElementById(`import-modal`),_=document.getElementById(`close-modal`),y=document.getElementById(`confirm-import`);m&&(m.onclick=()=>h.style.display=`flex`),_&&(_.onclick=()=>h.style.display=`none`),y&&(y.onclick=async()=>{let e=document.getElementById(`import-month-name`).value.trim(),t=document.getElementById(`import-url`).value.trim(),r=y.getAttribute(`data-type`)||`salary`;if(!e||!t)return alert(`Thiếu thông tin`);y.textContent=`Đang xử lý...`,y.disabled=!0;try{let o=await(await fetch(`https://corsproxy.io/?${encodeURIComponent(p(t))}`)).text();if(r===`salary`){let t=g(o);if(!t.length)throw Error(`Dữ liệu không hợp lệ`);i[e]=t,n=e}else{let t=w(o);if(!t.length)throw Error(`Dữ liệu không hợp lệ`);a[e]=t,n=e}d(),h.style.display=`none`,E()}catch(e){alert(`Lỗi: `+e.message)}finally{y.textContent=`Bắt đầu Import`,y.disabled=!1}});let D=document.getElementById(`import-ot-btn`);D&&(D.onclick=()=>{document.getElementById(`import-title`).textContent=`Import Ngoài giờ`,document.getElementById(`import-url`).value=`https://docs.google.com/spreadsheets/d/1d4VhrIM_lk8BeODjG2_PCAK85NXOVI6aLQO1XlUjyiU/edit?gid=446856759#gid=446856759`,y.setAttribute(`data-type`,`overtime`),h.style.display=`flex`});let O=document.getElementById(`ot-month-selector`);O&&(O.onchange=e=>{n=e.target.value,E()});let k=document.getElementById(`theme-toggle`);k&&(k.onclick=()=>{document.body.setAttribute(`data-theme`,document.body.getAttribute(`data-theme`)===`dark`?`light`:`dark`)}),window.lucide&&window.lucide.createIcons()};window.deleteMonth=function(){if(confirm(`Bạn có chắc chắn muốn xóa dữ liệu tháng `+n+`?`)){delete i[n];let e=Object.keys(i);n=e.length?e[0]:`05/2026`,d(),E(),alert(`Đã xóa thành công!`)}},window.exportSalaryToExcel=function(){try{let e=(i[n]||[]).filter(f);if(!e.length)return alert(`Không có dữ liệu để xuất!`);let t=[`Lương chính`,`PC vượt khung`,`PC Khu vực`,`PC Chức vụ`,`PC Trách nhiệm`,`PC ưu đãi ngành`,`PC Độc hại`,`PC cấp ủy`,`Tổng cộng lương`,`Khấu trừ 10,5% BH`,`KT 10,5% BH CV`,`KT 10,5% BH VK`,`Trừ ốm LC`,`Trừ ốm VK`,`Trừ ốm CV`,`Trừ ốm TN`,`Trừ ốm ƯĐ`,`Trừ ốm ĐH`,`Tổng lĩnh`],r=e.map(e=>{let n={TT:e.id,"Họ tên":e.name,"Khoa/Phòng":e.department,"Chức vụ":e.position,HSL:e.coefficients?.base,KV:e.coefficients?.area,VK:e.coefficients?.vkhung,CV:e.coefficients?.position,TN:e.coefficients?.responsibility,ƯĐ:e.coefficients?.incentive,ĐH:e.coefficients?.toxic,CU:e.coefficients?.party};return t.forEach((t,r)=>{n[t]=(e.rawAmounts||[])[r]||0}),n}),a=XLSX.utils.json_to_sheet(r),o=XLSX.utils.book_new();XLSX.utils.book_append_sheet(o,a,`Bang Luong`),XLSX.writeFile(o,`Bang_Luong_${n.replace(`/`,`-`)}.xlsx`)}catch(e){console.error(`Excel Export Error:`,e),alert(`Lỗi khi xuất Excel: `+e.message)}},window.exportSalaryToPDF=function(){try{let e=document.querySelector(`.salary-detail-table`);if(!e)return alert(`Không tìm thấy bảng dữ liệu!`);let t=document.createElement(`div`);t.style.padding=`20px`,t.style.background=`#fff`,t.innerHTML=`
      <div style="text-align:center;margin-bottom:20px;font-family:Arial,sans-serif;">
        <h2 style="margin:0;color:#1e40af;text-transform:uppercase;font-size:18px;">BỆNH VIỆN ĐA KHOA HUYỆN THAN UYÊN</h2>
        <h3 style="margin:5px 0;font-size:16px;">BẢNG LƯƠNG CHI TIẾT THÁNG ${n}</h3>
        <hr style="border:1px solid #eee;margin:15px 0;">
      </div>
    `;let r=e.cloneNode(!0);r.style.width=`100%`,r.style.fontSize=`10px`,t.appendChild(r);let i={margin:[10,5,10,5],filename:`Bang_Luong_${n.replace(`/`,`-`)}.pdf`,image:{type:`jpeg`,quality:.98},html2canvas:{scale:2,useCORS:!0,letterRendering:!0},jsPDF:{unit:`mm`,format:`a4`,orientation:`landscape`}};html2pdf().set(i).from(t).save()}catch(e){alert(`Lỗi khi xuất PDF: `+e.message)}},window.exportPITToExcel=function(){try{let e=r===`all`?`Cả năm`:`Quý ${r}`,t={};Object.entries(i).forEach(([e,n])=>{if(!Array.isArray(n))return;let i=parseInt(e.split(`/`)[0]);r!==`all`&&r!==(i<=3?`1`:i<=6?`2`:i<=9?`3`:`4`)||n.filter(f).forEach(e=>{t[e.name]||(t[e.name]={name:e.name,dept:e.department,months:0,n:0,o:0,q_val:0,v_val:0,ae_val:0,w:0,x:0,y:0,numDependents:s[e.name]===void 0?e.numDependents||0:s[e.name]}),t[e.name].months+=1,e.rawAmounts&&(t[e.name].n+=e.rawAmounts[0]||0,t[e.name].o+=e.rawAmounts[1]||0,t[e.name].q_val+=e.rawAmounts[3]||0,t[e.name].w+=e.rawAmounts[9]||0,t[e.name].x+=e.rawAmounts[10]||0,t[e.name].y+=e.rawAmounts[11]||0)})});let n=Object.values(t).map(e=>{let t=e.n+e.o+e.q_val+e.v_val+e.ae_val,n=e.months*l,r=e.months*(e.numDependents*u),i=t-(e.w+e.x+e.y)-n-r;return{"Họ và tên":e.name,"Khoa/Phòng":e.dept,"Số tháng":e.months,"Lương chính (N)":e.n,"PC Vượt khung (O)":e.o,"PC Chức vụ (Q)":e.q_val,"Tổng thu nhập chịu thuế":t,"BHXH 10% (W)":e.w,"BH Chức vụ (X)":e.x,"BH VK (Y)":e.y,"GT Bản thân":n,"Số người phụ thuộc":e.numDependents,"GT Người phụ thuộc":r,"THU NHẬP TÍNH THUẾ":i>0?i:0}});if(!n.length)return alert(`Không có dữ liệu để xuất!`);let a=XLSX.utils.json_to_sheet(n),o=XLSX.utils.book_new();XLSX.utils.book_append_sheet(o,a,`Thue TNCN`),XLSX.writeFile(o,`Thue_TNCN_${e.replace(` `,`_`)}.xlsx`)}catch(e){alert(`Lỗi khi xuất Excel: `+e.message)}},window.exportPITToPDF=function(){let e=document.querySelector(`.salary-detail-table`);if(!e)return;let t=r===`all`?`CẢ NĂM`:`QUÝ ${r}`,n=document.createElement(`div`);n.style.padding=`20px`,n.style.background=`#fff`,n.innerHTML=`
    <div style="text-align:center;margin-bottom:20px;font-family:Arial,sans-serif;">
      <h2 style="margin:0;color:#1e40af;text-transform:uppercase;font-size:18px;">BỆNH VIỆN ĐA KHOA HUYỆN THAN UYÊN</h2>
      <h3 style="margin:5px 0;font-size:16px;">BẢNG KÊ THU NHẬP TÍNH THUẾ TNCN - ${t}</h3>
      <hr style="border:1px solid #eee;margin:15px 0;">
    </div>
  `;let i=e.cloneNode(!0);i.style.width=`100%`,i.style.fontSize=`10px`,n.appendChild(i);let a={margin:[10,5,10,5],filename:`Thue_TNCN_${t.replace(` `,`_`)}.pdf`,image:{type:`jpeg`,quality:.98},html2canvas:{scale:2,useCORS:!0,letterRendering:!0},jsPDF:{unit:`mm`,format:`a4`,orientation:`landscape`}};html2pdf().set(a).from(n).save()},window.deleteOTMonth=function(){confirm(`Bạn có chắc chắn muốn xóa dữ liệu ngoài giờ tháng `+n+`?`)&&(delete a[n],d(),E())},window.exportOTToExcel=function(){try{let e=a[n]||[];if(!e.length)return alert(`Không có dữ liệu!`);let t=e.map(e=>({TT:e.id,"Họ tên":e.name,"Khoa/Phòng":e.dept,"Mức 150%":e.amount150,"Mức 200%":e.amount200,"Mức 300%":e.amount300,"Tổng lĩnh":e.amount})),r=XLSX.utils.json_to_sheet(t),i=XLSX.utils.book_new();XLSX.utils.book_append_sheet(i,r,`Ngoai gio`),XLSX.writeFile(i,`Ngoai_Gio_${n.replace(`/`,`-`)}.xlsx`)}catch(e){alert(`Lỗi: `+e.message)}},_(),E();