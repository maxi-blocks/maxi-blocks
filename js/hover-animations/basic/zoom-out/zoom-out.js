jQuery(document).ready(function($) {

    $('body:not(.wp-admin) .hover-animation-basic.hover-animation-type-zoom-out').each(function(){
        if(!$(this).hasClass('hover_done')){
        if($(this).hasClass('maxi-image-block')){
            $(this).addClass('animate_image')
        }


        $(this).wrapInner('<div class="hover_el"></div>')
            !$(this).addClass('hover_done')
        }
    })
});