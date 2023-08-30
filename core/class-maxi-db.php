<?php
/**
 * MaxiBlocks Core Class
 *
 * @since   1.0.0
 * @package MaxiBlocks
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit();
}

// define('MAXI_PLUGIN_DIR_PATH', plugin_dir_path(__FILE__));

if (!class_exists('MaxiBlocks_DB')):
    class MaxiBlocks_DB extends MaxiBlocks_Core
    {
        /**
         * DB instance.
         *
         * @var MaxiBlocks_DB
         */
        private static $instance;

        /**
         * Registers the plugin.
         */
        public static function register()
        {
            if (null === self::$instance) {
                self::$instance = new MaxiBlocks_DB();
            }
        }

        /**
         * Constructor.
         */
        public function __construct()
        {
            register_activation_hook(MAXI_PLUGIN_DIR_FILE, [
                $this,
                'add_maxi_tables',
            ]);
        }

        public function add_maxi_tables()
        {
            global $wpdb;

            $db_custom_prefix = 'maxi_blocks_';

            $db_general_table_name = $wpdb->prefix . $db_custom_prefix . 'general';
            $db_css_table_name = $wpdb->prefix . $db_custom_prefix . 'styles';
            $db_css_templates_table_name = $db_css_table_name . '_templates';
            $db_custom_data_table_name = $wpdb->prefix . $db_custom_prefix . 'custom_data';
            $db_custom_data_templates_table_name = $db_custom_data_table_name . '_templates';

            $charset_collate = $wpdb->get_charset_collate();

            //add general table
            if (
                $wpdb->get_var($wpdb->prepare("show tables like %s", $db_general_table_name)) !=
                $db_general_table_name
            ) {
                $sql = "CREATE TABLE $db_general_table_name (
						id varchar(128) NOT NULL,
						object longtext NOT NULL,
						UNIQUE (id)
				) $charset_collate;";

                require_once ABSPATH . 'wp-admin/includes/upgrade.php';
                dbDelta($sql);
            }

            //add css table
            if (
                $wpdb->get_var($wpdb->prepare("show tables like %s", $db_css_table_name)) !=
                $db_css_table_name
            ) {
                $sql = "CREATE TABLE $db_css_table_name (
						id bigint(20) NOT NULL AUTO_INCREMENT,
						post_id bigint(20) UNIQUE NOT NULL,
						prev_css_value longtext,
						css_value longtext,
                        prev_fonts_value longtext,
						fonts_value longtext,
						prev_active_custom_data BIT DEFAULT 0,
                        active_custom_data BIT DEFAULT 0,
						UNIQUE (id)
				) $charset_collate;";

                require_once ABSPATH . 'wp-admin/includes/upgrade.php';
                dbDelta($sql);
            }

            //add css templates table
            if (
                $wpdb->get_var($wpdb->prepare("show tables like %s", $db_css_templates_table_name)) !=
                $db_css_templates_table_name
            ) {
                $sql = "CREATE TABLE $db_css_templates_table_name (
						id bigint(20) NOT NULL AUTO_INCREMENT,
						template_id varchar(255) UNIQUE NOT NULL,
						prev_css_value longtext,
						css_value longtext,
                        prev_fonts_value longtext,
						fonts_value longtext,
						template_parts longtext,
						prev_active_custom_data BIT DEFAULT 0,
                        active_custom_data BIT DEFAULT 0,
						UNIQUE (id)
				) $charset_collate;";

                require_once ABSPATH . 'wp-admin/includes/upgrade.php';
                dbDelta($sql);
            }

            //add custom data table
            if (
                $wpdb->get_var($wpdb->prepare("show tables like %s", $db_custom_data_table_name)) !=
                $db_custom_data_table_name
            ) {
                $sql = "CREATE TABLE $db_custom_data_table_name (
						id bigint(20) NOT NULL AUTO_INCREMENT,
						post_id bigint(20) UNIQUE NOT NULL,
						prev_custom_data_value longtext,
						custom_data_value longtext,
						UNIQUE (id)
				) $charset_collate;";

                require_once ABSPATH . 'wp-admin/includes/upgrade.php';
                dbDelta($sql);
            }

            //add custom data templates table
            if (
                $wpdb->get_var($wpdb->prepare("show tables like %s", $db_custom_data_templates_table_name)) !=
                $db_custom_data_templates_table_name
            ) {
                $sql = "CREATE TABLE $db_custom_data_templates_table_name (
						id bigint(20) NOT NULL AUTO_INCREMENT,
						template_id varchar(255) UNIQUE NOT NULL,
						prev_custom_data_value longtext,
						custom_data_value longtext,
						UNIQUE (id)
				) $charset_collate;";

                require_once ABSPATH . 'wp-admin/includes/upgrade.php';
                dbDelta($sql);
            }
        }
    }
endif;
