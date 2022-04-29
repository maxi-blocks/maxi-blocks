<?php
if (!defined('ABSPATH')) {
    exit();
}

define('MAXI_PREFIX', 'maxi_blocks_');
define('MAXI_SLUG', 'maxi-blocks');
define('MAXI_SLUG_DASHBOARD', 'maxi-blocks-dashboard');
define('MAXI_PLUGIN_NAME', 'Maxi Blocks');
define('MAXI_TEXT_DOMAIN', 'maxi-blocks');
define('MAXI_PLUGIN_ICON', 'dashicons-block-default');


    

if (!class_exists('MaxiBlocks_Dashboard')):
    class MaxiBlocks_Dashboard
    {
        
        /**
        * Plugin's dashboard instance.
        *
        * @var MaxiBlocks_Dashboard
        */
        private static $instance;

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
        }

        public function maxi_get_menu_icon_base64()
        {
            $icon_svg_code = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M19.742 10.079c-.131-.187-.328-.312-.557-.352-.246-.043-.507.017-.73.174l-2.485 1.922 1.728-6.786a.89.89 0 0 0-.473-1.057.94.94 0 0 0-1.097.25l-4.839 5.923 1.264-5.205c.121-.368-.046-.796-.4-1.017-.344-.216-.805-.164-1.082.113l-8.404 7.637c-.596-2.82.294-4.884 1.182-6.147 1.463-2.057 3.961-3.378 6.385-3.378.502.006.972-.403.972-.908a.91.91 0 0 0-.902-.908C7.316.314 4.191 1.911 2.341 4.47.601 6.901.178 9.947 1.142 13.07l-.768.699a.87.87 0 0 0-.292.639c-.005.236.079.464.224.626.288.363.931.411 1.272.069l8.536-7.742-1.521 6.272c-.08.4.111.805.505 1.022a.94.94 0 0 0 1.098-.251l4.756-5.83-1.375 5.356c-.126.377.033.805.375 1.017s.783.189 1.06-.046l2.48-1.936c-1.209 2.999-3.943 4.879-7.243 4.879-.872 0-3.878-.201-5.986-2.801-.335-.376-.878-.425-1.281-.104a.95.95 0 0 0-.315.606c-.028.251.047.491.201.664 2.618 3.202 6.33 3.451 7.406 3.451 5.078 0 9.032-3.624 9.6-8.735a.95.95 0 0 0-.131-.845z" fill="#fff"/></svg>';
            $icon_base64 = base64_encode($icon_svg_code);
            $icon_data_uri = 'data:image/svg+xml;base64,' . $icon_base64;

            return $icon_data_uri;
        }

        /**
         * Register menu page and submenus
         */
        public function maxi_register_menu()
        {
            add_menu_page(__(MAXI_PLUGIN_NAME, MAXI_TEXT_DOMAIN), __(MAXI_PLUGIN_NAME, MAXI_TEXT_DOMAIN), 'manage_options', MAXI_SLUG_DASHBOARD, array(
                    $this,
                    'maxi_config_page'
                ), $this->maxi_get_menu_icon_base64(), null);
            add_submenu_page(MAXI_SLUG_DASHBOARD, __(MAXI_PLUGIN_NAME, MAXI_TEXT_DOMAIN), __('Welcome', MAXI_TEXT_DOMAIN), 'manage_options', MAXI_SLUG_DASHBOARD, '', null);
            add_submenu_page(MAXI_SLUG_DASHBOARD, __('Settings', MAXI_TEXT_DOMAIN), __('Settings', MAXI_TEXT_DOMAIN), 'manage_options', 'admin.php?page='.MAXI_SLUG_DASHBOARD.'&tab=settings', '', null);
        }

        // Draw option page
        public function maxi_config_page()
        {
            $settings_tabs = array(
                MAXI_PREFIX.'welcome' => __('Welcome', MAXI_TEXT_DOMAIN),
                MAXI_PREFIX.'settings' => __('Settings', MAXI_TEXT_DOMAIN),
                
            );
        

            if (isset($_GET['tab'])) { // phpcs:ignore
                $current_tab = $tab = sanitize_text_field($_GET['tab']); // phpcs:ignore
            } else {
                $current_tab = $tab =  MAXI_PREFIX.'welcome';
            }

            echo '<div class="maxi-dashboard_wrap">';
            echo '<header class="maxi-dashboard_header"><img class="maxi-dashboard_logo" width="200" src="'.esc_url(plugin_dir_url(__DIR__)) . 'img/maxi-logo-dashboard.svg'.'" alt="'.__('Maxi Blocks Logo', MAXI_TEXT_DOMAIN).'"></header>';
            echo  '<h4 class="maxi-dashboard_nav-tab-wrapper nav-tab-wrapper">';
            
            foreach ($settings_tabs as $tab_page => $tab_name) {
                $active_tab = $current_tab == $tab_page ? 'maxi-dashboard_nav-tab__active nav-tab-active' : '';
                
                echo '<a class="maxi-dashboard_nav-tab nav-tab ' . esc_attr($tab_page) . esc_attr($active_tab) . '" href="?page=' . esc_attr(MAXI_SLUG_DASHBOARD) . '&tab=' . esc_attr($tab_page) . '">' . wp_kses($tab_name, $this->maxi_blocks_allowed_html()) . '</a>';
            }
            echo '</h4> <form action="options.php" method="post" class="maxi-dashboard_form">';
            echo '<div class="maxi-dashboard_main">';

            if (isset($tab)) {
                if ($tab === MAXI_PREFIX.'welcome') {
                    echo wp_kses($this->maxi_blocks_welcome(), maxi_blocks_allowed_html());
                } elseif ($tab === MAXI_PREFIX.'settings') {
                    echo wp_kses($this->maxi_blocks_settings(), maxi_blocks_allowed_html());
                }
            }
            
            echo '</div>'; // maxi-dashboard_main
            echo '</form>'; // maxi-dashboard_form
            echo '</div>';// maxi-dashboard_wrap
        }

        public function maxi_blocks_welcome()
        {
            $current_user = wp_get_current_user();
            $user_name = $current_user->user_firstname;

            $content = '<div class="maxi-dashboard_main-content">';
            $content .= '<h1>'.__('Welcome, ', MAXI_TEXT_DOMAIN).esc_html($user_name).'</h1>';
            $content .= '<h2>'.__('Prototype web pages and tell your story with Maxi Blocks', MAXI_TEXT_DOMAIN).'</h2>';
            
            $content .= '<p>'.__('Thank you for installing Maxi Blocks.', MAXI_TEXT_DOMAIN).'</p>';
            $content .= '<p>'.__('Join us as we create the most fun and flexible page builder for WordPress.', MAXI_TEXT_DOMAIN).'</p>';

            $content .= '<h3>'.__('Template library and Style Cards', MAXI_TEXT_DOMAIN).'</h3>';
            $content .= '<p>'.__('Even the best designers use page templates to save time. The trick is to change styles without wasting hours choosing colours and fonts. You need a shortcut. You need a Style Card.', MAXI_TEXT_DOMAIN).'</p>';
            $content .= '<p>'.__('Style Cards change 30 design elements in sync. It works like this:', MAXI_TEXT_DOMAIN).'</p>';

            $content .= '<ol>';
            $content .= '<li>'.__('Choose your favourite Style Card from 100 shown in the library.', MAXI_TEXT_DOMAIN).'</li>';
            $content .= '<li>'.__('Browse the template library to find a good page or pattern.', MAXI_TEXT_DOMAIN).'</li>';
            $content .= '<li>'.__('Insert and watch how templates instantly match your chosen style.', MAXI_TEXT_DOMAIN).'</li>';
            $content .= '</ol>';

            $content .= '<h3>'.__('Maxi Blocks is free and open source', MAXI_TEXT_DOMAIN).'</h3>';
            $content .= '<p>'.__('Whatever you create with Maxi Blocks is yours to keep. You are welcome to use the free templates on as many sites as you want. Don’t forget to share your pages with the hashtag', MAXI_TEXT_DOMAIN);
            $content .= ' <a href="https://twitter.com/#maxiblocks/" target="_blank">#maxiblocks</a> - '.__('We’re dying to see what you create.', MAXI_TEXT_DOMAIN).'</p>';
            $content .= '<p>'.__('Our next goal is to launch the Maxi Blocks Pro template library subscription. Hundreds of patterns and pages have already been completed. It’s going to be epic. This income will help us grow the team and build out the awesome roadmap.', MAXI_TEXT_DOMAIN);
            $content .= '<a href="" target="_blank"> '.__('Learn more about Maxi Blocks Pro', MAXI_TEXT_DOMAIN).'</a>.</p>';

            $content .= '<h3>'.__('Roadmap', MAXI_TEXT_DOMAIN).'</h3>';
            $content .= '<p>'.__('There’s a grand plan and we need your help. Share your suggestions or vote on what to build next.', MAXI_TEXT_DOMAIN).'</p>';
            $content .= '<a href="" target="_blank">'.__('See what’s planned in the roadmap', MAXI_TEXT_DOMAIN).'</a>';

            $content .= '<h3>'.__('Beta 1.0', MAXI_TEXT_DOMAIN).'</h3>';
            $content .= '<p>'.__('The Maxi Blocks editor improves with your feedback. Because we’re open source, everyone can benefit. For quality assurance, every component is coded with its own automated test. Even so, your setup might be different. It’s recommended to build in a staging environment while we’re still in Beta. And if you find an issue, please let us know via our support channels or GitHub. Every bit of feedback helps.', MAXI_TEXT_DOMAIN).'</p>';
            
            $content .='</div>'; // maxi-dashboard_main-content
            
            $content .= '<div class="maxi-dashboard_main-sidebar">';

            $content .= '<div class="maxi-dashboard_main-sidebar-item">';
            $content .= '<p>'.__('News and stories for creators.', MAXI_TEXT_DOMAIN);
            $content .= ' <a href="" target="_blank">'.__('Read the blog', MAXI_TEXT_DOMAIN).'</a>.</p>';
            $content .='</div>'; // maxi-dashboard_main-sidebar-item
            
            $content .= '<div class="maxi-dashboard_main-sidebar-item">';
            $content .= '<p>'.__('Get a summary of stories you missed.', MAXI_TEXT_DOMAIN);
            $content .= ' <a href="" target="_blank">'.__('Notify me', MAXI_TEXT_DOMAIN).'</a>.</p>';
            $content .='</div>'; // maxi-dashboard_main-sidebar-item

            $content .= '<div class="maxi-dashboard_main-sidebar-item">';
            $content .= '<p>'.__('Your thoughts can inspire others.', MAXI_TEXT_DOMAIN);
            $content .= ' <a href="" target="_blank">'.__('Give a quick review', MAXI_TEXT_DOMAIN).'</a>.</p>';
            $content .='</div>'; // maxi-dashboard_main-sidebar-item

            $content .='</div>'; // maxi-dashboard_main-sidebar
            return $content;
        }

        public function maxi_blocks_settings()
        {
            $content = '<div class="maxi-dashboard_main-content">';
            $content .= '<h2>'.__('Editor preferences', MAXI_TEXT_DOMAIN).'</h2>';

            $content .= '<h3>'.__('Hide interface tooltips', MAXI_TEXT_DOMAIN).'</h3>';
            $content .= '<p>'.__('Show or hide tooltips on mouse-hover.', MAXI_TEXT_DOMAIN).'</p>';

            $content .= '<h3>'.__('Accessibility: Enable focus indicator', MAXI_TEXT_DOMAIN).'</h3>';
            $content .= '<p>'.__('Show a visual focus indicator for tabbed keyboard navigation in the page editor.', MAXI_TEXT_DOMAIN).'</p>';

            $content .= '<h3>'.__('Auto-collapse panels in settings sidebar', MAXI_TEXT_DOMAIN).'</h3>';
            $content .= '<p>'.__('Collapsible panels reduce vertical scrolling for the page editor experience.', MAXI_TEXT_DOMAIN).'</p>';

            return $content;
        }

        
        public function maxi_blocks_allowed_html()
        {
            if (!function_exists('maxi_blocks_allowed_html')) {
                require_once(plugin_dir_path(__FILE__) . '/maxi-allowed-html-tags.php');
            }

            return maxi_blocks_allowed_html();
        }
    }
endif;