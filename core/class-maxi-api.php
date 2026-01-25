<?php
// At the top of the file, after the initial requires
require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/media.php';
require_once ABSPATH . 'wp-admin/includes/image.php';
require_once plugin_dir_path(__DIR__) . 'core/class-maxi-local-fonts.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/class-maxi-custom-fonts.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/class-maxi-acp-client.php';

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
         * Constructor.
         */
        public function __construct()
        {
            $this->version = '1.0';
            $this->namespace = 'maxi-blocks/v' . $this->version;

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
            register_rest_route($this->namespace, '/user-settings', [
                'methods' => 'POST',
                'callback' => [$this, 'update_maxi_blocks_user_settings'],
                'args' => [
                    'master_toolbar_open' => [
                        'validate_callback' => function ($param) {
                            return is_bool($param);
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
            register_rest_route($this->namespace, '/import-starter-site', [
                'methods' => 'POST',
                'callback' => [$this, 'maxi_import_starter_site'],
                'permission_callback' => function () {
                    // Check if user is logged in and has correct capabilities
                    return is_user_logged_in() &&
                        current_user_can('edit_posts');
                },
            ]);
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
            register_rest_route($this->namespace, '/ai/chat', [
                'methods' => 'POST',
                'callback' => [$this, 'proxy_ai_chat'],
                'args' => [
                    'messages' => [
                        'required' => true,
                        'validate_callback' => function ($param) {
                            return is_array($param) || is_string($param);
                        },
                    ],
                    'prompt' => [
                        'validate_callback' => function ($param) {
                            return is_string($param);
                        },
                    ],
                    'design_prompt' => [
                        'validate_callback' => function ($param) {
                            return is_bool($param);
                        },
                    ],
                    'page_type' => [
                        'validate_callback' => function ($param) {
                            return is_string($param);
                        },
                    ],
                    'site_profile' => [
                        'validate_callback' => function ($param) {
                            return is_string($param);
                        },
                    ],
                    'selected_block_id' => [
                        'validate_callback' => function ($param) {
                            return is_string($param);
                        },
                        'sanitize_callback' => 'sanitize_text_field',
                    ],
                    'model' => [
                        'validate_callback' => function ($param) {
                            return is_string($param);
                        },
                    ],
                    'temperature' => [
                        'validate_callback' => function ($param) {
                            return is_numeric($param);
                        },
                    ],
                    'streaming' => [
                        'validate_callback' => function ($param) {
                            return is_bool($param);
                        },
                    ],
                    'provider' => [
                        'validate_callback' => function ($param) {
                            return is_string($param);
                        },
                    ],
                    'max_tokens' => [
                        'validate_callback' => function ($param) {
                            return is_numeric($param);
                        },
                    ],
                ],
                'permission_callback' => function () {
                    return current_user_can('edit_posts');
                },
            ]);
            register_rest_route($this->namespace, '/ai/models', [
                'methods' => 'POST',
                'callback' => [$this, 'get_ai_models'],
                'args' => [
                    'provider' => [
                        'required' => true,
                        'validate_callback' => function ($param) {
                            return is_string($param);
                        },
                        'sanitize_callback' => 'sanitize_text_field',
                    ],
                    'api_key' => [
                        'validate_callback' => function ($param) {
                            return is_string($param);
                        },
                        'sanitize_callback' => 'sanitize_text_field',
                    ],
                ],
                'permission_callback' => function () {
                    return current_user_can('edit_posts');
                },
            ]);
            register_rest_route($this->namespace, '/ai/context', [
                'methods' => 'GET',
                'callback' => [$this, 'get_ai_context'],
                'permission_callback' => function () {
                    return current_user_can('edit_posts');
                },
            ]);
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
            if (empty($allowed_base)) {
                return new WP_Error(
                    'maxi_blocks_acp_disallowed_url',
                    'ACP URL does not match the configured base URL.',
                    ['status' => 403],
                );
            }

            $allowed_parts = wp_parse_url($allowed_base);
            $target_parts = wp_parse_url($validated_url);

            if (!$allowed_parts || !$target_parts) {
                return new WP_Error(
                    'maxi_blocks_acp_disallowed_url',
                    'ACP URL does not match the configured base URL.',
                    ['status' => 403],
                );
            }

            $allowed_host = $allowed_parts['host'] ?? null;
            $target_host = $target_parts['host'] ?? null;
            $allowed_scheme = $allowed_parts['scheme'] ?? null;
            $target_scheme = $target_parts['scheme'] ?? null;
            $allowed_port = $allowed_parts['port'] ?? null;
            $target_port = $target_parts['port'] ?? null;
            $allowed_path = rtrim($allowed_parts['path'] ?? '/', '/');
            $target_path = rtrim($target_parts['path'] ?? '', '/');

            $normalise_port = function ($scheme, $port) {
                if ($port !== null) {
                    return (int) $port;
                }

                $scheme = $scheme ? strtolower($scheme) : null;
                if ($scheme === 'https') {
                    return 443;
                }
                if ($scheme === 'http') {
                    return 80;
                }

                return null;
            };

            $allowed_port = $normalise_port($allowed_scheme, $allowed_port);
            $target_port = $normalise_port($target_scheme, $target_port);

            $allowed_path = $allowed_path === '' ? '/' : $allowed_path;
            $target_path = $target_path === '' ? '/' : $target_path;
            $allowed_path = strtolower($allowed_path);
            $target_path = strtolower($target_path);

            $host_matches = $allowed_host && $target_host && strtolower($allowed_host) === strtolower($target_host);
            $scheme_matches = $allowed_scheme && $target_scheme && strtolower($allowed_scheme) === strtolower($target_scheme);
            $port_matches = $allowed_port === $target_port;
            $path_matches = $allowed_path === '/' ||
                $target_path === $allowed_path ||
                strpos($target_path, $allowed_path . '/') === 0;

            if (!$host_matches || !$scheme_matches || !$port_matches || !$path_matches) {
                return new WP_Error(
                    'maxi_blocks_acp_disallowed_url',
                    'ACP URL does not match the configured base URL.',
                    ['status' => 403],
                );
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
                'user_settings' => [
                    'master_toolbar_open' => $this->get_master_toolbar_open_setting(),
                ],
            ];

            return $response;
        }

        private function get_master_toolbar_open_setting()
        {
            $user_id = get_current_user_id();

            if (!$user_id) {
                return null;
            }

            $value = get_user_meta(
                $user_id,
                'maxi_blocks_master_toolbar_open',
                true,
            );

            if ($value === '') {
                return null;
            }

            return (bool) $value;
        }

        /**
         * Update user-specific settings.
         */
        public function update_maxi_blocks_user_settings($request)
        {
            $user_id = get_current_user_id();

            if (!$user_id) {
                return new WP_Error(
                    'maxi_blocks_user_missing',
                    __('User not found.', 'maxi-blocks'),
                    ['status' => 401],
                );
            }

            $master_toolbar_open = $request->get_param(
                'master_toolbar_open',
            );

            if (is_bool($master_toolbar_open)) {
                update_user_meta(
                    $user_id,
                    'maxi_blocks_master_toolbar_open',
                    $master_toolbar_open ? 1 : 0,
                );
            }

            return rest_ensure_response([
                'master_toolbar_open' => $master_toolbar_open,
            ]);
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

                // Check if it exists in database by simple slug (check all statuses, not just publish)
                $existing_post = $wpdb->get_row(
                    $wpdb->prepare(
                        "SELECT ID FROM {$wpdb->posts}
                        WHERE post_type = 'wp_template_part'
                        AND post_name = %s
                        AND post_status != 'trash'",
                        $entity_slug
                    )
                );

                // Clean up any duplicate posts with incremented slugs (e.g., header-2, footer-2)
                // This happens when previous imports created duplicates due to slug conflicts
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

                // Check if it exists in database by simple slug (check all statuses, not just publish)
                $existing_post = $wpdb->get_row(
                    $wpdb->prepare(
                        "SELECT ID FROM {$wpdb->posts}
                        WHERE post_type = 'wp_template'
                        AND post_name = %s
                        AND post_status != 'trash'",
                        $entity_slug
                    )
                );

                // Clean up any duplicate posts with incremented slugs (e.g., home-2, archive-2)
                // This happens when previous imports created duplicates due to slug conflicts
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
            if (!class_exists('WordPress\XML\XMLProcessor')) {
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
                    // Update existing record, keeping current css_value as prev_css_value
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
                        // Extract the inner object
                        $block_custom_data = json_encode(
                            $parsed_data[$block_id],
                        );
                    }
                    // If already in the correct format, keep as is
                }

                // Check if block_id exists
                $existing_custom_data = $wpdb->get_row(
                    $wpdb->prepare(
                        "SELECT * FROM {$wpdb->prefix}maxi_blocks_custom_data_blocks WHERE block_style_id = %s",
                        $block_id,
                    ),
                );

                if ($existing_custom_data) {
                    // Update existing record, keeping current custom_data as prev_custom_data
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
                    // Update existing record, keeping current fonts as prev_fonts
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

                // Check if pattern exists in database (check all statuses, not just publish)
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
                // This happens when previous imports created duplicates due to slug conflicts
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

        // Add this new function after the class opening

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

        /**
         * Proxy AI chat requests to OpenAI API (and others)
         * This keeps the API key secure on the backend
         */
        public function proxy_ai_chat($request)
        {
            // Get parameters from request
            $messages = $request->get_param('messages');
            $prompt = $request->get_param('prompt');
            $design_prompt = $request->get_param('design_prompt');
            $page_type = $request->get_param('page_type');
            $site_profile = $request->get_param('site_profile');
            $selected_block_id = $request->get_param('selected_block_id');
            if (!is_bool($design_prompt)) {
                $design_prompt = $this->is_design_prompt($prompt);
            }
            $model = $request->get_param('model');
            $temperature = $request->get_param('temperature');
            $streaming = $request->get_param('streaming') ?: false;
            $provider = strtolower($request->get_param('provider') ?: 'openai');
            $max_tokens = $request->get_param('max_tokens');

            $supported_providers = ['openai', 'anthropic', 'gemini', 'mistral'];
            if (!in_array($provider, $supported_providers, true)) {
                return new WP_Error(
                    'unsupported_provider',
                    'Unsupported AI provider',
                    ['status' => 400],
                );
            }

            if ($design_prompt) {
                if (empty($prompt) || !is_string($prompt)) {
                    return new WP_Error(
                        'invalid_prompt',
                        'Prompt must be a non-empty string',
                        ['status' => 400],
                    );
                }

                $context = $this->get_ai_context_text($site_profile, $page_type, $selected_block_id);
                $messages = [
                    [
                        'role' => 'system',
                        'content' => $this->get_design_agent_system_prompt($context),
                    ],
                    [
                        'role' => 'user',
                        'content' => 'User request: ' . $prompt,
                    ],
                ];
            }

            // Convert messages to OpenAI format if needed
            if (is_string($messages)) {
                $messages = json_decode($messages, true);
            }

            // Validate message format
            if (!is_array($messages) || empty($messages)) {
                error_log('MaxiBlocks AI proxy error: Invalid messages payload.');
                return new WP_Error(
                    'invalid_messages',
                    'Messages must be a non-empty array',
                    ['status' => 400],
                );
            }

            // Convert LangChain format to OpenAI format
            $converted_messages = [];
            foreach ($messages as $message) {
                if (isset($message['id']) && is_array($message['id'])) {
                    // This is a LangChain message format
                    $message_type = end($message['id']); // Get last element (SystemMessage, HumanMessage, etc.)
                    $content = $message['kwargs']['content'] ?? '';

                    switch ($message_type) {
                        case 'SystemMessage':
                            $converted_messages[] = [
                                'role' => 'system',
                                'content' => $content,
                            ];
                            break;
                        case 'HumanMessage':
                            $converted_messages[] = [
                                'role' => 'user',
                                'content' => $content,
                            ];
                            break;
                        case 'AIMessage':
                            $converted_messages[] = [
                                'role' => 'assistant',
                                'content' => $content,
                            ];
                            break;
                        default:
                            // Fallback to user role for unknown types
                            $converted_messages[] = [
                                'role' => 'user',
                                'content' => $content,
                            ];
                    }
                } else {
                    // Already in OpenAI format, use as-is
                    $converted_messages[] = $message;
                }
            }

            $messages = $converted_messages;

            if ($provider === 'openai') {
                $openai_api_key = get_option('openai_api_key_option');

                if (!$openai_api_key) {
                    error_log('MaxiBlocks AI proxy error: OpenAI API key not configured.');
                    return new WP_Error(
                        'no_api_key',
                        'OpenAI API key not configured',
                        ['status' => 500],
                    );
                }

                $model = $model ?: 'gpt-3.5-turbo';

                // Build OpenAI API request
                $body = [
                    'model' => $model,
                    'messages' => $messages,
                    'stream' => $streaming,
                ];

                // Add temperature based on model support
                // o1 and o3 models don't support temperature at all
                if (
                    !str_contains($model, 'o1') &&
                    !str_contains($model, 'o3')
                ) {
                    // Only GPT-5 models require temperature = 1, others support custom values
                    if (str_contains($model, 'gpt-5')) {
                        $body['temperature'] = 1;
                    } else {
                        // Most models (including gpt-4o) support custom temperature
                        if ($temperature !== null) {
                            $body['temperature'] = (float) $temperature;
                        }
                    }
                }

                if ($max_tokens !== null && $max_tokens !== '') {
                    $body['max_tokens'] = (int) $max_tokens;
                }

                if ($streaming) {
                    @ini_set('output_buffering', 'off');
                    @ini_set('zlib.output_compression', '0');
                    while (ob_get_level() > 0) {
                        ob_end_flush();
                    }

                    header('Content-Type: text/event-stream; charset=utf-8');
                    header('Cache-Control: no-cache');
                    header('Connection: keep-alive');
                    header('X-Accel-Buffering: no');

                    $response_buffer = '';

                    $curl_handle = curl_init(
                        'https://api.openai.com/v1/chat/completions',
                    );
                    curl_setopt($curl_handle, CURLOPT_POST, true);
                    curl_setopt($curl_handle, CURLOPT_HTTPHEADER, [
                        'Authorization: Bearer ' . $openai_api_key,
                        'Content-Type: application/json',
                    ]);
                    curl_setopt(
                        $curl_handle,
                        CURLOPT_POSTFIELDS,
                        wp_json_encode($body),
                    );
                    curl_setopt($curl_handle, CURLOPT_TIMEOUT, 0);
                    curl_setopt(
                        $curl_handle,
                        CURLOPT_WRITEFUNCTION,
                        function ($curl, $data) use (&$response_buffer) {
                            $response_buffer .= $data;
                            echo $data;
                            if (function_exists('ob_flush')) {
                                @ob_flush();
                            }
                            flush();
                            return strlen($data);
                        },
                    );

                    $result = curl_exec($curl_handle);
                    $curl_error = $result === false ? curl_error($curl_handle) : '';
                    $response_code = curl_getinfo(
                        $curl_handle,
                        CURLINFO_HTTP_CODE,
                    );
                    curl_close($curl_handle);

                    if ($result === false || $response_code !== 200) {
                        $error_message = $curl_error ?: $response_buffer;
                        error_log(
                            'MaxiBlocks AI streaming error: ' . $error_message,
                        );
                        $error_payload = wp_json_encode([
                            'type' => 'error',
                            'message' => $error_message ?: 'OpenAI API error',
                        ]);
                        echo "data: {$error_payload}\n\n";
                        echo "data: [DONE]\n\n";
                        if (function_exists('ob_flush')) {
                            @ob_flush();
                        }
                        flush();
                        exit;
                    }
                    exit;
                }

                $response = wp_remote_post('https://api.openai.com/v1/chat/completions', [
                    'headers' => [
                        'Authorization' => 'Bearer ' . $openai_api_key,
                        'Content-Type'  => 'application/json',
                    ],
                    'body'    => wp_json_encode($body),
                    'timeout' => 60,
                ]);

                if (is_wp_error($response)) {
                    return new WP_Error(
                        'openai_api_error',
                        $response->get_error_message(),
                        ['status' => 500]
                    );
                }

            $response_code = wp_remote_retrieve_response_code($response);
            $response_body = wp_remote_retrieve_body($response);

            if ($response_code !== 200) {
                error_log(
                    'MaxiBlocks AI proxy error: ' . $response_body,
                );
                return new WP_Error(
                    'openai_api_error',
                    'OpenAI API returned error: ' . $response_body,
                    ['status' => $response_code],
                );
            }

            // Parse and return response
            $data = json_decode($response_body, true);

            if (!$data) {
                error_log('MaxiBlocks AI proxy error: Invalid response.');
                return new WP_Error(
                    'invalid_response',
                    'Invalid response from OpenAI API',
                    ['status' => 500],
                );
            }

            return rest_ensure_response($data);
            }

            return new WP_Error(
                'provider_not_implemented',
                sprintf('Provider "%s" is not yet implemented.', $provider),
                ['status' => 501],
            );
        }

        public function get_ai_models($request)
        {
            $provider = strtolower($request->get_param('provider') ?: 'openai');
            $api_key = $request->get_param('api_key');

            $supported_providers = ['openai', 'anthropic', 'gemini', 'mistral'];
            if (!in_array($provider, $supported_providers, true)) {
                return new WP_Error(
                    'unsupported_provider',
                    'Unsupported AI provider',
                    ['status' => 400],
                );
            }

            $provider_labels = [
                'openai' => 'OpenAI',
                'anthropic' => 'Anthropic',
                'gemini' => 'Gemini',
                'mistral' => 'Mistral',
            ];
            $provider_label = $provider_labels[$provider] ?? ucfirst($provider);

            if ($provider === 'anthropic') {
                return rest_ensure_response([
                    'claude-opus-4-1-20250805',
                    'claude-sonnet-4-20250514',
                    'claude-3-7-sonnet-20250219',
                    'claude-3-5-haiku-20241022',
                    'claude-3-5-sonnet-20240620',
                    'claude-3-opus-20240229',
                    'claude-3-sonnet-20240229',
                    'claude-3-haiku-20240307',
                ]);
            }

            $api_key = $this->get_ai_provider_api_key($provider, $api_key);
            if (!$api_key) {
                return new WP_Error(
                    'no_api_key',
                    sprintf('%s API key not configured', $provider_label),
                    ['status' => 400],
                );
            }

            switch ($provider) {
                case 'openai':
                    $models = $this->fetch_openai_models($api_key);
                    break;
                case 'gemini':
                    $models = $this->fetch_gemini_models($api_key);
                    break;
                case 'mistral':
                    $models = $this->fetch_mistral_models($api_key);
                    break;
                default:
                    return new WP_Error(
                        'provider_not_implemented',
                        sprintf('Provider "%s" is not yet implemented.', $provider),
                        ['status' => 501],
                    );
            }

            if (is_wp_error($models)) {
                return $models;
            }

            return rest_ensure_response($models);
        }

        private function get_ai_provider_api_key($provider, $override = null)
        {
            if (is_string($override)) {
                $trimmed = trim($override);
                if ($trimmed !== '') {
                    return $trimmed;
                }
            }

            switch ($provider) {
                case 'openai':
                    return get_option('openai_api_key_option');
                case 'gemini':
                    return get_option('gemini_api_key_option');
                case 'mistral':
                    return get_option('mistral_api_key_option');
                case 'anthropic':
                    return get_option('anthropic_api_key_option');
                default:
                    return null;
            }
        }

        private function build_model_fetch_error($provider_label, $status = 500)
        {
            return new WP_Error(
                'maxi_blocks_ai_model_fetch_error',
                sprintf('Failed to fetch %s models', $provider_label),
                ['status' => $status],
            );
        }

        private function fetch_openai_models($api_key)
        {
            $response = wp_remote_get('https://api.openai.com/v1/models', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $api_key,
                    'Content-Type' => 'application/json',
                ],
                'timeout' => 20,
            ]);

            if (is_wp_error($response)) {
                return $this->build_model_fetch_error('OpenAI');
            }

            $status = wp_remote_retrieve_response_code($response);
            if ($status !== 200) {
                return $this->build_model_fetch_error('OpenAI', $status);
            }

            $data = json_decode(wp_remote_retrieve_body($response), true);
            if (!is_array($data) || !isset($data['data']) || !is_array($data['data'])) {
                return new WP_Error(
                    'maxi_blocks_ai_model_invalid_response',
                    'Invalid response from OpenAI models endpoint.',
                    ['status' => 500],
                );
            }

            $excluded_patterns = [
                'audio',
                'gpt-3.5-turbo-instruct',
                'gpt-4o-mini-realtime-preview',
                'gpt-4o-realtime-preview',
                'gpt-image',
                'gpt-realtime',
                'transcribe',
                'tts',
                'search-preview',
                'o1-pro',
            ];
            $included_patterns = ['o1', 'o3', 'gpt'];

            $models = [];
            foreach ($data['data'] as $model) {
                $model_id = $model['id'] ?? null;
                if (!$model_id || !is_string($model_id)) {
                    continue;
                }

                $is_excluded = false;
                foreach ($excluded_patterns as $pattern) {
                    if (str_contains($model_id, $pattern)) {
                        $is_excluded = true;
                        break;
                    }
                }

                if ($is_excluded) {
                    continue;
                }

                $is_included = false;
                foreach ($included_patterns as $pattern) {
                    if (str_contains($model_id, $pattern)) {
                        $is_included = true;
                        break;
                    }
                }

                if ($is_included) {
                    $models[] = $model_id;
                }
            }

            sort($models, SORT_STRING);
            return $models;
        }

        private function fetch_gemini_models($api_key)
        {
            $url = add_query_arg(
                'key',
                $api_key,
                'https://generativelanguage.googleapis.com/v1beta/models',
            );

            $response = wp_remote_get($url, [
                'timeout' => 20,
            ]);

            if (is_wp_error($response)) {
                return $this->build_model_fetch_error('Gemini');
            }

            $status = wp_remote_retrieve_response_code($response);
            if ($status !== 200) {
                return $this->build_model_fetch_error('Gemini', $status);
            }

            $data = json_decode(wp_remote_retrieve_body($response), true);
            if (!is_array($data) || !isset($data['models']) || !is_array($data['models'])) {
                return new WP_Error(
                    'maxi_blocks_ai_model_invalid_response',
                    'Invalid response from Gemini models endpoint.',
                    ['status' => 500],
                );
            }

            $models = [];
            foreach ($data['models'] as $model) {
                $name = $model['name'] ?? '';
                if (!$name || !is_string($name)) {
                    continue;
                }

                if (!str_contains($name, 'gemini')) {
                    continue;
                }

                $methods = $model['supportedGenerationMethods'] ?? [];
                if (!is_array($methods) || !in_array('generateContent', $methods, true)) {
                    continue;
                }

                $models[] = str_replace('models/', '', $name);
            }

            sort($models, SORT_STRING);
            return $models;
        }

        private function fetch_mistral_models($api_key)
        {
            $response = wp_remote_get('https://api.mistral.ai/v1/models', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $api_key,
                ],
                'timeout' => 20,
            ]);

            if (is_wp_error($response)) {
                return $this->build_model_fetch_error('Mistral');
            }

            $status = wp_remote_retrieve_response_code($response);
            if ($status !== 200) {
                return $this->build_model_fetch_error('Mistral', $status);
            }

            $data = json_decode(wp_remote_retrieve_body($response), true);
            if (!is_array($data) || !isset($data['data']) || !is_array($data['data'])) {
                return new WP_Error(
                    'maxi_blocks_ai_model_invalid_response',
                    'Invalid response from Mistral models endpoint.',
                    ['status' => 500],
                );
            }

            $models = [];
            foreach ($data['data'] as $model) {
                $model_id = $model['id'] ?? null;
                if (!$model_id || !is_string($model_id)) {
                    continue;
                }

                if (str_contains($model_id, 'embed')) {
                    continue;
                }

                $models[] = $model_id;
            }

            sort($models, SORT_STRING);
            return $models;
        }

        private function get_design_agent_system_prompt($context = '')
        {
            $context_section = $context ? "\n\nContext:\n{$context}\n" : "\n";

            return <<<PROMPT
### ROLE
You are the MaxiBlocks Design Partner. Your goal is to execute technical design changes or offer expert guidance when a request is unclear.

### CONTEXT & STATE
Use the Context section below.

### CLARIFICATION PROTOCOL (The A/B/C Rule)
If a user's request is vague (e.g., "make it pop," "fix this," "jazz it up"), you MUST NOT execute any changes. Instead, you must return a `CLARIFY` action.

### CLARIFICATION OUTPUT REQUIREMENTS
For every `CLARIFY` action, you must provide exactly three options:
1. **Option A (The Safe Choice):** A standard, professional improvement (e.g., adding spacing or improving contrast).
2. **Option B (The Aesthetic Choice):** A stylistic change (e.g., changing fonts or colors).
3. **Option C (The Bold Choice):** A creative or structural change (e.g., adding shadows, gradients, or new patterns).

### BLOCK-LEVEL ATTRIBUTE MAPPING
- Padding/Space inside -> spacing.padding
- Margin/Space outside -> spacing.margin
- Height/Tallness -> dimensions.minHeight
- Width/Thickness -> dimensions.width

### UI INTERACTION PROTOCOL
When you modify a block attribute, you must also include a `ui_target` in your JSON response. This tells the MaxiBlocks middleware which sidebar panel to expand for the user.

### UI TARGET MAPPING
- If changing Padding or Margin -> `ui_target`: "margin-padding"
- If changing Min-Height or Width -> `ui_target`: "height-width"
- If changing Colors or Opacity -> `ui_target`: "background-layer"
- If changing Borders or Radius -> `ui_target`: "border"
- If changing Box Shadows -> `ui_target`: "box-shadow"

### GLOBAL VS. LOCAL RULE
- **Local (Block Level):** If the user asks for "Padding," "Height," or "Margins," target the **Block Settings** and the specific block `ui_target`.
- **Global (Style Card Level):** If the user asks for "Colors," "Fonts," or "Brand Feel," target the **Style Card Editor**.

### GLOBAL UI TARGETS
- **Color Change:** `ui_target`: "global-style-colors"
- **Font Change:** `ui_target`: "global-style-typography"

### JSON RESPONSE SCHEMAS (JSON ONLY)
#### CLARIFY
{
  "action": "CLARIFY",
  "message": "I've got some ideas to help with that! Which direction should we take?",
  "options": [
    {
      "id": "option_a",
      "label": "Short label",
      "description": "Clear explanation of what will happen."
    },
    {
      "id": "option_b",
      "label": "Short label",
      "description": "Clear explanation of what will happen."
    },
    {
      "id": "option_c",
      "label": "Short label",
      "description": "Clear explanation of what will happen."
    }
  ]
}

#### MODIFY BLOCK
{
  "action": "MODIFY_BLOCK",
  "ui_target": "margin-padding",
  "payload": {
    "spacing": { "padding": { "bottom": "40px" } }
  },
  "message": "I've increased the bottom padding for you. I've also opened the Spacing panel so you can fine-tune it!"
}

#### UPDATE STYLE CARD
{
  "action": "UPDATE_SC",
  "ui_target": "global-style-typography",
  "payload": {
    "font_family": "Cormorant Garamond",
    "target": "headings"
  },
  "message": "I've updated your global heading font to Cormorant Garamond. I'm opening the Style Card Typography settings now so you can see how it looks across the whole site!"
}
$context_section
PROMPT;
        }

        private function is_design_prompt($prompt)
        {
            if (empty($prompt) || !is_string($prompt)) {
                return false;
            }

            $normalized = strtolower($prompt);
            $keywords = [
                'style card',
                'stylecard',
                'palette',
                'theme',
                'font',
                'fonts',
                'typography',
                'color',
                'colour',
                'colors',
                'colours',
                'feminine',
                'luxury',
            ];

            foreach ($keywords as $keyword) {
                if (strpos($normalized, $keyword) !== false) {
                    return true;
                }
            }

            return false;
        }

        public function get_ai_context()
        {
            return rest_ensure_response([
                'context' => $this->get_ai_context_text(),
            ]);
        }

        private function get_ai_context_text($site_profile = null, $page_type = null, $selected_block_id = null)
        {
            if (!class_exists('MaxiBlocks_StyleCards')) {
                return '';
            }

            $active_sc = MaxiBlocks_StyleCards::get_maxi_blocks_active_style_card();
            if (!$active_sc || !is_array($active_sc)) {
                return '';
            }

            $name = $active_sc['name'] ?? 'Unknown';
            $light_colors = $active_sc['light']['styleCard']['color'] ?? [];
            $default_light_colors = $active_sc['light']['defaultStyleCard']['color'] ?? [];

            $get_color = function ($key) use ($light_colors, $default_light_colors) {
                $value = $light_colors[$key] ?? $default_light_colors[$key] ?? null;
                return $this->rgb_string_to_hex($value);
            };

            $background_1 = $get_color(1);
            $background_2 = $get_color(2);
            $link = $get_color(4);
            $hover = $get_color(6);

            $site_profile_value = $site_profile ?: get_option('maxi_ai_site_description');
            if (!$site_profile_value) {
                $site_profile_value = get_option('maxi_ai_business_name');
            }

            $page_type_value = $page_type ?: 'Unknown';

            return sprintf(
                'Active style card: %s. Site profile: %s. Page type: %s. Colors (light): background_1=%s, background_2=%s, link=%s, hover=%s. Selected Block: %s.',
                $name,
                $site_profile_value ?: 'unknown',
                $page_type_value ?: 'unknown',
                $background_1 ?: 'unknown',
                $background_2 ?: 'unknown',
                $link ?: 'unknown',
                $hover ?: 'unknown',
                $selected_block_id ?: 'none'
            );
        }

        private function rgb_string_to_hex($rgb)
        {
            if (!is_string($rgb)) {
                return null;
            }

            $parts = array_map('trim', explode(',', $rgb));
            if (count($parts) !== 3) {
                return null;
            }

            $r = max(0, min(255, (int) $parts[0]));
            $g = max(0, min(255, (int) $parts[1]));
            $b = max(0, min(255, (int) $parts[2]));

            return sprintf('#%02x%02x%02x', $r, $g, $b);
        }


    }
endif;
