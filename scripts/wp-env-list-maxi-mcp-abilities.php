<?php
/**
 * Local wp-env helper: list public Maxi MCP abilities.
 */

if (!defined('ABSPATH')) {
    exit(1);
}

$abilities = wp_get_abilities();
$names = [];

foreach ($abilities as $ability) {
    $name = $ability->get_name();
    $meta = $ability->get_meta();

    if (
        str_starts_with($name, 'maxi-mcp/') &&
        !empty($meta['mcp']['public'])
    ) {
        $names[] = $name;
    }
}

sort($names);

foreach ($names as $name) {
    echo $name . PHP_EOL;
}
