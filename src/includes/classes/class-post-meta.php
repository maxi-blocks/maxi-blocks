<?php

class PostMeta {

    /**
	 * This plugin's instance.
	 *
	 * @var PostMeta
	 */
	private static $instance;

	/**
	 * Registers the plugin.
	 */
	public static function register() {
		if ( null === self::$instance ) {
			self::$instance = new PostMeta();
		}
    }
    
    /**
	 * Constructor
	 */
	public function __construct() {
		add_filter( 'init', array( $this, 'register_meta' ) );
    }
    
    /**
	 * Register meta.
	 */
	public function register_meta() {
        $args = [
            'show_in_rest'  => true,
            'single'        => true,
            'auth_callback' => array( $this, 'auth_callback' ),
		];

		// Responsive styles
        register_meta(
			'post',
			'_gutenberg_extra_responsive_styles',
			$args
		);
    }

    /**
	 * Determine if the current user can edit posts
	 *
	 * @return bool True when can edit posts, else false.
	 */
	public function auth_callback() {
		return current_user_can( 'edit_posts' );
	}
}

PostMeta::register();