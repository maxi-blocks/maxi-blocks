<?php
// At the top of the file, after the initial requires
require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/media.php';
require_once ABSPATH . 'wp-admin/includes/image.php';
require_once plugin_dir_path(__DIR__) . 'core/class-maxi-local-fonts.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/class-maxi-custom-fonts.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/class-maxi-acp-client.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/class-maxi-api-ai.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/class-maxi-api-import.php';

/**
 * MaxiBlocks styles API
 */

if (!defined('ABSPATH')) {
    exit();
}

if (!class_exists('MaxiBlocks_API')):
    class MaxiBlocks_API
    {
        /**
         * This plugin's instance.
         *
         * @var MaxiBlocks_API
         */
        private static $instance;

        /**
         * Registers the plugin.
         */
        public static function register()
        {
            if (null === self::$instance) {
                self::$instance = new MaxiBlocks_API();
            }
        }

        /**
         * Cache key for unique IDs transient
         */
        private const UNIQUE_IDS_CACHE_KEY = 'maxi_blocks_unique_ids_cache';

        /**
         * Variables
         */
        private $version;
        private $namespace;

        /**
         * AI API handler
         * @var MaxiBlocks_API_AI
         */
        private $ai_handler;

        /**
         * Import API handler
         * @var MaxiBlocks_API_Import
         */
        private $import_handler;

        /**
         * Constructor.
         */
        public function __construct()
        {
            $this->version = '1.0';
            $this->namespace = 'maxi-blocks/v' . $this->version;

            // Initialize sub-handlers
            $this->ai_handler = new MaxiBlocks_API_AI($this->namespace);
            $this->import_handler = new MaxiBlocks_API_Import($this->namespace);

            // REST API
            add_action('rest_api_init', [$this, 'mb_register_routes']);

            // Handlers
            add_action('before_delete_post', [$this, 'mb_delete_register']);

            // Cache invalidation hooks for uniqueIDs cache optimization
            // Use lower priority (20) to run after post is fully saved
            add_action('save_post', [$this, 'invalidate_unique_ids_cache_on_save'], 20, 2);
            add_action('deleted_post', [$this, 'invalidate_unique_ids_cache']);

            // Enable gzip compression for MaxiBlocks API responses
            add_filter('rest_pre_serve_request', [$this, 'enable_rest_compression'], 10, 4);
        }

        /**
         * Register REST API routes
         */
        public function mb_register_routes()
        {
            register_rest_route($this->namespace, '/settings', [
                'methods' => 'GET',
                'callback' => [$this, 'get_maxi_blocks_options'],
                'args' => [
                    'id' => [
                        'validate_callback' => function ($param) {
                            return is_numeric($param);
                        },
                    ],
                ],
                'permission_callback' => function () {
                    return current_user_can('edit_posts');
                },
            ]);
            register_rest_route($this->namespace, '/post/(?P<id>\d+)', [
                'methods' => 'GET',
                'callback' => [$this, 'get_maxi_blocks_post'],
                'args' => [
                    'id' => [
                        'validate_callback' => function ($param) {
                            return is_numeric($param);
                        },
                    ],
                ],
                'permission_callback' => function () {
                    return current_user_can('edit_posts');
                },
            ]);
            register_rest_route($this->namespace, '/styles', [
                'methods' => 'POST',
                'callback' => [$this, 'post_maxi_blocks_styles'],
                'args' => [
                    'styles' => [
                        'validate_callback' => function ($param) {
                            return is_string($param);
                        },
                    ],
                    'meta' => [
                        'validate_callback' => function ($param) {
                            return is_string($param);
                        },
                    ],
                    'update' => [
                        'validate_callback' => function ($param) {
                            return is_bool($param);
                        },
                    ],
                ],
                'permission_callback' => function () {
                    return current_user_can('edit_posts');
                },
            ]);
            register_rest_route(
                $this->namespace,
                '/get-font-url/(?P<font_name>.+)',
                [
                    'methods' => 'GET',
                    'callback' => [$this, 'get_maxi_blocks_local_font_url'],
                    'permission_callback' => function () {
                        return current_user_can('edit_posts');
                    },
                    'args' => [
                        'font_name' => [
                            'required' => true,
                            'sanitize_callback' => function ($param) {
                                // Convert '+' back to spaces and decode other URL entities
                                return urldecode(str_replace('+', ' ', $param));
                            },
                        ],
                    ],
                ],
            );
            register_rest_route($this->namespace, '/fonts/custom', [
                'methods' => 'GET',
                'callback' => [$this, 'get_custom_fonts'],
                'permission_callback' => function () {
                    return current_user_can('edit_posts');
                },
            ]);
            register_rest_route($this->namespace, '/fonts/custom', [
                'methods' => 'POST',
                'callback' => [$this, 'create_custom_font'],
                'permission_callback' => function () {
                    return current_user_can('upload_files');
                },
            ]);
            register_rest_route(
                $this->namespace,
                '/fonts/custom/(?P<id>[a-z0-9\-]+)',
                [
                    'methods' => 'DELETE',
                    'callback' => [$this, 'delete_custom_font'],
                    'permission_callback' => function () {
                        return current_user_can('upload_files');
                    },
                    'args' => [
                        'id' => [
                            'required' => true,
                            'sanitize_callback' => 'sanitize_title',
                        ],
                    ],
                ],
            );
            register_rest_route($this->namespace, '/style-card', [
                'methods' => 'GET',
                'callback' => [$this, 'get_maxi_blocks_sc_string'],
                'permission_callback' => function () {
                    return current_user_can('edit_posts');
                },
            ]);
            register_rest_route($this->namespace, '/style-card', [
                'methods' => 'POST',
                'callback' => [$this, 'post_maxi_blocks_sc_string'],
                'args' => [
                    'sc_variables' => [
                        'validate_callback' => function ($param) {
                            return is_string($param);
                        },
                    ],
                    'sc_styles' => [
                        'validate_callback' => function ($param) {
                            return is_string($param);
                        },
                    ],
                    'update' => [
                        'validate_callback' => function ($param) {
                            return is_bool($param);
                        },
                    ],
                ],
                'permission_callback' => function () {
                    return current_user_can('edit_posts');
                },
            ]);
            register_rest_route($this->namespace, '/breakpoints', [
                'methods' => 'GET',
                'callback' => [$this, 'get_maxi_blocks_breakpoints'],
                'permission_callback' => function () {
                    return true;
                },
            ]);
            register_rest_route($this->namespace, '/style-cards', [
                'methods' => 'GET',
                'callback' => [$this, 'get_maxi_blocks_current_style_cards'],
                'args' => [
                    'client_hash' => [
                        'default' => '',
                        'validate_callback' => function ($param) {
                            return is_string($param);
                        },
                    ],
                ],
                'permission_callback' => function () {
                    return current_user_can('edit_posts');
                },
            ]);
            register_rest_route($this->namespace, '/style-cards/reset', [
                'methods' => 'GET',
                'callback' => [$this, 'reset_maxi_blocks_style_cards'],
                'permission_callback' => function () {
                    return current_user_can('edit_posts');
                },
            ]);
            register_rest_route($this->namespace, '/style-cards', [
                'methods' => 'POST',
                'callback' => [$this, 'set_maxi_blocks_current_style_cards'],
                'permission_callback' => function () {
                    return current_user_can('edit_posts');
                },
            ]);
            register_rest_route($this->namespace, '/custom-data/(?P<id>\d+)', [
                'methods' => 'GET',
                'callback' => [$this, 'get_maxi_blocks_current_custom_data'],
                'args' => [
                    'id' => [
                        'validate_callback' => function ($param) {
                            return is_numeric($param);
                        },
                    ],
                ],
                'permission_callback' => function () {
                    return current_user_can('edit_posts');
                },
            ]);
            register_rest_route($this->namespace, '/custom-data', [
                'methods' => 'POST',
                'callback' => [$this, 'set_maxi_blocks_current_custom_data'],
                'args' => [
                    'id' => [
                        'validate_callback' => function ($param) {
                            return is_numeric($param) || is_string($param);
                        },
                    ],
                    'data' => [
                        'validate_callback' => function ($param) {
                            return is_string($param);
                        },
                    ],
                    'update' => [
                        'validate_callback' => function ($param) {
                            return is_bool($param);
                        },
                    ],
                    'isTemplate' => [
                        'validate_callback' => function ($param) {
                            return is_bool($param);
                        },
                    ],
                ],
                'permission_callback' => function () {
                    return current_user_can('edit_posts');
                },
            ]);
            register_rest_route(
                $this->namespace,
                '/unique-id/(?P<block_name>[a-z-]+)$',
                [
                    'methods' => 'GET',
                    'callback' => [$this, 'create_maxi_blocks_unique_id'],
                    'args' => [
                        'block_name' => [
                            'validate_callback' => function ($param) {
                                return is_string($param);
                            },
                        ],
                    ],
                    'permission_callback' => function () {
                        return current_user_can('edit_posts');
                    },
                ],
            );
            register_rest_route(
                $this->namespace,
                '/unique-ids/all',
                [
                    'methods' => 'GET',
                    'callback' => [$this, 'get_all_maxi_blocks_unique_ids'],
                    'args' => [
                        'page' => [
                            'default' => 1,
                            'validate_callback' => function ($param) {
                                return is_numeric($param) && $param > 0;
                            },
                        ],
                        'per_page' => [
                            'default' => 1000,
                            'validate_callback' => function ($param) {
                                return is_numeric($param) && $param > 0 && $param <= 5000;
                            },
                        ],
                        'client_hash' => [
                            'default' => '',
                            'validate_callback' => function ($param) {
                                return is_string($param);
                            },
                        ],
                    ],
                    'permission_callback' => function () {
                        return current_user_can('edit_posts');
                    },
                ],
            );
            register_rest_route(
                $this->namespace,
                '/unique-id/remove/(?P<unique_id>[a-z0-9-]+)$',
                [
                    'methods' => 'DELETE',
                    'callback' => [$this, 'remove_maxi_blocks_unique_id'],
                    'args' => [
                        'unique_id' => [
                            'validate_callback' => function ($param) {
                                return is_string($param);
                            },
                        ],
                    ],
                    'permission_callback' => function () {
                        return current_user_can('edit_posts');
                    },
                ],
            );
            register_rest_route($this->namespace, '/acf/get-field-groups', [
                'methods' => 'GET',
                'callback' => [$this, 'get_acf_field_groups'],
                'permission_callback' => function () {
                    return current_user_can('edit_posts');
                },
            ]);
            register_rest_route(
                $this->namespace,
                '/acf/get-group-fields/(?P<id>\d+)',
                [
                    'methods' => 'GET',
                    'callback' => [$this, 'get_acf_group_fields'],
                    'args' => [
                        'id' => [
                            'validate_callback' => function ($param) {
                                return is_numeric($param);
                            },
                        ],
                    ],
                    'permission_callback' => function () {
                        return current_user_can('edit_posts');
                    },
                ],
            );
            register_rest_route(
                $this->namespace,
                '/acf/get-field-value/(?P<field_id>\w+)/(?P<post_id>\d+)',
                [
                    'methods' => 'GET',
                    'callback' => [$this, 'get_acf_field_value'],
                    'args' => [
                        'id' => [
                            'validate_callback' => function ($param) {
                                return is_numeric($param);
                            },
                        ],
                    ],
                    'permission_callback' => function () {
                        return current_user_can('edit_posts');
                    },
                ],
            );
            register_rest_route(
                $this->namespace,
                '/get-active-integration-plugins',
                [
                    'methods' => 'GET',
                    'callback' => [$this, 'get_active_integration_plugins'],
                    'permission_callback' => function () {
                        return current_user_can('edit_posts');
                    },
                ],
            );
            // We can't get cart url in JS currently so made endpoint to get it.
            register_rest_route($this->namespace, '/wc/get-cart-url', [
                'methods' => 'GET',
                'callback' => 'wc_get_cart_url',
                'permission_callback' => function () {
                    return current_user_can('edit_posts');
                },
            ]);
            register_rest_route($this->namespace, '/pro', [
                'methods' => 'GET',
                'callback' => [$this, 'get_maxi_blocks_pro_status'],
                'permission_callback' => function () {
                    return current_user_can('edit_posts');
                },
            ]);
            register_rest_route($this->namespace, '/pro', [
                'methods' => 'POST',
                'callback' => [$this, 'set_maxi_blocks_pro_status'],
                'permission_callback' => function () {
                    return current_user_can('edit_posts');
                },
                'args' => [
                    'data' => [
                        'validate_callback' => function ($param) {
                            return is_string($param);
                        },
                    ],
                ],
            ]);
            // Import routes are handled by MaxiBlocks_API_Import
            $this->import_handler->register_routes();
            register_rest_route(
                $this->namespace,
                '/fonts/(?P<unique_id>[a-z0-9-]+)$',
                [
                    'methods' => 'GET',
                    'callback' => [$this, 'get_maxi_blocks_fonts_by_id'],
                    'args' => [
                        'unique_id' => [
                            'validate_callback' => function ($param) {
                                return is_string($param);
                            },
                        ],
                    ],
                    'permission_callback' => function () {
                        return current_user_can('edit_posts');
                    },
                ],
            );
            register_rest_route($this->namespace, '/check-theme-type', [
                'methods' => 'GET',
                'callback' => [$this, 'get_theme_type'],
                'permission_callback' => function () {
                    return current_user_can('edit_posts');
                },
            ]);
            register_rest_route($this->namespace, '/install-theme', [
                'methods' => 'POST',
                'callback' => [$this, 'install_maxiblocks_go_theme'],
                'permission_callback' => function () {
                    return current_user_can('install_themes') &&
                        current_user_can('switch_themes');
                },
            ]);
            register_rest_route($this->namespace, '/install-importer', [
                'methods' => 'POST',
                'callback' => [$this, 'install_wordpress_importer'],
                'permission_callback' => function () {
                    return current_user_can('install_plugins') &&
                        current_user_can('activate_plugins');
                },
            ]);
            // AI routes are handled by MaxiBlocks_API_AI
            $this->ai_handler->register_routes();
            register_rest_route($this->namespace, '/acp/request', [
                'methods' => 'POST',
                'callback' => [$this, 'proxy_acp_request'],
                'args' => [
                    'url' => [
                        'required' => true,
                        'validate_callback' => function ($param) {
                            return is_string($param) && !empty($param);
                        },
                    ],
                    'method' => [
                        'validate_callback' => function ($param) {
                            return is_string($param);
                        },
                    ],
                    'payload' => [
                        'validate_callback' => function ($param) {
                            return is_array($param) || is_object($param) || is_null($param);
                        },
                    ],
                    'headers' => [
                        'validate_callback' => function ($param) {
                            return is_array($param) || is_null($param);
                        },
                    ],
                    'timeout' => [
                        'validate_callback' => function ($param) {
                            return is_numeric($param);
                        },
                    ],
                ],
                'permission_callback' => function () {
                    return current_user_can('edit_posts');
                },
            ]);
        }

        public function proxy_acp_request($request)
        {
            $url = $request->get_param('url');
            $method = strtoupper($request->get_param('method') ?: 'POST');
            $payload = $request->get_param('payload');
            $headers = $request->get_param('headers') ?: [];
            $timeout = $request->get_param('timeout');

            $validated_url = esc_url_raw($url);
            if (!wp_http_validate_url($validated_url)) {
                return new WP_Error(
                    'maxi_blocks_acp_invalid_url',
                    'ACP URL must be a valid http(s) URL.',
                    ['status' => 400],
                );
            }

            $allowed_base = get_option('maxi_blocks_acp_base_url');
            if (!empty($allowed_base)) {
                $allowed_parts = wp_parse_url($allowed_base);
                $target_parts = wp_parse_url($validated_url);

                $allowed_host = $allowed_parts['host'] ?? null;
                $target_host = $target_parts['host'] ?? null;
                $allowed_scheme = $allowed_parts['scheme'] ?? null;
                $target_scheme = $target_parts['scheme'] ?? null;
                $allowed_port = $allowed_parts['port'] ?? null;
                $target_port = $target_parts['port'] ?? null;

                $host_matches = $allowed_host && $target_host && strtolower($allowed_host) === strtolower($target_host);
                $scheme_matches = $allowed_scheme && $target_scheme && strtolower($allowed_scheme) === strtolower($target_scheme);
                $port_matches = $allowed_port === $target_port;

                if (!$host_matches || !$scheme_matches || !$port_matches) {
                    return new WP_Error(
                        'maxi_blocks_acp_disallowed_url',
                        'ACP URL does not match the configured base URL.',
                        ['status' => 403],
                    );
                }
            }

            $response = MaxiBlocks_ACP_Client::request(
                $validated_url,
                $payload,
                $headers,
                $method,
                $timeout ? (int) $timeout : null,
            );

            if (is_wp_error($response)) {
                return $response;
            }

            return rest_ensure_response($response);
        }

        public function get_custom_fonts($request)
        {
            return rest_ensure_response(
                MaxiBlocks_Custom_Fonts::get_fonts_indexed_by_value(),
            );
        }

        public function create_custom_font($request)
        {
            $family = sanitize_text_field($request->get_param('family'));
            $attachment_id = $request->get_param('attachment_id');

            if (empty($family)) {
                return new WP_Error(
                    'invalid_font_family',
                    __('Font family is required.', 'maxi-blocks'),
                    ['status' => 400],
                );
            }

            if (empty($attachment_id) || !is_numeric($attachment_id)) {
                return new WP_Error(
                    'invalid_attachment_id',
                    __('A valid font file attachment ID is required.', 'maxi-blocks'),
                    ['status' => 400],
                );
            }

            // Detect all font variants from uploaded attachment
            $local_fonts = MaxiBlocks_Local_Fonts::get_instance();
            $detected_variants = $local_fonts->detect_font_attributes_from_attachment(
                (int) $attachment_id,
            );

            if (is_wp_error($detected_variants)) {
                return $detected_variants;
            }

            $attachment_url = wp_get_attachment_url($attachment_id);
            if (!$attachment_url) {
                return new WP_Error(
                    'attachment_url_missing',
                    __('Unable to retrieve attachment URL.', 'maxi-blocks'),
                    ['status' => 400],
                );
            }

            // Build variants array with all detected variants
            $variants = [];
            foreach ($detected_variants as $variant) {
                $variants[] = [
                    'weight' => $variant['weight'],
                    'style' => $variant['style'],
                    'url' => $attachment_url,
                    'attachment_id' => (int) $attachment_id,
                ];
            }

            $result = MaxiBlocks_Custom_Fonts::add_font_with_variants(
                $family,
                $variants,
            );

            if (is_wp_error($result)) {
                return $result;
            }

            return rest_ensure_response($result);
        }

        public function delete_custom_font($request)
        {
            $id = sanitize_title($request->get_param('id'));

            if (empty($id)) {
                return new WP_Error(
                    'invalid_font_id',
                    __('Font ID is required.', 'maxi-blocks'),
                    ['status' => 400],
                );
            }

            $result = MaxiBlocks_Custom_Fonts::delete_font($id);

            if (is_wp_error($result)) {
                return $result;
            }

            return rest_ensure_response(['deleted' => $id]);
        }

        /**
         * Returns MaxiBlocks general settings
         */
        public function get_maxi_blocks_options()
        {
            global $wp_version;

            $version = gettype($wp_version);
            $is_core = true;

            // In case Gutenberg plugin has been installed
            if (defined('GUTENBERG_VERSION')) {
                $version = GUTENBERG_VERSION;
                $is_core = false;
            } else {
                // Versions based on initial compatibility with WP 5.5.3
                if (version_compare($wp_version, '6.0.3') <= 0) {
                    $version = '13.0';
                } elseif (version_compare($wp_version, '6.1.1') <= 0) {
                    $version = '14.1';
                }
            }

            $response = [
                'maxi_version' => MAXI_PLUGIN_VERSION,
                'google_api_key' => get_option('google_api_key_option'),
                'ai_settings' => [
                    // Note: openai_api_key removed for security - now handled by backend proxy
                    'has_openai_api_key' => !empty(
                        get_option('openai_api_key_option')
                    ),
                    'has_anthropic_api_key' => !empty(
                        get_option('anthropic_api_key_option')
                    ),
                    'has_gemini_api_key' => !empty(
                        get_option('gemini_api_key_option')
                    ),
                    'has_mistral_api_key' => !empty(
                        get_option('mistral_api_key_option')
                    ),
                    'provider' => get_option('maxi_ai_provider', 'openai'),
                    'model' => get_option('maxi_ai_model'),
                    'language' => get_option('maxi_ai_language'),
                    'tone' => get_option('maxi_ai_tone'),
                    'system_instructions' => get_option(
                        'maxi_ai_system_instructions',
                    ),
                    'site_description' => get_option(
                        'maxi_ai_site_description',
                    ),
                    'audience' => get_option('maxi_ai_audience'),
                    'site_goal' => get_option('maxi_ai_site_goal'),
                    'services' => get_option('maxi_ai_services'),
                    'business_name' => get_option('maxi_ai_business_name'),
                    'business_info' => get_option('maxi_ai_business_info'),
                ],
                'bunny_fonts' => get_option('bunny_fonts'),
                'core' => [
                    'version' => $wp_version,
                ],
                'editor' => [
                    'version' => $version,
                    'is_core' => $is_core,
                ],
                'hide_tooltips' => get_option('hide_tooltips'),
                'hide_fse_resizable_handles' => get_option('hide_fse_resizable_handles'),
                'hide_gutenberg_responsive_preview' => get_option('hide_gutenberg_responsive_preview'),
                'placeholder_url' =>
                    MAXI_PLUGIN_URL_PATH . 'img/patterns-placeholder.jpeg',
                'show_indicators' => get_option('maxi_show_indicators'),
            ];

            return $response;
        }

        /**
         * Get the posts array with the info
         *
         * @return $posts JSON feed of returned objects
         */
        public function get_maxi_blocks_post($data)
        {
            $id = $data['id'];

            global $wpdb;
            $response = $wpdb->get_results(
                $wpdb->prepare(
                    "SELECT prev_css_value FROM {$wpdb->prefix}maxi_blocks_styles WHERE post_id = %d",
                    $id,
                ),
                OBJECT,
            );

            if (!$response) {
                $response = '';
            }

            return $response;
        }

        public function get_query_params($table)
        {
            global $wpdb;

            $table = $wpdb->prefix . $table;
            $id_key = 'block_style_id';
            $where_clause = $id_key . ' = %s';

            return [
                'table' => $table,
                'id_key' => $id_key,
                'where_clause' => $where_clause,
            ];
        }

        /**
         * Post the styles
         */
        public function post_maxi_blocks_styles($data, $is_json = true)
        {
            global $wpdb;

            $meta =
                $is_json && isset($data['meta'])
                    ? json_decode($data['meta'], true)
                    : $data['meta'] ?? [];
            $styles_arr =
                $is_json && isset($data['styles'])
                    ? json_decode($data['styles'], true)
                    : $data['styles'] ?? [];
            $fonts_arr = $meta['fonts'] ?? [];
            if ($is_json) {
                foreach ($fonts_arr as $key => $font) {
                    $fonts_arr[$key] = json_decode($font, true) ?? [];
                }
            }
            $fonts = '';
            if (!empty($fonts_arr)) {
                $fonts = wp_json_encode(array_merge_recursive(...$fonts_arr));
            }

            [
                'table' => $table,
                'where_clause' => $where_clause,
            ] = $this->get_query_params('maxi_blocks_styles_blocks');

            foreach ($styles_arr as $id => $styles) {
                $exists = $wpdb->get_results(
                    $wpdb->prepare(
                        "SELECT * FROM $table WHERE $where_clause",
                        $id,
                    ),
                    OBJECT,
                );

                $dictionary = [
                    'block_style_id' => $id,
                    'prev_css_value' => $styles,
                    'css_value' => $styles,
                    'prev_fonts_value' => $fonts,
                    'fonts_value' => $fonts,
                ];

                $get_array = function ($keys, $dictionary) {
                    $array = [];

                    foreach ($keys as $key) {
                        if (
                            isset($dictionary[$key]) &&
                            $dictionary[$key] !== 'null'
                        ) {
                            $array[$key] = $dictionary[$key];
                        }
                    }

                    return $array;
                };

                if (!empty($exists)) {
                    if ($data['update']) {
                        $wpdb->update(
                            "{$table}",
                            $get_array(
                                [
                                    'block_style_id',
                                    'prev_css_value',
                                    'css_value',
                                    'prev_fonts_value',
                                    'fonts_value',
                                ],
                                $dictionary,
                            ),
                            [
                                'block_style_id' => $id,
                            ],
                        );
                    } else {
                        $wpdb->update(
                            "{$table}",
                            $get_array(
                                [
                                    'block_style_id',
                                    'prev_css_value',
                                    'prev_fonts_value',
                                ],
                                $dictionary,
                            ),
                            ['block_style_id' => $id],
                        );
                    }
                } else {
                    if ($data['update']) {
                        $wpdb->insert(
                            "{$table}",
                            $get_array(
                                [
                                    'block_style_id',
                                    'prev_css_value',
                                    'css_value',
                                    'prev_fonts_value',
                                    'fonts_value',
                                ],
                                $dictionary,
                            ),
                        );
                    } else {
                        $wpdb->insert(
                            "{$table}",
                            $get_array(
                                [
                                    'block_style_id',
                                    'prev_css_value',
                                    'prev_fonts_value',
                                ],
                                $dictionary,
                            ),
                        );
                    }
                }
            }

            if ((bool) get_option('local_fonts')) {
                MaxiBlocks_Local_Fonts::register();
            }

            $updated_meta = [];

            if (isset($id) && $id) {
                $updated_meta = (array) $wpdb->get_results(
                    $wpdb->prepare(
                        "SELECT * FROM $table WHERE $where_clause",
                        $id,
                    ),
                    OBJECT,
                )[0];
            }

            return $updated_meta;
        }

        /**
         * Get the posts array with the info
         *
         * @return $posts JSON feed of returned objects
         */
        public function get_maxi_blocks_sc_string()
        {
            global $wpdb;

            $response = maybe_unserialize(
                $wpdb->get_var(
                    $wpdb->prepare(
                        "SELECT object FROM {$wpdb->prefix}maxi_blocks_general where id = %s",
                        'sc_string',
                    ),
                ),
            );

            if (!$response) {
                if (class_exists('MaxiBlocks_StyleCards')) {
                    $maxi_blocks_style_cards = new MaxiBlocks_StyleCards();
                    $maxi_blocks_style_cards->add_default_maxi_blocks_sc_string();
                    $response = maybe_unserialize(
                        $wpdb->get_var(
                            $wpdb->prepare(
                                "SELECT object FROM {$wpdb->prefix}maxi_blocks_general where id = %s",
                                'sc_string',
                            ),
                        ),
                    );
                } else {
                    $response = '';
                }
            }

            return $response;
        }

        /**
         * Post the posts
         */
        public function post_maxi_blocks_sc_string($data)
        {
            global $wpdb;
            $style_card = $this->get_maxi_blocks_sc_string();

            if ($data['update']) {
                $new_style_card = [
                    '_maxi_blocks_style_card' => $data['sc_variables'],
                    '_maxi_blocks_style_card_preview' => $data['sc_variables'],
                    '_maxi_blocks_style_card_styles' => $data['sc_styles'],
                    '_maxi_blocks_style_card_styles_preview' =>
                        $data['sc_styles'],
                ];
            } else {
                $new_style_card['_maxi_blocks_style_card_preview'] =
                    $data['sc_variables'];
                $new_style_card['_maxi_blocks_style_card_styles_preview'] =
                    $data['sc_styles'];

                if (
                    $style_card !== '' &&
                    array_key_exists('_maxi_blocks_style_card', $style_card)
                ) {
                    $new_style_card['_maxi_blocks_style_card'] =
                        $style_card['_maxi_blocks_style_card'];
                    if (
                        array_key_exists(
                            '_maxi_blocks_style_card_styles',
                            $style_card,
                        )
                    ) {
                        $new_style_card['_maxi_blocks_style_card_styles'] =
                            $style_card['_maxi_blocks_style_card_styles'];
                    }
                } else {
                    if (is_array($data)) {
                        $new_style_card['_maxi_blocks_style_card'] =
                            $data['sc_variables'];
                        if (array_key_exists('sc_styles', $data)) {
                            $new_style_card['_maxi_blocks_style_card_styles'] =
                                $data['sc_styles'];
                        }
                    } elseif ($data instanceof WP_REST_Request) {
                        if ($data->has_param('sc_variables')) {
                            $new_style_card[
                                '_maxi_blocks_style_card'
                            ] = $data->get_param('sc_variables');
                        }
                        if ($data->has_param('sc_styles')) {
                            $new_style_card[
                                '_maxi_blocks_style_card_styles'
                            ] = $data->get_param('sc_styles');
                        }
                    }
                }
            }

            $wpdb->replace("{$wpdb->prefix}maxi_blocks_general", [
                'id' => 'sc_string',
                'object' => serialize($new_style_card),
            ]);

            return $new_style_card;
        }

        public function get_maxi_blocks_breakpoints()
        {
            $breakpoints = json_decode(get_option('maxi_breakpoints'), true);

            if (!$breakpoints) {
                $default_breakpoints = [
                    'xs' => 480,
                    's' => 767,
                    'm' => 1024,
                    'l' => 1366,
                    'xl' => 1920,
                ];
                $breakpoints = $default_breakpoints;
                update_option('maxi_breakpoints', wp_json_encode($breakpoints));
            }

            return $breakpoints;
        }

        public function mb_delete_register($postId)
        {
            if (
                $this->check_if_legacy_code_needed('maxi_blocks_styles') ||
                $this->check_if_legacy_code_needed('maxi_blocks_custom_data')
            ) {
                global $wpdb;

                $wpdb->query(
                    $wpdb->prepare(
                        "DELETE FROM {$wpdb->prefix}maxi_blocks_styles WHERE post_id=%d",
                        $postId,
                    ),
                );
                $wpdb->query(
                    $wpdb->prepare(
                        "DELETE FROM {$wpdb->prefix}maxi_blocks_custom_data WHERE post_id=%d",
                        $postId,
                    ),
                );
            }
        }

        public function get_api_response($response)
        {
            // Retrieve information
            $response_code = wp_remote_retrieve_response_code($response);
            $response_message = wp_remote_retrieve_response_message($response);
            $response_body = wp_remote_retrieve_body($response);

            if (!is_wp_error($response)) {
                return new WP_REST_Response([
                    'status' => $response_code,
                    'response' => $response_message,
                    'body_response' => $response_body,
                ]);
            } else {
                return new WP_Error(
                    $response_code,
                    $response_message,
                    $response_body,
                );
            }
        }

        public function get_maxi_blocks_local_font_url($request)
        {
            if (!get_option('local_fonts')) {
                return false;
            }

            $font_name = $request['font_name'];

            $local_fonts = MaxiBlocks_Local_Fonts::get_instance();
            $font_name_sanitized = $local_fonts->sanitize_font_name($font_name);

            $font_path = '/maxi/fonts/' . $font_name_sanitized . '/style.css';
            $font_file = wp_upload_dir()['basedir'] . $font_path;
            $font_url = wp_upload_dir()['baseurl'] . $font_path;

            // Only process this specific font if it doesn't exist
            if (!file_exists($font_file)) {
                $local_fonts->process_single_font($font_name);
            }

            return trim($font_url, '"\'');
        }

        /**
         * Get current style cards with hash-based cache validation
         *
         * @param WP_REST_Request $request Request object with optional client_hash
         * @return array Response with style cards data and cache metadata
         */
        public function get_maxi_blocks_current_style_cards($request = null)
        {
            global $wpdb;

            $client_hash = $request ? $request->get_param('client_hash') : '';
            $table_name = $wpdb->prefix . 'maxi_blocks_general';

            $style_cards = $wpdb->get_var(
                $wpdb->prepare(
                    "SELECT object FROM {$wpdb->prefix}maxi_blocks_general where id = %s",
                    'style_cards_current',
                ),
            );

            if (!$style_cards || empty($style_cards)) {
                if (class_exists('MaxiBlocks_StyleCards')) {
                    $default_style_card = MaxiBlocks_StyleCards::get_default_style_card();
                } else {
                    return false;
                }

                $wpdb->replace($table_name, [
                    'id' => 'style_cards_current',
                    'object' => $default_style_card,
                ]);

                $style_cards = $wpdb->get_var(
                    $wpdb->prepare(
                        "SELECT object FROM {$wpdb->prefix}maxi_blocks_general where id = %s",
                        'style_cards_current',
                    ),
                );
            }

            // Generate hash for cache validation
            $server_hash = md5($style_cards . get_option('maxi_blocks_version', '1.0'));

            // If client hash matches, return not_modified response
            if ($client_hash !== '' && $client_hash === $server_hash) {
                return [
                    'status' => 'not_modified',
                    'message' => 'Style cards cache is up to date',
                    'hash' => $server_hash,
                ];
            }

            // Return style cards with hash for caching
            // Note: We wrap in an array for consistent response format
            return [
                'data' => $style_cards,
                'hash' => $server_hash,
            ];
        }

        public function reset_maxi_blocks_style_cards()
        {
            global $wpdb;
            $table_name = $wpdb->prefix . 'maxi_blocks_general'; // table name

            if (class_exists('MaxiBlocks_StyleCards')) {
                $default_style_card = MaxiBlocks_StyleCards::get_default_style_card();
            } else {
                return false;
            } // Should return an error

            $response = $wpdb->replace($table_name, [
                'id' => 'style_cards_current',
                'object' => $default_style_card,
            ]);

            $wpdb->delete("{$wpdb->prefix}maxi_blocks_general", [
                'id' => 'sc_string',
            ]);

            if (class_exists('MaxiBlocks_StyleCards')) {
                $maxi_blocks_style_cards = new MaxiBlocks_StyleCards();
                $maxi_blocks_style_cards->add_default_maxi_blocks_sc_string();
            }

            return $this->get_api_response($response);
        }

        public function set_maxi_blocks_current_style_cards($request)
        {
            global $wpdb;
            $table_name = $wpdb->prefix . 'maxi_blocks_general'; // table name

            $request_result = $request->get_json_params();

            $response = $wpdb->replace($table_name, [
                'id' => 'style_cards_current',
                'object' => $request_result['styleCards'],
            ]);

            return $this->get_api_response($response);
        }

        public function get_maxi_blocks_current_custom_data($id)
        {
            if ($this->check_if_legacy_code_needed('maxi_blocks_custom_data')) {
                if (gettype($id) === 'object') {
                    $id = $id['id'];
                }

                global $wpdb;
                $response = $wpdb->get_results(
                    $wpdb->prepare(
                        'SELECT custom_data_value FROM  ' .
                            $wpdb->prefix .
                            'maxi_blocks_custom_data WHERE post_id = %d',
                        $id,
                    ),
                    OBJECT,
                );

                if (!$response) {
                    $response = '';
                }

                return $response;
            }
        }

        public function set_maxi_blocks_current_custom_data(
            $data,
            $is_json = true
        ) {
            global $wpdb;

            $update = $data['update'];

            if (!is_string($data['data'])) {
                return null;
            }

            $dataArray = json_decode($data['data'], true);

            $processed_data = [];
            foreach ($dataArray as $key => $value) {
                $processed_data[$key] = wp_json_encode($value);
            }

            [
                'table' => $table,
                'id_key' => $id_key,
                'where_clause' => $where_clause,
            ] = $this->get_query_params('maxi_blocks_custom_data_blocks');
            ['table' => $styles_table] = $this->get_query_params(
                'maxi_blocks_styles_blocks',
            );

            foreach ($processed_data as $id => $data_val) {
                if (empty($data_val) || $data_val === '{}') {
                    $wpdb->update(
                        "{$styles_table}",
                        [
                            'prev_active_custom_data' => null,
                            'active_custom_data' => null,
                        ],
                        ["{$id_key}" => $id],
                    );

                    $wpdb->query(
                        $wpdb->prepare(
                            "DELETE FROM $table WHERE $where_clause",
                            $id,
                        ),
                    );

                    continue;
                }

                $exists = $wpdb->get_results(
                    $wpdb->prepare(
                        "SELECT * FROM $table WHERE $where_clause",
                        $id,
                    ),
                    OBJECT,
                );

                if ($update) {
                    $new_custom_data = $data_val;

                    $wpdb->update(
                        "{$styles_table}",
                        [
                            'prev_active_custom_data' => 1,
                            'active_custom_data' => 1,
                        ],
                        ["{$id_key}" => $id],
                    );

                    if (!empty($exists)) {
                        $old_custom_data = $exists[0]->custom_data_value;

                        $wpdb->update(
                            "{$table}",
                            [
                                'prev_custom_data_value' => $old_custom_data,
                                'custom_data_value' => $new_custom_data,
                            ],
                            ["{$id_key}" => $id],
                        );
                    } else {
                        $wpdb->insert("{$table}", [
                            $id_key => $id,
                            'prev_custom_data_value' => '',
                            'custom_data_value' => $new_custom_data,
                        ]);
                    }
                }
            }

            return $new_custom_data;
        }

        public function create_maxi_blocks_unique_id($request)
        {
            global $wpdb;

            $block_name = $request->get_param('block_name');

            if (!$block_name || $block_name === '') {
                return new WP_Error(
                    'no_block_name',
                    'No block name provided',
                    'no_block_name',
                );
            }

            $db_custom_prefix = 'maxi_blocks_';
            $db_css_table_name =
                $wpdb->prefix . $db_custom_prefix . 'styles_blocks';

            // Insert a new row
            $wpdb->insert(
                $db_css_table_name,
                [
                    'block_style_id' => 'temporary', // Temporary value
                ],
                ['%s'],
            );

            // Get the ID of the newly inserted row
            $new_id = $wpdb->insert_id;

            // Create the final block_style_id
            $block_style_id = $block_name . '-' . $new_id . '-u';

            // Update the newly inserted row with the final block_style_id
            $wpdb->update(
                $db_css_table_name,
                ['block_style_id' => $block_style_id], // data to update
                ['id' => $new_id], // where clause
                ['%s'], // data format
                ['%d'], // where format; '%d' stands for integer
            );

            return $block_style_id;
        }

        public function remove_maxi_blocks_unique_id($request)
        {
            global $wpdb;
            $unique_id = $request->get_param('unique_id');

            if (!$unique_id || $unique_id === '') {
                return false;
            }

            $db_custom_prefix = 'maxi_blocks_';
            $db_css_table_name =
                $wpdb->prefix . $db_custom_prefix . 'styles_blocks';
            $db_custom_data_table_name =
                $wpdb->prefix . $db_custom_prefix . 'custom_data_blocks';

            $wpdb->query('START TRANSACTION');

            $delete_css_table = $wpdb->delete($db_css_table_name, [
                'block_style_id' => $unique_id,
            ]);

            $delete_custom_data_table = $wpdb->delete(
                $db_custom_data_table_name,
                ['block_style_id' => $unique_id],
            );

            if (
                $delete_css_table !== false &&
                $delete_custom_data_table !== false
            ) {
                $wpdb->query('COMMIT');
            } else {
                $wpdb->query('ROLLBACK');
            }
            return true;
        }

        /**
         * Get all unique IDs from the database for cache initialization
         * Returns a flat array of all block_style_id values with pagination support
         *
         * @param WP_REST_Request $request Request object with pagination params
         * @return WP_REST_Response|array Response with unique IDs and metadata
         */
        public function get_all_maxi_blocks_unique_ids($request = null)
        {
            global $wpdb;

            // Extract pagination params from request
            $page = $request ? (int) $request->get_param('page') : 1;
            $per_page = $request ? (int) $request->get_param('per_page') : 1000;
            $client_hash = $request ? $request->get_param('client_hash') : '';

            $db_css_table_name = $wpdb->prefix . 'maxi_blocks_styles_blocks';

            // OPTIMIZATION: Use WordPress transient caching to reduce DB queries
            // Cache key includes pagination params for proper cache segregation
            $cache_key = self::UNIQUE_IDS_CACHE_KEY . "_page_{$page}_per_{$per_page}";
            $cached_results = get_transient($cache_key);

            // Also cache total count separately
            $total_count_cache_key = self::UNIQUE_IDS_CACHE_KEY . '_total_count';
            $total_count = get_transient($total_count_cache_key);

            // Generate server hash from total count for cache validation
            if ($total_count === false) {
                $total_count = (int) $wpdb->get_var(
                    $wpdb->prepare(
                        "SELECT COUNT(*) FROM {$db_css_table_name} WHERE block_style_id != %s",
                        'temporary'
                    )
                );
                set_transient($total_count_cache_key, $total_count, 3600);
            }

            $server_hash = md5($total_count . get_option('maxi_blocks_version', '1.0'));

            // If client hash matches server hash, return not_modified response
            // Note: We use 200 status instead of 304 because WordPress REST API doesn't
            // properly handle 304 responses with apiFetch
            if ($client_hash !== '' && $client_hash === $server_hash) {
                return [
                    'status' => 'not_modified',
                    'message' => 'Cache is up to date',
                    'hash' => $server_hash,
                ];
            }

            // Return cached results if available
            if ($cached_results !== false) {
                return [
                    'data' => $cached_results,
                    'page' => $page,
                    'per_page' => $per_page,
                    'total' => $total_count,
                    'total_pages' => (int) ceil($total_count / $per_page),
                    'hash' => $server_hash,
                    'cache' => 'HIT',
                ];
            }

            // Calculate offset for pagination
            $offset = ($page - 1) * $per_page;

            // Get paginated block_style_id values with optimized query
            // Using $wpdb->prepare() to prevent SQL injection
            $results = $wpdb->get_col(
                $wpdb->prepare(
                    "SELECT block_style_id FROM {$db_css_table_name}
                     WHERE block_style_id != %s
                     ORDER BY id ASC
                     LIMIT %d OFFSET %d",
                    'temporary',
                    $per_page,
                    $offset
                )
            );

            if (!$results) {
                $results = [];
            }

            // Cache for 1 hour (3600 seconds)
            set_transient($cache_key, $results, 3600);

            // Return response with metadata
            return [
                'data' => $results,
                'page' => $page,
                'per_page' => $per_page,
                'total' => $total_count,
                'total_pages' => (int) ceil($total_count / $per_page),
                'hash' => $server_hash,
                'cache' => 'MISS',
            ];
        }

        /**
         * Invalidate the uniqueIDs cache when posts are saved (optimized)
         * Only invalidates if the post could contain Maxi blocks
         *
         * @param int $post_id The post ID
         * @param WP_Post $post The post object
         */
        public function invalidate_unique_ids_cache_on_save($post_id, $post)
        {
            // Skip autosaves and revisions - they don't affect published content
            if (wp_is_post_autosave($post_id) || wp_is_post_revision($post_id)) {
                return;
            }

            // Only invalidate if post actually contains blocks
            // This prevents cache invalidation on non-Gutenberg posts
            if (!has_blocks($post->post_content)) {
                return;
            }

            // Check if post contains Maxi blocks specifically
            // This is more efficient than invalidating for all block-based posts
            if (strpos($post->post_content, 'wp:maxi-blocks/') !== false) {
                $this->invalidate_unique_ids_cache();
            }
        }

        /**
         * Invalidate the uniqueIDs cache when posts are deleted
         * This ensures the cache stays in sync with the database
         * Clears all pagination-related caches
         */
        public function invalidate_unique_ids_cache()
        {
            global $wpdb;

            // Delete the legacy non-paginated cache
            delete_transient(self::UNIQUE_IDS_CACHE_KEY);

            // Delete total count cache
            delete_transient(self::UNIQUE_IDS_CACHE_KEY . '_total_count');

            // Delete all paginated caches using SQL pattern matching
            // This is more efficient than tracking individual cache keys
            $wpdb->query(
                $wpdb->prepare(
                    "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s",
                    '_transient_' . self::UNIQUE_IDS_CACHE_KEY . '_page_%'
                )
            );
            $wpdb->query(
                $wpdb->prepare(
                    "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s",
                    '_transient_timeout_' . self::UNIQUE_IDS_CACHE_KEY . '_page_%'
                )
            );
        }

        /**
         * Enable gzip compression for MaxiBlocks REST API responses
         * This significantly reduces payload size for large responses
         *
         * @param bool $served Whether the request has already been served
         * @param WP_HTTP_Response $result Result to send to the client
         * @param WP_REST_Request $request Request used to generate the response
         * @param WP_REST_Server $server Server instance
         * @return bool Whether the request has been served
         */
        public function enable_rest_compression($served, $result, $request, $server)
        {
            // Only apply to MaxiBlocks API routes
            if (strpos($request->get_route(), '/maxi-blocks/') === false) {
                return $served;
            }

            // Check if client accepts gzip encoding
            $accept_encoding = isset($_SERVER['HTTP_ACCEPT_ENCODING']) ? $_SERVER['HTTP_ACCEPT_ENCODING'] : '';

            if (strpos($accept_encoding, 'gzip') !== false && function_exists('gzencode')) {
                // Get the response data
                $data = $result->get_data();
                $json = wp_json_encode($data);

                // Only compress if response is larger than 1KB
                if (strlen($json) > 1024) {
                    $compressed = gzencode($json, 6); // Compression level 6 is a good balance

                    if ($compressed !== false) {
                        // Set compression headers
                        header('Content-Encoding: gzip');
                        header('Content-Length: ' . strlen($compressed));
                        header('Content-Type: application/json; charset=UTF-8');
                        header('Vary: Accept-Encoding');

                        // Determine if this is an authenticated/privileged endpoint
                        // Most MaxiBlocks endpoints require edit_posts capability except /breakpoints
                        $is_public_endpoint = strpos($request->get_route(), '/breakpoints') !== false;
                        $is_authenticated = is_user_logged_in() && current_user_can('edit_posts');

                        // Set appropriate cache headers based on authentication and endpoint type
                        if ($is_public_endpoint && !$is_authenticated) {
                            // Public endpoint accessed without authentication: allow shared caching
                            $max_age = 3600; // 1 hour
                            header('Cache-Control: public, max-age=' . $max_age);
                            header('Expires: ' . gmdate('D, d M Y H:i:s', time() + $max_age) . ' GMT');
                        } elseif ($is_authenticated || !$is_public_endpoint) {
                            // Authenticated request or privileged endpoint: prevent shared caching
                            // Use private cache to allow browser caching but prevent proxy/CDN caching
                            header('Cache-Control: private, no-cache, must-revalidate');
                            header('Expires: 0');
                        }

                        // Output compressed data
                        echo $compressed;
                        return true;
                    }
                }
            }

            return $served;
        }

        public function get_active_integration_plugins()
        {
            $active_integration_plugins = [];

            if (class_exists('WooCommerce')) {
                $active_integration_plugins[] = 'woocommerce';
            }
            if (class_exists('ACF')) {
                $active_integration_plugins[] = 'acf';
            }

            return $active_integration_plugins;
        }

        // ACF

        public function get_acf_field_groups()
        {
            if (!class_exists('ACF')) {
                return [];
            }

            $acf_field_groups = get_posts([
                'post_type' => 'acf-field-group',
                'posts_per_page' => -1,
                'post_status' => 'publish',
            ]);

            $acf_field_groups = array_map(function ($acf_field_group) {
                return [
                    'id' => $acf_field_group->ID,
                    'title' => $acf_field_group->post_title,
                ];
            }, $acf_field_groups);

            return wp_json_encode($acf_field_groups);
        }

        public function get_acf_group_fields($request)
        {
            if (!class_exists('ACF')) {
                return [];
            }

            $group_id = $request['id'];
            $fields = acf_get_fields($group_id);

            $fields = array_map(function ($field) {
                return [
                    'id' => $field['key'],
                    'title' => $field['label'],
                    'type' => $field['type'],
                ];
            }, $fields);

            return wp_json_encode($fields);
        }

        public function get_acf_field_value($request)
        {
            if (!class_exists('ACF')) {
                return null;
            }

            $field_id = $request['field_id'];
            $post_id = $request['post_id'];

            // First, try to get the field as a post field
            $field = get_field_object($field_id, $post_id);

            // If no value found and the ID looks like it could be a term ID, try taxonomy contexts
            if ((!$field || empty($field['value'])) && is_numeric($post_id)) {
                // Try common taxonomy contexts
                $taxonomy_contexts = [
                    'category_' . $post_id, // Categories
                    'post_tag_' . $post_id, // Tags
                    'product_cat_' . $post_id, // WooCommerce product categories
                    'product_tag_' . $post_id, // WooCommerce product tags
                ];

                // Also try to get the actual term and use its taxonomy
                $term = get_term($post_id);
                if ($term && !is_wp_error($term)) {
                    $taxonomy_contexts[] = $term->taxonomy . '_' . $post_id;
                }

                foreach ($taxonomy_contexts as $context) {
                    $field = get_field_object($field_id, $context);
                    if ($field && !empty($field['value'])) {
                        break;
                    }
                }
            }

            if (is_array($field) && $field['type'] === 'image') {
                return wp_json_encode([
                    'value' => $field['value'],
                    'return_format' => $field['return_format'],
                ]);
            }

            if (is_array($field)) {
                return wp_json_encode($field['value']);
            }

            return null;
        }

        public function get_maxi_blocks_pro_status()
        {
            $pro = get_option('maxi_pro');
            $default = '{"status": "no", "name": ""}';

            if ($pro === false) {
                update_option('maxi_pro', $default);
                return $default;
            }
            return $pro;
        }

        public function set_maxi_blocks_pro_status($data)
        {
            $dataString = $data['data'];
            $dataType = gettype($dataString);
            if (get_option('maxi_pro')) {
                $oldData = json_decode(get_option('maxi_pro'));
            }

            if ($dataString) {
                update_option('maxi_pro', $dataString);
                return $dataString;
            }
            return false;
        }

        public function check_if_legacy_code_needed($tableName)
        {
            global $wpdb;
            $table_name = $wpdb->prefix . $tableName;
            if (
                $wpdb->get_var("SHOW TABLES LIKE '$table_name'") == $table_name
            ) {
                return true;
            } else {
                return false;
            }
        }

        /**
         * Get fonts for a specific block by unique ID
         *
         * @param WP_REST_Request $request Request object
         * @return WP_REST_Response|WP_Error Response object or WP_Error
         */
        public function get_maxi_blocks_fonts_by_id($request)
        {
            global $wpdb;
            $unique_id = $request->get_param('unique_id');

            if (!$unique_id || $unique_id === '') {
                return new WP_Error(
                    'no_unique_id',
                    'No block unique ID provided',
                    ['status' => 400],
                );
            }

            $fonts = $wpdb->get_row(
                $wpdb->prepare(
                    "SELECT fonts_value
                    FROM {$wpdb->prefix}maxi_blocks_styles_blocks
                    WHERE block_style_id = %s",
                    $unique_id,
                ),
                ARRAY_A,
            );

            if (!$fonts) {
                return new WP_Error(
                    'no_fonts_found',
                    'No fonts found for this block ID',
                    ['status' => 404],
                );
            }

            return $fonts['fonts_value'];
        }


        public function is_block_theme()
        {
            return wp_is_block_theme();
        }

        public function get_theme_type()
        {
            $current_theme = wp_get_theme();
            $maxiblocks_go_theme = wp_get_theme('maxiblocks-go');

            return rest_ensure_response([
                'isBlockTheme' => $this->is_block_theme(),
                'themeName' => $current_theme->get('Name'),
                'isMaxiBlocksGoInstalled' => $maxiblocks_go_theme->exists(),
                'themeActivateNonce' => wp_create_nonce(
                    'switch-theme_maxiblocks-go',
                ),
            ]);
        }

        public function install_maxiblocks_go_theme()
        {
            require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
            require_once ABSPATH . 'wp-admin/includes/theme-install.php';

            // Check if theme is already installed
            $theme = wp_get_theme('maxiblocks-go');

            if (!$theme->exists()) {
                // Get theme information from WordPress.org
                $api = themes_api('theme_information', [
                    'slug' => 'maxiblocks-go',
                ]);

                if (is_wp_error($api)) {
                    return rest_ensure_response([
                        'success' => false,
                        'message' => $api->get_error_message(),
                    ]);
                }

                // Install the theme
                $upgrader = new Theme_Upgrader(new WP_Ajax_Upgrader_Skin());
                $installed = $upgrader->install($api->download_link);

                if (is_wp_error($installed)) {
                    return rest_ensure_response([
                        'success' => false,
                        'message' => $installed->get_error_message(),
                    ]);
                }
            }

            // Activate the theme
            $activated = switch_theme('maxiblocks-go');

            if (is_wp_error($activated)) {
                return rest_ensure_response([
                    'success' => false,
                    'message' => $activated->get_error_message(),
                ]);
            }

            // Clear any caches
            wp_clean_themes_cache();

            return rest_ensure_response([
                'success' => true,
                'message' => __(
                    'MaxiBlocks Go theme has been installed and activated successfully.',
                    'maxi-blocks',
                ),
                'isBlockTheme' => true,
                'themeName' => 'MaxiBlocks Go',
                'isMaxiBlocksGoInstalled' => true,
            ]);
        }

        public function install_wordpress_importer()
        {
            require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
            require_once ABSPATH . 'wp-admin/includes/plugin-install.php';

            // Check if plugin is already installed
            $installed = file_exists(
                WP_PLUGIN_DIR . '/wordpress-importer/wordpress-importer.php',
            );

            if (!$installed) {
                // Get plugin information from WordPress.org
                $api = plugins_api('plugin_information', [
                    'slug' => 'wordpress-importer',
                ]);

                if (is_wp_error($api)) {
                    return rest_ensure_response([
                        'success' => false,
                        'message' => $api->get_error_message(),
                    ]);
                }

                // Install the plugin
                $upgrader = new Plugin_Upgrader(new WP_Ajax_Upgrader_Skin());
                $installed = $upgrader->install($api->download_link);

                if (is_wp_error($installed)) {
                    return rest_ensure_response([
                        'success' => false,
                        'message' => $installed->get_error_message(),
                    ]);
                }
            }

            // Activate the plugin
            $activated = activate_plugin(
                'wordpress-importer/wordpress-importer.php',
            );

            if (is_wp_error($activated)) {
                return rest_ensure_response([
                    'success' => false,
                    'message' => $activated->get_error_message(),
                ]);
            }

            return rest_ensure_response([
                'success' => true,
                'message' => __(
                    'WordPress Importer has been installed and activated successfully.',
                    'maxi-blocks',
                ),
                'status' => 'active',
            ]);
        }



    }
endif;
