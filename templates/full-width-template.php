<?php
/*
 * Template Name: Maxi full width template
 * Description: Full width template.
 */

get_header(); ?>

<main id="maxi-main-container" role="main">
	<div class="entry-content">

	<?php if (have_posts()) {
		while (have_posts()) {
			the_post();
			the_content();
		}
	} ?>

	</div> 
</main>

<?php get_footer(); ?>
