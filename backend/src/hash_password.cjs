const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const saltRounds = 10;

const plainPassword = '123123';
const tempFilePath = path.join(__dirname, 'temp_hash.txt');

bcrypt.hash(plainPassword, saltRounds, function(err, hash) {
    if (err) {
        console.error('Lỗi khi hash mật khẩu:', err);
        return;
    }
    fs.writeFileSync(tempFilePath, hash, 'utf8');
    console.log(`Hash đã được ghi vào: ${tempFilePath}`);
});