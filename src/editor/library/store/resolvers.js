/**
 * Internal dependencies
 */
import actions from './actions';

/**
 * Resolvers
 */
const resolvers = {
	/**
	 * Returns an object with simple schema of the type of content
	 * requested to the Cloud Library (simple means no content field)
	 *
	 * @param {string} type type of object seeked
	 */
	*receiveMaxiCloudLibrary(type) {
		const maxiCloudLibrary = yield actions.receiveMaxiCloudLibrary(type);
		return actions.sendMaxiCloudLibrary(maxiCloudLibrary, type);
	},
};

export default resolvers;
