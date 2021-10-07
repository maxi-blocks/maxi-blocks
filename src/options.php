<?php
function maxi_blocks_create_menu() {
	add_menu_page('Maxi Blocks', 'Maxi Blocks', 'administrator', 'maxi-blocks.php', 'maxi_blocks_settings_page' , 'dashicons-block-default' );
	add_action( 'admin_init', 'register_maxi_blocks_settings' );
}
add_action('admin_menu', 'maxi_blocks_create_menu');

function register_maxi_blocks_settings() {
	register_setting( 'maxi-blocks-settings-group', 'accessibility_option' );
}

function maxi_blocks_settings_page() {
?>
	<div class="wrap">
		<h1>Maxi Block Settings</h1>
		<form method="post" action="options.php">
			<?php settings_fields( 'maxi-blocks-settings-group' ); ?>
			<?php do_settings_sections( 'maxi-blocks-settings-group' ); ?>
			<table class="form-table">
				<tr>
					<th scope="row">Enable Accessibility</th>
					<td>
						<fieldset>
							<legend class="screen-reader-text"><span>Accessibility</span></legend>
							<label for="accessibility_option">
								<input name="accessibility_option" <?php if((bool) get_option('accessibility_option')) echo "checked='checked'"; ?> type="checkbox" id="accessibility_option" value="1">
							</label>
					</fieldset>
				</td>
				</tr>
			</table>
			<?php submit_button(); ?>
		</form>
	</div>
<?php
}
