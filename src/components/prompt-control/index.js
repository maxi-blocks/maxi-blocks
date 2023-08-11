/**
 * WordPress dependencies
 */
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
import { getChatPrompt, getUniqueId, handleContent } from './utils';
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
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { camelCase, isEmpty } from 'lodash';

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
	const [prompt, setPrompt] = useState(
		'Elon Musk changed twitter.com domain to x.com'
	);
	const [results, setResults] = useState([]);
	const [selectedResult, setSelectedResult] = useState(results[0]?.id);
	const [isGenerating, setIsGenerating] = useState(false);

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
		// TODO:
		return <InfoBox />;
	}

	const getMessages = async () => {
		const systemTemplate = `You are a helpful assistant that generates text based on the given criteria and human message.\n
		Content type: {content_type}\n
		Tone: {tone}\n
		Writing style: {writing_style}\n
		Character count guideline: {character_count}\n
		Language: {language}\n
		`;
		const humanTemplate = '{text}';

		const chatPrompt = getChatPrompt(systemTemplate, humanTemplate);

		const messages = await chatPrompt.formatMessages({
			content_type: contentType,
			tone,
			writing_style: writingStyle,
			character_count: characterCount,
			language,
			text: prompt,
		});

		return messages;
	};

	const generateContent = async () => {
		switchToModifyTab();

		handleContent({
			openAIApiKey: AISettings.openaiApiKey,
			modelName: AISettings.modelName,
			additionalParams: {
				temperature: confidenceLevel / 100,
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
					isGenerating={isGenerating}
					setIsGenerating={setIsGenerating}
					selectedResult={selectedResult}
					setSelectedResult={setSelectedResult}
					onChangeContent={onChangeContent}
					setResults={setResults}
					switchToGenerateTab={switchToGenerateTab}
					onAbort={handleAbort}
					abortControllerRef={abortControllerRef}
				/>
			)}
		</div>
	);
};

export default PromptControl;
