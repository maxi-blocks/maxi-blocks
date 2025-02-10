<?php
/**
 * MaxiBlocks Quick Start Class
 *
 * Handles the quick start functionality that appears after plugin activation
 *
 * @package MaxiBlocks
 * @since 1.0.0
 */

if (!defined('ABSPATH')) {
    exit();
}


// Include the System Status Report class
require_once plugin_dir_path(__FILE__) . '../status-report/maxi-system-status-report.php';

class MaxiBlocks_QuickStart
{
    /**
     * @var string
     */
    private $option_name = 'maxi_blocks_quick_start_completed';

    /**
     * @var array
     */
    private $steps = [];

    private $initialized = false;

    /**
     * Constructor
     */
    public function __construct()
    {
        add_action('admin_menu', [$this, 'add_quick_start_page']);
        add_action('admin_init', [$this, 'maybe_redirect_to_quick_start']);
        add_action('admin_init', [$this, 'maxi_blocks_starter_sites_init']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_quick_start_assets']);
        add_action('wp_ajax_maxi_complete_quick_start', [$this, 'complete_quick_start']);
        add_action('wp_ajax_maxi_save_welcome_settings', [$this, 'save_welcome_settings']);
        add_action('wp_ajax_maxi_save_design_settings', [$this, 'save_design_settings']);
        add_action('wp_ajax_maxi_save_pages_settings', [$this, 'save_pages_settings']);
        add_action('wp_ajax_maxi_save_theme_settings', [$this, 'save_theme_settings']);
        add_action('wp_ajax_maxi_activate_theme', [$this, 'activate_theme']);

        // Store initial theme state when quick start starts
        if (get_transient('maxi_blocks_activation_redirect')) {
            update_option('maxi_quick_start_initial_theme', get_template());
        }
    }

    /**
     * Initialize quick start steps
     */
    private function init_steps()
    {
        if ($this->initialized) {
            return;
        }

        // First check if there are any critical warnings
        $status_report = new MaxiBlocks_System_Status_Report();
        $critical_warnings = $this->get_critical_warnings($status_report);

        $this->steps = [];

        // Only add Status step if there are critical warnings
        if (!empty($critical_warnings)) {
            $this->steps['status'] = [
                'name' => __('Status', 'maxi-blocks'),
                'view' => [$this, 'status_step'],
                'has_warnings' => true,
            ];
        }

        // Add remaining steps
        $this->steps += [
            'identity' => [
                'name' => __('Identity', 'maxi-blocks'),
                'view' => [$this, 'identity_step'],
            ],
            'theme' => [
                'name' => __('Theme', 'maxi-blocks'),
                'view' => [$this, 'theme_step'],
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

        $this->initialized = true;
    }

    /**
     * Get all steps
     */
    private function get_steps()
    {
        if (!$this->initialized) {
            $this->init_steps();
        }
        return $this->steps;
    }

    /**
     * Add admin menu page for quick start
     */
    public function add_quick_start_page()
    {
        add_submenu_page(
            null,
            __('MaxiBlocks Setup', 'maxi-blocks'),
            __('MaxiBlocks Setup', 'maxi-blocks'),
            'manage_options',
            'maxi-blocks-quick-start',
            [$this, 'render_quick_start_page']
        );
    }

    /**
     * Check if quick start should be shown and redirect if necessary
     */
    public function maybe_redirect_to_quick_start()
    {
        // Only redirect once after activation, using the transient set during activation
        if (get_transient('maxi_blocks_activation_redirect')) {
            delete_transient('maxi_blocks_activation_redirect');
            if (current_user_can('manage_options') && !isset($_GET['page']) || $_GET['page'] !== 'maxi-blocks-quick-start') {
                wp_redirect(admin_url('admin.php?page=maxi-blocks-quick-start'));
                exit;
            }
        }
    }

    /**
     * Enqueue necessary assets
     */
    public function enqueue_quick_start_assets($hook)
    {
        if ('admin_page_maxi-blocks-quick-start' !== $hook) {
            return;
        }

        // Then enqueue starter sites assets
        wp_enqueue_script('maxi-blocks-starter-sites');
        wp_enqueue_style('maxi-blocks-starter-sites');

        // Then enqueue media scripts
        wp_enqueue_media();

        // Then enqueue quick start script
        wp_enqueue_script(
            'maxi-blocks-quick-start',
            MAXI_PLUGIN_URL_PATH . 'core/admin/quick-start/js/quick-start.js',
            ['jquery'],
            MAXI_PLUGIN_VERSION,
            true // Move to footer
        );

        // Enqueue quick start styles
        wp_enqueue_style(
            'maxi-blocks-quick-start',
            MAXI_PLUGIN_URL_PATH . 'core/admin/quick-start/css/quick-start.css',
            [],
            MAXI_PLUGIN_VERSION
        );

        // Localize script after enqueueing
        wp_localize_script('maxi-blocks-quick-start', 'maxiQuickStart', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('maxi_quick_start'),
            'strings' => [
                'activeTheme' => __('Active Theme', 'maxi-blocks'),
                'selectIcon' => __('Select Site Icon', 'maxi-blocks'),
                'useAsIcon' => __('Use as site icon', 'maxi-blocks'),
                'changeIcon' => __('Change Site Icon', 'maxi-blocks'),
                'uploadIcon' => __('Upload Site Icon', 'maxi-blocks'),
                'remove' => __('Remove', 'maxi-blocks'),
                'selectLogo' => __('Select Site Logo', 'maxi-blocks'),
                'useAsLogo' => __('Use as site logo', 'maxi-blocks'),
                'changeLogo' => __('Change Logo', 'maxi-blocks'),
                'uploadLogo' => __('Upload Logo', 'maxi-blocks'),
                'required' => __('This field is required', 'maxi-blocks'),
                'invalidUrl' => __('Please enter a valid URL', 'maxi-blocks'),
                'invalidEmail' => __('Please enter a valid email address', 'maxi-blocks'),
                'currentLogo' => __('Current Logo:', 'maxi-blocks'),
                'currentIcon' => __('Current Site Icon:', 'maxi-blocks'),
                'saveSettings' => __('Save settings', 'maxi-blocks'),
                'skipToNext' => __('Skip to next step', 'maxi-blocks'),
                'back' => __('Back', 'maxi-blocks'),
                'continue' => __('Continue', 'maxi-blocks'),
                'errorActivating' => __('Error activating theme', 'maxi-blocks'),
                'errorSaving' => __('An error occurred while saving. Please try again.', 'maxi-blocks'),
                'errorGeneric' => __('An error occurred. Please try again.', 'maxi-blocks'),
            ],
            'isMaxiBlocksGoActive' => get_template() === 'maxiblocks-go',
            'initialThemeWasMaxiBlocksGo' => get_option('maxi_quick_start_initial_theme', '') === 'maxiblocks-go',
            'adminUrl' => admin_url(),
        ]);
    }

    /**
     * Render the quick start page
     */
    public function render_quick_start_page()
    {
        $current_step = isset($_GET['step']) ? sanitize_key($_GET['step']) : $this->get_first_step();
        $this->init_steps(); // Initialize steps when rendering
        ?>
        <div class="maxi-quick-start-wrapper">
            <div class="maxi-quick-start-sidebar">
                <div class="maxi-quick-start-steps">
                    <?php $this->render_steps_nav($current_step); ?>
                </div>
            </div>
            <div class="maxi-quick-start-main">
                <div class="maxi-quick-start-content">
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
        echo '<ul class="maxi-quick-start-steps-nav">';
        $steps_array = array_keys($this->steps);
        $total_steps = count($steps_array);

        // Only skip if theme was active before quick start started
        $initial_theme = get_option('maxi_quick_start_initial_theme', '');
        $skip_theme_step = $initial_theme === 'maxiblocks-go';

        foreach ($this->steps as $key => $step) {
            // Skip rendering the theme step if MaxiBlocks Go was initially active
            if ($skip_theme_step && $key === 'theme') {
                continue;
            }

            $current_index = array_search($current_step, $steps_array);
            $step_index = array_search($key, $steps_array);

            $classes = ['step'];
            if ($key === $current_step) {
                $classes[] = 'active';
            } elseif ($step_index < $current_index) {
                $classes[] = 'completed';
            }

            // Calculate step number (add 1 because array is 0-based)
            $step_number = $step_index + 1;

            // Skip the Status step in the numbering if it exists
            if (isset($this->steps['status']) && $key !== 'status') {
                $step_number--;
            }

            echo sprintf(
                '<li class="%s" data-number="%d" data-step="%s"><span>%s</span></li>',
                esc_attr(implode(' ', $classes)),
                $step_number,
                esc_attr($key),
                esc_html($step['name'])
            );
        }
        echo '</ul>';
    }

    /**
     * Mark quick start as completed via AJAX
     */
    public function complete_quick_start()
    {
        check_ajax_referer('maxi_quick_start', 'nonce');

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
        <h1><?php _e('Welcome to the MaxiBlocks quick start', 'maxi-blocks'); ?></h1>
        <p class="description">
            <?php _e('Welcome! This quick start will guide you through the initial configuration of your WordPress site. Follow the steps to get your site up and running quickly.', 'maxi-blocks'); ?>
        </p>

        <div class="maxi-quick-start-section">
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

        <div class="maxi-quick-start-section">
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

        <div class="maxi-quick-start-section">
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

        <div class="maxi-quick-start-actions">
            <button type="button" class="button button-primary" data-action="save-welcome">
                <?php _e('Save settings', 'maxi-blocks'); ?>
            </button>
            <button type="button" class="button" data-action="continue">
                <?php _e('Skip to next step', 'maxi-blocks'); ?>
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

        <div class="maxi-quick-start-section">
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

        <div class="maxi-quick-start-actions">
            <button type="button" class="button" data-action="back">
                <?php _e('Back', 'maxi-blocks'); ?>
            </button>
            <button type="button" class="button button-primary" data-action="save-pages">
                <?php _e('Save settings', 'maxi-blocks'); ?>
            </button>
            <button type="button" class="button" data-action="continue">
                <?php _e('Skip to next step', 'maxi-blocks'); ?>
            </button>
        </div>
        <?php
    }

    /**
     * Theme step view
     */
    public function theme_step()
    {
        $theme = wp_get_theme('maxiblocks-go');
        $is_installed = $theme->exists();
        $is_active = get_template() === 'maxiblocks-go';
        $current_theme = wp_get_theme(); // Get current theme info
        ?>
        <h1><?php _e('Theme Setup', 'maxi-blocks'); ?></h1>

        <?php if ($is_active): ?>
            <p class="description">
                <?php _e('Great! You\'re using MaxiBlocks Go theme. This ensures the best experience with MaxiBlocks plugin.', 'maxi-blocks'); ?>
            </p>

            <div class="maxi-quick-start-section theme-recommendation">
                <div class="theme-card">
                    <div class="theme-info">
                        <h2>
                            <?php _e('MaxiBlocks Go', 'maxi-blocks'); ?>
                            <span class="theme-status active">
                                <span class="dashicons dashicons-yes-alt"></span>
                                <?php _e('Active', 'maxi-blocks'); ?>
                            </span>
                        </h2>
                        <p><?php _e('You\'re all set! MaxiBlocks Go theme is active and ready to use.', 'maxi-blocks'); ?></p>
                    </div>
                </div>
            </div>
        <?php else: ?>
            <h3 class="description">
                <?php
                printf(
                    /* translators: %s: current theme name */
                    __('Your current theme: %s', 'maxi-blocks'),
                    esc_html($current_theme->get('Name'))
                );
            ?>
            </h3>
            <p class="description">
                <?php _e('For the best experience with MaxiBlocks, we recommend using our official theme.', 'maxi-blocks'); ?>
            </p>

            <div class="maxi-quick-start-section theme-recommendation">
                <div class="theme-card">
                    <div class="theme-info">
                        <h2><?php _e('MaxiBlocks Go', 'maxi-blocks'); ?></h2>
                        <p><?php _e('Create professional websites in record time with the MaxiBlocks Go theme. Our designer-made block patterns, full-page templates, global style cards, and customizable SVG icons make it simple to build unique sites.', 'maxi-blocks'); ?></p>

                        <ul class="theme-features">
                            <li><span class="dashicons dashicons-yes"></span> <?php _e('Full Site Editing Ready', 'maxi-blocks'); ?></li>
                            <li><span class="dashicons dashicons-yes"></span> <?php _e('Block Patterns Library', 'maxi-blocks'); ?></li>
                            <li><span class="dashicons dashicons-yes"></span> <?php _e('Global Style System', 'maxi-blocks'); ?></li>
                            <li><span class="dashicons dashicons-yes"></span> <?php _e('Responsive Design', 'maxi-blocks'); ?></li>
                        </ul>

                        <div class="theme-actions">
                            <?php if ($is_installed): ?>
                                <button type="button" class="button button-primary activate-theme" data-theme="maxiblocks-go">
                                    <?php _e('Activate Theme', 'maxi-blocks'); ?>
                                </button>
                            <?php else: ?>
                                <a href="<?php echo esc_url('https://wordpress.org/themes/maxiblocks-go/'); ?>"
                                   class="button button-primary" target="_blank">
                                    <?php _e('Install Theme', 'maxi-blocks'); ?>
                                </a>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            </div>
        <?php endif; ?>

        <div class="maxi-quick-start-actions">
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
     * Design step view
     */
    public function design_step()
    {
        ?>
        <h1><?php _e('Design Settings', 'maxi-blocks'); ?></h1>
        <p class="description">
            <?php _e('Customize the visual identity of your website', 'maxi-blocks'); ?>
        </p>

        <div class="maxi-quick-start-section">
            <h2><?php _e('Site Logo & Icon', 'maxi-blocks'); ?></h2>
            <p class="description">
                <?php _e('Upload your site logo and icon to establish your brand identity.', 'maxi-blocks'); ?>
            </p>

            <div class="site-logo-wrapper">
                <h3><?php _e('Site Logo', 'maxi-blocks'); ?></h3>
                <p class="description">
                    <?php _e('Your logo will appear in your site header. For best results, use a transparent PNG file.', 'maxi-blocks'); ?>
                </p>

                <?php
                $custom_logo_id = get_theme_mod('custom_logo');
        if ($custom_logo_id) {
            $logo_url = wp_get_attachment_image_url($custom_logo_id, 'full');
            echo '<div class="current-site-logo">';
            echo '<p>' . __('Current Logo:', 'maxi-blocks') . '</p>';
            echo '<img src="' . esc_url($logo_url) . '" alt="Current site logo" />';
            echo '</div>';
        }
        ?>

                <div class="site-logo-controls">
                    <input type="hidden" name="site_logo_id" value="<?php echo esc_attr($custom_logo_id); ?>">
                    <button type="button" class="button" id="upload-site-logo">
                        <?php echo $custom_logo_id ? __('Change Logo', 'maxi-blocks') : __('Upload Logo', 'maxi-blocks'); ?>
                    </button>
                    <?php if ($custom_logo_id): ?>
                        <button type="button" class="button remove-site-logo" id="remove-site-logo">
                            <?php _e('Remove', 'maxi-blocks'); ?>
                        </button>
                    <?php endif; ?>
                </div>

                <p class="site-logo-description">
                    <?php _e('Recommended size: 250 × 100 pixels or larger', 'maxi-blocks'); ?>
                </p>
            </div>

            <?php
            // Show current site icon if set
            $site_icon_id = get_option('site_icon');
        if ($site_icon_id) {
            $icon_url = wp_get_attachment_image_url($site_icon_id, 'full');
            echo '<div class="current-site-icon">';
            echo '<p>' . __('Current Site Icon:', 'maxi-blocks') . '</p>';
            echo '<img src="' . esc_url($icon_url) . '" alt="Current site icon" />';
            echo '</div>';
        }
        ?>

            <div class="site-icon-wrapper">
                <h3><?php _e('Site Icon', 'maxi-blocks'); ?></h3>
                <p class="description">
                    <?php _e('Your site icon appears in browser tabs, bookmarks, and mobile devices. Icons should be square and at least 512 × 512 pixels.', 'maxi-blocks'); ?>
                </p>

                <?php
        ?>
                <div class="site-icon-controls">
                    <input type="hidden" name="site_icon_id" value="<?php echo esc_attr($site_icon_id); ?>">
                    <button type="button" class="button" id="upload-site-icon">
                        <?php echo $site_icon_id ? __('Change Site Icon', 'maxi-blocks') : __('Upload Site Icon', 'maxi-blocks'); ?>
                    </button>
                    <?php if ($site_icon_id): ?>
                        <button type="button" class="button remove-site-icon" id="remove-site-icon">
                            <?php _e('Remove', 'maxi-blocks'); ?>
                        </button>
                    <?php endif; ?>
                </div>

                <p class="site-icon-description">
                    <?php _e('Site icons should be square and at least 512 × 512 pixels.', 'maxi-blocks'); ?>
                </p>
            </div>
        </div>

        <div class="maxi-quick-start-actions">
            <button type="button" class="button" data-action="back">
                <?php _e('Back', 'maxi-blocks'); ?>
            </button>
            <button type="button" class="button button-primary" data-action="save-design">
                <?php _e('Save settings', 'maxi-blocks'); ?>
            </button>
            <button type="button" class="button" data-action="continue">
                <?php _e('Skip to next step', 'maxi-blocks'); ?>
            </button>
        </div>
        <?php
    }

    /**
     * Finish step view
     */
    public function finish_step()
    {
        // Get the status report
        $status_report = new MaxiBlocks_System_Status_Report();
        $warnings = $this->get_warnings_from_status_report($status_report);

        ?>
        <h1><?php _e('Setup Complete!', 'maxi-blocks'); ?></h1>
        <p class="description">
            <?php _e('Congratulations! Your MaxiBlocks site is now configured and ready to use.', 'maxi-blocks'); ?>
        </p>

        <?php if (!empty($warnings)): ?>
            <h2><?php _e('System Warnings', 'maxi-blocks'); ?></h2>
            <p class="description">
                <?php _e('The following settings might need your attention:', 'maxi-blocks'); ?>
            </p>
            <table class="maxi-status-table">
                <tr class="header-row">
                    <td><?php _e('Setting', 'maxi-blocks'); ?></td>
                    <td><?php _e('Recommended', 'maxi-blocks'); ?></td>
                    <td><?php _e('Current', 'maxi-blocks'); ?></td>
                    <td><?php _e('Status', 'maxi-blocks'); ?></td>
                </tr>
                <?php foreach ($warnings as $warning): ?>
                    <tr>
                        <?php
                        // Extract values from the warning array
                        preg_match('/^(.*?)\s*\(Recommended:\s*(.*?),\s*Current:\s*(.*?)\)$/', $warning, $parts);
                    if (count($parts) === 4):
                        ?>
                            <td><?php echo esc_html($parts[1]); ?></td>
                            <td><?php echo esc_html($parts[2]); ?></td>
                            <td><?php echo esc_html($parts[3]); ?></td>
                            <td class="status-warning"><span><?php _e('Warning', 'maxi-blocks'); ?></span></td>
                        <?php endif; ?>
                    </tr>
                <?php endforeach; ?>
            </table>
        <?php endif; ?>

        <div class="maxi-quick-start-actions">
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
        check_ajax_referer('maxi_quick_start', 'nonce');

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
     * Save pages step settings
     */
    public function save_pages_settings()
    {
        check_ajax_referer('maxi_quick_start', 'nonce');

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
            update_option('maxi_blocks_quick_start_pages', $pages);
        }

        wp_send_json_success();
    }

    /**
     * Save theme step settings
     */
    public function save_theme_settings()
    {
        check_ajax_referer('maxi_quick_start', 'nonce');

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

        <div class="maxi-quick-start-section">
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

        <div class="maxi-quick-start-actions">
            <button type="button" class="button" data-action="back">
                <?php _e('Back', 'maxi-blocks'); ?>
            </button>
            <button type="button" class="button" data-action="continue">
                <?php _e('Skip to next step', 'maxi-blocks'); ?>
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

    /**
     * Activate theme
     */
    public function activate_theme()
    {
        check_ajax_referer('maxi_quick_start', 'nonce');

        if (!current_user_can('switch_themes')) {
            wp_send_json_error(__('You do not have permission to switch themes.', 'maxi-blocks'));
        }

        $theme = isset($_POST['theme']) ? sanitize_text_field($_POST['theme']) : '';
        if (empty($theme)) {
            wp_send_json_error(__('No theme specified.', 'maxi-blocks'));
        }

        switch_theme($theme);
        wp_send_json_success();
    }

    /**
     * Save design settings via AJAX
     */
    public function save_design_settings()
    {
        check_ajax_referer('maxi_quick_start', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error(__('You do not have permission to perform this action.', 'maxi-blocks'));
        }

        try {
            // Update site icon
            if (isset($_POST['site_icon_id'])) {
                update_option('site_icon', absint($_POST['site_icon_id']));
            }

            // Update site logo
            if (isset($_POST['site_logo_id'])) {
                set_theme_mod('custom_logo', absint($_POST['site_logo_id']));
            }

            wp_send_json_success();
        } catch (Exception $e) {
            wp_send_json_error(__('An error occurred while saving settings.', 'maxi-blocks'));
        }
    }

    /**
     * Retrieve warnings from the status report
     */
    private function get_warnings_from_status_report($status_report)
    {
        // Get all warnings
        $warnings = [];

        // Get critical warnings first
        $critical_warnings = $this->get_critical_warnings($status_report);
        foreach ($critical_warnings as $warning) {
            $warnings[] = sprintf(
                '%s (Recommended: %s, Current: %s)',
                $warning['setting'],
                $warning['recommended'],
                $warning['actual']
            );
        }

        // Get the full report for other warnings
        $report_content = $status_report->generate_status_report();

        // Use regex to find warning rows
        preg_match_all('/<tr[^>]*>\s*<td[^>]*>([^<]+)<\/td>\s*<td[^>]*>([^<]+)<\/td>\s*<td[^>]*>([^<]+)<\/td>\s*<td class="status-warning">/s', $report_content, $matches, PREG_SET_ORDER);

        foreach ($matches as $match) {
            $setting = trim(strip_tags($match[1]));
            $recommended = trim(strip_tags($match[2]));
            $actual = trim(strip_tags($match[3]));

            // Skip header rows and empty settings
            if ($setting === 'Setting' || empty($setting) || strpos($setting, 'Status') !== false) {
                continue;
            }

            // Skip if it's just a section header
            if (empty($recommended) || $recommended === '-') {
                continue;
            }

            // Skip critical warnings as we already have them
            if (!in_array($setting, ['PHP Version', 'Database Type', 'WordPress AJAX', 'General Table', 'Styles Table', 'Custom Data Table'])) {
                $warnings[] = sprintf(
                    '%s (Recommended: %s, Current: %s)',
                    $setting,
                    $recommended,
                    $actual
                );
            }
        }

        return array_unique($warnings);
    }

    /**
     * Get critical warnings from status report
     */
    private function get_critical_warnings($status_report)
    {
        return $status_report->check_critical_requirements();
    }

    /**
     * Status step view
     */
    public function status_step()
    {
        $status_report = new MaxiBlocks_System_Status_Report();
        $critical_warnings = $this->get_critical_warnings($status_report);
        ?>
        <h1><?php _e('System Status Check', 'maxi-blocks'); ?></h1>

        <?php if (!empty($critical_warnings)): ?>
            <div class="notice notice-error">
                <p>
                    <strong><?php _e('Critical Issues Found', 'maxi-blocks'); ?></strong>
                </p>
                <p>
                    <?php _e('The following system requirements are not met. MaxiBlocks may not function correctly unless these issues are resolved:', 'maxi-blocks'); ?>
                </p>
            </div>

            <table class="maxi-status-table">
                <tr class="header-row">
                    <td><?php _e('Setting', 'maxi-blocks'); ?></td>
                    <td><?php _e('Recommended', 'maxi-blocks'); ?></td>
                    <td><?php _e('Current', 'maxi-blocks'); ?></td>
                    <td><?php _e('Status', 'maxi-blocks'); ?></td>
                </tr>
                <?php foreach ($critical_warnings as $warning): ?>
                    <tr>
                        <td><?php echo esc_html($warning['setting']); ?></td>
                        <td><?php echo esc_html($warning['recommended']); ?></td>
                        <td><?php echo esc_html($warning['actual']); ?></td>
                        <td class="status-warning"><span><?php _e('Warning', 'maxi-blocks'); ?></span></td>
                    </tr>
                <?php endforeach; ?>
            </table>

            <p class="description">
                <?php _e('It is strongly recommended to fix these issues before proceeding. However, you can continue with the setup if you wish to address these later.', 'maxi-blocks'); ?>
            </p>
        <?php else: ?>
            <div class="notice notice-success">
                <p>
                    <?php _e('All critical system requirements are met. You can proceed with the setup.', 'maxi-blocks'); ?>
                </p>
            </div>
        <?php endif; ?>

        <div class="maxi-quick-start-actions">
            <button type="button" class="button button-primary" data-action="continue">
                <?php _e('Continue to Setup', 'maxi-blocks'); ?>
            </button>
        </div>
        <?php
    }

    /**
     * Get the first step based on critical warnings
     */
    private function get_first_step()
    {
        $status_report = new MaxiBlocks_System_Status_Report();
        $critical_warnings = $this->get_critical_warnings($status_report);

        return !empty($critical_warnings) ? 'status' : 'identity';
    }
}
