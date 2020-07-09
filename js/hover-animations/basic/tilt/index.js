jQuery(document).ready(function($) {

	let animation_speed = 300;

  $('.hover-animation-basic.hover-animation-type-tilt').each(function(){
  	switch (true) {
        case $(this).hasClass('hover-animation-duration-shorter'):
          animation_speed = 100
          break;
        case $(this).hasClass('hover-animation-duration-short'):
          animation_speed = 200
          break;
        case $(this).hasClass('hover-animation-duration-normal'):
          animation_speed = 300
        case $(this).hasClass('hover-animation-duration-long'):
          animation_speed = 400
        case $(this).hasClass('hover-animation-duration-longer'):
          animation_speed = 500
          break;
      }

      $(this).tilt({
          speed: animation_speed,
          perspective:    1500,
      });
  })



}); //jQuery(document).ready(function($)