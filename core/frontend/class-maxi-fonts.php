<?php

if (!defined('ABSPATH')) {
    exit();
}


class MaxiBlocks_Fonts_Processor
{
    private static ?MaxiBlocks_Fonts_Processor $instance = null;

    public static function register(): MaxiBlocks_Fonts_Processor
    {
        if (null === self::$instance) {
            self::$instance = new MaxiBlocks_Fonts_Processor();
        }

        return self::$instance;
    }

    public function enqueue_fonts(array $fonts, string $name): void
    {

        if (empty($fonts) || !is_array($fonts)) {
            return;
        }

        foreach ($fonts as $font => $values) {
            foreach ($values as $attribute => $value) {
                if (is_array($value)) {
                    $fonts[$font][$attribute] = array_values(array_unique($value))[0];
                }
            }
        }

        if (str_contains($name, '-templates-')) {
            $pattern = '/(-templates-)(\w*)/';
            $name = preg_replace($pattern, '', $name);
            $name = str_replace('style', 'styles', $name);
        }

        $use_local_fonts = (bool) get_option('local_fonts');

        $loaded_fonts = [];

        foreach ($fonts as $font => $font_data) {
            $is_sc_font = strpos($font, 'sc_font') !== false;

            if ($is_sc_font) {
                $split_font = explode('_', str_replace('sc_font_', '', $font));
                $block_style = $split_font[0];
                $text_level = $split_font[1];

                if (class_exists('MaxiBlocks_StyleCards')) {
                    $sc_fonts = MaxiBlocks_StyleCards::get_maxi_blocks_style_card_fonts($block_style, $text_level);
                    @list($font, $font_weights, $font_styles) = $sc_fonts;
                }

                if (isset($font_data['weight']) && !in_array($font_data['weight'], $font_weights)) {
                    $font_weights = [[...$font_weights, intval($font_data['weight'])]];
                }

                if (isset($font_data['style']) && !in_array($font_data['style'], $font_styles)) {
                    $font_styles = [[...$font_styles, intval($font_data['style'])]];
                }
            }

            if ($font) {
                if (!$is_sc_font) {
                    if ($use_local_fonts) {
                        $font_name_sanitized = str_replace(
                            ' ',
                            '',
                            strtolower($font)
                        );
                        $font_url =
                            wp_upload_dir()['baseurl'] .
                            '/maxi/fonts/' .
                            $font_name_sanitized .
                            '/style.css';
                    } else {
                        $font_url = "https://fonts.googleapis.com/css2?family=$font:";
                    }

                    if (!$use_local_fonts) {
                        $local_fonts = new MaxiBlocks_Local_Fonts();
                        $font_url = $local_fonts->generateFontURL(
                            $font_url,
                            $font_data
                        );
                    }

                    if (!$use_local_fonts) {
                        if ($font_url) {
                            if ($this->check_font_url($font_url)) {
                                wp_enqueue_style(
                                    $name . '-font-' . sanitize_title_with_dashes($font),
                                    $font_url,
                                    array(),
                                    MAXI_PLUGIN_VERSION,
                                    'all'
                                );
                            }
                        }
                    } else {
                        if ($font_url) {
                            wp_enqueue_style(
                                $name . '-font-' . sanitize_title_with_dashes($font),
                                $font_url,
                                array(),
                                MAXI_PLUGIN_VERSION
                            );
                        }
                    }
                } else {
                    if (empty($font_weights)) {
                        $font_weights = [$font_data['weight']];
                    }
                    if (empty($font_styles) && isset($font_data['style'])) {
                        $font_styles = [$font_data['style']];
                    } else {
                        $font_styles = ['normal'];
                    }

                    if ($use_local_fonts) {
                        $font_name_sanitized = str_replace(
                            ' ',
                            '',
                            strtolower($font)
                        );
                        $font_url =
                            wp_upload_dir()['baseurl'] .
                            '/maxi/fonts/' .
                            $font_name_sanitized .
                            '/style.css';
                    } else {
                        $font_url = "https://fonts.googleapis.com/css2?family=$font";
                    }


                    if ($font_url && !$use_local_fonts) {
                        $font_url .= ':';
                    }

                    foreach ($font_weights as $font_weight) {
                        if(!$font_weight) {
                            continue;
                        }

                        foreach ($font_styles as $font_style) {
                            if(!is_array($font_weight)) {
                                $font_weight = [ $font_weight ];
                            }

                            $already_loaded = false;

                            if (in_array(
                                [
                                    'font' => $font,
                                    'font_weight' => $font_weight,
                                    'font_style' => $font_style,
                                ],
                                $loaded_fonts
                            )) {
                                $already_loaded = true;
                            }

                            foreach ($font_weight as $weight) {
                                foreach ($loaded_fonts as $loaded_font) {
                                    if (in_array($weight, $loaded_font['font_weight']) && $loaded_font['font'] === $font) {
                                        $already_loaded = true;
                                    }
                                }
                            }

                            if ($already_loaded) {
                                continue;
                            }

                            $font_data = [
                                'weight' => $font_weight,
                                'style' => $font_style,
                            ];

                            if (!$use_local_fonts) {
                                $local_fonts = new MaxiBlocks_Local_Fonts();
                                $font_url = $local_fonts->generateFontURL(
                                    $font_url,
                                    $font_data
                                );
                            }

                            $loaded_fonts[] = [
                                'font' => $font,
                                'font_weight' => $font_weight,
                                'font_style' => $font_style,
                            ];

                            if (is_array($font_weight)) {
                                $font_weight = implode('-', $font_weight);
                            }

                            if(is_array($font_style)) {
                                $font_style = implode('-', $font_style);
                            }

                            if (!$use_local_fonts) {

                                if ($font_url) {
                                    if ($this->check_font_url($font_url)) {
                                        wp_enqueue_style(
                                            $name . '-font-' . sanitize_title_with_dashes($font . '-' . $font_weight . '-' . $font_style),
                                            $font_url,
                                            array(),
                                            MAXI_PLUGIN_VERSION,
                                            'all'
                                        );
                                    } else {  // Load default font weight for cases where the saved font weight doesn't exist
                                        $font_url = strstr($font_url, ':wght', true);
                                        wp_enqueue_style(
                                            $name . '-font-' . sanitize_title_with_dashes($font),
                                            $font_url,
                                            array(),
                                            MAXI_PLUGIN_VERSION,
                                            'all'
                                        );
                                    }
                                }
                            } else {
                                if ($font_url) {
                                    wp_enqueue_style(
                                        $name . '-font-' . sanitize_title_with_dashes($font . '-' . $font_weight . '-' . $font_style),
                                        $font_url,
                                        array(),
                                        MAXI_PLUGIN_VERSION
                                    );
                                }
                            }
                        }
                    }
                }
            }
        }

        if ($use_local_fonts) {
            add_filter(
                'style_loader_tag',
                function ($html, $handle) {
                    if (strpos($handle, 'maxi-blocks-styles-font-') !== false || strpos($handle, 'maxi-blocks-style-templates-header-font-') !== false) {
                        $html = str_replace(
                            "rel='stylesheet'",
                            "rel='stylesheet preload'",
                            $html
                        );
                    }
                    return $html;
                },
                10,
                2
            );
        }
    }

    /**
     * Legacy function
     * Check font url status code
     */
    public function check_font_url(string $font_url): bool
    {
        $font_url = str_replace(' ', '+', $font_url);

        $array = @get_headers($font_url);

        if (!$array) {
            return false;
        }

        $string = $array[0];

        if (strpos($string, '200')) {
            return true;
        } else {
            return false;
        }
    }
}
