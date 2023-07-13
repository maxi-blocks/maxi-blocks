/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { select } from '@wordpress/data';

const controls = {
	async RECEIVE_GENERAL_SETTINGS() {
		return apiFetch({ path: '/maxi-blocks/v1.0/settings' });
	},
	async SAVE_GENERAL_SETTING(settings) {
		await apiFetch({
			path: '/maxi-blocks/v1.0/settings/',
			method: 'POST',
			data: {
				settings,
			},
		}).catch(err => {
			console.error(
				'Error saving general maxi setting. Code error: ',
				err
			);
		});
	},
	async RECEIVE_BREAKPOINTS() {
		return apiFetch({ path: '/maxi-blocks/v1.0/breakpoints/' });
	},
	async RECEIVE_DEVICE_TYPE() {
		const originalDeviceType = select('maxiBlocks').receiveMaxiDeviceType();

		return originalDeviceType === 'Desktop'
			? 'general'
			: originalDeviceType;
	},
	async RECEIVE_UNIQUE_ID(blockName) {
		console.log('RECEIVE_UNIQUE_ID');
		console.log('blockName', blockName);
		const block = blockName?.blockName;
		const response = await apiFetch({
			path: `/maxi-blocks/v1.0/unique-id/${block}`,
		});
		console.log('response', response);
		return response;
	},
	// async SEND_UNIQUE_ID(uniqueID) {
	// 	console.log('SEND_UNIQUE_ID');
	// 	console.log('uniqueID', uniqueID);
	// 	return apiFetch({
	// 		path: '/maxi-blocks/v1.0/unique-id/',
	// 		method: 'POST',
	// 		data: {
	// 			uniqueID,
	// 		},
	// 	}).catch(err => {
	// 		console.error('Error sending unique id. Code error: ', err);
	// 	});
	// },
};

export default controls;
