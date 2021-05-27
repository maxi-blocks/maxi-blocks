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
	class MaxiBlocks_DB extends MaxiBlocks_Core {
		/**
		 * DB instance.
		 *
		 * @var MaxiBlocks_DB
		 */
		private static $instance;

		/**
		 * Registers the plugin.
		 */
		public static function register() {
			if (null === self::$instance) {
				self::$instance = new MaxiBlocks_DB();
			}
		}

		/**
		 * Constructor.
		 */
		public function __construct() {
			// Register general options DB
			register_activation_hook(MAXI_PLUGIN_DIR_FILE, [
				$this,
				'add_general_db',
			]);
		}

		public function add_general_db() {
			global $wpdb;
			$db_table_name = $wpdb->prefix . 'maxi_blocks_general';
			$charset_collate = $wpdb->get_charset_collate();

			//Check to see if the table exists already, if not, then create it
			if (
				$wpdb->get_var("show tables like '$db_table_name'") !=
				$db_table_name
			) {
				$sql = "CREATE TABLE $db_table_name (
						id varchar(128) NOT NULL,
						object longtext NOT NULL,
						UNIQUE (id)
				) $charset_collate;";

				require_once ABSPATH . 'wp-admin/includes/upgrade.php';
				dbDelta($sql);
			}
		}
	}
endif;
