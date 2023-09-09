/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getIsSiteEditor } from '../../fse';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Controls
 */
const controls = {
	async RECEIVE_CUSTOM_DATA() {
		const id = select('core/editor').getCurrentPostId();

		return apiFetch({ path: `/maxi-blocks/v1.0/custom-data/${id}` });
	},
	async SAVE_CUSTOM_DATA({ isUpdate, customData }) {
		const blockData = Object.entries(customData);
		const filteredCustomData = {};

		// Using Promise.all to await the entire map function
		await Promise.all(
			blockData.map(async data => {
				const uniqueID = data[0];
				const [, value] = data;
				if (!isEmpty(value)) {
					filteredCustomData[uniqueID] = {};

					if (value[uniqueID])
						filteredCustomData[uniqueID] = value[uniqueID];
					if (value.relations)
						filteredCustomData[uniqueID].relations =
							value.relations;
					if (value.dynamic_content) {
						filteredCustomData[uniqueID].dynamic_content =
							value.dynamic_content;
					}
				}
			})
		);

		if (!isEmpty(filteredCustomData)) {
			await apiFetch({
				path: '/maxi-blocks/v1.0/custom-data',
				method: 'POST',
				data: {
					data: JSON.stringify(filteredCustomData),
					update: isUpdate,
					isTemplate: getIsSiteEditor(),
				},
			}).catch(err => {
				console.error('Error saving Custom Data. Code error: ', err);
			});
		}
	},
};

export default controls;
