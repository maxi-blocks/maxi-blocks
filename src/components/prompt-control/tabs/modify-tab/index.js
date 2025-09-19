/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import ResultCards from '@components/prompt-control/components/result-cards';
import {
	getContentAttributesSection,
	getContext,
	getContextSection,
	getFormattedMessages,
	getSiteInformation,
	handleContentGeneration,
} from '@components/prompt-control/utils';
import { MODIFICATION_MODIFICATORS } from '@components/prompt-control/constants';

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
			temperature,
			contentType,
			tone,
			writingStyle,
			language,
		} = settings || {};

		const customExplanation =
			modificationType === 'custom'
				? `, using the user-provided instruction: ${customValue}`
				: '';
		const languageExplanation =
			modificationType === 'translate'
				? ` to ${customValue} language`
				: '';

		const generatedTextExplanation = !refFromSelectedText
			? `${prompt ? `- Original Prompt: ${prompt}` : ''}
${getContentAttributesSection(contentType, tone, writingStyle, language)}
- Temperature: ${temperature}`
			: '';

		const getAdditionalInstruction = () => {
			switch (modificationType) {
				case 'rephrase':
					return ' Reword the entire text to offer a fresh perspective.';
				case 'shorten':
					return ' Drastically condense the text to make it much more succinct.';
				case 'lengthen':
					return ' Enhance the text by adding relevant details. Aim for a 10-20% increase from the original length.';
				default:
					return '';
			}
		};

		const systemTemplate = `${getSiteInformation(AISettings)}
${getContextSection(getContext(contextOption, clientId))}
${generatedTextExplanation}`;

		const humanTemplate = `Please ${modificationType}${languageExplanation} the following text${customExplanation}.${getAdditionalInstruction()} Ensure the ${
			MODIFICATION_MODIFICATORS[modificationType]
		} content maintains the original intent and context, aligns with the provided site details, and is polished and ready for the website.

Original text: ${
			selectedResultId === 'selectedText'
				? selectedText
				: results.find(result => result.id === selectedResultId).content
		}`;

		return getFormattedMessages(systemTemplate, humanTemplate);
	};

	const modifyContent = async () => {
		switchToResultsTab();

		const isSelectedText =
			selectedResultId === 'selectedText' && selectedText;

		handleContentGeneration({
			openAIApiKey: undefined, // No longer needed - using backend proxy
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
