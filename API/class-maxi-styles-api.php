<?php

/**
 * Maxi Blocks styles API 
 */

if (!defined('ABSPATH')) {
    exit;
}

if (!class_exists('GXStylesAPI')) :

    /**
     * The EasyTheme API class
     */

    class GXStylesAPI
    {

        private $version;
        private $namespace;

        /**
         * Constructor.
         */
        public function __construct()
        {
            $this->version   = '1.0';
            $this->namespace = 'gx/v' . $this->version;

            // REST API for GX
            add_action('rest_api_init', array($this, 'gx_register_routes'));
        }

        /**
         * Register REST API routes
         */
        public function gx_register_routes()
        {
            register_rest_route(
                $this->namespace,
                '/default-theme-dark',
                array(
                    'methods'             => 'GET',
                    'callback'            => array($this, 'get_default_theme_dark'),
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
        public function get_default_theme_dark($data)
        {
            $response = array(
                'backgroundColor'        => get_theme_mod('body_background_colorDefault-color-dark')
            );

            return $response;
        }
    }

endif;

// Caller

return new GXStylesAPI();
