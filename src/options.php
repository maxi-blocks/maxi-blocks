<?php
require_once(plugin_dir_path(__DIR__) . 'core/class-maxi-local-fonts.php');
function maxi_blocks_create_menu()
{
    add_menu_page('Maxi Blocks', 'Maxi Blocks', 'administrator', 'maxi-blocks.php', 'maxi_blocks_settings_page', 'dashicons-block-default');
    add_action('admin_init', 'register_maxi_blocks_settings');
}
add_action('admin_menu', 'maxi_blocks_create_menu');

function register_maxi_blocks_settings()
{
    register_setting('maxi-blocks-settings-group', 'accessibility_option');
    register_setting('maxi-blocks-settings-group', 'local_fonts');
    register_setting('maxi-blocks-settings-group', 'remove_local_fonts');
    register_setting('maxi-blocks-settings-group', 'google_api_key_option');
}

function getFolderSize($folder)
{
    $size = 0;

    foreach (glob(rtrim($folder, '/').'/*', GLOB_NOSORT) as $each) {
        $size += is_file($each) ? filesize($each) : getFolderSize($each);
    }

    return $size;
}

function maxi_blocks_settings_page()
{
    ?>
<div class="wrap">
    <h1>Maxi Block Settings</h1>
    <form method="post" action="options.php">
        <?php settings_fields('maxi-blocks-settings-group'); ?>
        <?php do_settings_sections('maxi-blocks-settings-group'); ?>
        <table class="form-table">
            <tr>
                <th scope="row">Enable Accessibility</th>
                <td>
                    <fieldset>
                        <legend class="screen-reader-text"><span>Accessibility</span></legend>
                        <label for="accessibility_option">
                            <input name="accessibility_option" <?php if ((bool) get_option('accessibility_option')) {
        echo "checked='checked'";
    } ?> type="checkbox" id="accessibility_option" value="1">
                        </label>
                    </fieldset>
                </td>
            </tr>
            <tr>
                <th scope="row"><?php echo __('Upload Google fonts to the site and serve them locally', 'maxi-blocks')?>
                </th>
                <td>
                    <fieldset>
                        <legend class="screen-reader-text">
                            <span><?php echo __('Upload Google fonts to the site and serve them locally', 'maxi-blocks')?></span>
                        </legend>
                        <label for="local_fonts">
                            <input name="local_fonts" <?php if ((bool) get_option('local_fonts')) {
        echo "checked='checked'";
        new MaxiBlocks_Local_Fonts();
    } ?> type="checkbox" id="local_fonts" value="1">
                        </label>
                    </fieldset>
                    <?php
    $fontUploadsDir = wp_upload_dir()['basedir'] . '/maxi/fonts/';
    $fontUploadsDirSize = round(getFolderSize($fontUploadsDir)/1048576, 2);
    if ($fontUploadsDirSize > 0) {
        echo '<p>'.__('Size of the local fonts:', 'maxi-blocks').' '.$fontUploadsDirSize.'MB</p>';
        if (!(bool) get_option('local_fonts')) { ?>
                    <label for="remove_local_fonts">
                        <?php echo __('Remove local fonts', 'maxi-blocks') ?>
                        <input name="remove_local_fonts" <?php if ((bool) get_option('remove_local_fonts')) {
            echo "checked='checked'";
            
            function deleteAll($folder)
            {
                foreach (glob($folder . '/*') as $file) {
                    if (is_dir($file)) {
                        deleteAll($file);
                    } else {
                        unlink($file);
                    }
                }
                rmdir($folder);
            }

            $fonts_uploads_dir = wp_upload_dir()['basedir'] . '/maxi/fonts';
            deleteAll($fonts_uploads_dir);
            update_option('remove_local_fonts', 0);
        } ?> type="checkbox" id="remove_local_fonts" value="1">
                    </label>
                    <?php }
    } ?>
                </td>
            </tr>
            <tr>
                <th scope="row">Google API Key</th>
                <td>
                    <input name="google_api_key_option" type="text" id="google_api_key_option"
                        aria-describedby="tagline-description"
                        value="<?php echo get_option('google_api_key_option'); ?>" class="regular-text">
                    <p class="description" id="tagline-description">Please create your own API key on the <a
                            href="https://console.developers.google.com" target="_blank" rel="noreferrer">Google Console
                        </a>This is a requirement enforced by Google.</p>
                </td>
            </tr>
        </table>
        <?php submit_button(); ?>
    </form>
</div>
<?php
}