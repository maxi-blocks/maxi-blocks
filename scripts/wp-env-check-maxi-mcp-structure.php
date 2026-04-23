<?php
/**
 * Local wp-env helper: inspect the Maxi MCP structure ability.
 */

if (!defined('ABSPATH')) {
    exit(1);
}

$ability = wp_get_ability('maxi-mcp/get-maxi-structure');

if (!$ability) {
    echo "MISSING\n";
    exit(0);
}

$admin_users = get_users([
    'role' => 'administrator',
    'number' => 1,
    'orderby' => 'ID',
    'order' => 'ASC',
]);

if (!empty($admin_users) && $admin_users[0] instanceof \WP_User) {
    wp_set_current_user((int) $admin_users[0]->ID);
}

if (!is_user_logged_in()) {
    echo "NO_ADMIN_USER_FOUND\n";
    exit(0);
}

global $args;

$script_args = is_array($args ?? null) ? array_values($args) : [];

if (empty($script_args) && !empty($_SERVER['argv']) && is_array($_SERVER['argv'])) {
    $script_args = array_slice($_SERVER['argv'], 3);
}

$post_id = isset($script_args[0]) ? absint($script_args[0]) : 0;
$include_attributes =
    isset($script_args[1]) && in_array(strtolower((string) $script_args[1]), ['1', 'true', 'yes', 'on'], true);

if ($post_id < 1) {
    $pages = get_posts([
        'post_type' => 'page',
        'post_status' => ['publish', 'draft', 'private', 'pending'],
        'posts_per_page' => 100,
        'orderby' => 'ID',
        'order' => 'ASC',
    ]);

    foreach ($pages as $page) {
        if (
            !$page instanceof \WP_Post ||
            strpos((string) $page->post_content, 'wp:maxi-blocks/') === false
        ) {
            continue;
        }

        $post_id = (int) $page->ID;
        break;
    }
}

if ($post_id < 1) {
    echo "NO_MAXI_PAGE_FOUND\n";
    exit(0);
}

$result = $ability->execute([
    'id' => $post_id,
    'include_attributes' => $include_attributes,
]);

if (is_wp_error($result)) {
    echo 'ERROR: ' . $result->get_error_message() . "\n";
    exit(0);
}

echo 'POST_ID: ' . $post_id . "\n";
echo 'HAS_MAXI_BLOCKS: ' . (!empty($result['has_maxi_blocks']) ? '1' : '0') . "\n";
echo 'MAXI_BLOCK_COUNT: ' . (int) ($result['maxi_block_count'] ?? 0) . "\n";
echo 'NON_MAXI_BLOCK_COUNT: ' . (int) ($result['non_maxi_block_count'] ?? 0) . "\n";
echo 'REUSABLE_BLOCK_REF_COUNT: ' . (int) ($result['reusable_block_ref_count'] ?? 0) . "\n";

$items = is_array($result['items'] ?? null) ? $result['items'] : [];
$sample = array_slice($items, 0, 3);

foreach ($sample as $index => $item) {
    $highlights = $item['highlights'] ?? [];

    echo sprintf(
        "ITEM_%d: path=%s depth=%d type=%s unique_id=%s custom_label=%s has_attributes=%s text_preview=%s\n",
        $index,
        (string) ($item['path'] ?? ''),
        (int) ($item['depth'] ?? 0),
        (string) ($item['type'] ?? ''),
        isset($item['unique_id']) ? (string) $item['unique_id'] : '',
        isset($item['custom_label']) ? (string) $item['custom_label'] : '',
        array_key_exists('attributes', $item) ? '1' : '0',
        isset($highlights['text_preview']) ? (string) $highlights['text_preview'] : ''
    );
}
