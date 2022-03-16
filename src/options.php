<?php
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
    register_setting('maxi-blocks-settings-group', 'google_api_key_option');
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
    } ?> type="checkbox" id="local_fonts" value="1">
                        </label>
                    </fieldset>
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