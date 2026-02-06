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
    private static $order_by_relations = [
        'by-category',
        'by-author',
        'by-tag',
        'current-archive',
    ];
    private static $ignore_empty_fields = ['avatar', 'author_avatar'];

    private static $global_dc_accumulator_cl = null;
    private static $global_dc_id_cl = null;

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

    private $is_empty = false;

    private static $session_seed;
    private static $shuffled_posts = [];

    /**
     * Initializes the plugin and its hooks.
     */
    public static function register()
    {
        if (is_null(self::$instance)) {
            self::$instance = new self();
        }
    }

    public static function generate_session_seed()
    {
        $transient_key = 'maxi_blocks_random_seed_' . session_id();
        self::$session_seed = get_transient($transient_key);
        if (self::$session_seed === false) {
            self::$session_seed = random_int(PHP_INT_MIN, PHP_INT_MAX);
            set_transient($transient_key, self::$session_seed, DAY_IN_SECONDS);
        }
    }

    /**
     * Constructor: empty
     */
    public function __construct()
    {
        self::generate_session_seed();
    }

    /**
     * Extracts the last closing HTML tag from the given content.
     *
     * This function searches for the last occurrence of a closing HTML tag
     * within the provided string. If no valid closing tag is found, an empty
     * string is returned.
     *
     * @param string $content The HTML content to search within.
     * @return string The last closing HTML tag, or an empty string if none found.
     */
    public function get_last_closing_tag($content)
    {
        // Reverse the content to find the last closing tag from the end more easily
        $reversedContent = strrev($content);

        // Look for the first occurrence of a reversed closing tag
        if (
            preg_match('/>([a-zA-Z]+)\/</', $reversedContent, $reversedMatches)
        ) {
            // Reverse the tag name back to normal
            $tagName = strrev($reversedMatches[1]);
            // Construct the closing tag correctly
            $closingTag = '</' . $tagName . '>';

            // Return the constructed closing tag
            return $closingTag;
        }

        // Return an empty string if no valid closing tag is found
        return '';
    }

    /**
     * Extracts the value of the first 'id' attribute found in the given content.
     *
     * This function searches the provided string for an 'id' attribute and returns
     * its value. The search is case-insensitive and returns the value of the first
     * 'id' attribute it finds. If no 'id' attribute is found, an empty string is returned.
     *
     * @param string $content The content to search for an 'id' attribute.
     * @return string The value of the first 'id' attribute found, or an empty string if none is found.
     */
    public function get_first_id_value($content)
    {
        // Define the regex pattern to match an 'id' attribute
        $pattern = '/id="([^"]+)"/i';

        // Use preg_match to search for the pattern in the content
        if (preg_match($pattern, $content, $matches)) {
            // If a match is found, return the captured value of the 'id' attribute
            return $matches[1];
        } else {
            // If no match is found, return an empty string
            return '';
        }
    }

    /**
     * Retrieves the total number of users on the site.
     *
     * This function returns the count of all users registered on the site, regardless of their role or status.
     *
     * @return int The total number of registered users on the site.
     */
    public function get_total_users()
    {
        $user_count_data = count_users();
        $total_users = $user_count_data['total_users'];

        return $total_users;
    }

    /**
     * Retrieves the total number of posts for a given relation and identifier.
     *
     * This function allows for counting posts, pages, products, or any custom post type
     * based on a specified relation (e.g., category, tag, author) and an identifier.
     * It supports different types of relations and adjusts the query accordingly to
     * ensure only published items are counted.
     *
     * @param string $relation The type of relation to filter by ('by-category', 'by-tag', 'by-author').
     * @param int|string $id The identifier for the relation (e.g., category ID, tag ID, author ID).
     * @param string $type Optional. The type of post to count. Defaults to 'post'.
     * @return int The total number of items found matching the criteria.
     * @throws Exception If the provided relation is not supported for the given post type.
     */
    public function get_total_posts_by_relation(
        $relation,
        $id,
        $type = 'post',
        $limit_by_archive = null
    ) {
        // Initialize the query args array
        $args = [
            'post_type' => $type, // Can be 'post', 'page', 'product', or any custom post type
            'post_status' => $type === 'attachment' ? 'inherit' : 'publish', // Only count published items
            'fields' => 'ids', // Retrieve only the IDs for performance
            'nopaging' => true, // Retrieve all items matching the criteria
        ];

        if ($relation === 'current-archive') {
            $archive_info = $this->get_current_archive_type_and_id();

            switch ($archive_info['type']) {
                case 'category':
                    $args['cat'] = $archive_info['id']; // Array of category IDs
                    break;
                case 'tag':
                    $args['tag__in'] = [$archive_info['id']]; // Array of tag IDs
                    break;
                case 'author':
                    if ($type === 'attachment') {
                        // Ensure correct post_status is set for attachments
                        $args['post_status'] = 'inherit';
                    }
                    $args['author'] = $archive_info['id']; // Author ID
                    break;
                case 'date':
                    // For date archives, you might need to decompose the ID back into components
                    $date_parts = explode('-', $archive_info['id']);
                    $args['date_query'] = [
                        [
                            'year' => $date_parts[0] ?? null,
                            'month' => $date_parts[1] ?? null,
                            'day' => $date_parts[2] ?? null,
                        ],
                    ];
                    break;
                default: $args = $archive_info;
            }
        } else {
            // Modify the query based on the relation
            switch ($relation) {
                case 'by-category':
                    if ($type === 'product') {
                        // Use WooCommerce's product category taxonomy
                        $args['tax_query'] = [
                            [
                                'taxonomy' => 'product_cat',
                                'field' => 'term_id',
                                'terms' => [$id],
                            ],
                        ];
                    } elseif ($type === 'post') {
                        $args['cat'] = $id; // Array of category IDs
                    } else {
                        error_log(
                            __('Categories are not associated with this post type.', 'maxi-blocks'),
                        );
                    }
                    break;
                case 'by-tag':
                    if ($type === 'product') {
                        // Use WooCommerce's product tag taxonomy
                        $args['tax_query'] = [
                            [
                                'taxonomy' => 'product_tag',
                                'field' => 'term_id',
                                'terms' => [$id],
                            ],
                        ];
                    } elseif ($type === 'post') {
                        $args['tag__in'] = [$id]; // Array of tag IDs
                    } else {
                        error_log(
                            __('Tags are not associated with this post type.', 'maxi-blocks'),
                        );
                    }
                    break;
                case 'by-author':
                    if ($type === 'attachment') {
                        // Ensure correct post_status is set for attachments
                        $args['post_status'] = 'inherit';
                    }
                    // Author queries can be performed on posts, pages, attachments and products
                    $args['author'] = $id; // Author ID
                    break;
                    // Detect the type of current archive and adjust $args accordingly
                    if (is_category()) {
                        $args['category__in'] = [$id]; // Array of category IDs
                    } elseif (is_tag()) {
                        $args['tag__in'] = [$id]; // Array of tag IDs
                    } elseif (is_author()) {
                        if ($type === 'attachment') {
                            // Ensure correct post_status is set for attachments
                            $args['post_status'] = 'inherit';
                        }
                        $args['author'] = $id; // Author ID
                    } elseif (is_date()) {
                        // For date archives, $id needs to be processed differently
                        // You might pass $id as a date range or specific date components
                        // Here's a simplified example assuming $id is a year
                        $args['date_query'] = [
                            [
                                'year' => $id,
                            ],
                        ];
                    } else {
                        error_log(__('Unsupported archive type.', 'maxi-blocks'));
                    }
                    break;
            }
            if (strpos($relation, 'custom-taxonomy') !== false) {
                $relationParts = explode('-', $relation);
                $customTaxonomy = implode('-', array_slice($relationParts, 3));
                $args['tax_query'] = [
                    [
                        'taxonomy' => $customTaxonomy,
                        'field' => 'term_id',
                        'terms' => [$id],
                    ],
                ];
            }
        }

        // Apply current archive filtering if limit_by_archive is 'yes'
        if ($limit_by_archive === 'yes' && $relation !== 'current-archive') {
            $current_archive_info = $this->get_current_archive_type_and_id();

            if (!empty($current_archive_info['type']) && !empty($current_archive_info['id'])) {
                // Add archive constraints to the query
                $additional_constraints = [];

                switch ($current_archive_info['type']) {
                    case 'category':
                        if ($type === 'product') {
                            // For WooCommerce products, use product_cat taxonomy
                            $additional_constraints['tax_query'] = [
                                [
                                    'taxonomy' => 'product_cat',
                                    'field' => 'term_id',
                                    'terms' => [$current_archive_info['id']],
                                ],
                            ];
                        } else {
                            // For regular posts, use category constraint
                            $additional_constraints['cat'] = $current_archive_info['id'];
                        }
                        break;
                    case 'tag':
                        if ($type === 'product') {
                            // For WooCommerce products, use product_tag taxonomy
                            $additional_constraints['tax_query'] = [
                                [
                                    'taxonomy' => 'product_tag',
                                    'field' => 'term_id',
                                    'terms' => [$current_archive_info['id']],
                                ],
                            ];
                        } else {
                            // For regular posts, use tag constraint
                            $additional_constraints['tag__in'] = [$current_archive_info['id']];
                        }
                        break;
                    case 'author':
                        if ($type === 'attachment') {
                            $additional_constraints['post_status'] = 'inherit';
                        }
                        $additional_constraints['author'] = $current_archive_info['id'];
                        break;
                    case 'date':
                        // Parse the date ID format (YYYY or YYYY-MM or YYYY-MM-DD)
                        $date_parts = explode('-', $current_archive_info['id']);
                        $additional_constraints['date_query'] = [
                            'inclusive' => true,
                        ];
                        if (isset($date_parts[0])) {
                            $additional_constraints['date_query']['year'] = intval($date_parts[0]);
                        }
                        if (isset($date_parts[1])) {
                            $additional_constraints['date_query']['month'] = intval($date_parts[1]);
                        }
                        if (isset($date_parts[2])) {
                            $additional_constraints['date_query']['day'] = intval($date_parts[2]);
                        }
                        break;
                }

                // Handle custom taxonomy archives
                if (isset($current_archive_info['tax_query'])) {
                    $additional_constraints['tax_query'] = $current_archive_info['tax_query'];
                }

                // Merge the additional constraints with existing args
                foreach ($additional_constraints as $key => $value) {
                    if ($key === 'tax_query') {
                        // Handle tax_query merging specially
                        if (isset($args['tax_query'])) {
                            // If we already have a tax_query, combine them with 'AND' relation
                            $args['tax_query'] = [
                                'relation' => 'AND',
                                $args['tax_query'][0], // Existing tax query
                                $value[0], // New archive constraint
                            ];
                        } else {
                            // No existing tax_query, just set it
                            $args['tax_query'] = $value;
                        }
                    } elseif ($key === 'date_query') {
                        // Handle date_query merging
                        if (isset($args['date_query'])) {
                            // Merge date queries with 'AND' relation
                            $args['date_query'] = [
                                'relation' => 'AND',
                                $args['date_query'],
                                $value,
                            ];
                        } else {
                            $args['date_query'] = $value;
                        }
                    } else {
                        // For other constraints, just set them (they should not conflict)
                        $args[$key] = $value;
                    }
                }
            }
        }

        // Create a new WP_Query instance
        $query = new WP_Query($args);

        // Return the total number of posts/pages/products found
        return $query->found_posts;
    }

    /**
     * Generates HTML content for pagination links based on the given criteria.
     *
     * This function creates pagination links for navigating through a list of posts,
     * pages, products, or any custom post type. It supports pagination based on categories,
     * tags, authors, or other specified relations. The function dynamically calculates
     * the total number of pages and generates previous, next, and specific page number
     * links according to the current page and total items.
     *
     * @param array $cl An array containing pagination and content-related parameters.
     * @param string $pagination_anchor An anchor tag to append to pagination links for scroll position adjustment.
     * @return string HTML content for the pagination links.
     */
    public function get_pagination_content($cl, $pagination_anchor)
    {
        if (empty($cl) || !is_array($cl)) {
            return '';
        }

        @[
            'cl-pagination-previous-text' => $cl_prev_text,
            'cl-pagination-next-text' => $cl_next_text,
            'cl-pagination-show-page-list' => $cl_show_page_list,
            'cl-pagination-per-page' => $cl_pagination_per_page,
            'cl-pagination-total' => $cl_pagination_total,
            'cl-pagination-total-all' => $cl_pagination_total_all,
            'cl-relation' => $cl_relation,
            'cl-id' => $cl_id,
            'cl-type' => $cl_type,
            'cl-limit-by-archive' => $cl_limit_by_archive,
        ] = $cl + ['cl-pagination-per-page' => 3];

        if (!isset($cl_id) || !isset($cl_relation)) {
            return '';
        }

        $pagination_total = $cl_pagination_total;

        // Determine the content type
        $type = match ($cl_type) {
            'pages' => 'page',
            'products' => 'product',
            'media' => 'attachment',
            'users' => 'users',
            default => $cl_type === 'posts' || $cl_type === null
                ? 'post'
                : $cl_type,
        };

        // Update total count if necessary
        if ($cl_pagination_total_all) {
            if ($type === 'users') {
                // If the type is 'users', get the total number of users
                $pagination_total = $this->get_total_users();
            } else {
                $pagination_total = $this->get_total_posts_by_relation(
                    $cl_relation,
                    $cl_id,
                    $type,
                    $cl_limit_by_archive,
                );
            }
        }

        $max_page = (int) ceil($pagination_total / $cl_pagination_per_page);

        // If there is only one page, return an empty string
        if ($max_page <= 1) {
            return '';
        }

        // Safely determine the current page, defaulting to 1 if 'cl-page' is not set or is invalid
        $pagination_page = max(1, absint($_GET['cl-page'] ?? 1));

        // Calculate next and previous page numbers
        $pagination_page_next = $pagination_page + 1;
        $pagination_page_prev = $pagination_page - 1;

        // Build the current URL without query parameters
        $current_url_protocol =
            isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on'
                ? 'https'
                : 'http';
        $current_url = esc_url(
            $current_url_protocol .
                "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]",
        );

        // Initialize an array to hold query parameters
        $current_query_params = [];

        // Extract the query string from the current URL and parse it if not null
        $query_string = wp_parse_url($current_url, PHP_URL_QUERY) ?? '';
        parse_str($query_string, $current_query_params);

        // Start building the pagination HTML content
        $content = '<div class="maxi-pagination">';

        // Previous link
        $content .= $this->build_pagination_link(
            $pagination_page_prev,
            $cl_prev_text,
            $current_url,
            $current_query_params,
            $pagination_anchor,
            'prev',
            $max_page,
        );

        // Page list
        if ($cl_show_page_list) {
            $content .= $this->build_page_list(
                $pagination_page,
                $pagination_total,
                $cl_pagination_per_page,
                $current_url,
                $current_query_params,
                $pagination_anchor,
            );
        }

        // Next link
        $content .= $this->build_pagination_link(
            $pagination_page_next,
            $cl_next_text,
            $current_url,
            $current_query_params,
            $pagination_anchor,
            'next',
            $max_page,
        );

        $content .= '</div>'; // Closing maxi-pagination div

        return $content;
    }

    /**
     * Helper method to build individual pagination links.
     *
     * @param int $page The page number for the link.
     * @param string $text The text to display inside the link.
     * @param string $base_url The base URL to which the query string will be appended.
     * @param array $query_params Current set of query parameters.
     * @param string $anchor The anchor tag to append to the link.
     * @param string $type 'prev' or 'next' to determine if additional conditions are needed.
     * @param float|int $max_page Optional. The maximum page number for 'next' link type.
     * @return string HTML content for a single pagination link.
     */
    private function build_pagination_link(
        $page,
        $text,
        $base_url,
        &$query_params,
        $anchor,
        $type,
        $max_page = PHP_INT_MAX
    ) {
        if (
            ($type === 'prev' && $page > 0) ||
            ($type === 'next' && $page <= $max_page)
        ) {
            $query_params['cl-page'] = $page;
            $link =
                strtok($base_url, '?') .
                '?' .
                http_build_query($query_params) .
                '#' .
                urlencode($anchor); // Safe URL construction
            $escaped_link = esc_url($link); // Escaping the URL for HTML output
            $escaped_text = esc_html($text); // Escaping the text for HTML content
            return sprintf(
                '<div class="maxi-pagination__%s"><a href="%s" class="maxi-pagination__link"><span class="maxi-pagination__text">%s</span></a></div>',
                $type,
                $escaped_link,
                $escaped_text,
            );
        }
        return sprintf('<div class="maxi-pagination__%s"></div>', $type);
    }

    /**
     * Builds the HTML content for the list of page numbers, including handling for
     * large number of pages with ellipses for skipped sections.
     *
     * @param int $current_page The current page number being viewed.
     * @param int $total_items The total number of items to paginate over.
     * @param int $items_per_page The number of items shown per page.
     * @param string $base_url The base URL to which the pagination query will be appended.
     * @param array $query_params An array of current query parameters to preserve in pagination links.
     * @param string $anchor An HTML anchor to append to pagination links for anchor navigation.
     * @return string The generated HTML content for the pagination page list.
     */
    private function build_page_list(
        $current_page,
        $total_items,
        $items_per_page,
        $base_url,
        &$query_params,
        $anchor
    ) {
        // Determine the total number of pages
        $total_pages = (int) ceil($total_items / $items_per_page);
        if ($total_pages <= 1) {
            return '';
        }

        // Start building the page list HTML
        $page_list_html = '<div class="maxi-pagination__pages">';

        // Define the range of pages to display near the current page
        $range = 2; // This defines how many pages to show around the current page

        // Calculate the range of pages to show
        $initial_pages = max(1, $current_page - $range);
        $final_pages = min($total_pages, $current_page + $range);

        // Show the first page and ellipses if necessary
        if ($initial_pages > 1) {
            $page_list_html .= $this->generate_page_link(
                1,
                $base_url,
                $query_params,
                $anchor,
            );
            if ($initial_pages > 2) {
                $page_list_html .=
                    '<span class="maxi-pagination__text">...</span>';
            }
        }

        // Generate links for the range around the current page
        for ($page = $initial_pages; $page <= $final_pages; $page++) {
            $page_list_html .= $this->generate_page_link(
                $page,
                $base_url,
                $query_params,
                $anchor,
                $current_page,
            );
        }

        // Show the last page and ellipses if necessary
        if ($final_pages < $total_pages) {
            if ($final_pages < $total_pages - 1) {
                $page_list_html .=
                    '<span class="maxi-pagination__text">...</span>';
            }
            $page_list_html .= $this->generate_page_link(
                $total_pages,
                $base_url,
                $query_params,
                $anchor,
            );
        }

        $page_list_html .= '</div>'; // Close the page list container

        return $page_list_html;
    }

    /**
     * Generates an individual page link or a current page span.
     *
     * @param int $page The page number for the link.
     * @param string $base_url The base URL for the link.
     * @param array $query_params The query parameters to include in the link.
     * @param string $anchor The anchor tag to append to the link.
     * @param int|null $current_page The current page number, if generating a current page span.
     * @return string The HTML string for a page link or a current page span.
     */
    private function generate_page_link(
        $page,
        $base_url,
        &$query_params,
        $anchor,
        $current_page = null
    ) {
        $query_params['cl-page'] = $page;
        $url =
            strtok($base_url, '?') .
            '?' .
            http_build_query($query_params) .
            '#' .
            urlencode($anchor);
        $escaped_url = esc_url($url); // Escape the URL for HTML output

        if ($page === $current_page) {
            // Use esc_html() to escape the page number for safe HTML display
            return "<span class=\"maxi-pagination__link maxi-pagination__link--current\">" .
                esc_html($page) .
                '</span>';
        } else {
            // Use esc_url() for the href attribute and esc_html() for the page number
            return "<a href=\"" .
                $escaped_url .
                "\" class=\"maxi-pagination__link\"><span class=\"maxi-pagination__text\">" .
                esc_html($page) .
                '</span></a>';
        }
    }

    /**
     * Modifies the provided content by appending pagination controls.
     *
     * This function checks the provided attributes for pagination settings, and if
     * pagination is enabled, it dynamically generates pagination links based on
     * the content's unique identifier. It then inserts these links into the content
     * string before the last closing tag.
     *
     * @param array $attributes Associative array of attributes that may enable pagination and provide necessary identifiers.
     * @param string $content The original content to which pagination might be added.
     * @return string The modified content with pagination added, or the original content if pagination is not enabled.
     */
    public function render_pagination($attributes, $content)
    {
        // Check if pagination is enabled in the attributes
        if (
            !array_key_exists('cl-pagination', $attributes) ||
            !$attributes['cl-pagination']
        ) {
            return $content;
        }

        // Extract the unique ID and check its format
        $unique_id = $attributes['uniqueID'] ?? '';
        if (str_ends_with($unique_id, '-u')) {
            try {
                // Retrieve configuration list (cl) for the unique ID
                $cl = $this->get_cl($unique_id);

                // Extract the last closing tag and the first ID value for the pagination anchor
                $last_tag = $this->get_last_closing_tag($content);

                $pagination_anchor = $this->get_first_id_value($content);

                // Generate pagination content based on the cl settings and the anchor
                $pagination_content = $this->get_pagination_content(
                    $cl,
                    $pagination_anchor,
                );

                // Insert the pagination content before the last closing tag of the original content
                $content_before_last_tag = substr(
                    $content,
                    0,
                    strrpos($content, '<'),
                );
                $modified_content =
                    $content_before_last_tag . $pagination_content . $last_tag;

                return $modified_content;
            } catch (Exception $e) {
                // Log any exceptions and return the unmodified content
                error_log(
                    __('Error in render_pagination for uniqueID ', 'maxi-blocks') .
                        $unique_id .
                        ': ' .
                        $e->getMessage(),
                );
                return $content;
            }
        }

        // Return the original content if the unique ID doesn't end with '-u'
        return $content;
    }

    private function check_inner_blocks($block, $attributes, $content)
    {
        // Recursively check inner blocks
        $content = $this->recursive_check($block, $attributes, $content);
        return $content;
    }

    private function recursive_check($block, $attributes, $content)
    {
        if (isset($block->inner_blocks) && !empty($block->inner_blocks)) {
            foreach ($block->inner_blocks as $inner_block) {
                // Access the attributes of the inner block
                $inner_block_attributes = $inner_block->attributes;

                // Check if the inner block has dc-status set to true
                if (
                    isset($inner_block_attributes['dc-status']) &&
                    $inner_block_attributes['dc-status']
                ) {
                    $content = self::render_dc_classes($attributes, $content);
                    break;
                }

                // Recursively check the inner blocks of the current inner block
                $content = $this->recursive_check(
                    $inner_block,
                    $inner_block_attributes,
                    $content,
                );
            }
        }

        return $content;
    }

    public function render_dc($attributes, $content, $block)
    {
        if (
            !array_key_exists('dc-status', $attributes) &&
            !array_key_exists('background-layers', $attributes) &&
            !array_key_exists('background-layers-hover', $attributes)
        ) {
            if (isset($block->inner_blocks) && !empty($block->inner_blocks)) {
                $content = $this->check_inner_blocks(
                    $block,
                    $attributes,
                    $content,
                );
            }

            if (
                array_key_exists('cl-pagination', $attributes) &&
                $attributes['cl-pagination']
            ) {
                $content = self::render_dc_classes($attributes, $content);
                return $this->render_pagination($attributes, $content);
            }
            return $content;
        }

        $pagination_page = 1;
        if (isset($_GET['cl-page'])) {
            $pagination_page = absint($_GET['cl-page']);
        }

        $unique_id = $attributes['uniqueID'];
        $is_template = is_string($unique_id) && strpos($unique_id, '-template');

        if (strpos($unique_id, 'container-maxi') !== false) {
            self::$global_dc_id_cl = null;
            self::$global_dc_accumulator_cl = null;
        }

        if (str_ends_with($unique_id, '-u')) {
            $block_name = substr($unique_id, 0, -2);
            $block_name = substr($block_name, 0, strrpos($block_name, '-'));
        } else {
            $block_name = substr($unique_id, 0, strrpos($unique_id, '-'));
        }

        if (str_ends_with($unique_id, '-u')) {
            self::$custom_data = $this->get_dc_cl($unique_id);
        } elseif (self::$custom_data === null) {
            if (class_exists('MaxiBlocks_Styles')) {
                $styles = new MaxiBlocks_Styles();
                self::$custom_data = $styles->custom_meta(
                    'dynamic_content',
                    $is_template,
                );
            } else {
                self::$custom_data = [];
            }
        }

        $context_loop = [];

        if (
            is_array(self::$custom_data) &&
            array_key_exists($unique_id, self::$custom_data)
        ) {
            $context_loop = self::$custom_data[$unique_id];
            $accumulator = $context_loop['cl-accumulator'];
            if (isset($_GET['cl-page'])) {
                $cl_pagination_per_page =
                    $context_loop['cl-pagination-per-page'] ?? 3;
                $context_loop['cl-accumulator'] =
                    $accumulator +
                    intval($cl_pagination_per_page) *
                        (intval($pagination_page) - 1);
            }
        }

        $content = self::render_dc_background(
            $attributes,
            $content,
            $context_loop,
        );

        if (
            !array_key_exists('dc-status', $attributes) ||
            !$attributes['dc-status']
        ) {
            $content = $this->check_inner_blocks($block, $attributes, $content);
            return $content;
        }

        $attributes = array_merge(
            $attributes,
            $this->get_dc_values($attributes, $context_loop),
        );

        if (array_key_exists('dc-link-status', $attributes)) {
            $dc_link_status = $attributes['dc-link-status'];

            if ($dc_link_status) {
                $content = self::render_dc_link($attributes, $content);
            }
        }

        if ($is_template) {
            $block_name = substr($block_name, 0, strrpos($block_name, '-'));
        }

        if (in_array($block_name, self::$link_only_blocks)) {
            return $content;
        } elseif ($block_name !== 'image-maxi') {
            $content = self::render_dc_content($attributes, $content, $block_name);
        } else {
            $content = self::render_dc_image($attributes, $content);
        }

        $content = self::render_dc_classes($attributes, $content);
        $content = str_replace('$link-to-replace', '', $content);

        return $content;
    }

    public function render_dc_background($attributes, $content, $context_loop)
    {
        @[
            'background-layers' => $background_layers,
            'background-layers-hover' => $background_layers_hover,
        ] = $attributes;

        foreach ([$background_layers, $background_layers_hover] as $layers) {
            if (!is_array($layers)) {
                continue;
            }

            foreach ($layers as $layer) {
                // Add defensive check to ensure $layer is an array before using array_key_exists
                if (!is_array($layer)) {
                    // Continue processing
                    continue;
                }

                if (
                    array_key_exists('dc-status', $layer) &&
                    $layer['dc-status'] &&
                    array_key_exists('type', $layer) &&
                    $layer['type'] === 'image'
                ) {
                    $layer = array_merge(
                        $layer,
                        $this->get_dc_values($layer, $context_loop),
                    );

                    $content = self::render_dc_image($layer, $content, true);
                }
            }
        }

        return $content;
    }

    public function render_dc_link($attributes, $content)
    {
        @[
            'dc-accumulator' => $dc_accumulator,
            'linkSettings' => $linkSettings,
        ] = $attributes;

        $post = self::get_post($attributes);

        if (!empty($post)) {
            $is_product =
                $attributes['dc-type'] === 'products' ||
                $attributes['dc-type'] === 'cart';
            $item_id = $is_product && method_exists($post, 'get_id') ? $post->get_id() : $post->ID;
            if ($this->is_repeated_post($item_id, $dc_accumulator)) {
                return '';
            }
        }

        if (isset($linkSettings)) {
            if (isset($linkSettings['title']) && isset($linkSettings['url'])) {
                if ($linkSettings['title'] === $linkSettings['url']) {
                    $content = str_replace(
                        'title="' . $linkSettings['title'] . '"',
                        'title="$link-to-replace"',
                        $content,
                    );
                }
            }
        }

        if (
            (!array_key_exists('dc-link-target', $attributes) || (array_key_exists('dc-field', $attributes) && $attributes['dc-field'] !== 'author_avatar')) &&
            array_key_exists('dc-link-target', $attributes) &&
            str_contains($attributes['dc-link-target'], 'author') &&
            $attributes['dc-type'] !== 'users'
        ) {
            if (empty($post) || !isset($post->post_author) || !isset($attributes['dc-field'])) {
                $link = '';
            } else {
                $link = self::get_field_link(
                    $post->post_author,
                    $attributes['dc-field'],
                    $attributes['dc-link-target'],
                );
            }
        } elseif (
            array_key_exists('dc-type', $attributes) &&
            $attributes['dc-type'] === 'settings'
        ) {
            $link = get_home_url();
        } elseif (
            array_key_exists('dc-type', $attributes) &&
            in_array(
                $attributes['dc-type'],
                array_merge(
                    ['categories', 'tags'],
                    $this->get_custom_taxonomies(),
                ),
            )
        ) {
            if (
                $this->is_repeated_post($attributes['dc-id'], $dc_accumulator)
            ) {
                return '';
            }
            $link = get_term_link($attributes['dc-id']);
        } elseif (
            in_array($attributes['dc-type'] ?? '', ['users']) && isset($attributes['dc-link-target'])
        ) {
            $dc_link_target = $attributes['dc-link-target'];
            $author_id = $post->ID;
            if (!empty($post) && isset($author_id)) {
                switch ($dc_link_target) {
                    case 'author_email':
                        $email = sanitize_email(get_the_author_meta('user_email', $author_id));
                        $link = $this->xor_obfuscate_email($email);
                        break;
                    case 'author_site':
                        $link = get_the_author_meta('user_url', $author_id);
                        break;
                    default:
                        $link = get_author_posts_url($author_id);
                }
            }
        } elseif (
            array_key_exists('dc-type', $attributes) &&
            $attributes['dc-type'] === 'products'
        ) {
            if (
                empty($post) ||
                (isset($attributes['dc-id']) &&
                    $this->is_repeated_post(
                        method_exists($post, 'get_id') ? $post->get_id() : $post->ID,
                        $dc_accumulator,
                    ))
            ) {
                return '';
            }
            if (
                array_key_exists('dc-link-target', $attributes) &&
                $attributes['dc-link-target'] === 'add_to_cart'
            ) {
                $link = method_exists($post, 'add_to_cart_url') ? $post->add_to_cart_url() : get_permalink(method_exists($post, 'get_id') ? $post->get_id() : $post->ID);
            } else {
                $link = get_permalink(method_exists($post, 'get_id') ? $post->get_id() : $post->ID);
            }
        } elseif (
            array_key_exists('dc-type', $attributes) &&
            $attributes['dc-type'] === 'cart'
        ) {
            if (
                $this->is_repeated_post($attributes['dc-id'], $dc_accumulator)
            ) {
                return '';
            }
            $link = wc_get_cart_url();
        } elseif (array_key_exists('dc-field', $attributes) && $attributes['dc-field'] === 'author_avatar' && array_key_exists('dc-link-target', $attributes) && str_contains($attributes['dc-link-target'], 'author')) {
            $dc_link_target = $attributes['dc-link-target'];
            if (array_key_exists('dc-relation', $attributes) && $attributes['dc-relation'] === 'current') {
                $post_id = get_queried_object_id();
            } else {
                $post_id = $attributes['dc-id'] ?? $post->ID;
            }
            $author_id = get_post_field('post_author', $post_id);
            if (!empty($post) && isset($author_id)) {
                switch ($dc_link_target) {
                    case 'author_email':
                        $email = sanitize_email(get_the_author_meta('user_email', $author_id));
                        $link = $this->xor_obfuscate_email($email);
                        break;
                    case 'author_site':
                        $link = get_the_author_meta('user_url', $author_id);
                        break;
                    default:
                        $link = get_author_posts_url($author_id);
                }
            }
        } else {
            if (empty($post)) {
                return $content;
            }
            if ($this->is_repeated_post($post->ID, $dc_accumulator)) {
                return '';
            }

            $link = get_permalink($post->ID);
        }

        if (gettype($link) === 'string') {
            $content = str_replace('$link-to-replace', $link, $content);
        }

        if (isset($attributes['dc-link-target']) && $attributes['dc-link-target'] === 'author_email') {
            $content = preg_replace('/\s*url="[^"]*?"/', '', $content);
        }

        return $content;
    }

    public function render_dc_content($attributes, $content, $block_name)
    {
        @[
            'dc-source' => $dc_source,
            'dc-type' => $dc_type,
            'dc-relation' => $dc_relation,
            'dc-field' => $dc_field,
            'dc-link-status' => $dc_link_status,
            'dc-link-target' => $dc_link_target,
            'dc-accumulator' => $dc_accumulator,
            'dc-sub-field' => $dc_sub_field,
        ] = $attributes;
        if (!isset($dc_field) || $dc_field === 'static_text' || $dc_sub_field === 'static_text') {
            $post = $this->get_post($attributes);

            if (!empty($post)) {
                $is_product =
                    $attributes['dc-type'] === 'products' ||
                    $attributes['dc-type'] === 'cart';
                $item_id = $is_product ? (method_exists($post, 'get_id') ? $post->get_id() : $post->ID) : $post->ID;

                if ($this->is_repeated_post($item_id, $dc_accumulator)) {
                    return '';
                }
            }
            if (empty($post) && $dc_type === 'posts') {
                return '';
            }
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
        } elseif (
            in_array(
                $dc_type,
                array_merge(['posts', 'pages'], $this->get_custom_post_types()),
            )
        ) {
            // Post or page
            $response = self::get_post_or_page_content($attributes, $block_name);
        } elseif ($dc_type === 'settings') {
            // Site settings
            $response = self::get_site_content($dc_field);
        } elseif ($dc_type === 'media') {
            $response = self::get_media_content($attributes);
        } elseif (
            in_array(
                $dc_type,
                array_merge(
                    [
                        'categories',
                        'tags',
                        'product_categories',
                        'product_tags',
                        'archive',
                    ],
                    $this->get_custom_taxonomies(),
                ),
            )
        ) {
            $response = self::get_taxonomy_content($attributes);
        } elseif ($dc_type === 'users') {
            $response = self::get_user_content($attributes);
        } elseif ($dc_type === 'products') {
            $response = self::get_product_content($attributes, $block_name);
        } elseif ($dc_type === 'cart') {
            $response = self::get_cart_content($attributes);
        }

        if ($dc_field === 'date' && $response !== '') {
            $response = self::get_date($response, $attributes);
        }

        if ($dc_field === 'archive-type' && $dc_type !== 'users') {
            if (is_author()) {
                $response = __('author', 'maxi-blocks');
            } elseif (is_date()) {
                $response = __('date', 'maxi-blocks');
            } else {
                $queried_object = get_queried_object();
                if (
                    $queried_object !== null &&
                    isset($queried_object->taxonomy)
                ) {
                    $response = $queried_object->taxonomy;
                    $response = preg_replace('/^post_/', '', $response);
                }
            }
        }

        if (empty($response) && $response !== '0') {
            $this->is_empty = true;
            $response = 'No content found';
        }

        if (
            $dc_link_status &&
            in_array(
                $dc_link_target,
                array_merge(
                    ['categories', 'tags'],
                    $this->get_custom_taxonomies(),
                ),
            )
        ) {
            $content = preg_replace(
                '/<a[^>]+class="maxi-link-wrapper"[^>]*>/',
                '',
                $content,
                1,
            );
            $content = str_replace('$text-to-replace', $response, $content);

            return $content;
        }

        $content = str_replace('$text-to-replace', $response, $content);

        return $content;
    }

    public function render_dc_image(
        $attributes,
        $content,
        $is_background = false
    ) {
        @[
            'dc-source' => $dc_source,
            'dc-type' => $dc_type,
            'dc-relation' => $dc_relation,
            'dc-id' => $dc_id,
            'dc-field' => $dc_field,
            'dc-media-id' => $dc_media_id,
            'dc-accumulator' => $dc_accumulator,
            'dc-media-size' => $dc_media_size,
        ] = $attributes;

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

            $media_id = $image['id'] ?? '';
            $media_src = $image['url'] ?? '';
        } elseif (
            in_array(
                $dc_type,
                array_merge(['posts', 'pages'], $this->get_custom_post_types()),
            )
        ) {
            // Post or page
            $post = $this->get_post($attributes);

            if (!empty($post)) {
                if ($this->is_repeated_post($post->ID, $dc_accumulator)) {
                    return '';
                }
                if ($dc_field === 'featured_media') {
                    $media_id = get_post_meta($post->ID, '_thumbnail_id', true);
                } elseif ($dc_field === 'author_avatar') {
                    $media_id = 'external';
                    $media_src = get_avatar_url($post->post_author, [
                        'size' => $dc_media_size
                    ]);
                }
            }
        } elseif ($dc_type === 'settings') {
            // Site settings
            // $dc_field is not used here as there's just on option for the moment
            $media_id = get_theme_mod('custom_logo');
        } elseif ($dc_type === 'media') {
            $post = $this->get_post($attributes);
            if (
                !empty($post) &&
                $this->is_repeated_post($post->ID, $dc_accumulator)
            ) {
                return '';
            }
            $media_id = $post->ID ?? ($dc_media_id ?? $dc_id);
        } elseif ($dc_type === 'users') {
            $media_id = 'external';
            if ($dc_relation === 'current' && is_author()) {
                $media_src = get_avatar_url(get_queried_object_id(), [
                    'size' => $dc_media_size
                ]);
            } else {
                $post = $this->get_post($attributes);
                if (
                    !empty($post) &&
                    $this->is_repeated_post($post->ID, $dc_accumulator)
                ) {
                    return '';
                }
                $media_src = get_avatar_url($post->ID, [
                    'size' => $dc_media_size
                ]);
            }
        } elseif ($dc_type === 'products') {
            $product = self::get_post($attributes);
            if (
                !empty($product) &&
                $this->is_repeated_post(method_exists($product, 'get_id') ? $product->get_id() : $product->ID, $dc_accumulator)
            ) {
                return '';
            }
            $media_id = self::get_product_content($attributes);
        }

        if (!empty($media_id) && is_numeric($media_id)) {
            $image_src_array = wp_get_attachment_image_src($media_id, 'full');
            $media_src = !empty($image_src_array) ? $image_src_array[0] : '';

            $media_alt = get_post_meta(
                $media_id,
                '_wp_attachment_image_alt',
                true,
            );

            if (empty($media_alt)) {
                $media_alt = 'No content found';
            }

            $post = get_post($media_id);
            $media_caption = 'No content found';
            if (!empty($post) && !empty($post->post_excerpt)) {
                $media_caption = $post->post_excerpt;
            }
        }

        $mediaIdToReplace = $is_background
            ? '$bg-media-id-to-replace'
            : '$media-id-to-replace';
        $mediaUrlToReplace = $is_background
            ? '$bg-media-url-to-replace'
            : '$media-url-to-replace';
        $mediaAltToReplace = $is_background
            ? '$bg-media-alt-to-replace'
            : '$media-alt-to-replace';
        $mediaCaptionToReplace = $is_background
            ? '$bg-media-caption-to-replace'
            : '$media-caption-to-replace';

        if (!empty($media_src)) {
            $content = str_replace($mediaIdToReplace, $media_id, $content);
            $content = str_replace($mediaUrlToReplace, $media_src, $content);
            $content = str_replace($mediaAltToReplace, $media_alt, $content);
            $content = str_replace(
                $mediaCaptionToReplace,
                $media_caption,
                $content,
            );
        } else {
            $this->is_empty = true;

            // Check if the content is just one <figure> element
            if (
                preg_match(
                    '/^(?:<a[^>]*>)?\s*<figure[^>]*>.*<\/figure>\s*(?:<\/a>)?$/s',
                    trim($content),
                )
            ) {
                return '';
            }

            $content = str_replace($mediaIdToReplace, '', $content);
            $content = str_replace($mediaUrlToReplace, '', $content);
            $content = str_replace($mediaAltToReplace, '', $content);
            $content = str_replace($mediaCaptionToReplace, '', $content);
        }

        return $content;
    }

    public function render_dc_classes($attributes, $content)
    {
        @[
            'dc-hide' => $dc_hide,
            'dc-field' => $dc_field,
        ] = $attributes;

        $classes = [];

        $classes[] =
            $dc_hide &&
            !in_array($dc_field, self::$ignore_empty_fields) &&
            $this->is_empty
                ? 'maxi-block--hidden'
                : '';

        $content = str_replace(
            '$class-to-replace',
            implode(' ', array_filter($classes)),
            $content,
        );

        if (
            $this->check_if_content_is_empty($attributes, $content) ||
            (!in_array($dc_field, self::$ignore_empty_fields) &&
                $this->is_empty)
        ) {
            // Add the class only to elements that don't have it yet
            $content = preg_replace_callback(
                '/<([a-z]+)([^>]*?)class="([^"]*?)"/i',
                function ($matches) {
                    $tag = $matches[1];
                    $attributes = $matches[2];
                    $classes = $matches[3];

                    // Check if the class already exists
                    if (strpos($classes, 'maxi-block--hidden') === false) {
                        $classes = 'maxi-block--hidden ' . $classes;
                    }

                    return "<$tag$attributes class=\"$classes\"";
                },
                $content,
            );

            return $content;
        }

        return $content;
    }

    public function get_current_archive_type_and_id()
    {
        $archive_info = [
            'type' => null,
            'id' => null,
        ];

        if (is_category()) {
            // It's a category archive
            $archive_info['type'] = 'category';
            $archive_info['id'] = get_queried_object_id(); // Get the category ID
        } elseif (is_tag()) {
            // It's a tag archive
            $archive_info['type'] = 'tag';
            $archive_info['id'] = get_queried_object_id(); // Get the tag ID
        } elseif (is_tax()) {
            // It's a custom taxonomy archive
            $queried_object = get_queried_object();
            $archive_info['tax_query']      = [
                [
                    'taxonomy' => $queried_object->taxonomy,
                    'field'    => 'term_id',
                    'terms'    => $queried_object->term_id,
                ],
            ];
        } elseif (is_post_type_archive()) {
            // It's a custom post type archive
            $queried_object = get_queried_object();
            $archive_info['type'] = 'post_type';
            $archive_info['id'] = $queried_object->name; // Use the name for post type
        } elseif (is_author()) {
            // It's an author archive
            $archive_info['type'] = 'author';
            $archive_info['id'] = get_queried_object_id(); // Get the author ID
        } elseif (is_date()) {
            // It's a date archive
            $archive_info['type'] = 'date';
            $year = get_query_var('year');
            $month = get_query_var('monthnum');
            $day = get_query_var('day');
            $date_id = $year;
            if ($month) {
                $date_id .= '-' . sprintf('%02d', $month);
            }
            if ($day) {
                $date_id .= '-' . sprintf('%02d', $day);
            }
            $archive_info['id'] = $date_id; // Format: YYYY or YYYY-MM or YYYY-MM-DD
        } else {
            // Not an archive page or a type not covered above
            $archive_info['type'] = 'not_an_archive';
            $archive_info['id'] = null;
        }

        return $archive_info;
    }

    public function get_post($attributes)
    {
        @[
            'dc-type' => $dc_type,
            'dc-relation' => $dc_relation,
            'dc-id' => $dc_id,
            'dc-author' => $dc_author,
            'dc-order-by' => $dc_order_by,
            'dc-order' => $dc_order,
            'dc-accumulator' => $dc_accumulator,
            'dc-limit-by-archive' => $dc_limit_by_archive,
        ] = $attributes;

        if (empty($dc_type)) {
            $dc_type = 'posts';
        }
        if (empty($dc_relation)) {
            $dc_relation = 'by-id';
        }
        if (empty($dc_accumulator)) {
            $dc_accumulator = 0;
        }
        if (empty($dc_order_by)) {
            $dc_order_by = 'by-date';
        }
        if (empty($dc_order)) {
            $dc_order = 'desc';
        }

        $is_sort_relation = in_array($dc_relation, [
            'by-date',
            'alphabetical',
            'by-category',
            'by-author',
            'by-tag',
        ]) || strpos($dc_relation, 'custom-taxonomy') !== false;
        $is_random = $dc_relation === 'random';
        $is_current_archive = $dc_relation === 'current-archive';

        if (
            in_array(
                $dc_type,
                array_merge(
                    ['posts', 'pages', 'products'],
                    $this->get_custom_post_types(),
                ),
            )
        ) {
            // Basic args
            $args = [
                'post_status' => 'publish',
                'posts_per_page' => 1,
            ];

            if (isset(self::$type_to_post_type[$dc_type])) {
                $args['post_type'] = self::$type_to_post_type[$dc_type];
            } else {
                $args['post_type'] = $dc_type;
            }

            // DC Relation
            if ($dc_relation == 'by-id') {
                $args['p'] = $dc_id;
            } elseif ($dc_relation == 'current') {
                $args['p'] = get_the_ID();
                // If user chooses current post on FSE but is editing a page, need to get the current post,
                // because we can't get what type of post user is editing on FSE,
                // so we can't disallow users to choose the wrong type
                $args['post_type'] = get_post_type();
                if (is_category()) {
                    $args['category_name'] = single_cat_title('', false);
                } elseif (is_tag()) {
                    $args['tag'] = single_tag_title('', false);
                } elseif (is_archive()) {
                    $args['year'] = get_the_date('Y');
                    $args['monthnum'] = get_the_date('m');
                } elseif (is_tax()) {
                    $taxonomy = get_queried_object()->taxonomy;
                    $term_id = get_queried_object_id();
                    $args['tax_query'] = [
                        [
                            'taxonomy' => $taxonomy,
                            'terms' => $term_id,
                        ],
                    ];
                }
                unset($args['post_status']);
            } elseif ($dc_relation == 'author') {
                $args['author'] = $dc_author ?? $dc_id;
            } elseif ($is_random) {
                // Use the pre-generated session seed
                $session_seed = self::$session_seed;

                // Create a unique key for this combination of post type and relation
                $shuffle_key = $dc_type . '_' . $dc_relation;

                // If we haven't shuffled this post type and relation before, do it now
                if (!isset(self::$shuffled_posts[$shuffle_key])) {
                    // Fetch all posts
                    $args['posts_per_page'] = -1;
                    $query = new WP_Query($args);
                    $posts = $query->posts;

                    if (!empty($posts)) {
                        $post_ids = wp_list_pluck($posts, 'ID');
                        // Use the Fisher-Yates shuffle algorithm with our session seed
                        self::$shuffled_posts[$shuffle_key] = $this->seeded_shuffle($post_ids, $session_seed);
                    } else {
                        self::$shuffled_posts[$shuffle_key] = [];
                    }
                }

                $shuffled_ids = self::$shuffled_posts[$shuffle_key];

                if (!empty($shuffled_ids)) {
                    // Use modulo to ensure we always have a valid index, even if accumulator is large
                    $index = $dc_accumulator % count($shuffled_ids);

                    // Find the post with the selected ID
                    $post_id = $shuffled_ids[$index];
                    return get_post($post_id);
                }
                return null;
            } elseif ($is_sort_relation) {
                $args = array_merge(
                    $args,
                    $this->get_order_by_args(
                        $dc_relation,
                        $dc_order_by,
                        $dc_order,
                        $dc_accumulator,
                        $dc_type,
                        $dc_id,
                        null,
                        $dc_limit_by_archive,
                    ),
                );
            } elseif ($is_current_archive) {
                $archive_info = $this->get_current_archive_type_and_id();
                $order_by_args = $this->get_order_by_args(
                    $dc_relation,
                    $dc_order_by,
                    $dc_order,
                    $dc_accumulator,
                    $dc_type,
                    $archive_info['id'],
                    $archive_info['type'],
                    $dc_limit_by_archive
                );

                if (isset($archive_info['tax_query'])) {
                    $order_by_args['tax_query'] = $archive_info['tax_query'];
                }

                $args = array_merge($args, $order_by_args);
            }

            if ($dc_type === 'products') {
                if (!function_exists('wc_get_products')) {
                    return null;
                }

                $args['limit'] = 1;
                $products = wc_get_products($args);
                return !empty($products) ? $products[0] : null;
            }

            $query = new WP_Query($args);

            if (
                empty($query->posts) &&
                !$is_current_archive &&
                $dc_relation !== 'by-author'
            ) {
                $validated_attributes = self::get_validated_orderby_attributes(
                    $dc_relation,
                    $dc_id,
                );
                if (
                    in_array($dc_relation, self::$order_by_relations) &&
                    $validated_attributes
                ) {
                    return $this->get_post(
                        array_replace($attributes, $validated_attributes),
                    );
                } else {
                    return null;
                }
            }

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
                $args = [
                    'post_type' => 'attachment',
                    'post_status' => 'inherit',
                    'posts_per_page' => -1,
                ];
                $query = new WP_Query($args);
                $posts = $query->posts;

                if (!empty($posts)) {
                    $random_index = wp_rand(0, count($posts) - 1);
                    return $posts[$random_index];
                }
                return null;
            } elseif ($is_sort_relation) {
                $args['post_status'] = 'inherit';
                $args = array_merge(
                    $args,
                    $this->get_order_by_args(
                        $dc_relation,
                        $dc_order_by,
                        $dc_order,
                        $dc_accumulator,
                        $dc_type,
                        $dc_id,
                        null,
                        $dc_limit_by_archive,
                    ),
                );
            }

            $query = new WP_Query($args);

            if (
                empty($query->posts) &&
                in_array($dc_relation, self::$order_by_relations)
            ) {
                $validated_attributes = self::get_validated_orderby_attributes(
                    $dc_relation,
                    $dc_id,
                );
                if ($validated_attributes) {
                    return $this->get_post(
                        array_replace($attributes, $validated_attributes),
                    );
                } else {
                    return null;
                }
            }

            if ($is_random) {
                $posts = $query->posts;
                $post = $posts[array_rand($posts)];
            } else {
                $post = end($query->posts);
            }

            return $post;
        } elseif (
            in_array(
                $dc_type,
                array_merge(
                    [
                        'categories',
                        'tags',
                        'product_categories',
                        'product_tags',
                    ],
                    $this->get_custom_taxonomies(),
                ),
            )
        ) {
            if ($dc_type === 'categories') {
                $taxonomy = 'category';
            } elseif ($dc_type === 'tags') {
                $taxonomy = 'post_tag';
            } elseif ($dc_type === 'product_categories') {
                $taxonomy = 'product_cat';
            } elseif ($dc_type === 'product_tags') {
                $taxonomy = 'product_tag';
            } else {
                $taxonomy = $dc_type;
            }

            $args = [
                'taxonomy' => $taxonomy,
                'hide_empty' => false,
                'number' => 1,
            ];

            if ($dc_relation === 'current') {
                // Get the current queried object (should be the current category/term)
                $queried_object = get_queried_object();
                if ($queried_object && isset($queried_object->term_id) && $queried_object->taxonomy === $taxonomy) {
                    return $queried_object;
                }
                // If not on a taxonomy archive page, return null
                return null;
            } elseif ($is_random) {
                $args['number'] = 0; // Get all terms
                $terms = get_terms($args);

                if (!empty($terms)) {
                    $random_index = wp_rand(0, count($terms) - 1);
                    return $terms[$random_index];
                }
                return null;
            } else {
                $args['include'] = $dc_id;
            }

            $terms = get_terms($args);

            if (!empty($terms) && isset($terms[0])) {
                return $terms[0];
            } else {
                return null;
            }
        } elseif ($dc_type === 'users') {
            if ($dc_relation === 'current') {
                return get_user_by('id', get_the_author_meta('ID'));
            }

            $args = [
                'capability' => 'edit_posts',
            ];

            if ($is_sort_relation) {
                $args = array_merge(
                    $args,
                    $this->get_order_by_args(
                        $dc_relation,
                        $dc_order_by,
                        $dc_order,
                        $dc_accumulator,
                        $dc_type,
                        $dc_id,
                        null,
                        $dc_limit_by_archive,
                    ),
                );
            } elseif ($dc_relation === 'by-id') {
                $args['include'] = $dc_author ?? $dc_id;
            } elseif ($is_random) {
                $args['number'] = 0; // Get all users
                $users = get_users($args);

                if (!empty($users)) {
                    $random_index = wp_rand(0, count($users) - 1);
                    return $users[$random_index];
                }
                return null;
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

    public function get_validated_orderby_attributes($dc_relation, $dc_id)
    {
        if ($dc_relation === 'by-category') {
            $categories = get_categories(['hide_empty' => false]);

            if (in_array($dc_id, array_column($categories, 'term_id'))) {
                return false;
            }

            // Get first category which has posts.
            $non_empty_categories = get_categories(['hide_empty' => true]);
            $first_category = reset($non_empty_categories);

            if ($first_category) {
                return [
                    'dc-relation' => 'by-category',
                    'dc-id' => $first_category->term_id,
                ];
            }
        } elseif ($dc_relation === 'by-tag') {
            $tags = get_tags(['hide_empty' => false]);

            if (in_array($dc_id, array_column($tags, 'term_id'))) {
                return false;
            }

            // Get first tag which has posts.
            $non_empty_tags = get_tags(['hide_empty' => true]);
            $first_tag = reset($non_empty_tags);

            if ($first_tag) {
                return [
                    'dc-relation' => 'by-tag',
                    'dc-id' => $first_tag->term_id,
                ];
            }
        }

        return ['dc-relation' => 'by-date', 'dc-order' => 'desc'];
    }

    /**
     * Performs a seeded shuffle on an array.
     *
     * @param array $array The array to shuffle.
     * @param int $seed The seed for the random number generator.
     * @return array The shuffled array.
     */
    private function seeded_shuffle($array, $seed)
    {
        $shuffled = $array;
        $count = count($shuffled);
        for ($i = $count - 1; $i > 0; $i--) {
            $j = random_int(0, $i);
            $temp = $shuffled[$i];
            $shuffled[$i] = $shuffled[$j];
            $shuffled[$j] = $temp;
        }
        return $shuffled;
    }


    public function get_link_attributes_from_link_settings($linkSettings)
    {
        $rel = '';
        $isNoFollow = isset($linkSettings['noFollow'])
            ? $linkSettings['noFollow']
            : false;
        $isSponsored = isset($linkSettings['sponsored'])
            ? $linkSettings['sponsored']
            : false;
        $isUGC = isset($linkSettings['ugc']) ? $linkSettings['ugc'] : false;
        if ($isNoFollow) {
            $rel .= ' nofollow';
        }
        if ($isSponsored) {
            $rel .= ' sponsored';
        }
        if ($isUGC) {
            $rel .= ' ugc';
        }
        if (!$isNoFollow && !$isSponsored && !$isUGC) {
            $rel = null;
        } else {
            $rel = trim($rel);
        }

        $target =
            isset($linkSettings['opensInNewTab']) &&
            $linkSettings['opensInNewTab']
                ? '_blank'
                : '_self';

        return ['rel' => $rel, 'target' => $target];
    }

    public function get_field_link($item, $field, $dc_link_target)
    {
        switch ($field) {
            case 'author':
                switch ($dc_link_target) {
                    case 'author_email':
                        $email = sanitize_email(get_the_author_meta('user_email', $item));
                        $link = $this->xor_obfuscate_email($email);
                        break;
                    case 'author_site':
                        $link = get_the_author_meta('user_url', $item);
                        break;
                    default:
                        $link = get_author_posts_url($item);
                }
                return $link;
            case 'categories':
            case 'tags':
                return get_term_link($item);
            default:
                if (in_array($field, $this->get_custom_taxonomies())) {
                    return get_term_link($item);
                }
                return '';
        }
    }

    public function get_post_taxonomy_item_content(
        $item,
        $content,
        $link_status,
        $field,
        $dc_post_taxonomy_links_status,
        $linkSettings = null,
        $dc_link_target = null,
        $block_name = 'text-maxi'
    ) {
        // Need to support $dc_post_taxonomy_links_status for blocks that were not migrated (up until 1.7.2 version included)
        if ($link_status || $dc_post_taxonomy_links_status) {
            $href = 'href="' . $this->get_field_link($item, $field, $dc_link_target) . '"';
            $rel = '';
            $target = ' target="_self"';

            // If $dc_post_taxonomy_links_status is true, link settings should not affect inline links
            if ($linkSettings && !$dc_post_taxonomy_links_status) {
                $link_attributes = $this->get_link_attributes_from_link_settings(
                    $linkSettings,
                );
                $rel = $link_attributes['rel']
                    ? ' rel="' . $link_attributes['rel'] . '"'
                    : '';
                $target = ' target="' . $link_attributes['target'] . '"';
            }

            $link_class = $block_name === 'text-maxi' ? 'maxi-text-block--link' : 'maxi-button-block--link';

            return '<a ' .
                $href .
                $rel .
                $target .
                ' class="' . $link_class . '"><span>' .
                $content .
                '</span></a>';
        }

        return $content;
    }

    public function get_post_taxonomy_content(
        $attributes,
        $post_id,
        $taxonomy,
        $block_name
    ) {
        @[
            'dc-field' => $dc_field,
            'dc-delimiter-content' => $dc_delimiter,
            'dc-link-target' => $dc_link_target,
            'dc-link-status' => $dc_link_status,
            // Need to keep old attribute for backward compatibility
            'dc-post-taxonomy-links-status' => $dc_post_taxonomy_links_status,
            'linkSettings' => $linkSettings,
            'dc-accumulator' => $dc_accumulator,
        ] = $attributes;

        if ($this->is_repeated_post($post_id, $dc_accumulator)) {
            return '';
        }

        $taxonomy_list = wp_get_post_terms($post_id, $taxonomy);
        $taxonomy_content = [];

        foreach ($taxonomy_list as $taxonomy_item) {
            $taxonomy_content[] = $this->get_post_taxonomy_item_content(
                $taxonomy_item,
                $taxonomy_item->name,
                $dc_link_status && $dc_link_target === $dc_field,
                $dc_field,
                $dc_post_taxonomy_links_status,
                $linkSettings,
                $dc_link_target,
                $block_name
            );
        }

        return implode("$dc_delimiter ", $taxonomy_content);
    }

    public function get_post_or_page_content($attributes, $block_name)
    {
        @[
            'dc-field' => $dc_field,
            'dc-sub-field' => $dc_sub_field,
            'dc-limit' => $dc_limit,
            'dc-delimiter-content' => $dc_delimiter,
            // Need to keep old attribute for backward compatibility
            'dc-post-taxonomy-links-status' => $dc_post_taxonomy_links_status,
            'dc-link-status' => $dc_link_status,
            'dc-accumulator' => $dc_accumulator,
            'dc-keep-only-text-content' => $dc_keep_only_text_content,
            'dc-link-target' => $dc_link_target,
        ] = $attributes;


        $post = $this->get_post($attributes);

        if (empty($post)) {
            return '';
        }

        if ($this->is_repeated_post($post->ID, $dc_accumulator)) {
            return '';
        }

        $post_data = isset($post->{"post_$dc_field"})
            ? $post->{"post_$dc_field"}
            : null;

        if (empty($post_data) && $dc_field === 'excerpt') {
            $post_data = $post->post_content;
        }
        // In case is title, excerpt, remove blocks and strip tags
        if (in_array($dc_field, ['title', 'excerpt'])) {
            // Remove all HTML tags and replace with a line break
            if ($dc_field === 'excerpt') {
                $post_data = excerpt_remove_blocks($post_data);
            }
            $post_data = wp_strip_all_tags($post_data);

            // Ensures no double or more line breaks
            $post_data = preg_replace("/[\r\n]+/", "\n", $post_data);
            $post_data = preg_replace("/\n{2,}/", "\n", $post_data);
            $post_data = nl2br($post_data);

            // In case is not set, put the default limit
            if (!isset($dc_limit)) {
                $dc_limit = 150;
            }

            // Limit content
            $post_data = self::get_limited_string($post_data, $dc_limit);
        }

        if ($dc_field === 'content') {
            // In case is not set, put the default limit
            if (!isset($dc_limit)) {
                $dc_limit = 0;
            }

            // Limit content
            if (isset($dc_limit) && ($dc_limit > 0 || $dc_keep_only_text_content)) {
                $post_data = wp_strip_all_tags($post_data);

                // Ensures no double or more line breaks
                $post_data = preg_replace("/[\r\n]+/", "\n", $post_data);
                $post_data = preg_replace("/\n{2,}/", "\n", $post_data);
                $post_data = nl2br($post_data);
                $post_data = self::get_limited_string($post_data, $dc_limit);
            }
        }


        if ($dc_field === 'author') {
            $content = $this->get_user_field_value($post->post_author, $dc_sub_field ?? $dc_field, $dc_limit, $dc_link_target);

            $post_data = $this->get_post_taxonomy_item_content(
                $post->post_author,
                $content,
                false,
                $dc_field,
                $dc_post_taxonomy_links_status,
            );
        }

        if (in_array($dc_field, ['categories', 'tags'])) {
            $field_name_to_taxonomy = [
                'tags' => 'post_tag',
                'categories' => 'category',
            ];

            $post_data = self::get_post_taxonomy_content(
                $attributes,
                $post->ID,
                $field_name_to_taxonomy[$dc_field],
                $block_name
            );
        }

        if (in_array($dc_field, $this->get_custom_taxonomies())) {
            $post_data = self::get_post_taxonomy_content(
                $attributes,
                $post->ID,
                $dc_field,
                $block_name
            );
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

    /**
     * Retrieves media content associated with a post based on given attributes.
     *
     * This function dynamically retrieves media content from a post, such as the post's author or a specific field
     * defined in the 'dc-field' attribute of the input array. If the 'dc-field' is 'author', it fetches the display name
     * of the post's author. For any other 'dc-field' value, it fetches the corresponding property from the post.
     *
     * @param array $attributes An associative array of attributes used to identify the post and the specific media content to retrieve.
     *                          The array must contain a 'dc-field' key that specifies the content to fetch (e.g., 'author', 'title').
     * @return mixed Returns the requested media content if available. If the specified content cannot be found or the post does not exist, returns null.
     */
    public function get_media_content($attributes)
    {
        @[
            'dc-field' => $dc_field,
        ] = $attributes;

        $post = $this->get_post($attributes);

        // Check if $post is false (boolean) before attempting to access its properties
        if (empty($post)) {
            return 0;
        }

        $post_id = $post->ID;
        $dc_accumulator = $attributes['dc-accumulator'];

        if ($this->is_repeated_post($post_id, $dc_accumulator)) {
            return 0;
        }

        // For fields other than 'author', attempt to dynamically access the property
        if ($dc_field !== 'author') {
            $media_data = $post->{"post_$dc_field"};
        } else {
            // Specifically handle the 'author' case
            $media_data = get_the_author_meta(
                'display_name',
                $post->post_author,
            );
        }

        return $media_data;
    }

    public function get_user_content($attributes)
    {
        @[
            'dc-relation' => $dc_relation,
            'dc-field' => $dc_field,
            'dc-limit' => $dc_limit,
            'dc-sub-field' => $dc_sub_field,
            'dc-type' => $dc_type,
            'dc-link-target' => $dc_link_target,
        ] = $attributes;

        // Ensure 'dc-field' exists in $attributes to avoid "Undefined array key"
        if (!array_key_exists('dc-field', $attributes)) {
            return 0;
        } else {
            $dc_field = $attributes['dc-field'];
        }
        if (
            $dc_relation === 'by-id' &&
            $attributes['dc-type'] === 'archive' &&
            is_author()
        ) {
            $dc_relation = 'current';
        }

        if (is_author() && $dc_relation === 'current' && $dc_type === 'archive') {
            $user = get_user_by('id', get_queried_object_id());
        } else {
            $user = $this->get_post($attributes);
        }
        if (!($user instanceof WP_User)) {
            return 0;
        }
        $user_id = $user->ID;

        return $this->get_user_field_value($user_id, $dc_sub_field ?? $dc_field, $dc_limit, $dc_link_target);
    }

    public function get_user_field_value($user_id, $dc_field, $dc_limit, $dc_link_target)
    {
        $user = get_user_by('id', $user_id);
        if (!$user) {
            return 0;
        }

        $user_meta = array_map(function ($value) {
            return $value[0];
        }, get_user_meta($user_id));
        $user_data = array_merge((array) $user->data, $user_meta);

        // Ensure $user is an object and $user->data exists and is an object
        if (
            !is_object($user) ||
            !isset($user->data) ||
            !is_object($user->data)
        ) {
            return 0;
        }
        $user_dictionary = [
            'author' => 'display_name',
            'name' => 'display_name',
            'username' => 'user_login',
            'email' => 'user_email',
            'url' => 'user_url',
            'link' => get_author_posts_url($user_id),
            'description' => 'description',
            'archive-type' => __('author', 'maxi-blocks'),
        ];

        // Check if the property exists in $user->data
        $property = $user_dictionary[$dc_field] ?? $dc_field;
        if ($dc_field === 'archive-type' || $dc_field === 'link') {
            return $property;
        }
        if (!array_key_exists($property, $user_data) || !isset($user_data[$property])) {
            return 0;
        }

        $value = $user_data[$property];

        if ($dc_field === 'description' || $dc_field === 'name') {
            $value = self::get_limited_string($value, $dc_limit);
        }

        return $value;
    }

    public function get_taxonomy_content($attributes)
    {
        @[
            'dc-field' => $dc_field,
            'dc-limit' => $dc_limit,
            'dc-relation' => $dc_relation,
            'dc-type' => $dc_type,
            'dc-accumulator' => $dc_accumulator,
        ] = $attributes;

        if ($dc_relation === 'current' || $dc_type === 'archive') {
            if (is_date()) {
                global $wp_query;
                $year = $wp_query->get('year');
                $month = $wp_query->get('monthnum');
                $day = $wp_query->get('day');
                // Get the WordPress date format
                $format = get_option('date_format');

                // Format the date based on the available date components
                if ($day) {
                    $formatted_date = gmdate(
                        $format,
                        gmmktime(0, 0, 0, $month, $day, $year),
                    );
                } elseif ($month) {
                    $formatted_date = gmdate(
                        'F Y',
                        gmmktime(0, 0, 0, $month, 1, $year),
                    );
                } elseif ($year) {
                    $formatted_date = $year;
                } else {
                    $formatted_date = '';
                }

                // Use the $formatted_date as needed
                if (!empty($formatted_date)) {
                    return $formatted_date;
                }
            }
            $term = get_queried_object();
        } else {
            $term = $this->get_post($attributes);
        }

        if (!empty($term)) {
            if ($this->is_repeated_post($term->term_id, $dc_accumulator)) {
                return null;
            }
            if ($dc_field === 'link') {
                $tax_data = get_term_link($term);
            } elseif (isset($term->$dc_field)) {
                $tax_data = $term->$dc_field;
            } else {
                if (isset($term->data->user_login) && $dc_type === 'archive') {
                    return self::get_user_content($attributes);
                } else {
                    $tax_data = null;
                }
            }

            if ($dc_field === 'parent') {
                if ($tax_data === 0) {
                    $tax_data = 'No parent';
                } else {
                    $parent_term = get_term($tax_data);
                    $tax_data = $parent_term ? $parent_term->name : null;
                }
            }

            if ($dc_field === 'description') {
                $tax_data = self::get_limited_string($tax_data, $dc_limit);
            }
            return $tax_data;
        }

        return null;
    }

    public function get_product_content($attributes, $block_name = null)
    {
        @[
            'dc-field' => $dc_field,
            'dc-limit' => $dc_limit,
            'dc-image-accumulator' => $dc_image_accumulator,
            'dc-accumulator' => $dc_accumulator,
        ] = $attributes;

        $product = $this->get_post($attributes);

        if (!empty($product)) {
            if ($this->is_repeated_post(method_exists($product, 'get_id') ? $product->get_id() : $product->ID, $dc_accumulator)) {
                return '';
            }
            switch ($dc_field) {
                case 'name':
                case 'slug':
                case 'sku':
                case 'review_count':
                    return method_exists($product, 'get_data') ? strval($product->get_data()[$dc_field]) : '';
                case 'average_rating':
                    if (!method_exists($product, 'get_average_rating') || empty($product->get_average_rating())) {
                        $this->is_empty = true;
                        return '';
                    }
                    return strval($product->get_average_rating());
                case 'price':
                case 'regular_price':
                    if (!method_exists($product, 'get_data')) {
                        $this->is_empty = true;
                        return '';
                    }
                    $price = $product->get_data()[$dc_field];
                    if (empty($price)) {
                        $this->is_empty = true;
                    }
                    return wp_strip_all_tags(function_exists('wc_price') ? wc_price($price) : $price);
                case 'sale_price':
                    if (!method_exists($product, 'get_sale_price')) {
                        $this->is_empty = true;
                        return '';
                    }
                    $price = $product->get_sale_price();
                    if (empty($price)) {
                        $this->is_empty = true;
                    }
                    if (method_exists($product, 'is_on_sale') && $product->is_on_sale()) {
                        return wp_strip_all_tags(function_exists('wc_price') ? wc_price($price) : $price);
                    }

                    return wp_strip_all_tags(function_exists('wc_price') ? wc_price(method_exists($product, 'get_price') ? $product->get_price() : 0) : (method_exists($product, 'get_price') ? $product->get_price() : 0));
                case 'price_range':
                    if (!method_exists($product, 'is_type') || !method_exists($product, 'get_variation_price')) {
                        $this->is_empty = true;
                        return '';
                    }
                    if ($product->is_type('variable')) {
                        $min_price = $product->get_variation_price('min', true);
                        $max_price = $product->get_variation_price('max', true);

                        if ($min_price !== $max_price) {
                            return function_exists('wc_format_price_range') ? wc_format_price_range(
                                $min_price,
                                $max_price,
                            ) : $min_price . ' - ' . $max_price;
                        }
                    }

                    return wp_strip_all_tags(function_exists('wc_price') ? wc_price(method_exists($product, 'get_price') ? $product->get_price() : 0) : (method_exists($product, 'get_price') ? $product->get_price() : 0));
                case 'description':
                    if (!method_exists($product, 'get_description')) {
                        $this->is_empty = true;
                        return '';
                    }
                    return self::get_limited_string(
                        $product->get_description(),
                        $dc_limit,
                    );
                case 'short_description':
                    if (!method_exists($product, 'get_short_description')) {
                        $this->is_empty = true;
                        return '';
                    }
                    return self::get_limited_string(
                        $product->get_short_description(),
                        $dc_limit,
                    );
                case 'tags':
                case 'categories':
                    $field_name_to_taxonomy = [
                        'tags' => 'product_tag',
                        'categories' => 'product_cat',
                    ];

                    return self::get_post_taxonomy_content(
                        $attributes,
                        method_exists($product, 'get_id') ? $product->get_id() : $product->ID,
                        $field_name_to_taxonomy[$dc_field],
                        $block_name
                    );
                case 'featured_media':
                    if (!method_exists($product, 'get_image_id')) {
                        $this->is_empty = true;
                        return '';
                    }
                    return (int) $product->get_image_id();
                case 'gallery':
                    if (!method_exists($product, 'get_gallery_image_ids')) {
                        $this->is_empty = true;
                        return '';
                    }
                    return $product->get_gallery_image_ids()[
                        $dc_image_accumulator
                    ];
                default:
                    return null;
            }
        }
    }

    public function get_cart_content($attributes)
    {
        @[
            'dc-field' => $dc_field,
            'dc-limit' => $dc_limit,
        ] = $attributes;

        if (!function_exists('WC') || !WC()->cart) {
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
                if (
                    !function_exists('WC') || empty(WC()->cart->get_totals()[$field_to_totals[$dc_field]])
                ) {
                    $this->is_empty = true;
                }
                return wp_strip_all_tags(
                    function_exists('wc_price') ? wc_price(
                        function_exists('WC') ? WC()->cart->get_totals()[$field_to_totals[$dc_field]] : 0,
                    ) : '0',
                );
            default:
                return null;
        }
    }

    public function get_acf_content($attributes)
    {
        if (!function_exists('get_field_object')) {
            return '';
        }

        @[
            'dc-field' => $dc_field,
            'dc-acf-field-type' => $dc_acf_field_type,
            'dc-limit' => $dc_limit,
            'dc-delimiter-content' => $dc_delimiter,
            'dc-accumulator' => $dc_accumulator,
            'dc-type' => $dc_type,
            'dc-id' => $dc_id,
            'dc-relation' => $dc_relation,
        ] = $attributes;

        $post = $this->get_post($attributes);
        if (empty($post)) {
            return '';
        }

        // Check if it's a taxonomy term (has term_id) or a regular post (has ID)
        $item_id = isset($post->term_id) ? $post->term_id : $post->ID;

        if ($this->is_repeated_post($item_id, $dc_accumulator)) {
            return '';
        }

        // First, try to get the field as a post/page field
        $acf_data = get_field_object($dc_field, $item_id);

        // If no value found and it looks like a taxonomy term, try taxonomy contexts
        if ((!$acf_data || empty($acf_data['value'])) && isset($post->term_id)) {
            // Try common taxonomy contexts
            $taxonomy_contexts = [
                'category_' . $post->term_id,  // Categories
                'post_tag_' . $post->term_id,  // Tags
                'product_cat_' . $post->term_id, // WooCommerce product categories
                'product_tag_' . $post->term_id, // WooCommerce product tags
            ];

            // Also try to use the actual taxonomy from the term object
            if (isset($post->taxonomy)) {
                $taxonomy_contexts[] = $post->taxonomy . '_' . $post->term_id;
            }

            foreach ($taxonomy_contexts as $context) {
                $acf_data = get_field_object($dc_field, $context);
                if ($acf_data && !empty($acf_data['value'])) {
                    break;
                }
            }
        }

        $acf_value = is_array($acf_data) ? $acf_data['value'] : null;
        $content = null;

        switch ($dc_acf_field_type) {
            case 'select':
            case 'radio':
                $content = is_array($acf_value)
                    ? $acf_value['label']
                    : $acf_value;
                break;
            case 'checkbox':
                $content = implode(
                    "$dc_delimiter ",
                    array_map(function ($item) {
                        return is_array($item) ? $item['label'] : $item;
                    }, $acf_value),
                );
                break;
            case 'image':
                if (
                    is_array($acf_data) &&
                    isset($acf_data['return_format']) &&
                    $acf_data['return_format'] === 'url'
                ) {
                    $content = [
                        'url' => $acf_value,
                    ];
                } elseif (
                    is_array($acf_data) &&
                    isset($acf_data['return_format']) &&
                    $acf_data['return_format'] === 'id'
                ) {
                    $content = [
                        'id' => $acf_value,
                    ];
                } else {
                    $content = $acf_value;
                }
                break;
            default:
                $content = $acf_value;
        }

        return $content;
    }

    public function get_date($date, $attributes)
    {
        @[
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
        ] = $attributes;

        if (!isset($dc_custom_date)) {
            $dc_custom_date = false;
        }
        if (!isset($dc_timezone) || !$dc_custom_date) {
            $dc_timezone = 'none';
        }
        if (!isset($dc_format)) {
            $dc_format = 'd.m.Y t';
        }

        $options = [
            'day' => $dc_day === 'none' ? null : $dc_day,
            'era' => $dc_era === 'none' ? null : $dc_era,
            'hour' => $dc_hour === 'none' ? null : $dc_hour,
            'hour12' =>
                $dc_hour12 === 'false'
                    ? false
                    : ($dc_hour12 === 'true'
                        ? true
                        : $dc_hour12),
            'minute' => $dc_minute === 'none' ? null : $dc_minute,
            'month' => $dc_month === 'none' ? null : $dc_month,
            'second' => $dc_second === 'none' ? null : $dc_second,
            'timezone' => $dc_timezone === 'none' ? 'UTC' : $dc_timezone,
            'timezone_name' =>
                $dc_timezone_name === 'none' ? null : $dc_timezone_name,
            'weekday' => $dc_weekday === 'none' ? null : $dc_weekday,
            'year' => $dc_year === 'none' ? null : $dc_year,
        ];

        // Validate the $date variable
        if (empty($date) || strtotime($date) === false) {
            // Set to current date/time or another default value if invalid
            $date = gmdate('Y-m-d H:i:s');
        }

        try {
            $new_date = new DateTime(
                $date,
                new DateTimeZone($options['timezone']),
            );
        } catch (Exception $e) {
            error_log(__('Failed to create DateTime object: ', 'maxi-blocks') . $e->getMessage());
            return '';
        }

        $content = '';
        $new_format = $dc_custom_date ? $dc_custom_format : $dc_format;

        if ($dc_custom_date) {
            $new_format = self::convert_moment_to_php_date_format(
                $dc_custom_format,
            );
        }

        $new_format = str_replace(
            ['DV', 'DS', 'MS'],
            ['x', 'z', 'c'],
            $new_format,
        );

        $map = [
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
        ];

        $new_format = preg_replace_callback(
            '/(?![^\[]*\])[xzcdDmMyYt]/',
            function ($match) use ($map) {
                return $map[$match[0]];
            },
            $new_format,
        );

        $content = date_i18n($new_format, $new_date->getTimestamp());

        // Regular expression to match square brackets.
        $regex = '/[\[\]]/';

        // Use preg_replace to replace each match with an empty string.
        $content = preg_replace($regex, '', $content);

        return $content;
    }

    public function convert_moment_to_php_date_format($format)
    {
        $replacements = [
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
            'X' => 'U',
        ];

        $format = preg_replace_callback(
            '/\b(' . implode('|', array_keys($replacements)) . ')\b/',
            function ($matches) use ($replacements) {
                return $replacements[$matches[0]];
            },
            $format,
        );

        // Regular expression to match content inside square brackets, including brackets.
        $regex = '/\[[^\]]*\]/';

        // Use preg_replace_callback to replace each match.
        $format = preg_replace_callback(
            $regex,
            function ($matches) {
                // Prepend each symbol with a slash.
                $result = '';
                for ($i = 0; $i < strlen($matches[0]); $i++) {
                    $result .= '\\' . $matches[0][$i];
                }
                return $result;
            },
            $format,
        );

        return $format;
    }

    public function get_limited_string($string, $limit)
    {
        if ($limit > 0 && strlen($string) > $limit) {
            $string = trim($string);
            $truncated = substr($string, 0, $limit);

            // Check if the truncated string has any unclosed HTML tags
            if (preg_match('/<[^>]*$/', $truncated, $matches)) {
                // If there are unclosed tags, remove the last unclosed tag
                $truncated = preg_replace('/<[^>]*$/', '', $truncated);
            }

            $string = $truncated . '…';
        }

        return $string;
    }

    public function get_default_dc_value($target, $obj, $defaults)
    {
        if (
            !is_array($defaults) ||
            !isset($defaults[$target]) ||
            !is_array($obj)
        ) {
            return false;
        }

        if (is_callable($defaults[$target])) {
            return $defaults[$target]($obj);
        }

        return $defaults[$target];
    }

    public function get_dc_value(
        $target,
        $dynamic_content,
        $context_loop,
        $defaults,
        $result
    ) {
        $context_loop_status = isset($context_loop['cl-status'])
            ? $context_loop['cl-status']
            : false;

        $dc_value = isset($dynamic_content['dc-' . $target])
            ? $dynamic_content['dc-' . $target]
            : null;
        $context_loop_value = isset($context_loop['cl-' . $target])
            ? $context_loop['cl-' . $target]
            : null;

        if ($target === 'status') {
            return $dc_value !== null
                ? $dc_value
                : $this->get_default_dc_value($target, $result, $defaults);
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

        if (in_array($relation, self::$order_by_relations) || strpos($relation, 'custom-taxonomy') !== false) {
            if (isset($attributes['dc-order-by'])) {
                return $dictionary[$attributes['dc-order-by']];
            }

            return $dictionary['by-date'];
        }

        return array_key_exists($relation, $dictionary)
            ? $dictionary[$relation]
            : null;
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

        $dynamic_content = array_filter(
            $attributes,
            function ($key) {
                return strpos($key, 'dc-') === 0;
            },
            ARRAY_FILTER_USE_KEY,
        );

        $dynamic_content_keys = array_keys($dynamic_content);
        $context_loop_keys = array_map(function ($key) {
            return str_replace('cl-', 'dc-', $key);
        }, array_keys($context_loop));
        $defaults_keys = array_map(function ($key) {
            return 'dc-' . $key;
        }, array_keys($defaults));

        $values_keys = array_merge(
            $dynamic_content_keys,
            $context_loop_keys,
            $defaults_keys,
        );

        $result = [];

        foreach ($values_keys as $key) {
            $target = str_replace('dc-', '', $key);
            $dc_value = $this->get_dc_value(
                $target,
                $dynamic_content,
                $context_loop,
                $defaults,
                $result,
            );
            $result[$key] = $dc_value;
        }

        return $result;
    }

    public function get_order_by_args(
        $relation,
        $order_by,
        $order,
        $accumulator,
        $type,
        $id,
        $archive_type = null,
        $limit_by_archive = null
    ) {
        if ($type === 'users') {
            $order_by_arg =
                $relation === 'by-date' ? 'user_registered' : 'display_name';
            $limit_key = 'number';
        } else {
            $dictionary = [
                'by-date' => 'date',
                'alphabetical' => 'title',
            ];

            if (in_array($relation, self::$order_by_relations) || strpos($relation, 'custom-taxonomy') !== false) {
                $order_by_arg = $dictionary[$order_by];
            } else {
                $order_by_arg = $dictionary[$relation];
            }

            $limit_key = 'posts_per_page';
        }

        $args = [
            'orderby' => $order_by_arg,
            'order' => $order,
            // $limit_key => $accumulator + 1,
            $limit_key => 1, // Fetch only one post
            'offset' => $accumulator, // Set the offset to get the specific post
        ];

        if ($relation === 'by-category') {
            if ($type === 'products') {
                $args['category'] = [$this->get_term_slug($id)];
            } else {
                $args['cat'] = $id;
            }
        } elseif ($relation === 'by-author') {
            $args['author'] = $id;
        } elseif ($relation === 'by-tag') {
            if ($type === 'products') {
                $args['tag'] = [$this->get_term_slug($id)];
            } else {
                $args['tag_id'] = $id;
            }
        } elseif ($relation === 'current-archive') {
            switch ($archive_type) {
                case 'category':
                    $args['cat'] = $id;
                    break;
                case 'tag':
                    $args['tag_id'] = $id;
                    break;
                case 'author':
                    $args['author'] = $id;
                    break;
                case 'date':
                    // Assuming $id is in the format 'YYYY', 'YYYY-MM', or 'YYYY-MM-DD'
                    $dateParts = explode('-', $id);
                    $args['date_query'] = [
                        'inclusive' => true,
                    ];
                    if (isset($dateParts[0])) {
                        $args['date_query']['year'] = intval($dateParts[0]);
                    }
                    if (isset($dateParts[1])) {
                        $args['date_query']['month'] = intval($dateParts[1]);
                    }
                    if (isset($dateParts[2])) {
                        $args['date_query']['day'] = intval($dateParts[2]);
                    }
                    break;
                default:
                    // Handle other archive types or defaults if necessary
                    $args[$archive_type] = $id;
                    break;
            }
        } elseif (strpos($relation, 'custom-taxonomy') !== false) {
            $relationParts = explode('-', $relation);
            $customTaxonomy = implode('-', array_slice($relationParts, 3));
            $args['tax_query'] = [
                [
                    'taxonomy' => $customTaxonomy,
                    'field' => 'term_id',
                    'terms' => $id,
                ],
            ];
        }

        // Apply current archive filtering if limit_by_archive is 'yes'
        if ($limit_by_archive === 'yes' && $relation !== 'current-archive') {
            $current_archive_info = $this->get_current_archive_type_and_id();

            if (!empty($current_archive_info['type']) && !empty($current_archive_info['id'])) {
                // We need to add additional constraints based on current archive
                $additional_constraints = [];

                switch ($current_archive_info['type']) {
                    case 'category':
                        if ($type === 'products') {
                            // For WooCommerce products, use product_cat taxonomy
                            $additional_constraints['tax_query'] = [
                                [
                                    'taxonomy' => 'product_cat',
                                    'field' => 'term_id',
                                    'terms' => [$current_archive_info['id']],
                                ],
                            ];
                        } else {
                            // For regular posts, use category constraint
                            $additional_constraints['cat'] = $current_archive_info['id'];
                        }
                        break;
                    case 'tag':
                        if ($type === 'products') {
                            // For WooCommerce products, use product_tag taxonomy
                            $additional_constraints['tax_query'] = [
                                [
                                    'taxonomy' => 'product_tag',
                                    'field' => 'term_id',
                                    'terms' => [$current_archive_info['id']],
                                ],
                            ];
                        } else {
                            // For regular posts, use tag constraint
                            $additional_constraints['tag_id'] = $current_archive_info['id'];
                        }
                        break;
                    case 'author':
                        $additional_constraints['author'] = $current_archive_info['id'];
                        break;
                    case 'date':
                        // Parse the date ID format (YYYY or YYYY-MM or YYYY-MM-DD)
                        $date_parts = explode('-', $current_archive_info['id']);
                        $additional_constraints['date_query'] = [
                            'inclusive' => true,
                        ];
                        if (isset($date_parts[0])) {
                            $additional_constraints['date_query']['year'] = intval($date_parts[0]);
                        }
                        if (isset($date_parts[1])) {
                            $additional_constraints['date_query']['month'] = intval($date_parts[1]);
                        }
                        if (isset($date_parts[2])) {
                            $additional_constraints['date_query']['day'] = intval($date_parts[2]);
                        }
                        break;
                }

                // Handle custom taxonomy archives
                if (isset($current_archive_info['tax_query'])) {
                    $additional_constraints['tax_query'] = $current_archive_info['tax_query'];
                }

                // Merge the additional constraints with existing args
                foreach ($additional_constraints as $key => $value) {
                    if ($key === 'tax_query') {
                        // Handle tax_query merging specially
                        if (isset($args['tax_query'])) {
                            // If we already have a tax_query, we need to combine them with 'AND' relation
                            $args['tax_query'] = [
                                'relation' => 'AND',
                                $args['tax_query'][0], // Existing tax query
                                $value[0], // New archive constraint
                            ];
                        } else {
                            // No existing tax_query, just set it
                            $args['tax_query'] = $value;
                        }
                    } elseif ($key === 'date_query') {
                        // Handle date_query merging
                        if (isset($args['date_query'])) {
                            // Merge date queries with 'AND' relation
                            $args['date_query'] = [
                                'relation' => 'AND',
                                $args['date_query'],
                                $value,
                            ];
                        } else {
                            $args['date_query'] = $value;
                        }
                    } else {
                        // For other constraints, just set them (they should not conflict)
                        $args[$key] = $value;
                    }
                }
            }
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
                $id,
            ),
        );

        if (!empty($block_meta)) {
            $block_meta_parsed = json_decode($block_meta, true);
            $response = $block_meta_parsed['dynamic_content'] ?? [];
            return $response;
        }
    }

    /**
     * Return CL for blocks without DC (for pagination)
     *
     * @param string $unique_id
     */
    public function get_cl(string $id)
    {
        global $wpdb;

        $block_meta = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT custom_data_value FROM {$wpdb->prefix}maxi_blocks_custom_data_blocks WHERE block_style_id = %s",
                $id,
            ),
        );

        if (!empty($block_meta)) {
            $block_meta_parsed = json_decode($block_meta, true);
            $response = $block_meta_parsed['context_loop'][$id] ?? [];
            return $response;
        }
    }

    public function get_term_slug($id)
    {
        $term = get_term($id);

        // Check if $term is a WP_Error
        if (is_wp_error($term)) {
            return '';
        }

        if ($term) {
            return $term->slug;
        }

        return '';
    }

    public function get_custom_post_types()
    {
        $args = [
            'public' => true,
            '_builtin' => false,
        ];

        // Post types supported by maxi, that are not built in WP post types
        $supported_post_types = ['product'];

        $post_types = array_diff(get_post_types($args), $supported_post_types);

        return $post_types;
    }

    public function get_custom_taxonomies()
    {
        $args = [
            'public' => true,
            '_builtin' => false,
        ];

        // Taxonomies supported by maxi, that are not built in WP taxonomies
        $supported_taxonomies = ['product_cat', 'product_tag'];

        $taxonomies = array_diff(get_taxonomies($args), $supported_taxonomies);

        return $taxonomies;
    }

    /**
     * Check if a post is repeated based on the post ID and dynamic content accumulator.
     *
     * @param int|null $post_id The ID of the post to check.
     * @param string|null $dc_accumulator The dynamic content accumulator string.
     * @return bool True if the post is repeated, false otherwise.
     */
    private function is_repeated_post($post_id, $dc_accumulator)
    {
        // Check if either $post_id or $dc_accumulator is not set
        if (!isset($post_id) || !isset($dc_accumulator)) {
            return false;
        }

        // Check if the current post ID matches the global post ID
        // and the current accumulator is different from the global accumulator
        if (
            self::$global_dc_id_cl === $post_id &&
            self::$global_dc_accumulator_cl !== $dc_accumulator
        ) {
            return true;
        }

        // Update the global accumulator and post ID with the current values
        self::$global_dc_accumulator_cl = $dc_accumulator;
        self::$global_dc_id_cl = $post_id;

        return false;
    }

    public function check_if_content_is_empty($attributes, $content)
    {
        $blocks_to_check = [
            'container-maxi',
            'row-maxi',
            'column-maxi',
            'group-maxi',
        ];

        if (
            isset($attributes['uniqueID']) &&
            ((isset($attributes['cl-status']) && $attributes['cl-status']) ||
                (isset($attributes['dc-status']) && $attributes['dc-status']) ||
                (isset($attributes['dc-hide']) && $attributes['dc-hide']))
        ) {
            $unique_id = $attributes['uniqueID'];

            foreach ($blocks_to_check as $block) {
                if (strpos($unique_id, $block) !== false) {
                    // Replace the invalid parts of the data-stroke attribute
                    $content_sanitized = str_replace(
                        ',1))"#081219"',
                        ',1))"',
                        $content,
                    );
                    $content_sanitized = str_replace(
                        ',1))\\u0022#081219\\u0022',
                        ',1))\\u0022',
                        $content_sanitized,
                    );

                    // Remove <div> elements containing <svg> with the class 'maxi-background-displayer__svg'
                    $content_sanitized = preg_replace(
                        '/<div[^>]*class="[^"]*maxi-background-displayer__svg[^"]*"[^>]*>.*?<\/div>/s',
                        '',
                        $content_sanitized,
                    );

                    $allowed_tags = '<svg><img><iframe><hr>';
                    $text_content = strip_tags(
                        $content_sanitized ?? '',
                        $allowed_tags,
                    );

                    // Trim the text content to remove leading and trailing whitespace
                    $trimmed_text_content = trim($text_content);

                    // Check if the trimmed text content contains only "No content found" and spaces
                    if (
                        empty($trimmed_text_content) ||
                        preg_match(
                            '/^(?:\s*No content found\s*)+$/',
                            $trimmed_text_content,
                        ) ||
                        preg_match('/^\s*$/', $trimmed_text_content)
                    ) {
                        return true;
                    }
                    break;
                }
            }
        }
        return false;
    }

    /**
     * XOR obfuscation function for email address
     *
     * @param string $email The email to obfuscate
     * @param string $key The key to XOR with (could be a single character or a string)
     * @return string The obfuscated email, base64 encoded for safe transmission
     */
    public function xor_obfuscate_email($email, $key = 'K')
    {
        $obfuscated = '';
        for ($i = 0; $i < strlen($email); $i++) {
            $obfuscated .= $email[$i] ^ $key[$i % strlen($key)];
        }
        return base64_encode($obfuscated); // Base64 encode to safely pass through HTML
    }
}
