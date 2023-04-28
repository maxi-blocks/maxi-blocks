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

require_once(MAXI_PLUGIN_DIR_PATH . 'core/admin/maxi-allowed-html-tags.php');

// Temporally removing patterns download
add_filter('should_load_remote_block_patterns', '__return_false');

/**
 * After cleaning this file, there are some functions that I'm not sure if they are necessary.
 * I would say that mostly are related with `js/cloud-server.js`
 */

/* Enabled option */

if (!get_option('maxi_pro')) {
    $array = array('status' => 'no');
    add_option('maxi_pro', json_encode($array));
}

if (get_option('maxi_pro') === 'no') {
    $array = array('status' => 'no');
    update_option('maxi_pro', json_encode($array));
}

function maxi_get_pro_status()
{
    echo esc_attr(get_option('maxi_pro'));
    die();
}

function maxi_insert_block()
{
    if (isset($_POST['maxi_title']) && isset($_POST['maxi_content'])) {//phpcs:ignore
        $this_title =  sanitize_title($_POST['maxi_title']);//phpcs:ignore
        $this_content = sanitize_text_field($_POST['maxi_content']);//phpcs:ignore

        if ($this_content && $this_title) {
            // No reusable block like ours detected.
            wp_insert_post([
            'post_content' =>  $this_content,
            'post_title' => $this_title,
            'post_type' => 'wp_block',
            'post_status' => 'publish',
            'comment_status' => 'closed',
            'ping_status' => 'closed',
            'guid' => sprintf(
                '%s/wp_block/%s',
                site_url(),
                sanitize_title($this_title)
            ),
        ]);
            echo 'success';
        //} //if ( ! $has_reusable_block )
        //else {echo 'You already have Block with the same name';}
        } else {
            echo 'JSON Error';
        }
    }
    wp_die();
} //function maxi_insert_block()

// remove noopener noreferrer from gutenberg links
function maxi_links_control($rel, $link)
{
    return false;
}
add_filter('wp_targeted_link_rel', 'maxi_links_control', 10, 2);

add_action('wp_ajax_maxi_get_pro_status', 'maxi_get_pro_status', 9, 1);
add_action('wp_ajax_maxi_insert_block', 'maxi_insert_block', 10, 2);
