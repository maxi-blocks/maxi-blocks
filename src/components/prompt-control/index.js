/**
 * WordPress dependencies
 */
import { resolveSelect } from '@wordpress/data';
import { useContext, useEffect, useRef, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import ContentLoader from '../content-loader';
import GenerateTab from './components/generate-tab';
import TextContext from '../../extensions/text/formats/textContext';
import ModifyTab from './components/modify-tab';
import { getChatPrompt, getUniqueId } from './utils';
import { CONTENT_TYPES, LANGUAGES, TONES, WRITING_STYLES } from './constants';

/**
 * External dependencies
 */
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { isEmpty } from 'lodash';
import InfoBox from '../info-box';

export const DEFAULT_CONFIDENCE_LEVEL = 75;

const PromptControl = ({ content, onChangeContent }) => {
	const { receiveMaxiSettings } = resolveSelect('maxiBlocks');

	const [openAIApiKey, setOpenAIApiKey] = useState(null);

	const [tab, setTab] = useState('generate'); // generate, modify

	const textContext = useContext(TextContext);
	const selectedText = content.substring(
		textContext.formatValue.start,
		textContext.formatValue.end
	);

	const [contentType, setContentType] = useState({
		label: CONTENT_TYPES[0],
		value: CONTENT_TYPES[0],
	});
	const [tone, setTone] = useState({ label: TONES[0], value: TONES[0] });
	const [writingStyle, setWritingStyle] = useState({
		label: WRITING_STYLES[0],
		value: WRITING_STYLES[0],
	});
	const [characterCount, setCharacterCount] = useState(0);
	const [confidenceLevel, setConfidenceLevel] = useState(
		DEFAULT_CONFIDENCE_LEVEL
	);
	const [language, setLanguage] = useState({
		label: LANGUAGES[0],
		value: LANGUAGES[0],
	});
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
				const openAIApiKey = maxiSettings?.openai_api_key;

				setOpenAIApiKey(openAIApiKey);
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

	if (openAIApiKey === null) {
		return <ContentLoader />;
	}

	if (!openAIApiKey) {
		// TODO:
		return <InfoBox />;
	}

	const getMessages = async () => {
		const { value: contentTypeVal } = contentType;
		const { value: toneVal } = tone;
		const { value: writingStyleVal } = writingStyle;
		const { value: languageVal } = language;

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
			content_type: contentTypeVal,
			tone: toneVal,
			writing_style: writingStyleVal,
			character_count: characterCount,
			language: languageVal,
			text: prompt,
		});

		return messages;
	};

	const generateContent = async () => {
		switchToModifyTab();

		try {
			const chat = new ChatOpenAI({
				openAIApiKey,
				modelName: 'gpt-3.5-turbo',
				temperature: confidenceLevel / 100,
				streaming: true,
			});

			const messages = await getMessages();

			const newId = getUniqueId(results);

			setResults(prevResults => {
				const newResults = [
					{
						id: newId,
						content: '',
						loading: true,
					},
					...prevResults,
				];

				return newResults;
			});

			setSelectedResult(newId);

			abortControllerRef.current = new AbortController();

			setIsGenerating(true);
			const response = await chat.call(messages, {
				signal: abortControllerRef.current.signal,
				callbacks: [
					{
						handleLLMNewToken(token) {
							setResults(prevResults => {
								const newResults = [...prevResults];
								const addedResult = newResults.find(
									result => result.id === newId
								);

								if (addedResult?.loading) {
									addedResult.content += token;
								}

								return newResults;
							});
						},
					},
				],
			});
			setIsGenerating(false);

			abortControllerRef.current = null;

			// const response = {
			// 	generations: [
			// 		[
			// 			{
			// 				text: 'Elon Musk Transforms Twitter.com into X.com, Unveiling a New Era in Online Communication',
			// 				message: {
			// 					lc: 1,
			// 					type: 'constructor',
			// 					id: ['langchain', 'schema', 'AIMessage'],
			// 					kwargs: {
			// 						content:
			// 							'Elon Musk Transforms Twitter.com into X.com, Unveiling a New Era in Online Communication',
			// 						additional_kwargs: {},
			// 					},
			// 				},
			// 			},
			// 			// {
			// 			// 	text: 'Elon Musk Announces Change in Twitter Domain to x.com, Showcasing His Vision for Innovation',
			// 			// 	message: {
			// 			// 		lc: 1,
			// 			// 		type: 'constructor',
			// 			// 		id: ['langchain', 'schema', 'AIMessage'],
			// 			// 		kwargs: {
			// 			// 			content:
			// 			// 				'Elon Musk Announces Change in Twitter Domain to x.com, Showcasing His Vision for Innovation',
			// 			// 			additional_kwargs: {},
			// 			// 		},
			// 			// 	},
			// 			// },
			// 		],
			// 	],
			// 	llmOutput: {
			// 		tokenUsage: {
			// 			completionTokens: 40,
			// 			promptTokens: 59,
			// 			totalTokens: 99,
			// 		},
			// 	},
			// };

			// eslint-disable-next-line no-console
			console.log(response);

			setResults(prevResults => {
				const newResults = [...prevResults];
				const addedResult = newResults.find(
					result => result.id === newId
				);

				if (addedResult) {
					addedResult.content = response.content;
					addedResult.loading = false;
				}

				return newResults;
			});
		} catch (error) {
			if (error.response) {
				console.error(error.response.data);
				console.error(error.response.status);
				console.error(error.response.headers);
			} else if (!error.name === 'AbortError') {
				console.error(error);
			}
		}
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
					openAIApiKey={openAIApiKey}
					setResults={setResults}
					switchToModifyTab={switchToModifyTab}
				/>
			)}
			{tab === 'modify' && (
				<ModifyTab
					results={results}
					content={content}
					openAIApiKey={openAIApiKey}
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
