const fs = require('fs');
const path = 'core/class-maxi-api.php';

try {
    if (!fs.existsSync(path)) {
        console.error('File not found: ' + path);
        process.exit(1);
    }
    
    const buffer = fs.readFileSync(path);
    console.log(`Read ${buffer.length} bytes`);
    
    // Check for UTF-8 BOM: EF BB BF
    if (buffer.length >= 3 && buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
        console.log('BOM found! Removing...');
        const newBuffer = buffer.slice(3);
        fs.writeFileSync(path, newBuffer);
        console.log(`Wrote ${newBuffer.length} bytes (BOM removed)`);
    } else {
        console.log('No BOM found (First 3 bytes: ' + 
            (buffer.length > 0 ? buffer[0].toString(16) : 'N/A') + ' ' +
            (buffer.length > 1 ? buffer[1].toString(16) : 'N/A') + ' ' +
            (buffer.length > 2 ? buffer[2].toString(16) : 'N/A') + ')');
    }
} catch (err) {
    console.error('Error:', err);
    process.exit(1);
}
