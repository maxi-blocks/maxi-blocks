<?php

if (!defined('ABSPATH')) {
    exit();
}


class MaxiBlocks_Style_Utils
{
    private static ?self $instance = null;

    public static function register(): void
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

    public function get_id(bool $is_template = false): int|string|null
    {
        if (!$is_template) {
            global $post;

            if (!$post) {
                return null;
            }

            return $post->ID;
        }

        $template_slug = get_page_template_slug();
        $template_id = $this->get_template_name() . '//';

        if ($template_slug != '' && $template_slug !== false) {
            if(is_search()) {
                $template_id .= 'search';
            } else {
                $template_id .= $template_slug;
            }
        } elseif (is_home() || is_front_page()) {
            /** @disregard P1010 Undefined type */
            $block_templates = get_block_templates(['slug__in' => ['index', 'front-page', 'home']]);

            $has_front_page_and_home = count($block_templates) > 2;

            if ($has_front_page_and_home) {
                if (is_home() && !is_front_page()) {
                    $template_id .= 'home';
                } else {
                    $template_id .= in_array('front-page', array_column($block_templates, 'slug')) ? 'front-page' : 'home';
                }
            } else {
                // Arrived here, means we are probably trying to get index.php; so if the slug is not coming from $block_templates,
                // we need to start going down on the WP hierarchy to find the correct template.
                // TODO: create a better way to get the correct template.
                if ($block_templates && !empty($block_templates)) {
                    $template_id .= $block_templates[0]->slug;
                } elseif (is_search()) {
                    $template_id .= 'search';
                } elseif (is_404()) {
                    $template_id .= '404';
                } elseif (is_archive()) {
                    $template_id .= 'archive';
                } elseif (is_page()) {
                    $template_id .= 'page';
                } else {
                    $template_id .= 'single';
                }
            }
        } elseif (is_search()) {
            $template_id .= 'search';
        } elseif (is_404()) {
            $template_id .= '404';
        } elseif (is_category()) {
            $template_id .= 'category';
        } elseif (is_tag()) {
            $template_id .= 'tag';
        } elseif (is_author()) {
            $template_id .= 'author';
        } elseif (is_date()) {
            $template_id .= 'date';
        } elseif (is_archive()) {
            $template_id .= 'archive';
        } elseif (is_page()) {
            $template_id .= 'page';
        } else {
            $template_id .= 'single';
        }

        return $template_id;
    }

    public function get_template_name()
    {
        $template_name = wp_get_theme()->stylesheet ?? get_template();

        return $template_name;
    }
}
