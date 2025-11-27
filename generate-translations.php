<?php
/**
 * Generate combined JSON translation files for bundled JavaScript
 *
 * This script generates JSON translation files for MaxiBlocks bundled JS files:
 * - build/index.min.js (editor)
 * - build/admin.min.js (dashboard)
 *
 * Usage: php generate-translations.php [locale]
 * Default locale: de_DE
 */

// Get locale from command line argument, default to de_DE
$locale = isset($argv[1]) ? $argv[1] : 'de_DE';

// Define the bundled scripts that need translations
$scripts = [
    'index' => [
        'path' => 'maxi-blocks/build/index.min.js',
        'name' => 'Editor (index.min.js)'
    ],
    'admin' => [
        'path' => 'maxi-blocks/build/admin.min.js',
        'name' => 'Dashboard (admin.min.js)'
    ]
];

// Read the PO file
$poFile = file_get_contents("maxi-blocks-{$locale}.po");
if (!$poFile) {
    die("Could not read PO file: maxi-blocks-{$locale}.po\n");
}

echo "Processing translations for locale: {$locale}\n";
echo "Source file: maxi-blocks-{$locale}.po\n\n";

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

$total_translations = count($translations);
echo "Found {$total_translations} JavaScript translations\n\n";

if ($total_translations === 0) {
    die("No translated JavaScript strings found. Please add translations in Loco Translate first.\n");
}

// Generate JSON files for each bundled script
$generated_files = [];

foreach ($scripts as $key => $script) {
    $script_path = $script['path'];
    $script_name = $script['name'];

    // Add the empty string with metadata FIRST
    // IMPORTANT: The domain field here must be empty string, not 'maxi-blocks'!
    $locale_data = [
        '' => [
            'domain' => '',
            'lang' => $locale,
            'plural-forms' => 'nplurals=2; plural=n != 1;'
        ]
    ];

    // Then add all translations
    $locale_data = array_merge($locale_data, $translations);

    // Create JSON structure matching JED format
    $json = [
        'translation-revision-date' => date('Y-m-d H:i:sP'),
        'generator' => 'MaxiBlocks Translation Script',
        'source' => str_replace('maxi-blocks/', '', $script_path),
        'domain' => 'maxi-blocks',
        'locale_data' => [
            'maxi-blocks' => $locale_data
        ]
    ];

    // Calculate hash from the full relative path (relative to wp-content/plugins/)
    $hash = md5($script_path);
    $filename = "maxi-blocks-{$locale}-{$hash}.json";

    file_put_contents($filename, json_encode($json, JSON_UNESCAPED_UNICODE));

    $generated_files[] = [
        'name' => $script_name,
        'file' => $filename,
        'hash' => $hash,
        'size' => filesize($filename)
    ];
}

// Display results
echo "Successfully generated " . count($generated_files) . " translation files:\n\n";
foreach ($generated_files as $file) {
    echo "✓ {$file['name']}\n";
    echo "  File: {$file['file']}\n";
    echo "  Hash: {$file['hash']}\n";
    echo "  Size: {$file['size']} bytes\n";
    echo "  Translations: {$total_translations}\n\n";
}

// Show sample translations
echo "Sample translations:\n";
$sample = array_slice(array_keys($translations), 0, 3);
foreach ($sample as $key) {
    echo "  \"{$key}\" → \"{$translations[$key][0]}\"\n";
}
echo "\nDone!\n";
