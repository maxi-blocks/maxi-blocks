<?php
/**
 * Admin Import templates Notice
 *
 * @package MaxiBlocks Go theme
 * @author MaxiBlocks
 * @since 1.0.0
 */
if (! defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

if (!defined('MAXIBLOCKS_GO_PREFIX')) {
    define('MAXIBLOCKS_GO_PREFIX', 'maxiblocks-go-');
}

if (!defined('MAXIBLOCKS_GO_TEMPLATES_NOTICE_JS')) {
    define('MAXIBLOCKS_GO_TEMPLATE_NOTICE_PLUGIN_JS', MAXIBLOCKS_GO_PREFIX . 'templates-notice');
}

if (!defined('MAXIBLOCKS_GO_TEMPLATE_NOTICE_DISMISS')) {
    define('MAXIBLOCKS_GO_TEMPLATE_NOTICE_DISMISS', MAXIBLOCKS_GO_PREFIX . 'dismiss-templates-notice');
}

add_action('admin_notices', 'plugin_maxiblocks_go_render_templates_notice', 0);
add_action('wp_ajax_maxiblocks-go-theme-dismiss-templates-notice', 'plugin_maxiblocks_go_close_templates_notice');

/**
 * Renders the import notice for templates, patterns, parts.
 *
 * This function checks if the notice should be displayed based on certain conditions
 * and then enqueues the necessary JavaScript file (minified or unminified based on the debug mode).
 * It also outputs HTML markup for the notice, including dynamic text and URLs.
 *
 * @since 1.0.0
 * @return void
 */
function plugin_maxiblocks_go_render_templates_notice()
{

    // Check if the notice should be displayed.
    if (!plugin_maxiblocks_go_templates_notice_display()) {
        return;
    }

    // Determine the JavaScript file URL based on the debug mode.
    $notice_js_url = MAXI_PLUGIN_URL_PATH . 'core/maxiblocks-go/js/templates-notice.js';
    $notice_css_url = MAXI_PLUGIN_URL_PATH . 'core/maxiblocks-go/css/add-maxi-templates.css';

    // Enqueue the CSS.
    wp_enqueue_style(MAXIBLOCKS_GO_TEMPLATE_NOTICE_PLUGIN_JS, $notice_css_url, [], MAXI_PLUGIN_VERSION);

    // Enqueue the script.
    wp_enqueue_script(MAXIBLOCKS_GO_TEMPLATE_NOTICE_PLUGIN_JS, $notice_js_url, [], MAXI_PLUGIN_VERSION, true);
    wp_localize_script(MAXIBLOCKS_GO_TEMPLATE_NOTICE_PLUGIN_JS, 'maxiblocks', plugin_maxiblocks_go_localize_templates_notice_js());

    // Define other variables.
    $install_plugin_image  = MAXI_PLUGIN_URL_PATH . 'core/maxiblocks-go/images/maxiblocks-templates-notice.jpg';
    $more_info_url = 'https://maxiblocks.com/go/maxi-theme-activation-more-info';

    // Start output buffering.
    ob_start();
    ?>
<div class="maxiblocks-go-notice maxiblocks-go-notice--info maxiblocks-go-notice--templates" style="background-image: url(<?php echo esc_url($install_plugin_image); ?>);">
    <button type="button" class="maxiblocks-go-notice__dismiss">
        <span class="maxiblocks-go-notice__dismiss-text">&#10799;</span>
    </button>
    <div class="maxiblocks-go-notice__row">
        <div class="maxiblocks-go-notice__col">
            <div class="maxiblocks-go-notice__content">
                <h2 class="maxiblocks-go-notice__title">
                <?php esc_html_e('MaxiBlocks Go theme detected', 'maxiblocks-go');?>
                </h2>
                <p class="maxiblocks-go-notice__description">
                    <?php esc_html_e('Now for the fun part. Let\'s import seven theme templates to showcase MaxiBlocks\' full range. These include blog home, archives, pages, index, 404, search results, and single posts.', 'maxiblocks-go');?>
                </p>
                <div class="maxiblocks-go-notice__actions">
                    <button id="maxiblocks-go-notice-import-templates-patterns" class="maxiblocks-go-button maxiblocks-go-button--primary maxiblocks-go-button--hero" onclick="plugin_maxiblocks_go_copy_patterns()">
                        <span class="maxiblocks-go-button__text">
                            <?php esc_html_e('Import theme templates', 'maxiblocks-go')?>
                        </span><span class="maxiblocks-go-button__icon">&rsaquo;</span></button>
                    <a href="<?php echo esc_url($more_info_url); ?>" target="_blank"
                        class="maxiblocks-go-button maxiblocks-go-button--primary maxiblocks-go-button--hero">
                        <span class="maxiblocks-go-button__text"><?php esc_html_e('More info', 'maxiblocks-go'); ?>
                        </span><span class="maxiblocks-go-button__icon">&rsaquo;</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

<?php
    // Output the buffered content.
    echo wp_kses_post(ob_get_clean());
}

/**
 * Close install notice.
 *
 * @since 1.0.0
 */
function plugin_maxiblocks_go_close_templates_notice()
{
    if (!isset($_POST['nonce'])) {
        return;
    }

    if (isset($_POST['nonce']) && is_string($_POST['nonce']) && !wp_verify_nonce(sanitize_text_field($_POST['nonce']), MAXIBLOCKS_GO_TEMPLATE_NOTICE_DISMISS . '-nonce')) {
        return;
    }
    update_option(MAXIBLOCKS_GO_TEMPLATE_NOTICE_DISMISS, 'yes');
    wp_die();
}

/**
 * Checks if the 404.html and archive.html files exist in the /templates folder.
 *
 * @since 1.0.0
 * @return bool True if both files exist, false otherwise.
 */
function plugin_maxiblocks_go_check_template_files_exist()
{
    $template_404_path = get_stylesheet_directory() . '/templates/404.html';
    $template_archive_path = get_stylesheet_directory() . '/templates/archive.html';

    return file_exists($template_404_path) && file_exists($template_archive_path);
}

/**
 * Determines if a plugin notice should be displayed.
 *
 * The function checks several conditions to determine if the notice should be shown:
 * - Verifies if a specific plugin is active.
 * - Checks if the notice has been dismissed by the user.
 * - Ensures the notice is only shown on specific admin pages (dashboard and themes).
 * - Excludes AJAX requests, network admin, users without specific capabilities, and block editor context.
 * - Checks if the 404.html and archive.html files exist in the /templates folder.
 *
 * @since 1.0.0
 * @return bool True if the notice should be displayed, false otherwise.
 */
function plugin_maxiblocks_go_templates_notice_display()
{
    $screen = get_current_screen();

    // Check if plugin is active, if notice was dismissed, or if current user lacks required capabilities.
    if ('yes' === get_option(MAXIBLOCKS_GO_TEMPLATE_NOTICE_DISMISS, 'no') ||
        !current_user_can('manage_options') ||
        !current_user_can('install_plugins')) {
        return false;
    }

    // Restrict notice display to specific admin pages and contexts.
    if (null !== $screen &&
        ((defined('DOING_AJAX') && DOING_AJAX) ||
         is_network_admin() ||
         $screen->is_block_editor())) {
        return false;
    }

    // Check if the 404.html and archive.html files exist in the /templates folder.
    if (plugin_maxiblocks_go_check_template_files_exist()) {
        return false;
    }

    return true;
}

/**
 * Localize js.
 *
 * @since 1.0.0
 * @param string $plugin_status plugin current status.
 * @return array
 */
function plugin_maxiblocks_go_localize_templates_notice_js()
{

    return array(
        'nonce'        => wp_create_nonce(MAXIBLOCKS_GO_TEMPLATE_NOTICE_DISMISS . '-nonce'),
        'ajaxUrl'      => admin_url('admin-ajax.php'),
        'adminUrl' => admin_url(),
        'importing'    => __('Importing..', 'maxiblocks-go') . ' &#9203;',
        'done'          => __('Done', 'maxiblocks-go') . ' &#10003;',
        'error'          => __('Error', 'maxiblocks-go') . ' !',
    );
}

/**
 * Copies the files from a source directory to a destination directory.
 *
 * @since 1.1.0
 * @param string $source_dir The source directory path.
 * @param string $destination_dir The destination directory path.
 * @return void
 */
function plugin_maxiblocks_go_copy_directory($source_dir, $destination_dir)
{
    require_once ABSPATH . 'wp-admin/includes/file.php';

    // Remove trailing slash from source directory if it exists
    $source_dir = rtrim($source_dir, '/');

    // Check if the source directory exists and is readable
    if (!is_dir($source_dir) || !is_readable($source_dir)) {
        error_log(sprintf(
            /* translators: %s: Source directory path */
            __("Source directory does not exist or is not readable: %s", 'maxiblocks-go'),
            $source_dir
        ));
        wp_send_json_error(sprintf(
            /* translators: %s: Source directory path */
            __("Source directory does not exist or is not readable: %s", 'maxiblocks-go'),
            $source_dir
        ));
        return;
    }

    // Check if the destination directory is writable
    if (!wp_is_writable($destination_dir)) {
        error_log(sprintf(
            /* translators: %s: Destination directory path */
            __("Destination directory is not writable: %s", 'maxiblocks-go'),
            $destination_dir
        ));
        wp_send_json_error(sprintf(
            /* translators: %s: Destination directory path */
            __("Destination directory is not writable: %s", 'maxiblocks-go'),
            $destination_dir
        ));
        return;
    }

    // Create the destination directory if it doesn't exist
    wp_mkdir_p($destination_dir);

    // Open the source directory
    $dir = opendir($source_dir);
    if ($dir) {
        // Loop through the files in the source directory
        while (false !== ($file = readdir($dir))) {
            // Skip . and .. entries
            if (($file != '.') && ($file != '..')) {
                $source_path = $source_dir . '/' . $file;
                $destination_path = $destination_dir . '/' . $file;

                // Copy only files, ignore subdirectories
                if (is_file($source_path)) {
                    // Overwrite the file if it already exists in the destination
                    if (file_exists($destination_path)) {
                        unlink($destination_path);
                    }
                    if (!copy($source_path, $destination_path)) {
                        error_log(sprintf(
                            /* translators: 1: Source file path, 2: Destination file path */
                            __("Failed to copy file: %s to %s", 'maxiblocks-go'),
                            $source_path,
                            $destination_path
                        ));
                    }
                }
            }
        }
        closedir($dir);
    } else {
        error_log(sprintf(
            /* translators: %s: Source directory path */
            __("Failed to open directory: %s", 'maxiblocks-go'),
            $source_dir
        ));
        wp_send_json_error(sprintf(
            /* translators: %s: Source directory path */
            __("Failed to open directory: %s", 'maxiblocks-go'),
            $source_dir
        ));
    }
}

function plugin_maxiblocks_go_add_styles_meta_fonts_to_db()
{
    global $wpdb;

    // Check if the necessary tables exist
    $styles_table = "{$wpdb->prefix}maxi_blocks_styles_blocks";
    $custom_data_table = "{$wpdb->prefix}maxi_blocks_custom_data_blocks";

    if ($wpdb->get_var("SHOW TABLES LIKE '$styles_table'") != $styles_table ||
        $wpdb->get_var("SHOW TABLES LIKE '$custom_data_table'") != $custom_data_table) {
        return;
    }

    $db_folder = MAXI_PLUGIN_DIR_PATH . 'core/maxiblocks-go/db/';

    // Check if the 'db' folder exists
    if (is_dir($db_folder)) {
        // Get all JSON files in the 'db' folder
        $json_files = glob($db_folder . '*.json');

        foreach ($json_files as $json_file) {
            // Read the JSON file contents
            $json_data = file_get_contents($json_file);

            // Decode the JSON data
            $data = json_decode($json_data, true);

            // Extract the necessary information from the decoded data
            $unique_id = $data['block_style_id'] ?? '';
            if ($unique_id === '') {
                continue;
            }

            $css_value = $data['css_value'] ?? '';
            $fonts_value = $data['fonts_value'] ?? '';
            if ($css_value === '' && $fonts_value === '') {
                continue;
            }

            $active_custom_data = $data['active_custom_data'] ?? 0;
            $custom_data_value = $data['custom_data_value'] ?? '';

            if ($custom_data_value === '' || $custom_data_value === '[]') {
                $custom_data_value = '';
            }

            // Check if a row with the same unique_id already exists
            $exists = $wpdb->get_row(
                $wpdb->prepare(
                    "SELECT * FROM $styles_table WHERE block_style_id = %s",
                    $unique_id
                ),
                OBJECT
            );

            if (!empty($exists)) {
                return; // Exit the function if the row already exists
            }


            if (strpos($css_value, '_path_to_replace_') !== false) {
                $css_value = str_replace('_path_to_replace_', MAXIBLOCKS_GO_MAXI_PATTERNS_URL, $css_value);
            }
            // Insert a new row into the styles table
            $wpdb->insert(
                $styles_table,
                array(
                    'block_style_id' => $unique_id,
                    'css_value' => $css_value,
                    'fonts_value' => $fonts_value,
                    'active_custom_data' => $active_custom_data,
                ),
                array('%s', '%s', '%s', '%d')
            );

            // Insert a new row into the custom data table if custom_data_value is not empty or '[]'
            if ($custom_data_value !== '') {
                $wpdb->insert(
                    $custom_data_table,
                    array(
                        'block_style_id' => $unique_id,
                        'custom_data_value' => $custom_data_value,
                    ),
                    array('%s', '%s')
                );
            }

        }
    }

}

function plugin_maxiblocks_go_register_patterns()
{
    $pattern_files = glob(MAXIBLOCKS_GO_MAXI_PATTERNS_PLUGIN_PATH . '/*.php');

    foreach ($pattern_files as $pattern_file) {
        // Start output buffering
        ob_start();

        // Include the pattern file
        include $pattern_file;

        // Get the captured output and clean the buffer
        $pattern_content = ob_get_clean();

        // Extract pattern information from the file
        $pattern_info = array(
            'title' => '',
            'slug' => '',
            'categories' => array(),
            'template_types' => array(),
        );

        if (preg_match('/\/\*\*(.*?)\*\//s', file_get_contents($pattern_file), $matches)) {
            $info_block = $matches[1];
            $info_lines = preg_split('/\r\n|\r|\n/', $info_block);

            foreach ($info_lines as $line) {
                $line = trim($line);
                if (strpos($line, '* Title:') === 0) {
                    $pattern_info['title'] = trim(substr($line, strlen('* Title:')));
                } elseif (strpos($line, '* Slug:') === 0) {
                    $pattern_info['slug'] = trim(substr($line, strlen('* Slug:')));
                } elseif (strpos($line, '* Categories:') === 0) {
                    $categories = explode(',', trim(substr($line, strlen('* Categories:'))));
                    $pattern_info['categories'] = array_map('trim', $categories);
                } elseif (strpos($line, '* Template Types:') === 0) {
                    $template_types = explode(',', trim(substr($line, strlen('* Template Types:'))));
                    $pattern_info['template_types'] = array_map('trim', $template_types);
                }
            }
        }

        // Get the block patterns registry
        $registry = WP_Block_Patterns_Registry::get_instance();

        // Check if the pattern with the same slug is already registered
        if (!$registry->is_registered($pattern_info['slug'])) {
            // Register the pattern
            register_block_pattern(
                $pattern_info['slug'],
                array(
                    'title'          => $pattern_info['title'],
                    'content'        => $pattern_content,
                    'categories'     => $pattern_info['categories'],
                    'templateTypes' => $pattern_info['template_types'],
                )
            );
        }
    }
}

if (plugin_maxiblocks_go_check_template_files_exist()) {
    add_action('init', 'plugin_maxiblocks_go_register_patterns');
}

/**
 * Copies the content of the plugins /patterns, /templates, and /parts folders
 * into the themes /patterns, /templates, and /parts folders respectively.
 *
 * @since 1.1.0
 * @return void
 */
function plugin_maxiblocks_go_copy_patterns()
{
    plugin_maxiblocks_go_import_templates();
    $theme_version = wp_get_theme('maxiblocks-go')->get('Version');
    update_option('maxiblocks_go_templates_version', $theme_version);
    update_option('maxiblocks_go_templates_imported', true);
    wp_send_json_success('Patterns, templates, and parts copied successfully');
}

// Add the plugin_maxiblocks_go_copy_patterns function to the WordPress AJAX actions
add_action('wp_ajax_plugin_maxiblocks_go_copy_patterns', 'plugin_maxiblocks_go_copy_patterns');
