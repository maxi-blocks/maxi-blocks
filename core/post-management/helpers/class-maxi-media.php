<?php

/**
 * MaxiBlocks styles API
 */

if (!defined('ABSPATH')) {
    exit();
}

class MaxiBlocks_Media_Processor
{
    private static ?self $instance = null;

    /**
     * Registers the plugin.
     */
    public static function register(): void
    {
        if (null == self::$instance) {
            self::$instance = new self();
        }
    }

    public static function get_instance(): self
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public static function add_media(string $parsed_content)
    {
        $images_links = [];
        $images_ids = [];

        $all_images_regexp = '/(mediaID|imageID)":(.*)",/';
        preg_match_all($all_images_regexp, $parsed_content, $all_images_links);

        if (!empty($all_images_links[0])) {
            foreach ($all_images_links[0] as $image) {
                $parsed = str_replace('\\', '', $image);

                $id_regexp = '/(mediaID|imageID)":(\d+),/';
                preg_match_all($id_regexp, $parsed, $id_matches);
                if (!empty($id_matches[2])) {
                    $images_ids = array_merge($images_ids, $id_matches[2]);
                }

                $url_regexp = '/(mediaURL|imageURL)":"([^"]+)"/';
                preg_match_all($url_regexp, $parsed, $url_matches);
                if (!empty($url_matches[2])) {
                    $images_links = array_merge($images_links, $url_matches[2]);
                }
            }
        }

        if (!empty($images_links) && !empty($images_ids)) {
            $temp_content = $parsed_content;
            $images_links_uniq = array_unique($images_links);
            $images_ids_uniq = array_unique($images_ids);
            $counter = count($images_links_uniq);
            $check_counter = count($images_ids_uniq);

            if ($counter !== $check_counter) {
                error_log("Error processing images' links and ids - counts do not match");
                return $parsed_content;
            }

            $images_uniq = array_combine($images_ids_uniq, $images_links_uniq);

            $images_replacer = [];
            foreach ($images_uniq as $id => $url) {
                $data = self::get_or_replace_image($url);

                $images_replacer[] = [
                    'id' => $data['id'],
                    'oldId' => $id,
                    'url' => $data['url'],
                    'oldUrl' => $url,
                ];
            }

            foreach ($images_replacer as $replace) {
                $temp_content = preg_replace('/\b' . preg_quote($replace['oldUrl'], '/') . '\b/', $replace['url'], $temp_content);
                $temp_content = preg_replace('/\b' . preg_quote($replace['oldId'], '/') . '\b/', $replace['id'], $temp_content);
            }

            return $temp_content;
        }

        return $parsed_content;
    }

    private static function get_or_replace_image(string $url)
    {
        $placeholder_path = MAXI_PLUGIN_DIR_PATH . 'img/patterns-placeholder.jpeg';

        $image = self::get_image_by_url($url);
        if ($image) {
            return self::prepare_image_response($image);
        }

        $uploaded_image = self::fetch_and_upload_image($url);
        if ($uploaded_image) {
            return $uploaded_image;
        }

        $placeholder_image = self::get_image_by_content($placeholder_path);
        if ($placeholder_image) {
            return self::prepare_image_response($placeholder_image);
        }

        return self::process_file_and_upload($placeholder_path, 'patterns-placeholder');
    }

    private static function fetch_and_upload_image(string $url)
    {
        if (empty($url)) {
            return false;
        }

        $file_content = @file_get_contents($url);
        if ($file_content === false) {
            return false;
        }

        $tmp_file = self::create_temp_file($file_content);
        if (!$tmp_file) {
            return false;
        }

        $exist_image = self::get_image_by_content($tmp_file);
        if ($exist_image) {
            unlink($tmp_file);
            return self::prepare_image_response($exist_image);
        }

        $result = self::process_file_and_upload($tmp_file, pathinfo($url, PATHINFO_BASENAME));
        unlink($tmp_file);
        return $result;
    }

    private static function process_file_and_upload(string $file_path, string $title = '')
    {
        $file_content = @file_get_contents($file_path);
        if ($file_content === false) {
            return false;
        }

        $upload_dir = wp_upload_dir();
        $unique_file_name = self::generate_unique_file_name($file_path, $title, $upload_dir['path']);
        $upload_file_path = $upload_dir['path'] . '/' . $unique_file_name;

        if (!file_put_contents($upload_file_path, $file_content)) {
            return false;
        }

        $filetype = wp_check_filetype($upload_file_path);
        if (!isset($filetype['type']) || !$filetype['type']) {
            unlink($upload_file_path);
            return false;
        }

        return self::create_attachment($upload_file_path, $filetype['type'], $title, $unique_file_name);
    }

    private static function get_image_by_url(string $url)
    {
        global $wpdb;
        $query = "SELECT * FROM {$wpdb->posts} WHERE guid = %s AND post_type = 'attachment'";
        return $wpdb->get_row($wpdb->prepare($query, $url));
    }

    private static function get_image_by_content(string $file_path)
    {
        global $wpdb;
        $file_content = @file_get_contents($file_path);
        $file_hash = md5($file_content);

        $query = "SELECT * FROM {$wpdb->posts} WHERE post_type = 'attachment'";
        $attachments = $wpdb->get_results($query);

        foreach ($attachments as $attachment) {
            $attachment_path = get_attached_file($attachment->ID);
            if (file_exists($attachment_path) && md5_file($attachment_path) === $file_hash) {
                return $attachment;
            }
        }

        return null;
    }

    private static function prepare_image_response($image)
    {
        return [
            'id' => $image->ID,
            'url' => wp_get_attachment_url($image->ID),
        ];
    }

    private static function create_temp_file($content)
    {
        $tmp_file = tempnam(sys_get_temp_dir(), 'upload_');
        if ($tmp_file && file_put_contents($tmp_file, $content)) {
            return $tmp_file;
        }
        return false;
    }

    private static function generate_unique_file_name($file_path, $title, $upload_dir)
    {
        $file_info = pathinfo($file_path);
        return wp_unique_filename($upload_dir, $title ? $title . '.' . pathinfo($file_path, PATHINFO_EXTENSION) : $file_info['basename']);
    }

    private static function create_attachment($file_path, $file_type, $title, $unique_file_name)
    {
        $attachment = [
            'post_mime_type' => $file_type,
            'post_title' => $title ?: $unique_file_name,
            'post_content' => '',
            'post_status' => 'inherit',
        ];

        $attach_id = wp_insert_attachment($attachment, $file_path);
        $attach_data = wp_generate_attachment_metadata($attach_id, $file_path);
        wp_update_attachment_metadata($attach_id, $attach_data);

        $maxi_term = self::get_maxi_image_type_term();
        if ($maxi_term) {
            wp_set_object_terms($attach_id, $maxi_term->term_id, 'maxi-image-type');
        }

        return [
            'id' => $attach_id,
            'url' => wp_get_attachment_url($attach_id),
        ];
    }

    private static function get_maxi_image_type_term()
    {
        return get_term_by('slug', 'maxi-image', 'maxi-image-type');
    }
}
