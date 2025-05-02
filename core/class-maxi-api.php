<?php
require_once plugin_dir_path(__DIR__) . 'core/class-maxi-local-fonts.php';
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
            register_rest_route($this->namespace, '/saved-styles', [
                'methods' => 'GET',
                'callback' => [$this, 'get_maxi_blocks_saved_styles'],
                'permission_callback' => function () {
                    return current_user_can('edit_posts');
                },
            ]);
            register_rest_route($this->namespace, '/saved-styles', [
                'methods' => 'POST',
                'callback' => [$this, 'set_maxi_blocks_saved_styles'],
                'permission_callback' => function () {
                    return current_user_can('edit_posts');
                },
                'args' => [
                    'styles' => [
                        'validate_callback' => function ($param) {
                            return is_string($param);
                        },
                    ],
                ],
            ]);
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
                    'openai_api_key' => get_option('openai_api_key_option'),
                    'model' => get_option('maxi_ai_model'),
                    'language' => get_option('maxi_ai_language'),
                    'tone' => get_option('maxi_ai_tone'),
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

        public function get_maxi_blocks_current_style_cards()
        {
            global $wpdb;

            $table_name = $wpdb->prefix . 'maxi_blocks_general';

            $style_cards = $wpdb->get_var(
                $wpdb->prepare(
                    "SELECT object FROM {$wpdb->prefix}maxi_blocks_general where id = %s",
                    'style_cards_current',
                ),
            );

            if ($style_cards && !empty($style_cards)) {
                return $style_cards;
            } else {
                if (class_exists('MaxiBlocks_StyleCards')) {
                    $default_style_card = MaxiBlocks_StyleCards::get_default_style_card();
                } else {
                    return false;
                } // Should return an error

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
                return $style_cards;
            }
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

            $field = get_field_object(
                $request['field_id'],
                $request['post_id'],
            );

            if (is_array($field) && $field['type'] === 'image') {
                return wp_json_encode([
                    'value' => $field['value'],
                    'return_format' => $field['return_format'],
                ]);
            }

            if (is_array($field)) {
                return wp_json_encode($field['value']);
            }
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

        public function get_maxi_blocks_saved_styles()
        {
            global $wpdb;

            $saved_styles = $wpdb->get_var(
                $wpdb->prepare(
                    "SELECT object FROM {$wpdb->prefix}maxi_blocks_general where id = %s",
                    'saved_styles',
                ),
            );

            if (!$saved_styles) {
                return '{}';
            }

            return $saved_styles;
        }

        public function set_maxi_blocks_saved_styles($request)
        {
            global $wpdb;
            $table_name = $wpdb->prefix . 'maxi_blocks_general';

            $request_result = $request->get_json_params();
            $styles = $request_result['styles'];

            // Validate that styles is a valid JSON string
            if (!is_string($styles) || json_decode($styles) === null) {
                return new WP_Error(
                    'invalid_styles',
                    'Invalid styles format',
                    ['status' => 400]
                );
            }

            // Store the styles directly as they are already stringified
            $result = $wpdb->replace(
                $table_name,
                [
                    'id' => 'saved_styles',
                    'object' => $styles,
                ],
                ['%s', '%s']
            );

            if ($result === false) {
                return new WP_Error(
                    'db_error',
                    'Failed to save styles',
                    ['status' => 500]
                );
            }

            return new WP_REST_Response(['success' => true], 200);
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
    }
endif;
