/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { resolveSelect } from '@wordpress/data';
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
	CONTENT_TYPES,
	CONTEXT_OPTIONS,
	DEFAULT_CHARACTER_COUNT_GUIDELINES,
	DEFAULT_CONFIDENCE_LEVEL,
	LANGUAGES,
	TONES,
	WRITING_STYLES,
} from './constants';

/**
 * External dependencies
 */
import { camelCase, isEmpty, toNumber } from 'lodash';

const PromptControl = ({ clientId, content, onContentChange }) => {
	const { receiveMaxiSettings } = resolveSelect('maxiBlocks');

	const [AISettings, setAISettings] = useState({});

	const [tab, setTab] = useState('generate'); // generate, modify

	const textContext = useContext(TextContext);
	const selectedText = content.substring(
		textContext.formatValue.start,
		textContext.formatValue.end
	);

	const [contentType, setContentType] = useState(CONTENT_TYPES[0]);
	const [tone, setTone] = useState(TONES[0]);
	const [writingStyle, setWritingStyle] = useState(WRITING_STYLES[0]);
	const [characterCount, setCharacterCount] = useState(
		DEFAULT_CHARACTER_COUNT_GUIDELINES[CONTENT_TYPES[0]]
	);
	const [confidenceLevel, setConfidenceLevel] = useState(
		DEFAULT_CONFIDENCE_LEVEL
	);
	const [contextOption, setContextOption] = useState(
		Object.keys(CONTEXT_OPTIONS)[0]
	);
	const [context, setContext] = useState(null);
	const [language, setLanguage] = useState(LANGUAGES[0]);
	const [prompt, setPrompt] = useState('');
	const [results, setResults] = useState([]);
	const [selectedResultId, setSelectedResultId] = useState(results[0]?.id);
	const [isGenerating, setIsGenerating] = useState(false);
	const historyStartIdRef = useRef(null);

	const abortControllerRef = useRef(null);

	const switchToModifyTab = () => {
		setTab('modify');
	};

	const switchToGenerateTab = () => {
		setTab('generate');
	};

	useEffect(() => {
		const getOpenAIApiKey = async () => {
			try {
				const maxiSettings = await receiveMaxiSettings();

				const AISettings = Object.entries(
					maxiSettings?.ai_settings
				).reduce((acc, [key, value]) => {
					const newKey = camelCase(key);
					acc[newKey] = value;
					return acc;
				}, {});

				setAISettings(AISettings);
			} catch (error) {
				console.error('Maxi Blocks: Could not load settings');
			}
		};

		getOpenAIApiKey();

		const results = JSON.parse(localStorage.getItem('maxi-prompt-results'));
		if (!isEmpty(results)) {
			setResults(results);

			if (!sessionStorage.getItem('maxi-prompt-history-start-id')) {
				sessionStorage.setItem(
					'maxi-prompt-history-start-id',
					results[0].id
				);
			}

			historyStartIdRef.current = toNumber(
				sessionStorage.getItem('maxi-prompt-history-start-id')
			);
		}
	}, []);

	useEffect(() => {
		if (!isEmpty(selectedText)) {
			switchToModifyTab();
			setSelectedResultId('selectedText');
		}
	}, [selectedText]);

	useEffect(() => {
		localStorage.setItem('maxi-prompt-results', JSON.stringify(results));
	}, [results]);

	useEffect(() => {
		setTone(AISettings.tone);
		setLanguage(AISettings.language);
	}, [AISettings]);

	useEffect(() => {
		setContext(getContext(contextOption, clientId));
	}, [contextOption]);

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

	const settings = {
		prompt,
		characterCount,
		confidenceLevel,
		contentType,
		tone,
		writingStyle,
		language,
	};

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

	const setSettings = newSettings => {
		const {
			prompt,
			characterCount,
			confidenceLevel,
			contentType,
			tone,
			writingStyle,
			language,
		} = newSettings;

		setPrompt(prompt);
		setCharacterCount(characterCount);
		setConfidenceLevel(confidenceLevel);
		setContentType(contentType);
		setTone(tone);
		setWritingStyle(writingStyle);
		setLanguage(language);
	};

	const className = 'maxi-prompt-control';

	return (
		<div className={className}>
			{tab === 'generate' && (
				<GenerateTab
					clientId={clientId}
					contentType={contentType}
					setContentType={setContentType}
					tone={tone}
					setTone={setTone}
					writingStyle={writingStyle}
					setWritingStyle={setWritingStyle}
					characterCount={characterCount}
					setCharacterCount={setCharacterCount}
					language={language}
					setLanguage={setLanguage}
					confidenceLevel={confidenceLevel}
					setConfidenceLevel={setConfidenceLevel}
					contextOption={contextOption}
					setContextOption={setContextOption}
					prompt={prompt}
					setPrompt={setPrompt}
					generateContent={generateContent}
					openAIApiKey={AISettings.openaiApiKey}
					setResults={setResults}
					switchToModifyTab={switchToModifyTab}
				/>
			)}
			{tab === 'modify' && (
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
					historyStartIdRef={historyStartIdRef}
					setSelectedResultId={setSelectedResultId}
					onContentChange={onContentChange}
					setResults={setResults}
					setSettings={setSettings}
					switchToGenerateTab={switchToGenerateTab}
					onAbort={handleAbort}
					abortControllerRef={abortControllerRef}
				/>
			)}
		</div>
	);
};

export default PromptControl;
