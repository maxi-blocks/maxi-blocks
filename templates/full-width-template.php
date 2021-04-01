<?php
/*
 * Template Name: Maxi Full Width Template
 * Description: Full Width Template.
 */

get_header();
?>

<main id="maxi-main-container" role="main">

	<?php

	if ( have_posts() ) {

		while ( have_posts() ) {
			the_post();
			the_content();
		}
	}

	?>

</main>

<?php get_footer(); ?>
