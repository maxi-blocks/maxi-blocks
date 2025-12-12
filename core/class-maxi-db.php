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
            add_action('plugins_loaded', [
                $this,
                'check_maxi_tables',
            ]);
        }

        public function check_maxi_tables()
        {
            $tables_created = get_option("maxi_plugin_db_tables_created", false); // Default to false if the option doesn't exist

            if (!$tables_created && version_compare(MAXI_PLUGIN_VERSION, '1.3.1', '>')) {
                // Call your function to create/update tables
                $this->add_maxi_tables();
                do_action('maxi_blocks_db_tables_created');

                // Mark that tables were created for this version
                update_option("maxi_plugin_db_tables_created", true);
            }
        }

        public function add_maxi_tables()
        {
            global $wpdb;

            $db_custom_prefix = 'maxi_blocks_';

            $db_general_table_name = $wpdb->prefix . $db_custom_prefix . 'general';
            $db_css_table_name = $wpdb->prefix . $db_custom_prefix . 'styles_blocks';
            $db_custom_data_table_name = $wpdb->prefix . $db_custom_prefix . 'custom_data_blocks';

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
					block_style_id varchar(245) UNIQUE NOT NULL,
					prev_css_value longtext,
					css_value longtext,
                    prev_fonts_value longtext,
					fonts_value longtext,
					prev_active_custom_data BIT DEFAULT 0,
                    active_custom_data BIT DEFAULT 0,
					UNIQUE (id),
					KEY block_style_id_idx (block_style_id)
			) $charset_collate;";

                require_once ABSPATH . 'wp-admin/includes/upgrade.php';
                dbDelta($sql);
            }
            
            // Add index to existing table if not present (for upgrades)
            $index_exists = $wpdb->get_var(
                $wpdb->prepare(
                    "SHOW INDEX FROM {$db_css_table_name} WHERE Key_name = %s",
                    'block_style_id_idx'
                )
            );
            
            if (!$index_exists) {
                $wpdb->query(
                    "ALTER TABLE {$db_css_table_name} ADD INDEX block_style_id_idx (block_style_id)"
                );
            }

            //add custom data table
            if (
                $wpdb->get_var($wpdb->prepare("show tables like %s", $db_custom_data_table_name)) !=
                $db_custom_data_table_name
            ) {
                $sql = "CREATE TABLE $db_custom_data_table_name (
						id bigint(20) NOT NULL AUTO_INCREMENT,
						block_style_id varchar(245) UNIQUE NOT NULL,
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
