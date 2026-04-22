<?php
/**
 * Local wp-env helper: inspect the Maxi MCP guide ability.
 */

if (!defined('ABSPATH')) {
    exit(1);
}

$ability = wp_get_ability('maxi-mcp/get-guide');

if (!$ability) {
    echo "MISSING\n";
    exit(0);
}

echo "FOUND\n";
print_r($ability->get_meta());
