<?php

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
            register_rest_route($this->namespace, '/post', [
                'methods' => 'POST',
                'callback' => [$this, 'post_maxi_blocks_post'],
                'args' => [
                    'id' => [
                        'validate_callback' => function ($param) {
                            return is_numeric($param);
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
            register_rest_route($this->namespace, '/motion-presets', [
                'methods' => 'GET',
                'callback' => [
                    $this,
                    'get_maxi_blocks_current_global_motion_presets',
                ],
                'permission_callback' => function () {
                    return current_user_can('edit_posts');
                },
            ]);
            register_rest_route($this->namespace, '/motion-presets', [
                'methods' => 'POST',
                'callback' => [
                    $this,
                    'set_maxi_blocks_current_global_motion_presets',
                ],
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
                            return is_numeric($param);
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
                "SELECT prev_css_value FROM {$wpdb->prefix}maxi_blocks_styles WHERE post_id = {$id}",
                OBJECT
            );

            if (!$response) {
                $response = '';
            }

            return $response;
        }

        /**
         * Post the posts
         */
        public function post_maxi_blocks_post($data)
        {
            global $wpdb;
            
            $id = $data['id'];
            $meta = json_decode($data['meta'], true);
            $styles = $meta['styles'];
            $fonts = implode(",", $meta['fonts']);

            if (empty($styles) && empty($fonts)) {
                return;
            }

            $table =  $wpdb->prefix . 'maxi_blocks_styles';

            $exists = $wpdb->get_results(
                "SELECT * FROM {$table} WHERE post_id = {$id}",
                OBJECT
            );

            if (!empty($exists)) {
                if ($data['update']) {
                    $wpdb->update("{$table}", array(
                        'post_id' => $id,
                        'prev_css_value' =>  $styles,
                        'css_value' =>  $styles,
                        'prev_fonts_value' =>  $fonts,
                        'fonts_value' =>  $fonts,
                    ), ['post_id' => $id]);
                } else {
                    $wpdb->update("{$table}", array(
                        'post_id' => $id,
                        'prev_css_value' =>  $styles,
                        'prev_fonts_value' =>  $fonts,
                    ), ['post_id' => $id]);
                }
            } else {
                if ($data['update']) {
                    $wpdb->insert("{$table}", array(
                        'post_id' => $id,
                        'prev_css_value' =>  $styles,
                        'css_value' =>  $styles,
                        'prev_fonts_value' =>  $fonts,
                        'fonts_value' =>  $fonts,
                    ));
                } else {
                    $wpdb->insert("{$table}", array(
                        'post_id' => $id,
                        'prev_css_value' =>  $styles,
                        'prev_fonts_value' =>  $fonts,
                    ));
                }
            }

            $post = (array)$wpdb->get_results(
                "SELECT * FROM {$table} WHERE post_id = {$id}",
                OBJECT
            )[0];

            return $post;
        }

        /**
         * Get the posts array with the info
         *
         * @return $posts JSON feed of returned objects
         */
        public function get_maxi_blocks_sc_string()
        {
            global $wpdb;
            $table_name = $wpdb->prefix . 'maxi_blocks_general'; // table name
            $query = 'SELECT object FROM ' .
                     $table_name .
                     ' where id = "sc_string"';
        
            $response =  maybe_unserialize($wpdb->get_var($query));
        
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
                if ($style_card !== '') {
                    $new_style_card['_maxi_blocks_style_card'] = $style_card['_maxi_blocks_style_card'];
                }
            }
        
            if ($style_card === '') {
                $wpdb->insert("{$wpdb->prefix}maxi_blocks_general", array(
                        'id' => 'sc_string',
                        'object' =>  serialize($new_style_card),
                    ));
            } else {
                $wpdb->update("{$wpdb->prefix}maxi_blocks_general", array(
                            'id' => 'sc_string',
                            'object' =>  serialize($new_style_card),
                        ), [ 'id' => 'sc_string']);
            }
        
            return $new_style_card;
        }

        public function get_maxi_blocks_breakpoints()
        {
            return [
                'xs' => 480,
                's' => 768,
                'm' => 1024,
                'l' => 1366,
                'xl' => 1920,
            ];
        }

        public function mb_delete_register($postId)
        {
            global $wpdb;

            $table_styles =  $wpdb->prefix . 'maxi_blocks_styles';
            $table_custom_meta =  $wpdb->prefix . 'maxi_blocks_custom_data';

            $wpdb->query("DELETE FROM {$table_styles} WHERE post_id={$postId}");

            $wpdb->query("DELETE FROM {$table_custom_meta} WHERE post_id={$postId}");
        }

        public function get_maxi_blocks_current_style_cards()
        {
            global $wpdb;
            $table_name = $wpdb->prefix . 'maxi_blocks_general'; // table name
            $query =
                'SELECT object FROM ' .
                $table_name .
                ' where id = "style_cards_current"';
            $style_cards = $wpdb->get_var($query);
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
                $style_cards = $wpdb->get_var($query);
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

            // Retrieve information
            $response_code = wp_remote_retrieve_response_code($response);
            $response_message = wp_remote_retrieve_response_message($response);
            $response_body = wp_remote_retrieve_body($response);

            return new WP_REST_Response([
                'status' => $response_code,
                'response' => $response_message,
                'body_response' => $response_body,
            ]);
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

        public function get_maxi_blocks_current_global_motion_presets()
        {
            return get_option('maxi_motion_interaction_presets');
        }

        public function set_maxi_blocks_current_global_motion_presets(
            $request
        ) {
            $request_result = $request->get_json_params();
            $result = $request_result;

            return update_option(
                'maxi_motion_interaction_presets',
                $result['presets'],
            );
        }

        public function get_maxi_blocks_current_custom_data($id)
        {
            if (gettype($id) === 'object') {
                $id=$id['id'];
            }

            global $wpdb;
            $response = $wpdb->get_results(
                "SELECT custom_data_value FROM {$wpdb->prefix}maxi_blocks_custom_data WHERE post_id = {$id}",
                OBJECT
            );

            if (!$response) {
                $response = '';
            }

            return $response;
        }

        public function write_log($log)
        {
            if (is_array($log) || is_object($log)) {
                error_log(print_r($log, true));
            } else {
                error_log($log);
            }
        }

        public function set_maxi_blocks_current_custom_data($data)
        {
            $id = $data['id'];
            $update = $data['update'];
            $dataVal = $data['data'];

            if (empty($dataVal) || $dataVal === '{}') {
                return;
            }
            
            global $wpdb;

            $custom_data=$this->get_maxi_blocks_current_custom_data($id);

            if ($update) {
                $arrayNewData = json_decode($dataVal, true);
                $new_custom_data = serialize(array_merge_recursive(...array_values($arrayNewData)));

                $this-> write_log('$new_custom_data');
                $this-> write_log($new_custom_data);

                if ($new_custom_data === '') {
                    return $custom_data;
                }

                if ($custom_data === '') {
                    $wpdb->insert("{$wpdb->prefix}maxi_blocks_custom_data", array(
                    'post_id' => $id,
                    'prev_custom_data_value' =>  $new_custom_data,
                    'custom_data_value' =>  $new_custom_data,
                ));
                } else {
                    $wpdb->update("{$wpdb->prefix}maxi_blocks_custom_data", array(
                        'post_id' => $id,
                        'prev_custom_data_value' =>   $new_custom_data,
                        'custom_data_value' =>   $new_custom_data,
                    ), ['post_id' => $id]);
                }
            }

            return $new_custom_data;
        }
    }
endif;