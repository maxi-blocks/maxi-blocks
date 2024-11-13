<?php
/**
  * Title: Basic Header
  * Slug: maxiblocks-go/basic-header
  * Categories: maxiblocks-go-header-navigation
  * Block Types: core/template-part/header
  */
if (!defined('MAXIBLOCKS_GO_MAXI_PATTERNS_PLUGIN_URL')) {
    define('MAXIBLOCKS_GO_MAXI_PATTERNS_PLUGIN_URL', plugins_url().'/maxi-blocks/core/maxiblocks-go/patterns/');
}
$path_to_images = MAXIBLOCKS_GO_MAXI_PATTERNS_PLUGIN_URL . 'header/images/';?>
<!-- wp:columns {"className":"maxiblocks-go template_header_columns template_width","style":{"spacing":{"padding":{"top":"20px","bottom":"20px"},"margin":{"top":"0","bottom":"0"}}}} -->
<div class="wp-block-columns maxiblocks-go template_header_columns template_width" style="margin-top:0;margin-bottom:0;padding-top:20px;padding-bottom:20px"><!-- wp:column {"verticalAlignment":"center","width":"390px"} -->
<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:390px"><!-- wp:image {"id":631,"width":"233px","sizeSlug":"full","linkDestination":"none","align":"center","className":"is-style-default"} -->
<figure class="wp-block-image aligncenter size-full is-resized is-style-default"><img src="<?php echo $path_to_images; ?>maxiblocks-logo.svg" alt="" class="wp-image-631" style="width:233px"/></figure>
<!-- /wp:image --></div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"center","width":"100%","layout":{"type":"default"}} -->
<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:100%"><!-- wp:navigation {"icon":"menu","style":{"spacing":{"blockGap":"2em"},"typography":{"fontSize":"16px"}},"layout":{"type":"flex","justifyContent":"center"}} /--></div>
<!-- /wp:column -->

<!-- wp:column {"width":"330px","style":{"typography":{"fontStyle":"normal","fontWeight":"800"}},"layout":{"type":"constrained"}} -->
<div class="wp-block-column" style="font-style:normal;font-weight:800;flex-basis:330px"><!-- wp:buttons {"layout":{"type":"flex","verticalAlignment":"center","justifyContent":"right"}} -->
<div class="wp-block-buttons"><!-- wp:button {"width":100,"className":"is-style-fill","style":{"color":{"background":"#000000"},"typography":{"fontStyle":"normal","fontWeight":"700"},"spacing":{"padding":{"left":"20px","right":"20px","top":"20px","bottom":"20px"}}},"fontSize":"medium"} -->
<div class="wp-block-button has-custom-width wp-block-button__width-100 has-custom-font-size is-style-fill has-medium-font-size" style="font-style:normal;font-weight:700"><a class="wp-block-button__link has-background wp-element-button" style="background-color:#000000;padding-top:20px;padding-right:20px;padding-bottom:20px;padding-left:20px">Say hello</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->

<!-- wp:separator {"className":"maxiblocks-go","style":{"spacing":{"margin":{"top":"0","bottom":"0"}},"color":{"background":"#f4f9fd"}}} -->
<hr class="wp-block-separator has-text-color has-alpha-channel-opacity has-background maxiblocks-go" style="margin-top:0;margin-bottom:0;background-color:#f4f9fd;color:#f4f9fd"/>
<!-- /wp:separator -->
