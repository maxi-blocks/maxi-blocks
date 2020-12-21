<?php

/**
 * Maxi Blocks styles API
 */

if (!defined('ABSPATH')) {
    exit;
}

if (!class_exists('MaxiBlocksAPI')) :
    class MaxiBlocksAPI
    {

        private $version;
        private $namespace;

        /**
         * Constructor.
         */
        public function __construct()
        {
            $this->version   = '1.0';
            $this->namespace = 'maxi-blocks/v' . $this->version;

            // REST API
            add_action('rest_api_init', array($this, 'mb_register_routes'));

            // Handlers
            add_action('before_delete_post', array($this, 'mb_delete_register'));
        }

        /**
         * Register options for REST API
         */
        public function mb_register_options($id)
        {
            // Post API
            $default_array = [
                '_maxi_blocks_styles'           => '',
				'_maxi_blocks_styles_preview'   => '',
            ];
            if (!get_option("mb_post_api_$id"))
                add_option("mb_post_api_$id", $default_array);
        }

        /**
         * Register REST API routes
         */
        public function mb_register_routes()
        {
            register_rest_route(
                $this->namespace,
                '/post/(?P<id>\d+)',
                array(
                    'methods'             => 'GET',
                    'callback'            => array($this, 'get_maxi_blocks_post'),
                    'args' => array(
                        'id' => array(
                            'validate_callback' => function ($param) {
                                return is_numeric($param);
                            }
                        ),
                    ),
                    'permission_callback' => function () {
                        return current_user_can('edit_posts');
                    },
                )
            );
            register_rest_route(
                $this->namespace,
                '/post',
                array(
                    'methods'             => 'POST',
                    'callback'            => array($this, 'post_maxi_blocks_post'),
                    'args' => array(
                        'id' => array(
                            'validate_callback' => function ($param) {
                                return is_numeric($param);
                            }
                        ),
                        'meta' => array(
                            'validate_callback' => function ($param) {
                                return is_string($param);
                            }
                        ),
                        'update' => array(
                            'validate_callback' => function ($param) {
                                return is_bool($param);
                            }
                        ),
                    ),
                    'permission_callback' => function () {
                        return current_user_can('edit_posts');
                    },
                )
            );
            register_rest_route(
                $this->namespace,
                '/breakpoints',
                array(
                    'methods'             => 'GET',
                    'callback'            => array($this, 'get_maxi_blocks_breakpoints'),
                    'permission_callback' => function () {
                        return current_user_can('edit_posts');
                    },
                )
            );
            register_rest_route(
                $this->namespace,
                '/global-styles',
                array(
                    'methods'             => 'GET',
                    'callback'            => array($this, 'get_maxi_blocks_current_global_styles'),
                    'permission_callback' => function () {
                        return current_user_can('edit_posts');
                    },
                )
            );
            register_rest_route(
                $this->namespace,
                '/global-styles',
                array(
                    'methods'             => 'POST',
                    'callback'            => array($this, 'set_maxi_blocks_current_global_styles'),
                    'permission_callback' => function () {
                        return current_user_can('edit_posts');
                    },
                )
            );
            register_rest_route(
                $this->namespace,
                '/motion-presets',
                array(
                    'methods'             => 'GET',
                    'callback'            => array($this, 'get_maxi_blocks_current_global_motion_presets'),
                    'permission_callback' => function () {
                        return current_user_can('edit_posts');
                    },
                )
            );
            register_rest_route(
                $this->namespace,
                '/motion-presets',
                array(
                    'methods'             => 'POST',
                    'callback'            => array($this, 'set_maxi_blocks_current_global_motion_presets'),
                    'permission_callback' => function () {
                        return current_user_can('edit_posts');
                    },
                )
			);

			register_rest_route(
                $this->namespace,
                '/custom-data/(?P<id>\d+)',
                array(
                    'methods'             => 'GET',
					'callback'            => array($this, 'get_maxi_blocks_current_custom_data'),
					'args' => array(
                        'id' => array(
                            'validate_callback' => function ($param) {
                                return is_numeric($param);
                            }
                        ),
                    ),
                    'permission_callback' => function () {
                        return current_user_can('edit_posts');
                    },
                )
            );
            register_rest_route(
                $this->namespace,
                '/custom-data',
                array(
                    'methods'             => 'POST',
					'callback'            => array($this, 'set_maxi_blocks_current_custom_data'),
					'args' => array(
                        'id' => array(
                            'validate_callback' => function ($param) {
                                return is_numeric($param);
                            }
                        ),
                        'data' => array(
                            'validate_callback' => function ($param) {
                                return is_string($param);
                            }
                        ),
                        'update' => array(
                            'validate_callback' => function ($param) {
                                return is_bool($param);
                            }
                        ),
                    ),
                    'permission_callback' => function () {
                        return current_user_can('edit_posts');
                    },
                )
            );
        }

        /**
         * Get the posts array with the info
         *
         * @return $posts JSON feed of returned objects
         */
        public function get_maxi_blocks_post($data)
        {
            $this->mb_register_options($data['id']);

            $response = get_option("mb_post_api_{$data['id']}")['_maxi_blocks_styles_preview'];
            if(!$response)
                $response = '';

            return $response;
        }

        /**
         * Post the posts
         */
        public function post_maxi_blocks_post($data)
        {
            $this->mb_register_options($data['id']);

			$styles = get_option("mb_post_api_{$data['id']}");

            if ($data['update']) {
                $styles = [
                    '_maxi_blocks_styles'           => $data['meta'],
                    '_maxi_blocks_styles_preview'   => $data['meta'],
                ];
            } else
                $styles['_maxi_blocks_styles_preview'] = $data['meta'];

            update_option("mb_post_api_{$data['id']}", $styles);

            return $styles;
        }

        public function get_maxi_blocks_breakpoints()
        {
            return [
                'xs'    => 480,
                's'     => 768,
                'm'     => 1024,
                'l'     => 1366,
                'xl'    => 1920
            ];
        }

        public function mb_delete_register($postId)
        {
            delete_option("mb_post_api$postId");
        }

        public function get_maxi_blocks_current_global_styles() {
            global $wpdb;
            $table_name = $wpdb->prefix . 'maxi_blocks_general';  // table name
            $query = "SELECT object FROM ".$table_name." where id = style_cards_current_global_styles";
            $maxi_blocks_current_global_styles = $wpdb->get_var($query);
            if ($maxi_blocks_current_global_styles) {
                return $maxi_blocks_current_global_styles;
            }
        }

        public function set_maxi_blocks_current_global_styles($styles) {
            global $wpdb;
            $table_name = $wpdb->prefix . 'maxi_blocks_general';  // table name
            $wpdb->replace($table_name, array(
                'id' => 'style_cards_current_global_styles',
                'object' => $styles,
            ));
        }

        public function get_maxi_blocks_current_global_motion_presets() {
			return get_option('maxi_motion_interaction_presets');

        }

        public function set_maxi_blocks_current_global_motion_presets($request) {
			$request_result = $request->get_json_params();
			$result = $request_result;

			return update_option('maxi_motion_interaction_presets', $result['presets']);
		}

		public function mb_register_custom_data_option($id)
        {
            if (!get_option("mb_custom_data_$id"))
				add_option("mb_custom_data_$id", [ 'custom_data' => '' ]);
        }

		public function get_maxi_blocks_current_custom_data($data) {
			$this->mb_register_custom_data_option($data['id']);

            $response = get_option("mb_custom_data_{$data['id']}")['custom_data'];
            if(!$response)
                $response = '';

            return $response;
        }

        public function set_maxi_blocks_current_custom_data($data) {
			$this->mb_register_custom_data_option($data['id']);

			$custom_data = get_option("mb_custom_data_{$data['id']}");

            if ($data['update']) {

				$custom_data = ['custom_data' => $data['data'] ];

				update_option("mb_custom_data_{$data['id']}", $custom_data);

            }

            return $custom_data;
		}

    }


endif;

// Caller

return new MaxiBlocksAPI();
