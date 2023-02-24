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
        // Dynamic blocks
        register_block_type('maxi-blocks/text-maxi', array(
            'api_version' => 2,
            'editor_script' => 'maxi-blocks-block-editor',
            'render_callback' => [$this, 'render_text_maxi'],
        ));
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
            'dc-field' => $dc_field,
        ) = $attributes;

        if (empty($dc_type)) {
            $dc_type = 'posts';
        }
        if (empty($dc_relation)) {
            $dc_relation = 'id';
        }

        if (in_array($dc_type, ['posts', 'pages'])) { // Post or page
            $response = self::get_post_or_page_content($attributes);
        } elseif ($dc_type === 'settings') { // Site settings
            $response = self::get_site_content($dc_field);
        } elseif ($dc_type === 'media') {
            $response = self::get_media_content($attributes);
        } elseif (in_array($dc_type, ['categories', 'tags'])) { // Categories or tags
            $response = self::get_taxonomy_content($attributes);
        }

        if ($dc_field === 'date') {
            $response = self::get_date($response, $attributes);
        }

        if (empty($response)) {
            $response = 'No content found';
        }

        $content = str_replace('$text-to-replace', $response, $content);

        return $content;
    }

    public function get_post_or_page_content($attributes)
    {
        @list(
            'dc-type' => $dc_type,
            'dc-relation' => $dc_relation,
            'dc-id' => $dc_id,
            'dc-author' => $dc_author,
            'dc-field' => $dc_field,
            'dc-limit' => $dc_limit,
        ) = $attributes;

        if (empty($dc_type)) {
            $dc_type = 'posts';
        }
        if (empty($dc_relation)) {
            $dc_relation = 'id';
        }

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
            $args['author'] = $dc_author ?? $dc_id;
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

            // In case is not set, put the default limit
            if (!isset($dc_limit)) {
                $dc_limit = 100;
            }

            // Limit content
            if ($dc_limit > 0 && strlen($post_data) > $dc_limit) {
                $post_data = trim($post_data);
                $post_data = substr($post_data, 0, $dc_limit - 1) . '…';
            }
        }

        // In case is author, get author name
        if ($dc_field === 'author') {
            $post_data = get_the_author_meta('display_name', $query->post->post_author);
        }

        return $post_data;
    }

    public function get_site_content($dc_field)
    {
        $dictionary = [
            'title' => 'name',
            'tagline' => 'description',
            'url' => 'url',
            'email' => 'admin_email',
            'language' => 'language',
        ];

        $site_data = get_bloginfo($dictionary[$dc_field]);

        return $site_data;
    }

    public function get_media_content($attributes)
    {
        @list(
            'dc-relation' => $dc_relation,
            'dc-id' => $dc_id,
            'dc-field' => $dc_field,
        ) = $attributes;

        if (empty($dc_relation)) {
            $dc_relation = 'id';
        }

        $args = [
            'post_type' => 'attachment',
            'posts_per_page' => 1,
        ];

        // DC Relation
        $is_random = $dc_relation == 'random';
        if ($dc_relation == 'id') {
            $args['p'] = $dc_id;
        } if ($is_random) {
            $args= [
                'post_type' => 'attachment',
                'post_status' => 'inherit',
               'posts_per_page' => -1
            ];
        }

        $query = new WP_Query($args);

        if ($dc_field === 'caption') {
            $dc_field = 'excerpt';
        } elseif ($dc_field === 'description') {
            $dc_field = 'content';
        }

        $post;

        if ($is_random) {
            $posts = $query->posts;
            $post = $posts[array_rand($posts)];
        } else {
            $post = $query->post;
        }

        $media_data = $post->{"post_$dc_field"};

        if ($dc_field === 'author') {
            $media_data = get_the_author_meta('display_name', $query->post->post_author);
        }

        return $media_data;
    }

    public function get_taxonomy_content($attributes)
    {
        @list(
            'dc-type' => $dc_type,
            'dc-relation' => $dc_relation,
            'dc-id' => $dc_id,
            'dc-field' => $dc_field,
            'dc-limit' => $dc_limit,
        ) = $attributes;

        if ($dc_type === 'categories') {
            $taxonomy = 'category';
        } elseif ($dc_type === 'tags') {
            $taxonomy = 'post_tag';
        }

        $args = [
            'taxonomy' => $taxonomy,
            'hide_empty' => false,
            'number' => 1,
        ];

        if ($dc_relation == 'random') {
            $args['orderby'] = 'rand';
        } else {
            $args['include'] = $dc_id;
        }

        $terms = get_terms($args);

        if ($dc_field === 'link') {
            $tax_data = get_term_link($terms[0]);
        } else {
            $tax_data = $terms[0]->{"$dc_field"};
        }

        if ($dc_field === 'parent') {
            if ($tax_data === 0) {
                $tax_data = 'No parent';
            } else {
                $tax_data = get_term($tax_data)->name;
            }
        }

        return $tax_data;
    }

    public function get_date($date, $attributes)
    {
        @list(
            'dc-format' => $dc_format,
            'dc-custom-format' => $dc_custom_format,
            'dc-custom-date' => $dc_custom_date,
            'dc-year' => $dc_year,
            'dc-month' => $dc_month,
            'dc-day' => $dc_day,
            'dc-hour' => $dc_hour,
            'dc-hour12' => $dc_hour12,
            'dc-minute' => $dc_minute,
            'dc-second' => $dc_second,
            'dc-weekday' => $dc_weekday,
            'dc-era' => $dc_era,
            'dc-locale' => $dc_locale,
            'dc-timezone' => $dc_timezone,
            'dc-timezone-name' => $dc_timezone_name,
        ) = $attributes;

        if (!isset($dc_custom_date)) {
            $dc_custom_date = false;
        }
        if (!isset($dc_timezone)) {
            $dc_timezone = 'none';
        }
        if (!isset($dc_format)) {
            $dc_format = 'd.m.Y t';
        }
        
        $options = array(
            'day' => $dc_day === 'none' ? null : $dc_day,
            'era' => $dc_era === 'none' ? null : $dc_era,
            'hour' => $dc_hour === 'none' ? null : $dc_hour,
            'hour12' => $dc_hour12 === 'false' ? false : ($dc_hour12 === 'true' ? true : $dc_hour12),
            'minute' => $dc_minute === 'none' ? null : $dc_minute,
            'month' => $dc_month === 'none' ? null : $dc_month,
            'second' => $dc_second === 'none' ? null : $dc_second,
            'timezone' => $dc_timezone === 'none' ? 'UTC' : $dc_timezone,
            'timezone_name' => $dc_timezone_name === 'none' ? null : $dc_timezone_name,
            'weekday' => $dc_weekday === 'none' ? null : $dc_weekday,
            'year' => $dc_year === 'none' ? null : $dc_year,
        );

        $new_date = new DateTime($date, new DateTimeZone($options['timezone']));

        $content = '';
        $new_format = $dc_custom_date ? $dc_custom_format : $dc_format;

        if ($dc_custom_date) {
            $new_format = self::convert_moment_to_php_date_format($dc_custom_format);
        }

        $new_format = str_replace(['DV', 'DS', 'MS'], ['x', 'z', 'c'], $new_format);

        $map = array(
            'z' => 'D',
            'x' => 'd',
            'c' => 'M',
            'd' => 'j',
            'D' => 'l',
            'm' => 'm',
            'M' => 'F',
            'y' => 'y',
            'Y' => 'Y',
            't' => 'H:i:s',
        );

        $new_format = preg_replace_callback('/[xzcdDmMyYt]/', function ($match) use ($map) {
            return $map[$match[0]];
        }, $new_format);

        $content = $new_date->format($new_format);

        return $content;
    }
    
    public function convert_moment_to_php_date_format($format)
    {
        $replacements = array(
          'DD' => 'd',
          'ddd' => 'D',
          'D' => 'j',
          'dddd' => 'l',
          'E' => 'N',
          'o' => 'S',
          'e' => 'w',
          'DDD' => 'z',
          'W' => 'W',
          'MMMM' => 'F',
          'MM' => 'm',
          'MMM' => 'M',
          'M' => 'n',
          'YYYY' => 'o',
          'YY' => 'y',
          'a' => 'a',
          'A' => 'A',
          'h' => 'g',
          'H' => 'G',
          'hh' => 'h',
          'HH' => 'H',
          'mm' => 'i',
          'ss' => 's',
          'SSS' => 'u',
          'zz' => 'e',
          'X' => 'U'
        );
      
        return strtr($format, $replacements);
    }
}
