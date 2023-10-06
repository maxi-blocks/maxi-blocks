/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

const useResultsHandling = () => {
	const [results, setResults] = useState([]);

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
		}
	}, []);

	useEffect(() => {
		localStorage.setItem('maxi-prompt-results', JSON.stringify(results));
	}, [results]);

	return [results, setResults];
};

export default useResultsHandling;
