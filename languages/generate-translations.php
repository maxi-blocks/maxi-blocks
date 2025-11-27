<?php
/**
 * Generate combined JSON translation files for bundled JavaScript
 *
 * This script generates JSON translation files for MaxiBlocks bundled JS files:
 * - build/index.min.js (editor)
 * - build/admin.min.js (dashboard)
 *
 * Usage:
 *   php generate-translations.php           # Process all available locales
 *   php generate-translations.php es_ES     # Process only Spanish
 *   php generate-translations.php es_ES de_DE fr_FR  # Process multiple specific locales
 */

/**
 * Get list of locales to process
 *
 * @return array Array of locale codes
 */
function get_locales_to_process()
{
    global $argv;

    // If arguments provided, use them
    if (isset($argv[1])) {
        // Remove script name from argv and return the rest
        return array_slice($argv, 1);
    }

    // Otherwise, auto-detect all .po files
    $po_files = glob('maxi-blocks-*.po');
    $locales = [];

    foreach ($po_files as $file) {
        // Extract locale from filename: maxi-blocks-de_DE.po -> de_DE
        if (preg_match('/maxi-blocks-([a-z]{2}_[A-Z]{2})\.po/', $file, $matches)) {
            $locales[] = $matches[1];
        }
    }

    if (empty($locales)) {
        die("No .po files found in the languages directory.\n");
    }

    return $locales;
}

$locales = get_locales_to_process();
echo "Processing locales: " . implode(', ', $locales) . "\n\n";

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

/**
 * Parse PO file and extract JavaScript translations
 *
 * @param string $po_content Content of the .po file
 * @return array Associative array of translations
 */
function parse_po_file($po_content)
{
    $lines = explode("\n", $po_content);
    $translations = [];
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

    return $translations;
}

/**
 * Generate JSON translation files for a specific locale
 *
 * @param string $locale Locale code (e.g., 'de_DE')
 * @param array $scripts Array of script configurations
 * @return array Array of generated file information
 */
function generate_locale_translations($locale, $scripts)
{
    $po_file = "maxi-blocks-{$locale}.po";

    // Check if PO file exists
    if (!file_exists($po_file)) {
        echo "⚠ Skipping {$locale}: PO file not found ({$po_file})\n\n";
        return [];
    }

    echo "Processing locale: {$locale}\n";
    echo "Source file: {$po_file}\n";

    // Read the PO file
    $poFile = file_get_contents($po_file);
    if (!$poFile) {
        echo "⚠ Could not read PO file: {$po_file}\n\n";
        return [];
    }

    // Parse PO file
    $translations = parse_po_file($poFile);
    $total_translations = count($translations);
    echo "Found {$total_translations} JavaScript translations\n";

    if ($total_translations === 0) {
        echo "⚠ No translated JavaScript strings found for {$locale}\n\n";
        return [];
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
            'locale' => $locale,
            'name' => $script_name,
            'file' => $filename,
            'hash' => $hash,
            'size' => filesize($filename),
            'translations' => $total_translations
        ];
    }

    // Display results for this locale
    echo "✓ Generated " . count($generated_files) . " translation files\n";
    foreach ($generated_files as $file) {
        echo "  • {$file['file']} ({$file['size']} bytes)\n";
    }

    // Show sample translations
    if ($total_translations > 0) {
        echo "Sample translations:\n";
        $sample = array_slice(array_keys($translations), 0, 3);
        foreach ($sample as $key) {
            echo "  \"{$key}\" → \"{$translations[$key][0]}\"\n";
        }
    }

    echo "\n";
    return $generated_files;
}

// Process all locales
$all_generated_files = [];
foreach ($locales as $locale) {
    $files = generate_locale_translations($locale, $scripts);
    $all_generated_files = array_merge($all_generated_files, $files);
}

// Final summary
echo "==========================================\n";
echo "SUMMARY\n";
echo "==========================================\n";
echo "Processed locales: " . count($locales) . "\n";
echo "Generated files: " . count($all_generated_files) . "\n\n";

if (!empty($all_generated_files)) {
    echo "Generated files:\n";
    foreach ($all_generated_files as $file) {
        echo "✓ {$file['locale']}: {$file['file']} ({$file['translations']} translations)\n";
    }
}

echo "\nDone!\n";
