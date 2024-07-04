<?php

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit();
}

$core_classes = [
    'class-maxi-local-fonts',
    'class-maxi-style-cards',
    'class-maxi-api',
    'blocks/utils/get_all_fonts',
];

foreach($core_classes as $core_class) {
    require_once MAXI_PLUGIN_DIR_PATH . 'core/' . $core_class . '.php';
}

require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/class-maxi-block-factory.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/post-management/helpers/class-maxi-block-info.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/post-management/helpers/class-maxi-content.php';

class MaxiBlocks_Post_Update_Manager
{
    private static ?self $instance = null;
    private static ?MaxiBlocks_Block_Info_Updater $block_info_updater = null;
    private static ?MaxiBlocks_Content_Processor $content_processor = null;

    protected int $max_execution_time;

    /**
     * Registers the plugin.
     */
    public static function register()
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }

        if (null === self::$content_processor) {
            self::$content_processor = MaxiBlocks_Content_Processor::get_instance();
        }
        if (null === self::$block_info_updater) {
            self::$block_info_updater = MaxiBlocks_Block_Info_Updater::get_instance();
        }
    }

    public static function get_instance(): self
    {
        self::register();
        return self::$instance;
    }


    /**
    * Constructor
    */
    public function __construct()
    {
        $this->max_execution_time = ini_get('max_execution_time');

        /**
         * Custom maxiblocks action to process and update the post content
         */
        add_action('maxiblocks_update_post_content', [$this, 'process_updated_post_content'], 10, 3);

        /**
         * Action to clean the deleted maxiblocks styles
         */
        add_action('delete_post', [$this, 'clean_deleted_maxiblocks_styles'], 10, 2);

        /**
         * Triggered when a post is imported via the WordPress importer
         */
        add_action('wp_import_post_data_raw', [$this,'process_imported_post'], 10, 1);

        /**
         *  Yoast Duplicate Post support
         */
        add_filter('duplicate_post_new_post', [$this, 'update_post_unique_ids'], 10, 1);
    }

    /**
     * Updates the post with maxi blocks with updated post_content and styles
     */
    public function process_updated_post_content(int $post_id, string $post_content, bool $new_blocks = false): void
    {
        $updated_post_content = self::$content_processor->get_updated_post_content($post_content, $new_blocks);
        self::$block_info_updater->update_post_blocks_styles($updated_post_content);
        wp_update_post([
            'ID' => $post_id,
            'post_content' => self::$content_processor->prepare_content($updated_post_content),
        ]);
    }

    /**
     * Updates the unique IDs of all blocks within a new post's content.
     *
     * This function parses the blocks of the new post, updates their unique IDs,
     * and then re-serializes the blocks back into the post content.
     */
    public function update_post_unique_ids(WP_Post $new_post): WP_Post
    {
        $blocks = parse_blocks($new_post['post_content']);
        self::$content_processor->update_unique_ids($blocks);

        $serialized_content = serialize_blocks($blocks);

        $new_post['post_content'] = $serialized_content;

        return $new_post;
    }

    /**
     * Deletes all block styles associated with a post when the post is deleted.
     */
    public function clean_deleted_maxiblocks_styles(string $post_id, WP_Post $post): void
    {
        global $wpdb;
        $block_unique_ids = MaxiBlocks_Content_Processor::get_maxiblocks_unique_ids(parse_blocks($post->post_content));

        foreach ($block_unique_ids as $uniqueID) {
            $wpdb->delete("{$wpdb->prefix}maxi_blocks_styles_blocks", ['block_style_id' => $uniqueID]);
        }
    }

    /**
     * Updates the post content of an imported post and add styles to the blocks.
     */
    public function process_imported_post(WP_Post $post): WP_Post
    {
        $updated_post_content = self::$content_processor->get_updated_post_content($post->post_content, true);
        self::$block_info_updater->update_post_blocks_styles($updated_post_content);
        $post->post_content = $updated_post_content;
        return $post;
    }
}
