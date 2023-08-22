/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import ResultCard from '../result-card';
import Button from '../../../button';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

const ResultCards = ({
	results,
	selectedText,
	content,
	modifyOption,
	formatValue,
	historyStartId,
	selectedResultId,
	setResults,
	setSelectedResultId,
	setModifyOption,
	setCustomValue,
	setHistoryStartId,
	onContentChange,
	onChangeTextFormat,
	updateSettings,
	switchToGenerateTab,
}) => {
	const [loadUntilIndex, setLoadUntilIndex] = useState(5);

	const className = 'maxi-prompt-control-results';

	if (isEmpty(results) && !selectedResultId) {
		return (
			<div className={className}>
				<h4 className={`${className}__no-results`}>
					{__('History is empty', 'maxi-blocks')}
				</h4>
			</div>
		);
	}

	return (
		<div className={className}>
			{selectedText && (
				<ResultCard
					result={{
						content: selectedText,
						isSelectedText: true,
					}}
					isSelected={selectedResultId === 'selectedText'}
					modifyOption={modifyOption}
					onSelect={() => setSelectedResultId('selectedText')}
				/>
			)}
			{results.map((result, index) => {
				if (index >= loadUntilIndex) {
					return null;
				}

				const refResultIndex =
					result.refId &&
					results.findIndex(
						refResult => refResult.id === result.refId
					);

				const handleResultInsertion = () => {
					const { start: selectionStart, end: selectionEnd } =
						formatValue;

					const contentBeforeSelection = content.slice(
						0,
						selectionStart
					);
					const contentAfterSelection = content.slice(selectionEnd);
					const newContent =
						contentBeforeSelection +
						result.content +
						contentAfterSelection;

					if (selectionStart !== selectionEnd) {
						onChangeTextFormat({
							...formatValue,
							end: selectionStart + result.content.length,
						});
					}

					onContentChange(newContent);
				};

				const handleResultSelection = (id = result.id) =>
					setSelectedResultId(id);

				const handleResultUseSettings = () => {
					if (result.refId) {
						setModifyOption(result.modificationType);
						setCustomValue(result.customValue);

						if (refResultIndex >= loadUntilIndex) {
							setLoadUntilIndex(refResultIndex + 1);
						}

						setSelectedResultId(result.refId);

						return;
					}

					if (result.settings) {
						updateSettings(result.settings);
						switchToGenerateTab();
					}
				};

				const handleResultDeletion = () => {
					if (historyStartId === result.id) {
						setHistoryStartId(historyStartId - 1);
					}

					setResults(prevResults => {
						const newResults = [...prevResults].filter(
							deletedResult => deletedResult.id !== result.id
						);

						if (isEmpty(newResults)) {
							switchToGenerateTab();
						}

						return newResults;
					});

					if (selectedResultId === result.id) {
						setSelectedResultId(null);
					}
				};

				return (
					<ResultCard
						// eslint-disable-next-line react/no-array-index-key
						key={index}
						index={index + 1}
						result={result}
						isFromPreviousSession={result.id <= historyStartId}
						isSelected={result.id === selectedResultId}
						isSelectedText={!!selectedText}
						modifyOption={modifyOption}
						isRefExist={refResultIndex && refResultIndex >= 0}
						onInsert={handleResultInsertion}
						onSelect={handleResultSelection}
						onUseSettings={handleResultUseSettings}
						onDelete={handleResultDeletion}
					/>
				);
			})}
			{results.length > loadUntilIndex && (
				<div className={`${className}__load-more`}>
					<Button
						onClick={() => setLoadUntilIndex(loadUntilIndex + 5)}
					>
						{__('Load more', 'maxi-blocks')}
					</Button>
				</div>
			)}
		</div>
	);
};

export default ResultCards;
