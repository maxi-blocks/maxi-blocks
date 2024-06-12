<?php

/**
 * Server side part of ImageCropControl Gutenberg component
 *
 * Generates a cropped image founded on ImageCropControl requirements
 */
class MaxiBlocks_ImageCrop
{
    /**
     * This plugin's instance.
     *
     * @var MaxiBlocks_ImageCrop
     */
    private static $instance;

    /**
     * Registers the plugin.
     */
    public static function register()
    {
        if (null === self::$instance) {
            self::$instance = new MaxiBlocks_ImageCrop();
        }
    }

    /**
     * Constructor
     */
    public function __construct()
    {
        add_action('wp_ajax_maxi_add_custom_image_size', [
            $this,
            'maxi_add_custom_image_size',
        ]);
        add_action('wp_ajax_maxi_remove_custom_image_size', [
            $this,
            'maxi_remove_custom_image_size',
        ]);
    }

    public function maxi_add_custom_image_size()
    {
        if (isset($_POST['old_media_src'])) {//phpcs:ignore
            $old_media = esc_url_raw($_POST['old_media_src']);//phpcs:ignore
            $this->delete_old_file($old_media);
        }

        if (isset($_POST['src'], $_POST['src_x'], $_POST['src_y'], $_POST['src_w'], $_POST['src_h'], $_POST['dst_w'], $_POST['dst_h'])) {//phpcs:ignore
            $new_media = [
            'src' => sanitize_text_field($_POST['src']),//phpcs:ignore
            'src_x' => sanitize_text_field($_POST['src_x']),//phpcs:ignore
            'src_y' => sanitize_text_field($_POST['src_y']),//phpcs:ignore
            'src_w' => sanitize_text_field($_POST['src_w']),//phpcs:ignore
            'src_h' => sanitize_text_field($_POST['src_h']),//phpcs:ignore
            'dst_w' => sanitize_text_field($_POST['dst_w']),//phpcs:ignore
            'dst_h' => sanitize_text_field($_POST['dst_h']),//phpcs:ignore
        ];

            $this->upload_new_file($new_media);
        }

        die();
    }

    private function delete_old_file($old_media)
    {
        $old_media = str_replace(get_site_url() . '/', '', $old_media);
        wp_delete_file(ABSPATH . $old_media);
    }

    private function upload_new_file($new_media)
    {
        $path = get_attached_file($new_media['src']);
        $extension = end(explode('.', get_attached_file($new_media['src'])));
        $extension_pos = strlen($path) - strlen($extension) - 1;
        $date = getdate()[0];

        $upload_file = wp_crop_image(
            $new_media['src'],
            $new_media['src_x'],
            $new_media['src_y'],
            $new_media['src_w'],
            $new_media['src_h'],
            $new_media['dst_w'],
            $new_media['dst_h'],
            false,
            substr_replace($path, '-' . $date, $extension_pos, 0)
        );

        if (!$upload_file || isset($upload_file->errors)) {
            wp_send_json_error($upload_file->errors);
        }

        $file_url = str_replace(ABSPATH, site_url() . '/', $upload_file);

        echo wp_json_encode($file_url);
    }

    public function maxi_remove_custom_image_size()
    {
        if (isset($_POST['old_media_src'])) {//phpcs:ignore
            $old_media = esc_url_raw($_POST['old_media_src']);//phpcs:ignore
            $this->delete_old_file($old_media);

            global $wp_filesystem;
            WP_Filesystem();
        }

        die();
    }
}
