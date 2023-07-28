/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	AdvancedNumberControl,
	Button,
	ReactSelectControl,
	TextareaControl,
} from '../../..';
import { getChatPrompt, getUniqueId } from '../../utils';
import {
	CONTENT_TYPES,
	LANGUAGES,
	TONES,
	WRITING_STYLES,
} from '../../constants';

/**
 * External dependencies
 */
import { ChatOpenAI } from 'langchain/chat_models/openai';

/**
 * Styles
 */
import './editor.scss';

export const DEFAULT_CONFIDENCE_LEVEL = 75;

const GenerateTab = ({ results, openAIApiKey, setResults, setIsFetching }) => {
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
		setIsFetching(true);

		try {
			const chat = new ChatOpenAI({
				openAIApiKey,
				modelName: 'gpt-3.5-turbo',
				temperature: confidenceLevel / 100,
				n: 1,
			});

			const messages = await getMessages();
			const response = await chat.generate([messages]);

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

			setResults(
				response.generations[0].map(({ text }) => ({
					id: getUniqueId(results),
					content: text,
				}))
			);
		} catch (error) {
			if (error.response) {
				console.error(error.response.data);
				console.error(error.response.status);
				console.error(error.response.headers);
			} else {
				console.error(error);
			}
		}

		setTimeout(() => {
			setIsFetching(false);
		}, 2000);
	};

	const className = 'maxi-prompt-control-generate-tab';

	return (
		<>
			{[
				{
					label: 'Content type',
					list: CONTENT_TYPES,
					state: contentType,
					setState: setContentType,
				},
				{
					label: 'Tone',
					list: TONES,
					state: tone,
					setState: setTone,
				},
				{
					label: 'Writing style',
					list: WRITING_STYLES,
					state: writingStyle,
					setState: setWritingStyle,
				},
				{
					label: 'Language',
					list: LANGUAGES,
					state: language,
					setState: setLanguage,
				},
			].map(({ label, list, state, setState }, index) => (
				// eslint-disable-next-line react/no-array-index-key
				<Fragment key={index}>
					<label>{__(label, 'maxi-blocks')}</label>
					<ReactSelectControl
						value={state}
						defaultValue={state}
						options={list.map(option => ({
							label: __(option, 'maxi-blocks'),
							value: option,
						}))}
						onChange={obj => setState(obj)}
					/>
				</Fragment>
			))}
			<AdvancedNumberControl
				label={__('Character count guideline', 'maxi-blocks')}
				value={characterCount}
				onChangeValue={val => setCharacterCount(val)}
				onReset={() => setCharacterCount(0)}
			/>
			<AdvancedNumberControl
				label={__('Confidence level', 'maxi-blocks')}
				value={confidenceLevel}
				min={0}
				max={100}
				onChangeValue={val => setConfidenceLevel(val)}
				onReset={() => setConfidenceLevel(DEFAULT_CONFIDENCE_LEVEL)}
			/>
			<TextareaControl
				className={`${className}__textarea`}
				label={__('Type your prompt', 'maxi-blocks')}
				placeholder={__(
					'More information gives better results',
					'maxi-blocks'
				)}
				value={prompt}
				onChange={val => setPrompt(val)}
			/>
			<Button type='button' variant='secondary' onClick={generateContent}>
				{__('Write for me', 'maxi-blocks')}
			</Button>
		</>
	);
};

export default GenerateTab;
