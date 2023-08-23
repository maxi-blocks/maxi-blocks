<?php
require_once MAXI_PLUGIN_DIR_PATH . 'core/class-maxi-styles.php';

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
    private static $custom_data = null;
    private static $order_by_relations = ['by-category', 'by-author', 'by-tag'];

    private static $link_only_blocks = [
        'group-maxi',
        'column-maxi',
        'row-maxi',
        'slide-maxi',
        'pane-maxi',
    ];

    private static $type_to_post_type = [
        'posts' => 'post',
        'pages' => 'page',
        'products' => 'product',
    ];

    /**
     * Initializes the plugin and its hooks.
     */
    public static function register()
    {
        if (is_null(self::$instance)) {
            self::$instance = new self();
        }
    }

    /**
    * Constructor: empty
     */
    public function __construct()
    {
    }


    public function render_dc($attributes, $content)
    {
        if (!array_key_exists('dc-status', $attributes)) {
            return $content;
        }
        if (!$attributes['dc-status']) {
            return $content;
        }

        $unique_id = $attributes['uniqueID'];
        $is_template = is_string($unique_id) && strpos($unique_id, '-template');

        if (str_ends_with($unique_id, '-u')) {
            $block_name = substr($unique_id, 0, -2);
            $block_name = substr($block_name, 0, strrpos($block_name, '-'));
        } else {
            $block_name = substr($unique_id, 0, strrpos($unique_id, '-'));
        }

        if(str_ends_with($unique_id, '-u')) {
            self::$custom_data = $this->get_dc_cl($unique_id);

        } elseif (self::$custom_data === null) {

            if (class_exists('MaxiBlocks_Styles')) {
                $styles = new MaxiBlocks_Styles();
                self::$custom_data = $styles->custom_meta('dynamic_content', $is_template);
            } else {
                self::$custom_data = [];
            }

        }

        $context_loop = [];

        if (is_array(self::$custom_data) && array_key_exists($unique_id, self::$custom_data)) {
            $context_loop = self::$custom_data[$unique_id];
        }
        $attributes = array_merge($attributes, $this->get_dc_values($attributes, $context_loop));

        if (array_key_exists('dc-link-status', $attributes)) {
            $dc_link_status = $attributes['dc-link-status'];

            if ($dc_link_status) {
                $content = self::render_dc_link($attributes, $content);
            }
        }

        if($is_template) {
            $block_name = substr($block_name, 0, strrpos($block_name, '-'));
        }

        if (in_array($block_name, self::$link_only_blocks)) {
            return $content;
        } elseif ($block_name !== 'image-maxi') {
            $content = self::render_dc_content($attributes, $content);
        } else {
            $content = self::render_dc_image($attributes, $content);
        }

        return $content;
    }

    public function render_dc_link($attributes, $content)
    {
        if (array_key_exists('dc-type', $attributes) && $attributes['dc-type'] === 'settings') {
            $link = get_home_url();
        } elseif (array_key_exists('dc-type', $attributes) && in_array($attributes['dc-type'], ['categories', 'tags'])) {
            $link = get_term_link($attributes['dc-id']);
        } elseif (array_key_exists('dc-type', $attributes) && $attributes['dc-type'] === 'users') {
            $link = get_author_posts_url($attributes['dc-id']);
        } else {
            $post = self::get_post($attributes);

            if (empty($post)) {
                return $content;
            }

            $link = get_permalink($post->ID);
        }

        $content = str_replace('$link-to-replace', $link, $content);

        return $content;
    }

    public function render_dc_content($attributes, $content)
    {

        @list(
            'dc-source' => $dc_source,
            'dc-type' => $dc_type,
            'dc-relation' => $dc_relation,
            'dc-field' => $dc_field,
        ) = $attributes;

        if ($attributes['dc-field'] === 'static_text') {
            return $content;
        }

        if (empty($dc_type)) {
            $dc_type = 'posts';
        }
        if (empty($dc_relation)) {
            $dc_relation = 'by-id';
        }

        $response = '';

        if ($dc_source === 'acf') {
            $response = self::get_acf_content($attributes);
        } elseif (in_array($dc_type, ['posts', 'pages'])) { // Post or page
            $response = self::get_post_or_page_content($attributes);
        } elseif ($dc_type === 'settings') { // Site settings
            $response = self::get_site_content($dc_field);
        } elseif ($dc_type === 'media') {
            $response = self::get_media_content($attributes);
        } elseif (in_array($dc_type, ['categories', 'tags'])) { // Categories or tags
            $response = self::get_taxonomy_content($attributes);
        } elseif ($dc_type === 'users') { // Users
            $response = self::get_user_content($attributes);
        } elseif ($dc_type === 'products') {
            $response = self::get_product_content($attributes);
        } elseif ($dc_type === 'cart') {
            $response = self::get_cart_content($attributes);
        }

        if ($dc_field === 'date') {
            $response = self::get_date($response, $attributes);
        }

        if (empty($response) && $response !== '0') {
            $response = 'No content found';
        }

        $content = str_replace('$text-to-replace', $response, $content);

        return $content;
    }

    public function render_dc_image($attributes, $content)
    {
        @list(
            'dc-source' => $dc_source,
            'dc-type' => $dc_type,
            'dc-relation' => $dc_relation,
            'dc-id' => $dc_id,
        ) = $attributes;

        if (empty($dc_type)) {
            $dc_type = 'posts';
        }
        if (empty($dc_relation)) {
            $dc_relation = 'by-id';
        }

        $media_alt = '';
        $media_caption = '';

        // Get media ID
        if ($dc_source === 'acf') {
            $image = self::get_acf_content($attributes);

            $media_id = is_array($image) && $image['id'];
        } elseif (in_array($dc_type, ['posts', 'pages'])) { // Post or page
            $post = $this->get_post($attributes);
            // $dc_field is not used here as there's just on option for the moment
            if (!empty($post)) {
                $media_id =  get_post_meta($post->ID, '_thumbnail_id', true);
            }
        } elseif ($dc_type === 'settings') { // Site settings
            // $dc_field is not used here as there's just on option for the moment
            $media_id = get_theme_mod('custom_logo');
        } elseif ($dc_type === 'media') {
            $media_id = $dc_id;
        } elseif ($dc_type === 'products') {
            $media_id = self::get_product_content($attributes);
        }

        if (!empty($media_id) && is_numeric($media_id)) {
            $media_src = wp_get_attachment_image_src($media_id, 'full')[0];

            $media_alt = get_post_meta($media_id, '_wp_attachment_image_alt', true);

            if (empty($media_alt)) {
                $media_alt = 'No content found';
            }

            $media_caption = get_post($media_id)->post_excerpt;

            if (empty($media_caption)) {
                $media_caption = 'No content found';
            }
        }

        if (!empty($media_src)) {
            $content = str_replace('$media-id-to-replace', $media_id, $content);
            $content = str_replace('$media-url-to-replace', $media_src, $content);
            $content = str_replace('$media-alt-to-replace', $media_alt, $content);
            $content = str_replace('$media-caption-to-replace', $media_caption, $content);
        } else {
            $content = str_replace('$media-id-to-replace', '', $content);
            $content = str_replace('$media-url-to-replace', '', $content);
            $content = str_replace('$media-alt-to-replace', '', $content);
            $content = str_replace('$media-caption-to-replace', '', $content);
        }

        return $content;
    }

    public function get_post($attributes)
    {
        @list(
            'dc-type' => $dc_type,
            'dc-relation' => $dc_relation,
            'dc-id' => $dc_id,
            'dc-author' => $dc_author,
            'dc-order-by' => $dc_order_by,
            'dc-order' => $dc_order,
            'dc-accumulator' => $dc_accumulator,
        ) = $attributes;

        if (empty($dc_type)) {
            $dc_type = 'posts';
        }
        if (empty($dc_relation)) {
            $dc_relation = 'by-id';
        }
        if (empty($dc_accumulator)) {
            $dc_accumulator = 0;
        }
        if(empty($dc_order_by)) {
            $dc_order_by = 'by-date';
        }
        if (empty($dc_order)) {
            $dc_order = 'desc';
        }

        $is_sort_relation = in_array($dc_relation, ['by-date', 'alphabetical', 'by-category', 'by-author', 'by-tag']);
        $is_random = $dc_relation === 'random';

        if (in_array($dc_type, ['posts', 'pages', 'products'])) {
            // Basic args
            $args = [
                'post_type' => self::$type_to_post_type[$dc_type],
                'post_status' => 'publish',
                'posts_per_page' => 1,
            ];

            // DC Relation
            if ($dc_relation == 'by-id') {
                $args['p'] = $dc_id;
            } elseif ($dc_relation == 'author') {
                $args['author'] = $dc_author ?? $dc_id;
            } elseif ($is_random) {
                $args['orderby'] = 'rand';
            } elseif ($is_sort_relation) {
                $args = array_merge($args, $this->get_order_by_args($dc_relation, $dc_order_by, $dc_order, $dc_accumulator, $dc_type, $dc_id));
            }

            if ($dc_type === 'products') {
                return wc_get_products($args)[0];
            }

            $query = new WP_Query($args);

            return end($query->posts);
        } elseif ($dc_type === 'media') {
            $args = [
                'post_type' => 'attachment',
                'posts_per_page' => 1,
            ];

            // DC Relation
            if ($dc_relation == 'by-id') {
                $args['p'] = $dc_id;
            } elseif ($is_random) {
                $args= [
                    'post_type' => 'attachment',
                    'post_status' => 'inherit',
                    'posts_per_page' => -1
                ];
            } elseif ($is_sort_relation) {
                $args['post_status'] = 'inherit';
                $args = array_merge($args, $this->get_order_by_args($dc_relation, $dc_order_by, $dc_order, $dc_accumulator, $dc_type, $dc_id));
            }

            $query = new WP_Query($args);

            if ($is_random) {
                $posts = $query->posts;
                $post = $posts[array_rand($posts)];
            } else {
                $post = end($query->posts);
            }

            return $post;
        } elseif (in_array($dc_type, ['categories', 'tags'])) {
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

            if ($is_random) {
                $args['orderby'] = 'rand';
            } else {
                $args['include'] = $dc_id;
            }

            $terms = get_terms($args);

            return $terms[0];
        } elseif ($dc_type === 'users') {
            $args = [
                'capability' => 'edit_posts',
            ];

            if ($is_sort_relation) {
                $args = array_merge($args, $this->get_order_by_args($dc_relation, $dc_order_by, $dc_order, $dc_accumulator, $dc_type, $dc_id));
            } elseif ($dc_relation === 'by-id') {
                $args['include'] = $dc_author ?? $dc_id;
            }

            $users = get_users($args);

            if ($dc_relation === 'random') {
                return $users[array_rand($users)];
            }

            return end($users);
        } elseif ($dc_type === 'settings') {
            return null;
        }
    }

    public function get_field_link($item, $field)
    {
        switch ($field) {
            case 'author':
                return get_author_posts_url($item);
            case 'categories':
            case 'tags':
                return get_term_link($item);
            default:
                return '';
        }
    }

    public function get_post_taxonomy_item_content($item, $content, $link_status, $field)
    {
        return ($link_status)
            ? '<a href="' . $this->get_field_link($item, $field) . '" class="maxi-text-block--link"><span>' . $content . '</span></a>'
            : $content;
    }

    public function get_post_or_page_content($attributes)
    {
        @list(
            'dc-field' => $dc_field,
            'dc-limit' => $dc_limit,
            'dc-delimiter-content' => $dc_delimiter,
            'dc-post-taxonomy-links-status' => $dc_post_taxonomy_links_status,
        ) = $attributes;

        $post = $this->get_post($attributes);

        if(is_null($post) || !isset($post->{"post_$dc_field"})) {
            return '';
        }

        $post_data = $post->{"post_$dc_field"};

        if (empty($post_data) && $dc_field === 'excerpt') {
            $post_data = $post->post_content;
        }
        // In case is content, remove blocks and strip tags
        if (in_array($dc_field, ['title', 'content', 'excerpt'])) {
            // Remove all HTML tags and replace with a line break
            if($dc_field === 'excerpt') {
                $post_data = excerpt_remove_blocks($post_data);
            }
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
            $post_data = self::get_limited_string($post_data, $dc_limit);
        }

        // In case is author, get author name
        if ($dc_field === 'author') {
            $post_data = $this->get_post_taxonomy_item_content(
                $post->post_author,
                get_the_author_meta('display_name', $post->post_author),
                $dc_post_taxonomy_links_status,
                $dc_field
            );
        }

        if (in_array($dc_field, ['categories', 'tags'])) {
            $field_name_to_taxonomy = [
                'tags' => 'post_tag',
                'categories' => 'category',
            ];

            $taxonomy_list = wp_get_post_terms($post->ID, $field_name_to_taxonomy[$dc_field]);

            $taxonomy_content = [];

            foreach ($taxonomy_list as $taxonomy_item) {
                $taxonomy_content[] = $this->get_post_taxonomy_item_content(
                    $taxonomy_item,
                    $taxonomy_item->name,
                    $dc_post_taxonomy_links_status,
                    $dc_field
                );
            }

            $post_data = implode("$dc_delimiter ", $taxonomy_content);
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
            'dc-field' => $dc_field,
        ) = $attributes;

        $post = $this->get_post($attributes);
        $media_data = $post->{"post_$dc_field"};

        if ($dc_field === 'author') {
            $media_data = get_the_author_meta('display_name', $post->post_author);
        }

        return $media_data;
    }

    public function get_user_content($attributes)
    {
        @list(
            'dc-field' => $dc_field,
        ) = $attributes;

        $user = $this->get_post($attributes);

        $user_dictionary = [
            'name' => 'display_name',
            'email' => 'user_email',
            'url' => 'user_url',
            'description' => 'description',
        ];

        $user_data = $user->data->{$user_dictionary[$dc_field]};

        return $user_data;
    }

    public function get_taxonomy_content($attributes)
    {
        @list(
            'dc-field' => $dc_field,
            'dc-limit' => $dc_limit,
        ) = $attributes;

        $term = $this->get_post($attributes);
        if ($dc_field === 'link') {
            $tax_data = get_term_link($term);
        } else {
            $tax_data = $term->{"$dc_field"};
        }

        if ($dc_field === 'parent') {
            if ($tax_data === 0) {
                $tax_data = 'No parent';
            } else {
                $tax_data = get_term($tax_data)->name;
            }
        }

        if ($dc_field === 'description') {
            $tax_data = self::get_limited_string($tax_data, $dc_limit);
        }

        return $tax_data;
    }

    public function get_product_content($attributes)
    {
        @list(
            'dc-field' => $dc_field,
            'dc-limit' => $dc_limit,
        ) = $attributes;

        $product = $this->get_post($attributes);

        switch ($dc_field) {
            case 'name':
            case 'slug':
            case 'sku':
            case 'review_count':
            case 'average_rating':
                return strval($product->get_data()[$dc_field]);
            case 'price':
            case 'regular_price':
                return strip_tags(wc_price($product->get_data()[$dc_field]));
            case 'sale_price':
                if ($product->is_on_sale()) {
                    return strip_tags(wc_price($product->get_sale_price()));
                }

                return strip_tags(wc_price($product->get_price()));
            case 'price_range':
                if ($product->is_type('variable')) {

                    $min_price = $product->get_variation_price('min', true);
                    $max_price = $product->get_variation_price('max', true);

                    if ($min_price !== $max_price) {
                        return wc_format_price_range($min_price, $max_price);
                    }
                }

                return strip_tags(wc_price($product->get_price()));
            case 'description':
                return self::get_limited_string($product->get_description(), $dc_limit);
            case 'short_description':
                return self::get_limited_string($product->get_short_description(), $dc_limit);
            case 'tags':
            case 'categories':
                $field_name_to_taxonomy = [
                    'tags' => 'product_tag',
                    'categories' => 'product_cat',
                ];

                return self::get_post_taxonomy_content($attributes, $product->get_id(), $field_name_to_taxonomy[$dc_field]);
            case 'featured_media':
                return (int) $product->get_image_id();
            default:
                return null;
        }
    }

    public function get_cart_content($attributes)
    {
        @list(
            'dc-field' => $dc_field,
            'dc-limit' => $dc_limit,
        ) = $attributes;

        if (!WC()->cart) {
            return null;
        }

        $field_to_totals = [
            'total_price' => 'total',
            'total_items' => 'cart_contents_total',
            'total_items_tax' => 'cart_contents_tax',
            'total_tax' => 'total_tax',
            'total_shipping' => 'shipping_total',
            'total_shipping_tax' => 'shipping_tax',
            'total_discount' => 'discount_total',
            'total_fees' => 'fee_total',
            'total_fees_tax' => 'fee_tax',
        ];

        switch ($dc_field) {
            case 'total_price':
            case 'total_items':
            case 'total_items_tax':
            case 'total_tax':
            case 'total_shipping':
            case 'total_shipping_tax':
            case 'total_discount':
            case 'total_fees':
            case 'total_fees_tax':
                return strip_tags(wc_price(WC()->cart->get_totals()[$field_to_totals[$dc_field]]));
            default:
                return null;
        }
    }

    public function get_price($field, $data)
    {
        $rawPrice = $data[$field];
        $parsePrice = function ($price) use ($data) {
            $currencyPrefix = $data['currency_prefix'];
            $currencySuffix = $data['currency_suffix'];
            $minorUnit = $data['currency_minor_unit'];
            $decimalSeparator = $data['currency_decimal_separator'];
            $thousandSeparator = $data['currency_thousand_separator'];

            // https://stackoverflow.com/a/2901298
            $separateThousands = function ($price) use ($thousandSeparator) {
                return preg_replace('/\B(?=(\d{3})+(?!\d))/', $thousandSeparator, $price);
            };

            $parsedPrice = strlen($price) > $minorUnit
                ? $separateThousands(substr($price, 0, -$minorUnit)) . $decimalSeparator . substr($price, -$minorUnit)
                : $price;

            return $currencyPrefix . $parsedPrice . $currencySuffix;
        };

        return $rawPrice ? $parsePrice($rawPrice) : null;
    }

    public function get_product_content($attributes)
    {
        @list(
            'dc-field' => $dc_field,
            'dc-limit' => $dc_limit,
        ) = $attributes;

        $product = $this->get_post($attributes);
        var_dump(get_woocommerce_price_format());

        switch ($dc_field) {
            case 'name':
            case 'slug':
            case 'sku':
            case 'review_count':
            case 'average_rating':
                return $product->get_data()[$dc_field];
            case 'price':
                return $product->get_price_html();
            case 'sale_price':
                return $product->get_sale_price();
            case 'regular_price':
                return $product->get_regular_price();
            case 'description':
                return self::get_limited_string($product->get_description(), $dc_limit);
            case 'short_description':
                return self::get_limited_string($product->get_short_description(), $dc_limit);
            default:
                return null;
        }
    }

    public function get_acf_content($attributes)
    {
        if (!function_exists('get_field_object')) {
            return '';
        }

        @list(
            'dc-field' => $dc_field,
            'dc-acf-field-type' => $dc_acf_field_type,
            'dc-limit' => $dc_limit,
            'dc-delimiter-content' => $dc_delimiter,
        ) = $attributes;

        $post = $this->get_post($attributes);
        $acf_data = get_field_object($dc_field, $post->ID);
        $acf_value = is_array($acf_data) ? $acf_data['value'] : null;
        $content = null;

        switch ($dc_acf_field_type) {
            case 'select':
            case 'radio':
                $content = is_array($acf_value) ? $acf_value['label'] : $acf_value;
                break;
            case 'checkbox':
                $content = implode("$dc_delimiter ", array_map(function ($item) {
                    return is_array($item) ? $item['label'] : $item;
                }, $acf_value));
                break;
            default:
                $content = $acf_value;
        }

        return $content;
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
        if (!isset($dc_timezone) || !$dc_custom_date) {
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
            't' => 'H:i',
        );

        $new_format = preg_replace_callback('/(?![^\[]*\])[xzcdDmMyYt]/', function ($match) use ($map) {
            return $map[$match[0]];
        }, $new_format);

        $content = date_i18n($new_format, $new_date->getTimestamp());

        // Regular expression to match square brackets.
        $regex = '/[\[\]]/';

        // Use preg_replace to replace each match with an empty string.
        $content = preg_replace($regex, '', $content);

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

        $format = preg_replace_callback(
            '/\b(' . implode('|', array_keys($replacements)) . ')\b/',
            function ($matches) use ($replacements) {
                return $replacements[$matches[0]];
            },
            $format
        );

        // Regular expression to match content inside square brackets, including brackets.
        $regex = '/\[[^\]]*\]/';

        // Use preg_replace_callback to replace each match.
        $format = preg_replace_callback($regex, function ($matches) {
            // Prepend each symbol with a slash.
            $result = '';
            for ($i = 0; $i < strlen($matches[0]); $i++) {
                $result .= '\\' . $matches[0][$i];
            }
            return $result;
        }, $format);

        return $format;
    }

    public function get_limited_string($string, $limit)
    {
        if ($limit > 0 && strlen($string) > $limit) {
            $string = trim($string);
            $string = substr($string, 0, $limit) . '…';
        }

        return $string;
    }

    public function get_default_dc_value($target, $obj, $defaults)
    {
        if(!is_array($defaults) || !isset($defaults[$target]) || !is_array($obj)) {
            return false;
        }

        if (is_callable($defaults[$target])) {
            return $defaults[$target]($obj);
        }

        return $defaults[$target];
    }

    public function get_dc_value($target, $dynamic_content, $context_loop, $defaults, $result)
    {
        $context_loop_status = isset($context_loop['cl-status']) ? $context_loop['cl-status'] : false;

        $dc_value = isset($dynamic_content['dc-' . $target]) ? $dynamic_content['dc-' . $target] : null;
        $context_loop_value = isset($context_loop['cl-' . $target]) ? $context_loop['cl-' . $target] : null;

        if ($target === 'status') {
            return $dc_value !== null ? $dc_value : $this->get_default_dc_value($target, $result, $defaults);
        }

        if ($dc_value !== null) {
            return $dc_value;
        }

        if ($context_loop_status && $context_loop_value !== null) {
            return $context_loop_value;
        }

        return $this->get_default_dc_value($target, $result, $defaults);
    }

    public function order_callback($attributes)
    {
        $dictionary = [
            'by-date' => 'desc',
            'alphabetical' => 'asc',
        ];

        $relation = $attributes['dc-relation'] ?? null;

        if (in_array($relation, self::$order_by_relations)) {
            if (isset($attributes['dc-order-by'])) {
                return $dictionary[$attributes['dc-order-by']];
            }

            return $dictionary['by-date'];
        }

        return array_key_exists($relation, $dictionary) ? $dictionary[$relation] : null;
    }

    /**
     * Combines `attributes` with `context_loop` and `defaults`
     * to get the final values for dynamic content.
     */
    public function get_dc_values($attributes, $context_loop)
    {
        $defaults = [
            'status' => false,
            'type' => 'posts',
            'relation' => 'by-id',
            'order' => [$this, 'order_callback'],
            'accumulator' => 0,
        ];

        $dynamic_content = array_filter($attributes, function ($key) {
            return strpos($key, 'dc-') === 0;
        }, ARRAY_FILTER_USE_KEY);

        $dynamic_content_keys = array_keys($dynamic_content);
        $context_loop_keys = array_map(function ($key) {
            return str_replace('cl-', 'dc-', $key);
        }, array_keys($context_loop));
        $defaults_keys = array_map(function ($key) {
            return 'dc-' . $key;
        }, array_keys($defaults));

        $values_keys = array_merge($dynamic_content_keys, $context_loop_keys, $defaults_keys);

        $result = [];

        foreach ($values_keys as $key) {
            $target = str_replace('dc-', '', $key);
            $dc_value = $this->get_dc_value($target, $dynamic_content, $context_loop, $defaults, $result);
            $result[$key] = $dc_value;
        }

        return $result;
    }

    public function get_order_by_args($relation, $order_by, $order, $accumulator, $type, $id)
    {
        if ($type === 'users') {
            $order_by_arg = $relation === 'by-date' ? 'user_registered' : 'display_name';
            $limit_key = 'number';
        } else {
            $dictionary = [
                'by-date' => 'date',
                'alphabetical' => 'title',
            ];


            if(in_array($relation, self::$order_by_relations)) {
                $order_by_arg = $dictionary[$order_by];
            } else {
                $order_by_arg = $dictionary[$relation];
            }

            $limit_key = 'posts_per_page';
        }

        $args = [
            'orderby' => $order_by_arg,
            'order' => $order,
            $limit_key => $accumulator + 1,
        ];

        if($relation === 'by-category') {
            $args['cat'] = $id;
        } elseif($relation === 'by-author') {
            $args['author'] = $id;
        } elseif($relation === 'by-tag') {
            $args['tag_id'] = $id;
        }

        return $args;
    }

    /**
    * Return DC and CL
    *
    * @param string $unique_id
    */
    public function get_dc_cl(string $id)
    {
        global $wpdb;

        $block_meta = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT custom_data_value FROM {$wpdb->prefix}maxi_blocks_custom_data_blocks WHERE block_style_id = %s",
                $id
            )
        );

        if (!empty($block_meta)) {
            $block_meta_parsed = json_decode($block_meta, true);
            $response = $block_meta_parsed['dynamic_content'] ?? [];
            return $response;
        }
    }

}
