// https://usehooks-ts.com/react-hook/use-interval

import { useIsomorphicLayoutEffect } from '@wordpress/compose';
import { useRef, useEffect } from '@wordpress/element';

const useInterval = (callback, delay) => {
	const savedCallback = useRef(callback);

	// Remember the latest callback if it changes.
	useIsomorphicLayoutEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	// Set up the interval.
	useEffect(() => {
		// Don't schedule if no delay is specified.
		// Note: 0 is a valid value for delay.
		if (delay || delay === 0) {
			const id = setInterval(() => savedCallback.current(), delay);

			// eslint-disable-next-line consistent-return
			return () => clearInterval(id);
		}
		return () => {};
	}, [delay]);
};

export default useInterval;
