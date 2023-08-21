/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { Button } from '../../../../components';
import HistoryButtons from '../history-buttons';
import ResultCards from '../result-cards';
import ResultsTopBar from '../results-top-bar';
import {
	getContentAttributesSection,
	getContextSection,
	getFormattedMessages,
	getQuotesGuidance,
	getSiteInformation,
	handleContentGeneration,
} from '../../utils';
import { MODIFICATION_ACTIONS, MODIFY_OPTIONS } from '../../constants';

/**
 * Styles
 */
import './editor.scss';

const ModifyTab = ({
	results,
	content,
	AISettings,
	settings,
	context,
	selectedText,
	formatValue,
	onChangeTextFormat,
	isGenerating,
	setIsGenerating,
	selectedResultId,
	setSelectedResultId,
	historyStartId,
	setHistoryStartId,
	onContentChange,
	onAbort,
	setResults,
	updateSettings,
	switchToGenerateTab,
	abortControllerRef,
}) => {
	const [modifyOption, setModifyOption] = useState(MODIFY_OPTIONS[0]);
	const [customText, setCustomText] = useState('');

	useEffect(() => {
		if (!selectedResultId) {
			setSelectedResultId(results[0]?.id);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getMessages = async data => {
		const {
			modificationType,
			customText,
			refFromSelectedText = false,
		} = data;
		const {
			prompt,
			characterCount,
			confidenceLevel,
			contentType,
			tone,
			writingStyle,
			language,
		} = settings || {};

		// Use the mapping to get the appropriate action for the given modification type
		const modificationAction =
			MODIFICATION_ACTIONS[modificationType] || 'modifying';

		const customExplanation =
			modificationType === 'custom'
				? `- **Custom Instructions**: ${customText}\n`
				: '';

		const quoteGuidance = getQuotesGuidance(contentType);

		const generatedTextExplanation = !refFromSelectedText
			? `
${prompt ? `- **Original Prompt**: ${prompt}` : ''}
${getContentAttributesSection(
	contentType,
	tone,
	writingStyle,
	language,
	characterCount
)}
- **Confidence Level**: ${confidenceLevel}%
${quoteGuidance}`
			: '';

		const systemTemplate = `
You are a helpful assistant tasked with ${modificationAction} the following ${
			refFromSelectedText
				? 'selected on website'
				: 'generated for website'
		} text. Adhere to these guidelines:
${generatedTextExplanation}
${customExplanation}${getSiteInformation(AISettings)}
${getContextSection(context)}
Your task is to maintain the original intent and context while ${modificationAction} the text. The content must align with the given criteria, and any custom instructions provided, and be suitable for immediate use on the website.`;

		const humanTemplate =
			selectedResultId === 'selectedText'
				? selectedText
				: results.find(result => result.id === selectedResultId)
						.content;

		return getFormattedMessages(systemTemplate, humanTemplate);
	};

	const modifyContent = async () => {
		const isSelectedText =
			selectedResultId === 'selectedText' && selectedText;

		handleContentGeneration({
			openAIApiKey: AISettings.openaiApiKey,
			modelName: AISettings.model,
			additionalParams: {
				topP: 1,
			},
			additionalData: {
				...(!isSelectedText && { refId: selectedResultId, settings }),
				modificationType: modifyOption,
				refFromSelectedText: isSelectedText,
				...(modifyOption === 'custom' && { customText }),
			},
			results,
			abortControllerRef,
			getMessages,
			setResults,
			setSelectedResultId,
			setIsGenerating,
		});
	};

	const cleanHistory = () => {
		setResults([]);
		setHistoryStartId(null);
		setSelectedResultId(null);
		switchToGenerateTab();
	};

	const className = 'maxi-prompt-control-modify-tab';

	return (
		<div className={className}>
			<HistoryButtons
				className={`${className}__buttons`}
				buttonClassName={`${className}__button`}
				results={results}
				setResults={setResults}
				setSelectedResultId={setSelectedResultId}
			/>
			<ResultsTopBar
				results={results}
				selectedResultId={selectedResultId}
				modifyOption={modifyOption}
				modifyContent={modifyContent}
				customText={customText}
				cleanHistory={cleanHistory}
				setModifyOption={setModifyOption}
				setCustomText={setCustomText}
				switchToGenerateTab={switchToGenerateTab}
			/>
			<ResultCards
				results={results}
				selectedText={selectedText}
				content={content}
				modifyOption={modifyOption}
				formatValue={formatValue}
				historyStartId={historyStartId}
				selectedResultId={selectedResultId}
				setResults={setResults}
				setSelectedResultId={setSelectedResultId}
				setModifyOption={setModifyOption}
				setCustomText={setCustomText}
				setHistoryStartId={setHistoryStartId}
				onContentChange={onContentChange}
				onChangeTextFormat={onChangeTextFormat}
				updateSettings={updateSettings}
				switchToGenerateTab={switchToGenerateTab}
			/>
			{isGenerating && (
				<Button className={`${className}__abort`} onClick={onAbort}>
					{__('Stop', 'maxi-blocks')}
				</Button>
			)}
		</div>
	);
};

export default ModifyTab;
