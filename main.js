import './style.css'

const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1Hv_suFrUYa5ZInJrYbOLkGCYwJv4A7w_YAyysgMZlAk/export?format=csv&gid=535447968';

// State của ứng dụng
let currentTab = 'dashboard';
let selectedMonth = '05/2026';
let selectedPITQuarter = 'all'; 
let salaryData = {};
let overtimeData = {};
let bonusData = {};
let salaryHeaders = [];
let dependentOverrides = {}; 
let isLoading = false;
let searchFilter = '';
let viewMode = 'monthly'; // 'monthly' hoặc 'summary'
let summaryPeriod = 'q1'; // 'q1', 'q2', 'q3', 'q4', 'all'
let previewData = null; // Dữ liệu cho modal xem trước

// Định mức giảm trừ thuế
const GT_BAN_THAN = 15500000;
const GT_PHU_THUOC = 6200000;

// Khởi tạo dữ liệu từ bộ nhớ trình duyệt
try {
  salaryData = JSON.parse(localStorage.getItem('hospital_salary_data')) || {};
  overtimeData = JSON.parse(localStorage.getItem('hospital_overtime_data')) || {};
  bonusData = JSON.parse(localStorage.getItem('hospital_bonus_data')) || {};
  salaryHeaders = JSON.parse(localStorage.getItem('hospital_salary_headers')) || [];
  dependentOverrides = JSON.parse(localStorage.getItem('hospital_dependent_overrides')) || {};
} catch (e) {
  salaryData = {}; overtimeData = {}; bonusData = {}; salaryHeaders = []; dependentOverrides = {};
}

function saveToLocal() {
  localStorage.setItem('hospital_salary_data', JSON.stringify(salaryData));
  localStorage.setItem('hospital_overtime_data', JSON.stringify(overtimeData));
  localStorage.setItem('hospital_bonus_data', JSON.stringify(bonusData));
  localStorage.setItem('hospital_salary_headers', JSON.stringify(salaryHeaders));
  localStorage.setItem('hospital_dependent_overrides', JSON.stringify(dependentOverrides));
}

window.deleteBonusMonth = function() {
  const ms = document.getElementById('bn-month-selector') || document.getElementById('month-selector');
  if(ms) selectedMonth = ms.value;
  console.log('Attempting to delete Bonus for:', selectedMonth);
  if (confirm('Xóa dữ liệu khen thưởng tháng ' + selectedMonth + '?')) {
    delete bonusData[selectedMonth];
    saveToLocal();
    render();
    console.log('Bonus deleted successfully');
  }
};

window.deleteOTMonth = function() {
  const ms = document.getElementById('ot-month-selector') || document.getElementById('month-selector');
  if(ms) selectedMonth = ms.value;
  if (confirm('Xóa dữ liệu ngoài giờ tháng ' + selectedMonth + '?')) {
    delete overtimeData[selectedMonth];
    saveToLocal();
    render();
  }
};

window.deleteMonth = function() {
  const ms = document.getElementById('month-selector');
  if(ms) selectedMonth = ms.value;
  if(confirm('Bạn có chắc chắn muốn xóa dữ liệu lương tháng ' + selectedMonth + '?')){
    delete salaryData[selectedMonth];
    const remainingMonths = sortMonthsDesc(Object.keys(salaryData));
    selectedMonth = remainingMonths.length ? remainingMonths[0] : '05/2026';
    saveToLocal();
    render();
  }
};

const isRealEmployee = (e) => {
  if (!e || !e.name) return false;
  const name = String(e.name).trim();
  return name.length > 3 && isNaN(name) && /[a-zA-ZÀ-ỹ]/.test(name) && !name.startsWith('Tổng');
};

function parseVNNumber(val) {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const text = val.toString().trim();
  const sign = /^-/.test(text) ? -1 : 1;
  const clean = text.replace(/[^\d]/g, '');
  return sign * (parseInt(clean) || 0);
}

function sortMonthsDesc(months) {
  return months.sort((a, b) => {
    const [ma = 0, ya = 0] = String(a).split('/').map(Number);
    const [mb = 0, yb = 0] = String(b).split('/').map(Number);
    return (yb * 12 + mb) - (ya * 12 + ma);
  });
}

function convertToCSVUrl(url, gid = '') {
  try {
    if (!url) return '';
    let cleanUrl = url.trim();
    const idMatch = cleanUrl.match(/\/d\/(.*?)(\/|$)/);
    if (!idMatch) return cleanUrl;
    const id = idMatch[1];
    let csvUrl = `https://docs.google.com/spreadsheets/d/${id}/export?format=csv`;
    if (gid) {
      csvUrl += `&gid=${gid}`;
    } else {
      const gidMatch = cleanUrl.match(/gid=([\d]+)/);
      if (gidMatch) csvUrl += `&gid=${gidMatch[1]}`;
    }
    return csvUrl;
  } catch (e) { return url; }
}

function fmt(n) { return (n || 0).toLocaleString('vi-VN'); }

function processCSV(csvText) {
  const parsed = Papa.parse(csvText, { skipEmptyLines: true });
  const rows = parsed.data;
  let hIdx = rows.findIndex(r => r.some(cell => cell && (cell.toString().trim() === 'TT' || cell.toString().trim() === 'STT')));
  if (hIdx === -1) hIdx = 6; 
  salaryHeaders = rows[hIdx] ? rows[hIdx].map(h => h.toString().trim()) : [];
  const result = [];
  for (let i = hIdx + 1; i < rows.length; i++) {
    const row = rows[i];
    const name = String(row[1] || '').trim();
    if (!isRealEmployee({ name })) continue;
    const coefficients = { base: row[4], area: row[5], vkhung: row[6], position: row[7], responsibility: row[8], incentive: row[9], toxic: row[10], party: row[11] };
    const rawAmounts = [
      parseVNNumber(row[13]), parseVNNumber(row[14]), parseVNNumber(row[15]),
      parseVNNumber(row[16]), parseVNNumber(row[17]), parseVNNumber(row[18]),
      parseVNNumber(row[19]), parseVNNumber(row[20]), parseVNNumber(row[21]),
      parseVNNumber(row[22]), parseVNNumber(row[23]), parseVNNumber(row[24]),
      parseVNNumber(row[25]), parseVNNumber(row[26]), parseVNNumber(row[27]),
      parseVNNumber(row[28]), parseVNNumber(row[29]), parseVNNumber(row[30]),
      parseVNNumber(row[31]),
    ];
    result.push({
      id: String(row[0] || '').trim(),
      name: name,
      department: String(row[2] || '').trim(),
      position: String(row[3] || '').trim(),
      coefficients: coefficients,
      rawAmounts: rawAmounts,
      numDependents: parseVNNumber(row[27]) || 0,
      total: rawAmounts[8] || 0,
      net: rawAmounts[18] || 0,
    });
  }
  return result;
}

function processBonusCSV(text) {
  const rows = Papa.parse(text, { skipEmptyLines: true }).data;
  if (rows.length < 2) return [];

  // Tìm hàng chứa "Họ và tên" (thường là mốc bắt đầu dữ liệu)
  let hIdx = rows.findIndex(r => r.some(c => c && c.toString().toLowerCase().includes('họ và tên')));
  if (hIdx === -1) hIdx = 0;

  // Gộp tất cả các hàng tiêu đề từ hàng 0 đến hIdx để tìm cột chính xác
  const combinedHeaders = Array(rows[hIdx].length).fill('');
  for (let i = 0; i <= hIdx; i++) {
    rows[i].forEach((cell, cellIdx) => {
      if (cell) combinedHeaders[cellIdx] += ' ' + cell.toString().toLowerCase();
    });
  }

  let nameIdx = combinedHeaders.findIndex(h => h.includes('họ và tên'));
  let amtIdx = combinedHeaders.findIndex(h => h.includes('tiền thưởng') || h.includes('tổng số') || h.includes('thực lĩnh'));
  
  // Dự phòng cho bảng TKNH đặc thù của BV Than Uyên: Tiền thưởng thường ở cột I (Index 8)
  if (amtIdx === -1) amtIdx = 8;
  if (nameIdx === -1) nameIdx = 1; // Dự phòng cột B

  const deptIdx = combinedHeaders.findIndex(h => h.includes('khoa') || h.includes('phòng') || h.includes('đơn vị'));
  const contentIdx = combinedHeaders.findIndex(h => h.includes('nội dung') || h.includes('ghi chú'));

  const result = [];
  for (let i = hIdx + 1; i < rows.length; i++) {
    const row = rows[i];
    const name = row[nameIdx]?.toString().trim();
    if (!name || name === '' || name.toLowerCase().includes('tổng cộng') || /^[IVXLCDM]+\./.test(name)) continue;
    
    // Kiểm tra hàng rác (ví dụ hàng chỉ có số thứ tự cột)
    if (name.split(' ').length < 2 && isNaN(name) === false) continue;

    result.push({
      name: name,
      dept: deptIdx !== -1 ? row[deptIdx]?.toString().trim() : '',
      amount: parseVNNumber(row[amtIdx]),
      content: contentIdx !== -1 ? row[contentIdx]?.toString().trim() : 'Thưởng NĐ73'
    });
  }
  return result;
}

async function loadData() {
  if (salaryData[selectedMonth] && salaryData[selectedMonth].length > 0) { render(); return; }
  isLoading = true; render();
  try {
    const res = await fetch(`https://corsproxy.io/?${encodeURIComponent(convertToCSVUrl(SHEET_CSV_URL))}`);
    const text = await res.text();
    const parsed = processCSV(text);
    if (parsed.length) { salaryData[selectedMonth] = parsed; saveToLocal(); }
  } catch (e) { console.error(e); } finally { isLoading = false; render(); }
}

const Sidebar = () => `
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
      <li class="nav-item ${currentTab==='dashboard'?'active':''}" data-tab="dashboard"><i data-lucide="layout-dashboard"></i><span>Tổng quan</span></li>
      <li class="nav-item ${currentTab==='salary'?'active':''}" data-tab="salary"><i data-lucide="banknote"></i><span>Bảng lương</span></li>
      <li class="nav-item ${currentTab==='overtime'?'active':''}" data-tab="overtime"><i data-lucide="clock"></i><span>Trực & Ngoài giờ</span></li>
      <li class="nav-item ${currentTab==='bonus'?'active':''}" data-tab="bonus"><i data-lucide="gift"></i><span>Khen thưởng</span></li>
      <li class="nav-item ${currentTab==='pit'?'active':''}" data-tab="pit"><i data-lucide="calculator"></i><span>Thuế TNCN</span></li>
    </ul>
    <div class="sidebar-footer">
      <button id="theme-toggle" class="icon-btn" title="Đổi màu nền"><i data-lucide="moon"></i></button>
      <button onclick="window.emergencyReset()" class="icon-btn" title="Khôi phục hệ thống" style="color:#ef4444;"><i data-lucide="refresh-cw"></i></button>
    </div>
  </aside>`;

function aggregateData(dataObj, monthList) {
  const summary = {};
  monthList.forEach(m => {
    if (!dataObj[m]) return;
    dataObj[m].forEach(row => {
      const name = row.name || row[1];
      if (!name) return;
      if (!summary[name]) {
        summary[name] = { ...row, months_count: 0 };
        Object.keys(summary[name]).forEach(k => {
          if (typeof summary[name][k] === 'number') summary[name][k] = 0;
        });
        if (Array.isArray(row.rawAmounts)) {
          summary[name].rawAmounts = Array(row.rawAmounts.length).fill(0);
        }
      }
      summary[name].months_count++;
      Object.keys(row).forEach(k => {
        if (typeof row[k] === 'number') {
          summary[name][k] = (summary[name][k] || 0) + row[k];
        }
      });
      if (Array.isArray(row.rawAmounts)) {
        const target = summary[name].rawAmounts || [];
        row.rawAmounts.forEach((val, idx) => {
          target[idx] = (target[idx] || 0) + (val || 0);
        });
        summary[name].rawAmounts = target;
      }
    });
  });
  return Object.values(summary).sort((a, b) => (a.id || 0) - (b.id || 0));
}

function getMonthsInPeriod(period, year = '2026') {
  if (period === 'all') return Array.from({length: 12}, (_, i) => `${(i+1).toString().padStart(2,'0')}/${year}`);
  if (period.startsWith('q')) {
    const q = parseInt(period[1]);
    return [`${(q*3-2).toString().padStart(2,'0')}/${year}`, `${(q*3-1).toString().padStart(2,'0')}/${year}`, `${(q*3).toString().padStart(2,'0')}/${year}`];
  }
  return [];
}

const Header = (title) => `
  <header class="top-bar">
    <h1 style="font-size:1.5rem;font-weight:700;">${title}</h1>
    <div class="search-bar"><i data-lucide="search" size="18"></i><input type="text" id="search-input" placeholder="Tìm kiếm..."></div>
  </header>`;

const SalaryTable = () => {
  let filtered = [];
  let title = '';
  if (viewMode === 'monthly') {
    const emps = (salaryData[selectedMonth] || []).filter(isRealEmployee);
    filtered = searchFilter ? emps.filter(e => e.name.toLowerCase().includes(searchFilter.toLowerCase()) || e.department.toLowerCase().includes(searchFilter.toLowerCase())) : emps;
    title = 'Bảng lương ' + selectedMonth;
  } else {
    const months = getMonthsInPeriod(summaryPeriod);
    filtered = aggregateData(salaryData, months);
    title = 'Tổng hợp Lương ' + (summaryPeriod === 'all' ? 'Cả năm' : 'Quý ' + summaryPeriod[1]);
  }
  const months = sortMonthsDesc(Object.keys(salaryData));
  const moneyHeaders = ['Lương chính', 'PC vượt khung', 'PC Khu vực', 'PC Chức vụ', 'PC Trách nhiệm', 'PC ưu đãi ngành', 'PC Độc hại', 'PC cấp ủy', 'Tổng cộng lương', 'Khấu trừ 10,5% BH', 'KT 10,5% BH CV', 'KT 10,5% BH VK', 'Trừ ốm LC', 'Trừ ốm VK', 'Trừ ốm CV', 'Trừ ốm TN', 'Trừ ốm ƯĐ', 'Trừ ốm ĐH', 'Tổng lĩnh'];
  return `
  <div class="fade-in">
    ${Header(title)}
    <div class="card">
      <div style="display:flex;justify-content:space-between;margin-bottom:1.5rem;gap:1rem;flex-wrap:wrap;">
        <div style="display:flex;gap:1rem;align-items:center;">
          <div class="segmented-control">
            <button class="control-btn ${viewMode==='monthly'?'active':''}" onclick="window.setViewMode('monthly')">Theo tháng</button>
            <button class="control-btn ${viewMode==='summary'?'active':''}" onclick="window.setViewMode('summary')">Tổng hợp</button>
          </div>
          ${viewMode === 'monthly' ? `
            <select class="select-input" id="month-selector">${months.length?months.map(m=>`<option value="${m}" ${selectedMonth===m?'selected':''}>${m}</option>`).join(''):`<option>${selectedMonth}</option>`}</select>
            <button class="btn btn-secondary" id="delete-salary-btn" style="color:#ef4444;font-size:0.85rem;">🗑️ Xóa</button>
          ` : `
            <select class="select-input" id="summary-period-selector">
              <option value="all" ${summaryPeriod==='all'?'selected':''}>Cả năm 2026</option>
              <option value="q1" ${summaryPeriod==='q1'?'selected':''}>Quý I</option>
              <option value="q2" ${summaryPeriod==='q2'?'selected':''}>Quý II</option>
              <option value="q3" ${summaryPeriod==='q3'?'selected':''}>Quý III</option>
              <option value="q4" ${summaryPeriod==='q4'?'selected':''}>Quý IV</option>
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
              ${viewMode === 'summary' ? '<th>Số tháng</th>' : ''}
              <th>Chức vụ</th><th>HSL</th><th>KV</th><th>VK</th><th>CV</th><th>TN</th><th>ƯĐ</th><th>ĐH</th><th>CU</th>
              ${moneyHeaders.map((h, i) => `<th class="${i===8?'highlight-total':(i===18?'highlight-col':'')}">${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${filtered.map(e => `<tr>
              <td class="sticky-col col-tt">${e.id||''}</td><td class="sticky-col col-name" style="font-weight:600;">${e.name}</td><td class="sticky-col col-dept">${e.department||e.dept||''}</td>
              ${viewMode === 'summary' ? `<td style="text-align:center;">${e.months_count}</td>` : ''}
              <td>${e.position||''}</td>
              <td class="text-center">${e.coefficients?.base||''}</td><td class="text-center">${e.coefficients?.area||''}</td><td class="text-center">${e.coefficients?.vkhung||''}</td><td class="text-center">${e.coefficients?.position||''}</td><td class="text-center">${e.coefficients?.responsibility||''}</td><td class="text-center">${e.coefficients?.incentive||''}</td><td class="text-center">${e.coefficients?.toxic||''}</td><td class="text-center">${e.coefficients?.party||''}</td>
              ${(e.rawAmounts||Array(19).fill(0)).map((v, i) => `<td class="${i===8?'highlight-total':(i===18?'highlight-col':'')}">${fmt(v)}</td>`).join('')}
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>`;
};

const PITModule = () => {
  const moneyHeaders = ['Lương chính', 'PC vượt khung', 'PC Khu vực', 'PC Chức vụ', 'PC Trách nhiệm', 'PC ưu đãi ngành', 'PC Độc hại', 'PC cấp ủy', 'Tổng cộng lương', 'Khấu trừ 10,5% BH', 'KT 10,5% BH CV', 'KT 10,5% BH VK', 'Trừ ốm LC', 'Trừ ốm VK', 'Trừ ốm CV', 'Trừ ốm TN', 'Trừ ốm ƯĐ', 'Trừ ốm ĐH', 'Tổng lĩnh'];
  const all = {};
  Object.entries(salaryData).forEach(([month, data]) => {
    if(!Array.isArray(data)) return;
    const m = parseInt(month.split('/')[0]);
    const q = m <= 3 ? '1' : (m <= 6 ? '2' : (m <= 9 ? '3' : '4'));
    if (selectedPITQuarter !== 'all' && selectedPITQuarter !== q) return;
    data.filter(isRealEmployee).forEach(e => {
      if (!all[e.name]) {
        all[e.name] = { 
          name: e.name, dept: e.department, monthsInPeriod: 0,
          rawAmounts: Array(19).fill(0),
          otAmount: 0,
          bonusAmount: 0,
          numDependents: (dependentOverrides[e.name] !== undefined) ? dependentOverrides[e.name] : (e.numDependents || 0)
        };
      }
      all[e.name].monthsInPeriod += 1;
      if(e.rawAmounts) e.rawAmounts.forEach((val, i) => all[e.name].rawAmounts[i] = (all[e.name].rawAmounts[i] || 0) + (val || 0));
      const otMonthData = overtimeData[month] || [];
      const otEntry = otMonthData.find(ot => ot.name === e.name);
      all[e.name].otAmount += otEntry ? otEntry.amount : 0;
      const bnMonthData = bonusData[month] || [];
      const bnEntry = bnMonthData.find(bn => bn.name === e.name);
      all[e.name].bonusAmount += bnEntry ? bnEntry.amount : 0;
    });
  });
  const list = Object.values(all).map(e => {
    const gross_taxable = e.rawAmounts[8] + e.otAmount + e.bonusAmount; 
    const gt_bt = e.monthsInPeriod * GT_BAN_THAN;
    const gt_npt = e.monthsInPeriod * (e.numDependents * GT_PHU_THUOC);
    const insurance = (e.rawAmounts[9] || 0) + (e.rawAmounts[10] || 0) + (e.rawAmounts[11] || 0);
    const taxable = gross_taxable - insurance - gt_bt - gt_npt;
    return { ...e, gross_taxable, gt_bt, gt_npt, taxable, insurance };
  }).sort((a, b) => b.taxable - a.taxable);
  const filtered = searchFilter ? list.filter(e => e.name.toLowerCase().includes(searchFilter.toLowerCase())) : list;
  const qTitle = selectedPITQuarter === 'all' ? 'Cả năm' : `Quý ${selectedPITQuarter}`;
  return `
  <div class="fade-in">
    ${Header('Thuế TNCN - Tổng hợp số liệu ' + qTitle)}
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;gap:1rem;flex-wrap:wrap;">
        <div style="display:flex;align-items:center;gap:1rem;">
          <select class="select-input" id="pit-quarter-selector" style="min-width:150px;">
            <option value="all" ${selectedPITQuarter==='all'?'selected':''}>Cả năm</option>
            <option value="1" ${selectedPITQuarter==='1'?'selected':''}>Quý I</option>
            <option value="2" ${selectedPITQuarter==='2'?'selected':''}>Quý II</option>
            <option value="3" ${selectedPITQuarter==='3'?'selected':''}>Quý III</option>
            <option value="4" ${selectedPITQuarter==='4'?'selected':''}>Quý IV</option>
          </select>
        </div>
        <button class="btn btn-secondary" onclick="window.showReportPreview('pit')"><i data-lucide="printer" size="16"></i> Xem trước & Xuất</button>
      </div>
      <div class="table-container" style="max-height:700px;">
        <table class="salary-detail-table" style="font-size:0.82rem;">
          <thead>
            <tr>
              <th class="sticky-col col-tt">TT</th><th class="sticky-col col-name">Họ và tên</th><th class="sticky-col col-dept">Khoa/Phòng</th>
              ${moneyHeaders.map((h, i) => `<th class="${i===8?'highlight-total':(i===18?'highlight-col':'')}">${h}</th>`).join('')}
              <th style="background:rgba(14, 165, 233, 0.1);">Ngoài giờ</th>
              <th style="background:rgba(14, 165, 233, 0.1);">Thưởng</th>
              <th class="highlight-col">TN TÍNH THUẾ</th>
              <th>Số NPT</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map((e, idx) => `<tr>
              <td class="sticky-col col-tt">${idx+1}</td>
              <td class="sticky-col col-name" style="font-weight:600;">${e.name}</td>
              <td class="sticky-col col-dept">${e.dept}</td>
              ${e.rawAmounts.map((v, i) => `<td class="${i===8?'highlight-total':(i===18?'highlight-col':'')}">${fmt(v)}</td>`).join('')}
              <td style="background:rgba(14, 165, 233, 0.05);">${fmt(e.otAmount)}</td>
              <td style="background:rgba(14, 165, 233, 0.05);">${fmt(e.bonusAmount)}</td>
              <td class="highlight-col" style="font-weight:700;color:var(--primary);">${fmt(e.taxable > 0 ? e.taxable : 0)}</td>
              <td><input type="number" class="select-input npt-input" data-name="${e.name}" value="${e.numDependents}" style="width:50px;text-align:center;padding:2px;"></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>`;
};

const BonusModule = () => {
  let filtered = [];
  let title = '';
  if (viewMode === 'monthly') {
    const emps = bonusData[selectedMonth] || [];
    filtered = searchFilter ? emps.filter(e => e.name.toLowerCase().includes(searchFilter.toLowerCase())) : emps;
    title = `Danh sách Khen thưởng ${selectedMonth}`;
  } else {
    const months = getMonthsInPeriod(summaryPeriod);
    const agg = aggregateData(bonusData, months);
    filtered = searchFilter ? agg.filter(e => e.name.toLowerCase().includes(searchFilter.toLowerCase())) : agg;
    title = 'Tổng hợp Khen thưởng ' + (summaryPeriod === 'all' ? 'Cả năm' : 'Quý ' + summaryPeriod[1]);
  }
  const months = sortMonthsDesc(Object.keys(bonusData));
  return `
  <div class="fade-in">
    ${Header(title)}
    <div class="card">
      <div style="display:flex;justify-content:space-between;margin-bottom:1.5rem;gap:1rem;flex-wrap:wrap;">
        <div style="display:flex;gap:1rem;align-items:center;">
          <div class="segmented-control">
            <button class="control-btn ${viewMode==='monthly'?'active':''}" onclick="window.setViewMode('monthly')">Theo tháng</button>
            <button class="control-btn ${viewMode==='summary'?'active':''}" onclick="window.setViewMode('summary')">Tổng hợp</button>
          </div>
          ${viewMode === 'monthly' ? `
            <select class="select-input" id="bn-month-selector">${months.length?months.map(m=>`<option value="${m}" ${selectedMonth===m?'selected':''}>${m}</option>`).join(''):`<option>${selectedMonth}</option>`}</select>
            <button class="btn btn-secondary" onclick="window.copyBonusFromPrevious()" style="font-size:0.85rem;">Sao chép tháng trước</button>
            <button class="btn btn-secondary" id="delete-bonus-btn" style="color:#ef4444;font-size:0.85rem;">🗑️ Xóa</button>
          ` : `
            <select class="select-input" id="bn-period-selector">
              <option value="all" ${summaryPeriod==='all'?'selected':''}>Cả năm 2026</option>
              <option value="q1" ${summaryPeriod==='q1'?'selected':''}>Quý I</option>
              <option value="q2" ${summaryPeriod==='q2'?'selected':''}>Quý II</option>
              <option value="q3" ${summaryPeriod==='q3'?'selected':''}>Quý III</option>
              <option value="q4" ${summaryPeriod==='q4'?'selected':''}>Quý IV</option>
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
            ${filtered.length > 0 
              ? filtered.map((e, idx) => `<tr><td>${idx+1}</td><td>${e.name}</td><td>${e.dept||''}</td><td>${e.content||''}</td><td class="highlight-total">${fmt(e.amount)}</td></tr>`).join('')
              : `<tr><td colspan="5" style="text-align:center;padding:3rem;color:var(--text-muted);">Chưa có dữ liệu khen thưởng tháng ${selectedMonth}.<br><br><button class="btn btn-primary" onclick="document.getElementById('import-bonus-btn').click()">Import ngay</button></td></tr>`
            }
          </tbody>
        </table>
      </div>
    </div>
  </div>`;
};

const OvertimeModule = () => {
  let filtered = [];
  let title = '';
  if (viewMode === 'monthly') {
    const emps = overtimeData[selectedMonth] || [];
    filtered = searchFilter ? emps.filter(e => e.name.toLowerCase().includes(searchFilter.toLowerCase())) : emps;
    title = `Trực & Ngoài giờ ${selectedMonth}`;
  } else {
    const months = getMonthsInPeriod(summaryPeriod);
    const agg = aggregateData(overtimeData, months);
    filtered = searchFilter ? agg.filter(e => e.name.toLowerCase().includes(searchFilter.toLowerCase())) : agg;
    title = 'Tổng hợp Ngoài giờ ' + (summaryPeriod === 'all' ? 'Cả năm' : 'Quý ' + summaryPeriod[1]);
  }
  const months = sortMonthsDesc(Object.keys(overtimeData));
  return `
  <div class="fade-in">
    ${Header(title)}
    <div class="card">
      <div style="display:flex;justify-content:space-between;margin-bottom:1.5rem;gap:1rem;flex-wrap:wrap;">
        <div style="display:flex;gap:1rem;align-items:center;">
          <div class="segmented-control">
            <button class="control-btn ${viewMode==='monthly'?'active':''}" onclick="window.setViewMode('monthly')">Theo tháng</button>
            <button class="control-btn ${viewMode==='summary'?'active':''}" onclick="window.setViewMode('summary')">Tổng hợp</button>
          </div>
          ${viewMode === 'monthly' ? `
            <select class="select-input" id="ot-month-selector">${months.length?months.map(m=>`<option value="${m}" ${selectedMonth===m?'selected':''}>${m}</option>`).join(''):`<option>${selectedMonth}</option>`}</select>
            <button class="btn btn-secondary" id="delete-ot-btn" style="color:#ef4444;font-size:0.85rem;">🗑️ Xóa</button>
          ` : `<select class="select-input" id="ot-period-selector"><option value="all" ${summaryPeriod==='all'?'selected':''}>Cả năm</option><option value="q1" ${summaryPeriod==='q1'?'selected':''}>Quý I</option><option value="q2" ${summaryPeriod==='q2'?'selected':''}>Quý II</option><option value="q3" ${summaryPeriod==='q3'?'selected':''}>Quý III</option><option value="q4" ${summaryPeriod==='q4'?'selected':''}>Quý IV</option></select>`}
        </div>
        <div style="display:flex;gap:0.5rem;align-items:center;">
          <button class="btn btn-secondary" onclick="window.showReportPreview('overtime')" title="Xem trước & Xuất báo cáo"><i data-lucide="printer" size="16"></i> Xem trước & Xuất</button>
          <button class="btn btn-primary" id="import-ot-btn">Import Ngoài giờ</button>
        </div>
      </div>
      <div class="table-container" style="max-height:650px;">
        <table class="salary-detail-table">
          <thead><tr><th>STT</th><th>Họ tên</th><th>Tổng lĩnh</th></tr></thead>
          <tbody>${filtered.map((e, idx) => `<tr><td>${idx+1}</td><td>${e.name}</td><td>${fmt(e.amount)}</td></tr>`).join('')}</tbody>
        </table>
      </div>
    </div>
  </div>`;
};

function processOvertimeCSV(text) {
  const rows = Papa.parse(text, { skipEmptyLines: true }).data;
  const result = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row[1]) continue;
    result.push({ name: row[1].trim(), amount: parseVNNumber(row[10] || row[20]) });
  }
  return result;
}

const Dashboard = () => {
  const sd = (salaryData[selectedMonth] || []).filter(isRealEmployee);
  const od = (overtimeData[selectedMonth] || []);
  const bd = (bonusData[selectedMonth] || []);
  const totalSalary = sd.reduce((s, e) => s + e.total, 0);
  const totalOT = od.reduce((s, e) => s + (e.amount || 0), 0);
  const totalBonus = bd.reduce((s, e) => s + (e.amount || 0), 0);
  const totalNet = totalSalary + totalOT + totalBonus;
  return `
  <div class="fade-in">
    ${Header('Tổng quan ' + selectedMonth)}
    <div class="stats-grid">
      <div class="card stat-card"><span class="stat-label">Tổng quỹ lương</span><span class="stat-value">${fmt(totalNet)}</span></div>
      <div class="card stat-card"><span class="stat-label">Tổng Trực & Ngoài giờ</span><span class="stat-value">${fmt(totalOT)}</span></div>
      <div class="card stat-card"><span class="stat-label">Tổng Khen thưởng</span><span class="stat-value">${fmt(totalBonus)}</span></div>
    </div>
  </div>`;
};

const render = () => {
  const app = document.getElementById('app');
  if(!app) return;
  
  try {
    let content = '';
    switch(currentTab) {
      case 'salary': content = SalaryTable(); break;
      case 'pit': content = PITModule(); break;
      case 'overtime': content = OvertimeModule(); break;
      case 'bonus': content = BonusModule(); break;
      default: content = Dashboard();
    }
    app.innerHTML = `${Sidebar()}<main class="main-content">${content}</main>
      <div id="import-modal" class="modal-overlay" style="display:none;">
        <div class="card modal-content" style="max-width:500px;">
          <h2 id="import-title">Import dữ liệu</h2>
          <div style="margin: 1rem 0;"><label>Tên tháng (MM/YYYY):</label><input type="text" id="import-month-name" class="select-input" style="width:100%;" value="${selectedMonth}"></div>
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
      </div>`;
    
    lucide.createIcons();
    document.querySelectorAll('.nav-item[data-tab]').forEach(i => i.onclick = () => { currentTab = i.dataset.tab; render(); });
    const si = document.getElementById('search-input'); if(si){ si.value = searchFilter; si.oninput = (e) => { searchFilter = e.target.value; render(); } }
    const ms = document.getElementById('month-selector') || document.getElementById('ot-month-selector') || document.getElementById('bn-month-selector');
    if(ms) ms.onchange = (e) => { selectedMonth = e.target.value; render(); }
    const pqs = document.getElementById('pit-quarter-selector'); if(pqs) pqs.onchange = (e) => { selectedPITQuarter = e.target.value; render(); }
    
    document.querySelectorAll('.npt-input').forEach(input => {
      input.onchange = (e) => {
        const name = e.target.dataset.name;
        const val = parseInt(e.target.value) || 0;
        dependentOverrides[name] = val;
        saveToLocal();
        render();
      };
    });

    const ib = document.getElementById('import-btn'), im = document.getElementById('import-modal'), cm = document.getElementById('close-modal'), cfm = document.getElementById('confirm-import');
    if(cm) cm.onclick = () => im.style.display = 'none';
    if(cfm) cfm.onclick = async () => {
      const m = document.getElementById('import-month-name').value.trim();
      const u = document.getElementById('import-url').value.trim();
      const g = document.getElementById('import-gid').value.trim();
      const type = cfm.getAttribute('data-type') || 'salary';
      if(!m || !u) return alert('Thiếu thông tin');
      cfm.textContent = 'Đang xử lý...'; cfm.disabled = true;
      try {
        const finalUrl = convertToCSVUrl(u, g);
        const res = await fetch(`https://corsproxy.io/?${encodeURIComponent(finalUrl)}`);
        const text = await res.text();
        if (type === 'salary') {
          const parsed = processCSV(text);
          if(!parsed.length) throw new Error('Dữ liệu không hợp lệ');
          salaryData[m] = parsed; 
        } else if (type === 'bonus') {
          const parsed = processBonusCSV(text);
          if(!parsed.length) throw new Error('Dữ liệu không hợp lệ');
          bonusData[m] = parsed; 
        } else {
          const parsed = processOvertimeCSV(text);
          if(!parsed.length) throw new Error('Dữ liệu không hợp lệ');
          overtimeData[m] = parsed; 
        }
        selectedMonth = m;
        saveToLocal(); im.style.display = 'none'; render();
      } catch (e) { alert('Lỗi: ' + e.message); } finally { cfm.textContent = 'Bắt đầu Import'; cfm.disabled = false; }
    };

    const otib = document.getElementById('import-ot-btn'), bnib = document.getElementById('import-bonus-btn');
    if(otib) otib.onclick = () => {
      document.getElementById('import-title').textContent = 'Import Ngoài giờ';
      document.getElementById('import-url').value = 'https://docs.google.com/spreadsheets/d/1d4VhrIM_lk8BeODjG2_PCAK85NXOVI6aLQO1XlUjyiU/edit';
      document.getElementById('import-gid').value = '2041249704'; 
      cfm.setAttribute('data-type', 'overtime'); im.style.display = 'flex';
    };
    if(ib) ib.onclick = () => {
      document.getElementById('import-title').textContent = 'Import Lương';
      document.getElementById('import-url').value = localStorage.getItem('last_salary_url') || SHEET_CSV_URL;
      document.getElementById('import-gid').value = localStorage.getItem('last_salary_gid') || '';
      cfm.setAttribute('data-type', 'salary'); im.style.display = 'flex';
    };
    if(bnib) bnib.onclick = () => {
      document.getElementById('import-title').textContent = 'Import Khen thưởng';
      document.getElementById('import-url').value = localStorage.getItem('last_bonus_url') || 'https://docs.google.com/spreadsheets/d/1Imhhn8uEhS2_Wn_3TbQlohsrEUUai_EK6JVJfNUDboQ/edit';
      document.getElementById('import-gid').value = localStorage.getItem('last_bonus_gid') || '1464193880';
      cfm.setAttribute('data-type', 'bonus'); im.style.display = 'flex';
    };

    const sps = document.getElementById('summary-period-selector'), ops = document.getElementById('ot-period-selector'), bps = document.getElementById('bn-period-selector');
    if(sps) sps.onchange = (e) => { summaryPeriod = e.target.value; selectedPITQuarter = e.target.value.replace('q', ''); render(); };
    if(ops) ops.onchange = (e) => { summaryPeriod = e.target.value; selectedPITQuarter = e.target.value.replace('q', ''); render(); };
    if(bps) bps.onchange = (e) => { summaryPeriod = e.target.value; selectedPITQuarter = e.target.value.replace('q', ''); render(); };

    const cpm = document.getElementById('close-preview');
    if(cpm) cpm.onclick = () => document.getElementById('preview-modal').style.display = 'none';

    const tt = document.getElementById('theme-toggle'); 
    if(tt) tt.onclick = () => { document.body.setAttribute('data-theme', document.body.getAttribute('data-theme')==='dark'?'light':'dark'); };
    
    // app.onclick was here, removed for direct binding
    app.onclick = (e) => {
      const btn = e.target.closest('button');
      if (!btn || !btn.id) return;
      if (btn.id === 'delete-bonus-btn') { e.preventDefault(); window.deleteBonusMonth(); }
      else if (btn.id === 'delete-ot-btn') { e.preventDefault(); window.deleteOTMonth(); }
      else if (btn.id === 'delete-salary-btn') { e.preventDefault(); window.deleteMonth(); }
    };
  } catch (err) {
    app.innerHTML = `<div style="padding:3rem;text-align:center;"><h2>Sự cố hiển thị</h2><button class="btn btn-primary" onclick="window.emergencyReset()">Khôi phục hệ thống</button><pre style="text-align:left;margin-top:2rem;">${err.stack}</pre></div>`;
  }
};

window.setViewMode = (mode) => { 
  viewMode = mode; 
  render(); 
};

window.exportSalaryToExcel = function() {
  try {
    const emps = (salaryData[selectedMonth] || []).filter(isRealEmployee);
    if (!emps.length) return alert('Không có dữ liệu để xuất!');
    
    const moneyHeaders = ['Lương chính', 'PC vượt khung', 'PC Khu vực', 'PC Chức vụ', 'PC Trách nhiệm', 'PC ưu đãi ngành', 'PC Độc hại', 'PC cấp ủy', 'Tổng cộng lương', 'Khấu trừ 10,5% BH', 'KT 10,5% BH CV', 'KT 10,5% BH VK', 'Trừ ốm LC', 'Trừ ốm VK', 'Trừ ốm CV', 'Trừ ốm TN', 'Trừ ốm ƯĐ', 'Trừ ốm ĐH', 'Tổng lĩnh'];
    
    const data = emps.map(e => {
      const row = {
        'TT': e.id,
        'Họ tên': e.name,
        'Khoa/Phòng': e.department,
        'Chức vụ': e.position,
        'HSL': e.coefficients?.base,
        'KV': e.coefficients?.area,
        'VK': e.coefficients?.vkhung,
        'CV': e.coefficients?.position,
        'TN': e.coefficients?.responsibility,
        'ƯĐ': e.coefficients?.incentive,
        'ĐH': e.coefficients?.toxic,
        'CU': e.coefficients?.party
      };
      moneyHeaders.forEach((h, i) => {
        row[h] = (e.rawAmounts || [])[i] || 0;
      });
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bang Luong");
    XLSX.writeFile(wb, `Bang_Luong_${selectedMonth.replace('/','-')}.xlsx`);
  } catch (error) {
    console.error('Excel Export Error:', error);
    alert('Lỗi khi xuất Excel: ' + error.message);
  }
};

window.exportSalaryToPDF = function() {
  try {
    const table = document.querySelector('.salary-detail-table');
    if(!table) return alert('Không tìm thấy bảng dữ liệu!');

    const container = document.createElement('div');
    container.style.padding = '20px';
    container.style.background = '#fff';
    container.innerHTML = `
      <div style="text-align:center;margin-bottom:20px;font-family:Arial,sans-serif;">
        <h2 style="margin:0;color:#1e40af;text-transform:uppercase;font-size:18px;">BỆNH VIỆN ĐA KHOA HUYỆN THAN UYÊN</h2>
        <h3 style="margin:5px 0;font-size:16px;">BẢNG LƯƠNG CHI TIẾT THÁNG ${selectedMonth}</h3>
        <hr style="border:1px solid #eee;margin:15px 0;">
      </div>
    `;
    
    const tableClone = table.cloneNode(true);
    tableClone.style.width = '100%';
    tableClone.style.fontSize = '10px';
    container.appendChild(tableClone);

    const opt = {
      margin: [10, 5, 10, 5],
      filename: `Bang_Luong_${selectedMonth.replace('/','-')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    
    html2pdf().set(opt).from(container).save();
  } catch (error) {
    alert('Lỗi khi xuất PDF: ' + error.message);
  }
};

window.exportBonusToExcel = function() {
  try {
    const isSummary = viewMode === 'summary';
    const months = isSummary ? getMonthsInPeriod(summaryPeriod) : [selectedMonth];
    const all = {};
    months.forEach(m => {
      const data = bonusData[m] || [];
      data.forEach(e => {
        if (!all[e.name]) all[e.name] = { ...e, amount: 0, count: 0 };
        all[e.name].amount += (e.amount || 0);
        all[e.name].count++;
      });
    });
    const data = Object.values(all).map((e, i) => ({
      'STT': i + 1,
      'Họ tên': e.name,
      'Khoa/Phòng': e.dept,
      'Nội dung': e.content || 'Thưởng NĐ73',
      'Số tiền': e.amount
    }));
    if (!data.length) return alert('Không có dữ liệu!');
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Khen Thuong");
    XLSX.writeFile(wb, `Khen_Thuong_${isSummary?summaryPeriod:selectedMonth.replace('/','-')}.xlsx`);
  } catch (e) { alert('Lỗi: ' + e.message); }
};

window.exportPITToExcel = function() {
  try {
    const qTitle = selectedPITQuarter === 'all' ? 'Cả năm' : `Quý ${selectedPITQuarter}`;
    const moneyHeaders = ['Lương chính', 'PC vượt khung', 'PC Khu vực', 'PC Chức vụ', 'PC Trách nhiệm', 'PC ưu đãi ngành', 'PC Độc hại', 'PC cấp ủy', 'Tổng cộng lương', 'Khấu trừ 10,5% BH', 'KT 10,5% BH CV', 'KT 10,5% BH VK', 'Trừ ốm LC', 'Trừ ốm VK', 'Trừ ốm CV', 'Trừ ốm TN', 'Trừ ốm ƯĐ', 'Trừ ốm ĐH', 'Tổng lĩnh'];

    const all = {};
    Object.entries(salaryData).forEach(([month, data]) => {
      if(!Array.isArray(data)) return;
      const m = parseInt(month.split('/')[0]);
      const q = m <= 3 ? '1' : (m <= 6 ? '2' : (m <= 9 ? '3' : '4'));
      if (selectedPITQuarter !== 'all' && selectedPITQuarter !== q) return;

      data.filter(isRealEmployee).forEach(e => {
        if (!all[e.name]) {
          all[e.name] = { 
            name: e.name, dept: e.department, months: 0,
            rawAmounts: Array(19).fill(0),
            otAmount: 0,
            numDependents: (dependentOverrides[e.name] !== undefined) ? dependentOverrides[e.name] : (e.numDependents || 0)
          };
        }
        all[e.name].months += 1;
        if(e.rawAmounts) {
          e.rawAmounts.forEach((v, i) => all[e.name].rawAmounts[i] += (v || 0));
        }
        const otMonthData = overtimeData[month] || [];
        const otEntry = otMonthData.find(ot => ot.name === e.name);
        all[e.name].otAmount += otEntry ? otEntry.amount : 0;
      });
    });

    const data = Object.values(all).map(e => {
      const gross_taxable = e.rawAmounts[8] + e.otAmount;
      const insurance = (e.rawAmounts[9] || 0) + (e.rawAmounts[10] || 0) + (e.rawAmounts[11] || 0);
      const gt_bt = e.months * GT_BAN_THAN;
      const gt_npt = e.months * (e.numDependents * GT_PHU_THUOC);
      const taxable = gross_taxable - insurance - gt_bt - gt_npt;
      
      const row = {
        'Họ và tên': e.name,
        'Khoa/Phòng': e.dept,
        'Số tháng': e.months
      };
      moneyHeaders.forEach((h, i) => row[h] = e.rawAmounts[i]);
      row['Ngoài giờ'] = e.otAmount;
      row['THU NHẬP TÍNH THUẾ'] = taxable > 0 ? taxable : 0;
      return row;
    });

    if (!data.length) return alert('Không có dữ liệu!');
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Thue TNCN");
    XLSX.writeFile(wb, `Thue_TNCN_${qTitle.replace(' ', '_')}.xlsx`);
  } catch (error) {
    alert('Lỗi: ' + error.message);
  }
};

window.exportPITToPDF = function() {
  const table = document.querySelector('.salary-detail-table');
  if(!table) return;
  const qTitle = selectedPITQuarter === 'all' ? 'CẢ NĂM' : `QUÝ ${selectedPITQuarter}`;

  const container = document.createElement('div');
  container.style.padding = '20px';
  container.style.background = '#fff';
  container.innerHTML = `
    <div style="text-align:center;margin-bottom:20px;font-family:Arial,sans-serif;">
      <h2 style="margin:0;color:#1e40af;text-transform:uppercase;font-size:18px;">BỆNH VIỆN ĐA KHOA HUYỆN THAN UYÊN</h2>
      <h3 style="margin:5px 0;font-size:16px;">BẢNG KÊ THU NHẬP TÍNH THUẾ TNCN - ${qTitle}</h3>
      <hr style="border:1px solid #eee;margin:15px 0;">
    </div>
  `;

  const tableClone = table.cloneNode(true);
  tableClone.style.width = '100%';
  tableClone.style.fontSize = '10px';
  container.appendChild(tableClone);

  const opt = {
    margin: [10, 5, 10, 5],
    filename: `Thue_TNCN_${qTitle.replace(' ', '_')}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
  };
  html2pdf().set(opt).from(container).save();
};

window.showReportPreview = function(type) {
  const modal = document.getElementById('preview-modal');
  const container = document.getElementById('preview-container');
  if(!modal || !container) return;

  let title = '';
  let subTitle = '';
  let tableHTML = '';
  
  const today = new Date();
  const dateStr = `Than Uyên, ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;

  if (type === 'salary') {
    const isSummary = viewMode === 'summary';
    const periodText = isSummary ? (summaryPeriod === 'all' ? 'CẢ NĂM 2026' : `QUÝ ${summaryPeriod[1]}/2026`) : `THÁNG ${selectedMonth}`;
    title = `BẢNG ${isSummary ? 'TỔNG HỢP' : 'THANH TOÁN'} LƯƠNG NHÂN VIÊN`;
    subTitle = periodText;
    
    const emps = isSummary ? aggregateData(salaryData, getMonthsInPeriod(summaryPeriod)) : (salaryData[selectedMonth] || []).filter(isRealEmployee);
    const moneyHeaders = ['Lương chính', 'PC vượt khung', 'PC Khu vực', 'PC Chức vụ', 'PC Trách nhiệm', 'PC ưu đãi ngành', 'PC Độc hại', 'PC cấp ủy', 'Tổng lương', 'BH 10.5%', 'BH CV', 'BH VK', 'Trừ ốm LC', 'Trừ ốm VK', 'Trừ ốm CV', 'Trừ ốm TN', 'Trừ ốm ƯĐ', 'Trừ ốm ĐH', 'Thực lĩnh'];
    
    tableHTML = `
      <table class="report-table">
        <thead>
          <tr>
            <th>TT</th><th>Họ và tên</th><th>Bộ phận</th>
            ${isSummary ? '<th>Tháng</th>' : ''}
            ${moneyHeaders.map(h => `<th>${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${emps.map(e => `<tr>
            <td>${e.id||''}</td><td>${e.name}</td><td>${e.department||e.dept||''}</td>
            ${isSummary ? `<td>${e.months_count}</td>` : ''}
            ${(e.rawAmounts||[]).map(v => `<td>${fmt(v)}</td>`).join('')}
          </tr>`).join('')}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="${isSummary?4:3}">TỔNG CỘNG</td>
            ${Array(19).fill(0).map((_, i) => `<td>${fmt(emps.reduce((s, e) => s + (e.rawAmounts?.[i] || 0), 0))}</td>`).join('')}
          </tr>
        </tfoot>
      </table>
    `;
  } else if (type === 'bonus') {
    const isSummary = viewMode === 'summary';
    const periodText = isSummary ? (summaryPeriod === 'all' ? 'CẢ NĂM 2026' : `QUÝ ${summaryPeriod[1]}/2026`) : `THÁNG ${selectedMonth}`;
    title = `BẢNG TỔNG HỢP TIỀN KHEN THƯỞNG`;
    subTitle = periodText;
    
    const months = isSummary ? getMonthsInPeriod(summaryPeriod) : [selectedMonth];
    const all = {};
    months.forEach(m => {
      const data = bonusData[m] || [];
      data.forEach(e => {
        if (!all[e.name]) {
          all[e.name] = { ...e, amount: 0, months_count: 0 };
        }
        all[e.name].amount += (e.amount || 0);
        all[e.name].months_count++;
      });
    });
    const emps = Object.values(all);

    tableHTML = `
      <table class="report-table">
        <thead>
          <tr>
            <th>TT</th><th>Họ và tên</th><th>Bộ phận</th>
            ${isSummary ? '<th>Số lần</th>' : ''}
            <th>Nội dung</th>
            <th>Số tiền</th>
          </tr>
        </thead>
        <tbody>
          ${emps.map((e, idx) => `<tr>
            <td>${idx+1}</td><td>${e.name}</td><td>${e.dept||''}</td>
            ${isSummary ? `<td>${e.months_count}</td>` : ''}
            <td>${e.content||'Thưởng NĐ73'}</td>
            <td style="font-weight:700;">${fmt(e.amount)}</td>
          </tr>`).join('')}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="${isSummary?5:4}">TỔNG CỘNG</td>
            <td style="font-weight:700;">${fmt(emps.reduce((s, e) => s + (e.amount || 0), 0))}</td>
          </tr>
        </tfoot>
      </table>
    `;
  } else if (type === 'overtime') {
    const isSummary = viewMode === 'summary';
    const periodText = isSummary ? (summaryPeriod === 'all' ? 'CẢ NĂM 2026' : `QUÝ ${summaryPeriod[1]}/2026`) : `THÁNG ${selectedMonth}`;
    title = `BẢNG TỔNG HỢP THANH TOÁN TIỀN TRỰC & NGOÀI GIỜ`;
    subTitle = periodText;
    
    const months = isSummary ? getMonthsInPeriod(summaryPeriod) : [selectedMonth];
    const all = {};
    months.forEach(m => {
      const data = overtimeData[m] || [];
      data.forEach(e => {
        if (!all[e.name]) {
          all[e.name] = { ...e, amount: 0, m150: 0, m200: 0, m300: 0, months_count: 0 };
        }
        all[e.name].amount += (e.amount || 0);
        all[e.name].m150 += (e.m150d || 0) + (e.m150n || 0);
        all[e.name].m200 += (e.m200d || 0) + (e.m200n || 0);
        all[e.name].m300 += (e.m300d || 0) + (e.m300n || 0);
        all[e.name].months_count++;
      });
    });
    const emps = Object.values(all);

    tableHTML = `
      <table class="report-table">
        <thead>
          <tr>
            <th>TT</th><th>Họ và tên</th><th>Bộ phận</th>
            ${isSummary ? '<th>Số tháng</th>' : ''}
            <th>Lương</th><th>Tiền/Giờ</th>
            <th>150%</th><th>200%</th><th>300%</th>
            <th>Tổng lĩnh</th>
          </tr>
        </thead>
        <tbody>
          ${emps.map((e, idx) => `<tr>
            <td>${idx+1}</td><td>${e.name}</td><td>${e.dept||''}</td>
            ${isSummary ? `<td>${e.months_count}</td>` : ''}
            <td>${fmt(e.salary)}</td><td>${fmt(e.hourly)}</td>
            <td>${fmt(e.m150)}</td><td>${fmt(e.m200)}</td><td>${fmt(e.m300)}</td>
            <td style="font-weight:700;">${fmt(e.amount)}</td>
          </tr>`).join('')}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="${isSummary?5:4}">TỔNG CỘNG</td>
            <td>${fmt(emps.reduce((s, e) => s + (e.m150 || 0), 0))}</td>
            <td>${fmt(emps.reduce((s, e) => s + (e.m200 || 0), 0))}</td>
            <td>${fmt(emps.reduce((s, e) => s + (e.m300 || 0), 0))}</td>
            <td style="font-weight:700;">${fmt(emps.reduce((s, e) => s + (e.amount || 0), 0))}</td>
          </tr>
        </tfoot>
      </table>
    `;
  } else if (type === 'pit') {
    const qTitle = selectedPITQuarter === 'all' ? 'CẢ NĂM 2026' : `QUÝ ${selectedPITQuarter}/2026`;
    title = `BẢNG KÊ THU NHẬP TÍNH THUẾ THU NHẬP CÁ NHÂN`;
    subTitle = qTitle;
    
    const moneyHeaders = ['Lương chính', 'PC vượt khung', 'PC Khu vực', 'PC Chức vụ', 'PC Trách nhiệm', 'PC ưu đãi ngành', 'PC Độc hại', 'PC cấp ủy', 'Tổng lương', 'BH 10.5%', 'BH CV', 'BH VK', 'Trừ ốm LC', 'Trừ ốm VK', 'Trừ ốm CV', 'Trừ ốm TN', 'Trừ ốm ƯĐ', 'Trừ ốm ĐH', 'Thực lĩnh'];
    
    // Logic aggregation giống trong PITModule
    const all = {};
    Object.entries(salaryData).forEach(([month, data]) => {
      const m = parseInt(month.split('/')[0]);
      const q = m <= 3 ? '1' : (m <= 6 ? '2' : (m <= 9 ? '3' : '4'));
      if (selectedPITQuarter !== 'all' && selectedPITQuarter !== q) return;
      data.filter(isRealEmployee).forEach(e => {
        if (!all[e.name]) all[e.name] = { name: e.name, dept: e.department, months: 0, rawAmounts: Array(19).fill(0), otAmount: 0 };
        all[e.name].months++;
        if(e.rawAmounts) e.rawAmounts.forEach((v, i) => all[e.name].rawAmounts[i] += (v || 0));
        const otMonthData = overtimeData[month] || [];
        const otEntry = otMonthData.find(ot => ot.name === e.name);
        all[e.name].otAmount += otEntry ? otEntry.amount : 0;
      });
    });
    const emps = Object.values(all);

    tableHTML = `
      <table class="report-table">
        <thead>
          <tr>
            <th>Họ và tên</th><th>Bộ phận</th>
            ${moneyHeaders.slice(0, 9).map(h => `<th>${h}</th>`).join('')}
            <th>Ngoài giờ</th>
            <th>Thu nhập tính thuế</th>
          </tr>
        </thead>
        <tbody>
          ${emps.map(e => {
            const gross = e.rawAmounts[8] + e.otAmount;
            const ins = (e.rawAmounts[9]||0) + (e.rawAmounts[10]||0) + (e.rawAmounts[11]||0);
            const npt = (dependentOverrides[e.name] || 0);
            const taxable = gross - ins - (e.months * (GT_BAN_THAN + npt * GT_PHU_THUOC));
            return `<tr>
              <td>${e.name}</td><td>${e.dept}</td>
              ${e.rawAmounts.slice(0, 9).map(v => `<td>${fmt(v)}</td>`).join('')}
              <td>${fmt(e.otAmount)}</td>
              <td>${fmt(taxable > 0 ? taxable : 0)}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    `;
  }

  container.innerHTML = `
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
      <h2 style="margin:0; font-size:1.4rem;">${title}</h2>
      <h3 style="margin:0.5rem 0; font-size:1.1rem;">${subTitle}</h3>
    </div>
    <div style="overflow-x:auto;">
      ${tableHTML}
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
        <p style="font-style:italic;">${dateStr}</p>
        <p style="font-weight:700;">GIÁM ĐỐC</p>
        <p style="margin-top:4rem;">(Ký tên, đóng dấu)</p>
      </div>
    </div>
  `;
  
  
  previewData = { type, title, subTitle };
  modal.style.display = 'flex';
  lucide.createIcons();
};

window.doExport = function(format) {
  if (!previewData) return;
  const { type, title, subTitle } = previewData;
  const fileName = `${title}_${subTitle}`.replace(/[\s/]+/g, '_');
  
  if (format === 'pdf') {
    const element = document.getElementById('preview-container');
    const opt = {
      margin: [10, 5, 10, 5],
      filename: `${fileName}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    html2pdf().set(opt).from(element).save();
  } else {
    const table = document.querySelector('.report-table');
    if(!table) return;
    const wb = XLSX.utils.table_to_book(table, { sheet: "Bao Cao" });
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }
};

window.copyBonusFromPrevious = function() {
  const months = sortMonthsDesc(Object.keys(bonusData));
  const prevMonth = months.find(m => m !== selectedMonth);
  if (!prevMonth) return alert('Không tìm thấy dữ liệu tháng trước!');
  
  if (confirm(`Bạn có muốn sao chép danh sách khen thưởng từ tháng ${prevMonth} sang tháng ${selectedMonth}?`)) {
    bonusData[selectedMonth] = JSON.parse(JSON.stringify(bonusData[prevMonth]));
    saveToLocal();
    render();
    alert('Đã sao chép thành công!');
  }
};

loadData();
render();
