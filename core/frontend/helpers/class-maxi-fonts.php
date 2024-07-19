<?php

if (!defined('ABSPATH')) {
    exit();
}

class MaxiBlocks_Fonts_Processor
{
    private static ?self $instance = null;
    private bool $use_local_fonts;
    private bool $use_bunny_fonts;
    private array $fonts_to_load = [];

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

    public function enqueue_fonts(array $fonts, string $name): void
    {
        if (empty($fonts) || !is_array($fonts)) {
            return;
        }

        $this->update_options();

        $fonts = $this->normalize_fonts($fonts);
        $name = $this->normalize_name($name);

        foreach ($fonts as $font => $font_data) {
            $is_sc_font = strpos($font, 'sc_font') !== false;

            if ($is_sc_font) {
                $this->process_sc_font($font, $font_data, $name);
            } else {
                $this->process_regular_font($font, $font_data, $name);
            }
        }

        $this->enqueue_collected_fonts();
        $this->add_preload_filter();
    }

    private function update_options(): void
    {
        $this->use_local_fonts = (bool) get_option('local_fonts');
        $this->use_bunny_fonts = (bool) get_option('bunny_fonts');
    }

    private function normalize_fonts(array $fonts): array
    {
        foreach ($fonts as $font => $values) {
            foreach ($values as $attribute => $value) {
                if (is_array($value)) {
                    $fonts[$font][$attribute] = array_values(array_unique($value))[0];
                }
            }
        }
        return $fonts;
    }

    private function normalize_name(string $name): string
    {
        if (str_contains($name, '-templates-')) {
            $pattern = '/(-templates-)(\w*)/';
            $name = preg_replace($pattern, '', $name);
            $name = str_replace('style', 'styles', $name);
        }
        return $name;
    }

    private function process_sc_font(string $font, array $font_data, string $name): void
    {
        list($font, $font_weights, $font_styles) = $this->get_sc_font_data($font, $font_data);

        if (empty($font_weights)) {
            $font_weights = [$font_data['weight']];
        }
        if (empty($font_styles)) {
            $font_styles = isset($font_data['style']) ? [$font_data['style']] : ['normal'];
        }

        $this->add_font_to_load($font, $font_weights, $font_styles, $name);
    }

    private function get_sc_font_data(string $font, array $font_data): array
    {
        $split_font = explode('_', str_replace('sc_font_', '', $font));
        $block_style = $split_font[0];
        $text_level = $split_font[1];

        if (class_exists('MaxiBlocks_StyleCards')) {
            $sc_fonts = MaxiBlocks_StyleCards::get_maxi_blocks_style_card_fonts($block_style, $text_level);
            @list($font, $font_weights, $font_styles) = $sc_fonts;
        }

        if (isset($font_data['weight']) && !in_array($font_data['weight'], $font_weights)) {
            $font_weights = [...$font_weights, intval($font_data['weight'])];
        }

        if (isset($font_data['style']) && !in_array($font_data['style'], $font_styles)) {
            $font_styles = [...$font_styles, intval($font_data['style'])];
        }

        return [$font, $font_weights, $font_styles];
    }

    private function process_regular_font(string $font, array $font_data, string $name): void
    {
        $font_weights = explode(',', $font_data['weight']);
        $font_styles = explode(',', $font_data['style']);
        $this->add_font_to_load($font, $font_weights, $font_styles, $name);
    }

    private function add_font_to_load(string $font, array $font_weights, array $font_styles, string $name): void
    {
        if (!isset($this->fonts_to_load[$font])) {
            $this->fonts_to_load[$font] = [
                'weights' => [],
                'styles' => [],
                'name' => $name,
            ];
        }

        $this->fonts_to_load[$font]['weights'] = array_unique(array_merge($this->fonts_to_load[$font]['weights'], $font_weights));
        $this->fonts_to_load[$font]['styles'] = array_unique(array_merge($this->fonts_to_load[$font]['styles'], $font_styles));
    }

    private function enqueue_collected_fonts(): void
    {
        foreach ($this->fonts_to_load as $font => $font_data) {
            $font_url = $this->get_font_url($font);
            $font_weights = implode(',', $font_data['weights']);
            $font_styles = implode(',', $font_data['styles']);

            if (!$this->use_local_fonts) {
                $local_fonts = new MaxiBlocks_Local_Fonts();
                $font_url = $local_fonts->generateFontURL($font_url, [
                    'weight' => $font_weights,
                    'style' => $font_styles,
                ]);
            }

            $this->enqueue_font_style($font, $font_url, $font_data['name'], $font_weights, $font_styles);
        }
    }

    private function get_font_url(string $font): string
    {
        $url_prefix = $this->use_bunny_fonts ? 'https://fonts.bunny.net' : 'https://fonts.googleapis.com';

        if ($this->use_local_fonts) {
            $font_name_sanitized = str_replace(' ', '', strtolower($font));
            return wp_upload_dir()['baseurl'] . '/maxi/fonts/' . $font_name_sanitized . '/style.css';
        }
        return $url_prefix . "/css2?family=$font" . ($this->use_local_fonts ? '' : ':');
    }

    private function enqueue_font_style(string $font, string $font_url, string $name, string $font_weight = '', string $font_style = ''): void
    {
        if (!$font_url) {
            return;
        }

        $style_handle = $name . '-font-' . sanitize_title_with_dashes($font . ($font_weight ? "-$font_weight" : '') . ($font_style ? "-$font_style" : ''));

        if (!$this->use_local_fonts) {
            if ($this->check_font_url($font_url)) {
                wp_enqueue_style($style_handle, $font_url, [], MAXI_PLUGIN_VERSION, 'all');
            } elseif ($font_weight || $font_style) {
                $font_url = strstr($font_url, ':wght', true);
                wp_enqueue_style($name . '-font-' . sanitize_title_with_dashes($font), $font_url, [], MAXI_PLUGIN_VERSION, 'all');
            }
        } else {
            wp_enqueue_style($style_handle, $font_url, [], MAXI_PLUGIN_VERSION);
        }
    }

    private function add_preload_filter(): void
    {
        if ($this->use_local_fonts) {
            add_filter('style_loader_tag', function ($html, $handle) {
                if (strpos($handle, 'maxi-blocks-styles-font-') !== false || strpos($handle, 'maxi-blocks-style-templates-header-font-') !== false) {
                    $html = str_replace("rel='stylesheet'", "rel='stylesheet preload'", $html);
                }
                return $html;
            }, 10, 2);
        }
    }

    public function check_font_url(string $font_url): bool
    {
        $font_url = str_replace(' ', '+', $font_url);
        $array = @get_headers($font_url);
        if (!$array) {
            return false;
        }
        $string = $array[0];
        return boolval(strpos($string, '200'));
    }
}
