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


function gutenberg_extra_block_assets() { // phpcs:ignore
	// Register block styles for both frontend + backend.
	wp_register_style(
		'gutenberg_extra-style-css', // Handle.
		plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ), // Block style CSS.
		array( 'wp-editor' ), // Dependency to include the CSS after it.
		null // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.style.build.css' ) // Version: File modification time.
	);

	// Register block editor script for backend.
	wp_register_script(
		'gutenberg_extra-block-js', // Handle.
		plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ), // Block.build.js: We register the block here. Built with Webpack.
		array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor' ), // Dependencies, defined above.
		null, // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.build.js' ), // Version: filemtime — Gets file modification time.
		true // Enqueue the script in the footer.
	);

	// Register block editor styles for backend.
	wp_register_style(
		'gutenberg_extra-block-editor-css', // Handle.
		plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ), // Block editor CSS.
		array( 'wp-edit-blocks' ), // Dependency to include the CSS after it.
		null // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.editor.build.css' ) // Version: File modification time.
	);

	// Register block editor styles for backend.




	// wp_enqueue_script(
	// 	'maxi-blocks-tilt-js', // Handle.
	// 	plugins_url( '/js/hover-animations/hover/tilt/tilt.jquery.min.js', dirname( __FILE__ ) ), array('jquery')
	// );

	// wp_enqueue_script(
	// 	'maxi-blocks-tilt-hover-js', // Handle.
	// 	plugins_url( '/js/hover-animations/hover/tilt/index.js', dirname( __FILE__ ) ), array('jquery')
	// );

	// wp_enqueue_script(
	// 	'maxi-blocks-zoom-in-hover-js', // Handle.
	// 	plugins_url( '/js/hover-animations/hover/zoom-in/zoom-in.js', dirname( __FILE__ ) ), array('jquery')
	// );

	// wp_enqueue_script(
	// 	'maxi-blocks-zoom-out-hover-js', // Handle.
	// 	plugins_url( '/js/hover-animations/hover/zoom-out/zoom-out.js', dirname( __FILE__ ) ), array('jquery')
	// );

	// wp_enqueue_script(
	// 	'maxi-blocks-slide-hover-js', // Handle.
	// 	plugins_url( '/js/hover-animations/hover/slide/slide.js', dirname( __FILE__ ) ), array('jquery')
	// );

	// wp_enqueue_script(
	// 	'maxi-blocks-rotate-hover-js', // Handle.
	// 	plugins_url( '/js/hover-animations/hover/rotate/rotate.js', dirname( __FILE__ ) ), array('jquery')
	// );

	// wp_enqueue_script(
	// 	'maxi-blocks-blur-hover-js', // Handle.
	// 	plugins_url( '/js/hover-animations/hover/blur/blur.js', dirname( __FILE__ ) ), array('jquery')
	// );


	// wp_enqueue_script(
	// 	'maxi-blocks-gray-scale-hover-js', // Handle.
	// 	plugins_url( '/js/hover-animations/hover/gray-scale/gray-scale.js', dirname( __FILE__ ) ), array('jquery')
	// );


 //    wp_enqueue_script(
 //        'maxi-blocks-clear-gray-scale-hover-js', // Handle.
 //        plugins_url( '/js/hover-animations/hover/clear-gray-scale/clear-gray-scale.js', dirname( __FILE__ ) ), array('jquery')
 //    );


	// wp_enqueue_script(
	// 	'maxi-blocks-opacity-hover-js', // Handle.
	// 	plugins_url( '/js/hover-animations/hover/opacity/opacity.js', dirname( __FILE__ ) ), array('jquery')
	// );


	// wp_enqueue_script(
	// 	'maxi-blocks-opacity-with-colour-hover-js', // Handle.
	// 	plugins_url( '/js/hover-animations/hover/opacity-with-colour/opacity-with-colour.js', dirname( __FILE__ ) ), array('jquery')
	// );


	// wp_enqueue_script(
	// 	'maxi-blocks-shine-hover-js', // Handle.
	// 	plugins_url( '/js/hover-animations/hover/shine/shine.js', dirname( __FILE__ ) ), array('jquery')
	// );


	// wp_enqueue_script(
	// 	'maxi-blocks-circle-hover-js', // Handle.
	// 	plugins_url( '/js/hover-animations/hover/circle/circle.js', dirname( __FILE__ ) ), array('jquery')
	// );


	// wp_enqueue_script(
	// 	'maxi-blocks-clear-blur-hover-js', // Handle.
	// 	plugins_url( '/js/hover-animations/hover/clear-blur/clear-blur.js', dirname( __FILE__ ) ), array('jquery')
	// );


	wp_enqueue_script(
		'maxi-blocks-fade-hover-js', // Handle.
		plugins_url( '/js/hover-animations/text/fade/fade.js', dirname( __FILE__ ) ), array('jquery')
	);


	wp_enqueue_script(
		'maxi-blocks-push-up-hover-js', // Handle.
		plugins_url( '/js/hover-animations/text/push-up/push-up.js', dirname( __FILE__ ) ), array('jquery')
	);



	wp_enqueue_script(
		'maxi-blocks-push-down-hover-js', // Handle.
		plugins_url( '/js/hover-animations/text/push-down/push-down.js', dirname( __FILE__ ) ), array('jquery')
	);


	wp_enqueue_script(
		'maxi-blocks-push-left-hover-js', // Handle.
		plugins_url( '/js/hover-animations/text/push-left/push-left.js', dirname( __FILE__ ) ), array('jquery')
	);


	wp_enqueue_script(
		'maxi-blocks-push-right-hover-js', // Handle.
		plugins_url( '/js/hover-animations/text/push-right/push-right.js', dirname( __FILE__ ) ), array('jquery')
	);


	wp_enqueue_script(
		'maxi-blocks-slide-up-hover-js', // Handle.
		plugins_url( '/js/hover-animations/text/slide-up/slide-up.js', dirname( __FILE__ ) ), array('jquery')
	);


	wp_enqueue_script(
		'maxi-blocks-slide-down-hover-js', // Handle.
		plugins_url( '/js/hover-animations/text/slide-down/slide-down.js', dirname( __FILE__ ) ), array('jquery')
	);


	wp_enqueue_script(
		'maxi-blocks-slide-left-hover-js', // Handle.
		plugins_url( '/js/hover-animations/text/slide-left/slide-left.js', dirname( __FILE__ ) ), array('jquery')
	);


	wp_enqueue_script(
		'maxi-blocks-slide-right-hover-js', // Handle.
		plugins_url( '/js/hover-animations/text/slide-right/slide-right.js', dirname( __FILE__ ) ), array('jquery')
	);


	wp_enqueue_script(
		'maxi-blocks-reveal-up-hover-js', // Handle.
		plugins_url( '/js/hover-animations/text/reveal-up/reveal-up.js', dirname( __FILE__ ) ), array('jquery')
	);


	wp_enqueue_script(
		'maxi-blocks-reveal-down-hover-js', // Handle.
		plugins_url( '/js/hover-animations/text/reveal-down/reveal-down.js', dirname( __FILE__ ) ), array('jquery')
	);


	wp_enqueue_script(
		'maxi-blocks-reveal-left-hover-js', // Handle.
		plugins_url( '/js/hover-animations/text/reveal-left/reveal-left.js', dirname( __FILE__ ) ), array('jquery')
	);


	wp_enqueue_script(
		'maxi-blocks-reveal-right-hover-js', // Handle.
		plugins_url( '/js/hover-animations/text/reveal-right/reveal-right.js', dirname( __FILE__ ) ), array('jquery')
	);



	wp_enqueue_script(
		'maxi-blocks-hinge-up-hover-js', // Handle.
		plugins_url( '/js/hover-animations/text/hinge-up/hinge-up.js', dirname( __FILE__ ) ), array('jquery')
	);



	wp_enqueue_script(
		'maxi-blocks-hinge-down-hover-js', // Handle.
		plugins_url( '/js/hover-animations/text/hinge-down/hinge-down.js', dirname( __FILE__ ) ), array('jquery')
	);



	wp_enqueue_script(
		'maxi-blocks-hinge-left-hover-js', // Handle.
		plugins_url( '/js/hover-animations/text/hinge-left/hinge-left.js', dirname( __FILE__ ) ), array('jquery')
	);



	wp_enqueue_script(
		'maxi-blocks-hinge-right-hover-js', // Handle.
		plugins_url( '/js/hover-animations/text/hinge-right/hinge-right.js', dirname( __FILE__ ) ), array('jquery')
	);



	wp_enqueue_script(
		'maxi-blocks-flip-horizontal-hover-js', // Handle.
		plugins_url( '/js/hover-animations/text/flip-horizontal/flip-horizontal.js', dirname( __FILE__ ) ), array('jquery')
	);



	wp_enqueue_script(
		'maxi-blocks-flip-vertical-hover-js', // Handle.
		plugins_url( '/js/hover-animations/text/flip-vertical/flip-vertical.js', dirname( __FILE__ ) ), array('jquery')
	);



	wp_enqueue_script(
		'maxi-blocks-flip-diagonal-hover-js', // Handle.
		plugins_url( '/js/hover-animations/text/flip-diagonal/flip-diagonal.js', dirname( __FILE__ ) ), array('jquery')
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
		'cgb/block-maxi-blocks', array(
			// Enqueue blocks.style.build.css on both frontend & backend.
			'style'         => 'gutenberg_extra-style-css',
			// Enqueue blocks.build.js in the editor only.
			'editor_script' => 'gutenberg_extra-block-js',
			// Enqueue blocks.editor.build.css in the editor only.
			'editor_style'  => 'gutenberg_extra-block-editor-css',
		)
	);
}

// Hook: Block assets.
add_action( 'init', 'gutenberg_extra_block_assets' );


function gutenberg_extra_load_custom_wp_admin_script() {

	// Register block editor script for backend.
	wp_enqueue_script(
		'maxi-blocks-cloud-js', // Handle.
		plugins_url( '/js/cloud-server.js', dirname( __FILE__ ) ),
		array( 'jquery', 'wp-blocks', 'wp-edit-post', 'wp-api')
	);

	wp_register_script('maxi-blocks-gutenberg-ui-js', plugins_url( '/js/gutenberg-ui.js', dirname( __FILE__ ) ), array( 'wp-i18n' ), null, true);
	wp_localize_script('maxi-blocks-gutenberg-ui-js', 'maxiGutenbergUI', array(
	    'maxi-plugin-url' => plugins_url()
	));

	wp_enqueue_script('maxi-blocks-gutenberg-ui-js');

}

add_action( 'admin_enqueue_scripts', 'gutenberg_extra_load_custom_wp_admin_script' );

function gutenberg_extra_load_custom_wp_admin_style() {

	// Register block editor script for backend.
	wp_register_style(
		'gutenberg_extra-block-css-admin', // Handle.
		plugins_url( '/css/maxi-admin.css', dirname( __FILE__ ) )
	);

	wp_enqueue_style('gutenberg_extra-block-css-admin');

}
add_action( 'admin_enqueue_scripts', 'gutenberg_extra_load_custom_wp_admin_style' );


function maxi_load_custom_wp_front_script() {

	wp_enqueue_script(
		'maxi-gsap-lib-js',
		plugins_url( '/js/gsap.min.js', dirname( __FILE__ ) )
	);

	wp_enqueue_script(
		'maxi-gsap-scroll-trigger-js',
		plugins_url( '/js/ScrollTrigger.min.js', dirname( __FILE__ ) )
	);

	wp_enqueue_script(
		'maxi-front-scripts-js',
		plugins_url( '/js/front-scripts.js', dirname( __FILE__ ) ),
		array(), false, true
	);

}

add_action( 'wp_enqueue_scripts', 'maxi_load_custom_wp_front_script' );



function gutenberg_extra_zoom_in_style() {

	// Register block editor script for backend.
	// wp_register_style(
	// 	'gutenberg_extra-block-zoom-in', // Handle.
	// 	plugins_url( '/js/hover-animations/hover/zoom-in/zoom-in.css', dirname( __FILE__ ) )
	// );

	// wp_enqueue_style('gutenberg_extra-block-zoom-in');


	// wp_register_style(
	// 	'gutenberg_extra-block-zoom-out', // Handle.
	// 	plugins_url( '/js/hover-animations/hover/zoom-out/zoom-out.css', dirname( __FILE__ ) )
	// );

	// wp_enqueue_style('gutenberg_extra-block-zoom-out');

	// wp_register_style(
	// 	'gutenberg_extra-block-slide', // Handle.
	// 	plugins_url( '/js/hover-animations/hover/slide/slide.css', dirname( __FILE__ ) )
	// );

	// wp_enqueue_style('gutenberg_extra-block-slide');



 //    wp_register_style(
 //        'gutenberg_extra-block-rotate', // Handle.
 //        plugins_url( '/js/hover-animations/hover/rotate/rotate.css', dirname( __FILE__ ) )
 //    );

 //    wp_enqueue_style('gutenberg_extra-block-rotate');



 //    wp_register_style(
 //        'gutenberg_extra-block-blur', // Handle.
 //        plugins_url( '/js/hover-animations/hover/blur/blur.css', dirname( __FILE__ ) )
 //    );

 //    wp_enqueue_style('gutenberg_extra-block-blur');

 //    wp_register_style(
 //        'gutenberg_extra-block-gray-scale', // Handle.
 //        plugins_url( '/js/hover-animations/hover/gray-scale/gray-scale.css', dirname( __FILE__ ) )
 //    );

 //    wp_enqueue_style('gutenberg_extra-block-gray-scale');



 //    wp_register_style(
 //        'gutenberg_extra-block-clear-gray-scale', // Handle.
 //        plugins_url( '/js/hover-animations/hover/clear-gray-scale/clear-gray-scale.css', dirname( __FILE__ ) )
 //    );

 //    wp_enqueue_style('gutenberg_extra-block-clear-gray-scale');



 //    wp_register_style(
 //        'gutenberg_extra-block-opacity', // Handle.
 //        plugins_url( '/js/hover-animations/hover/opacity/opacity.css', dirname( __FILE__ ) )
 //    );

 //    wp_enqueue_style('gutenberg_extra-block-opacity');


 //    wp_register_style(
 //        'gutenberg_extra-block-opacity-with-colour', // Handle.
 //        plugins_url( '/js/hover-animations/hover/opacity-with-colour/opacity-with-colour.css', dirname( __FILE__ ) )
 //    );

 //    wp_enqueue_style('gutenberg_extra-block-opacity-with-colour');

 //    wp_register_style(
 //        'gutenberg_extra-block-shine', // Handle.
 //        plugins_url( '/js/hover-animations/hover/shine/shine.css', dirname( __FILE__ ) )
 //    );

 //    wp_enqueue_style('gutenberg_extra-block-shine');

 //    wp_register_style(
 //        'gutenberg_extra-block-circle', // Handle.
 //        plugins_url( '/js/hover-animations/hover/circle/circle.css', dirname( __FILE__ ) )
 //    );

 //    wp_enqueue_style('gutenberg_extra-block-circle');



 //    wp_register_style(
 //        'gutenberg_extra-block-clear-blur', // Handle.
 //        plugins_url( '/js/hover-animations/hover/clear-blur/clear-blur.css', dirname( __FILE__ ) )
 //    );

 //    wp_enqueue_style('gutenberg_extra-block-clear-blur');


    wp_register_style(
        'gutenberg_extra-block-fade', // Handle.
        plugins_url( '/js/hover-animations/text/fade/fade.css', dirname( __FILE__ ) )
    );

    wp_enqueue_style('gutenberg_extra-block-fade');



    wp_register_style(
        'gutenberg_extra-block-push-up', // Handle.
        plugins_url( '/js/hover-animations/text/push-up/push-up.css', dirname( __FILE__ ) )
    );

    wp_enqueue_style('gutenberg_extra-block-push-up');



    wp_register_style(
        'gutenberg_extra-block-push-down', // Handle.
        plugins_url( '/js/hover-animations/text/push-down/push-down.css', dirname( __FILE__ ) )
    );

    wp_enqueue_style('gutenberg_extra-block-push-down');



    wp_register_style(
        'gutenberg_extra-block-push-left', // Handle.
        plugins_url( '/js/hover-animations/text/push-left/push-left.css', dirname( __FILE__ ) )
    );

    wp_enqueue_style('gutenberg_extra-block-push-left');



    wp_register_style(
        'gutenberg_extra-block-push-right', // Handle.
        plugins_url( '/js/hover-animations/text/push-right/push-right.css', dirname( __FILE__ ) )
    );

    wp_enqueue_style('gutenberg_extra-block-push-right');



    wp_register_style(
        'gutenberg_extra-block-slide-up', // Handle.
        plugins_url( '/js/hover-animations/text/slide-up/slide-up.css', dirname( __FILE__ ) )
    );

    wp_enqueue_style('gutenberg_extra-block-slide-up');



    wp_register_style(
        'gutenberg_extra-block-slide-down', // Handle.
        plugins_url( '/js/hover-animations/text/slide-down/slide-down.css', dirname( __FILE__ ) )
    );

    wp_enqueue_style('gutenberg_extra-block-slide-down');


    wp_register_style(
        'gutenberg_extra-block-slide-left', // Handle.
        plugins_url( '/js/hover-animations/text/slide-left/slide-left.css', dirname( __FILE__ ) )
    );

    wp_enqueue_style('gutenberg_extra-block-slide-left');


    wp_register_style(
        'gutenberg_extra-block-slide-right', // Handle.
        plugins_url( '/js/hover-animations/text/slide-right/slide-right.css', dirname( __FILE__ ) )
    );

    wp_enqueue_style('gutenberg_extra-block-slide-right');



    wp_register_style(
        'gutenberg_extra-block-reveal-up', // Handle.
        plugins_url( '/js/hover-animations/text/reveal-up/reveal-up.css', dirname( __FILE__ ) )
    );

    wp_enqueue_style('gutenberg_extra-block-reveal-up');



    wp_register_style(
        'gutenberg_extra-block-reveal-down', // Handle.
        plugins_url( '/js/hover-animations/text/reveal-down/reveal-down.css', dirname( __FILE__ ) )
    );

    wp_enqueue_style('gutenberg_extra-block-reveal-down');



    wp_register_style(
        'gutenberg_extra-block-reveal-left', // Handle.
        plugins_url( '/js/hover-animations/text/reveal-left/reveal-left.css', dirname( __FILE__ ) )
    );

    wp_enqueue_style('gutenberg_extra-block-reveal-left');



    wp_register_style(
        'gutenberg_extra-block-reveal-right', // Handle.
        plugins_url( '/js/hover-animations/text/reveal-right/reveal-right.css', dirname( __FILE__ ) )
    );

    wp_enqueue_style('gutenberg_extra-block-reveal-right');



    wp_register_style(
        'gutenberg_extra-block-hinge-up', // Handle.
        plugins_url( '/js/hover-animations/text/hinge-up/hinge-up.css', dirname( __FILE__ ) )
    );

    wp_enqueue_style('gutenberg_extra-block-hinge-up');



    wp_register_style(
        'gutenberg_extra-block-hinge-down', // Handle.
        plugins_url( '/js/hover-animations/text/hinge-down/hinge-down.css', dirname( __FILE__ ) )
    );

    wp_enqueue_style('gutenberg_extra-block-hinge-down');



    wp_register_style(
        'gutenberg_extra-block-hinge-left', // Handle.
        plugins_url( '/js/hover-animations/text/hinge-left/hinge-left.css', dirname( __FILE__ ) )
    );

    wp_enqueue_style('gutenberg_extra-block-hinge-left');


    wp_register_style(
        'gutenberg_extra-block-hinge-right', // Handle.
        plugins_url( '/js/hover-animations/text/hinge-right/hinge-right.css', dirname( __FILE__ ) )
    );

    wp_enqueue_style('gutenberg_extra-block-hinge-right');


    wp_register_style(
        'gutenberg_extra-block-flip-horizontal', // Handle.
        plugins_url( '/js/hover-animations/text/flip-horizontal/flip-horizontal.css', dirname( __FILE__ ) )
    );

    wp_enqueue_style('gutenberg_extra-block-flip-horizontal');


    wp_register_style(
        'gutenberg_extra-block-flip-vertical', // Handle.
        plugins_url( '/js/hover-animations/text/flip-vertical/flip-vertical.css', dirname( __FILE__ ) )
    );

    wp_enqueue_style('gutenberg_extra-block-flip-vertical');


    wp_register_style(
        'gutenberg_extra-block-flip-diagonal', // Handle.
        plugins_url( '/js/hover-animations/text/flip-diagonal/flip-diagonal.css', dirname( __FILE__ ) )
    );

    wp_enqueue_style('gutenberg_extra-block-flip-diagonal');



}


add_action( 'init', 'gutenberg_extra_zoom_in_style' );


add_filter( 'block_categories', 'gutenberg_extra_block_category' );

function gutenberg_extra_block_category( $categories ) {
	//print_r($categories);
	return array_merge(
		array(
			array(
				'slug'  => 'maxi-blocks',
				'title' => __( 'Maxi Blocks', 'maxi-blocks' ),
			)
		),
		$categories
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

// require_once plugin_dir_path( __FILE__ ) . 'includes/layout/layout-functions.php';
// require_once plugin_dir_path( __FILE__ ) . 'includes/layout/class-component-registry.php';
// require_once plugin_dir_path( __FILE__ ) . 'includes/layout/register-layout-components.php';
// require_once plugin_dir_path( __FILE__ ) . 'includes/maxi-wp-dashboard.php';

// Post Meta register
require_once plugin_dir_path( __FILE__ ) . 'includes/classes/class-responsive-frontend-block-styles.php';

// Image crop and image sizes
require_once plugin_dir_path( __FILE__ ) . 'includes/classes/class-image-size.php';

add_action('wp_ajax_maxi_import_images', 'maxi_import_images', 3, 2);
add_action('wp_ajax_maxi_import_reusable_blocks', 'maxi_import_reusable_blocks', 4, 2);

if ( ! function_exists('write_log')) {
   function write_log ( $log )  {
      if ( is_array( $log ) || is_object( $log ) ) {
         error_log( print_r( $log, true ) );
      } else {
         error_log( $log );
      }
   }
}

//======================================================================
// UPLOAD IMAGES
//======================================================================

function maxi_media_file_already_exists($filename){
    global $wpdb;
    $query = "SELECT post_id FROM {$wpdb->postmeta} WHERE meta_value LIKE '%/$filename'";

    if ( $wpdb->get_var($query) ){
    	$post_title_for_image=substr($filename, 0 , (strrpos($filename, ".")));
    	write_log('$post_title');
    	write_log($post_title_for_image);
    	$query2 = "SELECT ID FROM {$wpdb->posts} WHERE (post_type='attachment' AND post_title LIKE '$post_title_for_image')";
    	//write_log($wpdb->get_var($query2));
        $image_id = $wpdb->get_var($query2);

        write_log('$image_id');
        write_log($image_id);
        return $image_id;
    }

    return 0;
}

function maxi_import_images(){
    //echo 'START: maxi_import_image_to_upload';
   write_log('START: maxi_import_image_to_upload');
    global $wpdb;
   // session_start();

    write_log('=========================');


    $maxi_images_to_upload = json_decode(stripslashes($_POST['maxi_images_to_upload']));
    write_log('maxi_images_to_upload');
    write_log($maxi_images_to_upload);

    //$maxi_post_id_for_image_to_upload = $_SESSION['maxi_post_id_for_image'];
    $maxi_post_id_for_image_to_upload = $_POST['maxi_post_id'];
    write_log('$maxi_post_id_for_image_to_upload:');
    write_log($maxi_post_id_for_image_to_upload);

    //echo 'GET $_SESSION: '.$maxi_post_id_for_image_to_upload;

    if (empty($maxi_images_to_upload) || empty($maxi_post_id_for_image_to_upload)) {
       // echo 'empry posts raw';
       write_log('empry posts raw');
        return;
    }

    if (!function_exists('post_exists')) {
        require_once(ABSPATH . 'wp-admin/includes/post.php');
    }

    // placeholder image
    $maxi_placeholder_image = esc_url( plugins_url( 'img/placeholder.jpg', 'maxi-blocks/plugin.php' ));

 	foreach($maxi_images_to_upload as $maxi_image_to_upload) {

 		write_log('$maxi_image_to_upload');
 		write_log($maxi_image_to_upload);

	    $maxi_post_title=basename($maxi_image_to_upload);

	    //$maxi_post_title = strstr($maxi_image_to_upload, 'http', true);

	    write_log('$maxi_post_title:');
	    write_log($maxi_post_title);

	    $maxi_filename = sanitize_file_name($maxi_post_title);

	    //$maxi_filename = $maxi_post_title.'-featured-image-ddp.jpg';

	    write_log('maxi_filename: ');

	    write_log($maxi_filename);
	  //echo $maxi_filename;
	  /// echo 'maxi_media_file_already_exists: '.maxi_media_file_already_exists($maxi_filename) ;
	    write_log('maxi_media_file_already_exists: ');
	    write_log(maxi_media_file_already_exists($maxi_filename));

	   $post_id =  $maxi_post_id_for_image_to_upload;


	    if($post_id) {
	        if (maxi_media_file_already_exists($maxi_filename) === 0) {
	           write_log('Does not exist');
	           if(@file_get_contents($maxi_image_to_upload) !== FALSE) {
		            $maxi_upload_file = wp_upload_bits($maxi_filename, null, @file_get_contents($maxi_image_to_upload));
		            write_log('$maxi_upload_file');
		            write_log($maxi_upload_file);
		            if(!$maxi_upload_file['error']) {
		              //if succesfull insert the new file into the media library (create a new attachment post type)
		              $maxi_wp_filetype = wp_check_filetype($maxi_filename, null );
		              $maxi_attachment = array(
		                'post_mime_type' => $maxi_wp_filetype['type'],
		                'post_parent' => $post_id,
		                'post_title' => preg_replace('/\.[^.]+$/', '', $maxi_filename),
		                'post_content' => '',
		                'post_status' => 'inherit'
		              );
		              //wp_insert_attachment( $maxi_attachment, $maxi_filename, $parent_post_id );

		              $maxi_attachment_id = wp_insert_attachment( $maxi_attachment, $maxi_upload_file['file'], $post_id );
		              write_log('$maxi_attachment_id');
		              write_log($maxi_attachment_id);
		              if (!is_wp_error($maxi_attachment_id)) {
		                 //if attachment post was successfully created, insert it as a thumbnail to the post $post_id
		                 require_once(ABSPATH . "wp-admin" . '/includes/image.php');
		                 //wp_generate_attachment_metadata( $maxi_attachment_id, $file ); for images
		                 $maxi_attachment_data = wp_generate_attachment_metadata( $maxi_attachment_id, $maxi_upload_file['file'] );
		                 wp_update_attachment_metadata( $maxi_attachment_id,  $maxi_attachment_data );
		                 echo $maxi_image_to_upload.'|'.wp_get_attachment_image_src($maxi_attachment_id, 'full')[0].',';
		               }
		               else {
		               	echo $maxi_image_to_upload.'|'.$maxi_placeholder_image.',';
		               	write_log('Using placeholder: uploaded attachment error');
		               }
		            }
		            else {
		            	echo $maxi_image_to_upload.'|'.$maxi_placeholder_image.',';
		            	write_log('Using placeholder: upload error');
		            }
		        }
		        else {
		        	echo $maxi_image_to_upload.'|'.$maxi_placeholder_image.',';
		        	write_log('Using placeholder: original image is empty');
		        } //if(@file_get_contents($maxi_image_to_upload) !== "")
	    	} //if (maxi_media_file_already_exists($maxi_filename) === 0)
	        else {
	        	$maxi_existing_image = wp_get_attachment_image_src(maxi_media_file_already_exists($maxi_filename), 'full');
	        	if (!is_wp_error($maxi_existing_image)) {
	        		echo $maxi_image_to_upload.'|'.$maxi_existing_image[0].',';
	           		write_log('Exists');
	        	}
	        	else {
	               	echo $maxi_image_to_upload.'|'.$maxi_placeholder_image.',';
	               	write_log('Using placeholder: existing attachment error');
	            }
	        }
	    } //if($post_id)

	} // foreach end

   //echo 'END: maxi_import_image_to_upload';
    write_log('END: maxi_import_image_to_upload');
     write_log('________________________________________________');

    die();

} //maxi_import_image_to_upload($maxi_image_to_upload)


function maxi_import_reusable_blocks() {

	$maxi_reusable_block_title = $_POST['maxi_reusable_block_title'];
	write_log('maxi_reusable_block_title: ');
	write_log($maxi_reusable_block_title);

	//$maxi_post_id_for_image_to_upload = $_SESSION['maxi_post_id_for_image'];
	$maxi_reusable_block_content = $_POST['maxi_reusable_block_content'];
	write_log('$maxi_reusable_block_content: ');
	write_log($maxi_reusable_block_content);
	$reusable_block_exists = get_posts( array(
		'name'           => sanitize_title( $maxi_reusable_block_title ),
		'post_type'      => 'wp_block',
		'posts_per_page' => 1
	) );

	if ( ! $reusable_block_exists ) {
		wp_insert_post( array(
			'post_content'   => $maxi_reusable_block_content,
			'post_title'     => $maxi_reusable_block_title,
			'post_type'      => 'wp_block',
			'post_status'    => 'publish',
			'comment_status' => 'closed',
			'ping_status'    => 'closed',
			'guid'           => sprintf(
				'%s/wp_block/%s',
				site_url(),
				sanitize_title( $maxi_reusable_block_title )
			)
		) );
	}

	die();
}

/**
 * Maxi blocks body classes
 */
add_filter('body_class', 'maxi_blocks_body_class');
add_filter('admin_body_class', 'maxi_blocks_body_class');
function maxi_blocks_body_class($classes) {
	$MBClass = ' maxi-blocks--active ';
	if(gettype($classes) === 'string')
		$classes .= $MBClass;
	if(gettype($classes) === 'array')
		array_push($classes, $MBClass);

	return $classes;
}


// Add a metabox for Custon Css into Document sidebar
add_action( 'add_meta_boxes', 'maxi_add_metaboxes', 10, 2 );

function maxi_add_metaboxes() {
  add_meta_box( 'maxi_metabox', __('Custom CSS (for that page only)', 'maxi-blocks'), 'maxi_metabox_content', '', 'side', 'high' );
}


function maxi_metabox_content() {
	global $post; // Get the current post data
	$maxi_blocks_custom_ccs_page = get_post_meta( $post->ID, 'maxi_blocks_custom_ccs_page', true ); // Get the saved values
	echo '<div>
        <textarea style="width: 100%"
        	rows="5"
        	id="maxi_blocks_custom_ccs_page"
        	name="maxi_blocks_custom_ccs_page"
        	val="'.$maxi_blocks_custom_ccs_page.'"
        	>'.$maxi_blocks_custom_ccs_page.'
        </textarea>
    	</div>';

    wp_nonce_field( 'maxi_blocks_custom_ccs_page_nonce', 'maxi_blocks_custom_ccs_page_process' );
}

function maxi_save_metabox( $post_id, $post ) {

	if ( !isset( $_POST['maxi_blocks_custom_ccs_page_process'] ) ) return;
	if ( !wp_verify_nonce( $_POST['maxi_blocks_custom_ccs_page_process'], 'maxi_blocks_custom_ccs_page_nonce' ) ) {
		return $post->ID;
	}

	if ( !current_user_can( 'edit_post', $post->ID )) {
		return $post->ID;
	}
	if ( !isset( $_POST['maxi_blocks_custom_ccs_page'] ) ) {
		return $post->ID;
	}
	$sanitized = wp_filter_post_kses( $_POST['maxi_blocks_custom_ccs_page'] );
	// Save our submissions to the database
	update_post_meta( $post->ID, 'maxi_blocks_custom_ccs_page', $sanitized );

}
add_action( 'save_post', 'maxi_save_metabox', 1, 2 );

add_action( 'wp_head', 'maxi_output_css', 10, 2 );
add_action( 'admin_head', 'maxi_output_css', 10, 2 );

function maxi_output_css() {
	global $post; // Get the current post data
	$maxi_blocks_custom_ccs_page = get_post_meta( $post->ID, 'maxi_blocks_custom_ccs_page', true ); // Get the saved values
	if($maxi_blocks_custom_ccs_page)
	echo '<style id="maxi-blocks-custom-ccs-page">'.$maxi_blocks_custom_ccs_page.'</style>';

   //wp_nonce_field( 'maxi_blocks_custom_ccs_page_nonce', 'maxi_blocks_custom_ccs_page_process' );
}
