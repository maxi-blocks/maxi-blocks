/**
 * Internal dependencies
 */
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
	setResults,
	setModifyOption,
	setHistoryStartId,
	setCustomValue,
	setSelectedResultId,
	onContentChange,
	onChangeTextFormat,
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
		</div>
	);
};

export default HistoryTab;
