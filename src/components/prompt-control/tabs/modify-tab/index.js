/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import ResultsTopBar from '../../components/results-top-bar';
import {
	getContentAttributesSection,
	getContextSection,
	getFormattedMessages,
	getQuotesGuidance,
	getSiteInformation,
	handleContentGeneration,
} from '../../utils';
import { MODIFICATION_ACTIONS } from '../../constants';

/**
 * Styles
 */
import './editor.scss';
import ResultCards from '../../components/result-cards';

const ModifyTab = ({
	results,
	AISettings,
	settings,
	context,
	selectedText,
	modifyOption,
	customValue,
	abortControllerRef,
	setModifyOption,
	setCustomValue,
	setIsGenerating,
	selectedResultId,
	setSelectedResultId,
	setResults,
	switchToHistoryTab,
}) => {
	const className = 'maxi-prompt-control-modify-tab';
	const [classes, setClasses] = useState(className);

	const [selectedResult, setSelectedResult] = useState(null);

	useEffect(() => {
		if (selectedResultId !== 'selectedText') {
			const result = results.find(
				result => result.id === selectedResultId
			);
			setSelectedResult(result);
		}
	}, [selectedResultId, results]);

	const getMessages = async data => {
		const {
			modificationType,
			customValue,
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

		const modificationAction =
			MODIFICATION_ACTIONS[modificationType] || 'modifying';

		const customExplanation =
			modificationType === 'custom'
				? `- **Custom Instructions**: ${customValue}`
				: '';
		const languageExplanation =
			modificationType === 'translate'
				? `- **Language to translate to**: ${customValue}`
				: '';

		const quoteGuidance = getQuotesGuidance(contentType);

		const generatedTextExplanation = !refFromSelectedText
			? `${prompt ? `- **Original Prompt**: ${prompt}` : ''}
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

		const rephraseInstruction =
			modificationType === 'rephrase'
				? 'The rephrased content should be approximately the same length as the original text.'
				: '';

		const systemTemplate = `
You are a helpful assistant tasked with ${modificationAction} the following ${
			refFromSelectedText
				? 'selected on website'
				: 'generated for website'
		} text. Adhere to these guidelines:

${languageExplanation}${generatedTextExplanation}
${customExplanation}${getSiteInformation(AISettings)}
${getContextSection(context)}
${rephraseInstruction}
Your task is to maintain the original intent and context while ${modificationAction} the text. The content must align with the given criteria, and any custom instructions provided, and be suitable for immediate use on the website.`;

		const humanTemplate =
			selectedResultId === 'selectedText'
				? selectedText
				: results.find(result => result.id === selectedResultId)
						.content;

		return getFormattedMessages(systemTemplate, humanTemplate);
	};

	const modifyContent = async () => {
		switchToHistoryTab();

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
				...(['custom', 'translate'].includes(modifyOption) && {
					customValue,
				}),
			},
			results,
			abortControllerRef,
			getMessages,
			setResults,
			setSelectedResultId,
			setIsGenerating,
		});
	};

	return (
		<div className={classes}>
			<ResultsTopBar
				results={results}
				selectedResultId={selectedResultId}
				modifyOption={modifyOption}
				modifyContent={modifyContent}
				customValue={customValue}
				defaultLanguage={
					AISettings.language !== 'Language of the prompt'
						? AISettings.language
						: 'English (United Kingdom)'
				}
				setModifyOption={setModifyOption}
				setCustomValue={setCustomValue}
				setClasses={setClasses}
			/>
			<ResultCards
				results={[
					selectedText && {
						id: 'selectedText',
						content: selectedText,
						isSelectedText: true,
					},
					selectedResult,
				].filter(Boolean)}
				modifyOption={modifyOption}
				selectedResultId={selectedResultId}
				setSelectedResultId={setSelectedResultId}
				setSelectedResult={setSelectedResult}
				isModifyTab
			/>
		</div>
	);
};

export default ModifyTab;
