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
require_once plugin_dir_path(__FILE__) .
    '../status-report/maxi-system-status-report.php';

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
        add_action('admin_init', [$this, 'check_quick_start_step']);
        add_action('admin_enqueue_scripts', [
            $this,
            'enqueue_quick_start_assets',
        ]);
        add_action('wp_ajax_maxi_complete_quick_start', [
            $this,
            'complete_quick_start',
        ]);
        add_action('wp_ajax_maxi_save_welcome_settings', [
            $this,
            'save_welcome_settings',
        ]);
        add_action('wp_ajax_maxi_save_design_settings', [
            $this,
            'save_design_settings',
        ]);
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
                'name' => esc_html__('Status', 'maxi-blocks'),
                'view' => [$this, 'status_step'],
                'has_warnings' => true,
            ];
        }

        // Add remaining steps
        $this->steps += [
            'quick_start' => [
                'name' => esc_html__('Quick start', 'maxi-blocks'),
                'view' => [$this, 'quick_start_step'],
            ],
            'theme' => [
                'name' => esc_html__('Theme', 'maxi-blocks'),
                'view' => [$this, 'theme_step'],
            ],
            'brand_identity' => [
                'name' => esc_html__('Brand identity', 'maxi-blocks'),
                'view' => [$this, 'brand_identity_step'],
            ],
            'license' => [
                'name' => esc_html__('License', 'maxi-blocks'),
                'view' => [$this, 'license_step'],
            ],
            'starter_site' => [
                'name' => esc_html__('Starter site', 'maxi-blocks'),
                'view' => [$this, 'starter_site_step'],
            ],
            'finish' => [
                'name' => esc_html__('Finish', 'maxi-blocks'),
                'view' => [$this, 'finish_step'],
            ],
        ];

        $this->initialized = true;
    }

    /**
     * Add admin menu page for quick start
     */
    public function add_quick_start_page()
    {
        // Fix for PHP 8.2+ deprecated warning in admin-header.php
        // WordPress expects plugins to set a page title that get_admin_page_title() can retrieve
        global $title;

        $page_title = esc_html__('MaxiBlocks Setup', 'maxi-blocks');
        $menu_title = esc_html__('MaxiBlocks Setup', 'maxi-blocks');

        add_submenu_page(
            '', // Empty string instead of null to avoid PHP warnings
            $page_title,
            $menu_title,
            'manage_options',
            'maxi-blocks-quick-start',
            [$this, 'render_quick_start_page'],
        );

        // Set title explicitly to avoid PHP 8.2+ warning about passing null to strip_tags
        if (isset($_GET['page']) && 'maxi-blocks-quick-start' === $_GET['page']) {
            $title = $page_title;
        }
    }

    /**
     * Check if quick start should be shown and redirect if necessary
     */
    public function maybe_redirect_to_quick_start()
    {
        // Only redirect once after activation, using the transient set during activation
        if (get_transient('maxi_blocks_activation_redirect')) {
            delete_transient('maxi_blocks_activation_redirect');

            // Safely check if the 'page' parameter is set and equals our target
            $current_page = isset($_GET['page']) ? sanitize_key($_GET['page']) : '';
            if (current_user_can('manage_options') && $current_page !== 'maxi-blocks-quick-start') {
                wp_redirect(
                    admin_url('admin.php?page=maxi-blocks-quick-start'),
                );
                exit();
            }
        }
    }

    /**
     * Check if we need to redirect to a specific quick start step
     * This runs before headers are sent, during admin_init
     */
    public function check_quick_start_step()
    {
        // Only run on our page
        $page = isset($_GET['page']) ? sanitize_key($_GET['page']) : '';
        if ($page !== 'maxi-blocks-quick-start') {
            return;
        }

        // Skip if step is already specified
        if (isset($_GET['step'])) {
            return;
        }

        // Initialize steps to check warnings
        $this->init_steps();

        // Check for critical warnings
        $status_report = new MaxiBlocks_System_Status_Report();
        $critical_warnings = $this->get_critical_warnings($status_report);

        // If no warnings, redirect to quick_start step
        if (empty($critical_warnings)) {
            // Use JavaScript based redirect if headers might have been sent already
            if (headers_sent()) {
                add_action('admin_print_footer_scripts', function () {
                    echo '<script>window.location.href = "' .
                         esc_url(admin_url('admin.php?page=maxi-blocks-quick-start&step=quick_start')) .
                         '";</script>';
                });
            } else {
                wp_redirect(admin_url('admin.php?page=maxi-blocks-quick-start&step=quick_start'));
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
            true, // Move to footer
        );

        // Enqueue quick start styles
        wp_enqueue_style(
            'maxi-blocks-quick-start',
            MAXI_PLUGIN_URL_PATH . 'core/admin/quick-start/css/quick-start.css',
            [],
            MAXI_PLUGIN_VERSION,
        );

        // Localize script after enqueueing
        wp_localize_script('maxi-blocks-quick-start', 'maxiQuickStart', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('maxi_quick_start'),
            'strings' => [
                'activeTheme' => esc_html__('Active Theme', 'maxi-blocks'),
                'selectIcon' => esc_html__('Select Site Icon', 'maxi-blocks'),
                'useAsIcon' => esc_html__('Use as site icon', 'maxi-blocks'),
                'changeIcon' => esc_html__('Change Site Icon', 'maxi-blocks'),
                'uploadIcon' => esc_html__('Upload Site Icon', 'maxi-blocks'),
                'remove' => esc_html__('Remove', 'maxi-blocks'),
                'selectLogo' => esc_html__('Select Site Logo', 'maxi-blocks'),
                'useAsLogo' => esc_html__('Use as site logo', 'maxi-blocks'),
                'changeLogo' => esc_html__('Change Logo', 'maxi-blocks'),
                'uploadLogo' => esc_html__('Upload Logo', 'maxi-blocks'),
                'required' => esc_html__('This field is required', 'maxi-blocks'),
                'invalidUrl' => esc_html__('Please enter a valid URL', 'maxi-blocks'),
                'invalidEmail' => esc_html__(
                    'Please enter a valid email address',
                    'maxi-blocks',
                ),
                'currentLogo' => esc_html__('Current Logo:', 'maxi-blocks'),
                'currentIcon' => esc_html__('Current Site Icon:', 'maxi-blocks'),
                'saveSettings' => esc_html__('Save settings', 'maxi-blocks'),
                'skipToNext' => esc_html__('Skip next', 'maxi-blocks'),
                'back' => esc_html__('Back', 'maxi-blocks'),
                'continue' => esc_html__('Continue', 'maxi-blocks'),
                'errorActivating' => esc_html__(
                    'Error activating theme',
                    'maxi-blocks',
                ),
                'errorSaving' => esc_html__(
                    'An error occurred while saving. Please try again.',
                    'maxi-blocks',
                ),
                'errorGeneric' => esc_html__(
                    'An error occurred. Please try again.',
                    'maxi-blocks',
                ),
            ],
            'isMaxiBlocksGoActive' => get_template() === 'maxiblocks-go',
            'initialThemeWasMaxiBlocksGo' =>
                get_option('maxi_quick_start_initial_theme', '') ===
                'maxiblocks-go',
            'adminUrl' => admin_url(),
        ]);

        // Add license settings localization for the license step
        $dashboard = new MaxiBlocks_Dashboard();
        $network_license_info = is_multisite() ? $dashboard->get_network_license_info() : false;
        wp_localize_script('maxi-blocks-quick-start', 'maxiLicenseSettings', [
            'middlewareUrl' => defined('MAXI_BLOCKS_AUTH_MIDDLEWARE_URL') ? MAXI_BLOCKS_AUTH_MIDDLEWARE_URL : '',
            'middlewareKey' => defined('MAXI_BLOCKS_AUTH_MIDDLEWARE_KEY') ? MAXI_BLOCKS_AUTH_MIDDLEWARE_KEY : '',
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('maxi_license_validation'),
            'currentDomain' => parse_url(home_url(), PHP_URL_HOST),
            'pluginVersion' => MAXI_PLUGIN_VERSION,
            'isMultisite' => is_multisite(),
            'hasNetworkLicense' => is_multisite() ? $dashboard->has_network_license() : false,
            'networkLicenseName' => $network_license_info ? $network_license_info['user_name'] : '',
            'isNetworkAdmin' => false,
            'networkAdminUrl' => network_admin_url('admin.php?page=maxi-blocks-dashboard'),
        ]);
    }

    /**
     * Render the quick start page
     */
    public function render_quick_start_page()
    {
        // Initialize steps to ensure we have a valid list of steps
        $this->init_steps();

        // Get step and validate it's in our allowed steps list
        $requested_step = isset($_GET['step']) ? sanitize_key($_GET['step']) : '';
        $current_step = array_key_exists($requested_step, $this->steps)
            ? $requested_step
            : $this->get_first_step();

        ?>
		<div id="dashboard_system_report">
			<div class="maxi-dashboard_header">
				<img class="maxi-dashboard_logo" width="200"
					src="<?php echo esc_url(MAXI_PLUGIN_URL_PATH . 'img/maxi-logo-dashboard-white.svg'); ?>"
					alt="<?php echo esc_attr('MaxiBlocks Logo'); ?>">
				<div class="maxi-dashboard_header-actions">
					<a href="https://maxiblocks.com/pricing/" class="maxi-dashboard_get-cloud-link" target="_blank">
						<?php echo esc_html__('Get Cloud', 'maxi-blocks'); ?>
					</a>
					<div class="maxi-dashboard_header-icons">
						<a href="https://maxiblocks.com/go/docs" class="maxi-dashboard_header-icon" target="_blank">
							<img src="<?php echo esc_url(MAXI_PLUGIN_URL_PATH .
           'img/maxi_help_documents_icon.svg'); ?>"
								alt="<?php echo esc_attr('MaxiBlocks documentation'); ?>" width="24" height="24">
						</a>
						<a href="https://maxiblocks.com/contact/" class="maxi-dashboard_header-icon" target="_blank">
							<img src="<?php echo esc_url(MAXI_PLUGIN_URL_PATH . 'img/maxi_support_icon.svg'); ?>"
								alt="<?php echo esc_attr('MaxiBlocks contact'); ?>" width="24" height="24">
						</a>
					</div>
				</div>
			</div>

			<div class="maxi-dashboard_title-section">
				<h1 class="maxi-dashboard_title"><?php esc_html_e('Quick start', 'maxi-blocks'); ?></h1>
				<p class="maxi-dashboard_description"><?php esc_html_e('This guide will help you set up your WordPress site in just a few steps.', 'maxi-blocks'); ?></p>
			</div>

			<div class="maxi-quick-start-wrapper">
				<div class="maxi-quick-start-wrapper_inside">
					<div class="maxi-quick-start-sidebar">
						<div class="maxi-quick-start-steps">
							<?php $this->render_steps_nav($current_step); ?>
						</div>
					</div>
					<div class="maxi-quick-start-main">
						<div class="maxi-quick-start-content">
							<?php if (isset($this->steps[$current_step]['view'])) {
							    call_user_func($this->steps[$current_step]['view']);
							} ?>
						</div>
					</div>
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
                esc_html($step['name']),
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
     * Quick start step view
     */
    public function quick_start_step()
    {
        ?>
		<h1><?php esc_html_e('Welcome to the MaxiBlocks quick start', 'maxi-blocks'); ?></h1>
		<p class="description">
			<?php esc_html_e(
			    'We\'ll help you configure your WordPress site in just a few simple steps. Follow along to set your site\'s title, brand, and starter site, then you\'ll be ready to add your own content.',
			    'maxi-blocks',
			); ?>
		</p>

		<div class="maxi-quick-start-section">
			<h2><?php esc_html_e('Site title and tagline', 'maxi-blocks'); ?></h2>
			<p class="description">
				<?php esc_html_e(
				    'Your title appears at the top of your site and in search results.',
				    'maxi-blocks',
				); ?>
			</p>
			<input type="text"
				   name="site_title"
				   class="regular-text"
				   placeholder="<?php esc_attr_e(
				       'Example: MaxiBlocks cloud library',
				       'maxi-blocks',
				   ); ?>"
				   value="<?php echo esc_attr(get_option('blogname')); ?>" />

			<p class="description">
				<?php esc_html_e(
				    'Enter a tagline. A tagline is a short description or slogan that clarifies what your site is about.',
				    'maxi-blocks',
				); ?>
			</p>
			<input type="text"
				   name="site_tagline"
				   class="regular-text"
				   placeholder="<?php esc_attr_e(
				       'Example: Your one-stop destination for all things creative and inspiring',
				       'maxi-blocks',
				   ); ?>"
				   value="<?php echo esc_attr(get_option('blogdescription')); ?>" />
		</div>

		<div class="maxi-quick-start-section">
			<h2><?php esc_html_e('Site language and time zone', 'maxi-blocks'); ?></h2>
			<p class="description">
				<?php esc_html_e(
				    'Choose your site\'s main language and nearest city time zone. This ensures dates and times display correctly for your readers and any scheduled content.',
				    'maxi-blocks',
				); ?>
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
				<?php esc_html_e('Nearest city', 'maxi-blocks'); ?>
			</p>
			<select name="timezone_string">
				<?php echo wp_timezone_choice(get_option('timezone_string')); ?>
			</select>
		</div>

		<div class="maxi-quick-start-section">
			<h2><?php esc_html_e('Permalink settings', 'maxi-blocks'); ?></h2>
			<p class="description">
				<?php esc_html_e(
				    'Pick how you want your site\'s URLs to look. The "Post name" option is a popular choice for clarity and SEO.',
				    'maxi-blocks',
				); ?>
			</p>
			<select name="permalink_structure" id="permalink_structure">
				<?php
				$current_structure = get_option('permalink_structure');
        // Set default to Post name if no structure is set
        if (empty($current_structure)) {
            $current_structure = '/%postname%/';
        }

        $structures = [
            '/%postname%/' => esc_html__('Post name (default)', 'maxi-blocks'),
            '' => esc_html__('Plain', 'maxi-blocks'),
            '/archives/%post_id%' => esc_html__('Numeric', 'maxi-blocks'),
            '/%year%/%monthnum%/%day%/%postname%/' => esc_html__(
                'Day and name',
                'maxi-blocks',
            ),
            '/%year%/%monthnum%/%postname%/' => esc_html__('Month and name', 'maxi-blocks'),
            '/archives/%post_id%' => esc_html__('Post ID', 'maxi-blocks'),
        ];

        foreach ($structures as $value => $label) {
            printf(
                '<option value="%s" %s>%s</option>',
                esc_attr($value),
                selected($current_structure, $value, false),
                esc_html($label),
            );
        }
        ?>
			</select>

			<div class="permalink-structure-preview">
				<p class="description"><?php esc_html_e('Example URL:', 'maxi-blocks'); ?></p>
				<code class="preview-url"></code>
			</div>

			<style>
				.permalink-structure-preview {
					margin-top: 15px;
					padding: 12px;
					background: var(--maxi-grey-light);
					border-radius: 4px;
				}
				.permalink-structure-preview .description {
					margin: 0 0 5px 0;
					color: var(--maxi-grey-dark);
				}
				.preview-url {
					display: block;
					padding: 8px;
					background: var(--maxi-white);
					border: 1px solid var(--maxi-grey-light);
					border-radius: 2px;
					color: var(--maxi-primary-color);
					word-break: break-all;
				}
			</style>

			<script>
				jQuery(document).ready(function($) {
					var siteUrl = <?php echo wp_json_encode(home_url()); ?>;
					var previewUrls = {
						'/%postname%/': siteUrl + '/sample-post/',
						'': siteUrl + '/?p=123',
						'/archives/%post_id%': siteUrl + '/archives/123',
						'/%year%/%monthnum%/%day%/%postname%/': siteUrl + '/2024/02/11/sample-post/',
						'/%year%/%monthnum%/%postname%/': siteUrl + '/2024/02/sample-post/',
						'/archives/%post_id%': siteUrl + '/archives/123'
					};

					function updatePreview() {
						var selected = $('select[name="permalink_structure"]').val();
						$('.preview-url').text(previewUrls[selected] || siteUrl);
					}

					$('select[name="permalink_structure"]').on('change', updatePreview);
					updatePreview(); // Show initial preview
				});
			</script>
		</div>

		<div class="maxi-quick-start-actions">
			<button type="button" class="button button-primary" data-action="save-welcome">
				<?php esc_html_e('Save settings', 'maxi-blocks'); ?>
			</button>
			<button type="button" class="button" data-action="continue">
				<?php esc_html_e('Skip next', 'maxi-blocks'); ?>
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
        $current_theme = wp_get_theme();
        // Get current theme info
        ?>
		<h1><?php esc_html_e('Theme setup', 'maxi-blocks'); ?></h1>

		<?php if ($is_active): ?>
			<p class="description">
				<?php esc_html_e(
				    'MaxiBlocks Go theme activated! Enjoy the best site building and customisation experience integrated with MaxiBlocks Builder.',
				    'maxi-blocks',
				); ?>
			</p>

			<div class="maxi-quick-start-section theme-recommendation">
				<div class="theme-card">
					<div class="theme-info">
						<h2>
							<?php esc_html_e('MaxiBlocks Go theme', 'maxi-blocks'); ?>
							<span class="theme-status active">
								<span class="dashicons dashicons-yes-alt"></span>
								<?php esc_html_e('Active', 'maxi-blocks'); ?>
							</span>
						</h2>
						<p><?php esc_html_e(
						    'You\'re all set! Click Continue to customise your design and layout.',
						    'maxi-blocks',
						); ?></p>
					</div>
				</div>
			</div>
		<?php else: ?>
			<h3 class="description">
				<?php printf(
				    /* translators: %s: Current theme name */
				    esc_html__('Your current theme: %s', 'maxi-blocks'),
				    esc_html($current_theme->get('Name'))
				); ?>
			</h3>
			<p class="description">
				<?php esc_html_e(
				    'For the best experience with MaxiBlocks, we recommend using our official theme.',
				    'maxi-blocks',
				); ?>
			</p>

			<div class="maxi-quick-start-section theme-recommendation">
				<div class="theme-card">
					<div class="theme-info">
						<h2><?php esc_html_e('MaxiBlocks Go', 'maxi-blocks'); ?></h2>
						<p><?php esc_html_e(
						    'Create professional websites in record time with the MaxiBlocks Go theme. Our designer-made block patterns, full-page templates, global style cards, and customizable SVG icons make it simple to build unique sites.',
						    'maxi-blocks',
						); ?></p>

						<ul class="theme-features">
							<li><span class="dashicons dashicons-yes"></span> <?php esc_html_e(
							    'Full site editing ready',
							    'maxi-blocks',
							); ?></li>
							<li><span class="dashicons dashicons-yes"></span> <?php esc_html_e(
							    'Block patterns library',
							    'maxi-blocks',
							); ?></li>
							<li><span class="dashicons dashicons-yes"></span> <?php esc_html_e(
							    'Global style system',
							    'maxi-blocks',
							); ?></li>
							<li><span class="dashicons dashicons-yes"></span> <?php esc_html_e(
							    'Responsive design',
							    'maxi-blocks',
							); ?></li>
						</ul>

						<div class="theme-actions">
							<?php if ($is_installed): ?>
								<button type="button" class="button button-primary activate-theme" data-theme="maxiblocks-go">
									<?php esc_html_e('Activate Theme', 'maxi-blocks'); ?>
								</button>
							<?php else: ?>
								<a href="<?php echo esc_url('https://wordpress.org/themes/maxiblocks-go/'); ?>"
								   class="button button-primary" target="_blank">
									<?php esc_html_e('Install theme', 'maxi-blocks'); ?>
								</a>
							<?php endif; ?>
						</div>
					</div>
				</div>
			</div>
		<?php endif; ?>

		<div class="maxi-quick-start-actions">
			<button type="button" class="button" data-action="back">
				<?php esc_html_e('Back', 'maxi-blocks'); ?>
			</button>
			<button type="button" class="button" data-action="continue">
				<?php esc_html_e('Continue', 'maxi-blocks'); ?>
			</button>
		</div>
		<?php
    }

    /**
     * Brand identity step view
     */
    public function brand_identity_step()
    {
        ?>
		<h1><?php esc_html_e('Brand identity', 'maxi-blocks'); ?></h1>
		<p class="description">
			<?php esc_html_e(
			    'Add your brand identity by uploading a site logo and icon (favicon). This helps visitors instantly recognize your site.',
			    'maxi-blocks',
			); ?>
		</p>

		<div class="maxi-quick-start-section">
			<div class="site-logo-wrapper">
				<div class="site-logo-info">
					<h3><?php esc_html_e('Site logo', 'maxi-blocks'); ?></h3>
					<p class="description">
						<?php esc_html_e(
						    'Appears in your site header. For best results, use a transparent PNG that\'s at least 250 × 100 px.',
						    'maxi-blocks',
						); ?>
					</p>
				</div>

				<?php
    $custom_logo_id = get_theme_mod('custom_logo');
        if ($custom_logo_id) {
            $logo_url = wp_get_attachment_image_url($custom_logo_id, 'full');
            echo '<div class="current-site-logo">';
            echo '<p>' . esc_html__('Current logo:', 'maxi-blocks') . '</p>';
            echo '<img src="' . esc_url($logo_url) . '" alt="' . esc_attr__('Current site logo', 'maxi-blocks') . '" />';
            echo '</div>';
        }
        ?>

				<div class="site-logo-controls">
					<input type="hidden" name="site_logo_id" value="<?php echo esc_attr(
					    $custom_logo_id,
					); ?>">
					<button type="button" class="button" id="upload-site-logo">
						<?php echo $custom_logo_id
					     ? esc_html__('Change Logo', 'maxi-blocks')
					     : esc_html__('Upload Logo', 'maxi-blocks'); ?>
					</button>
					<?php if ($custom_logo_id): ?>
						<button type="button" class="button remove-site-logo" id="remove-site-logo">
							<?php esc_html_e('Remove', 'maxi-blocks'); ?>
						</button>
					<?php endif; ?>
				</div>
			</div>

			<div class="site-icon-wrapper">
				<div class="site-icon-info">
					<div class="site-icon-info-text">
						<h3><?php esc_html_e('Site icon', 'maxi-blocks'); ?></h3>
						<p class="description">
							<?php esc_html_e(
							    'Used in browser tabs, bookmarks, and mobile devices. Upload a square PNG or JPG (at least 512 × 512 px). WordPress will then generate all required favicon sizes.',
							    'maxi-blocks',
							); ?>
						</p>
					</div>
				</div>

				<?php
    $site_icon_id = get_option('site_icon');
        if ($site_icon_id) {
            $icon_url = wp_get_attachment_image_url($site_icon_id, 'full');
            echo '<div class="current-site-icon">';
            echo '<p>' . esc_html__('Current icon:', 'maxi-blocks') . '</p>';
            echo '<img src="' . esc_url($icon_url) . '" alt="' . esc_attr__('Current site icon', 'maxi-blocks') . '" />';
            echo '</div>';
        }
        ?>

				<div class="site-icon-controls">
					<input type="hidden" name="site_icon_id" value="<?php echo esc_attr(
					    $site_icon_id,
					); ?>">
					<button type="button" class="button" id="upload-site-icon">
						<?php echo $site_icon_id
					     ? esc_html__('Change Site Icon', 'maxi-blocks')
					     : esc_html__('Upload site icon', 'maxi-blocks'); ?>
					</button>
					<?php if ($site_icon_id): ?>
						<button type="button" class="button remove-site-icon" id="remove-site-icon">
							<?php esc_html_e('Remove', 'maxi-blocks'); ?>
						</button>
					<?php endif; ?>
				</div>
			</div>
		</div>

		<div class="maxi-quick-start-actions">
			<button type="button" class="button" data-action="back">
				<?php esc_html_e('Back', 'maxi-blocks'); ?>
			</button>
			<button type="button" class="button button-primary" data-action="save-design">
				<?php esc_html_e('Save settings', 'maxi-blocks'); ?>
			</button>
			<button type="button" class="button" data-action="continue">
				<?php esc_html_e('Skip next', 'maxi-blocks'); ?>
			</button>
		</div>
		<?php
    }

    /**
     * License step view
     */
    public function license_step()
    {
        // Get license status using the same logic as dashboard
        $current_license_status = 'Not activated';
        $current_user_name = '';
        $is_active = false;
        $is_network_license = false;

        // Check for network license first (multisite)
        if (is_multisite()) {
            $dashboard = new MaxiBlocks_Dashboard();
            if ($dashboard->has_network_license()) {
                $network_license_info = $dashboard->get_network_license_info();
                if ($network_license_info) {
                    $current_license_status = 'Active ✓ (Network)';
                    $current_user_name = isset($network_license_info['user_name']) ? ($network_license_info['user_name'] === 'Maxiblocks' ? 'MaxiBlocks' : $network_license_info['user_name']) : 'Network Cloud User';
                    $is_active = true;
                    $is_network_license = true;
                }
            }
        }

        // If no network license, check site-level license
        if (!$is_active) {
            $current_license_data = get_option('maxi_pro', '');
            if (!empty($current_license_data)) {
                $license_array = json_decode($current_license_data, true);
                if (is_array($license_array)) {
                    // Check for purchase code auth (domain-wide)
                    foreach ($license_array as $key => $license) {
                        if (strpos($key, 'code_') === 0 && isset($license['status']) && $license['status'] === 'yes') {
                            $current_license_status = 'Active ✓';
                            $current_user_name = isset($license['name']) ? ($license['name'] === 'Maxiblocks' ? 'MaxiBlocks' : $license['name']) : 'Cloud User';
                            $is_active = true;
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
                                    $current_user_name = isset($license_array[$email]['name']) ? ($license_array[$email]['name'] === 'Maxiblocks' ? 'MaxiBlocks' : $license_array[$email]['name']) : $email;
                                    $is_active = true;
                                }
                            }
                        }
                    }
                }
            }
        }
        ?>

		<h1><?php esc_html_e('Cloud access', 'maxi-blocks'); ?></h1>
		<?php if ($is_active): ?>
			<p class="description">
				<?php esc_html_e('Your Cloud access is active and ready to use. You can continue to the next step.', 'maxi-blocks'); ?>
			</p>
		<?php else: ?>
			<p class="description">
				<?php esc_html_e('Unlock premium items with your Cloud license. This step is optional - you can always activate your license later.', 'maxi-blocks'); ?>
			</p>
		<?php endif; ?>

		<div class="maxi-quick-start-section">
			<?php if ($is_active): ?>
				<!-- Show active status -->
				<div class="maxi-license-status-display">
					<h4><?php esc_html_e('Status:', 'maxi-blocks'); ?> <span id="current-license-status" class="maxi-license-active"><?php echo esc_html($current_license_status); ?></span></h4>
					<h4><?php esc_html_e('Licensed to:', 'maxi-blocks'); ?> <span id="current-license-user"><?php echo esc_html($current_user_name); ?></span></h4>
					<?php if ($is_network_license): ?>
						<p class="maxi-license-network-info">
							<?php esc_html_e('This is a network-wide license activated by your network administrator. To manage network licenses, visit the', 'maxi-blocks'); ?>
							<a href="<?php echo esc_url(network_admin_url('admin.php?page=maxi-blocks-dashboard')); ?>" target="_blank">
								<?php esc_html_e('Network License page', 'maxi-blocks'); ?>
							</a>.
						</p>
					<?php endif; ?>
				</div>

				<!-- Show deactivate button (only for site-level licenses) -->
				<?php if (!$is_network_license): ?>
					<div class="maxi-license-actions">
						<button type="button" id="maxi-license-logout" class="button"><?php esc_html_e('Deactivate Cloud', 'maxi-blocks'); ?></button>
					</div>
				<?php endif; ?>
			<?php else: ?>
				<!-- Show current status for not activated -->
				<div class="maxi-license-status-display">
					<h4><?php esc_html_e('Current status:', 'maxi-blocks'); ?> <span id="current-license-status" class="maxi-license-inactive"><?php echo esc_html($current_license_status); ?></span></h4>
				</div>

				<!-- Show authentication input form -->
				<div class="maxi-license-auth-form">
					<div class="maxi-license-input-group">
						<input type="text" id="maxi-license-input" class="maxi-dashboard_main-content_accordion-item-input regular-text" placeholder="<?php esc_attr_e('Cloud user email / purchase code / license key', 'maxi-blocks'); ?>" />
						<p class="maxi-license-help-text"><?php printf(__('Find your code or key in your account, inbox or %s', 'maxi-blocks'), '<a href="https://my.maxiblocks.com" target="_blank" rel="noopener noreferrer">my.maxiblocks.com</a>'); ?></p>
						<div id="maxi-license-validation-message" class="maxi-license-message" style="display: none;"></div>
					</div>

					<div class="maxi-license-actions">
						<button type="button" id="maxi-validate-license" class="button button-primary"><?php esc_html_e('Activate Cloud', 'maxi-blocks'); ?></button>
					</div>

				</div>
			<?php endif; ?>
		</div>

		<div class="maxi-quick-start-actions">
			<button type="button" class="button" data-action="back">
				<?php esc_html_e('Back', 'maxi-blocks'); ?>
			</button>
			<button type="button" class="button" data-action="continue">
				<?php esc_html_e('Continue', 'maxi-blocks'); ?>
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
		<h1><?php esc_html_e('Setup complete!', 'maxi-blocks'); ?></h1>
		<p class="description">
			<?php esc_html_e(
			    'Congratulations! Your MaxiBlocks site is now configured and ready to use.',
			    'maxi-blocks',
			); ?>
		</p>

		<?php if (!empty($warnings)): ?>
			<h2><?php esc_html_e('System warnings', 'maxi-blocks'); ?></h2>
			<p class="description">
				<?php esc_html_e(
				    'Some settings below may need attention for optimal performance. Review the recommended values and update your server or WordPress configuration if necessary. If you have questions, check our documentation or contact support. Enjoy building with MaxiBlocks!',
				    'maxi-blocks',
				); ?>
			</p>
			<table class="maxi-status-table">
				<tr class="header-row">
					<td><?php esc_html_e('Setting', 'maxi-blocks'); ?></td>
					<td><?php esc_html_e('Recommended', 'maxi-blocks'); ?></td>
					<td><?php esc_html_e('Current', 'maxi-blocks'); ?></td>
					<td><?php esc_html_e('Status', 'maxi-blocks'); ?></td>
				</tr>
				<?php foreach ($warnings as $warning): ?>
					<tr>
						<?php
				  // Extract values from the warning array
				  preg_match(
				      '/^(.*?)\s*\(Recommended:\s*(.*?),\s*Current:\s*(.*?)\)$/',
				      $warning,
				      $parts,
				  );
				    if (count($parts) === 4): ?>
							<td><?php echo esc_html($parts[1]); ?></td>
							<td><?php echo esc_html($parts[2]); ?></td>
							<td><?php echo esc_html($parts[3]); ?></td>
							<td class="status-warning"><span><?php esc_html_e(
							    'Warning',
							    'maxi-blocks',
							); ?></span></td>
						<?php endif;
				    ?>
					</tr>
				<?php endforeach; ?>
			</table>
		<?php endif; ?>

		<div class="maxi-quick-start-actions">
			<button type="button" class="button" data-action="back">
				<?php esc_html_e('Back', 'maxi-blocks'); ?>
			</button>
			<button type="button" class="button button-primary" data-action="complete">
				<?php esc_html_e('Start using MaxiBlocks', 'maxi-blocks'); ?>
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
            wp_send_json_error(
                esc_html__(
                    'You do not have permission to perform this action.',
                    'maxi-blocks',
                ),
            );
        }

        // Validate required fields
        if (empty($_POST['site_title'])) {
            wp_send_json_error(esc_html__('Site title is required.', 'maxi-blocks'));
        }

        try {
            // Update site title and tagline
            update_option(
                'blogname',
                sanitize_text_field(wp_unslash($_POST['site_title'])),
            );

            // Only update tagline if it's set
            if (isset($_POST['site_tagline'])) {
                update_option(
                    'blogdescription',
                    sanitize_text_field(wp_unslash($_POST['site_tagline'])),
                );
            }

            // Update language
            if (!empty($_POST['site_language'])) {
                update_option(
                    'WPLANG',
                    sanitize_text_field(wp_unslash($_POST['site_language'])),
                );
            }

            // Update timezone
            if (!empty($_POST['timezone_string'])) {
                update_option(
                    'timezone_string',
                    sanitize_text_field(wp_unslash($_POST['timezone_string'])),
                );
            }

            // Update permalink structure
            if (isset($_POST['permalink_structure'])) {
                $permalink_structure = sanitize_text_field(
                    wp_unslash($_POST['permalink_structure']),
                );

                // Update the permalink structure option
                update_option('permalink_structure', $permalink_structure);

                // Flush rewrite rules
                global $wp_rewrite;
                $wp_rewrite->set_permalink_structure($permalink_structure);
                $wp_rewrite->flush_rules(true);
            }

            wp_send_json_success();
        } catch (Exception $e) {
            wp_send_json_error(
                esc_html__('An error occurred while saving settings.', 'maxi-blocks'),
            );
        }
    }

    /**
     * Starter site step view
     */
    public function starter_site_step()
    {
        ?>
		<h1><?php esc_html_e('Choose a starter site', 'maxi-blocks'); ?></h1>
		<p class="description">
			<?php esc_html_e(
			    'Select a pre-built website design to get started quickly. You can customize everything later.',
			    'maxi-blocks',
			); ?>
		</p>
		<div class="starter-site-benefits-wrapper">
			<h3 class="benefits-title"><?php esc_html_e(
			    'Why choose a starter site?',
			    'maxi-blocks',
			); ?></h3>
			<ul class="benefits-list">
				<li><?php esc_html_e(
				    '✅ Saves time – No need to build your site from the ground up.',
				    'maxi-blocks',
				); ?></li>
				<li><?php esc_html_e(
				    '✅ Customisable – Easily adjust text, images, and colours to match your brand.',
				    'maxi-blocks',
				); ?></li>
				<li><?php esc_html_e(
				    '✅ Optimised for speed, responsiveness, and user experience.',
				    'maxi-blocks',
				); ?></li>
			</ul>
			<p class="benefits-note">
				<?php esc_html_e(
				    'Not sure which one to pick? No worries! You can change or customise it later. If you\'d rather start with a blank canvas, you can skip this step.',
				    'maxi-blocks',
				); ?>
			</p>
			<button type="button" class="button button-primary maxi-choose-starter-button" id="choose-starter-site">
				<?php esc_html_e('Choose starter site', 'maxi-blocks'); ?>
			</button>
		</div>

		<div class="maxi-quick-start-section">
			<div id="starter-site-preview" class="starter-site-preview hidden">
				<img src="" alt="<?php esc_attr_e('Selected starter site preview', 'maxi-blocks'); ?>" />
				<h3 class="selected-site-name"></h3>
				<button type="button" class="button button-link change-starter-site">
					<?php esc_html_e('Change site', 'maxi-blocks'); ?>
				</button>
			</div>

			<div id="maxi-starter-sites-root"></div>
		</div>

		<div class="maxi-quick-start-actions">
			<button type="button" class="button" data-action="back">
				<?php esc_html_e('Back', 'maxi-blocks'); ?>
			</button>
			<button type="button" class="button" data-action="continue">
				<?php esc_html_e('Skip next', 'maxi-blocks'); ?>
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
            true,
        );

        // Register the starter sites style
        wp_register_style(
            'maxi-blocks-starter-sites',
            $path . '/css/main.css',
            [],
            MAXI_PLUGIN_VERSION,
        );

        // Check WordPress Importer plugin status
        $wp_importer_status = 'missing';
        if (
            file_exists(
                WP_PLUGIN_DIR . '/wordpress-importer/wordpress-importer.php',
            )
        ) {
            $wp_importer_status = is_plugin_active(
                'wordpress-importer/wordpress-importer.php',
            )
                ? 'active'
                : 'installed';
        }

        wp_localize_script('maxi-blocks-starter-sites', 'maxiStarterSites', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('maxi_starter_sites'),
            'apiRoot' => esc_url_raw(rest_url()),
            'apiNonce' => wp_create_nonce('wp_rest'),
            'currentStarterSite' => get_option(
                'maxiblocks_current_starter_site',
                '',
            ),
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
            wp_send_json_error(
                esc_html__(
                    'You do not have permission to switch themes.',
                    'maxi-blocks',
                ),
            );
        }

        $theme = isset($_POST['theme'])
            ? sanitize_text_field(wp_unslash($_POST['theme']))
            : '';
        if (empty($theme)) {
            wp_send_json_error(esc_html__('No theme specified.', 'maxi-blocks'));
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
            wp_send_json_error(
                esc_html__(
                    'You do not have permission to perform this action.',
                    'maxi-blocks',
                ),
            );
        }

        try {
            // Update site icon
            if (isset($_POST['site_icon_id'])) {
                update_option('site_icon', absint(wp_unslash($_POST['site_icon_id'])));
            }

            // Update site logo
            if (isset($_POST['site_logo_id'])) {
                set_theme_mod('custom_logo', absint(wp_unslash($_POST['site_logo_id'])));
            }

            wp_send_json_success();
        } catch (Exception $e) {
            wp_send_json_error(
                esc_html__('An error occurred while saving settings.', 'maxi-blocks'),
            );
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
                $warning['actual'],
            );
        }

        // Get the full report for other warnings
        $report_content = $status_report->generate_status_report();

        // Use regex to find warning rows
        preg_match_all(
            '/<tr[^>]*>\s*<td[^>]*>([^<]+)<\/td>\s*<td[^>]*>([^<]+)<\/td>\s*<td[^>]*>([^<]+)<\/td>\s*<td class="status-warning">/s',
            $report_content,
            $matches,
            PREG_SET_ORDER,
        );

        foreach ($matches as $match) {
            $setting = isset($match[1]) ? trim(wp_strip_all_tags($match[1])) : '';
            $recommended = isset($match[2]) ? trim(wp_strip_all_tags($match[2])) : '';
            $actual = isset($match[3]) ? trim(wp_strip_all_tags($match[3])) : '';

            // Skip header rows and empty settings
            if (
                $setting === 'Setting' ||
                empty($setting) ||
                strpos($setting, 'Status') !== false
            ) {
                continue;
            }

            // Skip if it's just a section header
            if (empty($recommended) || $recommended === '-') {
                continue;
            }

            // Skip critical warnings as we already have them
            if (
                !in_array($setting, [
                    'PHP Version',
                    'Database Type',
                    'WordPress AJAX',
                    'General Table',
                    'Styles Table',
                    'Custom Data Table',
                ])
            ) {
                $warnings[] = sprintf(
                    '%s (Recommended: %s, Current: %s)',
                    $setting,
                    $recommended,
                    $actual,
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
		<div id="toplevel_page_maxi-blocks-dashboard">
			<h1><?php esc_html_e('System status check', 'maxi-blocks'); ?></h1>

			<?php if (!empty($critical_warnings)): ?>
				<div class="notice notice-error">
					<p>
						<strong><?php esc_html_e('Critical issues found', 'maxi-blocks'); ?></strong>
					</p>
					<p>
						<?php esc_html_e(
						    'The following system requirements are not met. MaxiBlocks may not function correctly unless these issues are resolved.',
						    'maxi-blocks',
						); ?>
					</p>
				</div>

				<table class="maxi-status-table">
					<tr class="header-row">
						<td><?php esc_html_e('Setting', 'maxi-blocks'); ?></td>
						<td><?php esc_html_e('Recommended', 'maxi-blocks'); ?></td>
						<td><?php esc_html_e('Current', 'maxi-blocks'); ?></td>
						<td><?php esc_html_e('Status', 'maxi-blocks'); ?></td>
					</tr>
					<?php foreach ($critical_warnings as $warning): ?>
						<tr>
							<td><?php echo esc_html($warning['setting']); ?></td>
							<td><?php echo esc_html($warning['recommended']); ?></td>
							<td><?php echo esc_html($warning['actual']); ?></td>
							<td class="status-warning"><span><?php esc_html_e(
							    'Warning',
							    'maxi-blocks',
							); ?></span></td>
						</tr>
					<?php endforeach; ?>
				</table>

				<p class="description">
					<?php esc_html_e(
					    'It is strongly recommended to fix these issues before proceeding. However, you can continue with the setup if you wish to address these later.',
					    'maxi-blocks',
					); ?>
				</p>
			<?php else: ?>
				<div class="notice notice-success">
					<p>
						<?php esc_html_e(
						    'All critical system requirements are met. You can proceed with the setup.',
						    'maxi-blocks',
						); ?>
					</p>
				</div>
			<?php endif; ?>

			<div class="maxi-quick-start-actions">
				<button type="button" class="button button-primary" data-action="continue">
					<?php esc_html_e('Continue to Setup', 'maxi-blocks'); ?>
				</button>
			</div>
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

        return !empty($critical_warnings) ? 'status' : 'quick_start';
    }
}
