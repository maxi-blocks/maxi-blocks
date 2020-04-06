<?php

/**
 * Todo: comment all functions and class
 */

class ImageSize
{

    /**
     * This plugin's instance.
     *
     * @var ImageSize
     */
    private static $instance;

    /**
     * Registers the plugin.
     */
    public static function register()
    {
        if (null === self::$instance) {
            self::$instance = new ImageSize();
        }
    }

    /**
     * Constructor
     */
    public function __construct()
    {
        add_action('after_setup_theme', array($this, 'register_new_thumbnail'));
        add_action("wp_ajax_gx_add_custom_image_size", array($this, "gx_add_custom_image_size"));
        add_action("wp_ajax_gx_remove_custom_image_size", array($this, "gx_remove_custom_image_size"));
    }

    public function register_new_thumbnail()
    {
        add_image_size('custom');
    }

    public function gx_add_custom_image_size()
    {
        $media = [
            'id'        => $_POST['id'],
            'name'      => $_POST['name'],
            'width'     => $_POST['width'],
            'height'    => $_POST['height'],
            'mime_type' => $_POST['mime_type'],
            'folder'    => $_POST['folder']
        ];
        $old_media = $_POST['old_media_src'];
        $media_file = $_FILES['file'];

        self::delete_old_file($old_media);
        self::upload_new_file($media, $media_file);

        die();
    }

    private function delete_old_file($old_media)
    {
        $old_media = str_replace(get_site_url() . '/', '', $old_media);
        wp_delete_file(ABSPATH . $old_media);
    }

    private function upload_new_file($media, $media_file)
    {
        $upload_overrides = array(
            'test_form' => false,
            'test_type' => false,
        );

        $upload_file = wp_handle_upload($media_file, $upload_overrides);

        if ($upload_file && !isset($upload_file['error'])) {
            self::check_image_folder($media, $upload_file);
            self::register_new_size($media);
        } else {
            echo $upload_file['error'];
        }
    }

    private function check_image_folder($media, $upload_file) {
        if (strpos($upload_file['url'], $media['folder']))
            echo json_encode($upload_file['url']);
        else {
            $destination = ABSPATH . str_replace(get_site_url() . '/', '', $media['folder']) . '/' . $media['name'];
            global $wp_filesystem;
            WP_Filesystem();
            $wp_filesystem->move(
                $upload_file['file'],
                $destination
            );
            $newUrl = $media['folder'] . '/' . $media['name'];
            echo json_encode($newUrl);            
        }
    }

    private function register_new_size($media)
    {
        $id = $media['id'];
        $name = $media['name'];
        $width = $media['width'];
        $height = $media['height'];
        $mime_type = $media['mime_type'];

        $post_meta = get_post_meta($id, '_wp_attachment_metadata', true);
        $post_meta['sizes']['custom'] = [
            'file'      => $name,
            'width'     => $width,
            'height'    => $height,
            'mime-type' => $mime_type
        ];
        wp_update_attachment_metadata($id, $post_meta);
    }

    public function gx_remove_custom_image_size()
    {
        $id = $_POST['id'];
        $post_meta = get_post_meta($id, '_wp_attachment_metadata', true);
        $post_meta['sizes']['custom'] = [];
        wp_update_attachment_metadata($id, $post_meta);
        die();
    }
}

ImageSize::register();
