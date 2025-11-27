<?php
require_once MAXI_PLUGIN_DIR_PATH . 'core/class-maxi-style-cards.php';

/**
 * MaxiBlocks Core Class
 *
 * @since   1.0.0
 * @package MaxiBlocks
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit();
}

if (!class_exists('MaxiBlocks_Blocks')):
    class MaxiBlocks_Blocks
    {
        /**
         * Plugin's core instance.
         *
         * @var MaxiBlocks_Blocks
         */
        private static $instance;

        /**
         * Array of all the block classes in MaxiBlocks.
         *
         * @var array
         */
        private $blocks_classes = [
            'Group_Maxi_Block',
            'Container_Maxi_Block',
            'Row_Maxi_Block',
            'Column_Maxi_Block',
            'Accordion_Maxi_Block',
            'Pane_Maxi_Block',
            'Button_Maxi_Block',
            'Divider_Maxi_Block',
            'Image_Maxi_Block',
            'SVG_Icon_Maxi_Block',
            'Text_Maxi_Block',
            'Video_Maxi_Block',
            'Number_Counter_Maxi_Block',
            'Search_Maxi_Block',
            'Map_Maxi_Block',
            'Slide_Maxi_Block',
            'Slider_Maxi_Block',
        ];

        /**
         * Registers the plugin.
         */
        public static function register()
        {
            if (null === self::$instance) {
                self::$instance = new MaxiBlocks_Blocks();
            }
        }

        /**
         * Constructor.
         */
        public function __construct()
        {
            $this->include_block_classes(); // Includes all block classes.

            // Always enqueue in admin
            if (is_admin()) {
                add_action('init', [$this, 'enqueue_blocks_assets']);
            } else {
                // For frontend, check for blocks after post is loaded
                add_action('wp', function () {
                    if (self::has_blocks()) {
                        $this->enqueue_blocks_assets();
                    }
                });
            }

            // Enqueue blocks
            add_action('init', [$this, 'register_blocks']);

            // Register MaxiBlocks attachment taxonomy and terms
            add_action('init', [$this, 'maxi_add_image_taxonomy']);
            add_action('init', [$this, 'maxi_add_image_taxonomy_term']);

            // Register MaxiBlocks category
            add_filter('block_categories_all', [$this, 'maxi_block_category']);



            $style_cards = new MaxiBlocks_StyleCards();
            $current_style_cards = $style_cards->get_maxi_blocks_active_style_card();

            if (
                $current_style_cards &&
                array_key_exists(
                    'gutenberg_blocks_status',
                    $current_style_cards,
                ) &&
                $current_style_cards['gutenberg_blocks_status']
            ) {
                add_filter(
                    'render_block',
                    [$this, 'maxi_add_sc_native_blocks'],
                    10,
                    3,
                );
            }
        }

        /**
         * Includes all the block classes.
         */
        private function include_block_classes()
        {
            foreach ($this->blocks_classes as $class) {
                $file_path =
                    MAXI_PLUGIN_DIR_PATH .
                    'core/blocks/class-' .
                    strtolower(str_replace('_', '-', $class)) .
                    '.php';
                if (file_exists($file_path)) {
                    require_once $file_path;
                }
            }
        }

        public function enqueue_blocks_assets()
        {
            $script_asset_path = MAXI_PLUGIN_DIR_PATH . 'build/index.min.asset.php';
            if (!file_exists($script_asset_path)) {
                throw new Error( //phpcs:ignore
                    'You need to run `npm start` or `npm run build` for the "create-block/test-maxi-blocks" block first.',
                );
            }

            $index_js = 'build/index.min.js';
            $script_asset = require $script_asset_path;
            wp_register_script(
                'maxi-blocks-block-editor',
                plugins_url($index_js, dirname(__FILE__)),
                $script_asset['dependencies'],
                MAXI_PLUGIN_VERSION,
                true,
            );

            // Enqueue the script in admin (block editor) - MUST be before wp_set_script_translations
            if (is_admin()) {
                wp_enqueue_script('maxi-blocks-block-editor');
            }

            // Manually inject translations for the bundled script
            // WordPress's wp_set_script_translations() doesn't work with large bundled files,
            // so we inject the translations directly using the same method WordPress uses
            $locale = get_locale();
            $json_file = plugin_dir_path(dirname(__FILE__)) . 'languages/maxi-blocks-' . $locale . '-' . md5('maxi-blocks/build/index.min.js') . '.json';

            if (file_exists($json_file)) {
                $translations_json = file_get_contents($json_file);
                $translations_data = json_decode($translations_json, true);

                if ($translations_data && isset($translations_data['locale_data'])) {
                    // Inject translations inline BEFORE the script loads
                    wp_add_inline_script(
                        'maxi-blocks-block-editor',
                        sprintf(
                            '( function( domain, translations ) {
                                var localeData = translations.locale_data[ domain ] || translations.locale_data.messages;
                                localeData[""].domain = domain;
                                wp.i18n.setLocaleData( localeData, domain );
                            } )( "maxi-blocks", %s );',
                            $translations_json
                        ),
                        'before'
                    );
                }
            }

            // Localize the script with our data
            wp_localize_script('maxi-blocks-block-editor', 'maxiBlocksMain', [
                'local_fonts' => get_option('local_fonts'),
                'bunny_fonts' => get_option('bunny_fonts'),
                'apiRoot' => esc_url_raw(rest_url()),
            ]);

            // Inject MaxiBlocks settings directly to avoid API calls
            if (class_exists('MaxiBlocks_API')) {
                $api = new MaxiBlocks_API();
                $settings = $api->get_maxi_blocks_options();
                wp_localize_script('maxi-blocks-block-editor', 'maxiSettings', $settings);
            }

            // Add license settings for authentication context
            // Only add license settings if we have a dashboard instance already
            if (class_exists('MaxiBlocks_Dashboard') && method_exists('MaxiBlocks_Dashboard', 'get_instance')) {
                $dashboard = MaxiBlocks_Dashboard::get_instance();
                if ($dashboard) {
                    $network_license_info = is_multisite() ? $dashboard->get_network_license_info() : false;
                    wp_localize_script('maxi-blocks-block-editor', 'maxiLicenseSettings', [
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
            }

            // Add JavaScript to handle version updates on save
            wp_add_inline_script(
                'maxi-blocks-block-editor',
                "
                (function() {
                    if (typeof wp === 'undefined' || !wp.data) return;

                    const { select, dispatch } = wp.data;

                    function getCurrentVersion() {
                        if (window.maxiSettings?.maxi_version) {
                            return window.maxiSettings.maxi_version;
                        }
                        return '" . MAXI_PLUGIN_VERSION . "';
                    }

                    function updateBlockVersions() {
                        const currentVersion = getCurrentVersion();
                        if (!currentVersion) return;

                        const clientIds = select('core/block-editor').getClientIdsWithDescendants();

                        clientIds.forEach(clientId => {
                            const block = select('core/block-editor').getBlock(clientId);
                            if (block && block.name && block.name.startsWith('maxi-blocks/')) {
                                const attrs = block.attributes;
                                const needsCurrentUpdate = !attrs['maxi-version-current'] || attrs['maxi-version-current'] !== currentVersion;
                                const needsOriginUpdate = !attrs['maxi-version-origin'];

                                if (needsCurrentUpdate || needsOriginUpdate) {
                                    const newAttrs = {};
                                    if (needsCurrentUpdate) {
                                        newAttrs['maxi-version-current'] = currentVersion;
                                    }
                                    if (needsOriginUpdate) {
                                        newAttrs['maxi-version-origin'] = currentVersion;
                                    }
                                    dispatch('core/block-editor').updateBlockAttributes(clientId, newAttrs);
                                }
                            }
                        });
                    }

                    // Override savePost to update versions BEFORE the save happens
                    function interceptSavePost() {
                        // Get a reference to the editor dispatch object
                        const editorDispatch = dispatch('core/editor');

                        // Only proceed if savePost exists and hasn't been overridden yet
                        if (!editorDispatch.savePost || editorDispatch.savePost._maxiIntercepted) {
                            return;
                        }

                        // Store the original savePost function
                        const originalSavePost = editorDispatch.savePost;

                        // Create our intercepted version
                        editorDispatch.savePost = function(options = {}) {
                            // Check if all MaxiBlocks are fully rendered
                            const maxiBlocksSelect = select('maxiBlocks');
                            const allBlocksReady = maxiBlocksSelect.getAllBlocksFullyRendered();

                            if (!allBlocksReady) {
                                console.warn('%c[MaxiBlocks] Save prevented - blocks still rendering',
                                    'background: #FF5722; color: white; font-weight: bold; padding: 2px 4px;',
                                    JSON.stringify({
                                        allBlocksReady
                                    }, null, 2));

                                // Show user notification
                                dispatch('core/notices').createWarningNotice(
                                    'Please wait for MaxiBlocks to finish rendering before saving.',
                                    { id: 'maxi-blocks-rendering-warning', isDismissible: true }
                                );

                                return Promise.resolve(); // Return resolved promise to prevent save
                            }

                            // Update versions BEFORE calling the original save
                            updateBlockVersions();

                            // Remove any existing warning notices
                            dispatch('core/notices').removeNotice('maxi-blocks-rendering-warning');

                            // Call the original savePost with the same context and arguments
                            return originalSavePost.call(this, options);
                        };

                        // Mark that we've intercepted this function
                        editorDispatch.savePost._maxiIntercepted = true;
                    }

                    // Set up the intercept when the editor is ready
                    wp.domReady(() => {
                        // Use a longer delay to ensure the editor dispatch is fully set up
                        setTimeout(() => {
                            // Try multiple times in case the editor isn't ready yet
                            let attempts = 0;
                            const maxAttempts = 10;

                            function tryIntercept() {
                                attempts++;
                                try {
                                    interceptSavePost();
                                } catch (error) {
                                    console.warn('MaxiBlocks: Failed to intercept savePost, attempt', attempts, error);
                                    if (attempts < maxAttempts) {
                                        setTimeout(tryIntercept, 500);
                                    }
                                }
                            }

                            tryIntercept();
                        }, 200);
                    });
                })();
                "
            );

            $editor_css = 'build/index.min.css';
            wp_register_style(
                'maxi-blocks-block-editor',
                plugins_url($editor_css, dirname(__FILE__)),
                [],
                MAXI_PLUGIN_VERSION,
            );

            register_block_type('maxi-blocks/block-settings', [
                'editor_script' => 'maxi-blocks-block-editor',
                'editor_style' => 'maxi-blocks-block-editor',
            ]);

            $style_css = 'build/style-index.min.css';
            wp_register_style(
                'maxi-blocks-block',
                plugins_url($style_css, dirname(__FILE__)),
                [],
                MAXI_PLUGIN_VERSION,
            );
            wp_enqueue_style('maxi-blocks-block');
        }

        /**
         * Registers the block classes.
         */
        public function register_blocks()
        {
            foreach ($this->blocks_classes as $class) {
                $full_class_name = 'MaxiBlocks_' . $class;
                if (class_exists($full_class_name)) {
                    call_user_func([$full_class_name, 'register']);
                }
            }
        }

        public function maxi_add_image_taxonomy()
        {
            $labels = [
                'name' => __('Maxi Images', 'maxi-blocks'),
                'singular_name' => __('maxi-image-type', 'maxi-blocks'),
                'search_items' => __('Search Maxi Images', 'maxi-blocks'),
                'all_items' => __('All Maxi Images', 'maxi-blocks'),
                'edit_item' => __('Edit Maxi Image', 'maxi-blocks'),
                'update_item' => __('Update Maxi Image', 'maxi-blocks'),
                'add_new_item' => __('Add New Maxi Image', 'maxi-blocks'),
                'new_item_name' => __('New Maxi Image Name', 'maxi-blocks'),
            ];

            $args = [
                'labels' => $labels,
                'hierarchical' => false,
                'query_var' => true,
                'rewrite' => true,
                'show_admin_column' => true,
                'show_in_menu' => false,
                'show_ui' => false,
                'show_in_rest' => true,
                'show_in_nav_menus' => false,
                'show_tagcloud' => false,
                'show_in_quick_edit' => false,
                'meta_box_cb' => false,
            ];

            register_taxonomy('maxi-image-type', 'attachment', $args);
        }

        public function maxi_add_image_taxonomy_term()
        {
            if (
                !term_exists(__('Maxi Image', 'maxi-blocks'), 'maxi-image-type')
            ) {
                wp_insert_term(
                    __('Maxi Image', 'maxi-blocks'),
                    'maxi-image-type',
                    [
                        'description' => __(
                            'Images added by MaxiBlocks plugin',
                            'maxi-blocks',
                        ),
                        'slug' => 'maxi-image',
                    ],
                );
            }
        }

        public function maxi_block_category($categories)
        {
            return array_merge(
                [
                    [
                        'slug' => 'maxi-blocks',
                        'title' => __('MaxiBlocks', 'maxi-blocks'),
                    ],
                ],
                $categories,
            );
        }

        public function maxi_add_sc_native_blocks(
            $block_content,
            $block,
            $instance
        ) {
            if (
                str_contains($block['blockName'] ?? '', 'core/') &&
                isset($block_content) &&
                !empty($block_content)
            ) {
                // Use regular expression to find the first opening tag
                if (preg_match('/<[^>]+>/', $block_content, $matches)) {
                    $opening_tag = $matches[0];

                    // Check if the 'maxi-block--use-sc' class is already present
                    if (!str_contains($opening_tag, 'maxi-block--use-sc')) {
                        // Add the 'maxi-block--use-sc' class to the opening tag
                        $modified_tag = preg_replace(
                            '/class=(["\'])/',
                            'class=$1maxi-block--use-sc ',
                            $opening_tag,
                            1,
                        );

                        // If the class attribute doesn't exist, add it
                        if ($modified_tag === $opening_tag) {
                            $modified_tag = str_replace(
                                '>',
                                ' class="maxi-block--use-sc">',
                                $opening_tag,
                            );
                        }

                        // Replace the opening tag in the block content
                        $block_content = str_replace(
                            $opening_tag,
                            $modified_tag,
                            $block_content,
                        );
                    }
                }
            }

            return $block_content;
        }

        /**
         * Get block template parts for the current page
         *
         * @return array Array of template part objects
         */
        private function get_block_template_parts()
        {
            if (!wp_is_block_theme()) {
                return [];
            }

            $template_parts = [];

            // Get current template type
            $current_template_type = $this->get_current_template_type();

            $archive_templates = [
                'archive',
                'category',
                'tag',
                'author',
                'date',
            ];

            // Add the specific template for current page
            if ($current_template_type) {
                $template = get_block_template(
                    get_stylesheet() . '//' . $current_template_type,
                );
                if ($template && !empty($template->content)) {
                    $template_parts[] = $template;

                    // Parse template content for additional template parts
                    preg_match_all(
                        '/wp:template-part\s+({[^}]+})/',
                        $template->content,
                        $matches,
                    );

                    if (!empty($matches[1])) {
                        foreach ($matches[1] as $json_string) {
                            $template_part_data = json_decode(
                                $json_string,
                                true,
                            );
                            if (
                                $template_part_data &&
                                isset($template_part_data['slug'])
                            ) {
                                $part = get_block_template(
                                    get_stylesheet() .
                                        '//' .
                                        $template_part_data['slug'],
                                    'wp_template_part',
                                );
                                if ($part && !empty($part->content)) {
                                    $template_parts[] = $part;
                                }
                            }
                        }
                    }
                } else {
                    if (in_array($current_template_type, $archive_templates)) {
                        $template = get_block_template(
                            get_stylesheet() . '//archive',
                        );
                        if ($template && !empty($template->content)) {
                            $template_parts[] = $template;
                        }
                    }
                }
            }

            return $template_parts;
        }

        /**
         * Get the current template type based on WordPress template hierarchy
         *
         * @return string|null Template type
         */
        private function get_current_template_type()
        {
            if (get_page_template_slug() && !is_archive()) {
                return get_page_template_slug();
            }
            if (is_front_page() && is_home()) {
                return 'index';
            } elseif (is_front_page()) {
                return 'front-page';
            } elseif (is_home()) {
                return 'home';
            } elseif (is_single()) {
                return 'single';
            } elseif (is_page()) {
                return 'page';
            } elseif (is_archive()) {
                if (is_category()) {
                    // Check for category-specific templates
                    $category = get_queried_object();
                    if ($category) {
                        // Check for category-{slug}.php template
                        $template = 'category-' . $category->slug;
                        if (get_block_template(get_stylesheet() . '//' . $template)) {
                            return $template;
                        }

                        // Check for category-{id}.php template
                        $template = 'category-' . $category->term_id;
                        if (get_block_template(get_stylesheet() . '//' . $template)) {
                            return $template;
                        }
                    }
                    return 'category';
                } elseif (is_tag()) {
                    // Similar check for tag-specific templates
                    $tag = get_queried_object();
                    if ($tag) {
                        // Check for tag-{slug}.php template
                        $template = 'tag-' . $tag->slug;
                        if (get_block_template(get_stylesheet() . '//' . $template)) {
                            return $template;
                        }

                        // Check for tag-{id}.php template
                        $template = 'tag-' . $tag->term_id;
                        if (get_block_template(get_stylesheet() . '//' . $template)) {
                            return $template;
                        }
                    }
                    return 'tag';
                } elseif (is_author()) {
                    // Check for author-specific templates
                    $author = get_queried_object();
                    if ($author) {
                        // Check for author-{nicename}.php template
                        $template = 'author-' . $author->user_nicename;
                        if (get_block_template(get_stylesheet() . '//' . $template)) {
                            return $template;
                        }

                        // Check for author-{id}.php template
                        $template = 'author-' . $author->ID;
                        if (get_block_template(get_stylesheet() . '//' . $template)) {
                            return $template;
                        }
                    }
                    return 'author';
                } elseif (is_date()) {
                    return 'date';
                }
                return 'archive';
            } elseif (is_search()) {
                return 'search';
            } elseif (is_404()) {
                return '404';
            }

            return 'index';
        }

        /**
         * Check if content contains any Maxi blocks within reusable blocks
         *
         * @param string $content The content to check
         * @return boolean True if Maxi blocks found in reusable blocks
         */
        private function has_maxi_in_reusable_blocks($content)
        {
            // Get all reusable block IDs
            preg_match_all(
                '/wp:block\s*{\s*"ref"\s*:\s*(\d+)}/',
                $content,
                $matches,
            );
            $block_ids = $matches[1] ?? [];

            if (empty($block_ids)) {
                return false;
            }

            // Check each reusable block for Maxi blocks
            foreach ($block_ids as $block_id) {
                $block_post = get_post($block_id);
                if (
                    $block_post &&
                    strpos($block_post->post_content, 'wp:maxi-blocks/') !==
                        false
                ) {
                    return true;
                }
            }

            return false;
        }

        /**
         * Check if the current post/page contains Maxi blocks
         *
         * @return boolean
         */
        public static function has_blocks()
        {
            $has_blocks = false;
            $instance = new self();

            // First check template parts if using block theme
            if (wp_is_block_theme()) {
                $template_parts = $instance->get_block_template_parts();
                foreach ($template_parts as $template_part) {
                    if (!empty($template_part->content)) {
                        if (
                            strpos(
                                $template_part->content,
                                'wp:maxi-blocks/',
                            ) !== false ||
                            $instance->has_maxi_in_reusable_blocks(
                                $template_part->content,
                            )
                        ) {
                            $has_blocks = true;
                            break;
                        }
                    }
                }
            }

            // If no blocks found in templates, check main content
            if (!$has_blocks) {
                global $post;
                if ($post && !empty($post->post_content)) {
                    $has_blocks =
                        strpos($post->post_content, 'wp:maxi-blocks/') !==
                        false;
                    if (!$has_blocks) {
                        $has_blocks = $instance->has_maxi_in_reusable_blocks(
                            $post->post_content,
                        );
                    }
                }
            }

            return $has_blocks;
        }


    }
endif;
