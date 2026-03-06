<?php

if ( ! defined( 'ABSPATH' ) ) exit;
/*
 * Template Name: Maxi full width template
 * Description: Full width template.
 */

get_header(); ?>

<main id="maxi-main-container" role="main">
	<div class="entry-content">

	<?php

if ( ! defined( 'ABSPATH' ) ) exit; if (have_posts()) {
		while (have_posts()) {
			the_post();
			the_content();
		}
	} ?>

	</div> 
</main>

<?php

if ( ! defined( 'ABSPATH' ) ) exit; get_footer(); ?>
