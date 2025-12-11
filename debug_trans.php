<?php
$hash = md5('maxi-blocks/build/index.min.js');
echo "Expected hash: " . $hash . "\n";
$locale = 'pl_PL';
$filename = 'languages/maxi-blocks-' . $locale . '-' . $hash . '.json';
echo "Expected file: " . $filename . "\n";
if (file_exists($filename)) {
    echo "File exists!\n";
} else {
    echo "File DOES NOT exist.\n";
}
?>
