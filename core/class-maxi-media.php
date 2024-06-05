<?php

/**
 * MaxiBlocks styles API
 */

if (!defined('ABSPATH')) {
    exit();
}

if (!class_exists('MaxiBlocks_Media')):
    class MaxiBlocks_Media
    {
        /**
         * This plugin's instance.
         *
         * @var MaxiBlocks_Media
         */
        private static $instance;

        /**
         * Registers the plugin.
         */
        public static function register()
        {
            if (null == self::$instance) {
                self::$instance = new MaxiBlocks_Media();
            }
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
            $placeholder_path = MAXI_PLUGIN_DIR_PATH  . 'img/patterns-placeholder.jpeg';

            $image = self::get_image_by_url($url);
            if ($image) {
                return [
                    'id' => $image->ID,
                    'url' => wp_get_attachment_url($image->ID),
                ];
            }

            $uploaded_image = self::fetch_and_upload_image($url);
            if ($uploaded_image) {
                return $uploaded_image;
            }

            $placeholder_image = self::get_image_by_content($placeholder_path);
            if ($placeholder_image) {
                return [
                    'id' => $placeholder_image->ID,
                    'url' => wp_get_attachment_url($placeholder_image->ID),
                ];
            }

            // Use placeholder image
            return self::upload_local_image($placeholder_path, 'patterns-placeholder');
        }

        private static function fetch_and_upload_image(string $url)
        {
            if(!$url) {
                return false;
            }

            $file_content = @file_get_contents($url);
            if ($file_content === false) {
                return false;
            }

            $tmp_file = tempnam(sys_get_temp_dir(), 'upload_');
            file_put_contents($tmp_file, $file_content);

            $exist_image = self::get_image_by_content($tmp_file);
            if($exist_image) {
                return [
                    'id' => $exist_image->ID,
                    'url' => wp_get_attachment_url($exist_image->ID),
                ];
            }

            $file_info = pathinfo($url);
            $file_name = sanitize_file_name($file_info['basename']);
            $filetype = wp_check_filetype($file_name, null);

            if (!isset($filetype['type']) || !$filetype['type']) {
                unlink($tmp_file);
                return false;
            }

            $attachment = array(
                'post_mime_type' => $filetype['type'],
                'post_title' => $file_name,
                'post_content' => '',
                'post_status' => 'inherit',
            );

            $upload_dir = wp_upload_dir();
            $target_file = $upload_dir['path'] . '/' . $file_name;

            if (!rename($tmp_file, $target_file)) {
                unlink($tmp_file);
                return false;
            }

            $attach_id = wp_insert_attachment($attachment, $target_file);
            $attach_data = wp_generate_attachment_metadata($attach_id, $target_file);
            wp_update_attachment_metadata($attach_id, $attach_data);

            return [
                'id' => $attach_id,
                'url' => wp_get_attachment_url($attach_id),
            ];
        }


        private static function upload_local_image(string $local_path, string $title)
        {
            $file_content = file_get_contents($local_path);
            $upload_dir = wp_upload_dir();
            $unique_file_name = wp_unique_filename($upload_dir['path'], basename($local_path));
            $file = $upload_dir['path'] . '/' . $unique_file_name;

            if (!file_put_contents($file, $file_content)) {
                return [
                    'id' => 0,
                    'url' => '',
                ];
            }

            $filetype = wp_check_filetype($file, null);
            $attachment = array(
                'post_mime_type' => $filetype['type'],
                'post_title' => $title,
                'post_content' => '',
                'post_status' => 'inherit',
            );

            $attach_id = wp_insert_attachment($attachment, $file);

            return [
                'id' => $attach_id,
                'url' => wp_get_attachment_url($attach_id),
            ];
        }

        private static function get_image_by_url(string $url)
        {
            global $wpdb;
            $query = "SELECT * FROM {$wpdb->posts} WHERE guid='%s' AND post_type='attachment'";
            $result = $wpdb->get_row($wpdb->prepare($query, $url));
            return $result;
        }

        private static function get_image_by_content(string $file_path)
        {
            global $wpdb;
            $file_content = file_get_contents($file_path);
            $file_hash = md5($file_content);

            $query = "SELECT * FROM {$wpdb->posts} WHERE post_type='attachment'";
            $attachments = $wpdb->get_results($query);

            foreach ($attachments as $attachment) {
                $attachment_path = get_attached_file($attachment->ID);
                if (file_exists($attachment_path) && md5_file($attachment_path) === $file_hash) {
                    return $attachment;
                }
            }

            return null;
        }
    }
endif;
