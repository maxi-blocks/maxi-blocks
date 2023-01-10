<?php

/**
 * Server side part of MaxiBlocks_DynamicContent Gutenberg component
 *
 * Generates dynamic content on frontend
 */
class MaxiBlocks_DynamicContent
{
    /**
     * This plugin's instance.
     *
     * @var MaxiBlocks_DynamicContent
     */
    private static $instance;

    /**
     * Registers the plugin.
     */
    public static function register()
    {
        if (null === self::$instance) {
            self::$instance = new MaxiBlocks_DynamicContent();
        }
    }

    /**
     * Constructor
     */
    public function __construct()
    {
        add_action('init', [
            $this,
            'register_dynamic_blocks',
        ]);
    }

    public function register_dynamic_blocks()
    {
        function maxi_add_rand_orderby_rest_api($query_params)
        {
            $query_params['orderby']['enum'][] = 'rand';
            return $query_params;
        }
        add_filter('rest_post_collection_params', 'maxi_add_rand_orderby_rest_api');
        add_filter('rest_page_collection_params', 'maxi_add_rand_orderby_rest_api');
    }

    public function dynamic_maxi_renderer()
    {
        return 'OMG SUCCESS!';
    }
}