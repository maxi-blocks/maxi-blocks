<?php
/**
  * Title: Basic Blog Home
  * Slug: maxiblocks-go/basic-blog-home
  * Categories: maxiblocks-go-homepage, maxiblocks-go-blog-index
  * Template Types: home, front-page, page
  */
?>
<!-- wp:group {"className":"maxiblocks-go post_group_landing template_width","style":{"spacing":{"padding":{"top":"150px","bottom":"150px"},"margin":{"top":"0","bottom":"0"}}},"layout":{"type":"default"}} -->
<div class="wp-block-group maxiblocks-go post_group_landing template_width" style="margin-top:0;margin-bottom:0;padding-top:150px;padding-bottom:150px"><!-- wp:query {"className":"maxiblocks-go","queryId":12,"query":{"perPage":10,"pages":0,"offset":"0","postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false},"align":"wide","layout":{"type":"default"}} -->
<div class="wp-block-query alignwide maxiblocks-go"><!-- wp:query-no-results -->
<!-- wp:paragraph -->
<p>No posts were found.</p>
<!-- /wp:paragraph -->
<!-- /wp:query-no-results -->

<!-- wp:group {"className":"maxiblocks-go","style":{"spacing":{"padding":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|50","left":"0","right":"0"},"margin":{"top":"0","bottom":"0"}}},"layout":{"type":"default"}} -->
<div class="wp-block-group maxiblocks-go" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--50);padding-right:0;padding-bottom:var(--wp--preset--spacing--50);padding-left:0"><!-- wp:post-template {"align":"full","style":{"spacing":{"blockGap":"var:preset|spacing|30"}},"layout":{"type":"grid","columnCount":3}} -->
<!-- wp:post-featured-image {"isLink":true,"aspectRatio":"4/3","style":{"spacing":{"margin":{"bottom":"0"},"padding":{"bottom":"var:preset|spacing|20"}},"border":{"radius":"30px"}}} /-->

<!-- wp:group {"className":"maxiblocks-go","style":{"spacing":{"blockGap":"10px","margin":{"top":"var:preset|spacing|20"},"padding":{"top":"0"}}},"layout":{"type":"flex","orientation":"vertical","flexWrap":"nowrap"}} -->
<div class="wp-block-group maxiblocks-go" style="margin-top:var(--wp--preset--spacing--20);padding-top:0"><!-- wp:post-title {"isLink":true,"style":{"layout":{"flexSize":"min(2.5rem, 3vw)","selfStretch":"fixed"},"color":{"text":"#000000"},"elements":{"link":{"color":{"text":"#000000"}}},"typography":{"fontSize":"24px","fontStyle":"normal","fontWeight":"700"}}} /-->

<!-- wp:post-date {"className":"maxiblocks-go","isLink":true,"style":{"color":{"text":"#000000"},"elements":{"link":{"color":{"text":"#000000"}}}}} /-->

<!-- wp:post-excerpt {"className":"maxiblocks-go","moreText":"Read more","excerptLength":25,"style":{"layout":{"selfStretch":"fit","flexSize":null},"color":{"text":"#9b9b9b"},"elements":{"link":{"color":{"text":"#010101"},":hover":{"color":{"text":"#c9340a"}}}}}} /-->

<!-- wp:spacer {"height":"0px","style":{"layout":{"flexSize":"min(2.5rem, 3vw)","selfStretch":"fixed"}}} -->
<div style="height:0px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer --></div>
<!-- /wp:group -->
<!-- /wp:post-template -->

<!-- wp:query-pagination {"className":"maxiblocks-go","paginationArrow":"arrow","layout":{"type":"flex","justifyContent":"space-between"}} -->
<!-- wp:query-pagination-previous /-->

<!-- wp:query-pagination-next /-->
<!-- /wp:query-pagination --></div>
<!-- /wp:group --></div>
<!-- /wp:query --></div>
<!-- /wp:group -->
