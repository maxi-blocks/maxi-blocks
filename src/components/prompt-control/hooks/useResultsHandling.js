/**
 * WordPress dependencies
 */
import { useEffect, useRef, useState } from '@wordpress/element';

/**
 * External dependencies
 */
import { toNumber, isEmpty } from 'lodash';

const useResultsHandling = () => {
	const [results, setResults] = useState([]);
	const historyStartIdRef = useRef(null);

	useEffect(() => {
		const resultsFromLocalStorage = JSON.parse(
			localStorage.getItem('maxi-prompt-results')
		);
		if (!isEmpty(resultsFromLocalStorage)) {
			setResults(resultsFromLocalStorage);

			if (!sessionStorage.getItem('maxi-prompt-history-start-id')) {
				sessionStorage.setItem(
					'maxi-prompt-history-start-id',
					resultsFromLocalStorage[0].id
				);
			}

			historyStartIdRef.current = toNumber(
				sessionStorage.getItem('maxi-prompt-history-start-id')
			);
		}
	}, []);

	useEffect(() => {
		localStorage.setItem('maxi-prompt-results', JSON.stringify(results));
	}, [results]);

	return [results, setResults, historyStartIdRef];
};

export default useResultsHandling;
