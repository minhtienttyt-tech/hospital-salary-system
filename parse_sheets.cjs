const fs = require('fs');
const html = fs.readFileSync('temp_sheet.html', 'utf8');

// The sheet names and GIDs are usually stored in a bootstrap data array like: 
// [ "SheetName", gid ] or inside a big JSON object in the window.bootstrapData
const regex = /\["([^"]+)",\d+,(\d+)\]/g;
let match;
const sheets = new Map();

while ((match = regex.exec(html)) !== null) {
  sheets.set(match[2], match[1]);
}

if (sheets.size > 0) {
  sheets.forEach((name, gid) => console.log(`GID: ${gid} - Name: ${name}`));
} else {
  // Try another format commonly used by Google Sheets
  const regex2 = /\{"name":"([^"]+)".*?"gid":"?(\d+)"?/g;
  while ((match = regex2.exec(html)) !== null) {
    sheets.set(match[2], match[1]);
  }
  sheets.forEach((name, gid) => console.log(`GID: ${gid} - Name: ${name}`));
}
