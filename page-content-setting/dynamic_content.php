<?php
//add_action( 'wp_footer', 'page_dynamic' );
//function page_dynamic() {
//    wp_enqueue_script( 'customizer-page-dynamic', plugin_dir_url( __FILE__ ) . "/customizer/js/maxi-customizer-dynamic.js?v=".rand(), array('jquery'), '1.0', true);
//    wp_localize_script( 'customizer-page-dynamic', 'dynamic_page_values',
//        array(
//            'themeSwitch' => get_theme_mod( 'themeSwitch' ),
//        )
//    );
//}

//======================================================================
// ON POST SAVE
//======================================================================

add_action('save_post', 'gx_save_post_function', 10, 3);
function gx_save_post_function($post_id, $post, $update) {
    delete_post_meta($post_id, 'has-class');
    $post_content = get_post_field('post_content', $post_id);
    $post_type = $post->post_type;

    if ($post_type == 'page') {
        if ( !!preg_match('#\\b'.preg_quote('maxi-block', '#').'\\b#i', $post_content) ) {
            add_post_meta($post_id, 'has-class', 'maxi-block');
        }
    }

}

//======================================================================
// ON Rendering post
//======================================================================

//add_filter( 'the_content', 'check_page_content_test');
function check_page_content_test( $content ) {
    $fullContent = get_the_content(); // argument ($content) in admin page will work for each block
    $pageID = get_the_ID();
    $page_type = get_post_field('post_type', $pageID);
    $themeName = get_theme_mod('color_scheme') ? get_theme_mod('color_scheme') : 'Custom';
    $themeSwitch = get_theme_mod('themeSwitch'.$themeName) ? get_theme_mod('themeSwitch'.$themeName) : 'maxi-default';

    // add aditional info what was the initial class for blocks

    if ( $themeSwitch !== 'maxi-default' && (get_post_meta($pageID, 'has-class', true) || (is_page() && !!preg_match('#\\b'.preg_quote('maxi-block', '#').'\\b#i', $fullContent) )) ) {

        $will_remove = $themeSwitch == 'maxi-dark' ? 'maxi-light' : 'maxi-dark';
        $contentTemp = $content;

        // don't replace if there are special blocks (they have not maxi-global class)
        if (!!preg_match('#\\b' . preg_quote('maxi-global', '#') . '\\b#i', $content)) {
            // $content = preg_replace('/\s+/', ' ', $content); // remove all spaces
            $content = str_replace([$will_remove, $themeSwitch, 'maxi-default'], '', $content); // remove global classes
            // then add current global class
            $content = str_replace('maxi-block maxi-global', 'maxi-block maxi-global ' . $themeSwitch, $content);
        }

        $tempFullContent = str_replace($contentTemp, $content, $fullContent);
        // check if doesn't replace, in single page replace from there where occurres
        if (is_page() && $tempFullContent == $fullContent) {

            $tempFullContent = explode("\n", $fullContent);
            array_walk($tempFullContent, function (&$value) use ($will_remove, $themeSwitch) {
                if (!!preg_match('#\\b' . preg_quote('maxi-global', '#') . '\\b#i', $value)) {

                    // need to diferentiate which class is setted by default
                    $value = str_replace([$will_remove, $themeSwitch, 'maxi-default'], '', $value); // remove global classes
                    $value = preg_replace('#\\b' . preg_quote('maxi-global', '#') . '\\b#i', 'maxi-global ' . $themeSwitch . '', $value);

                }
            });
            $fullContent = implode("\n", $tempFullContent);

        }
    }

    // IN admin panel it works for each block when refresh the page
    // will  work when click on publish
//    if ( !is_admin() ) {
//        wp_update_post(array(
//            'ID' => $pageID,
//            'post_content' => $fullContent
//        ));
//    }

    return $fullContent;
}