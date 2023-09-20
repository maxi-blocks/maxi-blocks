/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import ResultCards from '../../components/result-cards';
import {
	getContentAttributesSection,
	getContext,
	getContextSection,
	getFormattedMessages,
	getSiteInformation,
	handleContentGeneration,
} from '../../utils';
import { MODIFICATION_ACTIONS } from '../../constants';

/**
 * Styles
 */
import './editor.scss';

const ModifyTab = ({
	clientId,
	results,
	AISettings,
	settings,
	contextOption,
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
	switchToResultsTab,
}) => {
	const className = 'maxi-prompt-control-modify-tab';

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
			temperature,
			contentType,
			tone,
			writingStyle,
			language,
		} = settings || {};

		const modificationAction =
			MODIFICATION_ACTIONS[modificationType] || 'modifying';

		const customExplanation =
			modificationType === 'custom'
				? `- Custom Instructions: ${customValue}`
				: '';
		const languageExplanation =
			modificationType === 'translate'
				? `- Language to translate to: ${customValue}`
				: '';

		const generatedTextExplanation = !refFromSelectedText
			? `${prompt ? `- Original Prompt: ${prompt}` : ''}
${getContentAttributesSection(
	contentType,
	tone,
	writingStyle,
	language,
	characterCount
)}
- Temperature: ${temperature}`
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
${getContextSection(getContext(contextOption, clientId))}
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
		switchToResultsTab();

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
		<div className={className}>
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
				customValue={customValue}
				AISettingsLanguage={AISettings.language}
				setSelectedResultId={setSelectedResultId}
				setSelectedResult={setSelectedResult}
				setModifyOption={setModifyOption}
				setCustomValue={setCustomValue}
				onModifyContent={modifyContent}
				isModifyTab
			/>
		</div>
	);
};

export default ModifyTab;
