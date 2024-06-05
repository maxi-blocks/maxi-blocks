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

        /**
         * Registers the plugin.
         */
        public static function register()
        {
            if (null == self::$instance) {
                self::$instance = new MaxiBlocks_CLI();
            }

            WP_CLI::add_command('maxiblocks set_style_card', [
                self::$instance,
                'set_style_card',
            ]);
            WP_CLI::add_command('maxiblocks list_style_cards', [
                self::$instance,
                'list_style_cards',
            ]);
            WP_CLI::add_command('maxiblocks get_current_style_card', [
                self::$instance,
                'get_current_style_card',
            ]);
            WP_CLI::add_command('maxiblocks import_page_set', [
                self::$instance,
                'import_page_set',
            ]);
            WP_CLI::add_command('maxiblocks replace_post_content', [
                self::$instance,
                'replace_post_content',
            ]);
            WP_CLI::add_command('maxiblocks create_post', [
                self::$instance,
                'create_post',
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
        public function set_style_card($args)
        {
            [$post_title] = $args;

            try {
                // Initialize Typesense client
                $client = new Client([
                    'api_key' => $_ENV['REACT_APP_TYPESENSE_API_KEY'],
                    'nodes' => [
                        [
                            'host' => $_ENV['REACT_APP_TYPESENSE_API_URL'],
                            'port' => '443',
                            'protocol' => 'https',
                        ],
                    ],
                ]);

                // Search for the style card by post title
                $searchParameters = [
                    'q' => $post_title,
                    'query_by' => 'post_title',
                    'per_page' => 1,
                ];

                $result = $client->collections['style_card']->documents->search(
                    $searchParameters,
                );

                if ($result['found'] > 0) {
                    $style_card = $result['hits'][0]['document'];
                    $style_card_title = $style_card['post_title'];

                    if ($style_card_title !== $post_title) {
                        WP_CLI::confirm(
                            sprintf(
                                'Style card not found. Did you mean "%s"?',
                                $style_card_title,
                            ),
                        );
                    }

                    $sc_code = json_decode($style_card['sc_code'], true);
                    $sc_code['status'] = 'active';
                    $sc_code['selected'] = true;
                    $sc_code['gutenberg_blocks_status'] = true;

                    $var_sc = get_sc_variables_object($sc_code, null, true);
                    $var_sc_string = create_sc_style_string($var_sc);
                    $sc_styles = get_sc_styles(
                        $var_sc,
                        $sc_code['gutenberg_blocks_status'],
                    );

                    $maxi_api = MaxiBlocks_API::get_instance();

                    $style_cards = json_decode(
                        $maxi_api->get_maxi_blocks_current_style_cards(),
                        true,
                    );

                    foreach ($style_cards as $key => $value) {
                        $style_cards[$key]['status'] = '';
                        $style_cards[$key]['selected'] = false;
                    }

                    $style_cards_key = 'sc_' . strtolower($sc_code['name']);
                    $style_cards[$style_cards_key] = $sc_code;

                    $maxi_api->set_maxi_blocks_current_style_cards(
                        [
                            'styleCards' => json_encode($style_cards),
                        ],
                        false,
                    );

                    $maxi_api->post_maxi_blocks_sc_string([
                        'sc_variables' => $var_sc_string,
                        'sc_styles' => $sc_styles,
                        'update' => true,
                    ]);

                    WP_CLI::success('Style card set successfully.');
                } else {
                    WP_CLI::error('Style card not found.');
                }
            } catch (Exception $e) {
                WP_CLI::error('Error setting style card: ' . $e->getMessage());
            }
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
        public function list_style_cards($args, $assoc_args)
        {
            try {
                // Initialize Typesense client
                $client = new Client([
                    'api_key' => $_ENV['REACT_APP_TYPESENSE_API_KEY'],
                    'nodes' => [
                        [
                            'host' => $_ENV['REACT_APP_TYPESENSE_API_URL'],
                            'port' => '443',
                            'protocol' => 'https',
                        ],
                    ],
                ]);

                // Get the count argument
                $count = isset($assoc_args['count'])
                    ? $assoc_args['count']
                    : 10;

                // Search for style cards
                $searchParameters = [
                    'q' => '*',
                    'query_by' => 'post_title',
                    'sort_by' => 'post_date_int:desc',
                    'per_page' => $count === 'all' ? 100 : intval($count),
                    'page' => 1,
                ];

                $styleCards = $client->collections[
                    'style_card'
                ]->documents->search($searchParameters);

                // Display the total number of style cards found
                WP_CLI::line(
                    sprintf('Found %d style card(s).', $styleCards['found']),
                );

                // Display the names of the style cards
                foreach ($styleCards['hits'] as $styleCard) {
                    WP_CLI::line('- ' . $styleCard['document']['post_title']);
                }

                // Display a message if there are more style cards available
                if ($count !== 'all' && $styleCards['found'] > $count) {
                    WP_CLI::line(
                        sprintf(
                            'Displaying the first %d style card(s). Use --count=all to see all style cards.',
                            $count,
                        ),
                    );
                }
            } catch (Exception $e) {
                WP_CLI::error('Error listing style cards: ' . $e->getMessage());
            }
        }

        /**
         * Get the current style card.
         *
         * ## EXAMPLES
         *
         *     wp maxiblocks get_current_style_card
         */
        public function get_current_style_card()
        {
            try {
                $maxi_api = MaxiBlocks_API::get_instance();
                $style_cards = json_decode(
                    $maxi_api->get_maxi_blocks_current_style_cards(),
                    true,
                );

                $style_card = null;

                foreach ($style_cards as $key => $value) {
                    if ($value['selected']) {
                        $style_card = $value;
                        break;
                    }
                }

                if ($style_card) {
                    WP_CLI::line('Current style card: ' . $style_card['name']);
                } else {
                    WP_CLI::error('No style card selected.');
                }
            } catch (Exception $e) {
                WP_CLI::error(
                    'Error getting current style card: ' . $e->getMessage(),
                );
            }
        }

        /**
         * Import a page set.
         *
         * ## OPTIONS
         * <page_set_path>
         * : Path to valid WXR files for importing.
         *
         * ## EXAMPLES
         *   wp maxiblocks import_page_set /path/to/page-set.xml
         */
        public function import_page_set($args, $assoc_args)
        {
            [$page_set_path] = $args;

            $import_command = 'wp import ' . $page_set_path . ' --authors=skip';
            $descriptorspec = array(
                0 => array("pipe", "r"),  // stdin is a pipe that the child will read from
                1 => array("pipe", "w"),  // stdout is a pipe that the child will write to
                2 => array("pipe", "w") // stderr is a pipe that the child will write to
            );

            # FIXME: possible to use WP_CLI::runcommand()?
            $process = proc_open($import_command, $descriptorspec, $pipes, null, null);

            if (is_resource($process)) {
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
                proc_close($process);
            }
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
        public function replace_post_content($args, $assoc_args)
        {
            $post_id = $args[0];
            $content_source = isset($args[1]) ? $args[1] : null;

            if (!$content_source) {
                $content_source = $this->prompt_for_attachment();
            }

            $content = $this->get_content($content_source);

            $append = isset($assoc_args['append']);
            $prepend = isset($assoc_args['prepend']);

            if ($append && $prepend) {
                WP_CLI::error('Cannot use both --append and --prepend options.');
            }

            WP_CLI::log('Updating post content...');

            try {
                $post = get_post($post_id);

                if (!$post) {
                    WP_CLI::error('Post not found.');
                }

                $new_content = $content;

                if ($append) {
                    $new_content = $post->post_content . $content;
                } elseif ($prepend) {
                    $new_content = $content . $post->post_content;
                }

                set_transient('maxi_blocks_update_' . $post_id, true, 10 * MINUTE_IN_SECONDS);

                $result = wp_update_post([
                    'ID' => $post_id,
                    'post_content' => $new_content,
                ]);

                if (is_wp_error($result)) {
                    WP_CLI::error('Error updating post: ' . $result->get_error_message());
                }

                WP_CLI::success('Post content updated successfully.');
            } catch (Exception $e) {
                WP_CLI::error('Error replacing post content: ' . $e->getMessage());
            }
        }

        private function get_content($source)
        {
            if (is_numeric($source)) {
                $content = $this->get_attachment_content($source);
                if ($content === false) {
                    WP_CLI::log('Invalid attachment ID.');
                    $source = $this->prompt_for_attachment();
                    return $this->get_content($source);
                }
            } else {
                $content = file_get_contents($source);
                if ($content === false) {
                    WP_CLI::error('Unable to read content file.');
                }
            }
            return $content;
        }

        private function get_attachment_content($attachment_id)
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

        private function prompt_for_attachment()
        {
            $attachments = get_posts([
                'post_type' => 'attachment',
                'posts_per_page' => -1,
                'post_status' => 'inherit',
                'post_mime_type' => 'text/plain',
            ]);

            if (empty($attachments)) {
                WP_CLI::error('No attachments found. Add a text file attachment to the media library or provide a file path.');
            }

            WP_CLI::log('Please select an attachment ID from the list below:');
            foreach ($attachments as $attachment) {
                WP_CLI::log("ID: {$attachment->ID} - Title: {$attachment->post_title}");
            }

            $input = readline('Enter attachment ID: ');
            $attachment_id = intval($input);

            if (!$attachment_id) {
                WP_CLI::log('Invalid attachment ID.');
                return $this->prompt_for_attachment();
            }

            return $attachment_id;
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
         * wp maxiblocks create_post "Post Title" /path/to/content.txt --post_type=page
         */
        public function create_post($args, $assoc_args)
        {
            $title = $args[0];
            $content_source = isset($args[1]) ? $args[1] : null;

            if (!$content_source) {
                $content_source = $this->prompt_for_attachment();
            }

            $content = $this->get_content($content_source);

            $post_type = isset($assoc_args['post_type']) ? $assoc_args['post_type'] : 'post';

            WP_CLI::log('Creating post...');

            $post_id = wp_insert_post([
                'post_title' => $title,
                'post_type' => $post_type,
                'post_status' => 'publish',
            ]);

            if (is_wp_error($post_id)) {
                WP_CLI::error('Error creating post: ' . $post_id->get_error_message());
            }

            set_transient('maxi_blocks_update_' . $post_id, true, 10 * MINUTE_IN_SECONDS);

            $result = wp_update_post([
                'ID' => $post_id,
                'post_content' => $content,
            ]);

            if (is_wp_error($result)) {
                WP_CLI::error('Error updating post: ' . $result->get_error_message());
            }

            WP_CLI::success('Post created successfully (' . get_permalink($post_id) . ')');
        }
    }
endif;
