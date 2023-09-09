import getClientId from './getClientId';

const modalMock = async (
	page,
	{ type, isBGLayers = false, forceResponse = null }
) => {
	const clientId = await getClientId();

	let response = forceResponse;

	if (forceResponse === null)
		switch (type) {
			case 'block-shape': {
				response = {
					shapeSVGElement:
						'<svg class="tick-13-maxi-svg" width="64px" height="64px" viewBox="0 0 36.1 36.1" data-fill fill="var(--maxi-light-color-4)"><path d="M8.2 15.9c-1.4-.3 2.8-3.2 5.2-2.8 1.4.2 3.6 2.7 4.6 5.1.8 2 1.3-5.3 10.7-13 3-2.5 4.7-2.7 4.7-2.3S31.9 4.6 30.7 6c-5.8 6.5-9.2 15-9.8 17.9-.7 3.7-3.6 3.8-4.4 2.2-2.7-5.3-5.6-9.6-8.3-10.2zm9.1 17.4a13.88 13.88 0 0 1-5.7-1.2C9.9 31.4 8.3 30.4 7 29c-1.3-1.3-2.4-2.9-3.1-4.7a13.88 13.88 0 0 1-1.2-5.7 13.88 13.88 0 0 1 1.2-5.7c.7-1.7 1.7-3.2 3.1-4.6C8.3 7 9.9 5.9 11.6 5.2c1.8-.8 3.8-1.2 5.7-1.2a14.22 14.22 0 0 1 3.6.5c.5.1.8.6.7 1.1-.1.4-.5.7-.9.7h-.2c-1-.3-2.1-.4-3.2-.4-7 0-12.8 5.7-12.8 12.8a12.76 12.76 0 0 0 12.8 12.8 12.76 12.76 0 0 0 12.8-12.8c0-1.5-.3-3-.8-4.4-.2-.5.1-1 .6-1.2s1 .1 1.2.6a14.26 14.26 0 0 1 .9 5 13.88 13.88 0 0 1-1.2 5.7c-.7 1.7-1.8 3.3-3.1 4.7-1.3 1.3-2.9 2.4-4.7 3.1s-3.7 1.1-5.7 1.1z"/></svg>',
					shapeSVGData: {
						'shape-maxi-4se8ef1z-u33434__441': {
							color: '',
						},
					},
				};
				break;
			}
			case 'sidebar-block-shape': {
				response = {
					shapeSVGElement:
						'<svg class="tick-13-maxi-svg" width="64px" height="64px" viewBox="0 0 36.1 36.1" data-fill fill="var(--maxi-light-color-4)"><path d="M8.2 15.9c-1.4-.3 2.8-3.2 5.2-2.8 1.4.2 3.6 2.7 4.6 5.1.8 2 1.3-5.3 10.7-13 3-2.5 4.7-2.7 4.7-2.3S31.9 4.6 30.7 6c-5.8 6.5-9.2 15-9.8 17.9-.7 3.7-3.6 3.8-4.4 2.2-2.7-5.3-5.6-9.6-8.3-10.2zm9.1 17.4a13.88 13.88 0 0 1-5.7-1.2C9.9 31.4 8.3 30.4 7 29c-1.3-1.3-2.4-2.9-3.1-4.7a13.88 13.88 0 0 1-1.2-5.7 13.88 13.88 0 0 1 1.2-5.7c.7-1.7 1.7-3.2 3.1-4.6C8.3 7 9.9 5.9 11.6 5.2c1.8-.8 3.8-1.2 5.7-1.2a14.22 14.22 0 0 1 3.6.5c.5.1.8.6.7 1.1-.1.4-.5.7-.9.7h-.2c-1-.3-2.1-.4-3.2-.4-7 0-12.8 5.7-12.8 12.8a12.76 12.76 0 0 0 12.8 12.8 12.76 12.76 0 0 0 12.8-12.8c0-1.5-.3-3-.8-4.4-.2-.5.1-1 .6-1.2s1 .1 1.2.6a14.26 14.26 0 0 1 .9 5 13.88 13.88 0 0 1-1.2 5.7c-.7 1.7-1.8 3.3-3.1 4.7-1.3 1.3-2.9 2.4-4.7 3.1s-3.7 1.1-5.7 1.1z"/></svg>',
					shapeSVGData: {
						'shape-maxi-4se8ef1z-u33434__455': {
							color: '',
						},
					},
				};
				break;
			}
			case 'bg-shape': {
				response = !isBGLayers
					? {
							'background-svg-SVGElement':
								'<svg viewBox="0 0 36.1 36.1" height="64px" width="64px" class="tick-12-maxi-svg" data-item="container-maxi-4se8ef1z-u748__svg"><path fill="" data-fill="" d="M32.4 16.4c.4-.6.7-1.4.6-2.3-.1-1.3-1-2.3-2.1-2.8.2-.8.1-1.6-.3-2.3-.6-1.2-1.7-1.8-2.9-1.9-.1-.8-.5-1.5-1.1-2.1-1-.9-2.3-1.1-3.4-.7-.4-.7-1-1.3-1.8-1.6-1.2-.5-2.5-.2-3.4.6-.6-.5-1.4-.8-2.2-.8-1.5 0-2.7.9-3.2 2.3-.9-.4-1.9-.5-2.8 0-1.2.5-1.9 1.6-2 2.8-.8.2-1.6.5-2.2 1.1-.9.9-1.2 2.2-.9 3.4-.7.3-1.3.9-1.6 1.7-.5 1.2-.3 2.5.4 3.5-.5.6-.9 1.3-.9 2.2-.1 1.3.6 2.4 1.6 3.1-.3.7-.4 1.6-.1 2.4.4 1.2 1.4 2.1 2.6 2.3 0 .8.2 1.6.8 2.2.8 1 2.1 1.4 3.3 1.2.3.7.8 1.4 1.5 1.8 1.1.6 2.5.6 3.5-.1.5.6 1.2 1 2.1 1.2 1.3.2 2.5-.3 3.2-1.3.7.4 1.5.5 2.3.3 1.3-.3 2.2-1.2 2.6-2.4.8.1 1.6-.1 2.3-.5 1.1-.7 1.6-1.9 1.5-3.1.8-.2 1.5-.6 2-1.3.8-1 .8-2.4.3-3.5.6-.4 1.1-1.1 1.4-1.9.2-1.4-.2-2.6-1.1-3.5zM25.7 14l-9.5 10.1-5.4-5.4 1.7-1.7 3.7 3.7 7.8-8.3 1.7 1.6z"></path></svg>',
							'background-svg-SVGMediaID': null,
							'background-svg-SVGMediaURL': null,
							'background-svg-SVGData': {
								'container-maxi-4se8ef1z-u748__188': {
									color: '',
									imageID: '',
									imageURL: '',
								},
							},
					  }
					: {
							'background-layers': [
								{
									type: 'shape',
									isHover: false,
									'display-general': 'block',
									'background-svg-palette-status-general': true,
									'background-svg-palette-color-general': 5,
									'background-svg-SVGElement':
										'<svg fill="undefined" data-fill="" viewBox="0 0 36.1 36.1" height="64px" width="64px" class="tick-13-maxi-svg" data-item="container-maxi-4se8ef1z-u748__svg"><path d="M8.2 15.9c-1.4-.3 2.8-3.2 5.2-2.8 1.4.2 3.6 2.7 4.6 5.1.8 2 1.3-5.3 10.7-13 3-2.5 4.7-2.7 4.7-2.3S31.9 4.6 30.7 6c-5.8 6.5-9.2 15-9.8 17.9-.7 3.7-3.6 3.8-4.4 2.2-2.7-5.3-5.6-9.6-8.3-10.2zm9.1 17.4a13.88 13.88 0 0 1-5.7-1.2C9.9 31.4 8.3 30.4 7 29c-1.3-1.3-2.4-2.9-3.1-4.7a13.88 13.88 0 0 1-1.2-5.7 13.88 13.88 0 0 1 1.2-5.7c.7-1.7 1.7-3.2 3.1-4.6C8.3 7 9.9 5.9 11.6 5.2c1.8-.8 3.8-1.2 5.7-1.2a14.22 14.22 0 0 1 3.6.5c.5.1.8.6.7 1.1-.1.4-.5.7-.9.7h-.2c-1-.3-2.1-.4-3.2-.4-7 0-12.8 5.7-12.8 12.8a12.76 12.76 0 0 0 12.8 12.8 12.76 12.76 0 0 0 12.8-12.8c0-1.5-.3-3-.8-4.4-.2-.5.1-1 .6-1.2s1 .1 1.2.6a14.26 14.26 0 0 1 .9 5 13.88 13.88 0 0 1-1.2 5.7c-.7 1.7-1.8 3.3-3.1 4.7-1.3 1.3-2.9 2.4-4.7 3.1s-3.7 1.1-5.7 1.1z" fill=""></path></svg>',
									'background-svg-SVGData': {
										'container-maxi-4se8ef1z-u748__226': {
											color: '',
											imageID: '',
											imageURL: '',
										},
									},
									'background-svg-top-unit-general': '%',
									'background-svg-position-sync-general':
										'all',
									'background-svg-position-top-unit-general':
										'px',
									'background-svg-position-right-unit-general':
										'px',
									'background-svg-position-bottom-unit-general':
										'px',
									'background-svg-position-left-unit-general':
										'px',
									'background-svg-size-general': 100,
									'background-svg-size-unit-general': '%',
									'background-svg-image-shape-scale-general': 100,
									order: 0,
									id: 0,
								},
							],
					  };
				break;
			}
			case 'image-shape': {
				response = {
					SVGElement:
						'<svg fill="undefined" data-fill="" viewBox="0 0 36.1 36.1" class="tick-13-maxi-svg" data-item="image-maxi-3se8ef1z-u97398__svg"><pattern id="image-maxi-3se8ef1z-u97398__427__img" class="maxi-svg-block__pattern" width="100%" height="100%" x="0" y="0" patternunits="userSpaceOnUse"><image class="maxi-svg-block__pattern__image" width="100%" height="100%" x="0" y="0" href="http://localhost:8888/wp-content/uploads/2021/08/IMG_9344-2-2.jpeg" preserveaspectratio="xMidYMid slice"></image></pattern><path d="M8.2 15.9c-1.4-.3 2.8-3.2 5.2-2.8 1.4.2 3.6 2.7 4.6 5.1.8 2 1.3-5.3 10.7-13 3-2.5 4.7-2.7 4.7-2.3S31.9 4.6 30.7 6c-5.8 6.5-9.2 15-9.8 17.9-.7 3.7-3.6 3.8-4.4 2.2-2.7-5.3-5.6-9.6-8.3-10.2zm9.1 17.4a13.88 13.88 0 0 1-5.7-1.2C9.9 31.4 8.3 30.4 7 29c-1.3-1.3-2.4-2.9-3.1-4.7a13.88 13.88 0 0 1-1.2-5.7 13.88 13.88 0 0 1 1.2-5.7c.7-1.7 1.7-3.2 3.1-4.6C8.3 7 9.9 5.9 11.6 5.2c1.8-.8 3.8-1.2 5.7-1.2a14.22 14.22 0 0 1 3.6.5c.5.1.8.6.7 1.1-.1.4-.5.7-.9.7h-.2c-1-.3-2.1-.4-3.2-.4-7 0-12.8 5.7-12.8 12.8a12.76 12.76 0 0 0 12.8 12.8 12.76 12.76 0 0 0 12.8-12.8c0-1.5-.3-3-.8-4.4-.2-.5.1-1 .6-1.2s1 .1 1.2.6a14.26 14.26 0 0 1 .9 5 13.88 13.88 0 0 1-1.2 5.7c-.7 1.7-1.8 3.3-3.1 4.7-1.3 1.3-2.9 2.4-4.7 3.1s-3.7 1.1-5.7 1.1z" fill="url(#image-maxi-3se8ef1z-u97398__427__img)" style="fill: url(#image-maxi-3se8ef1z-u97398__427__img)"></path></svg>',
					SVGData: {
						'image-maxi-3se8ef1z-u97398__427': {
							color: '',
							imageID: 6,
							imageURL:
								'http://localhost:8888/wp-content/uploads/2021/08/IMG_9344-2-2.jpeg',
						},
					},
				};
				break;
			}
			case 'button-icon': {
				response = {
					'icon-content':
						'<svg stroke-linejoin="round" stroke-width="2" stroke="var(--maxi-light-color-1)" data-stroke="" fill="none" viewBox="0 0 24 24" height="64px" width="64px" class="yoga-line-maxi-svg"><circle r="2.496" cy="5.403" cx="12"></circle><g stroke-miterlimit="10" stroke-linecap="round"><path d="M9.897 9.942c-.244.49-2.064 4.023-5.589 4.68m9.916-4.788c.244.49 1.943 4.132 5.469 4.788m-9.796-4.68c.329 6.484-5.487 7.183-5.487 9.329 0 .087-.006.973.648 1.441 1.708 1.222 6.079-.739 8.354-2.506"></path><path d="M14.224 9.834c-1.751 5.729 5.289 7.292 5.289 9.438 0 .087.006.973-.648 1.441-1.12.801-3.384.234-5.451-.749l-1.639-.89a10.97 10.97 0 0 1-1.264-.868m-.614-8.264s1.66 2.54 4.327-.109"></path></g></svg>',
				};
				break;
			}
			case 'svg': {
				response = {
					content:
						'<svg class="mini-van-3-maxi-svg__476" width="64px" height="64px" viewBox="0 0 64 64"><g data-stroke stroke="var(--maxi-light-icon-stroke, var(--maxi-light-color-7))" stroke-width="2" stroke-linejoin="round" stroke-miterlimit="10"><path d="M60.773 19.796c0-4.381-3.505-7.886-7.886-7.886H16.086c-7.26.125-13.018 4.905-13.018 12.165v5.633h57.831l-.125-9.912zm-43.436 6.857H6.227v-.9c0-6.384 4.727-10.663 11.111-10.663v11.563zm22.148 0H20.522V14.965h18.964v11.688zm18.784 0H42.842V14.965h10.296c2.879 0 5.132 2.378 5.132 5.257v6.431z" fill="none"/><path d="M15.085 38.071c2.795 0 5.2 1.64 6.326 4.006h21.02c1.126-2.366 3.532-4.006 6.326-4.006s5.2 1.64 6.326 4.006h5.816V29.708h0H3.068v5.109h1.627c1.252 0 2.253 1.001 2.253 2.253v.25c-.125 1.127-1.127 2.128-2.378 2.128H3.068v2.629h5.691c1.126-2.366 3.531-4.006 6.326-4.006z" data-fill fill="var(--maxi-light-icon-fill, var(--maxi-light-color-4))"/><g fill="none"><path d="M53.138 14.965H42.842v11.688H58.27v-6.431c0-2.879-2.253-5.257-5.132-5.257zm-32.616 0h18.964v11.688H20.522zM6.948 37.32v-.25c0-1.252-1.001-2.253-2.253-2.253H3.068c-1.29 1.544-1.29 3.088 0 4.632H4.57c1.252 0 2.253-1.001 2.378-2.128zM61.9 43.203c0-.626-.501-1.126-1.001-1.126h-5.816a6.97 6.97 0 0 1 .684 3.004h5.007.125v-.025c.563-.064 1.001-.52 1.001-1.102v-.751h0zm-40.489-1.126a6.97 6.97 0 0 1 .684 3.004h19.652a6.97 6.97 0 0 1 .684-3.004h-21.02z"/><use xlink:href="#mini-van-3_B"/><use xlink:href="#mini-van-3_C"/><path d="M3.352 42.077h-.125A1.12 1.12 0 0 0 2.1 43.203v.751a1.12 1.12 0 0 0 1.127 1.127h.125 4.723a6.97 6.97 0 0 1 .684-3.004H3.352z"/><use xlink:href="#mini-van-3_B" x="-33.672"/><use xlink:href="#mini-van-3_C" x="-33.672"/><path d="M20.522 34.115h4.79" stroke-linecap="round"/></g></g><defs ><path id="mini-van-3_B" d="M55.083 42.077c-1.126-2.366-3.532-4.006-6.326-4.006s-5.2 1.64-6.326 4.006a6.97 6.97 0 0 0-.684 3.004 7.01 7.01 0 0 0 14.02 0 6.97 6.97 0 0 0-.684-3.004zm-6.326 6.008c-1.659 0-3.004-1.345-3.004-3.004s1.345-3.004 3.004-3.004 3.004 1.345 3.004 3.004-1.345 3.004-3.004 3.004z"/><path id="mini-van-3_C" d="M48.757 42.077c-1.659 0-3.004 1.345-3.004 3.004s1.345 3.004 3.004 3.004 3.004-1.345 3.004-3.004-1.345-3.004-3.004-3.004z"/></defs></svg>',
				};
				break;
			}
			case 'list-svg': {
				response = {
					listStyleCustom:
						'<svg viewBox="0 0 36.1 36.1" class="phone-7-shape-maxi-svg" data-item="text-maxi-2se8ef1z-u__svg"><path fill="rgba(var(--maxi-light-color-7,8,18,25),1)" data-fill="" d="M18.05.189C8.185.189.189 8.186.189 18.05S8.186 35.911 18.05 35.911s17.861-7.997 17.861-17.861S27.915.189 18.05.189zm5.823 26.995c-.919.261-1.449.006-2.239-.408-1.3-.681-2.522-1.515-3.663-2.437a26.71 26.71 0 0 1-4.758-5.016c-1.497-2.049-3.266-4.587-3.367-7.211.423-1.219 1.239-2.34 2.214-3.175.703-.602 1.628-1.204 2.467-.447a11.92 11.92 0 0 1 1.724 1.928c.532.748 1.457 1.949 1.064 2.92-.211.521-.761.819-1.194 1.136-.946.692-1.921 1.218-1.14 2.49.832 1.218 1.768 2.366 2.801 3.418.631.642 1.531 1.816 2.544 1.717.945-.092 1.569-1.422 2.171-2.003 1.006-1.163 2.514.083 3.373.79.712.585 1.836 1.49 2.113 2.414.545 1.821-2.7 3.484-4.11 3.885z"></path></svg>',
				};
				break;
			}
			case 'patterns': {
				response = '';
				break;
			}
			case 'sc': {
				response = '';
				break;
			}
			default:
				break;
		}

	await page.evaluate(
		(clientId, response) => {
			wp.data
				.dispatch('core/block-editor')
				.updateBlockAttributes(clientId, response);
		},
		clientId,
		response
	);
};

export default modalMock;
