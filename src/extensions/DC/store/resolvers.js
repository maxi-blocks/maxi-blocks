/**
 * Wordpress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import { getACFFieldGroups, getACFGroupFields } from '@extensions/DC/getACFData';

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
};

export default resolvers;
