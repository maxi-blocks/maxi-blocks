jQuery(function ($) {
    /**
     * make modal for showing title like information
     *
     * @param modal_content
     * @return modal
     */
    function modalTitle(
        modal_content,
        tooltipElement,
        event,
        showToolTipDirection = 'middle'
    ) {
        // var topPos = +(event.clientY);
        // var leftPos = +(event.clientX);
        $('.tooltiptext, #tooltiptextCss').remove();
        let topPos = 0;
        let leftPos = 0;
        const $modal = `<div class="tooltiptext ${showToolTipDirection}">
                            ${modal_content}
                          </div>`;
        const tooltipElementClass = tooltipElement.className.replace(
            /\s/g,
            '.'
        );
        $('head').append(
            `<style id="tooltiptextCss"> .${tooltipElementClass} {position: relative;} </style>`
        );
        $(tooltipElement).append($modal);
        const modalHeight = $('.tooltiptext')[0].getBoundingClientRect().height;
        const modalWidth = $('.tooltiptext')[0].getBoundingClientRect().width;
        topPos = +topPos - modalHeight - 20;
        if (showToolTipDirection === 'middle') {
            leftPos = +leftPos - modalWidth / 2;
        } else if (showToolTipDirection === 'right') {
            leftPos = +leftPos + +(modalWidth / 4);
        }
        $('#tooltiptextCss').append(
            '.tooltiptext{visibility: visible !important; opacity: 1!important;}'
        );
    }
    /**
     * Setup sections as labels
     */
    $(
        '#accordion-section-globalBlockStyles, #accordion-section-themeOptions'
    ).removeClass();
    $('#accordion-section-globalBlockStyles').html(
        '<h2 class="accordion-section-title">Global Block Styles<span class="dashicons dashicons-info showTooltip" data-title="Adjust default styles of all MaxiBlocks blocks, anywehere they are used" style="pointer-events: painted;"> </span></h2>'
    );
    $('#accordion-section-themeOptions').html(
        '<h2 class="accordion-section-title">Theme Options<span class="dashicons dashicons-info showTooltip" data-title="Adjust default styles of all MaxiBlocks blocks, anywehere they are used" style="pointer-events: painted;"> </span></h2>'
    );
    /**
     * when hover on element included tooltips, show
     */
    $(document).on('hover', '.showTooltip', function (e) {
        const modal_content = $(this).attr('data-title')
            ? $(this).attr('data-title')
            : 'test';
        const tooltipElement = this;
        let direction = 'middle';
        // left side bar
        if ($(this).attr('class').includes('sec-')) {
            direction = 'right';
        }
        modalTitle(modal_content, tooltipElement, e, direction);
    });
    $(document).on(
        'mouseleave',
        '.showTooltip, .wp-picker-container, .customize-control-color .customize-control-title',
        function () {
            $('.tooltiptext, #tooltiptextCss').remove();
        }
    );
    $(document).on(
        'hover',
        `li[id*="-color-"] .customize-control-title`,
        function (e) {
            const modal_content = $(this).text().trim();
            const tooltipElement = this;
            const direction = 'middle';
            $('.tooltiptext, #tooltiptextCss').remove();
            if (modal_content !== '')
                modalTitle(modal_content, tooltipElement, e, direction);
        }
    );
    /**
     * Setup loader while page gets ready
     *
     * @param setup
     */
    function loaderSetUp(setup = 'add') {
        $('#page-loader').remove();
        if (setup === 'remove') {
            $('#page-loader-css').remove();
            return;
        }

        const loader =
            `${
                '<div class="wrap-loader" id="page-loader">' +
                '<div class="loading">' +
                '<div class="text"><img src="'
            }${
                maxi_ajax_object.maxi_plugin_url
            }/maxi-blocks/img/loader.svg"></div>` +
            `</div>` +
            `</div>`;
        $('body').append(loader);
    }

    // will work when change theme or presets
    function hide_presetsBlocks(selectedTheme, themePreset) {
        const preset = themePreset;
        themePreset =
            themePreset === 'dark'
                ? 'Dark'
                : themePreset === 'light'
                ? 'Light'
                : '';

        $('#customize-control-reset').removeClass(
            'customize-control-reset-default'
        );

        // wp.customize.preview.send('refresh');
        // when customize theme, then click on presets, customize function doesn't work
        const iframe = $('iframe').contents();
        iframe
            .find('body')
            .removeClass(
                'Default Mint Elegance Natural Admiral Peach Candy Bumblebee'
            )
            .addClass(selectedTheme);
        iframe.find('.global.block').removeClass('default');
        if (preset === 'dark') {
            iframe.find('.global.block').removeClass('light');
            iframe.find('.global.block').addClass('dark');
        } else if (preset == 'light') {
            iframe.find('.global.block').removeClass('dark');
            iframe.find('.global.block').addClass('light');
        } else {
            // when click on default reset to initial block classes
            $.each(iframe.find('.global.block'), function (block) {
                $(this).removeClass('dark');
                $(this).removeClass('light');
                $(this).addClass(
                    $(this)
                        .attr('data-maxi_initial_block_class')
                        .replace('-def', '')
                );
            });
        }

        $(`li[id*='_blockPopUp_']`)
            .addClass('customize-control-hidden')
            .removeClass('customize-control-text');
        $(`li[id*='${themePreset}${selectedTheme}_blockPopUp_']`)
            .addClass('customize-control-text')
            .removeClass('customize-control-hidden');
        $(`#customize-control-lightColors`).removeClass('top-200');
        $(`#customize-control-darkColors`)
            .removeClass('customize-control-hidden')
            .addClass('customize-control-text');
        $(`#customize-control-lightColors`)
            .removeClass('customize-control-hidden')
            .addClass('customize-control-text');
        $(`li[id*='${selectedTheme}-color-dark']`)
            .removeClass('customize-control-hidden')
            .addClass('customize-control-color');
        $(`li[id*='${selectedTheme}-color-light']`)
            .removeClass('customize-control-hidden')
            .addClass('customize-control-color');

        if (themePreset === 'Dark') {
            $(`#customize-control-lightColors`)
                .addClass('customize-control-hidden')
                .removeClass('customize-control-text');
            $(`li[id*='${selectedTheme}-color-light']`)
                .addClass('customize-control-hidden')
                .removeClass('customize-control-color');
        } else if (themePreset === 'Light') {
            $(`#customize-control-darkColors`)
                .addClass('customize-control-hidden')
                .removeClass('customize-control-text');
            $(`#customize-control-lightColors`).addClass('top-200');
            $(`li[id*='${selectedTheme}-color-dark']`)
                .addClass('customize-control-hidden')
                .removeClass('customize-control-color');
        } else {
            $('#customize-control-reset').addClass(
                'customize-control-reset-default'
            );
        }
    }

    $('#_customize-input-color_scheme').on('change', function () {
        const newVal = $(this).val();
        const themePreset = wp.customize(`themeSwitch${newVal}`).get();
        hide_presetsBlocks(newVal, themePreset);
        wp.customize(`color_scheme`).set(newVal);
    });
    $('select[id*="themeSwitch"]').on('change', function () {
        const selectedTheme = wp.customize(`color_scheme`).get();
        hide_presetsBlocks(selectedTheme, $(this).val());
    });

    function renderColorsBlock(text) {
        return `<label class="customize-control-title">${text}</label><ul></ul>`;
    }
    function getTextFromString(string) {
        return string.replace(/\d+([,.]\d+)?/g, ''); // example 47px returned px
    }

    function makePopUp(id) {
        const selectedTheme = $('#_customize-input-color_scheme').val();
        const tagName = id.substring(0, 2);
        const thememod = id.startsWith('p') ? id.substring(1) : id.substring(2); // for p block cut first letter
        const defaultThemeOptions = JSON.parse(
            maxi_ajax_object.defaultThemeOptions
        );
        const { domElements } = defaultThemeOptions[selectedTheme][thememod];

        const lightOpt = defaultThemeOptions[selectedTheme].Light.domElements;
        const darkOpt = defaultThemeOptions[selectedTheme].Dark.domElements;

        const defaultFontSizes = {
            pL: lightOpt.p['font-size'] ? lightOpt.p['font-size'] : '0.8em',
            pD: darkOpt.p['font-size'] ? darkOpt.p['font-size'] : '0.8em',
            h1: domElements.h1['font-size']
                ? domElements.h1['font-size']
                : '2em',
            h2: domElements.h2['font-size']
                ? domElements.h2['font-size']
                : '1.5em',
            h3: domElements.h3['font-size']
                ? domElements.h3['font-size']
                : '1.17em',
            h4: domElements.h4['font-size']
                ? domElements.h4['font-size']
                : '0.9em',
            h5: domElements.h5['font-size']
                ? domElements.h5['font-size']
                : '0.83em',
            h6: domElements.h6['font-size']
                ? domElements.h6['font-size']
                : '0.67em',
        };

        const device = $('#customize-footer-actions .devices .active').attr(
            'data-device'
        );
        console.log(
            `value ${$(
                `#customize-control-${id}FS${selectedTheme}-${device} input`
            ).val()}`
        );
        const fsValue = $(
            `#customize-control-${id}FS${selectedTheme}-${device} input`
        ).val();
        const weightValue = $(
            `#customize-control-${id}Weight${selectedTheme}-${device} input`
        ).val();
        const transformValue = $(
            `#customize-control-${id}Transform${selectedTheme}-${device} input`
        ).val();
        const styleValue = $(
            `#customize-control-${id}Style${selectedTheme}-${device} input`
        ).val();
        const decorationValue = $(
            `#customize-control-${id}Decoration${selectedTheme}-${device} input`
        ).val();
        const decorationLineValue = $(
            `#customize-control-${id}DecorationLine${selectedTheme}-${device} input`
        ).val();
        const lineHgtValue = $(
            `#customize-control-${id}LineHgt${selectedTheme}-${device} input`
        ).val();
        const letterSpcValue = $(
            `#customize-control-${id}LetterSpc${selectedTheme}-${device} input`
        ).val();
        const fsInput = parseFloat(fsValue);

        const lineHgtInput = parseFloat(lineHgtValue);
        const letterSpcInput = parseFloat(letterSpcValue);

        const activeFStype = getTextFromString(fsValue)
            ? getTextFromString(fsValue)
            : 'px';
        console.log(`value 2${activeFStype}`);
        const activelineHgtType = getTextFromString(lineHgtValue);
        const activeletterSpcType = getTextFromString(letterSpcValue);
        console.log(`value h${activelineHgtType}`);
        const { list } = maxi_ajax_object;
        const tag = tagName.includes('p') ? 'p' : tagName;

        const activeFontFamily = $(
            `#customize-control-${id}Font${selectedTheme}-${device} input`
        ).val();
        // weight related to active font

        const initWeightsRelFont = maxi_ajax_object.font_info[activeFontFamily]
            ? Object.values(
                  maxi_ajax_object.font_info[activeFontFamily].weights
              )
            : ['100', '200', '300', '400', '500', '600', '700', '800', '900'];
        const initweightsRelFontHtml = initWeightsRelFont
            .map(
                item =>
                    `<option ${
                        weightValue == item ? 'selected' : ''
                    } value="${item}">${item}</option>`
            )
            .join();

        const initStylesRelFont = maxi_ajax_object.font_info[activeFontFamily]
            ? maxi_ajax_object.font_info[activeFontFamily].styles
            : ['normal', 'italic', 'oblique'];
        const initStylesRelFontHtml = initStylesRelFont
            .map(
                item =>
                    `<option ${
                        styleValue == item ? 'selected' : ''
                    } value="${item}">${item}</option>`
            )
            .join();

        let html =
            `${
                '<div class="heading-pop-up">' +
                '        <div class="close-pop-up"><span class="dashicons dashicons-no"></span></div>' +
                '        <div class="row">' +
                '            <span>Family</span> <div class="reset" data-default="'
            }${domElements[tag]['font-family']}"></div>` +
            `            <select class="font-family-select" data-id=${id}Font${selectedTheme}-${device}><img src="${maxi_ajax_object.maxi_plugin_url}/maxi-blocks/img/reset.svg" />`;
        for (const i in list) {
            if (list[i].replace(/\ /g, '+') === activeFontFamily) {
                html += `<option selected value=${list[i].replace(
                    /\ /g,
                    '+'
                )}>${list[i]}</option>`;
            } else {
                html += `<option value=${list[i].replace(/\ /g, '+')}>${
                    list[i]
                }</option>`;
            }
        }
        html += '</select>' + '            <div class="devices">';
        if (device == 'desktop') {
            html += ` <div data-type="desktop" class="device active"><img src="${maxi_ajax_object.maxi_plugin_url}/maxi-blocks/img/desktop.svg"></div>`;
        } else {
            html += ` <div data-type="desktop" class="device"><img src="${maxi_ajax_object.maxi_plugin_url}/maxi-blocks/img/desktop.svg"></div>`;
        }
        if (device == 'tablet') {
            html += `<div data-type="tablet" class="device active"><img src="${maxi_ajax_object.maxi_plugin_url}/maxi-blocks/img/tablet.svg"></div>`;
        } else {
            html += `<div data-type="tablet" class="device"><img src="${maxi_ajax_object.maxi_plugin_url}/maxi-blocks/img/tablet.svg"></div>`;
        }
        if (device == 'mobile') {
            html += ` <div data-type="mobile" class="device active"><img src="${maxi_ajax_object.maxi_plugin_url}/maxi-blocks/img/mobile.svg"></div>`;
        } else {
            html += ` <div data-type="mobile" class="device"><img src="${maxi_ajax_object.maxi_plugin_url}/maxi-blocks/img/mobile.svg"></div>`;
        }
        html +=
            `${
                '</div>' +
                '        </div>' +
                '        <div class="row">' +
                '            <div class="left-block">' +
                '                <div class="block">' +
                '                    <div class="block-row font-size-row">' +
                '                        <span>Size</span>' +
                '                        <div class="type '
            }${
                activeFStype == '%' ? 'procent' : activeFStype
            } " data-id="${id}FS${selectedTheme}-${device}">` +
            `                            <div data-value="px">PX</div>` +
            `                            <div data-value="em">EM</div>` +
            `                            <div data-value="vw">VW</div>` +
            `                            <div data-value="%">%</div>` +
            `                        </div>` +
            `                    </div>` +
            `                    <div class="block-row">` +
            `                        <input type="number" data-id="${id}FS${selectedTheme}-${device}" value="${fsInput}" min="0" step="${
                activeFStype == 'px' ? 1 : '0.1'
            }">` +
            `                        <div class="reset" data-default="${defaultFontSizes[tagName]}"><img src="${maxi_ajax_object.maxi_plugin_url}/maxi-blocks/img/reset.svg" /></div>` +
            `                    </div>` +
            `                </div>` +
            `                <div class="block">` +
            `                    <div class="block-row">` +
            `                        <span>Line Hgt.</span>` +
            `                        <div class="type ${
                activelineHgtType == '%' ? 'procent' : activelineHgtType
            }" data-id="${id}LineHgt${selectedTheme}-${device}">` +
            `                            <div data-value="px">PX</div>` +
            `                            <div data-value="em">EM</div>` +
            `                            <div data-value="vw">VW</div>` +
            `                            <div data-value="%">%</div>` +
            `                        </div>` +
            `                    </div>` +
            `                    <div class="block-row">` +
            `                        <input type="number" data-id="${id}LineHgt${selectedTheme}-${device}" value="${lineHgtInput}" min="0" step="${
                activelineHgtType == 'px' ? 1 : '0.1'
            }">` +
            `                        <div class="reset" data-default="15px"><img src="${maxi_ajax_object.maxi_plugin_url}/maxi-blocks/img/reset.svg" /></div>` +
            `                    </div>` +
            `                </div>` +
            `                <div class="block">` +
            `                    <div class="block-row">` +
            `                        <span>Letter Sp.</span>` +
            `                        <div class="type ${activeletterSpcType}" data-id="${id}LetterSpc${selectedTheme}-${device}">` +
            `                            <div data-value="px">PX</div>` +
            `                            <div data-value="em">EM</div>` +
            `                            <div data-value="vw">VW</div>` +
            `                        </div>` +
            `                    </div>` +
            `                    <div class="block-row">` +
            `                        <input type="number" data-id="${id}LetterSpc${selectedTheme}-${device}" value="${letterSpcInput}" min="0" step="${
                activeletterSpcType == 'px' ? 1 : '0.1'
            }">` +
            `                        <div class="reset" data-default="0px"><img src="${maxi_ajax_object.maxi_plugin_url}/maxi-blocks/img/reset.svg" /></div>` +
            `                    </div>` +
            `                </div>` +
            `            </div>` +
            `            <div class="right-block">` +
            `                <div class="block">` +
            `                    <div class="block-row">` +
            `                        <span>Weight</span>` +
            `                        <select data-id="${id}Weight${selectedTheme}-${device}">`;
        html += initweightsRelFontHtml;
        html += `${
            '</select>' +
            '                    </div>' +
            '                </div>' +
            '                <div class="block">' +
            '                    <div class="block-row">' +
            '                        <span>Transform</span>' +
            '                        <select  data-id="'
        }${id}Transform${selectedTheme}-${device}">`;
        html +=
            transformValue == 'none'
                ? '<option selected value="none">none</option>'
                : '<option value="none">none</option>';
        html +=
            transformValue == 'capitalize'
                ? '<option selected value="capitalize">capitalize</option>'
                : '<option value="capitalize">capitalize</option>';
        html +=
            transformValue == 'uppercase'
                ? '<option selected value="uppercase">uppercase</option>'
                : '<option value="uppercase">uppercase</option>';
        html +=
            transformValue == 'lowercase'
                ? '<option selected value="lowercase">lowercase</option>'
                : '<option value="lowercase">lowercase</option>';
        html += `${
            '                        </select>' +
            '                    </div>' +
            '                </div>' +
            '                <div class="block">' +
            '                    <div class="block-row">' +
            '                        <span>Style</span>' +
            '                        <select  data-id="'
        }${id}Style${selectedTheme}-${device}">`;
        html += initStylesRelFontHtml;
        html += `${
            '</select>' +
            '                    </div>' +
            '                </div>' +
            '                <div class="block">' +
            '                    <div class="block-row">' +
            '                        <span>Decoration</span>' +
            '                        <select  data-id="'
        }${id}Decoration${selectedTheme}-${device}">`;
        html +=
            decorationValue == 'none'
                ? '<option selected value="unset">none</option>'
                : '<option value="unset">none</option>';
        html +=
            decorationValue == 'solid'
                ? '<option selected value="solid">solid</option>'
                : '<option value="solid">solid</option>';
        html +=
            decorationValue == 'double'
                ? '<option selected value="double">double</option>'
                : '<option value="double">double</option>';
        html +=
            decorationValue == 'dotted'
                ? '<option selected value="dotted">dotted</option>'
                : '<option value="dotted">dotted</option>';
        html +=
            decorationValue == 'dashed'
                ? '<option selected value="dashed">dashed</option>'
                : '<option value="dashed">dashed</option>';
        html +=
            decorationValue == 'wavy'
                ? '<option selected value="wavy">wavy</option>'
                : '<option value="wavy">wavy</option>';
        html += `${
            '                        </select>' +
            '                    </div>' +
            '                </div>' +
            // Decoration
            '                <div class="block">' +
            '                    <div class="block-row">' +
            '                        <span></span>' +
            '                        <select  data-id="'
        }${id}DecorationLine${selectedTheme}-${device}">`;
        html +=
            decorationLineValue == 'none'
                ? '<option selected value="none">none</option>'
                : '<option value="none">none</option>';
        html +=
            decorationLineValue == 'overline'
                ? '<option selected value="overline">overline</option>'
                : '<option value="overline">overline</option>';
        html +=
            decorationLineValue == 'underline'
                ? '<option selected value="underline">underline</option>'
                : '<option value="underline">underline</option>';
        html +=
            decorationLineValue == 'line-through'
                ? '<option selected value="line-through">line-through</option>'
                : '<option value="line-through">line-through</option>';
        html +=
            decorationLineValue == 'overline underline'
                ? '<option selected value="overline underline">overline underline</option>'
                : '<option value="overline underline">overline underline</option>';
        html +=
            '                        </select>' +
            '                    </div>' +
            '                </div>' +
            //    end Decoration
            '                <div class="block">' +
            '                    <div class="block-row">' +
            '                       <button class="btn apply-btn">Apply Style</button>';
        '                    </div>' +
            '                </div>' +
            '            </div>' +
            '        </div>' +
            '    </div>';
        return html;
    }

    function initLeftSide() {
        const html = `<div class="sec-globalStyling active" data-left-section="globalStyling" title="Global Styling
">
                        <img src="/wp-content/plugins/maxi-blocks/img/icons/gs-icon.png" />
                    </div>
                    <div class="sec-test showTooltip" data-left-section="test" data-title="Placeholder Tab">
                        <img src="/wp-content/plugins/maxi-blocks/img/icons/xx-icon.png" />
                    </div>`;
        $('#customize-control-leftSide').html(html);
        $('#customize-control-leftSideTest').html(html);
    }

    function initIcons() {
        /*
         * Set icons under color blocks for each theme
         */
        // 'Natural', 'Admiral', 'Peach', hided themes
        const $themes = ['Default', 'Mint', 'Elegance', 'Candy', 'Bumblebee'];
        $.each($themes, function (key, theme) {
            $(
                `#customize-control-body_background_color${theme}-color-dark .customize-control-title`
            ).html(
                `<img class="icon-color showTooltip" data-title="Background" src="${maxi_ajax_object.maxi_plugin_url}/maxi-blocks/img/fill.svg" />`
            );
            $(
                `#customize-control-p_color${theme}-color-dark .customize-control-title`
            ).html(
                `<img class="icon-color showTooltip" data-title="Text" src="${maxi_ajax_object.maxi_plugin_url}/maxi-blocks/img/edit-tool.svg" />`
            );
            $(
                `#customize-control-a_color${theme}-color-dark .customize-control-title`
            ).html(
                `<img class="icon-color showTooltip" data-title="Link" src="${maxi_ajax_object.maxi_plugin_url}/maxi-blocks/img/broken-link.svg" />`
            );
            $(
                `#customize-control-highlight${theme}-color-dark .customize-control-title`
            ).html(
                `<img class="icon-color showTooltip" data-title="Highlight" src="${maxi_ajax_object.maxi_plugin_url}/maxi-blocks/img/permanent.svg" />`
            );
            $(
                `#customize-control-hover${theme}-color-dark .customize-control-title`
            ).html(
                `<img class="icon-color showTooltip" data-title="Hover" src="${maxi_ajax_object.maxi_plugin_url}/maxi-blocks/img/cursor.svg" />`
            );
            $(
                `#customize-control-body_background_color${theme}-color-light .customize-control-title`
            ).html(
                `<img class="icon-color showTooltip" data-title="Background" src="${maxi_ajax_object.maxi_plugin_url}/maxi-blocks/img/fill.svg" />`
            );
            $(
                `#customize-control-p_color${theme}-color-light .customize-control-title`
            ).html(
                `<img class="icon-color showTooltip" data-title="Text" src="${maxi_ajax_object.maxi_plugin_url}/maxi-blocks/img/edit-tool.svg" />`
            );
            $(
                `#customize-control-a_color${theme}-color-light .customize-control-title`
            ).html(
                `<img class="icon-color showTooltip" data-title="Link" src="${maxi_ajax_object.maxi_plugin_url}/maxi-blocks/img/broken-link.svg" />`
            );
            $(
                `#customize-control-highlight${theme}-color-light .customize-control-title`
            ).html(
                `<img class="icon-color showTooltip" data-title="Highlight" src="${maxi_ajax_object.maxi_plugin_url}/maxi-blocks/img/permanent.svg" />`
            );
            $(
                `#customize-control-hover${theme}-color-light .customize-control-title`
            ).html(
                `<img class="icon-color showTooltip" data-title="Hover" src="${maxi_ajax_object.maxi_plugin_url}/maxi-blocks/img/cursor.svg" />`
            );
        });
    }

    // make titles for color
    $(document).on('hover', '.wp-picker-container .wp-color-result', function (
        e
    ) {
        $('.tooltiptext, #tooltiptextCss').remove();
        let title = $(this)
            .parents('.customize-control-color')
            .find('.icon-color')
            .attr('data-title');
        let text = $(this)
            .parents('li[id*="-color-"]')
            .find('.customize-control-title')
            .text();
        if (title) {
            title = title.trim();
            if (title !== '') modalTitle(title, this, e);
            $('#tooltiptextCss').append(
                '.tooltiptext{visibility: visible !important; opacity: 1!important;}'
            );
        } else if (text) {
            text = text.trim();
            if (text !== '') modalTitle(text, this, e);
            $('#tooltiptextCss').append(
                '.tooltiptext{visibility: visible !important; opacity: 1!important;}'
            );
        }
    });

    function initHeadingBlocksBGColors() {
        // let darkColor = $('#customize-control-body_background_color-color-dark .wp-color-result').css('background-color');
        // let lightColor = $('#customize-control-body_background_color-color-light .wp-color-result').css('background-color');
        // $('#customize-control-h1Dark , #customize-control-h2Dark, #customize-control-h3Dark ,#customize-control-h4Dark , #customize-control-h5Dark , #customize-control-h6Dark , #customize-control-pDark').css('background-color',darkColor)
        // $('#customize-control-h1Light , #customize-control-h2Light, #customize-control-h3Light ,#customize-control-h4Light , #customize-control-h5Light , #customize-control-h6Light , #customize-control-pLight').css('background-color',lightColor)
    }

    $(document).ready(function () {
        let ready = 'pending';
        // initHeadingBlocksBGColors();
        console.log('before wp.customize.bind');
        wp.customize.bind('pane-contents-reflowed', function () {
            // listen rebuilding event
            // this will get only those which are for selected theme
            if (wp.customize.previewer.deferred.active.state() === 'pending') {
                // when work theme customize this part again work, need to work only on page load, one time

                // remove loader only one time
                if (ready === 'pending') {
                    setTimeout(function () {
                        loaderSetUp('remove');
                        ready = 'resolved';
                    }, 1000);
                }
                // initLeftSide();

                // make empty uls , then append there color blocks
                $('#customize-control-darkColors').html(
                    renderColorsBlock('Colour Dark')
                ); // create dark colors section
                $('#customize-control-lightColors').html(
                    renderColorsBlock('Colour Light')
                ); // create light colors section

                // give all color sections custom class
                $('.customize-control-color').addClass(
                    'customize-control-hidden-color'
                );

                // id is defined from php
                const darkLi = $("li[id*='-color-dark']").get(); // get colors for light section
                const lightLi = $("li[id*='-color-light']").get(); // get colors for light section

                const selectedTheme = wp.customize(`color_scheme`).get();

                // $('#customize-control-darkColors ul').append(Array.prototype.slice.call(darkLi)); //add colors in light section
                // $('#customize-control-lightColors ul').append(Array.prototype.slice.call(lightLi)); //add colors in light section

                // set icons under color sectons when all sections already exist on one line
                initIcons();
                // hide those colors which don't belong to current theme
                $('.customize-control-hidden-color').each(function () {
                    if (this.id.indexOf(selectedTheme) == -1) {
                        $(this)
                            .addClass('customize-control-hidden')
                            .removeClass('customize-control-color');
                    }
                });
                $('.customize-control-hidden-color').each(function () {
                    if (this.id.indexOf(selectedTheme) == -1) {
                        $(this)
                            .addClass('customize-control-hidden')
                            .removeClass('customize-control-color');
                    }
                });
                let themePreset = wp
                    .customize(`themeSwitch${selectedTheme}`)
                    .get();
                themePreset =
                    themePreset === 'dark'
                        ? 'Dark'
                        : themePreset === 'light'
                        ? 'Light'
                        : '';

                // hide themeSwitchs except choosen
                $(`li[id*='themeSwitch']`)
                    .addClass('customize-control-hidden')
                    .removeClass('customize-control-select');
                $(`li[id*='themeSwitch${selectedTheme}']`)
                    .addClass('customize-control-select')
                    .removeClass('customize-control-hidden');
                // hide blocks except theme's blocks
                $(`li[id*='_blockPopUp_']`)
                    .addClass('customize-control-hidden')
                    .removeClass('customize-control-text');

                $(`li[id*='${themePreset}${selectedTheme}_blockPopUp_']`)
                    .addClass('customize-control-text')
                    .removeClass('customize-control-hidden');
                $(`#customize-control-lightColors`).removeClass('top-200');
                $(`#customize-control-darkColors`)
                    .removeClass('customize-control-hidden')
                    .addClass('customize-control-text');
                $(`#customize-control-lightColors`)
                    .removeClass('customize-control-hidden')
                    .addClass('customize-control-text');
                $(`li[id*='${selectedTheme}-color-dark']`)
                    .removeClass('customize-control-hidden')
                    .addClass('customize-control-color');
                $(`li[id*='${selectedTheme}-color-light']`)
                    .removeClass('customize-control-hidden')
                    .addClass('customize-control-color');

                // set up reset button and modal
                $('#customize-control-reset').removeClass(
                    'customize-control-reset-default'
                );
                $('#_customize-button-reset-modal').remove();
                $('#customize-control-reset').append(
                    '<button id="_customize-button-reset-modal" type="button" class="button button-info" data-toggle="modal" data-target="#resetModal">Reset</button>'
                );
                $('#_customize-input-reset').hide();
                // <!-- Modal -->
                $('#resetModal').remove();
                const resetModal = `<div class="modal fade" id="resetModal" tabindex="-1" role="dialog" aria-labelledby="resetModalLabel" aria-hidden="true">
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

                if (themePreset === 'Dark') {
                    $(`#customize-control-lightColors`)
                        .addClass('customize-control-hidden')
                        .removeClass('customize-control-text');
                    $(`li[id*='${selectedTheme}-color-light']`)
                        .addClass('customize-control-hidden')
                        .removeClass('customize-control-color');
                } else if (themePreset === 'Light') {
                    $(`#customize-control-darkColors`)
                        .addClass('customize-control-hidden')
                        .removeClass('customize-control-text');
                    $(`#customize-control-lightColors`).addClass('top-200');
                    $(`li[id*='${selectedTheme}-color-dark']`)
                        .addClass('customize-control-hidden')
                        .removeClass('customize-control-color');
                } else {
                    $('#customize-control-reset').addClass(
                        'customize-control-reset-default'
                    );
                }
            }
        });

        /*
         * Setup lefside panel
         */

        $('#customize-control-leftSide').on('click', 'div', function (e) {
            setActiveSection(this);
        });
        $('#customize-control-leftSideTest').on('click', 'div', function (e) {
            setActiveSection(this);
        });
        function setActiveSection(div) {
            const section = $(div).attr('data-left-section');
            $('#customize-control-leftSideTest, #customize-control-leftSide')
                .find('div')
                .removeClass('active');
            $(div).removeClass('active');
            $(`.sec-${section}`).addClass('active');
            wp.customize.section(section).focus();
        }

        $('#customize-footer-actions .devices button').on('click', function () {
            const type = $(this).attr('data-device');
            const selectedTheme = $('#_customize-input-color_scheme').val();

            const iframe = $('iframe').contents();
            const classes = {
                '.maxi-dark h1': 'h1Dark',
                '.maxi-light h1': 'h1Light',
                '.maxi-dark h2': 'h2Dark',
                '.maxi-light h2': 'h2Light',
                '.maxi-dark h3': 'h3Dark',
                '.maxi-light h3': 'h3Light',
                '.maxi-dark h4': 'h4Dark',
                '.maxi-light h4': 'h4Light',
                '.maxi-dark h5': 'h5Dark',
                '.maxi-light h5': 'h5Light',
                '.maxi-dark h6': 'h6Dark',
                '.maxi-light h6': 'h6Light',
            };
            for (const i in classes) {
                iframe.find(i).css({
                    'font-size': `${$(
                        `#customize-control-${classes[i]}FS${selectedTheme}-${type} input`
                    ).val()} !important`,
                    'line-height': `${$(
                        `#customize-control-${classes[i]}LineHgt${selectedTheme}-${type} input`
                    ).val()} !important`,
                    'letter-spacing': `${$(
                        `#customize-control-${classes[i]}LineHgt${selectedTheme}-${type} input`
                    ).val()} !important`,
                    'font-weight': `${$(
                        `#customize-control-${classes[i]}Weight${selectedTheme}-${type} input`
                    ).val()} !important`,
                    'text-transform': `${$(
                        `#customize-control-${classes[i]}Transform${selectedTheme}-${type} input`
                    ).val()} !important`,
                    'font-style': `${$(
                        `#customize-control-${classes[i]}Style${selectedTheme}-${type} input`
                    ).val()} !important`,
                    'text-decoration': `${$(
                        `#customize-control-${classes[i]}Decoration${selectedTheme}-${type} input`
                    ).val()} !important`,
                    'font-family':
                        `"${$(
                            `#customize-control-${classes[i]}Font${selectedTheme}-${type} input`
                        )
                            .val()
                            .replace(/\+/g, ' ')} !important` + `"`,
                });
            }

            const parent = $('.heading-pop-up');
            parent.find('.device').removeClass('active');
            parent.find('input').map(function () {
                const prevDataId = $(this).attr('data-id');
                const newDataId = prevDataId.replace(/[^\\-]+$/g, type);
                const newValueInput = $(
                    `#customize-control-${newDataId} input`
                ).val();
                const newValue = parseFloat(newValueInput);
                const newValueType = getTextFromString(newValueInput);
                const typeBlock = $(this).parent().parent().find('.type');
                typeBlock.attr('data-id', newDataId);
                $(this).val(newValue);
                $(this).attr('data-id', newDataId);
                typeBlock.removeClass();
                typeBlock.addClass(`type ${newValueType}`);
            });
            parent.find('select').map(function () {
                const prevDataId = $(this).attr('data-id');
                const newDataId = prevDataId.replace(/[^\\-]+$/g, type);
                $(this).attr('data-id', newDataId);
                const selectValue = $(
                    `#customize-control-${newDataId} input`
                ).val();
                $(this).find('option[selected]').removeAttr('selected');
                $(this)
                    .find(`option[value="${selectValue}"]`)
                    .attr('selected', 'selected');
            });
            parent.find(`.device[data-type="${type}"]`).addClass('active');
        });

        $('.customize-control-text').on(
            'click',
            '.heading-pop-up .devices .device',
            function () {
                const type = $(this).attr('data-type');
                $(
                    `.devices-wrapper .devices button[data-device=${type}]`
                ).click();
            }
        );

        // devices customizeing
        $('.customize-control-text').on(
            'click',
            '.heading-pop-up .type div',
            function () {
                let className = $(this).attr('data-value');
                className = className == '%' ? 'procent' : className;
                $(this).parent().removeClass();
                $(this).parent().addClass(`type ${className}`);
                const id = $(this).parent().attr('data-id');

                $(`input[data-id="${id}"]`).attr(
                    'step',
                    className == 'px' ? 1 : '0.1'
                );
                const typeValue = $(this).attr('data-value');
                const inputValue = parseFloat(
                    $(`#customize-control-${id} input`).val()
                );

                const value = inputValue + typeValue;
                wp.customize(id, function (data) {
                    data.set(value);
                });
            }
        );

        $('.customize-control-text').on('click', function (e) {
            // listen click on customize control text block
            if (e.target !== this) {
                // return false if click on children
                if (
                    !$(e.target).hasClass('customize-control-title') &&
                    e.target.localName !== 'label'
                ) {
                    return false;
                }
            }

            if ($(this).find('.has-popup').length !== 0) {
                $('.customize-control-text.active').removeClass('active');
                $(this).addClass('active');
                if ($(this).find('.heading-pop-up').length !== 0) {
                    if (
                        $(this).find('.heading-pop-up').css('display') == 'flex'
                    ) {
                        $('.heading-pop-up').hide();
                        $(this).removeClass('active');
                    } else {
                        $('.heading-pop-up').hide();
                        $(this).find('.heading-pop-up').show();
                    }
                } else {
                    $('.heading-pop-up').hide();
                    const id = $(this).find('.has-popup').attr('data-name');
                    $(this).append(makePopUp(id));

                    $('.font-family-select')
                        .select2({
                            width: '150px',
                            sorter(results) {
                                const query = $('.select2-search__field')
                                    .val()
                                    .toLowerCase();
                                return results.sort(function (a, b) {
                                    return (
                                        a.text.toLowerCase().indexOf(query) -
                                        b.text.toLowerCase().indexOf(query)
                                    );
                                });
                            },
                        })
                        .on('select2:open', function (e) {
                            $('.select2-search__field').attr(
                                'placeholder',
                                'Search'
                            );
                        });
                }
            }
        });

        $(document).on('change', '.heading-pop-up input', function () {
            const id = $(this).attr('data-id');
            const inputValue = $(this).val();
            const typeValue = $(`#customize-control-${id} input`)
                .val()
                .replace(/\d+([,.]\d+)?/g, '');
            const value = inputValue + typeValue;
            wp.customize(id, function (data) {
                data.set(value);
            });
        });

        $(document).on('change', '.heading-pop-up select', function () {
            const id = $(this).attr('data-id');
            const value = $(this).val();
            wp.customize(id, function (data) {
                data.set(value);
            });
        });

        $('.customize-control-text').on(
            'click',
            '.heading-pop-up .reset',
            function () {
                const parent = $(this).parent();
                const isInput = parent.find('input').length;
                const newValue = $(this).attr('data-default');
                const newType = isInput
                    ? getTextFromString(newValue)
                    : newValue; // for select dont replace
                const value = isInput ? parseFloat(newValue) : newValue;
                const typeBlock = parent.parent().find('.type');
                const input = isInput
                    ? parent.find('input')
                    : parent.find('select');
                const data_id = input.attr('data-id');

                if (isInput) {
                    typeBlock.removeClass();
                    typeBlock.addClass(`type ${newType}`);
                }

                input.val(value).change();
                wp.customize(data_id, function (data) {
                    data.set(newValue);
                });
            }
        );

        $('.customize-control-text').on(
            'click',
            '.heading-pop-up .close-pop-up',
            function () {
                $(this).parent().hide();
            }
        );

        $('.customize-control-text').on(
            'click',
            '.heading-pop-up .apply-btn',
            function () {
                $('#customize-save-button-wrapper #save').click();
            }
        );

        $('.customize-control-text').on(
            'click',
            '.heading-pop-up .left-side li',
            function () {
                $(this).parent().find('li.active').removeClass('active');
                $(this).addClass('active');
            }
        );

        // append Styles and Weights for each font
        // get font blocks and customize them
        function customizePopUp() {
            const device = $('#customize-footer-actions .devices .active').attr(
                'data-device'
            );
            const selectedTheme = $('#_customize-input-color_scheme').val();

            $.each($('.has-popup'), function (i, popup) {
                const id = $(this).attr('data-name');
                const controlId = `${id}Font${selectedTheme}-${device}`;

                wp.customize(controlId, function (val) {
                    val.bind(function (newFontVal) {
                        const styleControl = `${id}Style${selectedTheme}-${device}`;
                        const weightcontrol = `${id}Weight${selectedTheme}-${device}`;
                        const weightValue = $(
                            `#customize-control-${id}Weight${selectedTheme}-${device} input`
                        ).val();
                        const styleValue = $(
                            `#customize-control-${id}Style${selectedTheme}-${device} input`
                        ).val();

                        wp.customize(styleControl, function (styleVal) {
                            const stylesRelFont = maxi_ajax_object.font_info[
                                newFontVal
                            ]
                                ? maxi_ajax_object.font_info[newFontVal].styles
                                : ['normal', 'italic', 'oblique'];
                            let stylesRelFontHtml = stylesRelFont.map(
                                item =>
                                    `<option ${
                                        styleValue == item ? 'selected' : ''
                                    } value="${item}">${item}</option>`
                            );
                            stylesRelFontHtml = stylesRelFontHtml.join();
                            $(`select[data-id="${styleControl}"]`).html(
                                stylesRelFontHtml
                            );
                            // styleVal.set(stylesRelFontHtml);
                            // styleVal.bind(function (newStyleVal) {
                            // })
                        });

                        wp.customize(weightcontrol, function (weightVal) {
                            const weightsRelFont = maxi_ajax_object.font_info[
                                newFontVal
                            ]
                                ? Object.values(
                                      maxi_ajax_object.font_info[newFontVal]
                                          .weights
                                  )
                                : [
                                      '100',
                                      '200',
                                      '300',
                                      '400',
                                      '500',
                                      '600',
                                      '700',
                                      '800',
                                      '900',
                                  ];
                            const weightsRelFontHtml = weightsRelFont
                                .map(
                                    item =>
                                        `<option ${
                                            weightValue == item
                                                ? 'selected'
                                                : ''
                                        } value="${item}">${item}</option>`
                                )
                                .join();
                            $(`select[data-id="${weightcontrol}"]`).html(
                                weightsRelFontHtml
                            );
                        });
                    });
                });
            });

            $(document).on('click', '#accordion-panel-MaxiBlocks', function () {
                loaderSetUp();
            });
            if (typeof wp.customize.panel === 'function') {
                // remove intermediate step and open GLOBAL STYLE section
                wp.customize.panel('MaxiBlocks', function (panel) {
                    panel.expanded.bind(function (isExpanded) {
                        if (isExpanded) {
                            $(
                                '#customize-control-leftSideTest, #customize-control-leftSide'
                            )
                                .find('div')
                                .removeClass('active');
                            $(`.sec-globalStyling`).addClass('active');
                            wp.customize.section('globalStyling').focus();
                        }
                    });
                });
            }
            // remove intermediate step when going to back
            $(document).on(
                'click',
                '#sub-accordion-section-globalStyling .customize-section-back, #sub-accordion-section-test .customize-section-back',
                function () {
                    $('#sub-accordion-panel-MaxiBlocks')
                        .find('.customize-panel-back')
                        .trigger('click');
                }
            );

            $(document).on('hover', '.customize-section-back', function (e) {
                $(this).attr('data-title', 'Back');
                const modal_content = $(this).attr('data-title');
                const tooltipElement = this;
                const direction = 'right';
                modalTitle(modal_content, tooltipElement, e, direction);
            });
            // heading-pop-up
            $('body').on(
                'click',
                '#sub-accordion-section-globalStyling li',
                function (e) {
                    if ($(this).find('.heading-pop-up').length) {
                        if (
                            $(this).find('.heading-pop-up').prop('display') ==
                                'none' ||
                            !$(this).find('.heading-pop-up').prop('display')
                        ) {
                            // check light and dark working together and data-id
                            $('#sub-accordion-section-globalStyling li')
                                .find('.heading-pop-up')
                                .prop('display', 'none');
                            $(this).find('.heading-pop-up').stop().slideDown();
                            $(this)
                                .find('.heading-pop-up')
                                .prop('display', 'block');
                        } else {
                            $(this).find('.heading-pop-up').stop().slideUp();
                            $(this)
                                .find('.heading-pop-up')
                                .prop('display', 'none');
                        }
                    }
                }
            );
        }
        customizePopUp();
    });

    // make functionality for reset button
    $(document).on('click', '#_customize-button-reset-modal', function (e) {
        $('#resetModal').addClass('show').removeClass('fade');
    });

    $(document).on('click', '._customize-button-reset-close', function (e) {
        $('#resetModal').addClass('fade').removeClass('show');
    });
    $(document).on('click', '#_customize-button-reset', function (e) {
        $(this).attr('disabled', 'disabled');
        // if (confirm('Are you sure you want to do this? All your setting with be restored back to default settings.')){
        const currentTheme = wp.customize('color_scheme').get();
        const defaultThemeOptions = JSON.parse(
            maxi_ajax_object.defaultThemeOptions
        );

        const device = $('#customize-footer-actions .devices .active').attr(
            'data-device'
        );

        // h1...h6, p customize start
        const tagBlocks = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
        const BlocksStyles = [
            ['DarkFont', 'Dark', 'font-family'], // which control, which block, which style will change for
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
            ['LightWeight', 'Light', 'font-weight'],
            ['LightLineHgt', 'Light', 'line-height'],
            ['LightLetterSpc', 'Light', 'letter-spacing'],
            ['LightTransform', 'Light', 'text-transform'],
            ['LightStyle', 'Light', 'font-style'],
            ['LightDecoration', 'Light', 'text-decoration-style'],
            ['LightDecorationLine', 'Light', 'text-decoration-line'],
        ];

        // set color customize
        wp.customize(`body_background_color${currentTheme}-color-dark`).set(
            defaultThemeOptions[currentTheme].Dark.block.background
        );
        wp.customize(`body_background_color${currentTheme}-color-light`).set(
            defaultThemeOptions[currentTheme].Light.block.background
        );
        wp.customize(`hover${currentTheme}-color-dark`).set(
            defaultThemeOptions[currentTheme].Dark.hover
        );
        wp.customize(`hover${currentTheme}-color-light`).set(
            defaultThemeOptions[currentTheme].Light.hover
        );
        wp.customize(`highlight${currentTheme}-color-dark`).set(
            defaultThemeOptions[currentTheme].Dark.highlight
        );
        wp.customize(`highlight${currentTheme}-color-light`).set(
            defaultThemeOptions[currentTheme].Light.highlight
        );
        wp.customize(`p_color${currentTheme}-color-dark`).set(
            defaultThemeOptions[currentTheme].Dark.domElements.p.color
        );
        wp.customize(`p_color${currentTheme}-color-light`).set(
            defaultThemeOptions[currentTheme].Light.domElements.p.color
        );
        wp.customize(`a_color${currentTheme}-color-dark`).set(
            defaultThemeOptions[currentTheme].Dark.domElements.a.color
        );
        wp.customize(`a_color${currentTheme}-color-light`).set(
            defaultThemeOptions[currentTheme].Light.domElements.a.color
        );
        wp.customize(`h1_color${currentTheme}-color-dark`).set(
            defaultThemeOptions[currentTheme].Dark.domElements.h1.color
        );
        wp.customize(`h1_color${currentTheme}-color-light`).set(
            defaultThemeOptions[currentTheme].Light.domElements.h1.color
        );
        wp.customize(`h2_color${currentTheme}-color-dark`).set(
            defaultThemeOptions[currentTheme].Dark.domElements.h2.color
        );
        wp.customize(`h2_color${currentTheme}-color-light`).set(
            defaultThemeOptions[currentTheme].Light.domElements.h2.color
        );
        wp.customize(`h3_color${currentTheme}-color-dark`).set(
            defaultThemeOptions[currentTheme].Dark.domElements.h3.color
        );
        wp.customize(`h3_color${currentTheme}-color-light`).set(
            defaultThemeOptions[currentTheme].Light.domElements.h3.color
        );
        wp.customize(`h4_color${currentTheme}-color-dark`).set(
            defaultThemeOptions[currentTheme].Dark.domElements.h4.color
        );
        wp.customize(`h4_color${currentTheme}-color-light`).set(
            defaultThemeOptions[currentTheme].Light.domElements.h4.color
        );
        wp.customize(`h5_color${currentTheme}-color-dark`).set(
            defaultThemeOptions[currentTheme].Dark.domElements.h5.color
        );
        wp.customize(`h5_color${currentTheme}-color-light`).set(
            defaultThemeOptions[currentTheme].Light.domElements.h5.color
        );
        wp.customize(`h6_color${currentTheme}-color-dark`).set(
            defaultThemeOptions[currentTheme].Dark.domElements.h6.color
        );
        wp.customize(`h6_color${currentTheme}-color-light`).set(
            defaultThemeOptions[currentTheme].Light.domElements.h6.color
        );

        // set popup customize

        tagBlocks.forEach(tagBlok => {
            $.each(BlocksStyles, function (i, controlBlock) {
                const control = tagBlok + controlBlock[0];
                const { domElements } = defaultThemeOptions[currentTheme][
                    controlBlock[1]
                ];
                let controlDefault = domElements[tagBlok][controlBlock[2]];

                if (domElements[tagBlok][controlBlock[2]]) {
                    if (controlBlock[2] === 'font-size') {
                        controlDefault = domElements[tagBlok][
                            controlBlock[2]
                        ].replace(/\D+([,.]\D+)?/g, ''); // remove px, vm
                    }
                    const elem = $('.heading-pop-up').find(
                        `[data-id="${control}${currentTheme}-${device}"]`
                    );

                    wp.customize(`${control + currentTheme}-${device}`).set(
                        controlDefault
                    );
                    elem.attr('value', controlDefault).trigger('change');
                }
            });
        });

        const api = wp.customize;
        api.previewer.save();
        const presetId = `themeSwitch${currentTheme}`;
        $(`_customize-input-${presetId}`)
            .attr('value', 'default')
            .trigger('change');
        setTimeout(() => {
            $('#resetModal').addClass('fade').removeClass('show');
        }, 1000);

        // }
    });
});
