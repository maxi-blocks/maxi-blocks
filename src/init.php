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

// Required by 'cloud-server.js'
add_action('wp_ajax_maxi_import_images', 'maxi_import_images', 3, 2);
add_action(
	'wp_ajax_maxi_import_reusable_blocks',
	'maxi_import_reusable_blocks',
	4,
	2,
);

if (!function_exists('write_log')) {
	function write_log($log) {
		if (is_array($log) || is_object($log)) {
			error_log(print_r($log, true));
		} else {
			error_log($log);
		}
	}
}

//======================================================================
// UPLOAD IMAGES
//======================================================================

function maxi_media_file_already_exists($filename) {
	global $wpdb;
	$query = "SELECT post_id FROM {$wpdb->postmeta} WHERE meta_value LIKE '%/$filename'";

	if ($wpdb->get_var($query)) {
		$post_title_for_image = substr($filename, 0, strrpos($filename, '.'));
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

function maxi_import_images() {
	//echo 'START: maxi_import_image_to_upload';
	write_log('START: maxi_import_image_to_upload');
	global $wpdb;
	// session_start();

	write_log('=========================');

	$maxi_images_to_upload = json_decode(
		stripslashes($_POST['maxi_images_to_upload']),
	);
	write_log('maxi_images_to_upload');
	write_log($maxi_images_to_upload);

	//$maxi_post_id_for_image_to_upload = $_SESSION['maxi_post_id_for_image'];
	$maxi_post_id_for_image_to_upload = $_POST['maxi_post_id'];
	write_log('$maxi_post_id_for_image_to_upload:');
	write_log($maxi_post_id_for_image_to_upload);

	//echo 'GET $_SESSION: '.$maxi_post_id_for_image_to_upload;

	if (
		empty($maxi_images_to_upload) ||
		empty($maxi_post_id_for_image_to_upload)
	) {
		// echo 'empry posts raw';
		write_log('empry posts raw');
		return;
	}

	if (!function_exists('post_exists')) {
		require_once ABSPATH . 'wp-admin/includes/post.php';
	}

	// placeholder image
	$maxi_placeholder_image = esc_url(
		plugins_url('img/placeholder.jpg', 'maxi-blocks/plugin.php'),
	);

	foreach ($maxi_images_to_upload as $maxi_image_to_upload) {
		write_log('$maxi_image_to_upload');
		write_log($maxi_image_to_upload);

		$maxi_post_title = basename($maxi_image_to_upload);

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

		$post_id = $maxi_post_id_for_image_to_upload;

		if ($post_id) {
			if (maxi_media_file_already_exists($maxi_filename) === 0) {
				write_log('Does not exist');
				if (@file_get_contents($maxi_image_to_upload) !== false) {
					$maxi_upload_file = wp_upload_bits(
						$maxi_filename,
						null,
						@file_get_contents($maxi_image_to_upload),
					);
					write_log('$maxi_upload_file');
					write_log($maxi_upload_file);
					if (!$maxi_upload_file['error']) {
						//if succesfull insert the new file into the media library (create a new attachment post type)
						$maxi_wp_filetype = wp_check_filetype(
							$maxi_filename,
							null,
						);
						$maxi_attachment = [
							'post_mime_type' => $maxi_wp_filetype['type'],
							'post_parent' => $post_id,
							'post_title' => preg_replace(
								'/\.[^.]+$/',
								'',
								$maxi_filename,
							),
							'post_content' => '',
							'post_status' => 'inherit',
						];
						//wp_insert_attachment( $maxi_attachment, $maxi_filename, $parent_post_id );

						$maxi_attachment_id = wp_insert_attachment(
							$maxi_attachment,
							$maxi_upload_file['file'],
							$post_id,
						);
						write_log('$maxi_attachment_id');
						write_log($maxi_attachment_id);
						if (!is_wp_error($maxi_attachment_id)) {
							//if attachment post was successfully created, insert it as a thumbnail to the post $post_id
							require_once ABSPATH .
								'wp-admin' .
								'/includes/image.php';
							//wp_generate_attachment_metadata( $maxi_attachment_id, $file ); for images
							$maxi_attachment_data = wp_generate_attachment_metadata(
								$maxi_attachment_id,
								$maxi_upload_file['file'],
							);
							wp_update_attachment_metadata(
								$maxi_attachment_id,
								$maxi_attachment_data,
							);
							echo $maxi_image_to_upload .
								'|' .
								wp_get_attachment_image_src(
									$maxi_attachment_id,
									'full',
								)[0] .
								',';
						} else {
							echo $maxi_image_to_upload .
								'|' .
								$maxi_placeholder_image .
								',';
							write_log(
								'Using placeholder: uploaded attachment error',
							);
						}
					} else {
						echo $maxi_image_to_upload .
							'|' .
							$maxi_placeholder_image .
							',';
						write_log('Using placeholder: upload error');
					}
				} else {
					echo $maxi_image_to_upload .
						'|' .
						$maxi_placeholder_image .
						',';
					write_log('Using placeholder: original image is empty');
				} //if(@file_get_contents($maxi_image_to_upload) !== "")
			}
			//if (maxi_media_file_already_exists($maxi_filename) === 0)
			else {
				$maxi_existing_image = wp_get_attachment_image_src(
					maxi_media_file_already_exists($maxi_filename),
					'full',
				);
				if (!is_wp_error($maxi_existing_image)) {
					echo $maxi_image_to_upload .
						'|' .
						$maxi_existing_image[0] .
						',';
					write_log('Exists');
				} else {
					echo $maxi_image_to_upload .
						'|' .
						$maxi_placeholder_image .
						',';
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
	$reusable_block_exists = get_posts([
		'name' => sanitize_title($maxi_reusable_block_title),
		'post_type' => 'wp_block',
		'posts_per_page' => 1,
	]);

	if (!$reusable_block_exists) {
		wp_insert_post([
			'post_content' => $maxi_reusable_block_content,
			'post_title' => $maxi_reusable_block_title,
			'post_type' => 'wp_block',
			'post_status' => 'publish',
			'comment_status' => 'closed',
			'ping_status' => 'closed',
			'guid' => sprintf(
				'%s/wp_block/%s',
				site_url(),
				sanitize_title($maxi_reusable_block_title),
			),
		]);
	}

	die();
}

// Add a metabox for Custon Css into Document sidebar
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