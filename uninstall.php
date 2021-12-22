<?php if (!defined('WP_UNINSTALL_PLUGIN')) {
    die;
}

global $wpdb;
$wpdb->query("SELECT CONCAT('DROP TABLE IF EXISTS `', TABLE_NAME,'`;') 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_NAME LIKE 'maxi_blocks_';");