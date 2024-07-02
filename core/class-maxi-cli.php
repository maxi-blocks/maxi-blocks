<?php

/**
 * MaxiBlocks CLI
 */
if (!defined('ABSPATH')) {
    exit();
}

require_once MAXI_PLUGIN_DIR_PATH . 'core/class-maxi-api.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/style-cards/get_sc_variables_object.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/style-cards/get_sc_styles.php';

require_once MAXI_PLUGIN_DIR_PATH . 'vendor/autoload.php';
use Typesense\Client;

$dotenv = Dotenv\Dotenv::createImmutable(MAXI_PLUGIN_DIR_PATH);
$dotenv->load();

if (class_exists('WP_CLI') && !class_exists('MaxiBlocks_CLI')):
    class MaxiBlocks_CLI
    {
        /**
         * This plugin's instance.
         *
         * @var MaxiBlocks_CLI
         */
        private static $instance;
        private static $typesense_client;
        private static $maxi_api;

        /**
         * Registers the plugin.
         */
        public static function register()
        {
            if (null == self::$instance) {
                self::$instance = new self();
            }

            $commands = [
                'set_style_card',
                'list_style_cards',
                'get_current_style_card',
                'import_page_set',
                'replace_post_content',
                'create_post',
                'update_post_styles',
            ];

            foreach ($commands as $command) {
                WP_CLI::add_command("maxiblocks $command", [self::$instance, $command]);
            }
        }

        private function __construct()
        {
            self::init_typesense_client();
            self::$maxi_api = MaxiBlocks_API::get_instance();
        }

        private static function init_typesense_client()
        {
            self::$typesense_client = new Client([
                'api_key' => $_ENV['REACT_APP_TYPESENSE_API_KEY'],
                'nodes' => [
                    [
                        'host' => $_ENV['REACT_APP_TYPESENSE_API_URL'],
                        'port' => '443',
                        'protocol' => 'https',
                    ],
                ],
            ]);
        }

        /**
         * Set style card for MaxiBlocks.
         *
         * ## OPTIONS
         *
         * <name>
         * : The name of the style card to set.
         *
         * ## EXAMPLES
         *
         *     wp maxiblocks set_style_card "Style Card Name"
         */
        public static function set_style_card($args)
        {
            [$post_title] = $args;

            try {
                $style_card = self::find_style_card($post_title);
                if (!$style_card) {
                    WP_CLI::error('Style card not found.');
                    return;
                }

                self::update_style_card($style_card);
                WP_CLI::success('Style card set successfully.');
            } catch (Exception $e) {
                WP_CLI::error('Error setting style card: ' . $e->getMessage());
            }
        }

        private static function find_style_card($post_title)
        {
            $searchParameters = [
                'q' => $post_title,
                'query_by' => 'post_title',
                'per_page' => 1,
            ];

            $result = self::$typesense_client->collections['style_card']->documents->search($searchParameters);

            if ($result['found'] > 0) {
                $style_card = $result['hits'][0]['document'];
                $style_card_title = $style_card['post_title'];

                if ($style_card_title !== $post_title) {
                    WP_CLI::confirm(sprintf('Style card not found. Did you mean "%s"?', $style_card_title));
                }

                return $style_card;
            }

            return null;
        }

        private static function update_style_card($style_card)
        {
            $sc_code = json_decode($style_card['sc_code'], true);
            $sc_code['status'] = 'active';
            $sc_code['selected'] = true;
            $sc_code['gutenberg_blocks_status'] = true;

            $var_sc = get_sc_variables_object($sc_code, null, true);
            $var_sc_string = create_sc_style_string($var_sc);
            $sc_styles = get_sc_styles($var_sc, $sc_code['gutenberg_blocks_status']);

            $style_cards = self::get_and_update_style_cards($sc_code);

            self::$maxi_api->set_maxi_blocks_current_style_cards(['styleCards' => json_encode($style_cards)], false);
            self::$maxi_api->post_maxi_blocks_sc_string([
                'sc_variables' => $var_sc_string,
                'sc_styles' => $sc_styles,
                'update' => true,
            ]);
        }

        private static function get_and_update_style_cards($sc_code)
        {
            $style_cards = json_decode(self::$maxi_api->get_maxi_blocks_current_style_cards(), true);

            foreach ($style_cards as $key => $value) {
                $style_cards[$key]['status'] = '';
                $style_cards[$key]['selected'] = false;
            }

            $style_cards_key = 'sc_' . strtolower($sc_code['name']);
            $style_cards[$style_cards_key] = $sc_code;

            return $style_cards;
        }

        /**
         * Lists style cards using Typesense PHP.
         *
         * ## OPTIONS
         *
         * [--count=<count>]
         * : The number of style cards to display. Default is 10.
         * Use "all" to display all style cards.
         *
         * ## EXAMPLES
         *
         *     wp maxiblocks list_style_cards
         *     wp maxiblocks list_style_cards --count=20
         *     wp maxiblocks list_style_cards --count=all
         */
        public static function list_style_cards($args, $assoc_args)
        {
            try {
                $count = isset($assoc_args['count']) ? $assoc_args['count'] : 10;
                $style_cards = self::search_style_cards($count);

                self::display_style_cards($style_cards, $count);
            } catch (Exception $e) {
                WP_CLI::error('Error listing style cards: ' . $e->getMessage());
            }
        }

        private static function search_style_cards($count)
        {
            $searchParameters = [
                'q' => '*',
                'query_by' => 'post_title',
                'sort_by' => 'post_date_int:desc',
                'per_page' => $count === 'all' ? 100 : intval($count),
                'page' => 1,
            ];

            return self::$typesense_client->collections['style_card']->documents->search($searchParameters);
        }

        private static function display_style_cards($style_cards, $count)
        {
            WP_CLI::line(sprintf('Found %d style card(s).', $style_cards['found']));

            foreach ($style_cards['hits'] as $style_card) {
                WP_CLI::line('- ' . $style_card['document']['post_title']);
            }

            if ($count !== 'all' && $style_cards['found'] > $count) {
                WP_CLI::line(sprintf('Displaying the first %d style card(s). Use --count=all to see all style cards.', $count));
            }
        }

        /**
         * Get the current style card.
         *
         * ## EXAMPLES
         *
         *     wp maxiblocks get_current_style_card
         */
        public static function get_current_style_card()
        {
            try {
                $style_cards = json_decode(self::$maxi_api->get_maxi_blocks_current_style_cards(), true);
                $current_style_card = self::find_current_style_card($style_cards);

                if ($current_style_card) {
                    WP_CLI::line('Current style card: ' . $current_style_card['name']);
                } else {
                    WP_CLI::error('No style card selected.');
                }
            } catch (Exception $e) {
                WP_CLI::error('Error getting current style card: ' . $e->getMessage());
            }
        }

        private static function find_current_style_card($style_cards)
        {
            foreach ($style_cards as $style_card) {
                if ($style_card['selected']) {
                    return $style_card;
                }
            }
            return null;
        }

        /**
         * Import a page set.
         *
         * ## OPTIONS
         * <page_set_path>
         * : Path to valid WXR files for importing or attachment ID. If not provided, you will be prompted to select an attachment.
         *
         * ## EXAMPLES
         *   wp maxiblocks import_page_set /path/to/page-set.xml
         */
        public static function import_page_set($args, $assoc_args)
        {
            $page_set_path = $args[0];
            $page_set_path = self::get_file_path($page_set_path);
            self::run_import_command($page_set_path);
        }

        private static function get_file_path($source)
        {
            if (is_numeric($source)) {
                $file_path = get_attached_file($source);
                if (!$file_path) {
                    WP_CLI::error('Invalid attachment ID or unable to get file path.');
                }
                return $file_path;
            }
            return $source;
        }

        private static function run_import_command($file_path)
        {
            $import_command = 'wp import ' . $file_path . ' --authors=skip';
            $descriptor_spec = array(
                0 => array("pipe", "r"),
                1 => array("pipe", "w"),
                2 => array("pipe", "w")
            );

            $process = proc_open($import_command, $descriptor_spec, $pipes, null, null);

            if (is_resource($process)) {
                self::process_import_output($pipes);
                proc_close($process);
            }
        }

        private static function process_import_output($pipes)
        {
            while ($s = fgets($pipes[1])) {
                if (strpos($s, 'Success') !== false) {
                    $s = trim(str_replace('Success:', '', $s));
                    WP_CLI::success($s);
                } elseif (strpos($s, 'Error') !== false) {
                    $s = trim(str_replace('Error:', '', $s));
                    WP_CLI::error($s);
                } else {
                    WP_CLI::log($s);
                }
            }
            fclose($pipes[1]);
            fclose($pipes[2]);
        }

        /**
         * Replaces the content of a post.
         *
         * ## OPTIONS
         * <post_id>
         * : The ID of the post to replace the content.
         * [<content_source>]
         * : Path to the content file or attachment ID. If not provided, you will be prompted to select an attachment.
         *
         * [--append]
         * : Append the new content to the existing content.
         *
         * [--prepend]
         * : Prepend the new content to the existing content.
         *
         * ## EXAMPLES
         *    wp maxiblocks replace_post_content 123 /path/to/content.txt
         *    wp maxiblocks replace_post_content 123 456  # where 456 is an attachment ID
         *    wp maxiblocks replace_post_content 123 /path/to/content.txt --append
         *    wp maxiblocks replace_post_content 123 /path/to/content.txt --prepend
         */
        public static function replace_post_content($args, $assoc_args)
        {
            $start_time = microtime(true);
            $post_id = $args[0];

            $content_source = isset($args[1]) ? $args[1] : null;

            if (!$content_source) {
                $content_source = self::prompt_for_attachment();
            }

            $content = self::get_content($content_source);

            self::update_post_content($post_id, $content, $assoc_args);
            $end_time = microtime(true);
            $execution_time = $end_time - $start_time;
            WP_CLI::success('Execution time: ' . $execution_time . ' seconds.');
        }

        private static function update_post_content($post_id, $content, $assoc_args)
        {
            $post = get_post($post_id);

            if (!$post) {
                WP_CLI::error('Post not found.');
            }

            $new_content = self::prepare_new_content($post->post_content, $content, $assoc_args);

            do_action('maxiblocks_update_post_content', $post_id, $new_content, true);

            WP_CLI::success('Post content updated successfully.');
        }

        private static function prepare_new_content($existing_content, $new_content, $assoc_args)
        {
            if (isset($assoc_args['append'])) {
                return $existing_content . $new_content;
            } elseif (isset($assoc_args['prepend'])) {
                return $new_content . $existing_content;
            }
            return $new_content;
        }

        /**
         * Creates a new post with the given title and content.
         *
         * ## OPTIONS
         * <title>
         * : The title of the post.
         *
         * [<content_source>]
         * : Path to the content file or attachment ID. If not provided, you will be prompted to select an attachment.
         *
         * [--post_type=<post_type>]
         * : The post type of the post. Default is 'post'.
         *
         * ## EXAMPLES
         * wp maxiblocks create_post "Post Title" /path/to/content.txt
         * wp maxiblocks create_post "Post Title" 456  # where 456 is an attachment ID
         * wp maxiblocks create_post "Post Title" --post_type=page
         */
        public static function create_post($args, $assoc_args)
        {
            $title = $args[0];
            $content_source = isset($args[1]) ? $args[1] : null;

            if (!$content_source) {
                $content_source = self::prompt_for_attachment();
            }
            $content = self::get_content($content_source);
            $post_type = isset($assoc_args['post_type']) ? $assoc_args['post_type'] : 'post';

            $post_id = self::insert_post($title, $post_type);
            self::update_post_content($post_id, $content, []);

            WP_CLI::success('Post created successfully (' . get_permalink($post_id) . ')');
        }

        /**
         * Updates the block styles for a post.
         *
         * ## OPTIONS
         *
         * <post_id>
         * : The ID of the post to update the block styles.
         *
         * ## EXAMPLES
         *
         *    wp maxiblocks update_post_styles 123
         */
        public static function update_post_styles($args)
        {
            $post_id = $args[0];

            $post = get_post($post_id);

            if (!$post) {
                WP_CLI::error('Post not found.');
                return;
            }

            $post_content = $post->post_content;
            do_action('maxiblocks_update_post_content', $post_id, $post_content, false);

            WP_CLI::success('Block styles updated successfully.');
        }

        private static function insert_post($title, $post_type)
        {
            $post_id = wp_insert_post([
                'post_title' => $title,
                'post_type' => $post_type,
                'post_status' => 'publish',
            ]);

            if (is_wp_error($post_id)) {
                WP_CLI::error('Error creating post: ' . $post_id->get_error_message());
            }

            return $post_id;
        }

        private static function get_content($source)
        {
            if (is_numeric($source)) {
                $content = self::get_attachment_content($source);
                if ($content === false) {
                    WP_CLI::log('Invalid attachment ID.');
                    $source = self::prompt_for_attachment();
                    return self::get_content($source);
                }
            } else {
                $content = file_get_contents($source);
                if ($content === false) {
                    WP_CLI::error('Unable to read content file.');
                }
            }

            return $content;
        }

        private static function get_attachment_content($attachment_id)
        {
            $attachment = get_post($attachment_id);
            if (!$attachment || $attachment->post_type !== 'attachment') {
                return false;
            }

            $file_path = get_attached_file($attachment_id);
            if (!$file_path || !file_exists($file_path)) {
                return false;
            }

            return file_get_contents($file_path);
        }

        private static function prompt_for_attachment($mime_type = 'text/plain')
        {
            $attachments = get_posts([
                'post_type' => 'attachment',
                'posts_per_page' => -1,
                'post_status' => 'inherit',
                'post_mime_type' => $mime_type,
            ]);

            if (empty($attachments)) {
                WP_CLI::error("No attachments found with mime type: $mime_type. Add a file attachment to the media library or provide a file path.");
            }

            WP_CLI::log('Please select an attachment ID from the list below:');
            foreach ($attachments as $attachment) {
                WP_CLI::log("ID: {$attachment->ID} - Title: {$attachment->post_title}");
            }

            $input = readline('Enter attachment ID: ');
            $attachment_id = intval($input);

            if (!$attachment_id) {
                WP_CLI::log('Invalid attachment ID.');
                return self::prompt_for_attachment($mime_type);
            }

            return $attachment_id;
        }
    }
endif;
