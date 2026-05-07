(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`https://docs.google.com/spreadsheets/d/1Hv_suFrUYa5ZInJrYbOLkGCYwJv4A7w_YAyysgMZlAk/export?format=csv&gid=535447968`,t=`dashboard`,n=`05/2026`,r=`all`,i={},a=[],o={},s=``,c=155e5,l=62e5;try{i=JSON.parse(localStorage.getItem(`hospital_salary_data`))||{},a=JSON.parse(localStorage.getItem(`hospital_salary_headers`))||[],o=JSON.parse(localStorage.getItem(`hospital_dependent_overrides`))||{}}catch{i={},a=[],o={}}function u(){localStorage.setItem(`hospital_salary_data`,JSON.stringify(i)),localStorage.setItem(`hospital_salary_headers`,JSON.stringify(a)),localStorage.setItem(`hospital_dependent_overrides`,JSON.stringify(o))}var d=e=>{if(!e||!e.name)return!1;let t=String(e.name).trim();return t.length>3&&isNaN(t)&&/[a-zA-ZÀ-ỹ]/.test(t)&&!t.startsWith(`Tổng`)};function f(e){if(!e)return``;let t=e.trim();if(t.includes(`/export?`))return t;if(t.includes(`docs.google.com/spreadsheets`)){let e=t.split(`/edit`)[0],n=t.match(/gid=([0-9]+)/);return`${e}/export?format=csv${n?`&gid=`+n[1]:``}`}return t}function p(e){if(e==null)return 0;let t=String(e).trim();return t===`-`||t===``||t===`0`?0:Math.round(parseFloat(t.replace(/\./g,``).replace(/,/g,``).replace(/\s/g,``).replace(/[^\d]/g,``)))||0}function m(e){return(e||0).toLocaleString(`vi-VN`)}function h(e){let t=Papa.parse(e,{skipEmptyLines:!0}).data,n=t.findIndex(e=>e.some(e=>e&&(e.toString().trim()===`TT`||e.toString().trim()===`STT`)));n===-1&&(n=6),a=t[n]?t[n].map(e=>e.toString().trim()):[];let r=[];for(let e=n+1;e<t.length;e++){let n=t[e],i=String(n[1]||``).trim();if(!d({name:i}))continue;let a={base:n[4],area:n[5],vkhung:n[6],position:n[7],responsibility:n[8],incentive:n[9],toxic:n[10],party:n[11]},o=[p(n[13]),p(n[14]),p(n[15]),p(n[16]),p(n[17]),p(n[18]),p(n[19]),p(n[20]),p(n[21]),p(n[22]),p(n[23]),p(n[24]),p(n[25]),p(n[26]),p(n[27]),p(n[28]),p(n[29]),p(n[30])];r.push({id:String(n[0]||``).trim(),name:i,department:String(n[2]||``).trim(),position:String(n[3]||``).trim(),coefficients:a,rawAmounts:o,numDependents:p(n[27])||0,total:o[8]||0,net:o[17]||0})}return r}async function g(){if(i[n]&&i[n].length>0){C();return}C();try{let t=h(await(await fetch(`https://corsproxy.io/?${encodeURIComponent(f(e))}`)).text());t.length&&(i[n]=t,u())}catch(e){console.error(e)}finally{C()}}var _=()=>`
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
  </aside>`,v=e=>`
  <header class="top-bar">
    <h1 style="font-size:1.5rem;font-weight:700;">${e}</h1>
    <div class="search-bar"><i data-lucide="search" size="18"></i><input type="text" id="search-input" placeholder="Tìm kiếm..."></div>
  </header>`,y=()=>{let e=(i[n]||[]).filter(d),t=s?e.filter(e=>e.name.toLowerCase().includes(s.toLowerCase())||e.department.toLowerCase().includes(s.toLowerCase())):e,r=Object.keys(i).sort((e,t)=>t.split(`/`)[0]-e.split(`/`)[0]);return`
  <div class="fade-in">
    ${v(`Bảng lương `+n)}
    <div class="card">
      <div style="display:flex;justify-content:space-between;margin-bottom:1.5rem;gap:1rem;">
        <div style="display:flex;gap:1rem;align-items:center;">
          <select class="select-input" id="month-selector">${r.length?r.map(e=>`<option value="${e}" ${n===e?`selected`:``}>${e}</option>`).join(``):`<option>${n}</option>`}</select>
          <button class="btn btn-secondary" id="del-month-btn" style="color:#ef4444;"><i data-lucide="trash-2" size="14" style="pointer-events:none;"></i></button>
        </div>
        <button class="btn btn-primary" id="import-btn">Import Tháng mới</button>
      </div>
      <div class="table-container" style="max-height:650px;">
        <table class="salary-detail-table">
          <thead>
            <tr>
              <th class="sticky-col">TT</th><th class="sticky-col">Họ tên</th><th class="sticky-col">Khoa/Phòng</th>
              <th>Chức vụ</th><th>HSL</th><th>KV</th><th>VK</th><th>CV</th><th>TN</th><th>ƯĐ</th><th>ĐH</th><th>CU</th>
              ${[`Lương chính`,`PC Vượt khung`,`PC Khác`,`PC Chức vụ`,`PC Độc hại`,`PC Trực`,`PC Ngành`,`PC Ưu đãi`,`Tổng lương`,`BHXH`,`BHYT`,`BHTN`,`KP CD`,`Thuế TNCN`,`Giảm trừ`,`Phạt`,`Tạm ứng`,`Thực lĩnh`].map((e,t)=>`<th class="${t===8?`highlight-total`:t===17?`highlight-col`:``}">${e}</th>`).join(``)}
            </tr>
          </thead>
          <tbody>
            ${t.map(e=>`<tr>
              <td class="sticky-col">${e.id}</td><td class="sticky-col" style="font-weight:600;">${e.name}</td><td class="sticky-col">${e.department}</td><td>${e.position}</td>
              <td class="text-center">${e.coefficients?.base||``}</td><td class="text-center">${e.coefficients?.area||``}</td><td class="text-center">${e.coefficients?.vkhung||``}</td><td class="text-center">${e.coefficients?.position||``}</td><td class="text-center">${e.coefficients?.responsibility||``}</td><td class="text-center">${e.coefficients?.incentive||``}</td><td class="text-center">${e.coefficients?.toxic||``}</td><td class="text-center">${e.coefficients?.party||``}</td>
              ${(e.rawAmounts||Array(18).fill(0)).map((e,t)=>`<td class="${t===8?`highlight-total`:t===17?`highlight-col`:``}">${m(e)}</td>`).join(``)}
            </tr>`).join(``)}
          </tbody>
        </table>
      </div>
    </div>
  </div>`},b=()=>{let e={};Object.entries(i).forEach(([t,n])=>{if(!Array.isArray(n))return;let i=parseInt(t.split(`/`)[0]),a=i<=3?`1`:i<=6?`2`:i<=9?`3`:`4`;n.filter(d).forEach(t=>{e[t.name]||(e[t.name]={name:t.name,dept:t.department,monthsInPeriod:0,n:0,o:0,q_val:0,v_val:0,ae_val:0,w:0,x:0,y:0,numDependents:o[t.name]===void 0?t.numDependents||0:o[t.name]}),(r===`all`||r===a)&&(e[t.name].monthsInPeriod+=1,t.rawAmounts&&(e[t.name].n+=t.rawAmounts[0],e[t.name].o+=t.rawAmounts[1],e[t.name].q_val+=t.rawAmounts[3],e[t.name].v_val+=0,e[t.name].ae_val+=0,e[t.name].w+=t.rawAmounts[9],e[t.name].x+=t.rawAmounts[10],e[t.name].y+=t.rawAmounts[11]))})});let t=Object.values(e).map(e=>{let t=e.n+e.o+e.q_val+e.v_val+e.ae_val,n=e.monthsInPeriod*c,r=e.monthsInPeriod*(e.numDependents*l),i=t-(e.w+e.x+e.y)-n-r;return{...e,gross_taxable:t,gt_bt:n,gt_npt:r,taxable:i}}).sort((e,t)=>t.taxable-e.taxable),n=s?t.filter(e=>e.name.toLowerCase().includes(s.toLowerCase())):t;return`
  <div class="fade-in">
    ${v(`Thuế TNCN - Thu nhập tính thuế `+(r===`all`?`Cả năm`:`Quý ${r}`))}
    <div class="card">
      <div style="display:flex;justify-content:flex-start;align-items:center;margin-bottom:1.5rem;gap:1rem;">
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
              <td>${m(e.n)}</td><td>${m(e.o)}</td><td>${m(e.q_val)}</td>
              <td style="color:var(--text-muted);opacity:0.6;">${m(e.v_val)}</td><td style="color:var(--text-muted);opacity:0.6;">${m(e.ae_val)}</td>
              <td style="font-weight:700;color:var(--primary);background:rgba(14, 165, 233, 0.05);">${m(e.gross_taxable)}</td>
              <td style="color:#ef4444;">${m(e.w)}</td><td style="color:#ef4444;">${m(e.x)}</td><td style="color:#ef4444;">${m(e.y)}</td>
              <td>${m(e.gt_bt)}</td>
              <td><input type="number" class="select-input npt-input" data-name="${e.name}" value="${e.numDependents}" style="width:60px;text-align:center;padding:2px;"></td>
              <td>${m(e.gt_npt)}</td>
              <td class="highlight-col" style="font-weight:700;color:var(--primary);">${m(e.taxable)}</td>
            </tr>`).join(``)}
          </tbody>
        </table>
      </div>
    </div>
  </div>`},x=e=>`
  <div class="fade-in">
    ${v(e)}
    <div class="card" style="height:400px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:var(--text-muted);">
      <div style="background:rgba(14, 165, 233, 0.1);padding:2rem;border-radius:50%;margin-bottom:1.5rem;">
        <i data-lucide="construction" size="48" style="color:var(--primary);"></i>
      </div>
      <h2>Phân hệ đang được thiết kế</h2>
      <p>Sau khi hoàn thành, số liệu từ đây sẽ được tổng hợp tự động sang bảng Thuế TNCN.</p>
    </div>
  </div>`,S=()=>{let e=(i[n]||[]).filter(d),t=e.reduce((e,t)=>e+t.total,0),r=e.reduce((e,t)=>e+t.net,0);return`<div class="fade-in">${v(`Tổng quan `+n)}<div class="stats-grid"><div class="card stat-card"><span class="stat-label">Tổng quỹ lương</span><span class="stat-value">${m(t)}</span></div><div class="card stat-card"><span class="stat-label">Tổng thực lĩnh</span><span class="stat-value">${m(r)}</span></div><div class="card stat-card"><span class="stat-label">Nhân sự</span><span class="stat-value">${e.length}</span></div></div></div>`},C=()=>{let e=document.getElementById(`app`);if(!e)return;let a=``;switch(t){case`salary`:a=y();break;case`pit`:a=b();break;case`overtime`:a=x(`Quản lý Trực & Ngoài giờ`);break;case`bonus`:a=x(`Quản lý Khen thưởng`);break;default:a=S()}e.innerHTML=`${_()}<main class="main-content">${a}</main><div id="import-modal" class="modal-overlay" style="display:none;"><div class="card modal-content" style="max-width:500px;"><h2>Import dữ liệu</h2><input type="text" id="import-month-name" class="select-input" style="width:100%;margin:1rem 0;" value="${n}"><input type="text" id="import-url" class="select-input" style="width:100%;margin-bottom:1.5rem;" placeholder="Link Google Sheets CSV"><div style="display:flex;gap:1rem;justify-content:flex-end;"><button class="btn btn-secondary" id="close-modal">Hủy</button><button class="btn btn-primary" id="confirm-import">Bắt đầu Import</button></div></div></div>`,lucide.createIcons(),document.querySelectorAll(`.nav-item[data-tab]`).forEach(e=>e.onclick=()=>{t=e.dataset.tab,C()});let c=document.getElementById(`search-input`);c&&(c.value=s,c.oninput=e=>{s=e.target.value,C()});let l=document.getElementById(`month-selector`);l&&(l.onchange=e=>{n=e.target.value,C()});let d=document.getElementById(`pit-quarter-selector`);d&&(d.onchange=e=>{r=e.target.value,C()}),document.querySelectorAll(`.npt-input`).forEach(e=>{e.onchange=e=>{let t=e.target.dataset.name,n=parseInt(e.target.value)||0;o[t]=n,u(),C()}});let p=document.getElementById(`del-month-btn`);p&&p.addEventListener(`click`,function(e){if(e.preventDefault(),e.stopPropagation(),confirm(`Bạn có chắc chắn muốn xóa dữ liệu tháng `+n+`?`)){delete i[n];let e=Object.keys(i);n=e.length?e[0]:`05/2026`,u(),C(),alert(`Đã xóa thành công!`)}});let m=document.getElementById(`import-btn`),g=document.getElementById(`import-modal`),v=document.getElementById(`close-modal`),w=document.getElementById(`confirm-import`);m&&(m.onclick=()=>g.style.display=`flex`),v&&(v.onclick=()=>g.style.display=`none`),w&&(w.onclick=async()=>{let e=document.getElementById(`import-month-name`).value.trim(),t=document.getElementById(`import-url`).value.trim();if(!e||!t)return alert(`Thiếu thông tin`);w.textContent=`Đang xử lý...`,w.disabled=!0;try{let r=h(await(await fetch(`https://corsproxy.io/?${encodeURIComponent(f(t))}`)).text());if(!r.length)throw Error(`Dữ liệu không hợp lệ`);i[e]=r,n=e,u(),g.style.display=`none`,C()}catch(e){alert(`Lỗi: `+e.message)}finally{w.textContent=`Bắt đầu Import`,w.disabled=!1}});let T=document.getElementById(`theme-toggle`);T&&(T.onclick=()=>{document.body.setAttribute(`data-theme`,document.body.getAttribute(`data-theme`)===`dark`?`light`:`dark`)})};g(),C();