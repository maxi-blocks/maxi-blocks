<?php

/**
 * Plugin Name: Maxi Blocks - Last Github version
 * Plugin URI:
 * Description: MaxiBlocks — is a Gutenberg plugin created via create-guten-block. Last update: 29/05/20
 * Author: Gutenberg Den
 * Author URI:
 * Version: 0.1
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
  exit;
}

function maxi_blocks_add_db_table()
{
  global $wpdb;
  $db_table_name = $wpdb->prefix . 'maxi_blocks_general';  // table name
  $charset_collate = $wpdb->get_charset_collate();

  //Check to see if the table exists already, if not, then create it
  if ($wpdb->get_var("show tables like '$db_table_name'") != $db_table_name) {
    $sql = "CREATE TABLE $db_table_name (
                id varchar(128) NOT NULL,
                object longtext NOT NULL,
                UNIQUE (id)
        ) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
  }
}


register_activation_hook(__FILE__, 'maxi_blocks_add_db_table');

/**
 * Block Initializer.
 */
require_once plugin_dir_path(__FILE__) . 'src/init.php';


//======================================================================
// AUTOUPDATE
//======================================================================

// require plugin_dir_path( __FILE__ ) .'maxi-plugin-update-checker/plugin-update-checker.php';
// $gxUpdateChecker = Puc_v4_Factory::buildUpdateChecker('https://s3-eu-west-1.amazonaws.com/gutenberg-extra/gutenberg-extra-free/gutenberg-extra-update/gutenberg-extra-plugin-update.json', __FILE__, 'gutenberg-extra');


//======================================================================
// CUSTOMIZER
//======================================================================

// require_once plugin_dir_path( __FILE__ ) . 'customizer/customizer.php';


//======================================================================
// SETUP PAGE CONTENT DEPENDING ON CUSTOMIZER
//======================================================================

require_once plugin_dir_path(__FILE__) . 'page-content-setting/dynamic_content.php';

//======================================================================
// STYLING API
//======================================================================
require_once plugin_dir_path(__FILE__) . 'API/class-maxi-blocks-api.php';
