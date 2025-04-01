/**
 * Internal dependencies
 */
import actions from './actions';

const resolvers = {
	*receiveMaxiBlocksSavedStyles() {
		try {
			const styles = yield actions.getMaxiBlocksSavedStyles();
			return actions.setMaxiBlocksSavedStyles(styles);
		} catch (err) {
			console.error('Error loading saved styles:', err);
			return actions.setMaxiBlocksSavedStyles({});
		}
	},
};

export default resolvers;
