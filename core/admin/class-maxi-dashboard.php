<?php
if (!defined('ABSPATH')) {
    exit();
}

define('MAXI_BLOCKS_AUTH_MIDDLEWARE_URL', 'https://my.maxiblocks.com/middleware/verify');
define('MAXI_BLOCKS_AUTH_MIDDLEWARE_KEY', '4d8af9b4d6f221cf7a41271cb7b82c92');

if (!class_exists('MaxiBlocks_Dashboard')):
    class MaxiBlocks_Dashboard
    {
        /**
         * Plugin's dashboard instance.
         *
         * @var MaxiBlocks_Dashboard
         */
        private static $instance;

        private static $maxi_prefix = 'maxi_blocks_';
        private static $maxi_slug_dashboard = 'maxi-blocks-dashboard';
        private static $maxi_plugin_name = 'MaxiBlocks';

        /**
         * Registers the plugin.
         */
        public static function register()
        {
            if (null === self::$instance) {
                self::$instance = new MaxiBlocks_Dashboard();
            }
        }

        /**
         * Get the existing instance (if any)
         */
        public static function get_instance()
        {
            return self::$instance;
        }

        /**
         * Constructor.
         */
        public function __construct()
        {
            // Register regular admin menu (not for network admin)
            add_action('admin_menu', [$this, 'maxi_register_menu']);

            add_action('admin_init', [$this, 'register_maxi_blocks_settings']);

            add_action('admin_enqueue_scripts', [
                $this,
                'maxi_admin_scripts_styles',
            ]);

            add_action('maxi_blocks_db_tables_created', [
                $this,
                'update_settings_on_install',
            ]);

            // Add init hook for starter sites scripts
            add_action('admin_init', [$this, 'maxi_blocks_starter_sites_init']);

            // Add AJAX handlers for WordPress Importer plugin
            add_action('wp_ajax_maxi_install_importer', [
                $this,
                'ajax_install_importer',
            ]);
            add_action('wp_ajax_maxi_activate_importer', [
                $this,
                'ajax_activate_importer',
            ]);

            // Add REST API endpoint for checking importer status
            add_action('rest_api_init', function () {
                register_rest_route(
                    'maxi-blocks/v1.0',
                    '/check-importer-status',
                    [
                        'methods' => 'GET',
                        'callback' => [$this, 'check_importer_status'],
                        'permission_callback' => function () {
                            return current_user_can('manage_options');
                        },
                    ],
                );
            });

            // Add AJAX handlers for frontend assets
            add_action('wp_ajax_maxi_get_frontend_assets', [
                $this,
                'handle_get_frontend_assets',
            ]);
            add_action('wp_ajax_nopriv_maxi_get_frontend_assets', [
                $this,
                'handle_get_frontend_assets',
            ]);

            // Add AJAX handlers for license validation
            add_action('wp_ajax_maxi_validate_license', [
                $this,
                'handle_validate_license',
            ]);
            add_action('wp_ajax_maxi_check_auth_status', [
                $this,
                'handle_check_auth_status',
            ]);
            add_action('wp_ajax_maxi_save_email_license', [
                $this,
                'handle_save_email_license',
            ]);

            // Check for domain changes on admin init
            add_action('admin_init', [$this, 'check_and_handle_domain_migration']);

            // Add multisite network admin support
            if (is_multisite()) {
                add_action('network_admin_menu', [$this, 'maxi_register_network_menu']);
                add_action('network_admin_enqueue_scripts', [$this, 'maxi_network_admin_scripts_styles']);
                add_action('network_admin_edit_maxi_network_license', [$this, 'handle_network_license_update']);
                add_action('wp_ajax_maxi_network_validate_license', [$this, 'handle_network_validate_license']);
                add_action('wp_ajax_maxi_network_check_auth_status', [$this, 'handle_network_check_auth_status']);
            }
        }

        public function update_settings_on_install()
        {
            update_option('bunny_fonts', true);
        }

        public function maxi_get_menu_icon_base64()
        {
            $icon_svg_code =
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M19.742 10.079c-.131-.187-.328-.312-.557-.352-.246-.043-.507.017-.73.174l-2.485 1.922 1.728-6.786a.89.89 0 0 0-.473-1.057.94.94 0 0 0-1.097.25l-4.839 5.923 1.264-5.205c.121-.368-.046-.796-.4-1.017-.344-.216-.805-.164-1.082.113l-8.404 7.637c-.596-2.82.294-4.884 1.182-6.147 1.463-2.057 3.961-3.378 6.385-3.378.502.006.972-.403.972-.908a.91.91 0 0 0-.902-.908C7.316.314 4.191 1.911 2.341 4.47.601 6.901.178 9.947 1.142 13.07l-.768.699a.87.87 0 0 0-.292.639c-.005.236.079.464.224.626.288.363.931.411 1.272.069l8.536-7.742-1.521 6.272c-.08.4.111.805.505 1.022a.94.94 0 0 0 1.098-.251l4.756-5.83-1.375 5.356c-.126.377.033.805.375 1.017s.783.189 1.06-.046l2.48-1.936c-1.209 2.999-3.943 4.879-7.243 4.879-.872 0-3.878-.201-5.986-2.801-.335-.376-.878-.425-1.281-.104a.95.95 0 0 0-.315.606c-.028.251.047.491.201.664 2.618 3.202 6.33 3.451 7.406 3.451 5.078 0 9.032-3.624 9.6-8.735a.95.95 0 0 0-.131-.845z" fill="#fff"/></svg>';
            $icon_base64 = base64_encode($icon_svg_code);
            $icon_data_uri = 'data:image/svg+xml;base64,' . $icon_base64;

            return $icon_data_uri;
        }

        public function maxi_admin_scripts_styles()
        {
            if (is_admin()) {
                // Register and enqueue Roboto font styles
                wp_register_style(
                    'maxi-admin-roboto',
                    plugin_dir_url(__FILE__) . 'fonts/roboto/style.css',
                    [],
                    MAXI_PLUGIN_VERSION,
                );
                wp_enqueue_style('maxi-admin-roboto');

                // Register and enqueue Inter font styles
                wp_register_style(
                    'maxi-admin-inter',
                    plugin_dir_url(__FILE__) . 'fonts/inter/style.css',
                    [],
                    MAXI_PLUGIN_VERSION,
                );
                wp_enqueue_style('maxi-admin-inter');

                wp_register_style(
                    'maxi-admin',
                    MAXI_PLUGIN_URL_PATH . 'build/admin.css',
                    [],
                    MAXI_PLUGIN_VERSION,
                );
                wp_enqueue_style('maxi-admin');

                wp_register_script(
                    'maxi-admin',
                    MAXI_PLUGIN_URL_PATH . 'build/admin.js',
                    [],
                    MAXI_PLUGIN_VERSION,
                    [
                        'strategy' => 'defer',
                        'in_footer' => true,
                    ],
                );
                wp_enqueue_script('maxi-admin');

                // Add status report styles
                wp_register_style(
                    'maxi-status-report',
                    plugin_dir_url(__FILE__) . 'status-report/styles.css',
                    [],
                    MAXI_PLUGIN_VERSION,
                );
                wp_enqueue_style('maxi-status-report');

                // Add status report script
                wp_register_script(
                    'maxi-status-report',
                    plugin_dir_url(__FILE__) . 'status-report/index.js',
                    [],
                    MAXI_PLUGIN_VERSION,
                    [
                        'strategy' => 'defer',
                        'in_footer' => true,
                    ],
                );
                wp_enqueue_script('maxi-status-report');

                $path_to_previews = plugins_url(
                    '../../img/block-preview/',
                    __FILE__,
                );

                wp_localize_script('maxi-admin', 'previews', [
                    'accordion_preview' => $path_to_previews . 'accordion.png',
                    'button_preview' => $path_to_previews . 'button.png',
                    'container_preview' => $path_to_previews . 'container.png',
                    'row_preview' => $path_to_previews . 'row.png',
                    'divider_preview' => $path_to_previews . 'divider.png',
                    'group_preview' => $path_to_previews . 'group.png',
                    'icon_preview' => $path_to_previews . 'icon.png',
                    'image_preview' => $path_to_previews . 'image.png',
                    'map_preview' => $path_to_previews . 'map.png',
                    'nc_preview' => $path_to_previews . 'nc.png',
                    'search_preview' => $path_to_previews . 'search.png',
                    'slider_preview' => $path_to_previews . 'slider.png',
                    'library_preview' => $path_to_previews . 'templates.png',
                    'text_preview' => $path_to_previews . 'text.png',
                    'video_preview' => $path_to_previews . 'video.png',
                    'pane_preview' => $path_to_previews . 'pane.png',
                    'slide_preview' => $path_to_previews . 'slide.png',
                ]);

                wp_localize_script('maxi-admin', 'localization', [
                    'loading_status_message' => __(
                        'Validating...',
                        'maxi-blocks',
                    ),
                    'please_add_api_key' => __(
                        'Please add your API key',
                        'maxi-blocks',
                    ),
                    'invalid_api_key' => __(
                        'Invalid API Key, please check your key and try again',
                        'maxi-blocks',
                    ),
                    'referer_not_allowed' => __(
                        'Referer not allowed, please allow your domain for that key',
                        'maxi-blocks',
                    ),
                    'invalid_characters' => __(
                        'Only alphabet, number, "_", "$", ".", "[", and "]" are allowed in the API key.',
                        'maxi-blocks',
                    ),
                    'server_error' => __(
                        'Error validating API Key, please try again later',
                        'maxi-blocks',
                    ),
                ]);

                wp_localize_script('maxi-admin', 'maxiAiSettings', [
                    'defaultModel' => get_option(
                        'maxi_ai_model',
                        'gpt-3.5-turbo',
                    ),
                ]);

                // Add localization for license page
                $network_license_info = $this->get_network_license_info();
                wp_localize_script('maxi-admin', 'maxiLicenseSettings', [
                    'middlewareUrl' => defined('MAXI_BLOCKS_AUTH_MIDDLEWARE_URL') ? MAXI_BLOCKS_AUTH_MIDDLEWARE_URL : '',
                    'middlewareKey' => defined('MAXI_BLOCKS_AUTH_MIDDLEWARE_KEY') ? MAXI_BLOCKS_AUTH_MIDDLEWARE_KEY : '',
                    'ajaxUrl' => admin_url('admin-ajax.php'),
                    'nonce' => wp_create_nonce('maxi_license_validation'),
                    'currentDomain' => parse_url(home_url(), PHP_URL_HOST),
                    'pluginVersion' => MAXI_PLUGIN_VERSION,
                    'isMultisite' => is_multisite(),
                    'hasNetworkLicense' => $this->has_network_license(),
                    'networkLicenseName' => $network_license_info ? $network_license_info['user_name'] : '',
                    'isNetworkAdmin' => false,
                ]);
            }
        }

        /**
         * Register menu page and submenus
         */
        public function maxi_register_menu()
        {
            // Don't register regular admin menu in network admin context
            if (is_network_admin()) {
                return;
            }

            // Additional check to prevent double registration
            if (defined('DOING_AJAX') && DOING_AJAX) {
                return;
            }
            add_menu_page(
                self::$maxi_plugin_name,
                self::$maxi_plugin_name,
                'manage_options',
                self::$maxi_slug_dashboard,
                [$this, 'maxi_config_page'],
                $this->maxi_get_menu_icon_base64(),
                60,
            );
            add_submenu_page(
                self::$maxi_slug_dashboard,
                self::$maxi_plugin_name,
                __('Welcome', 'maxi-blocks'),
                'manage_options',
                self::$maxi_slug_dashboard,
                '',
                null,
            );
            add_submenu_page(
                self::$maxi_slug_dashboard,
                __('Quick start', 'maxi-blocks'),
                __('Quick start', 'maxi-blocks'),
                'manage_options',
                esc_url(admin_url('admin.php?page=maxi-blocks-quick-start')),
                '',
                null,
            );
            add_submenu_page(
                self::$maxi_slug_dashboard,
                __('Starter sites', 'maxi-blocks'),
                __('Starter sites', 'maxi-blocks'),
                'manage_options',
                'admin.php?page=' .
                    self::$maxi_slug_dashboard .
                    '&tab=maxi_blocks_starter_sites',
                '',
                null,
            );
            add_submenu_page(
                self::$maxi_slug_dashboard,
                __('Maxi AI', 'maxi-blocks'),
                __('Maxi AI', 'maxi-blocks'),
                'manage_options',
                'admin.php?page=' .
                    self::$maxi_slug_dashboard .
                    '&tab=maxi_blocks_maxi_ai',
                '',
                null,
            );
            add_submenu_page(
                self::$maxi_slug_dashboard,
                __('System status', 'maxi-blocks'),
                __('System status', 'maxi-blocks'),
                'manage_options',
                'admin.php?page=' .
                    self::$maxi_slug_dashboard .
                    '&tab=maxi_blocks_status',
                '',
                null,
            );
            add_submenu_page(
                self::$maxi_slug_dashboard,
                __('License', 'maxi-blocks'),
                __('License', 'maxi-blocks'),
                'manage_options',
                'admin.php?page=' .
                    self::$maxi_slug_dashboard .
                    '&tab=maxi_blocks_license',
                '',
                null,
            );
            add_submenu_page(
                self::$maxi_slug_dashboard,
                __('Settings', 'maxi-blocks'),
                __('Settings', 'maxi-blocks'),
                'manage_options',
                'admin.php?page=' .
                    self::$maxi_slug_dashboard .
                    '&tab=maxi_blocks_settings',
                '',
                null,
            );
        }

        /**
         * Register network admin menu (for multisite)
         */
        public function maxi_register_network_menu()
        {
            add_menu_page(
                self::$maxi_plugin_name,
                self::$maxi_plugin_name,
                'manage_network_options',
                self::$maxi_slug_dashboard,
                [$this, 'maxi_network_config_page'],
                $this->maxi_get_menu_icon_base64(),
                60,
            );
            // Add the main item as a submenu to create the dropdown
            add_submenu_page(
                self::$maxi_slug_dashboard,
                self::$maxi_plugin_name,
                __('License', 'maxi-blocks'),
                'manage_network_options',
                self::$maxi_slug_dashboard,
                '',
                null,
            );
        }

        /**
         * Check if there's an active network license
         * @returns bool
         */
        public function has_network_license()
        {
            if (!is_multisite()) {
                return false;
            }

            $network_license = get_site_option('maxi_pro_network', '');
            if (empty($network_license)) {
                return false;
            }

            $license_array = json_decode($network_license, true);
            if (!is_array($license_array)) {
                return false;
            }

            foreach ($license_array as $key => $license) {
                if (strpos($key, 'code_') === 0 && isset($license['status']) && $license['status'] === 'yes') {
                    return true;
                }
            }

            return false;
        }

        /**
         * Get network license info
         * @returns array|false
         */
        public function get_network_license_info()
        {
            if (!is_multisite()) {
                return false;
            }

            $network_license = get_site_option('maxi_pro_network', '');
            if (empty($network_license)) {
                return false;
            }

            $license_array = json_decode($network_license, true);
            if (!is_array($license_array)) {
                return false;
            }

            foreach ($license_array as $key => $license) {
                if (strpos($key, 'code_') === 0 && isset($license['status']) && $license['status'] === 'yes') {
                    return [
                        'status' => 'Active ✓',
                        'user_name' => isset($license['name']) ? $license['name'] : 'Network User',
                        'purchase_code' => isset($license['purchase_code']) ? $license['purchase_code'] : '',
                        'domain' => isset($license['domain']) ? $license['domain'] : '',
                    ];
                }
            }

            return false;
        }

        // Draw option page
        public function maxi_config_page()
        {
            $settings_tabs = [
                self::$maxi_prefix . 'start' => __('Welcome', 'maxi-blocks'),
                'quick_start' => [
                    'label' => __('Quick start', 'maxi-blocks'),
                    'url' => esc_url(
                        admin_url('admin.php?page=maxi-blocks-quick-start'),
                    ),
                ],
                self::$maxi_prefix . 'starter_sites' => __(
                    'Starter sites',
                    'maxi-blocks',
                ),
                self::$maxi_prefix . 'maxi_ai' => __('Maxi AI', 'maxi-blocks'),
                self::$maxi_prefix . 'status' => __(
                    'System status',
                    'maxi-blocks',
                ),
                self::$maxi_prefix . 'license' => __('License', 'maxi-blocks'),
                self::$maxi_prefix . 'settings' => __(
                    'Settings',
                    'maxi-blocks',
                ),
            ];

            if (isset($_GET['tab'])) {
                // phpcs:ignore
                $current_tab = $tab = sanitize_text_field($_GET['tab']); // phpcs:ignore
            } else {
                $current_tab = $tab = self::$maxi_prefix . 'start';
            }

            echo '<div class="maxi-dashboard_wrap">';
            echo '<header class="maxi-dashboard_header"><img class="maxi-dashboard_logo" width="200" src="' .
                esc_url(MAXI_PLUGIN_URL_PATH) .
                'img/maxi-logo-dashboard-white.svg' .
                '" alt="' .
                esc_html(__('MaxiBlocks Logo', 'maxi-blocks')) .
                '">';
            echo '<h4 class="maxi-dashboard_nav-tab-wrapper nav-tab-wrapper">';

            foreach ($settings_tabs as $tab_page => $tab_info) {
                $active_tab =
                    $current_tab == $tab_page
                        ? 'maxi-dashboard_nav-tab__active nav-tab-active'
                        : '';

                if (is_array($tab_info)) {
                    // Handle Quick Start special case
                    echo '<a class="maxi-dashboard_nav-tab nav-tab ' .
                        esc_attr($tab_page) .
                        esc_attr($active_tab) .
                        '" href="' .
                        $tab_info['url'] .
                        '">' .
                        wp_kses(
                            $tab_info['label'],
                            $this->maxi_blocks_allowed_html(),
                        ) .
                        '</a>';
                } else {
                    // Handle regular tabs
                    echo '<a class="maxi-dashboard_nav-tab nav-tab ' .
                        esc_attr($tab_page) .
                        esc_attr($active_tab) .
                        '" href="?page=' .
                        esc_attr(self::$maxi_slug_dashboard) .
                        '&tab=' .
                        esc_attr($tab_page) .
                        '">' .
                        wp_kses($tab_info, $this->maxi_blocks_allowed_html()) .
                        '</a>';
                }
            }
            echo '</h4>';

            // Add Get cloud link and icons
            echo '<div class="maxi-dashboard_header-actions">';

            // Only show "Get cloud" link if Pro is not active
            if (!$this->is_pro_active()) {
                echo '<a href="https://maxiblocks.com/pricing/" target="_blank" class="maxi-dashboard_get-cloud-link">' .
                    esc_html__('Get cloud', 'maxi-blocks') .
                    '</a>';
            }

            echo '<div class="maxi-dashboard_header-icons">';
            echo '<a href=" https://maxiblocks.com/go/help-desk/" target="_blank" class="maxi-dashboard_header-icon"><img src="' .
                esc_url(
                    MAXI_PLUGIN_URL_PATH . 'img/maxi_help_documents_icon.svg',
                ) .
                '" alt="MaxiBlocks documentation" width="24" height="24"></a>';
            echo '<a href="https://maxiblocks.com/contact/" target="_blank" class="maxi-dashboard_header-icon"><img src="' .
                esc_url(MAXI_PLUGIN_URL_PATH . 'img/maxi_support_icon.svg') .
                '" alt="MaxiBlocks contact" width="24" height="24"></a>';
            echo '</div>'; // maxi-dashboard_header-icons
            echo '</div>'; // maxi-dashboard_header-actions
            echo '</header>';

            echo '<form action="options.php" method="post" class="maxi-dashboard_form">';
            settings_fields('maxi-blocks-settings-group');
            do_settings_sections('maxi-blocks-settings-group');
            echo '<div class="maxi-dashboard_main">';

            if (isset($tab)) {
                if ($tab === self::$maxi_prefix . 'start') {
                    echo wp_kses(
                        $this->maxi_blocks_welcome(),
                        maxi_blocks_allowed_html(),
                    );
                } elseif ($tab === self::$maxi_prefix . 'settings') {
                    echo wp_kses(
                        $this->maxi_blocks_settings(),
                        maxi_blocks_allowed_html(),
                    );
                } elseif ($tab === self::$maxi_prefix . 'maxi_ai') {
                    echo wp_kses(
                        $this->maxi_blocks_maxi_ai(),
                        maxi_blocks_allowed_html(),
                    );
                } elseif ($tab === self::$maxi_prefix . 'starter_sites') {
                    echo wp_kses(
                        $this->maxi_blocks_starter_sites(),
                        maxi_blocks_allowed_html(),
                    );
                } elseif ($tab === self::$maxi_prefix . 'status') {
                    echo wp_kses(
                        $this->maxi_blocks_status(),
                        maxi_blocks_allowed_html(),
                    );
                } elseif ($tab === self::$maxi_prefix . 'license') {
                    echo wp_kses(
                        $this->maxi_blocks_license(),
                        maxi_blocks_allowed_html(),
                    );
                }
            }

            echo '</div>'; // maxi-dashboard_main
            echo '<div class="clear"></div>';
            echo '</form>'; // maxi-dashboard_form
            echo '</div>'; // maxi-dashboard_wrap
        }

        /**
         * Network admin configuration page (for multisite)
         */
        public function maxi_network_config_page()
        {
            // Enqueue network admin scripts
            $this->maxi_network_admin_scripts_styles();

            // Get current network license status
            $network_license_info = $this->get_network_license_info();
            $is_network_active = $network_license_info !== false;

            echo '<div class="maxi-dashboard_wrap">';
            echo '<header class="maxi-dashboard_header">';
            echo '<img class="maxi-dashboard_logo" width="200" src="' .
                esc_url(MAXI_PLUGIN_URL_PATH) .
                'img/maxi-logo-dashboard-white.svg' .
                '" alt="' .
                esc_html(__('MaxiBlocks Logo', 'maxi-blocks')) .
                '">';
            echo '<h4 class="maxi-dashboard_nav-tab-wrapper nav-tab-wrapper">';
            echo '<span class="maxi-dashboard_nav-tab nav-tab maxi-dashboard_nav-tab__active nav-tab-active">' . __('License', 'maxi-blocks') . '</span>';
            echo '</h4>';

            // Add Get cloud link and icons (same as regular dashboard)
            echo '<div class="maxi-dashboard_header-actions">';

            // Only show "Get cloud" link if Pro is not active
            if (!$is_network_active) {
                echo '<a href="https://maxiblocks.com/pricing/" target="_blank" class="maxi-dashboard_get-cloud-link">' .
                    esc_html__('Get cloud', 'maxi-blocks') .
                    '</a>';
            }

            echo '<div class="maxi-dashboard_header-icons">';
            echo '<a href=" https://maxiblocks.com/go/help-desk/" target="_blank" class="maxi-dashboard_header-icon"><img src="' .
                esc_url(
                    MAXI_PLUGIN_URL_PATH . 'img/maxi_help_documents_icon.svg',
                ) .
                '" alt="MaxiBlocks documentation" width="24" height="24"></a>';
            echo '<a href="https://maxiblocks.com/contact/" target="_blank" class="maxi-dashboard_header-icon"><img src="' .
                esc_url(MAXI_PLUGIN_URL_PATH . 'img/maxi_support_icon.svg') .
                '" alt="MaxiBlocks contact" width="24" height="24"></a>';
            echo '</div>'; // maxi-dashboard_header-icons
            echo '</div>'; // maxi-dashboard_header-actions
            echo '</header>';

            echo '<form action="options.php" method="post" class="maxi-dashboard_form">';
            echo '<div class="maxi-dashboard_main">';

            // License content using the same format as regular dashboard
            echo wp_kses($this->maxi_blocks_network_license(), maxi_blocks_allowed_html());

            echo '</div>'; // maxi-dashboard_main
            echo '<div class="clear"></div>';
            echo '</form>'; // maxi-dashboard_form
            echo '</div>'; // maxi-dashboard_wrap
        }

        /**
         * Generate network license content (mirrors maxi_blocks_license structure)
         */
        public function maxi_blocks_network_license()
        {
            // Get current network license status
            $network_license_info = $this->get_network_license_info();
            $is_network_active = $network_license_info !== false;
            $current_license_status = 'Not activated';
            $current_user_name = '';
            $license_source = 'none';

            if ($is_network_active) {
                $current_license_status = $network_license_info['status'];
                $current_user_name = $network_license_info['user_name'];
                $license_source = 'network';
            }

            $content = '<div class="maxi-dashboard_main-content maxi-dashboard_main-content-license">';
            $content .= '<div class="maxi-dashboard_main-content-settings">';

            if ($is_network_active) {
                $content .= '<h1>' . __('Network Pro license active', 'maxi-blocks') . '</h1>';
                $content .= '<p>' . __('Pro access is active network-wide. All sites in the network have access to Pro features.', 'maxi-blocks') . '</p>';
            } else {
                $content .= '<h1>' . __('Activate network Pro license', 'maxi-blocks') . '</h1>';
                $content .= '<p>' . __('Enter a purchase code to activate Pro access for the entire network.', 'maxi-blocks') . '</p>';
            }

            $content .= '</div>';

            $content .= '<div class="maxi-dashboard_main-content_accordion_wrapper">';
            $content .= '<div class="maxi-dashboard_main-content_accordion">';

            $content .= $this->generate_item_header(
                $is_network_active ? __('Network license status', 'maxi-blocks') : __('Network license activation', 'maxi-blocks'),
                true,
            );

            if ($is_network_active) {
                // Show active status
                $content .= '<div class="maxi-license-status-display">';
                $content .= '<h4>' . __('Status:', 'maxi-blocks') . ' <span id="current-network-license-status" class="maxi-license-active">' . esc_html($current_license_status) . '</span></h4>';
                $content .= '<h4>' . __('Licensed to:', 'maxi-blocks') . ' <span id="current-network-license-user">' . esc_html($current_user_name) . '</span></h4>';
                $content .= '<h4>' . __('Main domain:', 'maxi-blocks') . ' <span id="current-network-license-domain">' . esc_html($network_license_info['domain']) . '</span></h4>';
                $content .= '<h4>' . __('License type:', 'maxi-blocks') . ' <span class="maxi-license-network">Network License</span></h4>';
                $content .= '</div>';

                // Show deactivate button
                $content .= '<div class="maxi-license-actions">';
                $content .= '<button type="button" id="maxi-network-license-logout" class="button button-primary">' . __('Deactivate network license', 'maxi-blocks') . '</button>';
                $content .= '</div>';

                // Show network behavior explanation
                $content .= '<div class="maxi-license-network-info">';
                $content .= '<h4>' . __('How network licensing works:', 'maxi-blocks') . '</h4>';
                $content .= '<ul>';
                $content .= '<li>' . __('All sites in the network have Pro access automatically', 'maxi-blocks') . '</li>';
                $content .= '<li>' . __('Individual site license tabs will show network license status', 'maxi-blocks') . '</li>';
                $content .= '<li>' . __('Purchase codes cannot be activated on individual sites when network license is active', 'maxi-blocks') . '</li>';
                $content .= '</ul>';
                $content .= '</div>';
            } else {
                // Show current status for not activated
                $content .= '<div class="maxi-license-status-display">';
                $content .= '<h4>' . __('Current status:', 'maxi-blocks') . ' <span id="current-network-license-status" class="maxi-license-inactive">' . esc_html($current_license_status) . '</span></h4>';
                $content .= '</div>';

                // Show authentication input form
                $content .= '<div class="maxi-license-auth-form">';
                $content .= '<div class="maxi-license-input-group">';
                $content .= '<input type="text" id="maxi-network-license-input" class="maxi-dashboard_main-content_accordion-item-input regular-text" placeholder="' . esc_attr__('Network purchase code', 'maxi-blocks') . '" />';
                $content .= '<p class="maxi-license-help-text">' . sprintf(__('Enter a purchase code to activate Pro access for the entire network. Find your code in your account or %s', 'maxi-blocks'), '<a href="https://my.maxiblocks.com" target="_blank" rel="noopener noreferrer">my.maxiblocks.com</a>') . '</p>';
                $content .= '</div>';

                $content .= '<div class="maxi-license-actions">';
                $content .= '<button type="button" id="maxi-validate-network-license" class="button button-primary">' . __('Activate network license', 'maxi-blocks') . '</button>';
                $content .= '</div>';

                $content .= '<div id="maxi-network-license-validation-message" class="maxi-license-message" style="display: none;"></div>';

                $content .= '</div>'; // maxi-license-auth-form

                // Show network behavior explanation
                $content .= '<div class="maxi-license-network-info">';
                $content .= '<h4>' . __('Network licensing benefits:', 'maxi-blocks') . '</h4>';
                $content .= '<ul>';
                $content .= '<li>' . __('One purchase code activates Pro for all sites in the network', 'maxi-blocks') . '</li>';
                $content .= '<li>' . __('No need to activate individual sites separately', 'maxi-blocks') . '</li>';
                $content .= '<li>' . __('Centralized license management from the network admin', 'maxi-blocks') . '</li>';
                $content .= '</ul>';
                $content .= '</div>';
            }

            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item-content
            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item

            $content .= '</div>'; // maxi-dashboard_main-content_accordion
            $content .= '</div>'; // maxi-dashboard_main-content

            return $content;
        }

        /**
         * Enqueue scripts and styles for network admin
         */
        public function maxi_network_admin_scripts_styles($hook_suffix = '')
        {

            // Call regular admin scripts for network admin
            $this->maxi_admin_scripts_styles();

            // Add additional localization specifically for network license page
            $network_license_info = $this->get_network_license_info();
            wp_localize_script('maxi-admin', 'maxiNetworkLicenseSettings', [
                'middlewareUrl' => defined('MAXI_BLOCKS_AUTH_MIDDLEWARE_URL') ? MAXI_BLOCKS_AUTH_MIDDLEWARE_URL : '',
                'middlewareKey' => defined('MAXI_BLOCKS_AUTH_MIDDLEWARE_KEY') ? MAXI_BLOCKS_AUTH_MIDDLEWARE_KEY : '',
                'ajaxUrl' => admin_url('admin-ajax.php'), // AJAX URLs work the same in network admin
                'nonce' => wp_create_nonce('maxi_network_license_validation'),
                'currentDomain' => $this->get_main_site_domain(),
                'pluginVersion' => MAXI_PLUGIN_VERSION,
                'isMultisite' => true,
                'hasNetworkLicense' => $this->has_network_license(),
                'networkLicenseName' => $network_license_info ? $network_license_info['user_name'] : '',
                'isNetworkAdmin' => true,
            ]);
        }

        /**
         * Get the main site domain for network licensing
         * @returns string
         */
        private function get_main_site_domain()
        {
            if (!is_multisite()) {
                return parse_url(home_url(), PHP_URL_HOST);
            }

            // Get the main site URL
            $main_site_url = get_site_url(get_main_site_id());
            return parse_url($main_site_url, PHP_URL_HOST);
        }

        public function maxi_blocks_welcome()
        {
            $current_user = wp_get_current_user();
            $user_name = $current_user->user_firstname;

            $content =
                '<div class="maxi-dashboard_main-content maxi-dashboard_main-content-start">';

            // Welcome header section
            $content .= '<div class="welcome-header">';
            $content .= '<h1>';
            if ($user_name) {
                $content .=
                    __('Hello, ', 'maxi-blocks') . esc_html($user_name) . ' 👋';
            } else {
                $content .= __('Hello, friend', 'maxi-blocks') . ' 👋';
            }
            $content .= '</h1>';

            $content .=
                '<p>' .
                __(
                    'Let\'s get set up so you can start designing straight away.',
                    'maxi-blocks',
                ) .
                '</p>';
            $content .=
                '<p>' .
                __(
                    'Just a few quick steps, and you\'re ready to go!',
                    'maxi-blocks',
                ) .
                '</p>';

            // Action buttons
            $content .= '<div class="welcome-actions">';
            $content .=
                '<a href="' .
                esc_url(admin_url('admin.php?page=maxi-blocks-quick-start')) .
                '" target="_blank" class="button button-primary quick-start">' .
                __('Quick start', 'maxi-blocks') .
                '</a>';
            $content .=
                '<a href="' .
                esc_url(admin_url('post-new.php?post_type=page')) .
                '" target="_blank" class="button button-secondary create-new">' .
                __('Create new page', 'maxi-blocks') .
                '</a>';
            $content .= '</div>';
            $content .= '</div>'; // welcome-header

            // Placeholder image section
            //  $content .= '<div class="welcome-preview">';
            // $content .=
            //     '<img src="' .
            //     esc_url(
            //         MAXI_PLUGIN_URL_PATH .
            //             'img/maxi-dashboard-video-placeholder.jpg',
            //     ) .
            //     '" alt="' .
            //     esc_attr__('MaxiBlocks preview', 'maxi-blocks') .
            //     '" class="preview-placeholder">';
            // $content .= '</div>';

            // Learn by watching section
            $content .= '<div class="learn-section">';
            $content .=
                '<h2>' . __('Learn by watching', 'maxi-blocks') . '</h2>';
            $content .=
                '<p>' .
                __(
                    'Watch quick tutorials to get the most out of MaxiBlocks. Learn tips, tricks and best practices to build faster and smarter.',
                    'maxi-blocks',
                ) .
                '</p>';

            // Video grid
            $content .= '<div class="video-grid">';

            // Video items
            $videos = [
                [
                    'title' => __(
                        'Understanding full site editing in WordPress',
                        'maxi-blocks',
                    ),
                    'description' => __(
                        'Learn what full site editing (FSE) is in WordPress and how it changes the way you design and customize your website using blocks.',
                        'maxi-blocks',
                    ),
                    'image' =>
                        MAXI_PLUGIN_URL_PATH .
                        'img/what-is-full-site-editing-in-wordpress.jpg',
                    'link' =>
                        'https://youtu.be/vd9foamWlZ4?si=E3vWph2ybOOng9CH',
                ],
                [
                    'title' => __(
                        'Step-by-step: how to add a new page in WordPress',
                        'maxi-blocks',
                    ),
                    'description' => __(
                        'A quick guide to creating and managing new pages in WordPress, perfect for beginners looking to build their site.',
                        'maxi-blocks',
                    ),
                    'image' =>
                        MAXI_PLUGIN_URL_PATH .
                        'img/how-to-add-a-page-in-wordpress.jpg',
                    'link' =>
                        'https://youtu.be/fchhWrc_ubs?si=ImMmTIK5--Qiw-jO',
                ],
                [
                    'title' => __(
                        'How to set a page as your homepage in WordPress',
                        'maxi-blocks',
                    ),
                    'description' => __(
                        'Want a custom homepage? This tutorial shows you how to set any page as your homepage in just a few clicks.',
                        'maxi-blocks',
                    ),
                    'image' =>
                        MAXI_PLUGIN_URL_PATH .
                        'img/how-to-set-a-page-as-homepage-in-wordpress.jpg',
                    'link' =>
                        'https://youtu.be/fchhWrc_ubs?si=IYB_3Ou26-RPOD7n',
                ],
                [
                    'title' => __(
                        'How to edit and customise the footer in WordPress',
                        'maxi-blocks',
                    ),
                    'description' => __(
                        'Need to change the footer? This guide helps you through the steps to edit and personalize your footer section.',
                        'maxi-blocks',
                    ),
                    'image' =>
                        MAXI_PLUGIN_URL_PATH .
                        'img/wordpress-how-to-change-footer.jpg',
                    'link' =>
                        'https://youtu.be/DMDrmpNO6gc?si=dtFr6q4y94TMk48y',
                ],
                [
                    'title' => __(
                        'How to create and manage navigation menus in WordPress',
                        'maxi-blocks',
                    ),
                    'description' => __(
                        'Design your site\'s main navigation. Learn how to create and organize your WordPress for a better user experience.',
                        'maxi-blocks',
                    ),
                    'image' =>
                        MAXI_PLUGIN_URL_PATH .
                        'img/wordpress-navigation-menu.jpg',
                    'link' =>
                        'https://youtu.be/ikZRr4YpzIs?si=1RNdjYYrCTCogvU4',
                ],
                [
                    'title' => __(
                        'How to add and format content in WordPress',
                        'maxi-blocks',
                    ),
                    'description' => __(
                        'Learn how to add text, images, and other content to your WordPress pages and posts. A guide to create engaging layouts.',
                        'maxi-blocks',
                    ),
                    'image' =>
                        MAXI_PLUGIN_URL_PATH .
                        'img/how-to-add-content-to-wordpress.jpg',
                    'link' =>
                        'https://youtu.be/aiWvSUuyDfo?si=W8lvYj4wFiJLbKNf',
                ],
            ];

            foreach ($videos as $video) {
                $content .= '<div class="video-item">';
                $content .=
                    '<a href="' .
                    esc_url($video['link']) .
                    '" target="_blank">';
                $content .=
                    '<div class="video-thumbnail"><img src="' .
                    esc_url($video['image']) .
                    '" alt="' .
                    esc_attr($video['title']) .
                    '"></div>';
                $content .= '<h3>' . esc_html($video['title']) . '</h3>';
                $content .= '<p>' . esc_html($video['description']) . '</p>';
                $content .= '</a>';
                $content .= '</div>';
            }

            $content .= '</div>'; // video-grid

            $content .= '<div class="more-videos">';
            $content .=
                '<a href="https://www.youtube.com/watch?v=vd9foamWlZ4&list=PLyq6BtMKKWufXgUBJQ7e4w4jskjTsnQ1h" target="_blank" class="button">' .
                __('More videos', 'maxi-blocks') .
                '</a>';
            $content .= '</div>';

            $content .= '</div>'; // learn-section

            // Bottom CTAs section
            $content .= '<div class="bottom-ctas">';

            // Need help
            $content .= '<div class="cta-item">';
            $content .=
                '<img src="' .
                esc_url(MAXI_PLUGIN_URL_PATH . 'img/maxiblocks-support.svg') .
                '" alt="' .
                esc_attr__('Need Help', 'maxi-blocks') .
                '" class="cta-icon">';
            $content .= '<h3>' . __('Need help?', 'maxi-blocks') . '</h3>';
            $content .=
                '<p>' .
                __(
                    'We\'re here for you. Get the support you need!',
                    'maxi-blocks',
                ) .
                '</p>';
            $content .=
                '<a href="https://maxiblocks.com/go/read-the-blog" target="_blank" class="button">' .
                __('Read the blog', 'maxi-blocks') .
                '</a>';
            $content .= '</div>';

            // Never miss an update
            $content .= '<div class="cta-item">';
            $content .=
                '<img src="' .
                esc_url(MAXI_PLUGIN_URL_PATH . 'img/maxiblocks-email.svg') .
                '" alt="' .
                esc_attr__('Never Miss an Update', 'maxi-blocks') .
                '" class="cta-icon">';
            $content .=
                '<h3>' . __('Never miss an update', 'maxi-blocks') . '</h3>';
            $content .=
                '<p>' .
                __(
                    'Get new patterns, tips, and updates—no spam.',
                    'maxi-blocks',
                ) .
                '</p>';
            $content .=
                '<a href="https://maxiblocks.com/go/notify-me" target="_blank" class="button">' .
                __('Notify me', 'maxi-blocks') .
                '</a>';
            $content .= '</div>';

            // Share thoughts
            $content .= '<div class="cta-item">';
            $content .=
                '<img src="' .
                esc_url(
                    MAXI_PLUGIN_URL_PATH . 'img/maxiblocks-testimonial.svg',
                ) .
                '" alt="' .
                esc_attr__('Share Your Thoughts', 'maxi-blocks') .
                '" class="cta-icon">';
            $content .=
                '<h3>' . __('Share your thoughts!', 'maxi-blocks') . '</h3>';
            $content .=
                '<p>' .
                __(
                    'Love us? Leave a review and help others discover it.',
                    'maxi-blocks',
                ) .
                '</p>';
            $content .=
                '<a href="https://maxiblocks.com/go/give-a-review" target="_blank" class="button">' .
                __('Give a review', 'maxi-blocks') .
                '</a>';
            $content .= '</div>';

            $content .= '</div>'; // bottom-ctas

            $content .= '</div>'; // maxi-dashboard_main-content

            return $content;
        }

        public function maxi_blocks_settings()
        {
            $content = '<div class="maxi-dashboard_main-content">';

            // Add new header section
            $content .= '<div class="maxi-dashboard_main-content-settings">';
            $content .= '<h1>' . __('Settings', 'maxi-blocks') . '</h1>';
            $content .=
                '<p>' .
                __(
                    'Customise MaxiBlocks, manage fonts, APIs, and access support.',
                    'maxi-blocks',
                ) .
                '</p>';
            $content .= '</div>';

            $content .=
                '<div class="maxi-dashboard_main-content_accordion_wrapper">';
            $content .= '<div class="maxi-dashboard_main-content_accordion">';

            $font_uploads_dir = wp_upload_dir()['basedir'] . '/maxi/fonts/';
            $font_uploads_dir_size = round(
                $this->get_folder_size($font_uploads_dir) / 1048576,
                2,
            );

            $content .= $this->generate_item_header(
                __('Editor preferences', 'maxi-blocks'),
                true,
            );

            $description =
                '<h4>' . __('Hide interface tooltips', 'maxi-blocks') . '</h4>';
            $description .=
                '<p>' .
                __('Hide tooltips on mouse-hover.', 'maxi-blocks') .
                '</p>';
            $content .= $this->generate_setting($description, 'hide_tooltips');

            $content .= get_submit_button(__('Save changes', 'maxi-blocks'));
            $this->add_hidden_api_fields();

            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item-content
            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item

            $content .= $this->generate_item_header(
                __('Google Maps API key', 'maxi-blocks'),
                false,
            );

            $content .=
                '<h4>' .
                __('Create Google Maps API key', 'maxi-blocks') .
                '</h4>';
            $content .=
                '<p>' .
                __(
                    'To use Google Maps features, Google requires you to provide an API key that the plugin can use to make these requests on your behalf.',
                    'maxi-blocks',
                ) .
                '</p>';
            $content .=
                '<p>' .
                __(
                    'To create an API key, you will need to do the following:',
                    'maxi-blocks',
                ) .
                '</p>';
            $content .= '<ol>';
            $content .=
                '<li>' .
                __(
                    'Create a Google Cloud Platform account, if you don\'t already have one.',
                    'maxi-blocks',
                ) .
                '</li>';
            $content .=
                '<li>' .
                __(
                    'Create a new Google Cloud Platform project.',
                    'maxi-blocks',
                ) .
                '</li>';
            $content .=
                '<li>' .
                __('Enable Google Maps Platform APIs.', 'maxi-blocks') .
                '</li>';
            $content .=
                '<li>' . __('Generate an API key.', 'maxi-blocks') . '</li>';
            $content .= '</ol>';
            $content .=
                '<p>' .
                __('To make this process easy, launch', 'maxi-blocks') .
                ' ';
            $content .=
                '<a href="https://maxiblocks.com/go/google-maps-api-quickstart" target="_blank" rel="noreferrer">';
            $content .= __('Google Maps API Quickstart', 'maxi-blocks');
            $content .= '</a> ';
            $content .=
                __(
                    'which will handle the setup of your account and generate the API key that you can insert below.',
                    'maxi-blocks',
                ) . '</p>';

            $description =
                '<h4>' .
                __('Insert Google Maps API Key here', 'maxi-blocks') .
                '</h4>';
            $content .= $this->generate_setting(
                $description,
                'google_api_key_option',
                '',
                'password',
            );

            $content .= get_submit_button(__('Save changes', 'maxi-blocks'));
            $this->add_hidden_api_fields();

            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item-content
            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item
            $content .= $this->generate_item_header(
                __('Fonts and files', 'maxi-blocks'),
                false,
            );

            $use_bunny_fonts = get_option('bunny_fonts');
            $font_provider_label = $use_bunny_fonts
                ? 'Bunny Fonts'
                : 'Google Fonts';

            $description =
                '<h4>' . __('Use Bunny Fonts', 'maxi-blocks') . '</h4>';
            $description .=
                '<p>' .
                sprintf(__('You are currently using: %s', 'maxi-blocks'), $font_provider_label) .
                '</p>';
            $description .=
                '<p>' .
                __(
                    'Bunny Fonts: Privacy-friendly, GDPR compliant. Global CDN for fast loading. Wide selection of fonts available.',
                    'maxi-blocks',
                ) .
                '</p>';
            $description .=
                '<p>' .
                __(
                    'Google Fonts: Extensive font selection. Potential privacy concerns when using Google\'s CDN.',
                    'maxi-blocks',
                ) .
                '</p>';
            $content .= $this->generate_setting($description, 'bunny_fonts');

            if ($use_bunny_fonts) {
                $description =
                    '<h4>' .
                    __('Serve Bunny Fonts locally', 'maxi-blocks') .
                    '</h4>';
                $description .=
                    '<p>' .
                    __(
                        'Serve Bunny Fonts from CDN: Fastest option. Uses external CDN. No local storage required.',
                        'maxi-blocks',
                    ) .
                    '</p>';
                $description .=
                    '<p>' .
                    __(
                        'Serve Bunny Fonts locally: Privacy-focused. May impact server performance. Requires local storage.',
                        'maxi-blocks',
                    ) .
                    '</p>';
                $content .= $this->generate_setting(
                    $description,
                    'local_fonts',
                    $this->local_fonts_upload(),
                );
            } else {
                $description =
                    '<h4>' .
                    __('Serve Google Fonts locally', 'maxi-blocks') .
                    '</h4>';
                $description .=
                    '<p>' .
                    __(
                        'Serve from Google CDN: Fastest option. Uses Google\'s CDN. Potential privacy (GDPR) implications.',
                        'maxi-blocks',
                    ) .
                    '</p>';
                $description .=
                    '<p>' .
                    __(
                        'Serve Google Fonts locally: Blocks Google tracking. May impact server performance. Requires local storage.',
                        'maxi-blocks',
                    ) .
                    '</p>';
                $content .= $this->generate_setting(
                    $description,
                    'local_fonts',
                    $this->local_fonts_upload(),
                );
            }

            if ($font_uploads_dir_size > 0) {
                $content .=
                    '<p>' .
                    __('Size of the local fonts:', 'maxi-blocks') .
                    ' ' .
                    $font_uploads_dir_size .
                    __('MB', 'maxi-blocks') .
                    '</p>';

                if (!(bool) get_option('local_fonts')) {
                    update_option('local_fonts_uploaded', false);
                    $description =
                        '<h4>' .
                        __('Remove local fonts', 'maxi-blocks') .
                        '</h4>';
                    $content .= $this->generate_setting(
                        $description,
                        'remove_local_fonts',
                        $this->remove_local_fonts(),
                    );
                }
            }

            $content .= get_submit_button(__('Save changes', 'maxi-blocks'));
            $this->add_hidden_api_fields();

            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item-content
            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item

            $content .= $this->generate_item_header(
                __('Documentation & support', 'maxi-blocks'),
                false,
            );

            $content .= '<p>' . __('Read the ', 'maxi-blocks');
            $content .=
                '<a href="https://maxiblocks.com/go/help-center" target="_blank"> ' .
                __('help center documentation', 'maxi-blocks') .
                '</a>';
            $content .= __(' for self-service.', 'maxi-blocks') . '</p>';

            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item-content
            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item

            $content .= $this->generate_item_header(
                __('Troubleshooting', 'maxi-blocks'),
                false,
            );

            $content .=
                '<h4>' . __('Site health info report', 'maxi-blocks') . '</h4>';
            $content .=
                '<p>' .
                __(
                    'The site health report gives every detail about the configuration of your WordPress website. Helpful when troubleshooting issues. Use the copy-to-clipboard button and include it in a private email with your support assistant. Never share this information publicly.',
                    'maxi-blocks',
                ) .
                '</p>';
            $content .=
                '<p><a href="/wp-admin/site-health.php?tab=debug" target="_blank"> ' .
                __('Go to site health info', 'maxi-blocks') .
                '</a></p>';

            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item-content
            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item

            $content .= $this->generate_item_header(
                __('Experimental preferences', 'maxi-blocks'),
                false,
            );

            $description =
                '<h4>' .
                __('Enable settings indicators', 'maxi-blocks') .
                '</h4>';
            $description .=
                '<p>' .
                __(
                    'Enables indicators that shows the modified settings on MaxiBlocks blocks inspector settings',
                    'maxi-blocks',
                ) .
                '</p>';
            $content .= $this->generate_setting(
                $description,
                'maxi_show_indicators',
            );

            $content .= get_submit_button();
            $this->add_hidden_api_fields();

            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item-content
            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item

            $content .= '</div>'; // maxi-dashboard_main-content_accordion
            $content .= '</div>'; // maxi-dashboard_main-content

            return $content;
        }

        public function maxi_blocks_maxi_ai()
        {
            $content = '<div class="maxi-dashboard_main-content">';
            $content .=
                '<div class="maxi-dashboard_main-content-settings maxi-dashboard_main-content-maxi-ai">';
            $content .= '<h1>' . __('Maxi AI', 'maxi-blocks') . '</h1>';
            $content .=
                '<p>' .
                __('General setting for Maxi AI writer', 'maxi-blocks') .
                '</p>';
            $content .= '</div>';

            $content .=
                '<div class="maxi-dashboard_main-content_accordion_wrapper">';
            $content .= '<div class="maxi-dashboard_main-content_accordion">';

            $content .= $this->generate_item_header(
                __('Integrations', 'maxi-blocks'),
                true,
            );

            $description =
                '<h4>' .
                __('Insert OpenAI API Key here', 'maxi-blocks') .
                '</h4>';
            $content .= $this->generate_setting(
                $description,
                'openai_api_key_option',
                '',
                'password',
            );

            $description =
                '<h4>' . __('ChatGPT AI Model', 'maxi-blocks') . '</h4>';
            $content .= $this->generate_setting(
                $description,
                'maxi_ai_model',
                '',
                'dropdown',
                ['list' => []],
            );

            $content .= get_submit_button();
            $this->add_hidden_api_fields();

            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item-content
            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item

            $content .= $this->generate_item_header(
                __('Website identity', 'maxi-blocks'),
                true,
            );

            $description =
                '
				<h4>' .
                __('Tell us about your site', 'maxi-blocks') .
                '</h4>
				<p>' .
                __(
                    'What is the primary goal of your website? (e.g. shopping platform, offering
				services, showcasing work, journaling)',
                    'maxi-blocks',
                ) .
                '</p>';
            $content .= $this->generate_setting(
                $description,
                'maxi_ai_site_description',
                '',
                'textarea',
                [
                    'placeholder' => __(
                        'Example: Hairdresser, Plumber, Marketing agency',
                        'maxi-blocks',
                    ),
                ],
            );

            $description =
                '
				<h4>' .
                __('Who is your target audience?', 'maxi-blocks') .
                '</h4>
				<p>' .
                __(
                    'Group of people you want to connect with or offer services to.',
                    'maxi-blocks',
                ) .
                '</p>';
            $content .= $this->generate_setting(
                $description,
                'maxi_ai_audience',
                '',
                'textarea',
                [
                    'placeholder' => __(
                        'Example: Ladies who need haircuts',
                        'maxi-blocks',
                    ),
                ],
            );

            $description =
                '
				<h4>' .
                __('What is the goal of the website?', 'maxi-blocks') .
                '</h4>
				<p>' .
                __(
                    'Enter as many as you like. Separate with commas.',
                    'maxi-blocks',
                ) .
                '</p>';
            $content .= $this->generate_setting(
                $description,
                'maxi_ai_site_goal',
                '',
                'textarea',
                [
                    'placeholder' => __(
                        'Example: Get bookings, write a blog',
                        'maxi-blocks',
                    ),
                ],
            );

            $description =
                '
				<h4>' .
                __('What services do you offer?', 'maxi-blocks') .
                '</h4>
				<p>' .
                __(
                    'Enter as many as you like. Separate with commas.',
                    'maxi-blocks',
                ) .
                '</p>';
            $content .= $this->generate_setting(
                $description,
                'maxi_ai_services',
                '',
                'textarea',
                [
                    'placeholder' => __(
                        'Example: Hair cuts, blow dries, beard shave',
                        'maxi-blocks',
                    ),
                ],
            );

            $description =
                '
				<h4>' .
                __('What is your website or business name?', 'maxi-blocks') .
                '</h4>
				<p>' .
                __(
                    'The name will be used for writing content. Optional. Takes WordPress Site Title by default',
                    'maxi-blocks',
                ) .
                '</p>';
            $content .= $this->generate_setting(
                $description,
                'maxi_ai_business_name',
                '',
                'textarea',
                [
                    'placeholder' => __(
                        "Example: Mary's fabulous hair studio",
                        'maxi-blocks',
                    ),
                ],
            );

            $description =
                '
				<h4>' .
                __('Anything else we should know?', 'maxi-blocks') .
                '</h4>
				<p>' .
                __(
                    'Outline your business operations, share the origins of your venture, detail your offerings, and highlight the unique value you add to your audience.',
                    'maxi-blocks',
                ) .
                '</p>';
            $content .= $this->generate_setting(
                $description,
                'maxi_ai_business_info',
                '',
                'textarea',
                [
                    'placeholder' => __(
                        'Example: Get bookings, write a blog',
                        'maxi-blocks',
                    ),
                ],
            );

            $content .= get_submit_button();
            $this->add_hidden_api_fields();

            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item-content
            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item

            $content .= '</div>'; // maxi-dashboard_main-content_accordion
            $content .= '</div>'; // maxi-dashboard_main-content

            return $content;
        }

        public function maxi_blocks_starter_sites_init()
        {
            $path = MAXI_PLUGIN_URL_PATH . 'core/admin/starter-sites/build';

            wp_register_script(
                'maxi-starter-sites',
                $path . '/js/main.js',
                ['wp-element', 'wp-components', 'wp-i18n', 'wp-api-fetch'],
                MAXI_PLUGIN_VERSION,
                true,
            );

            wp_register_style(
                'maxi-starter-sites',
                $path . '/css/main.css',
                [],
                MAXI_PLUGIN_VERSION,
            );

            // Check WordPress Importer plugin status
            $wp_importer_status = 'missing';
            if (
                file_exists(
                    WP_PLUGIN_DIR .
                        '/wordpress-importer/wordpress-importer.php',
                )
            ) {
                $wp_importer_status = is_plugin_active(
                    'wordpress-importer/wordpress-importer.php',
                )
                    ? 'active'
                    : 'installed';
            }

            wp_localize_script('maxi-starter-sites', 'maxiStarterSites', [
                'ajaxUrl' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('maxi_starter_sites'),
                'apiRoot' => esc_url_raw(rest_url()),
                'apiNonce' => wp_create_nonce('wp_rest'),
                'adminUrl' => admin_url(),
                'installNonce' => wp_create_nonce(
                    'install-plugin_wordpress-importer',
                ),
                'activateNonce' => wp_create_nonce(
                    'activate-plugin_wordpress-importer/wordpress-importer.php',
                ),
                'currentStarterSite' => get_option(
                    'maxiblocks_current_starter_site',
                    '',
                ),
                'wpImporterStatus' => $wp_importer_status,
                'proInitialState' => get_option('maxi_pro', ''),
            ]);

            // Add license settings for authentication context
            $network_license_info = $this->get_network_license_info();
            wp_localize_script('maxi-starter-sites', 'maxiLicenseSettings', [
                'middlewareUrl' => defined('MAXI_BLOCKS_AUTH_MIDDLEWARE_URL') ? MAXI_BLOCKS_AUTH_MIDDLEWARE_URL : '',
                'middlewareKey' => defined('MAXI_BLOCKS_AUTH_MIDDLEWARE_KEY') ? MAXI_BLOCKS_AUTH_MIDDLEWARE_KEY : '',
                'ajaxUrl' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('maxi_license_validation'),
                'currentDomain' => parse_url(home_url(), PHP_URL_HOST),
                'pluginVersion' => MAXI_PLUGIN_VERSION,
                'isMultisite' => is_multisite(),
                'hasNetworkLicense' => $this->has_network_license(),
                'networkLicenseName' => $network_license_info ? $network_license_info['user_name'] : '',
                'isNetworkAdmin' => false,
            ]);
        }

        public function maxi_blocks_starter_sites()
        {
            // Enqueue the scripts and styles
            wp_enqueue_script('maxi-starter-sites');
            wp_enqueue_style('maxi-starter-sites');

            $content =
                '<div class="maxi-dashboard_main-content maxi-dashboard_main-content-pro-library maxi-dashboard_main-content-starter-sites">';
            $content .=
                '<div class="maxi-dashboard_main-content_accordion" id="maxi-dashboard_main-content_starter-sites">';

            $content .= '<div id="maxi-dashboard_main-content_not-pro">';
            $content .= '<h1>' . __('Starter sites', 'maxi-blocks') . '</h1>';
            $content .=
                '<h2>' .
                __('Get started with a pre-built website', 'maxi-blocks') .
                '</h2>';

            // Add root element for React app
            $content .= '<div id="maxi-starter-sites-root"></div>';

            $content .= '</div>'; // maxi-dashboard_main-content_not-pro

            return $content;
        }

        public function generate_item_header($title, $checked)
        {
            $label = str_replace(
                ' ',
                '-',
                strtolower(str_replace('& ', '', $title)),
            );
            $header =
                '<div class="maxi-dashboard_main-content_accordion-item">';
            $header .= '<input type="checkbox"';

            if ($checked === true) {
                $header .= ' checked';
            }

            $header .=
                ' class="maxi-dashboard_main-content_accordion-item-checkbox" id="';
            $header .= $label . '">';
            $header .= '<label for="';
            $header .= $label;
            $header .=
                '" class="maxi-dashboard_main-content_accordion-item-label">';
            $header .= '<h3>' . $title . '</h3>';
            $header .= '</label>';
            $header .=
                '<div class="maxi-dashboard_main-content_accordion-item-content">';

            return $header;
        }

        public function generate_toggle($option, $function = '')
        {
            $toggle =
                '<div class="maxi-dashboard_main-content_accordion-item-content-switcher">';
            $toggle .=
                '<div class="maxi-dashboard_main-content_accordion-item-content-switcher__toggle">';
            $toggle .= '<input name="';
            $toggle .= $option;
            $toggle .=
                '" class="maxi-dashboard_main-content_accordion-item-toggle" ';
            if ((bool) get_option($option)) {
                $toggle .= ' checked="checked" ';
                if (is_callable($function)) {
                    $function();
                }
            }
            $toggle .= ' type="checkbox" id="';
            $toggle .= $option;
            $toggle .= '" value="1">';
            $toggle .=
                '<span class="maxi-dashboard_main-content_accordion-item-content-switcher__toggle__track"></span>';
            $toggle .=
                '<span class="maxi-dashboard_main-content_accordion-item-content-switcher__toggle__thumb"></span>';
            $toggle .= '</div>'; // maxi-dashboard_main-content_accordion-item-content-switcher__toggle
            $toggle .= '</div>'; // maxi-dashboard_main-content_accordion-item-content-switcher

            return $toggle;
        }

        public function generate_input($option, $function = '', $type = 'text', $args = [])
        {
            $is_api_input = isset($args['is_api_input']) ? $args['is_api_input'] : false;
            $placeholder = isset($args['placeholder']) ? $args['placeholder'] : '';

            $input_value = get_option($option);

            $visible_input_class = str_replace('_', '-', $option).'-visible-input';

            if ($type === 'textarea') {
                $visible_input = "<textarea name=\"{$option}\" id=\"{$option}\" class=\"maxi-dashboard_main-content_accordion-item-input regular-text\">{$input_value}</textarea>";
            } else {
                // Always keep the name attribute for all inputs
                $visible_input = "<input name=\"{$option}\" id=\"{$option}\" class=\"maxi-dashboard_main-content_accordion-item-input regular-text {$visible_input_class}\" type=\"{$type}\" value=\"{$input_value}\"/>";
            }

            $input = <<<HTML
                <div class="maxi-dashboard_main-content_accordion-item-content-switcher">
                    <span class="maxi-dashboard_main-content_accordion-item-content-switcher__label">{$placeholder}</span>
                    <div class="maxi-dashboard_main-content_accordion-item-content-switcher__input">
                        {$visible_input}
                    </div> <!-- maxi-dashboard_main-content_accordion-item-content-switcher__input -->
                </div> <!-- maxi-dashboard_main-content_accordion-item-content-switcher -->
            HTML;

            return $input;
        }

        public function generate_breakpoint_input($breakpoint, $value)
        {
            $breakpoint_label = 'maxi-breakpoint-' . $breakpoint;

            $input =
                '<div class="maxi-dashboard_main-content_accordion-item-content-switcher">';
            $input .=
                '<div class="maxi-dashboard_main-content_accordion-item-content-switcher__input">';
            $input .=
                '<label class="maxi-dashboard_main-content_accordion-item-content-switcher__label" for="';
            $input .= $breakpoint_label;
            $input .= '">';
            $input .= $breakpoint;
            $input .= '</label>'; // maxi-dashboard_main-content_accordion-item-content-switcher__label
            $input .= '<input name="';
            $input .= $breakpoint_label . '" id="' . $breakpoint_label;
            $input .=
                '" class="maxi-dashboard_main-content_accordion-item-input regular-number" type="number" min="0" value="';
            $input .= $value;
            $input .= '">';
            $input .= '</div>'; // maxi-dashboard_main-content_accordion-item-content-switcher__input
            $input .= '</div>'; // maxi-dashboard_main-content_accordion-item-content-switcher

            return $input;
        }

        public function generate_breakpoint_inputs()
        {
            require_once plugin_dir_path(__DIR__) .
                '../core/class-maxi-local-fonts.php';
            $api = new MaxiBlocks_API();

            $breakpoints_html = '';
            $breakpoints_array = $api->get_maxi_blocks_breakpoints();

            foreach ($breakpoints_array as $breakpoint => $value) {
                $value_num = intval($value);
                $breakpoints_html .= $this->generate_breakpoint_input(
                    $breakpoint,
                    $value_num,
                );
            }

            $breakpoints_string = esc_html(wp_json_encode($breakpoints_array));

            $breakpoints_html .=
                '<input type="hidden" name="maxi_breakpoints" id="maxi-breakpoints" value="';
            $breakpoints_html .= $breakpoints_string;
            $breakpoints_html .= '">';

            return $breakpoints_html;
        }

        public function generate_custom_dropdown($option, $args)
        {
            $list = isset($args['list']) ? $args['list'] : [];
            $is_ai_model = $option === 'maxi_ai_model';

            $dropdown =
                '<div class="maxi-dashboard_main-content_accordion-item-content-switcher">';
            $dropdown .=
                '<div class="maxi-dashboard_main-content_accordion-item-content-switcher__dropdown">';
            $dropdown .=
                '<select name="' .
                $option .
                '" id="' .
                $option .
                '" class="maxi-dashboard_main-content_accordion-item-input regular-text">';

            $option_value = get_option($option)
                ? get_option($option)
                : 'gpt-3.5-turbo';

            if ($is_ai_model) {
                // For AI model dropdown, show loading placeholder
                $dropdown .=
                    '<option value=""></option>';
            } else {
                // For other dropdowns, process the static list
                if (($key = array_search($option_value, $list)) !== false) {
                    unset($list[$key]);
                    array_unshift($list, $option_value);
                }

                foreach ($list as $value) {
                    $dropdown .= '<option value="'.$value.'">'.$value.'</option>';
                }
            }

            $dropdown .= '</select>';

            $dropdown .= $this->generate_input($option, '', 'hidden');

            $dropdown .= '</div>'; // maxi-dashboard_main-content_accordion-item-content-switcher__dropdown
            $dropdown .= '</div>'; // maxi-dashboard_main-content_accordion-item-content-switcher

            return $dropdown;
        }

        public function generate_setting(
            $description,
            $option,
            $function = '',
            $type = 'toggle',
            $args = []
        ) {
            $content =
                '<div class="maxi-dashboard_main-content_accordion-item-content-setting">';
            $content .=
                '<div class="maxi-dashboard_main-content_accordion-item-content-description">';
            $content .= $description;
            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item-content-description

            if ($type === 'dropdown') {
                $content .= $this->generate_custom_dropdown($option, $args);
            } elseif ($type === 'text' || $type === 'password' || $type === 'textarea') {
                $is_api_input = $type === 'password';

                if ($is_api_input) {
                    $api_name = str_replace('_api_key_option', '', $option);
                    $content .= '<div id="maxi-api-test"></div>';
                }

                $args['is_api_input'] = $is_api_input;

                $content .= $this->generate_input(
                    $option,
                    $function,
                    $type,
                    $args,
                );

                if (str_contains($option, 'api_key_option')) {
                    $content .='<div id="maxi-api-test__validation-message"></div>';
                }
            } else {
                $content .= $this->generate_toggle($option, $function);
            }

            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item-content-setting

            return $content;
        }

        public function maxi_blocks_allowed_html()
        {
            if (!function_exists('maxi_blocks_allowed_html')) {
                require_once plugin_dir_path(__FILE__) .
                    '/maxi-allowed-html-tags.php';
            }

            return maxi_blocks_allowed_html();
        }

        public function register_maxi_blocks_settings()
        {
            // Define the arguments
            $args = [
                'type' => 'boolean',
                'default' => false,
            ];
            $args_true = [
                'type' => 'boolean',
                'default' => true,
            ];
            $args_rollback = [
                'type' => 'string',
                'default' => 'current',
            ];
            $args_ai_model = [
                'type' => 'string',
                'default' => 'gpt-3.5-turbo',
            ];
            $args_ai_description = [
                'type' => 'string',
            ];

            // Add arguments for API keys
            $args_api_key = array(
               'type' => 'string',
               'sanitize_callback' => 'sanitize_text_field',
            );

            // List of settings and corresponding arguments
            $settings = [
                'accessibility_option' => $args,
                'bunny_fonts' => $args,
                'local_fonts' => $args,
                'local_fonts_uploaded' => $args,
                'remove_local_fonts' => $args,
                'allow_svg_json_uploads' => $args,
                'hide_tooltips' => $args,
                'google_api_key_option' => $args_api_key,
                'openai_api_key_option' => $args_api_key,
                'maxi_ai_model' => $args_ai_model,
                'maxi_ai_site_description' => $args_ai_description,
                'maxi_ai_audience' => $args_ai_description,
                'maxi_ai_site_goal' => $args_ai_description,
                'maxi_ai_services' => $args_ai_description,
                'maxi_ai_business_name' => $args_ai_description,
                'maxi_ai_business_info' => $args_ai_description,
                'maxi_breakpoints' => null,
                'maxi_rollback_version' => $args_rollback,
                'maxi_sc_gutenberg_blocks' => $args,
                'maxi_show_indicators' => $args_true,
            ];

            // Register the settings and set default values if they don't exist
            foreach ($settings as $setting_name => $setting_args) {
                // ! For debug: reset saved settings/options
                // unregister_setting('maxi-blocks-settings-group', $setting_name);
                // delete_option($setting_name);

                register_setting('maxi-blocks-settings-group', $setting_name, $setting_args);
                if (isset($setting_args['default'])) {
                    add_option($setting_name, $setting_args['default']);
                }
            }
        }

        public function get_folder_size($folder)
        {
            $size = 0;

            foreach (glob(rtrim($folder, '/') . '/*', GLOB_NOSORT) as $each) {
                $size += is_file($each)
                    ? filesize($each)
                    : $this->get_folder_size($each);
            }

            return $size;
        }

        public function delete_all_files($folder)
        {
            $folder = trailingslashit($folder);

            // Try direct file operations first
            if (file_exists($folder) && is_dir($folder)) {
                $files = scandir($folder);

                if ($files !== false) {
                    foreach ($files as $file) {
                        if ($file === '.' || $file === '..') {
                            continue;
                        }

                        $file_path = $folder . $file;

                        if (is_dir($file_path)) {
                            $this->delete_all_files($file_path);
                        } elseif (is_file($file_path)) {
                            @unlink($file_path);
                        }
                    }

                    @rmdir($folder);
                    return;
                }
            }

            // Fallback to WP_Filesystem if direct operations fail
            global $wp_filesystem;
            if (empty($wp_filesystem)) {
                require_once ABSPATH . '/wp-admin/includes/file.php';
                WP_Filesystem(false, false, true);
            }

            if (empty($wp_filesystem)) {
                return;
            }

            if (!$wp_filesystem->exists($folder)) {
                return;
            }

            $files = $wp_filesystem->dirlist($folder);

            foreach ($files as $file) {
                $file_path = $folder . $file['name'];

                if ($file['type'] === 'd') {
                    // Check if it's a directory
                    $this->delete_all_files($file_path);
                } else {
                    $wp_filesystem->delete($file_path);
                }
            }

            $wp_filesystem->rmdir($folder);
        }

        public function remove_local_fonts()
        {
            if ((bool) get_option('remove_local_fonts')) {
                $fonts_uploads_dir = wp_upload_dir()['basedir'] . '/maxi/fonts';
                $this->delete_all_files($fonts_uploads_dir);
                update_option('remove_local_fonts', 0);
            }
        }

        public function local_fonts_upload()
        {
            if (!get_option('local_fonts_uploaded')) {
                require_once plugin_dir_path(__DIR__) .
                    '../core/class-maxi-local-fonts.php';
                MaxiBlocks_Local_Fonts::get_instance()->process_all_fonts();
            }
        }

        public function ajax_install_importer()
        {
            check_ajax_referer('install-plugin_wordpress-importer', 'nonce');

            if (!current_user_can('install_plugins')) {
                wp_send_json_error(['message' => 'Insufficient permissions']);
            }

            if (!function_exists('plugins_api')) {
                require_once ABSPATH . 'wp-admin/includes/plugin-install.php';
            }
            if (!class_exists('WP_Upgrader')) {
                require_once ABSPATH .
                    'wp-admin/includes/class-wp-upgrader.php';
            }

            $api = plugins_api('plugin_information', [
                'slug' => 'wordpress-importer',
                'fields' => ['sections' => false],
            ]);

            if (is_wp_error($api)) {
                wp_send_json_error(['message' => $api->get_error_message()]);
            }

            $upgrader = new Plugin_Upgrader(new Automatic_Upgrader_Skin());
            $result = $upgrader->install($api->download_link);

            if (is_wp_error($result)) {
                wp_send_json_error(['message' => $result->get_error_message()]);
            }

            wp_send_json_success(['status' => 'installed']);
        }

        public function ajax_activate_importer()
        {
            check_ajax_referer(
                'activate-plugin_wordpress-importer/wordpress-importer.php',
                'nonce',
            );

            if (!current_user_can('activate_plugins')) {
                wp_send_json_error(['message' => 'Insufficient permissions']);
            }

            $result = activate_plugin(
                'wordpress-importer/wordpress-importer.php',
            );

            if (is_wp_error($result)) {
                wp_send_json_error(['message' => $result->get_error_message()]);
            }

            wp_send_json_success(['status' => 'active']);
        }

        public function check_importer_status()
        {
            if (!function_exists('is_plugin_active')) {
                require_once ABSPATH . 'wp-admin/includes/plugin.php';
            }

            $status = 'missing';
            if (
                file_exists(
                    WP_PLUGIN_DIR .
                        '/wordpress-importer/wordpress-importer.php',
                )
            ) {
                $status = is_plugin_active(
                    'wordpress-importer/wordpress-importer.php',
                )
                    ? 'active'
                    : 'installed';
            }

            return new WP_REST_Response(['status' => $status], 200);
        }

        public function maxi_blocks_status()
        {
            require_once plugin_dir_path(__FILE__) .
                'status-report/maxi-system-status-report.php';
            $status_report = new MaxiBlocks_System_Status_Report();
            return $status_report->generate_status_report();
        }

        public function maxi_blocks_license()
        {
            // Check for network license first
            $network_license_info = $this->get_network_license_info();
            $has_network_license = $network_license_info !== false;

            // Get current site-level license information
            $current_license_data = get_option('maxi_pro', '');
            $current_license_status = 'Not activated';
            $current_user_name = '';
            $is_active = false;
            $license_source = 'none';

            if ($has_network_license) {
                // Network license takes priority
                $current_license_status = $network_license_info['status'];
                $current_user_name = $network_license_info['user_name'];
                $is_active = true;
                $license_source = 'network';
            } elseif (!empty($current_license_data)) {
                $license_array = json_decode($current_license_data, true);
                if (is_array($license_array)) {
                    // Check for purchase code auth (domain-wide)
                    foreach ($license_array as $key => $license) {
                        if (strpos($key, 'code_') === 0 && isset($license['status']) && $license['status'] === 'yes') {
                            $current_license_status = 'Active ✓';
                            $current_user_name = isset($license['name']) ? $license['name'] : 'Pro User';
                            $is_active = true;
                            $license_source = 'site_purchase_code';
                            break;
                        }
                    }

                    // If no purchase code, check for email auth (browser-specific)
                    if (!$is_active && isset($_COOKIE['maxi_blocks_key']) && !empty($_COOKIE['maxi_blocks_key'])) {
                        $cookie_raw = $_COOKIE['maxi_blocks_key'];
                        // Fix escaped quotes in cookie value
                        $cookie_fixed = str_replace('\\"', '"', $cookie_raw);
                        $cookie_data = json_decode($cookie_fixed, true);

                        if ($cookie_data && is_array($cookie_data)) {
                            $email = array_keys($cookie_data)[0];
                            $browser_key = $cookie_data[$email];

                            if (isset($license_array[$email]) && isset($license_array[$email]['status']) && $license_array[$email]['status'] === 'yes') {
                                // Check if this browser's key is in the list
                                $stored_keys = explode(',', $license_array[$email]['key']);

                                if (in_array($browser_key, array_map('trim', $stored_keys))) {
                                    $current_license_status = 'Active ✓';
                                    $current_user_name = isset($license_array[$email]['name']) ? $license_array[$email]['name'] : $email;
                                    $is_active = true;
                                    $license_source = 'site_email';
                                } else {
                                    error_log(__('MaxiBlocks dashboard - Key NOT found in stored keys', 'maxi-blocks'));
                                }
                            } else {
                                error_log(__('MaxiBlocks dashboard - Email not found or status not yes', 'maxi-blocks'));
                            }
                        } else {
                            error_log(__('MaxiBlocks dashboard - Failed to parse cookie', 'maxi-blocks'));
                        }
                    } else {
                        error_log(__('MaxiBlocks dashboard - No cookie found or empty', 'maxi-blocks'));
                    }
                }
            }

            $content = '<div class="maxi-dashboard_main-content maxi-dashboard_main-content-license">';
            $content .= '<div class="maxi-dashboard_main-content-settings">';

            if ($is_active) {
                if ($license_source === 'network') {
                    $content .= '<h1>' . __('Pro access active via network license', 'maxi-blocks') . '</h1>';
                    $content .= '<p>' . __('Your Pro cloud access is active through a network-wide license.', 'maxi-blocks') . '</p>';
                } else {
                    $content .= '<h1>' . __('Pro cloud access active', 'maxi-blocks') . '</h1>';
                    $content .= '<p>' . __('Your Pro cloud access is active and ready to use.', 'maxi-blocks') . '</p>';
                }
            } else {
                $content .= '<h1>' . __('Activate Pro cloud access', 'maxi-blocks') . '</h1>';
                $content .= '<p>' . __('Enter your email or purchase code to access premium items', 'maxi-blocks') . '</p>';
            }

            $content .= '</div>';

            $content .= '<div class="maxi-dashboard_main-content_accordion_wrapper">';
            $content .= '<div class="maxi-dashboard_main-content_accordion">';

            $content .= $this->generate_item_header(
                $is_active ? __('Current status', 'maxi-blocks') : __('License activation', 'maxi-blocks'),
                true,
            );

            if ($is_active) {
                // Show active status
                $content .= '<div class="maxi-license-status-display">';
                $content .= '<h4>' . __('Status:', 'maxi-blocks') . ' <span id="current-license-status" class="maxi-license-active">' . esc_html($current_license_status) . '</span></h4>';
                $content .= '<h4>' . __('Licensed to:', 'maxi-blocks') . ' <span id="current-license-user">' . esc_html($current_user_name) . '</span></h4>';

                if ($license_source === 'network') {
                    $content .= '<h4>' . __('License type:', 'maxi-blocks') . ' <span class="maxi-license-network">Network License</span></h4>';
                    if (is_multisite() && current_user_can('manage_network_options')) {
                        $content .= '<p class="maxi-license-network-link"><a href="' . esc_url(network_admin_url('admin.php?page=maxi-blocks-dashboard')) . '">' . __('Manage network license', 'maxi-blocks') . '</a></p>';
                    }
                }

                $content .= '</div>';

                // Show deactivate button (only for site-level licenses)
                if ($license_source !== 'network') {
                    $content .= '<div class="maxi-license-actions">';
                    $content .= '<button type="button" id="maxi-license-logout" class="button button-primary">' . __('Deactivate Pro', 'maxi-blocks') . '</button>';
                    $content .= '</div>';
                } else {
                    // Show network license info
                    $content .= '<div class="maxi-license-network-info">';
                    $content .= '<p>' . __('This site is using a network-wide license. Purchase codes cannot be activated on individual sites when a network license is active.', 'maxi-blocks') . '</p>';
                    if (is_multisite() && current_user_can('manage_network_options')) {
                        $content .= '<p>' . __('To manage the network license, visit the', 'maxi-blocks') . ' <a href="' . esc_url(network_admin_url('admin.php?page=maxi-blocks-dashboard')) . '">' . __('network admin license page', 'maxi-blocks') . '</a>.</p>';
                    } else {
                        $content .= '<p>' . __('To manage the network license, contact your network administrator.', 'maxi-blocks') . '</p>';
                    }
                    $content .= '</div>';
                }
            } else {
                // Show current status for not activated
                $content .= '<div class="maxi-license-status-display">';
                $content .= '<h4>' . __('Current status:', 'maxi-blocks') . ' <span id="current-license-status" class="maxi-license-inactive">' . esc_html($current_license_status) . '</span></h4>';
                $content .= '</div>';

                // Show authentication input form (only if no network license blocks purchase codes)
                if ($has_network_license) {
                    // Network license is active - show limited options
                    $content .= '<div class="maxi-license-network-override">';
                    $content .= '<h4>' . __('Network license is active', 'maxi-blocks') . '</h4>';
                    $content .= '<p>' . __('A network-wide license is already active. Purchase codes cannot be activated on individual sites.', 'maxi-blocks') . '</p>';
                    if (is_multisite() && current_user_can('manage_network_options')) {
                        $content .= '<p><a href="' . esc_url(network_admin_url('admin.php?page=maxi-blocks-dashboard')) . '">' . __('Manage network license', 'maxi-blocks') . '</a></p>';
                    }

                    // Still allow email authentication for user-specific accounts
                    $content .= '<div class="maxi-license-auth-form maxi-email-only">';
                    $content .= '<h4>' . __('Individual email authentication', 'maxi-blocks') . '</h4>';
                    $content .= '<p>' . __('You can still authenticate with your individual Pro email account for user-specific features.', 'maxi-blocks') . '</p>';
                    $content .= '<div class="maxi-license-input-group">';
                    $content .= '<input type="text" id="maxi-license-input" class="maxi-dashboard_main-content_accordion-item-input regular-text" placeholder="' . esc_attr__('Pro user email address', 'maxi-blocks') . '" />';
                    $content .= '<p class="maxi-license-help-text">' . sprintf(__('Enter your Pro user email. Find your account details at %s', 'maxi-blocks'), '<a href="https://my.maxiblocks.com" target="_blank" rel="noopener noreferrer">my.maxiblocks.com</a>') . '</p>';
                    $content .= '</div>';
                    $content .= '<div class="maxi-license-actions">';
                    $content .= '<button type="button" id="maxi-validate-license" class="button button-primary">' . __('Authenticate Email', 'maxi-blocks') . '</button>';
                    $content .= '</div>';
                    $content .= '<div id="maxi-license-validation-message" class="maxi-license-message" style="display: none;"></div>';
                    $content .= '</div>'; // maxi-license-auth-form
                    $content .= '</div>'; // maxi-license-network-override
                } else {
                    // No network license - show full activation form
                    $content .= '<div class="maxi-license-auth-form">';
                    $content .= '<div class="maxi-license-input-group">';
                    $content .= '<input type="text" id="maxi-license-input" class="maxi-dashboard_main-content_accordion-item-input regular-text" placeholder="' . esc_attr__('Pro user email / purchase code / license key', 'maxi-blocks') . '" />';
                    $content .= '<p class="maxi-license-help-text">' . sprintf(__('Find your code or key in your account, inbox or %s', 'maxi-blocks'), '<a href="https://my.maxiblocks.com" target="_blank" rel="noopener noreferrer">my.maxiblocks.com</a>') . '</p>';
                    $content .= '</div>';

                    $content .= '<div class="maxi-license-actions">';
                    $content .= '<button type="button" id="maxi-validate-license" class="button button-primary">' . __('Activate Pro', 'maxi-blocks') . '</button>';
                    $content .= '</div>';

                    $content .= '<div id="maxi-license-validation-message" class="maxi-license-message" style="display: none;"></div>';

                    $content .= '</div>'; // maxi-license-auth-form
                }
            }

            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item-content
            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item

            $content .= '</div>'; // maxi-dashboard_main-content_accordion
            $content .= '</div>'; // maxi-dashboard_main-content

            return $content;
        }

        public function maxi_blocks_menu_order($menu_order)
        {
            global $submenu;

            if (isset($submenu['maxi-blocks-dashboard'])) {
                $dashboard_menu = $submenu['maxi-blocks-dashboard'];
                $new_menu_order = [];

                // Define the desired order
                $desired_order = [
                    'maxi-blocks-dashboard', // Dashboard
                    'maxi-blocks-templates', // Templates
                    'maxi-blocks-style-cards', // Style Cards
                    'maxi-blocks-starter-sites', // Starter Sites
                    'maxi-blocks-settings', // Settings
                    'maxi-blocks-license', // License
                    'admin.php?page=' .
                    self::$maxi_slug_dashboard .
                    '&tab=maxi_blocks_status', // Status Report (at the end)
                ];

                // Reorder menu items
                foreach ($desired_order as $slug) {
                    foreach ($dashboard_menu as $key => $item) {
                        if ($item[2] === $slug) {
                            $new_menu_order[] = $item;
                            unset($dashboard_menu[$key]);
                            break;
                        }
                    }
                }

                // Add any remaining items
                foreach ($dashboard_menu as $item) {
                    $new_menu_order[] = $item;
                }

                $submenu['maxi-blocks-dashboard'] = $new_menu_order;
            }

            return $menu_order;
        }

        /**
         * Helper method to detect localhost
         */
        private function is_localhost()
        {
            $server_name = strtolower(isset($_SERVER['SERVER_NAME']) ? sanitize_text_field($_SERVER['SERVER_NAME']) : '');
            $remote_addr = isset($_SERVER['REMOTE_ADDR']) ? sanitize_text_field($_SERVER['REMOTE_ADDR']) : '';

            return in_array($server_name, ['localhost', '127.0.0.1', '::1']) ||
                strpos($remote_addr, '127.0.') === 0 ||
                $remote_addr === '::1' ||
                strpos($server_name, '.local') !== false ||
                strpos($server_name, '.test') !== false;
        }

        /**
         * Helper method to check if Pro is active (network or site level)
         *
         * @return bool True if Pro is active for this browser, false otherwise
         */
        private function is_pro_active()
        {
            // Check network license first (for multisite)
            if ($this->has_network_license()) {
                return true;
            }

            // Check site level license
            $current_license_data = get_option('maxi_pro', '');

            if (empty($current_license_data)) {
                return false;
            }

            $license_array = json_decode($current_license_data, true);
            if (!is_array($license_array)) {
                return false;
            }

            // Check for purchase code auth (domain-wide)
            foreach ($license_array as $key => $license) {
                if (strpos($key, 'code_') === 0 && isset($license['status']) && $license['status'] === 'yes') {
                    return true;
                }
            }

            // Check for email auth (browser-specific)
            if (isset($_COOKIE['maxi_blocks_key']) && !empty($_COOKIE['maxi_blocks_key'])) {
                $cookie_data = json_decode($_COOKIE['maxi_blocks_key'], true);
                if ($cookie_data && is_array($cookie_data)) {
                    $email = array_keys($cookie_data)[0];
                    $browser_key = $cookie_data[$email];

                    if (isset($license_array[$email]) && isset($license_array[$email]['status']) && $license_array[$email]['status'] === 'yes') {
                        // Check if this browser's key is in the list
                        $stored_keys = explode(',', $license_array[$email]['key']);
                        return in_array($browser_key, array_map('trim', $stored_keys));
                    }
                }
            }

            return false;
        }

        public function handle_get_frontend_assets()
        {
            try {
                $home_url = home_url();
                $response = wp_remote_get($home_url, [
                    'timeout' => 30,
                    'sslverify' => !$this->is_localhost(),
                    'headers' => [
                        'User-Agent' =>
                            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    ],
                ]);

                if (is_wp_error($response)) {
                    wp_send_json_error([
                        'message' => 'Failed to fetch frontend',
                    ]);
                    return;
                }

                $html = wp_remote_retrieve_body($response);

                // Parse HTML to find assets
                $css_files = [];
                $js_files = [];

                // Use DOMDocument to parse HTML
                $dom = new DOMDocument();
                libxml_use_internal_errors(true);
                @$dom->loadHTML($html);
                libxml_clear_errors();

                // Get all CSS files
                $links = $dom->getElementsByTagName('link');
                foreach ($links as $link) {
                    if ($link->getAttribute('rel') === 'stylesheet') {
                        $css_files[] = $link->getAttribute('href');
                    }
                }

                // Get all JS files
                $scripts = $dom->getElementsByTagName('script');
                foreach ($scripts as $script) {
                    $src = $script->getAttribute('src');
                    if ($src) {
                        $js_files[] = $src;
                    }
                }

                // Clean up URLs
                $css_files = array_values(
                    array_filter(array_unique($css_files)),
                );
                $js_files = array_values(array_filter(array_unique($js_files)));

                wp_send_json_success([
                    'css' => $css_files ?: [
                        __('No CSS files found', 'maxi-blocks'),
                    ],
                    'js' => $js_files ?: [
                        __('No JavaScript files found', 'maxi-blocks'),
                    ],
                ]);
            } catch (Exception $e) {
                wp_send_json_error(['message' => 'Internal error']);
            }
        }

        public function add_hidden_api_fields()
        {
            $google_api_key = get_option('google_api_key_option', '');
            $openai_api_key = get_option('openai_api_key_option', '');

            echo '<input type="hidden" name="google_api_key_option" value="' . esc_attr($google_api_key) . '">';
            echo '<input type="hidden" name="openai_api_key_option" value="' . esc_attr($openai_api_key) . '">';
        }

        /**
         * Helper functions for authentication
         */

        /**
         * Detects if input is an email or purchase code
         * @param string $input - The input string to check
         * @returns string - 'email' or 'code'
         */
        private function detect_input_type($input)
        {
            if (!$input || !is_string($input)) {
                return 'email';
            }

            $trimmed_input = trim($input);

            // If it contains @ or . (dot), it's likely an email
            $has_at_symbol = strpos($trimmed_input, '@') !== false;
            $has_dot = strpos($trimmed_input, '.') !== false;

            if ($has_at_symbol || $has_dot) {
                return 'email';
            }

            // Purchase codes are typically alphanumeric strings without @ or . symbols
            // and are usually longer than 6 characters
            $is_alphanumeric = preg_match('/^[a-zA-Z0-9\-_]+$/', $trimmed_input);
            $is_long_enough = strlen($trimmed_input) >= 6;

            // If it doesn't have @ or . and looks like a code, treat as purchase code
            if ($is_alphanumeric && $is_long_enough) {
                return 'code';
            }

            // Default to email for other cases
            return 'email';
        }

        /**
         * Validates email format
         * @param string $email - Email to validate
         * @returns bool - True if valid email
         */
        private function is_valid_email($email)
        {
            return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
        }

        /**
         * Verifies purchase code with middleware
         * @param string $purchase_code - The purchase code to verify
         * @param string $domain       - The domain to verify against
         * @returns array - Verification result
         */
        private function verify_purchase_code($purchase_code, $domain)
        {
            $middleware_url = defined('MAXI_BLOCKS_AUTH_MIDDLEWARE_URL') ? MAXI_BLOCKS_AUTH_MIDDLEWARE_URL : '';
            $middleware_key = defined('MAXI_BLOCKS_AUTH_MIDDLEWARE_KEY') ? MAXI_BLOCKS_AUTH_MIDDLEWARE_KEY : '';

            if (empty($middleware_url) || empty($middleware_key)) {
                return ['success' => false, 'valid' => false, 'error' => 'Configuration error'];
            }

            $response = wp_remote_post($middleware_url, [
                'timeout' => 30,
                'headers' => [
                    'Content-Type' => 'application/json',
                    'Authorization' => $middleware_key,
                ],
                'body' => wp_json_encode([
                    'purchase_code' => $purchase_code,
                    'domain' => $domain,
                    'plugin_version' => MAXI_PLUGIN_VERSION,
                    'multisite' => is_multisite(),
                ]),
            ]);

            if (is_wp_error($response)) {
                return ['success' => false, 'valid' => false, 'error' => $response->get_error_message()];
            }

            $body = wp_remote_retrieve_body($response);
            $result = json_decode($body, true);

            return $result ?: ['success' => false, 'valid' => false, 'error' => 'Invalid response'];
        }

        /**
         * Deactivates purchase code with middleware
         * @param string $purchase_code - The purchase code to deactivate
         * @param string $domain       - The domain to deactivate
         * @param string $reason       - Reason for deactivation
         * @returns array - Deactivation result
         */
        private function deactivate_purchase_code($purchase_code, $domain, $reason = 'Plugin deactivated by user')
        {
            $middleware_url = defined('MAXI_BLOCKS_AUTH_MIDDLEWARE_URL') ? MAXI_BLOCKS_AUTH_MIDDLEWARE_URL : '';
            $middleware_key = defined('MAXI_BLOCKS_AUTH_MIDDLEWARE_KEY') ? MAXI_BLOCKS_AUTH_MIDDLEWARE_KEY : '';

            if (empty($middleware_url) || empty($middleware_key)) {
                return ['success' => false, 'error' => 'Configuration error'];
            }

            // Replace 'verify' with 'deactivate' in the URL
            $deactivate_url = str_replace('/verify', '/deactivate', $middleware_url);

            $request_body = [
                'domain' => $domain,
                'reason' => $reason,
                'plugin_version' => MAXI_PLUGIN_VERSION,
            ];

            // Only include purchase code if it's provided
            if (!empty($purchase_code)) {
                $request_body['purchase_code'] = $purchase_code;
            }

            // Add multisite information
            $request_body['multisite'] = is_multisite();

            $response = wp_remote_post($deactivate_url, [
                'timeout' => 30,
                'headers' => [
                    'Content-Type' => 'application/json',
                    'Authorization' => $middleware_key,
                ],
                'body' => wp_json_encode($request_body),
            ]);

            if (is_wp_error($response)) {
                return ['success' => false, 'error' => $response->get_error_message()];
            }

            $body = wp_remote_retrieve_body($response);
            $result = json_decode($body, true);

            return $result ?: ['success' => false, 'error' => 'Invalid response'];
        }

        /**
         * Handles domain migration for purchase codes
         * @param string $purchase_code - The purchase code
         * @param string $old_domain    - The old domain
         * @param string $new_domain    - The new domain
         * @returns array - Migration result
         */
        private function migrate_purchase_code_domain($purchase_code, $old_domain, $new_domain)
        {
            $middleware_url = defined('MAXI_BLOCKS_AUTH_MIDDLEWARE_URL') ? MAXI_BLOCKS_AUTH_MIDDLEWARE_URL : '';
            $middleware_key = defined('MAXI_BLOCKS_AUTH_MIDDLEWARE_KEY') ? MAXI_BLOCKS_AUTH_MIDDLEWARE_KEY : '';

            if (empty($middleware_url) || empty($middleware_key)) {
                return ['success' => false, 'valid' => false, 'error' => 'Configuration error'];
            }

            $response = wp_remote_post($middleware_url, [
                'timeout' => 30,
                'headers' => [
                    'Content-Type' => 'application/json',
                    'Authorization' => $middleware_key,
                ],
                'body' => wp_json_encode([
                    'purchase_code' => $purchase_code,
                    'old_domain' => $old_domain,
                    'new_domain' => $new_domain,
                    'plugin_version' => MAXI_PLUGIN_VERSION,
                    'multisite' => is_multisite(),
                ]),
            ]);

            if (is_wp_error($response)) {
                return ['success' => false, 'valid' => false, 'error' => $response->get_error_message()];
            }

            $body = wp_remote_retrieve_body($response);
            $result = json_decode($body, true);

            return $result ?: ['success' => false, 'valid' => false, 'error' => 'Invalid response'];
        }

        /**
         * Checks and handles domain changes for purchase codes (both network and site level)
         * @returns void
         */
        public function check_and_handle_domain_migration()
        {
            // Check network license migration first
            if (is_multisite()) {
                $this->check_network_domain_migration();
            }

            // Then check site-level license migration
            $this->check_site_domain_migration();
        }

        /**
         * Check and handle network license domain migration
         * @returns void
         */
        private function check_network_domain_migration()
        {
            $current_domain = $this->get_main_site_domain();
            $network_license_data = get_site_option('maxi_pro_network', '');

            if (empty($network_license_data)) {
                return;
            }

            $license_array = json_decode($network_license_data, true);
            if (!is_array($license_array)) {
                return;
            }

            foreach ($license_array as $key => $license) {
                // Only check network purchase code entries
                if (strpos($key, 'code_') === 0 && isset($license['status']) && $license['status'] === 'yes') {
                    $stored_domain = isset($license['domain']) ? $license['domain'] : '';
                    $purchase_code = isset($license['purchase_code']) ? $license['purchase_code'] : '';

                    // If domain has changed and we have a purchase code
                    if (!empty($stored_domain) && !empty($purchase_code) && $stored_domain !== $current_domain) {
                        // Attempt domain migration
                        $migration_result = $this->migrate_purchase_code_domain($purchase_code, $stored_domain, $current_domain);

                        if ($migration_result && isset($migration_result['success']) && $migration_result['success']) {
                            // Update network license data with new domain
                            $license_array[$key]['domain'] = $current_domain;
                            $license_array[$key]['migrated_at'] = current_time('c');
                            $license_array[$key]['migrated_from'] = $stored_domain;

                            // If migration info is provided, store it
                            if (isset($migration_result['domain_migration'])) {
                                $license_array[$key]['migration_status'] = $migration_result['domain_migration'];
                            }

                            update_site_option('maxi_pro_network', wp_json_encode($license_array));
                        } else {
                            error_log(__('MaxiBlocks: Network domain migration failed for purchase code: ', 'maxi-blocks') . $purchase_code . ' - ' . wp_json_encode($migration_result));
                        }
                    }
                }
            }
        }

        /**
         * Check and handle site-level license domain migration
         * @returns void
         */
        private function check_site_domain_migration()
        {
            $current_domain = parse_url(home_url(), PHP_URL_HOST);
            $license_data = get_option('maxi_pro', '');

            if (empty($license_data)) {
                return;
            }

            $license_array = json_decode($license_data, true);
            if (!is_array($license_array)) {
                return;
            }

            foreach ($license_array as $key => $license) {
                // Only check purchase code entries
                if (strpos($key, 'code_') === 0 && isset($license['status']) && $license['status'] === 'yes') {
                    $stored_domain = isset($license['domain']) ? $license['domain'] : '';
                    $purchase_code = isset($license['purchase_code']) ? $license['purchase_code'] : '';

                    // If domain has changed and we have a purchase code
                    if (!empty($stored_domain) && !empty($purchase_code) && $stored_domain !== $current_domain) {
                        // Attempt domain migration
                        $migration_result = $this->migrate_purchase_code_domain($purchase_code, $stored_domain, $current_domain);

                        if ($migration_result && isset($migration_result['success']) && $migration_result['success']) {
                            // Update license data with new domain
                            $license_array[$key]['domain'] = $current_domain;
                            $license_array[$key]['migrated_at'] = current_time('c');
                            $license_array[$key]['migrated_from'] = $stored_domain;

                            // If migration info is provided, store it
                            if (isset($migration_result['domain_migration'])) {
                                $license_array[$key]['migration_status'] = $migration_result['domain_migration'];
                            }

                            update_option('maxi_pro', wp_json_encode($license_array));
                        } else {
                            error_log(__('MaxiBlocks: Site domain migration failed for purchase code: ', 'maxi-blocks') . $purchase_code . ' - ' . wp_json_encode($migration_result));
                        }
                    }
                }
            }
        }

        /**
         * Handle AJAX license validation
         */
        public function handle_validate_license()
        {
            // Verify nonce
            if (!wp_verify_nonce($_POST['nonce'], 'maxi_license_validation')) {
                wp_send_json_error(['message' => __('Security check failed', 'maxi-blocks')]);
                return;
            }

            // Check user permissions
            if (!current_user_can('manage_options')) {
                wp_send_json_error(['message' => __('Insufficient permissions', 'maxi-blocks')]);
                return;
            }

            $input_value = sanitize_text_field($_POST['license_input']);
            $action = sanitize_text_field($_POST['license_action']);

            if ($action === 'logout') {
                // Handle logout
                $this->handle_license_logout();
                return;
            }

            if (empty($input_value)) {
                wp_send_json_error(['message' => __('Email or purchase code is required', 'maxi-blocks')]);
                return;
            }

            // Detect input type (email or purchase code)
            $input_type = $this->detect_input_type($input_value);

            if ($input_type === 'email') {
                // Handle email authentication
                $this->handle_email_authentication($input_value);
            } else {
                // Handle purchase code authentication
                $this->handle_purchase_code_authentication($input_value);
            }
        }

        /**
         * Handle email authentication
         * @param string $email - Email address
         */
        private function handle_email_authentication($email)
        {
            if (!$this->is_valid_email($email)) {
                wp_send_json_error(['message' => __('The email is not valid', 'maxi-blocks')]);
                return;
            }

            // Generate a unique authentication key for this email
            $auth_key = $this->generate_auth_key(20);

            // Set a cookie that will be used for authentication
            // Use a unique cookie for each browser/session instead of merging
            $cookie_name = 'maxi_blocks_key';
            $cookie_data = json_encode([$email => $auth_key]);

            // Set cookie for 30 days
            $admin_path = $this->get_admin_path();
            setrawcookie($cookie_name, $cookie_data, time() + (30 * 24 * 60 * 60), $admin_path);

            // Store the authentication attempt in transients for polling (more reliable than sessions)
            $transient_key = 'maxi_auth_' . md5($email . $auth_key);
            set_transient($transient_key, [
                'email' => $email,
                'auth_key' => $auth_key,
                'time' => time(),
            ], 600); // 10 minutes

            // Also store a reverse lookup to find the transient by email
            set_transient('maxi_auth_lookup_' . md5($email), $transient_key, 600);

            wp_send_json_success([
                'message' => __('Email authentication initiated', 'maxi-blocks'),
                'auth_type' => 'email',
                'email' => $email,
                'login_url' => 'https://my.maxiblocks.com/login?plugin&email=' . urlencode($email)
            ]);
        }

        /**
         * Generate authentication key
         * @param int $length - Length of key to generate
         * @returns string - Generated key
         */
        private function generate_auth_key($length = 20)
        {
            $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            $key = '';
            for ($i = 0; $i < $length; $i++) {
                $key .= $characters[wp_rand(0, strlen($characters) - 1)];
            }
            return $key;
        }

        /**
         * Get admin path for cookie (matching JavaScript implementation)
         * @returns string - Admin path
         */
        private function get_admin_path()
        {
            // Match the JavaScript getPathToAdmin() function
            // which returns path without trailing slash
            return '/wp-admin';
        }

        /**
         * Handle purchase code authentication
         * @param string $purchase_code - Purchase code
         */
        private function handle_purchase_code_authentication($purchase_code)
        {
            // Check if network license is active - prevent site-level purchase code activation
            if ($this->has_network_license()) {
                wp_send_json_error(['message' => __('A network license is already active. Purchase codes cannot be activated on individual sites.', 'maxi-blocks')]);
                return;
            }

            $domain = parse_url(home_url(), PHP_URL_HOST);

            // Verify purchase code with middleware
            $result = $this->verify_purchase_code($purchase_code, $domain);

            if (!$result['success'] || !$result['valid']) {
                if (isset($result['error'])) {
                    $error_message = $this->get_license_error_message($result['error']);
                    wp_send_json_error(['message' => $error_message]);
                } else {
                    wp_send_json_error(['message' => __('Invalid purchase code / key. Please check your code and try again.', 'maxi-blocks')]);
                }
                return;
            }

            // Save license data for purchase code
            // Purchase codes have priority and should clear all email auths
            $marketplace = isset($result['marketplace']) ? $result['marketplace'] : 'unknown';
            $display_name = $marketplace !== 'unknown'
                ? ucfirst($marketplace) : 'Marketplace';

            $license_data = [
                'code_' . $purchase_code => [
                    'status' => 'yes',
                    'name' => $display_name,
                    'purchase_code' => $purchase_code,
                    'domain' => $domain,
                    'marketplace' => $marketplace,
                    'user_id' => isset($result['delivery_data']['user_id']) ? $result['delivery_data']['user_id'] : '',
                    'product_id' => isset($result['delivery_data']['product_id']) ? $result['delivery_data']['product_id'] : '',
                    'product_type' => isset($result['delivery_data']['product_type']) ? $result['delivery_data']['product_type'] : 'plugin',
                    'order_id' => isset($result['delivery_data']['order_id']) ? $result['delivery_data']['order_id'] : '',
                    'activated_at' => current_time('c'),
                    'auth_type' => 'purchase_code',
                ],
            ];

            // Purchase codes override all email auths - completely replace the option
            update_option('maxi_pro', wp_json_encode($license_data));

            wp_send_json_success([
                'message' => __('License activated successfully', 'maxi-blocks'),
                'status' => 'Active ✓',
                'user_name' => $display_name,
                'auth_type' => 'purchase_code'
            ]);
        }

        /**
         * Get appropriate error message for license validation errors
         * @param string $error_code - Error code from middleware
         * @return string - User-friendly error message
         */
        private function get_license_error_message($error_code)
        {
            switch ($error_code) {
                case 'invalid_purchase_code':
                case 'purchase_code_not_found':
                    return __('Invalid purchase code / key. Please check your code and try again.', 'maxi-blocks');

                case 'domain_not_allowed':
                case 'domain_mismatch':
                case 'max_activations_reached':
                case 'activation_limit_exceeded':
                case 'already_activated':
                    return __('This code / key has already been activated on another domain. Contact support if you need help.', 'maxi-blocks');

                case 'purchase_code_expired':
                case 'license_expired':
                case 'subscription_expired':
                    return __('This purchase code / key has expired. Please check your subscription status or contact support.', 'maxi-blocks');

                default:
                    return __('Invalid purchase code / key. Please check your code and try again.', 'maxi-blocks');
            }
        }

        /**
         * Handle checking authentication status (for email auth polling)
         */
        public function handle_check_auth_status()
        {
            // Verify nonce
            if (!wp_verify_nonce($_POST['nonce'], 'maxi_license_validation')) {
                wp_send_json_error(['message' => __('Security check failed', 'maxi-blocks')]);
                return;
            }

            // First check if we have a pending email authentication
            // Check both sessions (legacy) and transients (new)
            $found_auth_data = false;
            $email = null;
            $auth_key = null;
            $auth_time = null;

            // Check sessions first (for backward compatibility)
            if (!session_id()) {
                session_start();
            }

            if (isset($_SESSION['maxi_auth_email']) && isset($_SESSION['maxi_auth_key'])) {
                $email = $_SESSION['maxi_auth_email'];
                $auth_key = $_SESSION['maxi_auth_key'];
                $auth_time = $_SESSION['maxi_auth_time'] ?? time();
                $found_auth_data = true;
            }

            // If no session data, check transients
            if (!$found_auth_data) {
                $all_transients = wp_load_alloptions();

                foreach ($all_transients as $key => $value) {
                    if (strpos($key, '_transient_maxi_auth_') === 0 && strpos($key, '_lookup_') === false) {
                        $transient_name = str_replace('_transient_', '', $key);
                        $auth_data = get_transient($transient_name);

                        if ($auth_data && is_array($auth_data)) {
                            $email = $auth_data['email'];
                            $auth_key = $auth_data['auth_key'];
                            $auth_time = $auth_data['time'] ?? time();
                            $found_auth_data = true;
                            break; // Only check the first pending auth
                        }
                    }
                }
            }

            if ($found_auth_data && $email && $auth_key) {
                // Only try authentication if it's been less than 10 minutes
                if ((time() - $auth_time) < 600) {
                    $auth_result = $this->check_email_authentication($email, $auth_key);

                    if ($auth_result) {
                        // Clear session data on successful auth
                        if (isset($_SESSION['maxi_auth_email'])) {
                            unset($_SESSION['maxi_auth_email']);
                            unset($_SESSION['maxi_auth_key']);
                            unset($_SESSION['maxi_auth_time']);
                        }

                        // Clear transient data on successful auth
                        $transient_key = 'maxi_auth_' . md5($email . $auth_key);
                        delete_transient($transient_key);
                        delete_transient('maxi_auth_lookup_' . md5($email));

                        wp_send_json_success([
                            'is_authenticated' => true,
                            'status' => 'Active ✓',
                            'user_name' => $auth_result['user_name'],
                        ]);
                        return;
                    }
                }
            }

            // Check current license status from database for this specific browser
            $current_license_data = get_option('maxi_pro', '');
            $is_authenticated = false;
            $status = 'Not activated';
            $user_name = '';

            if (!empty($current_license_data)) {
                $license_array = json_decode($current_license_data, true);
                if (is_array($license_array)) {
                    // Check for purchase code auth (domain-wide)
                    foreach ($license_array as $key => $license) {
                        if (strpos($key, 'code_') === 0 && isset($license['status']) && $license['status'] === 'yes') {
                            $is_authenticated = true;
                            $status = 'Active ✓';
                            $user_name = isset($license['name']) ? $license['name'] : 'Pro User';
                            break;
                        }
                    }

                    // If no purchase code, check for email auth (browser-specific)
                    if (!$is_authenticated && isset($_COOKIE['maxi_blocks_key']) && !empty($_COOKIE['maxi_blocks_key'])) {
                        $cookie_data = json_decode($_COOKIE['maxi_blocks_key'], true);
                        if ($cookie_data && is_array($cookie_data)) {
                            $email = array_keys($cookie_data)[0];
                            $browser_key = $cookie_data[$email];

                            if (isset($license_array[$email]) && isset($license_array[$email]['status']) && $license_array[$email]['status'] === 'yes') {
                                // Check if this browser's key is in the list
                                $stored_keys = explode(',', $license_array[$email]['key']);
                                if (in_array($browser_key, array_map('trim', $stored_keys))) {
                                    $is_authenticated = true;
                                    $status = 'Active ✓';
                                    $user_name = isset($license_array[$email]['name']) ? $license_array[$email]['name'] : $email;
                                }
                            }
                        }
                    }
                }
            }

            wp_send_json_success([
                'is_authenticated' => $is_authenticated,
                'status' => $status,
                'user_name' => $user_name,
            ]);
        }

        /**
         * Check email authentication with MaxiBlocks API
         * @param string $email - Email address
         * @param string $auth_key - Authentication key
         * @returns array|false - User data if authenticated, false otherwise
         */
        private function check_email_authentication($email, $auth_key)
        {
            // Use the same auth configuration as the frontend
            $auth_url = 'https://my.maxiblocks.com/plugin-api-fwefqw.php';
            $auth_header_title = 'X-Xaiscmolkb';
            $auth_header_value = 'sdeqw239ejkdgaorti482';

            $response = wp_remote_post($auth_url, [
                'timeout' => 30,
                'headers' => [
                    'Content-Type' => 'application/json',
                    $auth_header_title => $auth_header_value,
                ],
                'body' => wp_json_encode([
                    'email' => $email,
                    'cookie' => $auth_key,
                ]),
            ]);

            if (is_wp_error($response)) {
                error_log(__('MaxiBlocks auth API error: ', 'maxi-blocks') . $response->get_error_message());
                return false;
            }

            $body = wp_remote_retrieve_body($response);
            $data = json_decode($body, true);

            if ($data && isset($data['status']) && $data['status'] === 'ok') {
                $today = current_time('Y-m-d');
                $expiration_date = $data['expiration_date'] ?? $today;
                $name = $data['name'] ?? $email;

                if ($today > $expiration_date) {
                    // Save expired status
                    $this->save_email_license_data($email, $name, 'expired', $auth_key);
                    return false;
                } else {
                    // Save active status
                    $this->save_email_license_data($email, $name, 'yes', $auth_key);
                    return ['user_name' => $name];
                }
            }

            return false;
        }

        /**
         * Save email license data
         * @param string $email - Email address
         * @param string $name - User name
         * @param string $status - Status (yes, expired, no)
         * @param string $auth_key - Authentication key
         */
        private function save_email_license_data($email, $name, $status, $auth_key)
        {
            // Get existing license data
            $existing_data = get_option('maxi_pro', '');
            $license_data = [];

            if (!empty($existing_data)) {
                $existing_array = json_decode($existing_data, true);
                if (is_array($existing_array)) {
                    $license_data = $existing_array;
                }
            }

            // Check if this email already has auth data
            if (isset($license_data[$email]) && isset($license_data[$email]['key'])) {
                // Merge keys if they exist (for multiple browsers/devices)
                $existing_keys = explode(',', $license_data[$email]['key']);
                if (!in_array($auth_key, $existing_keys)) {
                    $existing_keys[] = $auth_key;
                }
                $license_data[$email] = [
                    'status' => $status,
                    'name' => $name,
                    'key' => implode(',', array_unique($existing_keys)),
                    'auth_type' => 'email',
                ];
            } else {
                // New email entry
                $license_data[$email] = [
                    'status' => $status,
                    'name' => $name,
                    'key' => $auth_key,
                    'auth_type' => 'email',
                ];
            }

            update_option('maxi_pro', wp_json_encode($license_data));
        }

        /**
         * Handle license logout
         */
        private function handle_license_logout()
        {
            // Check if user was logged in via email (has maxi_blocks_key cookie)
            $has_email_auth = isset($_COOKIE['maxi_blocks_key']) && !empty($_COOKIE['maxi_blocks_key']);

            $admin_path = $this->get_admin_path();

            if ($has_email_auth) {
                // Parse the cookie to get email and key
                $cookie_data = json_decode($_COOKIE['maxi_blocks_key'], true);
                if ($cookie_data && is_array($cookie_data)) {
                    $email = array_keys($cookie_data)[0];
                    $auth_key = $cookie_data[$email];



                    // Remove only this browser's key from the email auth
                    $this->remove_email_auth_key($email, $auth_key);
                }

                // Clear the email authentication cookie
                setrawcookie('maxi_blocks_key', '', time() - 3600, $admin_path);

                wp_send_json_success([
                    'message' => __('Signed out successfully', 'maxi-blocks'),
                    'status' => 'Not activated',
                    'user_name' => '',
                    'auth_type' => 'email',
                ]);
            } else {
                // Check if it's a purchase code auth - in that case, delete everything
                $current_license_data = get_option('maxi_pro', '');
                $is_purchase_code_active = false;
                $purchase_code = '';
                $domain = parse_url(home_url(), PHP_URL_HOST);

                if (!empty($current_license_data)) {
                    $license_array = json_decode($current_license_data, true);
                    if (is_array($license_array)) {
                        foreach ($license_array as $key => $license) {
                            if (strpos($key, 'code_') === 0 && isset($license['status']) && $license['status'] === 'yes') {
                                $is_purchase_code_active = true;
                                // Extract the purchase code (remove 'code_' prefix)
                                $purchase_code = substr($key, 5);
                                break;
                            }
                        }
                    }
                }

                if ($is_purchase_code_active && !empty($purchase_code)) {
                    // Call deactivation endpoint before deleting local data
                    $deactivation_result = $this->deactivate_purchase_code($purchase_code, $domain, 'Plugin deactivated by user');

                    // Log deactivation result for debugging (optional)
                    if (!$deactivation_result['success']) {
                        error_log(__('MaxiBlocks: Purchase code deactivation failed: ', 'maxi-blocks') . wp_json_encode($deactivation_result));
                    }

                    // Delete all license data for purchase code logout regardless of deactivation result
                    delete_option('maxi_pro');
                } elseif ($is_purchase_code_active) {
                    // If we couldn't extract the purchase code, still delete the local data
                    delete_option('maxi_pro');
                }

                wp_send_json_success([
                    'message' => __('Signed out successfully', 'maxi-blocks'),
                    'status' => 'Not activated',
                    'user_name' => '',
                    'auth_type' => $is_purchase_code_active ? 'purchase_code' : 'unknown',
                ]);
            }
        }

        /**
         * Remove a specific auth key for an email (for browser-specific logout)
         * @param string $email - Email address
         * @param string $auth_key - Authentication key to remove
         */
        private function remove_email_auth_key($email, $auth_key)
        {
            $existing_data = get_option('maxi_pro', '');
            if (empty($existing_data)) {
                return;
            }

            $license_data = json_decode($existing_data, true);
            if (!is_array($license_data) || !isset($license_data[$email])) {
                return;
            }

            $email_data = $license_data[$email];
            if (!isset($email_data['key'])) {
                return;
            }

            // Remove the specific key
            $existing_keys = explode(',', $email_data['key']);
            $remaining_keys = array_filter($existing_keys, function ($key) use ($auth_key) {
                return trim($key) !== trim($auth_key);
            });

            if (empty($remaining_keys)) {
                // No more keys for this email, remove the entire entry
                unset($license_data[$email]);
            } else {
                // Update with remaining keys
                $license_data[$email]['key'] = implode(',', $remaining_keys);
                // Keep the old status unless it was 'yes' and we're removing keys
                if ($email_data['status'] === 'yes') {
                    $license_data[$email]['status'] = $email_data['status'];
                }
            }

            update_option('maxi_pro', wp_json_encode($license_data));
        }

        /**
         * Handle saving email license data from JavaScript
         */
        public function handle_save_email_license()
        {
            // Verify nonce
            if (!wp_verify_nonce($_POST['nonce'], 'maxi_license_validation')) {
                wp_send_json_error(['message' => __('Security check failed', 'maxi-blocks')]);
                return;
            }

            // Check user permissions
            if (!current_user_can('manage_options')) {
                wp_send_json_error(['message' => __('Insufficient permissions', 'maxi-blocks')]);
                return;
            }

            $email = sanitize_email($_POST['email']);
            $name = sanitize_text_field($_POST['name']);
            $status = sanitize_text_field($_POST['status']);
            $auth_key = sanitize_text_field($_POST['auth_key']);

            if (empty($email) || empty($name) || empty($status) || empty($auth_key)) {
                wp_send_json_error(['message' => __('Missing required parameters', 'maxi-blocks')]);
                return;
            }

            // Save the license data
            $this->save_email_license_data($email, $name, $status, $auth_key);

            wp_send_json_success([
                'message' => __('License data saved successfully', 'maxi-blocks'),
            ]);
        }

        /**
         * Handle network license form update
         */
        public function handle_network_license_form_update()
        {
            // This method handles form submission from network admin
            // For now, we'll rely on AJAX handlers for license operations
        }

        /**
         * Handle network license validation via AJAX
         */
        public function handle_network_validate_license()
        {
            // Verify nonce
            if (!wp_verify_nonce($_POST['nonce'], 'maxi_network_license_validation')) {
                wp_send_json_error(['message' => __('Security check failed', 'maxi-blocks')]);
                return;
            }

            // Check user permissions (network admin)
            if (!current_user_can('manage_network_options')) {
                wp_send_json_error(['message' => __('Insufficient permissions', 'maxi-blocks')]);
                return;
            }

            $input_value = isset($_POST['license_input']) ? sanitize_text_field($_POST['license_input']) : '';
            $action = sanitize_text_field($_POST['license_action']);

            if ($action === 'logout') {
                // Handle network logout
                $this->handle_network_license_logout();
                return;
            }

            if (empty($input_value)) {
                wp_send_json_error(['message' => __('Purchase code is required', 'maxi-blocks')]);
                return;
            }

            // Only handle purchase codes for network licensing
            $this->handle_network_purchase_code_authentication($input_value);
        }

        /**
         * Handle network purchase code authentication
         * @param string $purchase_code - Purchase code
         */
        private function handle_network_purchase_code_authentication($purchase_code)
        {
            $domain = $this->get_main_site_domain();

            // Verify purchase code with middleware
            $result = $this->verify_purchase_code($purchase_code, $domain);

            if (!$result['success'] || !$result['valid']) {
                if (isset($result['error'])) {
                    $error_message = $this->get_license_error_message($result['error']);
                    wp_send_json_error(['message' => $error_message]);
                } else {
                    wp_send_json_error(['message' => __('Invalid purchase code. Please check your code and try again.', 'maxi-blocks')]);
                }
                return;
            }

            // Save network license data
            $marketplace = isset($result['marketplace']) ? $result['marketplace'] : 'unknown';
            $display_name = $marketplace !== 'unknown'
                ? ucfirst($marketplace) : 'Network License';

            $license_data = [
                'code_' . $purchase_code => [
                    'status' => 'yes',
                    'name' => $display_name,
                    'purchase_code' => $purchase_code,
                    'domain' => $domain,
                    'marketplace' => $marketplace,
                    'user_id' => isset($result['delivery_data']['user_id']) ? $result['delivery_data']['user_id'] : '',
                    'product_id' => isset($result['delivery_data']['product_id']) ? $result['delivery_data']['product_id'] : '',
                    'product_type' => isset($result['delivery_data']['product_type']) ? $result['delivery_data']['product_type'] : 'plugin',
                    'order_id' => isset($result['delivery_data']['order_id']) ? $result['delivery_data']['order_id'] : '',
                    'activated_at' => current_time('c'),
                    'auth_type' => 'network_purchase_code',
                ],
            ];

            // Save as network option (available to all sites)
            update_site_option('maxi_pro_network', wp_json_encode($license_data));

            wp_send_json_success([
                'message' => __('Network license activated successfully', 'maxi-blocks'),
                'status' => 'Active ✓',
                'user_name' => $display_name,
                'auth_type' => 'network_purchase_code'
            ]);
        }

        /**
         * Handle network license logout
         */
        private function handle_network_license_logout()
        {
            // Get current network license data for deactivation call
            $network_license = get_site_option('maxi_pro_network', '');
            $purchase_code = '';
            $domain = $this->get_main_site_domain();

            if (!empty($network_license)) {
                $license_array = json_decode($network_license, true);
                if (is_array($license_array)) {
                    foreach ($license_array as $key => $license) {
                        if (strpos($key, 'code_') === 0 && isset($license['status']) && $license['status'] === 'yes') {
                            // Extract the purchase code (remove 'code_' prefix)
                            $purchase_code = substr($key, 5);
                            break;
                        }
                    }
                }
            }

            // Call deactivation endpoint if we have a purchase code
            if (!empty($purchase_code)) {
                $deactivation_result = $this->deactivate_purchase_code($purchase_code, $domain, 'Network license deactivated by admin');

                // Log deactivation result for debugging
                if (!$deactivation_result['success']) {
                    error_log(__('MaxiBlocks: Network license deactivation failed: ', 'maxi-blocks') . wp_json_encode($deactivation_result));
                }
            }

            // Delete network license data regardless of deactivation result
            delete_site_option('maxi_pro_network');

            wp_send_json_success([
                'message' => __('Network license deactivated successfully', 'maxi-blocks'),
                'status' => 'Not activated',
                'user_name' => '',
                'auth_type' => 'network_purchase_code',
            ]);
        }

        /**
         * Handle checking network authentication status
         */
        public function handle_network_check_auth_status()
        {
            // Verify nonce
            if (!wp_verify_nonce($_POST['nonce'], 'maxi_network_license_validation')) {
                wp_send_json_error(['message' => __('Security check failed', 'maxi-blocks')]);
                return;
            }

            // Check current network license status
            $network_license_info = $this->get_network_license_info();
            $is_authenticated = $network_license_info !== false;

            wp_send_json_success([
                'is_authenticated' => $is_authenticated,
                'status' => $is_authenticated ? $network_license_info['status'] : 'Not activated',
                'user_name' => $is_authenticated ? $network_license_info['user_name'] : '',
            ]);
        }
    }
endif;
