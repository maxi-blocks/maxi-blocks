jQuery(document).ready(function($) {
    $('body:not(.wp-admin) .hover-animation-text.hover-animation-type-text-reveal-right').each(function(){
        if(!$(this).hasClass('hover_done')){
        $(this).wrapInner('<div class="hover_el"></div>')

        $(this).find('.hover_el').prepend($('<div class="hover_background"></div>'));

        if($(this).closest($('.maxi-text-block-wrap')).length != 0){
            $(this).closest($('.maxi-text-block-wrap')).find('.maxi-block-text-hover').appendTo($(this).find('.hover_el'))
        }


        $(this).find('.hover_background').css('background-color', $(this).find('.maxi-block-text-hover').css('background-color'))
        $(this).find('.maxi-block-text-hover').css('cssText', 'background-color: transparent !important;')
            !$(this).addClass('hover_done')
        }
    })


});