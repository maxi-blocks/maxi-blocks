<?php

/**
 * MaxiBlocks Admin Page
 *
 * @package MaxiBlocks_Admin_Page
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
	exit;
}

if (!class_exists('MaxiBlocks_Admin_Page')) :
	/**
	 * Main MaxiBlocks_Admin_Page Class
	 *
	 * @since 1.0.0
	 */
	final class MaxiBlocks_Admin_Page {
		/**
		 * This plugin's instance.
		 *
		 * @var MaxiBlocks_Admin_Page
		 */
		protected static $instance;

		/**
		 * Registers the plugin.
		 */
		public static function register() {
			if (null === self::$instance)
				self::$instance = new MaxiBlocks_Admin_Page();
		}

		/**
		 * Constructor
		 */
		public function __construct() {
			// Generate the admin page
			add_action('admin_menu', array($this, 'register_menu_page'));

			// Register settings
			add_action('admin_init', array($this, 'register_sections'));
			add_action('admin_init', array($this, 'register_setting_fields'));
			add_action('admin_init', array($this, 'register_settings'));
			add_action('rest_api_init', array($this, 'register_settings'));
		}

		public function register_menu_page() {
			add_menu_page(
				'MaxiBlocks Settings',
				'MaxiBlocks Settings',
				'manage_options',
				'maxi-blocks-general-settings',
				array($this, 'get_menu_page'),
				'dashicons-chart-pie',
				6
			);
		}

		public function get_menu_page() {
?>
			<!-- This file should primarily consist of HTML with a little bit of PHP. -->
			<div class="wrap">
				<div id="icon-themes" class="icon32"></div>
				<h2>Settings Page Settings</h2>
				<!--NEED THE settings_errors below so that the errors/success messages are shown after submission - wasn't working once we started using add_menu_page and stopped using add_options_page so needed this-->
				<?php settings_errors(); ?>
				<form method="POST" action="options.php">
					<?php
					settings_fields('maxi-blocks-general-settings');
					do_settings_sections('maxi-blocks-general-settings');
					?>
					<?php submit_button(); ?>
				</form>
			</div>
		<?php
		}

		public function register_sections() {
			add_settings_section(
				'maxiblocks_general_section',
				'MaxiBlocks General Settings',
				null,
				'maxi-blocks-general-settings'
			);
		}

		public function register_setting_fields() {
			add_settings_field(
				'maxi-blocks-cloud-library-api-server',
				'Cloud Library API server',
				array($this, 'text_input'),
				'maxi-blocks-general-settings',
				'maxiblocks_general_section',
				array(
					'name'		=> 'maxi-blocks-cloud-library-api-server',
				)
			);
		}

		public function register_settings() {
			register_setting(
				'maxi-blocks-general-settings',
				'maxi-blocks-cloud-library-api-server',
				array(
					'type' 				=> 'string',
					'sanitize_callback' => 'sanitize_text_field',
					'default' 			=> NULL,
					'show_in_rest'		=> true
				)
			);
		}

		public function text_input($args) {
			$name = $args['name'];
			$value = get_option($name);
		?>
			<input type="text" id="<?php echo $name ?>" name="<?php echo $name ?>" value="<?php echo $value ?>">
<?php
		}
	}

endif;

if (class_exists('MaxiBlocks_Admin_Page'))
	MaxiBlocks_Admin_Page::register();
