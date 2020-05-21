var ddd_full_stop = 0;

var json_counters_array = [];

console.log('server.js loaded');


jQuery(document).ready(function($) {
    // main function
    function onIframeLoad() {
        //console.log('onIframeLoad');
        setTimeout(function() {
            $('iframe#gx-library-iframe').on('load', function() {
                console.log('iframe loaded');
                var frame = document.getElementById('gx-library-iframe');

                jQuery.ajax({
                    type: 'GET',
                    url: ajaxurl,
                    data: 'action=gx_get_option',
                    success: function(data) {
                        var gx_sp_enable = data + '';
                        if (gx_sp_enable === 'enabled') { frame.contentWindow.postMessage('pro_membership_activated', '*'); } else { frame.contentWindow.postMessage('pro_membership_activated', '*'); }
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

                    if (e.origin === 'https://ge-library.dev700.com') {
                        var response;
                        if (jQuery.type(e.data) === 'string') { // check if the response is text

                            if (~e.data.indexOf('type') || ~e.data.indexOf('wp_block')) { // if the response is a gutenberg json file
                                response = jQuery.parseJSON(e.data);
                                if (response) {
                                    if (!$(frame).hasClass('settingsIframe') && !$(frame).hasClass('vbIframe') && ddd_full_stop === 0) {
                                        console.log('LOADING LAYOUT');
                                        layout = JSON.stringify(response);
                                        console.log('layout');
                                        console.log(layout);

                                      //  var el = wp.element.createElement;

                                        // console.log('response.title ' + response.name);
                                        // console.log('response.type ' + response.type);
                                        // console.log('response.category ' + response.category);
                                        // console.log('response.content ' + response.content);

                                        insertedBlock = wp.blocks.createBlock('core/image', {
                                        content: '<!-- wp:image {\"id\":210927,\"align\":\"center\"} -->\n<div class=\"wp-block-image\"><figure class=\"aligncenter\"><img src=\"https://gutenberg.dev700.com/wp-content/uploads/2018/05/blog3.jpg\" alt=\"\" class=\"wp-image-210927\"/><figcaption>thsi is a test</figcaption></figure></div>\n<!-- /wp:image -->',
                                        });
                                        wp.data.dispatch('core/editor').insertBlocks(insertedBlock);

                                        // wp.data.dispatch('core/editor').replaceBlocks(
                                        //     block.clientId,
                                        //     rawHandler( {
                                        //         HTML: blockLayout,
                                        //         mode: 'BLOCKS',
                                        //         canUserUseUnfilteredHTML,
                                        //     } ),
                                        // ),


                                        ddd_full_stop = 1;

                                    } else if (response.context == 'et_builder_layouts' || $(frame).hasClass('settingsIframe')) {
                                        response_data = encodeURIComponent(JSON.stringify(response.data));

                                        // import to library

                                        console.log('IMPORT');

                                        jQuery.ajax({
                                            type: 'POST',
                                            url: ajaxurl,
                                            // processData: false,
                                            data: 'action=gx_import_posts&posts=' + response_data,
                                            success: function(data) {
                                                if ($("div.sectionSaved").length === 0) {
                                                    $('.ddp-tab-section, .ddp-tab-module').html('<div class="sectionSaved">\
                                                    <p><strong>Success!</strong> Your section/module is being saved to your local Divi library.</p>\
                                                    <h3>Choose your next step...</h3>\
                                                    <p>1. Find new modules and save to your library</p>\
                                                    <a href="#" class="gx_close">Find New Pro Modules</a>\
                                                    <p>2. Begin editing - Use the "Add From Library" tab to load sections/modules from local Divi Library</p>\
                                                    <a href="#" class="gx_reload">To Continue - Save and Reload Page</a>\
                                                    (please do it manually if you are in Divi Visual Builder)\
                                                    </div>');
                                                    $('body .ddp-tab-section a.gx_reload, body .ddp-tab-module a.gx_reload').on('click', function(e) {
                                                        e.preventDefault();
                                                        $('div.sectionSaved').html('<h3 class="gx_loading_text">Reloading...</h3>');
                                                        $('input.button-primary#publish').click();
                                                        $('button.et-fb-button--publish').click();
                                                        $('li#wp-admin-bar-et-disable-visual-builder a.ab-item').click();
                                                    });

                                                    var gx_rand = Math.floor((Math.random() * 1000000) + 1);
                                                    if (gx_wl_options_for_js.gx_status === 'enabled') {
                                                        gx_sections_link = 'https://ondemand.divi-den.com/sections-search-api-ljljdfre935/?uid=' + gx_rand;
                                                        gx_modules_link = 'https://ondemand.divi-den.com/modules-search-api-fdge43y/?uid=' + gx_rand;
                                                    } else {
                                                        gx_sections_link = 'https://ondemand.divi-den.com/sections-search-no-api-asdfv324/?uid=' + gx_rand;
                                                        gx_modules_link = 'https://ondemand.divi-den.com/modules-search-no-api-33jwer3/?uid=' + gx_rand;
                                                    }


                                                    $('body .ddp-tab-section a.gx_close').on('click', function(e) {
                                                        e.preventDefault();
                                                        $('div.sectionSaved').html('<h3 class="gx_loading_text">Loading...</h3>');
                                                        $('.ddp-tab-section').html('<iframe id="gx-library-iframe" name="gx-library-iframe" class="sectionsIframe" style="width: 100%;height: 100%;" src="'+ gx_sections_link + '"></iframe>');
                                                        onIframeLoad();
                                                    });
                                                    $('body .ddp-tab-module a.gx_close').on('click', function(e) {
                                                        e.preventDefault();
                                                        $('div.sectionSaved').html('<h3 class="gx_loading_text">Loading...</h3>');
                                                        $('.ddp-tab-module').html('<iframe id="gx-library-iframe" name="gx-library-iframe" class="sectionsIframe" style="width: 100%;height: 100%;" src="'+ gx_modules_link +'"></iframe>');
                                                        onIframeLoad();
                                                    });
                                                }
                                                $('body .ddp-assistant .loaded_message').show();
                                                setTimeout(function() {
                                                    $('body .ddp-assistant .loaded_message').hide();
                                                }, 5500);
                                            },
                                            error: function(data) {
                                                console.log(data);
                                            }
                                        });

                                    } // if(response.context == 'et_builder_layouts')
                                } //  if (response)
                            } // if (~e.data.indexOf('context'))
                            else if (~e.data.indexOf('.')) { // if the response is a css file
                                console.log('CSS');
                                $('input#_et_pb_custom_css').val(e.data);
                            } else if (~e.data.indexOf(',jpg') || ~e.data.indexOf(',png')) { //a featured image link
                                console.log('IMAGE');
                                gx_featured_image_url = e.data.replace(/\,/g, '.')
                                setTimeout(function() {
                                    jQuery.ajax({
                                        type: 'POST',
                                        url: ajaxurl,
                                        // processData: false,
                                        data: 'action=gx_import_featured_image&gx_featured_image=' + gx_featured_image_url,
                                        success: function(data) {},
                                        error: function(data) {}
                                    });
                                }, 1000); //setTimeout(function(){
                            }

                        } //if jQuery.type(e.data) === 'string'
                    } //if (e.origin === 'https://ondemand.divi-den.com') {
                }, false); // eventer(messageEvent, function(e) {


            }); //  $('iframe#gx-library-iframe').on('load', function()

        }, 200);
    }
    //function onIframeLoad()

    if (typeof ajaxurl === 'undefined') { ajaxurl = gx_wl_options_for_js.gx_ajax_url; }


    // isert Divi Den Pro Tabs to Divi builder
    jQuery.ajax({
        type: 'GET',
        url: ajaxurl,
        data: 'action=gx_get_option',
        success: function(data) {
            var gx_enable = data + '';
            if (gx_enable === 'disabled') { // check if the DDD is enabled in settings

                concole.log("gx_enable === 'disabled'");

                onIframeLoad(); // our main function

                // Insert layout from library
                $(document).on('mouseup', '.et-pb-layout-buttons-load', function() {
                    setTimeout(function() {

                        var gx_rand = Math.floor((Math.random() * 1000000) + 1);
                        if (gx_wl_options_for_js.gx_status === 'enabled') {
                            gx_layouts_link = 'https://ondemand.divi-den.com/new-api-layouts-search-ghaser65/?uid=' + gx_rand;
                        } else {
                            gx_layouts_link = 'https://ondemand.divi-den.com/new-no-api-layouts-search-dngfh4q2/?uid=' + gx_rand;
                        }

                        var tabbar = $('.et-pb-saved-modules-switcher');
                        if (gx_wl_options_for_js.gx_plugin_setting_tab_position === 'on') {
                            if (tabbar.length) {
                                tabbar.append('<li class="ddp" data-open_tab="ddp-tab" data-layout_type="layout"><a href="#"><img height="25" src="' + gx_wl_options_for_js.gx_wl_i_for_js + '" /> <span>' + gx_wl_options_for_js.gx_wl_pn_for_js + '</span></a></li>');
                                $(".et_pb_modal_settings").append('<div class="et-pb-main-settings et-pb-main-settings-full ddp-tab ddp-tab-layout">\
                                <div class="et-dlib-load-options ddp-replace-content et-fb-checkboxes-category-wrap"><p>\
                                Important: if you\'re replacing the content, please manually clear the layout and update the page, then load the new layout.</p></div>\
                                <iframe id="gx-library-iframe" name="gx-library-iframe" class="layoutsIframe" src="' + gx_layouts_link + '"></iframe></div>');
                            }
                        } else {
                            $('li.et-pb-options-tabs-links-active').removeClass('et-pb-options-tabs-links-active');
                            $('div.active-container').removeClass('active-container').css('opacity', 0);
                            tabbar.prepend('<li class="ddp et-pb-options-tabs-links-active" data-open_tab="ddp-tab" data-layout_type="layout"><a href="#"><img height="25" src="' + gx_wl_options_for_js.gx_wl_i_for_js + '" /> <span>' + gx_wl_options_for_js.gx_wl_pn_for_js + '</span></a></li>');
                            $(".et_pb_modal_settings").append('<div class="et-pb-main-settings et-pb-main-settings-full ddp-tab ddp-tab-layout active-container" style="opacity: 1;">\
                                <div class="et-dlib-load-options ddp-replace-content et-fb-checkboxes-category-wrap"><p>\
                                Important: if you\'re replacing the content, please manually clear the layout and update the page, then load the new layout.</p></div>\
                                <iframe id="gx-library-iframe" name="gx-library-iframe" class="layoutsIframe" src="' + gx_layouts_link + '"></iframe></div>');
                        }
                    }, 200);

                    onIframeLoad();

                });

                //Insert section from library
                $(document).on('mouseup', '.et-pb-section-add-saved', function() {
                    setTimeout(function() {

                        jQuery('.et_pb_modal_settings.et_pb_modal_no_tabs').removeClass('et_pb_modal_no_tabs');

                        var gx_rand = Math.floor((Math.random() * 1000000) + 1);
                        if (gx_wl_options_for_js.gx_status === 'enabled') {
                            gx_sections_link = 'https://ondemand.divi-den.com/sections-search-api-ljljdfre935/?uid=' + gx_rand;
                        } else gx_sections_link = 'https://ondemand.divi-den.com/sections-search-no-api-asdfv324/?uid=' + gx_rand;

                        if (gx_wl_options_for_js.gx_plugin_setting_tab_position === 'on') {
                            jQuery('.et_pb_modal_settings_container h3').after(' \
                        <ul class="et-pb-options-tabs-links et-pb-saved-modules-switcher">  \
                            <li class="et-pb-saved-module et-pb-options-tabs-links-active"" data-open_tab="et-pb-saved-modules-tab" > \
                                <a href="#">Add From Library</a>    \
                            </li>   \
                            <li class="ddp" data-open_tab="ddp-tab" data-layout_type="section"><a href="#">\
                        <img height="25" src="' + gx_wl_options_for_js.gx_wl_i_for_js + '" /> <span>' + gx_wl_options_for_js.gx_wl_pn_for_js + '</span></a></li> \
                        </ul>   \
                        <div class="et-pb-main-settings et-pb-main-settings-full ddp-tab ddp-tab-section" \
                        style="display:block !important;" ><iframe id="gx-library-iframe" name="gx-library-iframe" class="sectionsIframe" \
                        src="' + gx_sections_link + '"></iframe></div>');

                        } // if gx_wl_options_for_js.gx_plugin_setting_tab_position
                        else {
                            $('li.et-pb-options-tabs-links-active').removeClass('et-pb-options-tabs-links-active');
                            $('div.active-container').removeClass('active-container').css('opacity', 0);
                            jQuery('.et_pb_modal_settings_container h3').after(' \
                        <ul class="et-pb-options-tabs-links et-pb-saved-modules-switcher">  \
                            <li class="ddp et-pb-options-tabs-links-active" data-open_tab="ddp-tab" data-layout_type="section" style="opacity: 1;"><a href="#">\
                        <img height="25" src="' + gx_wl_options_for_js.gx_wl_i_for_js + '" /> <span>' + gx_wl_options_for_js.gx_wl_pn_for_js + '</span></a></li> \
                        <li class="et-pb-saved-module" data-open_tab="et-pb-saved-modules-tab" > \
                                <a href="#">Add From Library</a>    \
                            </li>   \
                        </ul>   \
                        <div class="et-pb-main-settings et-pb-main-settings-full ddp-tab ddp-tab-section active-container" \
                        style="display:block !important; opacity: 1 !important;" ><iframe id="gx-library-iframe" name="gx-library-iframe" class="sectionsIframe" \
                        src="' + gx_sections_link + '"></iframe></div>');

                        }

                    }, 200);

                    onIframeLoad();
                });


                //Insert modules from library
                $(document).on('mouseup', '.et-pb-column .et-pb-insert-module', function() {
                    setTimeout(function() {

                        jQuery('.et_pb_modal_settings.et_pb_modal_no_tabs').removeClass('et_pb_modal_no_tabs');

                        var gx_rand = Math.floor((Math.random() * 1000000) + 1);
                        if (gx_wl_options_for_js.gx_status === 'enabled') {
                            gx_modules_link = 'https://ondemand.divi-den.com/modules-search-api-fdge43y/?uid=' + gx_rand;
                        } else gx_modules_link = 'https://ondemand.divi-den.com/modules-search-no-api-33jwer3/?uid=' + gx_rand;

                        // $('li.et-pb-options-tabs-links-active').removeClass('et-pb-options-tabs-links-active');
                        // $('div.active-container').removeClass('active-container').css('opacity', 0);

                        $('.et-pb-options-tabs-links.et-pb-saved-modules-switcher').remove();
                        if (gx_wl_options_for_js.gx_plugin_setting_tab_position === 'on') {
                            jQuery('.et_pb_modal_settings_container h3').after(' \
                    <ul class="et-pb-options-tabs-links et-pb-saved-modules-switcher">  \
                        <li class="et-pb-new-module et-pb-options-tabs-links-active data-open_tab="et-pb-all-modules-tab">\
                            <a href="#">New Module</a>\
                        </li>\
                        <li class="et-pb-saved-module" data-open_tab="et-pb-saved-modules-tab" > \
                            <a href="#">Add From Library</a>    \
                        </li>   \
                        <li class="ddp" data-open_tab="ddp-tab" data-layout_type="section"><a href="#">\
                    <img height="25" src="' + gx_wl_options_for_js.gx_wl_i_for_js + '" /> <span>' + gx_wl_options_for_js.gx_wl_pn_for_js + '</span></a></li> \
                    </ul>   \
                    <div class="et-pb-main-settings et-pb-main-settings-full ddp-tab ddp-tab-module" \
                    style="display:block !important;" ><iframe id="gx-library-iframe" name="gx-library-iframe" class="sectionsIframe" \
                    src="'+gx_modules_link+'"></iframe></div> \
                ');
                        } else {
                            //  $('.et-pb-options-tabs-links.et-pb-saved-modules-switcher').remove();
                            $('li.et-pb-options-tabs-links-active').removeClass('et-pb-options-tabs-links-active');
                            $('div.active-container').removeClass('active-container').css('opacity', 0);
                            jQuery('.et_pb_modal_settings_container h3').after(' \
                    <ul class="et-pb-options-tabs-links et-pb-saved-modules-switcher">  \
                    <li class="ddp et-pb-options-tabs-links-active" data-open_tab="ddp-tab" data-layout_type="section"><a href="#">\
                    <img height="25" src="' + gx_wl_options_for_js.gx_wl_i_for_js + '" /> <span>' + gx_wl_options_for_js.gx_wl_pn_for_js + '</span></a></li> \
                        <li class="et-pb-new-module data-open_tab="et-pb-all-modules-tab">\
                            <a href="#">New Module</a>\
                        </li>\
                        <li class="et-pb-saved-module" data-open_tab="et-pb-saved-modules-tab" > \
                            <a href="#">Add From Library</a>    \
                        </li>   \
                        </ul>   \
                    <div class="et-pb-main-settings et-pb-main-settings-full ddp-tab ddp-tab-module active-container"  \
                    style="display:block !important; opacity: 1 !important;" ><iframe id="gx-library-iframe" name="gx-library-iframe" class="sectionsIframe" \
                    src="'+gx_modules_link+'"></iframe></div> \
                ');
                        }

                    }, 200);

                    onIframeLoad();
                });


            } else onIframeLoad(); //if (gx_enable == 'enabled')
        },
        error: function(data) {}
    });

    setInterval(function() {
        if ($('iframe#gx-library-iframe').length) {
           // console.log('gx-library-iframe');
            onIframeLoad();
        }
    }, 1000);

    // Save settings button

    $('.gx_settings.save_settings input#submit').on('click', function(e) {
        e.preventDefault();

        $(".ddp-archive-settings .et-epanel-box select").each(function() {
            var this_option = $(this).attr('id');
            var this_val = $(this).val();
            //console.log(this_option + "    " + this_val);
            jQuery.ajax({
                type: 'POST',
                url: ajaxurl,
                data: 'action=gx_update_option&gx_option=' + this_option + '&gx_option_val=' + this_val,
                success: function(data) {
                    window.location.reload();
                },
                error: function(data) {}
            });

        });
    });

    // Enable / Disable ddp button
    $('.ddp-assistant .et-box-content').on('click', '.et_pb_yes_no_button', function(e) {
        e.preventDefault();
        var $click_area = $(this),
            $box_content = $click_area.parents('.et-box-content'),
            $checkbox = $box_content.find('input[type="checkbox"]'),
            $state = $box_content.find('.et_pb_yes_no_button');

        $gx_option = $box_content.find('input').attr('name');

        $state.toggleClass('et_pb_on_state et_pb_off_state');

        if ($checkbox.is(':checked')) {
            $checkbox.prop('checked', false);
        } else {
            $checkbox.prop('checked', true);
        }

        if ($click_area.hasClass('et_pb_on_state')) {
            ajax_value = 'enabled';
            if ($click_area.hasClass('gx_enable')) {
                var gx_rand = Math.floor((Math.random() * 1000000) + 1);
                if (gx_wl_options_for_js.gx_status === 'enabled') {
                    gx_layouts_link = 'https://ondemand.divi-den.com/new-api-layouts-search-ghaser65/?uid=' + gx_rand;
                } else {
                    gx_layouts_link = 'https://ondemand.divi-den.com/new-no-api-layouts-search-dngfh4q2/?uid=' + gx_rand;
                }
                $('<iframe id="gx-library-iframe" name="gx-library-iframe" src="' + gx_layouts_link  + '"></iframe>').insertAfter('.ddp-assistant hr');
                console.log('$click_area.hasClass');
                onIframeLoad();
            }
        } else {
            ajax_value = 'disabled';
            //if ($click_area.hasClass('gx_enable')) { $('.ddp-assistant iframe#gx-library-iframe').remove(); }

        }

        if (ddd_full_stop === 0) {

            // update ddp enable / disable option
            jQuery.ajax({
                type: 'POST',
                url: ajaxurl,
                data: 'action=gx_update_option&gx_option=' + $gx_option + '&gx_option_val=' + ajax_value,
                success: function(data) {},
                error: function(data) {}
            });
        }

    });

    $('.ddp-accordion .ddp-accordion-header').click(function() {
        //Expand or collapse this panel
        $(this).next('.ddp-accordion-content').slideToggle('fast');
        $(this).parent('.ddp-accordion').toggleClass('closed').toggleClass('opened');

        $('.ddp-accordion.opened h3 span').html('-');
        $('.ddp-accordion.closed h3 span').html('+');

        //Hide the other panels
        //  $(".ddp-accordion-content").not($(this).next('.ddp-accordion-content')).slideUp('fast');

    });

    setTimeout(function() {
        if ($('.ddp-assistant.activated h2.nav-tab-wrapper').length > 0) {
            $('div[data-dismissible=disable-ddpro-cache-notice-forever]').insertAfter('.ddp-assistant.activated h2.nav-tab-wrapper');
            $('div[data-dismissible=disable-ddpro-cache-notice-forever]').show();
        }
    }, 300);

    setInterval(function() {
        if ($('iframe#gx-library-iframe').length > 0) {
            $('div[data-dismissible=disable-ddpro-cache-notice-forever]:not(.shown)').insertBefore('iframe#gx-library-iframe');
            $('div[data-dismissible=disable-ddpro-cache-notice-forever]:not(.shown)').show();
            $('div[data-dismissible=disable-ddpro-cache-notice-forever]').addClass('shown');
        }
    }, 100);


    // PLUGIN SETTING

    // tap position


    if ($("input#gx_plugin_setting_tab_position").length > 0) {

        jQuery.ajax({
            type: 'GET',
            url: ajaxurl,
            data: 'action=gx_get_option_gx_plugin_setting_tab_position',
            success: function(data) {
                // console.log(data);
                if ((data) === 'on') $("input#gx_plugin_setting_tab_position").attr('checked', 'checked');
                else $("input#gx_plugin_setting_tab_position").removeAttr('checked');

            },
            error: function(data) {}
        });


        $("input#gx_plugin_setting_tab_position").on('change', function() {
            var this_option = $(this).attr('id');

            if ($(this).attr('checked') === 'checked') $(this).val('on');
            else $(this).val('off');

            var this_val = $(this).val();
            jQuery.ajax({
                type: 'POST',
                url: ajaxurl,
                data: 'action=gx_update_option&gx_option=' + this_option + '&gx_option_val=' + this_val,
                success: function(data) {
                    //console.log(this_option + ": " + this_val);
                },
                error: function(data) {}
            });

        }); // $("input#ddp-setting-tab-position").on
    } //if( $("input#gx_plugin_setting_tap_position").length > 0)

}); //jQuery(document).ready(function($)