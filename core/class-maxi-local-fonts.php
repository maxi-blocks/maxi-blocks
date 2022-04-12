<?php

class MaxiBlocks_Local_Fonts
{
    /**
     * This plugin's instance.
     *
     * @var MaxiBlocks_Local_Fonts
     */
    private static $instance;

    /**
     * Registers the plugin.
     */
    public static function register()
    {
        if (null === self::$instance) {
            self::$instance = new MaxiBlocks_Local_Fonts();
        }
    }

    /**
     * Variables
     */
    private $fontsUploadDir;

    /**
     * Constructor
     */
    public function __construct()
    {
        if ((bool) get_option('local_fonts')) {
            $this->fontsUploadDir = wp_upload_dir()['basedir'] . '/maxi/fonts';
            $allFonts = $this->getAllFontsDB();
            if (is_array($allFonts) && !empty($allFonts)) {
                $allURLs = $this->constructFontURLs($allFonts);
                if (is_array($allURLs) && !empty($allURLs)) {
                    $this->createUploadFolder();
                    $this->uploadCssFiles($allURLs);
                }
            }
        }
    }


    public function write_log($log)
    {
        if (is_array($log) || is_object($log)) {
            error_log(print_r($log, true));
        } else {
            error_log($log);
        }
    }

    public function getAllFontsDB()
    {
        global $wpdb;
        $post_content_array = (array)$wpdb->get_results(
            "SELECT DISTINCT fonts_value FROM {$wpdb->prefix}maxi_blocks_styles"
        );

        $prev_post_content_array = (array)$wpdb->get_results(
            "SELECT DISTINCT prev_fonts_value FROM {$wpdb->prefix}maxi_blocks_styles"
        );

        $sc_string = $wpdb->get_results(
            "SELECT * FROM {$wpdb->prefix}maxi_blocks_general WHERE id='sc_string'"
        );

        if (empty($post_content_array) && empty($prev_post_content_array) && $sc_string === '') {
            return false;
        }

        $sc_string_text = maybe_unserialize(json_decode(json_encode($sc_string), true)[0]['object'])['_maxi_blocks_style_card'];
        //  $this->write_log($sc_string_text);

        foreach ($post_content_array as $font) {
            $array[] = $font->fonts_value;
        }

        if (!empty($prev_post_content_array)) {
            foreach ($prev_post_content_array as $font) {
                $array[] = $font->prev_fonts_value;
            }
        }

        if (empty($array)) {
            return false;
        }

        foreach ($array as $key => $value) {
            $array[$key] = json_decode($value, true);
        }

        function filterNull($arr)
        {
            return ($arr !== null && $arr !== false && $arr !== '');
        }

        $array = array_filter($array, 'filterNull');
        
        $arrayAll = array_merge_recursive(...$array);
       
        return $arrayAll;
    }

    public function generateFontURL($fontUrl, $fontData)
    {
        if (!empty($fontData)) {
            $fontWeight = array_key_exists('weight', $fontData) ? $fontData['weight'] : false;
            $fontStyle = array_key_exists('style', $fontData) ? $fontData['style'] : false;

            if (is_array($fontWeight)) {
                $fontWeight = implode(',', array_unique($fontWeight));
            }

            if ($fontStyle === 'italic') {
                $fontUrl .= 'ital,';
            }

            if (strpos($fontWeight, ',') !== false) {
                $fontWeightArr = array_unique(explode(',', $fontWeight));
                sort($fontWeightArr);
                $fontUrl .= 'wght@';
                if ($fontStyle === 'italic') {
                    foreach ($fontWeightArr as $fw) {
                        $fontUrl .= '0,'.$fw.';';
                    }
                    foreach ($fontWeightArr as $fw) {
                        $fontUrl .= '1,'.$fw.';';
                    }
                } else {
                    foreach ($fontWeightArr as $fw) {
                        $fontUrl .= $fw.';';
                    }
                }
                $fontUrl = rtrim($fontUrl, ';');
            } elseif ($fontWeight) {
                if ($fontStyle === 'italic') {
                    $fontUrl .= 'wght@0,'.$fontWeight.';1,'.$fontWeight;
                } else {
                    $fontUrl .= 'wght@'.$fontWeight;
                }
            } else {
                if ($fontStyle === 'italic') {
                    $fontUrl .= 'wght@0,400;1,400';
                } else {
                    $fontUrl .= 'wght@400';
                }
            }
        } else {
            $fontUrl = rtrim($fontUrl, ':');
        }

        return $fontUrl;
    }

    public function constructFontURLs($allFonts)
    {
        $response = [];
        foreach ($allFonts as $fontName => $fontData) {
            $fontNameSanitized = str_replace(' ', '+', $fontName);
            $fontUrl = "https://fonts.googleapis.com/css2?family=$fontNameSanitized:";

            $response[$fontName] = $this->generateFontURL($fontUrl, $fontData);
        }
        return $response;
    }

    public function createUploadFolder()
    {
        wp_mkdir_p($this->fontsUploadDir);
    }

    public function minimizeFontCss($fontCss)
    {
        $fontCss = preg_replace('/\/\*((?!\*\/).)*\*\//', '', $fontCss);
        $fontCss = preg_replace('/\s{2,}/', ' ', $fontCss);
        $fontCss = preg_replace('/\s*([:;{}])\s*/', '$1', $fontCss);
        $fontCss = preg_replace('/;}/', '}', $fontCss);
        return $fontCss;
    }

    public function uploadCssFiles($allURLs)
    {
        foreach ($allURLs as $fontName => $fontUrl) {
            $fontNameSanitized = str_replace(' ', '', strtolower($fontName));

            $allFontsNames[] = $fontNameSanitized;
            
            $fontUploadsDir =  $this->fontsUploadDir.'/'.$fontNameSanitized;
            wp_mkdir_p($fontUploadsDir);

            $fontUrlDir = wp_upload_dir()['baseurl'] . '/maxi/fonts/'.$fontNameSanitized;

            $response = wp_remote_get($fontUrl);
            $cssFile  = wp_remote_retrieve_body($response);

            preg_match_all('/url\((.*?)\)/s', $cssFile, $urls);

            if (!is_array($urls) || empty($urls)) {
                return false;
            }

            $fontFiles = $urls[1];
            $newFontFiles = [];

            foreach ($fontFiles as $filePath) {
                $fontResponse = wp_remote_get($filePath);
                $fontBody     = wp_remote_retrieve_body($fontResponse);
                $fileName = basename($filePath);
                $newFilePath = $fontUploadsDir.'/'. $fileName;

                $newFontFiles[] =  $fontUrlDir.'/'. $fileName;

                if (!file_exists($newFilePath)) {
                    file_put_contents($newFilePath, $fontBody);
                }
            }

            $newCssFile = str_replace($fontFiles, $newFontFiles, $cssFile);

            $newCssFile = str_replace('}', 'font-display: swap; }', $newCssFile);

            $newCssFile = $this->minimizeFontCss($newCssFile);

            file_put_contents($fontUploadsDir.'/style.css', $newCssFile);
        }

        // remove not used fonts directories
        $directories = glob($this->fontsUploadDir.'/*', GLOB_ONLYDIR);
        foreach ($directories as $directory) {
            $folderName = basename($directory);
            if (!in_array($folderName, $allFontsNames)) {
                array_map('unlink', glob("$directory/*"));
                rmdir($directory);
            }
        }
    }
}