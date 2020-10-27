/**
 * WordPress dependencies
 */
const { useEffect, useRef } = wp.element;

/**
 * External dependencies
 */
import { isEqual, isObject } from 'lodash';

const useDeepEffect = (effectFunc, deps) => {
	const isFirst = useRef(true);
	const prevDeps = useRef(deps);

	useEffect(() => {
		const isSame = prevDeps.current.every((obj, index) => {
			if (isObject(obj) && isObject(deps[index]))
				return isEqual(
					JSON.stringify(obj),
					JSON.stringify(deps[index])
				);

			return isEqual(obj, deps[index]);
		});

		if (isFirst.current || !isSame) effectFunc();

		isFirst.current = false;
		prevDeps.current = deps;
	}, deps);
};

export default useDeepEffect;
