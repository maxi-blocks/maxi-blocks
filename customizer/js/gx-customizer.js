/**
 * This file add styles on document when changing colors
 */

jQuery(function($) {
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
                    console.log('dark background: ', newVal)
                    document.documentElement.style.setProperty(`--${theme}-dark-background`, newVal, "important");
                    //$('head').append('<style type="text/css">' + 'body.'+theme+' .gx-dark { background-color: ' + newVal + ' !important; }</style>');
                    // $('body.'+theme+' .gx-dark').css('background-color', newVal)
                });
            });
            wp.customize('body_background_color'+theme+'-color-light', function(value) {
                value.bind(function (newVal) {
                    console.log('light background: ', newVal)
                    document.documentElement.style.setProperty(`--${theme}-light-background`, newVal, "important");
                    // $('head').append('<style type="text/css">' + 'body.'+theme+' .gx-light { background-color: ' + newVal + ' !important; }</style>');
                    // $('body.'+theme+' .gx-light').css('background-color', newVal)
                });
            });
            wp.customize('hover'+theme+'-color-dark', function(value) {
                value.bind(function (newVal) {
                    document.documentElement.style.setProperty(`--${theme}-dark-hover`, newVal, "important");
                    // $('#color-dark-hover').remove();
                    // $('head').append('<style id="color-dark-hover"> body.'+theme+' .gx-dark a:hover{ color: ' +newVal+' !important; }</style>');
                });
            });
            wp.customize('hover'+theme+'-color-light', function(value) {
                value.bind(function (newVal) {
                    document.documentElement.style.setProperty(`--${theme}-light-hover`, newVal, "important");
                    $('#color-light-hover').remove();
                    $('head').append('<style id="color-light-hover"> body.'+theme+' .gx-light a:hover{ color: ' +newVal+' !important; }</style>');
                });
            });
            wp.customize('highlight'+theme+'-color-dark', function(value) {
                value.bind(function (newVal) {
                    document.documentElement.style.setProperty(`--${theme}-dark-hightlight`, newVal, "important");
                    // $('head').append('<style type="text/css">' + 'body.'+theme+' .gx-dark .gx-highlight { color: ' + newVal + ' !important; }</style>');
                    // $('head').append('<style type="text/css">' + 'body.'+theme+' .gx-dark .gx-divider { border-color: ' + newVal + ' !important; }</style>');
                    // $('body.'+theme+' .gx-dark .gx-highlight').css('color', newVal)
                });
            });
            wp.customize('highlight'+theme+'-color-light', function(value) {
                value.bind(function (newVal) {
                    document.documentElement.style.setProperty(`--${theme}-light-highlight`, newVal, "important");

                    // $('head').append('<style type="text/css">' + 'body.'+theme+' .gx-light .gx-highlight { color: ' + newVal + ' !important; }</style>');
                    // $('head').append('<style type="text/css">' + 'body.'+theme+' .gx-light .gx-divider { border-color: ' + newVal + ' !important; }</style>');
                    // $('body.'+theme+' .gx-light .gx-highlight').css('color', newVal)
                });
            });
            wp.customize('p_color'+theme+'-color-dark', function(value) {
                value.bind(function (newVal) {
                    document.documentElement.style.setProperty(`--${theme}-dark-p-color`, newVal, "important");
                    // $('head').append('<style type="text/css">' + 'body.'+theme+' .gx-dark p, .gx-dark li { color: ' + newVal + ' !important; }</style>');
                    // $('body.'+theme+' .gx-dark p, .gx-dark li').css('color', newVal)
                });
            });
            wp.customize('p_color'+theme+'-color-light', function(value) {
                value.bind(function (newVal) {
                    document.documentElement.style.setProperty(`--${theme}-light-p-color`, newVal, "important");
                    // $('head').append('<style type="text/css">' + 'body.'+theme+' .gx-light p, .gx-light li { color: ' + newVal + ' !important; }</style>');
                    // $('body.'+theme+' .gx-light p, .gx-light li').css('color', newVal)
                });
            });
            wp.customize('a_color'+theme+'-color-dark', function(value) {
                value.bind(function (newVal) {
                    document.documentElement.style.setProperty(`--${theme}-dark-a-color`, newVal, "important");
                    // $('head').append('<style type="text/css">' + 'body.'+theme+' .gx-dark a { color: ' + newVal + ' !important; }</style>');
                    // $('body.'+theme+' .gx-dark a').css('color', newVal)
                });
            });
            wp.customize('a_color'+theme+'-color-light', function(value) {
                value.bind(function (newVal) {
                    document.documentElement.style.setProperty(`--${theme}-light-a-color`, newVal, "important");
                    // $('head').append('<style type="text/css">' + 'body.'+theme+' .gx-light a { color: ' + newVal + ' !important; }</style>');
                    // $('body.'+theme+' .gx-light a').css('color', newVal)
                });
            });
            wp.customize('h1_color'+theme+'-color-dark', function(value) {
                value.bind(function (newVal) {
                    document.documentElement.style.setProperty(`--${theme}-dark-h1-color`, newVal, "important");
                    $('head').append('<style type="text/css">' + 'body.'+theme+' .gx-dark h1 { color: ' + newVal + ' !important; }</style>');
                    // $('body.'+theme+' .gx-dark h1').css('color', newVal)
                });
            });
            wp.customize('h1_color'+theme+'-color-light', function(value) {
                value.bind(function (newVal) {
                    document.documentElement.style.setProperty(`--${theme}-light-h1-color`, newVal, "important");
                    $('head').append('<style type="text/css">' + 'body.'+theme+' .gx-light h1 { color: ' + newVal + ' !important; }</style>');
                    // $('body.'+theme+' .gx-light h1').css('color', newVal)
                });
            });
            wp.customize('h2_color'+theme+'-color-dark', function(value) {
                value.bind(function (newVal) {
                    document.documentElement.style.setProperty(`--${theme}-dark-h2-color`, newVal, "important");
                    // $('head').append('<style type="text/css">' + 'body.'+theme+' .gx-dark h2 { color: ' + newVal + ' !important; }</style>');
                    // $('body.'+theme+' .gx-dark h2').css('color', newVal)
                });
            });
            wp.customize('h2_color'+theme+'-color-light', function(value) {
                value.bind(function (newVal) {
                    document.documentElement.style.setProperty(`--${theme}-light-h2-color`, newVal, "important");
                    // $('head').append('<style type="text/css">' + 'body.'+theme+' .gx-light h2 { color: ' + newVal + ' !important; }</style>');
                    // $('body.'+theme+' .gx-light h2').css('color', newVal)
                });
            });
            wp.customize('h3_color'+theme+'-color-dark', function(value) {
                value.bind(function (newVal) {
                    document.documentElement.style.setProperty(`--${theme}-dark-h3-color`, newVal, "important");
                    // $('head').append('<style type="text/css">' + 'body.'+theme+' .gx-dark h3 { color: ' + newVal + ' !important; }</style>');
                    // $('body.'+theme+' .gx-dark h3').css('color', newVal)
                });
            });
            wp.customize('h3_color'+theme+'-color-light', function(value) {
                value.bind(function (newVal) {
                    document.documentElement.style.setProperty(`--${theme}-light-h3-color`, newVal, "important");
                    // $('head').append('<style type="text/css">' + 'body.'+theme+' .gx-light h3 { color: ' + newVal + ' !important; }</style>');
                    // $('body.'+theme+' .gx-light h3').css('color', newVal)
                });
            });
            wp.customize('h4_color'+theme+'-color-dark', function(value) {
                value.bind(function (newVal) {
                    document.documentElement.style.setProperty(`--${theme}-dark-h4-color`, newVal, "important");
                    // $('head').append('<style type="text/css">' + 'body.'+theme+' .gx-dark h4 { color: ' + newVal + ' !important; }</style>');
                    // $('body.'+theme+' .gx-dark h4').css('color', newVal)
                });
            });
            wp.customize('h4_color'+theme+'-color-light', function(value) {
                value.bind(function (newVal) {
                    document.documentElement.style.setProperty(`--${theme}-light-h4-color`, newVal, "important");
                    // $('head').append('<style type="text/css">' + 'body.'+theme+' .gx-light h4 { color: ' + newVal + ' !important; }</style>');
                    // $('body.'+theme+' .gx-light h4').css('color', newVal)
                });
            });
            wp.customize('h5_color'+theme+'-color-dark', function(value) {
                value.bind(function (newVal) {
                    document.documentElement.style.setProperty(`--${theme}-dark-h5-color`, newVal, "important");
                    // $('head').append('<style type="text/css">' + 'body.'+theme+' .gx-dark h5 { color: ' + newVal + ' !important; }</style>');
                    // $('body.'+theme+' .gx-dark h5').css('color', newVal)
                });
            });
            wp.customize('h5_color'+theme+'-color-light', function(value) {
                value.bind(function (newVal) {
                    document.documentElement.style.setProperty(`--${theme}-light-ph5color`, newVal, "important");
                    // $('head').append('<style type="text/css">' + 'body.'+theme+' .gx-light h5 { color: ' + newVal + ' !important; }</style>');
                    // $('body.'+theme+' .gx-light h5').css('color', newVal)
                });
            });
            wp.customize('h6_color'+theme+'-color-dark', function(value) {
                value.bind(function (newVal) {
                    document.documentElement.style.setProperty(`--${theme}-dark-h6-color`, newVal, "important");
                    // $('head').append('<style type="text/css">' + 'body.'+theme+' .gx-dark h6 { color: ' + newVal + ' !important; }</style>');
                    // $('body.'+theme+' .gx-dark h6').css('color', newVal)
                });
            });
            wp.customize('h6_color'+theme+'-color-light', function(value) {
                value.bind(function (newVal) {
                    document.documentElement.style.setProperty(`--${theme}-light-h6-color`, newVal, "important");
                    // $('head').append('<style type="text/css">' + 'body.'+theme+' .gx-light h6 { color: ' + newVal + ' !important; }</style>');
                    // $('body.'+theme+' .gx-light h6').css('color', newVal)
                });
            });


            // I think this part is not working...
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
                                let elem =    `body.${theme} .${controlBlock[1]} ${tagBlok}`;

                                let elemStyle = controlBlock[2];
                                console.log( 'elemStyle'+elemStyle);
                                 $(elem).css({elemStyle: ''});
                                //$(elem)[0].style[elemStyle] = '';
                                console.log('remove '+elemStyle);
                                let current_css = $(elem).attr('style') ? ($(elem).attr('style')+'; ') : '';


                                 console.log('current_css: '+current_css);
                                // $(elem)[0].setAttribute('style', current_css + elemStyle + ":" + newVal + " !important");
                                if (elemStyle == 'font-family') {
                                        console.log('font family!!');
                                        let styles = (gx_ajax_object.font_info[newVal].subsets).join(',');
                                        console.log("styles " + styles);
                                        let weights = Object.values(gx_ajax_object.font_info[newVal].weights).join(',');
                                        console.log("weights "+weights);
                                        let fontURL = newVal+':'+weights+'&subset='+styles;
                                        console.log('fontURL: '+fontURL);
                                        if(['Verdana', 'Arial'].includes(newVal) == false) {
                                            console.log('before append');
                                        $('head').append('<link href="https://fonts.googleapis.com/css?family=' + fontURL +'" rel="stylesheet" type="text/css">');
                                        newVal = newVal.replace(/\+/g, ' ');
                                        $(elem)[0].setAttribute('style', current_css + elemStyle + ": \"" + newVal + "\" !important");
                                    }
                                }
                                else { $(elem)[0].setAttribute('style', current_css + elemStyle + ":" + newVal + " !important");}
                            });

                        })
                    })
                })
            });
        });
    });
    // // h1...h6, p customize start customize end



    // global theme customizing, change theme    mod on page load
    wp.customize('themeSwitch'+wp.customize('color_scheme').get(), function (value) {

        $('.gx-global.gx-block').removeClass('gx-default');
        if (value.get() === 'gx-dark') {
            $('.gx-global.gx-block').removeClass('gx-light');    $('#sub-accordion-section-globalStyling li.customize-section-description-container h3').append('<span class="gx-information"><img src="/wp-content/plugins/gutenberg-extra/img/information.svg" alt="info icon" /></span>');

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
    });

    // add ( i ) icon to a header

    $('#sub-accordion-section-globalStyling li.customize-section-description-container h3').append('<span class="gx-information"><img src="/wp-content/plugins/gutenberg-extra/img/information.svg" alt="info icon" /></span>');
});
