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

        /**
         * Register menu page and submenus
         */
        public function maxi_register_menu()
        {
            add_menu_page(__(MAXI_PLUGIN_NAME, MAXI_TEXT_DOMAIN), __(MAXI_PLUGIN_NAME, MAXI_TEXT_DOMAIN), 'manage_options', MAXI_SLUG_DASHBOARD, array(
                    $this,
                    'maxi_config_page'
                ), MAXI_PLUGIN_ICON, null);
            add_submenu_page(MAXI_SLUG_DASHBOARD, __(MAXI_PLUGIN_NAME, MAXI_TEXT_DOMAIN), __('Welcome', MAXI_TEXT_DOMAIN), 'manage_options', MAXI_SLUG_DASHBOARD, '', null);
            add_submenu_page(MAXI_SLUG_DASHBOARD, __('Editor preferences', MAXI_TEXT_DOMAIN), __('Editor preferences', MAXI_TEXT_DOMAIN), 'manage_options', 'admin.php?page='.MAXI_SLUG_DASHBOARD.'&tab=editor-preferences', '', null);
            add_submenu_page(MAXI_SLUG_DASHBOARD, __('Documentation & support', MAXI_TEXT_DOMAIN), __('Documentation & support', MAXI_TEXT_DOMAIN), 'manage_options', 'admin.php?page='.MAXI_SLUG_DASHBOARD.'&tab=documentation-support', '', null);
            add_submenu_page(MAXI_SLUG_DASHBOARD, __('Advanced', MAXI_TEXT_DOMAIN), __('Advanced', MAXI_TEXT_DOMAIN), 'manage_options', 'admin.php?page='.MAXI_SLUG_DASHBOARD.'&tab=advanced', '', null);
        }

        // Draw option page
        public function maxi_config_page()
        {
            $settings_tabs = array(
                MAXI_PREFIX.'welcome' => __('Welcome', MAXI_TEXT_DOMAIN),
                MAXI_PREFIX.'editor_preferences' => __('Editor preferences', MAXI_TEXT_DOMAIN),
                MAXI_PREFIX.'documentation_support' => __('Documentation & support', MAXI_TEXT_DOMAIN),
                MAXI_PREFIX.'advanced' => __('Advanced', MAXI_TEXT_DOMAIN),
            );
        

            if (isset($_GET['tab'])) { // phpcs:ignore
                $current_tab = $tab = sanitize_text_field($_GET['tab']);
            } // phpcs:ignore
            else {
                $current_tab = $tab =  MAXI_PREFIX.'welcome';
            }

            echo '<div class="wrap '.MAXI_SLUG_DASHBOARD.'">';
            echo '<h1><img class="ddp-logo" src="'.esc_url(plugin_dir_url(__FILE__)) . '/include/ddp-logo.svg'.'" alt="'.__('Maxi Blocks Logo', MAXI_TEXT_DOMAIN).'"></h1>';
            echo  '<h2 class="nav-tab-wrapper">';
            
            foreach ($settings_tabs as $tab_page => $tab_name) {
                $active_tab = $current_tab == $tab_page ? 'nav-tab-active' : '';
                
                echo '<a class="nav-tab ' . esc_attr($tab_page) . ' ' . esc_attr($active_tab) . '" href="?page=' . esc_attr(MAXI_SLUG_DASHBOARD) . '&tab=' . esc_attr($tab_page) . '">' . wp_kses($tab_name, $this->maxi_allowed_html()) . '</a>';
            }
            echo '</h2> <form action="options.php" method="post"><div class="main">';

            if (isset($tab)) {
                if ($tab === MAXI_PREFIX.'welcome') {
                    echo wp_kses($this->maxi_blocks_welcome(), maxi_allowed_html());
                } elseif ($tab === MAXI_PREFIX.'editor_preferences') {
                    echo wp_kses($this->maxi_blocks_editor_preferences(), maxi_allowed_html());
                } elseif ($tab === MAXI_PREFIX.'documentation_support') {
                    echo wp_kses($this->maxi_documentation_support(), maxi_allowed_html());
                } elseif ($tab === MAXI_PREFIX.'advanced') {
                    echo wp_kses($this->maxi_advanced(), maxi_allowed_html());
                }
            }
            
            echo '</div></form></div>';
        }

        public function maxi_blocks_welcome()
        {
            $content = 'Add content here';
            return $content;
        }

        public function maxi_blocks_editor_preferences()
        {
            $content = 'Add content here2';
            return $content;
        }

        public function maxi_blocks_documentation_support()
        {
            $content = 'Add content here3';
            return $content;
        }

        public function maxi_blocks_advanced()
        {
            $content = 'Add content here4';
            return $content;
        }

        
        public function maxi_allowed_html()
        {
            if (!function_exists('maxi_allowed_html')) {
                require_once(plugin_dir_path(__FILE__) . '/maxi-allowed-html-tags.php');
            }

            return maxi_allowed_html();
        }
    }
endif;