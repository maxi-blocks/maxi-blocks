<?php
/**
 * MaxiBlocks System Status Report Class
 */

if (!defined('ABSPATH')) {
	exit();
}

require_once plugin_dir_path(__FILE__) . 'frontend-assets.php';

if (!class_exists('MaxiBlocks_System_Status_Report')):
	class MaxiBlocks_System_Status_Report {
		/**
		 * Enqueue required scripts and styles for the status report
		 */
		public function enqueue_status_report_assets() {
			// Register and enqueue status report styles
			wp_register_style(
				'maxi-status-report',
				plugin_dir_url(__FILE__) . 'styles.css',
				[],
				MAXI_PLUGIN_VERSION,
			);
			wp_enqueue_style('maxi-status-report');

			// Register and enqueue status report script
			wp_register_script(
				'maxi-status-report',
				plugin_dir_url(__FILE__) . 'index.js',
				[],
				MAXI_PLUGIN_VERSION,
				[
					'strategy' => 'defer',
					'in_footer' => true,
				],
			);
			wp_enqueue_script('maxi-status-report');
		}

		/**
		 * Generate the complete status report HTML
		 */
		public function generate_status_report() {
			// Verify user has adequate permissions
			if (!current_user_can('manage_options')) {
				return esc_html__('You do not have permission to access this information.', 'maxi-blocks');
			}

			// Enqueue required assets
			$this->enqueue_status_report_assets();

			// Get system data
			global $wpdb;
			$mu_plugins = get_mu_plugins();
			$plugins = get_plugins();
			$active = get_option('active_plugins', []);

			$theme_data = wp_get_theme();
			$theme = esc_html($theme_data->get('Name') . ' ' . $theme_data->get('Version'));

			// Handle parent theme correctly
			$parent_theme_object = $theme_data->parent();
			$parent_theme = $parent_theme_object ?
				esc_html($parent_theme_object->get('Name') . ' ' . $parent_theme_object->get('Version')) :
				esc_html__('None', 'maxi-blocks');

			// Yes/no specifics
			$ismulti = is_multisite()
				? esc_html__('Yes', 'maxi-blocks')
				: esc_html__('No', 'maxi-blocks');
			$safemode = ini_get('safe_mode')
				? esc_html__('Yes', 'maxi-blocks')
				: esc_html__('No', 'maxi-blocks');
			$wpdebug = defined('WP_DEBUG')
				? (WP_DEBUG
					? esc_html__('Enabled', 'maxi-blocks')
					: esc_html__('Disabled', 'maxi-blocks'))
				: esc_html__('Not Set', 'maxi-blocks');
			$errdisp =
				ini_get('display_errors') != false
					? esc_html__('On', 'maxi-blocks')
					: esc_html__('Off', 'maxi-blocks');
			$jquchk = wp_script_is('jquery', 'registered')
				? esc_html($GLOBALS['wp_scripts']->registered['jquery']->ver)
				: esc_html__('n/a', 'maxi-blocks');
			$hascurl = function_exists('curl_init')
				? esc_html__('Supports cURL.', 'maxi-blocks')
				: esc_html__('Does not support cURL.', 'maxi-blocks');
			$openssl = extension_loaded('openssl')
				? esc_html__('OpenSSL installed.', 'maxi-blocks')
				: esc_html__('OpenSSL not installed.', 'maxi-blocks');

			// Language settings
			$site_lang = esc_html(get_bloginfo('language'));
			$site_char = esc_html(get_bloginfo('charset'));
			$site_text_dir = is_rtl() ? 'rtl' : 'ltr';

			$content =
				'<div class="maxi-dashboard_main-content maxi-dashboard_main-content-status">';
			$content .= '<div class="maxi-dashboard_main-content-settings">';

			// System Report Header
			$content .= '<h1>' . esc_html__('System status', 'maxi-blocks') . '</h1>';
			$content .=
				'<p>' .
				esc_html__(
					'This report provides information about your WordPress environment and server configuration.',
					'maxi-blocks',
				) .
				'</p>';

			// Copy Report Button
			$content .=
				'<button type="button" id="maxi-copy-report" class="button button-primary maxi-dashboard_copy-report-button">' .
				esc_html__('Copy report to clipboard', 'maxi-blocks') .
				'</button>';

			// Download Report Button
			$site_domain = str_replace(
				['http://', 'https://', 'www.'],
				'',
				get_site_url(),
			);
			$site_domain = preg_replace('/[^a-zA-Z0-9_-]/', '_', $site_domain);
			$date = date('d_m_Y');
			$time = date('H_i_s');
			$filename = "MaxiBlocks_Status_Report_{$site_domain}_{$date}_{$time}.txt";

			$button_html = sprintf(
				'<button type="button" id="maxi-download-report" class="button button-primary" data-filename="%s">%s</button>',
				esc_attr($filename),
				esc_html__('Download report', 'maxi-blocks'),
			);

			$content .= wp_kses($button_html, maxi_blocks_allowed_html());

			$content .=
				'<div id="maxi-copy-success" class="notice notice-success" style="display:none;"><p>' .
				esc_html__('Report copied to clipboard', 'maxi-blocks') .
				'</p></div>';

			// Hidden textarea for copy functionality
			$content .=
				'<textarea readonly="readonly" id="maxi-copy-report-content" style="display:none;">';
			$content .= esc_textarea($this->generate_report_text([
				'mu_plugins' => $mu_plugins,
				'plugins' => $plugins,
				'active' => $active,
				'theme' => $theme,
				'parent_theme' => $parent_theme,
				'ismulti' => $ismulti,
				'safemode' => $safemode,
				'wpdebug' => $wpdebug,
				'jquchk' => $jquchk,
				'site_lang' => $site_lang,
				'site_char' => $site_char,
				'site_text_dir' => $site_text_dir,
				'hascurl' => $hascurl,
				'openssl' => $openssl,
			]));
			$content .= '</textarea>';

			$content .= '</div>';

			// Start Status Table
			$content .= '<div id="maxi-status-wrapper">';
			$content .= '<table class="maxi-status-table">';

			// MaxiBlocks Plugin Section (moved to top)
			$content .= $this->generate_maxiblocks_section();

			// Server Environment Section
			$content .= $this->generate_server_environment_section([
				'php_version' => PHP_VERSION,
				'safemode' => $safemode,
				'memory_limit' => ini_get('memory_limit'),
				'post_max_size' => ini_get('post_max_size'),
				'max_execution_time' => ini_get('max_execution_time'),
				'upload_max_filesize' => ini_get('upload_max_filesize'),
				'max_input_time' => ini_get('max_input_time'),
				'max_input_vars' => ini_get('max_input_vars'),
				'errdisp' => $errdisp,
				'cookie_path' => ini_get('session.cookie_path'),
				'save_path' => ini_get('session.save_path'),
				'hascurl' => $hascurl,
				'openssl' => $openssl,
			]);

			// Theme Information Section
			$content .= $this->generate_theme_information_section();

			// WordPress Environment Section
			$content .= $this->generate_wordpress_environment_section([
				'wp_version' => get_bloginfo('version'),
				'permalink_structure' => get_option('permalink_structure'),
				'theme' => $theme,
				'parent_theme' => $parent_theme,
				'wpdebug' => $wpdebug,
				'wp_memory_limit' => WP_MEMORY_LIMIT,
				'jquchk' => $jquchk,
				'site_lang' => $site_lang,
				'site_char' => $site_char,
				'site_text_dir' => $site_text_dir,
				'site_url' => site_url(),
				'home_url' => home_url(),
				'plugins' => $plugins,
				'active' => $active,
				'mu_plugins' => $mu_plugins,
			]);

			// Plugin Information Section
			if ($plugins && $mu_plugins) {
				$content .= $this->generate_plugin_information_section(
					$plugins,
					$mu_plugins,
					$active,
				);
			}

			// Frontend Assets Section
			$content .= '<tbody id="maxi-frontend-assets"></tbody>';

			$content .= '</table>';
			$content .= '</div>'; // Close maxi-status-wrapper

			// Add translations for JavaScript
			wp_localize_script('maxi-status-report', 'MaxiSystemReport', [
				'i18n' => [
					'frontendAssets' => __('Frontend Assets', 'maxi-blocks'),
					'cssFiles' => __('CSS Files', 'maxi-blocks'),
					'jsFiles' => __('JavaScript Files', 'maxi-blocks'),
					'errorLoadingAssets' => __(
						'Error loading frontend assets',
						'maxi-blocks',
					),
				],
			]);

			$content .= '</div>'; // maxi-dashboard_main-content-settings
			$content .= '</div>'; // maxi-dashboard_main-content

			return $content;
		}

		/**
		 * Helper method to convert memory values to MB
		 */
		private function convert_to_mb($value) {
			$value = trim($value);
			$last = strtolower($value[strlen($value) - 1]);
			$value = (int) $value;

			switch ($last) {
				case 'g':
					$value *= 1024;
					break;
				case 'k':
					$value /= 1024;
					break;
				case 'm':
					// Value already in MB
					break;
			}

			return $value;
		}

		/**
		 * Helper method to generate a status row
		 */
		private function generate_status_row(
			$setting,
			$recommended,
			$actual,
			$is_ok
		) {
			$status = $is_ok
				? '<td class="status-ok"><span>' .
					esc_html__('OK', 'maxi-blocks') .
					'</span></td>'
				: '<td class="status-warning"><span>' .
					esc_html__('Warning', 'maxi-blocks') .
					'</span></td>';

			return '<tr>' .
				'<td>' .
				esc_html($setting) .
				'</td>' .
				'<td>' .
				esc_html($recommended) .
				'</td>' .
				'<td>' .
				esc_html($actual) .
				'</td>' .
				$status .
				'</tr>';
		}

		/**
		 * Add this helper method to detect localhost
		 */
		private function is_localhost() {
			$server_name = strtolower(isset($_SERVER['SERVER_NAME']) ? sanitize_text_field($_SERVER['SERVER_NAME']) : '');
			$remote_addr = isset($_SERVER['REMOTE_ADDR']) ? sanitize_text_field($_SERVER['REMOTE_ADDR']) : '';

			return in_array($server_name, ['localhost', '127.0.0.1', '::1']) ||
				strpos($remote_addr, '127.0.') === 0 ||
				$remote_addr === '::1' ||
				strpos($server_name, '.local') !== false ||
				strpos($server_name, '.test') !== false;
		}

		/**
		 * Generates the server environment section of the status table
		 */
		public function generate_server_environment_section($data) {
			global $wpdb;
			$content =
				'<tr><th colspan="4">' .
				esc_html__('Server Environment', 'maxi-blocks') .
				'</th></tr>';
			$content .= '<tr class="header-row">';
			$content .= '<td>' . esc_html__('Setting', 'maxi-blocks') . '</td>';
			$content .= '<td>' . esc_html__('Recommended', 'maxi-blocks') . '</td>';
			$content .= '<td>' . esc_html__('Actual', 'maxi-blocks') . '</td>';
			$content .= '<td>' . esc_html__('Status', 'maxi-blocks') . '</td>';
			$content .= '</tr>';

			// Server Software - Sanitize server information
			$server_software = isset($_SERVER['SERVER_SOFTWARE']) ?
				sanitize_text_field($_SERVER['SERVER_SOFTWARE']) : '';
			$content .= $this->generate_status_row(
				esc_html__('Server Software', 'maxi-blocks'),
				'-',
				esc_html($server_software),
				true,
			);

			// Operating System - Limit to OS name for security
			$os = function_exists('php_uname') ? php_uname('s') : PHP_OS;
			$content .= $this->generate_status_row(
				esc_html__('Operating System', 'maxi-blocks'),
				'-',
				esc_html($os),
				true,
			);

			// Architecture
			$architecture = PHP_INT_SIZE === 8 ? 'x64' : 'x86';
			$content .= $this->generate_status_row(
				esc_html__('Architecture', 'maxi-blocks'),
				'-',
				esc_html($architecture),
				true,
			);

			// PHP Version
			$content .= $this->generate_status_row(
				esc_html__('PHP Version', 'maxi-blocks'),
				'8.0+',
				esc_html($data['php_version']),
				version_compare($data['php_version'], '8.0', '>='),
			);

			// Database Version and Type
			$mysql_version = $wpdb->get_var('SELECT VERSION()');
			$is_mariadb =
				strpos(strtolower($mysql_version), 'mariadb') !== false;

			if ($is_mariadb) {
				preg_match('/\d+\.\d+\.\d+/', $mysql_version, $matches);
				$db_version = $matches[0] ?? '0.0.0';
				$db_type = 'MariaDB';
				$is_supported = version_compare($db_version, '10.4', '>=');
				$recommended = '10.4+';
			} else {
				$db_version = $mysql_version;
				$db_type = 'MySQL';
				$is_supported = version_compare($db_version, '8.0', '>=');
				$recommended = '8.0+';
			}

			$content .= $this->generate_status_row(
				esc_html__('Database Type', 'maxi-blocks'),
				esc_html($recommended),
				esc_html($db_type . ' ' . $db_version),
				$is_supported,
			);

			// SSL/HTTPS Status
			$is_ssl = is_ssl();
			$content .= $this->generate_status_row(
				esc_html__('SSL/HTTPS', 'maxi-blocks'),
				esc_html__('Enabled', 'maxi-blocks'),
				$is_ssl
					? esc_html__('Enabled', 'maxi-blocks')
					: esc_html__('Disabled', 'maxi-blocks'),
				$is_ssl || $this->is_localhost(),
			);

			// Memory Limit
			$memory_limit = $this->convert_to_mb($data['memory_limit']);
			$content .= $this->generate_status_row(
				esc_html__('Memory Limit', 'maxi-blocks'),
				'256MB',
				esc_html($data['memory_limit']),
				$memory_limit >= 256,
			);

			// Post Max Size
			$post_max_size = $this->convert_to_mb($data['post_max_size']);
			$content .= $this->generate_status_row(
				esc_html__('Post Max Size', 'maxi-blocks'),
				'128MB',
				esc_html($data['post_max_size']),
				$post_max_size >= 128,
			);

			// Max Execution Time
			$content .= $this->generate_status_row(
				esc_html__('Max Execution Time', 'maxi-blocks'),
				'60',
				esc_html($data['max_execution_time']),
				$data['max_execution_time'] >= 60,
			);

			// Max Input Time
			$content .= $this->generate_status_row(
				esc_html__('Max Input Time', 'maxi-blocks'),
				'60',
				esc_html($data['max_input_time']),
				$data['max_input_time'] >= 60,
			);

			// Upload Max Filesize
			$upload_max = $this->convert_to_mb($data['upload_max_filesize']);
			$content .= $this->generate_status_row(
				esc_html__('Upload Max Filesize', 'maxi-blocks'),
				'64MB',
				esc_html($data['upload_max_filesize']),
				$upload_max >= 64,
			);

			// Max Input Vars
			$content .= $this->generate_status_row(
				esc_html__('Max Input Vars', 'maxi-blocks'),
				'8000',
				esc_html($data['max_input_vars']),
				$data['max_input_vars'] >= 8000,
			);

			// cURL
			$content .= $this->generate_status_row(
				'cURL',
				esc_html__('Enabled', 'maxi-blocks'),
				esc_html($data['hascurl']),
				strpos($data['hascurl'], 'Supports') !== false,
			);

			// OpenSSL
			$content .= $this->generate_status_row(
				'OpenSSL',
				esc_html__('Installed', 'maxi-blocks'),
				esc_html($data['openssl']),
				strpos($data['openssl'], 'installed') !== false,
			);

			// Is Localhost
			$is_localhost = $this->is_localhost();
			$content .= $this->generate_status_row(
				esc_html__('Environment', 'maxi-blocks'),
				'-',
				$is_localhost
					? esc_html__('Local', 'maxi-blocks')
					: esc_html__('Production', 'maxi-blocks'),
				true,
			);

			return $content;
		}

		/**
		 * Generates the WordPress environment section of the status table
		 */
		public function generate_wordpress_environment_section($data) {
			$content =
				'<tr><th colspan="4">' .
				__('WordPress Environment', 'maxi-blocks') .
				'</th></tr>';
			$content .= '<tr class="header-row">';
			$content .= '<td>' . __('Setting', 'maxi-blocks') . '</td>';
			$content .= '<td>' . __('Recommended', 'maxi-blocks') . '</td>';
			$content .= '<td>' . __('Actual', 'maxi-blocks') . '</td>';
			$content .= '<td>' . __('Status', 'maxi-blocks') . '</td>';
			$content .= '</tr>';

			// WordPress Version
			$content .= $this->generate_status_row(
				__('WordPress Version', 'maxi-blocks'),
				'6.2.2+',
				$data['wp_version'],
				version_compare($data['wp_version'], '6.2.2', '>='),
			);

			// Multisite Status
			$is_multisite = is_multisite();
			$multisite_type = '';
			if ($is_multisite) {
				$multisite_type =
					defined('SUBDOMAIN_INSTALL') && SUBDOMAIN_INSTALL
						? __('Subdomain', 'maxi-blocks')
						: __('Subfolder', 'maxi-blocks');
			}
			$content .= $this->generate_status_row(
				__('Multisite', 'maxi-blocks'),
				'-',
				$is_multisite
					? sprintf(
						__('Enabled (%s)', 'maxi-blocks'),
						$multisite_type,
					)
					: __('Disabled', 'maxi-blocks'),
				true,
			);

			// Site URL
			$content .= $this->generate_status_row(
				__('Site URL', 'maxi-blocks'),
				'-',
				$data['site_url'],
				true,
			);

			// Home URL
			$content .= $this->generate_status_row(
				__('Home URL', 'maxi-blocks'),
				'-',
				$data['home_url'],
				true,
			);

			// Blog URL (if different from home URL)
			if (get_option('page_for_posts')) {
				$blog_url = get_permalink(get_option('page_for_posts'));
				$content .= $this->generate_status_row(
					__('Blog URL', 'maxi-blocks'),
					'-',
					$blog_url,
					true,
				);
			}

			// Language
			$content .= $this->generate_status_row(
				__('Site Language', 'maxi-blocks'),
				'-',
				$data['site_lang'],
				true,
			);

			// Charset
			$content .= $this->generate_status_row(
				__('Site Charset', 'maxi-blocks'),
				'UTF-8',
				$data['site_char'],
				$data['site_char'] === 'UTF-8',
			);

			// Timezone
			$timezone = wp_timezone_string();
			$content .= $this->generate_status_row(
				__('Timezone', 'maxi-blocks'),
				'-',
				$timezone,
				true,
			);

			// Text Direction
			$content .= $this->generate_status_row(
				__('Text Direction', 'maxi-blocks'),
				'-',
				$data['site_text_dir'],
				true,
			);

			// Permalinks
			$permalink_structure = get_option('permalink_structure');
			$permalink_display = empty($permalink_structure)
				? __('Plain', 'maxi-blocks')
				: sprintf(
					__('Pretty Permalinks (%s)', 'maxi-blocks'),
					$permalink_structure,
				);
			$content .= $this->generate_status_row(
				__('Permalinks', 'maxi-blocks'),
				__('Pretty Permalinks', 'maxi-blocks'),
				$permalink_display,
				!empty($permalink_structure),
			);

			// Allowed File Types
			$allowed_mime_types = get_allowed_mime_types();
			$common_types = array_filter($allowed_mime_types, function ($mime) {
				return strpos($mime, 'image/') !== false ||
					strpos($mime, 'video/') !== false ||
					strpos($mime, 'audio/') !== false ||
					strpos($mime, 'application/pdf') !== false;
			});

			$file_types = array_reduce(
				array_keys($common_types),
				function ($carry, $type) {
					$extensions = explode('|', $type);
					return array_merge($carry, $extensions);
				},
				[],
			);

			$content .= $this->generate_status_row(
				__('Allowed Media Types', 'maxi-blocks'),
				__('Common media formats', 'maxi-blocks'),
				implode(', ', $file_types),
				!empty($file_types),
			);

			// jQuery Version
			$content .= $this->generate_status_row(
				__('jQuery Version', 'maxi-blocks'),
				'1.12+',
				$data['jquchk'],
				version_compare($data['jquchk'], '1.12', '>='),
			);

			// React Version
			$wp_scripts = wp_scripts();
			$react_version =
				$wp_scripts->registered['react']->ver ??
				__('Not Found', 'maxi-blocks');
			$content .= $this->generate_status_row(
				__('React Version', 'maxi-blocks'),
				'17.0+',
				$react_version,
				version_compare($react_version, '17.0', '>='),
			);

			// AJAX Status
			$content .= $this->generate_status_row(
				__('WordPress AJAX', 'maxi-blocks'),
				__('Working', 'maxi-blocks'),
				$this->test_ajax_status()
					? __('Working', 'maxi-blocks')
					: __('Not Working', 'maxi-blocks'),
				$this->test_ajax_status(),
			);

			// WP Memory Limit
			$wp_memory = $this->convert_to_mb($data['wp_memory_limit']);
			$content .= $this->generate_status_row(
				__('WP Memory Limit', 'maxi-blocks'),
				'40MB',
				$data['wp_memory_limit'],
				$wp_memory >= 40,
			);

			// WP Debug Mode with Log Status
			$debug_status = 'Disabled';
			if (defined('WP_DEBUG') && WP_DEBUG) {
				$debug_status = 'Enabled';
				if (defined('WP_DEBUG_LOG') && WP_DEBUG_LOG) {
					$log_path = WP_CONTENT_DIR . '/debug.log';
					if (defined('WP_DEBUG_LOG') && is_string(WP_DEBUG_LOG)) {
						$log_path = WP_DEBUG_LOG;
					}
					$debug_status .= ' (Log: ' . $log_path . ')';
				}
			}

			$content .= $this->generate_status_row(
				__('WP Debug Mode', 'maxi-blocks'),
				__('Disabled', 'maxi-blocks'),
				$debug_status,
				$debug_status === 'Disabled',
			);

			// WordPress Paths and Permissions
			$content .= $this->generate_status_row(
				__('WP Directory', 'maxi-blocks'),
				__('Readable', 'maxi-blocks'),
				sprintf(
					'%s (%s)',
					ABSPATH,
					$this->get_directory_permission(ABSPATH),
				),
				is_readable(ABSPATH),
			);

			$content .= $this->generate_status_row(
				__('WP Content Directory', 'maxi-blocks'),
				__('Readable/Writable', 'maxi-blocks'),
				sprintf(
					'%s (%s)',
					WP_CONTENT_DIR,
					$this->get_directory_permission(WP_CONTENT_DIR),
				),
				is_readable(WP_CONTENT_DIR) && is_writable(WP_CONTENT_DIR),
			);

			$content .= $this->generate_status_row(
				__('WP Plugin Directory', 'maxi-blocks'),
				__('Readable/Writable', 'maxi-blocks'),
				sprintf(
					'%s (%s)',
					WP_PLUGIN_DIR,
					$this->get_directory_permission(WP_PLUGIN_DIR),
				),
				is_readable(WP_PLUGIN_DIR) && is_writable(WP_PLUGIN_DIR),
			);

			$content .= $this->generate_status_row(
				__('WP Themes Directory', 'maxi-blocks'),
				__('Readable/Writable', 'maxi-blocks'),
				sprintf(
					'%s (%s)',
					get_theme_root(),
					$this->get_directory_permission(get_theme_root()),
				),
				is_readable(get_theme_root()) && is_writable(get_theme_root()),
			);

			// Get uploads directory info
			$uploads_dir = wp_upload_dir();

			$content .= $this->generate_status_row(
				__('WP Uploads Directory', 'maxi-blocks'),
				__('Readable/Writable', 'maxi-blocks'),
				sprintf(
					'%s (%s)',
					$uploads_dir['basedir'],
					$this->get_directory_permission($uploads_dir['basedir']),
				),
				is_readable($uploads_dir['basedir']) &&
					is_writable($uploads_dir['basedir']),
			);

			// Add a separator for plugins
			$content .= '<tr><td colspan="4" style="padding: 0;"></td></tr>';
			$content .=
				'<tr><td colspan="4"><strong>' .
				__('Plugin Status', 'maxi-blocks') .
				'</strong></td></tr>';

			// Active Plugins
			if ($data['plugins']) {
				$content .= '<tr><td colspan="4" class="plugin-section">';
				$content .=
					'<strong>' .
					__('Active Plugins', 'maxi-blocks') .
					' (' .
					count($data['active']) .
					')</strong><br>';
				foreach ($data['plugins'] as $plugin_path => $plugin) {
					if (in_array($plugin_path, $data['active'])) {
						$content .=
							$plugin['Name'] . ' ' . $plugin['Version'] . '<br>';
					}
				}
				$content .= '</td></tr>';

				// Inactive Plugins
				$inactive = array_diff(
					array_keys($data['plugins']),
					$data['active'],
				);
				if (!empty($inactive)) {
					$content .= '<tr><td colspan="4" class="plugin-section">';
					$content .=
						'<strong>' .
						__('Inactive Plugins', 'maxi-blocks') .
						' (' .
						count($inactive) .
						')</strong><br>';
					foreach ($inactive as $plugin_path) {
						$plugin = $data['plugins'][$plugin_path];
						$content .=
							$plugin['Name'] . ' ' . $plugin['Version'] . '<br>';
					}
					$content .= '</td></tr>';
				}
			}

			return $content;
		}

		/**
		 * Generates the plugin information section of the status table
		 */
		public function generate_plugin_information_section(
			$plugins,
			$mu_plugins,
			$active
		) {
			$content =
				'<tr><th colspan="4">' .
				__('Plugin Information', 'maxi-blocks') .
				'</th></tr>';

			// Must-Use Plugins
			if ($mu_plugins) {
				$content .= '<tr><td colspan="4" class="plugin-section">';
				$content .=
					'<strong>' .
					__('Must-Use Plugins', 'maxi-blocks') .
					' (' .
					count($mu_plugins) .
					')</strong><br>';
				foreach ($mu_plugins as $mu_plugin) {
					$content .=
						$mu_plugin['Name'] .
						' ' .
						$mu_plugin['Version'] .
						'<br>';
				}
				$content .= '</td></tr>';
			}

			// Active Plugins
			if ($plugins) {
				$content .= '<tr><td colspan="4" class="plugin-section">';
				$content .=
					'<strong>' .
					__('Active Plugins', 'maxi-blocks') .
					' (' .
					count($active) .
					')</strong><br>';
				foreach ($plugins as $plugin_path => $plugin) {
					if (in_array($plugin_path, $active)) {
						$content .=
							$plugin['Name'] . ' ' . $plugin['Version'] . '<br>';
					}
				}
				$content .= '</td></tr>';

				// Inactive Plugins
				$inactive = array_diff(array_keys($plugins), $active);
				if (!empty($inactive)) {
					$content .= '<tr><td colspan="4" class="plugin-section">';
					$content .=
						'<strong>' .
						__('Inactive Plugins', 'maxi-blocks') .
						' (' .
						count($inactive) .
						')</strong><br>';
					foreach ($inactive as $plugin_path) {
						$plugin = $plugins[$plugin_path];
						$content .=
							$plugin['Name'] . ' ' . $plugin['Version'] . '<br>';
					}
					$content .= '</td></tr>';
				}
			}

			return $content;
		}

		/**
		 * Generates the theme information section of the status table
		 */
		private function generate_theme_information_section() {
			$theme = wp_get_theme();
			$is_block_theme = function_exists('wp_is_block_theme')
				? wp_is_block_theme()
				: false;
			$parent_theme = $theme->parent();

			$content =
				'<tr><th colspan="4">' .
				__('Theme Information', 'maxi-blocks') .
				'</th></tr>';
			$content .= '<tr class="header-row">';
			$content .= '<td>' . __('Setting', 'maxi-blocks') . '</td>';
			$content .= '<td>' . __('Recommended', 'maxi-blocks') . '</td>';
			$content .= '<td>' . __('Actual', 'maxi-blocks') . '</td>';
			$content .= '<td>' . __('Status', 'maxi-blocks') . '</td>';
			$content .= '</tr>';

			// Theme Name
			$content .= $this->generate_status_row(
				__('Theme Name', 'maxi-blocks'),
				'-',
				$theme->get('Name'),
				true,
			);

			// Theme Version
			$content .= $this->generate_status_row(
				__('Version', 'maxi-blocks'),
				'-',
				$theme->get('Version'),
				true,
			);

			// Theme Author
			$content .= $this->generate_status_row(
				__('Author', 'maxi-blocks'),
				'-',
				wp_strip_all_tags($theme->get('Author') ?? ''),
				true,
			);

			// Author Website
			$content .= $this->generate_status_row(
				__('Author Website', 'maxi-blocks'),
				'-',
				$theme->get('AuthorURI'),
				true,
			);

			// Parent Theme
			$content .= $this->generate_status_row(
				__('Parent Theme', 'maxi-blocks'),
				'-',
				$parent_theme
					? $parent_theme->get('Name') .
						' ' .
						$parent_theme->get('Version')
					: __('None', 'maxi-blocks'),
				true,
			);

			// Block Theme
			$content .= $this->generate_status_row(
				__('Block Theme', 'maxi-blocks'),
				__('Yes', 'maxi-blocks'),
				$is_block_theme
					? __('Yes', 'maxi-blocks')
					: __('No', 'maxi-blocks'),
				$is_block_theme,
			);

			// Theme Directory
			$content .= $this->generate_status_row(
				__('Theme Directory', 'maxi-blocks'),
				'-',
				get_template_directory(),
				true,
			);

			return $content;
		}

		/**
		 * Generates the MaxiBlocks plugin section of the status table
		 */
		private function generate_maxiblocks_section() {
			global $wpdb;

			$content =
				'<tr><th colspan="4">' .
				esc_html__('MaxiBlocks Plugin', 'maxi-blocks') .
				'</th></tr>';
			$content .= '<tr class="header-row">';
			$content .= '<td>' . esc_html__('Setting', 'maxi-blocks') . '</td>';
			$content .= '<td>' . esc_html__('Required', 'maxi-blocks') . '</td>';
			$content .= '<td>' . esc_html__('Actual', 'maxi-blocks') . '</td>';
			$content .= '<td>' . esc_html__('Status', 'maxi-blocks') . '</td>';
			$content .= '</tr>';

			// Check General Table
			$general_table = $wpdb->prefix . 'maxi_blocks_general';
			$general_exists = $this->table_exists($general_table);

			$content .= $this->generate_status_row(
				esc_html__('General Table', 'maxi-blocks'),
				esc_html__('Exists', 'maxi-blocks'),
				$general_exists
					? esc_html__('Exists', 'maxi-blocks')
					: esc_html__('Missing', 'maxi-blocks'),
				$general_exists,
			);

			// Check Styles Table
			$styles_table = $wpdb->prefix . 'maxi_blocks_styles_blocks';
			$styles_exists = $this->table_exists($styles_table);

			$content .= $this->generate_status_row(
				esc_html__('Styles Table', 'maxi-blocks'),
				esc_html__('Exists', 'maxi-blocks'),
				$styles_exists
					? esc_html__('Exists', 'maxi-blocks')
					: esc_html__('Missing', 'maxi-blocks'),
				$styles_exists,
			);

			// Check Custom Data Table
			$custom_data_table = $wpdb->prefix . 'maxi_blocks_custom_data_blocks';
			$custom_data_exists = $this->table_exists($custom_data_table);

			$content .= $this->generate_status_row(
				esc_html__('Custom Data Table', 'maxi-blocks'),
				esc_html__('Exists', 'maxi-blocks'),
				$custom_data_exists
					? esc_html__('Exists', 'maxi-blocks')
					: esc_html__('Missing', 'maxi-blocks'),
				$custom_data_exists,
			);

			return $content;
		}

		/**
		 * Helper method to check if table exists
		 */
		private function table_exists($table) {
			global $wpdb;
			$query = $wpdb->prepare('SHOW TABLES LIKE %s', $table);
			return $wpdb->get_var($query) === $table;
		}

		/**
		 * Generates text version of the report for clipboard
		 *
		 * @param array $data Data for the report
		 * @return string The report content
		 */
		public function generate_report_text($data) {
			// Only allow administrators to generate reports
			if (!current_user_can('manage_options')) {
				return esc_html__('You do not have permission to access this information.', 'maxi-blocks');
			}

			$report = "====== BEGIN SYSTEM REPORT ======\n\n";

			// MaxiBlocks Plugin section (moved to top)
			$report .= "--- MaxiBlocks Plugin ---\n";
			global $wpdb;
			$general_table = $wpdb->prefix . 'maxi_blocks_general';
			$styles_table = $wpdb->prefix . 'maxi_blocks_styles_blocks';
			$custom_data_table = $wpdb->prefix . 'maxi_blocks_custom_data_blocks';

			$report .=
				'General Table: ' .
				($this->table_exists($general_table) ? 'Exists' : 'Missing') .
				"\n";
			$report .=
				'Styles Table: ' .
				($this->table_exists($styles_table) ? 'Exists' : 'Missing') .
				"\n";
			$report .=
				'Custom Data Table: ' .
				($this->table_exists($custom_data_table) ? 'Exists' : 'Missing') .
				"\n\n";

			// Server Environment - limit sensitive information
			$report .= "--- Server Environment ---\n";
			$report .=
				'Environment: ' .
				($this->is_localhost() ? 'Local' : 'Production') .
				"\n";

			// Sanitize server software info
			$server_software = isset($_SERVER['SERVER_SOFTWARE']) ?
				sanitize_text_field($_SERVER['SERVER_SOFTWARE']) : 'Unknown';
			// Redact version numbers for security
			$server_software = preg_replace('/[0-9]+\.[0-9]+\.[0-9]+/', 'x.x.x', $server_software);

			$report .= 'Server Software: ' . $server_software . "\n";

			// Limit OS information to just the name for security
			if (function_exists('php_uname')) {
				$os_name = php_uname('s');
				$report .= 'Operating System: ' . $os_name . "\n";
			} else {
				$report .= 'Operating System: ' . PHP_OS . "\n";
			}

			$report .=
				'Architecture: ' . (PHP_INT_SIZE === 8 ? 'x64' : 'x86') . "\n";
			$report .= 'PHP Version: ' . PHP_VERSION . "\n";

			// Database info - Redact minor version numbers
			$mysql_version = $wpdb->get_var('SELECT VERSION()');
			$is_mariadb =
				strpos(strtolower($mysql_version), 'mariadb') !== false;
			if ($is_mariadb) {
				preg_match('/\d+\.\d+/', $mysql_version, $matches); // Get major.minor version only
				$db_version = $matches[0] ?? 'Unknown';
				$report .=
					'Database: MariaDB ' .
					$db_version .
					' (Required: 10.4+)' .
					"\n";
			} else {
				preg_match('/\d+\.\d+/', $mysql_version, $matches); // Get major.minor version only
				$db_version = $matches[0] ?? $mysql_version;
				$report .=
					'Database: MySQL ' .
					$db_version .
					' (Required: 8.0+)' .
					"\n";
			}

			$report .=
				'SSL/HTTPS: ' .
				(is_ssl() ? 'Enabled' : 'Disabled') .
				($this->is_localhost()
					? ' (not required for local environment)'
					: '') .
				"\n";
			$report .= 'Safe Mode: ' . $data['safemode'] . "\n";
			$report .= 'cURL: ' . $data['hascurl'] . "\n";
			$report .= 'OpenSSL: ' . $data['openssl'] . "\n\n";

			// Theme Information
			$theme = wp_get_theme();
			$is_block_theme = function_exists('wp_is_block_theme')
				? wp_is_block_theme()
				: false;
			$parent_theme = $theme->parent();

			$report .= "--- Theme Information ---\n";
			$report .= 'Theme Name: ' . esc_html($theme->get('Name')) . "\n";
			$report .= 'Version: ' . esc_html($theme->get('Version')) . "\n";
			$report .= 'Author: ' . esc_html(wp_strip_all_tags($theme->get('Author') ?? '')) . "\n";
			$report .= 'Author Website: ' . esc_url($theme->get('AuthorURI')) . "\n";
			$report .=
				'Parent Theme: ' .
				($parent_theme
					? esc_html($parent_theme->get('Name') . ' ' . $parent_theme->get('Version'))
					: 'None') .
				"\n";
			$report .=
				'Block Theme: ' . ($is_block_theme ? 'Yes' : 'No') . "\n";

			// Redact full server path for security
			$template_dir = get_template_directory();
			$wp_root = str_replace('\\', '/', ABSPATH);
			$template_dir = str_replace($wp_root, '[WORDPRESS_ROOT]/', str_replace('\\', '/', $template_dir));
			$report .= 'Theme Directory: ' . $template_dir . "\n\n";

			// WordPress Environment
			$report .= "--- WordPress Environment ---\n";
			$report .= 'WordPress Version: ' . get_bloginfo('version') . "\n";
			$report .=
				'SSL/HTTPS: ' .
				(is_ssl()
					? __('Enabled', 'maxi-blocks')
					: __('Disabled', 'maxi-blocks')) .
				"\n";
			$report .= 'Multisite: ' . $data['ismulti'] . "\n";
			if (is_multisite()) {
				$report .=
					'Multisite Type: ' .
					(defined('SUBDOMAIN_INSTALL') && SUBDOMAIN_INSTALL
						? 'Subdomain'
						: 'Subfolder') .
					"\n";
			}

			// Redact full URLs for security in text report
			$site_url_parts = parse_url(site_url());
			$home_url_parts = parse_url(home_url());

			$report .= 'Site URL: ' . esc_url(site_url()) . "\n";
			$report .= 'Home URL: ' . esc_url(home_url()) . "\n";

			if (get_option('page_for_posts')) {
				$report .=
					'Blog URL: ' .
					esc_url(get_permalink(get_option('page_for_posts'))) .
					"\n";
			}
			$report .= 'Current Theme: ' . esc_html($data['theme']) . "\n";
			$report .= 'Parent Theme: ' . esc_html($data['parent_theme']) . "\n";
			$report .= 'WP Debug Mode: ' . esc_html($data['wpdebug']) . "\n";
			$report .= 'Language: ' . esc_html($data['site_lang']) . "\n";
			$report .= 'Charset: ' . esc_html($data['site_char']) . "\n";
			$report .= 'Timezone: ' . esc_html(wp_timezone_string()) . "\n";
			$report .= 'Text Direction: ' . esc_html($data['site_text_dir']) . "\n";
			$report .=
				'Permalinks: ' .
				(empty(get_option('permalink_structure'))
					? 'Plain'
					: 'Pretty Permalinks (' .
						esc_html(get_option('permalink_structure')) .
						')') .
				"\n";
			$report .= 'jQuery Version: ' . esc_html($data['jquchk']) . "\n";
			$wp_scripts = wp_scripts();
			$report .=
				'React Version: ' .
				esc_html($wp_scripts->registered['react']->ver ?? 'Not Found') .
				"\n";

			// Add AJAX status to WordPress Environment section
			$report .=
				'WordPress AJAX: ' .
				($this->test_ajax_status() ? 'Working' : 'Not Working') .
				"\n\n";

			// Plugin Status
			$report .= "--- Plugin Status ---\n";
			if ($data['plugins']) {
				$report .= 'Active Plugins (' . count($data['active']) . "):\n";
				foreach ($data['plugins'] as $plugin_path => $plugin) {
					if (in_array($plugin_path, $data['active'])) {
						$report .=
							'- ' .
							esc_html($plugin['Name']) .
							' ' .
							esc_html($plugin['Version']) .
							"\n";
					}
				}
				$report .= "\n";

				// Add inactive plugins
				$inactive = array_diff(
					array_keys($data['plugins']),
					$data['active'],
				);
				if (!empty($inactive)) {
					$report .= 'Inactive Plugins (' . count($inactive) . "):\n";
					foreach ($inactive as $plugin_path) {
						$plugin = $data['plugins'][$plugin_path];
						$report .=
							'- ' .
							esc_html($plugin['Name']) .
							' ' .
							esc_html($plugin['Version']) .
							"\n";
					}
				}
			}

			// Frontend Assets
			$report .= "\n--- Frontend Assets ---\n";
			$report .= "Loading...\n";

			$report .= "\n====== END SYSTEM REPORT ======";

			// Redact full paths in WordPress Directories Permissions section
			$report .= "\nWordPress Directories Permissions:\n";

			// Helper to redact paths for security
			$redact_path = function($path) {
				$wp_root = str_replace('\\', '/', ABSPATH);
				return str_replace($wp_root, '[WORDPRESS_ROOT]/', str_replace('\\', '/', $path));
			};

			$report .=
				'WP Directory: ' .
				$redact_path(ABSPATH) .
				' (' .
				$this->get_directory_permission(ABSPATH) .
				")\n";
			$report .=
				'WP Content Directory: ' .
				$redact_path(WP_CONTENT_DIR) .
				' (' .
				$this->get_directory_permission(WP_CONTENT_DIR) .
				")\n";
			$report .=
				'WP Plugin Directory: ' .
				$redact_path(WP_PLUGIN_DIR) .
				' (' .
				$this->get_directory_permission(WP_PLUGIN_DIR) .
				")\n";
			$report .=
				'WP Themes Directory: ' .
				$redact_path(get_theme_root()) .
				' (' .
				$this->get_directory_permission(get_theme_root()) .
				")\n";
			$report .=
				'WP Uploads Directory: ' .
				$redact_path(wp_upload_dir()['basedir']) .
				' (' .
				$this->get_directory_permission(wp_upload_dir()['basedir']) .
				")\n";

			// Add Debug Log if available
			$debug_log = $this->get_debug_log_content();
			if ($debug_log) {
				$report .= "\n\n====== DEBUG LOG (LAST 1000 LINES) ======\n\n";
				$report .= $debug_log;
				$report .= "\n\n====== END DEBUG LOG ======";
			}

			return $report;
		}

		/**
		 * Test if WordPress AJAX or REST API is functioning
		 */
		private function test_ajax_status() {
			// First try the REST API
			$rest_url = rest_url('wp/v2/types');
			$rest_response = wp_remote_get($rest_url, [
				'timeout' => 5,
				'sslverify' => !$this->is_localhost(),
			]);

			// If REST API works, we're good
			if (!is_wp_error($rest_response) && wp_remote_retrieve_response_code($rest_response) === 200) {
				return true;
			}

			// Fallback to admin-ajax.php
			$ajax_url = admin_url('admin-ajax.php');
			$ajax_response = wp_remote_get($ajax_url, [
				'timeout' => 5,
				'sslverify' => !$this->is_localhost(),
			]);

			if (is_wp_error($ajax_response)) {
				return false;
			}

			$response_code = wp_remote_retrieve_response_code($ajax_response);

			// For admin-ajax.php, both 200 and 400 responses indicate it's working
			return in_array($response_code, [200, 400], true);
		}

		// Add this helper method to check directory permissions
		private function get_directory_permission($dir) {
			if (!file_exists($dir)) {
				return __('Directory does not exist', 'maxi-blocks');
			}

			$perms = fileperms($dir);
			$readable = is_readable($dir)
				? __('Readable', 'maxi-blocks')
				: __('Not Readable', 'maxi-blocks');
			$writable = is_writable($dir)
				? __('Writable', 'maxi-blocks')
				: __('Not Writable', 'maxi-blocks');

			// Convert file permission to human readable
			$mode = substr(sprintf('%o', $perms), -4);

			return sprintf('%s | %s | %s', $mode, $readable, $writable);
		}

		/**
		 * Get the debug log content in a secure way
		 *
		 * @return string|bool Contents of debug log or false on failure
		 */
		private function get_debug_log_content() {
			// Only allow administrators to view debug logs
			if (!current_user_can('manage_options')) {
				return false;
			}

			if (!defined('WP_DEBUG_LOG') || !WP_DEBUG_LOG) {
				return false;
			}

			$log_path = WP_CONTENT_DIR . '/debug.log';
			if (defined('WP_DEBUG_LOG') && is_string(WP_DEBUG_LOG)) {
				$log_path = WP_DEBUG_LOG;
			}

			// Check if the log file exists and is readable
			if (!file_exists($log_path) || !is_readable($log_path)) {
				return false;
			}

			// Make sure the path is within WordPress directory to prevent path traversal
			$wp_root = str_replace('\\', '/', ABSPATH);
			$log_path_normalized = str_replace('\\', '/', $log_path);

			// If it's an absolute path, make sure it's within WordPress directory
			if (strpos($log_path_normalized, '/') === 0 && strpos($log_path_normalized, $wp_root) !== 0) {
				return false;
			}

			// Use safe reading approach
			$line_count = 1000; // Limit to last 1000 lines
			$file_size = filesize($log_path);

			// If file is empty, return empty string
			if ($file_size === 0) {
				return '';
			}

			// Limit the maximum size to read to prevent excessive memory usage
			$max_size = 5 * 1024 * 1024; // 5MB max
			if ($file_size > $max_size) {
				return esc_html__('Debug log too large to display. Download it manually.', 'maxi-blocks');
			}

			// Read file safely
			$f = fopen($log_path, 'rb');
			if (!$f) {
				return false;
			}

			$lines = [];
			$line_count_found = 0;

			// Read the file line by line from the end
			$pos = $file_size;
			$chunk_size = min($file_size, 4096);

			while ($pos > 0 && $line_count_found < $line_count) {
				$seek_pos = max(0, $pos - $chunk_size);
				$read_size = $pos - $seek_pos;

				fseek($f, $seek_pos);
				$chunk = fread($f, $read_size);

				if ($chunk === false) {
					break;
				}

				// Count how many newlines are in this chunk
				$nl_pos = strrpos($chunk, "\n");

				if ($nl_pos === false) {
					// No newlines in this chunk, continue with the next chunk
					$pos = $seek_pos;
					continue;
				}

				// Split by newlines
				$chunk_lines = explode("\n", $chunk);

				// If we read from the middle of the file, the first line is likely incomplete
				// unless we happened to seek exactly to a newline boundary
				if ($seek_pos > 0 && $nl_pos !== 0) {
					array_shift($chunk_lines);
				}

				// Remove empty lines at the end that may come from splitting
				if (end($chunk_lines) === '') {
					array_pop($chunk_lines);
				}

				// Add lines to our result, respecting the limit
				$lines = array_merge(array_reverse($chunk_lines), $lines);
				$line_count_found = count($lines);

				// If we have more lines than needed, trim them
				if ($line_count_found > $line_count) {
					$lines = array_slice($lines, -$line_count);
					$line_count_found = $line_count;
				}

				$pos = $seek_pos;
			}

			fclose($f);

			// Filter sensitive information from log output
			$filtered_lines = [];
			$patterns = [
				'/password[=:"\'][^"\'&\s]+/i', // Filter passwords
				'/user[=:"\'][^"\'&\s]+/i',     // Filter usernames
				'/key[=:"\'][^"\'&\s]+/i',      // Filter API keys
				'/token[=:"\'][^"\'&\s]+/i',    // Filter tokens
				'/authorization[=:"\'][^"\'&\s]+/i', // Filter auth headers
				'/bearer[=:"\'][^"\'&\s]+/i',   // Filter bearer tokens
			];

			foreach ($lines as $line) {
				$filtered_line = $line;
				foreach ($patterns as $pattern) {
					$filtered_line = preg_replace($pattern, '[REDACTED]', $filtered_line);
				}
				$filtered_lines[] = $filtered_line;
			}

			return implode("\n", $filtered_lines);
		}

		/**
		 * Check only critical system requirements
		 *
		 * @return array Array of critical warnings
		 */
		public function check_critical_requirements() {
			$warnings = [];

			// Check PHP Version
			$php_version = phpversion();
			$required_php = '8.0';
			if (version_compare($php_version, $required_php, '<')) {
				$warnings[] = [
					'setting' => 'PHP Version',
					'recommended' => $required_php . '+',
					'actual' => $php_version,
				];
			}

			// Check Database Type
			global $wpdb;
			$mysql_version = $wpdb->get_var('SELECT VERSION()');
			$is_mariadb = strpos(strtolower($mysql_version), 'mariadb') !== false;

			if ($is_mariadb) {
				preg_match('/\d+\.\d+\.\d+/', $mysql_version, $matches);
				$db_version = $matches[0] ?? '0.0.0';
				if (version_compare($db_version, '10.4', '<')) {
					$warnings[] = [
						'setting' => 'Database Type',
						'recommended' => 'MariaDB 10.4+',
						'actual' => 'MariaDB ' . $db_version,
					];
				}
			} else {
				$db_version = $wpdb->db_version();
				$required_mysql = '8.0';
				if (version_compare($db_version, $required_mysql, '<')) {
					$warnings[] = [
						'setting' => 'Database Type',
						'recommended' => 'MySQL ' . $required_mysql . '+',
						'actual' => 'MySQL ' . $db_version,
					];
				}
			}

			// Check WordPress AJAX
			if (!$this->test_ajax_status()) {
				$warnings[] = [
					'setting' => 'WordPress AJAX',
					'recommended' => 'Working',
					'actual' => 'Not working',
				];
			}

			// Check DB Tables
			global $wpdb;
			$tables_to_check = [
				$wpdb->prefix . 'maxi_blocks_general' => 'General Table',
				$wpdb->prefix . 'maxi_blocks_styles_blocks' => 'Styles Table',
				$wpdb->prefix .
				'maxi_blocks_custom_data_blocks' => 'Custom Data Table',
			];

			foreach ($tables_to_check as $table => $name) {
				if (!$this->table_exists($table)) {
					$warnings[] = [
						'setting' => $name,
						'recommended' => 'Present',
						'actual' => 'Missing',
					];
				}
			}

			return $warnings;
		}
	}
endif;
