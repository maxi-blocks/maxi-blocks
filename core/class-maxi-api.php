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
            register_rest_route($this->namespace, '/meta', [
                'methods' => 'POST',
				'callback' => [$this, 'post_maxi_blocks_meta'],
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
        }

        /**
         * Returns Maxi Blocks general settings
         */
        public function get_maxi_blocks_options()
        {
            global $wp_version;

            $version = '';
            $is_core = true;

            // In case Gutenberg plugin has been installed
            if (defined('GUTENBERG_VERSION')) {
                $version = GUTENBERG_VERSION;
                $is_core = false;
            } else {
                // Versions based on initial compatibility with WP 5.5.3
                if (
                    version_compare($wp_version, '5.5') >= 0 &&
                    version_compare($wp_version, '5.5.3') <= 0
                ) {
                    $version = '8.5';
                } elseif (
                    version_compare($wp_version, '5.6') >= 0 &&
                    version_compare($wp_version, '5.6.1') <= 0
                ) {
                    $version = '9.2';
                } elseif (
                    version_compare($wp_version, '5.7') >= 0 &&
                    version_compare($wp_version, '5.7.1') >= 0
                ) {
                    $version = '9.9';
                } elseif (
                    version_compare($wp_version, '5.8') >= 0 &&
                    floatval($wp_version) >= floatval('5.8')
                ) {
                    $version = '10.7';
                }
            }

            $response = [
                'google_api_key' => get_option('google_api_key_option'),
                'core' => [
                    'version' => $wp_version,
                ],
                'editor' => [
                    'version' => $version,
                    'is_core' => $is_core,
                ],
                'hide_tooltips' => get_option('hide_tooltips'),
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
                    $id
                ),
                OBJECT
            );

            if (!$response) {
                $response = '';
            }

            return $response;
        }

		public function getQueryParams($table, $is_template)
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
         * Post the posts
         */
        public function post_maxi_blocks_meta($data) {
            global $wpdb;

            $id = $data['id'];
            $meta = json_decode($data['meta'], true);
            $styles = $meta['styles'];
			$is_template = $data['isTemplate'];

            $fontsArr = $meta['fonts'];
            foreach ($fontsArr as $key => $font) {
                $fontsArr[$key] = json_decode($font, true);
            }
            $fonts = json_encode(array_merge_recursive(...$fontsArr));

			['table' => $table, 'id_key' => $id_key, 'where_clause' => $where_clause] = $this->getQueryParams('maxi_blocks_styles', $is_template);

            if (empty($styles) || $styles === '{}') {
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

            if (!empty($exists)) {
                if ($data['update']) {
                    $wpdb->update("{$table}", array(
						"{$id_key}" => $id,
                        'prev_css_value' =>  $styles,
                        'css_value' =>  $styles,
                        'prev_fonts_value' =>  $fonts,
                        'fonts_value' =>  $fonts,
                    ), ["{$id_key}" => $id]);
                } else {
                    $wpdb->update("{$table}", array(
                        "{$id_key}" => $id,
                        'prev_css_value' =>  $styles,
                        'prev_fonts_value' =>  $fonts,
                    ), ["{$id_key}" => $id]);
                }
            } else {
                if ($data['update']) {
                    $wpdb->insert("{$table}", array(
                        "{$id_key}" => $id,
                        'prev_css_value' =>  $styles,
                        'css_value' =>  $styles,
                        'prev_fonts_value' =>  $fonts,
                        'fonts_value' =>  $fonts,
                    ));
                } else {
                    $wpdb->insert("{$table}", array(
                        "{$id_key}" => $id,
                        'prev_css_value' =>  $styles,
                        'prev_fonts_value' =>  $fonts,
                    ));
                }
            }

            if ((bool) get_option('local_fonts')) {
                new MaxiBlocks_Local_Fonts();
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
                            '_maxi_blocks_style_card' => $data['meta'],
                            '_maxi_blocks_style_card_preview' => $data['meta'],
                        ];
            } else {
                $new_style_card['_maxi_blocks_style_card_preview'] = $data['meta'];
                if ($style_card !== '' && array_key_exists('_maxi_blocks_style_card', $style_card)) {
                    $new_style_card['_maxi_blocks_style_card'] = $style_card['_maxi_blocks_style_card'];
                } else {
                    $new_style_card['_maxi_blocks_style_card'] = $data['meta'];
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
                    $defaultStyleCard = MaxiBlocks_StyleCards::getDefaultStyleCard();
                } else {
                    return false;
                } // Should return an error

                $wpdb->replace($table_name, [
                    'id' => 'style_cards_current',
                    'object' => $defaultStyleCard,
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
                $defaultStyleCard = MaxiBlocks_StyleCards::getDefaultStyleCard();
            } else {
                return false;
            } // Should return an error

            $response = $wpdb->replace($table_name, [
                'id' => 'style_cards_current',
                'object' => $defaultStyleCard,
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

        public function set_maxi_blocks_current_custom_data($data)
        {
			global $wpdb;

            $id = $data['id'];
            $update = $data['update'];
            $dataVal = $data['data'];
			$is_template = $data['isTemplate'];

			['table' => $table, 'id_key' => $id_key, 'where_clause' => $where_clause] = $this->getQueryParams('maxi_blocks_custom_data', $is_template);
			['table' => $styles_table] = $this->getQueryParams('maxi_blocks_styles', $is_template);

            if (empty($dataVal) || $dataVal === '{}') {
                $wpdb->update("{$styles_table}", array(
                    'prev_active_custom_data' =>  null,
                    'active_custom_data' =>  null,
                ), ["{$id_key}" => $id]);

                $wpdb->query($wpdb->prepare("DELETE FROM $table WHERE $where_clause", $id));

                return '{}';
            }

            if ($update) {
                $arrayNewData = json_decode($dataVal, true);
                $new_custom_data = serialize(array_merge_recursive(...array_values($arrayNewData)));

                $wpdb->update("{$styles_table}", array(
                    'prev_active_custom_data' =>  1,
                    'active_custom_data' =>  1,
                ), ["{$id_key}" => $id]);

                $wpdb->replace("{$table}", array(
                    "{$id_key}" => $id,
                    'prev_custom_data_value' =>  $new_custom_data,
                    'custom_data_value' =>  $new_custom_data,
                ));
            }

            return $new_custom_data;
        }
    }
endif;
