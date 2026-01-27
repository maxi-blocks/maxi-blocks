/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Internal dependencies
 */
import ResultCard from '@components/prompt-control/components/result-card';
import Button from '@components/button';
import { LOAD_MORE_COUNT } from '@components/prompt-control/constants';

/**
 * Styles
 */
import './editor.scss';

const ResultCards = ({
	results,
	content,
	modifyOption,
	formatValue,
	selectedResultId,
	customValue,
	AISettingsLanguage,
	isSelectedText,
	setResults,
	setSelectedResultId,
	setSelectedResult,
	setModifyOption,
	setCustomValue,
	onContentChange,
	onChangeTextFormat,
	onModifyContent,
	updateSettings,
	switchToGenerateTab,
	switchToModifyTab,
	isModifyTab = false,
	onClarifySelect,
}) => {
	const [loadUntilIndex, setLoadUntilIndex] = useState(LOAD_MORE_COUNT);

	useEffect(() => {
		const selectedResultIdIndex =
			selectedResultId &&
			results.findIndex(result => result.id === selectedResultId);

		if (selectedResultIdIndex >= loadUntilIndex) {
			setLoadUntilIndex(selectedResultIdIndex + 1);
		}
	}, [loadUntilIndex, results, selectedResultId]);

	const className = 'maxi-prompt-control-results';

	if (
		isEmpty(results) &&
		(!selectedResultId ||
			(selectedResultId === 'selectedText' && !isModifyTab))
	) {
		return (
			<div className={className}>
				<h4 className={`${className}__no-results`}>
					{__(
						isModifyTab
							? 'Select text or result from history to modify'
							: 'History is empty',
						'maxi-blocks'
					)}
				</h4>
			</div>
		);
	}

	return (
		<div className={className}>
			{results.slice(0, loadUntilIndex).map((result, index) => {
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
						switchToModifyTab();

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

				const handleResultModification = () => {
					setSelectedResultId(result.id);
					switchToModifyTab();
				};

				const handleResultDeletion = () => {
					if (isModifyTab) {
						setSelectedResult(null);

						if (result.id === selectedResultId) {
							setSelectedResultId(null);
						}

						return;
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
						key={result.id}
						index={index + 1}
						result={result}
						isSelectedText={isSelectedText}
						isSelected={result.id === selectedResultId}
						modifyOption={modifyOption}
						customValue={customValue}
						AISettingsLanguage={AISettingsLanguage}
						isRefExist={refResultIndex && refResultIndex >= 0}
						isModifyTab={isModifyTab}
						setModifyOption={setModifyOption}
						setCustomValue={setCustomValue}
						onModifyContent={onModifyContent}
						onInsert={handleResultInsertion}
						onSelect={handleResultSelection}
						onUseSettings={handleResultUseSettings}
						onModify={handleResultModification}
						onDelete={handleResultDeletion}
						onClarifySelect={onClarifySelect}
					/>
				);
			})}
			{results.length > loadUntilIndex && (
				<div className={`${className}__load-more`}>
					<Button
						className='maxi-prompt-control-modify-tab__button'
						onClick={() =>
							setLoadUntilIndex(loadUntilIndex + LOAD_MORE_COUNT)
						}
					>
						{__('Load more', 'maxi-blocks')}
					</Button>
				</div>
			)}
		</div>
	);
};

export default ResultCards;
