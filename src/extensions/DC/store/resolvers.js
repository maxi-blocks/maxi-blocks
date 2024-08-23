/**
 * Wordpress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import { getACFFieldGroups, getACFGroupFields } from '../getACFData';

const resolvers = {
	getACFGroups:
		() =>
		async ({ dispatch }) => {
			const groups = await getACFFieldGroups();
			return dispatch.setACFGroups(groups);
		},
	getACFFields:
		groupId =>
		async ({ dispatch }) => {
			const fields = await getACFGroupFields(groupId);
			dispatch.setACFFields(groupId, fields);
		},
	getCustomerData:
		customerId =>
		async ({ dispatch }) => {
			const customerData = await apiFetch({
				path: `/maxi-blocks/v1.0/wc/get-customer-data/${customerId}`,
				method: 'GET',
			}).then(res => JSON.parse(res));
			dispatch.setCustomerData(customerData, customerId);
		},
};

export default resolvers;
