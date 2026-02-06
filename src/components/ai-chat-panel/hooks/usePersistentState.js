import { useCallback, useEffect, useState } from '@wordpress/element';

export const readStoredValue = (key, fallback) => {
	if (!key) return fallback;
	try {
		const raw = window?.localStorage?.getItem(key);
		if (raw === null || raw === undefined) return fallback;
		return JSON.parse(raw);
	} catch (error) {
		return fallback;
	}
};

export const writeStoredValue = (key, value) => {
	if (!key) return;
	try {
		window?.localStorage?.setItem(key, JSON.stringify(value));
	} catch (error) {
		// ignore write errors
	}
};

export const usePersistentState = (key, initialValue) => {
	const [state, setState] = useState(() => readStoredValue(key, initialValue));

	useEffect(() => {
		writeStoredValue(key, state);
	}, [key, state]);

	const setValue = useCallback(
		nextValue => {
			setState(prev =>
				typeof nextValue === 'function' ? nextValue(prev) : nextValue
			);
		},
		[setState]
	);

	return [state, setValue];
};

export default usePersistentState;

