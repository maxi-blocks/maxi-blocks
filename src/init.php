<?php
/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since   1.0.0
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * Assets enqueued:
 * 1. blocks.style.build.css - Frontend + Backend.
 * 2. blocks.build.js - Backend.
 * 3. blocks.editor.build.css - Backend.
 *
 * @uses {wp-blocks} for block type registration & related functions.
 * @uses {wp-element} for WP Element abstraction — structure of blocks.
 * @uses {wp-i18n} to internationalize the block's text.
 * @uses {wp-editor} for WP editor styles.
 * @since 1.0.0
 */
function gutenberg_den_cgb_block_assets() { // phpcs:ignore
	// Register block styles for both frontend + backend.
	wp_register_style(
		'gutenberg_den-cgb-style-css', // Handle.
		plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ), // Block style CSS.
		array( 'wp-editor' ), // Dependency to include the CSS after it.
		null // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.style.build.css' ) // Version: File modification time.
	);

	// Register block editor script for backend.
	wp_register_script(
		'gutenberg_den-cgb-block-js', // Handle.
		plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ), // Block.build.js: We register the block here. Built with Webpack.
		array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor' ), // Dependencies, defined above.
		null, // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.build.js' ), // Version: filemtime — Gets file modification time.
		true // Enqueue the script in the footer.
	);

	// Register block editor styles for backend.
	wp_register_style(
		'gutenberg_den-cgb-block-editor-css', // Handle.
		plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ), // Block editor CSS.
		array( 'wp-edit-blocks' ), // Dependency to include the CSS after it.
		null // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.editor.build.css' ) // Version: File modification time.
	);

	/**
	 * Register Gutenberg block on server-side.
	 *
	 * Register the block on server-side to ensure that the block
	 * scripts and styles for both frontend and backend are
	 * enqueued when the editor loads.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/blocks/writing-your-first-block-type#enqueuing-block-scripts
	 * @since 1.16.0
	 */
	register_block_type(
		'cgb/block-gutenberg-extra', array(
			// Enqueue blocks.style.build.css on both frontend & backend.
			'style'         => 'gutenberg_den-cgb-style-css',
			// Enqueue blocks.build.js in the editor only.
			'editor_script' => 'gutenberg_den-cgb-block-js',
			// Enqueue blocks.editor.build.css in the editor only.
			'editor_style'  => 'gutenberg_den-cgb-block-editor-css',
		)
	);
}

// Hook: Block assets.
add_action( 'init', 'gutenberg_den_cgb_block_assets' );


function gutenberg_den_cgb_load_custom_wp_admin_script() {
        
	// Register block editor script for backend.
	wp_register_script(
		'gutenberg_den-cgb-block-js-admin', // Handle.
		plugins_url( '/js/library-button-modal.js', dirname( __FILE__ ) ), "",
		null,
		true
	);

	wp_enqueue_script('gutenberg_den-cgb-block-js-admin');

}


add_action( 'admin_enqueue_scripts', 'gutenberg_den_cgb_load_custom_wp_admin_script' );

function gutenberg_den_cgb_load_custom_wp_admin_style() {
        
	// Register block editor script for backend.
	wp_register_style(
		'gutenberg_den-cgb-block-css-admin', // Handle.
		plugins_url( '/css/gx-admin.css', dirname( __FILE__ ) )
	);

	wp_enqueue_style('gutenberg_den-cgb-block-css-admin');

}


add_action( 'admin_enqueue_scripts', 'gutenberg_den_cgb_load_custom_wp_admin_style' );


add_filter( 'block_categories', 'gutenberg_den_cgb_block_category' );

function gutenberg_den_cgb_block_category( $categories ) {
	return array_merge(
		$categories,
		array(
			array(
				'slug'  => 'gutenberg-extra-blocks',
				'title' => __( 'GutenbergExtra Blocks', 'gutenberg-extra-blocks' ),
			),
		)
	);
}


/* Enabled option */

if (!get_option('gx_enable')) add_option( 'gx_enable', 'enabled' );

function gx_get_option() {
    echo get_option('gx_enable');
    die();
}

function gx_insert_block() {

	$this_title = $_POST['gx_title'];
	$this_content = $_POST['gx_content'];

if ($this_content && $this_title ) {

	// 	$has_reusable_block = get_posts( array(
	// 	'name'           => $_POST['gx_title'],
	// 	'post_type'      => 'wp_block',
	// 	'posts_per_page' => 1
	// ) );

	// if ( ! $has_reusable_block ) {
		// No reusable block like ours detected.
	   wp_insert_post( array(
		'post_content'   => $_POST['gx_content'],
		'post_title'     => $_POST['gx_title'],
		'post_type'      => 'wp_block',
		'post_status'    => 'publish',
		'comment_status' => 'closed',
		'ping_status'    => 'closed',
		'guid'           => sprintf(
			'%s/wp_block/%s',
			site_url(),
			sanitize_title($_POST['gx_title'])
		)
	) );
	   echo 'success';
	//} //if ( ! $has_reusable_block )
	//else {echo 'You already have Block with the same name';}

} 
else {echo 'JSON Error';}
   

    wp_die();
}//function gx_insert_block()


// remove noopener noreferrer from gutenberg links
function gx_links_control( $rel, $link ) {
	return false;
}
add_filter( 'wp_targeted_link_rel', 'gx_links_control', 10, 2 );



add_action('wp_ajax_gx_get_option', 'gx_get_option', 9, 1);
add_action('wp_ajax_gx_insert_block', 'gx_insert_block', 10, 2);

require_once plugin_dir_path( __FILE__ ) . 'includes/layout/layout-functions.php';
require_once plugin_dir_path( __FILE__ ) . 'includes/layout/class-component-registry.php';
require_once plugin_dir_path( __FILE__ ) . 'includes/layout/register-layout-components.php';
require_once plugin_dir_path( __FILE__ ) . 'includes/gx-wp-dashboard.php';
