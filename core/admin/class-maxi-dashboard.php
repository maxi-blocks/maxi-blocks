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
        private static $maxi_slug = 'maxi-blocks';
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

            add_action('maxi_blocks_db_tables_created', [$this, 'update_settings_on_install']);
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
                    array(
                        'strategy'  => 'defer', 'in_footer' => true
                        )
                );
                wp_enqueue_script('maxi-admin');

                $path_to_previews = plugins_url('../../img/block-preview/', __FILE__);

                wp_localize_script(
                    'maxi-admin',
                    'previews',
                    array(
                        'accordion_preview' => $path_to_previews.'accordion.png',
                        'button_preview'    => $path_to_previews.'button.png',
                        'container_preview' => $path_to_previews.'container.png',
                        'row_preview'       => $path_to_previews.'row.png',
                        'divider_preview'   => $path_to_previews.'divider.png',
                        'group_preview'     => $path_to_previews.'group.png',
                        'icon_preview'      => $path_to_previews.'icon.png',
                        'image_preview'     => $path_to_previews.'image.png',
                        'map_preview'       => $path_to_previews.'map.png',
                        'nc_preview'        => $path_to_previews.'nc.png',
                        'search_preview'    => $path_to_previews.'search.png',
                        'slider_preview'    => $path_to_previews.'slider.png',
                        'library_preview'   => $path_to_previews.'templates.png',
                        'text_preview'      => $path_to_previews.'text.png',
                        'video_preview'     => $path_to_previews.'video.png',
                        'pane_preview'      => $path_to_previews.'pane.png',
                        'slide_preview'     => $path_to_previews.'slide.png',
                    )
                );

                wp_localize_script(
                    'maxi-admin',
                    'localization',
                    array(
                        'loading_status_message' => __('Validating...', 'maxi-blocks'),
                        'please_add_api_key' => __('Please add your API key', 'maxi-blocks'),
                        'invalid_api_key' => __('Invalid API Key, please check your key and try again', 'maxi-blocks'),
                        'referer_not_allowed' => __('Referer not allowed, please allow your domain for that key', 'maxi-blocks'),
                        'invalid_characters' => __('Only alphabet, number, "_", "$", ".", "[", and "]" are allowed in the API key.', 'maxi-blocks'),
                        'server_error' => __('Error validating API Key, please try again later', 'maxi-blocks')
                    )
                );

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
                __('Start', 'maxi-blocks'),
                'manage_options',
                self::$maxi_slug_dashboard,
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
            add_submenu_page(
                self::$maxi_slug_dashboard,
                __('Maxi AI', 'maxi-blocks'),
                __('Maxi AI', 'maxi-blocks'),
                'manage_options',
                'admin.php?page='.self::$maxi_slug_dashboard.'&tab=maxi_blocks_maxi_ai',
                '',
                null
            );
            add_submenu_page(
                self::$maxi_slug_dashboard,
                __('Pro library', 'maxi-blocks'),
                __('Pro library', 'maxi-blocks'),
                'manage_options',
                'admin.php?page='.self::$maxi_slug_dashboard.'&tab=maxi_blocks_pro',
                '',
                null
            );
        }

        // Draw option page
        public function maxi_config_page()
        {
            $settings_tabs = [
                self::$maxi_prefix . 'start' => __(
                    'Start',
                    'maxi-blocks',
                ),
                self::$maxi_prefix . 'settings' => __(
                    'Settings',
                    'maxi-blocks',
                ),
                self::$maxi_prefix.'maxi_ai' => __(
                    'Maxi AI',
                    'maxi-blocks'
                ),
                self::$maxi_prefix.'pro' => __(
                    'Pro library',
                    'maxi-blocks'
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
                '"></header>';
            echo '<h4 class="maxi-dashboard_nav-tab-wrapper nav-tab-wrapper">';

            foreach ($settings_tabs as $tab_page => $tab_name) {
                $active_tab =
                    $current_tab == $tab_page
                        ? 'maxi-dashboard_nav-tab__active nav-tab-active'
                        : '';

                echo '<a class="maxi-dashboard_nav-tab nav-tab ' .
                    esc_attr($tab_page) .
                    esc_attr($active_tab) .
                    '" href="?page=' .
                    esc_attr(self::$maxi_slug_dashboard) .
                    '&tab=' .
                    esc_attr($tab_page) .
                    '">' .
                    wp_kses($tab_name, $this->maxi_blocks_allowed_html()) .
                    '</a>';
            }
            echo '</h4><form action="options.php" method="post" class="maxi-dashboard_form">';
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
                } elseif ($tab === self::$maxi_prefix.'pro') {
                    echo wp_kses(
                        $this->maxi_blocks_pro(),
                        maxi_blocks_allowed_html()
                    );
                } elseif($tab === self::$maxi_prefix.'maxi_ai') {
                    echo wp_kses(
                        $this->maxi_blocks_maxi_ai(),
                        maxi_blocks_allowed_html()
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
            $content .= '<h1>';

            if ($user_name) {
                $content .= __('Hello, ', 'maxi-blocks') . esc_html($user_name) . ' 👋';
            } else {
                $content .= __('Hello, friend', 'maxi-blocks') . ' 👋';
            }

            $content .= '</h1>';
            $content .=
                '<h2>' .
                __(
                    'Future-proof your web design with the modern page builder that blends simplicity and power',
                    'maxi-blocks',
                ) .
                '</h2>';
            $content .=
                '<p>' .
                __(
                    "MaxiBlocks is a no-code visual page builder that can create responsive, fast-loading webpages using an integrated design library.",
                    'maxi-blocks',
                ) .
                '</p>';
            $content .=
            '<p>' .
            __(
                "You can choose from over 1,800 patterns, 100 page templates, and 13,400 SVG icons to kickstart page building and bring your creative vision to life.",
                'maxi-blocks',
            ) .
            '</p>';
            $content .=
                '<p>' .
                __(
                    "No locked blocks",
                    'maxi-blocks',
                ) . " 📖: " .
                __(
                    "We refuse to hold basic features hostage just to sell the “full-version.” Everyone gets access to all page builder features, custom blocks and settings completely free. There's no lock-in by design.",
                    'maxi-blocks',
                ) .
                '</p>';
            $content .=
            '<p>' .
            __(
                "Goodbye license keys",
                'maxi-blocks',
            ) . " 👋: " .
            __(
                "Plus, we’re on a mission to make licence keys and domain restrictions go extinct, just like dinosaurs (except without the cool bones). With MaxiBlocks you get unlimited sites and unlimited downloads.",
                'maxi-blocks',
            ) .
            '</p>';
            $content .=
            '<p>' .
            __(
                "Packed with free goodies",
                'maxi-blocks',
            ) . " 🆓: " .
            __(
                "Get started with 200 free templates, 13.4k icons and 100 style cards. You don't even need an account. Just open a page and start building.",
                'maxi-blocks',
            ) .
            '</p>';
            $content .=
            '<p>' .
            __(
                "Loved by page builder enthusiasts, web designers, and template users, Maxi is here to make your life easier",
                'maxi-blocks',
            ) .
            '</p>';
            $content .=
            '<h2>' .
            __(
                "Go next-level with pro templates",
                'maxi-blocks',
            ) . " 🆙" .
            '</h2>';
            $content .=
            '<p>' .
            __(
                "If you're loving MaxiBlocks and want to support us, consider joining the Pro library. Find inspiration, get more variety and work faster with 1700 production-ready Pro templates.",
                'maxi-blocks',
            ) .
            '</p>';
            $content .=
            '<p>' .
            __(
                "It’s like having a dedicated professional designer crafting unique designs exclusively for you.",
                'maxi-blocks',
            ) .
            '</p>';
            $content .=
            '<p>' .
            __(
                "Our experienced team has created thousands of responsive designs using Maxi, so we know what works. Tap into a huge designer-made asset library that can literally double your output.",
                'maxi-blocks',
            ) .
            '</p>';
            $content .=
            '<p>' .
            __(
                "Copy, remix, and learn as you go - it's all possible with MaxiBlocks.",
                'maxi-blocks',
            ) .
            '</p>';

            $content .= '</div>'; // maxi-dashboard_main-content

            $content .= '<div class="maxi-dashboard_main-sidebar">';

            $content .= '<div class="maxi-dashboard_main-sidebar-item">';
            $content .= '<svg class="news-maxi-svg" width="64px" height="64px" viewBox="0 0 64 64" data-stroke="" stroke="#081219" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"><path d="M55.8 16.2V9.9H15.6v6.3h40.2m-39 9.3v12.4h10.3V25.5H16.8M56 29.7H45.7v25.8H56V29.7z" data-fill="" fill="#FF4A17"></path><g fill="none"><path d="M62.1 5.6l-2.3-3.1L57.3 5l-2.6-2.5L52.1 5l-2.6-2.5L47 5l-2.5-2.5L41.8 5l-2.5-2.5L36.7 5l-2.6-2.5L31.5 5 29 2.5 26.4 5l-2.6-2.5L21.2 5l-2.6-2.5L16.1 5l-2.6-2.5-2.9 3.1v8.7 40.6c-.4 4.9-2.4 6.5-4.3 6.5.5.2 1.1.3 1.8.3h54V5.6"></path><path d="M44.7 21.5H57m-12.3 4H57M10.6 14.3H2v41.3c0 2.6 1.9 5 4.3 5.7m9.5-39.8h12.3M15.8 42.7h12.3m-12.3 4.1h12.3M15.8 51h12.3m-12.3 4.5h12.3m3.2-34H41m-9.7 4.1H41m-9.7 4.3H41m-9.7 4.2H41m-9.7 4.2H41m-9.7 4.2H41m-9.7 13H41m-9.7-8.7H41"></path><path d="M31.3 51H41"></path></g></svg>';
            $content .= '<p>'.__('News and stories for creators.', 'maxi-blocks');
            $content .= ' <a href="https://maxiblocks.com/go/read-the-blog" target="_blank">'.__('Read the blog', 'maxi-blocks').'</a>.</p>';
            $content .='</div>'; // maxi-dashboard_main-sidebar-item

            $content .= '<div class="maxi-dashboard_main-sidebar-item">';
            $content .= '<svg class="email-marketing-2-maxi-svg" width="64px" height="64px" viewBox="0 0 64 64"><style>.email-marketing-2-maxi-svg .D{stroke:#081219}.email-marketing-2-maxi-svg .E{stroke-width:2}.email-marketing-2-maxi-svg .F{stroke-linejoin:round}.email-marketing-2-maxi-svg .G{stroke-miterlimit:10}.email-marketing-2-maxi-svg .H{fill:#FF4A17}.email-marketing-2-maxi-svg .I{stroke-linecap:round}</style><path d="M59.2 29.6l-7.3-5.7h-.5v13.4zm-46.6-5.9h-.5l-7.3 5.9 7.8 8z" data-stroke="" data-fill="" class="D E F G H"></path><g fill="none" data-stroke="" class="D E F G"><path d="M12.6 6.8v16.9 13.9l10.3 10.6 1.8-1.6c4.2-3.8 10.6-3.8 14.8 0l1.5 1.3 10.6-10.6V23.9 6.8h-39zm4.5 5.1h4.4m-4.4 4h5.3M49.2 26l-17.7 7.5 4.9 4.9-3 3-4.9-4.9-1.2 1.2a4.89 4.89 0 0 1-6.9 0 4.89 4.89 0 0 1 0-6.9l4.2-4.2 1.3-2.9 4.3-10.2 2-4.5 6 6c1.4-1.4 3.7-1.4 5.1 0s1.4 3.7 0 5.1l3.8 3.8 2.1 2.1z" class="I"></path><path d="M28.6 36.5l2.9-2.9h0zm22.8.8L40.9 47.9l1.1 1 13.4 12.2c2.2-.3 3.8-2.2 3.8-4.5v-27l-7.8 7.7zm-38.8.3l-7.7-8v27.1c0 2.3 1.7 4.1 3.8 4.5L22.1 49l.8-.7-10.3-10.7z"></path><path d="M9.4 61.1c-.2 0-.5 0-.7-.1m46.6.1c-.2 0-.5.1-.7.1" class="I"></path></g><path d="M41.9 48.9l-1.1-1-1.5-1.3c-4.2-3.8-10.6-3.8-14.8 0l-1.8 1.6-.8.7L9.4 61.1h45.3c.2 0 .5 0 .7-.1L41.9 48.9zM43.2 15c-1.4-1.4-3.7-1.4-5.1 0l5.1 5.1c1.4-1.4 1.4-3.7 0-5.1z" data-stroke="" data-fill="" class="H D E F G"></path><g fill="none" data-stroke="" class="D E F"><path d="M24.7,26.7l-4.2,4.2c-1.9,1.9-1.9,5,0,6.9c1.9,1.9,5,1.9,6.9,0l1.2-1.2l3-3L24.7,26.7z" class="G"></path><path d="M28.547 36.494l2.97-2.97 4.879 4.879-2.97 2.97z" stroke-miterlimit="9.9999"></path></g><g data-stroke="" class="G D E F"><path d="M44.7 28l-4.2-4.2-10.2-10.2-4.4 10.2-1.2 2.9 6.8 6.9h0 0L49.2 26z" data-fill="" class="H"></path><g fill="none"><path d="M31.5 33.6l-6.8-6.9 6.8 6.9zm-1.2-20h0L32.2 9z"></path><path d="M47 23.9l-3.8-3.8h0l-5-5.1h0l-6-6-1.9 4.6 10.2 10.2 4.2 4.2 4.5-2z"></path><path d="M21.5 11.9h-4.4m5.3 4h-5.3" class="I"></path></g><path d="M49.4 12.6c.4 0 .8-.2 1.1-.5L57 5.6a1.57 1.57 0 0 0 0-2.2c-.6-.6-1.6-.6-2.3 0l-6.5 6.5c-.6.6-.6 1.6 0 2.3.4.2.8.4 1.2.4zm-6-3.3A1.58 1.58 0 0 0 45 7.7V4.5a1.6 1.6 0 1 0-3.2 0v3.2c0 .8.7 1.6 1.6 1.6zm12.5 5.9h-3.3a1.58 1.58 0 0 0-1.6 1.6 1.58 1.58 0 0 0 1.6 1.6h3.3a1.58 1.58 0 0 0 1.6-1.6c0-.8-.7-1.6-1.6-1.6z" data-fill="" class="H"></path></g></svg>';
            $content .= '<p>'.__('Get a summary of stories you missed.', 'maxi-blocks');
            $content .= ' <a href="https://maxiblocks.com/go/notify-me" target="_blank">'.__('Notify me', 'maxi-blocks').'</a>.</p>';
            $content .='</div>'; // maxi-dashboard_main-sidebar-item

            $content .= '<div class="maxi-dashboard_main-sidebar-item">';
            $content .= '<svg class="achievement-2-maxi-svg" width="64px" height="64px" viewBox="0 0 64 64" data-stroke="" stroke="#081219" stroke-width="2" stroke-linejoin="round" stroke-miterlimit="10"><path d="M25 40.6h7.1 7.2l-7.2-3.7z" fill="none"></path><path d="M32.1 36.9l7.2 3.7h5.5l-1.9-11.5 5.4-5.3 5.3-5.2-14.8-2.2-6.7-13.5-6.6 13.5-14.9 2.2 10.8 10.5-2 11.5H25zm29 10.6h-8.8l-4.5 6.8h0l-4.5 6.8h17.8l-4.5-6.8zm-44.7 6.8l-4.5-6.8h-9l4.5 6.8-4.5 6.8H21l-4.6-6.8z" data-fill="" fill="#FF4A17"></path><g fill="none"><path d="M47.8 54.3l4.5-6.8h0z"></path><path d="M44.8 40.6h-5.5-7.2H25h-5.6H7.3l4.6 6.9 4.5 6.8h0 2.1 7.8 5.8 5.8 7.9 2 0l4.5-6.8 4.6-6.9z"></path></g></svg>';
            $content .= '<p>'.__('Your thoughts can inspire others.', 'maxi-blocks');
            $content .= ' <a href="https://maxiblocks.com/go/give-a-review" target="_blank">'.__('Give a quick review', 'maxi-blocks').'</a>.</p>';
            $content .='</div>'; // maxi-dashboard_main-sidebar-item

            $content .='</div>'; // maxi-dashboard_main-sidebar
            return $content;
        }

        public function maxi_blocks_settings()
        {
            $font_uploads_dir = wp_upload_dir()['basedir'] . '/maxi/fonts/';
            $font_uploads_dir_size = round(
                $this->get_folder_size($font_uploads_dir) / 1048576,
                2,
            );

            $content = '<div class="maxi-dashboard_main-content">';
            $content .= '<div class="maxi-dashboard_main-content_accordion">';

            if (isset($_GET['settings-updated'])) {
                //phpcs:ignore
                $content .=
                    '<h2>' .
                    __('Successfully done', 'maxi-blocks') .
                    '</h2>';
            }

            $content .= $this->generate_item_header(__('Editor preferences', 'maxi-blocks'), true);

            $description =
                '<h4>' .
                __('Hide interface tooltips', 'maxi-blocks') .
                '</h4>';
            $description .=
                '<p>' .
                __('Hide tooltips on mouse-hover.', 'maxi-blocks') .
                '</p>';
            $content .= $this->generate_setting($description, 'hide_tooltips');

            $content .= get_submit_button(__('Save changes', 'maxi-blocks'));

            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item-content
            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item

            $content .= $this->generate_item_header(__('Google Maps API key', 'maxi-blocks'), false);

            $content .= '<h4>'.__('Create Google Maps API key', 'maxi-blocks').'</h4>';
            $content .= '<p>'.__('To use Google Maps features, Google requires you to provide an API key that the plugin can use to make these requests on your behalf.', 'maxi-blocks').'</p>';
            $content .= '<p>'.__('To create an API key, you will need to do the following:', 'maxi-blocks').'</p>';
            $content .= '<ol>';
            $content .= '<li>'.__('Create a Google Cloud Platform account, if you don’t already have one.', 'maxi-blocks').'</li>';
            $content .= '<li>'.__('Create a new Google Cloud Platform project.', 'maxi-blocks').'</li>';
            $content .= '<li>'.__('Enable Google Maps Platform APIs.', 'maxi-blocks').'</li>';
            $content .= '<li>'.__('Generate an API key.', 'maxi-blocks').'</li>';
            $content .= '</ol>';
            $content .= '<p>'.__('To make this process easy, launch', 'maxi-blocks').' ';
            $content .= '<a href="https://maxiblocks.com/go/google-maps-api-quickstart" target="_blank" rel="noreferrer">';
            $content .= __('Google Maps API Quickstart', 'maxi-blocks');
            $content .= '</a> ';
            $content .= __('which will handle the setup of your account and generate the API key that you can insert below.', 'maxi-blocks').'</p>';

            $description = '<h4>'.__('Insert Google Maps API Key here', 'maxi-blocks').'</h4>';
            $content .= $this->generate_setting($description, 'google_api_key_option', '', 'password');

            $content .= get_submit_button();

            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item-content
            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item
            $content .= $this->generate_item_header(__('Fonts and files', 'maxi-blocks'), false);

            $use_bunny_fonts = get_option('bunny_fonts');
            $font_provider_label = $use_bunny_fonts ? 'Bunny Fonts' : 'Google Fonts';

            $description = '<h4>'.__('Use Bunny Fonts', 'maxi-blocks').'</h4>';
            $description .= '<p>'.__('You are currently using: ' . $font_provider_label).'</p>';
            $description .= '<p>'.__('Bunny Fonts: Privacy-friendly, GDPR compliant. Global CDN for fast loading. Wide selection of fonts available.', 'maxi-blocks').'</p>';
            $description .= '<p>'.__('Google Fonts: Extensive font selection. Potential privacy concerns when using Google\'s CDN.', 'maxi-blocks').'</p>';
            $content .= $this->generate_setting($description, 'bunny_fonts');

            if ($use_bunny_fonts) {
                $description = '<h4>'.__('Serve Bunny Fonts locally', 'maxi-blocks').'</h4>';
                $description .= '<p>'.__('Serve Bunny Fonts from CDN: Fastest option. Uses external CDN. No local storage required.', 'maxi-blocks').'</p>';
                $description .= '<p>'.__('Serve Bunny Fonts locally: Privacy-focused. May impact server performance. Requires local storage.', 'maxi-blocks').'</p>';
                $content .= $this->generate_setting($description, 'local_fonts', $this->local_fonts_upload());
            } else {
                $description = '<h4>'.__('Serve Google Fonts locally', 'maxi-blocks').'</h4>';
                $description .= '<p>'.__('Serve from Google CDN: Fastest option. Uses Google\'s CDN. Potential privacy (GDPR) implications.', 'maxi-blocks').'</p>';
                $description .= '<p>'.__('Serve Google Fonts locally: Blocks Google tracking. May impact server performance. Requires local storage.', 'maxi-blocks').'</p>';
                $content .= $this->generate_setting($description, 'local_fonts', $this->local_fonts_upload());
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
            $content .=
                __(' for self-service.', 'maxi-blocks') . '</p>';


            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item-content
            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item

            $content .= $this->generate_item_header(__('Troubleshooting', 'maxi-blocks'), false);

            $content .=
                '<h4>' .
                __('Site health info report', 'maxi-blocks') .
                '</h4>';
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

            $content .= $this->generate_item_header(__('Experimental preferences', 'maxi-blocks'), false);

            $description = '<h4>'.__('Enable settings indicators', 'maxi-blocks').'</h4>';
            $description .= '<p>'.__('Enables indicators that shows the modified settings on MaxiBlocks blocks inspector settings', 'maxi-blocks').'</p>';
            $content .= $this->generate_setting($description, 'maxi_show_indicators');


            $content .= get_submit_button();

            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item-content
            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item

            $content .= $this->generate_item_header(__('Template library and Style Cards', 'maxi-blocks'), false);

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

            $content .= $this->generate_item_header(__('MaxiBlocks is free and open source', 'maxi-blocks'), false);

            $content .=
                '<p>' .
                __(
                    'Whatever you create with MaxiBlocks is yours to keep. You are welcome to use the free templates on as many sites as you want. Don’t forget to share your pages with the hashtag',
                    'maxi-blocks',
                );

            $content .=
                '<a href="https://maxiblocks.com/" target="_blank"> ' .
                __('#maxiblocks', 'maxi-blocks') .
                '</a>';

            $content .=
                __(
                    ' - We’re dying to see what you create. ',
                    'maxi-blocks',
                ) .
                '</p>';

            $content .=
                '<p>' .
                __(
                    'Our next goal is to launch the MaxiBlocks Pro template library subscription. Hundreds of patterns and pages have already been completed. It’s going to be epic. This income will help us grow the team and build out the awesome roadmap.',
                    'maxi-blocks',
                ) ;

            $content .=
                ' <a href="https://maxiblocks.com/go/pro-subscription" target="_blank">' .
                __(
                    'Learn more about MaxiBlocks Pro.',
                    'maxi-blocks',
                ) .
                '</a>';

            $content .=
                '</p>';

            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item-content
            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item

            $content .= $this->generate_item_header(__('Roadmap', 'maxi-blocks'), false);

            $content .=
                '<p>' .
                __(
                    'There’s a grand plan and we need your help. Share your suggestions or vote on what to build next. ',
                    'maxi-blocks',
                ) ;

            $content .=
                '<a href="https://maxiblocks.com/go/roadmap" target="_blank"> ' .
                __(
                    "See what's planned in the roadmap.",
                    'maxi-blocks',
                ) .
                '</a>';

            $content .=
                '</p>';


            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item-content
            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item
            $content .= '</div>'; // maxi-dashboard_main-content_accordion
            $content .= '</div>'; // maxi-dashboard_main-content

            return $content;
        }

        public function maxi_blocks_pro()
        {
            $current_user = wp_get_current_user();
            $user_name = $current_user->user_firstname;
            $content = '<div class="maxi-dashboard_main-content maxi-dashboard_main-content-pro-library">';
            $content .= '<div class="maxi-dashboard_main-content_accordion" id="maxi-dashboard_main-content_pro-not-pro">';

            $content .= '<div id="maxi-dashboard_main-content_not-pro">';
            $content .= '<h1>'.__('Thousands of premium templates to work faster', 'maxi-blocks').'</h1>';
            $content .= '<h2>'.__('Unlimited downloads. Unlimited sites. No feature lock-in.', 'maxi-blocks').'</h2>';
            $content .= '<p>'.__('Find inspiration, or add variety to your designs. Boost your productivity and grow your audience. Join our community of creators who love to build fast, beautiful, responsive websites.', 'maxi-blocks').'</p>';
            $content .= '<h3>'.__("Let’s create something amazing with Maxi", 'maxi-blocks').'</h3>';
            $content .= '<div class="sign-up_button-wrap">';
            $content .= '<a href="https://maxiblocks.com/go/pricing" target="_blank" class="sign-up_button">'.__('Sign up', 'maxi-blocks').'</a>';
            $content .= '<br/><br/><br/><p>'.__('Already have an account? ', 'maxi-blocks');
            $content .= '</p>';
            $content .= '<p>Sign in from the template library like this.</p>';
            $content .= '<p>Step 1. Launch template library from the page edit screen.</p>';
            $content .= '<img class="maxi-dashboard-how-to-image" src="'.esc_url(MAXI_PLUGIN_URL_PATH).'img/how-to-log-in-1.png"/>';
            $content .= '<p>Step 2. Add email and sign in.</p>';
            $content .= '<img class="maxi-dashboard-how-to-image" src="'.esc_url(MAXI_PLUGIN_URL_PATH).'img/how-to-log-in-2.png"/>';
            $content .= '</div>';
            $content .= '<ul class="not_loggedin-bottom-menu">';
            $content .= '<li><a href="https://maxiblocks.com/go/help-desk" target="_blank">'.__('help desk', 'maxi-blocks').'</a></li>';
            $content .= '<li><a href="https://maxiblocks.com/go/pro-library" target="_blank">'.__('pro library', 'maxi-blocks').'</a></li>';
            $content .= '<li><a href=" https://maxiblocks.com/go/demo-library" target="_blank">'.__('demo library', 'maxi-blocks').'</a></li>';
            $content .= '<li><a href="https://www.youtube.com/@maxiblocks" target="_blank">'.__('youtube', 'maxi-blocks').'</a></li>';
            $content .= '<li><a href="https://maxiblocks.com" target="_blank">'.__('maxiblocks.com', 'maxi-blocks').'</a></li>';
            $content .= '<li><a href="https://twitter.com/maxiblocks" target="_blank">'.__('twitter', 'maxi-blocks').'</a></li>';
            $content .= '<li><a href="https://maxiblocks.com/go/maxi-discord" target="_blank">'.__('discord community', 'maxi-blocks').'</a></li>';
            $content .= '<li><a href="https://maxiblocks.com/go/roadmap" target="_blank">'.__('roadmap', 'maxi-blocks').'</a></li>';
            $content .= '</ul>';

            $content .= '</div>'; // maxi-dashboard_main-content_not-pro
            $content .= '<div id="maxi-dashboard_main-content_pro" class="maxi-dashboard_main-content-pro-library-logged-in">';
            $content .=
                '<h2>' .
                __('Hi ', 'maxi-blocks');
            $content .=
                '<span>' .
                __('[username]', 'maxi-blocks').'</span>';
            $content .= '</h2>';
            $content .=
                '<h2>' .
                esc_html($user_name) .
                '</h2>';
            $content .= '<h1>'.__("You're signed in. Pro library is connected.", 'maxi-blocks').'</h1>';
            $content .= '<h3>'.__("Browse for templates", 'maxi-blocks').'</h3>';
            $content .= '<ul>';
            $content .=
                '<li>' .
                __(
                    '-  Create a new page to launch the editing experience',
                    'maxi-blocks',
                ) .
                '</li>';
            $content .=
                '<li>' .
                __(
                    '-  Open master toolbar from the square MaxiBlocks launcher icon',
                    'maxi-blocks',
                ) .
                '</li>';
            $content .=
                '<li>' .
                __(
                    '-  Choose "Template library" and select the blue "Pro" tab to start browsing',
                    'maxi-blocks',
                ) .
                '</li>';
            $content .= '</ul>';
            $content .= '<h3>'.__("Support links", 'maxi-blocks').'</h3>';
            $content .= '<ul class="loggedin-bottom-menu">';
            $content .= '<li><a href="https://maxiblocks.com/go/help-desk" target="_blank">'.__('Help desk', 'maxi-blocks').'</a></li>';
            $content .= '<li><a href="https://www.youtube.com/@maxiblocks" target="_blank">'.__('YouTube', 'maxi-blocks').'</a></li>';
            $content .= '<li><a href="https://maxiblocks.com" target="_blank">'.__('maxiblocks.com', 'maxi-blocks').'</a></li>';
            $content .= '<li><a href="https://maxiblocks.com/go/roadmap" target="_blank">'.__('Roadmap', 'maxi-blocks').'</a></li>';
            $content .= '</ul>';
            $content .= '<h4>'.__("Community", 'maxi-blocks').'</h4>';
            $content .= '<ul class="loggedin-bottom-menu">';
            $content .= '<li><a href="https://twitter.com/maxiblocks" target="_blank">'.__('Twitter', 'maxi-blocks').'</a></li>';
            $content .= '<li><a href="https://maxiblocks.com/go/maxi-discord" target="_blank">'.__('Discord community', 'maxi-blocks').'</a></li>';
            $content .= '</ul>';
            $content .= '</div>';
            return $content;
        }

        public function maxi_blocks_maxi_ai()
        {
            $content = '<div class="maxi-dashboard_main-content">';
            $content .= '<div class="maxi-dashboard_main-content_accordion">';

            $content .= $this->generate_item_header(__('Integrations', 'maxi-blocks'), true);

            $description = '<h4>'.__('Insert OpenAI API Key here', 'maxi-blocks').'</h4>';
            $content .= $this->generate_setting($description, 'openai_api_key_option', '', 'password');

            $description = '<h4>'.__('ChatGPT AI Model', 'maxi-blocks').'</h4>';
            $content .= $this->generate_setting($description, 'maxi_ai_model', '', 'dropdown', ['list' => [
                'gpt-4',
                'gpt-4-32k',
                'gpt-3.5-turbo',
                'gpt-3.5-turbo-16k',
            ]]);

            $content .= get_submit_button();

            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item-content
            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item

            $content .= $this->generate_item_header(__('Website identity', 'maxi-blocks'), true);

            $description = '
				<h4>'.__('Tell us about your site', 'maxi-blocks').'</h4>
				<p>'.__('What is the primary goal of your website? (e.g. shopping platform, offering
				services, showcasing work, journaling)', 'maxi-blocks').'</p>';
            $content .= $this->generate_setting($description, 'maxi_ai_site_description', '', 'textarea', [
                'placeholder' => __('Example: Hairdresser, Plumber, Marketing agency', 'maxi-blocks'),
            ]);

            $description = '
				<h4>'.__('Who is your target audience?', 'maxi-blocks').'</h4>
				<p>'.__('Group of people you want to connect with or offer services to.', 'maxi-blocks').'</p>';
            $content .= $this->generate_setting($description, 'maxi_ai_audience', '', 'textarea', [
                'placeholder' => __('Example: Ladies who need haircuts', 'maxi-blocks'),
            ]);

            $description = '
				<h4>'.__('What is the goal of the website?', 'maxi-blocks').'</h4>
				<p>'.__('Enter as many as you like. Separate with commas.', 'maxi-blocks').'</p>';
            $content .= $this->generate_setting($description, 'maxi_ai_site_goal', '', 'textarea', [
                'placeholder' => __('Example: Get bookings, write a blog', 'maxi-blocks'),
            ]);

            $description = '
				<h4>'.__('What services do you offer?', 'maxi-blocks').'</h4>
				<p>'.__('Enter as many as you like. Separate with commas.', 'maxi-blocks').'</p>';
            $content .= $this->generate_setting($description, 'maxi_ai_services', '', 'textarea', [
                'placeholder' => __('Example: Hair cuts, blow dries, beard shave', 'maxi-blocks'),
            ]);

            $description = '
				<h4>'.__('What is your website or business name?', 'maxi-blocks').'</h4>
				<p>'.__('The name will be used for writing content. Optional. Takes WordPress Site Title by default', 'maxi-blocks').'</p>';
            $content .= $this->generate_setting($description, 'maxi_ai_business_name', '', 'textarea', [
                'placeholder' => __("Example: Mary's fabulous hair studio", 'maxi-blocks'),
            ]);

            $description = '
				<h4>'.__('Anything else we should know?', 'maxi-blocks').'</h4>
				<p>'.__('Outline your business operations, share the origins of your venture, detail your offerings, and highlight the unique value you add to your audience.', 'maxi-blocks').'</p>';
            $content .= $this->generate_setting($description, 'maxi_ai_business_info', '', 'textarea', [
                'placeholder' => __('Example: Get bookings, write a blog', 'maxi-blocks'),
            ]);

            $content .= get_submit_button();

            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item-content
            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item

            $content .= '</div>'; // maxi-dashboard_main-content_accordion
            $content .= '</div>'; // maxi-dashboard_main-content

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
                : "";

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

            $dropdown = '<div class="maxi-dashboard_main-content_accordion-item-content-switcher">';
            $dropdown .= '<div class="maxi-dashboard_main-content_accordion-item-content-switcher__dropdown">';
            $dropdown .= '<select name="'.$option.'" id="'.$option.'" class="maxi-dashboard_main-content_accordion-item-input regular-text">';

            $option_value = get_option($option) ? get_option($option) : 'gpt-3.5-turbo';

            if(($key = array_search($option_value, $list)) !== false) {
                unset($list[$key]);
                array_unshift($list, $option_value);
            }


            foreach($list as $value) {
                $dropdown .= '<option value="'.$value.'">'.$value.'</option>';
            }

            $dropdown .= '</select>';

            $dropdown .= $this->generate_input($option, '', 'hidden');

            $dropdown .= '</div>'; // maxi-dashboard_main-content_accordion-item-content-switcher__dropdown
            $dropdown .= '</div>'; // maxi-dashboard_main-content_accordion-item-content-switcher

            return $dropdown;
        }

        public function generate_setting($description, $option, $function = '', $type = 'toggle', $args = [])
        {
            $content = '<div class="maxi-dashboard_main-content_accordion-item-content-setting">';
            $content .= '<div class="maxi-dashboard_main-content_accordion-item-content-description">';
            $content .= $description;
            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item-content-description

            if($type === 'dropdown') {
                $content .= $this->generate_custom_dropdown($option, $args);
            } elseif($type === 'text' || $type === 'password' || $type === 'textarea') {
                $is_api_input = $type === 'password';

                if($is_api_input) {
                    $api_name = str_replace('_api_key_option', '', $option);
                    $content .='<div id="maxi-api-test"></div>';
                }

                $args['is_api_input'] = $is_api_input;

                $content .= $this->generate_input($option, $function, $type, $args);

                if(str_contains($option, 'api_key_option')) {
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
            $args = array(
                'type' => 'boolean',
                'default' => false,
            );
            $args_true = array(
                'type' => 'boolean',
                'default' => true,
            );
            $args_rollback = array(
                'type' => 'string',
                'default' => 'current',
            );
            $args_ai_model = array(
                'type' => 'string',
                'default' => 'gpt-3.5-turbo',
            );
            $args_ai_description = array(
                'type' => 'string',
            );

            // List of settings and corresponding arguments
            $settings = array(
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
            );

            // Register the settings and set default values if they don't exist
            foreach ($settings as $setting_name => $setting_args) {
                // ! For debug: reset saved settings/options
                // unregister_setting('maxi-blocks-settings-group', $setting_name);
                // delete_option($setting_name);

                register_setting('maxi-blocks-settings-group', $setting_name, $setting_args);
                if(isset($setting_args['default'])) {
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
                    $this->delete_all_files($file_path);
                } else {
                    $wp_filesystem->delete($file_path);
                }
            }

            $wp_filesystem->rmdir($folder);
        }


        public function remove_local_fonts()
        {
            if((bool) get_option('remove_local_fonts')) {
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
                MaxiBlocks_Local_Fonts::register();
            }
        }

    }
endif;
