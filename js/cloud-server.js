//let ddd_full_stop = 0;

//console.log('layout-modal loaded');

if (typeof ajaxurl === 'undefined') { ajaxurl = gx_wl_options_for_js.gx_ajax_url; }


jQuery(document).ready(function($) {
    // main function

    console.log('START');
    $('.components-button.maxi-block-library__modal-button').live('click', function() {
      console.log('button clicked');
      setTimeout(function(){
          console.log('iframe loaded');
          onIframeLoad();
      }, 3000);
    });

    function onIframeLoad() {
      console.log('onIframeLoad');
      //console.log('full stop '+ddd_full_stop);
     // $('iframe#maxi-block-library__modal-iframe').on('load', function() {
        console.log('iframe loaded !!!');

        let frame = document.getElementById('maxi-block-library__modal-iframe');

        jQuery.ajax({
            type: 'GET',
            url: ajaxurl,
            data: 'action=gx_get_option',
            success: function(data) {
             // console.log('success data:');
             // console.log(data);
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
           //console.log('jQuery.type(e.data) '+jQuery.type(e.data) );
            if (jQuery.type(e.data) === 'object') { // check if the response is text
              //console.log('e.data: ' + JSON.stringify(e.data));
              let action_type = e.data.action;
              if (action_type === 'import') {
                jQuery('.maxi-block-library__modal__loading_message p').text('Saving...');
                //jQuery('.maxi-block-library__modal__loading_message').removeClass('maxi-block__item--hidden');
              }
              if (action_type === 'insert') {
                jQuery('.maxi-block-library__modal__loading_message p').text('Inserting...');
              }
              jQuery('.maxi-block-library__modal__loading_message').removeClass('maxi-block__item--hidden');
              if (~e.data.json.indexOf('wp_block')) { // if the response is a gutenberg json file
                    // console.log("e.data: " + e.data);

                    response = JSON.parse(e.data.json);
                    //console.log('response '+response);
                    if (response) {
                       // if (ddd_full_stop === 0) {
                            response = jQuery.parseJSON(response);
                           // console.log('response.content ' + response.content);
                            let json = response.content;
                            let full_results, full_results2;
                            let results = [];
                            let i = 0;
                            const regex_image = /(?=https)(.*?)(.(gif|png|jpe?g))/gim;
                            const regex_id = /(\"id\":(.*),')/gim;

                            while ((full_results = regex_image.exec(json)) !== null) {
                                // This is necessary to avoid infinite loops with zero-width matches
                                if (full_results.index === regex_image.lastIndex) {
                                    regex_image.lastIndex++;
                                }

                                // The result can be accessed through the `m`-variable.
                                full_results.forEach((match, groupIndex) => {
                                    if (groupIndex === 0) {
                                        results[i] = match;
                                        //console.log(`Found match, group ${groupIndex}: ${match}`);
                                        i++;
                                    }
                                });
                            }
                            // console.log('results: ');
                            // console.log(results);

                            let results_uniq = results.slice() // slice makes copy of array before sorting it
                                .sort(function(a, b) {
                                    return a > b;
                                })
                                .reduce(function(a, b) {
                                    if (a.slice(-1)[0] !== b) a.push(b); // slice(-1)[0] means last item in array without removing it (like .pop())
                                    return a;
                                }, []);

                            // console.log('results u: ');
                            // console.log(results_uniq);

                            // let external_url = results[1]['url'];

                            let current_post_id = wp.data.select("core/editor").getCurrentPostId();

                            let results_uniq_json = JSON.stringify(results_uniq);

                            //console.log('external url '+external_url);
                          //  console.log('results_uniq_json ' + results_uniq_json);

                            const {
                                getBlock,
                                canUserUseUnfilteredHTML
                            } = wp.data.select('core/editor');

                            const clientId = wp.data.select('core/block-editor').getSelectedBlock().clientId;


                            jQuery.ajax({
                                type: 'POST',
                                url: ajaxurl,
                                data: {
                                    'action': 'maxi_import_images',
                                    'maxi_post_id': current_post_id,
                                    'maxi_images_to_upload': results_uniq_json,
                                },
                                success: function(data) {
                                    console.log('AJAX ok');
                                    // console.log(data);
                                    let data_array = data.split(',');
                                   // console.log(data_array);
                                    let final_json_content = response.content;

                                    data_array.forEach(function(item, index) {
                                        if (item !== '') {
                                            data_links_pair = item.split('|');
                                            //  console.log('after '+data_array[index], index);
                                            // console.log('0: '+data_links_pair[0]);
                                            // console.log('1: ' + data_links_pair[1]);
                                            var reg = new RegExp(data_links_pair[0], 'g');
                                            final_json_content = final_json_content.replace(reg, data_links_pair[1]);
                                            //console.log('REG' + reg);
                                        }
                                    });

                                    // var reg = new RegExp(external_url, 'g');
                                    // final_json_content = final_json_content.replace(reg, data);
                                   // console.log('final JSON content: ' + final_json_content);

                                    if(action_type === 'insert') {
                                      console.log('INSERTING BLOCKS');
                                      jQuery('.maxi-block-library__modal__loading_message p').text('Done!');
                                      wp.data.dispatch('core/block-editor').replaceBlocks(
                                        clientId,
                                        wp.blocks.rawHandler({
                                            HTML: final_json_content,
                                            mode: 'BLOCKS',
                                            canUserUseUnfilteredHTML,
                                        }),
                                    );
                                    }
                                    else if(action_type === 'import') {
                                      let new_reusable_block_title = response.title;
                                      //console.log('title: '+new_reusable_block_title);
                                      console.log('Import to the library!');
                                      jQuery.ajax({
                                          type: 'POST',
                                          url: ajaxurl,
                                          data: {
                                              'action': 'maxi_import_reusable_blocks',
                                              'maxi_reusable_block_title': new_reusable_block_title,
                                              'maxi_reusable_block_content': final_json_content,
                                          },
                                          success: function(data) {
                                           // console.log(data);
                                            if(data === 'Block already exists') {
                                              console.log('Block already exists');
                                              jQuery('.maxi-block-library__modal__loading_message p').text('Already exists in Re-usable Blocks Library');
                                            }
                                            else {
                                              console.log('Imported');
                                              jQuery('.maxi-block-library__modal__loading_message p').text('Saved to Re-usable Blocks Library');
                                            }
                                            setTimeout(function(){ jQuery('.maxi-block-library__modal__loading_message').addClass('maxi-block__item--hidden'); }, 3000);
                                          },
                                          error: function(data) {
                                              console.log('Re-usable import error');
                                              console.log(data);
                                          }
                                      }); //jQuery.ajax({
                                    } // else if(action_type === 'import')
                                    else {
                                      console.log('Error: no action to do');
                                    }


                                      //  ddd_full_stop = 1;
                                    // console.log(data);
                                },
                                error: function(data) {
                                    console.log('AJAX error');
                                    console.log(data);
                                }
                            });
                        //}
                    } //  if (response)
                } // if (~e.data.indexOf('context'))

            } //if jQuery.type(e.data) === 'string'
        } //if (e.origin === 'https://ondemand.divi-den.com') {
    }, false); // eventer(messageEvent, function(e) {
  //  ddd_full_stop = 0;

    $('.maxi-cloud-modal .components-button.components-icon-button').on('click', function() {
        console.log('close');
        $('.components-modal__screen-overlay').remove();
    });

// }, 200);
} //function onIframeLoad()
//}); //  $('iframe#maxi-block-library__modal-iframe').on('load', function()

}); //jQuery(document).ready(function($)