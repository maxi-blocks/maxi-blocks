<?php
require_once(plugin_dir_path(__DIR__) . 'core/class-maxi-local-fonts.php');
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
            register_rest_route($this->namespace, '/settings', [
                'methods' => 'POST',
                'callback' => [$this, 'set_maxi_blocks_options'],
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
            register_rest_route($this->namespace, '/get-font-url/(?P<font_name>.+)', [
                'methods' => 'GET',
                'callback' => [$this, 'get_maxi_blocks_font_url'],
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
            ]);
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
                    ]
                ],
                'permission_callback' => function () {
                    return current_user_can('edit_posts');
                },
            ]);
            register_rest_route($this->namespace, '/unique-id/(?P<block_name>[a-z-]+)$', [
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
            ]);
            register_rest_route($this->namespace, '/unique-id/remove/(?P<unique_id>[a-z0-9-]+)$', [
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
            ]);
            register_rest_route($this->namespace, '/acf/get-field-groups', [
                'methods' => 'GET',
                'callback' => [$this, 'get_acf_field_groups'],
                'permission_callback' => function () {
                    return current_user_can('edit_posts');
                },
            ]);
            register_rest_route($this->namespace, '/acf/get-group-fields/(?P<id>\d+)', [
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
            ]);
            register_rest_route($this->namespace, '/acf/get-field-value/(?P<field_id>\w+)/(?P<post_id>\d+)', [
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
            ]);
            register_rest_route($this->namespace, '/get-active-integration-plugins', [
                'methods' => 'GET',
                'callback' => [$this, 'get_active_integration_plugins'],
                'permission_callback' => function () {
                    return current_user_can('edit_posts');
                },
            ]);
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
                    return is_user_logged_in() && current_user_can('edit_posts');
                },
            ]);
            register_rest_route($this->namespace, '/fonts/(?P<unique_id>[a-z0-9-]+)$', [
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
                if (
                    version_compare($wp_version, '6.0.3') <= 0
                ) {
                    $version = '13.0';
                } elseif (
                    version_compare($wp_version, '6.1.1') <= 0
                ) {
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
                    'site_description' => get_option('maxi_ai_site_description'),
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
                'swap_cloud_images' => get_option('swap_cloud_images'),
                'placeholder_url' => MAXI_PLUGIN_URL_PATH . 'img/patterns-placeholder.jpeg',
                'show_indicators' => get_option('maxi_show_indicators')
            ];

            return $response;
        }


        public function set_maxi_blocks_options($request)
        {
            $request_result = $request->get_json_params();

            $option = $request_result['option'];
            $value = $request_result['value'];

            update_option($option, $value);
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
                    $id
                ),
                OBJECT
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

            $meta = $is_json && isset($data['meta']) ? json_decode($data['meta'], true) : ($data['meta'] ?? []);
            $styles_arr = $is_json && isset($data['styles']) ? json_decode($data['styles'], true) : ($data['styles'] ?? []);
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

            ['table' => $table, 'where_clause' => $where_clause] = $this->get_query_params('maxi_blocks_styles_blocks');

            foreach ($styles_arr as $id => $styles) {
                $exists = $wpdb->get_results(
                    $wpdb->prepare(
                        "SELECT * FROM $table WHERE $where_clause",
                        $id
                    ),
                    OBJECT
                );

                $dictionary = array(
                    'block_style_id' => $id,
                    'prev_css_value' => $styles,
                    'css_value' => $styles,
                    'prev_fonts_value' => $fonts,
                    'fonts_value' => $fonts,
                );

                $get_array = function ($keys, $dictionary) {
                    $array = [];

                    foreach ($keys as $key) {
                        if ((isset($dictionary[$key]) && $dictionary[$key] !== 'null')) {
                            $array[$key] = $dictionary[$key];
                        }
                    }

                    return $array;
                };

                if (!empty($exists)) {
                    if ($data['update']) {
                        $wpdb->update("{$table}", $get_array([
                            'block_style_id',
                            'prev_css_value',
                            'css_value',
                            'prev_fonts_value',
                            'fonts_value',
                        ], $dictionary), [
                            'block_style_id' => $id,
                        ]);
                    } else {
                        $wpdb->update("{$table}", $get_array([
                            'block_style_id',
                            'prev_css_value',
                            'prev_fonts_value',
                        ], $dictionary), ['block_style_id' => $id]);
                    }
                } else {
                    if ($data['update']) {
                        $wpdb->insert("{$table}", $get_array([
                            'block_style_id',
                            'prev_css_value',
                            'css_value',
                            'prev_fonts_value',
                            'fonts_value',
                        ], $dictionary));
                    } else {
                        $wpdb->insert("{$table}", $get_array([
                            'block_style_id',
                            'prev_css_value',
                            'prev_fonts_value',
                        ], $dictionary));
                    }
                }
            }

            if ((bool) get_option('local_fonts')) {
                MaxiBlocks_Local_Fonts::register();
            }

            $updated_meta = [];

            if(isset($id) && $id) {
                $updated_meta = (array)$wpdb->get_results(
                    $wpdb->prepare(
                        "SELECT * FROM $table WHERE $where_clause",
                        $id
                    ),
                    OBJECT
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

            $response =  maybe_unserialize($wpdb->get_var(
                $wpdb->prepare(
                    "SELECT object FROM {$wpdb->prefix}maxi_blocks_general where id = %s",
                    'sc_string'
                )
            ));

            if (!$response) {
                if (class_exists('MaxiBlocks_StyleCards')) {
                    $maxi_blocks_style_cards = new MaxiBlocks_StyleCards();
                    $maxi_blocks_style_cards->add_default_maxi_blocks_sc_string();
                    $response = maybe_unserialize($wpdb->get_var(
                        $wpdb->prepare(
                            "SELECT object FROM {$wpdb->prefix}maxi_blocks_general where id = %s",
                            'sc_string'
                        )
                    ));
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
                            '_maxi_blocks_style_card_styles_preview' => $data['sc_styles'],
                        ];
            } else {
                $new_style_card['_maxi_blocks_style_card_preview'] = $data['sc_variables'];
                $new_style_card['_maxi_blocks_style_card_styles_preview'] = $data['sc_styles'];

                if ($style_card !== '' && array_key_exists('_maxi_blocks_style_card', $style_card)) {
                    $new_style_card['_maxi_blocks_style_card'] = $style_card['_maxi_blocks_style_card'];
                    if(array_key_exists('_maxi_blocks_style_card_styles', $style_card)) {
                        $new_style_card['_maxi_blocks_style_card_styles'] = $style_card['_maxi_blocks_style_card_styles'];
                    }
                } else {
                    if (is_array($data)) {
                        $new_style_card['_maxi_blocks_style_card'] = $data['sc_variables'];
                        if (array_key_exists('sc_styles', $data)) {
                            $new_style_card['_maxi_blocks_style_card_styles'] = $data['sc_styles'];
                        }
                    } elseif ($data instanceof WP_REST_Request) {
                        if ($data->has_param('sc_variables')) {
                            $new_style_card['_maxi_blocks_style_card'] = $data->get_param('sc_variables');
                        }
                        if ($data->has_param('sc_styles')) {
                            $new_style_card['_maxi_blocks_style_card_styles'] = $data->get_param('sc_styles');
                        }
                    }
                }
            }

            $wpdb->replace("{$wpdb->prefix}maxi_blocks_general", array(
                'id' => 'sc_string',
                'object' =>  serialize($new_style_card),
            ));


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
            if($this->check_if_legacy_code_needed('maxi_blocks_styles') || $this->check_if_legacy_code_needed('maxi_blocks_custom_data')) {
                global $wpdb;

                $wpdb->query($wpdb->prepare("DELETE FROM {$wpdb->prefix}maxi_blocks_styles WHERE post_id=%d", $postId));
                $wpdb->query($wpdb->prepare("DELETE FROM {$wpdb->prefix}maxi_blocks_custom_data WHERE post_id=%d", $postId));
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
                    $response_body
                );
            }
        }

        public function get_maxi_blocks_font_url($request)
        {
            $font_name = $request['font_name'];
            $api_url = get_option('bunny_fonts') ? 'https://fonts.bunny.net' : 'https://fonts.googleapis.com';
            if (get_option('local_fonts')) {
                $font_name_sanitized = MaxiBlocks_Local_Fonts::get_instance()->sanitize_font_name($font_name);
                $font_path = '/maxi/fonts/' . $font_name_sanitized . '/style.css';
                $font_file = wp_upload_dir()['basedir'] . $font_path;
                $font_url = wp_upload_dir()['baseurl'] . $font_path;
                if (!file_exists($font_file)) {
                    $url = $api_url . '/css2?family=' . $font_name . '&display=swap';
                    MaxiBlocks_Local_Fonts::get_instance()->upload_css_file($font_name_sanitized, $url);
                }
            } else {
                $font_url = $api_url . '/css2?family=' . $font_name . ':$fontData&display=swap';
            }

            return $font_url;
        }

        public function get_maxi_blocks_current_style_cards()
        {
            global $wpdb;

            $table_name = $wpdb->prefix . 'maxi_blocks_general';

            $style_cards = $wpdb->get_var(
                $wpdb->prepare(
                    "SELECT object FROM {$wpdb->prefix}maxi_blocks_general where id = %s",
                    'style_cards_current'
                )
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
                        'style_cards_current'
                    )
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

            $wpdb->delete(
                "{$wpdb->prefix}maxi_blocks_general",
                array(
                    'id' => 'sc_string'
                )
            );

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
            if($this->check_if_legacy_code_needed('maxi_blocks_custom_data')) {
                if (gettype($id) === 'object') {
                    $id=$id['id'];
                }

                global $wpdb;
                $response = $wpdb->get_results(
                    $wpdb->prepare(
                        'SELECT custom_data_value FROM  ' . $wpdb->prefix . 'maxi_blocks_custom_data WHERE post_id = %d',
                        $id
                    ),
                    OBJECT
                );

                if (!$response) {
                    $response = '';
                }

                return $response;
            }
        }

        public function set_maxi_blocks_current_custom_data($data, $is_json = true)
        {
            global $wpdb;

            $update = $data['update'];

            if(!is_string($data['data'])) {
                return null;
            }

            $dataArray = json_decode($data['data'], true);

            $processed_data = array();
            foreach($dataArray as $key => $value) {
                $processed_data[$key] = wp_json_encode($value);
            }

            ['table' => $table, 'id_key' => $id_key, 'where_clause' => $where_clause] = $this->get_query_params('maxi_blocks_custom_data_blocks');
            ['table' => $styles_table] = $this->get_query_params('maxi_blocks_styles_blocks');

            foreach($processed_data as $id => $data_val) {
                if (empty($data_val) || $data_val === '{}') {
                    $wpdb->update("{$styles_table}", array(
                        'prev_active_custom_data' =>  null,
                        'active_custom_data' =>  null,
                    ), ["{$id_key}" => $id]);

                    $wpdb->query($wpdb->prepare("DELETE FROM $table WHERE $where_clause", $id));

                    continue;
                }

                $exists = $wpdb->get_results(
                    $wpdb->prepare(
                        "SELECT * FROM $table WHERE $where_clause",
                        $id
                    ),
                    OBJECT
                );

                if ($update) {
                    $new_custom_data = $data_val;


                    $wpdb->update("{$styles_table}", array(
                        'prev_active_custom_data' =>  1,
                        'active_custom_data' =>  1,
                    ), ["{$id_key}" => $id]);


                    if (!empty($exists)) {
                        $old_custom_data = $exists[0]->custom_data_value;

                        $wpdb->update("{$table}", array(
                            'prev_custom_data_value' =>$old_custom_data,
                            'custom_data_value' =>  $new_custom_data,
                        ), ["{$id_key}" =>  $id]);
                    } else {
                        $wpdb->insert("{$table}", array(
                            $id_key => $id,
                            'prev_custom_data_value' =>  '',
                            'custom_data_value' => $new_custom_data,
                        ));
                    }
                }
            }


            return $new_custom_data;
        }

        public function create_maxi_blocks_unique_id($request)
        {
            global $wpdb;

            $block_name = $request->get_param('block_name');

            if(!$block_name || $block_name === '') {
                return new WP_Error(
                    'no_block_name',
                    'No block name provided',
                    'no_block_name'
                );
            }


            $db_custom_prefix = 'maxi_blocks_';
            $db_css_table_name = $wpdb->prefix . $db_custom_prefix . 'styles_blocks';

            // Insert a new row
            $wpdb->insert(
                $db_css_table_name,
                array(
                    'block_style_id' => 'temporary', // Temporary value
                ),
                array(
                    '%s',
                )
            );

            // Get the ID of the newly inserted row
            $new_id = $wpdb->insert_id;

            // Create the final block_style_id
            $block_style_id = $block_name . '-' . $new_id . '-u';

            // Update the newly inserted row with the final block_style_id
            $wpdb->update(
                $db_css_table_name,
                array('block_style_id' => $block_style_id), // data to update
                array('id' => $new_id), // where clause
                array('%s'), // data format
                array('%d') // where format; '%d' stands for integer
            );

            return $block_style_id;

        }

        public function remove_maxi_blocks_unique_id($request)
        {
            global $wpdb;
            $unique_id = $request->get_param('unique_id');

            if(!$unique_id || $unique_id === '') {
                return false;
            }


            $db_custom_prefix = 'maxi_blocks_';
            $db_css_table_name = $wpdb->prefix . $db_custom_prefix . 'styles_blocks';
            $db_custom_data_table_name = $wpdb->prefix . $db_custom_prefix . 'custom_data_blocks';

            $wpdb->query("START TRANSACTION");

            $delete_css_table = $wpdb->delete(
                $db_css_table_name,
                array('block_style_id' => $unique_id)
            );

            $delete_custom_data_table = $wpdb->delete(
                $db_custom_data_table_name,
                array('block_style_id' => $unique_id)
            );

            if ($delete_css_table !== false && $delete_custom_data_table !== false) {
                $wpdb->query("COMMIT");
            } else {
                $wpdb->query("ROLLBACK");
            }
            return true;

        }

        public function get_active_integration_plugins()
        {
            $active_integration_plugins = array();

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

            $acf_field_groups = get_posts(array(
                'post_type' => 'acf-field-group',
                'posts_per_page' => -1,
                'post_status' => 'publish',
            ));

            $acf_field_groups = array_map(function ($acf_field_group) {
                return array(
                    'id' => $acf_field_group->ID,
                    'title' => $acf_field_group->post_title,
                );
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
                return array(
                    'id' => $field['key'],
                    'title' => $field['label'],
                    'type' => $field['type'],
                );
            }, $fields);

            return wp_json_encode($fields);
        }

        public function get_acf_field_value($request)
        {
            if (!class_exists('ACF')) {
                return null;
            }

            $field = get_field_object($request['field_id'], $request['post_id']);

            if (is_array($field) && $field['type'] === 'image') {
                return wp_json_encode(
                    [
                        'value' => $field['value'],
                        'return_format' => $field['return_format']
                    ]
                );
            }

            if(is_array($field)) {
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
            if(get_option('maxi_pro')) {
                $oldData = json_decode(get_option('maxi_pro'));

            }

            if($dataString) {
                update_option('maxi_pro', $dataString);
                return $dataString;
            }
            return false;
        }

        public function check_if_legacy_code_needed($tableName)
        {
            global $wpdb;
            $table_name = $wpdb->prefix . $tableName;
            if($wpdb->get_var("SHOW TABLES LIKE '$table_name'") == $table_name) {
                return true;
            } else {
                return false;
            }
        }

        public function maxi_import_starter_site($request)
        {
            $import_data = json_decode($request->get_body(), true);
            $results = [];

            error_log('Starting import with data: ' . print_r($import_data, true));

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
                    error_log('Processing template: ' . print_r($template, true));

                    // Fetch template content from URL
                    $template_content = $fetch_remote_content($template['content']);
                    if (!$template_content) {
                        $results['templates'][] = [
                            'name' => $template['name'],
                            'success' => false,
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
                            'message' => __('Invalid template JSON content', 'maxi-blocks')
                        ];
                        continue;
                    }

                    // Import the template
                    $import_result = $this->maxi_import_template_parts([$template_data]);
                    $results['templates'][] = [
                        'name' => $template['name'],
                        'success' => true,
                        'data' => $import_result
                    ];
                }
            }

            // Process pages
            if (!empty($import_data['pages'])) {
                $results['pages'] = [];

                foreach ($import_data['pages'] as $page) {
                    error_log('Processing page: ' . print_r($page, true));

                    // Fetch page content from URL
                    $page_content = $fetch_remote_content($page['content']);
                    if (!$page_content) {
                        $results['pages'][] = [
                            'name' => $page['name'],
                            'success' => false,
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
                            'message' => __('Invalid page JSON content', 'maxi-blocks')
                        ];
                        continue;
                    }

                    // Import the page
                    $import_result = $this->maxi_import_pages([$page_data]);
                    $results['pages'][] = [
                        'name' => $page['name'],
                        'success' => true,
                        'data' => $import_result
                    ];
                }
            }

            // Process patterns
            if (!empty($import_data['patterns'])) {
                $results['patterns'] = [];

                foreach ($import_data['patterns'] as $pattern) {
                    error_log('Processing pattern: ' . print_r($pattern, true));

                    // Fetch pattern content from URL
                    $pattern_content = $fetch_remote_content($pattern['content']);
                    if (!$pattern_content) {
                        $results['patterns'][] = [
                            'name' => $pattern['name'],
                            'success' => false,
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
                            'message' => __('Invalid pattern JSON content', 'maxi-blocks')
                        ];
                        continue;
                    }

                    // Import the pattern
                    $import_result = $this->maxi_import_patterns([$pattern_data]);
                    $results['patterns'][] = [
                        'name' => $pattern['name'],
                        'success' => true,
                        'data' => $import_result
                    ];
                }
            }

            // Save current starter site name
            if (!empty($import_data['title'])) {
                update_option('maxiblocks_current_starter_site', $import_data['title']);
            }

            return rest_ensure_response([
                'success' => true,
                'message' => 'Import data processed',
                'data' => $results
            ]);
        }

        private function maxi_import_pages($pages_data)
        {
            $results = [];

            foreach ($pages_data as $page_name => $page_data) {
                // Parse the page data
                $content = $page_data['content'] ?? '';
                $styles = $page_data['styles'] ?? [];
                $entity_type = $page_data['entityType'] ?? 'page';
                $entity_title = $page_data['entityTitle'] ?? $page_name;
                $entity_slug = $page_data['entitySlug'] ?? sanitize_title($entity_title);
                $custom_data = $page_data['customData'] ?? [];
                $fonts = $page_data['fonts'] ?? [];

                // Create the page/post
                $post_data = array(
                    'post_title'    => $entity_title,
                    'post_content'  => wp_slash($content),
                    'post_status'   => 'publish',
                    'post_type'     => $entity_type,
                    'post_name'     => $entity_slug,
                );

                $post_id = wp_insert_post($post_data);

                if (is_wp_error($post_id)) {
                    $results[$page_name] = [
                        'success' => false,
                        'message' => $post_id->get_error_message()
                    ];
                    continue;
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
                    'message' => sprintf(__('Successfully imported %s', 'maxi-blocks'), $entity_title)
                ];
            }

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
            error_log('Starting template part import with data: ' . print_r($template_data, true));

            // Get current theme
            $current_theme = wp_get_theme();
            $theme_slug = $current_theme->get_stylesheet();
            error_log('Current theme: ' . $theme_slug);

            foreach ($template_data as $template_name => $template_part_data) {
                // Check entity type and route to appropriate function
                if ($template_part_data['entityType'] === 'template') {
                    error_log('Processing template: ' . $template_name);
                    return $this->maxi_import_templates([$template_part_data]);
                }

                if ($template_part_data['entityType'] !== 'template-part') {
                    error_log('Invalid entity type: ' . $template_part_data['entityType']);
                    $results[$template_name] = [
                        'success' => false,
                        'message' => sprintf(__('Invalid entity type: %s', 'maxi-blocks'), $template_part_data['entityType'])
                    ];
                    continue;
                }

                error_log('Processing template part: ' . $template_name);
                // Parse the template data
                $content = $template_part_data['content'] ?? '';
                $styles = $template_part_data['styles'] ?? [];
                $entity_title = $template_part_data['entityTitle'] ?? $template_name;
                $entity_slug = $template_part_data['entitySlug'] ?? sanitize_title($entity_title);
                $custom_data = $template_part_data['customData'] ?? [];
                $fonts = $template_part_data['fonts'] ?? [];

                error_log('Template part details - Title: ' . $entity_title . ', Slug: ' . $entity_slug);

                // Set up the template part area
                $area = '';
                if (strpos(strtolower($entity_title), 'header') !== false) {
                    $area = 'header';
                } elseif (strpos(strtolower($entity_title), 'footer') !== false) {
                    $area = 'footer';
                } else {
                    $area = 'uncategorized';
                }
                error_log('Template part area: ' . $area);

                // Check if template part exists
                $existing_template = get_block_template(
                    $theme_slug . '//' . $entity_slug,
                    'wp_template_part'
                );
                error_log('Existing template check: ' . ($existing_template ? 'Found' : 'Not found'));
                error_log('Existing template data: ' . print_r($existing_template, true));

                // Check if it exists in database by simple slug
                $existing_post = $wpdb->get_row(
                    $wpdb->prepare(
                        "SELECT ID FROM {$wpdb->posts}
                        WHERE post_type = 'wp_template_part'
                        AND post_name = %s
                        AND post_status = 'publish'",
                        $entity_slug
                    )
                );
                error_log('Database check result by slug: ' . print_r($existing_post, true));

                $template_content = array(
                    'post_name' => $entity_slug,
                    'post_title' => $entity_title,
                    'post_content' => wp_slash($content),
                    'post_status' => 'publish',
                    'post_type' => 'wp_template_part',
                    'post_excerpt' => '',
                    'tax_input' => array(
                        'wp_theme' => array($theme_slug),
                        'wp_template_part_area' => array($area)
                    ),
                    'meta_input' => array(
                        'origin' => 'theme',
                        'theme' => $theme_slug,
                        'area' => $area,
                        'is_custom' => true
                    )
                );
                error_log('Template content prepared: ' . print_r($template_content, true));

                if ($existing_template) {
                    error_log('Found template in theme files');

                    if ($existing_post) {
                        error_log('Updating existing template part in database with ID: ' . $existing_post->ID);
                        $template_content['ID'] = $existing_post->ID;
                        $post_id = wp_update_post($template_content);
                    } else {
                        error_log('Creating new template part in database');
                        $post_id = wp_insert_post($template_content);

                        if ($post_id && !is_wp_error($post_id)) {
                            error_log('Setting taxonomies for template part ID: ' . $post_id);
                            wp_set_object_terms($post_id, $area, 'wp_template_part_area');
                            wp_set_object_terms($post_id, $theme_slug, 'wp_theme');
                        }
                    }
                } else {
                    error_log('Creating new template part');
                    $post_id = wp_insert_post($template_content);

                    if ($post_id && !is_wp_error($post_id)) {
                        error_log('Setting taxonomies for new template part ID: ' . $post_id);
                        wp_set_object_terms($post_id, $area, 'wp_template_part_area');
                        wp_set_object_terms($post_id, $theme_slug, 'wp_theme');
                    }
                }

                if (is_wp_error($post_id)) {
                    error_log('Error creating/updating template part: ' . $post_id->get_error_message());
                    $results[$template_name] = [
                        'success' => false,
                        'message' => $post_id->get_error_message()
                    ];
                    continue;
                }
                error_log('Template part created/updated successfully with ID: ' . $post_id);

                // Import styles into DB
                error_log('Importing styles');
                $this->import_styles_to_db($styles);

                // Import custom data
                error_log('Importing custom data');
                $this->import_custom_data_to_db($custom_data);

                // Import fonts
                error_log('Importing fonts');
                $this->import_fonts_to_db($fonts);

                // Clear template parts cache
                wp_cache_delete('wp_template_part_' . $theme_slug);
                wp_cache_delete('wp_template_part_area_' . $area);
                error_log('Cache cleared');

                $results[$template_name] = [
                    'success' => true,
                    'post_id' => $post_id,
                    'message' => sprintf(__('Successfully imported %s template part', 'maxi-blocks'), $entity_title)
                ];
                error_log('Template part import completed successfully');
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
            error_log('Starting template import with data: ' . print_r($template_data, true));

            // Get current theme
            $current_theme = wp_get_theme();
            $theme_slug = $current_theme->get_stylesheet();
            error_log('Current theme: ' . $theme_slug);

            // Helper function to replace template part references
            $replace_template_parts = function ($content) use ($theme_slug) {
                return preg_replace(
                    '/<!-- wp:template-part {"slug":"([^"]+)","theme":"[^"]+"/',
                    '<!-- wp:template-part {"slug":"$1","theme":"' . $theme_slug . '"',
                    $content
                );
            };

            // Valid template types
            $valid_types = array(
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
                'search'
            );

            foreach ($template_data as $template_name => $template_data) {
                error_log('Processing template: ' . $template_name);
                // Parse the template data
                $content = $template_data['content'] ?? '';
                // Replace template part references with current theme
                $content = $replace_template_parts($content);

                $styles = $template_data['styles'] ?? [];
                $entity_type = $template_data['entityType'] ?? '';
                $entity_title = $template_data['entityTitle'] ?? $template_name;
                $entity_slug = $template_data['entitySlug'] ?? sanitize_title($entity_title);
                $custom_data = $template_data['customData'] ?? [];
                $fonts = $template_data['fonts'] ?? [];

                // Validate template type
                if (!in_array($entity_slug, $valid_types)) {
                    error_log('Invalid template slug: ' . $entity_slug);
                    $results[$template_name] = [
                        'success' => false,
                        'message' => sprintf(__('Invalid template slug: %s', 'maxi-blocks'), $entity_slug)
                    ];
                    continue;
                }

                error_log('Template details - Title: ' . $entity_title . ', Slug: ' . $entity_slug . ', Type: ' . $entity_type);

                // Check if template exists
                $existing_template = get_block_template(
                    $theme_slug . '//' . $entity_slug,
                    'wp_template'
                );
                error_log('Existing template check: ' . ($existing_template ? 'Found' : 'Not found'));
                error_log('Existing template data: ' . print_r($existing_template, true));

                // Check if it exists in database by simple slug
                $existing_post = $wpdb->get_row(
                    $wpdb->prepare(
                        "SELECT ID FROM {$wpdb->posts}
                        WHERE post_type = 'wp_template'
                        AND post_name = %s
                        AND post_status = 'publish'",
                        $entity_slug
                    )
                );
                error_log('Database check result by slug: ' . print_r($existing_post, true));

                $template_content = array(
                    'post_name' => $entity_slug,
                    'post_title' => $entity_title,
                    'post_content' => wp_slash($content),
                    'post_status' => 'publish',
                    'post_type' => 'wp_template',
                    'post_excerpt' => '',
                    'tax_input' => array(
                        'wp_theme' => array($theme_slug)
                    ),
                    'meta_input' => array(
                        'origin' => 'theme',
                        'theme' => $theme_slug,
                        'is_custom' => true,
                        'type' => $entity_type
                    )
                );
                error_log('Template content prepared: ' . print_r($template_content, true));

                if ($existing_template) {
                    error_log('Found template in theme files');

                    if ($existing_post) {
                        error_log('Updating existing template in database with ID: ' . $existing_post->ID);
                        $template_content['ID'] = $existing_post->ID;
                        $post_id = wp_update_post($template_content);
                    } else {
                        error_log('Creating new template in database');
                        $post_id = wp_insert_post($template_content);

                        if ($post_id && !is_wp_error($post_id)) {
                            error_log('Setting taxonomy for template ID: ' . $post_id);
                            wp_set_object_terms($post_id, $theme_slug, 'wp_theme');
                        }
                    }
                } else {
                    error_log('Creating new template');
                    $post_id = wp_insert_post($template_content);

                    if ($post_id && !is_wp_error($post_id)) {
                        error_log('Setting taxonomy for new template ID: ' . $post_id);
                        wp_set_object_terms($post_id, $theme_slug, 'wp_theme');
                    }
                }

                if (is_wp_error($post_id)) {
                    error_log('Error creating/updating template: ' . $post_id->get_error_message());
                    $results[$template_name] = [
                        'success' => false,
                        'message' => $post_id->get_error_message()
                    ];
                    continue;
                }
                error_log('Template created/updated successfully with ID: ' . $post_id);

                // Import styles into DB
                error_log('Importing styles');
                $this->import_styles_to_db($styles);

                // Import custom data
                error_log('Importing custom data');
                $this->import_custom_data_to_db($custom_data);

                // Import fonts
                error_log('Importing fonts');
                $this->import_fonts_to_db($fonts);

                // Clear template cache
                wp_cache_delete('wp_template_' . $theme_slug);
                error_log('Cache cleared');

                $results[$template_name] = [
                    'success' => true,
                    'post_id' => $post_id,
                    'message' => sprintf(__('Successfully imported %s template', 'maxi-blocks'), $entity_title)
                ];
                error_log('Template import completed successfully');
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
                        $block_id
                    )
                );

                if ($existing_style) {
                    // Update existing record, keeping current css_value as prev_css_value
                    $wpdb->update(
                        $wpdb->prefix . 'maxi_blocks_styles_blocks',
                        array(
                            'prev_css_value' => $existing_style->css_value,
                            'css_value' => $style_data,
                        ),
                        array('block_style_id' => $block_id),
                        array('%s', '%s'),
                        array('%s')
                    );
                } else {
                    // Insert new record
                    $wpdb->insert(
                        $wpdb->prefix . 'maxi_blocks_styles_blocks',
                        array(
                            'block_style_id' => $block_id,
                            'css_value' => $style_data,
                            'prev_css_value' => $style_data,
                        ),
                        array('%s', '%s', '%s')
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
                // Check if block_id exists
                $existing_custom_data = $wpdb->get_row(
                    $wpdb->prepare(
                        "SELECT * FROM {$wpdb->prefix}maxi_blocks_custom_data_blocks WHERE block_style_id = %s",
                        $block_id
                    )
                );

                if ($existing_custom_data) {
                    // Update existing record, keeping current custom_data as prev_custom_data
                    $wpdb->update(
                        $wpdb->prefix . 'maxi_blocks_custom_data_blocks',
                        array(
                            'prev_custom_data_value' => $existing_custom_data->custom_data_value,
                            'custom_data_value' => $block_custom_data,
                        ),
                        array('block_style_id' => $block_id),
                        array('%s', '%s'),
                        array('%s')
                    );
                } else {
                    // Insert new record
                    $wpdb->insert(
                        $wpdb->prefix . 'maxi_blocks_custom_data_blocks',
                        array(
                            'block_style_id' => $block_id,
                            'custom_data_value' => $block_custom_data,
                            'prev_custom_data_value' => $block_custom_data,
                        ),
                        array('%s', '%s', '%s')
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
                        $block_id
                    )
                );

                if ($existing_fonts) {
                    // Update existing record, keeping current fonts as prev_fonts
                    $wpdb->update(
                        $wpdb->prefix . 'maxi_blocks_styles_blocks',
                        array(
                            'prev_fonts_value' => $existing_fonts->fonts_value ?? $font_data,
                            'fonts_value' => $font_data,
                        ),
                        array('block_style_id' => $block_id),
                        array('%s', '%s'),
                        array('%s')
                    );
                } else {
                    // Insert new record
                    $wpdb->insert(
                        $wpdb->prefix . 'maxi_blocks_styles_blocks',
                        array(
                            'block_style_id' => $block_id,
                            'fonts_value' => $font_data,
                            'prev_fonts_value' => $font_data,
                        ),
                        array('%s', '%s', '%s')
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

            if(!$unique_id || $unique_id === '') {
                return new WP_Error(
                    'no_unique_id',
                    'No block unique ID provided',
                    array('status' => 400)
                );
            }

            $fonts = $wpdb->get_row(
                $wpdb->prepare(
                    "SELECT fonts_value
                    FROM {$wpdb->prefix}maxi_blocks_styles_blocks
                    WHERE block_style_id = %s",
                    $unique_id
                ),
                ARRAY_A
            );

            if (!$fonts) {
                return new WP_Error(
                    'no_fonts_found',
                    'No fonts found for this block ID',
                    array('status' => 404)
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
            error_log('Starting pattern import with data: ' . print_r($pattern_data, true));

            // Get current theme
            $current_theme = wp_get_theme();
            $theme_slug = $current_theme->get_stylesheet();
            error_log('Current theme: ' . $theme_slug);

            foreach ($pattern_data as $pattern_name => $pattern_data) {
                error_log('Processing pattern: ' . $pattern_name);

                // Parse the pattern data
                $content = $pattern_data['content'] ?? '';
                $styles = $pattern_data['styles'] ?? [];
                $entity_title = $pattern_data['entityTitle'] ?? $pattern_name;
                $entity_slug = $pattern_data['entitySlug'] ?? sanitize_title($entity_title);
                $custom_data = $pattern_data['customData'] ?? [];
                $fonts = $pattern_data['fonts'] ?? [];
                $wp_pattern_sync_status = $pattern_data['wpPatternSyncStatus'] ?? '';

                error_log('Pattern details - Title: ' . $entity_title . ', Slug: ' . $entity_slug);

                // Check if pattern exists in database
                $existing_post = $wpdb->get_row(
                    $wpdb->prepare(
                        "SELECT ID FROM {$wpdb->posts}
                        WHERE post_type = 'wp_block'
                        AND post_name = %s
                        AND post_status = 'publish'",
                        $entity_slug
                    )
                );
                error_log('Database check result by slug: ' . print_r($existing_post, true));

                $pattern_content = array(
                    'post_name' => $entity_slug,
                    'post_title' => $entity_title,
                    'post_content' => wp_slash($content),
                    'post_status' => 'publish',
                    'post_type' => 'wp_block',
                    'post_excerpt' => '',
                    'meta_input' => array(
                        'wp_pattern_sync_status' => $wp_pattern_sync_status
                    )
                );
                error_log('Pattern content prepared: ' . print_r($pattern_content, true));

                if ($existing_post) {
                    error_log('Updating existing pattern in database with ID: ' . $existing_post->ID);
                    $pattern_content['ID'] = $existing_post->ID;
                    $post_id = wp_update_post($pattern_content);
                } else {
                    error_log('Creating new pattern');
                    $post_id = wp_insert_post($pattern_content);
                }

                if (is_wp_error($post_id)) {
                    error_log('Error creating/updating pattern: ' . $post_id->get_error_message());
                    $results[$pattern_name] = [
                        'success' => false,
                        'message' => $post_id->get_error_message()
                    ];
                    continue;
                }
                error_log('Pattern created/updated successfully with ID: ' . $post_id);

                // Import styles into DB
                error_log('Importing styles');
                $this->import_styles_to_db($styles);

                // Import custom data
                error_log('Importing custom data');
                $this->import_custom_data_to_db($custom_data);

                // Import fonts
                error_log('Importing fonts');
                $this->import_fonts_to_db($fonts);

                $results[$pattern_name] = [
                    'success' => true,
                    'post_id' => $post_id,
                    'message' => sprintf(__('Successfully imported %s pattern', 'maxi-blocks'), $entity_title)
                ];
                error_log('Pattern import completed successfully');
            }

            return $results;
        }
    }
endif;
