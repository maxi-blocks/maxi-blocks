/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Button } from '../../..';
import HistoryButtons from '../../components/history-buttons';
import ResultCards from '../../components/result-cards';

/**
 * Styles
 */
import './editor.scss';

const HistoryTab = ({
	results,
	content,
	modifyOption,
	formatValue,
	historyStartId,
	selectedResultId,
	isSelectedText,
	isGenerating,
	setResults,
	setModifyOption,
	setHistoryStartId,
	setCustomValue,
	setSelectedResultId,
	onContentChange,
	onChangeTextFormat,
	onAbort,
	updateSettings,
	switchToGenerateTab,
	switchToModifyTab,
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
				setHistoryStartId={setHistoryStartId}
				switchToGenerateTab={switchToGenerateTab}
			/>
			<ResultCards
				results={results}
				content={content}
				modifyOption={modifyOption}
				formatValue={formatValue}
				historyStartId={historyStartId}
				selectedResultId={selectedResultId}
				isSelectedText={isSelectedText}
				setResults={setResults}
				setSelectedResultId={setSelectedResultId}
				setModifyOption={setModifyOption}
				setCustomValue={setCustomValue}
				setHistoryStartId={setHistoryStartId}
				onContentChange={onContentChange}
				onChangeTextFormat={onChangeTextFormat}
				updateSettings={updateSettings}
				switchToGenerateTab={switchToGenerateTab}
				switchToModifyTab={switchToModifyTab}
			/>
			{isGenerating && (
				<Button className={`${className}__abort`} onClick={onAbort}>
					{__('Stop', 'maxi-blocks')}
				</Button>
			)}
		</div>
	);
};

export default HistoryTab;
