<?php
/**
 * Frontend Assets Handler
 */

if (!defined('ABSPATH')) {
    exit();
}

/**
 * Helper function to detect localhost
 */
function maxi_is_localhost() {
    $server_name = strtolower(isset($_SERVER['SERVER_NAME']) ? sanitize_text_field($_SERVER['SERVER_NAME']) : '');
    $server_addr = isset($_SERVER['SERVER_ADDR']) ? sanitize_text_field($_SERVER['SERVER_ADDR']) : '';
    $remote_addr = isset($_SERVER['REMOTE_ADDR']) ? sanitize_text_field($_SERVER['REMOTE_ADDR']) : '';

    return in_array($server_name, ['localhost', '127.0.0.1', '::1']) ||
        strpos($server_addr, '127.0.') === 0 ||
        strpos($remote_addr, '127.0.') === 0 ||
        strpos($server_name, '.local') !== false ||
        strpos($server_name, '.test') !== false;
}

// Add both admin and non-admin AJAX handlers
function maxi_register_frontend_assets_handlers()
{
    add_action('wp_ajax_maxi_get_frontend_assets', 'maxi_get_frontend_assets_handler');
    add_action('wp_ajax_nopriv_maxi_get_frontend_assets', 'maxi_get_frontend_assets_handler');
}
add_action('init', 'maxi_register_frontend_assets_handlers');

function maxi_get_frontend_assets_handler()
{

    // Verify nonce first
    if (!check_ajax_referer('maxi_get_frontend_assets', 'nonce', false)) {
        wp_send_json_error(['message' => 'Invalid security token']);
        return;
    }

    try {
        // Get the homepage URL
        $home_url = home_url();

        // Make a request to the frontend
        $response = wp_remote_get($home_url, [
            'timeout' => 30,
            'sslverify' => !maxi_is_localhost(),
            'user-agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        ]);

        if (is_wp_error($response)) {
            wp_send_json_error(['message' => 'Failed to fetch frontend']);
            return;
        }

        $html = wp_remote_retrieve_body($response);

        // Parse HTML to find assets
        $css_files = [];
        $js_files = [];

        // Use DOMDocument to parse HTML
        $dom = new DOMDocument();
        libxml_use_internal_errors(true);
        $dom->loadHTML($html, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        libxml_clear_errors();

        // Get all CSS files
        $links = $dom->getElementsByTagName('link');
        foreach ($links as $link) {
            if ($link->getAttribute('rel') === 'stylesheet') {
                $css_files[] = $link->getAttribute('href');
            }
        }

        // Get all JS files
        $scripts = $dom->getElementsByTagName('script');
        foreach ($scripts as $script) {
            $src = $script->getAttribute('src');
            if ($src) {
                $js_files[] = $src;
            }
        }

        // Clean up URLs
        $css_files = array_values(array_filter(array_unique($css_files)));
        $js_files = array_values(array_filter(array_unique($js_files)));

        wp_send_json_success([
            'css' => $css_files ?: [__('No CSS files found', 'maxi-blocks')],
            'js' => $js_files ?: [__('No JavaScript files found', 'maxi-blocks')]
        ]);

    } catch (Exception $e) {
        wp_send_json_error(['message' => 'Internal error']);
    }
}
