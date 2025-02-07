<?php
/**
 * MaxiBlocks System Status Report Class
 */

if (!defined('ABSPATH')) {
    exit();
}

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
            $content .= '<button id="maxi-copy-report" class="button button-primary">' . __('Copy Report to Clipboard', 'maxi-blocks') . '</button>';
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

            // WordPress Environment Section
            $content .= $this->generate_wordpress_environment_section([
                'ismulti' => $ismulti,
                'site_url' => site_url(),
                'home_url' => home_url(),
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
            ]);

            // Plugin Information Section
            if ($plugins && $mu_plugins) {
                $content .= $this->generate_plugin_information_section($plugins, $mu_plugins, $active);
            }

            $content .= '</table>';
            $content .= '</div>'; // maxi-dashboard_main-content

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
         * Generates the server environment section of the status table
         */
        public function generate_server_environment_section($data)
        {
            $content = '<tr><th colspan="4">' . __('Server Environment', 'maxi-blocks') . '</th></tr>';
            $content .= '<tr class="header-row">';
            $content .= '<td>' . __('Setting', 'maxi-blocks') . '</td>';
            $content .= '<td>' . __('Recommended', 'maxi-blocks') . '</td>';
            $content .= '<td>' . __('Actual', 'maxi-blocks') . '</td>';
            $content .= '<td>' . __('Status', 'maxi-blocks') . '</td>';
            $content .= '</tr>';

            // PHP Version
            $content .= $this->generate_status_row(
                __('PHP Version', 'maxi-blocks'),
                '7.4+',
                $data['php_version'],
                version_compare($data['php_version'], '7.4', '>='),
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
                '180',
                $data['max_execution_time'],
                $data['max_execution_time'] >= 180,
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
                '3000',
                $data['max_input_vars'],
                $data['max_input_vars'] >= 3000,
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
                '5.8+',
                $data['wp_version'],
                version_compare($data['wp_version'], '5.8', '>='),
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

            // WP Memory Limit
            $wp_memory = $this->convert_to_mb($data['wp_memory_limit']);
            $content .= $this->generate_status_row(
                __('WP Memory Limit', 'maxi-blocks'),
                '40MB',
                $data['wp_memory_limit'],
                $wp_memory >= 40,
            );

            // WP Debug Mode
            $content .= $this->generate_status_row(
                __('WP Debug Mode', 'maxi-blocks'),
                __('Disabled', 'maxi-blocks'),
                $data['wpdebug'],
                $data['wpdebug'] === 'Disabled',
            );

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
            }

            return $content;
        }

        /**
         * Generates text version of the report for clipboard
         */
        public function generate_report_text($data)
        {
            $report = "====== BEGIN SYSTEM REPORT ======\n\n";

            // WordPress Environment
            $report .= "--- WordPress Environment ---\n";
            $report .= 'WordPress Version: ' . get_bloginfo('version') . "\n";
            $report .= 'Multisite: ' . $data['ismulti'] . "\n";
            $report .= 'Site URL: ' . site_url() . "\n";
            $report .= 'Home URL: ' . home_url() . "\n";
            $report .= 'Current Theme: ' . $data['theme'] . "\n";
            $report .= 'Parent Theme: ' . $data['parent_theme'] . "\n";
            $report .= 'WP Debug Mode: ' . $data['wpdebug'] . "\n";
            $report .= 'jQuery Version: ' . $data['jquchk'] . "\n";
            $report .= 'Language: ' . $data['site_lang'] . "\n";
            $report .= 'Charset: ' . $data['site_char'] . "\n";
            $report .= 'Text Direction: ' . $data['site_text_dir'] . "\n\n";

            // Server Environment
            $report .= "--- Server Environment ---\n";
            $report .= 'PHP Version: ' . PHP_VERSION . "\n";
            $report .= 'Safe Mode: ' . $data['safemode'] . "\n";
            $report .= 'cURL: ' . $data['hascurl'] . "\n";
            $report .= 'OpenSSL: ' . $data['openssl'] . "\n\n";

            // Plugin Information
            $report .= "--- Plugin Information ---\n";
            if ($data['mu_plugins']) {
                $report .= 'Must-Use Plugins (' . count($data['mu_plugins']) . "):\n";
                foreach ($data['mu_plugins'] as $mu_plugin) {
                    $report .= '- ' . $mu_plugin['Name'] . ' ' . $mu_plugin['Version'] . "\n";
                }
                $report .= "\n";
            }

            if ($data['plugins']) {
                $report .= 'Active Plugins (' . count($data['active']) . "):\n";
                foreach ($data['plugins'] as $plugin_path => $plugin) {
                    if (in_array($plugin_path, $data['active'])) {
                        $report .= '- ' . $plugin['Name'] . ' ' . $plugin['Version'] . "\n";
                    }
                }
            }

            $report .= "\n====== END SYSTEM REPORT ======";

            return $report;
        }
    }
endif;
