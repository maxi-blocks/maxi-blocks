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
                '_maxi_blocks_styles_preview'   => ''
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
                    '_maxi_blocks_styles_preview'   => $data['meta']
                ];
            } else
                $styles['_maxi_blocks_styles_preview'] = $data['meta'];

            update_option("mb_post_api_{$data['id']}", $styles);

            return $styles;
        }

        public function get_maxi_blocks_breakpoints()
        {
            return [
                'xs'    => 568,
                's'     => 768,
                'm'     => 1024,
                'l'     => 1366,
                'xl'    => 1680
            ];
        }

        public function mb_delete_register($postId)
        {
            delete_option("mb_post_api$postId");
        }
    }


endif;

// Caller

return new MaxiBlocksAPI();
