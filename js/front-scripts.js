jQuery(function ($) {
    var box = $('.maxi-section-container');
    var shapeDividerHeight = box.find('.maxi-shape-divider').height();

    box.on('mouseover', function(evt){
        evt.preventDefault();
        gsap.to($(this).find('.maxi-shape-divider'), {
            duration: 0.5,
            ease: Power1.easeInOut,
            height: shapeDividerHeight,
        });
    });

    box.on('mouseout', function(evt){
        evt.preventDefault();
        gsap.to($(this).find('.maxi-shape-divider'), {
            duration: 0.5,
            ease: Power2.easeInOut,
            height: 0,
        });
    });
});