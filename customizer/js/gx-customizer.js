jQuery(function($) {
  // $('body').addClass(gx_ajax_object.bodyClass);
  // controls
  // hide presets items, which is not selected

  // Color Schame
  // wp.customize('color_scheme', function(value) {
  //   value.bind(function(newVal) {
  //     binded click on panel doesn't work here
  //     $('body').removeClass('Default Mint Elegance Natural Admiral Peach Candy Bumblebee').addClass(newVal)
  //
  //     let preset =   wp.customize('themeSwitch'+newVal).get();
  //     wp.customize.preview.send('refresh');
  //     if (preset == 'gx-dark') {
  //       $('.gx-global.gx-block').removeClass('gx-light');
  //       $('.gx-global.gx-block').removeClass('gx-default');
  //       $('.gx-global.gx-block').addClass('gx-dark');
  //     } else {
  //       $('.gx-global.gx-block').removeClass('gx-dark');
  //       $('.gx-global.gx-block').removeClass('gx-default');
  //       $('.gx-global.gx-block').addClass('gx-light');
  //     }
  //   });
  // });





  $(document).ready(function () {
    var devices = ['desktop', 'tablet', 'mobile'];
    //Custom remove
    var themes = ['Custom', 'Default', 'Mint', 'Elegance', 'Natural', 'Admiral', 'Peach', 'Candy', 'Bumblebee'];

    // h1...h6, p customize start
    var tagBlocks = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    var BlocksStyles = [
      ['DarkFont', 'gx-dark', 'font-family'], // which control, which block, which style will change for
      ['DarkFS', 'gx-dark', 'font-size'],
      ['DarkWeight', 'gx-dark', 'font-weight'],
      ['DarkLineHgt', 'gx-dark', 'line-height'],
      ['DarkLetterSpc', 'gx-dark', 'letter-spacing'],
      ['DarkTransform', 'gx-dark', 'text-transform'],
      ['DarkStyle' , 'gx-dark', 'font-style'],
      ['DarkDecoration' , 'gx-dark', 'text-decoration-style'],
      ['DarkDecorationLine' , 'gx-dark', 'text-decoration-line'],
      ['LightFont', 'gx-light', 'font-family'],
      ['LightFS', 'gx-light', 'font-size'],
      ['LightWeight', 'gx-light', 'font-weight'],
      ['LightLineHgt', 'gx-light', 'line-height'],
      ['LightLetterSpc', 'gx-light', 'letter-spacing'],
      ['LightTransform', 'gx-light', 'text-transform'],
      ['LightStyle', 'gx-light', 'font-style'],
      ['LightDecoration' , 'gx-light', 'text-decoration-style'],
      ['LightDecorationLine' , 'gx-light', 'text-decoration-line']
    ];

    themes.forEach(theme => {
      wp.customize('body_background_color'+theme+'-color-dark', function(value) {
        value.bind(function (newVal) {
          $('head').append('<style type="text/css">' + 'body.'+theme+' .gx-dark { background-color: ' + newVal + '; }</style>');
          // $('body.'+theme+' .gx-dark').css('background-color', newVal)
        });
      });
      wp.customize('body_background_color'+theme+'-color-light', function(value) {
        value.bind(function (newVal) {
          $('head').append('<style type="text/css">' + 'body.'+theme+' .gx-light { background-color: ' + newVal + '; }</style>');
          // $('body.'+theme+' .gx-light').css('background-color', newVal)
        });
      });
      wp.customize('hover'+theme+'-color-dark', function(value) {
        value.bind(function (newVal) {
          $('#color-dark-hover').remove();
          $('head').append('<style id="color-dark-hover"> body.'+theme+' .gx-dark a:hover{ color: ' +newVal+';}</style>');
        });
      });
      wp.customize('hover'+theme+'-color-light', function(value) {
        value.bind(function (newVal) {
          $('#color-light-hover').remove();
          $('head').append('<style id="color-light-hover"> body.'+theme+' .gx-light a:hover{ color: ' +newVal+';}</style>');
        });
      });
      wp.customize('highlight'+theme+'-color-dark', function(value) {
        value.bind(function (newVal) {
          $('head').append('<style type="text/css">' + 'body.'+theme+' .gx-dark .gx-highlight { color: ' + newVal + '; }</style>');
          // $('body.'+theme+' .gx-dark .gx-highlight').css('color', newVal)
        });
      });
      wp.customize('highlight'+theme+'-color-light', function(value) {
        value.bind(function (newVal) {
          $('head').append('<style type="text/css">' + 'body.'+theme+' .gx-light .gx-highlight { color: ' + newVal + '; }</style>');
          // $('body.'+theme+' .gx-light .gx-highlight').css('color', newVal)
        });
      });
      wp.customize('p_color'+theme+'-color-dark', function(value) {
        value.bind(function (newVal) {
          $('head').append('<style type="text/css">' + 'body.'+theme+' .gx-dark p, .gx-dark li { color: ' + newVal + '; }</style>');
          // $('body.'+theme+' .gx-dark p, .gx-dark li').css('color', newVal)
        });
      });
      wp.customize('p_color'+theme+'-color-light', function(value) {
        value.bind(function (newVal) {
          $('head').append('<style type="text/css">' + 'body.'+theme+' .gx-light p, .gx-light li { color: ' + newVal + '; }</style>');
          // $('body.'+theme+' .gx-light p, .gx-light li').css('color', newVal)
        });
      });
      wp.customize('a_color'+theme+'-color-dark', function(value) {
        value.bind(function (newVal) {
          $('head').append('<style type="text/css">' + 'body.'+theme+' .gx-dark a { color: ' + newVal + '; }</style>');
          // $('body.'+theme+' .gx-dark a').css('color', newVal)
        });
      });
      wp.customize('a_color'+theme+'-color-light', function(value) {
        value.bind(function (newVal) {
          $('head').append('<style type="text/css">' + 'body.'+theme+' .gx-light a { color: ' + newVal + '; }</style>');
          // $('body.'+theme+' .gx-light a').css('color', newVal)
        });
      });
      wp.customize('h1_color'+theme+'-color-dark', function(value) {
        value.bind(function (newVal) {
          $('head').append('<style type="text/css">' + 'body.'+theme+' .gx-dark h1 { color: ' + newVal + '; }</style>');
          // $('body.'+theme+' .gx-dark h1').css('color', newVal)
        });
      });
      wp.customize('h1_color'+theme+'-color-light', function(value) {
        value.bind(function (newVal) {
          $('head').append('<style type="text/css">' + 'body.'+theme+' .gx-light h1 { color: ' + newVal + '; }</style>');
          // $('body.'+theme+' .gx-light h1').css('color', newVal)
        });
      });
      wp.customize('h2_color'+theme+'-color-dark', function(value) {
        value.bind(function (newVal) {
          $('head').append('<style type="text/css">' + 'body.'+theme+' .gx-dark h2 { color: ' + newVal + '; }</style>');
          // $('body.'+theme+' .gx-dark h2').css('color', newVal)
        });
      });
      wp.customize('h2_color'+theme+'-color-light', function(value) {
        value.bind(function (newVal) {
          $('head').append('<style type="text/css">' + 'body.'+theme+' .gx-light h2 { color: ' + newVal + '; }</style>');
          // $('body.'+theme+' .gx-light h2').css('color', newVal)
        });
      });
      wp.customize('h3_color'+theme+'-color-dark', function(value) {
        value.bind(function (newVal) {
          $('head').append('<style type="text/css">' + 'body.'+theme+' .gx-dark h3 { color: ' + newVal + '; }</style>');
          // $('body.'+theme+' .gx-dark h3').css('color', newVal)
        });
      });
      wp.customize('h3_color'+theme+'-color-light', function(value) {
        value.bind(function (newVal) {
          $('head').append('<style type="text/css">' + 'body.'+theme+' .gx-light h3 { color: ' + newVal + '; }</style>');
          // $('body.'+theme+' .gx-light h3').css('color', newVal)
        });
      });
      wp.customize('h4_color'+theme+'-color-dark', function(value) {
        value.bind(function (newVal) {
          $('head').append('<style type="text/css">' + 'body.'+theme+' .gx-dark h4 { color: ' + newVal + '; }</style>');
          // $('body.'+theme+' .gx-dark h4').css('color', newVal)
        });
      });
      wp.customize('h4_color'+theme+'-color-light', function(value) {
        value.bind(function (newVal) {
          $('head').append('<style type="text/css">' + 'body.'+theme+' .gx-light h4 { color: ' + newVal + '; }</style>');
          // $('body.'+theme+' .gx-light h4').css('color', newVal)
        });
      });
      wp.customize('h5_color'+theme+'-color-dark', function(value) {
        value.bind(function (newVal) {
          $('head').append('<style type="text/css">' + 'body.'+theme+' .gx-dark h5 { color: ' + newVal + '; }</style>');
          // $('body.'+theme+' .gx-dark h5').css('color', newVal)
        });
      });
      wp.customize('h5_color'+theme+'-color-light', function(value) {
        value.bind(function (newVal) {
          $('head').append('<style type="text/css">' + 'body.'+theme+' .gx-light h5 { color: ' + newVal + '; }</style>');
          // $('body.'+theme+' .gx-light h5').css('color', newVal)
        });
      });
      wp.customize('h6_color'+theme+'-color-dark', function(value) {
        value.bind(function (newVal) {
          $('head').append('<style type="text/css">' + 'body.'+theme+' .gx-dark h6 { color: ' + newVal + '; }</style>');
          // $('body.'+theme+' .gx-dark h6').css('color', newVal)
        });
      });
      wp.customize('h6_color'+theme+'-color-light', function(value) {
        value.bind(function (newVal) {
          $('head').append('<style type="text/css">' + 'body.'+theme+' .gx-light h6 { color: ' + newVal + '; }</style>');
          // $('body.'+theme+' .gx-light h6').css('color', newVal)
        });
      });

      devices.forEach(device => {
        tagBlocks.forEach(tagBlok => {
          $.each(BlocksStyles, function (i, controlBlock) {
            let control = tagBlok+controlBlock[0];
            // think needto change to "change event"
            wp.customize(control + theme + '-' + device, function (value) {

              value.bind(function (newVal) {
                if (tagBlok == 'p') {
                  tagBlok = 'p, .'+controlBlock[1]+' li';
                }
                let elem =  `body.${theme} .${controlBlock[1]} ${tagBlok}`;

                let elemStyle = controlBlock[2];
                if (controlBlock[2] == 'font-family') {
                  $(elem).css(elemStyle, newVal.replace(/\+/g, ' '));
                  let styles = (gx_ajax_object.font_info[newVal].subsets).join(',');
                  let weights = Object.values(gx_ajax_object.font_info[newVal].weights).join(',');
                  let fontURL = newVal+':'+weights+'&subset='+styles;
                  if(['Verdana', 'Arial'].includes(newVal) != false)
                  $('head').append('<link href="https://fonts.googleapis.com/css?family=' + fontURL +'" rel="stylesheet" type="text/css">');
                } else {
                  $(elem).css(elemStyle, newVal);
                }
              });

            })
          })
        })
      });
    });
  });
  // // h1...h6, p customize start customize end



  // global theme customizing, change theme  mod on page load
  wp.customize('themeSwitch'+wp.customize('color_scheme').get(), function (value) {

    $('.gx-global.gx-block').removeClass('gx-default');
    if (value.get() === 'gx-dark') {
      $('.gx-global.gx-block').removeClass('gx-light');
      $('.gx-global.gx-block').addClass('gx-dark');
    }
    else if( value.get() === 'gx-light'){
      $('.gx-global.gx-block').removeClass('gx-dark');
      $('.gx-global.gx-block').addClass('gx-light');
    } else {

      $.each($('.gx-global.gx-block'), function (block) {
        $(this).removeClass('gx-dark');
        $(this).removeClass('gx-light');
        $(this).addClass(($(this).attr('data-gx_initial_block_class')).replace('-def', ''));
      })

    }
  })
});
