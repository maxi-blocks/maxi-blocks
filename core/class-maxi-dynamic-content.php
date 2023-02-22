<?php

/**
 * Server side part of MaxiBlocks_DynamicContent Gutenberg component
 *
 * Generates dynamic content on frontend
 */
class MaxiBlocks_DynamicContent
{
    /**
     * This plugin's instance.
     *
     * @var MaxiBlocks_DynamicContent
     */
    private static $instance;

    /**
     * Registers the plugin.
     */
    public static function register()
    {
        if (null === self::$instance) {
            self::$instance = new MaxiBlocks_DynamicContent();
        }
    }

    /**
     * Constructor
     */
    public function __construct()
    {
        add_action('init', [
            $this,
            'dynamic_blocks',
        ]);

        // Dynamic blocks
        register_block_type('maxi-blocks/text-maxi', array(
            'api_version' => 2,
            'editor_script' => 'maxi-blocks-block-editor',
            'render_callback' => [$this, 'render_text_maxi'],
        ));
    }

    public function dynamic_blocks()
    {
        function maxi_add_rand_orderby_rest_api($query_params)
        {
            $query_params['orderby']['enum'][] = 'rand';
            return $query_params;
        }
        add_filter('rest_post_collection_params', 'maxi_add_rand_orderby_rest_api');
        add_filter('rest_page_collection_params', 'maxi_add_rand_orderby_rest_api');
    }

    public function render_text_maxi($attributes, $content)
    {
        if (!array_key_exists('dc-status', $attributes)) {
            return $content;
        }
        if (!$attributes['dc-status']) {
            return $content;
        }

        @list(
            'dc-type' => $dc_type,
            'dc-relation' => $dc_relation,
            'dc-id' => $dc_id,
            'dc-author' => $dc_author,
            'dc-show' => $dc_show,
            'dc-field' => $dc_field,
            'dc-limit' => $dc_limit,
        ) = $attributes;

        if (empty($dc_type)) {
            $dc_type = 'posts';
        }
        if (empty($dc_relation)) {
            $dc_relation = 'id';
        }

        if (in_array($dc_type, ['posts', 'pages'])) { // Post or page
            $response = self::get_post_or_page_content($dc_type, $dc_relation, $dc_id, $dc_show, $dc_field, $dc_limit);
        } elseif ($dc_type === 'settings') { // Site settings
            $response = self::get_site_content($dc_field);
        } elseif ($dc_type === 'media') {
            $response = self::get_media_content($dc_relation, $dc_id, $dc_field);
        }

        $content = str_replace('$text-to-replace', $response, $content);

        return $content;
    }

    public function get_post_or_page_content($dc_type, $dc_relation, $dc_id, $dc_show, $dc_field, $dc_limit)
    {
        // Basic args
        $args = [
            'post_type' => $dc_type === 'posts' ? 'post' : 'page',
            'post_status' => 'publish',
            'posts_per_page' => 1,
        ];

        // DC Relation
        if ($dc_relation == 'id') {
            $args['p'] = $dc_id;
        } elseif ($dc_relation == 'author') {
            $args['author'] = $dc_author;
        } elseif ($dc_relation == 'random') {
            $args['orderby'] = 'rand';
        }

        $query = new WP_Query($args);

        $post_data = $query->post->{"post_$dc_field"};

        if (empty($post_data) && $dc_field === 'excerpt') {
            $post_data = $query->post->post_content;
        }
        // In case is content, remove blocks and strip tags
        if (in_array($dc_field, ['content', 'excerpt'])) {
            // Remove all HTML tags and replace with a line break
            $post_data = excerpt_remove_blocks($post_data);
            $post_data = wp_strip_all_tags($post_data);

            // Ensures no double or more line breaks
            $post_data = preg_replace("/[\r\n]+/", "\n", $post_data);
            $post_data = preg_replace("/\n{2,}/", "\n", $post_data);
            $post_data = nl2br($post_data);
        }

        // In case is author, get author name
        if ($dc_field === 'author') {
            $post_data = get_the_author_meta('display_name', $query->post->post_author);
        }

        if ($dc_limit > 0 || !isset($dc_limit)) {
            $post_data = substr($post_data, 0, $dc_limit) . '...';
        }

        return $post_data;
    }

    public function get_site_content($dc_field)
    {
        $dictionary = [
            'title' => 'name',
            'tagline' => 'description',
            'email' => 'admin_email',
            'language' => 'language',
        ];

        $site_data = get_bloginfo($dictionary[$dc_field]);

        return $site_data;
    }

    public function get_media_content($dc_relation, $dc_id, $dc_field)
    {
        $args = [
            'post_type' => 'attachment',
            'posts_per_page' => 1,
        ];

        // DC Relation
        if ($dc_relation == 'id') {
            $args['p'] = $dc_id;
        } elseif ($dc_relation == 'random') {
            $args['orderby'] = 'rand';
        }

        $query = new WP_Query($args);

        if ($dc_field === 'caption') {
            $dc_field = 'excerpt';
        } elseif ($dc_field === 'description') {
            $dc_field = 'content';
        }

        $media_data = $query->post->{"post_$dc_field"};

        return $media_data;
    }
}
