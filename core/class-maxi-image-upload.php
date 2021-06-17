<?php
/**
 * Server side part for uploading patterns images
 *
 * Uploads new image to the local media library
 */
class MaxiBlocks_ImageUpload
{
    /**
         * This plugin's instance.
         *
         * @var MaxiBlocks_ImageUpload
         */
    private static $instance;

    /**
     * Registers the plugin.
     */
    public static function register()
    {
        if (null === self::$instance) {
            self::$instance = new MaxiBlocks_ImageUpload();
        }
    }

    /**
     * Constructor
     */
    public function __construct()
    {
        add_action('init', [
            $this,
            'maxi_add_image_taxonomy',
        ]);

        add_action('init', [
            $this,
            'maxi_add_image_taxonomy_term',
        ]);
        
        add_action('wp_ajax_maxi_upload_pattern_image', [
            $this,
            'maxi_upload_pattern_image',
        ]);
    }

    public function maxi_media_file_already_exists($no_extension)
    {
        global $wpdb;

        $id = $wpdb->get_var($wpdb->prepare("SELECT post_id FROM {$wpdb->postmeta} WHERE meta_value LIKE %s", '%/'.$no_extension.'%'));

        return $id ? $id : 0;
    }

    public function maxi_upload_pattern_image($maxi_image_to_upload)
    {
        global $wpdb;

        if (isset($_GET['maxi_image_to_upload'])) {
            $image_link = sanitize_text_field($_GET['maxi_image_to_upload']);
        } else {
            return;
        }

        if (!function_exists('post_exists')) {
            require_once(ABSPATH . 'wp-admin/includes/post.php');
        }

        $image_name = sanitize_file_name(basename($image_link));
        $filename = 'maxi-'.$image_name;
        $no_extension  = pathinfo($filename)['filename'];

        $exists = $this->maxi_media_file_already_exists($no_extension);

        $data = [];

        if (!$exists) {
            $upload_content = @file_get_contents($image_link);

            if (!$upload_content) {
                $data['error'] = '404';
                echo json_encode($data);
                die();
            }

            $upload_file = wp_upload_bits($filename, null, $upload_content);

            if (!$upload_file['error']) {
                $wp_filetype = wp_check_filetype($filename, null);
                $attachment = array(
                    'post_mime_type' => $wp_filetype['type'],
                    'post_title' => preg_replace('/\.[^.]+$/', '', $filename),
                    'post_content' => '',
                    'post_status' => 'inherit'
                );

                require_once(ABSPATH . 'wp-admin/includes/image.php');

                $attachment_path = $upload_file['file'];
                $attachment_id = wp_insert_attachment($attachment, $attachment_path);
                $attachment_url = $upload_file['url'];
                $attachment_metadata = wp_generate_attachment_metadata($attachment_id, $attachment_path);

                wp_update_attachment_metadata($attachment_id, $attachment_metadata);

                // add to Maxi Image taxonomy
                wp_set_object_terms($attachment_id, 'maxi-image', 'maxi-image-type');

                
                $data['id'] =  $attachment_id;
                $data['url'] =  $attachment_url;

                echo json_encode($data);

                die();
            }
        }
        if (!!$exists) {
            $attachment_url = wp_get_attachment_image_url($exists, 'full');
            $data['id'] =  $exists;
            $data['url'] =  $attachment_url;
            echo json_encode($data);
            die();
        }
        
        die();
    }

    public function maxi_add_image_taxonomy()
    {
        $labels = array(
        'name'              => __('Maxi Images', 'max-blocks'),
        'singular_name'     => __('maxi-image-type', 'max-blocks'),
        'search_items'      => __('Search Maxi Images', 'max-blocks'),
        'all_items'         => __('All Maxi Images', 'max-blocks'),
        'edit_item'         => __('Edit Maxi Image', 'max-blocks'),
        'update_item'       => __('Update Maxi Image', 'max-blocks'),
        'add_new_item'      => __('Add New Maxi Image', 'max-blocks'),
        'new_item_name'     => __('New Maxi Image Name', 'max-blocks'),
        'menu_name'         => __('Maxi Images', 'max-blocks'),
    );

        $args = array(
        'labels' => $labels,
        'hierarchical' => false,
        'query_var' => 'true',
        'rewrite' => 'true',
        'show_admin_column' => 'true',
    );

        register_taxonomy('maxi-image-type', 'attachment', $args);
    }

    public function maxi_add_image_taxonomy_term()
    {
        if (!term_exists(__('Maxi Image', 'max-blocks'), 'maxi-image-type')) {
            wp_insert_term(
                __('Maxi Image', 'max-blocks'),
                'maxi-image-type',
                array(
                  'description' => __('Images added by Maxi Blocks plugin', 'max-blocks'),
                  'slug'        => 'maxi-image'
                )
            );
        }
    }
}
