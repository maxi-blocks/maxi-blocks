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
            add_action('init', array($this, 'mb_register_options'));
            add_action('rest_api_init', array($this, 'mb_register_routes'));

            // Handlers
            add_action('before_delete_post', array($this, 'mb_delete_register'));
        }

        /**
         * Register options for REST API
         */
        public function mb_register_options()
        {
            // Styles API
            if (!get_option('mb_styles_api'))
                add_option('mb_styles_api', []);
        }

        /**
         * Register REST API routes
         */
        public function mb_register_routes()
        {
            register_rest_route(
                $this->namespace,
                '/maxi-blocks-styles/(?P<id>\d+)',
                array(
                    'methods'             => 'GET',
                    'callback'            => array($this, 'get_maxi_blocks_styles'),
                    'args' => array(
                        'id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                    ),
                    'permission_callback' => function () {
                        return current_user_can('edit_posts');
                    },
                    'schema' => array($this, 'schema_maxi_blocks_styles'),
                )
            );
            register_rest_route(
                $this->namespace,
                '/maxi-blocks-styles',
                array(
                    'methods'             => 'POST',
                    'callback'            => array($this, 'post_maxi_blocks_styles'),
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
                    'schema' => array($this, 'schema_maxi_blocks_styles'),
                )
            );
        }

        /**
         * Get the posts array with the info
         *
         * @return $posts JSON feed of returned objects
         */
        public function get_maxi_blocks_styles($data)
        {
            $response = get_option('mb_styles_api')[$data['id']]['_maxi_blocks_styles_preview'];

            return $response;
        }

        /**
         * Post the posts
         */
        public function post_maxi_blocks_styles($data)
        {
            $styles = get_option('mb_styles_api');

            if ($data['update']) {
                $styles[$data['id']] = [
                    '_maxi_blocks_styles'           => $data['meta'],
                    '_maxi_blocks_styles_preview'   => $data['meta']
                ];
            } else
                $styles[$data['id']]['_maxi_blocks_styles_preview'] = $data['meta'];

            update_option('mb_styles_api', $styles);

            return true;
        }

        public function mb_delete_register($postId)
        {
            $styles = get_option('mb_styles_api');

            unset($styles[$postId]);

            update_option('mb_styles_api', $styles);
        }
    }


endif;

// Caller

return new MaxiBlocksAPI();
