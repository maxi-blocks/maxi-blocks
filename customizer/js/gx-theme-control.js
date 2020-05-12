/**
 * This file make hide/show options for themes
 */
(function($) {
    /**
     * Run function when customizer is ready.
     */

    var mainBlocks = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    wp.customize.control('color_scheme', function (control) {
        /**
         * Run function on setting change of control.
         */
        control.setting.bind(function (themeName) {
            // hide all color controls except those which are belong to current theme
            $('.customize-control-hidden-color').addClass('customize-control-hidden').removeClass('customize-control-color');
            $(`li[id*='${themeName}-color-']`).addClass('customize-control-color').removeClass('customize-control-hidden');

            // hide themeSwitchs except choosen
            $(`li[id*='themeSwitch']`).addClass('customize-control-hidden').removeClass('customize-control-select');
            $(`li[id*='themeSwitch${themeName}']`).addClass('customize-control-select').removeClass('customize-control-hidden');

            // hide blocks except theme's blocks
            $(`li[id*='_blockPopUp_']`).addClass('customize-control-hidden').removeClass('customize-control-text');
            $(`li[id*='${themeName}_blockPopUp_']`).addClass('customize-control-text').removeClass('customize-control-hidden');

            // $.each(mainBlocks, function( key, controlBlock ) {
            //
            //     if (themeName === 'Custom') {
            //         $(`#customize-control-${controlBlock}DarkReggae`).addClass('customize-control-hidden').removeClass('customize-control-text');
            //         $(`#customize-control-${controlBlock}LightReggae`).addClass('customize-control-hidden').removeClass('customize-control-text');
            //
            //         $(`#customize-control-${controlBlock}DarkElegance`).addClass('customize-control-hidden').removeClass('customize-control-text');
            //         $(`#customize-control-${controlBlock}LightElegance`).addClass('customize-control-hidden').removeClass('customize-control-text');
            //
            //     } else if (themeName === 'Reggae') {
            //         $(`#customize-control-${controlBlock}DarkCustom`).addClass('customize-control-hidden').removeClass('customize-control-text');
            //         $(`#customize-control-${controlBlock}LightCustom`).addClass('customize-control-hidden').removeClass('customize-control-text');
            //
            //         $(`#customize-control-${controlBlock}DarkElegance`).addClass('customize-control-hidden').removeClass('customize-control-text');
            //         $(`#customize-control-${controlBlock}LightElegance`).addClass('customize-control-hidden').removeClass('customize-control-text');
            //
            //     } else {
            //         $(`#customize-control-${controlBlock}DarkCustom`).addClass('customize-control-hidden').removeClass('customize-control-text');
            //         $(`#customize-control-${controlBlock}LightCustom`).addClass('customize-control-hidden').removeClass('customize-control-text');
            //
            //         $(`#customize-control-${controlBlock}DarkReggae`).addClass('customize-control-hidden').removeClass('customize-control-text');
            //         $(`#customize-control-${controlBlock}LightReggae`).addClass('customize-control-hidden').removeClass('customize-control-text');
            //
            //     }
            //     $(`#customize-control-${controlBlock}Dark${themeName}`).removeClass('customize-control-hidden').addClass('customize-control-text');
            //     $(`#customize-control-${controlBlock}Light${themeName}`).removeClass('customize-control-hidden').addClass('customize-control-text');
            // })

        });
    });
})(jQuery);