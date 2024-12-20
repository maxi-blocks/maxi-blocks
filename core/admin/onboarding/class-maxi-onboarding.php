<?php
/**
 * MaxiBlocks Onboarding Class
 *
 * Handles the setup wizard functionality that appears after plugin activation
 *
 * @package MaxiBlocks
 * @since 1.0.0
 */

if (!defined('ABSPATH')) {
    exit();
}

class MaxiBlocks_Onboarding
{
    /**
     * @var string
     */
    private $option_name = 'maxi_blocks_onboarding_completed';

    /**
     * @var array
     */
    private $steps = [];

    /**
     * Constructor
     */
    public function __construct()
    {
        add_action('admin_menu', [$this, 'add_onboarding_page']);
        add_action('admin_init', [$this, 'maybe_redirect_to_onboarding']);
        add_action('admin_init', [$this, 'maxi_blocks_starter_sites_init']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_onboarding_assets']);
        add_action('wp_ajax_maxi_complete_onboarding', [$this, 'complete_onboarding']);
        add_action('wp_ajax_maxi_save_welcome_settings', [$this, 'save_welcome_settings']);
        add_action('wp_ajax_maxi_save_design_settings', [$this, 'save_design_settings']);
        add_action('wp_ajax_maxi_save_pages_settings', [$this, 'save_pages_settings']);
        add_action('wp_ajax_maxi_save_theme_settings', [$this, 'save_theme_settings']);

        $this->init_steps();
    }

    /**
     * Initialize onboarding steps
     */
    private function init_steps()
    {
        $this->steps = [
            'identity' => [
                'name' => __('Identity', 'maxi-blocks'),
                'view' => [$this, 'identity_step'],
            ],
            'design' => [
                'name' => __('Design', 'maxi-blocks'),
                'view' => [$this, 'design_step'],
            ],
            'starter_site' => [
                'name' => __('Starter Site', 'maxi-blocks'),
                'view' => [$this, 'starter_site_step'],
            ],
            'finish' => [
                'name' => __('Finish', 'maxi-blocks'),
                'view' => [$this, 'finish_step'],
            ],
        ];
    }

    /**
     * Add admin menu page for onboarding
     */
    public function add_onboarding_page()
    {
        add_submenu_page(
            null,
            __('MaxiBlocks Setup', 'maxi-blocks'),
            __('MaxiBlocks Setup', 'maxi-blocks'),
            'manage_options',
            'maxi-blocks-onboarding',
            [$this, 'render_onboarding_page']
        );
    }

    /**
     * Check if onboarding should be shown and redirect if necessary
     */
    public function maybe_redirect_to_onboarding()
    {
        // Only redirect once after activation, using the transient set during activation
        if (get_transient('maxi_blocks_activation_redirect')) {
            delete_transient('maxi_blocks_activation_redirect');
            if (current_user_can('manage_options') && !isset($_GET['page']) || $_GET['page'] !== 'maxi-blocks-onboarding') {
                wp_redirect(admin_url('admin.php?page=maxi-blocks-onboarding'));
                exit;
            }
        }
    }

    /**
     * Enqueue necessary assets
     */
    public function enqueue_onboarding_assets($hook)
    {
        if ('admin_page_maxi-blocks-onboarding' !== $hook) {
            return;
        }

        // Enqueue starter sites assets
        wp_enqueue_script('maxi-blocks-starter-sites');
        wp_enqueue_style('maxi-blocks-starter-sites');

        wp_enqueue_style(
            'maxi-blocks-onboarding',
            MAXI_PLUGIN_URL_PATH . 'core/admin/onboarding/css/onboarding.css',
            [],
            MAXI_PLUGIN_VERSION
        );

        wp_enqueue_script(
            'maxi-blocks-onboarding',
            MAXI_PLUGIN_URL_PATH . 'core/admin/onboarding/js/onboarding.js',
            ['jquery'],
            MAXI_PLUGIN_VERSION,
            true
        );

        wp_localize_script('maxi-blocks-onboarding', 'maxiOnboarding', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('maxi_onboarding'),
        ]);
    }

    /**
     * Render the onboarding page
     */
    public function render_onboarding_page()
    {
        $current_step = isset($_GET['step']) ? sanitize_key($_GET['step']) : 'identity';
        ?>
        <div class="maxi-onboarding-wrapper">
            <div class="maxi-onboarding-sidebar">
                <div class="maxi-onboarding-steps">
                    <?php $this->render_steps_nav($current_step); ?>
                </div>
            </div>
            <div class="maxi-onboarding-main">
                <div class="maxi-onboarding-content">
                    <?php
                    if (isset($this->steps[$current_step]['view'])) {
                        call_user_func($this->steps[$current_step]['view']);
                    }
        ?>
                </div>
            </div>
        </div>
        <?php
    }

    /**
     * Render navigation for steps
     */
    private function render_steps_nav($current_step)
    {
        echo '<ul class="maxi-onboarding-steps-nav">';
        $step_number = 1;
        $steps_array = array_keys($this->steps);
        foreach ($this->steps as $key => $step) {
            $current_index = array_search($current_step, $steps_array);
            $step_index = array_search($key, $steps_array);

            $classes = ['step'];
            if ($key === $current_step) {
                $classes[] = 'active';
            } elseif ($step_index < $current_index) {
                $classes[] = 'completed';
            }

            echo sprintf(
                '<li class="%s" data-number="%d" data-step="%s"><span>%s</span></li>',
                esc_attr(implode(' ', $classes)),
                $step_number,
                esc_attr($key),
                esc_html($step['name'])
            );
            $step_number++;
        }
        echo '</ul>';
    }

    /**
     * Mark onboarding as completed via AJAX
     */
    public function complete_onboarding()
    {
        check_ajax_referer('maxi_onboarding', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error('Unauthorized');
        }

        update_option($this->option_name, true);
        wp_send_json_success();
    }

    /**
     * Identity step view
     */
    public function identity_step()
    {
        ?>
        <h1><?php _e('Welcome to the MaxiBlocks setup wizard', 'maxi-blocks'); ?></h1>
        <p class="description">
            <?php _e('Welcome! This setup wizard will guide you through the initial configuration of your WordPress site. Follow the steps to get your site up and running quickly.', 'maxi-blocks'); ?>
        </p>

        <div class="maxi-onboarding-section">
            <h2><?php _e('Site title and tagline', 'maxi-blocks'); ?></h2>
            <p class="description">
                <?php _e('Enter a title for your site. This will be displayed at the top of your site and in search results.', 'maxi-blocks'); ?>
            </p>
            <input type="text"
                   name="site_title"
                   class="regular-text"
                   placeholder="<?php esc_attr_e('Example: MaxiBlocks template library', 'maxi-blocks'); ?>"
                   value="<?php echo esc_attr(get_option('blogname')); ?>" />

            <p class="description">
                <?php _e('Enter a tagline. This is a short description or slogan for your site.', 'maxi-blocks'); ?>
            </p>
            <input type="text"
                   name="site_tagline"
                   class="regular-text"
                   placeholder="<?php esc_attr_e('Example: Your one-stop destination for all things creative and inspiring', 'maxi-blocks'); ?>"
                   value="<?php echo esc_attr(get_option('blogdescription')); ?>" />
        </div>

        <div class="maxi-onboarding-section">
            <h2><?php _e('Site language and time zone', 'maxi-blocks'); ?></h2>
            <p class="description">
                <?php _e('Choose your site\'s language', 'maxi-blocks'); ?>
            </p>
            <?php
            $languages = get_available_languages();
        wp_dropdown_languages([
            'name' => 'site_language',
            'selected' => get_locale(),
            'languages' => $languages,
        ]);
        ?>

            <p class="description">
                <?php _e('Choose your site\'s time zone', 'maxi-blocks'); ?>
            </p>
            <select name="timezone_string">
                <?php echo wp_timezone_choice(get_option('timezone_string')); ?>
            </select>
        </div>

        <div class="maxi-onboarding-section">
            <h2><?php _e('Permalink settings', 'maxi-blocks'); ?></h2>
            <p class="description">
                <?php _e('Choose a structure for your site\'s URLs (permalinks).', 'maxi-blocks'); ?>
            </p>
            <select name="permalink_structure">
                <?php
                $current_structure = get_option('permalink_structure');
        $structures = array(
            '' => __('Plain', 'maxi-blocks'),
            '/archives/%post_id%' => __('Numeric', 'maxi-blocks'),
            '/%year%/%monthnum%/%day%/%postname%/' => __('Day and name', 'maxi-blocks'),
            '/%year%/%monthnum%/%postname%/' => __('Month and name', 'maxi-blocks'),
            '/%postname%/' => __('Post name', 'maxi-blocks'),
            '/archives/%post_id%' => __('Post ID', 'maxi-blocks')
        );

        foreach ($structures as $value => $label) {
            printf(
                '<option value="%s" %s>%s</option>',
                esc_attr($value),
                selected($current_structure, $value, false),
                esc_html($label)
            );
        }
        ?>
            </select>
        </div>

        <div class="maxi-onboarding-actions">
            <button type="button" class="button button-primary" data-action="save-welcome">
                <?php _e('Save settings', 'maxi-blocks'); ?>
            </button>
            <button type="button" class="button" data-action="continue">
                <?php _e('Continue', 'maxi-blocks'); ?>
            </button>
        </div>
        <?php
    }

    /**
     * Design step view (without style cards)
     */
    public function design_step()
    {
        ?>
        <h1><?php _e('Design your site', 'maxi-blocks'); ?></h1>
        <p class="description">
            <?php _e('Upload your logo and customize the basic design elements of your site.', 'maxi-blocks'); ?>
        </p>

        <div class="maxi-onboarding-section">
            <h2><?php _e('Site Logo', 'maxi-blocks'); ?></h2>
            <p class="description">
                <?php _e('Upload your site logo. This will be displayed in your site header.', 'maxi-blocks'); ?>
            </p>
            <div class="maxi-logo-upload">
                <button type="button" class="button" id="upload-logo">
                    <?php _e('Upload Logo', 'maxi-blocks'); ?>
                </button>
                <div id="logo-preview"></div>
            </div>
        </div>

        <div class="maxi-onboarding-section">
            <h2><?php _e('Site Icon', 'maxi-blocks'); ?></h2>
            <p class="description">
                <?php _e('Upload a site icon (favicon). This appears in browser tabs and bookmarks.', 'maxi-blocks'); ?>
            </p>
            <div class="maxi-icon-upload">
                <button type="button" class="button" id="upload-icon">
                    <?php _e('Upload Icon', 'maxi-blocks'); ?>
                </button>
                <div id="site-icon-preview"></div>
            </div>
        </div>

        <div class="maxi-onboarding-actions">
            <button type="button" class="button" data-action="back">
                <?php _e('Back', 'maxi-blocks'); ?>
            </button>
            <button type="button" class="button button-primary" data-action="save-design">
                <?php _e('Save settings', 'maxi-blocks'); ?>
            </button>
            <button type="button" class="button" data-action="continue">
                <?php _e('Continue', 'maxi-blocks'); ?>
            </button>
        </div>
        <?php
    }

    /**
     * Pages step view
     */
    public function pages_step()
    {
        ?>
        <h1><?php _e('Page selection', 'maxi-blocks'); ?></h1>
        <p class="description">
            <?php _e('Select pages for your website', 'maxi-blocks'); ?>
        </p>

        <div class="maxi-onboarding-section">
            <h2><?php _e('Select the page layout you like', 'maxi-blocks'); ?></h2>
            <p class="description">
                <?php _e('Choose the pages you want to include on your website from the MaxiBlocks library. Select from a variety of pre-designed templates such as Home, About, Contact, Blog, Services, and more.', 'maxi-blocks'); ?>
            </p>

            <h3><?php _e('Select your homepage', 'maxi-blocks'); ?></h3>
            <button type="button" class="button" id="select-page">
                <?php _e('Select page', 'maxi-blocks'); ?>
            </button>

            <h3><?php _e('Add a page', 'maxi-blocks'); ?></h3>
            <button type="button" class="button-add" id="add-page">
                <span class="dashicons dashicons-plus-alt2"></span>
            </button>
        </div>

        <div class="maxi-onboarding-actions">
            <button type="button" class="button" data-action="back">
                <?php _e('Back', 'maxi-blocks'); ?>
            </button>
            <button type="button" class="button button-primary" data-action="save-pages">
                <?php _e('Save settings', 'maxi-blocks'); ?>
            </button>
            <button type="button" class="button" data-action="continue">
                <?php _e('Continue', 'maxi-blocks'); ?>
            </button>
        </div>
        <?php
    }

    /**
     * Theme step view
     */
    public function theme_step()
    {
        ?>
        <h1><?php _e('Theme and navigation design', 'maxi-blocks'); ?></h1>
        <p class="description">
            <?php _e('Select pages for your website', 'maxi-blocks'); ?>
        </p>

        <div class="maxi-onboarding-section">
            <h2><?php _e('Navigation menu design', 'maxi-blocks'); ?></h2>
            <p class="description">
                <?php _e('Choose from the MaxiBlocks library', 'maxi-blocks'); ?>
            </p>

            <button type="button" class="button" id="select-menu">
                <?php _e('Select menu', 'maxi-blocks'); ?>
            </button>
        </div>

        <div class="maxi-onboarding-section">
            <h2><?php _e('Set theme files', 'maxi-blocks'); ?></h2>
            <p class="description">
                <?php _e('Choose from the premade designs', 'maxi-blocks'); ?>
            </p>

            <div class="theme-templates">
                <div class="template-item">
                    <h3><?php _e('Single post', 'maxi-blocks'); ?></h3>
                    <button type="button" class="button"><?php _e('Select design', 'maxi-blocks'); ?></button>
                </div>

                <div class="template-item">
                    <h3><?php _e('Archive (Category, Tag, Date)', 'maxi-blocks'); ?></h3>
                    <button type="button" class="button"><?php _e('Select design', 'maxi-blocks'); ?></button>
                </div>

                <div class="template-item">
                    <h3><?php _e('Author archive', 'maxi-blocks'); ?></h3>
                    <button type="button" class="button"><?php _e('Select design', 'maxi-blocks'); ?></button>
                </div>

                <div class="template-item">
                    <h3><?php _e('Search results', 'maxi-blocks'); ?></h3>
                    <button type="button" class="button"><?php _e('Select design', 'maxi-blocks'); ?></button>
                </div>

                <div class="template-item">
                    <h3><?php _e('404 error page', 'maxi-blocks'); ?></h3>
                    <button type="button" class="button"><?php _e('Select design', 'maxi-blocks'); ?></button>
                </div>
            </div>
        </div>

        <div class="maxi-onboarding-actions">
            <button type="button" class="button" data-action="back">
                <?php _e('Back', 'maxi-blocks'); ?>
            </button>
            <button type="button" class="button button-primary" data-action="save-theme">
                <?php _e('Save settings', 'maxi-blocks'); ?>
            </button>
            <button type="button" class="button maxi-editor-button">
                <?php _e('Export to the Maxi editor', 'maxi-blocks'); ?>
            </button>
        </div>
        <?php
    }

    /**
     * Finish step view
     */
    public function finish_step()
    {
        ?>
        <h1><?php _e('Setup Complete!', 'maxi-blocks'); ?></h1>
        <p class="description">
            <?php _e('Congratulations! Your MaxiBlocks site is now configured and ready to use.', 'maxi-blocks'); ?>
        </p>

        <div class="maxi-onboarding-actions">
            <button type="button" class="button" data-action="back">
                <?php _e('Back', 'maxi-blocks'); ?>
            </button>
            <button type="button" class="button button-primary" data-action="complete">
                <?php _e('Start using MaxiBlocks', 'maxi-blocks'); ?>
            </button>
        </div>
        <?php
    }

    /**
     * Save welcome step settings
     */
    public function save_welcome_settings()
    {
        check_ajax_referer('maxi_onboarding', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error(__('You do not have permission to perform this action.', 'maxi-blocks'));
        }

        // Validate required fields
        if (empty($_POST['site_title'])) {
            wp_send_json_error(__('Site title is required.', 'maxi-blocks'));
        }

        try {
            // Update site title and tagline
            update_option('blogname', sanitize_text_field($_POST['site_title']));
            update_option('blogdescription', sanitize_text_field($_POST['site_tagline']));

            // Update language
            if (!empty($_POST['site_language'])) {
                update_option('WPLANG', sanitize_text_field($_POST['site_language']));
            }

            // Update timezone
            if (!empty($_POST['timezone_string'])) {
                update_option('timezone_string', sanitize_text_field($_POST['timezone_string']));
            }

            // Update permalink structure
            if (isset($_POST['permalink_structure'])) {
                $permalink_structure = sanitize_text_field($_POST['permalink_structure']);

                // Update the permalink structure option
                update_option('permalink_structure', $permalink_structure);

                // Flush rewrite rules
                global $wp_rewrite;
                $wp_rewrite->set_permalink_structure($permalink_structure);
                $wp_rewrite->flush_rules(true);
            }

            wp_send_json_success();
        } catch (Exception $e) {
            wp_send_json_error(__('An error occurred while saving settings.', 'maxi-blocks'));
        }
    }

    /**
     * Save design step settings
     */
    public function save_design_settings()
    {
        check_ajax_referer('maxi_onboarding', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error('Unauthorized');
        }

        // Save site logo
        if (!empty($_POST['site_logo_id'])) {
            update_option('site_logo', absint($_POST['site_logo_id']));
        }

        // Save site icon
        if (!empty($_POST['site_icon_id'])) {
            update_option('site_icon', absint($_POST['site_icon_id']));
        }

        // Save style card
        if (!empty($_POST['style_card'])) {
            update_option('maxi_blocks_style_card', sanitize_text_field($_POST['style_card']));
        }

        wp_send_json_success();
    }

    /**
     * Save pages step settings
     */
    public function save_pages_settings()
    {
        check_ajax_referer('maxi_onboarding', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error('Unauthorized');
        }

        // Save homepage selection
        if (!empty($_POST['homepage_id'])) {
            update_option('page_on_front', absint($_POST['homepage_id']));
            update_option('show_on_front', 'page');
        }

        // Save additional pages
        if (!empty($_POST['pages']) && is_array($_POST['pages'])) {
            $pages = [];
            foreach ($_POST['pages'] as $page) {
                $pages[] = wp_insert_post([
                    'post_title' => sanitize_text_field($page['title']),
                    'post_content' => wp_kses_post($page['content']),
                    'post_status' => 'publish',
                    'post_type' => 'page',
                ]);
            }
            update_option('maxi_blocks_onboarding_pages', $pages);
        }

        wp_send_json_success();
    }

    /**
     * Save theme step settings
     */
    public function save_theme_settings()
    {
        check_ajax_referer('maxi_onboarding', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error('Unauthorized');
        }

        // Save menu design
        if (!empty($_POST['menu_design'])) {
            update_option('maxi_blocks_menu_design', sanitize_text_field($_POST['menu_design']));
        }

        // Save template selections
        $templates = [
            'single_post',
            'archive',
            'author_archive',
            'search_results',
            'error_404'
        ];

        foreach ($templates as $template) {
            if (!empty($_POST[$template])) {
                update_option("maxi_blocks_template_{$template}", sanitize_text_field($_POST[$template]));
            }
        }

        wp_send_json_success();
    }

    /**
     * Starter site step view
     */
    public function starter_site_step()
    {
        ?>
        <h1><?php _e('Choose a starter site', 'maxi-blocks'); ?></h1>
        <p class="description">
            <?php _e('Select a pre-built website design to get started quickly. You can customize everything later.', 'maxi-blocks'); ?>
        </p>

        <div class="maxi-onboarding-section">
            <button type="button" class="button button-primary" id="choose-starter-site">
                <?php _e('Choose starter site', 'maxi-blocks'); ?>
            </button>

            <div id="starter-site-preview" class="starter-site-preview hidden">
                <img src="" alt="Selected starter site preview" />
                <h3 class="selected-site-name"></h3>
                <button type="button" class="button button-link change-starter-site">
                    <?php _e('Change site', 'maxi-blocks'); ?>
                </button>
            </div>

            <div id="maxi-starter-sites-root"></div>
        </div>

        <div class="maxi-onboarding-actions">
            <button type="button" class="button" data-action="back">
                <?php _e('Back', 'maxi-blocks'); ?>
            </button>
            <button type="button" class="button" data-action="continue">
                <?php _e('Continue', 'maxi-blocks'); ?>
            </button>
        </div>
        <?php
    }

    /**
     * Initialize starter sites functionality
     */
    public function maxi_blocks_starter_sites_init()
    {
        $path = MAXI_PLUGIN_URL_PATH . 'core/admin/starter-sites/build';
        // Register the starter sites script
        wp_register_script(
            'maxi-blocks-starter-sites',
            $path . '/js/main.js',
            ['wp-element', 'wp-components', 'wp-api-fetch', 'wp-i18n'],
            MAXI_PLUGIN_VERSION,
            true
        );

        // Register the starter sites style
        wp_register_style(
            'maxi-blocks-starter-sites',
            $path . '/css/main.css',
            [],
            MAXI_PLUGIN_VERSION
        );

        // Check WordPress Importer plugin status
        $wp_importer_status = 'missing';
        if (file_exists(WP_PLUGIN_DIR . '/wordpress-importer/wordpress-importer.php')) {
            $wp_importer_status = is_plugin_active('wordpress-importer/wordpress-importer.php')
                ? 'active'
                : 'installed';
        }

        wp_localize_script('maxi-blocks-starter-sites', 'maxiStarterSites', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('maxi_starter_sites'),
            'apiRoot' => esc_url_raw(rest_url()),
            'apiNonce' => wp_create_nonce('wp_rest'),
            'currentStarterSite' => get_option('maxiblocks_current_starter_site', ''),
            'wpImporterStatus' => $wp_importer_status,
            'proInitialState' => get_option('maxi_pro', ''),
        ]);
    }
}
