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
if (!defined('ABSPATH')) {
	exit();
}

// Temporally removing patterns download
add_filter('should_load_remote_block_patterns', '__return_false');

/**
 * After cleaning this file, there are some functions that I'm not sure if they are necessary.
 * I would say that mostly are related with `js/cloud-server.js`
 */

/* Enabled option */

if (!get_option('maxi_enable')) {
	add_option('maxi_enable', 'enabled');
}

function maxi_get_option() {
	echo get_option('maxi_enable');
	die();
}

function maxi_insert_block() {
	$this_title = $_POST['maxi_title'];
	$this_content = $_POST['maxi_content'];

	if ($this_content && $this_title) {
		// 	$has_reusable_block = get_posts( array(
		// 	'name'           => $_POST['maxi_title'],
		// 	'post_type'      => 'wp_block',
		// 	'posts_per_page' => 1
		// ) );

		// if ( ! $has_reusable_block ) {
		// No reusable block like ours detected.
		wp_insert_post([
			'post_content' => $_POST['maxi_content'],
			'post_title' => $_POST['maxi_title'],
			'post_type' => 'wp_block',
			'post_status' => 'publish',
			'comment_status' => 'closed',
			'ping_status' => 'closed',
			'guid' => sprintf(
				'%s/wp_block/%s',
				site_url(),
				sanitize_title($_POST['maxi_title']),
			),
		]);
		echo 'success';
		//} //if ( ! $has_reusable_block )
		//else {echo 'You already have Block with the same name';}
	} else {
		echo 'JSON Error';
	}

	wp_die();
} //function maxi_insert_block()

// remove noopener noreferrer from gutenberg links
function maxi_links_control($rel, $link) {
	return false;
}
add_filter('wp_targeted_link_rel', 'maxi_links_control', 10, 2);

add_action('wp_ajax_maxi_get_option', 'maxi_get_option', 9, 1);
add_action('wp_ajax_maxi_insert_block', 'maxi_insert_block', 10, 2);

// Add a metabox for Custom Css into Document sidebar
add_action('add_meta_boxes', 'maxi_add_metaboxes', 10, 2);

function maxi_add_metaboxes() {
	add_meta_box(
		'maxi_metabox',
		__('Custom CSS (for that page only)', 'maxi-blocks'),
		'maxi_metabox_content',
		'',
		'side',
		'high',
	);
}

function maxi_metabox_content() {
	global $post; // Get the current post data
	$maxi_blocks_custom_ccs_page = get_post_meta(
		$post->ID,
		'maxi_blocks_custom_ccs_page',
		true,
	); // Get the saved values
	echo '<div>
        <textarea style="width: 100%" rows="5" id="maxi_blocks_custom_ccs_page" name="maxi_blocks_custom_ccs_page" val="' .
		$maxi_blocks_custom_ccs_page .
		'">' .
		$maxi_blocks_custom_ccs_page .
		'</textarea>
    	</div>';

	wp_nonce_field(
		'maxi_blocks_custom_ccs_page_nonce',
		'maxi_blocks_custom_ccs_page_process',
	);
}

function maxi_save_metabox($post_id, $post) {
	if (!isset($_POST['maxi_blocks_custom_ccs_page_process'])) {
		return;
	}
	if (
		!wp_verify_nonce(
			$_POST['maxi_blocks_custom_ccs_page_process'],
			'maxi_blocks_custom_ccs_page_nonce',
		)
	) {
		return $post->ID;
	}

	if (!current_user_can('edit_post', $post->ID)) {
		return $post->ID;
	}
	if (!isset($_POST['maxi_blocks_custom_ccs_page'])) {
		return $post->ID;
	}
	$sanitized = wp_filter_post_kses($_POST['maxi_blocks_custom_ccs_page']);
	// Save our submissions to the database
	update_post_meta($post->ID, 'maxi_blocks_custom_ccs_page', $sanitized);
}
add_action('save_post', 'maxi_save_metabox', 1, 2);

add_action('wp_head', 'maxi_output_css', 10, 2);
add_action('admin_head', 'maxi_output_css', 10, 2);

function maxi_output_css() {
	global $post; // Get the current post data
	$maxi_blocks_custom_ccs_page = '';
	if ($post && $post->ID) {
		$maxi_blocks_custom_ccs_page = get_post_meta(
			$post->ID,
			'maxi_blocks_custom_ccs_page',
			true,
		);
	} // Get the saved values
	if ($maxi_blocks_custom_ccs_page != '') {
		echo '<style id="maxi-blocks-custom-ccs-page">' .
			$maxi_blocks_custom_ccs_page .
			'</style><br>';
	}

	//wp_nonce_field( 'maxi_blocks_custom_ccs_page_nonce', 'maxi_blocks_custom_ccs_page_process' );
}
