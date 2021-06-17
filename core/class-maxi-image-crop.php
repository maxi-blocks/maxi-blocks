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
        $old_media = $_POST['old_media_src'];
        $new_media = [
            'src' => $_POST['src'],
            'src_x' => $_POST['src_x'],
            'src_y' => $_POST['src_y'],
            'src_w' => $_POST['src_w'],
            'src_h' => $_POST['src_h'],
            'dst_w' => $_POST['dst_w'],
            'dst_h' => $_POST['dst_h'],
        ];

        $this->delete_old_file($old_media);
        $this->upload_new_file($new_media);

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
            substr_replace($path, '-' . $date, $extension_pos, 0),
        );

        if (!$upload_file || isset($upload_file->errors)) {
            echo wp_send_json_error($upload_file->errors);
        }

        $file_url = str_replace(ABSPATH, site_url() . '/', $upload_file);

        echo json_encode($file_url);
    }

    public function maxi_remove_custom_image_size()
    {
        $old_media = $_POST['old_media_src'];
        $this->delete_old_file($old_media);
        var_dump($old_media);

        global $wp_filesystem;
        WP_Filesystem();
        var_dump($wp_filesystem->exists($old_media));
        echo 'Image has been deleted: ' + $old_media;
        die();
    }
}
