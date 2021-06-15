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
        if (! function_exists('write_log')) {
            function write_log($log)
            {
                if (is_array($log) || is_object($log)) {
                    error_log(print_r($log, true));
                } else {
                    error_log($log);
                }
            }
        }
        global $wpdb;

        write_log('========================');

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

        write_log('$image_name: '.$image_name);
        write_log('$filename: '.$filename);
        write_log('$no_extension: '.$no_extension);

        $exists = $this->maxi_media_file_already_exists($no_extension);

        write_log('$exists: '.$exists);

        if (!$exists) {
            $upload_content = @file_get_contents($image_link);

            if (!$upload_content) {
                write_log('ERROR 404');
                echo '404';
                die();
            }

            $upload_file = wp_upload_bits($filename, null, $upload_content);
            write_log('=====$upload_file====');
            write_log($upload_file);

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

                write_log('=====attachment_metadata====');
                write_log($attachment_metadata);
                wp_update_attachment_metadata($attachment_id, $attachment_metadata);
                
                echo $attachment_url;
                write_log('$new_url: '.$attachment_url);
                write_log('==========+++==========');

                die();
            }
        }
        if (!!$exists) {
            $attachment_url = wp_get_attachment_image_url($exists, 'full');
        }

        echo $attachment_url;
        write_log('$new_url2: '.$attachment_url);
        write_log('=========---==========');
        
        die();
    }
}
