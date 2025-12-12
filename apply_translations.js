const fs = require('fs');
const path = 'languages/maxi-blocks-pl_PL.po';
const mapPath = 'translations_map.json';

try {
  if (!fs.existsSync(mapPath)) {
    console.log('No translation map found.');
    process.exit(0);
  }

  const translations = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
  const content = fs.readFileSync(path, 'utf8');
  const lines = content.split('\n');
  let newContent = [];
  let currentMsgid = null;
  let appliedCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('msgid "')) {
      currentMsgid = line.substring(7, line.length - 1);
      newContent.push(lines[i]); // Keep msgid line
    } else if (line.startsWith('msgstr "') && currentMsgid !== null) {
      const currentMsgstr = line.substring(8, line.length - 1);
      // Check if we have a translation for this msgid
      if (translations[currentMsgid]) {
        // Only update if it's currently empty or identical to msgid (untranslated)
        // logic: user wants to FIX it, so if it matches English, we update.
        if (!currentMsgstr || currentMsgstr === currentMsgid) {
             newContent.push(`msgstr "${translations[currentMsgid]}"`);
             appliedCount++;
        } else {
             newContent.push(lines[i]); // Keep existing translation if different
        }
      } else {
        newContent.push(lines[i]); // No translation available
      }
      currentMsgid = null;
    } else {
      newContent.push(lines[i]);
    }
  }

  fs.writeFileSync(path, newContent.join('\n'));
  console.log(`Applied ${appliedCount} translations.`);

} catch (e) {
  console.error(e);
}
