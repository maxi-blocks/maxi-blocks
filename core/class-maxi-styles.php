<?php
require_once plugin_dir_path(__DIR__) . 'core/class-maxi-local-fonts.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/class-maxi-style-cards.php';

class MaxiBlocks_Styles
{
    /**
     * This plugin's instance.
     *
     * @var MaxiBlocks_Styles
     */
    private static $instance;

    /**
     * Registers the plugin.
     */
    public static function register()
    {
        if (null === self::$instance) {
            self::$instance = new MaxiBlocks_Styles();
        }
    }

    /**
     * Constructor
     */
    public function __construct()
    {
        add_action('wp_enqueue_scripts', [$this, 'enqueue_styles']);
    }

	/**
     * Get block data
     */
	public function get_block_data($js_var, $meta) {
		switch ($js_var) {
			case 'search':
				return [$meta, get_search_link()];
				break;
			case 'map':
				return [$meta, get_option('google_api_key_option')];
				break;
			default:
				return [$meta];
				break;
		}
	}

    /**
     * Enqueuing styles
     */
    public function enqueue_styles()
    {
		global $post;

        $post_content = $this->get_content();
		$template_content = $this->get_content(true);

        $this->apply_content('maxi-blocks-styles', $post_content);
		$this->apply_content('maxi-blocks-styles-templates', $template_content);

        if ($this->need_custom_meta([$post_content, $template_content])) {
            $scripts = [
                'hover-effects',
                'bg-video',
                'parallax',
                'scroll-effects',
                'number-counter',
                'shape-divider',
                'relations',
                'video',
				'search',
				'map',
                'accordion',
            ];

            foreach ($scripts as &$script) {
                $jsVar = str_replace('-', '_', $script);
                $jsVarToPass =
                    'maxi' .
                    str_replace(
                        ' ',
                        '',
                        ucwords(str_replace('-', ' ', $script))
                    );
                $jsScriptName = 'maxi-' . $script;
                $jsScriptPath = '//js//min//' . $jsScriptName . '.min.js';

				$post_meta = $this->custom_meta($jsVar, false);
				$template_meta = $this->custom_meta($jsVar, true);

				$meta = array_merge($post_meta, $template_meta);

                if (!empty($meta)) {
                    if ($script === 'number-counter') {
                        wp_enqueue_script(
                            'maxi-waypoints-js',
                            plugins_url(
                                '/js/waypoints.min.js',
                                dirname(__FILE__)
                            )
                        );
                    }

                    wp_enqueue_script(
                        $jsScriptName,
                        plugins_url($jsScriptPath, dirname(__FILE__))
                    );

                    wp_localize_script($jsScriptName, $jsVarToPass, $this->get_block_data($jsVar, $meta));
                }
            }
        }
    }

	/**
	 * Apply content
	 */
	public function apply_content($name, $content)
	{
		if (!$content || empty($content)) {
            return false;
        }

		$styles = $this->get_styles($content);
        $fonts = $this->get_fonts($content);

		if ($styles) {
            // Inline styles
            wp_register_style($name, false);
            wp_enqueue_style($name);
            wp_add_inline_style($name, $styles);
        }

        if ($fonts) {
            $this->enqueue_fonts($fonts);
        }
	}

	/**
     * Get id
     */
	public function get_id($is_template = false)
	{
		if(!$is_template) {
			global $post;
			return $post->ID;
		}

		$template_slug = get_page_template_slug();
		$template_id = get_template() . '//';

		if($template_slug != '' && $template_slug !== false) {
			$template_id .= $template_slug;
		}
		else if(is_home()) {
			$template_id .= 'home';
		}
		else if(is_search()) {
			$template_id .= 'search';
		}
		else if(is_404()) {
			$template_id .= '404';
		}
		else if(is_archive()) {
			$template_id .= 'archive';
		}
		else if(is_page()) {
			$template_id .= 'page';
		}
        else {
			$template_id .= 'single';
		}

		return $template_id;
	}

	/**
	 * Get need custom meta
	 */
	public function need_custom_meta($contents) {
		$need_custom_meta = false;

		if ($contents) {
			foreach ($contents as $content) {
				if (
					$content &&
					((int) $content['prev_active_custom_data'] === 1 ||
					(int) $content['active_custom_data'] === 1)
				) {
					$need_custom_meta = true;
					break;
				}
			}
		}

		return $need_custom_meta;
	}

    /**
     * Gets content
     */
    public function get_content($is_template = false)
    {
        global $post;

        if (!$is_template && (!$post || !isset($post->ID))) {
            return false;
        }

        $id = $this->get_id($is_template);

        if (!$id) {
            return false;
        }

        global $wpdb;
        $content_array = (array) $wpdb->get_results(
            $wpdb->prepare(
				"SELECT * FROM {$wpdb->prefix}maxi_blocks_styles" . ($is_template ? "_templates" : "") . " WHERE " . ($is_template ? "template_id = %s" : "post_id = %d"),
                $id
            ),
            OBJECT
        );

        if (!$content_array || empty($content_array)) {
            return false;
        }

        $content = $content_array[0];

        if (!$content || empty($content)) {
            return false;
        }

        return json_decode(json_encode($content), true);
    }

    /**
     * Gets post meta
     */
    public function get_meta($id, $is_template = false)
    {
        global $post;

        if (!$is_template && (!$post || !isset($post->ID)))
		{
            return false;
        }

        global $wpdb;
        $response = $wpdb->get_results(
            $wpdb->prepare(
				"SELECT custom_data_value FROM {$wpdb->prefix}maxi_blocks_custom_data" . ($is_template ? "_templates" : "") . " WHERE " . ($is_template ? "template_id = %s" : "post_id = %d"),
                $id
            ),
            OBJECT
        );

        if (!$response) {
            $response = '';
        }

        return $response;
    }

    /**
     * Gets post styles content
     */
    public function get_styles($content)
    {
        $style =
            is_preview() || is_admin()
                ? $content['prev_css_value']
                : $content['css_value'];

        if (!$style || empty($style)) {
            return false;
        }

        $style = $this->update_color_palette_backups($style);

        return $style;
    }

    /**
     * Gets post styles content
     */
    public function get_fonts($content)
    {
        $fonts =
            is_preview() || is_admin()
                ? $content['prev_fonts_value']
                : $content['fonts_value'];

        if (!$fonts || empty($fonts)) {
            return false;
        }

        return json_decode($fonts, true);
    }

    /**
     * Returns default breakpoints values in case breakpoints are not set
     */
    public function getBreakpoints($breakpoints)
    {
        if (!empty((array) $breakpoints)) {
            return $breakpoints;
        }

        // TODO: It may connect to the API to centralize the default values there
        return (object) [
            'xs' => 480,
            's' => 767,
            'm' => 1024,
            'l' => 1366,
            'xl' => 1920,
        ];
    }

    /**
     * Post fonts
     *
     * @return object   Font name with font options
     */

    public function enqueue_fonts($fonts)
    {
        if (empty($fonts) || !is_array($fonts)) {
            return;
        }

        $useLocalFonts = (bool) get_option('local_fonts');

        foreach ($fonts as $font => $fontData) {
            if (strpos($font, 'sc_font') !== false) {
                $split_font = explode('_', str_replace('sc_font_', '', $font));
                $block_style = $split_font[0];
                $text_level = $split_font[1];

                if (class_exists('MaxiBlocks_StyleCards')) {
                    $font = MaxiBlocks_StyleCards::get_maxi_blocks_style_card_fonts($block_style, $text_level);
                }
            }

            if ($font) {
                if ($useLocalFonts) {
                    $fontNameSanitized = str_replace(
                        ' ',
                        '',
                        strtolower($font)
                    );
                    $fontUrl =
                        wp_upload_dir()['baseurl'] .
                        '/maxi/fonts/' .
                        $fontNameSanitized .
                        '/style.css';
                } else {
                    $fontUrl = "https://fonts.googleapis.com/css2?family=$font:";
                }
                if (!$useLocalFonts) {
                    $localFonts = new MaxiBlocks_Local_Fonts();
                    $fontUrl = $localFonts->generateFontURL(
                        $fontUrl,
                        $fontData
                    );
                }

                wp_enqueue_style(
                    'maxi-font-' . sanitize_title_with_dashes($font),
                    $fontUrl
                );
            }
        }

        if ($useLocalFonts) {
            add_filter('style_loader_tag', 'local_fonts_preload', 10, 2);
            function local_fonts_preload($html, $handle)
            {
                if (strpos($handle, 'maxi-font-') !== false) {
                    $html = str_replace(
                        "rel='stylesheet'",
                        "rel='stylesheet preload'",
                        $html
                    );
                    $html = str_replace(
                        "media='all'",
                        "as='style' crossorigin media='all'",
                        $html
                    );
                }
                return $html;
            }
        }
    }

    /**
     * Custom Meta
     */
    public function custom_meta($metaJs, $is_template)
    {
        global $post;
        if ((!$is_template && (!$post || !isset($post->ID))) || empty($metaJs)) {
            return [];
        }

		$id = $this->get_id($is_template);

        $custom_data = $this->get_meta($id, $is_template);

        if (!$custom_data) {
            return [];
        }

        $resultArr = (array) $custom_data[0];
        $resultString = $resultArr['custom_data_value'];
        $result = maybe_unserialize($resultString);

        if (!$result || empty($result)) {
            return [];
        }

        if (!isset($result[$metaJs])) {
            return [];
        }

        $resultDecoded = $result[$metaJs];

        if (empty($resultDecoded)) {
            return [];
        }

        return $resultDecoded;
    }

    public function update_color_palette_backups($style)
    {
        global $wpdb;

        $style_card = maybe_unserialize(
            $wpdb->get_var(
                $wpdb->prepare(
                    "SELECT object FROM {$wpdb->prefix}maxi_blocks_general where id = %s",
                    'sc_string'
                )
            )
        );

        if (!$style_card) {
            return $style;
        }

        // Get used colors on the post style
        $needle = 'rgba(var(--maxi-';
        $lastPos = 0;
        $colors = [];

        while (($lastPos = strpos($style, $needle, $lastPos)) !== false) {
            $endPos = strpos($style, ')', $lastPos);
            $colorStr = substr($style, $lastPos, $endPos - $lastPos + 1);

            if (!in_array($colorStr, $colors)) {
                $colors[] = $colorStr;
            }

            $lastPos = $lastPos + strlen($needle);
        }

        // Get color values from the SC considering the used on post style
        $colorVars = [];

        foreach ($colors as $color) {
            $color = str_replace('rgba(var(', '', $color);
            $colorVar = explode(',', $color)[0];
            $colorContent = str_replace($colorVar, '', $color);
            $colorContent = str_replace(')', '', $colorContent);
            $colorContent = ltrim($colorContent, ',');

            if (!in_array($colorVar, $colorVars)) {
                $colorVars[$colorVar] = $colorContent;
            }
        }

        $changedSCColors = [];

        if (!array_key_exists('_maxi_blocks_style_card', $style_card)) {
            $style_card['_maxi_blocks_style_card'] =
                $style_card['_maxi_blocks_style_card_preview'];
        }

        $style_card =
            is_preview() || is_admin()
                ? $style_card['_maxi_blocks_style_card_preview']
                : $style_card['_maxi_blocks_style_card'];

        foreach ($colorVars as $colorKey => $colorValue) {
            $startPos = strpos($style_card, $colorKey);
            $endPos = strpos($style_card, ';--', $startPos);
            $colorSCValue = substr(
                $style_card,
                $startPos + strlen($colorKey) + 1,
                $endPos - $startPos - strlen($colorKey) - 1
            );

            if ($colorSCValue !== $colorValue) {
                $changedSCColors[$colorKey] = $colorSCValue;
            }
        }

        // In case there are changes, fix them
        if (empty($changedSCColors)) {
            return $style;
        } else {
            $new_style = $style;

            foreach ($changedSCColors as $colorKey => $colorValue) {
                $old_color_str =
                    "rgba(var($colorKey," . $colorVars[$colorKey] . ')';
                $new_color_str = "rgba(var($colorKey," . $colorValue . ')';

                $new_style = str_replace(
                    $old_color_str,
                    $new_color_str,
                    $new_style
                );
            }

            return $new_style;
        }
    }
}
