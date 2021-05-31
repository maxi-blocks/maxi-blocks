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

if (!class_exists('MaxiBlocks_Core')):
	class MaxiBlocks_Core {
		/**
		 * Plugin's core instance.
		 *
		 * @var MaxiBlocks_Core
		 */
		private static $instance;

		/**
		 * Registers the plugin.
		 */
		public static function register() {
			if (null === self::$instance) {
				self::$instance = new MaxiBlocks_Core();
			}
		}

		/**
		 * Constructor.
		 */
		public function __construct() {
			// Enqueue scripts and styles
			add_action('wp_enqueue_scripts', [$this, 'enqueue_scripts_styles']);

			// Enqueue admin scripts and styles
			add_action('admin_enqueue_scripts', [
				$this,
				'enqueue_admin_scripts_styles',
			]);

			// Add MaxiBlocks classes on body element
			add_filter('body_class', [$this, 'maxi_blocks_body_class'], 99);
			add_filter('admin_body_class', [$this, 'maxi_blocks_body_class'], 99);
		}

		public function enqueue_scripts_styles() {
			wp_enqueue_script(
				'jquery',
				'https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js',
				[],
				null,
				true,
			);

			wp_enqueue_style(
				'maxi-animations-styles',
				plugins_url('/css/animate.min.css', dirname(__FILE__)),
				false,
			);

			wp_enqueue_script(
				'maxi-waypoints-js',
				plugins_url('/js/waypoints.min.js', dirname(__FILE__)),
			);

			wp_enqueue_script(
				'maxi-front-scripts-js',
				plugins_url('/js/front-scripts.js', dirname(__FILE__)),
				[],
				false,
				true,
			);
		}

		public function enqueue_admin_scripts_styles() {
			// TODO: remove when Cloud API is ready
			// Register block editor script for backend.
			wp_enqueue_script(
				'maxi-blocks-cloud-js', // Handle.
				plugins_url('/js/cloud-server.js', dirname(__FILE__)),
				['jquery', 'wp-blocks', 'wp-edit-post', 'wp-api'],
			);

			// Register block editor script for backend.
			wp_register_style(
				'maxi-block-css-admin', // Handle.
				plugins_url('/css/maxi-admin.css', dirname(__FILE__)),
			);

			wp_enqueue_style('maxi-block-css-admin');
		}

		public function maxi_blocks_body_class($classes) {
			$MBClass = ' maxi-blocks--active ';
			if (gettype($classes) === 'string') {
				$classes .= $MBClass;
			}
			if (gettype($classes) === 'array') {
				array_push($classes, $MBClass);
			}

			return $classes;
		}
	}
endif;