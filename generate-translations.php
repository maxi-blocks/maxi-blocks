<?php
/**
 * Generate combined JSON translation file for bundled JavaScript
 */

// Read the PO file
$poFile = file_get_contents('languages/maxi-blocks-de_DE.po');
if (!$poFile) {
    die("Could not read PO file\n");
}

// Parse PO file
$lines = explode("\n", $poFile);
$translations = []; // Don't initialize with empty string
$isJsFile = false;
$msgid = null;
$msgstr = null;
$inMsgid = false;
$inMsgstr = false;

for ($i = 0; $i < count($lines); $i++) {
    $line = $lines[$i];
    $trimmed = trim($line);

    // Check for source reference
    if (strpos($trimmed, '#:') === 0) {
        // Check if this references a JS file
        if (strpos($trimmed, '.js') !== false || strpos($trimmed, '.jsx') !== false) {
            $isJsFile = true;
        }
        continue;
    }

    // Start of msgid
    if (strpos($trimmed, 'msgid "') === 0) {
        // Save previous entry if exists
        if ($msgid !== null && $msgstr !== null && $msgstr !== '' && $isJsFile) {
            $translations[$msgid] = [$msgstr];
        }

        // Start new entry
        $msgid = stripcslashes(substr($trimmed, 7, -1));
        $inMsgid = true;
        $inMsgstr = false;
        continue;
    }

    // Start of msgstr
    if (strpos($trimmed, 'msgstr "') === 0) {
        $msgstr = stripcslashes(substr($trimmed, 8, -1));
        $inMsgid = false;
        $inMsgstr = true;
        continue;
    }

    // Continuation line (starts with ")
    if (!empty($trimmed) && $trimmed[0] === '"') {
        $content = stripcslashes(substr($trimmed, 1, -1));
        if ($inMsgid) {
            $msgid .= $content;
        } elseif ($inMsgstr) {
            $msgstr .= $content;
        }
        continue;
    }

    // Empty line or comment - end of entry
    if (empty($trimmed) || $trimmed[0] === '#') {
        // Save entry if it exists and is translated
        if ($msgid !== null && $msgstr !== null && $msgstr !== '' && $msgid !== '' && $isJsFile) {
            $translations[$msgid] = [$msgstr];
        }

        // Reset for next entry
        $msgid = null;
        $msgstr = null;
        $isJsFile = false;
        $inMsgid = false;
        $inMsgstr = false;
    }
}

// Don't forget the last entry
if ($msgid !== null && $msgstr !== null && $msgstr !== '' && $msgid !== '' && $isJsFile) {
    $translations[$msgid] = [$msgstr];
}

echo "Found " . count($translations) . " JavaScript translations\n";

// Add the empty string with metadata FIRST
// IMPORTANT: The domain field here must be empty string, not 'maxi-blocks'!
$locale_data = [
    '' => [
        'domain' => '',
        'lang' => 'de_DE',
        'plural-forms' => 'nplurals=2; plural=n != 1;'
    ]
];

// Then add all translations
$locale_data = array_merge($locale_data, $translations);

// Create JSON structure matching JED format
$json = [
    'translation-revision-date' => date('Y-m-d H:i:sP'),
    'generator' => 'MaxiBlocks Translation Script',
    'source' => 'build/index.min.js',
    'domain' => 'maxi-blocks',
    'locale_data' => [
        'maxi-blocks' => $locale_data
    ]
];

// Save as JSON - use the FULL relative path that WordPress sees
// The hash must match what WordPress calculates: md5('maxi-blocks/build/index.min.js')
// This is the path relative to wp-content/plugins/
$hash = md5('maxi-blocks/build/index.min.js');
$filename = "languages/maxi-blocks-de_DE-{$hash}.json";

file_put_contents($filename, json_encode($json, JSON_UNESCAPED_UNICODE));

echo "Created: $filename\n";
echo "File size: " . filesize($filename) . " bytes\n";
echo "\nSample translations:\n";
$sample = array_slice(array_keys($translations), 0, 3);
foreach ($sample as $key) {
    echo "  \"$key\" => \"{$translations[$key][0]}\"\n";
}
