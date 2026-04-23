<?php
/**
 * Local wp-env helper: validate and save content through the Maxi MCP set-content ability.
 */

if (!defined('ABSPATH')) {
    exit(1);
}

$set_ability = wp_get_ability('maxi-mcp/set-content');
$structure_ability = wp_get_ability('maxi-mcp/get-maxi-structure');

if (!$set_ability) {
    echo "MISSING_SET_CONTENT\n";
    exit(0);
}

if (!$structure_ability) {
    echo "MISSING_GET_MAXI_STRUCTURE\n";
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

$unique_suffix = strtolower(wp_generate_password(6, false, false));
$initial_title = 'Codex Set Content Smoke ' . $unique_suffix;
$saved_title = 'Codex Set Content Saved ' . $unique_suffix;
$saved_slug = 'codex-set-content-' . $unique_suffix;

$post_id = wp_insert_post([
    'post_type' => 'page',
    'post_status' => 'draft',
    'post_title' => $initial_title,
    'post_content' => '',
], true);

if (is_wp_error($post_id)) {
    echo 'CREATE_ERROR: ' . $post_id->get_error_message() . "\n";
    exit(0);
}

$post_id = (int) $post_id;
$cleanup_done = false;

$format_messages = static function ($messages) {
    if (!is_array($messages)) {
        return '';
    }

    $messages = array_values(array_filter(array_map('strval', $messages), static function ($message) {
        return $message !== '';
    }));

    return implode(' | ', $messages);
};

$cleanup = static function () use (&$cleanup_done, $post_id) {
    if ($cleanup_done || $post_id < 1) {
        return;
    }

    wp_delete_post($post_id, true);
    $cleanup_done = true;
};

$non_maxi_content = '<!-- wp:paragraph --><p>Dry run paragraph content.</p><!-- /wp:paragraph -->';
$validate_result = $set_ability->execute([
    'id' => $post_id,
    'content' => $non_maxi_content,
    'validate_only' => true,
]);

if (is_wp_error($validate_result)) {
    echo 'VALIDATE_ERROR: ' . $validate_result->get_error_message() . "\n";
    $cleanup();
    exit(0);
}

$post_after_validate = get_post($post_id);

echo 'POST_ID: ' . $post_id . "\n";
echo 'VALIDATE_OK: ' . (!empty($validate_result['validation']['ok']) ? '1' : '0') . "\n";
echo 'VALIDATE_SAVED: ' . (!empty($validate_result['saved']) ? '1' : '0') . "\n";
echo 'VALIDATE_HAS_BLOCKS: ' . (!empty($validate_result['has_blocks']) ? '1' : '0') . "\n";
echo 'VALIDATE_HAS_MAXI_BLOCKS: ' . (!empty($validate_result['has_maxi_blocks']) ? '1' : '0') . "\n";
echo 'VALIDATE_MAXI_BLOCK_COUNT: ' . (int) ($validate_result['maxi_block_count'] ?? 0) . "\n";
echo 'VALIDATE_NON_MAXI_BLOCK_COUNT: ' . (int) ($validate_result['non_maxi_block_count'] ?? 0) . "\n";
echo 'VALIDATE_CONTENT_UNCHANGED: ' . (($post_after_validate instanceof \WP_Post && $post_after_validate->post_content === '') ? '1' : '0') . "\n";
echo 'VALIDATE_MESSAGES: ' . $format_messages($validate_result['validation']['messages'] ?? []) . "\n";

$maxi_content = implode("\n", [
    '<!-- wp:maxi-blocks/container-maxi {"uniqueID":"section-' . $unique_suffix . '","customLabel":"Smoke Section"} -->',
    '<!-- wp:maxi-blocks/text-maxi {"uniqueID":"headline-' . $unique_suffix . '","customLabel":"Smoke Heading","content":"Hello from Codex","textLevel":"h2"} /-->',
    '<!-- wp:maxi-blocks/button-maxi {"uniqueID":"cta-' . $unique_suffix . '","customLabel":"Smoke CTA","buttonContent":"Learn more","linkSettings":{"url":"https://example.com"}} /-->',
    '<!-- /wp:maxi-blocks/container-maxi -->',
]);

$save_result = $set_ability->execute([
    'id' => $post_id,
    'title' => $saved_title,
    'slug' => $saved_slug,
    'status' => 'draft',
    'excerpt' => 'Codex smoke test excerpt',
    'content' => $maxi_content,
]);

if (is_wp_error($save_result)) {
    echo 'SAVE_ERROR: ' . $save_result->get_error_message() . "\n";
    $cleanup();
    exit(0);
}

echo 'SAVE_OK: ' . (!empty($save_result['validation']['ok']) ? '1' : '0') . "\n";
echo 'SAVE_SAVED: ' . (!empty($save_result['saved']) ? '1' : '0') . "\n";
echo 'SAVE_HAS_BLOCKS: ' . (!empty($save_result['has_blocks']) ? '1' : '0') . "\n";
echo 'SAVE_HAS_MAXI_BLOCKS: ' . (!empty($save_result['has_maxi_blocks']) ? '1' : '0') . "\n";
echo 'SAVE_MAXI_BLOCK_COUNT: ' . (int) ($save_result['maxi_block_count'] ?? 0) . "\n";
echo 'SAVE_NON_MAXI_BLOCK_COUNT: ' . (int) ($save_result['non_maxi_block_count'] ?? 0) . "\n";
echo 'SAVE_TITLE: ' . (string) ($save_result['title'] ?? '') . "\n";
echo 'SAVE_SLUG: ' . (string) ($save_result['slug'] ?? '') . "\n";
echo 'SAVE_STATUS: ' . (string) ($save_result['status'] ?? '') . "\n";
echo 'SAVE_MESSAGES: ' . $format_messages($save_result['validation']['messages'] ?? []) . "\n";

$structure_result = $structure_ability->execute([
    'id' => $post_id,
    'include_attributes' => false,
]);

if (is_wp_error($structure_result)) {
    echo 'STRUCTURE_ERROR: ' . $structure_result->get_error_message() . "\n";
    $cleanup();
    exit(0);
}

$items = is_array($structure_result['items'] ?? null) ? $structure_result['items'] : [];
$first_item = $items[0] ?? [];

echo 'STRUCTURE_HAS_MAXI_BLOCKS: ' . (!empty($structure_result['has_maxi_blocks']) ? '1' : '0') . "\n";
echo 'STRUCTURE_MAXI_BLOCK_COUNT: ' . (int) ($structure_result['maxi_block_count'] ?? 0) . "\n";
echo 'STRUCTURE_NON_MAXI_BLOCK_COUNT: ' . (int) ($structure_result['non_maxi_block_count'] ?? 0) . "\n";
echo 'STRUCTURE_ITEMS: ' . count($items) . "\n";
echo 'STRUCTURE_FIRST_ITEM: path=' . (string) ($first_item['path'] ?? '') .
    ' type=' . (string) ($first_item['type'] ?? '') .
    ' custom_label=' . (string) ($first_item['custom_label'] ?? '') . "\n";

$cleanup();

echo 'CLEANUP_DELETED: ' . (get_post($post_id) instanceof \WP_Post ? '0' : '1') . "\n";
