// if (typeof ajaxurl === 'undefined') {
// 	ajaxurl = gx_wl_options_for_js.gx_ajax_url;
// }

// jQuery(document).ready(function ($) {
// 	//console.log('START');
// 	function isEmpty(obj) {
// 		for (var key in obj) {
// 			if (obj.hasOwnProperty(key))
// 				return false;
// 		}
// 		return true;
// 	}
// 	let rb_to_send_final = '';
// 	// for older browsers
// 	if (!Array.prototype.filter) {
// 		Array.prototype.filter = function (fun /*, thisp*/) {
// 			"use strict";

// 			if (this == null)
// 				throw new TypeError();

// 			var t = Object(this);
// 			var len = t.length >>> 0;
// 			if (typeof fun != "function")
// 				throw new TypeError();

// 			var res = [];
// 			var thisp = arguments[1];
// 			for (var i = 0; i < len; i++) {
// 				if (i in t) {
// 					var val = t[i]; // in case fun mutates this
// 					if (fun.call(thisp, val, i, t))
// 						res.push(val);
// 				}
// 			}

// 			return res;
// 		};
// 	}

// 	wp.data.subscribe(function () {
// 		var isSavingPost = wp.data.select('core/editor').isSavingPost();
// 		var isAutosavingPost = wp.data.select('core/editor').isAutosavingPost();

// 		if (!isSavingPost && !isAutosavingPost) {

// 			let rb_to_send = '';
// 			let maxi_reusable_blocks = wp.data.select('core').getEntityRecords('postType', 'wp_block');
// 			if (!isEmpty(maxi_reusable_blocks)) {
// 				//console.log('maxi_reusable_blocks: '+maxi_reusable_blocks);
// 				for (let [key, value] of Object.entries(maxi_reusable_blocks)) {
// 					if (!isEmpty(value) && ~value.title.raw.indexOf(' ')) {
// 						let rb_id = value.title.raw.split(' ').pop().trim();
// 						if (~rb_id.indexOf('-')) {
// 							// console.log(rb_id);
// 							rb_to_send = rb_to_send + ' ' + rb_id;
// 						}
// 					}
// 				}
// 				//console.log('rb_to_send BEFORE '+rb_to_send);
// 				rb_to_send = rb_to_send.split(' ').filter(function (item, i, allItems) {
// 					return i == allItems.indexOf(item);
// 				}).join(' ');
// 				// console.log('rb_to_send AFTER '+rb_to_send);
// 			}
// 			rb_to_send_final = rb_to_send;
// 		}
// 	});
// 	// main function

// 	function onIframeLoad() {
// 		//console.log('onIframeLoad()');
// 		let frame = document.getElementById('maxi-block-library__modal-iframe');
// 		let full_stop = 0;
// 		if (typeof (frame) != 'undefined' && frame !== null) {

// 			//console.log('iframe loaded !!!');

// 			jQuery.ajax({
// 				type: 'GET',
// 				url: ajaxurl,
// 				data: 'action=gx_get_option',
// 				success: function (data) {
// 					// console.log('success data:');
// 					// console.log(data);
// 					let gx_sp_enable = $.trim(data + '');
// 					if (gx_sp_enable === 'enabled' && typeof (frame) != 'undefined' && frame !== null) {
// 						frame.contentWindow.postMessage('pro_membership_activated', '*');
// 					} else if (gx_sp_enable !== 'enabled' && typeof (frame) != 'undefined' && frame !== null) {
// 						frame.contentWindow.postMessage('pro_membership_dectivated', '*');
// 					}

// 					//  console.log('rb_to_send final '+rb_to_send_final);

// 					if (rb_to_send_final !== '') frame.contentWindow.postMessage('imported:' + rb_to_send_final, '*');
// 				}
// 			});

// 			//  frame.contentWindow.postMessage(, '*');
// 			// function to get post id from the url parameter 'post'
// 			function getUrlVars() {
// 				let lets = [],
// 					hash;
// 				let hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
// 				for (let i = 0; i < hashes.length; i++) {
// 					hash = hashes[i].split('=');
// 					lets.push(hash[0]);
// 					lets[hash[0]] = hash[1];
// 				}
// 				return lets;
// 			}

// 			let post_id = getUrlVars()["post"];

// 			// Create IE + others compatible event handler
// 			let eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
// 			let eventer = window[eventMethod];
// 			let messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

// 			let global_json_counter = 0;
// 			let json_counter = 0;

// 			// Listen to message from child window
// 			eventer(messageEvent, function (e) {

// 				//console.log('e.origin: '+e.origin);
// 				if (e.origin === 'https://ge-library.dev700.com') { //'https://ge-library.dev700.com
// 					let response;
// 					// console.log('jQuery.type(e.data) '+jQuery.type(e.data) );
// 					// console.log('RESPONSE '+e.data);
// 					if (jQuery.type(e.data) === 'object') { // check if the response is text
// 						//console.log('e.data: ' + JSON.stringify(e.data));
// 						let action_type = e.data.action;
// 						if (action_type === 'import') {
// 							jQuery('.maxi-block-library__modal__loading_message p').text('Saving...');
// 							//jQuery('.maxi-block-library__modal__loading_message').removeClass('maxi-block__item--hidden');
// 						}
// 						if (action_type === 'insert') {
// 							jQuery('.maxi-block-library__modal__loading_message p').text('Inserting...');
// 						}
// 						jQuery('.maxi-block-library__modal__loading_message').removeClass('maxi-block__item--hidden');
// 						if (~e.data.json.indexOf('wp_block') && full_stop !== 1) { // if the response is a gutenberg json file
// 							// console.log("e.data: " + e.data);
// 							full_stop = 1;
// 							response = JSON.parse(e.data.json);
// 							//console.log('response '+response);
// 							if (response) {
// 								// if (ddd_full_stop === 0) {
// 								response = jQuery.parseJSON(response);
// 								// console.log('response.content ' + response.content);
// 								let json = response.content;
// 								let full_results, full_results2;
// 								let results = [];
// 								let i = 0;
// 								const regex_image = /(?=https)(.*?)(.(gif|png|jpe?g))/gim;
// 								const regex_id = /(\"id\":(.*),')/gim;

// 								while ((full_results = regex_image.exec(json)) !== null) {
// 									// This is necessary to avoid infinite loops with zero-width matches
// 									if (full_results.index === regex_image.lastIndex) {
// 										regex_image.lastIndex++;
// 									}

// 									// The result can be accessed through the `m`-variable.
// 									full_results.forEach((match, groupIndex) => {
// 										if (groupIndex === 0) {
// 											results[i] = match;
// 											//console.log(`Found match, group ${groupIndex}: ${match}`);
// 											i++;
// 										}
// 									});
// 								}
// 								// console.log('results: ');
// 								// console.log(results);

// 								let results_uniq = results.slice() // slice makes copy of array before sorting it
// 									.sort(function (a, b) {
// 										return a > b;
// 									})
// 									.reduce(function (a, b) {
// 										if (a.slice(-1)[0] !== b) a.push(b); // slice(-1)[0] means last item in array without removing it (like .pop())
// 										return a;
// 									}, []);

// 								// console.log('results u: ');
// 								// console.log(results_uniq);

// 								// let external_url = results[1]['url'];

// 								let current_post_id = wp.data.select("core/editor").getCurrentPostId();

// 								let results_uniq_json = JSON.stringify(results_uniq);

// 								//console.log('external url '+external_url);
// 								//  console.log('results_uniq_json ' + results_uniq_json);

// 								const {
// 									getBlock,
// 									canUserUseUnfilteredHTML
// 								} = wp.data.select('core/editor');

// 								const clientId = wp.data.select('core/block-editor').getSelectedBlock().clientId;


// 								jQuery.ajax({
// 									type: 'POST',
// 									url: ajaxurl,
// 									data: {
// 										'action': 'maxi_import_images',
// 										'maxi_post_id': current_post_id,
// 										'maxi_images_to_upload': results_uniq_json,
// 									},
// 									success: function (data) {
// 										//console.log('AJAX ok');
// 										// console.log(data);
// 										let data_array = data.split(',');
// 										// console.log(data_array);
// 										let final_json_content = response.content;

// 										data_array.forEach(function (item, index) {
// 											if (item !== '') {
// 												data_links_pair = item.split('|');
// 												//  console.log('after '+data_array[index], index);
// 												// console.log('0: '+data_links_pair[0]);
// 												// console.log('1: ' + data_links_pair[1]);
// 												var reg = new RegExp(data_links_pair[0], 'g');
// 												final_json_content = final_json_content.replace(reg, data_links_pair[1]);
// 												//console.log('REG' + reg);
// 											}
// 										});

// 										// var reg = new RegExp(external_url, 'g');
// 										// final_json_content = final_json_content.replace(reg, data);
// 										// console.log('final JSON content: ' + final_json_content);

// 										if (action_type === 'insert') {
// 											//console.log('INSERTING BLOCKS');
// 											jQuery('.maxi-block-library__modal__loading_message p').text('Done!');
// 											wp.data.dispatch('core/block-editor').replaceBlocks(
// 												clientId,
// 												wp.blocks.rawHandler({
// 													HTML: final_json_content,
// 													mode: 'BLOCKS',
// 													canUserUseUnfilteredHTML,
// 												}),
// 											);
// 										} else if (action_type === 'import') {
// 											let new_reusable_block_title = response.title;
// 											//console.log('title: '+new_reusable_block_title);
// 											//console.log('Import to the library!');
// 											jQuery.ajax({
// 												type: 'POST',
// 												url: ajaxurl,
// 												data: {
// 													'action': 'maxi_import_reusable_blocks',
// 													'maxi_reusable_block_title': new_reusable_block_title,
// 													'maxi_reusable_block_content': final_json_content,
// 												},
// 												success: function (data) {
// 													// console.log(data);
// 													//console.log('Imported');
// 													jQuery('.maxi-block-library__modal__loading_message p').text('Saved to Re-usable Blocks Library');
// 													setTimeout(function () {
// 														jQuery('.maxi-block-library__modal__loading_message').addClass('maxi-block__item--hidden');
// 													}, 3000);
// 												},
// 												error: function (data) {
// 													//console.log('Re-usable import error');
// 													//console.log(data);
// 												}
// 											}); //jQuery.ajax({
// 										} // else if(action_type === 'import')
// 										else {
// 											//console.log('Error: no action to do');
// 										}

// 									},
// 									error: function (data) {
// 										//console.log('AJAX error');
// 										//console.log(data);
// 									}
// 								}); // ajax
// 								//}
// 							} //  if (response)
// 						} // if (~e.data.indexOf('wp_block'))
// 						else if (~e.data.json.indexOf('svg')) { // svg icon
// 							//console.log('INSERTING SVG');
// 							const clientId = wp.data.select('core/block-editor').getSelectedBlock().clientId;
// 							let final_svg_content = JSON.parse(e.data.json);
// 							jQuery('.maxi-block-library__modal__loading_message p').text('Done!');
// 							//console.log(final_svg_content);
// 							//console.log('before insert');
// 							const insertedBlock = wp.blocks.createBlock('maxi-blocks/svg-icon-maxi', {
// 								content: final_svg_content
// 							});
// 							wp.data.dispatch('core/block-editor').replaceBlocks(
// 								clientId,
// 								insertedBlock
// 							);
// 							//console.log('after insert');

// 						} else { // FA icon
// 							const iconAtrribute = frame.getAttribute("icon");
// 							//console.log(frame);
// 							//console.log(iconAtrribute);
// 							//console.log('FA icon!');
// 							//console.log(e.data);
// 						/*	const {
// 								canUserUseUnfilteredHTML
// 							} = wp.data.select('core/editor');
// 							const clientId = wp.data.select('core/block-editor').getSelectedBlock().clientId;
// 							console.log('e.data.fatype ' + e.data.fatype);
// 							final_fa_content = '<i class="maxi-fa-icon ' + e.data.fatype + ' ' + e.data.json + '"></i>';
// 							final_fa_block = '<!-- wp:maxi-blocks/icon-maxi -->' + final_fa_content + '<!-- /wp:maxi-blocks/icon-maxi -->';
// 							console.log('e.data.fatype ' + e.data.fatype);
// 							wp.data.dispatch('core/block-editor').replaceBlocks(
// 								clientId,
// 								wp.blocks.rawHandler({
// 									HTML: final_fa_block,
// 									mode: 'BLOCKS',
// 									canUserUseUnfilteredHTML,
// 								}),
// 							);*/
// 						}
// 					} //if jQuery.type(e.data) === 'string'
// 				} //if (e.origin === 'https://ondemand.divi-den.com') {
// 			}, false); // eventer(messageEvent, function(e) {
// 			//  ddd_full_stop = 0;

// 			$('.maxi-cloud-modal .components-button.components-icon-button').on('click', function () {
// 				//console.log('close');
// 				$('.components-modal__screen-overlay').remove();
// 			});

// 		} // if frame
// 	} //function onIframeLoad()
// 	//}); //  $('iframe#maxi-block-library__modal-iframe').on('load', function()

// 	$(document).on('click', '.components-button.maxi-block-library__modal-button', function () {
// 		//console.log('button clicked');
// 		var timer = setInterval(function () {
// 			iframe = document.getElementById('maxi-block-library__modal-iframe');
// 			// this function will called when the iframe loaded
// 			iframe.onload = function () {
// 				//console.log('iframe loaded successfully');
// 				onIframeLoad();
// 				clearInterval(timer);
// 			};
// 		}, 300);
// 	});

// }); //jQuery(document).ready(function($)
