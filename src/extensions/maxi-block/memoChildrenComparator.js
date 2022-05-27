/**
 * External dependencies
 */
import { isEqual } from 'lodash';

// Have to confess I don't like this code, but didn't find/occurred to find a better way to do it
const memoChildrenComparator = (prevChildren, currentChildren) => {
	// https://github.com/facebook/react/issues/8669#issuecomment-531515508
	const circular = () => {
		const seen = new WeakSet();

		return (key, value) => {
			if (key.startsWith('_')) return; // Don't compare React's internal props.
			if (typeof value === 'object' && value !== null) {
				if (seen.has(value)) return;
				seen.add(value);
			}

			// eslint-disable-next-line consistent-return
			return value;
		};
	};

	const cleanPrevChildren = JSON.stringify(prevChildren, circular());
	const cleanCurrentChildren = JSON.stringify(currentChildren, circular());

	return isEqual(cleanPrevChildren, cleanCurrentChildren);
};

export default memoChildrenComparator;
