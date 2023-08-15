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
	getFormattedMessages,
	getSiteInformation,
	getUniqueId,
	handleContent,
} from './utils';
import {
	CONTENT_TYPES,
	DEFAULT_CHARACTER_COUNT_GUIDELINES,
	LANGUAGES,
	TONES,
	WRITING_STYLES,
} from './constants';

/**
 * External dependencies
 */
import { camelCase, isEmpty, toNumber } from 'lodash';

export const DEFAULT_CONFIDENCE_LEVEL = 75;

const PromptControl = ({ content, onChangeContent }) => {
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
	const [language, setLanguage] = useState(LANGUAGES[0]);
	const [prompt, setPrompt] = useState('');
	const [results, setResults] = useState([]);
	const [selectedResult, setSelectedResult] = useState(results[0]?.id);
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
				console.log(AISettings);
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
			const newId = getUniqueId(results);

			switchToModifyTab();
			setResults([
				{
					id: newId,
					content: selectedText,
					isSelectedText: true,
					formatValue: {
						start: textContext.formatValue.start,
						end: textContext.formatValue.end,
					},
				},
				...results,
			]);
			setSelectedResult(newId);
		} else if (!isEmpty(results) && isEmpty(selectedText)) {
			setResults(results.filter(result => !result.isSelectedText));
			switchToGenerateTab();
		}
	}, [selectedText]);

	useEffect(() => {
		localStorage.setItem('maxi-prompt-results', JSON.stringify(results));
	}, [results]);

	useEffect(() => {
		setTone(AISettings.tone);
		setLanguage(AISettings.language);
	}, [AISettings]);

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
		const systemTemplate = `You are a helpful assistant generating text for a website. Your task is to create content that can be placed on the site directly, without further modification. Adherence to the following guidelines is essential:
		- Approximate length: ${characterCount} characters
		- Site Information:
		${getSiteInformation(AISettings)}
		- Content type: ${contentType}
		- Tone: ${tone}
		- Writing style: ${writingStyle}
		- Language: ${language}

		Please ensure that the text aligns with the site's goal, audience, and content guidelines, and is ready to be published on the site as-is. The length of the text is a vital aspect of this task, and it should be close to the specified character count.`;

		const humanTemplate = prompt;

		return getFormattedMessages(systemTemplate, humanTemplate);
	};

	const generateContent = async () => {
		switchToModifyTab();

		handleContent({
			openAIApiKey: AISettings.openaiApiKey,
			modelName: AISettings.modelName,
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
			setSelectedResult,
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
					prompt={prompt}
					setPrompt={setPrompt}
					generateContent={generateContent}
					showHistoryButton={!isEmpty(results)}
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
					isGenerating={isGenerating}
					setIsGenerating={setIsGenerating}
					selectedResult={selectedResult}
					historyStartIdRef={historyStartIdRef}
					setSelectedResult={setSelectedResult}
					onChangeContent={onChangeContent}
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
