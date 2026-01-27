/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Button } from '@components';
import HistoryButtons from '@components/prompt-control/components/history-buttons';
import ResultCards from '@components/prompt-control/components/result-cards';

/**
 * Styles
 */
import './editor.scss';

const ResultsTab = ({
	results,
	content,
	modifyOption,
	formatValue,
	selectedResultId,
	isSelectedText,
	isGenerating,
	setResults,
	setModifyOption,
	setCustomValue,
	setSelectedResultId,
	onContentChange,
	onChangeTextFormat,
	onAbort,
	updateSettings,
	switchToGenerateTab,

	switchToModifyTab,
	onClarifySelect,
}) => {
	const className = 'maxi-prompt-control-history-tab';

	return (
		<div className={className}>
			<HistoryButtons
				className='maxi-prompt-control__buttons'
				buttonClassName='maxi-prompt-control__button'
				results={results}
				setResults={setResults}
				setSelectedResultId={setSelectedResultId}
				switchToGenerateTab={switchToGenerateTab}
			/>
			<ResultCards
				results={results}
				content={content}
				modifyOption={modifyOption}
				formatValue={formatValue}
				selectedResultId={selectedResultId}
				isSelectedText={isSelectedText}
				setResults={setResults}
				setSelectedResultId={setSelectedResultId}
				setModifyOption={setModifyOption}
				setCustomValue={setCustomValue}
				onContentChange={onContentChange}
				onChangeTextFormat={onChangeTextFormat}
				updateSettings={updateSettings}
				switchToGenerateTab={switchToGenerateTab}

				switchToModifyTab={switchToModifyTab}
				onClarifySelect={onClarifySelect}
			/>
			{isGenerating && (
				<Button className={`${className}__abort`} onClick={onAbort}>
					{__('Stop', 'maxi-blocks')}
				</Button>
			)}
		</div>
	);
};

export default ResultsTab;
