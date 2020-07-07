jQuery(document).ready(function($) {

    let animation_speed = 300;

    $('body:not(.wp-admin) .hover-animation-basic.hover-animation-type-zoom-in').each(function(){
        if(!$(this).hasClass('hover_done')){
        if($(this).hasClass('maxi-image-block')){
            $(this).addClass('animate_image')
        }

        $(this).wrapInner('<div class="hover_el"></div>');
            !$(this).addClass('hover_done')
        }
    })



});