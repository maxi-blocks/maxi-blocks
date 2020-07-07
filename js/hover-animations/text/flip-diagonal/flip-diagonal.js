
jQuery(document).ready(function($) {
    $('body:not(.wp-admin) .hover-animation-text.hover-animation-type-text-flip-diagonal').each(function(){
        if(!$(this).hasClass('hover_done')){
        $(this).wrapInner('<div class="hover_el"></div>')


        $(this).find('.maxi-block-text-hover').insertAfter($(this).find('.hover_el'))

        if($(this).closest($('.maxi-text-block-wrap')).length != 0){
            $(this).closest($('.maxi-text-block-wrap')).find('.maxi-block-text-hover').insertAfter($(this).find('.hover_el'))
        }

            !$(this).addClass('hover_done')
        }
    })


});