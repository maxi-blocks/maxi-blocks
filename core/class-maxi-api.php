<?php
require_once(plugin_dir_path(__DIR__) . 'core/class-maxi-local-fonts.php');
/**
 * Maxi Blocks styles API
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
                    'id' => [
                        'validate_callback' => function ($param) {
                            return is_numeric($param) || is_string($param);
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
                    'isTemplate' => [
                        'validate_callback' => function ($param) {
                            return is_bool($param);
                        },
                    ],
                    'templateParts' => [
                        'validate_callback' => function ($param) {
                            return is_string($param);
                        },
                    ],
                    'templatePart' => [
                        'validate_callback' => function ($param) {
                            return is_string($param);
                        },
                    ]
                ],
                'permission_callback' => function () {
                    return current_user_can('edit_posts');
                },
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
        }

        /**
         * Returns Maxi Blocks general settings
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
                'core' => [
                    'version' => $wp_version,
                ],
                'editor' => [
                    'version' => $version,
                    'is_core' => $is_core,
                ],
                'hide_tooltips' => get_option('hide_tooltips'),
                'swap_cloud_images' => get_option('swap_cloud_images'),
                'support_chat' => get_option('support_chat'),
                'placeholder_url' => MAXI_PLUGIN_URL_PATH . 'img/patterns-placeholder.jpeg'
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

        public function get_query_params($table, $is_template)
        {
            global $wpdb;

            $table = $wpdb->prefix . $table . ($is_template ? '_templates' : '');
            $id_key = $is_template ? 'template_id' : 'post_id';
            $where_clause = $id_key . ' = %' . ($is_template ? 's' : 'd');

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

            $id = $data['id'];
            $meta = $is_json ? json_decode($data['meta'], true) : $data['meta'];
            $styles = $meta['styles'];
            $is_template = $data['isTemplate'];
            $template_parts = $data['templateParts'];

            $fonts_arr = $meta['fonts'];
            if ($is_json) {
                foreach ($fonts_arr as $key => $font) {
                    $fonts_arr[$key] = json_decode($font, true);
                }
            }
            $fonts = json_encode(array_merge_recursive(...$fonts_arr));

            ['table' => $table, 'id_key' => $id_key, 'where_clause' => $where_clause] = $this->get_query_params('maxi_blocks_styles', $is_template);

            if ((empty($styles) || $styles === '{}') && !$is_template) {
                $wpdb->query($wpdb->prepare("DELETE FROM $table WHERE $where_clause", $id));
                return '{}';
            }

            $exists = $wpdb->get_results(
                $wpdb->prepare(
                    "SELECT * FROM $table WHERE $where_clause",
                    $id
                ),
                OBJECT
            );

            $dictionary = array(
                "{$id_key}" => $id,
                'prev_css_value' => $styles,
                'css_value' => $styles,
                'prev_fonts_value' => $fonts,
                'fonts_value' => $fonts,
                'template_parts' => $template_parts,
            );

            $get_array = function ($keys, $dictionary) {
                $array = [];

                foreach ($keys as $key) {
                    if (($key === 'template_parts' && $dictionary[$key] !== 'null') || $key !== 'template_parts') {
                        $array[$key] = $dictionary[$key];
                    }
                }

                return $array;
            };

            if (!empty($exists)) {
                if ($data['update']) {
                    $wpdb->update("{$table}", $get_array([
                        "{$id_key}",
                        'prev_css_value',
                        'css_value',
                        'prev_fonts_value',
                        'fonts_value',
                        'template_parts',
                    ], $dictionary), [
                        "{$id_key}" => $id,
                    ]);
                } else {
                    $wpdb->update("{$table}", $get_array([
                        "{$id_key}",
                        'prev_css_value',
                        'prev_fonts_value',
                        'template_parts',
                    ], $dictionary), ["{$id_key}" => $id]);
                }
            } else {
                if ($data['update']) {
                    $wpdb->insert("{$table}", $get_array([
                        "{$id_key}",
                        'prev_css_value',
                        'css_value',
                        'prev_fonts_value',
                        'fonts_value',
                        'template_parts',
                    ], $dictionary));
                } else {
                    $wpdb->insert("{$table}", $get_array([
                        "{$id_key}",
                        'prev_css_value',
                        'prev_fonts_value',
                        'template_parts',
                    ], $dictionary));
                }
            }

            if ((bool) get_option('local_fonts')) {
                new MaxiBlocks_Local_Fonts();
            }

            // Check if Maxi Blocks Theme is installed and active
            if (get_template() === 'maxi-theme') {
                $template_part = $data['templatePart'];
                $is_template_part = isset($template_part) && strpos($template_part, 'maxi-theme//') !== false;

                if ($is_template_part || $is_template) {
                    $template_name;

                    if ($is_template) {
                        $template_name = $id;
                    } else {
                        $template_name = $template_part;
                    }

                    $template_name = str_replace('maxi-theme//', '', $template_name);

                    do_action('maxi_blocks_save_styles', $styles, $template_name, $is_template_part);
                }
            }

            $updated_meta = (array)$wpdb->get_results(
                $wpdb->prepare(
                    "SELECT * FROM $table WHERE $where_clause",
                    $id
                ),
                OBJECT
            )[0];

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
                $response = '';
                $empty_sc_string = [
                            '_maxi_blocks_style_card' =>'',
                            '_maxi_blocks_style_card_preview' => '',
                        ];
                $wpdb->insert("{$wpdb->prefix}maxi_blocks_general", array(
                            'id' => 'sc_string',
                            'object' =>  serialize($empty_sc_string),
                        ));
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
                    $new_style_card['_maxi_blocks_style_card'] = $data['sc_variables'];
                    if (array_key_exists('sc_styles', $data)) {
                        $new_style_card['_maxi_blocks_style_card_styles'] = $data['sc_styles'];
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
                update_option('maxi_breakpoints', json_encode($breakpoints));
            }

            return $breakpoints;
        }

        public function mb_delete_register($postId)
        {
            global $wpdb;

            $wpdb->query($wpdb->prepare("DELETE FROM {$wpdb->prefix}maxi_blocks_styles WHERE post_id=%d", $postId));
            $wpdb->query($wpdb->prepare("DELETE FROM {$wpdb->prefix}maxi_blocks_custom_data WHERE post_id=%d", $postId));
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

        public function set_maxi_blocks_current_custom_data($data, $is_json = true)
        {
            global $wpdb;

            $id = $data['id'];
            $update = $data['update'];
            $data_val = $data['data'];
            $is_template = $data['isTemplate'];

            ['table' => $table, 'id_key' => $id_key, 'where_clause' => $where_clause] = $this->get_query_params('maxi_blocks_custom_data', $is_template);
            ['table' => $styles_table] = $this->get_query_params('maxi_blocks_styles', $is_template);

            if (empty($data_val) || $data_val === '{}') {
                $wpdb->update("{$styles_table}", array(
                    'prev_active_custom_data' =>  null,
                    'active_custom_data' =>  null,
                ), ["{$id_key}" => $id]);

                $wpdb->query($wpdb->prepare("DELETE FROM $table WHERE $where_clause", $id));

                return '{}';
            }

            $exists = $wpdb->get_results(
                $wpdb->prepare(
                    "SELECT * FROM $table WHERE $where_clause",
                    $id
                ),
                OBJECT
            );

            if ($update) {
                if($is_json) {
                    $array_new_data = $is_json ? json_decode($data_val, true) : $data_val;
                    $new_custom_data = serialize(array_merge_recursive(...array_values($array_new_data)));
                } else {
                    $new_custom_data = $data_val;
                }

                $wpdb->update("{$styles_table}", array(
                    'prev_active_custom_data' =>  1,
                    'active_custom_data' =>  1,
                ), ["{$id_key}" => $id]);


                if (!empty($exists)) {
                    $wpdb->update("{$table}", array(
                        'prev_custom_data_value' =>  $new_custom_data,
                        'custom_data_value' =>  $new_custom_data,
                    ), ["{$id_key}" =>  $id]);
                } else {
                    $wpdb->insert("{$table}", array(
                        $id_key => $id,
                        'prev_custom_data_value' =>  $new_custom_data,
                        'custom_data_value' => $new_custom_data,
                    ));
                }
            }

            return $new_custom_data;
        }

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

            return json_encode($acf_field_groups);
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

            return json_encode($fields);
        }

        public function get_acf_field_value($request)
        {
            if (!class_exists('ACF')) {
                return null;
            }

            return json_encode(get_field_object($request['field_id'], $request['post_id'])['value']);
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
    }
endif;
