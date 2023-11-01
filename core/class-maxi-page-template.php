<?php

/**
 * MaxiBlocks styles API
 */

if (!defined('ABSPATH')) {
	exit();
}

if (!class_exists('MaxiBlocks_PageTemplate')):
	class MaxiBlocks_PageTemplate {
		/**
		 * This plugin's instance.
		 *
		 * @var MaxiBlocks_PageTemplate
		 */
		private static $instance;

		/**
		 * Registers the plugin.
		 */
		public static function register() {
			if (null == self::$instance) {
				self::$instance = new MaxiBlocks_PageTemplate();
			}
		}
		/**
		 * Variables
		 */
		protected $templates;

		/**
		 * Constructor.
		 */
		private function __construct() {
			$this->templates = [];

			add_filter('theme_page_templates', [$this, 'add_new_template']);

			add_filter('wp_insert_post_data', [$this, 'register_templates']);

			add_filter('template_include', [$this, 'view_template']);

			$this->templates = [
				'full-width-template.php' => 'Maxi full width template',
			];
		}

		public function add_new_template($posts_templates) {
			$posts_templates = array_merge($posts_templates, $this->templates);
			return $posts_templates;
		}

		public function register_templates($attr) {
			$cache_key =
				'page_templates-' .
				md5(get_theme_root() . '/' . get_stylesheet());

			$templates = wp_get_theme()->get_page_templates();
			if (empty($templates)) {
				$templates = [];
			}

			wp_cache_delete($cache_key, 'themes');

			$templates = array_merge($templates, $this->templates);

			wp_cache_add($cache_key, $templates, 'themes', 1800);

			return $attr;
		}

		public function view_template($template) {
			if (is_search()) {
				return $template;
			}
			global $post;

			if (!$post) {
				return $template;
			}

			if (
				!isset(
					$this->templates[
						get_post_meta($post->ID, '_wp_page_template', true)
					],
				)
			) {
				return $template;
			}

			$filepath = apply_filters(
				'page_template_plugin_dir_path',
				MAXI_PLUGIN_DIR_PATH . 'templates/',
			);

			$file =
				$filepath . get_post_meta($post->ID, '_wp_page_template', true);

			if (file_exists($file)) {
				return $file;
			}

			return $template;
		}
	}
endif;
