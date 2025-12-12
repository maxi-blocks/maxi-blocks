$content = Get-Content -Path "c:\Users\kyra\maxi-blocks\languages\maxi-blocks-pl_PL.po" -Raw
# Split by blank lines to get entries
$entries = $content -split "\n\n"
$total = 0
$untranslated = 0
$identical = 0

foreach ($entry in $entries) {
    if ($entry -match 'msgid "(.*?)"' -and $entry -match 'msgstr "(.*?)"') {
        $msgid = $matches[1]
        $entry -match 'msgstr "(.*?)"' | Out-Null
        $msgstr = $matches[1]

        if ($msgid -ne "") {
            $total++
            if ($msgstr -eq "") {
                $untranslated++
            } elseif ($msgstr -eq $msgid) {
                # Check if it's not a plural form or something else
                $identical++
            }
        }
    }
}

Write-Host "Total entries: $total"
Write-Host "Empty msgstr: $untranslated"
Write-Host "Identical msgstr (English): $identical"
