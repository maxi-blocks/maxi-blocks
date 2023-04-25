/**
 * Internal dependencies
 */
import getIBOptionsFromBlockData from './getIBOptionsFromBlockData';

// eslint-disable-next-line import/prefer-default-export
export const getSelectedIBSettings = (clientId, value) =>
	Object.values(getIBOptionsFromBlockData(clientId))
		.flat()
		.find(option => option.sid === value);
