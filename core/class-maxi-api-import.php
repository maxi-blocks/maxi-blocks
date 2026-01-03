<?php
/**
 * MaxiBlocks Import API Handler
 *
 * Handles starter site imports including pages, templates, patterns, and media.
 *
 * @package MaxiBlocks
 */

if (!defined('ABSPATH')) {
    exit();
}

if (!class_exists('MaxiBlocks_API_Import')):
    class MaxiBlocks_API_Import
    {
        /**
         * API namespace
         *
         * @var string
         */
        private $namespace;

        /**
         * Constructor
         *
         * @param string $namespace The REST API namespace
         */
        public function __construct($namespace)
        {
            $this->namespace = $namespace;
        }

        /**
         * Register import-related REST API routes
         */
        public function register_routes()
        {
            register_rest_route($this->namespace, '/import-starter-site', [
                'methods' => 'POST',
                'callback' => [$this, 'maxi_import_starter_site'],
                'permission_callback' => function () {
                    return is_user_logged_in() &&
                        current_user_can('edit_posts');
                },
            ]);
        }

        /**
         * Import a starter site
         *
         * @param WP_REST_Request $request The request object
         * @return WP_REST_Response The response
         */
        public function maxi_import_starter_site($request)
        {
            $import_data = json_decode($request->get_body(), true);
            $results = [];

            // Helper function to fetch remote content
            $fetch_remote_content = function ($url) {
                $response = wp_remote_get($url);
                if (is_wp_error($response)) {
                    return false;
                }
                return wp_remote_retrieve_body($response);
            };

            // Process templates
            if (!empty($import_data['templates'])) {
                $results['templates'] = [];

                foreach ($import_data['templates'] as $template) {
                    // Fetch template content from URL
                    $template_content = $fetch_remote_content(
                        $template['content'],
                    );
                    if (!$template_content) {
                        $results['templates'][] = [
                            'name' => $template['name'],
                            'success' => false,
                            /* translators: %s: URL of the template content */
                            'message' => sprintf(__('Failed to fetch template content from %s', 'maxi-blocks'), $template['content'])
                        ];
                        continue;
                    }

                    // Parse the fetched content
                    $template_data = json_decode($template_content, true);
                    if (!$template_data) {
                        $results['templates'][] = [
                            'name' => $template['name'],
                            'success' => false,
                            'message' => __(
                                'Invalid template JSON content',
                                'maxi-blocks',
                            ),
                        ];
                        continue;
                    }

                    // Import the template
                    $import_result = $this->maxi_import_template_parts([
                        $template_data,
                    ]);
                    $results['templates'][] = [
                        'name' => $template['name'],
                        'success' => true,
                        'data' => $import_result,
                    ];
                }
            }

            // Process pages
            if (!empty($import_data['pages'])) {
                $results['pages'] = [];

                foreach ($import_data['pages'] as $page) {
                    // Fetch page content from URL
                    $page_content = $fetch_remote_content($page['content']);
                    if (!$page_content) {
                        $results['pages'][] = [
                            'name' => $page['name'],
                            'success' => false,
                            /* translators: %s: URL of the page content */
                            'message' => sprintf(__('Failed to fetch page content from %s', 'maxi-blocks'), $page['content'])
                        ];
                        continue;
                    }

                    // Parse the fetched content
                    $page_data = json_decode($page_content, true);
                    if (!$page_data) {
                        $results['pages'][] = [
                            'name' => $page['name'],
                            'success' => false,
                            'message' => __(
                                'Invalid page JSON content',
                                'maxi-blocks',
                            ),
                        ];
                        continue;
                    }

                    // Import the page
                    $import_result = $this->maxi_import_pages([$page_data]);
                    $results['pages'][] = [
                        'name' => $page['name'],
                        'success' => true,
                        'data' => $import_result,
                    ];
                }
            }

            // Process patterns
            if (!empty($import_data['patterns'])) {
                $results['patterns'] = [];

                foreach ($import_data['patterns'] as $pattern) {
                    // Fetch pattern content from URL
                    $pattern_content = $fetch_remote_content(
                        $pattern['content'],
                    );
                    if (!$pattern_content) {
                        $results['patterns'][] = [
                            'name' => $pattern['name'],
                            'success' => false,
                            /* translators: %s: URL of the pattern content */
                            'message' => sprintf(__('Failed to fetch pattern content from %s', 'maxi-blocks'), $pattern['content'])
                        ];
                        continue;
                    }

                    // Parse the fetched content
                    $pattern_data = json_decode($pattern_content, true);
                    if (!$pattern_data) {
                        $results['patterns'][] = [
                            'name' => $pattern['name'],
                            'success' => false,
                            'message' => __(
                                'Invalid pattern JSON content',
                                'maxi-blocks',
                            ),
                        ];
                        continue;
                    }

                    // Import the pattern
                    $import_result = $this->maxi_import_patterns([
                        $pattern_data,
                    ]);
                    $results['patterns'][] = [
                        'name' => $pattern['name'],
                        'success' => true,
                        'data' => $import_result,
                    ];
                }
            }

            // Process Style Card
            if (!empty($import_data['sc'])) {
                $sc_content = $fetch_remote_content($import_data['sc']);
                if ($sc_content) {
                    MaxiBlocks_StyleCards::maxi_import_sc($sc_content);
                }
            }

            // Process XML content
            if (!empty($import_data['contentXML'])) {
                $xml_content = $fetch_remote_content(
                    $import_data['contentXML'],
                );
                if ($xml_content) {
                    $this->maxi_import_xml($xml_content);
                }
            }

            // Save current starter site name
            if (!empty($import_data['title'])) {
                update_option(
                    'maxiblocks_current_starter_site',
                    $import_data['title'],
                );
            }

            return rest_ensure_response([
                'success' => true,
                'message' => 'Import data processed',
                'data' => $results,
                'currentStarterSite' => $import_data['title'] ?? '',
            ]);
        }

        /**
         * Import pages
         *
         * @param array $pages_data Pages data array
         * @return array Results of the import
         */
        private function maxi_import_pages($pages_data)
        {
            $results = [];
            $home_page_id = null;
            $blog_page_id = null;
            $has_home_page = false;
            $has_blog_template = false;

            // First pass - import pages and identify home/blog pages
            foreach ($pages_data as $page_name => $page_data) {
                // Parse the page data
                $content = $page_data['content'] ?? '';
                $content = $this->process_content_images($content);

                $styles = $page_data['styles'] ?? [];
                $entity_type = $page_data['entityType'] ?? 'page';
                $entity_title = $page_data['entityTitle'] ?? $page_name;
                $entity_slug =
                    $page_data['entitySlug'] ?? sanitize_title($entity_title);
                $custom_data = $page_data['customData'] ?? [];
                $fonts = $page_data['fonts'] ?? [];

                // Create the page/post
                $post_data = [
                    'post_title' => $entity_title,
                    'post_content' => wp_slash($content),
                    'post_status' => 'publish',
                    'post_type' => $entity_type,
                    'post_name' => $entity_slug,
                ];

                $post_id = wp_insert_post($post_data);

                if (is_wp_error($post_id)) {
                    $results[$page_name] = [
                        'success' => false,
                        'message' => $post_id->get_error_message(),
                    ];
                    continue;
                }

                // Check if this is a home or blog page
                if (
                    stripos($entity_title, 'home') !== false ||
                    stripos($entity_slug, 'home') !== false
                ) {
                    $home_page_id = $post_id;
                    $has_home_page = true;
                } elseif (
                    stripos($entity_title, 'blog') !== false ||
                    stripos($entity_slug, 'blog') !== false
                ) {
                    $blog_page_id = $post_id;
                }

                // Import styles into DB
                $this->import_styles_to_db($styles);

                // Import custom data
                $this->import_custom_data_to_db($custom_data);

                // Import fonts
                $this->import_fonts_to_db($fonts);

                $results[$page_name] = [
                    'success' => true,
                    'post_id' => $post_id,
                    /* translators: %s: Title of the imported entity */
                    'message' => sprintf(__('Successfully imported %s', 'maxi-blocks'), $entity_title)
                ];
            }

            // Check if we have a blog template
            $blog_template = get_block_template(
                get_stylesheet() . '//blog',
                'wp_template',
            );
            $has_blog_template = !empty($blog_template);

            // Create blog page if it doesn't exist
            if (!$blog_page_id) {
                // Check if a page with slug 'blog' already exists
                $existing_blog = get_page_by_path('blog');

                if ($existing_blog) {
                    $blog_page_id = $existing_blog->ID;
                } else {
                    $blog_page = [
                        'post_title' => 'Blog',
                        'post_content' => '',
                        'post_status' => 'publish',
                        'post_type' => 'page',
                        'post_name' => 'blog',
                    ];
                    $blog_page_id = wp_insert_post($blog_page);

                    if (!is_wp_error($blog_page_id)) {
                        $results['blog_page'] = [
                            'success' => true,
                            'post_id' => $blog_page_id,
                            'message' => __('Created Blog page', 'maxi-blocks'),
                        ];
                    }
                }
            }

            // Update reading settings
            if ($has_home_page) {
                update_option('show_on_front', 'page');
                update_option('page_on_front', $home_page_id);
            }

            // Always set the blog page if we have one
            if ($blog_page_id && !is_wp_error($blog_page_id)) {
                update_option('page_for_posts', $blog_page_id);
            }

            // Add reading settings to results
            $results['reading_settings'] = [
                'show_on_front' => get_option('show_on_front'),
                'page_on_front' => get_option('page_on_front'),
                'page_for_posts' => get_option('page_for_posts'),
            ];

            return $results;
        }

        /**
         * Import template parts
         *
         * @param array $template_data Template part data
         * @return array Results of the import
         */
        private function maxi_import_template_parts($template_data)
        {
            $results = [];
            global $wpdb;

            // Get current theme
            $current_theme = wp_get_theme();
            $theme_slug = $current_theme->get_stylesheet();

            foreach ($template_data as $template_name => $template_part_data) {
                // Check entity type and route to appropriate function
                if ($template_part_data['entityType'] === 'template') {
                    return $this->maxi_import_templates([$template_part_data]);
                }

                if ($template_part_data['entityType'] !== 'template-part') {
                    $results[$template_name] = [
                        'success' => false,
                        /* translators: %s: The invalid entity type */
                        'message' => sprintf(__('Invalid entity type: %s', 'maxi-blocks'), $template_part_data['entityType'])
                    ];
                    continue;
                }

                // Parse the template data
                $content = $template_part_data['content'] ?? '';

                // Process images in content
                $content = $this->process_content_images($content);

                $styles = $template_part_data['styles'] ?? [];
                $entity_title =
                    $template_part_data['entityTitle'] ?? $template_name;
                $entity_slug =
                    $template_part_data['entitySlug'] ??
                    sanitize_title($entity_title);
                $custom_data = $template_part_data['customData'] ?? [];
                $fonts = $template_part_data['fonts'] ?? [];

                // Set up the template part area
                $area = '';
                if (strpos(strtolower($entity_title), 'header') !== false) {
                    $area = 'header';
                } elseif (
                    strpos(strtolower($entity_title), 'footer') !== false
                ) {
                    $area = 'footer';
                } else {
                    $area = 'uncategorized';
                }

                // Check if template part exists
                $existing_template = get_block_template(
                    $theme_slug . '//' . $entity_slug,
                    'wp_template_part',
                );

                // Check if it exists in database by simple slug
                $existing_post = $wpdb->get_row(
                    $wpdb->prepare(
                        "SELECT ID FROM {$wpdb->posts}
                        WHERE post_type = 'wp_template_part'
                        AND post_name = %s
                        AND post_status != 'trash'",
                        $entity_slug
                    )
                );

                // Clean up any duplicate posts with incremented slugs
                if (!$existing_post) {
                    $duplicate_posts = $wpdb->get_results(
                        $wpdb->prepare(
                            "SELECT ID FROM {$wpdb->posts}
                            WHERE post_type = 'wp_template_part'
                            AND post_name LIKE %s
                            AND post_name != %s
                            AND post_status != 'trash'",
                            $entity_slug . '-%',
                            $entity_slug
                        )
                    );

                    foreach ($duplicate_posts as $duplicate) {
                        wp_delete_post($duplicate->ID, true);
                    }
                }

                $template_content = array(
                    'post_name' => $entity_slug,
                    'post_title' => $entity_title,
                    'post_content' => wp_slash($content),
                    'post_status' => 'publish',
                    'post_type' => 'wp_template_part',
                    'post_excerpt' => '',
                    'tax_input' => [
                        'wp_theme' => [$theme_slug],
                        'wp_template_part_area' => [$area],
                    ],
                    'meta_input' => [
                        'origin' => 'theme',
                        'theme' => $theme_slug,
                        'area' => $area,
                        'is_custom' => true,
                    ]
                );

                if ($existing_template) {
                    if ($existing_post) {
                        $template_content['ID'] = $existing_post->ID;
                        $post_id = wp_update_post($template_content);
                    } else {
                        $post_id = wp_insert_post($template_content);

                        if ($post_id && !is_wp_error($post_id)) {
                            wp_set_object_terms(
                                $post_id,
                                $area,
                                'wp_template_part_area',
                            );
                            wp_set_object_terms(
                                $post_id,
                                $theme_slug,
                                'wp_theme',
                            );
                        }
                    }
                } else {
                    $post_id = wp_insert_post($template_content);

                    if ($post_id && !is_wp_error($post_id)) {
                        wp_set_object_terms(
                            $post_id,
                            $area,
                            'wp_template_part_area',
                        );
                        wp_set_object_terms($post_id, $theme_slug, 'wp_theme');
                    }
                }

                if (is_wp_error($post_id)) {
                    $results[$template_name] = [
                        'success' => false,
                        'message' => $post_id->get_error_message(),
                    ];
                    continue;
                }

                // Import styles into DB
                $this->import_styles_to_db($styles);

                // Import custom data
                $this->import_custom_data_to_db($custom_data);

                // Import fonts
                $this->import_fonts_to_db($fonts);

                // Clear template parts cache
                wp_cache_delete('wp_template_part_' . $theme_slug);
                wp_cache_delete('wp_template_part_area_' . $area);

                $results[$template_name] = [
                    'success' => true,
                    'post_id' => $post_id,
                    /* translators: %s: Title of the template part */
                    'message' => sprintf(__('Successfully imported %s template part', 'maxi-blocks'), $entity_title)
                ];
            }

            return $results;
        }

        /**
         * Import templates
         *
         * @param array $template_data Template data
         * @return array Results of the import
         */
        private function maxi_import_templates($template_data)
        {
            $results = [];
            global $wpdb;

            // Get current theme
            $current_theme = wp_get_theme();
            $theme_slug = $current_theme->get_stylesheet();

            // Helper function to replace template part references
            $replace_template_parts = function ($content) use ($theme_slug) {
                return preg_replace(
                    '/<!-- wp:template-part {"slug":"([^"]+)","theme":"[^"]+"/',
                    '<!-- wp:template-part {"slug":"$1","theme":"' .
                        $theme_slug .
                        '"',
                    $content,
                );
            };

            // Valid template types
            $valid_types = [
                'archive',
                'author',
                'category',
                'tag',
                'date',
                'taxonomy',
                'single',
                'page',
                'home',
                '404',
                'search',
            ];

            foreach ($template_data as $template_name => $template_data) {
                // Parse the template data
                $content = $template_data['content'] ?? '';

                // Process images in content
                $content = $this->process_content_images($content);

                // Replace template part references with current theme
                $content = $replace_template_parts($content);

                $styles = $template_data['styles'] ?? [];
                $entity_type = $template_data['entityType'] ?? '';
                $entity_title = $template_data['entityTitle'] ?? $template_name;
                $entity_slug =
                    $template_data['entitySlug'] ??
                    sanitize_title($entity_title);
                $custom_data = $template_data['customData'] ?? [];
                $fonts = $template_data['fonts'] ?? [];

                // Validate template type
                if (!in_array($entity_slug, $valid_types)) {
                    $results[$template_name] = [
                        'success' => false,
                        /* translators: %s: The invalid template slug */
                        'message' => sprintf(__('Invalid template slug: %s', 'maxi-blocks'), $entity_slug)
                    ];
                    continue;
                }

                // Check if template exists
                $existing_template = get_block_template(
                    $theme_slug . '//' . $entity_slug,
                    'wp_template',
                );

                // Check if it exists in database by simple slug
                $existing_post = $wpdb->get_row(
                    $wpdb->prepare(
                        "SELECT ID FROM {$wpdb->posts}
                        WHERE post_type = 'wp_template'
                        AND post_name = %s
                        AND post_status != 'trash'",
                        $entity_slug
                    )
                );

                // Clean up any duplicate posts with incremented slugs
                if (!$existing_post) {
                    $duplicate_posts = $wpdb->get_results(
                        $wpdb->prepare(
                            "SELECT ID FROM {$wpdb->posts}
                            WHERE post_type = 'wp_template'
                            AND post_name LIKE %s
                            AND post_name != %s
                            AND post_status != 'trash'",
                            $entity_slug . '-%',
                            $entity_slug
                        )
                    );

                    foreach ($duplicate_posts as $duplicate) {
                        wp_delete_post($duplicate->ID, true);
                    }
                }

                $template_content = array(
                    'post_name' => $entity_slug,
                    'post_title' => $entity_title,
                    'post_content' => wp_slash($content),
                    'post_status' => 'publish',
                    'post_type' => 'wp_template',
                    'post_excerpt' => '',
                    'tax_input' => [
                        'wp_theme' => [$theme_slug],
                    ],
                    'meta_input' => [
                        'origin' => 'theme',
                        'theme' => $theme_slug,
                        'is_custom' => true,
                        'type' => $entity_type,
                    ],
                );

                if ($existing_template) {
                    if ($existing_post) {
                        $template_content['ID'] = $existing_post->ID;
                        $post_id = wp_update_post($template_content);
                    } else {
                        $post_id = wp_insert_post($template_content);

                        if ($post_id && !is_wp_error($post_id)) {
                            wp_set_object_terms(
                                $post_id,
                                $theme_slug,
                                'wp_theme',
                            );
                        }
                    }
                } else {
                    $post_id = wp_insert_post($template_content);

                    if ($post_id && !is_wp_error($post_id)) {
                        wp_set_object_terms($post_id, $theme_slug, 'wp_theme');
                    }
                }

                if (is_wp_error($post_id)) {
                    $results[$template_name] = [
                        'success' => false,
                        'message' => $post_id->get_error_message(),
                    ];
                    continue;
                }

                // Import styles into DB
                $this->import_styles_to_db($styles);

                // Import custom data
                $this->import_custom_data_to_db($custom_data);

                // Import fonts
                $this->import_fonts_to_db($fonts);

                // Clear template cache
                wp_cache_delete('wp_template_' . $theme_slug);

                $results[$template_name] = [
                    'success' => true,
                    'post_id' => $post_id,
                    /* translators: %s: Title of the template */
                    'message' => sprintf(__('Successfully imported %s template', 'maxi-blocks'), $entity_title)
                ];
            }

            return $results;
        }

        /**
         * Import XML content using WordPress Importer
         *
         * @param string $xml_content XML content to import
         * @return array|WP_Error Result of import
         */
        private function maxi_import_xml($xml_content)
        {
            if (!$xml_content) {
                return false;
            }

            // Create a temporary file to store the XML
            $temp_file = wp_tempnam('maxi_import_');
            if (!$temp_file) {
                return new WP_Error(
                    'temp_file_error',
                    'Could not create temporary file',
                );
            }

            file_put_contents($temp_file, $xml_content);

            // Required files for WP_Import
            if (!function_exists('post_exists')) {
                require_once ABSPATH . 'wp-admin/includes/post.php';
            }
            if (!function_exists('comment_exists')) {
                require_once ABSPATH . 'wp-admin/includes/comment.php';
            }
            require_once ABSPATH . 'wp-admin/includes/image.php';
            require_once ABSPATH . 'wp-admin/includes/media.php';
            require_once ABSPATH . 'wp-admin/includes/image-edit.php';
            require_once ABSPATH . 'wp-admin/includes/import.php';
            require_once ABSPATH . 'wp-admin/includes/class-wp-importer.php';

            // Check if WordPress Importer plugin is installed and active
            if (
                !file_exists(
                    WP_PLUGIN_DIR . '/wordpress-importer/class-wp-import.php',
                )
            ) {
                return new WP_Error(
                    'importer_missing',
                    'WordPress Importer plugin is required but not installed.',
                    ['status' => 400],
                );
            }

            // Load the php-toolkit which includes WPURL and other required classes
            if (!class_exists('WordPress\\XML\\XMLProcessor')) {
                require_once WP_PLUGIN_DIR . '/wordpress-importer/php-toolkit/load.php';
            }

            require_once WP_PLUGIN_DIR . '/wordpress-importer/class-wp-import.php';
            require_once WP_PLUGIN_DIR . '/wordpress-importer/wordpress-importer.php';
            require_once WP_PLUGIN_DIR . '/wordpress-importer/parsers/class-wxr-parser.php';
            require_once WP_PLUGIN_DIR . '/wordpress-importer/parsers/class-wxr-parser-simplexml.php';

            // Run the importer
            try {
                $importer = new WP_Import();
                $importer->fetch_attachments = true;

                // Suppress output
                ob_start();
                $importer->import($temp_file);
                ob_end_clean();

                // Clean up
                unlink($temp_file);

                return [
                    'success' => true,
                    'message' => 'XML content imported successfully',
                ];
            } catch (Exception $e) {
                unlink($temp_file);
                return new WP_Error('import_error', $e->getMessage());
            }
        }

        /**
         * Import patterns
         *
         * @param array $pattern_data Pattern data
         * @return array Results of the import
         */
        private function maxi_import_patterns($pattern_data)
        {
            $results = [];
            global $wpdb;

            foreach ($pattern_data as $pattern_name => $pattern_data) {
                // Parse the pattern data
                $content = $pattern_data['content'] ?? '';

                // Process images in content
                $content = $this->process_content_images($content);

                $styles = $pattern_data['styles'] ?? [];
                $entity_title = $pattern_data['entityTitle'] ?? $pattern_name;
                $entity_slug =
                    $pattern_data['entitySlug'] ??
                    sanitize_title($entity_title);
                $custom_data = $pattern_data['customData'] ?? [];
                $fonts = $pattern_data['fonts'] ?? [];
                $wp_pattern_sync_status =
                    $pattern_data['wpPatternSyncStatus'] ?? '';

                // Check if pattern exists in database
                $existing_post = $wpdb->get_row(
                    $wpdb->prepare(
                        "SELECT ID FROM {$wpdb->posts}
                        WHERE post_type = 'wp_block'
                        AND post_name = %s
                        AND post_status != 'trash'",
                        $entity_slug
                    )
                );

                // Clean up any duplicate posts with incremented slugs
                if (!$existing_post) {
                    $duplicate_posts = $wpdb->get_results(
                        $wpdb->prepare(
                            "SELECT ID FROM {$wpdb->posts}
                            WHERE post_type = 'wp_block'
                            AND post_name LIKE %s
                            AND post_name != %s
                            AND post_status != 'trash'",
                            $entity_slug . '-%',
                            $entity_slug
                        )
                    );

                    foreach ($duplicate_posts as $duplicate) {
                        wp_delete_post($duplicate->ID, true);
                    }
                }

                $pattern_content = array(
                    'post_name' => $entity_slug,
                    'post_title' => $entity_title,
                    'post_content' => wp_slash($content),
                    'post_status' => 'publish',
                    'post_type' => 'wp_block',
                    'post_excerpt' => '',
                    'meta_input' => [
                        'wp_pattern_sync_status' => $wp_pattern_sync_status,
                    ],
                );

                if ($existing_post) {
                    $pattern_content['ID'] = $existing_post->ID;
                    $post_id = wp_update_post($pattern_content);
                } else {
                    $post_id = wp_insert_post($pattern_content);
                }

                if (is_wp_error($post_id)) {
                    $results[$pattern_name] = [
                        'success' => false,
                        'message' => $post_id->get_error_message(),
                    ];
                    continue;
                }

                // Import styles into DB
                $this->import_styles_to_db($styles);

                // Import custom data
                $this->import_custom_data_to_db($custom_data);

                // Import fonts
                $this->import_fonts_to_db($fonts);

                $results[$pattern_name] = [
                    'success' => true,
                    'post_id' => $post_id,
                    /* translators: %s: Title of the pattern */
                    'message' => sprintf(__('Successfully imported %s pattern', 'maxi-blocks'), $entity_title)
                ];
            }

            return $results;
        }

        /**
         * Import styles into database
         *
         * @param array $styles Array of styles with block IDs as keys
         * @return void
         */
        private function import_styles_to_db($styles)
        {
            global $wpdb;

            foreach ($styles as $block_id => $style_data) {
                // Check if block_id exists
                $existing_style = $wpdb->get_row(
                    $wpdb->prepare(
                        "SELECT * FROM {$wpdb->prefix}maxi_blocks_styles_blocks WHERE block_style_id = %s",
                        $block_id,
                    ),
                );

                if ($existing_style) {
                    // Update existing record
                    $wpdb->update(
                        $wpdb->prefix . 'maxi_blocks_styles_blocks',
                        [
                            'prev_css_value' => $existing_style->css_value,
                            'css_value' => $style_data,
                        ],
                        ['block_style_id' => $block_id],
                        ['%s', '%s'],
                        ['%s'],
                    );
                } else {
                    // Insert new record
                    $wpdb->insert(
                        $wpdb->prefix . 'maxi_blocks_styles_blocks',
                        [
                            'block_style_id' => $block_id,
                            'css_value' => $style_data,
                            'prev_css_value' => $style_data,
                        ],
                        ['%s', '%s', '%s'],
                    );
                }
            }
        }

        /**
         * Import custom data into database
         *
         * @param array $custom_data Array of custom data with block IDs as keys
         * @return void
         */
        private function import_custom_data_to_db($custom_data)
        {
            global $wpdb;

            foreach ($custom_data as $block_id => $block_custom_data) {
                // Try to parse the custom data if it's a string
                if (is_string($block_custom_data)) {
                    $parsed_data = json_decode($block_custom_data, true);

                    // If parsing successful and contains nested structure
                    if ($parsed_data && isset($parsed_data[$block_id])) {
                        $block_custom_data = json_encode(
                            $parsed_data[$block_id],
                        );
                    }
                }

                // Check if block_id exists
                $existing_custom_data = $wpdb->get_row(
                    $wpdb->prepare(
                        "SELECT * FROM {$wpdb->prefix}maxi_blocks_custom_data_blocks WHERE block_style_id = %s",
                        $block_id,
                    ),
                );

                if ($existing_custom_data) {
                    // Update existing record
                    $wpdb->update(
                        $wpdb->prefix . 'maxi_blocks_custom_data_blocks',
                        [
                            'prev_custom_data_value' =>
                                $existing_custom_data->custom_data_value,
                            'custom_data_value' => $block_custom_data,
                        ],
                        ['block_style_id' => $block_id],
                        ['%s', '%s'],
                        ['%s'],
                    );
                } else {
                    // Insert new record
                    $wpdb->insert(
                        $wpdb->prefix . 'maxi_blocks_custom_data_blocks',
                        [
                            'block_style_id' => $block_id,
                            'custom_data_value' => $block_custom_data,
                            'prev_custom_data_value' => $block_custom_data,
                        ],
                        ['%s', '%s', '%s'],
                    );
                }
            }
        }

        /**
         * Import fonts into database
         *
         * @param array $fonts Array of fonts with block IDs as keys
         * @return void
         */
        private function import_fonts_to_db($fonts)
        {
            global $wpdb;

            foreach ($fonts as $block_id => $font_data) {
                // Check if block_id exists
                $existing_fonts = $wpdb->get_row(
                    $wpdb->prepare(
                        "SELECT * FROM {$wpdb->prefix}maxi_blocks_styles_blocks WHERE block_style_id = %s",
                        $block_id,
                    ),
                );

                if ($existing_fonts) {
                    // Update existing record
                    $wpdb->update(
                        $wpdb->prefix . 'maxi_blocks_styles_blocks',
                        [
                            'prev_fonts_value' =>
                                $existing_fonts->fonts_value ?? $font_data,
                            'fonts_value' => $font_data,
                        ],
                        ['block_style_id' => $block_id],
                        ['%s', '%s'],
                        ['%s'],
                    );
                } else {
                    // Insert new record
                    $wpdb->insert(
                        $wpdb->prefix . 'maxi_blocks_styles_blocks',
                        [
                            'block_style_id' => $block_id,
                            'fonts_value' => $font_data,
                            'prev_fonts_value' => $font_data,
                        ],
                        ['%s', '%s', '%s'],
                    );
                }
            }
        }

        /**
         * Process content to import external images and replace URLs
         *
         * @param string $content The content to process
         * @return string The processed content with updated image URLs
         */
        private function process_content_images($content)
        {
            // Skip if content is empty
            if (empty($content)) {
                return $content;
            }

            // Helper function to download and upload image
            $import_image = function ($url) {
                // Skip if not a valid URL
                if (!filter_var($url, FILTER_VALIDATE_URL)) {
                    return false;
                }

                // Skip if URL is already from this site
                if (strpos($url, site_url()) !== false) {
                    return $url;
                }

                // Get file info
                $file_array = [];
                $file_array['name'] = basename(parse_url($url, PHP_URL_PATH));

                // Check file type
                $wp_filetype = wp_check_filetype($file_array['name']);
                if (!$wp_filetype['type']) {
                    // Try to get type from remote file
                    $response = wp_remote_head($url);
                    if (!is_wp_error($response)) {
                        $headers = wp_remote_retrieve_headers($response);
                        if (isset($headers['content-type'])) {
                            $mime_type = $headers['content-type'];
                            // Map common MIME types to extensions
                            $mime_to_ext = [
                                'image/jpeg' => 'jpg',
                                'image/jpg' => 'jpg',
                                'image/png' => 'png',
                                'image/gif' => 'gif',
                                'image/webp' => 'webp',
                                'image/svg+xml' => 'svg',
                            ];

                            if (isset($mime_to_ext[$mime_type])) {
                                $wp_filetype['type'] = $mime_type;
                                $wp_filetype['ext'] = $mime_to_ext[$mime_type];
                                // Update filename with correct extension
                                $file_array['name'] = sanitize_file_name(
                                    pathinfo(
                                        $file_array['name'],
                                        PATHINFO_FILENAME,
                                    ) .
                                        '.' .
                                        $wp_filetype['ext'],
                                );
                            }
                        }
                    }
                }

                // Skip if not a valid image type
                if (
                    !$wp_filetype['type'] ||
                    !stristr($wp_filetype['type'], 'image/')
                ) {
                    return false;
                }

                // Download file to temp dir
                $temp_file = download_url($url);
                if (is_wp_error($temp_file)) {
                    return false;
                }

                $file_array['tmp_name'] = $temp_file;

                // Set upload directory filter
                $upload_override = function ($upload) {
                    $upload['path'] = WP_CONTENT_DIR . '/uploads';
                    $upload['url'] = WP_CONTENT_URL . '/uploads';
                    return $upload;
                };
                add_filter('upload_dir', $upload_override);

                // Do the upload
                $time = current_time('mysql');
                $file = wp_handle_sideload($file_array, [
                    'test_form' => false,
                    'time' => $time,
                ]);

                // Remove the upload directory filter
                remove_filter('upload_dir', $upload_override);

                // Clean up temp file
                @unlink($temp_file);

                if (isset($file['error'])) {
                    return false;
                }

                // Create attachment
                $attachment = [
                    'post_mime_type' => $file['type'],
                    'post_title' => preg_replace(
                        '/\.[^.]+$/',
                        '',
                        $file_array['name'],
                    ),
                    'post_content' => '',
                    'post_status' => 'inherit',
                    'guid' => $file['url'],
                ];

                $attach_id = wp_insert_attachment($attachment, $file['file']);
                if (is_wp_error($attach_id)) {
                    return false;
                }

                // Generate metadata and thumbnails
                require_once ABSPATH . 'wp-admin/includes/image.php';
                $attach_data = wp_generate_attachment_metadata(
                    $attach_id,
                    $file['file'],
                );
                wp_update_attachment_metadata($attach_id, $attach_data);

                return $file['url'];
            };

            // Find all image URLs in content
            $pattern = '/"url":\s*"([^"]+)"/';
            $content = preg_replace_callback(
                $pattern,
                function ($matches) use ($import_image) {
                    if (empty($matches[1])) {
                        return $matches[0];
                    }
                    $old_url = $matches[1];
                    $new_url = $import_image($old_url);
                    return $new_url ? '"url":"' . $new_url . '"' : $matches[0];
                },
                $content,
            );

            // Also handle background images
            $pattern = '/"backgroundImage":\s*"([^"]+)"/';
            $content = preg_replace_callback(
                $pattern,
                function ($matches) use ($import_image) {
                    if (empty($matches[1])) {
                        return $matches[0];
                    }
                    $old_url = $matches[1];
                    $new_url = $import_image($old_url);
                    return $new_url
                        ? '"backgroundImage":"' . $new_url . '"'
                        : $matches[0];
                },
                $content,
            );

            // Handle SVG content
            $pattern = '/"svg":\s*"([^"]+)"/';
            $content = preg_replace_callback(
                $pattern,
                function ($matches) use ($import_image) {
                    if (empty($matches[1])) {
                        return $matches[0];
                    }
                    $old_url = $matches[1];
                    // Skip if it's inline SVG
                    if (strpos($old_url, '<svg') !== false) {
                        return $matches[0];
                    }
                    $new_url = $import_image($old_url);
                    return $new_url ? '"svg":"' . $new_url . '"' : $matches[0];
                },
                $content,
            );

            return $content;
        }
    }
endif;
