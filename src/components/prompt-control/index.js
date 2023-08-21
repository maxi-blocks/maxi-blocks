/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext, useEffect, useRef, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import ContentLoader from '../content-loader';
import InfoBox from '../info-box';
import GenerateTab from './components/generate-tab';
import TextContext from '../../extensions/text/formats/textContext';
import ModifyTab from './components/modify-tab';
import { getMaxiAdminSettingsUrl } from '../../blocks/map-maxi/utils';
import { useAISettings, useResultsHandling, useSettings } from './hooks';
import {
	getContentAttributesSection,
	getContext,
	getContextSection,
	getExamplesSection,
	getFormattedMessages,
	getQuotesGuidance,
	getSiteInformation,
	handleContentGeneration,
} from './utils';
import { CONTEXT_OPTIONS } from './constants';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

const PromptControl = ({ clientId, content, onContentChange }) => {
	const AISettings = useAISettings();

	const [tab, setTab] = useState('generate'); // generate, modify

	const textContext = useContext(TextContext);
	const selectedText = content.substring(
		textContext.formatValue.start,
		textContext.formatValue.end
	);

	const { settings, updateSettings } = useSettings();
	const {
		prompt,
		characterCount,
		confidenceLevel,
		contentType,
		tone,
		writingStyle,
		language,
	} = settings;

	const [contextOption, setContextOption] = useState(
		Object.keys(CONTEXT_OPTIONS)[0]
	);
	const [context, setContext] = useState(null);
	const [results, setResults, historyStartId, setHistoryStartId] =
		useResultsHandling();
	const [selectedResultId, setSelectedResultId] = useState(results[0]?.id);
	const [isGenerating, setIsGenerating] = useState(false);

	const abortControllerRef = useRef(null);

	const switchToModifyTab = () => {
		setTab('modify');
	};

	const switchToGenerateTab = () => {
		setTab('generate');
	};

	useEffect(() => {
		if (!isEmpty(selectedText)) {
			switchToModifyTab();
			setSelectedResultId('selectedText');
		}
	}, [selectedText]);

	useEffect(() => {
		const { tone, language } = AISettings;
		updateSettings({ tone, language });
	}, [AISettings]);

	useEffect(() => {
		setContext(getContext(contextOption, clientId));
	}, [contextOption, clientId]);

	if (AISettings.openaiApiKey === null) {
		return <ContentLoader />;
	}

	if (!AISettings.openaiApiKey) {
		return (
			<InfoBox
				message={__(
					'You have not set your OpenAI API key, please navigate to the Maxi AI Options and set it',
					'maxi-blocks'
				)}
				links={[
					{
						title: __(
							'Integrations > OpenAI API key',
							'maxi-blocks'
						),
						href: getMaxiAdminSettingsUrl('maxi_blocks_maxi_ai'),
					},
				]}
			/>
		);
	}

	const getMessages = async () => {
		const quoteGuidance = getQuotesGuidance(contentType);
		const contextSection = getContextSection(context);

		const systemTemplate = `
You are a helpful assistant generating content for a website. Adhere to these guidelines:

${quoteGuidance}
${getSiteInformation(AISettings)}
${getContentAttributesSection(
	contentType,
	tone,
	writingStyle,
	language,
	characterCount
)}
${contextSection}
${getExamplesSection(contentType)}

Ensure that the content aligns with the site's audience and guidelines, and is suitable for immediate use on the website, formatted for direct pasting.
`;

		const humanTemplate = prompt;

		return getFormattedMessages(systemTemplate, humanTemplate);
	};

	const generateContent = async () => {
		switchToModifyTab();

		handleContentGeneration({
			openAIApiKey: AISettings.openaiApiKey,
			modelName: AISettings.model,
			additionalParams: {
				temperature: confidenceLevel / 100,
			},
			additionalData: {
				settings,
			},
			results,
			abortControllerRef,
			getMessages,
			setResults,
			setSelectedResultId,
			setIsGenerating,
		});
	};

	const handleAbort = () => {
		abortControllerRef.current?.abort();
		setIsGenerating(false);
	};

	const className = 'maxi-prompt-control';

	const renderTabContent = {
		generate: (
			<GenerateTab
				clientId={clientId}
				settings={settings}
				contextOption={contextOption}
				setContextOption={setContextOption}
				prompt={prompt}
				generateContent={generateContent}
				updateSettings={updateSettings}
				switchToModifyTab={switchToModifyTab}
			/>
		),
		modify: (
			<ModifyTab
				results={results}
				content={content}
				AISettings={AISettings}
				settings={settings}
				context={context}
				selectedText={selectedText}
				formatValue={textContext.formatValue}
				onChangeTextFormat={textContext.onChangeTextFormat}
				isGenerating={isGenerating}
				setIsGenerating={setIsGenerating}
				selectedResultId={selectedResultId}
				setSelectedResultId={setSelectedResultId}
				historyStartId={historyStartId}
				setHistoryStartId={setHistoryStartId}
				onContentChange={onContentChange}
				setResults={setResults}
				updateSettings={updateSettings}
				switchToGenerateTab={switchToGenerateTab}
				onAbort={handleAbort}
				abortControllerRef={abortControllerRef}
			/>
		),
	};

	return <div className={className}>{renderTabContent[tab]}</div>;
};

export default PromptControl;
