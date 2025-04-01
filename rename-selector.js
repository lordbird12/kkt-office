const fs = require('fs');
const path = require('path');

const baseDir = './src/app'; // เปลี่ยนเป็นโฟลเดอร์หลักของโปรเจ็กต์

function updateSelectorInFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');

    // ดึง path ของไฟล์และหาโฟลเดอร์ก่อนหน้า `edit-dialog`
    const folderPath = path.dirname(filePath);
    const parentFolder = path.basename(path.dirname(folderPath)); // ดึงชื่อโฟลเดอร์ก่อนหน้า `edit-dialog`

    const newSelector = `selector: 'form-product-${parentFolder}'`;
    const updatedContent = content.replace(/selector: 'form-product'/g, newSelector);

    if (content !== updatedContent) {
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(`✅ Updated: ${filePath} -> ${newSelector}`);
    }
}

function findEditDialogFiles(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);

        if (fs.statSync(fullPath).isDirectory()) {
            findEditDialogFiles(fullPath); // Recursively search subfolders
        } else if (file === 'form.component.ts') {
            updateSelectorInFile(fullPath);
        }
    });
}

// เริ่มค้นหาตั้งแต่โฟลเดอร์ `src/app`
findEditDialogFiles(baseDir);
