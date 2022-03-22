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
     * Constructor
     */
    public function __construct()
    {
        if ((bool) get_option('local_fonts')) {
            $allFonts = $this->getAllFontsDB();
            $allURLs = $this->constructFontURLs($allFonts);
            $this->createUploadFolder();
            $this->uploadCssFiles($allURLs);
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

        if (!$post_content_array || empty($post_content_array)) {
            return false;
        }

        foreach ($post_content_array as $font) {
            $array[] = $font->fonts_value;
        }

        if (empty($array)) {
            return false;
        }

        foreach ($array as $key => $value) {
            $array[$key] = json_decode($value, true);
        }
        
        $arrayAll = array_merge_recursive(...$array);
       
        return $arrayAll;
    }

    public function constructFontURLs($allFonts)
    {
        if (!is_array($allFonts) || empty($allFonts)) {
            return false;
        }

        $response = [];
        foreach ($allFonts as $fontName => $fontData) {
            $fontNameSanitized = str_replace(' ', '+', $fontName);
            $fontUrl = "https://fonts.googleapis.com/css2?family=$fontNameSanitized:";
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

            $response[ $fontName] = $fontUrl;
        }
        return $response;
    }

    public function createUploadFolder()
    {
        $fonts_uploads_dir = wp_upload_dir()['basedir'] . '/maxi/fonts';
        wp_mkdir_p($fonts_uploads_dir);
    }

    public function uploadCssFiles($allURLs)
    {
        if (!is_array($allURLs) || empty($allURLs)) {
            return false;
        }

        global $wp_filesystem;

        $allFontsNames = [];
        
        foreach ($allURLs as $fontName => $fontUrl) {
            $fontNameSanitized = str_replace(' ', '', strtolower($fontName));

            $allFontsNames[] = $fontNameSanitized;
            
            $fontsDir = wp_upload_dir()['basedir'] . '/maxi/fonts/';
            $fontUploadsDir =  $fontsDir.$fontNameSanitized;
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

            file_put_contents($fontUploadsDir.'/style.css', $newCssFile);
        }

        // remove not used fonts
        $directories = glob($fontsDir.'*', GLOB_ONLYDIR);
        $this->write_log($directories);
        foreach ($directories as $directory) {
            $folderName = basename($directory);
            if (!in_array($folderName, $allFontsNames)) {
                // $wp_filesystem->delete($directory, true);
            }
        }
    }

    public function removeAllLocalFonts()
    {
        global $wp_filesystem;
        $fonts_uploads_dir = wp_upload_dir()['basedir'] . '/maxi/fonts';
        $wp_filesystem->delete($fonts_uploads_dir, true);
    }
}