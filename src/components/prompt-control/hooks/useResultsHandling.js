/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';

/**
 * External dependencies
 */
import { toNumber, isEmpty } from 'lodash';

const useResultsHandling = () => {
	const [results, setResults] = useState([]);
	const [historyStartId, setHistoryStartId] = useState(null);

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

			setHistoryStartId(
				toNumber(sessionStorage.getItem('maxi-prompt-history-start-id'))
			);
		}
	}, []);

	useEffect(() => {
		if (historyStartId) {
			sessionStorage.setItem(
				'maxi-prompt-history-start-id',
				historyStartId
			);
		}
	}, [historyStartId]);

	useEffect(() => {
		localStorage.setItem('maxi-prompt-results', JSON.stringify(results));
	}, [results]);

	return [results, setResults, historyStartId, setHistoryStartId];
};

export default useResultsHandling;
