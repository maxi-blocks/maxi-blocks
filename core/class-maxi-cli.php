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

            WP_CLI::add_command('maxiblocks set_style_card', [self::$instance, 'set_style_card']);
            WP_CLI::add_command('maxiblocks list_style_cards', [self::$instance, 'list_style_cards']);
            WP_CLI::add_command('maxiblocks get_current_style_card', [self::$instance, 'get_current_style_card']);
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
            list($post_title) = $args;

            try {
                // Initialize Typesense client
                $client = new Client(
                    [
                        'api_key' => $_ENV['REACT_APP_TYPESENSE_API_KEY'],
                        'nodes' => [
                            [
                                'host' => $_ENV['REACT_APP_TYPESENSE_API_URL'],
                                'port' => '443',
                                'protocol' => 'https',
                            ],
                        ],
                    ]
                );

                // Search for the style card by post title
                $searchParameters = [
                    'q' => $post_title,
                    'query_by' => 'post_title',
                    'per_page' => 1,
                ];

                $result = $client->collections['style_card']->documents->search($searchParameters);

                if ($result['found'] > 0) {
                    $style_card = $result['hits'][0]['document'];
                    $style_card_title = $style_card['post_title'];

                    if($style_card_title !== $post_title) {
                        WP_CLI::confirm(
                            sprintf(
                                'Style card not found. Did you mean "%s"?',
                                $style_card_title
                            )
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
                        $sc_code['gutenberg_blocks_status']
                    );

                    $maxi_api = MaxiBlocks_API::get_instance();

                    $style_cards =  json_decode($maxi_api->get_maxi_blocks_current_style_cards(), true);

                    foreach ($style_cards as $key => $value) {
                        $style_cards[$key]['status'] = '';
                        $style_cards[$key]['selected'] = false;
                    }

					$style_cards_key = 'sc_' . strtolower($sc_code['name']);
					$style_cards[$style_cards_key] = $sc_code;

                    $maxi_api->set_maxi_blocks_current_style_cards([
                        'styleCards' => json_encode($style_cards),
                    ], false);


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
                $client = new Client(
                    [
                        'api_key' => $_ENV['REACT_APP_TYPESENSE_API_KEY'],
                        'nodes' => [
                            [
                                'host' => $_ENV['REACT_APP_TYPESENSE_API_URL'],
                                'port' => '443',
                                'protocol' => 'https',
                            ],
                        ],
                    ]
                );

                // Get the count argument
                $count = isset($assoc_args['count']) ? $assoc_args['count'] : 10;

                // Search for style cards
                $searchParameters = [
                    'q' => '*',
                    'query_by' => 'post_title',
                    'sort_by' => 'post_date_int:desc',
                    'per_page' => $count === 'all' ? 100 : intval($count),
                    'page' => 1,
                ];

                $styleCards = $client->collections['style_card']->documents->search($searchParameters);

                // Display the total number of style cards found
                WP_CLI::line(sprintf('Found %d style card(s).', $styleCards['found']));

                // Display the names of the style cards
                foreach ($styleCards['hits'] as $styleCard) {
                    WP_CLI::line('- ' . $styleCard['document']['post_title']);
                }

                // Display a message if there are more style cards available
                if ($count !== 'all' && $styleCards['found'] > $count) {
                    WP_CLI::line(sprintf('Displaying the first %d style card(s). Use --count=all to see all style cards.', $count));
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
                $style_cards = json_decode($maxi_api->get_maxi_blocks_current_style_cards(), true);

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
                WP_CLI::error('Error getting current style card: ' . $e->getMessage());
            }
        }
    }
endif;
