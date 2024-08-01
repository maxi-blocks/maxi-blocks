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
                'load-style-card' => 'load_style_card',
                'set-style-card' => 'set_style_card',
                'reset-style-card' => 'reset_style_card',
                'list-style-cards' => 'list_style_cards',
                'get-current-style-card' => 'get_current_style_card',
                'import-page-set' => 'import_page_set',
                'replace-post-content' => 'replace_post_content',
                'create-post' => 'create_post',
                'reload-post-styles' => 'reload_post_styles',
            ];

            foreach ($commands as $command => $method) {
                WP_CLI::add_command("maxiblocks $command", [self::$instance, $method]);
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
         * Load style card from library.
         *
         * ## OPTIONS
         *
         * <name>
         * : The name of the style card to load. View all style cards names with `wp maxiblocks list-style-cards`.
         *
         * ## EXAMPLES
         *
         *     wp maxiblocks load-style-card StyleCardName
         *     wp maxiblocks load-style-card "Style Card Name"
         */
        public static function load_style_card($args)
        {
            [$post_title] = $args;

            try {
                $style_card = self::find_style_card($post_title);
                if (!$style_card) {
                    WP_CLI::error('Style card not found.');
                    return;
                }

                $sc_code = json_decode($style_card['sc_code'], true);
                $sc_code['gutenberg_blocks_status'] = true;
                self::add_or_update_style_card($sc_code);

                WP_CLI::success('Style card loaded successfully.');
                WP_CLI::confirm('Do you want to set this style card as active?');
                WP_CLI::runcommand('maxiblocks set-style-card ' . $sc_code['name']);
            } catch (Exception $e) {
                WP_CLI::error('Error loading style card: ' . $e->getMessage());
            }
        }

        /**
         * Set active style card from current style cards.
         *
         * ## OPTIONS
         *
         * [<key_or_name>]
         * : The key or name of the style card to set. If not provided, a list will be displayed for selection.
         *
         * ## EXAMPLES
         *
         *     wp maxiblocks set-style-card
         *     wp maxiblocks set-style-card sc_maxi
         *     wp maxiblocks set-style-card StyleCardName
         *     wp maxiblocks set-style-card "Style Card Name"
         */
        public static function set_style_card($args)
        {
            $style_cards = json_decode(self::$maxi_api->get_maxi_blocks_current_style_cards(), true);

            if(count($style_cards) <= 1) {
                WP_CLI::warning('No style cards to set. Use `wp maxiblocks load-style-card <name>` to load a style card from the library.');
                return;
            }

            if (empty($args)) {
                $identifier = self::display_and_select_style_cards($style_cards);
            } else {
                $identifier = $args[0];
            }

            $selected_card = self::get_style_card($style_cards, $identifier);

            if (!$selected_card) {
                WP_CLI::error('Style card not found.');
                return;
            }

            self::set_selected_style_card($style_cards, $selected_card);
            WP_CLI::success('Style card set successfully.');
        }

        /**
         * Displays available style cards and allows the user to select one.
         *
         * @returns key of the selected style card
         */
        private static function display_and_select_style_cards(array $style_cards): string
        {
            WP_CLI::line('Available style cards:');
            $options = [];
            $i = 1;
            foreach ($style_cards as $key => $card) {
                $options[$i] = $key;
                WP_CLI::line(sprintf('%d. %s', $i, $card['name']));
                $i++;
            }

            $choice = (int) readline('Enter the number of the style card you want to set: ');

            if (!isset($options[$choice])) {
                WP_CLI::warning('Invalid selection. Please try again.');
                return self::display_and_select_style_cards($style_cards);
            }

            return $options[$choice];
        }

        /**
         * Checks if style card exists by key or name
         *
         * @returns style card if found, null otherwise
         */
        private static function get_style_card(array $style_cards, string $identifier): ?array
        {
            foreach ($style_cards as $key => $card) {
                if ($key === $identifier || strtolower($card['name']) === strtolower($identifier)) {
                    return $card;
                }
            }
            return null;
        }

        private static function set_selected_style_card(array $style_cards, array $selected_card): void
        {
            foreach ($style_cards as $key => $card) {
                $style_cards[$key]['selected'] = false;
                $style_cards[$key]['status'] = '';
            }

            $selected_key = self::get_style_card_key($selected_card['name']);
            $style_cards[$selected_key]['selected'] = true;
            $style_cards[$selected_key]['status'] = 'active';

            self::$maxi_api->set_maxi_blocks_current_style_cards(['styleCards' => json_encode($style_cards)], false);

            $sc_code = $style_cards[$selected_key];
            $var_sc = get_sc_variables_object($sc_code, null, true);
            $var_sc_string = create_sc_style_string($var_sc);
            $sc_styles = get_sc_styles($var_sc, $sc_code['gutenberg_blocks_status']);

            self::$maxi_api->post_maxi_blocks_sc_string([
                'sc_variables' => $var_sc_string,
                'sc_styles' => $sc_styles,
                'update' => true,
            ]);
        }

        /**
         * Transforms style card name to key
         */
        private static function get_style_card_key($name)
        {
            if($name === 'Maxi (Default)') {
                return 'sc_maxi';
            }
            return 'sc_' . strtolower($name);
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

        private static function add_or_update_style_card(array $sc_code): void
        {
            $style_cards = json_decode(self::$maxi_api->get_maxi_blocks_current_style_cards(), true);
            $style_cards_key = self::get_style_card_key($sc_code['name']);
            $style_cards[$style_cards_key] = $sc_code;

            self::$maxi_api->set_maxi_blocks_current_style_cards(['styleCards' => json_encode($style_cards)], false);
        }

        /**
         * Reset style card to default.
         *
         * ## EXAMPLES
         *
         *     wp maxiblocks reset-style-card
         */
        public static function reset_style_card()
        {
            WP_CLI::confirm('Are you sure you want to reset the style card to default? This action cannot be undone.');

            try {
                $response = self::$maxi_api->reset_maxi_blocks_style_cards();

                if ($response) {
                    WP_CLI::success('Style card has been reset to default successfully.');
                } else {
                    WP_CLI::error('Failed to reset style card. Please try again.');
                }
            } catch (Exception $e) {
                WP_CLI::error('Error resetting style card: ' . $e->getMessage());
            }
        }

        /**
         * Lists all available from library style cards to set.
         *
         * ## OPTIONS
         *
         * [--count=<count>]
         * : The number of style cards to display per page. Default is 10.
         * Use "all" to display all style cards.
         *
         * ## EXAMPLES
         *
         *     wp maxiblocks list-style-cards
         *     wp maxiblocks list-style-cards --count=20
         *     wp maxiblocks list-style-cards --count=all
         */
        public static function list_style_cards($args, $assoc_args)
        {
            try {
                $count = isset($assoc_args['count']) ? $assoc_args['count'] : 10;
                self::display_style_cards($count);
            } catch (Exception $e) {
                WP_CLI::error('Error listing style cards: ' . $e->getMessage());
            }
        }

        private static function search_style_cards(string|int $count, int $page): array
        {
            $search_parameters = [
                'q' => '*',
                'query_by' => 'post_title',
                'sort_by' => 'post_date_int:desc',
                'per_page' => $count === 'all' ? 100 : intval($count),
                'page' => $page,
            ];

            return self::$typesense_client->collections['style_card']->documents->search($search_parameters);
        }

        private static function display_style_cards(string $count): void
        {
            $page = 1;
            $style_cards = self::search_style_cards($count, 1);
            WP_CLI::line(sprintf('Found %d style card(s).', $style_cards['found']));

            while (true) {
                $per_page = $count === 'all' ? $style_cards['found'] : intval($count);
                $total_pages = ceil($style_cards['found'] / $per_page);

                for ($i = 0; $i < $per_page; $i++) {
                    WP_CLI::line('- ' . $style_cards['hits'][$i]['document']['post_title']);
                }

                if($page !== 1) {
                    WP_CLI::line(sprintf('Page %d of %d', $page, $total_pages));
                }

                if($count !== 'all') {
                    WP_CLI::line(sprintf('Displaying %d style card(s) per page. Use --count=all in command call or enter "a" to see all style cards at once.', $per_page));
                }

                $options = ['q' => 'quit'];
                if ($page < $total_pages) {
                    $options['n'] = 'next page';
                }
                if ($page > 1) {
                    $options['p'] = 'previous page';
                }
                if ($count !== 'all') {
                    $options['a'] = 'all style cards';
                }

                $prompt = 'Enter ' . implode(', ', array_map(function ($key, $value) {
                    return "\"$key\" for $value";
                }, array_keys($options), $options)) . ':';

                WP_CLI::line($prompt);

                $input = readline();

                if($input == 'q') {
                    break;
                }

                if ($input === 'n') {
                    $page = min($page + 1, $total_pages);
                } elseif ($input === 'p') {
                    $page = max(1, $page - 1);
                } elseif ($input === 'a') {
                    $page = 1;
                    $count = 'all';
                }

                $style_cards = self::search_style_cards($count, $page);
            }
        }

        /**
         * Get active style card name.
         *
         * ## EXAMPLES
         *
         *     wp maxiblocks get-current-style-card
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
            if (is_array($style_cards) && !empty($style_cards)) {
                foreach ($style_cards as $style_card) {
                    if (array_key_exists('selected', $style_card) && $style_card['selected']) {
                        return $style_card;
                    }
                }
                return reset($style_cards);
            }
            return null;
        }

        /**
         * Imports a page set. Wrapper for WP CLI import command.
         *
         * ## OPTIONS
         * <page_set_path>
         * : Path to valid WXR files for importing.
         *
         * [--authors=<authors>]
         * : How the author mapping should be handled. Options are 'create' (default), 'mapping.csv', or 'skip'. The 'create' option will create any non-existent users from the WXR file. The 'mapping.csv' option will read author
         * mapping associations from a CSV, or create a CSV for editing if the file path doesn't exist. The CSV requires two columns, and a header row like "old_user_login,new_user_login". The
         * 'skip' option will skip any author mapping.
         *
         * ## EXAMPLES
         *   wp maxiblocks import-page-set /path/to/page-set.xml
         */
        public static function import_page_set($args, $assoc_args)
        {
            $page_set_path = $args[0];
            $authors = isset($assoc_args['authors']) ? $assoc_args['authors'] : 'create';
            WP_CLI::runcommand('import ' . $page_set_path . ' --authors=' . $authors);
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
         *    wp maxiblocks replace-post-content 123 /path/to/content.txt
         *    wp maxiblocks replace-post-content 123 456  # where 456 is an attachment ID
         *    wp maxiblocks replace-post-content 123 /path/to/content.txt --append
         *    wp maxiblocks replace-post-content 123 /path/to/content.txt --prepend
         */
        public static function replace_post_content($args, $assoc_args)
        {
            $post_id = $args[0];
            $content_source = isset($args[1]) ? $args[1] : null;

            if (!$content_source) {
                $content_source = self::prompt_for_attachment();
            }

            $content = self::get_content($content_source);
            $block_count = self::count_blocks($content);

            self::execute_with_progress('Updating post', $block_count, function () use ($post_id, $content, $assoc_args) {
                self::update_post_content($post_id, $content, $assoc_args);
            });

            WP_CLI::success('Post content updated successfully.');
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
         * wp maxiblocks create-post "Post Title" # and then select attachment from media library
         * wp maxiblocks create-post "Post Title" /path/to/content.txt
         * wp maxiblocks create-post "Post Title" 456  # where 456 is an attachment ID
         * wp maxiblocks create-post "Post Title" --post_type=page
         */
        public function create_post($args, $assoc_args)
        {
            $title = $args[0];
            $content_source = isset($args[1]) ? $args[1] : null;

            if (!$content_source) {
                $content_source = self::prompt_for_attachment();
            }
            $content = self::get_content($content_source);
            $block_count = self::count_blocks($content);

            $post_type = isset($assoc_args['post_type']) ? $assoc_args['post_type'] : 'post';

            $post_id = self::insert_post($title, $post_type);

            self::execute_with_progress('Creating post', $block_count, function () use ($post_id, $content) {
                self::update_post_content($post_id, $content, []);
            });

            WP_CLI::success('Post created successfully (' . get_permalink($post_id) . ')');
        }

        /**
         * Recalculates all block styles for a post. This command is useful if styles for post is broken or not working as expected.
         *
         * ## OPTIONS
         *
         * <post_id>
         * : The ID of the post to update the block styles.
         *
         * ## EXAMPLES
         *
         *    wp maxiblocks reload-post-styles 123
         */
        public function reload_post_styles($args)
        {
            $post_id = $args[0];

            $post = get_post($post_id);

            if (!$post) {
                WP_CLI::error('Post not found.');
                return;
            }

            $post_content = $post->post_content;
            $block_count = self::count_blocks($post_content);

            self::execute_with_progress('Reloading styles', $block_count, function () use ($post_id, $post_content) {
                do_action('maxiblocks_update_post_content', $post_id, $post_content, false);
            });

            WP_CLI::success('Block styles updated successfully.');
        }

        /**
         * Creates a progress bar and executes a given action with block count tracking.
         *
         * @param string $message The message to display with the progress bar.
         * @param int $block_count The total number of blocks to process.
         * @param callable $action The action to execute.
         */
        private static function execute_with_progress(string $message, int $block_count, callable $action): void
        {
            $progress = WP_CLI\Utils\make_progress_bar($message, $block_count);

            add_action('maxiblocks_block_info_updated', function () use ($progress) {
                $progress->tick();
            });

            $action();

            $progress->finish();
        }

        private static function update_post_content(int $post_id, string $content, array $assoc_args): void
        {
            $post = get_post($post_id);

            if (!$post) {
                WP_CLI::error('Post not found.');
            }

            $new_content = self::prepare_new_content($post->post_content, $content, $assoc_args);

            do_action('maxiblocks_update_post_content', $post_id, $new_content, true);
        }

        private static function prepare_new_content(string $existing_content, string $new_content, array $assoc_args): string
        {
            if (isset($assoc_args['append'])) {
                return $existing_content . $new_content;
            } elseif (isset($assoc_args['prepend'])) {
                return $new_content . $existing_content;
            }
            return $new_content;
        }

        private static function insert_post(string $title, string $post_type): int
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

        private static function get_content(string $source): string
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

        private static function get_attachment_content(int $attachment_id): string|bool
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

        private static function prompt_for_attachment(string $mime_type = 'text/plain'): int
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

        private static function count_blocks($content)
        {
            $blocks = parse_blocks($content);
            return self::count_blocks_recursive($blocks);
        }

        private static function count_blocks_recursive($blocks)
        {
            $count = 0;
            foreach ($blocks as $block) {
                $count++;
                if (!empty($block['innerBlocks'])) {
                    $count += self::count_blocks_recursive($block['innerBlocks']);
                }
            }
            return $count;
        }
    }
endif;
