import './style.css'

const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1Hv_suFrUYa5ZInJrYbOLkGCYwJv4A7w_YAyysgMZlAk/export?format=csv&gid=535447968';

// State của ứng dụng
let currentTab = 'dashboard';
let selectedMonth = '05/2026';
let selectedPITQuarter = 'all'; 
let salaryData = {};
let overtimeData = {};
let bonusData = {};
let nq20Data = {};
let salaryHeaders = [];
let dependentOverrides = {}; 
let isLoading = false;
let searchFilter = '';
let viewMode = 'monthly'; // 'monthly' hoặc 'summary'
let summaryPeriod = 'q1'; // 'q1', 'q2', 'q3', 'q4', 'all'
let previewData = null; // Dữ liệu cho modal xem trước
let budgetSubTab = 'salary'; // 'salary', 'coefficients', 'template'
let budgetBaseSalary = 2340000;
let budgetYear = 2026;
let budgetBaseMonth = null; 
let budgetContractEmployees = new Set();
let budgetManualInputs = {};

// Định mức giảm trừ thuế
const GT_BAN_THAN = 15500000;
const GT_PHU_THUOC = 6200000;

// Khởi tạo dữ liệu từ bộ nhớ trình duyệt
try {
  salaryData = JSON.parse(localStorage.getItem('hospital_salary_data')) || {};
  overtimeData = JSON.parse(localStorage.getItem('hospital_overtime_data')) || {};
  bonusData = JSON.parse(localStorage.getItem('hospital_bonus_data')) || {};
  nq20Data = JSON.parse(localStorage.getItem('hospital_nq20_data')) || {};
  salaryHeaders = JSON.parse(localStorage.getItem('hospital_salary_headers')) || [];
  dependentOverrides = JSON.parse(localStorage.getItem('hospital_dependent_overrides')) || {};

  // Tự động dọn dẹp các đuôi (KT), (KB) còn sót lại trong localStorage cũ
  let changed = false;
  [overtimeData, bonusData, nq20Data].forEach(obj => {
    Object.values(obj).forEach(arr => {
      if (Array.isArray(arr)) {
        arr.forEach(e => {
          if (e && e.name && /\([^)]+\)$/.test(e.name.trim())) {
            e.name = e.name.replace(/\s*\([^)]+\)\s*$/, '');
            changed = true;
          }
        });
      }
    });
  });
  if (changed) {
    localStorage.setItem('hospital_overtime_data', JSON.stringify(overtimeData));
    localStorage.setItem('hospital_bonus_data', JSON.stringify(bonusData));
    localStorage.setItem('hospital_nq20_data', JSON.stringify(nq20Data));
  }
} catch (e) {
  salaryData = {}; overtimeData = {}; bonusData = {}; nq20Data = {}; salaryHeaders = []; dependentOverrides = {};
}

function saveToLocal() {
  localStorage.setItem('hospital_salary_data', JSON.stringify(salaryData));
  localStorage.setItem('hospital_overtime_data', JSON.stringify(overtimeData));
  localStorage.setItem('hospital_bonus_data', JSON.stringify(bonusData));
  localStorage.setItem('hospital_nq20_data', JSON.stringify(nq20Data));
  localStorage.setItem('hospital_salary_headers', JSON.stringify(salaryHeaders));
  localStorage.setItem('hospital_dependent_overrides', JSON.stringify(dependentOverrides));
}

window.deleteNQ20Month = function() {
  const ms = document.getElementById('nq20-month-selector') || document.getElementById('month-selector');
  if(ms) selectedMonth = ms.value;
  if (confirm('Xóa dữ liệu đãi ngộ NQ20 tháng ' + selectedMonth + '?')) {
    nq20Data[selectedMonth] = [];
    saveToLocal();
    render();
  }
};

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

function parseCoef(val) {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const text = val.toString().trim().replace(',', '.');
  return parseFloat(text) || 0;
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
    if (row.some(c => c && (c.toString().toLowerCase().includes('tổng cộng') || c.toString().toLowerCase() === 'cộng'))) break;
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
    if (row.some(c => c && (c.toString().toLowerCase().includes('tổng cộng') || c.toString().toLowerCase() === 'cộng'))) break;
    let name = row[nameIdx]?.toString().trim();
    if (!name || name === '' || /^[IVXLCDM]+\./.test(name)) continue;
    
    // Kiểm tra hàng rác (ví dụ hàng chỉ có số thứ tự cột)
    if (name.split(' ').length < 2 && isNaN(name) === false) continue;

    // Bỏ hậu tố phòng ban trong ngoặc, vd: Lê Thị Lan (KT) -> Lê Thị Lan
    name = name.replace(/\s*\([^)]+\)\s*$/, '');

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
      <li class="nav-item ${currentTab==='nq20'?'active':''}" data-tab="nq20"><i data-lucide="award"></i><span>Chế độ NQ20</span></li>
      <li class="nav-item ${currentTab==='pit'?'active':''}" data-tab="pit"><i data-lucide="calculator"></i><span>Thuế TNCN</span></li>
      <li class="nav-item ${currentTab==='budget'?'active':''}" data-tab="budget"><i data-lucide="trending-up"></i><span>Dự toán N+1</span></li>
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
      summary[name].months_count += (row.months !== undefined ? row.months : 1);
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
  if (period === 'all_years') {
    const allMonths = [];
    for (let y = 2020; y <= 2030; y++) {
      for (let i = 1; i <= 12; i++) {
        allMonths.push(`${i.toString().padStart(2,'0')}/${y}`);
      }
    }
    return allMonths;
  }
  if (period.startsWith('y')) {
    const y = period.substring(1);
    return Array.from({length: 12}, (_, i) => `${(i+1).toString().padStart(2,'0')}/${y}`);
  }
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

function aggregatePITData(quarter) {
  const all = {};
  const allMonths = [...new Set([...Object.keys(salaryData), ...Object.keys(overtimeData), ...Object.keys(bonusData)])];

  allMonths.forEach(month => {
    const m = parseInt(month.split('/')[0]);
    if (isNaN(m)) return;
    const q = m <= 3 ? '1' : (m <= 6 ? '2' : (m <= 9 ? '3' : '4'));
    if (quarter !== 'all' && quarter !== q) return;

    const empsInMonth = {};
    const processEmp = (e) => {
      if (e && e.name && isRealEmployee(e)) {
        const cleanName = e.name.replace(/\s+/g, ' ').trim();
        if (!empsInMonth[cleanName]) empsInMonth[cleanName] = { name: cleanName, dept: e.department || e.dept || '' };
      }
    };
    (salaryData[month] || []).forEach(processEmp);
    (overtimeData[month] || []).forEach(processEmp);
    (bonusData[month] || []).forEach(processEmp);

    Object.values(empsInMonth).forEach(empInfo => {
      const name = empInfo.name;
      if (!all[name]) {
        all[name] = { 
          name: name, dept: empInfo.dept, monthsInPeriod: 0,
          rawAmounts: Array(19).fill(0),
          otAmount: 0, bonusAmount: 0,
          numDependents: (dependentOverrides[name] !== undefined) ? dependentOverrides[name] : 0,
          id: 0
        };
      }
      all[name].monthsInPeriod += 1;

      const normalize = n => (n||'').replace(/\s+/g, ' ').trim().toLowerCase();
      const nName = normalize(name);

      const salEntry = (salaryData[month] || []).find(s => normalize(s.name) === nName);
      if (salEntry && salEntry.rawAmounts) {
        if (salEntry.id) all[name].id = parseInt(salEntry.id) || all[name].id;
        salEntry.rawAmounts.forEach((val, i) => all[name].rawAmounts[i] = (all[name].rawAmounts[i] || 0) + (val || 0));
        if (dependentOverrides[name] === undefined && salEntry.numDependents) {
          all[name].numDependents = Math.max(all[name].numDependents, salEntry.numDependents);
        }
      }

      const otEntry = (overtimeData[month] || []).find(ot => normalize(ot.name) === nName);
      all[name].otAmount += otEntry ? otEntry.amount : 0;

      const bnEntry = (bonusData[month] || []).find(bn => normalize(bn.name) === nName);
      all[name].bonusAmount += bnEntry ? bnEntry.amount : 0;
    });
  });

  return Object.values(all).map(e => {
    const gross_taxable = e.rawAmounts[8] + e.otAmount + e.bonusAmount; 
    const gt_bt = e.monthsInPeriod * GT_BAN_THAN;
    const gt_npt = e.monthsInPeriod * (e.numDependents * GT_PHU_THUOC);
    const insurance = (e.rawAmounts[9] || 0) + (e.rawAmounts[10] || 0) + (e.rawAmounts[11] || 0);
    const taxable = gross_taxable - insurance - gt_bt - gt_npt;
    return { ...e, months: e.monthsInPeriod, gross_taxable, gt_bt, gt_npt, taxable, insurance };
  }).sort((a, b) => (a.id || 999999) - (b.id || 999999));
}

const PITModule = () => {
  const moneyHeaders = ['Lương chính', 'PC vượt khung', 'PC Khu vực', 'PC Chức vụ', 'PC Trách nhiệm', 'PC ưu đãi ngành', 'PC Độc hại', 'PC cấp ủy', 'Tổng cộng lương', 'Khấu trừ 10,5% BH', 'KT 10,5% BH CV', 'KT 10,5% BH VK', 'Trừ ốm LC', 'Trừ ốm VK', 'Trừ ốm CV', 'Trừ ốm TN', 'Trừ ốm ƯĐ', 'Trừ ốm ĐH', 'Tổng lĩnh'];
  const list = aggregatePITData(selectedPITQuarter);
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
          <tbody>
            ${filtered.length > 0 
              ? filtered.map((e, idx) => `<tr><td>${idx+1}</td><td>${e.name}</td><td>${fmt(e.amount)}</td></tr>`).join('') + 
                `<tr class="total-row"><td colspan="2" style="text-align:center;font-weight:bold;text-transform:uppercase;">Tổng cộng</td><td style="font-weight:bold;color:var(--primary);">${fmt(filtered.reduce((sum, e) => sum + (e.amount || 0), 0))}</td></tr>`
              : `<tr><td colspan="3" style="text-align:center;padding:3rem;color:var(--text-muted);">Chưa có dữ liệu ngoài giờ.</td></tr>`
            }
          </tbody>
        </table>
      </div>
    </div>
  </div>`;
};

const NQ20Module = () => {
  let filtered = [];
  let title = '';
  if (viewMode === 'monthly') {
    const emps = nq20Data[selectedMonth] || [];
    filtered = searchFilter ? emps.filter(e => e.name.toLowerCase().includes(searchFilter.toLowerCase())) : emps;
    title = `Danh sách Đãi ngộ NQ20 ${selectedMonth}`;
  } else {
    const months = getMonthsInPeriod(summaryPeriod);
    const agg = aggregateData(nq20Data, months);
    filtered = searchFilter ? agg.filter(e => e.name.toLowerCase().includes(searchFilter.toLowerCase())) : agg;
    let periodText = 'Quý ' + summaryPeriod[1];
    if (summaryPeriod === 'all') periodText = 'Cả năm';
    else if (summaryPeriod.startsWith('y')) periodText = 'Năm ' + summaryPeriod.substring(1);
    else if (summaryPeriod === 'all_years') periodText = 'Tất cả các năm';
    title = 'Tổng hợp Đãi ngộ NQ20 ' + periodText;
  }
  const months = sortMonthsDesc([...new Set([...Object.keys(salaryData), ...Object.keys(nq20Data)])]);
  
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
            <select class="select-input" id="nq20-month-selector">${months.length?months.map(m=>`<option value="${m}" ${selectedMonth===m?'selected':''}>${m}</option>`).join(''):`<option>${selectedMonth}</option>`}</select>
            <button class="btn btn-secondary" onclick="window.initializeNQ20FromSalary()" style="font-size:0.85rem;" title="Lọc toàn bộ Bác sĩ từ bảng lương tháng hiện tại">Khởi tạo từ Bảng lương</button>
            <button class="btn btn-secondary" onclick="window.copyNQ20FromPrevious()" style="font-size:0.85rem;">Sao chép tháng trước</button>
            <button class="btn btn-secondary" id="delete-nq20-btn" style="color:#ef4444;font-size:0.85rem;">🗑️ Xóa</button>
          ` : `
            <select class="select-input" id="nq20-period-selector">
              <option value="all_years" ${summaryPeriod==='all_years'?'selected':''}>Tất cả các năm</option>
              <option value="y2026" ${summaryPeriod==='y2026'?'selected':''}>Năm 2026</option>
              <option value="y2025" ${summaryPeriod==='y2025'?'selected':''}>Năm 2025</option>
              <option value="y2024" ${summaryPeriod==='y2024'?'selected':''}>Năm 2024</option>
              <option value="y2023" ${summaryPeriod==='y2023'?'selected':''}>Năm 2023</option>
              <option value="all" ${summaryPeriod==='all'?'selected':''}>Cả năm hiện tại</option>
              <option value="q1" ${summaryPeriod==='q1'?'selected':''}>Quý I</option>
              <option value="q2" ${summaryPeriod==='q2'?'selected':''}>Quý II</option>
              <option value="q3" ${summaryPeriod==='q3'?'selected':''}>Quý III</option>
              <option value="q4" ${summaryPeriod==='q4'?'selected':''}>Quý IV</option>
            </select>
          `}
        </div>
        <div style="display:flex;gap:0.5rem;align-items:center;">
          <button class="btn btn-secondary" onclick="window.showReportPreview('nq20')" title="Xem trước & Xuất báo cáo"><i data-lucide="printer" size="16"></i> Xem trước & Xuất</button>
          ${viewMode === 'monthly' ? `` : ''}
          <button class="btn btn-primary" id="import-nq20-btn">Import NQ20</button>
        </div>
      </div>
      <div class="table-container" style="max-height:650px;">
        <table class="salary-detail-table">
          <thead>
            <tr>
              <th>TT</th>
              <th>Họ và tên</th>
              ${viewMode === 'monthly' ? `
                <th>Đối tượng</th>
                <th>Đơn vị công tác</th>
                <th>Định mức</th>
                <th>Số tháng hưởng</th>
                <th>Thành tiền</th>
                <th>Ghi chú</th>
              ` : `
                <th>Đơn vị công tác</th>
                <th>Số tháng hưởng NQ20</th>
                <th>Tổng số tiền đãi ngộ</th>
              `}
            </tr>
          </thead>
          <tbody>
            ${filtered.length > 0 
              ? filtered.map((e, idx) => {
                  if (viewMode === 'monthly') {
                    const isSelected = (val) => {
                      if (e.categoryKey === val) return 'selected';
                      const checkLimit = e.limit || e.amount;
                      if (val === 'TS_CKII' && checkLimit === 2000000) return 'selected';
                      if (val === 'THS_CKI_BSNT' && checkLimit === 1500000) return 'selected';
                      if (val === 'BS_TYT_DBKK' && checkLimit === 1200000) return 'selected';
                      if (val === 'BS_TYT' && checkLimit === 1000000) return 'selected';
                      return '';
                    };
                    
                    const checkLimit = e.limit || e.amount;
                    const hasStandardAmount = [2000000, 1500000, 1200000, 1000000].includes(checkLimit);
                    const isCustomSelected = !hasStandardAmount && !e.categoryKey || e.categoryKey === 'CUSTOM';
                    const displayLimit = e.limit !== undefined ? e.limit : (hasStandardAmount ? checkLimit : e.amount);
                    const displayMonths = e.months !== undefined ? e.months : 1;

                    return `
                    <tr>
                      <td>${idx+1}</td>
                      <td style="font-weight:600;">${e.name}</td>
                      <td>
                        ${e.category || (e.categoryKey === 'TS_CKII' ? 'Tiến sĩ / Bác sĩ CKII (2,0M)' :
                          e.categoryKey === 'THS_CKI_BSNT' ? 'Thạc sĩ / BSCKI / BS Nội trú (1,5M)' :
                          e.categoryKey === 'BS_TYT_DBKK' ? 'Bác sĩ TYT xã ĐBKK (1,2M)' :
                          e.categoryKey === 'BS_TYT' ? 'Bác sĩ Trạm y tế / PKĐKKV (1,0M)' : 'Khác')}
                      </td>
                      <td>${e.dept||''}</td>
                      <td style="text-align:right;">${fmt(displayLimit)}</td>
                      <td style="text-align:center;">${displayMonths}</td>
                      <td class="highlight-total" style="text-align:right; font-weight:700;">
                        ${fmt(e.amount)}
                      </td>
                      <td>${e.notes||e.content||''}</td>
                    </tr>`;
                  } else {
                    const isRed = e.months_count >= 59;
                    return `
                    <tr style="${isRed ? 'color: #ef4444; background: #fee2e2;' : ''}" title="${isRed ? 'Đã hưởng từ 59 tháng trở lên' : ''}">
                      <td>${idx+1}</td>
                      <td style="font-weight:600;">${e.name}</td>
                      <td>${e.dept||''}</td>
                      <td style="text-align:center; font-weight: ${isRed ? '700' : 'normal'};">${e.months_count}</td>
                      <td class="highlight-total" style="${isRed ? 'color: #ef4444;' : ''}">${fmt(e.amount)}</td>
                    </tr>`;
                  }
                }).join('')
              : `<tr><td colspan="${viewMode === 'monthly' ? 8 : 6}" style="text-align:center;padding:3rem;color:var(--text-muted);">Chưa có dữ liệu đãi ngộ NQ20 tháng ${selectedMonth}.<br><br><div style="display:flex;gap:0.5rem;justify-content:center;"><button class="btn btn-primary" onclick="window.initializeNQ20FromSalary()">Khởi tạo từ Bảng lương</button><button class="btn btn-secondary" onclick="document.getElementById('import-nq20-btn').click()">Import ngay</button></div></td></tr>`
            }
          </tbody>
          ${filtered.length > 0 ? `
          <tfoot>
            <tr style="font-weight:700; background:var(--card-bg); border-top:2px solid var(--accent);">
              <td colspan="${viewMode === 'monthly' ? 4 : 3}" style="text-align:left; padding-left:10px;">Tổng cộng: ${filtered.length} Bác sỹ</td>
              ${viewMode === 'monthly' ? `
                <td></td>
                <td></td>
                <td style="text-align:right; font-weight:700; color:var(--primary);">${fmt(filtered.reduce((s, e) => s + (e.amount || 0), 0))}</td>
                <td></td>
                <td></td>
              ` : `
                <td style="text-align:center;">${filtered.reduce((s, e) => s + (e.months_count || 0), 0)}</td>
                <td style="text-align:right; font-weight:700; color:var(--primary);">${fmt(filtered.reduce((s, e) => s + (e.amount || 0), 0))}</td>
              `}
            </tr>
          </tfoot>
          ` : ''}
        </table>
      </div>
    </div>
  </div>`;
};

function processOvertimeCSV(text) {
  const rows = Papa.parse(text, { skipEmptyLines: true }).data;
  if (rows.length < 2) return [];

  let hIdx = rows.findIndex(r => r.some(c => c && (c.toString().toLowerCase().includes('họ và tên') || c.toString().toLowerCase().includes('họ tên') || c.toString().toLowerCase() === 'họ tên')));
  if (hIdx === -1) hIdx = 0;

  const combinedHeaders = Array(rows[hIdx].length).fill('');
  for (let i = 0; i <= hIdx; i++) {
    rows[i].forEach((cell, cellIdx) => {
      if (cell) combinedHeaders[cellIdx] += ' ' + cell.toString().toLowerCase();
    });
  }

  let nameIdx = combinedHeaders.findIndex(h => h.includes('họ và tên') || h.includes('họ tên'));
  let amtIdx = combinedHeaders.findIndex(h => h.includes('thực lĩnh') || h.includes('tổng số') || h.includes('số tiền') || h.includes('thành tiền'));
  
  if (amtIdx === -1) amtIdx = 10;
  if (nameIdx === -1) nameIdx = 1;

  const result = [];
  for (let i = hIdx + 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.some(c => c && (c.toString().toLowerCase().includes('tổng cộng') || c.toString().toLowerCase() === 'cộng' || c.toString().toLowerCase().includes('tổng số tiền')))) break;
    
    let name = row[nameIdx]?.toString().trim();
    if (!name || name === '' || /^[IVXLCDM]+\./.test(name)) continue;
    
    if (row[0] && /^[IVXLCDM]+$/.test(row[0].toString().trim())) continue;
    if (name.split(' ').length < 2 && isNaN(name) === false) continue;
    if (name.toLowerCase().includes('tổng số') || name.toLowerCase().includes('tài khoản')) continue;

    // Bỏ hậu tố phòng ban trong ngoặc, vd: Lê Thị Lan (KT) -> Lê Thị Lan
    name = name.replace(/\s*\([^)]+\)\s*$/, '');

    const amount = parseVNNumber(row[amtIdx]) || parseVNNumber(row[10]) || parseVNNumber(row[20]);
    result.push({ name: name, amount: amount });
  }
  return result;
}

function processNQ20CSV(text) {
  const rows = Papa.parse(text, { skipEmptyLines: true }).data;
  if (rows.length < 2) return [];

  let hIdx = rows.findIndex(r => r.some(c => c && (c.toString().toLowerCase().includes('họ và tên') || c.toString().toLowerCase().includes('họ tên') || c.toString().toLowerCase() === 'họ tên')));
  if (hIdx === -1) hIdx = 0;

  const combinedHeaders = Array(rows[hIdx].length).fill('');
  rows[hIdx].forEach((cell, cellIdx) => {
    if (cell) combinedHeaders[cellIdx] = cell.toString().toLowerCase().trim();
  });

  let nameIdx = combinedHeaders.findIndex(h => h.includes('họ tên') || h.includes('họ và tên') || h.includes('tên nhân viên') || h.includes('người hưởng'));
  if (nameIdx === -1) nameIdx = 1;

  let amtIdx = combinedHeaders.findIndex(h => h.includes('số tiền') || h.includes('tiền hỗ trợ') || h.includes('tiền đãi ngộ') || h.includes('tiền') || h.includes('đãi ngộ') || h.includes('tổng số') || h.includes('thực lĩnh') || h.includes('hỗ trợ') || h.includes('mức hỗ trợ') || h.includes('thành tiền'));
  if (amtIdx === -1) amtIdx = 6; // Default to 6 based on exact image structure

  const deptIdx = combinedHeaders.findIndex(h => h.includes('khoa') || h.includes('phòng') || h.includes('đơn vị') || h.includes('bộ phận') || h.includes('nơi làm việc'));
  const categoryIdx = combinedHeaders.findIndex(h => h.includes('đối tượng') || h.includes('phân loại') || h.includes('trình độ') || h.includes('nghị quyết') || h.includes('chức danh') || h.includes('loại hỗ trợ'));
  
  const limitIdx = combinedHeaders.findIndex(h => h.includes('định mức'));
  const monthsIdx = combinedHeaders.findIndex(h => h.includes('số tháng') || h.includes('thời gian'));
  const notesIdx = combinedHeaders.findIndex(h => h.includes('ghi chú') || h.includes('nội dung') || h.includes('chi tiết'));

  const result = [];
  for (let i = hIdx + 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.some(c => c && (c.toString().toLowerCase().includes('tổng cộng') || c.toString().toLowerCase() === 'cộng'))) break;
    let name = row[nameIdx]?.toString().trim();
    if (!name || name === '' || /^[IVXLCDM]+\./.test(name)) continue;
    if (name.split(' ').length < 2 && isNaN(name) === false) continue;

    // Bỏ hậu tố phòng ban trong ngoặc
    name = name.replace(/\s*\([^)]+\)\s*$/, '');

    const amount = amtIdx !== -1 ? parseVNNumber(row[amtIdx]) : 0;
    const monthsVal = monthsIdx !== -1 ? parseVNNumber(row[monthsIdx]) : 1;
    const limit = limitIdx !== -1 ? parseVNNumber(row[limitIdx]) : (monthsVal ? amount / monthsVal : amount);
    const category = categoryIdx !== -1 ? row[categoryIdx]?.toString().trim() : '';
    const dept = deptIdx !== -1 ? row[deptIdx]?.toString().trim() : '';
    const notesVal = notesIdx !== -1 ? row[notesIdx]?.toString().trim() : '';

    // Tự động phân tích đối tượng tương ứng dựa trên số tiền hoặc văn bản
    let categoryKey = 'CUSTOM';
    if (category) {
      const catLower = category.toLowerCase();
      if (amount === 2000000 || catLower.includes('ckii') || catLower.includes('ck ii') || catLower.includes('tiến sĩ') || catLower.includes('ts')) {
        categoryKey = 'TS_CKII';
      } else if (amount === 1500000 || catLower.includes('cki') || catLower.includes('ck i') || catLower.includes('thạc sĩ') || catLower.includes('ths') || catLower.includes('nội trú') || catLower.includes('bsnt')) {
        categoryKey = 'THS_CKI_BSNT';
      } else if (amount === 1200000 || catLower.includes('đbkk') || catLower.includes('đặc biệt khó khăn')) {
        categoryKey = 'BS_TYT_DBKK';
      } else if (amount === 1000000 || catLower.includes('tyt') || catLower.includes('trạm y tế') || catLower.includes('phòng khám')) {
        categoryKey = 'BS_TYT';
      }
    } else {
      // Fallback chỉ dựa trên số tiền hỗ trợ
      if (amount === 2000000) categoryKey = 'TS_CKII';
      else if (amount === 1500000) categoryKey = 'THS_CKI_BSNT';
      else if (amount === 1200000) categoryKey = 'BS_TYT_DBKK';
      else if (amount === 1000000) categoryKey = 'BS_TYT';
    }

    result.push({
      name: name,
      dept: dept,
      category: category || (categoryKey === 'CUSTOM' ? 'Tùy chỉnh' : 'Đãi ngộ NQ20'),
      categoryKey: categoryKey,
      amount: amount,
      limit: limit,
      months: monthsVal || 1,
      content: notesVal,
      notes: notesVal
    });
  }
  return result;
}

const Dashboard = () => {
  const sd = (salaryData[selectedMonth] || []).filter(isRealEmployee);
  const od = (overtimeData[selectedMonth] || []);
  const bd = (bonusData[selectedMonth] || []);
  const nd = (nq20Data[selectedMonth] || []);
  const totalSalary = sd.reduce((s, e) => s + e.total, 0);
  const totalOT = od.reduce((s, e) => s + (e.amount || 0), 0);
  const totalBonus = bd.reduce((s, e) => s + (e.amount || 0), 0);
  const totalNQ20 = nd.reduce((s, e) => s + (e.amount || 0), 0);
  const totalNet = totalSalary + totalOT + totalBonus + totalNQ20;
  return `
  <div class="fade-in">
    ${Header('Tổng quan ' + selectedMonth)}
    <div class="stats-grid">
      <div class="card stat-card"><span class="stat-label">Tổng quỹ lương thực nhận</span><span class="stat-value">${fmt(totalNet)}</span></div>
      <div class="card stat-card"><span class="stat-label">Tổng Trực & Ngoài giờ</span><span class="stat-value">${fmt(totalOT)}</span></div>
      <div class="card stat-card"><span class="stat-label">Tổng Khen thưởng</span><span class="stat-value">${fmt(totalBonus)}</span></div>
      <div class="card stat-card"><span class="stat-label">Tổng Đãi ngộ NQ20</span><span class="stat-value">${fmt(totalNQ20)}</span></div>
    </div>
  </div>`;
};

const BudgetSalaryTab = () => {
  const baseMonth = budgetBaseMonth || selectedMonth;
  const emps = (salaryData[baseMonth] || []).filter(isRealEmployee);
  
  let totals = { base:0, cv:0, kv:0, vk:0, tn:0, dh:0, ud56:0, sumPc:0, bhxh:0, bhyt:0, bhtn:0, kpcd:0, sumIns:0, totalCoef:0, thanhTien:0, chiThuong:0, tongCong:0 };
  
  const tbody = emps.map((e, idx) => {
    const base = parseCoef(e.coefficients?.base);
    const cv = parseCoef(e.coefficients?.position);
    const kv = parseCoef(e.coefficients?.area);
    const vk = parseCoef(e.coefficients?.vkhung);
    const tn = parseCoef(e.coefficients?.responsibility);
    const dh = parseCoef(e.coefficients?.toxic);
    const ud56_ratio = parseCoef(e.coefficients?.incentive);
    
    // Ưu đãi (NĐ56) = (hệ số lương ngạch bậc chức vụ + vượt khung) x hệ số ưu đãi trên bảng lương
    const ud56 = (base + cv + vk) * ud56_ratio;
    
    const ud76 = 0; const th76 = 0; const ld = 0;
    
    const sumPc = cv + kv + vk + tn + dh + ud56 + ud76 + th76 + ld;
    const baseForIns = base + cv + vk;
    const bhxh = baseForIns * 0.175;
    const bhyt = baseForIns * 0.03;
    const bhtn = baseForIns * 0.01;
    const kpcd = baseForIns * 0.02;
    const sumIns = bhxh + bhyt + bhtn + kpcd;
    const totalCoef = base + sumPc + sumIns;
    
    const thanhTien = Math.round(totalCoef * budgetBaseSalary);
    const chiThuong = Math.round(base * budgetBaseSalary * 0.1);
    const tongCong = thanhTien + chiThuong;

    totals.base += base; totals.cv += cv; totals.kv += kv; totals.vk += vk; totals.tn += tn; totals.dh += dh; totals.ud56 += ud56;
    totals.sumPc += sumPc; totals.bhxh += bhxh; totals.bhyt += bhyt; totals.bhtn += bhtn; totals.kpcd += kpcd; totals.sumIns += sumIns;
    totals.totalCoef += totalCoef; totals.thanhTien += thanhTien; totals.chiThuong += chiThuong; totals.tongCong += tongCong;

    const isContract = budgetContractEmployees.has(e.name);

    return `<tr>
      <td class="sticky-col col-tt">${idx+1}</td>
      <td class="sticky-col col-name" style="font-weight:600;">${e.name}</td>
      <td class="sticky-col col-dept">${e.department||''}</td>
      <td class="text-center"><input type="checkbox" onchange="window.toggleBudgetContract('${e.name}')" ${isContract?'checked':''}></td>
      <td class="text-center">${base.toFixed(2).replace('.',',')}</td>
      <td class="text-center">${cv?cv.toFixed(2).replace('.',','):''}</td><td class="text-center">${kv?kv.toFixed(2).replace('.',','):''}</td><td class="text-center">${vk?vk.toFixed(2).replace('.',','):''}</td>
      <td class="text-center">${tn?tn.toFixed(2).replace('.',','):''}</td><td class="text-center">${dh?dh.toFixed(2).replace('.',','):''}</td><td class="text-center">${ud56?ud56.toFixed(2).replace('.',','):''}</td>
      <td class="text-center"></td><td class="text-center"></td><td class="text-center"></td>
      <td class="text-center" style="font-weight:600;background:#f8fafc;">${sumPc?sumPc.toFixed(2).replace('.',','):''}</td>
      <td class="text-center">${bhxh.toFixed(3).replace('.',',')}</td><td class="text-center">${bhyt.toFixed(3).replace('.',',')}</td><td class="text-center">${bhtn.toFixed(3).replace('.',',')}</td><td class="text-center">${kpcd.toFixed(3).replace('.',',')}</td>
      <td class="text-center" style="font-weight:600;color:var(--danger);">${sumIns.toFixed(3).replace('.',',')}</td>
      <td class="text-center" style="font-weight:600;color:var(--primary);">${totalCoef.toFixed(3).replace('.',',')}</td>
      <td class="highlight-total">${fmt(thanhTien)}</td>
      <td style="background:rgba(234, 179, 8, 0.05); text-align:right;">${fmt(chiThuong)}</td>
      <td class="highlight-col">${fmt(tongCong)}</td>
    </tr>`;
  }).join('');

  const months = sortMonthsDesc(Object.keys(salaryData));
  const monthOptions = months.map(m => `<option value="${m}" ${m===baseMonth?'selected':''}>Tháng ${m}</option>`).join('');

  return `
    <div style="margin-bottom:1rem; display:flex; justify-content:space-between; align-items:center;">
      <div style="display:flex; align-items:center; gap:0.5rem;">
        <label style="font-weight:600;">Lấy dữ liệu từ:</label>
        <select class="select-input" onchange="window.setBudgetBaseMonth(this.value)">${monthOptions}</select>
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
        <tbody>${emps.length ? tbody : '<tr><td colspan="24" style="text-align:center;padding:2rem;">Không có dữ liệu.</td></tr>'}</tbody>
        ${emps.length ? `<tfoot>
          <tr style="font-weight:700;background:var(--card-bg);border-top:2px solid var(--accent);">
            <td colspan="4" class="sticky-col" style="text-align:center;">Tổng cộng</td>
            <td class="text-center">${totals.base.toFixed(2).replace('.',',')}</td>
            <td class="text-center">${totals.cv.toFixed(2).replace('.',',')}</td><td class="text-center">${totals.kv.toFixed(2).replace('.',',')}</td><td class="text-center">${totals.vk.toFixed(2).replace('.',',')}</td>
            <td class="text-center">${totals.tn.toFixed(2).replace('.',',')}</td><td class="text-center">${totals.dh.toFixed(2).replace('.',',')}</td><td class="text-center">${totals.ud56.toFixed(2).replace('.',',')}</td>
            <td></td><td></td><td></td>
            <td class="text-center">${totals.sumPc.toFixed(2).replace('.',',')}</td>
            <td class="text-center">${totals.bhxh.toFixed(2).replace('.',',')}</td><td class="text-center">${totals.bhyt.toFixed(2).replace('.',',')}</td><td class="text-center">${totals.bhtn.toFixed(2).replace('.',',')}</td><td class="text-center">${totals.kpcd.toFixed(2).replace('.',',')}</td>
            <td class="text-center">${totals.sumIns.toFixed(2).replace('.',',')}</td><td class="text-center">${totals.totalCoef.toFixed(2).replace('.',',')}</td>
            <td class="highlight-total">${fmt(totals.thanhTien)}</td><td style="text-align:right;">${fmt(totals.chiThuong)}</td><td class="highlight-col">${fmt(totals.tongCong)}</td>
          </tr>
        </tfoot>` : ''}
      </table>
    </div>
  `;
};

const BudgetCoefficientsTab = () => {
  const baseMonth = budgetBaseMonth || selectedMonth;
  const emps = (salaryData[baseMonth] || []).filter(isRealEmployee);
  
  let totalBase = 0, cv = 0, kv = 0, vk = 0, tn = 0, dh = 0, ud56 = 0, sumIns = 0;
  let countTotal = emps.length, countContract = 0, countOfficial = 0;

  emps.forEach(e => {
    const isContract = budgetContractEmployees.has(e.name);
    if (isContract) countContract++; else countOfficial++;
    
    const _base = parseCoef(e.coefficients?.base);
    const _cv = parseCoef(e.coefficients?.position);
    const _kv = parseCoef(e.coefficients?.area);
    const _vk = parseCoef(e.coefficients?.vkhung);
    const _tn = parseCoef(e.coefficients?.responsibility);
    const _dh = parseCoef(e.coefficients?.toxic);
    const _ud56_ratio = parseCoef(e.coefficients?.incentive);
    const _ud56 = (_base + _cv + _vk) * _ud56_ratio;
    
    const _sumIns = (_base + _cv + _vk) * 0.235;

    totalBase += _base; cv += _cv; kv += _kv; vk += _vk; tn += _tn; dh += _dh; ud56 += _ud56; sumIns += _sumIns;
  });

  const sumPc = cv + kv + vk + tn + dh + ud56;
  const totalHs = totalBase + sumPc + sumIns;

  return `
    <div style="padding: 1rem 0;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
        <h3 style="color:var(--primary); margin:0;">Tổng hợp hệ số theo bảng lương đến tháng ${baseMonth}</h3>
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
              <td><input type="number" class="select-input" style="width:80px;text-align:center;padding:4px;" placeholder="---" onchange="window.updateBudgetInput('giuong_benh', this.value)" value="${budgetManualInputs['giuong_benh']||''}"></td>
              <td><input type="number" class="select-input" style="width:80px;text-align:center;padding:4px;" placeholder="---" onchange="window.updateBudgetInput('bien_che_giao', this.value)" value="${budgetManualInputs['bien_che_giao']||''}"></td>
              <td style="font-weight:700;">${countTotal}</td>
              <td style="color:var(--danger); font-weight:600;">${countContract}</td>
              <td style="color:var(--primary); font-weight:600;">${countOfficial}</td>
              <td style="font-weight:700;color:var(--primary);">${totalHs.toFixed(3).replace('.',',')}</td>
              <td>${totalBase.toFixed(2).replace('.',',')}</td>
              <td>${cv.toFixed(2).replace('.',',')}</td>
              <td>${kv.toFixed(2).replace('.',',')}</td>
              <td>${vk.toFixed(2).replace('.',',')}</td>
              <td>${ud56.toFixed(2).replace('.',',')}</td>
              <td>${tn.toFixed(2).replace('.',',')}</td>
              <td>${dh.toFixed(2).replace('.',',')}</td>
              <td>${sumIns.toFixed(3).replace('.',',')}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
};

const BudgetTemplateTab = () => {
  const baseMonth = budgetBaseMonth || selectedMonth;
  const emps = (salaryData[baseMonth] || []).filter(isRealEmployee);
  
  let totalBase = 0, cv = 0, kv = 0, vk = 0, sumIns = 0;
  let countTotal = emps.length, countContract = 0, countOfficial = 0;

  emps.forEach(e => {
    const isContract = budgetContractEmployees.has(e.name);
    if (isContract) countContract++; else countOfficial++;
    
    const _base = parseCoef(e.coefficients?.base);
    const _cv = parseCoef(e.coefficients?.position);
    const _kv = parseCoef(e.coefficients?.area);
    const _vk = parseCoef(e.coefficients?.vkhung);
    const _sumIns = (_base + _cv + _vk) * 0.235;
    totalBase += _base; cv += _cv; kv += _kv; vk += _vk; sumIns += _sumIns;
  });
  
  let salaryCost = 0, bonusCost = 0;
  emps.forEach(e => {
    const base = parseCoef(e.coefficients?.base);
    const _cv = parseCoef(e.coefficients?.position);
    const _vk = parseCoef(e.coefficients?.vkhung);
    const _ud56_ratio = parseCoef(e.coefficients?.incentive);
    const _ud56 = (base + _cv + _vk) * _ud56_ratio;
    
    const sumPc = _cv + parseCoef(e.coefficients?.area) + _vk + parseCoef(e.coefficients?.responsibility) + parseCoef(e.coefficients?.toxic) + _ud56;
    const _sumIns = (base + _cv + _vk) * 0.235;
    salaryCost += Math.round((base + sumPc + _sumIns) * budgetBaseSalary * 12);
    bonusCost += Math.round((base * budgetBaseSalary * 0.1) * 12);
  });
  
  const getIn = (key) => budgetManualInputs[key] || '';
  
  const renderRow = (stt, title, id, isHeader = false, calculatedSuggest = null) => {
    if (isHeader) {
      return `<tr style="background:rgba(14, 165, 233, 0.1); font-weight:700;">
        <td style="text-align:center;">${stt}</td><td>${title}</td>
        <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
      </tr>`;
    }
    
    const inpt = (k) => `<input type="${k==='ghi_chu'?'text':'number'}" class="select-input" style="width:100%;text-align:${k==='ghi_chu'?'left':'right'};border:none;border-radius:0;background:transparent;padding:4px;" placeholder="---" onchange="window.updateBudgetInput('${id}_${k}', this.value)" value="${getIn(`${id}_${k}`)}">`;
    
    const suggestHtml = calculatedSuggest !== null 
      ? `<td style="text-align:right;font-weight:600;color:var(--primary);vertical-align:middle;padding:4px;">${fmt(calculatedSuggest)}</td>`
      : `<td style="padding:0;">${inpt('denghi')}</td>`;

    return `<tr>
      <td style="text-align:center;font-weight:600;">${stt}</td>
      <td style="${stt?'font-weight:600;':''} ${stt==='+'||stt==='-'?'padding-left:1.5rem;':''}">${title}</td>
      <td style="padding:0;">${inpt('giao')}</td>
      <td style="padding:0;">${inpt('th_6t')}</td>
      <td style="padding:0;">${inpt('uoc')}</td>
      ${suggestHtml}
      <td style="padding:0;">${inpt('thamdinh')}</td>
      <td style="padding:0;">${inpt('chenhlech')}</td>
      <td style="padding:0;">${inpt('ghi_chu')}</td>
    </tr>`;
  };

  return `
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
            ${renderRow('I', 'Thu ngân sách', 'thu_ns', true)}
            ${renderRow('1', 'Tổng thu', 'tong_thu')}
            ${renderRow('-', 'Thu phí, lệ phí', 'thu_phi')}
            ${renderRow('-', 'Thu viện phí trực tiếp', 'thu_vp')}
            ${renderRow('-', 'Thu KCB bảo hiểm y tế', 'thu_bhyt')}
            ${renderRow('-', 'Thu dịch vụ', 'thu_dv')}
            ${renderRow('-', 'Thu khác', 'thu_khac')}
            
            ${renderRow('2', 'Chi từ nguồn thu sự nghiệp', 'chi_ns', true)}
            ${renderRow('', 'Trong đó', 'trong_do')}
            ${renderRow('-', 'Nộp ngân sách nhà nước', 'nop_nsnn')}
            ${renderRow('-', 'Lương, phụ cấp và các khoản đóng góp theo lương', 'luong_pc', false, salaryCost)}
            ${renderRow('-', 'Hợp đồng theo NĐ111', 'hd_111')}
            ${renderRow('-', 'Hợp đồng chuyên môn theo NĐ111', 'hd_cm_111')}
            ${renderRow('-', 'Chi phí trực tiếp (chi tiết theo nội dung)', 'chi_truc_tiep')}
            ${renderRow('+', 'Phụ cấp trực', 'pc_truc')}
            ${renderRow('+', 'TT tiền thủ thuật - phẫu thuật', 'tt_pttt')}
            ${renderRow('+', 'Tiền ăn', 'tien_an')}
            ${renderRow('+', 'Thanh toán tiền điện', 'tien_dien')}
            ${renderRow('+', 'Thanh toán tiền nước', 'tien_nuoc')}
            ${renderRow('+', 'Thanh toán tiền nhiên liệu', 'tien_nhien_lieu')}
            ${renderRow('+', 'Văn phòng phẩm', 'vpp')}
            ${renderRow('+', 'Công cụ, dụng cụ VP', 'cc_dc_vp')}
            ${renderRow('+', 'Vật tư VPP khác', 'vpp_khac')}
            ${renderRow('+', 'Chi thuê mướng khác (Vệ sinh công nghiệp)', 'thue_muong')}
            ${renderRow('+', 'Sửa chữa ô tô', 'sc_oto')}
            ${renderRow('+', 'Sửa chữa trang TBKT chuyên dụng', 'sc_tbkt')}
            
            ${renderRow('II', 'Chi ngân sách Nhà nước', 'chi_nsnn', true)}
            ${renderRow('A', 'Chỉ tiêu', 'chi_tieu', true)}
            ${renderRow('1', 'Tổng biên chế / Hợp đồng (người)', 'tong_bc', false, countTotal)}
            ${renderRow('2', 'Hệ số bình quân', 'hs_bq', false, countTotal ? ((totalBase+cv+kv+vk+sumIns)/countTotal).toFixed(2).replace('.',',') : 0)}
            
            ${renderRow('B', 'Kinh phí', 'kinh_phi', true)}
            ${renderRow('1', 'Kinh phí nhiệm vụ thường xuyên', 'kp_tx')}
            ${renderRow('-', 'Tiền lương (Biên chế + HĐ) x 12 tháng', 'tien_luong_tx', false, salaryCost)}
            ${renderRow('-', 'KP chi thưởng NĐ73 (10%)', 'tien_thuong_tx', false, bonusCost)}
            ${renderRow('-', 'KP chi hoạt động thường xuyên', 'kp_hd_tx')}
            
            ${renderRow('2', 'Các nhiệm vụ chi ngoài định mức', 'kp_ngoai_dm')}
            ${renderRow('-', 'Thuê phần mềm (EHIS, Bệnh án ĐT)', 'thue_pm')}
            ${renderRow('-', 'Bảo hiểm cháy nổ / PCCC', 'bh_pccc')}
            ${renderRow('-', 'Thuê vệ sinh công nghiệp / Xử lý rác', 've_sinh')}
            ${renderRow('-', 'Sửa chữa / Mua sắm máy móc thiết bị', 'mua_sam')}
          </tbody>
        </table>
      </div>
    </div>
  `;
};

const BudgetPlanningModule = () => {
  const navHTML = `
    <div class="segmented-control" style="margin-bottom: 0;">
      <button class="control-btn ${budgetSubTab==='salary'?'active':''}" onclick="window.setBudgetTab('salary')">Bảng lương dự toán</button>
      <button class="control-btn ${budgetSubTab==='coefficients'?'active':''}" onclick="window.setBudgetTab('coefficients')">Tổng hợp hệ số</button>
      <button class="control-btn ${budgetSubTab==='template'?'active':''}" onclick="window.setBudgetTab('template')">Mẫu xây dựng dự toán</button>
    </div>
  `;

  let content = '';
  if (budgetSubTab === 'salary') content = BudgetSalaryTab();
  else if (budgetSubTab === 'coefficients') content = BudgetCoefficientsTab();
  else if (budgetSubTab === 'template') content = BudgetTemplateTab();

  return `
  <div class="fade-in">
    ${Header('Dự toán năm ' + budgetYear)}
    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
        ${navHTML}
        <div style="display:flex; gap:1rem; align-items:center;">
          <label style="font-size:0.85rem;font-weight:600;">Lương cơ sở:</label>
          <input type="number" id="budget-base-salary" value="${budgetBaseSalary}" class="select-input" style="width:120px;" onchange="window.updateBudgetBaseSalary(event)">
        </div>
      </div>
      ${content}
    </div>
  </div>`;
};

function autoInitializeAllNQ20() {
  let changed = false;
  Object.keys(salaryData).forEach(month => {
    if (!nq20Data[month] && salaryData[month] && salaryData[month].length > 0) {
      const emps = salaryData[month];
      const doctors = emps.filter(isRealEmployee).filter(e => {
        const pos = (e.position || '').toLowerCase();
        const dept = (e.department || e.dept || '').toLowerCase();
        return pos.includes('bác sĩ') || pos.includes('bác sỹ') || pos.includes('bs') ||
               dept.includes('khám bệnh') || dept.includes('lâm sàng') ||
               pos.includes('đông y') || pos.includes('chuyên khoa');
      });
      const newList = [];
      doctors.forEach(doc => {
        let categoryKey = 'CUSTOM';
        let limit = 0;
        const pos = (doc.position || '').toLowerCase();
        if (pos.includes('ckii') || pos.includes('ck ii') || pos.includes('tiến sĩ') || pos.includes('ts')) {
          categoryKey = 'TS_CKII'; limit = 2000000;
        } else if (pos.includes('cki') || pos.includes('ck i') || pos.includes('thạc sĩ') || pos.includes('ths') || pos.includes('nội trú') || pos.includes('bsnt')) {
          categoryKey = 'THS_CKI_BSNT'; limit = 1500000;
        } else if ((doc.department || doc.dept || '').toLowerCase().includes('trạm y tế') || (doc.department || doc.dept || '').toLowerCase().includes('tyt')) {
          categoryKey = 'BS_TYT'; limit = 1000000;
        } else {
          categoryKey = 'THS_CKI_BSNT'; limit = 1500000;
        }
        newList.push({
          name: doc.name,
          dept: doc.department || doc.dept || '',
          categoryKey,
          category: categoryKey === 'TS_CKII' ? 'Tiến sĩ / Bác sĩ CKII' :
                    categoryKey === 'THS_CKI_BSNT' ? 'Thạc sĩ / BSCKI / BS Nội trú' :
                    categoryKey === 'BS_TYT_DBKK' ? 'Bác sĩ TYT xã ĐBKK' : 'Bác sĩ TYT',
          limit: limit,
          months: 1,
          amount: limit,
          content: '',
          notes: ''
        });
      });
      nq20Data[month] = newList;
      changed = true;
    }
  });
  if (changed) saveToLocal();
}

const render = () => {
  const app = document.getElementById('app');
  if(!app) return;
  
  try {
    autoInitializeAllNQ20();
    let content = '';
    switch(currentTab) {
      case 'salary': content = SalaryTable(); break;
      case 'pit': content = PITModule(); break;
      case 'overtime': content = OvertimeModule(); break;
      case 'bonus': content = BonusModule(); break;
      case 'nq20': content = NQ20Module(); break;
      case 'budget': content = BudgetPlanningModule(); break;
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
    const ms = document.getElementById('month-selector') || document.getElementById('ot-month-selector') || document.getElementById('bn-month-selector') || document.getElementById('nq20-month-selector');
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
        } else if (type === 'nq20') {
          const parsed = processNQ20CSV(text);
          if(!parsed.length) throw new Error('Dữ liệu không hợp lệ');
          nq20Data[m] = parsed;
          localStorage.setItem('last_nq20_url', u);
          localStorage.setItem('last_nq20_gid', g);
        } else {
          const parsed = processOvertimeCSV(text);
          if(!parsed.length) throw new Error('Dữ liệu không hợp lệ');
          overtimeData[m] = parsed; 
        }
        selectedMonth = m;
        saveToLocal(); im.style.display = 'none'; render();
      } catch (e) { alert('Lỗi: ' + e.message); } finally { cfm.textContent = 'Bắt đầu Import'; cfm.disabled = false; }
    };

    const otib = document.getElementById('import-ot-btn'), bnib = document.getElementById('import-bonus-btn'), nq20ib = document.getElementById('import-nq20-btn');
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
    if(nq20ib) nq20ib.onclick = () => {
      document.getElementById('import-title').textContent = 'Import NQ20';
      document.getElementById('import-url').value = localStorage.getItem('last_nq20_url') || 'https://docs.google.com/spreadsheets/d/1Imhhn8uEhS2_Wn_3TbQlohsrEUUai_EK6JVJfNUDboQ/edit';
      document.getElementById('import-gid').value = localStorage.getItem('last_nq20_gid') || '';
      cfm.setAttribute('data-type', 'nq20'); im.style.display = 'flex';
    };

    const sps = document.getElementById('summary-period-selector'), ops = document.getElementById('ot-period-selector'), bps = document.getElementById('bn-period-selector'), nps = document.getElementById('nq20-period-selector');
    if(sps) sps.onchange = (e) => { summaryPeriod = e.target.value; selectedPITQuarter = e.target.value.replace('q', ''); render(); };
    if(ops) ops.onchange = (e) => { summaryPeriod = e.target.value; selectedPITQuarter = e.target.value.replace('q', ''); render(); };
    if(bps) bps.onchange = (e) => { summaryPeriod = e.target.value; selectedPITQuarter = e.target.value.replace('q', ''); render(); };
    if(nps) nps.onchange = (e) => { summaryPeriod = e.target.value; selectedPITQuarter = e.target.value.replace('q', ''); render(); };

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
      else if (btn.id === 'delete-nq20-btn') { e.preventDefault(); window.deleteNQ20Month(); }
    };
  } catch (err) {
    app.innerHTML = `<div style="padding:3rem;text-align:center;"><h2>Sự cố hiển thị</h2><button class="btn btn-primary" onclick="window.emergencyReset()">Khôi phục hệ thống</button><pre style="text-align:left;margin-top:2rem;">${err.stack}</pre></div>`;
  }
};

window.setViewMode = (mode) => { 
  viewMode = mode; 
  render(); 
};

window.initializeNQ20FromSalary = function() {
  const emps = (salaryData[selectedMonth] || []).filter(isRealEmployee);
  if (!emps.length) return alert('Không tìm thấy dữ liệu bảng lương tháng ' + selectedMonth + ' để khởi tạo!');
  
  if (confirm('Khởi tạo danh sách NQ20 bằng cách lọc các Bác sĩ từ bảng lương tháng ' + selectedMonth + '?')) {
    const doctors = emps.filter(e => {
      const pos = (e.position || '').toLowerCase();
      const dept = (e.department || e.dept || '').toLowerCase();
      return pos.includes('bác sĩ') || pos.includes('bác sỹ') || pos.includes('bs') ||
             dept.includes('khám bệnh') || dept.includes('lâm sàng') ||
             pos.includes('đông y') || pos.includes('chuyên khoa');
    });

    const currentList = nq20Data[selectedMonth] || [];
    const newList = [...currentList];

    doctors.forEach(doc => {
      if (!newList.some(n => n.name === doc.name)) {
        let categoryKey = 'CUSTOM';
        let limit = 0;
        const pos = doc.position.toLowerCase();
        if (pos.includes('ckii') || pos.includes('ck ii') || pos.includes('tiến sĩ') || pos.includes('ts')) {
          categoryKey = 'TS_CKII'; limit = 2000000;
        } else if (pos.includes('cki') || pos.includes('ck i') || pos.includes('thạc sĩ') || pos.includes('ths') || pos.includes('nội trú') || pos.includes('bsnt')) {
          categoryKey = 'THS_CKI_BSNT'; limit = 1500000;
        } else if (doc.department.toLowerCase().includes('trạm y tế') || doc.department.toLowerCase().includes('tyt')) {
          categoryKey = 'BS_TYT'; limit = 1000000;
        } else {
          categoryKey = 'THS_CKI_BSNT'; limit = 1500000;
        }

        newList.push({
          name: doc.name,
          dept: doc.department || '',
          categoryKey: categoryKey,
          category: categoryKey === 'TS_CKII' ? 'Tiến sĩ / Bác sĩ CKII' :
                    categoryKey === 'THS_CKI_BSNT' ? 'Thạc sĩ / BSCKI / BS Nội trú' :
                    categoryKey === 'BS_TYT_DBKK' ? 'Bác sĩ TYT xã ĐBKK' : 'Bác sĩ TYT',
          limit: limit,
          months: 1,
          amount: limit,
          content: '',
          notes: ''
        });
      }
    });

    if (newList.length === 0) {
      if (confirm('Không tự động nhận diện được bác sĩ nào qua chức vụ. Thêm tất cả nhân viên để tự phân loại?')) {
        emps.forEach(doc => {
          newList.push({
            name: doc.name,
            dept: doc.department || '',
            categoryKey: 'CUSTOM',
            category: 'Tùy chỉnh',
            limit: 0,
            months: 1,
            amount: 0,
            content: '',
            notes: ''
          });
        });
      }
    }

    nq20Data[selectedMonth] = newList;
    saveToLocal();
    render();
  }
};

window.copyNQ20FromPrevious = function() {
  const months = sortMonthsDesc(Object.keys(nq20Data));
  const prevMonth = months.find(m => m !== selectedMonth);
  if (!prevMonth) return alert('Không tìm thấy dữ liệu NQ20 tháng trước!');
  
  if (confirm(`Sao chép danh sách đãi ngộ NQ20 từ tháng ${prevMonth} sang tháng ${selectedMonth}?`)) {
    nq20Data[selectedMonth] = JSON.parse(JSON.stringify(nq20Data[prevMonth]));
    saveToLocal();
    render();
    alert('Sao chép thành công!');
  }
};

window.addNewNQ20Doctor = function() {
  const name = prompt('Nhập họ và tên bác sĩ:');
  if (!name || name.trim() === '') return;
  const dept = prompt('Nhập khoa/phòng/bộ phận:');
  
  const currentList = nq20Data[selectedMonth] || [];
  if (currentList.some(e => e.name.toLowerCase() === name.trim().toLowerCase())) {
    return alert('Bác sĩ này đã có trong danh sách!');
  }
  
  currentList.push({
    name: name.trim(),
    dept: (dept || '').trim(),
    categoryKey: 'THS_CKI_BSNT',
    category: 'Thạc sĩ / BSCKI / BS Nội trú',
    limit: 1500000,
    months: 1,
    amount: 1500000,
    content: '',
    notes: ''
  });
  
  nq20Data[selectedMonth] = currentList;
  saveToLocal();
  render();
};

window.removeNQ20Employee = function(name) {
  if (confirm(`Xóa bác sĩ ${name} khỏi danh sách NQ20 tháng ${selectedMonth}?`)) {
    const currentList = nq20Data[selectedMonth] || [];
    nq20Data[selectedMonth] = currentList.filter(e => e.name !== name);
    saveToLocal();
    render();
  }
};

window.updateNQ20Dept = function(name, val) {
  const currentList = nq20Data[selectedMonth] || [];
  const emp = currentList.find(e => e.name === name);
  if (emp) {
    emp.dept = val;
    saveToLocal();
  }
};

window.updateNQ20Category = function(name, categoryKey) {
  const currentList = nq20Data[selectedMonth] || [];
  const emp = currentList.find(e => e.name === name);
  if (emp) {
    emp.categoryKey = categoryKey;
    if (categoryKey === 'TS_CKII') emp.limit = 2000000;
    else if (categoryKey === 'THS_CKI_BSNT') emp.limit = 1500000;
    else if (categoryKey === 'BS_TYT_DBKK') emp.limit = 1200000;
    else if (categoryKey === 'BS_TYT') emp.limit = 1000000;
    
    emp.amount = Math.round((emp.limit || 0) * (emp.months || 1));
    saveToLocal();
    render();
  }
};

window.updateNQ20Limit = function(name, val) {
  const currentList = nq20Data[selectedMonth] || [];
  const emp = currentList.find(e => e.name === name);
  if (emp) {
    emp.limit = parseVNNumber(val);
    emp.amount = Math.round((emp.limit || 0) * (emp.months || 1));
    saveToLocal();
    render();
  }
};

window.updateNQ20Months = function(name, val) {
  const currentList = nq20Data[selectedMonth] || [];
  const emp = currentList.find(e => e.name === name);
  if (emp) {
    const textVal = String(val).replace(',', '.');
    emp.months = parseFloat(textVal) || 0;
    emp.amount = Math.round((emp.limit || 0) * emp.months);
    saveToLocal();
    render();
  }
};

window.updateNQ20Notes = function(name, val) {
  const currentList = nq20Data[selectedMonth] || [];
  const emp = currentList.find(e => e.name === name);
  if (emp) {
    emp.content = val;
    emp.notes = val;
    saveToLocal();
  }
};

window.updateNQ20Amount = function(name, val) {
  const currentList = nq20Data[selectedMonth] || [];
  const emp = currentList.find(e => e.name === name);
  if (emp) {
    emp.amount = parseVNNumber(val);
    saveToLocal();
    render();
  }
};

window.setBudgetTab = (tab) => { 
  budgetSubTab = tab; 
  render(); 
};

window.updateBudgetBaseSalary = (e) => { 
  budgetBaseSalary = parseInt(e.target.value) || 2340000; 
  render(); 
};

window.setBudgetBaseMonth = (m) => {
  budgetBaseMonth = m;
  render();
};

window.toggleBudgetContract = (name) => {
  if (budgetContractEmployees.has(name)) budgetContractEmployees.delete(name);
  else budgetContractEmployees.add(name);
  render();
};

window.updateBudgetInput = (key, value) => {
  if (key.includes('ghi_chu') || key.includes('text')) {
    budgetManualInputs[key] = value;
  } else {
    budgetManualInputs[key] = parseFloat(value) || 0;
  }
};

window.exportBudgetToExcel = function(type) {
  if (type === 'salary') {
    const table = document.querySelector('.salary-detail-table');
    if (!table) return alert('Không tìm thấy bảng!');
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.table_to_sheet(table, { raw: true });
    
    // Convert string numbers with comma to numbers or format as text so they don't break
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = {c:C, r:R};
        const cellRef = XLSX.utils.encode_cell(cellAddress);
        const cell = ws[cellRef];
        if(!cell) continue;
        
        // Remove checkbox text
        if(C === 3 && R > 1) { cell.v = budgetContractEmployees.has(ws[XLSX.utils.encode_cell({c:1, r:R})]?.v) ? 'x' : ''; }
      }
    }
    
    XLSX.utils.book_append_sheet(wb, ws, "DuToan_BangLuong");
    XLSX.writeFile(wb, `Bang_Luong_Du_Toan_${budgetYear}.xlsx`);
  }
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

window.exportNQ20ToExcel = function() {
  try {
    const isSummary = viewMode === 'summary';
    if (!isSummary) {
      const emps = nq20Data[selectedMonth] || [];
      const data = emps.map((e, i) => {
        const checkLimit = e.limit || e.amount;
        const displayLimit = e.limit !== undefined ? e.limit : checkLimit;
        const displayMonths = e.months !== undefined ? e.months : 1;
        return {
          'TT': i + 1,
          'Họ và tên': e.name,
          'Đối tượng': e.category || e.categoryKey || 'Đãi ngộ NQ20',
          'Đơn vị công tác': e.dept || '',
          'Định mức': displayLimit,
          'Số tháng hưởng': displayMonths,
          'Thành tiền': e.amount,
          'Ghi chú': e.notes || e.content || ''
        };
      });
      if (!data.length) return alert('Không có dữ liệu!');
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "NQ20_Thang");
      XLSX.writeFile(wb, `Dai_Ngo_NQ20_${selectedMonth.replace('/','-')}.xlsx`);
    } else {
      const months = getMonthsInPeriod(summaryPeriod);
      const all = {};
      months.forEach(m => {
        const data = nq20Data[m] || [];
        data.forEach(e => {
          if (!all[e.name]) {
            all[e.name] = { ...e, amount: 0, months_count: 0 };
          }
          all[e.name].amount += (e.amount || 0);
          all[e.name].months_count += (e.months !== undefined ? e.months : 1);
        });
      });
      const data = Object.values(all).map((e, i) => ({
        'TT': i + 1,
        'Họ và tên': e.name,
        'Đối tượng': e.category || e.categoryKey || 'Đãi ngộ NQ20',
        'Đơn vị công tác': e.dept || '',
        'Số tháng hưởng': e.months_count,
        'Tổng cộng': e.amount,
        'Ghi chú': e.notes || e.content || ''
      }));
      if (!data.length) return alert('Không có dữ liệu!');
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "NQ20_TongHop");
      XLSX.writeFile(wb, `Dai_Ngo_NQ20_TongHop_${summaryPeriod}.xlsx`);
    }
  } catch (e) { alert('Lỗi: ' + e.message); }
};

window.exportPITToExcel = function() {
  try {
    const qTitle = selectedPITQuarter === 'all' ? 'Cả năm' : `Quý ${selectedPITQuarter}`;
    const moneyHeaders = ['Lương chính', 'PC vượt khung', 'PC Khu vực', 'PC Chức vụ', 'PC Trách nhiệm', 'PC ưu đãi ngành', 'PC Độc hại', 'PC cấp ủy', 'Tổng cộng lương', 'Khấu trừ 10,5% BH', 'KT 10,5% BH CV', 'KT 10,5% BH VK', 'Trừ ốm LC', 'Trừ ốm VK', 'Trừ ốm CV', 'Trừ ốm TN', 'Trừ ốm ƯĐ', 'Trừ ốm ĐH', 'Tổng lĩnh'];

    const all = aggregatePITData(selectedPITQuarter);
    const data = all.map(e => {
      const row = {
        'Họ và tên': e.name,
        'Khoa/Phòng': e.dept,
        'Số tháng': e.months
      };
      moneyHeaders.forEach((h, i) => row[h] = e.rawAmounts[i]);
      row['Ngoài giờ'] = e.otAmount;
      row['Khen thưởng'] = e.bonusAmount;
      row['THU NHẬP TÍNH THUẾ'] = e.taxable > 0 ? e.taxable : 0;
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
  } else if (type === 'nq20') {
    const isSummary = viewMode === 'summary';
    const periodText = isSummary ? (summaryPeriod === 'all' ? 'CẢ NĂM 2026' : `QUÝ ${summaryPeriod[1]}/2026`) : `THÁNG ${selectedMonth}`;
    title = `BẢNG TỔNG HỢP CHI TRẢ ĐÃI NGỘ NQ20`;
    subTitle = periodText;
    
    let tableHeadersHTML = '';
    let tableRowsHTML = '';
    let tableFootHTML = '';

    if (!isSummary) {
      const emps = nq20Data[selectedMonth] || [];
      tableHeadersHTML = `<tr><th>TT</th><th>Họ và tên</th><th>Đối tượng</th><th>Đơn vị công tác</th><th>Định mức</th><th>Số tháng</th><th>Thành tiền</th><th>Ghi chú</th></tr>`;
      tableRowsHTML = emps.map((e, idx) => {
        const checkLimit = e.limit || e.amount;
        const displayLimit = e.limit !== undefined ? e.limit : checkLimit;
        const displayMonths = e.months !== undefined ? e.months : 1;
        return `<tr>
          <td>${idx+1}</td>
          <td>${e.name}</td>
          <td>${e.category || e.categoryKey || 'Đãi ngộ NQ20'}</td>
          <td>${e.dept||''}</td>
          <td>${fmt(displayLimit)}</td>
          <td>${displayMonths}</td>
          <td style="font-weight:700;">${fmt(e.amount)}</td>
          <td>${e.notes || e.content || ''}</td>
        </tr>`;
      }).join('');
      tableFootHTML = `<tr>
        <td colspan="4">TỔNG CỘNG: ${emps.length} Bác sỹ</td>
        <td></td>
        <td></td>
        <td style="font-weight:700;">${fmt(emps.reduce((s, e) => s + (e.amount || 0), 0))}</td>
        <td></td>
      </tr>`;
    } else {
      const months = getMonthsInPeriod(summaryPeriod);
      const all = {};
      months.forEach(m => {
        const data = nq20Data[m] || [];
        data.forEach(e => {
          if (!all[e.name]) {
            all[e.name] = { ...e, amount: 0, months_count: 0 };
          }
          all[e.name].amount += (e.amount || 0);
          all[e.name].months_count += (e.months !== undefined ? e.months : 1);
        });
      });
      const emps = Object.values(all);
      tableHeadersHTML = `<tr><th>TT</th><th>Họ và tên</th><th>Đối tượng</th><th>Đơn vị công tác</th><th>Số tháng hưởng</th><th>Tổng tiền hỗ trợ</th><th>Ghi chú</th></tr>`;
      tableRowsHTML = emps.map((e, idx) => `<tr>
        <td>${idx+1}</td>
        <td>${e.name}</td>
        <td>${e.category || e.categoryKey || 'Đãi ngộ NQ20'}</td>
        <td>${e.dept||''}</td>
        <td style="text-align:center;">${e.months_count}</td>
        <td style="font-weight:700;">${fmt(e.amount)}</td>
        <td>${e.notes || e.content || ''}</td>
      </tr>`).join('');
      tableFootHTML = `<tr>
        <td colspan="4">TỔNG CỘNG: ${emps.length} Bác sỹ</td>
        <td style="text-align:center;">${emps.reduce((s, e) => s + (e.months_count || 0), 0)}</td>
        <td style="font-weight:700;">${fmt(emps.reduce((s, e) => s + (e.amount || 0), 0))}</td>
        <td></td>
      </tr>`;
    }

    tableHTML = `
      <table class="report-table">
        <thead>
          ${tableHeadersHTML}
        </thead>
        <tbody>
          ${tableRowsHTML}
        </tbody>
        <tfoot>
          ${tableFootHTML}
        </tfoot>
      </table>
    `;
  } else if (type === 'pit') {
    const qTitle = selectedPITQuarter === 'all' ? 'CẢ NĂM 2026' : `QUÝ ${selectedPITQuarter}/2026`;
    title = `BẢNG KÊ THU NHẬP TÍNH THUẾ THU NHẬP CÁ NHÂN`;
    subTitle = qTitle;
    
    const moneyHeaders = ['Lương chính', 'PC vượt khung', 'PC Khu vực', 'PC Chức vụ', 'PC Trách nhiệm', 'PC ưu đãi ngành', 'PC Độc hại', 'PC cấp ủy', 'Tổng lương', 'BH 10.5%', 'BH CV', 'BH VK', 'Trừ ốm LC', 'Trừ ốm VK', 'Trừ ốm CV', 'Trừ ốm TN', 'Trừ ốm ƯĐ', 'Trừ ốm ĐH', 'Thực lĩnh'];
    
    const emps = aggregatePITData(selectedPITQuarter);

    tableHTML = `
      <table class="report-table">
        <thead>
          <tr>
            <th>Họ và tên</th><th>Bộ phận</th>
            ${moneyHeaders.slice(0, 9).map(h => `<th>${h}</th>`).join('')}
            <th>Ngoài giờ</th>
            <th>Thưởng</th>
            <th>Thu nhập tính thuế</th>
          </tr>
        </thead>
        <tbody>
          ${emps.map(e => {
            return `<tr>
              <td>${e.name}</td><td>${e.dept}</td>
              ${e.rawAmounts.slice(0, 9).map(v => `<td>${fmt(v)}</td>`).join('')}
              <td>${fmt(e.otAmount)}</td>
              <td>${fmt(e.bonusAmount)}</td>
              <td>${fmt(e.taxable > 0 ? e.taxable : 0)}</td>
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
