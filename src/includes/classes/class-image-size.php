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
        add_action("wp_ajax_gx_add_custom_image_size", array($this, "gx_add_custom_image_size"));
        add_action("wp_ajax_gx_remove_custom_image_size", array($this, "gx_remove_custom_image_size"));
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
        self::upload_new_file($media_file);

        die();
    }

    private function delete_old_file($old_media)
    {
        $old_media = str_replace(get_site_url() . '/', '', $old_media);
        wp_delete_file(ABSPATH . $old_media);
    }

    private function upload_new_file($media_file)
    {
        $upload_overrides = array(
            'test_form' => false,
            'test_type' => false,
        );

        $upload_file = wp_handle_upload($media_file, $upload_overrides);

        if ($upload_file && !isset($upload_file['error'])) {
            echo json_encode($upload_file);
        } else {
            echo $upload_file['error'];
        }
    }

    public function gx_remove_custom_image_size()
    {
        $old_media = $_POST['old_media_src'];
        self::delete_old_file($old_media);
        var_dump($old_media);

        global $wp_filesystem;
        WP_Filesystem();
        var_dump($wp_filesystem->exists($old_media));
        echo 'Image has been deleted: ' + $old_media;
        die();
    }
}

ImageSize::register();