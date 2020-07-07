jQuery(document).ready(function($) {

    $('body:not(.wp-admin) .hover-animation-text.hover-animation-type-text-fade').each(function(){
        if(!$(this).hasClass('hover_done')){
        $(this).wrapInner('<div class="hover_el"></div>')

        if($(this).closest($('.maxi-text-block-wrap')).length != 0){
            $(this).closest($('.maxi-text-block-wrap')).find('.maxi-block-text-hover').appendTo($(this).find('.hover_el'))
        }
        !$(this).addClass('hover_done')
    }
    })

});