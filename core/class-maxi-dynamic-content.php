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
        // register_block_type('maxi-blocks/text-maxi', array(
        //     'render_callback' => [
        //         $this,
        //         'dynamic_maxi_renderer',
        //     ],

        // ));
    }

    public function dynamic_maxi_renderer()
    {
        return 'OMG SUCCESS!';
    }
}