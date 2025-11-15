<?php
/**
 * MaxiBlocks Unsplash Integration
 */

if (!defined('ABSPATH')) {
    exit();
}

if (!class_exists('MaxiBlocks_Unsplash')):
    class MaxiBlocks_Unsplash
    {
        /**
         * Unsplash API access key provided by MaxiBlocks.
         */
        const ACCESS_KEY = 'jx4CnjSPw5mEuFJrCryY_WNQxPjefnGjQbsyXmdY';

        /**
         * Unsplash API secret key (not currently used, stored for completeness).
         */
        const SECRET_KEY = '4KEnhyCGdS07d96PB1LSOYvnhKm0o6l1E-He-NUwdaA';

        /**
         * Nonce action for AJAX requests.
         */
        const NONCE_ACTION = 'maxi_unsplash_nonce';

        /**
         * API base URL.
         */
        const API_BASE = 'https://api.unsplash.com';

        /**
         * Track whether media assets have been enqueued.
         *
         * @var bool
         */
        private static $assets_enqueued = false;

        /**
         * Track whether templates were printed.
         *
         * @var bool
         */
        private static $templates_printed = false;

        /**
         * Register class hooks.
         */
        public static function register()
        {
            $instance = new self();
            $instance->init_hooks();
        }

        /**
         * Attach WordPress hooks.
         */
        public function init_hooks()
        {
            add_action('admin_enqueue_scripts', [$this, 'maybe_enqueue_admin_assets']);
            add_action('enqueue_block_editor_assets', [$this, 'enqueue_block_editor_assets']);
            add_action('print_media_templates', [$this, 'print_media_templates']);
            add_action('wp_ajax_maxi_unsplash_search', [$this, 'handle_search']);
            add_action('wp_ajax_maxi_unsplash_import', [$this, 'handle_import']);
        }

        /**
         * Determine if the integration should load on an admin page.
         */
        private function should_enqueue_on_admin($hook)
        {
            $supported_hooks = [
                'upload.php',
                'media-new.php',
                'post.php',
                'post-new.php',
                'site-editor.php',
                'widgets.php',
                'customize.php',
            ];

            return in_array($hook, $supported_hooks, true);
        }

        /**
         * Conditionally enqueue media assets for classic admin screens.
         */
        public function maybe_enqueue_admin_assets($hook)
        {
            if (!$this->should_enqueue_on_admin($hook)) {
                return;
            }

            $this->enqueue_assets();
        }

        /**
         * Ensure assets are available within the block editor.
         */
        public function enqueue_block_editor_assets()
        {
            $this->enqueue_assets();
        }

        /**
         * Shared asset loader.
         */
        private function enqueue_assets()
        {
            if (self::$assets_enqueued) {
                return;
            }

            self::$assets_enqueued = true;

            if (function_exists('wp_enqueue_media')) {
                wp_enqueue_media();
            }

            wp_enqueue_style(
                'maxi-unsplash-admin',
                plugin_dir_url(__FILE__) . 'maxi-unsplash.css',
                [],
                MAXI_PLUGIN_VERSION
            );

            wp_enqueue_script(
                'maxi-unsplash-admin',
                plugin_dir_url(__FILE__) . 'maxi-unsplash.js',
                ['jquery', 'media-views', 'wp-backbone', 'wp-i18n'],
                MAXI_PLUGIN_VERSION,
                true
            );

            $strings = [
                'tabTitle' => __('Unsplash', 'maxi-blocks'),
                'searchLabel' => __('Search Unsplash', 'maxi-blocks'),
                'searchPlaceholder' => __('Search Unsplash…', 'maxi-blocks'),
                'searchButton' => __('Search', 'maxi-blocks'),
                'emptyQuery' => __('Enter a search term to find Unsplash images.', 'maxi-blocks'),
                'importing' => __('Importing image…', 'maxi-blocks'),
                'importSuccess' => __('Image imported to the Media Library.', 'maxi-blocks'),
                'importError' => __('Unable to import the selected image.', 'maxi-blocks'),
                'importLabel' => __('Import', 'maxi-blocks'),
                'loadMore' => __('Load more', 'maxi-blocks'),
                'noResults' => __('No images found. Try a different search term.', 'maxi-blocks'),
                'errorGeneral' => __('Unexpected error. Please try again.', 'maxi-blocks'),
                'viewOnUnsplash' => __('View on Unsplash', 'maxi-blocks'),
            ];

            wp_localize_script(
                'maxi-unsplash-admin',
                'MaxiUnsplash',
                [
                    'ajaxUrl' => admin_url('admin-ajax.php'),
                    'nonce' => wp_create_nonce(self::NONCE_ACTION),
                    'perPage' => 18,
                    'strings' => $strings,
                ]
            );
        }

        /**
         * Output Backbone templates used within the media modal.
         */
        public function print_media_templates()
        {
            if (!self::$assets_enqueued || self::$templates_printed) {
                return;
            }

            self::$templates_printed = true;

            ?>
            <script type="text/html" id="tmpl-maxi-unsplash-browser">
                <div class="maxi-unsplash-browser" role="presentation">
                    <form class="maxi-unsplash-search-form" autocomplete="off">
                        <label class="screen-reader-text" for="maxi-unsplash-query">{{ data.strings.searchLabel }}</label>
                        <input
                            type="search"
                            id="maxi-unsplash-query"
                            class="maxi-unsplash-search-field"
                            placeholder="{{ data.strings.searchPlaceholder }}"
                            aria-label="{{ data.strings.searchLabel }}"
                        />
                        <button type="submit" class="button button-primary maxi-unsplash-search-button">
                            {{ data.strings.searchButton }}
                        </button>
                    </form>
                    <div class="maxi-unsplash-feedback" aria-live="polite"></div>
                    <div class="maxi-unsplash-results" aria-live="polite"></div>
                    <div class="maxi-unsplash-pagination">
                        <button type="button" class="button maxi-unsplash-load-more" hidden>
                            {{ data.strings.loadMore }}
                        </button>
                    </div>
                </div>
            </script>
            <script type="text/html" id="tmpl-maxi-unsplash-card">
                <div class="maxi-unsplash-card" data-photo-id="{{ data.id }}">
                    <div class="maxi-unsplash-card-image">
                        <img src="{{ data.thumb }}" alt="{{ data.alt }}" loading="lazy" />
                    </div>
                    <div class="maxi-unsplash-card-body">
                        <strong>{{ data.title }}</strong>
                        <# if ( data.credit ) { #>
                        <div class="maxi-unsplash-card-meta">{{ data.credit }}</div>
                        <# } #>
                        <div class="maxi-unsplash-card-actions">
                            <button type="button" class="button button-secondary maxi-unsplash-import" data-photo-id="{{ data.id }}">
                                {{ data.strings.importLabel }}
                            </button>
                            <# if ( data.link ) { #>
                            <a class="maxi-unsplash-card-link" href="{{ data.link }}" target="_blank" rel="noopener noreferrer">
                                {{ data.strings.viewOnUnsplash }}
                            </a>
                            <# } #>
                        </div>
                    </div>
                </div>
            </script>
            <?php
        }

        /**
         * Retrieve the Unsplash access key with filtering support.
         */
        private function get_access_key()
        {
            $key = apply_filters('maxi_unsplash_access_key', self::ACCESS_KEY);

            return trim((string) $key);
        }

        /**
         * Handle Unsplash search requests.
         */
        public function handle_search()
        {
            check_ajax_referer(self::NONCE_ACTION, 'nonce');

            if (!current_user_can('upload_files')) {
                wp_send_json_error([
                    'message' => __('You do not have permission to search Unsplash images.', 'maxi-blocks'),
                ], 403);
            }

            $access_key = $this->get_access_key();

            if ('' === $access_key) {
                wp_send_json_error([
                    'message' => __('Unsplash access key is missing.', 'maxi-blocks'),
                ], 400);
            }

            $query = isset($_POST['query']) ? sanitize_text_field(wp_unslash($_POST['query'])) : '';
            $page = isset($_POST['page']) ? absint($_POST['page']) : 1;
            $page = max(1, $page);
            $per_page = isset($_POST['per_page']) ? absint($_POST['per_page']) : 18;
            $per_page = max(1, min(30, $per_page));

            $args = [
                'page' => $page,
                'per_page' => $per_page,
            ];

            if ('' === $query) {
                $endpoint = self::API_BASE . '/photos';
                $args['order_by'] = 'popular';
            } else {
                $endpoint = self::API_BASE . '/search/photos';
                $args['query'] = $query;
            }

            $request_url = add_query_arg($args, $endpoint);

            $response = wp_remote_get(
                $request_url,
                [
                    'headers' => [
                        'Authorization' => 'Client-ID ' . $access_key,
                        'Accept-Version' => 'v1',
                    ],
                    'timeout' => 20,
                ]
            );

            if (is_wp_error($response)) {
                wp_send_json_error([
                    'message' => $response->get_error_message(),
                ], 500);
            }

            $status = wp_remote_retrieve_response_code($response);
            $body = wp_remote_retrieve_body($response);
            $data = json_decode($body, true);

            if ($status >= 400 || null === $data) {
                wp_send_json_error([
                    'message' => __('Unsplash returned an unexpected response.', 'maxi-blocks'),
                ], 500);
            }

            $items = [];
            $raw_results = [];
            $total = 0;
            $total_pages = 0;

            if ('' === $query) {
                $raw_results = is_array($data) ? $data : [];
                $total = absint(wp_remote_retrieve_header($response, 'x-total'));
                $results_count = count($raw_results);
                if ($total > 0 && $per_page > 0) {
                    $total_pages = (int) ceil($total / $per_page);
                } elseif ($results_count === $per_page) {
                    $total_pages = $page + 1;
                } else {
                    $total_pages = $page;
                }
            } else {
                $raw_results = !empty($data['results']) && is_array($data['results']) ? $data['results'] : [];
                $total = isset($data['total']) ? absint($data['total']) : 0;
                $total_pages = isset($data['total_pages']) ? absint($data['total_pages']) : 0;
            }

            foreach ($raw_results as $item) {
                $items[] = $this->format_photo_result($item);
            }

            wp_send_json_success([
                'results' => $items,
                'total' => $total,
                'totalPages' => $total_pages,
                'page' => $page,
            ]);
        }

        /**
         * Normalize Unsplash photo data for the client.
         */
        private function format_photo_result($item)
        {
            $id = isset($item['id']) ? sanitize_text_field($item['id']) : '';
            $description = isset($item['description']) ? wp_strip_all_tags($item['description']) : '';
            $alt = isset($item['alt_description']) ? wp_strip_all_tags($item['alt_description']) : '';
            $title = $description ? $description : $alt;
            $title = $title ? $title : __('Unsplash Image', 'maxi-blocks');

            $user_name = isset($item['user']['name']) ? sanitize_text_field($item['user']['name']) : '';
            $user_username = isset($item['user']['username']) ? sanitize_text_field($item['user']['username']) : '';
            $credit = '';

            if ($user_name) {
                $credit = $user_name;
            } elseif ($user_username) {
                $credit = '@' . $user_username;
            }

            $profile_link = isset($item['user']['links']['html']) ? esc_url_raw($item['user']['links']['html']) : '';
            $photo_link = isset($item['links']['html']) ? esc_url_raw($item['links']['html']) : '';

            return [
                'id' => $id,
                'title' => $title,
                'alt' => $alt,
                'description' => $description,
                'thumb' => isset($item['urls']['small']) ? esc_url_raw($item['urls']['small']) : '',
                'regular' => isset($item['urls']['regular']) ? esc_url_raw($item['urls']['regular']) : '',
                'full' => isset($item['urls']['full']) ? esc_url_raw($item['urls']['full']) : '',
                'credit' => $credit,
                'profile' => $profile_link,
                'link' => $photo_link,
                'username' => $user_username,
            ];
        }

        /**
         * Handle image import requests.
         */
        public function handle_import()
        {
            check_ajax_referer(self::NONCE_ACTION, 'nonce');

            if (!current_user_can('upload_files')) {
                wp_send_json_error([
                    'message' => __('You do not have permission to import images.', 'maxi-blocks'),
                ], 403);
            }

            $access_key = $this->get_access_key();

            if ('' === $access_key) {
                wp_send_json_error([
                    'message' => __('Unsplash access key is missing.', 'maxi-blocks'),
                ], 400);
            }

            $photo_id = isset($_POST['photoId']) ? sanitize_text_field(wp_unslash($_POST['photoId'])) : '';

            if ('' === $photo_id) {
                wp_send_json_error([
                    'message' => __('Invalid image selection.', 'maxi-blocks'),
                ], 400);
            }

            $photo_endpoint = sprintf(self::API_BASE . '/photos/%s', rawurlencode($photo_id));
            $photo_response = wp_remote_get(
                $photo_endpoint,
                [
                    'headers' => [
                        'Authorization' => 'Client-ID ' . $access_key,
                        'Accept-Version' => 'v1',
                    ],
                    'timeout' => 20,
                ]
            );

            if (is_wp_error($photo_response)) {
                wp_send_json_error([
                    'message' => $photo_response->get_error_message(),
                ], 500);
            }

            $status = wp_remote_retrieve_response_code($photo_response);
            $body = wp_remote_retrieve_body($photo_response);
            $photo_data = json_decode($body, true);

            if ($status >= 400 || empty($photo_data['urls'])) {
                wp_send_json_error([
                    'message' => __('Unable to retrieve photo details from Unsplash.', 'maxi-blocks'),
                ], 500);
            }

            $download_location = isset($photo_data['links']['download_location'])
                ? esc_url_raw($photo_data['links']['download_location'])
                : '';

            if ($download_location) {
                $download_url = add_query_arg('client_id', $access_key, $download_location);
                wp_remote_get($download_url, ['timeout' => 10]);
            }

            $image_url = isset($photo_data['urls']['full']) ? $photo_data['urls']['full'] : '';
            if (empty($image_url) && !empty($photo_data['urls']['regular'])) {
                $image_url = $photo_data['urls']['regular'];
            }

            if (empty($image_url)) {
                wp_send_json_error([
                    'message' => __('Unsplash did not return a valid image URL.', 'maxi-blocks'),
                ], 500);
            }

            require_once ABSPATH . 'wp-admin/includes/file.php';
            require_once ABSPATH . 'wp-admin/includes/media.php';
            require_once ABSPATH . 'wp-admin/includes/image.php';

            $tmp = download_url($image_url, 20);

            if (is_wp_error($tmp)) {
                wp_send_json_error([
                    'message' => $tmp->get_error_message(),
                ], 500);
            }

            $extension = pathinfo(parse_url($image_url, PHP_URL_PATH), PATHINFO_EXTENSION);
            $extension = $extension ? $extension : 'jpg';
            $file_name = sanitize_file_name($photo_id . '-unsplash.' . $extension);

            $file_array = [
                'name' => $file_name,
                'tmp_name' => $tmp,
            ];

            $attachment_id = media_handle_sideload($file_array, 0);

            if (is_wp_error($attachment_id)) {
                @unlink($tmp);
                wp_send_json_error([
                    'message' => $attachment_id->get_error_message(),
                ], 500);
            }

            $title = !empty($photo_data['description'])
                ? $photo_data['description']
                : (!empty($photo_data['alt_description'])
                    ? $photo_data['alt_description']
                    : __('Unsplash Image', 'maxi-blocks'));

            wp_update_post([
                'ID' => $attachment_id,
                'post_title' => wp_strip_all_tags($title),
                'post_excerpt' => wp_strip_all_tags($title),
                'post_content' => '',
            ]);

            if (!empty($photo_data['alt_description'])) {
                update_post_meta(
                    $attachment_id,
                    '_wp_attachment_image_alt',
                    wp_strip_all_tags($photo_data['alt_description'])
                );
            }

            $credit = [
                'name' => isset($photo_data['user']['name']) ? sanitize_text_field($photo_data['user']['name']) : '',
                'username' => isset($photo_data['user']['username']) ? sanitize_text_field($photo_data['user']['username']) : '',
                'profile' => isset($photo_data['user']['links']['html']) ? esc_url_raw($photo_data['user']['links']['html']) : '',
                'unsplashUrl' => isset($photo_data['links']['html']) ? esc_url_raw($photo_data['links']['html']) : '',
            ];

            update_post_meta($attachment_id, '_maxi_unsplash_credit', $credit);

            if (!empty($credit['unsplashUrl'])) {
                update_post_meta($attachment_id, '_maxi_unsplash_source', $credit['unsplashUrl']);
            }

            wp_send_json_success([
                'attachmentId' => $attachment_id,
                'url' => wp_get_attachment_url($attachment_id),
                'title' => get_the_title($attachment_id),
            ]);
        }
    }
endif;
