<?php
/**
 * MaxiBlocks System Status Report Class
 */

if (!defined('ABSPATH')) {
    exit();
}

require_once plugin_dir_path(__FILE__) . 'frontend-assets.php';

if (!class_exists('MaxiBlocks_System_Status_Report')):
    class MaxiBlocks_System_Status_Report
    {
        /**
         * Enqueue required scripts and styles for the status report
         */
        public function enqueue_status_report_assets()
        {
            // Register and enqueue status report styles
            wp_register_style(
                'maxi-status-report',
                plugin_dir_url(__FILE__) . 'styles.css',
                [],
                MAXI_PLUGIN_VERSION
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
                ]
            );
            wp_enqueue_script('maxi-status-report');
        }

        /**
         * Generate the complete status report HTML
         */
        public function generate_status_report()
        {
            // Enqueue required assets
            $this->enqueue_status_report_assets();

            // Get system data
            global $wpdb;
            $mu_plugins = get_mu_plugins();
            $plugins = get_plugins();
            $active = get_option('active_plugins', []);

            $theme_data = wp_get_theme();
            $theme = $theme_data->Name . ' ' . $theme_data->Version;
            $style_parent_theme = wp_get_theme(get_template());
            $parent_theme = $style_parent_theme->get('Name') . ' ' . $style_parent_theme->get('Version');

            // Yes/no specifics
            $ismulti = is_multisite() ? __('Yes', 'maxi-blocks') : __('No', 'maxi-blocks');
            $safemode = ini_get('safe_mode') ? __('Yes', 'maxi-blocks') : __('No', 'maxi-blocks');
            $wpdebug = defined('WP_DEBUG') ? (WP_DEBUG ? __('Enabled', 'maxi-blocks') : __('Disabled', 'maxi-blocks')) : __('Not Set', 'maxi-blocks');
            $errdisp = ini_get('display_errors') != false ? __('On', 'maxi-blocks') : __('Off', 'maxi-blocks');
            $jquchk = wp_script_is('jquery', 'registered') ? $GLOBALS['wp_scripts']->registered['jquery']->ver : __('n/a', 'maxi-blocks');
            $hascurl = function_exists('curl_init') ? __('Supports cURL.', 'maxi-blocks') : __('Does not support cURL.', 'maxi-blocks');
            $openssl = extension_loaded('openssl') ? __('OpenSSL installed.', 'maxi-blocks') : __('OpenSSL not installed.', 'maxi-blocks');

            // Language settings
            $site_lang = get_bloginfo('language');
            $site_char = get_bloginfo('charset');
            $site_text_dir = is_rtl() ? 'rtl' : 'ltr';

            $content = '<div class="maxi-dashboard_main-content maxi-dashboard_main-content-status">';

            // System Report Header
            $content .= '<h2>' . __('System Status', 'maxi-blocks') . '</h2>';
            $content .= '<p>' . __('This report provides information about your WordPress environment and server configuration.', 'maxi-blocks') . '</p>';

            // Copy Report Button
            $content .= '<button type="button" id="maxi-copy-report" class="button button-primary maxi-dashboard_copy-report-button">' . __('Copy report to clipboard', 'maxi-blocks') . '</button>';

            // Download Report Button
            $site_domain = str_replace(['http://', 'https://', 'www.'], '', get_site_url());
            $site_domain = preg_replace('/[^a-zA-Z0-9_-]/', '_', $site_domain);
            $date = date('d_m_Y');
            $time = date('H_i_s');
            $filename = "MaxiBlocks_Status_Report_{$site_domain}_{$date}_{$time}.txt";

            $button_html = sprintf(
                '<button type="button" id="maxi-download-report" class="button button-primary" data-filename="%s">%s</button>',
                esc_attr($filename),
                esc_html__('Download report', 'maxi-blocks')
            );

            $content .= wp_kses($button_html, maxi_blocks_allowed_html());

            $content .= '<div id="maxi-copy-success" class="notice notice-success" style="display:none;"><p>' . __('Report copied to clipboard', 'maxi-blocks') . '</p></div>';

            // Hidden textarea for copy functionality
            $content .= '<textarea readonly="readonly" id="maxi-copy-report-content" style="display:none;">';
            $content .= $this->generate_report_text([
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
            ]);
            $content .= '</textarea>';

            // Start Status Table
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
                'mu_plugins' => $mu_plugins
            ]);

            // Plugin Information Section
            if ($plugins && $mu_plugins) {
                $content .= $this->generate_plugin_information_section($plugins, $mu_plugins, $active);
            }

            // Frontend Assets Section
            $content .= '<tbody id="maxi-frontend-assets"></tbody>';

            $content .= '</table>';
            $content .= '</div>'; // maxi-dashboard_main-content

            // Add translations for JavaScript
            wp_localize_script('maxi-status-report', 'MaxiSystemReport', [
                'i18n' => [
                    'frontendAssets' => __('Frontend Assets', 'maxi-blocks'),
                    'cssFiles' => __('CSS Files', 'maxi-blocks'),
                    'jsFiles' => __('JavaScript Files', 'maxi-blocks'),
                    'errorLoadingAssets' => __('Error loading frontend assets', 'maxi-blocks'),
                ]
            ]);

            return $content;
        }

        /**
         * Helper method to convert memory values to MB
         */
        private function convert_to_mb($value)
        {
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
        private function generate_status_row($setting, $recommended, $actual, $is_ok)
        {
            $status = $is_ok
                ? '<td class="status-ok"><span>' . __('OK', 'maxi-blocks') . '</span></td>'
                : '<td class="status-warning"><span>' . __('Warning', 'maxi-blocks') . '</span></td>';

            return '<tr>' .
                '<td>' . $setting . '</td>' .
                '<td>' . $recommended . '</td>' .
                '<td>' . $actual . '</td>' .
                $status .
                '</tr>';
        }

        /**
         * Add this helper method to detect localhost
         */
        private function is_localhost()
        {
            $server_name = strtolower($_SERVER['SERVER_NAME'] ?? '');
            $server_addr = $_SERVER['SERVER_ADDR'] ?? '';
            $remote_addr = $_SERVER['REMOTE_ADDR'] ?? '';

            return in_array($server_name, ['localhost', '127.0.0.1', '::1']) ||
                   strpos($server_addr, '127.0.') === 0 ||
                   strpos($remote_addr, '127.0.') === 0 ||
                   strpos($server_name, '.local') !== false ||
                   strpos($server_name, '.test') !== false;
        }

        /**
         * Generates the server environment section of the status table
         */
        public function generate_server_environment_section($data)
        {
            global $wpdb;
            $content = '<tr><th colspan="4">' . __('Server Environment', 'maxi-blocks') . '</th></tr>';
            $content .= '<tr class="header-row">';
            $content .= '<td>' . __('Setting', 'maxi-blocks') . '</td>';
            $content .= '<td>' . __('Recommended', 'maxi-blocks') . '</td>';
            $content .= '<td>' . __('Actual', 'maxi-blocks') . '</td>';
            $content .= '<td>' . __('Status', 'maxi-blocks') . '</td>';
            $content .= '</tr>';

            // Server Software
            $server_software = $_SERVER['SERVER_SOFTWARE'] ?? '';
            $content .= $this->generate_status_row(
                __('Server Software', 'maxi-blocks'),
                '-',
                $server_software,
                true
            );

            // Operating System
            $os = function_exists('php_uname') ? php_uname('s') . ' ' . php_uname('r') : PHP_OS;
            $content .= $this->generate_status_row(
                __('Operating System', 'maxi-blocks'),
                '-',
                $os,
                true
            );

            // Architecture
            $architecture = PHP_INT_SIZE === 8 ? 'x64' : 'x86';
            $content .= $this->generate_status_row(
                __('Architecture', 'maxi-blocks'),
                '-',
                $architecture,
                true
            );

            // PHP Version
            $content .= $this->generate_status_row(
                __('PHP Version', 'maxi-blocks'),
                '8.0+',
                $data['php_version'],
                version_compare($data['php_version'], '9.0', '>='),
            );

            // Database Version and Type
            $mysql_version = $wpdb->get_var('SELECT VERSION()');
            $is_mariadb = strpos(strtolower($mysql_version), 'mariadb') !== false;

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
                __('Database Type', 'maxi-blocks'),
                $recommended,
                $db_type . ' ' . $db_version,
                $is_supported
            );

            // SSL/HTTPS Status
            $is_ssl = is_ssl();
            $content .= $this->generate_status_row(
                __('SSL/HTTPS', 'maxi-blocks'),
                __('Enabled', 'maxi-blocks'),
                $is_ssl ? __('Enabled', 'maxi-blocks') : __('Disabled', 'maxi-blocks'),
                $is_ssl || $this->is_localhost()
            );

            // Memory Limit
            $memory_limit = $this->convert_to_mb($data['memory_limit']);
            $content .= $this->generate_status_row(
                __('Memory Limit', 'maxi-blocks'),
                '256MB',
                $data['memory_limit'],
                $memory_limit >= 256,
            );

            // Post Max Size
            $post_max_size = $this->convert_to_mb($data['post_max_size']);
            $content .= $this->generate_status_row(
                __('Post Max Size', 'maxi-blocks'),
                '128MB',
                $data['post_max_size'],
                $post_max_size >= 128,
            );

            // Max Execution Time
            $content .= $this->generate_status_row(
                __('Max Execution Time', 'maxi-blocks'),
                '60',
                $data['max_execution_time'],
                $data['max_execution_time'] >= 60,
            );

            // Max Input Time
            $content .= $this->generate_status_row(
                __('Max Input Time', 'maxi-blocks'),
                '60',
                $data['max_input_time'],
                $data['max_input_time'] >= 60,
            );

            // Upload Max Filesize
            $upload_max = $this->convert_to_mb($data['upload_max_filesize']);
            $content .= $this->generate_status_row(
                __('Upload Max Filesize', 'maxi-blocks'),
                '64MB',
                $data['upload_max_filesize'],
                $upload_max >= 64,
            );

            // Max Input Vars
            $content .= $this->generate_status_row(
                __('Max Input Vars', 'maxi-blocks'),
                '8000',
                $data['max_input_vars'],
                $data['max_input_vars'] >= 8000,
            );

            // cURL
            $content .= $this->generate_status_row(
                'cURL',
                __('Enabled', 'maxi-blocks'),
                $data['hascurl'],
                strpos($data['hascurl'], 'Supports') !== false,
            );

            // OpenSSL
            $content .= $this->generate_status_row(
                'OpenSSL',
                __('Installed', 'maxi-blocks'),
                $data['openssl'],
                strpos($data['openssl'], 'installed') !== false,
            );

            // Is Localhost
            $is_localhost = $this->is_localhost();
            $content .= $this->generate_status_row(
                __('Environment', 'maxi-blocks'),
                '-',
                $is_localhost ? __('Local', 'maxi-blocks') : __('Production', 'maxi-blocks'),
                true
            );

            return $content;
        }

        /**
         * Generates the WordPress environment section of the status table
         */
        public function generate_wordpress_environment_section($data)
        {
            $content = '<tr><th colspan="4">' . __('WordPress Environment', 'maxi-blocks') . '</th></tr>';
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
                $multisite_type = defined('SUBDOMAIN_INSTALL') && SUBDOMAIN_INSTALL ?
                    __('Subdomain', 'maxi-blocks') :
                    __('Subfolder', 'maxi-blocks');
            }
            $content .= $this->generate_status_row(
                __('Multisite', 'maxi-blocks'),
                '-',
                $is_multisite ? sprintf(__('Enabled (%s)', 'maxi-blocks'), $multisite_type) : __('Disabled', 'maxi-blocks'),
                true
            );

            // Site URL
            $content .= $this->generate_status_row(
                __('Site URL', 'maxi-blocks'),
                '-',
                $data['site_url'],
                true
            );

            // Home URL
            $content .= $this->generate_status_row(
                __('Home URL', 'maxi-blocks'),
                '-',
                $data['home_url'],
                true
            );

            // Blog URL (if different from home URL)
            if (get_option('page_for_posts')) {
                $blog_url = get_permalink(get_option('page_for_posts'));
                $content .= $this->generate_status_row(
                    __('Blog URL', 'maxi-blocks'),
                    '-',
                    $blog_url,
                    true
                );
            }

            // Language
            $content .= $this->generate_status_row(
                __('Site Language', 'maxi-blocks'),
                '-',
                $data['site_lang'],
                true
            );

            // Charset
            $content .= $this->generate_status_row(
                __('Site Charset', 'maxi-blocks'),
                'UTF-8',
                $data['site_char'],
                $data['site_char'] === 'UTF-8'
            );

            // Timezone
            $timezone = wp_timezone_string();
            $content .= $this->generate_status_row(
                __('Timezone', 'maxi-blocks'),
                '-',
                $timezone,
                true
            );

            // Text Direction
            $content .= $this->generate_status_row(
                __('Text Direction', 'maxi-blocks'),
                '-',
                $data['site_text_dir'],
                true
            );

            // Permalinks
            $permalink_structure = get_option('permalink_structure');
            $permalink_display = empty($permalink_structure) ?
                __('Plain', 'maxi-blocks') :
                sprintf(__('Pretty Permalinks (%s)', 'maxi-blocks'), $permalink_structure);
            $content .= $this->generate_status_row(
                __('Permalinks', 'maxi-blocks'),
                __('Pretty Permalinks', 'maxi-blocks'),
                $permalink_display,
                !empty($permalink_structure)
            );

            // Allowed File Types
            $allowed_mime_types = get_allowed_mime_types();
            $common_types = array_filter($allowed_mime_types, function ($mime) {
                return strpos($mime, 'image/') !== false
                    || strpos($mime, 'video/') !== false
                    || strpos($mime, 'audio/') !== false
                    || strpos($mime, 'application/pdf') !== false;
            });

            $file_types = array_reduce(array_keys($common_types), function ($carry, $type) {
                $extensions = explode('|', $type);
                return array_merge($carry, $extensions);
            }, []);

            $content .= $this->generate_status_row(
                __('Allowed Media Types', 'maxi-blocks'),
                __('Common media formats', 'maxi-blocks'),
                implode(', ', $file_types),
                !empty($file_types)
            );

            // jQuery Version
            $content .= $this->generate_status_row(
                __('jQuery Version', 'maxi-blocks'),
                '1.12+',
                $data['jquchk'],
                version_compare($data['jquchk'], '1.12', '>=')
            );

            // React Version
            $wp_scripts = wp_scripts();
            $react_version = $wp_scripts->registered['react']->ver ?? __('Not Found', 'maxi-blocks');
            $content .= $this->generate_status_row(
                __('React Version', 'maxi-blocks'),
                '17.0+',
                $react_version,
                version_compare($react_version, '17.0', '>=')
            );

            // AJAX Status
            $content .= $this->generate_status_row(
                __('WordPress AJAX', 'maxi-blocks'),
                __('Working', 'maxi-blocks'),
                $this->test_ajax_status() ? __('Working', 'maxi-blocks') : __('Not Working', 'maxi-blocks'),
                $this->test_ajax_status()
            );

            // WP Memory Limit
            $wp_memory = $this->convert_to_mb($data['wp_memory_limit']);
            $content .= $this->generate_status_row(
                __('WP Memory Limit', 'maxi-blocks'),
                '40MB',
                $data['wp_memory_limit'],
                $wp_memory >= 40
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
                $debug_status === 'Disabled'
            );

            // WordPress Paths and Permissions
            $content .= $this->generate_status_row(
                __('WP Directory', 'maxi-blocks'),
                __('Readable', 'maxi-blocks'),
                sprintf('%s (%s)', ABSPATH, $this->get_directory_permission(ABSPATH)),
                is_readable(ABSPATH)
            );

            $content .= $this->generate_status_row(
                __('WP Content Directory', 'maxi-blocks'),
                __('Readable/Writable', 'maxi-blocks'),
                sprintf('%s (%s)', WP_CONTENT_DIR, $this->get_directory_permission(WP_CONTENT_DIR)),
                is_readable(WP_CONTENT_DIR) && is_writable(WP_CONTENT_DIR)
            );

            $content .= $this->generate_status_row(
                __('WP Plugin Directory', 'maxi-blocks'),
                __('Readable/Writable', 'maxi-blocks'),
                sprintf('%s (%s)', WP_PLUGIN_DIR, $this->get_directory_permission(WP_PLUGIN_DIR)),
                is_readable(WP_PLUGIN_DIR) && is_writable(WP_PLUGIN_DIR)
            );

            $content .= $this->generate_status_row(
                __('WP Themes Directory', 'maxi-blocks'),
                __('Readable/Writable', 'maxi-blocks'),
                sprintf('%s (%s)', get_theme_root(), $this->get_directory_permission(get_theme_root())),
                is_readable(get_theme_root()) && is_writable(get_theme_root())
            );

            // Get uploads directory info
            $uploads_dir = wp_upload_dir();

            $content .= $this->generate_status_row(
                __('WP Uploads Directory', 'maxi-blocks'),
                __('Readable/Writable', 'maxi-blocks'),
                sprintf('%s (%s)', $uploads_dir['basedir'], $this->get_directory_permission($uploads_dir['basedir'])),
                is_readable($uploads_dir['basedir']) && is_writable($uploads_dir['basedir'])
            );

            // Add a separator for plugins
            $content .= '<tr><td colspan="4" style="padding: 0;"></td></tr>';
            $content .= '<tr><td colspan="4"><strong>' . __('Plugin Status', 'maxi-blocks') . '</strong></td></tr>';

            // Active Plugins
            if ($data['plugins']) {
                $content .= '<tr><td colspan="4" class="plugin-section">';
                $content .= '<strong>' . __('Active Plugins', 'maxi-blocks') . ' (' . count($data['active']) . ')</strong><br>';
                foreach ($data['plugins'] as $plugin_path => $plugin) {
                    if (in_array($plugin_path, $data['active'])) {
                        $content .= $plugin['Name'] . ' ' . $plugin['Version'] . '<br>';
                    }
                }
                $content .= '</td></tr>';

                // Inactive Plugins
                $inactive = array_diff(array_keys($data['plugins']), $data['active']);
                if (!empty($inactive)) {
                    $content .= '<tr><td colspan="4" class="plugin-section">';
                    $content .= '<strong>' . __('Inactive Plugins', 'maxi-blocks') . ' (' . count($inactive) . ')</strong><br>';
                    foreach ($inactive as $plugin_path) {
                        $plugin = $data['plugins'][$plugin_path];
                        $content .= $plugin['Name'] . ' ' . $plugin['Version'] . '<br>';
                    }
                    $content .= '</td></tr>';
                }
            }

            return $content;
        }

        /**
         * Generates the plugin information section of the status table
         */
        public function generate_plugin_information_section($plugins, $mu_plugins, $active)
        {
            $content = '<tr><th colspan="4">' . __('Plugin Information', 'maxi-blocks') . '</th></tr>';

            // Must-Use Plugins
            if ($mu_plugins) {
                $content .= '<tr><td colspan="4" class="plugin-section">';
                $content .= '<strong>' . __('Must-Use Plugins', 'maxi-blocks') . ' (' . count($mu_plugins) . ')</strong><br>';
                foreach ($mu_plugins as $mu_plugin) {
                    $content .= $mu_plugin['Name'] . ' ' . $mu_plugin['Version'] . '<br>';
                }
                $content .= '</td></tr>';
            }

            // Active Plugins
            if ($plugins) {
                $content .= '<tr><td colspan="4" class="plugin-section">';
                $content .= '<strong>' . __('Active Plugins', 'maxi-blocks') . ' (' . count($active) . ')</strong><br>';
                foreach ($plugins as $plugin_path => $plugin) {
                    if (in_array($plugin_path, $active)) {
                        $content .= $plugin['Name'] . ' ' . $plugin['Version'] . '<br>';
                    }
                }
                $content .= '</td></tr>';

                // Inactive Plugins
                $inactive = array_diff(array_keys($plugins), $active);
                if (!empty($inactive)) {
                    $content .= '<tr><td colspan="4" class="plugin-section">';
                    $content .= '<strong>' . __('Inactive Plugins', 'maxi-blocks') . ' (' . count($inactive) . ')</strong><br>';
                    foreach ($inactive as $plugin_path) {
                        $plugin = $plugins[$plugin_path];
                        $content .= $plugin['Name'] . ' ' . $plugin['Version'] . '<br>';
                    }
                    $content .= '</td></tr>';
                }
            }

            return $content;
        }

        /**
         * Generates the theme information section of the status table
         */
        private function generate_theme_information_section()
        {
            $theme = wp_get_theme();
            $is_block_theme = function_exists('wp_is_block_theme') ? wp_is_block_theme() : false;
            $parent_theme = $theme->parent();

            $content = '<tr><th colspan="4">' . __('Theme Information', 'maxi-blocks') . '</th></tr>';
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
                true
            );

            // Theme Version
            $content .= $this->generate_status_row(
                __('Version', 'maxi-blocks'),
                '-',
                $theme->get('Version'),
                true
            );

            // Theme Author
            $content .= $this->generate_status_row(
                __('Author', 'maxi-blocks'),
                '-',
                strip_tags($theme->get('Author')),
                true
            );

            // Author Website
            $content .= $this->generate_status_row(
                __('Author Website', 'maxi-blocks'),
                '-',
                $theme->get('AuthorURI'),
                true
            );

            // Parent Theme
            $content .= $this->generate_status_row(
                __('Parent Theme', 'maxi-blocks'),
                '-',
                $parent_theme ? $parent_theme->get('Name') . ' ' . $parent_theme->get('Version') : __('None', 'maxi-blocks'),
                true
            );

            // Block Theme
            $content .= $this->generate_status_row(
                __('Block Theme', 'maxi-blocks'),
                __('Yes', 'maxi-blocks'),
                $is_block_theme ? __('Yes', 'maxi-blocks') : __('No', 'maxi-blocks'),
                $is_block_theme
            );

            // Theme Directory
            $content .= $this->generate_status_row(
                __('Theme Directory', 'maxi-blocks'),
                '-',
                get_template_directory(),
                true
            );

            return $content;
        }

        /**
         * Generates the MaxiBlocks plugin section of the status table
         */
        private function generate_maxiblocks_section()
        {
            global $wpdb;

            $content = '<tr><th colspan="4">' . __('MaxiBlocks Plugin', 'maxi-blocks') . '</th></tr>';
            $content .= '<tr class="header-row">';
            $content .= '<td>' . __('Setting', 'maxi-blocks') . '</td>';
            $content .= '<td>' . __('Required', 'maxi-blocks') . '</td>';
            $content .= '<td>' . __('Actual', 'maxi-blocks') . '</td>';
            $content .= '<td>' . __('Status', 'maxi-blocks') . '</td>';
            $content .= '</tr>';

            // Check General Table
            $general_table = $wpdb->prefix . 'maxi_blocks_general';
            $general_exists = $wpdb->get_var("SHOW TABLES LIKE '$general_table'") === $general_table;

            $content .= $this->generate_status_row(
                __('General Table', 'maxi-blocks'),
                __('Exists', 'maxi-blocks'),
                $general_exists ? __('Exists', 'maxi-blocks') : __('Missing', 'maxi-blocks'),
                $general_exists
            );

            // Check Styles Table
            $styles_table = $wpdb->prefix . 'maxi_blocks_styles_blocks';
            $styles_exists = $wpdb->get_var("SHOW TABLES LIKE '$styles_table'") === $styles_table;

            $content .= $this->generate_status_row(
                __('Styles Table', 'maxi-blocks'),
                __('Exists', 'maxi-blocks'),
                $styles_exists ? __('Exists', 'maxi-blocks') : __('Missing', 'maxi-blocks'),
                $styles_exists
            );

            // Check Custom Data Table
            $custom_data_table = $wpdb->prefix . 'maxi_blocks_custom_data_blocks';
            $custom_data_exists = $wpdb->get_var("SHOW TABLES LIKE '$custom_data_table'") === $custom_data_table;

            $content .= $this->generate_status_row(
                __('Custom Data Table', 'maxi-blocks'),
                __('Exists', 'maxi-blocks'),
                $custom_data_exists ? __('Exists', 'maxi-blocks') : __('Missing', 'maxi-blocks'),
                $custom_data_exists
            );

            return $content;
        }

        /**
         * Generates text version of the report for clipboard
         */
        public function generate_report_text($data)
        {
            $report = "====== BEGIN SYSTEM REPORT ======\n\n";

            // MaxiBlocks Plugin section (moved to top)
            $report .= "--- MaxiBlocks Plugin ---\n";
            global $wpdb;
            $general_table = $wpdb->prefix . 'maxi_blocks_general';
            $styles_table = $wpdb->prefix . 'maxi_blocks_styles_blocks';
            $custom_data_table = $wpdb->prefix . 'maxi_blocks_custom_data_blocks';

            $report .= 'General Table: ' . ($wpdb->get_var("SHOW TABLES LIKE '$general_table'") === $general_table ? 'Exists' : 'Missing') . "\n";
            $report .= 'Styles Table: ' . ($wpdb->get_var("SHOW TABLES LIKE '$styles_table'") === $styles_table ? 'Exists' : 'Missing') . "\n";
            $report .= 'Custom Data Table: ' . ($wpdb->get_var("SHOW TABLES LIKE '$custom_data_table'") === $custom_data_table ? 'Exists' : 'Missing') . "\n\n";

            // Server Environment
            $report .= "--- Server Environment ---\n";
            $report .= 'Environment: ' . ($this->is_localhost() ? 'Local' : 'Production') . "\n";
            $report .= 'Server Software: ' . ($_SERVER['SERVER_SOFTWARE'] ?? 'Unknown') . "\n";
            $report .= 'Operating System: ' . (function_exists('php_uname') ? php_uname('s') . ' ' . php_uname('r') : PHP_OS) . "\n";
            $report .= 'Architecture: ' . (PHP_INT_SIZE === 8 ? 'x64' : 'x86') . "\n";
            $report .= 'PHP Version: ' . PHP_VERSION . "\n";

            // Database info
            $mysql_version = $wpdb->get_var('SELECT VERSION()');
            $is_mariadb = strpos(strtolower($mysql_version), 'mariadb') !== false;
            if ($is_mariadb) {
                preg_match('/\d+\.\d+\.\d+/', $mysql_version, $matches);
                $db_version = $matches[0] ?? '0.0.0';
                $report .= 'Database: MariaDB ' . $db_version . ' (Required: 10.4+)' . "\n";
            } else {
                $report .= 'Database: MySQL ' . $mysql_version . ' (Required: 8.0+)' . "\n";
            }

            $report .= 'SSL/HTTPS: ' . (is_ssl() ? 'Enabled' : 'Disabled') .
                       ($this->is_localhost() ? ' (not required for local environment)' : '') . "\n";
            $report .= 'Safe Mode: ' . $data['safemode'] . "\n";
            $report .= 'cURL: ' . $data['hascurl'] . "\n";
            $report .= 'OpenSSL: ' . $data['openssl'] . "\n\n";

            // Theme Information
            $theme = wp_get_theme();
            $is_block_theme = function_exists('wp_is_block_theme') ? wp_is_block_theme() : false;
            $parent_theme = $theme->parent();

            $report .= "--- Theme Information ---\n";
            $report .= 'Theme Name: ' . $theme->get('Name') . "\n";
            $report .= 'Version: ' . $theme->get('Version') . "\n";
            $report .= 'Author: ' . strip_tags($theme->get('Author')) . "\n";
            $report .= 'Author Website: ' . $theme->get('AuthorURI') . "\n";
            $report .= 'Parent Theme: ' . ($parent_theme ? $parent_theme->get('Name') . ' ' . $parent_theme->get('Version') : 'None') . "\n";
            $report .= 'Block Theme: ' . ($is_block_theme ? 'Yes' : 'No') . "\n";
            $report .= 'Theme Directory: ' . get_template_directory() . "\n\n";

            // WordPress Environment
            $report .= "--- WordPress Environment ---\n";
            $report .= 'WordPress Version: ' . get_bloginfo('version') . "\n";
            $report .= 'SSL/HTTPS: ' . (is_ssl() ? __('Enabled', 'maxi-blocks') : __('Disabled', 'maxi-blocks')) . "\n";
            $report .= 'Multisite: ' . $data['ismulti'] . "\n";
            if (is_multisite()) {
                $report .= 'Multisite Type: ' . (defined('SUBDOMAIN_INSTALL') && SUBDOMAIN_INSTALL ? 'Subdomain' : 'Subfolder') . "\n";
            }
            $report .= 'Site URL: ' . site_url() . "\n";
            $report .= 'Home URL: ' . home_url() . "\n";
            if (get_option('page_for_posts')) {
                $report .= 'Blog URL: ' . get_permalink(get_option('page_for_posts')) . "\n";
            }
            $report .= 'Current Theme: ' . $data['theme'] . "\n";
            $report .= 'Parent Theme: ' . $data['parent_theme'] . "\n";
            $report .= 'WP Debug Mode: ' . $data['wpdebug'] . "\n";
            $report .= 'Language: ' . $data['site_lang'] . "\n";
            $report .= 'Charset: ' . $data['site_char'] . "\n";
            $report .= 'Timezone: ' . wp_timezone_string() . "\n";
            $report .= 'Text Direction: ' . $data['site_text_dir'] . "\n";
            $report .= 'Permalinks: ' . (empty(get_option('permalink_structure')) ?
                'Plain' :
                'Pretty Permalinks (' . get_option('permalink_structure') . ')') . "\n";
            $report .= 'jQuery Version: ' . $data['jquchk'] . "\n";
            $wp_scripts = wp_scripts();
            $report .= 'React Version: ' . ($wp_scripts->registered['react']->ver ?? 'Not Found') . "\n";

            // Add AJAX status to WordPress Environment section
            $report .= 'WordPress AJAX: ' . ($this->test_ajax_status() ? 'Working' : 'Not Working') . "\n\n";

            // Plugin Status
            $report .= "--- Plugin Status ---\n";
            if ($data['plugins']) {
                $report .= 'Active Plugins (' . count($data['active']) . "):\n";
                foreach ($data['plugins'] as $plugin_path => $plugin) {
                    if (in_array($plugin_path, $data['active'])) {
                        $report .= '- ' . $plugin['Name'] . ' ' . $plugin['Version'] . "\n";
                    }
                }
                $report .= "\n";

                // Add inactive plugins
                $inactive = array_diff(array_keys($data['plugins']), $data['active']);
                if (!empty($inactive)) {
                    $report .= 'Inactive Plugins (' . count($inactive) . "):\n";
                    foreach ($inactive as $plugin_path) {
                        $plugin = $data['plugins'][$plugin_path];
                        $report .= '- ' . $plugin['Name'] . ' ' . $plugin['Version'] . "\n";
                    }
                }
            }

            // Frontend Assets
            $report .= "\n--- Frontend Assets ---\n";
            $report .= "Loading...\n";

            $report .= "\n====== END SYSTEM REPORT ======";

            // Add back the WordPress Directories Permissions section
            $report .= "\nWordPress Directories Permissions:\n";
            $report .= "WP Directory: " . ABSPATH . " (" . $this->get_directory_permission(ABSPATH) . ")\n";
            $report .= "WP Content Directory: " . WP_CONTENT_DIR . " (" . $this->get_directory_permission(WP_CONTENT_DIR) . ")\n";
            $report .= "WP Plugin Directory: " . WP_PLUGIN_DIR . " (" . $this->get_directory_permission(WP_PLUGIN_DIR) . ")\n";
            $report .= "WP Themes Directory: " . get_theme_root() . " (" . $this->get_directory_permission(get_theme_root()) . ")\n";
            $report .= "WP Uploads Directory: " . wp_upload_dir()['basedir'] . " (" . $this->get_directory_permission(wp_upload_dir()['basedir']) . ")\n";

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
         * Add the helper method for AJAX test
         */
        private function test_ajax_status()
        {
            // Check if admin-ajax.php exists and is accessible
            $ajax_url = admin_url('admin-ajax.php');
            $response = wp_remote_get($ajax_url, [
                'timeout' => 5,
                'sslverify' => false
            ]);

            if (is_wp_error($response)) {
                return false;
            }

            $response_code = wp_remote_retrieve_response_code($response);

            // WordPress AJAX typically returns 400 when no action is specified,
            // which actually means it's working
            return in_array($response_code, [200, 400], true);
        }

        // Add this helper method to check directory permissions
        private function get_directory_permission($dir)
        {
            if (!file_exists($dir)) {
                return __('Directory does not exist', 'maxi-blocks');
            }

            $perms = fileperms($dir);
            $readable = is_readable($dir) ? __('Readable', 'maxi-blocks') : __('Not Readable', 'maxi-blocks');
            $writable = is_writable($dir) ? __('Writable', 'maxi-blocks') : __('Not Writable', 'maxi-blocks');

            // Convert file permission to human readable
            $mode = substr(sprintf('%o', $perms), -4);

            return sprintf('%s | %s | %s', $mode, $readable, $writable);
        }

        // Keep the get_debug_log_content method
        private function get_debug_log_content()
        {
            if (!defined('WP_DEBUG_LOG') || !WP_DEBUG_LOG) {
                return false;
            }

            $log_path = WP_CONTENT_DIR . '/debug.log';
            if (defined('WP_DEBUG_LOG') && is_string(WP_DEBUG_LOG)) {
                $log_path = WP_DEBUG_LOG;
            }

            if (!file_exists($log_path) || !is_readable($log_path)) {
                return false;
            }

            // Get last 1000 lines of the log file (to keep the size reasonable)
            $log_content = shell_exec("tail -n 1000 " . escapeshellarg($log_path));
            if (!$log_content) {
                // Fallback if shell_exec fails or is disabled
                $log_content = file_get_contents($log_path);
                if ($log_content) {
                    $lines = explode("\n", $log_content);
                    $lines = array_slice($lines, -1000);
                    $log_content = implode("\n", $lines);
                }
            }

            return $log_content;
        }
    }
endif;
