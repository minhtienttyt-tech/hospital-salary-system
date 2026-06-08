const fs = require('fs');
const html = fs.readFileSync('temp_sheet.html', 'utf8');

const regex = /\["([^"]+)",\d+,(\d+)\]/g;
let match;
while ((match = regex.exec(html)) !== null) {
  console.log(`Format 1 - Name: ${match[1]}, GID: ${match[2]}`);
}

const regex2 = /\{[^{}]*"name":"([^"]+)"[^{}]*"gid":"?(\d+)"?[^{}]*\}/g;
while ((match = regex2.exec(html)) !== null) {
  console.log(`Format 2 - Name: ${match[1]}, GID: ${match[2]}`);
}

// Brute force search for names
const names = ['Bảng lương', 'Tổng hợp hệ số bình quân', 'Mẫu xây dựng dự toán'];
for (const name of names) {
    const idx = html.indexOf(name);
    if (idx !== -1) {
        console.log(`Found name '${name}' at index ${idx}. Context:`);
        console.log(html.substring(Math.max(0, idx - 100), idx + 100));
    }
}
