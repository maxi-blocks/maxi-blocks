jQuery(function($) {
            /**
         * make modal for showing title like information
         * @param modal_content
         * @return modal
         */
        function modalTitle(modal_content, tooltipElement, event, showToolTipDirection = 'middle') {
            // var topPos = +(event.clientY);
            // var leftPos = +(event.clientX);
            $('.tooltiptext, #tooltiptextCss').remove();
            var topPos = 0;
            var leftPos = 0;
            var $modal = `<div class="tooltiptext ${showToolTipDirection}">
                            ${modal_content}
                          </div>`;
            var tooltipElementClass = (tooltipElement.className).replace(/\s/g, '.');
            $('head').append(`<style id="tooltiptextCss"> .${tooltipElementClass} {position: relative;} </style>`);
            $(tooltipElement).append($modal);
            var modalHeight = $('.tooltiptext')[0].getBoundingClientRect().height;
            var modalWidth = $('.tooltiptext')[0].getBoundingClientRect().width;
            topPos = (+topPos - modalHeight-20);
            if (showToolTipDirection === 'middle'){
                leftPos = (+leftPos - modalWidth/2);
            }
            else if (showToolTipDirection === 'right'){
                leftPos = (+leftPos + +(modalWidth/4));
            }
            $('#tooltiptextCss').append('.tooltiptext{visibility: visible !important; opacity: 1!important;}');
        }
        /**
         * Setup sections as labels
         */
        $('#accordion-section-globalBlockStyles, #accordion-section-themeOptions').removeClass();
        $('#accordion-section-globalBlockStyles').html('<h2 class="accordion-section-title">Global Block Styles<span class="dashicons dashicons-info showTooltip" data-title="Adjust default styles of all GutenbergExtra blocks, anywehere they are used" style="pointer-events: painted;"> </span></h2>');
        $('#accordion-section-themeOptions').html('<h2 class="accordion-section-title">Theme Options<span class="dashicons dashicons-info showTooltip" data-title="Adjust default styles of all GutenbergExtra blocks, anywehere they are used" style="pointer-events: painted;"> </span></h2>');
        /**
         * when hover on element included tooltips, show
         */
        $(document).on('hover', '.showTooltip', function (e) {
            var modal_content = $(this).attr('data-title') ? $(this).attr('data-title') : 'test';
            var tooltipElement = this;
            var direction = "middle";
            // left side bar
            if( ($(this).attr("class")).includes('gx-sec-') ){
                direction = "right";
            }
            modalTitle(modal_content, tooltipElement, e, direction);
        })
        $(document).on('mouseleave', '.showTooltip, .wp-picker-container, .customize-control-color .customize-control-title', function () {
            $('.tooltiptext, #tooltiptextCss').remove();
        })
        $(document).on('hover', `li[id*="-color-"] .customize-control-title`, function (e) {
            var modal_content = ($(this).text()).trim();
            var tooltipElement = this;
            var direction = "middle";
            $('.tooltiptext, #tooltiptextCss').remove();
            if(modal_content !== '')
            modalTitle(modal_content, tooltipElement, e, direction);
        })
        /**
         * Setup loader while page gets ready
         * @param setup
         */
    function loaderSetUp(setup = "add"){

        $('#page-loader').remove();
        if (setup === 'remove') {
            $('#page-loader-css').remove();
            return;
        }

        var loader = '<div class="wrap-loader" id="page-loader">' +
                        '<div class="loading">' +
                        '<div class="text"><img src="/wp-content/plugins/gutenberg-extra/img/loader.svg"></div>' +
                    '</div>'+
                '</div>';
        $('body').append(loader);

    }


    // will work when change theme or presets
    function hide_presetsBlocks(selectedTheme, themePreset) {
        let preset = themePreset;
        themePreset = themePreset === 'gx-dark' ? 'Dark' : (themePreset === 'gx-light' ? 'Light' : '')

        $('#customize-control-reset').removeClass('customize-control-reset-default')

        // wp.customize.preview.send('refresh');
        // when customize theme, then click on presets, customize function doesn't work
        let iframe = $("iframe").contents();
        iframe.find('body').removeClass('Default Mint Elegance Natural Admiral Peach Candy Bumblebee').addClass(selectedTheme)
        iframe.find('.gx-global.gx-block').removeClass('gx-default');
        if (preset === 'gx-dark') {
            iframe.find('.gx-global.gx-block').removeClass('gx-light');
            iframe.find('.gx-global.gx-block').addClass('gx-dark');
        }
        else if (preset == 'gx-light') {
            iframe.find('.gx-global.gx-block').removeClass('gx-dark');
            iframe.find('.gx-global.gx-block').addClass('gx-light');
        } else {
            // when click on default reset to initial block classes
            $.each(iframe.find('.gx-global.gx-block'), function (block) {
                $(this).removeClass('gx-dark');
                $(this).removeClass('gx-light');
                $(this).addClass(($(this).attr('data-gx_initial_block_class')).replace('-def', ''));
            })

        }

        $(`li[id*='_blockPopUp_']`).addClass('customize-control-hidden').removeClass('customize-control-text');
        $(`li[id*='${themePreset}${selectedTheme}_blockPopUp_']`).addClass('customize-control-text').removeClass('customize-control-hidden');
        $(`#customize-control-lightColors`).removeClass('top-200');
        $(`#customize-control-darkColors`).removeClass('customize-control-hidden').addClass('customize-control-text');
        $(`#customize-control-lightColors`).removeClass('customize-control-hidden').addClass('customize-control-text');
        $(`li[id*='${selectedTheme}-color-dark']`).removeClass('customize-control-hidden').addClass('customize-control-color');
        $(`li[id*='${selectedTheme}-color-light']`).removeClass('customize-control-hidden').addClass('customize-control-color');


        if (themePreset === "Dark") {
            $(`#customize-control-lightColors`).addClass('customize-control-hidden').removeClass('customize-control-text');
            $(`li[id*='${selectedTheme}-color-light']`).addClass('customize-control-hidden').removeClass('customize-control-color');
        }
        else if (themePreset === "Light"){
            $(`#customize-control-darkColors`).addClass('customize-control-hidden').removeClass('customize-control-text');
            $(`#customize-control-lightColors`).addClass('top-200');
            $(`li[id*='${selectedTheme}-color-dark']`).addClass('customize-control-hidden').removeClass('customize-control-color');
        } else {
            $('#customize-control-reset').addClass('customize-control-reset-default')
        }
    }


    $('#_customize-input-color_scheme').on('change', function () {
        let newVal = $(this).val();
        let themePreset = wp.customize(`themeSwitch${newVal}`).get();
        hide_presetsBlocks(newVal, themePreset);
        wp.customize(`color_scheme`).set(newVal)
    })
    $('select[id*="themeSwitch"]').on('change', function () {
        let selectedTheme = wp.customize(`color_scheme`).get();
        hide_presetsBlocks(selectedTheme, $(this).val());

    })


    function renderColorsBlock(text) {
        return '<label class="customize-control-title">' + text + '</label><ul></ul>'
    }
    function getTextFromString(string) {
        return string.replace(/\d+([,.]\d+)?/g, ''); //example 47px returned px
    }

    function makePopUp(id) {

        var selectedTheme = $('#_customize-input-color_scheme').val();
        let tagName = id.substring(0, 2);
        let thememod = id.startsWith('p') ? id.substring(1) : id.substring(2); // for p block cut first letter
        let defaultThemeOptions = JSON.parse(gx_ajax_object.defaultThemeOptions);
        let domElements = defaultThemeOptions[selectedTheme][thememod]['domElements'];

        let lightOpt = defaultThemeOptions[selectedTheme]['Light']['domElements'];
        let darkOpt = defaultThemeOptions[selectedTheme]['Dark']['domElements'];

        let defaultFontSizes = {
            'pL': lightOpt['p']['font-size'] ? lightOpt['p']['font-size'] : '0.8em',
            'pD': darkOpt['p']['font-size'] ? darkOpt['p']['font-size']: '0.8em',
            'h1': domElements['h1']['font-size'] ? domElements['h1']['font-size'] : '2em',
            'h2': domElements['h2']['font-size'] ? domElements['h2']['font-size'] : '1.5em',
            'h3': domElements['h3']['font-size'] ? domElements['h3']['font-size'] : '1.17em',
            'h4': domElements['h4']['font-size'] ? domElements['h4']['font-size'] : '0.9em',
            'h5': domElements['h5']['font-size'] ? domElements['h5']['font-size'] : '0.83em',
            'h6': domElements['h6']['font-size'] ? domElements['h6']['font-size'] : '0.67em',
        }


        let device = $('#customize-footer-actions .devices .active').attr('data-device');
        console.log('value '+$('#customize-control-'+id+'FS'+selectedTheme+'-'+device+' input').val());
        let fsValue = $('#customize-control-'+id+'FS'+selectedTheme+'-'+device+' input').val();
        let weightValue = $('#customize-control-'+id+'Weight'+selectedTheme+'-'+device+' input').val();
        let transformValue = $('#customize-control-'+id+'Transform'+selectedTheme+'-'+device+' input').val();
        let styleValue = $('#customize-control-'+id+'Style'+selectedTheme+'-'+device+' input').val();
        let decorationValue = $('#customize-control-'+id+'Decoration'+selectedTheme+'-'+device+' input').val();
        let decorationLineValue = $('#customize-control-'+id+'DecorationLine'+selectedTheme+'-'+device+' input').val();
        let lineHgtValue = $('#customize-control-'+id+'LineHgt'+selectedTheme+'-'+device+' input').val();
        let letterSpcValue = $('#customize-control-'+id+'LetterSpc'+selectedTheme+'-'+device+' input').val();
        let fsInput = parseFloat(fsValue);

        let lineHgtInput = parseFloat(lineHgtValue);
        let letterSpcInput = parseFloat(letterSpcValue);

        let activeFStype =  getTextFromString(fsValue) ? getTextFromString(fsValue) : 'px';
        console.log('value 2'+activeFStype);
        let activelineHgtType = getTextFromString(lineHgtValue);
        let activeletterSpcType = getTextFromString(letterSpcValue);
        console.log('value h'+activelineHgtType);
        let list = gx_ajax_object.list;
        let tag = tagName.includes('p') ? 'p' : tagName;



        let activeFontFamily = $('#customize-control-'+id+'Font'+selectedTheme+'-'+device+' input').val();
        //weight related to active font

        let initWeightsRelFont = gx_ajax_object.font_info[activeFontFamily] ? Object.values(gx_ajax_object.font_info[activeFontFamily].weights) : ['100', '200', '300', '400', '500', '600', '700', '800', '900'];
        let initweightsRelFontHtml = (initWeightsRelFont.map(item => `<option ${weightValue == item ? 'selected' : ''} value="${item}">${item}</option>`)).join();

        let initStylesRelFont = gx_ajax_object.font_info[activeFontFamily] ? gx_ajax_object.font_info[activeFontFamily].styles : ['normal', 'italic', 'oblique'];
        let initStylesRelFontHtml = (initStylesRelFont.map(item => `<option ${styleValue == item ? 'selected' : ''} value="${item}">${item}</option>`)).join();

        let html = '<div class="heading-pop-up">' +
            '        <div class="close-pop-up"><span class="dashicons dashicons-no"></span></div>'+
            '        <div class="row">' +
            '            <span>Family</span> <div class="reset" data-default="' + domElements[tag]['font-family'] + '"></div>' +
            '            <select class="font-family-select" data-id='+id+'Font'+selectedTheme+'-'+device+'><img src="/wp-content/plugins/gutenberg-extra/img/reset.svg" />';
        for(let i in list){
            if(list[i].replace(/\ /g, '+') === activeFontFamily){
                html+= '<option selected value='+list[i].replace(/\ /g, '+')+'>'+list[i]+'</option>';

            } else{
                html+= '<option value='+list[i].replace(/\ /g, '+')+'>'+list[i]+'</option>';
            }
        }
        html+='</select>' +
            '            <div class="devices">';
        if(device == 'desktop'){
            html+=' <div data-type="desktop" class="device active"><img src="/wp-content/plugins/gutenberg-extra/img/gx-desktop.svg"></div>';
        } else {
            html+=' <div data-type="desktop" class="device"><img src="/wp-content/plugins/gutenberg-extra/img/gx-desktop.svg"></div>';
        }
        if(device == 'tablet') {
            html+='<div data-type="tablet" class="device active"><img src="/wp-content/plugins/gutenberg-extra/img/gx-tablet.svg"></div>';
        } else {
            html+='<div data-type="tablet" class="device"><img src="/wp-content/plugins/gutenberg-extra/img/gx-tablet.svg"></div>';
        }
        if(device == 'mobile'){
            html+= ' <div data-type="mobile" class="device active"><img src="/wp-content/plugins/gutenberg-extra/img/gx-mobile.svg"></div>';
        }else {
            html+= ' <div data-type="mobile" class="device"><img src="/wp-content/plugins/gutenberg-extra/img/gx-mobile.svg"></div>';
        }
        html+='</div>'+
            '        </div>' +
            '        <div class="row">' +
            '            <div class="left-block">' +
            '                <div class="block">' +
            '                    <div class="block-row font-size-row">' +
            '                        <span>Size</span>' +
            '                        <div class="type '+ (activeFStype == '%' ? 'procent' : activeFStype) +' " data-id="'+id+'FS'+selectedTheme+'-'+device+'">' +
            '                            <div data-value="px">PX</div>' +
            '                            <div data-value="em">EM</div>' +
            '                            <div data-value="vw">VW</div>' +
            '                            <div data-value="%">%</div>' +
            '                        </div>' +
            '                    </div>' +
            '                    <div class="block-row">' +
            '                        <input type="number" data-id="'+id+'FS'+selectedTheme+'-'+device+'" value="'+fsInput+'" min="0" step="' + (activeFStype == 'px' ? 1 : '0.1') + '">' +
            '                        <div class="reset" data-default="'+defaultFontSizes[tagName]+'"><img src="/wp-content/plugins/gutenberg-extra/img/reset.svg" /></div>' +
            '                    </div>' +
            '                </div>' +
            '                <div class="block">' +
            '                    <div class="block-row">' +
            '                        <span>Line Hgt.</span>' +
            '                        <div class="type '+(activelineHgtType == '%' ? 'procent' : activelineHgtType)+'" data-id="'+id+'LineHgt'+selectedTheme+'-'+device+'">' +
            '                            <div data-value="px">PX</div>' +
            '                            <div data-value="em">EM</div>' +
            '                            <div data-value="vw">VW</div>' +
            '                            <div data-value="%">%</div>' +
            '                        </div>' +
            '                    </div>' +
            '                    <div class="block-row">' +
            '                        <input type="number" data-id="'+id+'LineHgt'+selectedTheme+'-'+device+'" value="'+lineHgtInput+'" min="0" step="' + (activelineHgtType == 'px' ? 1 : '0.1') + '">' +
            '                        <div class="reset" data-default="15px"><img src="/wp-content/plugins/gutenberg-extra/img/reset.svg" /></div>' +
            '                    </div>' +
            '                </div>' +
            '                <div class="block">' +
            '                    <div class="block-row">' +
            '                        <span>Letter Sp.</span>' +
            '                        <div class="type '+activeletterSpcType+'" data-id="'+id+'LetterSpc'+selectedTheme+'-'+device+'">' +
            '                            <div data-value="px">PX</div>' +
            '                            <div data-value="em">EM</div>' +
            '                            <div data-value="vw">VW</div>' +
            '                        </div>' +
            '                    </div>' +
            '                    <div class="block-row">' +
            '                        <input type="number" data-id="'+id+'LetterSpc'+selectedTheme+'-'+device+'" value="'+letterSpcInput+'" min="0" step="' + (activeletterSpcType == 'px' ? 1 : '0.1') + '">' +
            '                        <div class="reset" data-default="0px"><img src="/wp-content/plugins/gutenberg-extra/img/reset.svg" /></div>' +
            '                    </div>' +
            '                </div>' +
            '            </div>' +
            '            <div class="right-block">' +
            '                <div class="block">' +
            '                    <div class="block-row">' +
            '                        <span>Weight</span>' +
            '                        <select data-id="'+id+'Weight'+selectedTheme+'-'+device+'">';
        html += initweightsRelFontHtml;
        html+='</select>' +
            '                    </div>' +
            '                </div>' +
            '                <div class="block">' +
            '                    <div class="block-row">' +
            '                        <span>Transform</span>' +
            '                        <select  data-id="'+id+'Transform'+selectedTheme+'-'+device+'">';
        html+= (transformValue == 'none') ? '<option selected value="none">none</option>' : '<option value="none">none</option>';
        html+= (transformValue == 'capitalize') ? '<option selected value="capitalize">capitalize</option>' : '<option value="capitalize">capitalize</option>';
        html+= (transformValue == 'uppercase') ? '<option selected value="uppercase">uppercase</option>' : '<option value="uppercase">uppercase</option>';
        html+= (transformValue == 'lowercase') ? '<option selected value="lowercase">lowercase</option>' : '<option value="lowercase">lowercase</option>';
        html+=
            '                        </select>' +
            '                    </div>' +
            '                </div>' +
            '                <div class="block">' +
            '                    <div class="block-row">' +
            '                        <span>Style</span>' +
            '                        <select  data-id="'+id+'Style'+selectedTheme+'-'+device+'">';
        html += initStylesRelFontHtml;
        html+= '</select>' +
            '                    </div>' +
            '                </div>' +
            '                <div class="block">' +
            '                    <div class="block-row">' +
            '                        <span>Decoration</span>' +
            '                        <select  data-id="'+id+'Decoration'+selectedTheme+'-'+device+'">';
        html+= (decorationValue == 'none' ? '<option selected value="unset">none</option>' : '<option value="unset">none</option>');
        html+= (decorationValue == 'solid' ? '<option selected value="solid">solid</option>' : '<option value="solid">solid</option>');
        html+= (decorationValue == 'double' ? '<option selected value="double">double</option>' : '<option value="double">double</option>');
        html+= (decorationValue == 'dotted' ? '<option selected value="dotted">dotted</option>' : '<option value="dotted">dotted</option>');
        html+= (decorationValue == 'dashed' ? '<option selected value="dashed">dashed</option>' : '<option value="dashed">dashed</option>');
        html+= (decorationValue == 'wavy' ? '<option selected value="wavy">wavy</option>' : '<option value="wavy">wavy</option>');
        html+=
            '                        </select>' +
            '                    </div>' +
            '                </div>' +
            //Decoration
            '                <div class="block">' +
            '                    <div class="block-row">' +
            '                        <span></span>' +
            '                        <select  data-id="'+id+'DecorationLine'+selectedTheme+'-'+device+'">';
        html+= (decorationLineValue == 'none' ? '<option selected value="none">none</option>' : '<option value="none">none</option>');
        html+= (decorationLineValue == 'overline' ? '<option selected value="overline">overline</option>' : '<option value="overline">overline</option>');
        html+= (decorationLineValue == 'underline' ? '<option selected value="underline">underline</option>' : '<option value="underline">underline</option>');
        html+= (decorationLineValue == 'line-through' ? '<option selected value="line-through">line-through</option>' : '<option value="line-through">line-through</option>');
        html+= (decorationLineValue == 'overline underline' ? '<option selected value="overline underline">overline underline</option>' : '<option value="overline underline">overline underline</option>');
        html+=
            '                        </select>' +
            '                    </div>' +
            '                </div>' +
            //    end Decoration
            '                <div class="block">' +
            '                    <div class="block-row">' +
            '                       <button class="btn gx-apply-btn">Apply Style</button>'
        '                    </div>' +
        '                </div>' +
        '            </div>' +
        '        </div>' +
        '    </div>';
        return html;
    }

    function initLeftSide() {
        let html = `<div class="gx-sec-globalStyling active" data-left-section="globalStyling" title="Global Styling
">
                        <img src="/wp-content/plugins/gutenberg-extra/img/icons/gs-icon.png" />
                    </div>
                    <div class="gx-sec-test showTooltip" data-left-section="test" data-title="Placeholder Tab">
                        <img src="/wp-content/plugins/gutenberg-extra/img/icons/xx-icon.png" />
                    </div>`;
        $('#customize-control-leftSide').html(html);
        $('#customize-control-leftSideTest').html(html);;
    }

    function initIcons() {

        /*
         * Set icons under color blocks for each theme
         */
        // 'Natural', 'Admiral', 'Peach', hided themes
        var $themes = ['Default', 'Mint', 'Elegance', 'Candy', 'Bumblebee'];
        $.each($themes, function( key, theme ) {

            $(`#customize-control-body_background_color${theme}-color-dark .customize-control-title`).html('<img class="icon-color showTooltip" data-title="Background" src="/wp-content/plugins/gutenberg-extra/img/fill.svg" />')
                        $(`#customize-control-p_color${theme}-color-dark .customize-control-title`).html('<img class="icon-color showTooltip" data-title="Text" src="/wp-content/plugins/gutenberg-extra/img/edit-tool.svg" />')
                        $(`#customize-control-a_color${theme}-color-dark .customize-control-title`).html('<img class="icon-color showTooltip" data-title="Link" src="/wp-content/plugins/gutenberg-extra/img/broken-link.svg" />')
                        $(`#customize-control-highlight${theme}-color-dark .customize-control-title`).html('<img class="icon-color showTooltip" data-title="Highlight" src="/wp-content/plugins/gutenberg-extra/img/permanent.svg" />')
                        $(`#customize-control-hover${theme}-color-dark .customize-control-title`).html('<img class="icon-color showTooltip" data-title="Hover" src="/wp-content/plugins/gutenberg-extra/img/cursor.svg" />')
                        $(`#customize-control-body_background_color${theme}-color-light .customize-control-title`).html('<img class="icon-color showTooltip" data-title="Background" src="/wp-content/plugins/gutenberg-extra/img/fill.svg" />')
                        $(`#customize-control-p_color${theme}-color-light .customize-control-title`).html('<img class="icon-color showTooltip" data-title="Text" src="/wp-content/plugins/gutenberg-extra/img/edit-tool.svg" />')
                        $(`#customize-control-a_color${theme}-color-light .customize-control-title`).html('<img class="icon-color showTooltip" data-title="Link" src="/wp-content/plugins/gutenberg-extra/img/broken-link.svg" />')
                        $(`#customize-control-highlight${theme}-color-light .customize-control-title`).html('<img class="icon-color showTooltip" data-title="Highlight" src="/wp-content/plugins/gutenberg-extra/img/permanent.svg" />')
                        $(`#customize-control-hover${theme}-color-light .customize-control-title`).html('<img class="icon-color showTooltip" data-title="Hover" src="/wp-content/plugins/gutenberg-extra/img/cursor.svg" />')
        })
    }

    // make titles for color
       $(document).on('hover', '.wp-picker-container .wp-color-result', function (e) {
           $('.tooltiptext, #tooltiptextCss').remove();
           var title = $(this).parents('.customize-control-color').find('.icon-color').attr('data-title');
           var text = $(this).parents('li[id*="-color-"]').find('.customize-control-title').text();
           if (title) {
               title = title.trim();
               if (title !== '')
               modalTitle(title, this, e);
               $('#tooltiptextCss').append('.tooltiptext{visibility: visible !important; opacity: 1!important;}');
           }
           else {
               if (text) {
                   text = text.trim();
                   if (text !== '')
                   modalTitle(text, this, e);
                   $('#tooltiptextCss').append('.tooltiptext{visibility: visible !important; opacity: 1!important;}');
               }
           }
       })

    function initHeadingBlocksBGColors() {
        // let darkColor = $('#customize-control-body_background_color-color-dark .wp-color-result').css('background-color');
        // let lightColor = $('#customize-control-body_background_color-color-light .wp-color-result').css('background-color');
        // $('#customize-control-h1Dark , #customize-control-h2Dark, #customize-control-h3Dark ,#customize-control-h4Dark , #customize-control-h5Dark , #customize-control-h6Dark , #customize-control-pDark').css('background-color',darkColor)
        // $('#customize-control-h1Light , #customize-control-h2Light, #customize-control-h3Light ,#customize-control-h4Light , #customize-control-h5Light , #customize-control-h6Light , #customize-control-pLight').css('background-color',lightColor)
    }

    $(document).ready(function () {
        var ready = 'pending';
        // initHeadingBlocksBGColors();
        console.log('before wp.customize.bind');
        wp.customize.bind('pane-contents-reflowed', function () { // listen rebuilding event
            // this will get only those which are for selected theme
            if ( wp.customize.previewer.deferred.active.state() === 'pending') {
                // when work theme customize this part again work, need to work only on page load, one time

                // remove loader only one time
                if (ready === 'pending') {

                    setTimeout(function(){
                        loaderSetUp('remove');
                        ready = 'resolved';
                    }, 1000);
                }
                //initLeftSide();

                // make empty uls , then append there color blocks
                $('#customize-control-darkColors').html(renderColorsBlock('Colour Dark')); // create dark colors section
                $('#customize-control-lightColors').html(renderColorsBlock('Colour Light')); // create light colors section

                // give all color sections custom class
                $('.customize-control-color').addClass('customize-control-hidden-color');

                // id is defined from php
                let darkLi = $("li[id*='-color-dark']").get();//get colors for light section
                let lightLi = $("li[id*='-color-light']").get();//get colors for light section

                let selectedTheme = wp.customize(`color_scheme`).get();

                // $('#customize-control-darkColors ul').append(Array.prototype.slice.call(darkLi)); //add colors in light section
                // $('#customize-control-lightColors ul').append(Array.prototype.slice.call(lightLi)); //add colors in light section

                // set icons under color sectons when all sections already exist on one line
                initIcons();
                // hide those colors which don't belong to current theme
                $('.customize-control-hidden-color').each(function() {
                    if ((this.id).indexOf(selectedTheme) == -1) {
                        $(this).addClass('customize-control-hidden').removeClass('customize-control-color')
                    }
                });
                $('.customize-control-hidden-color').each(function() {
                    if ((this.id).indexOf(selectedTheme) == -1) {
                        $(this).addClass('customize-control-hidden').removeClass('customize-control-color')
                    }
                });
                var themePreset = wp.customize(`themeSwitch${selectedTheme}`).get();
                themePreset = themePreset === 'gx-dark' ? 'Dark' : (themePreset === 'gx-light' ? 'Light' : '');

                // hide themeSwitchs except choosen
                $(`li[id*='themeSwitch']`).addClass('customize-control-hidden').removeClass('customize-control-select');
                $(`li[id*='themeSwitch${selectedTheme}']`).addClass('customize-control-select').removeClass('customize-control-hidden');
                // hide blocks except theme's blocks
                $(`li[id*='_blockPopUp_']`).addClass('customize-control-hidden').removeClass('customize-control-text');

                $(`li[id*='${themePreset}${selectedTheme}_blockPopUp_']`).addClass('customize-control-text').removeClass('customize-control-hidden');
                $(`#customize-control-lightColors`).removeClass('top-200');
                $(`#customize-control-darkColors`).removeClass('customize-control-hidden').addClass('customize-control-text');
                $(`#customize-control-lightColors`).removeClass('customize-control-hidden').addClass('customize-control-text');
                $(`li[id*='${selectedTheme}-color-dark']`).removeClass('customize-control-hidden').addClass('customize-control-color');
                $(`li[id*='${selectedTheme}-color-light']`).removeClass('customize-control-hidden').addClass('customize-control-color');

                // set up reset button and modal
                $('#customize-control-reset').removeClass('customize-control-reset-default');
                $('#_customize-button-reset-modal').remove();
                $('#customize-control-reset').append('<button id="_customize-button-reset-modal" type="button" class="button button-info" data-toggle="modal" data-target="#resetModal">Reset</button>')
                $('#_customize-input-reset').hide();
                <!-- Modal -->
                $('#resetModal').remove();
                var resetModal = `<div class="modal fade" id="resetModal" tabindex="-1" role="dialog" aria-labelledby="resetModalLabel" aria-hidden="true">
                                    <div class="modal-dialog" role="document">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="resetModalLabel">Notification</h5>
                                                <button type="button" class="close _customize-button-reset-close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div class="modal-body">
                                                Are you sure you want to do this? All your setting with be restored back to default settings
                                            </div>
                                            <div class="modal-footer">
                                                <button id="_customize-button-reset-close" type="button" class="_customize-button-reset-close button button-secondary" data-dismiss="modal">Close</button>
                                                <button id="_customize-button-reset" type="button" class="button button-primary">Reset</button>
                                            </div>
                                        </div>
                                    </div>
                                  </div>`;
                $('body').append(resetModal);
                // end reset

                if (themePreset === "Dark") {
                    $(`#customize-control-lightColors`).addClass('customize-control-hidden').removeClass('customize-control-text');
                    $(`li[id*='${selectedTheme}-color-light']`).addClass('customize-control-hidden').removeClass('customize-control-color');
                }
                else if (themePreset === "Light"){
                    $(`#customize-control-darkColors`).addClass('customize-control-hidden').removeClass('customize-control-text');
                    $(`#customize-control-lightColors`).addClass('top-200');
                    $(`li[id*='${selectedTheme}-color-dark']`).addClass('customize-control-hidden').removeClass('customize-control-color');
                } else {
                    $('#customize-control-reset').addClass('customize-control-reset-default')
                }


            }
        });

        /*
         * Setup lefside panel
         */


        $('#customize-control-leftSide').on('click','div',function (e) {
            setActiveSection(this);
        });
        $('#customize-control-leftSideTest').on('click','div',function (e) {
            setActiveSection(this);
        })
        function setActiveSection (div) {
            var section = $(div).attr('data-left-section');
            $('#customize-control-leftSideTest, #customize-control-leftSide').find('div').removeClass('active');
            $(div).removeClass('active');
            $(`.gx-sec-${section}`).addClass("active");
            wp.customize.section( section ).focus();
        }


        $('#customize-footer-actions .devices button').on('click',function () {
            let type = $(this).attr('data-device');
            var selectedTheme = $('#_customize-input-color_scheme').val();


            let iframe = $("iframe").contents();
            let classes = {
                '.gx-dark h1' : 'h1Dark',
                '.gx-light h1': 'h1Light',
                '.gx-dark h2' : 'h2Dark',
                '.gx-light h2': 'h2Light',
                '.gx-dark h3' : 'h3Dark',
                '.gx-light h3': 'h3Light',
                '.gx-dark h4' : 'h4Dark',
                '.gx-light h4': 'h4Light',
                '.gx-dark h5' : 'h5Dark',
                '.gx-light h5': 'h5Light',
                '.gx-dark h6' : 'h6Dark',
                '.gx-light h6': 'h6Light',
            }
            for (let i in classes) {
                iframe.find(i).css({
                    "font-size": $('#customize-control-'+classes[i]+'FS'+selectedTheme+'-'+type+' input').val() + ' !important',
                    "line-height": $('#customize-control-'+classes[i]+'LineHgt'+selectedTheme+'-'+type+' input').val() + ' !important',
                    "letter-spacing": $('#customize-control-'+classes[i]+'LineHgt'+selectedTheme+'-'+type+' input').val() + ' !important',
                    "font-weight": $('#customize-control-'+classes[i]+'Weight'+selectedTheme+'-'+type+' input').val() + ' !important',
                    "text-transform": $('#customize-control-'+classes[i]+'Transform'+selectedTheme+'-'+type+' input').val() + ' !important',
                    "font-style": $('#customize-control-'+classes[i]+'Style'+selectedTheme+'-'+type+' input').val() + ' !important',
                    "text-decoration": $('#customize-control-'+classes[i]+'Decoration'+selectedTheme+'-'+type+' input').val() + ' !important',
                    "font-family" : '"'+$('#customize-control-'+classes[i]+'Font'+selectedTheme+'-'+type+' input').val().replace(/\+/g, ' ') + ' !important'+'"'
                });
            }

            let parent =  $('.heading-pop-up');
            parent.find('.device').removeClass('active');
            parent.find('input').map(function () {
                let prevDataId = $(this).attr('data-id');
                let newDataId = prevDataId.replace(/[^\\-]+$/g,type);
                let newValueInput = $('#customize-control-'+newDataId+' input').val();
                let newValue = parseFloat(newValueInput) ;
                let newValueType = getTextFromString(newValueInput);
                let typeBlock = $(this).parent().parent().find('.type');
                typeBlock.attr('data-id', newDataId);
                $(this).val(newValue);
                $(this).attr('data-id',newDataId);
                typeBlock.removeClass();
                typeBlock.addClass('type '+newValueType);
            });
            parent.find('select').map(function () {
                let prevDataId = $(this).attr('data-id');
                let newDataId = prevDataId.replace(/[^\\-]+$/g,type);
                $(this).attr('data-id',newDataId);
                let selectValue = $('#customize-control-'+newDataId+' input').val();
                $(this).find('option[selected]').removeAttr('selected');
                $(this).find('option[value="'+selectValue+'"]').attr('selected','selected')
            });
            parent.find('.device[data-type="'+type+'"]').addClass('active');
        });

        $('.customize-control-text').on('click','.heading-pop-up .devices .device',function () {
            let type = $(this).attr('data-type');
            $('.devices-wrapper .devices button[data-device=' + type + ']').click();
        });

        // devices customizeing
        $('.customize-control-text').on('click','.heading-pop-up .type div',function () {
            let className = $(this).attr('data-value');
            className = className == '%' ? 'procent' : className;
            $(this).parent().removeClass();
            $(this).parent().addClass('type '+className);
            let id = $(this).parent().attr('data-id');

            $(`input[data-id="${id}"]`).attr('step', className == 'px' ? 1 : '0.1')
            let typeValue = $(this).attr('data-value');
            let inputValue = parseFloat($("#customize-control-"+id+" input").val());

            let value = inputValue+typeValue;
            wp.customize(id, function(data) {
                data.set(value);
            });
        });

        $('.customize-control-text').on('click',function (e) { // listen click on customize control text block
            if( e.target != this ) { // return false if click on children
                if ( !$(e.target).hasClass('customize-control-title') && e.target.localName != 'label') {
                    return false;
                }
            }

            if($(this).find('.has-popup').length !== 0 ){
                $('.customize-control-text.active').removeClass('active');
                $(this).addClass('active');
                if($(this).find('.heading-pop-up').length !== 0) {
                    if($(this).find('.heading-pop-up').css('display') == 'flex'){
                        $('.heading-pop-up').hide();
                        $(this).removeClass('active');
                    } else {
                        $('.heading-pop-up').hide();
                        $(this).find('.heading-pop-up').show();
                    }
                } else{
                    $('.heading-pop-up').hide();
                    let id = $(this).find('.has-popup').attr('data-name');
                    $(this).append(makePopUp(id));

                    $('.font-family-select').select2({
                        width: '150px',
                        sorter: function(results) {
                            var query = $('.select2-search__field').val().toLowerCase();
                            return results.sort(function(a, b) {
                                return a.text.toLowerCase().indexOf(query) -
                                    b.text.toLowerCase().indexOf(query);
                            });
                        }
                    }).on('select2:open', function(e){
                        $('.select2-search__field').attr('placeholder', 'Search');
                    });

                }
            }
        });

        $(document).on('change','.heading-pop-up input' ,function () {
            let id = $(this).attr('data-id');
            let inputValue = $(this).val();
            let typeValue = $("#customize-control-"+id+" input").val().replace(/\d+([,.]\d+)?/g, '')
            let value = inputValue+typeValue;
            wp.customize(id, function(data) {
                data.set(value);
            });
        });

        $(document).on('change','.heading-pop-up select',function () {
            let id = $(this).attr('data-id');
            let value = $(this).val();
            wp.customize(id, function(data) {
                data.set(value);
            });
        });


        $('.customize-control-text').on('click' , '.heading-pop-up .reset', function () {
            let parent = $(this).parent();
            let isInput = parent.find('input').length;
            let newValue = $(this).attr('data-default');
            let newType =  isInput ? getTextFromString(newValue) : newValue; // for select dont replace
            let value = isInput ? parseFloat(newValue) : newValue;
            let typeBlock = parent.parent().find('.type');
            let input = isInput ? parent.find('input') : parent.find('select');
            let data_id = input.attr('data-id');

            if (isInput) {
                typeBlock.removeClass();
                typeBlock.addClass('type ' + newType);
            }

            input.val(value).change();
            wp.customize(data_id, function(data) {
                data.set(newValue);
            });
        });

        $('.customize-control-text').on('click','.heading-pop-up .close-pop-up',function () {
            $(this).parent().hide();
        });

        $('.customize-control-text').on('click','.heading-pop-up .gx-apply-btn',function () {
            $('#customize-save-button-wrapper #save').click();
        });

        $('.customize-control-text').on('click' , '.heading-pop-up .left-side li' , function () {
            $(this).parent().find('li.active').removeClass('active');
            $(this).addClass('active');
        })




        // append Styles and Weights for each font
        // get font blocks and customize them
        function customizePopUp() {
            let device = $('#customize-footer-actions .devices .active').attr('data-device');
            var selectedTheme = $('#_customize-input-color_scheme').val();


            $.each($('.has-popup'), function (i, popup) {
                let id = $(this).attr('data-name');
                let controlId = id+'Font'+selectedTheme+'-'+device;

                wp.customize( controlId, function (val) {
                    val.bind( function( newFontVal ) {
                        let styleControl  = id +'Style'+selectedTheme+'-'+device;
                        let weightcontrol = id +'Weight'+selectedTheme+'-'+device;
                        let weightValue = $('#customize-control-'+id+'Weight'+selectedTheme+'-'+device+' input').val();
                        let styleValue = $('#customize-control-'+id+'Style'+selectedTheme+'-'+device+' input').val();

                        wp.customize(styleControl, function (styleVal) {
                            let stylesRelFont = gx_ajax_object.font_info[newFontVal] ? gx_ajax_object.font_info[newFontVal].styles : ['normal', 'italic', 'oblique'];
                            let stylesRelFontHtml = stylesRelFont.map(item => `<option ${styleValue == item ? 'selected' : ''} value="${item}">${item}</option>`);
                            stylesRelFontHtml = stylesRelFontHtml.join();
                            $(`select[data-id="${styleControl}"]`).html(stylesRelFontHtml);
                            // styleVal.set(stylesRelFontHtml);
                            // styleVal.bind(function (newStyleVal) {
                            // })
                        })

                        wp.customize(weightcontrol, function (weightVal) {
                            let weightsRelFont = gx_ajax_object.font_info[newFontVal] ? Object.values(gx_ajax_object.font_info[newFontVal].weights) : ['100', '200', '300', '400', '500', '600', '700', '800', '900'];
                            let weightsRelFontHtml = (weightsRelFont.map(item => `<option ${weightValue == item ? 'selected' : ''} value="${item}">${item}</option>`)).join();
                            $(`select[data-id="${weightcontrol}"]`).html(weightsRelFontHtml);
                        })

                    })
                })
            })

            $(document).on('click', '#accordion-panel-GutenbergExtra', function () {
                loaderSetUp();
            })
            if (typeof wp.customize.panel == 'function') {
                // remove intermediate step and open GLOBAL STYLE section
                wp.customize.panel('GutenbergExtra', function (panel) {
                    panel.expanded.bind(function (isExpanded) {
                        if (isExpanded) {
                            $('#customize-control-leftSideTest, #customize-control-leftSide').find('div').removeClass('active');
                            $(`.gx-sec-globalStyling`).addClass("active");
                            wp.customize.section('globalStyling').focus();
                        }
                    })
                })
            }
            // remove intermediate step when going to back
            $(document).on('click', '#sub-accordion-section-globalStyling .customize-section-back, #sub-accordion-section-test .customize-section-back', function () {
                $('#sub-accordion-panel-GutenbergExtra').find('.customize-panel-back').trigger( "click" );
            })

            $(document).on('hover', '.customize-section-back', function (e) {
                $(this).attr('data-title', 'Back');
                var modal_content = $(this).attr('data-title');
                var tooltipElement = this;
                var direction = "right";
                modalTitle(modal_content, tooltipElement, e, direction);
            })
            // heading-pop-up
            $('body').on('click', '#sub-accordion-section-globalStyling li', function(e) {

                if ($(this).find('.heading-pop-up').length) {

                    if ($(this).find('.heading-pop-up').prop('display') == 'none' || !$(this).find('.heading-pop-up').prop('display')){
                        // check light and dark working together and data-id
                        $('#sub-accordion-section-globalStyling li').find('.heading-pop-up').prop('display', 'none');
                        $(this).find('.heading-pop-up').stop().slideDown();
                        $(this).find('.heading-pop-up').prop('display', 'block');
                    } else {
                        $(this).find('.heading-pop-up').stop().slideUp();
                        $(this).find('.heading-pop-up').prop('display', 'none');
                    }


                }
            });

        };
        customizePopUp();
    });


    // make functionality for reset button
    $(document).on('click', '#_customize-button-reset-modal', function (e) {
        $("#resetModal").addClass('show').removeClass('fade');
    })

    $(document).on('click', '._customize-button-reset-close', function (e) {
        $("#resetModal").addClass('fade').removeClass('show');
    })
    $(document).on('click', '#_customize-button-reset', function (e) {
        $(this).attr('disabled', 'disabled')
        // if (confirm('Are you sure you want to do this? All your setting with be restored back to default settings.')){
            let currentTheme = wp.customize('color_scheme').get();
            let defaultThemeOptions = JSON.parse(gx_ajax_object.defaultThemeOptions);

            let device = $('#customize-footer-actions .devices .active').attr('data-device');

            // h1...h6, p customize start
            var tagBlocks = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
            var BlocksStyles = [
                ['DarkFont',    'Dark', 'font-family'], // which control, which block, which style will change for
                ['DarkFS', 'Dark', 'font-size'],
                ['DarkWeight', 'Dark', 'font-weight'],
                ['DarkLineHgt', 'Dark', 'line-height'],
                ['DarkLetterSpc', 'Dark', 'letter-spacing'],
                ['DarkTransform', 'Dark', 'text-transform'],
                ['DarkStyle', 'Dark', 'font-style'],
                ['DarkDecoration', 'Dark', 'text-decoration-style'],
                ['DarkDecorationLine', 'Dark', 'text-decoration-line'],
                ['LightFont', 'Light', 'font-family'],
                ['LightFS', 'Light', 'font-size'],
                ['LightWeight',  'Light', 'font-weight'],
                ['LightLineHgt', 'Light', 'line-height'],
                ['LightLetterSpc',  'Light', 'letter-spacing'],
                ['LightTransform',  'Light', 'text-transform'],
                ['LightStyle',  'Light', 'font-style'],
                ['LightDecoration',  'Light', 'text-decoration-style'],
                ['LightDecorationLine',  'Light', 'text-decoration-line'],
            ];


                //set color customize
                wp.customize('body_background_color'+currentTheme+'-color-dark').set(defaultThemeOptions[currentTheme]['Dark']['block']['background']);
                wp.customize('body_background_color'+currentTheme+'-color-light').set(defaultThemeOptions[currentTheme]['Light']['block']['background']);
                wp.customize('hover'+currentTheme+'-color-dark').set(defaultThemeOptions[currentTheme]['Dark']['hover']);
                wp.customize('hover'+currentTheme+'-color-light').set(defaultThemeOptions[currentTheme]['Light']['hover']);
                wp.customize('highlight'+currentTheme+'-color-dark').set(defaultThemeOptions[currentTheme]['Dark']['highlight']);
                wp.customize('highlight'+currentTheme+'-color-light').set(defaultThemeOptions[currentTheme]['Light']['highlight']);
                wp.customize('p_color'+currentTheme+'-color-dark').set(defaultThemeOptions[currentTheme]['Dark']['domElements']['p']['color']);
                wp.customize('p_color'+currentTheme+'-color-light').set(defaultThemeOptions[currentTheme]['Light']['domElements']['p']['color']);
                wp.customize('a_color'+currentTheme+'-color-dark').set(defaultThemeOptions[currentTheme]['Dark']['domElements']['a']['color']);
                wp.customize('a_color'+currentTheme+'-color-light').set(defaultThemeOptions[currentTheme]['Light']['domElements']['a']['color']);
                wp.customize('h1_color'+currentTheme+'-color-dark').set(defaultThemeOptions[currentTheme]['Dark']['domElements']['h1']['color']);
                wp.customize('h1_color'+currentTheme+'-color-light').set(defaultThemeOptions[currentTheme]['Light']['domElements']['h1']['color']);
                wp.customize('h2_color'+currentTheme+'-color-dark').set(defaultThemeOptions[currentTheme]['Dark']['domElements']['h2']['color']);
                wp.customize('h2_color'+currentTheme+'-color-light').set(defaultThemeOptions[currentTheme]['Light']['domElements']['h2']['color']);
                wp.customize('h3_color'+currentTheme+'-color-dark').set(defaultThemeOptions[currentTheme]['Dark']['domElements']['h3']['color']);
                wp.customize('h3_color'+currentTheme+'-color-light').set(defaultThemeOptions[currentTheme]['Light']['domElements']['h3']['color']);
                wp.customize('h4_color'+currentTheme+'-color-dark').set(defaultThemeOptions[currentTheme]['Dark']['domElements']['h4']['color']);
                wp.customize('h4_color'+currentTheme+'-color-light').set(defaultThemeOptions[currentTheme]['Light']['domElements']['h4']['color']);
                wp.customize('h5_color'+currentTheme+'-color-dark').set(defaultThemeOptions[currentTheme]['Dark']['domElements']['h5']['color']);
                wp.customize('h5_color'+currentTheme+'-color-light').set(defaultThemeOptions[currentTheme]['Light']['domElements']['h5']['color']);
                wp.customize('h6_color'+currentTheme+'-color-dark').set(defaultThemeOptions[currentTheme]['Dark']['domElements']['h6']['color']);
                wp.customize('h6_color'+currentTheme+'-color-light').set(defaultThemeOptions[currentTheme]['Light']['domElements']['h6']['color']);

                // set popup customize

                tagBlocks.forEach(tagBlok => {
                    $.each(BlocksStyles, function (i, controlBlock) {
                        let control = tagBlok+controlBlock[0];
                        let domElements = defaultThemeOptions[currentTheme][controlBlock[1]]['domElements'];
                        let controlDefault = domElements[tagBlok][controlBlock[2]];

                        if (domElements[tagBlok][controlBlock[2]]){
                            if( controlBlock[2] === 'font-size') {
                                controlDefault = ( domElements[tagBlok][controlBlock[2]] ).replace(/\D+([,.]\D+)?/g, ''); // remove px, vm
                            }
                            let elem = $('.heading-pop-up').find('[data-id="' + control + currentTheme + '-' + device + '"]');

                            wp.customize(control + currentTheme + '-' + device).set(controlDefault);
                            elem.attr('value', controlDefault ).trigger('change');

                        }
                    })
                })

            let api = wp.customize;
            api.previewer.save();
            var presetId = 'themeSwitch'+currentTheme;
            $(`_customize-input-${presetId}`).attr('value', 'gx-default' ).trigger('change');
            setTimeout(()=>{$("#resetModal").addClass('fade').removeClass('show')}, 1000);

        // }

    })



});


