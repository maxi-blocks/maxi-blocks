/**
 * BLOCK: GX Layout
 */

/**
 * Add a GX Layout button to the toolbar.
 */
document.addEventListener('DOMContentLoaded', addGXLayoutButtonAdmin);

var ddd_full_stop = 0;

// main function
function onIframeLoad() {
    //console.log('onIframeLoad');
    setTimeout(function() {
        console.log("ddd_full_stop" + ddd_full_stop);
        jQuery('iframe#gx-library-iframe').on('load', function() {
            console.log('iframe loaded');

            var frame = document.getElementById('gx-library-iframe');

            jQuery.ajax({
                type: 'GET',
                url: ajaxurl,
                data: 'action=gx_get_option',
                success: function(data) {
                    var gx_sp_enable = data + '';
                    if (gx_sp_enable === 'enabled') {
                        frame.contentWindow.postMessage('pro_membership_activated', '*');
                    } else {
                        frame.contentWindow.postMessage('pro_membership_deactivated', '*');
                    }
                }
            });
            // function to get post id from the url parameter 'post'
            function getUrlVars() {
                var vars = [],
                    hash;
                var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
                for (var i = 0; i < hashes.length; i++) {
                    hash = hashes[i].split('=');
                    vars.push(hash[0]);
                    vars[hash[0]] = hash[1];
                }
                return vars;
            }

            var post_id = getUrlVars()["post"];

            // Create IE + others compatible event handler
            var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
            var eventer = window[eventMethod];
            var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";


            var global_json_counter = 0;
            var json_counter = 0;
            // Listen to message from child window
            eventer(messageEvent, function(e) {

                if (e.origin === 'https://ondemand.dev400.com') {
                    var response;
                    if (jQuery.type(e.data) === 'string') { // check if the response is text

                        if (~e.data.indexOf('type') || ~e.data.indexOf('wp_block')) { // if the response is a gutenberg json file
                            response = jQuery.parseJSON(e.data);
                            console.log('response ' + response);
                            if (response) {
                                if (!jQuery(frame).hasClass('settingsIframe') && !jQuery(frame).hasClass('vbIframe') && ddd_full_stop === 0) {
                                    console.log('LOADING LAYOUT');
                                    var layout = JSON.stringify(response);


                                    // console.log('response.title ' + response.name);
                                    //console.log('response.type ' + response.type);
                                    //console.log('response.category ' + response.category);
                                    // console.log('response.content ' + response.content);

                                    let name = response.title;
                                    let content = response.content;

                                    if (name && content) {

                                        jQuery.ajax({
                                            type: 'POST',
                                            url: ajaxurl,
                                            data: 'action=gx_insert_block&gx_title=' + name + '&gx_content=' + content,
                                            success: function(data) {
                                                console.log(data);
                                                window.location.reload();
                                            },
                                            error: function(data) {
                                                console.log(data);
                                                jQuery('.components-modal__frame_inner').html("<h2 class='gx_error'>Error: some problems with import. Please try again later or contact us with the support tab.</h2>");

                                            }
                                        });
                                    } else {
                                        console.log('JSON Error');
                                        jQuery('div.components-modal__frame_inner').html("<h2 class='gx_error'>Error: some problems with the JSON file. Please try again later or contact us with the support tab.</h2>");

                                    }

                                    ddd_full_stop = 1;

                                }
                            } //  if (response)
                        } // if (~e.data.indexOf('context'))

                    } //if jQuery.type(e.data) === 'string'
                } //if (e.origin === 'https://ondemand.divi-den.com') {
            }, false); // eventer(messageEvent, function(e) {

            ddd_full_stop = 0;
        }); //  jQuery('iframe#gx-library-iframe').on('load', function()

    }, 200);
} //function onIframeLoad()
/**
 * Build the layout inserter button.
 */
function addGXLayoutButtonAdmin() {
    //console.log('addGXLayoutButtonAdmin starts');
    let wp_toolbar = document.querySelector('.list-reusable-blocks__container');
    if (!wp_toolbar) {
        //console.log('return');
        return;
    }
    let buttonDiv = document.createElement('div');
    jQuery(buttonDiv).addClass('gx-toolbar-layout').css('display', 'inline-block');
    let html = `<button id="gxAddLayoutButton" class="components-button components-icon-button" aria-label="Add Layout">\
    </i><img src="/wp-content/plugins/gutenberg-extra/img/GX-icon.png" /> GX Library</button>`;
    buttonDiv.innerHTML = html;
    if (wp_toolbar) jQuery("a.page-title-action").after(buttonDiv);

    document.getElementById('gxAddLayoutButton').addEventListener('click', abInsertLayoutAdmin);
    //console.log('addGXLayoutButtonAdmin ends');
}

/**
 * Add the GX Layout block on click.
 */
function abInsertLayoutAdmin() {
    console.log('ClIcK!');
    onIframeLoad();
    let admin_modal = '<div class="components-modal__screen-overlay">\
    <div><div tabindex="-1"><div class="components-modal__frame gx-layout-modal" role="dialog" aria-labelledby="components-modal-header-0" tabindex="-1" style="width: 100%;height: 100%;">\
    <div class="components-modal__content" tabindex="0"><div class="components-modal__header"><div class="components-modal__header-heading-container">\
    <h1 id="components-modal-header-0" class="components-modal__header-heading">Gutenberg Extra Layouts and Blocks Library</h1></div>\
    <button type="button" aria-label="Close dialogue" class="components-button components-icon-button">\
    <svg aria-hidden="true" role="img" focusable="false" class="dashicon dashicons-no-alt" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path d="M14.95 6.46L11.41 10l3.54 3.54-1.41 1.41L10 11.42l-3.53 3.53-1.42-1.42L8.58 10 5.05 6.47l1.42-1.42L10 8.58l3.54-3.53z"></path></svg></button></div>\
    <div class="components-modal__frame_inner width="100%" height="90%" style="position: relative; display: initial;"><iframe src="https://ondemand.dev400.com" class="gx-library-iframe" id="gx-library-iframe" width="100%" height="100%" style="position: relative; display: initial;"></iframe>\
    </div></div></div></div></div></div>';
    jQuery('body').append(admin_modal);
    jQuery('.components-button.components-icon-button').on('click', function() {
        window.location.reload();
    });
}


/* Gutenberg Inspector */

(function($) {
   // var gx_tab_labels = '<span class="gx-general-tab-label gx-enabled">General</span><span class="gx-hover-tab-label">Hover</span>';
    var gx_tab_labels = '<div class="gx-tabs"><span class="gx-tab gx-content-tab-label gx-enabled">Content</span><span class="gx-tab gx-style-tab-label">Style</span><span class="gx-tab gx-advanced-tab-label">Advanced</span></div>';

    function gx_hide_tabs_settings() {
        if($('.gx-tab.gx-content-tab-label').hasClass('gx-enabled')) {
            $('.gx-style-tab-setting').hide();
            $('.gx-advanced-tab-setting').hide();
            $('.gx-content-tab-setting').show();
        }
        if($('.gx-tab.gx-style-tab-label').hasClass('gx-enabled')) {
            $('.gx-style-tab-setting').show();
            $('.gx-advanced-tab-setting').hide();
            $('.gx-content-tab-setting').hide();
        }
        if($('.gx-tab.gx-advanced-tab-label').hasClass('gx-enabled')) {
            $('.gx-style-tab-setting').hide();
            $('.gx-advanced-tab-setting').show();
            $('.gx-content-tab-setting').hide();
        }
    }
    setInterval(function() {
       //console.log('tabs');
        if ($('.gx-panel').length > 0) {
            $('.components-panel__body').each(function() {
                if ($(this).hasClass('gx-panel') && !$(this).parents('.block-editor-block-inspector').hasClass('gx-controls') && !$(this).parents('.edit-post-settings-sidebar__panel-block').hasClass('gx-controls')) {
                    $(this).parents('.block-editor-block-inspector').addClass('gx-controls');
                    $(this).parents('.edit-post-settings-sidebar__panel-block').addClass('gx-controls');
                    $(this).parents('div.edit-post-sidebar').addClass('gx-sidebar');
                    $(gx_tab_labels).insertAfter($('div.gx-controls .block-editor-block-card'));
                    gx_hide_tabs_settings();
                    $('.gx-tab').on('click', function() {
                      //  console.log('click on gx tab');
                        $('.gx-tab').each(function() {
                            $(this).removeClass('gx-enabled');
                        });

                        $(this).addClass('gx-enabled');
                        gx_hide_tabs_settings();

                    }); // $('.gx-tab').on('click', function()

                } //f (!$(this).parents('div.components-panel__body').hasClass('gx-controls'))
             });//$('.components-panel__body').each(function()

            $('.gx-borderRadius-dimensions-control:not(.gx-chaged)').each(function() {
                $(this).find('.components-gx-dimensions-control__number-label:first-child').text('Top Left');
                $(this).find('.components-gx-dimensions-control__number-label:nth-child(2)').text('Top Right');
                $(this).find('.components-gx-dimensions-control__number-label:nth-child(3)').text('Bottom Right');
                $(this).find('.components-gx-dimensions-control__number-label:nth-child(4)').text('Bottom Left');
                $(this).addClass('gx-chaged');

            });
        } //if ($('.gx-panel').length > 0)
        else {
           // console.log('no Panel');
            $('div.block-editor-block-inspector').removeClass('gx-controls');
            $('div.edit-post-sidebar').removeClass('gx-sidebar');
            $('.gx-tabs').remove();
        }

        $('.gx-device-control .components-radio-control__option').on('click', function() {
            $(this).find('input')[0].click();
        });


        $('.block-editor-inserter__results .components-panel__body:not(.gx-panel-body-inserter)').each(function(){

            var this_panel_title = $(this).find('h2 button').text();
            //console.log(this_panel_title);
            if(this_panel_title.indexOf('GutenbergExtra') !== -1) {
                $(this).addClass('gx-panel-body-inserter');
                //$(this).insertAfter('.editor-inserter__results .components-panel__body:first');
            }

        });



    }, 200);

})(jQuery);