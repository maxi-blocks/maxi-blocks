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
import SettingTabsControl from '../setting-tabs-control';
import GenerateTab from './tabs/generate-tab';
import ResultsTab from './tabs/results-tab';
import ModifyTab from './tabs/modify-tab';
import TextContext from '../../extensions/text/formats/textContext';
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
import {
	CONTEXT_OPTIONS,
	DEFAULT_CHARACTER_COUNT_GUIDELINES,
	MODIFY_OPTIONS,
} from './constants';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

const PromptControl = ({ clientId, content, onContentChange }) => {
	const AISettings = useAISettings();

	const [tab, setTab] = useState(0);

	const textContext = useContext(TextContext);
	const selectedText = content.substring(
		textContext.formatValue.start,
		textContext.formatValue.end
	);

	const { settings, updateSettings } = useSettings(selectedText);
	const {
		prompt,
		characterCount,
		temperature,
		contentType,
		tone,
		writingStyle,
		language,
	} = settings;

	const [contextOption, setContextOption] = useState(
		Object.keys(CONTEXT_OPTIONS)[0]
	);
	const [context, setContext] = useState(null);
	const [results, setResults] = useResultsHandling();
	const [selectedResultId, setSelectedResultId] = useState(results[0]?.id);

	const [isGenerating, setIsGenerating] = useState(false);

	const [modifyOption, setModifyOption] = useState(MODIFY_OPTIONS[0]);
	const [customValue, setCustomValue] = useState('');

	const abortControllerRef = useRef(null);

	useEffect(() => {
		const currentAbortController = abortControllerRef.current;

		return () => {
			currentAbortController?.abort();
		};
	}, []);

	const switchToGenerateTab = () => {
		setTab(0);
	};

	const switchToResultsTab = () => {
		setTab(1);
	};

	const switchToModifyTab = () => {
		setTab(2);
	};

	useEffect(() => {
		if (!isEmpty(selectedText)) {
			setSelectedResultId('selectedText');
			updateSettings({ characterCount: selectedText.length });
		} else {
			setSelectedResultId(null);
			updateSettings({
				characterCount: DEFAULT_CHARACTER_COUNT_GUIDELINES[contentType],
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedText]);

	useEffect(() => {
		const { tone, language } = AISettings;
		updateSettings({ tone, language });
	}, [AISettings, updateSettings]);

	useEffect(() => {
		setContext(getContext(contextOption, clientId));
	}, [contextOption, clientId]);

	if (isEmpty(AISettings)) {
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

Note: The user's input is the primary directive. Please provide a thoughtful and detailed response to the user's query or statement. Refer to the site's information only when it directly relates to the user's input.
`;

		const humanTemplate = prompt;

		return getFormattedMessages(systemTemplate, humanTemplate);
	};

	const generateContent = async () => {
		switchToResultsTab();

		handleContentGeneration({
			openAIApiKey: AISettings.openaiApiKey,
			modelName: AISettings.model,
			additionalParams: {
				temperature,
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

	return (
		<div className={className}>
			<SettingTabsControl
				tab={tab}
				items={[
					{
						label: __('Generate', 'maxi-blocks'),
						content: (
							<GenerateTab
								clientId={clientId}
								settings={settings}
								selectedText={selectedText}
								contextOption={contextOption}
								setContextOption={setContextOption}
								prompt={prompt}
								generateContent={generateContent}
								updateSettings={updateSettings}
							/>
						),
					},
					{
						label: __('Results', 'maxi-blocks'),
						content: (
							<ResultsTab
								results={results}
								content={content}
								modifyOption={modifyOption}
								formatValue={textContext.formatValue}
								selectedResultId={selectedResultId}
								isSelectedText={!!selectedText}
								isGenerating={isGenerating}
								setResults={setResults}
								setModifyOption={setModifyOption}
								setCustomValue={setCustomValue}
								setSelectedResultId={setSelectedResultId}
								onContentChange={onContentChange}
								onChangeTextFormat={
									textContext.onChangeTextFormat
								}
								onAbort={handleAbort}
								updateSettings={updateSettings}
								switchToGenerateTab={switchToGenerateTab}
								switchToModifyTab={switchToModifyTab}
							/>
						),
					},
					{
						label: __('Modify', 'maxi-blocks'),
						content: (
							<ModifyTab
								results={results}
								AISettings={AISettings}
								settings={settings}
								context={context}
								selectedText={selectedText}
								modifyOption={modifyOption}
								customValue={customValue}
								abortControllerRef={abortControllerRef}
								setModifyOption={setModifyOption}
								setCustomValue={setCustomValue}
								setIsGenerating={setIsGenerating}
								selectedResultId={selectedResultId}
								setSelectedResultId={setSelectedResultId}
								setResults={setResults}
								switchToGenerateTab={switchToGenerateTab}
								switchToResultsTab={switchToResultsTab}
							/>
						),
					},
				]}
				disablePadding
				setTab={setTab}
			/>
		</div>
	);
};

export default PromptControl;
