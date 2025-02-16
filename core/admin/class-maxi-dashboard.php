<?php
if (!defined('ABSPATH')) {
    exit();
}

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
         * Constructor.
         */
        public function __construct()
        {
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
            add_action('wp_ajax_maxi_get_frontend_assets', [$this, 'handle_get_frontend_assets']);
            add_action('wp_ajax_nopriv_maxi_get_frontend_assets', [$this, 'handle_get_frontend_assets']);
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
            }
        }

        /**
         * Register menu page and submenus
         */
        public function maxi_register_menu()
        {
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

        // Draw option page
        public function maxi_config_page()
        {
            $settings_tabs = [
                self::$maxi_prefix . 'start' => __('Welcome', 'maxi-blocks'),
                'quick_start' => [
                    'label' => __('Quick start', 'maxi-blocks'),
                    'url' => esc_url(admin_url('admin.php?page=maxi-blocks-quick-start'))
                ],
                self::$maxi_prefix . 'starter_sites' => __(
                    'Starter sites',
                    'maxi-blocks',
                ),
                self::$maxi_prefix . 'maxi_ai' => __('Maxi AI', 'maxi-blocks'),
                self::$maxi_prefix . 'status' => __('System status', 'maxi-blocks'),
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
                        wp_kses($tab_info['label'], $this->maxi_blocks_allowed_html()) .
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
            echo '<a href="https://maxiblocks.com/pricing/" target="_blank" class="maxi-dashboard_get-cloud-link">' . esc_html__('Get cloud', 'maxi-blocks') . '</a>';
            echo '<div class="maxi-dashboard_header-icons">';
            echo '<a href=" https://maxiblocks.com/go/help-desk/" target="_blank" class="maxi-dashboard_header-icon"><img src="' .
                esc_url(MAXI_PLUGIN_URL_PATH . 'img/maxi_help_documents_icon.svg') .
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
                }
            }

            echo '</div>'; // maxi-dashboard_main
            echo '<div class="clear"></div>';
            echo '</form>'; // maxi-dashboard_form
            echo '</div>'; // maxi-dashboard_wrap
        }

        public function maxi_blocks_welcome()
        {
            $current_user = wp_get_current_user();
            $user_name = $current_user->user_firstname;

            $content = '<div class="maxi-dashboard_main-content maxi-dashboard_main-content-start">';

            // Welcome header section
            $content .= '<div class="welcome-header">';
            $content .= '<h1>';
            if ($user_name) {
                $content .= __('Hello, ', 'maxi-blocks') . esc_html($user_name) . ' 👋';
            } else {
                $content .= __('Hello, friend', 'maxi-blocks') . ' 👋';
            }
            $content .= '</h1>';

            $content .= '<p>' . __('Let\'s get set up so you can start designing straight away.', 'maxi-blocks') . '</p>';
            $content .= '<p>' . __('Just a few quick steps, and you\'re ready to go!', 'maxi-blocks') . '</p>';

            // Action buttons
            $content .= '<div class="welcome-actions">';
            $content .= '<a href="' . esc_url(admin_url('admin.php?page=maxi-blocks-quick-start')) . '" target="_blank" class="button button-primary quick-start">' . __('Quick start', 'maxi-blocks') . '</a>';
            $content .= '<a href="' . esc_url(admin_url('post-new.php?post_type=page')) . '" target="_blank" class="button button-secondary create-new">' . __('Create new page', 'maxi-blocks') . '</a>';
            $content .= '</div>';
            $content .= '</div>'; // welcome-header

            // Placeholder image section
            $content .= '<div class="welcome-preview">';
            $content .= '<img src="' . esc_url(MAXI_PLUGIN_URL_PATH . 'img/maxi-dashboard-video-placeholder.jpg') . '" alt="' . esc_attr__('MaxiBlocks preview', 'maxi-blocks') . '" class="preview-placeholder">';
            $content .= '</div>';

            // Learn by watching section
            $content .= '<div class="learn-section">';
            $content .= '<h2>' . __('Learn by watching', 'maxi-blocks') . '</h2>';
            $content .= '<p>' . __('Watch quick tutorials to get the most out of MaxiBlocks. Learn tips, tricks and best practices to build faster and smarter.', 'maxi-blocks') . '</p>';

            // Video grid
            $content .= '<div class="video-grid">';

            // Video items
            $videos = [
                [
                    'title' => __('Understanding full site editing in WordPress', 'maxi-blocks'),
                    'description' => __('Learn what full site editing (FSE) is in WordPress and how it changes the way you design and customize your website using blocks.', 'maxi-blocks'),
                    'image' => MAXI_PLUGIN_URL_PATH . 'img/what-is-full-site-editing-in-wordpress.jpg',
                    'link' => 'https://youtu.be/vd9foamWlZ4?si=E3vWph2ybOOng9CH'
                ],
                [
                    'title' => __('Step-by-step: how to add a new page in WordPress', 'maxi-blocks'),
                    'description' => __('A quick guide to creating and managing new pages in WordPress, perfect for beginners looking to build their site.', 'maxi-blocks'),
                    'image' => MAXI_PLUGIN_URL_PATH . 'img/how-to-add-a-page-in-wordpress.jpg',
                    'link' => 'https://youtu.be/fchhWrc_ubs?si=ImMmTIK5--Qiw-jO'
                ],
                [
                    'title' => __('How to set a page as your homepage in WordPress', 'maxi-blocks'),
                    'description' => __('Want a custom homepage? This tutorial shows you how to set any page as your homepage in just a few clicks.', 'maxi-blocks'),
                    'image' => MAXI_PLUGIN_URL_PATH . 'img/how-to-set-a-page-as-homepage-in-wordpress.jpg',
                    'link' => 'https://youtu.be/fchhWrc_ubs?si=IYB_3Ou26-RPOD7n'
                ],
                [
                    'title' => __('How to edit and customise the footer in WordPress', 'maxi-blocks'),
                    'description' => __('Need to change the footer? This guide helps you through the steps to edit and personalize your footer section.', 'maxi-blocks'),
                    'image' => MAXI_PLUGIN_URL_PATH . 'img/wordpress-how-to-change-footer.jpg',
                    'link' => 'https://youtu.be/DMDrmpNO6gc?si=dtFr6q4y94TMk48y'
                ],
                [
                    'title' => __('How to create and manage navigation menus in WordPress', 'maxi-blocks'),
                    'description' => __('Design your site\'s main navigation. Learn how to create and organize your WordPress for a better user experience.', 'maxi-blocks'),
                    'image' => MAXI_PLUGIN_URL_PATH . 'img/wordpress-navigation-menu.jpg',
                    'link' => 'https://youtu.be/ikZRr4YpzIs?si=1RNdjYYrCTCogvU4'
                ],
                [
                    'title' => __('How to add and format content in WordPress', 'maxi-blocks'),
                    'description' => __('Learn how to add text, images, and other content to your WordPress pages and posts. A guide to create engaging layouts.', 'maxi-blocks'),
                    'image' => MAXI_PLUGIN_URL_PATH . 'img/how-to-add-content-to-wordpress.jpg',
                    'link' => 'https://youtu.be/aiWvSUuyDfo?si=W8lvYj4wFiJLbKNf'
                ]
            ];

            foreach ($videos as $video) {
                $content .= '<div class="video-item">';
                $content .= '<a href="' . esc_url($video['link']) . '" target="_blank">';
                $content .= '<div class="video-thumbnail"><img src="' . esc_url($video['image']) . '" alt="' . esc_attr($video['title']) . '"></div>';
                $content .= '<h3>' . esc_html($video['title']) . '</h3>';
                $content .= '<p>' . esc_html($video['description']) . '</p>';
                $content .= '</a>';
                $content .= '</div>';
            }

            $content .= '</div>'; // video-grid

            $content .= '<div class="more-videos">';
            $content .= '<a href="https://www.youtube.com/watch?v=vd9foamWlZ4&list=PLyq6BtMKKWufXgUBJQ7e4w4jskjTsnQ1h" target="_blank" class="button">' . __('More videos', 'maxi-blocks') . '</a>';
            $content .= '</div>';

            $content .= '</div>'; // learn-section

            // Bottom CTAs section
            $content .= '<div class="bottom-ctas">';

            // Need help
            $content .= '<div class="cta-item">';
            $content .= '<img src="' . esc_url(MAXI_PLUGIN_URL_PATH . 'img/maxiblocks-support.svg') . '" alt="' . esc_attr__('Need Help', 'maxi-blocks') . '" class="cta-icon">';
            $content .= '<h3>' . __('Need help?', 'maxi-blocks') . '</h3>';
            $content .= '<p>' . __('We\'re here for you. Get the support you need!', 'maxi-blocks') . '</p>';
            $content .= '<a href="https://maxiblocks.com/go/read-the-blog" target="_blank" class="button">' . __('Read the blog', 'maxi-blocks') . '</a>';
            $content .= '</div>';

            // Never miss an update
            $content .= '<div class="cta-item">';
            $content .= '<img src="' . esc_url(MAXI_PLUGIN_URL_PATH . 'img/maxiblocks-email.svg') . '" alt="' . esc_attr__('Never Miss an Update', 'maxi-blocks') . '" class="cta-icon">';
            $content .= '<h3>' . __('Never miss an update', 'maxi-blocks') . '</h3>';
            $content .= '<p>' . __('Get new patterns, tips, and updates—no spam.', 'maxi-blocks') . '</p>';
            $content .= '<a href="https://maxiblocks.com/go/notify-me" target="_blank" class="button">' . __('Notify me', 'maxi-blocks') . '</a>';
            $content .= '</div>';

            // Share thoughts
            $content .= '<div class="cta-item">';
            $content .= '<img src="' . esc_url(MAXI_PLUGIN_URL_PATH . 'img/maxiblocks-testimonial.svg') . '" alt="' . esc_attr__('Share Your Thoughts', 'maxi-blocks') . '" class="cta-icon">';
            $content .= '<h3>' . __('Share your thoughts!', 'maxi-blocks') . '</h3>';
            $content .= '<p>' . __('Love us? Leave a review and help others discover it.', 'maxi-blocks') . '</p>';
            $content .= '<a href="https://maxiblocks.com/go/give-a-review" target="_blank" class="button">' . __('Give a review', 'maxi-blocks') . '</a>';
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
            $content .= '<p>' . __('Customise MaxiBlocks, manage fonts, APIs, and access support.', 'maxi-blocks') . '</p>';
            $content .= '</div>';

            $content .= '<div class="maxi-dashboard_main-content_accordion_wrapper">';
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

            $content .= get_submit_button();

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
                __('You are currently using: ' . $font_provider_label) .
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

            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item-content
            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item

            $content .= $this->generate_item_header(
                __('Template library and Style Cards', 'maxi-blocks'),
                false,
            );

            $content .=
                '<p>' .
                __(
                    'Even the best designers use page templates to save time. The trick is to change styles without wasting hours choosing colours and fonts. You need a shortcut. You need a Style Card.',
                    'maxi-blocks',
                ) .
                '</p>';

            $content .=
                '<p>' .
                __(
                    'Style Cards change 15 design elements in sync. It works like this:',
                    'maxi-blocks',
                ) .
                '</p>';
            $content .= '<ol>';
            $content .=
                '<li>' .
                __(
                    'Choose your favourite Style Card from 100 shown in the library.',
                    'maxi-blocks',
                ) .
                '</li>';
            $content .=
                '<li>' .
                __(
                    'Browse the template library to find a good page or pattern.',
                    'maxi-blocks',
                ) .
                '</li>';
            $content .=
                '<li>' .
                __(
                    'Insert and watch how templates instantly match your chosen style.',
                    'maxi-blocks',
                ) .
                '</li>';
            $content .= '</ol>';

            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item-content
            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item

            $content .= $this->generate_item_header(
                __('MaxiBlocks is free and open source', 'maxi-blocks'),
                false,
            );

            $content .=
                '<p>' .
                __(
                    'Whatever you create with MaxiBlocks is yours to keep. You are welcome to use the free templates on as many sites as you want. Don`t forget to share your pages with the hashtag',
                    'maxi-blocks',
                );

            $content .=
                '<a href="https://maxiblocks.com/" target="_blank"> ' .
                __('#maxiblocks', 'maxi-blocks') .
                '</a>';

            $content .=
                __(' - We\'re dying to see what you create. ', 'maxi-blocks') .
                '</p>';

            $content .=
                '<p>' .
                __(
                    'Our next goal is to launch the MaxiBlocks Pro template library subscription. Hundreds of patterns and pages have already been completed. It`s going to be epic. This income will help us grow the team and build out the awesome roadmap.',
                    'maxi-blocks',
                );

            $content .=
                ' <a href="https://maxiblocks.com/go/pro-subscription" target="_blank">' .
                __('Learn more about MaxiBlocks Pro.', 'maxi-blocks') .
                '</a>';

            $content .= '</p>';

            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item-content
            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item

            $content .= $this->generate_item_header(
                __('Roadmap', 'maxi-blocks'),
                false,
            );

            $content .=
                '<p>' .
                __(
                    'There`s a grand plan and we need your help. Share your suggestions or vote on what to build next. ',
                    'maxi-blocks',
                );

            $content .=
                '<a href="https://maxiblocks.com/go/roadmap" target="_blank"> ' .
                __("See what's planned in the roadmap.", 'maxi-blocks') .
                '</a>';

            $content .= '</p>';

            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item-content
            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item
            $content .= '</div>'; // maxi-dashboard_main-content

            return $content;
        }

        public function maxi_blocks_maxi_ai()
        {
            $content = '<div class="maxi-dashboard_main-content">';
            $content .= '<div class="maxi-dashboard_main-content-settings maxi-dashboard_main-content-maxi-ai">';
            $content .= '<h1>' . __('Maxi AI', 'maxi-blocks') . '</h1>';
            $content .= '<p>' . __('General setting for Maxi AI writer', 'maxi-blocks') . '</p>';
            $content .= '</div>';

            $content .= '<div class="maxi-dashboard_main-content_accordion_wrapper">';
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

        public function generate_input(
            $option,
            $function = '',
            $type = 'text',
            $args = []
        ) {
            $is_api_input = isset($args['is_api_input'])
                ? $args['is_api_input']
                : false;
            $placeholder = isset($args['placeholder'])
                ? $args['placeholder']
                : '';

            $input_value = get_option($option);

            $visible_input_class =
                str_replace('_', '-', $option) . '-visible-input';

            if ($type === 'textarea') {
                $visible_input = $is_api_input
                    ? "<textarea class=\"maxi-dashboard_main-content_accordion-item-input regular-text {$visible_input_class}\">{$input_value}</textarea>"
                    : "<textarea name=\"{$option}\" id=\"{$option}\" class=\"maxi-dashboard_main-content_accordion-item-input regular-text\">{$input_value}</textarea>";
            } else {
                $visible_input = $is_api_input
                    ? "<input class=\"maxi-dashboard_main-content_accordion-item-input regular-text {$visible_input_class}\" type=\"{$type}\" value=\"{$input_value}\"/>"
                    : "<input name=\"{$option}\" id=\"{$option}\" class=\"maxi-dashboard_main-content_accordion-item-input regular-text\" type=\"{$type}\" value=\"{$input_value}\"/>";
            }

            $hidden_input = $is_api_input
                ? "<input name=\"{$option}\" id=\"{$option}\" class=\"maxi-dashboard_main-content_accordion-item-input regular-text\" type=\"hidden\" value=\"{$input_value}\"/>"
                : '';

            $input = <<<HTML
			    <div class="maxi-dashboard_main-content_accordion-item-content-switcher">
			        <span class="maxi-dashboard_main-content_accordion-item-content-switcher__label">{$placeholder}</span>
			        <div class="maxi-dashboard_main-content_accordion-item-content-switcher__input">
			            {$visible_input}
			            {$hidden_input}
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
                    '<option value="">' . __('', 'maxi-blocks') . '</option>';
            } else {
                // For other dropdowns, process the static list
                if (($key = array_search($option_value, $list)) !== false) {
                    unset($list[$key]);
                    array_unshift($list, $option_value);
                }

                foreach ($list as $value) {
                    $dropdown .=
                        '<option value="' .
                        $value .
                        '">' .
                        $value .
                        '</option>';
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
            } elseif (
                $type === 'text' ||
                $type === 'password' ||
                $type === 'textarea'
            ) {
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
                    $content .=
                        '<div id="maxi-api-test__validation-message"></div>';
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

            // List of settings and corresponding arguments
            $settings = [
                'accessibility_option' => $args,
                'bunny_fonts' => $args,
                'local_fonts' => $args,
                'local_fonts_uploaded' => $args,
                'remove_local_fonts' => $args,
                'allow_svg_json_uploads' => $args,
                'hide_tooltips' => $args,
                'swap_cloud_images' => $args,
                'google_api_key_option' => null,
                'openai_api_key_option' => null,
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

                register_setting(
                    'maxi-blocks-settings-group',
                    $setting_name,
                    $setting_args,
                );
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

        public function handle_get_frontend_assets()
        {
            try {
                $home_url = home_url();
                $response = wp_remote_get($home_url, [
                    'timeout' => 30,
                    'sslverify' => false,
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
    }
endif;
