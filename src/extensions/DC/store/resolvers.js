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
};

export default resolvers;
