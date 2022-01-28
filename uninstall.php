<?php if (!defined('WP_UNINSTALL_PLUGIN')) {
    die;
}

global $wpdb;
$wpdb->query("DROP TABLE IF EXISTS {$wpdb->prefix}maxi_blocks_general");
$wpdb->query("DROP TABLE IF EXISTS {$wpdb->prefix}maxi_blocks_custom_data");
$wpdb->query("DROP TABLE IF EXISTS {$wpdb->prefix}maxi_blocks_styles");