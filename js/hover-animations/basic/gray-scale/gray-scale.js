jQuery(document).ready(function ($) {
    $('body:not(.wp-admin) .hover-animation-basic.hover-animation-type-gray-scale').each(function () {
        if (!$(this).hasClass('hover_done')) {
            $(this).wrapInner('<div class="hover_el"></div>')
            !$(this).addClass('hover_done')
        }
    })
});