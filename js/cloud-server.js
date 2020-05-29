let ddd_full_stop = 0;

let json_counters_array = [];

//console.log('layout-modal loaded');

if (typeof ajaxurl === 'undefined') { ajaxurl = gx_wl_options_for_js.gx_ajax_url; }


jQuery(document).ready(function($) {
    // main function
    function onIframeLoad() {
        //console.log('onIframeLoad');
        setTimeout(function() {
            //console.log('full stop '+ddd_full_stop);
            $('iframe#maxi-block-library__modal-iframe').on('load', function() {
                console.log('iframe loaded');

                let frame = document.getElementById('maxi-block-library__modal-iframe');

                jQuery.ajax({
                    type: 'GET',
                    url: ajaxurl,
                    data: 'action=gx_get_option',
                    success: function(data) {
                        console.log('success data:');
                        console.log(data);
                        let gx_sp_enable = $.trim(data + '');
                        if (gx_sp_enable === 'enabled') { frame.contentWindow.postMessage('pro_membership_activated', '*'); } else { frame.contentWindow.postMessage('pro_membership_dectivated', '*'); }
                    }
                });
                // function to get post id from the url parameter 'post'
                function getUrlVars() {
                    let lets = [],
                        hash;
                    let hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
                    for (let i = 0; i < hashes.length; i++) {
                        hash = hashes[i].split('=');
                        lets.push(hash[0]);
                        lets[hash[0]] = hash[1];
                    }
                    return lets;
                }

                let post_id = getUrlVars()["post"];

                // Create IE + others compatible event handler
                let eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
                let eventer = window[eventMethod];
                let messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";


                let global_json_counter = 0;
                let json_counter = 0;

                // Listen to message from child window
                eventer(messageEvent, function(e) {

                    if (e.origin === 'https://ge-library.dev700.com') {
                        let response;
                      //  console.log('response: '+response);
                        if (jQuery.type(e.data) === 'string') { // check if the response is text

                            if (~e.data.indexOf('type') || ~e.data.indexOf('wp_block')) { // if the response is a gutenberg json file
                               // console.log("e.data: " + e.data);
                                response = JSON.parse(e.data);
                              //  console.log('response '+response);
                                if (response) {
                                    if (ddd_full_stop === 0) {
                                        console.log('LOADING BLOCKS');
                                   // let layout = JSON.stringify(response);
                                       // console.log('layout');
                                       // console.log(layout);
                                   response = jQuery.parseJSON(response);
                                     // console.log(typeof(response));
                                      //  let el = wp.element.createElement;
                                       //console.log('response.title ' + response.title);
                                        // console.log('response.type ' + response.type);
                                        // console.log('response.category ' + response.category);
                                       console.log('response.content ' + response.content);

                                     //  console.log('current_post_id ' + current_post_id);

                                        let json = response.content;
                                        let links = {};
                                        links[1] = {};

                                        let first_image_id = json.match(new RegExp('wp:image {"id":' + '(.*)' + ','))[1];

                                        let first_image_url = json.match(new RegExp('img src="' + '(.*)' + '" alt'))[1];

                                        console.log(first_image_id);

                                        console.log(first_image_url);

                                        links[1]['id'] = first_image_id;
                                        links[1]['url'] = first_image_url;

                                        console.log(links);

                                        let external_url = links[1]['url'];

                                        let current_post_id = wp.data.select("core/editor").getCurrentPostId();

                                        //console.log('external url '+external_url);
                                       // console.log('current_post_id '+current_post_id);

                                       const {
                                           getBlock,
                                           canUserUseUnfilteredHTML
                                       } = wp.data.select( 'core/editor' );

                                       const clientId = wp.data.select( 'core/block-editor' ).getSelectedBlock().clientId;


                                        jQuery.ajax({
                                            type: 'POST',
                                            url: ajaxurl,
                                            // processData: false,
                                            data: { 'action': 'maxi_import_images',
                                                    'maxi_post_id': current_post_id,
                                                    'maxi_image_to_upload': external_url,
                                                    },
                                            success: function(data) {
                                                console.log('AJAX ok');
                                                let final_json_content = response.content;
                                                var reg = new RegExp(external_url, 'g');
                                                final_json_content = final_json_content.replace(reg, data);
                                                console.log('final JSON content: '+final_json_content);

                                                wp.data.dispatch('core/block-editor').replaceBlocks(
                                                    clientId,
                                                    wp.blocks.rawHandler( {
                                                        HTML: final_json_content,
                                                        mode: 'BLOCKS',
                                                        canUserUseUnfilteredHTML,
                                                    } ),
                                                ),


                                                ddd_full_stop = 1;
                                               // console.log(data);
                                            },
                                            error: function(data) {
                                                console.log('AJAX error');
                                                console.log(data);
                                            }
                                        });



                                        //console.log('name '+wp.data.select( 'core/block-editor' ).getSelectedBlock().name);
                                       //const block =  wp.data.select( 'core/block-editor' ).getSelectedBlock().name;
                                       // console.log('block '+block);


                                       //console.log('clientId '+clientId);




                                    }
                                } //  if (response)
                            } // if (~e.data.indexOf('context'))

                        } //if jQuery.type(e.data) === 'string'
                    } //if (e.origin === 'https://ondemand.divi-den.com') {
                }, false); // eventer(messageEvent, function(e) {
                    ddd_full_stop = 0;

            }); //  $('iframe#maxi-block-library__modal-iframe').on('load', function()

        $('.maxi-cloud-modal .components-button.components-icon-button').on('click', function(){
            console.log('close');
            $('.components-modal__screen-overlay').remove();
        });

        }, 200);
    }
    //function onIframeLoad()

    setInterval(function() {
        if ($('iframe#maxi-block-library__modal-iframe').length > 0) {
            console.log('maxi-block-library__modal-iframe layout modal');
           // console.log($('iframe#maxi-block-library__modal-iframe').parents());
            onIframeLoad();
        }
    }, 1000);

}); //jQuery(document).ready(function($)
