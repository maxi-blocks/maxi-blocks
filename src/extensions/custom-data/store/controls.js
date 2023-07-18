/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getIsSiteEditor } from '../../fse';
import entityRecordsWrapper from '../../styles/entityRecordsWrapper';
import getFilteredData from '../../styles/getFilteredData';

/**
 * Controls
 */
const controls = {
	async RECEIVE_CUSTOM_DATA() {
		const id = select('core/editor').getCurrentPostId();

		return apiFetch({ path: `/maxi-blocks/v1.0/custom-data/${id}` });
	},
	async SAVE_CUSTOM_DATA({ isUpdate, customData }) {
		console.log('SAVE_CUSTOM_DATA');
		console.log('isUpdate', isUpdate);
		console.log('customData', customData);
		entityRecordsWrapper(async ({ key: id, name }) => {
			const filteredCustomData = getFilteredData(customData, {
				id,
				name,
			});

			await apiFetch({
				path: '/maxi-blocks/v1.0/custom-data',
				method: 'POST',
				data: {
					id,
					data: JSON.stringify(filteredCustomData),
					update: isUpdate,
					isTemplate: getIsSiteEditor(),
				},
			}).catch(err => {
				console.error('Error saving Custom Data. Code error: ', err);
			});
		});
	},
};

export default controls;
