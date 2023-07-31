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

        private static $maxi_prefix  = 'maxi_blocks_';
        private static $maxi_slug = 'maxi-blocks';
        private static $maxi_slug_dashboard = 'maxi-blocks-dashboard';
        private static $maxi_plugin_name = 'Maxi Blocks';
        private static $maxi_text_domain = 'maxi-blocks';


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
            add_action('admin_menu', array(
                $this,
                'maxi_register_menu'
            ));

            add_action('admin_init', array(
                $this,
                'register_maxi_blocks_settings'
            ));

            add_action('admin_enqueue_scripts', array(
                $this,
                'maxi_admin_scripts_styles'
            ));

            add_action('admin_notices', array(
                $this,
                'generate_styles_button'
            ));

            $this->allow_svg_json_uploads();
        }

        public function maxi_get_menu_icon_base64()
        {
            $icon_svg_code = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M19.742 10.079c-.131-.187-.328-.312-.557-.352-.246-.043-.507.017-.73.174l-2.485 1.922 1.728-6.786a.89.89 0 0 0-.473-1.057.94.94 0 0 0-1.097.25l-4.839 5.923 1.264-5.205c.121-.368-.046-.796-.4-1.017-.344-.216-.805-.164-1.082.113l-8.404 7.637c-.596-2.82.294-4.884 1.182-6.147 1.463-2.057 3.961-3.378 6.385-3.378.502.006.972-.403.972-.908a.91.91 0 0 0-.902-.908C7.316.314 4.191 1.911 2.341 4.47.601 6.901.178 9.947 1.142 13.07l-.768.699a.87.87 0 0 0-.292.639c-.005.236.079.464.224.626.288.363.931.411 1.272.069l8.536-7.742-1.521 6.272c-.08.4.111.805.505 1.022a.94.94 0 0 0 1.098-.251l4.756-5.83-1.375 5.356c-.126.377.033.805.375 1.017s.783.189 1.06-.046l2.48-1.936c-1.209 2.999-3.943 4.879-7.243 4.879-.872 0-3.878-.201-5.986-2.801-.335-.376-.878-.425-1.281-.104a.95.95 0 0 0-.315.606c-.028.251.047.491.201.664 2.618 3.202 6.33 3.451 7.406 3.451 5.078 0 9.032-3.624 9.6-8.735a.95.95 0 0 0-.131-.845z" fill="#fff"/></svg>';
            $icon_base64 = base64_encode($icon_svg_code);
            $icon_data_uri = 'data:image/svg+xml;base64,' . $icon_base64;

            return $icon_data_uri;
        }

        public function maxi_admin_scripts_styles()
        {
            if (is_admin()) {
                wp_register_style('maxi-admin', MAXI_PLUGIN_URL_PATH.'build/admin.css');
                wp_enqueue_style('maxi-admin');

                wp_register_script(
                    'maxi-admin',
                    MAXI_PLUGIN_URL_PATH.'build/admin.js'
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
            }
        }

        /**
         * Register menu page and submenus
         */
        public function maxi_register_menu()
        {
            add_menu_page(__(self::$maxi_plugin_name, self::$maxi_text_domain), __(self::$maxi_plugin_name, self::$maxi_text_domain), 'manage_options', self::$maxi_slug_dashboard, array(
                    $this,
                    'maxi_config_page'
                ), $this->maxi_get_menu_icon_base64(), null);
            add_submenu_page(self::$maxi_slug_dashboard, __(self::$maxi_plugin_name, self::$maxi_text_domain), __('Start', self::$maxi_text_domain), 'manage_options', self::$maxi_slug_dashboard, '', null);
            add_submenu_page(self::$maxi_slug_dashboard, __('Settings', self::$maxi_text_domain), __('Settings', self::$maxi_text_domain), 'manage_options', 'admin.php?page='.self::$maxi_slug_dashboard.'&tab=maxi_blocks_settings', '', null);
        }

        // Draw option page
        public function maxi_config_page()
        {
            $settings_tabs = array(
                self::$maxi_prefix.'start' => __('Start', self::$maxi_text_domain),
                self::$maxi_prefix.'settings' => __('Settings', self::$maxi_text_domain),

            );


            if (isset($_GET['tab'])) { // phpcs:ignore
                $current_tab = $tab = sanitize_text_field($_GET['tab']); // phpcs:ignore
            } else {
                $current_tab = $tab =  self::$maxi_prefix.'start';
            }

            echo '<div class="maxi-dashboard_wrap">';
            echo '<header class="maxi-dashboard_header"><img class="maxi-dashboard_logo" width="200" src="'.esc_url(MAXI_PLUGIN_URL_PATH) . 'img/maxi-logo-dashboard.svg'.'" alt="'.esc_html(__('Maxi Blocks Logo', self::$maxi_text_domain)).'"></header>';
            echo  '<h4 class="maxi-dashboard_nav-tab-wrapper nav-tab-wrapper">';

            foreach ($settings_tabs as $tab_page => $tab_name) {
                $active_tab = $current_tab == $tab_page ? 'maxi-dashboard_nav-tab__active nav-tab-active' : '';

                echo '<a class="maxi-dashboard_nav-tab nav-tab ' . esc_attr($tab_page) . esc_attr($active_tab) . '" href="?page=' . esc_attr(self::$maxi_slug_dashboard) . '&tab=' . esc_attr($tab_page) . '">' . wp_kses($tab_name, $this->maxi_blocks_allowed_html()) . '</a>';
            }
            echo '</h4><form action="options.php" method="post" class="maxi-dashboard_form">';
            settings_fields('maxi-blocks-settings-group');
            do_settings_sections('maxi-blocks-settings-group');
            echo '<div class="maxi-dashboard_main">';

            if (isset($tab)) {
                if ($tab === self::$maxi_prefix.'start') {
                    echo wp_kses($this->maxi_blocks_welcome(), maxi_blocks_allowed_html());
                } elseif ($tab === self::$maxi_prefix.'settings') {
                    echo wp_kses($this->maxi_blocks_settings(), maxi_blocks_allowed_html());
                }
            }

            echo '</div>'; // maxi-dashboard_main
            echo '<div class="clear"></div>';
            echo '</form>'; // maxi-dashboard_form
            echo '</div>';// maxi-dashboard_wrap
        }

        public function maxi_blocks_welcome()
        {
            $current_user = wp_get_current_user();
            $user_name = $current_user->user_firstname;

            $content = '<div class="maxi-dashboard_main-content">';
            $content .= '<h1>'.__('Hello friend ', self::$maxi_text_domain).esc_html($user_name).'</h1>';
            $content .= '<h2>'.__('Craft your digital story with web templates that instantly match your style', self::$maxi_text_domain).'</h2>';
            $content .= '<p>'.__('Maxi Blocks is a modern page builder and template library made for creators like you. Join us as we explore the full potential of Gutenberg and the future of WordPress.', self::$maxi_text_domain).'</p>';


            $content .= '<h3>'.__('Open source and free to build', self::$maxi_text_domain).'</h3>';
            $content .= '<p>'.__('Anything you create with Maxi Blocks builder is yours to keep. There’s no lock in, no domain restrictions or license keys to keep track of. Start with 700 free templates and build as many sites as you want. All you need is time and effort.', self::$maxi_text_domain);
            $content .= '<h3>'.__('Work smarter with pro patterns', self::$maxi_text_domain).'</h3>';
            $content .= '<p>'.__('Building beautiful web pages from scratch takes time and effort. Our pro template library offers 600+ professional patterns to help you work faster and more efficiently. With 1,579 additional designs in development, our collection is constantly growing. Your support helps us improve the library and add new features.', self::$maxi_text_domain);
            $content .= '<p><a href="https://maxiblocks.com/go/pro-subscription" target="_blank"> '.__('Visit Maxi Blocks Pro to learn more', self::$maxi_text_domain).'</a>.</p>';

            $content .= '<h3>'.__('Template library and style cards', self::$maxi_text_domain).'</h3>';
            $content .= '<p>'.__('Combine page templates with style cards to save time. Here’s how it works;', self::$maxi_text_domain).'</p>';

            $content .= '<ol>';
            $content .= '<li>'.__('First create a new blank page from the WordPress pages menu. Then click the Maxi Blocks launcher icon.', self::$maxi_text_domain).'</li>';
            $content .= '<li>'.__('Find a style card and activate it. You can change it later.', self::$maxi_text_domain).'</li>';
            $content .= '<li>'.__('Browse the template library for a good page or pattern. Click insert.', self::$maxi_text_domain).'</li>';
            $content .= '<li>'.__('Notice how templates automatically update to match your style card.', self::$maxi_text_domain).'</li>';
            $content .= '<li>'.__('Use the editor to update content or tweak the design. For help, click the (?) icon.', self::$maxi_text_domain).'</li>';
            $content .= '</ol>';


            $content .= '<h3>'.__('Roadmap', self::$maxi_text_domain).'</h3>';
            $content .= '<p>'.__('There’s a grand plan, and we need your help. Share your suggestions or vote on what to build next.', self::$maxi_text_domain).' <a href="https://maxiblocks.com/go/roadmap" target="_blank">'.__('See what’s planned in the roadmap', self::$maxi_text_domain).'</a></p>';

            $content .= '<h3>'.__('About Beta 1.0', self::$maxi_text_domain).'</h3>';
            $content .= '<p>'.__('The Maxi Blocks builder will improve with your valuable feedback. And because we’re open source, everyone can benefit. Even so, your setup might be different. It’s recommended to build in a staging environment while we’re still in Beta. If you find an issue, please let us know via our support channels. Every bit of feedback helps. Thank you!', self::$maxi_text_domain).'</p>';

            $content .='</div>'; // maxi-dashboard_main-content

            // $content .= '<div class="maxi-dashboard_main-sidebar">';

            // $content .= '<div class="maxi-dashboard_main-sidebar-item">';
            // $content .= '<svg class="news-maxi-svg" width="64px" height="64px" viewBox="0 0 64 64" data-stroke="" stroke="var(--maxi-light-icon-stroke,rgba(var(--maxi-light-color-7,8,18,25),1))" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"><path d="M55.8 16.2V9.9H15.6v6.3h40.2m-39 9.3v12.4h10.3V25.5H16.8M56 29.7H45.7v25.8H56V29.7z" data-fill="" fill="var(--maxi-light-icon-fill,rgba(var(--maxi-light-color-4,255,74,23),1))"></path><g fill="none"><path d="M62.1 5.6l-2.3-3.1L57.3 5l-2.6-2.5L52.1 5l-2.6-2.5L47 5l-2.5-2.5L41.8 5l-2.5-2.5L36.7 5l-2.6-2.5L31.5 5 29 2.5 26.4 5l-2.6-2.5L21.2 5l-2.6-2.5L16.1 5l-2.6-2.5-2.9 3.1v8.7 40.6c-.4 4.9-2.4 6.5-4.3 6.5.5.2 1.1.3 1.8.3h54V5.6"></path><path d="M44.7 21.5H57m-12.3 4H57M10.6 14.3H2v41.3c0 2.6 1.9 5 4.3 5.7m9.5-39.8h12.3M15.8 42.7h12.3m-12.3 4.1h12.3M15.8 51h12.3m-12.3 4.5h12.3m3.2-34H41m-9.7 4.1H41m-9.7 4.3H41m-9.7 4.2H41m-9.7 4.2H41m-9.7 4.2H41m-9.7 13H41m-9.7-8.7H41"></path><path d="M31.3 51H41"></path></g></svg>';
            // $content .= '<p>'.__('News and stories for creators.', self::$maxi_text_domain);
            // $content .= ' <a href="" target="_blank">'.__('Read the blog', self::$maxi_text_domain).'</a>.</p>';
            // $content .='</div>'; // maxi-dashboard_main-sidebar-item

            // $content .= '<div class="maxi-dashboard_main-sidebar-item">';
            // $content .= '<svg class="email-marketing-2-maxi-svg" width="64px" height="64px" viewBox="0 0 64 64"><style>.email-marketing-2-maxi-svg .D{stroke:var(--maxi-light-icon-stroke,rgba(var(--maxi-light-color-7,8,18,25),1))}.email-marketing-2-maxi-svg .E{stroke-width:2}.email-marketing-2-maxi-svg .F{stroke-linejoin:round}.email-marketing-2-maxi-svg .G{stroke-miterlimit:10}.email-marketing-2-maxi-svg .H{fill:var(--maxi-light-icon-fill,rgba(var(--maxi-light-color-4,255,74,23),1))}.email-marketing-2-maxi-svg .I{stroke-linecap:round}</style><path d="M59.2 29.6l-7.3-5.7h-.5v13.4zm-46.6-5.9h-.5l-7.3 5.9 7.8 8z" data-stroke="" data-fill="" class="D E F G H"></path><g fill="none" data-stroke="" class="D E F G"><path d="M12.6 6.8v16.9 13.9l10.3 10.6 1.8-1.6c4.2-3.8 10.6-3.8 14.8 0l1.5 1.3 10.6-10.6V23.9 6.8h-39zm4.5 5.1h4.4m-4.4 4h5.3M49.2 26l-17.7 7.5 4.9 4.9-3 3-4.9-4.9-1.2 1.2a4.89 4.89 0 0 1-6.9 0 4.89 4.89 0 0 1 0-6.9l4.2-4.2 1.3-2.9 4.3-10.2 2-4.5 6 6c1.4-1.4 3.7-1.4 5.1 0s1.4 3.7 0 5.1l3.8 3.8 2.1 2.1z" class="I"></path><path d="M28.6 36.5l2.9-2.9h0zm22.8.8L40.9 47.9l1.1 1 13.4 12.2c2.2-.3 3.8-2.2 3.8-4.5v-27l-7.8 7.7zm-38.8.3l-7.7-8v27.1c0 2.3 1.7 4.1 3.8 4.5L22.1 49l.8-.7-10.3-10.7z"></path><path d="M9.4 61.1c-.2 0-.5 0-.7-.1m46.6.1c-.2 0-.5.1-.7.1" class="I"></path></g><path d="M41.9 48.9l-1.1-1-1.5-1.3c-4.2-3.8-10.6-3.8-14.8 0l-1.8 1.6-.8.7L9.4 61.1h45.3c.2 0 .5 0 .7-.1L41.9 48.9zM43.2 15c-1.4-1.4-3.7-1.4-5.1 0l5.1 5.1c1.4-1.4 1.4-3.7 0-5.1z" data-stroke="" data-fill="" class="H D E F G"></path><g fill="none" data-stroke="" class="D E F"><path d="M24.7,26.7l-4.2,4.2c-1.9,1.9-1.9,5,0,6.9c1.9,1.9,5,1.9,6.9,0l1.2-1.2l3-3L24.7,26.7z" class="G"></path><path d="M28.547 36.494l2.97-2.97 4.879 4.879-2.97 2.97z" stroke-miterlimit="9.9999"></path></g><g data-stroke="" class="G D E F"><path d="M44.7 28l-4.2-4.2-10.2-10.2-4.4 10.2-1.2 2.9 6.8 6.9h0 0L49.2 26z" data-fill="" class="H"></path><g fill="none"><path d="M31.5 33.6l-6.8-6.9 6.8 6.9zm-1.2-20h0L32.2 9z"></path><path d="M47 23.9l-3.8-3.8h0l-5-5.1h0l-6-6-1.9 4.6 10.2 10.2 4.2 4.2 4.5-2z"></path><path d="M21.5 11.9h-4.4m5.3 4h-5.3" class="I"></path></g><path d="M49.4 12.6c.4 0 .8-.2 1.1-.5L57 5.6a1.57 1.57 0 0 0 0-2.2c-.6-.6-1.6-.6-2.3 0l-6.5 6.5c-.6.6-.6 1.6 0 2.3.4.2.8.4 1.2.4zm-6-3.3A1.58 1.58 0 0 0 45 7.7V4.5a1.6 1.6 0 1 0-3.2 0v3.2c0 .8.7 1.6 1.6 1.6zm12.5 5.9h-3.3a1.58 1.58 0 0 0-1.6 1.6 1.58 1.58 0 0 0 1.6 1.6h3.3a1.58 1.58 0 0 0 1.6-1.6c0-.8-.7-1.6-1.6-1.6z" data-fill="" class="H"></path></g></svg>';
            // $content .= '<p>'.__('Get a summary of stories you missed.', self::$maxi_text_domain);
            // $content .= ' <a href="" target="_blank">'.__('Notify me', self::$maxi_text_domain).'</a>.</p>';
            // $content .='</div>'; // maxi-dashboard_main-sidebar-item

            // $content .= '<div class="maxi-dashboard_main-sidebar-item">';
            // $content .= '<svg class="achievement-2-maxi-svg" width="64px" height="64px" viewBox="0 0 64 64" data-stroke="" stroke="var(--maxi-light-icon-stroke,rgba(var(--maxi-light-color-7,8,18,25),1))" stroke-width="2" stroke-linejoin="round" stroke-miterlimit="10"><path d="M25 40.6h7.1 7.2l-7.2-3.7z" fill="none"></path><path d="M32.1 36.9l7.2 3.7h5.5l-1.9-11.5 5.4-5.3 5.3-5.2-14.8-2.2-6.7-13.5-6.6 13.5-14.9 2.2 10.8 10.5-2 11.5H25zm29 10.6h-8.8l-4.5 6.8h0l-4.5 6.8h17.8l-4.5-6.8zm-44.7 6.8l-4.5-6.8h-9l4.5 6.8-4.5 6.8H21l-4.6-6.8z" data-fill="" fill="var(--maxi-light-icon-fill,rgba(var(--maxi-light-color-4,255,74,23),1))"></path><g fill="none"><path d="M47.8 54.3l4.5-6.8h0z"></path><path d="M44.8 40.6h-5.5-7.2H25h-5.6H7.3l4.6 6.9 4.5 6.8h0 2.1 7.8 5.8 5.8 7.9 2 0l4.5-6.8 4.6-6.9z"></path></g></svg>';
            // $content .= '<p>'.__('Your thoughts can inspire others.', self::$maxi_text_domain);
            // $content .= ' <a href="" target="_blank">'.__('Give a quick review', self::$maxi_text_domain).'</a>.</p>';
            // $content .='</div>'; // maxi-dashboard_main-sidebar-item

            // $content .='</div>'; // maxi-dashboard_main-sidebar
            return $content;
        }

        public function maxi_blocks_settings()
        {
            $font_uploads_dir = wp_upload_dir()['basedir'] . '/maxi/fonts/';
            $font_uploads_dir_size = round($this->get_folder_size($font_uploads_dir)/1048576, 2);

            $content = '<div class="maxi-dashboard_main-content">';
            $content .= '<div class="maxi-dashboard_main-content_accordion">';

            if (isset($_GET['settings-updated'])) {//phpcs:ignore
                $content .= '<h2>'.__('Successfully done', self::$maxi_text_domain).'</h2>';
            }

            $content .= $this->generate_item_header('Editor preferences', true);

            $description = '<h4>'.__('Hide interface tooltips', self::$maxi_text_domain).'</h4>';
            $description .= '<p>'.__('Hide tooltips on mouse-hover.', self::$maxi_text_domain).'</p>';
            $content .= $this->generate_setting($description, 'hide_tooltips');

            // $description = '<h4>'.__('Accessibility: Enable focus indicator', self::$maxi_text_domain).'</h4>';
            // $description .= '<p>'.__('Show a visual focus indicator for tabbed keyboard navigation in the page editor.', self::$maxi_text_domain).'</p>';
            // $content .= $this->generate_setting($description, 'accessibility_option');

            $content .= get_submit_button();

            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item-content
            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item

            $content .= $this->generate_item_header('Google Maps API key', false);

            // $description = '<h4>'.__('Use post excerpts, if defined by your theme', self::$maxi_text_domain).'</h4>';
            // $description .= '<p>'.__('Let your active theme control the length and display of post excerpts.', self::$maxi_text_domain).'</p>';
            // $content .= $this->generate_setting($description, 'post_excerpts');


            $content .= '<h4>'.__('Create Google Maps API key', self::$maxi_text_domain).'</h4>';
            $content .= '<p>'.__('To use Google Maps features, Google requires you to provide an API key that the plugin can use to make these requests on your behalf.', self::$maxi_text_domain).'</p>';
            $content .= '<p>'.__('To create an API key, you will need to do the following:', self::$maxi_text_domain).'</p>';
            $content .= '<ol>';
            $content .= '<li>'.__('Create a Google Cloud Platform account, if you don’t already have one.', self::$maxi_text_domain).'</li>';
            $content .= '<li>'.__('Create a new Google Cloud Platform project.', self::$maxi_text_domain).'</li>';
            $content .= '<li>'.__('Enable Google Maps Platform APIs.', self::$maxi_text_domain).'</li>';
            $content .= '<li>'.__('Generate an API key.', self::$maxi_text_domain).'</li>';
            $content .= '</ol>';
            $content .= '<p>'.__('To make this process easy, launch <a href="https://maxiblocks.com/go/google-maps-api-quickstart" target="_blank" rel="noreferrer">'.__('Google Maps API Quickstart', self::$maxi_text_domain).'</a> which will handle the setup of your account and generate the API key that you can insert below.', self::$maxi_text_domain).'</p>';

            $description = '<h4>'.__('Insert Google Maps API Key here', self::$maxi_text_domain).'</h4>';
            $content .= $this->generate_setting($description, 'google_api_key_option');

            $content .= get_submit_button();

            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item-content
            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item

            $content .= $this->generate_item_header('Fonts and files', false);

            // $description = '<h4>'.__('Allow SVG / JSON file uploads (recommended)', self::$maxi_text_domain).'</h4>';
            // $description .= '<p>'.__('Scalable Vector Graphics (SVG) are great for design and SEO. Commonly used as icons and shapes. These small image files scale without any blur. Style Cards rely on SVG for automatic colour changes. JSON files enable the import and export of templates in the library.', self::$maxi_text_domain).'</p>';
            // $content .= $this->generate_setting($description, 'allow_svg_json_uploads');

            $description = '<h4>'.__('Serve Google fonts locally', self::$maxi_text_domain).'</h4>';
            $description .= '<p>'.__(' Local storage: Download, store and serve font files from a WordPress directory on your site. This method blocks Google’s tracking for web visitors. It can improve or degrade performance, depending on hosting quality or resource usage. Please test and monitor carefully. Unused font files are removed periodically to conserve space.', self::$maxi_text_domain).'</p>';
            $description .= '<p>'.__('Google servers: Serve Google font files directly from Google’s servers. It may impact
            privacy (GDPR) if a web visitor’s IP address is revealed to Google.', self::$maxi_text_domain);
            $description .= '<i> '.__('(Default)', self::$maxi_text_domain).'</i></p>';
            $content .= $this->generate_setting($description, 'local_fonts', $this->local_fonts_upload());
            if ($font_uploads_dir_size > 0) {
                $content .= '<p>'.__('Size of the local fonts:', 'maxi-blocks').' '.$font_uploads_dir_size.__(
                    'MB',
                    'maxi-blocks'
                ).'</p>';

                if (!(bool)get_option('local_fonts')) {
                    update_option('local_fonts_uploaded', false);
                    $description = '<h4>'.__('Remove local fonts', 'maxi-blocks').'</h4>';
                    $content .= $this->generate_setting($description, 'remove_local_fonts', $this->remove_local_fonts());
                }
            }

            $content .= get_submit_button();

            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item-content
            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item

            $content .= $this->generate_item_header('Documentation & support', false);

            $content .= '<p>'.__('Read the ', self::$maxi_text_domain);
            $content .= '<a href="https://maxiblocks.com/go/help-center" target="_blank"> '.__('help center documentation', self::$maxi_text_domain).'</a>';
            $content .= __(' for self-service.', self::$maxi_text_domain).'</p>';

            // $content .= '<p>'.__('For support please  ', self::$maxi_text_domain);
            // $content .= '<a href="" target="_blank"> '.__('post your question', self::$maxi_text_domain).'</a>';
            // $content .= __(' in the WordPress.org forum.', self::$maxi_text_domain).'</p>';

            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item-content
            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item

            $content .= $this->generate_item_header('Troubleshooting', false);

            $content .= '<h4>'.__('Site health info report', self::$maxi_text_domain).'</h4>';
            $content .= '<p>'.__('The site health report gives every detail about the configuration of your WordPress website. Helpful when troubleshooting issues. Use the copy-to-clipboard button and include it in a private email with your support assistant. Never share this information publicly.', self::$maxi_text_domain).'</p>';
            $content .= '<p><a href="/wp-admin/site-health.php?tab=debug" target="_blank"> '.__('Go to site health info', self::$maxi_text_domain).'</a></p>';

            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item-content
            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item

            $content .= $this->generate_item_header('Experimental preferences', false);

            $description = '<h4>'.__('Enable settings indicators', self::$maxi_text_domain).'</h4>';
            $description .= '<p>'.__('Enables indicators that shows the modified settings on MaxiBlocks blocks inspector settings', self::$maxi_text_domain).'</p>';
            $content .= $this->generate_setting($description, 'maxi_show_indicators');

            // $description = '<h4>'.__('Accessibility: Enable focus indicator', self::$maxi_text_domain).'</h4>';
            // $description .= '<p>'.__('Show a visual focus indicator for tabbed keyboard navigation in the page editor.', self::$maxi_text_domain).'</p>';
            // $content .= $this->generate_setting($description, 'accessibility_option');

            $content .= get_submit_button();

            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item-content
            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item

            $content .= $this->generate_item_header('Automated fixes', false);

            $content .= '<h4>'.__('Regenerate frontend styles for site\'s content', self::$maxi_text_domain).'</h4>';
            $content .= '<p>'.__('Regenerates Maxi Blocks\' styles for all site\'s posts, pages, custom post styles, site editor... Helpful if you migrated your site, lost your database, or something went wrong with Maxi styles on frontend.', self::$maxi_text_domain).'</p>';
            $content .= '<p><button id="maxi-regenerate-styles-button">Run Function</button></p>';
            $content .= $this->generate_styles_button();

            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item-content
            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item

            // TO DO: uncomment when we have a WP directory link for the rollback function
            // $content .= $this->generate_item_header('Rollback to previous version', false);

            // $content .= '<p>'.__('If you want to restore a previous version of Maxi Blocks, you can do it here. For extra precaution we always recommended running a backup of your website and database before performing a rollback. Alternatively, clone your site to a staging site, then test the rollback function there.', self::$maxi_text_domain).'</p>';

            // if (MAXI_PLUGIN_VERSION) {
            //     $content .= '<p>'.__('Your current version is <strong>', self::$maxi_text_domain).MAXI_PLUGIN_VERSION.'</strong></p>';
            // }
            // $content .= '<h4>'.__('Choose a version to rollback to', self::$maxi_text_domain).'</h4>';
            // $content .= $this->generate_dropdown();
            // $content .= '<input type="hidden" name="maxi_rollback_version" id="maxi-rollback-version" value="current">';
            // $version_to_roll = get_option('maxi_rollback_version');
            // if ($version_to_roll !== 'current') {
            //     $this->rollback_zip($version_to_roll);
            // }
            // $content .= get_submit_button(__('Rollback', self::$maxi_text_domain), 'primary', 'maxi-rollback-submit');

            // $content .= '</div>'; // maxi-dashboard_main-content_accordion-item-content
            // $content .= '</div>'; // maxi-dashboard_main-content_accordion-item

            // $content .= $this->generate_item_header('Advanced', false);

            // $content .= '<h4>'.__('Responsive design breakpoints', self::$maxi_text_domain).'</h4>';
            // $content .= '<p>'.__('Maxi Blocks is coded to create pages that adapt to many display devices. Our responsive grid adapts beautifully to screens from <strong>4K</strong> to <strong>desktop</strong>, all the way down to <strong>laptop</strong>, <strong>tablet</strong> and <strong>mobile</strong>. All the templates found in the Maxi Blocks library already adapt to the default breakpoints set here.', self::$maxi_text_domain).'</p>';
            // $content .= '<p>'.__('Normally you don’t need to change breakpoint values. But, you might have special requirements. Adjust at your own discretion and remember to test, test, test.', self::$maxi_text_domain).'</p>';
            // $content .= $this->generate_breakpoint_inputs();
            // $content .= get_submit_button();
            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item-content
            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item
            $content .= '</div>'; // maxi-dashboard_main-content_accordion
            $content .= '</div>'; // maxi-dashboard_main-content

            return $content;
        }

        public function generate_item_header($title, $checked)
        {
            $label = str_replace(' ', '-', strtolower(str_replace('& ', '', $title)));
            $header = '<div class="maxi-dashboard_main-content_accordion-item">';
            $header .= '<input type="checkbox"';

            if ($checked === true) {
                $header .= ' checked';
            }

            $header .= ' class="maxi-dashboard_main-content_accordion-item-checkbox" id="';
            $header .= $label.'">';
            $header .= '<label for="';
            $header .= $label;
            $header .= '" class="maxi-dashboard_main-content_accordion-item-label">';
            $header .= '<h3>'.__($title, self::$maxi_text_domain).'</h3>';
            $header .= '</label>';
            $header .= '<div class="maxi-dashboard_main-content_accordion-item-content">';

            return $header;
        }

        public function generate_toggle($option, $function = '')
        {
            $toggle = '<div class="maxi-dashboard_main-content_accordion-item-content-switcher">';
            $toggle .= '<div class="maxi-dashboard_main-content_accordion-item-content-switcher__toggle">';
            $toggle .= '<input name="';
            $toggle .= $option;
            $toggle .= '" class="maxi-dashboard_main-content_accordion-item-toggle" ';
            if ((bool)get_option($option)) {
                $toggle .= ' checked="checked" ';
                if (is_callable($function)) {
                    $function();
                }
            }
            $toggle .= ' type="checkbox" id="';
            $toggle .= $option;
            $toggle .= '" value="1">';
            $toggle .= '<span class="maxi-dashboard_main-content_accordion-item-content-switcher__toggle__track"></span>';
            $toggle .= '<span class="maxi-dashboard_main-content_accordion-item-content-switcher__toggle__thumb"></span>';
            $toggle .= '</div>'; // maxi-dashboard_main-content_accordion-item-content-switcher__toggle
            $toggle .= '</div>'; // maxi-dashboard_main-content_accordion-item-content-switcher

            return $toggle;
        }

        public function generate_input($option, $function = '', $type = 'text')
        {
            $input = '<div class="maxi-dashboard_main-content_accordion-item-content-switcher">';
            $input .= '<div class="maxi-dashboard_main-content_accordion-item-content-switcher__input">';
            $input .= '<input name="';
            $input .= $option;
            $input .= '" id="';
            $input .= $option;
            $input .= '" class="maxi-dashboard_main-content_accordion-item-input regular-text" type="';
            $input .= $type;
            $input .= '" value="';
            $input .= get_option($option);
            $input .= '">';
            $input .= '</div>'; // maxi-dashboard_main-content_accordion-item-content-switcher__input
            $input .= '</div>'; // maxi-dashboard_main-content_accordion-item-content-switcher

            return $input;
        }

        public function generate_breakpoint_input($breakpoint, $value)
        {
            $breakpoint_label = 'maxi-breakpoint-'.$breakpoint;

            $input = '<div class="maxi-dashboard_main-content_accordion-item-content-switcher">';
            $input .= '<div class="maxi-dashboard_main-content_accordion-item-content-switcher__input">';
            $input .= '<label class="maxi-dashboard_main-content_accordion-item-content-switcher__label" for="';
            $input .= $breakpoint_label;
            $input .= '">';
            $input .= $breakpoint;
            $input .= '</label>'; // maxi-dashboard_main-content_accordion-item-content-switcher__label
            $input .= '<input name="';
            $input .= $breakpoint_label.'" id="'.$breakpoint_label;
            $input .= '" class="maxi-dashboard_main-content_accordion-item-input regular-number" type="number" min="0" value="';
            $input .= $value;
            $input .= '">';
            $input .= '</div>'; // maxi-dashboard_main-content_accordion-item-content-switcher__input
            $input .= '</div>'; // maxi-dashboard_main-content_accordion-item-content-switcher

            return $input;
        }

        public function generate_breakpoint_inputs()
        {
            require_once(plugin_dir_path(__DIR__) . '../core/class-maxi-local-fonts.php');
            $api = new MaxiBlocks_API();

            $breakpoints_html = '';
            $breakpoints_array = $api->get_maxi_blocks_breakpoints();

            foreach ($breakpoints_array as $breakpoint => $value) {
                $value_num = intval($value);
                $breakpoints_html .= $this->generate_breakpoint_input($breakpoint, $value_num);
            }

            $breakpoints_string = esc_html(json_encode($breakpoints_array));

            $breakpoints_html .= '<input type="hidden" name="maxi_breakpoints" id="maxi-breakpoints" value="';
            $breakpoints_html .= $breakpoints_string;
            $breakpoints_html .= '">';

            return $breakpoints_html;
        }

        // TO DO: uncomment this when we have a list of versions
        // public function generate_dropdown()
        // {
        //     $dropdown = '<div class="maxi-dashboard_main-content_accordion-item-content-switcher">';
        //     $dropdown .= '<div class="maxi-dashboard_main-content_accordion-item-content-switcher__dropdown">';
        //     $dropdown .= '<select name="maxi_versions" id="maxi-versions" class="maxi-dashboard_main-content_accordion-item-input regular-text">';
        //     $dropdown .= '<option value="current">'.__('Select a version', self::$maxi_text_domain).'</option>';

        //     $versions = $this->get_versions_list();
        //     if ($versions) {
        //         foreach ($versions as $version => $url) {
        //             $dropdown .= '<option value="'.$url.'">'.$version.'</option>';
        //         }
        //     } else {
        //         $dropdown .= '<option value="">'.__('Can\'t get a list of versions from WordPress.com', self::$maxi_text_domain).'</option>';
        //     }
        //     $dropdown .= '</select>';
        //     $dropdown .= '</div>'; // maxi-dashboard_main-content_accordion-item-content-switcher__dropdown
        //     $dropdown .= '</div>'; // maxi-dashboard_main-content_accordion-item-content-switcher

        //     return $dropdown;
        // }

        public function generate_setting($description, $option, $function = '', $type = 'text')
        {
            $content = '<div class="maxi-dashboard_main-content_accordion-item-content-setting">';
            $content .= '<div class="maxi-dashboard_main-content_accordion-item-content-description">';
            $content .= $description;
            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item-content-description
            if ($option === 'google_api_key_option') {
                $content .='<div id="maxi-google-test-map"></div>';
                $content .= $this->generate_input($option, $function, $type);
                $content .='<div id="maxi-google-test-map_validation-message"></div>';
            } else {
                $content .= $this->generate_toggle($option, $function);
            }
            $content .= '</div>'; // maxi-dashboard_main-content_accordion-item-content-setting

            return $content;
        }

        public function generate_styles_button()
        {
            echo '
			<script type="text/javascript">
				document.addEventListener("DOMContentLoaded", function() {
					var button = document.getElementById("maxi-regenerate-styles-button");

					if(button) document.getElementById("maxi-regenerate-styles-button").addEventListener("click", function() {
						button.disabled = true; // disable the button

						var loadingMessage = document.createElement("div");
						loadingMessage.id = "loading";
						loadingMessage.innerHTML = "<p>Running... Please wait.</p>";
						button.parentNode.insertBefore(loadingMessage, button.nextSibling); // show loading message

						fetch(ajaxurl, {
							method: "POST",
							headers: {
								"Content-Type": "application/x-www-form-urlencoded"
							},
							body: "action=my_action"
						})
						.then(response => response.text())
						.then(response => {
							document.getElementById("loading").remove(); // remove loading message
							button.disabled = false; // re-enable the button
							alert(response); // alert the response from the server
						});
					});
				});
			</script>
			';
        }


        public function maxi_blocks_allowed_html()
        {
            if (!function_exists('maxi_blocks_allowed_html')) {
                require_once(plugin_dir_path(__FILE__) . '/maxi-allowed-html-tags.php');
            }

            return maxi_blocks_allowed_html();
        }

        public function register_maxi_blocks_settings()
        {
            $args = array(
                'type' => 'boolean',
                'default' => false,
            );

            $args_rollback = array(
                'type' => 'string',
                'default' => 'current',
            );

            register_setting('maxi-blocks-settings-group', 'accessibility_option', $args);
            register_setting('maxi-blocks-settings-group', 'local_fonts', $args);
            register_setting('maxi-blocks-settings-group', 'local_fonts_uploaded', $args);
            register_setting('maxi-blocks-settings-group', 'remove_local_fonts', $args);
            register_setting('maxi-blocks-settings-group', 'allow_svg_json_uploads', $args);
            register_setting('maxi-blocks-settings-group', 'hide_tooltips', $args);
            register_setting('maxi-blocks-settings-group', 'swap_cloud_images', $args);
            register_setting('maxi-blocks-settings-group', 'google_api_key_option');
            register_setting('maxi-blocks-settings-group', 'maxi_breakpoints');
            register_setting('maxi-blocks-settings-group', 'maxi_rollback_version', $args_rollback);
            register_setting('maxi-blocks-settings-group', 'maxi_sc_gutenberg_blocks', $args);
            register_setting('maxi-blocks-settings-group', 'maxi_show_indicators', $args);
        }

        public function get_folder_size($folder)
        {
            $size = 0;

            foreach (glob(rtrim($folder, '/').'/*', GLOB_NOSORT) as $each) {
                $size += is_file($each) ? filesize($each) : $this->get_folder_size($each);
            }

            return $size;
        }

        public function delete_all_files($folder)
        {
            foreach (glob($folder . '/*') as $file) {
                if (is_dir($file)) {
                    $this->delete_all_files($file);
                } else {
                    unlink($file);
                }
            }
            rmdir($folder);
        }

        public function remove_local_fonts()
        {
            $fonts_uploads_dir = wp_upload_dir()['basedir'] . '/maxi/fonts';
            $this->delete_all_files($fonts_uploads_dir);
            update_option('remove_local_fonts', 0);
        }

        public function local_fonts_upload()
        {
            if (!get_option('local_fonts_uploaded')) {
                require_once(plugin_dir_path(__DIR__) . '../core/class-maxi-local-fonts.php');
                new MaxiBlocks_Local_Fonts();
            }
        }

        public function allow_svg_json_uploads()
        {
            function maxi_svg_json_upload($mimes)
            {
                $mimes['json'] = 'text/plain';
                $mimes['svg'] = 'image/svg+xml';
                return $mimes;
            }

            if (get_option('allow_svg_json_uploads')) {
                add_filter('upload_mimes', 'maxi_svg_json_upload');
            }
        }

        public function rollback_zip($url)
        {
            $zip_file = substr($url, strrpos($url, '/') + 1);
            $file_content = file_put_contents($zip_file, fopen($url, 'r'), LOCK_EX);
            if (false === $file_content) {
                die('Couldn\'t write to file.');
            }

            $zip = new ZipArchive;
            $res = $zip->open($zip_file);

            if ($res === true) {
                $zip->extractTo(plugin_dir_path(__DIR__) . '../..');
                $zip->close();
            }

            update_option('maxi_rollback_version', 'current');
        }

        // public function get_versions_list()
        // {

        //     $args = array(
        //         'slug' => '', // change to Maxi when we have it on WordPress plugins directory
        //         'fields' => array(
        //             'downloaded' => true,
        //             'downloadlink' => true
        //         )
        //     );
        //     $response = wp_remote_post(
        //         'http://api.wordpress.org/plugins/info/1.0/',
        //         array(
        //             'body' => array(
        //                 'action' => 'plugin_information',
        //                 'request'=>serialize((object)$args)
        //             )
        //         )
        //     );

        //     if (!is_wp_error($response)) {
        //         $returned_object = unserialize(wp_remote_retrieve_body($response));
        //         $versions = $returned_object->versions;
        //         if (!is_array($versions)) {
        //             return false;
        //         } else {
        //             if ($versions) {
        //                 return $versions;
        //             }
        //         }
        //     } else {
        //         return false;
        //     }

        // }
    }
endif;
