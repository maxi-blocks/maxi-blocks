<?php

if (!defined('ABSPATH')) {
    exit();
}


class MaxiBlocks_Templates_Processor
{
    private static ?self $instance = null;

    public static function register()
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }
    }

    public static function get_instance(): self
    {
        self::register();
        return self::$instance;
    }

    /**
     * Fetches blocks from template and template parts based on the template slug.
     *
     * @param string $template_id The ID of the template you want to fetch.
     * @return array
    */
    public function fetch_blocks_by_template_id($template_id)
    {
        global $wpdb;

        $parts = explode('//', $template_id);
        $template_slug = isset($parts[1]) ? $parts[1] : null;
        // Initialize the array to store all the blocks.
        $all_blocks = [];
        $templates = [];

        // First, check for the existence of wp_template(s) with the post_name equal to the template_slug.
        if ($template_slug !== null) {
            $templates = $wpdb->get_results(
                $wpdb->prepare(
                    "SELECT * FROM {$wpdb->prefix}posts WHERE post_type = 'wp_template' AND post_name LIKE %s AND post_status = 'publish'",
                    '%' . $wpdb->esc_like($template_slug) . '%'
                )
            );
        }

        if($template_slug === 'home') {
            // First, check for the existence of wp_template(s) with the post_name equal to the template_slug.
            $templates_home = $wpdb->get_results(
                $wpdb->prepare(
                    "SELECT * FROM {$wpdb->prefix}posts WHERE post_type = 'wp_template' AND post_name = %s AND post_status = 'publish'",
                    'blog'
                )
            );
            $templates = array_merge($templates, $templates_home);
        }

        foreach ($templates as $template) {
            // Parse blocks for each template.
            $template_blocks = parse_blocks($template->post_content);
            $all_blocks = array_merge_recursive($all_blocks, $template_blocks);
        }

        // Fetch the 'header' and 'footer' template parts.
        $template_parts = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT * FROM {$wpdb->prefix}posts WHERE post_type = 'wp_template_part' AND (post_name LIKE %s OR post_name LIKE %s) AND post_status = 'publish'",
                '%header%',
                '%footer%'
            )
        );

        foreach ($template_parts as $template_part) {
            $part_blocks = parse_blocks($template_part->post_content);
            $all_blocks = array_merge_recursive($all_blocks, $part_blocks);
        }

        if (get_template() === 'maxiblocks' || get_template() === 'maxiblocks-go') {
            $templates_blocks = $this->fetch_blocks_from_beta_maxi_theme_templates($template_id);
            if($templates_blocks) {
                $all_blocks = array_merge_recursive($all_blocks, $templates_blocks);
            }
        }

        return $all_blocks;
    }

    public function fetch_blocks_from_beta_maxi_theme_template_parts($template_id)
    {
        $all_blocks = [];
        $theme_directory = get_template_directory();
        $parts_directory = $theme_directory . '/parts/';

        // Get a list of HTML files in the parts directory
        $file = $parts_directory . $template_id . '.html';
        if (!file_exists($file)) {
            return [];
        }

        global $wp_filesystem;

        if (empty($wp_filesystem)) {
            require_once ABSPATH . 'wp-admin/includes/file.php';
            WP_Filesystem();
        }

        $file_contents = $wp_filesystem->get_contents($file);
        if (!$file_contents) {
            return [];
        }

        // Example: Using DOMDocument to parse the HTML
        $dom = new DOMDocument();
        @$dom->loadHTML($file_contents);

        // Example: Extract all the text from the HTML
        $text_content = $dom->textContent;
        $part_blocks = parse_blocks($text_content);
        $all_blocks = array_merge_recursive($all_blocks, $part_blocks);

        $pattern = '/<!-- wp:pattern \{"slug":"((?:maxiblocks|maxiblocks-go)\/[^"]+)"\} \/-->/';
        preg_match_all($pattern, $file_contents, $matches);

        if (!empty($matches[1])) {
            foreach ($matches[1] as $slug) {
                $parsed_blocks = $this->fetch_blocks_from_beta_maxi_theme_patterns($slug);
                $all_blocks = array_merge_recursive($all_blocks, $parsed_blocks);
            }
        }

        return $all_blocks;
    }

    public function fetch_blocks_from_beta_maxi_theme_templates(string $template_id)
    {
        if (get_template() !== 'maxiblocks' && get_template() !== 'maxiblocks-go') {
            return;
        }
        $all_blocks = [];

        $parts = explode('//', $template_id);
        if (!isset($parts[0]) || ($parts[0] !== 'maxiblocks' && $parts[0] !== 'maxiblocks-go')) {
            return;
        }

        $template_slug = isset($parts[1]) ? $parts[1] : null;

        if (!$template_slug) {
            return;
        }

        if ($template_slug === 'index') {
            if (is_front_page() && is_home()) {
                // Default homepage
                $template_slug = 'home';
            } elseif (is_front_page()) {
                // Static homepage
                $template_slug = 'front-page';
            } elseif (is_home()) {
                // Blog page
                $template_slug = 'home';
            } else {
                // Fallback to index.html for other cases
                $template_slug = 'index';
            }
        }

        $theme_directory = get_template_directory();
        $template_directory = $theme_directory . '/templates/';
        $file = $template_directory . $template_slug . '.html';

        if (!file_exists($file)) {
            $header_blocks = $this->fetch_blocks_from_beta_maxi_theme_template_parts('header');
            $all_blocks = array_merge_recursive($all_blocks, $header_blocks);

            $footer_blocks = $this->fetch_blocks_from_beta_maxi_theme_template_parts('footer');
            $all_blocks = array_merge_recursive($all_blocks, $footer_blocks);
            return $all_blocks;
        }

        global $wp_filesystem;
        if (empty($wp_filesystem)) {
            require_once ABSPATH . '/wp-admin/includes/file.php';
            WP_Filesystem();
        }

        $file_contents = $wp_filesystem->get_contents($file);
        if (!$file_contents) {
            return;
        }

        if (strpos($file_contents, '"slug":"header"') !== false) {
            $header_blocks = $this->fetch_blocks_from_beta_maxi_theme_template_parts('header');
            $all_blocks = array_merge_recursive($all_blocks, $header_blocks);
        }

        if (strpos($file_contents, '"slug":"footer"') !== false) {
            $footer_blocks = $this->fetch_blocks_from_beta_maxi_theme_template_parts('footer');
            $all_blocks = array_merge_recursive($all_blocks, $footer_blocks);
        }

        $pattern = '/<!-- wp:pattern \{"slug":"((?:maxiblocks|maxiblocks-go)\/[^"]+)"\} \/-->/';
        preg_match_all($pattern, $file_contents, $matches);

        if (!empty($matches[1])) {
            foreach ($matches[1] as $slug) {
                $parsed_blocks = $this->fetch_blocks_from_beta_maxi_theme_patterns($slug);
                $all_blocks = array_merge_recursive($all_blocks, $parsed_blocks);
            }
        }

        return $all_blocks;
    }

    private function fetch_blocks_from_beta_maxi_theme_patterns(string $pattern_id): array
    {
        $all_blocks = [];
        $parts = explode('/', $pattern_id);
        if (!isset($parts[0]) || ($parts[0] !== 'maxiblocks' && $parts[0] !== 'maxiblocks-go')) {
            return [];
        }

        $pattern_slug = isset($parts[1]) ? $parts[1] : null;

        if (!$pattern_slug) {
            return [];
        }

        $theme_directory = get_template_directory();
        $html_pattern = $theme_directory . '/patterns/' . $pattern_slug . '.html';
        $php_pattern = $theme_directory . '/patterns/' . $pattern_slug . '.php';

        $pattern_file = '';

        if (file_exists($html_pattern)) {
            $pattern_file = $html_pattern;
        } elseif (file_exists($php_pattern)) {
            $pattern_file = $php_pattern;
        }

        if (!empty($pattern_file)) {
            global $wp_filesystem;
            if (empty($wp_filesystem)) {
                require_once ABSPATH . '/wp-admin/includes/file.php';
                WP_Filesystem();
            }

            $file_contents = $wp_filesystem->get_contents($pattern_file);

            if (!$file_contents) {
                return [];
            }

            $pattern_blocks = parse_blocks($file_contents);
            $all_blocks = array_merge_recursive($all_blocks, $pattern_blocks);
        }

        return $all_blocks;
    }
}
