<?php

if (!defined('ABSPATH')) {
    exit();
}

require_once MAXI_PLUGIN_DIR_PATH . 'core/class-maxi-local-fonts.php';

if (!class_exists('MaxiBlocks_Custom_Fonts')):
    class MaxiBlocks_Custom_Fonts
    {
        public static function get_fonts()
        {
            $fonts = get_option('maxi_blocks_custom_fonts', []);

            if (!is_array($fonts)) {
                $fonts = [];
            }

            return $fonts;
        }

        public static function get_fonts_indexed_by_value()
        {
            $fonts = self::get_fonts();
            $response = [];
            $local_fonts = MaxiBlocks_Local_Fonts::get_instance();

            foreach ($fonts as $font) {
                $value = isset($font['value']) ? $font['value'] : '';

                if (empty($value)) {
                    continue;
                }

                $response[$value] = [
                    'id' => isset($font['id']) ? $font['id'] : '',
                    'value' => $value,
                    'files' => isset($font['files']) ? $font['files'] : [],
                    'variants' => isset($font['variants'])
                        ? $font['variants']
                        : [],
                    'source' => 'custom',
                ];

                $stylesheet = $local_fonts->get_or_create_custom_font_stylesheet_url(
                    $value,
                    $font,
                );

                if ($stylesheet) {
                    $response[$value]['stylesheet'] = $stylesheet;
                }
            }

            return $response;
        }

        public static function add_font_from_attachment($family, $attachment_id)
        {
            return self::add_font_with_variants($family, [
                [
                    'attachment_id' => $attachment_id,
                ],
            ]);
        }

        public static function add_font_with_variants($family, $variants_param)
        {
            $family = sanitize_text_field($family);

            if ('' === $family) {
                return new WP_Error(
                    'invalid_font_family',
                    __('Font family is required.', 'maxi-blocks'),
                    ['status' => 400],
                );
            }

            if (!is_array($variants_param) || empty($variants_param)) {
                return new WP_Error(
                    'invalid_font_variants',
                    __('At least one font file is required.', 'maxi-blocks'),
                    ['status' => 400],
                );
            }

            // Get existing fonts - ensure it's an associative array
            $fonts = self::get_fonts();
            if (!is_array($fonts)) {
                $fonts = [];
            }
            // Ensure we have an associative array, not a list
            if (array_values($fonts) === $fonts && !empty($fonts)) {
                // Convert numeric array back to associative if needed
                $temp = [];
                foreach ($fonts as $font) {
                    if (isset($font['id'])) {
                        $temp[$font['id']] = $font;
                    }
                }
                $fonts = $temp;
            }
            $normalized_variants = [];
            $new_files = [];

            foreach ($variants_param as $variant) {
                $normalized = self::normalize_font_variant($variant);

                if (is_wp_error($normalized)) {
                    return $normalized;
                }

                if (empty($normalized)) {
                    continue;
                }

                $new_files[$normalized['key']] = esc_url_raw($normalized['url']);
                $normalized_variants[] = [
                    'weight' => $normalized['weight'],
                    'style' => $normalized['style'],
                    'attachment_id' => $normalized['attachment_id'],
                    'mime_type' => $normalized['mime_type'],
                    'url' => $normalized['url'],
                ];
            }

            if (empty($new_files)) {
                return new WP_Error(
                    'invalid_font_files',
                    __('No valid font files were provided.', 'maxi-blocks'),
                    ['status' => 400],
                );
            }

            $id = sanitize_title($family);
            if ('' === $id) {
                $id = sanitize_title(uniqid($family . '_', true));
            }
            $original_id = $id;
            $suffix = 2;

            while (
                isset($fonts[$id]) &&
                strtolower($fonts[$id]['value']) !== strtolower($family)
            ) {
                $id = $original_id . '-' . $suffix;
                $suffix++;
            }

            $existing_font = isset($fonts[$id]) ? $fonts[$id] : null;
            $is_same_family =
                $existing_font &&
                isset($existing_font['value']) &&
                strtolower($existing_font['value']) === strtolower($family);

            if ($is_same_family) {
                $existing_files = isset($existing_font['files']) &&
                    is_array($existing_font['files'])
                    ? $existing_font['files']
                    : [];
                $existing_variants = isset($existing_font['variants']) &&
                    is_array($existing_font['variants'])
                    ? $existing_font['variants']
                    : [];

                $fonts[$id]['files'] = array_merge(
                    $existing_files,
                    $new_files,
                );
                $fonts[$id]['variants'] = self::merge_variants(
                    $existing_variants,
                    $normalized_variants,
                );
            } else {
                $fonts[$id] = [
                    'id' => $id,
                    'value' => $family,
                    'files' => $new_files,
                    'variants' => $normalized_variants,
                    'source' => 'custom',
                ];
            }

            self::persist_fonts($fonts);

            $local_fonts = MaxiBlocks_Local_Fonts::get_instance();
            $local_fonts->regenerate_custom_font_stylesheet($family, $fonts[$id]);

            return $fonts[$id];
        }

        public static function delete_font($font_id)
        {
            $fonts = self::get_fonts();

            if (!isset($fonts[$font_id])) {
                return new WP_Error(
                    'font_not_found',
                    __('The requested font does not exist.', 'maxi-blocks'),
                    ['status' => 404],
                );
            }

            $font = $fonts[$font_id];

            if (!empty($font['variants']) && is_array($font['variants'])) {
                foreach ($font['variants'] as $variant) {
                    if (!empty($variant['attachment_id'])) {
                        wp_delete_attachment(
                            (int) $variant['attachment_id'],
                            true,
                        );
                    }
                }
            }

            unset($fonts[$font_id]);
            self::persist_fonts($fonts);

            if (isset($font['value'])) {
                $local_fonts = MaxiBlocks_Local_Fonts::get_instance();
                $local_fonts->remove_custom_font_stylesheet($font['value']);
            }

            return true;
        }

        private static function persist_fonts(array $fonts)
        {
            update_option('maxi_blocks_custom_fonts', $fonts, false);
        }

        private static function merge_variants($existing, $new)
        {
            if (!is_array($existing)) {
                $existing = [];
            }

            $merged = [];
            $index = [];

            foreach ($existing as $variant) {
                if (!isset($variant['weight']) || !isset($variant['style'])) {
                    continue;
                }
                $key = strtolower($variant['weight']) . '|' . strtolower($variant['style']);
                $merged[$key] = $variant;
                $index[$key] = true;
            }

            foreach ($new as $variant) {
                if (!isset($variant['weight']) || !isset($variant['style'])) {
                    continue;
                }
                $key = strtolower($variant['weight']) . '|' . strtolower($variant['style']);
                $merged[$key] = $variant;
                $index[$key] = true;
            }

            return array_values($merged);
        }

        private static function normalize_font_variant($variant)
        {
            if (!is_array($variant)) {
                return new WP_Error(
                    'invalid_font_variant',
                    __('Invalid font variant provided.', 'maxi-blocks'),
                    ['status' => 400],
                );
            }

            $attachment_id = isset($variant['attachment_id'])
                ? absint($variant['attachment_id'])
                : 0;

            if (!$attachment_id) {
                return new WP_Error(
                    'invalid_attachment',
                    __('Invalid font attachment ID provided.', 'maxi-blocks'),
                    ['status' => 400],
                );
            }

            $attachment = get_post($attachment_id);

            if (!$attachment || 'attachment' !== $attachment->post_type) {
                return new WP_Error(
                    'invalid_attachment',
                    __('Invalid font attachment provided.', 'maxi-blocks'),
                    ['status' => 400],
                );
            }

            $mime_type = get_post_mime_type($attachment_id);

            if (!self::is_allowed_font_mime($mime_type)) {
                return new WP_Error(
                    'invalid_font_mime',
                    __('Unsupported font file type.', 'maxi-blocks'),
                    ['status' => 400],
                );
            }

            // Check if weight, style, and url are already provided
            $weight = isset($variant['weight']) ? $variant['weight'] : '';
            $style = isset($variant['style']) ? $variant['style'] : '';
            $url = isset($variant['url']) ? $variant['url'] : '';

            // If weight or style is missing, detect from attachment
            if (empty($weight) || empty($style)) {
                $local_fonts = MaxiBlocks_Local_Fonts::get_instance();
                $attributes = $local_fonts->detect_font_attributes_from_attachment(
                    $attachment_id,
                );

                if (is_wp_error($attributes)) {
                    return $attributes;
                }

                // For single variant detection, take the first one
                if (is_array($attributes) && !empty($attributes)) {
                    $first_variant = $attributes[0];
                    $weight = isset($first_variant['weight']) ? $first_variant['weight'] : '';
                    $style = isset($first_variant['style']) ? $first_variant['style'] : '';
                }
            }

            // Get URL if not provided
            if (empty($url)) {
                $url = wp_get_attachment_url($attachment_id);

                if (!$url) {
                    return new WP_Error(
                        'missing_font_url',
                        __('Unable to determine the font file URL.', 'maxi-blocks'),
                        ['status' => 400],
                    );
                }
            }

            $key = self::build_variant_key($weight, $style);

            return [
                'weight' => $weight,
                'style' => $style,
                'key' => $key,
                'attachment_id' => $attachment_id,
                'mime_type' => $mime_type,
                'url' => $url,
            ];
        }

        private static function build_variant_key($weight, $style)
        {
            $weight = (string) $weight;
            $style = strtolower($style);

            if ('italic' === $style) {
                return '400' === $weight || 'normal' === $weight
                    ? 'italic'
                    : $weight . 'italic';
            }

            return $weight ?: '400';
        }

        private static function is_allowed_font_mime($mime_type)
        {
            $allowed_mimes = [
                'font/ttf',
                'font/otf',
                'font/woff',
                'font/woff2',
                'application/font-sfnt',
                'application/x-font-ttf',
                'application/x-font-otf',
                'application/font-woff',
                'application/x-font-woff',
                'application/x-font-woff2',
            ];

            return in_array($mime_type, $allowed_mimes, true);
        }
    }
endif;
