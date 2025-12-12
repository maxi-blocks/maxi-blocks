const crypto = require('crypto');
const fs = require('fs');
const hash = crypto.createHash('md5').update('maxi-blocks/build/index.min.js').digest('hex');
console.log('Expected hash:', hash);
const filename = 'languages/maxi-blocks-pl_PL-' + hash + '.json';
console.log('Expected file:', filename);
console.log('File exists:', fs.existsSync(filename));
